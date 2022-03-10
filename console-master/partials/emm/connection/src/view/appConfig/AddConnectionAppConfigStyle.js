/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  outerContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.body,
  },
  cardContainer: {
    marginBottom: theme.spacing(12),
  },
  settingContainer: {
    paddingBottom: theme.spacing(10),
  },
  toggleSwitch: {
    paddingBottom: theme.spacing(3),
  },
  input: {
    width: '40%',
    marginLeft: theme.spacing(12),
    marginRight: theme.spacing(20),
  },
  cancelButton: {
    marginRight: theme.spacing(2),
  },
  descriptionLabel: {
    paddingBottom: theme.spacing(2),
  },
  circularProgress: {
    marginTop: theme.spacing(1),
  },
  backdrop: {
    zIndex: theme.zIndex.snackbar,
  },
  separatorTop: {
    paddingTop: theme.spacing(2),
  },
  groupLabel: {
    paddingTop: theme.spacing(4),
    marginLeft: theme.spacing(12),
  },
  groupSwitch: {
    marginLeft: theme.spacing(14),
    paddingTop: theme.spacing(2),
  },
  transferListIndent: {
    marginLeft: theme.spacing(29),
  },
  icon: {
    display: 'flex',
    margin: '0',
    '&:hover': {
      cursor: 'pointer',
    },
    fontSize: '1.25rem',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    '& .MuiSvgIcon-theme': {
      fontSize: theme.spacing(5),
    },
    '& div, svg': {
      marginRight: theme.spacing(1),
    },
  },
  content: {
    minHeight: theme.spacing(100),
    maxHeight: theme.spacing(100),
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
  },
  list: {
    border: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(2),
    overflowY: 'auto',
    flexGrow: 1,
  },
  chosenItems: {
    flexShrink: 0,
    maxHeight: '10vh',
    overflowY: 'auto',
    '& .MuiChip-root': {
      margin: theme.spacing(1),
    },
  },
  noResultsMessageContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}))
