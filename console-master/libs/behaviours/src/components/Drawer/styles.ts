import { makeStyles } from '@material-ui/core'

import type { UesTheme } from '@ues/assets'

import type { DrawerStyleProps } from './types'

export const useStyles = ({ size, background }: DrawerStyleProps) =>
  makeStyles<UesTheme>(theme => ({
    paper: {
      backgroundColor: background === 'grey' && theme.palette.bbGrey['50'],
      width: size === 'small' ? '400px' : '600px',
      padding: theme.spacing(0, 8, 8),
      borderRadius: '2px',
      border: 'none',
      boxShadow: theme.shadows[16],
    },
    title: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexShrink: 0,
      height: '64px',
      marginBottom: theme.spacing(4),
    },
  }))()
