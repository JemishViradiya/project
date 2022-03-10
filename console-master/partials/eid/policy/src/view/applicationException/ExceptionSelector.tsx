/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useEffect } from 'react'

import { Button, Dialog, makeStyles } from '@material-ui/core'

import type { ExceptionBase } from '@ues-data/eid'
import { DialogChildren, TransferList as TransferListComponent, useControlledDialog } from '@ues/behaviours'

import { getI18CommonName, getI18Name, useTranslation } from '../common/i18n'

const useStyles = makeStyles(theme => ({ root: { width: '640px' } }))

export interface ExceptionSelectorProps {
  id: symbol
  appExceptions: ExceptionBase[]
  availableAppExceptions: ExceptionBase[]
  onConfirm: (selected: string[]) => void
  onCancel: () => void
}

const ExceptionSelector: React.FC<ExceptionSelectorProps> = ({
  id,
  appExceptions,
  availableAppExceptions,
  onCancel,
  onConfirm,
}) => {
  const { t } = useTranslation()
  const [modified, setModified] = React.useState<boolean>(false)
  const [selected, setSelected] = React.useState<string[]>()
  const classes = useStyles()

  useEffect(() => {
    setSelected(appExceptions?.map(el => el.name))
  }, [appExceptions])

  const closeHandler = () => {
    onCancel()
    setSelected(appExceptions?.map(el => el.name))
    setModified(false)
  }

  const submitHandler = () => {
    onConfirm(selected)
    setModified(false)
  }

  const { open, onClose } = useControlledDialog({
    dialogId: id,
    onClose: closeHandler,
  })

  function sortFunction(a, b) {
    return a > b ? 1 : -1
  }

  const handleChange = (left, right) => {
    setModified(true)
    setSelected(right)
  }
  // window.alert('Handle change\nLeft: ' + JSON.stringify(left) + '\nRight: ' + JSON.stringify(right))

  const Content = () => {
    return (
      <TransferListComponent
        allValues={availableAppExceptions?.map(el => el.name)}
        rightValues={selected}
        listLabel={t(getI18Name('selectManagedExceptionDialog.listLabel'))}
        rightLabel={t(getI18Name('selectManagedExceptionDialog.rightLabel'))}
        leftLabel={t(getI18Name('selectManagedExceptionDialog.leftLabel'))}
        allowRightEmpty={true}
        onChange={(left, right) => handleChange(left, right)}
        sortFunction={sortFunction}
      />
    )
  }

  return (
    <Dialog maxWidth={false} open={open} onClose={onClose}>
      <div className={classes.root}>
        <DialogChildren
          title={t(getI18Name('selectManagedExceptionDialog.title'))}
          onClose={onClose}
          content={<Content />}
          actions={
            <>
              <Button variant="outlined" onClick={onClose}>
                {t(getI18CommonName('cancel'))}
              </Button>
              <Button variant="contained" color="primary" type="submit" onClick={submitHandler} disabled={!modified}>
                {t(getI18CommonName('save'))}
              </Button>
            </>
          }
        />
      </div>
    </Dialog>
  )
}

export default ExceptionSelector
