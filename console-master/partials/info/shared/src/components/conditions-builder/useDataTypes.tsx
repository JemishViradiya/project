import React, { useEffect, useMemo, useState } from 'react'

import { DataEntities, TemplateData } from '@ues-data/dlp'
import { useStatefulReduxQuery } from '@ues-data/shared'

type DataType = {
  guid: string
  name: string
}

export const useDataTypes = titleGuid => {
  const { loading: loadingAssociatedDataEntities, data: associatedDataEntities } = useStatefulReduxQuery(
    DataEntities.queryAssociatedDataEntities,
  )

  const dataTypes: DataType[] = associatedDataEntities?.elements?.map(item => ({ guid: item.guid, name: item.name }))
  const foundTypeName = dataTypes?.find(item => item.guid === titleGuid)
  const selectedDataTypeName = foundTypeName?.name ? foundTypeName?.name : ''
  return { dataTypes, selectedDataTypeName }
}
