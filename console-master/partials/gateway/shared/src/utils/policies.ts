//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'

import type { Policy } from '@ues-data/gateway'

export const isAndroidEnabled = (policy: Policy | Partial<Policy>): boolean => !isEmpty(policy?.platforms?.Android)
