import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles, Typography } from '@material-ui/core'

import { ImageLoading, LogoBlackBerry } from '@ues/assets'
import { Loading } from '@ues/behaviours'

import { Phase } from './types'

const useStyles = makeStyles(theme => ({
  main: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#233e47',

    '& dialog': {
      position: 'relative',
      top: 'calc(50% - 200px)',
      left: 'calc(50% - 200px)',
      height: 400,
      width: 400,
      maxHeight: '100%',
      maxWidth: '100%',
      margin: 0,
      padding: 0,
      border: 'none',
      outline: 'none',
      textAlign: 'initial',
      color: theme.palette.text.primary,
      display: 'flex',
      flexFlow: 'column nowrap',
      backgroundColor: theme.palette.background.paper,

      '@media screen and (max-height: 500px)': {
        top: 0,
      },

      '@media screen and (max-width: 500px)': {
        left: 0,
        width: '100vw',
        top: 0,
        height: '100vh',
      },
    },

    '& header': {
      backgroundColor: theme.palette.grey[100],
      padding: `${theme.spacing(4)}px ${theme.spacing(8)}px`,
    },
  },

  logo: {
    width: 'auto',
    height: 36,
  },

  content: {
    padding: `${theme.spacing(6)}px ${theme.spacing(10)}px`,
    flex: '1 0 auto',
    display: 'flex',
  },

  loading: {
    margin: 'auto',
    textAlign: 'center',

    '& svg': {
      height: 150,
      width: 150,
      marginBottom: theme.spacing(2),
    },
  },

  errorTitle: {
    paddingBottom: theme.spacing(2),
  },
}))

const LoadingView = () => {
  const { loading } = useStyles()
  const { t } = useTranslation()

  return (
    <div className={loading}>
      <ImageLoading viewBox="0 0 160 160" />
      <div>{t('loading')}</div>
    </div>
  )
}

const ErrorView = ({ phase }) => {
  const { errorTitle } = useStyles()
  const { t } = useTranslation()
  const title = t(phase === Phase.Logout ? 'logoutFailed' : 'loginFailed')

  return (
    <div>
      <Typography variant="h1" className={errorTitle}>
        {title}
      </Typography>
      <Typography variant="body2">{t('errorMessage')}</Typography>
    </div>
  )
}

export const SessionMgrView: React.FC<{ showError: boolean; phase: Phase }> = ({ showError, phase }) => {
  const { main, logo, content } = useStyles()

  return (
    <main className={main}>
      <dialog open>
        <header>
          <LogoBlackBerry viewBox="0 0 145 30" className={logo} />
        </header>
        <div className={content}>
          <Suspense fallback={<Loading />}>{showError ? <ErrorView phase={phase} /> : <LoadingView />}</Suspense>
        </div>
      </dialog>
    </main>
  )
}
