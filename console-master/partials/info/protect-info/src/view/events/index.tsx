//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { Box, ClickAwayListener } from '@material-ui/core'

import { HelpLinks } from '@ues/assets'
import { ContentAreaPanel, PageTitlePanel, SecuredContentBoundary } from '@ues/behaviours'

import useStyles from '../styles'
import { EventList } from './dlp-events-list'
import { DlpListDrawer, useDrawerProps } from './dlp-events-list/drawer'

const Events: React.FC = () => {
  const { t } = useTranslation('dlp/common')
  const classes = useStyles()
  // TODO dlpEvent should be replaced on string
  const [dlpEvent, setDlpEvent] = useState(null)
  const { isOpen, toggleDrawer } = useDrawerProps()

  const { eventUUID } = useParams()
  useEffect(
    () => {
      if (eventUUID) {
        setDlpEvent({ eventUUID: eventUUID })
        window.history.pushState({ urlPath: `/uc/info#/events/${eventUUID}` }, '', `/uc/info#/events/${eventUUID}`)
        toggleDrawer()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const rowClickEvent = useRef(null)

  const onRowClick = (params, e) => {
    rowClickEvent.current = e.nativeEvent
    setDlpEvent(params.row)
    if (eventUUID) {
      window.history.pushState(
        { urlPath: `/uc/info#/events/${params.row.eventUUID}` },
        '',
        `/uc/info#/events/${params.row.eventUUID}`,
      )
    }
    // TODO: check drawer fade out on new row click
    if (/* (dlpEvent && dlpEvent.eventUUID === params.row.eventUUID)  || */ !isOpen) {
      toggleDrawer()
    }
  }

  const onClickAway = (e: React.MouseEvent<Document>) => {
    if (e !== rowClickEvent.current && isOpen) {
      toggleDrawer()
    }
  }

  return (
    <Box className={classes.container}>
      <PageTitlePanel title={t('events.title')} helpId={HelpLinks.AvertEvents} />
      <Box className={classes.content}>
        <ContentAreaPanel fullHeight fullWidth ContentWrapper={SecuredContentBoundary}>
          <EventList onRowClick={onRowClick} />
          <ClickAwayListener onClickAway={event => onClickAway(event)}>
            <div>
              <DlpListDrawer dlpEvent={dlpEvent} isOpen={isOpen} toggleDrawer={toggleDrawer} />
            </div>
          </ClickAwayListener>
        </ContentAreaPanel>
      </Box>
    </Box>
  )
}

export default Events
