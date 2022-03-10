//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { useMemo } from 'react'

import { MAX_TARGET_SET_ITEMS, TARGET_SET_COLUMNS } from '../constants'
import type { TargetSetEditorProps } from '../types'

export const useTargetSetInitialValues = (initialData: TargetSetEditorProps['initialData'], isSystemNetworkService?: boolean) =>
  useMemo(
    () =>
      (initialData || []).reduce(
        (acc, target, index) => ({
          initialValues: [
            ...acc.initialValues,
            [
              (target?.addressSet ?? [])
                .slice(0, isSystemNetworkService ? MAX_TARGET_SET_ITEMS : (target?.addressSet ?? []).length)
                .map(item => ({ destination: item })),
              (target?.portSet ?? []).slice(0, isSystemNetworkService ? MAX_TARGET_SET_ITEMS : (target?.portSet ?? []).length),
            ],
          ],
          setsInitialLength: {
            ...acc.setsInitialLength,
            [index]: {
              [TARGET_SET_COLUMNS[0]]: (target?.addressSet ?? []).length,
              [TARGET_SET_COLUMNS[1]]: (target.portSet ?? []).length,
            },
          },
        }),
        { initialValues: [], setsInitialLength: {} },
      ),
    [initialData, isSystemNetworkService],
  )
