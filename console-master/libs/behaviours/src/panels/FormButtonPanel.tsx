import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Drawer, makeStyles } from '@material-ui/core'

import { ResponsiveDrawerMode, useResponsiveDrawerMode, useResponsiveDrawerState } from '@ues-behaviour/nav-drawer'

const useStyles = makeStyles(theme => ({
  paper: {
    borderTop: 'none',
  },
  root: (props: { show: boolean }) => ({
    height: props.show && 36 + theme.spacing(6), // Avoid overlapping panel with underlying content
  }),
  box: {
    display: 'flex',
    margin: theme.spacing(2),
    justifyContent: 'center',
    '& button': {
      margin: `${theme.spacing(4)}px ${theme.spacing(2)}px`,
    },
  },
}))

export const FormButtonPanel = (props: { show: boolean; children: React.ReactNode }): JSX.Element => {
  const { t } = useTranslation(['components'])
  const mode = useResponsiveDrawerMode()
  const { width } = useResponsiveDrawerState()
  const { paper, box, root } = useStyles({ show: props.show })
  const paperProps = React.useMemo(() => ({ style: { left: mode === ResponsiveDrawerMode.INLINE ? width : 0 }, elevation: 6 }), [
    mode,
    width,
  ])

  return (
    <Drawer
      variant="persistent"
      anchor="bottom"
      aria-label={t('drawer.formButtonPanel')}
      open={props.show}
      PaperProps={paperProps}
      classes={{ paper: paper, root: root }}
    >
      <Box className={box}>{props.children}</Box>
    </Drawer>
  )
}
