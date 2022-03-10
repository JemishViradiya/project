/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import moment from 'moment'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { Box } from '@material-ui/core'

import { DataEntities } from '@ues-data/dlp'
import { useStatefulReduxQuery } from '@ues-data/shared'
import { HelpLinks } from '@ues/assets'
import { Loading, PageTitlePanel } from '@ues/behaviours'

import DataTypeEditor from './data-type-editor'

const DataTypeUpdate = (): JSX.Element => {
  const { t } = useTranslation('dlp/common')
  const dispatch = useDispatch()
  const { guid } = useParams()
  const { error, loading, data: dataEntity, refetch } = useStatefulReduxQuery(DataEntities.queryDataEntity, {
    variables: { dataEntityGuid: guid },
  })

  useEffect(() => {
    dispatch(DataEntities.updateLocalDataEntity(dataEntity))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guid, dataEntity])

  // TODO. implement correct route
  const navigate = useNavigate()
  const goBack = () => {
    navigate('../../../settings/data-types')
    dispatch(DataEntities.clearDataEntity())
  }

  // TODO without this selectedDataEntity is always coming empty inside of DataTypeEditor
  if (loading) return <Loading />

  return (
    <Box display="flex" flexDirection="column" width="100%">
      <PageTitlePanel
        title={dataEntity?.name}
        subtitle={t('setting.dataType.detail.updated', { date: moment(dataEntity?.updated).format('MMM D, YYYY h:mm A') })}
        goBack={goBack}
        helpId={HelpLinks.AvertDataTypes}
      />
      <DataTypeEditor selectedDataEntity={dataEntity} />
    </Box>
  )
}

export default DataTypeUpdate
