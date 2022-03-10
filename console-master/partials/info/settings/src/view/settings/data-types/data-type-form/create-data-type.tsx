/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Box } from '@material-ui/core'

import { DataEntities } from '@ues-data/dlp'
import { UesReduxStore } from '@ues-data/shared'
import { HelpLinks } from '@ues/assets'
import { PageTitlePanel } from '@ues/behaviours'

import DataTypeEditor from './data-type-editor'

UesReduxStore.mountSlice(DataEntities.slice)

const DataTypeCreate = (): JSX.Element => {
  const { t } = useTranslation('dlp/common')

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(DataEntities.clearDataEntity())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // TODO. implement correct route
  const navigate = useNavigate()
  const goBack = () => {
    navigate('../../settings/data-types')
  }

  return (
    <Box display="flex" flexDirection="column" width="100%">
      <PageTitlePanel title={t('setting.dataType.addDataType')} goBack={goBack} helpId={HelpLinks.AvertDataTypes} />
      <DataTypeEditor />
    </Box>
  )
}

export default DataTypeCreate
