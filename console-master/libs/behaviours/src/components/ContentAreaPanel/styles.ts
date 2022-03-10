//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core/styles'

export interface StylesProps {
  fullHeight?: boolean
}

const useStyles = makeStyles(theme => ({
  contentAreaPanelChildren: ({ fullHeight }: StylesProps) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: fullHeight ? '100%' : 'auto',

    '& > *:not(:last-child)': {
      marginBottom: theme.spacing(6),
    },
  }),
  contentContainer: (props: StylesProps) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: props.fullHeight ? '100%' : 'auto',
  }),
}))

export default useStyles
