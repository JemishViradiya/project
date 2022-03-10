/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
export enum FORM_REFS {
  FORMIK_BAG = 'formikBag',
  POLICY_NAME = 'name',
  AUTHENTICATOR_LIST = 'authenticators',
  EXCEPTION_LIST = 'exceptions',
  RISK_FACTORS = 'risk_factors',
}

// Should be using namespace
export const getIndexName = (ref: FORM_REFS, index: number): string => {
  return `${ref}.${index}`
}
