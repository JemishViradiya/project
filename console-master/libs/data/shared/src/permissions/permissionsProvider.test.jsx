/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/no-duplicate-string */
import '@testing-library/jest-dom'

import React from 'react'

import { cleanup, render } from '@testing-library/react'

import { useUesSession } from '../console'
import { FeatureName, FeaturizationProvider, useFeatures } from '../featurization'
import { MockProvider } from '../lib/mockContext'
import { PERMISSION_OVERRIDES_STORAGE_KEY, PermissionsProvider } from './permissionsProvider'
import { Permission, VenueRoles } from './types'
import { usePermissions } from './use-permissions'

jest.mock('../console', () => {
  return {
    useUesSession: jest.fn().mockImplementation(() => ({ permissions: null })),
  }
})
jest.mock('../featurization', () => {
  const impl = jest.requireActual('../featurization')
  return {
    ...impl,
    useFeatures: jest.fn().mockImplementation(() => ({
      isEnabled: featureCode => {
        return false
      },
    })),
  }
})

function setupSessionPermissionsAndFeatures(mockUesSessionPermissions, mockFeatures, mockVenueRbac) {
  mockFeatures.forEach(v => {
    localStorage.setItem(v, true)
  })
  useUesSession.mockImplementationOnce(() => ({ permissions: mockUesSessionPermissions, venueRbac: mockVenueRbac }))
  useFeatures.mockImplementationOnce(() => ({
    isEnabled: featureCode => {
      return mockFeatures.has(featureCode)
    },
  }))
}
function setOverridePermissions(overridePermissions) {
  const overridePermissionsObj = overridePermissions !== null ? overridePermissions : {}
  // eslint-disable-next-line no-restricted-globals
  localStorage.setItem(PERMISSION_OVERRIDES_STORAGE_KEY, JSON.stringify(overridePermissionsObj))
}
describe('usePermissions', () => {
  let localStorageOverrideValBackup
  beforeEach(() => {
    localStorageOverrideValBackup = process.env.LOCAL_STORAGE_OVERRIDE
    jest.clearAllMocks()
    process.env.LOCAL_STORAGE_OVERRIDE = 'true'
  })

  afterEach(() => {
    cleanup()
    process.env.LOCAL_STORAGE_OVERRIDE = localStorageOverrideValBackup
  })

  const TestHelperComponentInside = _props => {
    const { hasPermission, hasAnyPermission } = usePermissions()
    return (
      <>
        {hasPermission(Permission.MTD_POLICY_READ, Permission.MTD_POLICY_LIST) ? 'true' : 'false'},
        {hasAnyPermission(Permission.MTD_POLICY_DELETE, Permission.MTD_POLICY_CREATE) ? 'true' : 'false'}
      </>
    )
  }

  const TestHelperComponent = props => {
    return (
      <MockProvider value={true}>
        <FeaturizationProvider>
          <PermissionsProvider>
            <TestHelperComponentInside {...props} />
          </PermissionsProvider>
        </FeaturizationProvider>
      </MockProvider>
    )
  }

  const TestHelperComponentHasPermissionInside = props => {
    const { hasPermission } = usePermissions()

    return (
      <div>
        {(
          props.permissionsFn
            ? hasPermission(props.permissionsFn())
            : hasPermission(Permission.MTD_POLICY_READ, Permission.MTD_POLICY_LIST)
        )
          ? 'true'
          : 'false'}
      </div>
    )
  }

  const TestHelperComponentHasPermission = props => {
    return (
      <MockProvider value={true}>
        <FeaturizationProvider>
          <PermissionsProvider>
            <TestHelperComponentHasPermissionInside {...props} />
          </PermissionsProvider>
        </FeaturizationProvider>
      </MockProvider>
    )
  }

  const TestHelperComponentHasAnyPermissionInside = props => {
    const { hasAnyPermission } = usePermissions()

    return (
      <div>
        {(
          props.permissionsFn
            ? hasAnyPermission(props.permissionsFn())
            : hasAnyPermission(Permission.MTD_POLICY_DELETE, Permission.MTD_POLICY_CREATE)
        )
          ? 'true'
          : 'false'}
      </div>
    )
  }
  const TestHelperComponentHasAnyPermission = props => {
    return (
      <MockProvider value={true}>
        <FeaturizationProvider>
          <PermissionsProvider>
            <TestHelperComponentHasAnyPermissionInside {...props} />
          </PermissionsProvider>
        </FeaturizationProvider>
      </MockProvider>
    )
  }

  const TestHelperVenueComponent = ({ hookName, hookValue }) => {
    const TestHelperComponentInside = () => {
      const hook = usePermissions()
      return <div>{`${hook?.[hookName]?.(hookValue)}`}</div>
    }

    return (
      <MockProvider value={true}>
        <FeaturizationProvider>
          <PermissionsProvider>
            <TestHelperComponentInside />
          </PermissionsProvider>
        </FeaturizationProvider>
      </MockProvider>
    )
  }

  function getVenueRbacByRole(role) {
    return {
      role: {
        name: role,
        isCustom: false,
        rbac: {},
        roleId: '00000000-0000-0000-0000-000000000001',
        zoneids: [],
      },
      scp: [],
    }
  }

  it('When feature PermissionChecksEnabled is off, then feature check always return true', () => {
    const mockPermissions = null
    const mockFeatures = new Set([])
    setupSessionPermissionsAndFeatures(mockPermissions, mockFeatures)

    const { getByText } = render(<TestHelperComponent />)

    expect(getByText('true,true')).toBeTruthy()
  })

  it('Test hasPermission true', () => {
    const mockPermissions = new Set([Permission.MTD_POLICY_READ, Permission.MTD_POLICY_LIST])
    const mockFeatures = new Set([FeatureName.PermissionChecksEnabled])
    setupSessionPermissionsAndFeatures(mockPermissions, mockFeatures)

    const { getByText } = render(<TestHelperComponentHasPermission />)

    expect(getByText('true')).toBeTruthy()
  })
  it('Test hasPermission false first check', () => {
    const mockPermissions = new Set([Permission.MTD_POLICY_LIST])
    const mockFeatures = new Set([FeatureName.PermissionChecksEnabled])
    setupSessionPermissionsAndFeatures(mockPermissions, mockFeatures)

    const { getByText } = render(<TestHelperComponentHasPermission />)

    expect(getByText('false')).toBeTruthy()
  })
  it('Test hasPermission false in second check', () => {
    const mockPermissions = new Set([Permission.MTD_POLICY_READ])
    const mockFeatures = new Set([FeatureName.PermissionChecksEnabled])
    setupSessionPermissionsAndFeatures(mockPermissions, mockFeatures)

    const { getByText } = render(<TestHelperComponentHasPermission />)

    expect(getByText('false')).toBeTruthy()
  })
  it('Test hasPermission false null permissions in session', () => {
    const mockPermissions = null
    const mockFeatures = new Set([FeatureName.PermissionChecksEnabled])
    setupSessionPermissionsAndFeatures(mockPermissions, mockFeatures)

    const { getByText } = render(<TestHelperComponentHasPermission />)

    expect(getByText('false')).toBeTruthy()
  })
  it('Test hasPermission false null permissions argument', () => {
    const mockPermissions = new Set([Permission.MTD_POLICY_READ])
    const mockFeatures = new Set([FeatureName.PermissionChecksEnabled])
    setupSessionPermissionsAndFeatures(mockPermissions, mockFeatures)

    const { getByText } = render(<TestHelperComponentHasPermission permissionsFn={() => null} />)

    expect(getByText('false')).toBeTruthy()
  })

  it('Test hasAnyPermission true', () => {
    const mockPermissions = new Set([Permission.MTD_POLICY_DELETE, Permission.MTD_POLICY_CREATE])
    const mockFeatures = new Set([FeatureName.PermissionChecksEnabled])
    setupSessionPermissionsAndFeatures(mockPermissions, mockFeatures)

    const { getByText } = render(<TestHelperComponentHasAnyPermission />)

    expect(getByText('true')).toBeTruthy()
  })
  it('Test hasAnyPermission true - first permission', () => {
    const mockPermissions = new Set([Permission.MTD_POLICY_DELETE])
    const mockFeatures = new Set([FeatureName.PermissionChecksEnabled])
    setupSessionPermissionsAndFeatures(mockPermissions, mockFeatures)

    const { getByText } = render(<TestHelperComponentHasAnyPermission />)

    expect(getByText('true')).toBeTruthy()
  })
  it('Test hasAnyPermission true - override true', () => {
    const mockPermissions = new Set([])
    const mockFeatures = new Set([FeatureName.PermissionChecksEnabled])
    setupSessionPermissionsAndFeatures(mockPermissions, mockFeatures)
    const overridePermissions = {}
    overridePermissions[Permission.MTD_POLICY_DELETE] = true
    setOverridePermissions(overridePermissions)

    const { getByText } = render(<TestHelperComponentHasAnyPermission />)

    expect(getByText('true')).toBeTruthy()
  })
  it('Test hasAnyPermission true - override false', () => {
    const mockPermissions = new Set([Permission.MTD_POLICY_DELETE])
    const mockFeatures = new Set([FeatureName.PermissionChecksEnabled])
    setupSessionPermissionsAndFeatures(mockPermissions, mockFeatures)
    const overridePermissions = {}
    overridePermissions[Permission.MTD_POLICY_DELETE] = false
    setOverridePermissions(overridePermissions)

    const { getByText } = render(<TestHelperComponentHasAnyPermission />)

    expect(getByText('false')).toBeTruthy()
  })
  it('Test hasAnyPermission true - second permission', () => {
    const mockPermissions = new Set([Permission.MTD_POLICY_CREATE])
    const mockFeatures = new Set([FeatureName.PermissionChecksEnabled])
    setupSessionPermissionsAndFeatures(mockPermissions, mockFeatures)

    const { getByText } = render(<TestHelperComponentHasAnyPermission />)

    expect(getByText('true')).toBeTruthy()
  })
  it('Test hasAnyPermission false', () => {
    const mockPermissions = new Set([Permission.MTD_POLICY_LIST])
    const mockFeatures = new Set([FeatureName.PermissionChecksEnabled])
    setupSessionPermissionsAndFeatures(mockPermissions, mockFeatures)

    const { getByText } = render(<TestHelperComponentHasAnyPermission />)

    expect(getByText('false')).toBeTruthy()
  })
  it('Test hasAnyPermission false null permissions in session', () => {
    const mockPermissions = null
    const mockFeatures = new Set([FeatureName.PermissionChecksEnabled])
    setupSessionPermissionsAndFeatures(mockPermissions, mockFeatures)

    const { getByText } = render(<TestHelperComponentHasAnyPermission />)

    expect(getByText('false')).toBeTruthy()
  })
  it('Test hasAnyPermission false null permissions argument', () => {
    const mockPermissions = new Set([Permission.MTD_POLICY_CREATE])
    const mockFeatures = new Set([FeatureName.PermissionChecksEnabled])
    setupSessionPermissionsAndFeatures(mockPermissions, mockFeatures)

    const { getByText } = render(<TestHelperComponentHasAnyPermission permissionsFn={() => null} />)

    expect(getByText('false')).toBeTruthy()
  })

  describe('hasVenueAnyRole', () => {
    it('first role', () => {
      const mockVenueRbac = getVenueRbacByRole(VenueRoles.ROLE_ADMINISTRATOR)
      const mockFeatures = new Set([FeatureName.PermissionChecksEnabled])
      setupSessionPermissionsAndFeatures([], mockFeatures, mockVenueRbac)

      const { getByText } = render(
        <TestHelperVenueComponent
          hookName="hasVenueAnyRole"
          hookValue={new Set([VenueRoles.ROLE_ADMINISTRATOR, VenueRoles.ROLE_ZONE_MANAGER])}
        />,
      )

      expect(getByText('true')).toBeTruthy()
    })

    it('second role', () => {
      const mockVenueRbac = getVenueRbacByRole(VenueRoles.ROLE_ZONE_MANAGER)
      const mockFeatures = new Set([FeatureName.PermissionChecksEnabled])
      setupSessionPermissionsAndFeatures([], mockFeatures, mockVenueRbac)

      const { getByText } = render(
        <TestHelperVenueComponent
          hookName="hasVenueAnyRole"
          hookValue={new Set([VenueRoles.ROLE_ADMINISTRATOR, VenueRoles.ROLE_ZONE_MANAGER])}
        />,
      )
      expect(getByText('true')).toBeTruthy()
    })

    it('invalid role', () => {
      const mockVenueRbac = getVenueRbacByRole(VenueRoles.ROLE_READ_ONLY)
      const mockFeatures = new Set([FeatureName.PermissionChecksEnabled])
      setupSessionPermissionsAndFeatures([], mockFeatures, mockVenueRbac)

      const { getByText } = render(<TestHelperVenueComponent hookName="hasVenueAnyRole" hookValue={null} />)

      expect(getByText('false')).toBeTruthy()
    })

    it('missing role in session', () => {
      const mockVenueRbac = getVenueRbacByRole(null)
      const mockFeatures = new Set([FeatureName.PermissionChecksEnabled])
      setupSessionPermissionsAndFeatures([], mockFeatures, mockVenueRbac)

      const { getByText } = render(<TestHelperVenueComponent hookName="hasVenueAnyRole" />)

      expect(getByText('false')).toBeTruthy()
    })
  })
})
