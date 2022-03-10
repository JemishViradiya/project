import type { UesTheme } from '@ues/assets'
// declare module '@material-ui/core' {
//   interface Theme {
//     MuiResponsiveDrawer: any
//   }
// }

export type ResponsiveDrawerTheme = UesTheme & {
  palette: {
    nav: {
      itemBackground: string
      defaultIcon: string
    }
  }
  props: {
    colors: {
      nav: {
        background: string
        itemHover: string
      }
    }
  }
  zIndex: {
    floatingMenuButton: number
  }
  overrides: {
    MuiResponsiveDrawer: {
      full: {
        width: number
      }
      mini: {
        width: number
      }
      paper: {
        color: string
        backgroundColor: string
      }
      zIndex: number
    }
    MuiResponsiveDrawerButton: {
      root: {
        width: number
      }
    }
  }
}
