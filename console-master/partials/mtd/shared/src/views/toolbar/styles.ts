/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  toolbar: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 0',

    '& > div': {
      alignItems: 'center',
      display: 'flex',
      height: '100%',

      '& > *': {
        margin: '0 0.25rem',
      },
    },
  },
})

export default useStyles
