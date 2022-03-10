/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ConfirmationDialog } from '@ues/behaviours'

import { Message4Addition, Message4Deletion, Message4Removal } from './dialogMessages'

type InputProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedItems?: any[]
  items?: number
  onDelete: (guids: string[]) => void
  onAdd2YourList: (guids: string[]) => void
  onRemoveFromYourList: (guids: string[]) => void
  onDuplicate: (guids: string[]) => void
  associatedTemplateGuids: string[]
  openDialogId: string
  setOpenDialogId: (dialogId: string) => void
}

export const ConfirmationDialogs = ({
  selectedItems,
  onDelete,
  onAdd2YourList,
  onRemoveFromYourList,
  onDuplicate,
  associatedTemplateGuids,
  openDialogId,
  setOpenDialogId,
}: InputProps) => {
  const { t } = useTranslation(['dlp/common'])
  const closeDialog = () => {
    setOpenDialogId('')
  }

  const numOfselectedItems = selectedItems.length
  const guids = selectedItems.map(i => i.guid)

  const itemsToRemoveFromYourList = selectedItems.filter(item => associatedTemplateGuids.includes(item.guid))
  return (
    <>
      <ConfirmationDialog
        open={openDialogId === 'add-to-list-confirmation'}
        title={t('setting.template.dialogs.addToYourList.title', { count: numOfselectedItems })}
        content={<Message4Addition selectedItems={selectedItems} associatedItemGuids={associatedTemplateGuids} />}
        cancelButtonLabel={t('setting.template.dialogs.addToYourList.cancelBtn')}
        confirmButtonLabel={t('setting.template.dialogs.addToYourList.confirmBtn')}
        onConfirm={() => {
          onAdd2YourList(guids)
          closeDialog()
        }}
        onCancel={closeDialog}
      />

      <ConfirmationDialog
        open={openDialogId === 'remove-from-list-confirmation'}
        title={t('setting.template.dialogs.removeFromYourList.title', { count: numOfselectedItems })}
        content={<Message4Removal selectedItems={selectedItems} associatedItemGuids={associatedTemplateGuids} />}
        cancelButtonLabel={t('setting.template.dialogs.removeFromYourList.cancelBtn')}
        confirmButtonLabel={t('setting.template.dialogs.removeFromYourList.confirmBtn')}
        onConfirm={() => {
          onRemoveFromYourList(guids)
          closeDialog()
        }}
        onCancel={closeDialog}
      />

      <ConfirmationDialog
        open={openDialogId === 'duplicate-confirmation'}
        title={t('setting.template.dialogs.duplicate.title')}
        description={
          numOfselectedItems === 1
            ? t('setting.template.dialogs.duplicate.singleItem', { count: numOfselectedItems })
            : Object.keys(selectedItems).map(key =>
                t('setting.template.dialogs.duplicate.multipleItems', {
                  name: selectedItems[key]?.name,
                }),
              )[0]
        }
        cancelButtonLabel={t('setting.template.dialogs.duplicate.cancelBtn')}
        confirmButtonLabel={t('setting.template.dialogs.duplicate.confirmBtn')}
        onConfirm={() => {
          onDuplicate(guids)
          closeDialog()
        }}
        onCancel={closeDialog}
      />

      <ConfirmationDialog
        open={openDialogId === 'delete-confirmation'}
        title={t('setting.template.dialogs.delete.title', { count: numOfselectedItems })}
        content={<Message4Deletion selectedItems={selectedItems} />}
        cancelButtonLabel={t('setting.template.dialogs.delete.cancelBtn')}
        confirmButtonLabel={t('setting.template.dialogs.delete.confirmBtn')}
        onConfirm={() => {
          onDelete(guids)
          closeDialog()
        }}
        onCancel={closeDialog}
      />
    </>
  )
}
