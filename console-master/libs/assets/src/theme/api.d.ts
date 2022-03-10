import type { Theme } from '@material-ui/core'
import type * as Colors from '@material-ui/core/colors'

import type { ResponsiveThemeOptions } from '../dsm'

type CustomColor = {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

export type UesColors = typeof Colors & {
  primary: CustomColor
  secondary: CustomColor
  cyGreen: CustomColor
  cyBlueGreen: CustomColor
  bbBlue: CustomColor
  bbGrey: CustomColor
}

type ChipAlert = {
  critical: string
  high: string
  medium: string
  low: string
  info: string
  secure: string
}

type Map = {
  geozone: {
    shape: {
      fillColor: string
      fillOpacity: number
      strokeColor: string
      strokeWeight: number
    }
  }
}

export type UesTheme = Theme & {
  name: string
  palette: UesColors & {
    background: {
      body: string
    }
    type: 'light' | 'dark'
    motion: undefined | 'reduce'
    pointer: 'fine' | 'coarse'
    chipAlert: ChipAlert
    map: Map
  }
  props: {
    colors: UesColors
  }
}

export function useResponsiveMuiTheme(themeOverrides?: ResponsiveThemeOptions): Theme
