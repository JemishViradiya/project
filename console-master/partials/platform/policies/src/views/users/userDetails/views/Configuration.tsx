/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useRef } from 'react'
import { useParams } from 'react-router'

import { queryUserById } from '@ues-data/platform'
import { useStatefulAsyncQuery } from '@ues-data/shared'

import Groups from './Configuration/Groups'
import Policies from './Configuration/Policies'

export const Configuration = memo(() => {
  const { id: userId } = useParams()

  const { data } = useStatefulAsyncQuery(queryUserById, { variables: { id: userId }, skip: !userId })
  const refetchPoliciesRef = useRef<() => void>(undefined)

  return (
    <>
      <Groups userData={data} refetchPoliciesRef={refetchPoliciesRef} />
      <Policies userData={data} refetchPoliciesRef={refetchPoliciesRef} />
    </>
  )
})
