//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

import type { EnhancedSearchStyleProps } from './types'

export default makeStyles<Theme, EnhancedSearchStyleProps>((theme: Theme) => ({
  searchContainer: {
    '& :hover': {
      cursor: 'pointer',
    },
    padding: `${theme.spacing(1)} 0`,
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(0),
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[4],
    minHeight: `${theme.spacing(13)}px`,
    width: '100%',
  },
  searchContainerInputType: {
    position: 'relative',
    background: theme.palette.grey[200],
    boxShadow: theme.shadows[1],
    padding: ({ condensed }) => (condensed ? `0 ${theme.spacing(4)}px` : '0'),
  },
  closeSearch: {
    marginLeft: ({ condensed }) => (!condensed ? 'auto' : theme.spacing(3)),
    '& svg': {
      height: theme.spacing(5),
      width: theme.spacing(5),
    },
  },
  searchIcon: {
    '& svg': {
      height: theme.spacing(5),
      width: theme.spacing(5),
    },
  },
  base: {
    width: ({ condensed }) => (!condensed ? 'calc(100% - 80px)' : '100%'),
  },
  option: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    padding: ({ isStandardList }) => (isStandardList ? 0 : `${theme.spacing(1.5)}px ${theme.spacing(4)}px`),
  },
  paper: {
    width: 'fit-content',
    whiteSpace: 'nowrap',
    minWidth: theme.spacing(40),
    alignItems: 'center',
    minHeight: theme.spacing(9),
    margin: theme.spacing(2),
    boxShadow: '0px 5px 18px 0px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 27%), 0px 1px 3px 0px rgb(0 0 0 / 28%)',
    position: 'absolute',
    left: 0,
    right: 0,
    marginTop: theme.spacing(1),
    '& p.MuiTypography-root': {
      maxWidth: '240px',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
  },
  list: {
    maxHeight: '100%',

    '& .MuiAutocomplete-option[data-focus="true"]': {
      background: ({ isStandardList }) => (isStandardList ? 'white' : theme.palette.grey[200]),
    },
  },
  box: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridTemplateColumns: ({ condensed }) => (!condensed ? '1rf' : `minmax(100px, 960px) ${theme.spacing(2)}px`),
    position: 'relative',
  },
  inputField: {
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    '&::-webkit-scrollbar': {
      height: 7,
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: `${theme.palette.grey[400]}`,
    },

    '& input': {
      marginLeft: theme.spacing(2),
      width: 'fit-content',
      minWidth: '100px',
      '&:hover': {
        cursor: 'auto',
      },
    },
  },
  input: {
    gridTemplateColumns: ({ condensed }) => (!condensed ? '1rf' : `minmax(100px, 960px) ${theme.spacing(9)}px`),
  },
  chipWrapper: {
    maxWidth: '360px',
    '& .MuiChip-outlined': {
      '&:hover': {
        backgroundColor: '#fff !important',
      },
    },
    '& .MuiChip-root': {
      height: 'inherit',
    },
  },
  fullChip: {
    margin: `${theme.spacing(1)}px 0`,
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '& div': {
      overflow: 'hidden',
    },
    '& .MuiChip-label div': {
      padding: 0,
      textOverflow: 'ellipsis',
    },
    '& .MuiChip-label': {
      padding: 0,
    },
    '& .MuiChip-deleteIcon': {
      marginRight: `${theme.spacing(1.25)}px`,
    },
  },
  chipSeparatorText: {
    fontSize: '0.75em',
    margin: `${theme.spacing(1.25)}px ${theme.spacing(2)}px`,
  },
  activeChip: {
    border: '1px solid #69d03c',
  },
  chip: {
    display: 'flex',
    alignItems: 'center',
  },
  chipComparison: {
    padding: `${theme.spacing(1.25)}px ${theme.spacing(1)}px`,

    '&:hover': {
      backgroundColor: '#F3FCF0',
    },
  },
  chipValue: {
    padding: `${theme.spacing(1.25)}px ${theme.spacing(2.5)}px ${theme.spacing(1.25)}px ${theme.spacing(1)}px`,
    '&:hover': {
      backgroundColor: '#F3FCF0',
    },
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  activeChipStep: {
    backgroundColor: '#F3FCF0',
    borderRight: 'none !important',
  },
  pendingChip: {
    margin: `${theme.spacing(1)}px 0`,
    borderEndEndRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: 'transparent',
    border: '1px solid #69d03c',
    borderRight: '0 !important',
    '& .MuiChip-label': {
      padding: 0,
    },
  },
  comparisonContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr',
  },
  comparisonEndText: {
    textAlign: 'end',
    marginLeft: `${theme.spacing(4)}px`,
  },
  chipLabel: {
    padding: `${theme.spacing(1.25)}px ${theme.spacing(1)}px ${theme.spacing(1.25)}px ${theme.spacing(3)}px`,
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  emptyValue: {
    width: theme.spacing(5),
    height: '100%',
  },
}))
