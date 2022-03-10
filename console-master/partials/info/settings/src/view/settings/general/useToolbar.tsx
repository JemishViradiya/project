import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip/Tooltip'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'

import type { BrowserDomain } from '@ues-data/dlp'
import { BasicAdd as AddIcon, BasicAllow, BasicBlock } from '@ues/assets'
import type { ToolbarProps } from '@ues/behaviours'
import { AppliedFilterPanel, ConfirmationDialog } from '@ues/behaviours'

import makeStyles from '../../styles'
import { useDlpSettingsPermissions } from '../../useDlpSettingsPermissions'
import GeneralDialog from './dialogs/GeneralDialog'

const CANCEL_BUTTON_LABEL = 'setting.general.domain.buttons.cancel'

type InputProps = {
  selectedItems?: any[]
  onDeleteDomain: (itemsId: BrowserDomain[]) => void
  onEnableDomain: (itemsId: BrowserDomain[]) => void
  onDisableDomain: (itemsId: BrowserDomain[]) => void
  onCreate: (entity: BrowserDomain) => void
  filterLabelProps?: any
  providerProps?: any
}

enum ColumnType {
  Domain = 'domain',
  PoliciesAssigned = 'policiesAssigned',
  Domains = 'domainsCounter',
}

export const useToolbar = ({
  selectedItems = [],
  onDeleteDomain,
  onCreate,
  filterLabelProps,
  providerProps,
}: InputProps): ToolbarProps => {
  const { canUpdate } = useDlpSettingsPermissions()
  const classes = makeStyles()
  const { t } = useTranslation(['dlp/common'])
  // dialog state
  const [openDialogId, setOpenDialogId] = useState<string>('')
  const onConfirmationCloseDialog = () => {
    setOpenDialogId('')
  }

  const getFormattedMessage = (
    message4Zero: string,
    message4Singular: string,
    message4Plural: string,
    selectedItems: any[],
    columnType2Summarize: ColumnType,
  ) => {
    let formatArgs
    // if (
    //   //TODO: check if there 0 policies assigned
    // ) {
    //   return t(message4Zero)
    // } else
    if (selectedItems.length === 1) {
      formatArgs = { count: selectedItems[0][columnType2Summarize] }
      return t(message4Singular, formatArgs)
    } else {
      formatArgs = { count: selectedItems.reduce((sum, item) => sum + item[columnType2Summarize], 0) }
      return t(message4Plural, formatArgs)
    }
  }

  const [isOpenedDialog, setOpenedDialog] = useState(false)
  const handleClose = () => {
    setOpenedDialog(false)
  }

  return {
    begin: (
      <>
        {selectedItems.length >= 1 && (
          <Typography color="primary" variant="body2" className={classes.numberSelected}>
            {t('selected', { count: selectedItems.length })}
          </Typography>
        )}

        {canUpdate && (
          <Tooltip title={'add'} style={{ marginRight: 0 }}>
            <Button
              onClick={() => {
                setOpenedDialog(true)
              }}
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
            >
              {t('setting.general.domain.buttons.addNewDomain')}
            </Button>
          </Tooltip>
        )}

        <GeneralDialog onCreate={onCreate} openDialog={isOpenedDialog} handleClose={handleClose} />

        {canUpdate && selectedItems.length > 0 && (
          <Button
            startIcon={canUpdate && <DeleteIcon />}
            variant="contained"
            color="primary"
            onClick={() => setOpenDialogId('delete-confirmation')}
          >
            {t('setting.general.domain.buttons.delete')}
          </Button>
        )}

        <ConfirmationDialog
          open={openDialogId === 'delete-confirmation'}
          title={t('setting.general.domain.dialog.title.delete', { count: selectedItems.length })}
          content={getFormattedMessage(
            'setting.general.domain.dialog.warning.delete_zero',
            'setting.general.domain.dialog.warning.delete_one',
            'setting.general.domain.dialog.warning.delete_many',
            selectedItems,
            ColumnType.PoliciesAssigned,
          )}
          cancelButtonLabel={t(CANCEL_BUTTON_LABEL)}
          confirmButtonLabel={t('setting.general.domain.buttons.delete')}
          onConfirm={() => {
            onDeleteDomain(selectedItems)
            onConfirmationCloseDialog()
          }}
          onCancel={onConfirmationCloseDialog}
        />
      </>
    ),
    end: <></>,
    top: <></>,
    bottom: <AppliedFilterPanel {...providerProps.filterProps} {...filterLabelProps} />,
  }
}
