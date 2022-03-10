//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { createContext } from 'react'

export const EntityDetailsViewContext = createContext<{
  updateFormValidationStates?: (states: Record<string, boolean>) => void
  writable?: boolean
  taskLoading?: boolean
  shouldDisableFormField?: boolean
}>({})
