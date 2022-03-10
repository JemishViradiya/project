export const mapConfig = Object.freeze({
  defaultViewport: { center: { lat: 0, lng: 0 }, zoom: 1 },
  controlOptions: {
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
  },
  restriction: {
    latLngBounds: {
      // Google Maps does not have imagery above or below 85 degrees, so we don't
      // let the user see them either. That means that events in those regions
      // will not be visible on the map.
      north: 85,
      south: -85,
      west: -180,
      east: 180,
    },
    strictBounds: true,
  },
  zoom: {
    minAutoZoom: 2,
    maxAutoZoom: 18,
    boundsPadding: 0.5,
    defaultMaxZoom: 21,
    defaultMinZoom: 1,
  },
})
export default mapConfig
