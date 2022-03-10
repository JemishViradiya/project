import geokdbush from 'geokdbush'
import KDBush from 'kdbush'
import cloneDeep from 'lodash-es/cloneDeep'

import { getMetersPerPixel } from '../googleMaps/util'

const RAD2DEG = 180 / Math.PI
const DEG2RAD = Math.PI / 180
// using "Map" as an identifier later...
const CollectionMap = window.Map

// the elasticsearch clusters are fine and everything, but sometimes
// too close together -- merge clusters that are too close for the zoomlevel

const getLon = d => d.lon
const getLat = d => d.lat

// clusters closer than ...
const tooClosePixels = 50 // pixels should merge

// FIXME this is wrong -- for longitude across dateline
const mergeBounds = (a, b) => {
  const { top_left: aTL, bottom_right: aBR } = a
  const { top_left: bTL, bottom_right: bBR } = b

  return {
    top_left: {
      lat: Math.min(aTL.lat, bTL.lat),
      lon: Math.min(aTL.lon, bTL.lon),
    },
    bottom_right: {
      lat: Math.max(aBR.lat, bBR.lat),
      lon: Math.max(aBR.lon, bBR.lon),
    },
  }
}

const mergeInto = (to, from) => {
  to.merges = to.merges || [{ lat: to.lat, lon: to.lon, count: to.count }]
  to.merges.push({ lat: from.lat, lon: from.lon, count: from.count })
  // counts...
  to.critical += from.critical
  to.medium += from.medium
  to.high += from.high
  to.low += from.low
  to.count += from.count
  // bounds...
  to.bounds = mergeBounds(to.bounds, from.bounds)
  // don't touch geohash, representative
  return to
}

const moveClusters = cluster => {
  if (!cluster.merges) {
    return cluster
  }
  // Weighted averages are complicated on a sphere, so we convert the points
  // to 3D (x,y,z), average there, and then convert back to lat/lon
  let weightedX = 0
  let weightedY = 0
  let weightedZ = 0
  let totalCount = 0
  cluster.merges.forEach(({ lat, lon, count }) => {
    const cosLat = Math.cos(lat * DEG2RAD)
    weightedX += count * cosLat * Math.cos(lon * DEG2RAD)
    weightedY += count * cosLat * Math.sin(lon * DEG2RAD)
    weightedZ += count * Math.sin(lat * DEG2RAD)
    totalCount += count
  })
  cluster.merges = undefined
  weightedX /= totalCount
  weightedY /= totalCount
  weightedZ /= totalCount
  if (totalCount > 0) {
    cluster.lat = RAD2DEG * Math.atan2(weightedZ, Math.sqrt(weightedX * weightedX + weightedY * weightedY))
    cluster.lon = RAD2DEG * Math.atan2(weightedY, weightedX)
  }
  return cluster
}

const mergeClusters = (data, zoomLevel, minPixelDistance = tooClosePixels) => {
  const newData = [...data]
  // sanity check - total events before and after merging should be the same
  const preMergeTotal = newData.reduce((acc, d) => acc + d.count, 0)

  // first, sort clusters by size (geohash is another option)
  newData.sort((a, b) => (a.count > b.count ? -1 : 1))
  // newData.sort((a, b) => (a.geohash < b.geohash ? -1 : 1))

  // add all the data to a hash, for quick access
  const keyValuePairs = newData.map(d => [d.geohash, cloneDeep(d)])
  const dataMap = new CollectionMap(keyValuePairs)

  // add data to the index
  const tree = new KDBush(newData, getLon, getLat, 8 /* 64 */)

  // look at clusters, one by one and see if there are neighbouring clusters
  // that are too close.  if so, merge them.
  //
  // issues:
  //  - merging two clusters using a weighted average of the centres of the
  //    two clusters as the new lat/lon.  That means that there are
  //    new potential close neighbours -- but we don't bother to look again
  dataMap.forEach(d => {
    const tooCloseToD = (minPixelDistance * getMetersPerPixel(d.lat, zoomLevel)) / 1000
    const nearby = geokdbush.around(tree, d.lon, d.lat, 25)
    for (const n of nearby) {
      // If we already merged n, then ignore it.
      if (!dataMap.has(n.geohash)) continue
      // Don't merge ourselves
      if (n.geohash === d.geohash) continue
      // If n has already received other merged points, ignore it.
      if (dataMap.get(n.geohash).count !== n.count) continue

      // Figure out the distances using both latitude values and take the most conservative comparison.
      const tooCloseToN = (minPixelDistance * getMetersPerPixel(n.lat, zoomLevel)) / 1000
      const distanceFromD = geokdbush.distance(d.lon, d.lat, n.lon, n.lat)
      const distanceFromN = geokdbush.distance(n.lon, n.lat, d.lon, d.lat)
      const distance = Math.min(distanceFromD, distanceFromN)
      const tooClose = Math.max(tooCloseToD, tooCloseToN)
      if (distance < tooClose) {
        mergeInto(d, n)
        if (!dataMap.delete(n.geohash)) {
          throw new Error('cluster merge problem: tried to remove cluster that was already removed')
        }
      } else {
        // Since nearby is sorted by distance, once we get too far, we are done.
        break
      }
    }
  })

  // all remaining in dataHash are the merged clusters
  const result = Array.from(dataMap.values()).map(moveClusters)
  const postMergeTotal = result.reduce((acc, d) => acc + d.count, 0)

  if (preMergeTotal !== postMergeTotal) {
    throw new Error(
      `cluster merge problem: count of events pre/post merge don't match (pre: ${preMergeTotal}, post: ${postMergeTotal})`,
    )
  }
  return result
}

export default mergeClusters
