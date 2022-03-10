// keep track of which popup, if any, is active on
// any given map.
const activePopup = new Map()

// taken more-or-less from the google maps api documention
// https://developers.google.com/maps/documentation/javascript/examples/overlay-popup
// in addition, we provide "open" and "close" methods to mimic Info Windows, and
// an event "firstDrawAfterOpen" that fires the first time the draw method is called after opening, so
// that clients can implement autopan if they want
export const Popup = function (styles) {
  this.autoclose = true

  const content = document.createElement('div')
  content.classList.add(styles.popupBubble)

  // This zero-height div is positioned at the bottom of the bubble.
  this.bubbleAnchor = document.createElement('div')
  this.bubbleAnchor.classList.add(styles.popupBubbleAnchor)
  this.bubbleAnchor.appendChild(content)

  // This zero-height div is positioned at the bottom of the tip.
  this.containerDiv = document.createElement('div')
  this.containerDiv.classList.add(styles.popupContainer)
  this.containerDiv.appendChild(this.bubbleAnchor)

  // Optionally stop clicks, etc., from bubbling up to the map.
  google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.containerDiv)

  // where we tell our client they can mount their nodes
  this.hostContainer = content
  this.styles = styles
}

Popup.prototype = Object.create(google.maps.OverlayView.prototype)
Popup.prototype.parent = google.maps.OverlayView.prototype

// symbolic name for this string used for the event
Popup.prototype.FIRST_DRAW_AFTER_OPEN_EVENT = 'firstDrawAfterOpenEvent'
Popup.prototype.REMOVE_EVENT = 'removeEvent'

// Called when the popup is added to the map.
Popup.prototype.onAdd = function () {
  this.getPanes().floatPane.appendChild(this.containerDiv)
}

// Called when the popup is removed from the map.
Popup.prototype.onRemove = function () {
  if (this.containerDiv.parentElement) {
    this.containerDiv.parentElement.removeChild(this.containerDiv)
  }
  google.maps.event.trigger(this, this.REMOVE_EVENT)
}

Popup.prototype.getPosition = function () {
  if (this.marker) return this.marker.getPosition()
  if (this.position) return this.position
  if (this.popupMap) return this.popupMap.getCenter()
  // hmmm.  where are we?
}

Popup.prototype.setPosition = function (position, invertedPosition = position) {
  this.position = position
  this.invertedPosition = invertedPosition
  if (this.invertedPosition) {
    this.containerDiv.classList.add(this.styles.positioned)
  }
}

Popup.prototype.setMarker = function (marker) {
  this.marker = marker
  this.containerDiv.classList.remove(this.styles.positioned)
}

Popup.prototype.setMap = function (map) {
  this.popupMap = map
}

Popup.prototype.setOffset = function (offset) {
  this.offset = offset
}

Popup.prototype.setAutoClose = function (autoclose) {
  if (this.autoclose !== autoclose) {
    if (autoclose) {
      // Add autoclose listener if map set.
      if (this.popupMap) {
        this.mapClickListenerId = this.popupMap.addListener('click', () => this.close())
      }
    } else {
      if (this.mapClickListenerId) {
        google.maps.event.removeListener(this.mapClickListenerId)
        this.mapClickListenerId = undefined
      }
    }
    this.autoclose = autoclose
  }
}

// Called each frame when the popup needs to draw itself.
Popup.prototype.draw = function () {
  const position = this.getPosition()
  let divPosition = this.getProjection().fromLatLngToDivPixel(position)
  const containerPosition = this.getProjection().fromLatLngToContainerPixel(position)
  const rect = this.hostContainer.getBoundingClientRect()
  this.popupHeight = rect.height

  if (containerPosition.y - this.popupHeight <= 0) {
    if (this.invertedPosition) {
      divPosition = this.getProjection().fromLatLngToDivPixel(this.invertedPosition)
    }
    if (!this.inverted) {
      this.inverted = true
      this.containerDiv.classList.add(this.styles.inverted)
    }
  } else if (this.inverted) {
    this.inverted = false
    this.containerDiv.classList.remove(this.styles.inverted)
  }

  // Hide the popup when it is far out of view.
  const display = Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ? 'block' : 'none'

  if (display === 'block') {
    // offset to the marker icon, as approriate
    if (this.offset) {
      divPosition.x += this.offset.x
      divPosition.y += this.offset.y
    }
    this.containerDiv.style.left = `${divPosition.x}px`
    this.containerDiv.style.top = `${divPosition.y}px`
  }
  if (this.containerDiv.style.display !== display) {
    this.containerDiv.style.display = display
  }
  if (this.firstDrawAfterOpen && divPosition) {
    this.firstDrawAfterOpen = false
    // help out our client autopan by telling them what latlng corresponds to the
    // center of the popup we just placed.

    // note: this is *very* dependent on the drawing conventions of the popup
    // and the placement of bubble wrt the containerDiv
    const x = divPosition.x + rect.width / 2.0 // we're positioned up and to the right
    const y = this.inverted ? divPosition.y + rect.height / 2.0 : divPosition.y - rect.height / 2.0
    const center = { x, y }
    const centerLatLng = this.getProjection().fromDivPixelToLatLng(center)

    google.maps.event.trigger(this, this.FIRST_DRAW_AFTER_OPEN_EVENT, centerLatLng)
  }
}

// we want this to act more like an info window...
Popup.prototype.open = function () {
  const map = this.popupMap
  if (!map) return

  // make sure we close any other open popup on this map
  // and remember that we're now the active popup.
  const existingPopup = activePopup.get(map)
  if (existingPopup) {
    existingPopup.close()
  }
  activePopup.set(map, this)

  // we also want to know if the map has been clicked so we can
  // clear any open popups.
  if (this.autoclose) {
    this.mapClickListenerId = map.addListener('click', () => this.close())
  }

  // the next time the popup draws will be the first time after open()
  // and let it draw
  this.firstDrawAfterOpen = true
  this.parent.setMap.call(this, map)
  this.isOpen = true
}

Popup.prototype.close = function () {
  const map = this.getMap()
  if (map && activePopup.get(map) === this) {
    activePopup.delete(map)
  }
  if (this.mapClickListenerId) google.maps.event.removeListener(this.mapClickListenerId)
  this.mapClickListenerId = undefined

  // stop drawing
  this.firstDrawAfterOpen = false
  this.parent.setMap.call(this, null)
  this.isOpen = false
}

// when you actually want to render your React components, you're
// going to want to put them in *this* container
Popup.prototype.getContainer = function () {
  return this.hostContainer
}
