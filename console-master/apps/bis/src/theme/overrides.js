// eslint-disable-next-line @typescript-eslint/no-var-requires
const { useStandalone: isStandalone } = require('@ues-bis/shared')

const standalone = isStandalone()

module.exports = {
  cssVariables: true,
  custom: {
    bisMap: {
      controlSize: 28,
      fullscreenControl: false,
      icon: {
        width: 36,
        height: 36,
        strokeWidth: 2,
        user: {
          width: 26,
          height: 42,
        },
        highlight: {
          width: 50,
          height: 50,
        },
      },
      geozone: {
        strokeWeight: 1,
      },
      bounds: {
        fillOpacity: 0.2,
        strokeOpacity: 0.2,
        strokeWeight: 2,
      },
    },
    bisRiskChart: {
      chart: {
        maxAxisY: 110,
        marginLeft: 40,
        marginRight: 40,
        marginBottom: 50,
      },
      grid: {
        strokeWidth: 1,
        strokeDash: '2, 2',
      },
      hint: {
        offsetY: 20,
      },
      mark: {
        strokeWidth: 4,
        circleOffsetY: -10,
        circleSize: 6,
        labelOffsetY: 26,
      },
      tick: {
        defaultMax: 5,
        minWidth: 45,
      },
    },
    bisOffsets: {
      users: {
        header: '200px',
      },
      events: {
        header: '150px',
      },
      table: {
        header: {
          more: 35,
          moreLg: 40,
        },
      },
    },
    bisEditMode: {
      opacity: 0.05,
    },
  },
  typography: {
    bis: {
      avatar: '2rem',
      icon: '1.5rem',
      smallest: '0.75rem',
    },
  },
  palette: {
    bis: {
      background: {
        dark: '#233e47',
      },
      risk: {
        critical: '#7a1b10',
        high: '#d52c16',
        medium: '#fdc841',
        low: '#75a808',
        unknown: '#999999',
        mark: '#177dd3',
      },
      table: {
        riskBackground: {
          critical: 'rgba(122,27,16,0.2)',
          high: 'rgba(213,44,22,0.2)',
          medium: 'rgba(255, 204, 0, 0.2)',
          low: 'rgba(117, 168, 8, 0.2)',
          unknown: 'rgba(153, 153, 153, 0.2)',
        },
        riskForeground: {
          critical: '#7a1b10',
          high: '#9b0000',
          medium: '#8c6b2b',
          low: '#437900',
        },
      },
      map: {
        pin: {
          medium: '#e7b13d',
        },
        bounds: {
          medium: '#8c6b2b',
        },
      },
      geozone: {
        hover: 'rgba(255, 255, 255, 0.6)',
      },
      filter: {
        empty: {
          selected: {
            // eslint-disable-next-line sonarjs/no-duplicate-string
            button: 'rgba(255,255,255,0.75)',
            // eslint-disable-next-line sonarjs/no-duplicate-string
            buttonHover: 'var(--mui-palette-common-white)',
            color: 'var(--mui-palette-common-white)',
            // eslint-disable-next-line sonarjs/no-duplicate-string
            fill: 'var(--mui-palette-primary-main)',
          },
          default: {
            border: '#ddd',
            borderHover: 'var(--mui-palette-primary-main)',
            button: '#ddd',
            color: '#999',
            colorHover: 'var(--mui-palette-primary-main)',
            fill: 'transparent',
          },
        },
        critical: {
          selected: {
            button: 'rgba(255,255,255,0.75)',
            buttonHover: 'var(--mui-palette-common-white)',
            color: 'var(--mui-palette-common-white)',
            fill: '#7a1b10',
          },
          default: {
            border: 'transparent',
            button: 'rgba(122,27,16,0.75)',
            buttonHover: '#7a1b10',
            color: '#7a1b10',
            fill: 'rgba(122,27,16,0.2)',
          },
        },
        high: {
          selected: {
            button: 'rgba(255,255,255,0.75)',
            buttonHover: 'var(--mui-palette-common-white)',
            color: 'var(--mui-palette-common-white)',
            fill: '#d52c16',
          },
          default: {
            border: 'transparent',
            button: 'rgba(213,44,22,0.75)',
            buttonHover: '#9b0000',
            color: '#9b0000',
            fill: 'rgba(213,44,22,0.2)',
          },
        },
        medium: {
          selected: {
            button: 'rgba(140,107,43,0.75)',
            buttonHover: 'rgb(140,107,43)',
            color: 'var(--mui-palette-common-white)',
            fill: '#fdc841',
          },
          default: {
            border: 'transparent',
            button: 'rgba(140,107,43),0.75)',
            buttonHover: '#8c6b2b',
            color: '#8c6b2b',
            fill: 'rgba(253,200,65,0.2)',
          },
        },
        low: {
          selected: {
            button: 'rgba(255,255,255,0.75)',
            buttonHover: 'var(--mui-palette-common-white)',
            color: 'var(--mui-palette-common-white)',
            fill: '#75a808',
          },
          default: {
            border: 'transparent',
            borderHover: '#75a808',
            button: 'rgba(67,121,0,0.75)',
            buttonHover: '#437900',
            color: '#437900',
            fill: 'rgba(117,168,8,0.2)',
          },
        },
        unknown: {
          selected: {
            button: 'rgba(255,255,255,0.75)',
            buttonHover: 'var(--mui-palette-common-white)',
            color: 'var(--mui-palette-common-white)',
            fill: '#555',
          },
          default: {
            border: 'transparent',
            button: 'rgba(85,85,85,0.75)',
            buttonHover: '#555',
            color: '#555',
            fill: 'rgba(85,85,85,0.2)',
          },
        },
      },
    },
  },
  overrides: {
    MuiDrawer: {
      root: {
        '& .MuiResponsiveDrawer-paper.MuiDrawer-paper .MuiListItem-theme': {
          padding: '1.65rem 0.91rem',
          'border-radius': '0',
          margin: '0',
        },
        '& .MuiResponsiveDrawer-paper.MuiDrawer-paper > .MuiList-theme': {
          padding: '0',
        },
      },
    },
    MuiResponsiveDrawerFloatingButton: {
      root: {
        zIndex: 1050,
      },
    },
    MuiResponsiveDrawer: {
      root: {
        '& .MuiListItem-theme': {
          maxWidth: '100%',
        },
      },
    },
  },
  props: {
    MuiButton: {
      variant: 'outlined',
    },
    MuiTextField: {
      variant: standalone ? 'outlined' : 'filled',
    },
    MuiFormHelperText: {
      variant: 'standard',
      component: 'span',
      margin: 'dense',
    },
  },
  zIndex: {
    bis: {
      app: {
        navigation: 101,
      },
      mapMarker: {
        normal: 10,
        focused: 20,
        hovered: 30,
      },
      geozone: {
        normal: -1,
      },
    },
  },
  light: {
    custom: {
      Map: {
        icon: {
          hightlight: {
            fill: '#c5c5c5',
          },
        },
      },
    },
  },
  dark: {
    custom: {
      Map: {
        icon: {
          hightlight: {
            fill: '#4a4a49',
          },
        },
      },
    },
  },
}
