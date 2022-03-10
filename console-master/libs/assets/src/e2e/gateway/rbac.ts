//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.
import type { Permission } from '@ues-data/shared-types'
import { FeatureName } from '@ues-data/shared-types'

import { COMMON_COPY_BUTTON, COMMON_DELETE_BUTTON, COMMON_SAVE_CHANGES_BUTTON } from './fixtures'
import { CommonFns } from './utils'

export const RbacFns = (I: any) => {
  const { visitView, getButton, loadingIconShould, validateAccess } = CommonFns(I)

  const beforeAction = (
    path: string,
    translations: string[],
    additionalLocalStorageFlags?: Partial<Record<FeatureName, boolean>>,
    overridePermissionsObj?: Partial<Record<Permission, boolean>>,
  ) => {
    visitView(path, { [FeatureName.PermissionChecksEnabled]: true, ...additionalLocalStorageFlags }, translations)

    if (overridePermissionsObj) {
      I.overridePermissions({ ...overridePermissionsObj })
    }
  }

  const beforeEachAction = (overridePermissionsObj: Partial<Record<Permission, boolean>>) => {
    I.overridePermissions({ ...overridePermissionsObj })
    loadingIconShould('not.exist')
  }

  const withoutReadPermissionAction = (
    overridePermissionsObj: Partial<Record<Permission, boolean>>,
    hasAccess?: boolean,
    tabs?: string[],
  ) => {
    I.overridePermissions({ ...overridePermissionsObj })

    return (
      tabs?.length > 0 &&
      tabs.forEach(tabName => {
        I.findByRole('tab', { name: I.translate(tabName) }).click()
        validateAccess(hasAccess ?? false)
      })
    )
  }

  const withoutCreatePermissionAction = (
    overridePermissionsObj: Partial<Record<Permission, boolean>>,
    elements: Record<'tab' | 'button', string>[],
  ) => {
    I.overridePermissions({ ...overridePermissionsObj })

    I.findByRole('button', { name: COMMON_COPY_BUTTON }).should('not.exist')

    return (
      elements.length > 0 &&
      elements.forEach(item => {
        I.findByRole('tab', { name: I.translate(item.tab) }).click()
        getButton(I.translate(item.button)).should('not.exist')
      })
    )
  }

  const withoutUpdatePermissionAction = (overridePermissionsObj: Partial<Record<Permission, boolean>>, hasAccess?: boolean) => {
    I.overridePermissions({ ...overridePermissionsObj })

    validateAccess(hasAccess ?? false)

    return I.findByRole('button', { name: COMMON_SAVE_CHANGES_BUTTON }).should('not.exist')
  }

  const withoutDeletePermissionAction = (overridePermissionsObj: Partial<Record<Permission, boolean>>, hasAccess?: boolean) => {
    I.overridePermissions({ ...overridePermissionsObj })
    validateAccess(hasAccess ?? false)

    return I.findByRole('button', { name: COMMON_DELETE_BUTTON }).should('not.exist')
  }

  return {
    beforeAction,
    beforeEachAction,
    withoutReadPermissionAction,
    withoutCreatePermissionAction,
    withoutUpdatePermissionAction,
    withoutDeletePermissionAction,
  }
}
