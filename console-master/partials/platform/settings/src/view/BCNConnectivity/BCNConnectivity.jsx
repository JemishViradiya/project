/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Box, Button, Icon, Typography } from '@material-ui/core'

import { BcnApi } from '@ues-data/platform'
import { Permission, usePermissions, useStatefulReduxQuery } from '@ues-data/shared'
import { BasicAdd, BasicSettings } from '@ues/assets'
import { useSecuredContent, useSnackbar } from '@ues/behaviours'

import BCNTableData from './ExistingBCN/BCNTableData'

const BCNConnectivity = () => {
  useSecuredContent(Permission.ECS_BCN_READ)
  const { t } = useTranslation(['platform/common'])
  const { enqueueMessage } = useSnackbar()
  const navigate = useNavigate()

  const { data, loading, error } = useStatefulReduxQuery(BcnApi.queryConnections, {})

  const { hasPermission } = usePermissions()
  const createable = hasPermission(Permission.ECS_BCN_CREATE)
  const deletable = hasPermission(Permission.ECS_BCN_DELETE)

  useEffect(() => {
    if (error) {
      enqueueMessage(t('bcn.errors.errorGettingBCN'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  return (
    <>
      <Typography>{t('bcn.table.description')}</Typography>
      <Box my={3} display="flex" flexDirection="row">
        {createable && (
          <Box mr={2}>
            <Button
              color="secondary"
              onClick={() => navigate(`/bcnconnectivity/generatebcn`)}
              size="medium"
              variant="contained"
              startIcon={<Icon component={BasicAdd} />}
            >
              {t('bcn.table.buttons.add')}
            </Button>
          </Box>
        )}
        <Box ml={2}>
          <Button
            color="primary"
            onClick={() => navigate(`/bcnconnectivity/settings`)}
            size="medium"
            variant="contained"
            startIcon={<Icon component={BasicSettings} />}
          >
            {t('bcn.table.buttons.settings')}
          </Button>
        </Box>
      </Box>
      <BCNTableData data={data ?? []} deletable={deletable} loading={loading} />
    </>
  )
}

export default BCNConnectivity
