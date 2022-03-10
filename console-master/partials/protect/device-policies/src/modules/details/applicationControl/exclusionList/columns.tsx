import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { TableColumn } from '@ues/behaviours'
import { FILTER_TYPES } from '@ues/behaviours'

import { ExclusionField } from './constants'
import { FolderPathFilter } from './filters'

const useColumns = (): TableColumn<string>[] => {
  const { t: translate } = useTranslation(['protect'])

  return useMemo(
    (): TableColumn<string>[] => [
      {
        dataKey: ExclusionField.path,
        label: translate('folderPath'),
        sortable: true,
        show: true,
        persistent: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        isFlat: true,
        renderCell: row => row,
        renderFilter: () => <FolderPathFilter />,
      },
    ],
    [translate],
  )
}

export default useColumns
