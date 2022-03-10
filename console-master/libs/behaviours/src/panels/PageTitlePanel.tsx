/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import cn from 'classnames'
import { isString } from 'lodash-es'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { AppBar, Box, IconButton, makeStyles, Typography } from '@material-ui/core'

import type { HelpLinks } from '@ues/assets'
import { ArrowChevronRight, ArrowLeft, BasicHelpOutline, useHelpLink } from '@ues/assets'

import { UserAccountComponent } from '../components/UserAccount/UserAccountComponent'

const useStyles = makeStyles(theme => ({
  title: {
    display: 'flex',
    alignItems: 'baseline',
  },
  mainSection: {
    color: '#5c5d66',
  },
  secondarySection: {
    fontWeight: 400,
    color: '#5c5d66',
  },
  separator: {
    fontSize: '1.5rem',
    marginRight: `${theme.spacing(1)}px`,
    marginLeft: `${theme.spacing(1)}px`,
    marginTop: `${theme.spacing(0.5)}px`,
    alignSelf: 'center',
    color: theme.palette.text.secondary,
  },
  textBox: {
    marginTop: `${theme.spacing(4)}px`,
    marginBottom: `${theme.spacing(4)}px`,
  },
  pageTitle: {
    backgroundColor: theme.palette.background['background'],
    paddingLeft: `${theme.spacing(6)}px`,
    paddingRight: `${theme.spacing(6)}px`,
  },
  pageTitleWithBack: {
    backgroundColor: theme.palette.background['background'],
    paddingLeft: `${theme.spacing(3)}px`,
    paddingRight: `${theme.spacing(6)}px`,
  },
  helpIcon: {
    fontSize: '1.5rem',
    color: theme.palette.text.secondary,
  },
  borderBottom: {
    borderBottom: '1px solid ' + theme.palette.divider,
  },
  backButtonMargins: {
    marginRight: `${theme.spacing(2)}px`,
  },
}))

export interface PageTitlePanelProps {
  actions?: React.ReactNode
  goBack?: () => void
  goBackComponent?: React.ReactNode
  helpId?: HelpLinks | string
  subtitle?: string
  title: string | string[]
  borderBottom?: boolean
}

export const PageTitlePanel: React.FC<PageTitlePanelProps> = ({
  goBackComponent,
  goBack,
  title,
  actions,
  subtitle,
  helpId = null,
  borderBottom = true,
}) => {
  const classes = useStyles()
  const helpLink = useHelpLink(helpId)
  const appBarStyles = []
  const { t } = useTranslation(['components'])

  borderBottom && appBarStyles.push(classes.borderBottom)
  goBack || goBackComponent ? appBarStyles.push(classes.pageTitleWithBack) : appBarStyles.push(classes.pageTitle)

  const Title = ({ title }: PageTitlePanelProps) => {
    if (isString(title)) {
      return (
        <Typography variant="h1" className={classes.mainSection} key="title">
          {title}
        </Typography>
      )
    }

    return (
      <>
        <Typography variant="h1" className={classes.mainSection} key="title">
          {title[0]}
        </Typography>
        {title.slice(1).map((x: string, i: number) => {
          return (
            <React.Fragment key={`separator${i}`}>
              <ArrowChevronRight className={classes.separator} />
              <Typography variant="h1" className={classes.secondarySection} key={`title${i++}`}>
                {x}
              </Typography>
            </React.Fragment>
          )
        })}
      </>
    )
  }
  return (
    <AppBar position="sticky" className={cn(appBarStyles)}>
      <Box display="flex" alignItems="center">
        {goBack ? (
          <IconButton onClick={goBack} className={classes.backButtonMargins} aria-label={t('button.goBackText')}>
            <ArrowLeft />
          </IconButton>
        ) : (
          <Box className={classes.backButtonMargins}>{goBackComponent}</Box>
        )}
        <Box className={classes.textBox}>
          <Box className={classes.title}>{title && <Title title={title} />}</Box>
          {subtitle && <Typography variant="caption">{subtitle}</Typography>}
        </Box>
        <Box marginLeft="auto" display="flex" alignItems="center">
          {actions}
          {helpId && (
            <IconButton size="small" href={helpLink} target="_blank" aria-label={t('helpLink.helpLinkText')}>
              <BasicHelpOutline className={classes.helpIcon} />
            </IconButton>
          )}
          <UserAccountComponent />
        </Box>
      </Box>
    </AppBar>
  )
}

export default PageTitlePanel
