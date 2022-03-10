/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'

import { Button, Typography } from '@material-ui/core'

import { BasicAdd, BasicDelete, BasicDrag } from '@ues/assets'
import type { ToolbarProps } from '@ues/behaviours/src/components/Table/toolbar'

import { getI18Name, useTranslation } from '../common/i18n'

type AuthenticatorToolbarProps = {
  draggableMode?: boolean
  authenticators: any[]
  unusedAuthenticators: any[]
  selectedIds?: string[]
  writable?: boolean
  setDraggableMode: (boolean) => void
  onDelete: (ids: string[]) => void
  onCreate: () => void
}

export function useAuthenticatorToolbar({
  draggableMode,
  authenticators,
  unusedAuthenticators,
  selectedIds,
  writable = true,
  setDraggableMode,
  onDelete,
  onCreate,
}: AuthenticatorToolbarProps): ToolbarProps {
  const { t } = useTranslation()
  //console.log('useAuthenticatorToolbar: ', { authenticators, unusedAuthenticators, selectedIds })
  return {
    begin: (
      <React.Fragment>
        {writable && selectedIds.length === 0 && authenticators?.length < 2 && (
          <Button
            startIcon={<BasicAdd />}
            variant="contained"
            color="secondary"
            onClick={() => onCreate()}
            disabled={unusedAuthenticators?.length === 0}
          >
            {t(getI18Name('authenticatorsList.addButton'))}
          </Button>
        )}
        {writable && selectedIds.length === 0 && authenticators?.length >= 2 && (
          <React.Fragment>
            {!draggableMode && unusedAuthenticators?.length > 0 && (
              <Button
                startIcon={<BasicAdd />}
                variant="contained"
                color="secondary"
                onClick={() => onCreate()}
                disabled={unusedAuthenticators?.length === 0}
              >
                {t(getI18Name('authenticatorsList.addButton'))}
              </Button>
            )}
            <Button startIcon={<BasicDrag />} variant="contained" color="primary" onClick={() => setDraggableMode(!draggableMode)}>
              {t(getI18Name('authenticatorsList.orderButton'))}
            </Button>
          </React.Fragment>
        )}
        {writable && selectedIds.length > 0 && (
          <React.Fragment>
            <Typography variant="h4">
              {t(getI18Name('authenticatorsList.deleteSelectedMsg'), { selectedCnt: selectedIds.length })}
            </Typography>
            <Button startIcon={<BasicDelete />} variant="contained" color="primary" onClick={() => onDelete(selectedIds)}>
              {t(getI18Name('authenticatorsList.deleteButton'))}
            </Button>
          </React.Fragment>
        )}
      </React.Fragment>
    ),
  }
}
