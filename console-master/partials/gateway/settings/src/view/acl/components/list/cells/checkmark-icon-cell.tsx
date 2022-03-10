//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'

import { BasicAllow } from '@ues/assets'

interface CheckmarkIconCellProps {
  show: boolean
}

export const CheckmarkIconCell: React.FC<CheckmarkIconCellProps> = ({ show = false }) =>
  show ? <BasicAllow fontSize="small" /> : null
