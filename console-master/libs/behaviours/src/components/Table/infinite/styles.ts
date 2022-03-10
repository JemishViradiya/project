import { makeStyles } from '@material-ui/core'

/* eslint-disable sonarjs/no-duplicate-string*/
export const useInfiniteTableStyles = makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
    },
  },
  tableRow: {
    cursor: 'pointer',
    marginRight: 0,
  },
  tableCell: {
    marginRight: '0 !important',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    '&:first-of-type': {
      marginLeft: '0 !important',
    },
  },
  cellContent: {
    flex: 1,
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cellTooltip: {
    marginTop: `-${theme.spacing(4)}px`,
  },
  noClick: {
    cursor: 'initial',
  },
  header: {
    '&:first-of-type': {
      marginLeft: '0 !important',
    },
    marginRight: '0 !important',
  },
  headCell: {
    backgroundColor: 'inherit',
    overflow: 'hidden',
  },
  autosizeWrapper: {
    flex: '1 1 auto',
    overflowX: 'auto',
    overflowY: 'hidden',
  },
}))
