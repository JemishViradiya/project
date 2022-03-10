//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'

import type { TargetSet } from '@ues-data/gateway'

import { SELECT_DEFAULT_VALUE, TARGET_SET_COLUMNS } from './constants'

export const makeNetworkServiceConfigTargetSet = (formValues): { targetSet: TargetSet[] } => ({
  targetSet: formValues.reduce((acc, formValue) => {
    const [destinations, ports] = formValue

    const addressSet = destinations?.reduce((acc, item) => (isEmpty(item?.destination) ? acc : [...acc, item.destination]), [])
    const portSet = ports?.filter(item => item?.protocol !== SELECT_DEFAULT_VALUE)

    const isEmptyAddressSet = isEmpty(addressSet)
    const isEmptyPortSet = isEmpty(portSet)

    return isEmptyAddressSet && isEmptyPortSet
      ? acc
      : [
          ...acc,
          {
            ...(!isEmptyAddressSet && { [TARGET_SET_COLUMNS[0]]: addressSet }),
            ...(!isEmptyPortSet && { [TARGET_SET_COLUMNS[1]]: portSet }),
          },
        ]
  }, []),
})
