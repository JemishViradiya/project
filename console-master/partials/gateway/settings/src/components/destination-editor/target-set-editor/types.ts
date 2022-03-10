//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { NetworkServicesV3 } from '@ues-data/gateway'

export interface FormDataInterface {
  formValues?: { targetSet: NetworkServicesV3.NetworkServiceEntity['targetSet'] }
  isFormChanged?: boolean
  isFormValid?: boolean
}

export interface TargetSetEditorProps {
  initialData?: NetworkServicesV3.NetworkServiceEntity['targetSet']
  isSystemNetworkService?: boolean
  onChange: (formData: FormDataInterface) => void
  showConjunctionLabel?: boolean
}

export enum TargetSetFieldName {
  Protocol = 'protocol',
  MinPort = 'min',
  MaxPort = 'max',
}
