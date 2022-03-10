//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { FormInstance } from '../../Form/types'
import { sanitizeForm } from '../../Form/utils'

export const useInputGroupsValues = (formInstance: FormInstance) => Object.values(sanitizeForm(formInstance.getValues()))
