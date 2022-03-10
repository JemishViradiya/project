/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Typography } from '@material-ui/core'

import { Permission, usePermissions } from '@ues-data/shared'
import { BasicDelete } from '@ues/assets'

export const EndpointTableActions: React.FC<{ selectedCount: number; onDelete: () => void }> = memo(
  ({ selectedCount, onDelete }) => {
    const { t } = useTranslation(['platform/endpoints', 'platform/common', 'general/form'])
    //const navigate = useNavigate()

    const { hasPermission } = usePermissions()
    const canDelete = hasPermission(Permission.ECS_DEVICES_DELETE)

    return (
      <>
        {selectedCount > 0 && <Typography variant="h4">{t('endpoint.selectedCount', { value: selectedCount })}</Typography>}
        {selectedCount > 0 && canDelete && (
          <Button startIcon={<BasicDelete />} variant="contained" color="primary" onClick={onDelete}>
            {t('general/form:commonLabels.remove')}
          </Button>
        )}
      </>
    )
  },
)
