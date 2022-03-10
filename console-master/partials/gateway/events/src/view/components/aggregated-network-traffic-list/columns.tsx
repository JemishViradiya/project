//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { useMemo } from 'react'

import { useColumnsDefinition } from '../hooks'
import type { EnhancedReportingServiceBucket, UseColumnsFn } from '../types'

export const useColumns: UseColumnsFn<EnhancedReportingServiceBucket> = ({ hiddenColumns, pickColumns, listName }) => {
  const columns = useColumnsDefinition<EnhancedReportingServiceBucket>({ listName, pickColumns, hiddenColumns })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => columns, [hiddenColumns])
}
