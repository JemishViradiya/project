//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import type { ReduxQuery } from '@ues-data/shared'
import { useStatefulReduxQuery } from '@ues-data/shared'

import { GATEWAY_ROUTES_DICTIONARY } from '../../../utils'
import type { EntityDetailsViewAction, EntityDetailsViewProps } from '../types'

type UseEntityDetailsViewCopyFn = (
  args: Pick<EntityDetailsViewProps, 'pageHeading'> &
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Pick<EntityDetailsViewAction, 'getArgs'> & { dataLayer: ReduxQuery<any, any, any> },
) => Partial<Pick<EntityDetailsViewProps, 'pageHeading'>>

export const useIsCopyMode = () => ({ isCopyMode: useLocation().pathname.split('/').includes(GATEWAY_ROUTES_DICTIONARY.Copy) })

export const useEntityDetailsViewCopyModeListener: UseEntityDetailsViewCopyFn = ({ dataLayer, getArgs, pageHeading }) => {
  const { id } = useParams()
  const { isCopyMode } = useIsCopyMode()

  const { refetch } = useStatefulReduxQuery(dataLayer, { skip: true })

  useEffect(() => {
    if (isCopyMode) {
      refetch({ id, ...(getArgs ? getArgs() : {}) })
    }
  }, [id, isCopyMode, getArgs, refetch])

  return isCopyMode ? { pageHeading } : {}
}
