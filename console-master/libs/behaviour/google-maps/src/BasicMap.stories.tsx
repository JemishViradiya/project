import React from 'react'

import { makeStyles } from '@material-ui/core'

import { BasicMap as BasicMapComponent } from '@ues-behaviour/google-maps'

import markdown from './BasicMap.md'

const useStyles = makeStyles({
  container: {
    height: '400px',
    width: '500px',
  },
})

export const BasicMap = ({ mapTypeControls, zoomControls, viewport, minZoom, maxZoom, gestureHandling }) => {
  const classNames = useStyles()
  return (
    <BasicMapComponent
      className={classNames.container}
      mapTypeControls={mapTypeControls}
      zoomControls={zoomControls}
      viewport={viewport}
      minZoom={minZoom}
      maxZoom={maxZoom}
      gestureHandling={gestureHandling}
    />
  )
}

BasicMap.args = {
  mapTypeControls: true,
  zoomControls: true,
  viewport: { center: { lat: 0, lng: 0 }, zoom: 1 },
  minZoom: 1,
  maxZoom: 21,
}

BasicMap.argTypes = {
  mapTypeControls: {
    control: {
      type: 'boolean',
    },
  },
  zoomControls: {
    control: {
      type: 'boolean',
    },
  },
  viewport: {
    control: {
      type: 'object',
    },
  },
  minZoom: {
    control: {
      type: 'number',
    },
  },
  maxZoom: {
    control: {
      type: 'number',
    },
  },
  gestureHandling: {
    control: {
      type: 'inline-radio',
      options: ['auto', 'cooperative', 'greedy', 'none'],
    },
    defaultValue: {
      summary: 'auto',
    },
    description:
      '"auto" may not work correctly in the storybook, see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.gestureHandling',
  },
}

export default {
  title: 'Maps/Basic Map',
  parameters: {
    notes: markdown,
  },
}
