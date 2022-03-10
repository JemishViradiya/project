//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useMemo } from 'react'

import { useMock } from '@ues-data/shared'

import CustomDashboard from './CustomDashboard'
import DefaultDashboard from './DefaultDashboard'

const Dashboard: React.FC = () => {
  const mock = useMock()

  return useMemo(() => {
    if (mock) return <DefaultDashboard />
    return <CustomDashboard />
  }, [mock])
}

export default Dashboard
