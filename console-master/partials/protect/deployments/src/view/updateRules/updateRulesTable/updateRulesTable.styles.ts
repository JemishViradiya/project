// dependencies
import { makeStyles } from '@material-ui/core/styles'

const useUpdateStrategiesTableStyles = makeStyles(theme => ({
  accordionRoot: {
    '&:before': {
      opacity: 0,
    },
    margin: '0',
  },
  accordionExpanded: {
    '&&': {
      margin: '0',
    },
  },
  accordionIcon: {
    opacity: 0,
  },

  expansionRow: {
    '&.MuiExpansionPanel-rounded': {
      transition: 'border-top-width 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, margin 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;',

      // hide top border if not expanded and not first child
      '&:not(.Mui-expanded):not(:first-child)': {
        borderTopWidth: 0,
      },

      // put top border back for siblings immediately following an expanded panel
      '&.Mui-expanded + .MuiExpansionPanel-rounded': {
        borderTopWidth: '1px',
      },

      '& .dragAndDrop-input': {
        margin: 0,
      },
    },
    boxShadow: `0px 0px 0px 1px ${theme.palette.divider}`,
  },
}))

export default useUpdateStrategiesTableStyles
