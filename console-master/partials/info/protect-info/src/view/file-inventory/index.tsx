//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { Box, ClickAwayListener } from '@material-ui/core'

import { HelpLinks } from '@ues/assets'
import { ContentAreaPanel, PageTitlePanel, SecuredContentBoundary } from '@ues/behaviours'

import useStyles from '../styles'
import { FileInventoryDrawer, useDrawerProps } from './fileInventoryDrawer'
import FileInventoryList from './fileInventoryList'

const FileInventory: React.FC = () => {
  const { t } = useTranslation('dlp/common')
  const classes = useStyles()
  const [fileInventoryEvent, setFileInventoryEvent] = useState(null)
  const { isOpen, toggleDrawer } = useDrawerProps()
  const rowClickEvent = useRef(null)

  const onRowClick = (params, e) => {
    rowClickEvent.current = e.nativeEvent
    setFileInventoryEvent(params.row)
    if ((fileInventoryEvent && fileInventoryEvent.hash === params.row.hash) || !isOpen) {
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
      <PageTitlePanel title={t('fileInventory.title')} helpId={HelpLinks.AvertFileInventory} />
      <Box className={classes.content}>
        <ContentAreaPanel fullHeight fullWidth ContentWrapper={SecuredContentBoundary}>
          <FileInventoryList onRowClick={onRowClick} />
          <ClickAwayListener onClickAway={event => onClickAway(event)}>
            <div>
              <FileInventoryDrawer fileInventoryEvent={fileInventoryEvent} isOpen={isOpen} toggleDrawer={toggleDrawer} />
            </div>
          </ClickAwayListener>
        </ContentAreaPanel>
      </Box>
    </Box>
  )
}

export default FileInventory
