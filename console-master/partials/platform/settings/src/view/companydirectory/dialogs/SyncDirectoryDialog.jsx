/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Button, Dialog, Typography } from '@material-ui/core'

import { syncTypes } from '@ues-data/platform'
import { InputSelect } from '@ues-platform/shared'
import { DialogChildren } from '@ues/behaviours'

const SyncDirectoryDialog = props => {
  const { connectionId, connectionName, open, defaultSyncType = syncTypes.USERS_AND_GROUPS, onCancel, onSubmit } = props
  const [syncType, setSyncType] = useState(defaultSyncType)
  const { t } = useTranslation(['platform/common', 'general/form'])
  const syncTypesInput = Object.keys(syncTypes).map(x => ({
    id: x,
    label: t(syncTypes[x]),
  }))

  function handleConfirm() {
    onSubmit(connectionId, syncType)
  }
  function handleSelectType(syncType) {
    setSyncType(syncType)
  }

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment

    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="syncDirectoryTitle"
      aria-describedby="syncDialogDescription"
      maxWidth="xs"
      fullWidth
      key={`syncDialog_${connectionId}`}
      margin="normal"
    >
      <DialogChildren
        id="syncDirectoryTitle"
        title={t('directory.sync.dialogTitle')}
        onClose={onCancel}
        content={
          <>
            <Box mb={3}>
              <Typography id="syncDialogDescription" component="div" variant="body2">
                {t('directory.sync.confirm', {
                  connectionName: connectionName,
                })}
              </Typography>
            </Box>
            <InputSelect
              values={syncTypesInput}
              name="selectSyncType"
              id="selectSyncType"
              setInputValue={handleSelectType}
              defaultValue={defaultSyncType}
              inputLabel={t('directory.syncSchedule.type')}
              required
            />
          </>
        }
        actions={
          <>
            <Button onClick={onCancel} variant="outlined">
              {t('general/form:commonLabels.cancel')}
            </Button>
            <Button onClick={handleConfirm} color="primary" variant="contained">
              {t('general/form:commonLabels.submit')}
            </Button>
          </>
        }
      />
    </Dialog>
  )
}

export default SyncDirectoryDialog
