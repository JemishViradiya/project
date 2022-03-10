import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import SplitterLayout from 'react-splitter-layout'

import useRafDebounceCallback from '../components/hooks/useRafDebounceCallback'
import styles from './MapSplitter.module.less'
import { Provider as MapSplitterProvider } from './MapSplitterContext'

const noop = () => null

const MapSplitter = memo(
  ({ className, showMap: showMapProp, primaryMinSize = 400, secondaryMinSize = 400, children, ...props }) => {
    const [showMap, setShowMap] = useState(!!showMapProp)
    const onShowMap = useCallback(() => setShowMap(true), [setShowMap])
    const onHideMap = useCallback(() => setShowMap(false), [setShowMap])

    const [listRender = noop, mapRender = noop] = children
    const listChild = useMemo(
      () =>
        listRender({
          showMap: showMap,
          onShowMap: onShowMap,
          onHideMap: onHideMap,
        }),
      [listRender, showMap, onShowMap, onHideMap],
    )

    let mapPane = null
    if (showMap && mapRender) {
      mapPane = mapRender()
    }

    const sizeRef = useRef()
    if (!sizeRef.current) {
      sizeRef.current = {
        size: undefined,
        api: {
          getWidth: () => sizeRef.current.size,
        },
      }
    }
    const onSecondaryPaneSizeChange = useRafDebounceCallback(size => {
      sizeRef.current.size = size
    }, [])

    return (
      <MapSplitterProvider value={sizeRef.current.api}>
        <SplitterLayout
          primaryMinSize={primaryMinSize}
          secondaryMinSize={secondaryMinSize}
          customClassName={cn(styles.splitter, className)}
          onSecondaryPaneSizeChange={onSecondaryPaneSizeChange}
        >
          <div id="map-splitter-list" className={styles.listPane}>
            {listChild}
          </div>
          {mapPane}
        </SplitterLayout>
      </MapSplitterProvider>
    )
  },
)

export default MapSplitter

MapSplitter.displayName = 'MapSplitter'

MapSplitter.propTypes = {
  children: PropTypes.arrayOf(PropTypes.func).isRequired,
  primaryMinSize: PropTypes.number,
  secondaryMinSize: PropTypes.number,
  showMap: PropTypes.any,
  className: PropTypes.string,
}
