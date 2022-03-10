/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'

import { TableSearchPanel } from '@ues/behaviours'
import type { ToolbarProps } from '@ues/behaviours/src/components/Table/toolbar'

type SecurityPatchToolbarProps = {
  t: (a: string, v?: any) => string
  selectedIds?: string[]
  items?: number
  loading?: boolean
  onSearch: (searchString: string) => void
}

export function useSecurityPatchToolbar({
  selectedIds = [],
  items = 0,
  loading = false,
  onSearch,
}: SecurityPatchToolbarProps): ToolbarProps {
  const { t } = useTranslation(['mtd/common'])
  return {
    top: (
      <TableSearchPanel
        onSearch={onSearch}
        onReset={() => false}
        searchPlaceholder={t('policy.androidHwAttestationSecurityPatchSearch')}
      />
    ),
  }
}
