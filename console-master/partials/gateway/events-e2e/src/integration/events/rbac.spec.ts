//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.
import { FeatureName, Permission } from '@ues-data/shared-types'
import { CommonFns, EVENTS_URL, RbacFns } from '@ues/assets-e2e'

const { infiniteTableShould } = CommonFns(I)
const { beforeAction, beforeEachAction, withoutReadPermissionAction } = RbacFns(I)

context('Events: RBAC', () => {
  before(() => {
    beforeAction(EVENTS_URL, ['access'], { [FeatureName.PermissionChecksEnabled]: true })
  })

  beforeEach(() => {
    beforeEachAction({})
  })

  it('should show no permission without reporting read set', () => {
    // remove read access and verify access denied message exists
    withoutReadPermissionAction({ [Permission.BIG_REPORTING_READ]: false })
    infiniteTableShould('not.exist')
    I.findByText(I.translate('access:errors.noPermission.title')).should('be.visible')
    I.findByText(I.translate('access:errors.noPermission.description')).should('be.visible')
  })
})
