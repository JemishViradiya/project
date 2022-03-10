import { CYLANCE_COLORS as colors } from './../colors'
import { base } from './../dsm/base'

const denseAlertChip = {
  height: 'auto',
  minWidth: '56px',
  padding: '0px 4px 0px 4px',
  border: 'none',
  borderRadius: '2px',
  '& .MuiChip-label': {
    fontSize: '0.6875rem',
    fontWeight: 'bold',
    lineHeight: '1rem',
    padding: 0,
    textTransform: 'uppercase',
    color: base.common.white,
  },
}
const MuiChip = ({ spacing, palette }) => ({
  root: {
    '&.alert-chip-critical': {
      backgroundColor: palette.chipAlert.critical,
      ...denseAlertChip,
    },
    '&.alert-chip-high': {
      backgroundColor: palette.chipAlert.high,
      ...denseAlertChip,
    },
    '&.alert-chip-medium': {
      backgroundColor: palette.chipAlert.medium,
      ...denseAlertChip,
    },
    '&.alert-chip-low': {
      backgroundColor: palette.chipAlert.low,
      ...denseAlertChip,
    },
    '&.alert-chip-secure': {
      backgroundColor: palette.chipAlert.secure,
      ...denseAlertChip,
    },
    '&.alert-chip-info': {
      backgroundColor: palette.chipAlert.info,
      ...denseAlertChip,
    },
    '& .MuiChip-deleteIcon': {
      height: '1rem',
      width: '1rem',
    },
    '& .MuiChip-sizeSmall': {
      fontSize: '0.75rem',
    },
  },
  outlined: {
    border: `1px solid ${palette.logicalGrey[500]}`,
    backgroundColor: palette.background.background,
    '&.Mui-disabled': {
      border: 'none',
      backgroundColor: palette.logicalGrey[400],
    },
    '&.MuiChip-clickable:focus': {
      border: `1px solid ${palette.logicalGrey[500]}`,
      backgroundColor: palette.background.background,
    },
    '&.MuiChip-clickable:hover:not(:active)': {
      border: `1px solid ${colors.secondary[500]}`,
      backgroundColor: colors.secondary[palette.type === 'light' ? 50 : 900],
    },
    '&.MuiChip-clickable:active': {
      border: `1px solid ${colors.secondary[500]}`,
      backgroundColor: colors.secondary[palette.type === 'light' ? 200 : 800],
    },
    '&.MuiChip-clickable:hover.MuiChip-clickable:focus:not(:active)': {
      border: `1px solid ${colors.secondary[500]}`,
      backgroundColor: colors.secondary[palette.type === 'light' ? 50 : 900],
    },
    '&.MuiChip-deletable:focus': {
      border: `1px solid ${palette.logicalGrey[500]}`,
      backgroundColor: palette.background.background,
    },
    '& .MuiChip-deleteIcon': {
      color: palette.logicalGrey[500],
      height: '16px',
      width: '16px',
      marginRight: spacing(2),
      transition: 'color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      '&:hover': {
        color: palette.logicalGrey[600],
      },
    },
    '&.chip-selected': {
      border: `1px solid ${colors.secondary[500]}`,
      backgroundColor: colors.secondary[200],
    },
    '&.chip-selected.MuiChip-clickable:focus': {
      border: `1px solid ${colors.secondary[500]}`,
      backgroundColor: colors.secondary[palette.type === 'light' ? 200 : 800],
    },
    '&:not(.MuiChip-sizeSmall)': {
      fontSize: '14px',
    },
    '& .MuiChip-icon': {
      marginLeft: spacing(2),
      marginRight: `-${spacing(1)}px`,
    },

    '&.MuiChip-selectable.MuiChip-clickable': {
      '&:hover, &:focus, &:focus:hover:not(:active)': {
        border: `1px solid ${palette.logicalGrey[500]}`,
        backgroundColor: palette.logicalGrey[200],
      },

      '&:active, &.chip-open': {
        border: `1px solid ${palette.logicalGrey[500]}`,
        backgroundColor: palette.logicalGrey['A100'],
      },

      '&.chip-selected': {
        border: `1px solid ${colors.secondary[500]}`,
        backgroundColor: colors.secondary[palette.type === 'light' ? 50 : 900],

        '&:hover, &:focus, &:focus:hover': {
          backgroundColor: colors.secondary[palette.type === 'light' ? 100 : 900],
        },

        '&:active , &.chip-open': {
          backgroundColor: colors.secondary[palette.type === 'light' ? 200 : 900],
        },
      },
      '&.Mui-disabled': {
        border: `1px solid ${palette.logicalGrey[400]}`,
        backgroundColor: palette.logicalGrey[400],
      },
    },
  },
  sizeSmall: {
    fontSize: '0.75rem',
  },
  icon: {
    height: '1.5rem',
    width: '1.5rem',
  },
  iconSmall: {
    height: '1.25rem',
    width: '1.25rem',
  },
  label: {
    fontSize: '0.875rem',
    display: 'flex',
  },
  labelSmall: {
    fontSize: '0.75rem',
  },
})

export default MuiChip
