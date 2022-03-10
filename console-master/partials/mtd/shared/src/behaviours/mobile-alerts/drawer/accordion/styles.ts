/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { makeStyles } from '@material-ui/core'

export const useAccordionDetailsTableStyles = makeStyles(theme => ({
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paper: {
    margin: theme.spacing(2, 6),
  },
  rowStyles: {
    paddingBottom: '8px',
    display: 'flex',
    flexDirection: 'row',
  },
  rowTitle: {
    width: '125px',
    marginLeft: '8px',
    wordWrap: 'break-word',
  },
  rowDetails: {
    width: '300px',
    marginLeft: '15px',
    wordWrap: 'break-word',
  },
}))
