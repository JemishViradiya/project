const miniWidth = 54
const zIndex = 3000

export const MuiResponsiveDrawer = ({ palette, spacing, props, shape }) => ({
  root: {},
  paper: {
    color: palette.grey[300],
    backgroundColor: palette.common.black,
    textAlign: 'initial',
    '&.MuiDrawer-paper': {
      backgroundColor: palette.common.black,
      color: palette.grey[300],
      justifyContent: 'space-between',
      zIndex,
      borderRadius: 0,
      border: 'none',
      '& > .MuiList-theme': {
        flex: '1 1 auto',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: 0,
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          width: 0,
        },
      },
      '& header': {
        pointerEvents: 'none',
        marginTop: spacing(1),
        paddingLeft: spacing(1),
        color: null,
        '&:hover': {
          backgroundColor: props.colors.nav.itemHover,
          color: palette.common.white,
        },
      },
      '& .MuiListItem-theme': {
        height: miniWidth,
        outline: 'none',
      },
      '& .MuiListItem-gutters': {
        paddingLeft: spacing(4) - 1,
        paddingRight: spacing(4) - 1,
      },
      '& .MuiCollapse-theme': {
        '& .MuiListItem-theme': {
          height: miniWidth,
          margin: 0,
          borderRadius: 0,
        },
        '& .MuiList-root': {
          padding: 0,
        },
        '& .MuiListItemIcon-theme': {
          minWidth: '20px',
        },
        '& .MuiSvgIcon-theme': {
          fontSize: 20,
          width: 20,
          height: 20,
        },
        '& .MuiListItemText-theme': {
          marginLeft: miniWidth,
        },
      },
      '& .MuiSvgIcon-theme': {
        fontSize: 24,
        width: 24,
        height: 24,
      },
      '& .MuiListItemIcon-root': {
        minWidth: miniWidth,
        color: palette.nav.defaultIcon,
      },
      '& .MuiList-root': {
        flexGrow: 1,
      },
    },
    '& .MuiDivider-root': {
      backgroundColor: props.colors.nav.itemHighlighted,
    },
  },
  paperAnchorDockedLeft: {
    width: 'inherit',
    overflowX: 'hidden',
    border: 'none',
  },
  modal: {
    width: 'calc(100% - 56px)',
    minWidth: 280,
    maxWidth: 360,
  },
  full: {
    width: 280,
    overflowX: 'hidden',
  },
  mini: {
    width: miniWidth,
    overflowX: 'hidden',
    height: '100%',
  },
  zIndex,
})
export const MuiResponsiveDrawerButton = ({ props }) => ({
  root: {
    width: 24,
    '&:hover': {
      backgroundColor: props.colors.nav.itemHover,
    },
  },
})
export const MuiResponsiveDrawerFloatingButton = ({ props }) => ({
  root: {
    top: 0,
    left: 0,
    '&:hover': {
      backgroundColor: props.colors.nav.itemHover,
    },
  },
})
