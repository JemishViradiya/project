/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { useSelector } from 'react-redux'

import type { DashboardProps } from '@ues-behaviour/dashboard'
import { selectDashboardConfigs } from '@ues-data/dashboard-config'

export const useOutOfBoxConfigs = (): DashboardProps[] => {
  return useSelector(selectDashboardConfigs)
}
