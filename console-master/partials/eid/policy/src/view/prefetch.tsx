/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import { Outlet } from 'react-router-dom'

export function PolicyPrefetch(): JSX.Element {
  // TODO Place additional prefetches here - device hardware metadata, wifi settings ...
  return <Outlet />
}

export default PolicyPrefetch
