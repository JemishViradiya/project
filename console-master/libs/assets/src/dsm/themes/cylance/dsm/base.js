/* eslint-disable sonarjs/no-duplicate-string */
import { grey } from '@material-ui/core/colors'

import bbBlue from '../colors/bbBlue'

const base = {
  contrastThreshold: 3,
  tonalOffset: 0.25,
  common: { white: '#fff', black: '#000', offwhite: 'rgba(255, 255, 255, 0.84)' },
  shadows: {
    umbraOpacity: 0.2,
    penumbraOpacity: 0.14,
    ambientShadowOpacity: 0.12,
  },
  grey,
}

const common = {
  map: {
    geozone: {
      shape: {
        fillColor: bbBlue[800],
        fillOpacity: 0.2,
        strokeColor: bbBlue[800],
        strokeWeight: 2,
      },
    },
  },
}

export { base, common }
