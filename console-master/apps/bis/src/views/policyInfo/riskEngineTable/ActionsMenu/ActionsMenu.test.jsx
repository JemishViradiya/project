import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, cleanup, fireEvent, render } from '@testing-library/react'

import ActionTypes from '../../../../components/ActionType'
import useClientParamsMock from '../../../../components/hooks/useClientParams'
import { AVAILABLE_ACTIONS } from '../../../policies/__fixtures__/AvailableActionsQuery.fixture'

const PERIOD_EXCEEDED_ERROR_TEXT = 'The grace period must be a whole number from 1 to 480.'
let getActionAttributes
jest.isolateModules(() => (getActionAttributes = require('./ActionsMenu').getActionAttributes))

jest.mock('../../../../components/hooks/useClientParams', () =>
  jest.fn(
    key =>
      ({
        support: {
          helpUrl: 'about:blank',
        },
        features: { DynamicsProfiles: true, MdmActions: true },
      }[key || 'features']),
  ),
)

const defaultProps = {
  actions: [],
  addAction: () => {},
  areBlockRequestingActionsVisible: false,
  areMdmDeviceActionsVisible: false,
}

const defaultValue = []

const mockLocalGroupsProvider = () => {
  jest.doMock('../../../../providers/LocalGroupsProvider', () => {
    const Context = React.createContext([])
    const { Provider } = Context
    return {
      Context,
      Provider,
    }
  })
  return require('../../../../providers/LocalGroupsProvider').Provider
}

const mockDynamicsOverrideProfilesProvider = () => {
  jest.doMock('../../../../providers/DynamicsOverrideProfilesProvider', () => {
    const Context = React.createContext([])
    const { Provider } = Context
    return {
      Context,
      Provider,
    }
  })
  return require('../../../../providers/DynamicsOverrideProfilesProvider').Provider
}

const mockITPolicyOverrideProfiles = () => {
  jest.doMock('../../../../providers/ITPolicyOverrideProfilesProvider', () => {
    const Context = React.createContext([])
    const { Provider } = Context
    return {
      Context,
      Provider,
    }
  })
  return require('../../../../providers/ITPolicyOverrideProfilesProvider').Provider
}

const mockAvailableActionsProvider = () => {
  jest.doMock('../../../../providers/AvailableActionsProvider', () => {
    const Context = React.createContext([])
    const { Provider } = Context
    return {
      Context,
      Provider,
    }
  })
  return require('../../../../providers/AvailableActionsProvider').Provider
}

const prepareComponent = (
  props,
  providedGroups = defaultValue,
  providedProfiles = defaultValue,
  providedPolicyProfiels = defaultValue,
  providedActions = {
    data: AVAILABLE_ACTIONS,
  },
) => {
  const LocalGroupsProviderMock = mockLocalGroupsProvider()
  const DynamicsOverrideProfilesProviderMock = mockDynamicsOverrideProfilesProvider()
  const ITPolicyOverrideProfilesMock = mockITPolicyOverrideProfiles()
  const AvailableActionsMock = mockAvailableActionsProvider()

  const ActionsMenu = require('./ActionsMenu').default
  return () => (
    <LocalGroupsProviderMock value={providedGroups}>
      <DynamicsOverrideProfilesProviderMock value={providedProfiles}>
        <ITPolicyOverrideProfilesMock value={providedPolicyProfiels}>
          <AvailableActionsMock value={providedActions}>
            <ActionsMenu {...defaultProps} {...props} />
          </AvailableActionsMock>
        </ITPolicyOverrideProfilesMock>
      </DynamicsOverrideProfilesProviderMock>
    </LocalGroupsProviderMock>
  )
}

const createSut = (props, providedGroups, providedProfiles, providedPolicyProfiles, providedActions) => {
  const Component = prepareComponent(props, providedGroups, providedProfiles, providedPolicyProfiles, providedActions)
  return render(<Component />)
}

const flushPromises = () => new Promise(setTimeout)

const clickOnAddAction = async sut => {
  const text = 'Add action'
  const addAction = sut.getByTitle(text)
  act(() => {
    fireEvent.click(addAction)
  })
  await flushPromises()
}

const clickOnModalAssignButton = async sut => {
  const text = 'Assign'
  const assignButton = sut.getByText(text)
  act(() => {
    fireEvent.click(assignButton)
  })
  await flushPromises()
}
const clickOpenBlackBerryDynamicsAppsActionMenu = async sut => {
  const text = 'BlackBerry Dynamics apps action'
  const openDynamicsAppsActionMenu = sut.getByText(text)
  act(() => {
    fireEvent.click(openDynamicsAppsActionMenu)
  })
  await flushPromises()
}

const clickOpenDeviceActionMenu = async sut => {
  const text = 'Device action'
  const openDynamicsAppsActionMenu = sut.getByText(text)
  act(() => {
    fireEvent.click(openDynamicsAppsActionMenu)
  })
  await flushPromises()
}

const clickOnElement = async (sut, elementText) => {
  const elementToBeClicked = sut.getByText(elementText)
  act(() => {
    fireEvent.click(elementToBeClicked)
  })
  await flushPromises()
}

const mockChangeGracePeriod = async (sut, value) => {
  const gracePeriodInput = sut.getByLabelText('Grace period input')
  await act(async () => {
    fireEvent.input(gracePeriodInput, { target: { value: value } })
  })
  return gracePeriodInput
}
describe('ActionsMenu', () => {
  afterEach(cleanup)

  it('should render add button', () => {
    const sut = createSut()

    const addAction = sut.getByTitle('Add action')

    expect(addAction).toBeTruthy()
  })

  it('should not render add button', () => {
    const sut = createSut({ canEdit: false })

    const addAction = sut.queryByTitle('Add action')

    expect(addAction).toBeFalsy()
  })

  describe('main menu', () => {
    it('should be rendered with assign to group option', async () => {
      const sut = createSut()

      await act(async () => clickOnAddAction(sut))

      expect(sut.getByText('Assign to UEM group')).toBeTruthy()
    })

    it('should be rendered with assign app option when requestion app actions are not blocked', async () => {
      const props = { areBlockRequestingActionsVisible: true }
      const sut = createSut(props)

      await act(async () => clickOnAddAction(sut))

      expect(sut.queryByText('BlackBerry Dynamics apps action')).toBeTruthy()
    })

    it('should rendered only Assign BlackBerry Dynamics override profile option when requesting app actions are blocked', async () => {
      const props = { areBlockRequestingActionsVisible: false }
      useClientParamsMock.mockReturnValueOnce({ features: { DynamicsProfiles: true, MdmActions: true } })
      const sut = createSut(props)
      await act(async () => clickOnAddAction(sut))
      await clickOpenBlackBerryDynamicsAppsActionMenu(sut)

      expect(sut.queryByText('Assign BlackBerry Dynamics override profile')).toBeTruthy()
      expect(sut.queryByText('Block all BlackBerry Dynamics apps')).toBeFalsy()
      expect(sut.queryByText('Block the BlackBerry Dynamics app that initiated the request')).toBeFalsy()
    })

    it('should not render AAssign BlackBerry Dynamics override profile option when the DynamicsProfiles powerup is disabled', async () => {
      useClientParamsMock.mockReturnValueOnce({ features: { DynamicsProfiles: false, MdmActions: false } })
      const sut = createSut()
      await act(async () => clickOnAddAction(sut))

      expect(sut.queryByText('Assign BlackBerry Dynamics override profile')).toBeFalsy()
    })
  })

  describe('assign dynamics app action submenu', () => {
    const addActionMock = jest.fn()
    let sut

    afterEach(() => {
      addActionMock.mockClear()
    })

    describe('sssign BlackBerry Dynamics override profile', () => {
      const mouseOverAssignBlackBerryDynamicsprofileOption = async sut => {
        const text = 'Assign BlackBerry Dynamics override profile'
        const blackBerryDynamicAppsOption = sut.getByText(text)
        act(() => {
          fireEvent.mouseOver(blackBerryDynamicAppsOption)
        })
        await flushPromises()
      }

      beforeEach(async () => {
        const props = {
          ...defaultProps,
          addAction: addActionMock,
        }
        const providedProfiles = {
          data: [
            { profileGuid: 'PROFILE_GUID_1', name: 'PROFILE_NAME_1' },
            { profileGuid: 'PROFILE_GUID_2', name: 'PROFILE_NAME_2' },
          ],
        }
        sut = createSut(props, [], providedProfiles)
        useClientParamsMock.mockReturnValueOnce({ features: { DynamicsProfiles: true, MdmActions: true } })
        await act(async () => {
          await clickOnAddAction(sut)
          await clickOpenBlackBerryDynamicsAppsActionMenu(sut)
          await mouseOverAssignBlackBerryDynamicsprofileOption(sut)
        })
      })

      it('should be rendered with the profiles visible when the assign profile option is hovered', async () => {
        const { getByText } = sut

        expect(getByText('PROFILE_NAME_1')).toBeTruthy()
        expect(getByText('PROFILE_NAME_2')).toBeTruthy()
      })

      it('should call the add action function when the given profile is clicked', () => {
        act(() => {
          fireEvent.click(sut.getByText('PROFILE_NAME_1'))
        })

        expect(addActionMock).toHaveBeenCalledWith({
          actionAttributes: { profileGuid: 'PROFILE_GUID_1', profileName: 'PROFILE_NAME_1' },
          ...ActionTypes.AppAssignDynamicsProfile,
        })
      })
    })

    describe('add action', () => {
      const props = {
        ...defaultProps,
        addAction: addActionMock,
        areBlockRequestingActionsVisible: true,
      }

      const clickBlockAllApps = async sut => {
        const text = 'Block all BlackBerry Dynamics apps'
        const blockAppsAction = sut.getByText(text)
        act(() => {
          fireEvent.click(blockAppsAction)
        })
        await flushPromises()
      }

      const clickBlockInitiatingApps = async sut => {
        const text = 'Block the BlackBerry Dynamics app that initiated the request'
        const blockAppsAction = sut.getByText(text)
        act(() => {
          fireEvent.click(blockAppsAction)
        })
        await flushPromises()
      }

      it('should be called when the block all apps option is clicked and a modal is confirmed', async () => {
        sut = createSut(props)
        await act(async () => {
          await clickOnAddAction(sut)
          await clickOpenBlackBerryDynamicsAppsActionMenu(sut)
          await clickBlockAllApps(sut)

          await clickOnModalAssignButton(sut)
        })

        expect(addActionMock).toHaveBeenCalledWith({ actionAttributes: {}, ...ActionTypes.UemBlockApplications })
      })

      it('should be called when the block initiating app option is clicked and a modal is confirmed', async () => {
        sut = createSut(props)
        await act(async () => {
          await clickOnAddAction(sut)

          await clickOpenBlackBerryDynamicsAppsActionMenu(sut)
          await clickBlockInitiatingApps(sut)
          await clickOnModalAssignButton(sut)
        })

        expect(addActionMock).toHaveBeenCalledWith({ actionAttributes: {}, ...ActionTypes.AppBlockApplication })
      })
    })

    it('should has disabled the block all apps option when the action has been already assigned', async () => {
      const props = {
        ...defaultProps,
        areBlockRequestingActionsVisible: true,
        actions: [{ ...ActionTypes.UemBlockApplications }],
      }
      useClientParamsMock.mockReturnValueOnce({ features: { MdmActions: true } })
      sut = createSut(props)
      await act(async () => clickOnAddAction(sut))
      await clickOpenBlackBerryDynamicsAppsActionMenu(sut)

      const blockAllAppsOption = sut.getByText('Block all BlackBerry Dynamics apps').closest('div')

      expect(blockAllAppsOption).toHaveClass('disabledOption')
    })

    it('should has disabled the block initiating app option when the action has been already assigned', async () => {
      const props = {
        ...defaultProps,
        areBlockRequestingActionsVisible: true,
        actions: [{ ...ActionTypes.AppBlockApplication }],
      }
      sut = createSut(props)
      await act(async () => clickOnAddAction(sut))
      await clickOpenBlackBerryDynamicsAppsActionMenu(sut)

      const blockInitiatingAppOption = sut.getByText('Block the BlackBerry Dynamics app that initiated the request').closest('div')

      expect(blockInitiatingAppOption).toHaveClass('disabledOption')
    })
  })

  describe('assign group submenu', () => {
    const mouseOverGroupAssignOption = async sut => {
      const assignGroupOption = sut.getByText('Assign to UEM group')
      act(() => {
        fireEvent.mouseOver(assignGroupOption)
      })
      await flushPromises()
    }

    describe('groups provided', () => {
      const addActionMock = jest.fn()
      let sut

      afterEach(() => {
        addActionMock.mockClear()
      })

      beforeEach(async () => {
        const props = {
          ...defaultProps,
          addAction: addActionMock,
        }
        const providedGroups = {
          data: {
            localGroups: [
              { guid: 'GROUP_GUID_1', name: 'GROUP_NAME_1' },
              { guid: 'GROUP_GUID_2', name: 'GROUP_NAME_2' },
            ],
          },
        }
        sut = createSut(props, providedGroups)

        await act(async () => clickOnAddAction(sut))
        await mouseOverGroupAssignOption(sut)
      })

      it('should be rendered with groups visible when the assign group option is hovered', async () => {
        const { getByText } = sut

        expect(getByText('GROUP_NAME_1')).toBeTruthy()
        expect(getByText('GROUP_NAME_2')).toBeTruthy()
      })

      it('should call the add action function when a group is clicked', () => {
        act(() => {
          fireEvent.click(sut.getByText('GROUP_NAME_1'))
        })

        expect(addActionMock).toHaveBeenCalledWith({
          actionAttributes: { groupGuid: 'GROUP_GUID_1', groupName: 'GROUP_NAME_1' },
          ...ActionTypes.UemAssignGroup,
        })
      })
    })

    it('should be rendered when the assign group option is hovered', async () => {
      const providedGroups = { data: { localGroups: [] } }
      const sut = createSut({}, providedGroups)

      await act(async () => clickOnAddAction(sut))
      await mouseOverGroupAssignOption(sut)

      expect(sut.getByText('No actions available')).toBeTruthy()
    })

    it('should has disabled the block all apps option when the action has been already assigned', async () => {
      const props = {
        ...defaultProps,
        areBlockRequestingActionsVisible: true,
        actions: [{ ...ActionTypes.UemAssignGroup, actionAttributes: { groupGuid: 'GROUP_GUID_1' } }],
      }
      const providedGroups = {
        data: {
          localGroups: [{ guid: 'GROUP_GUID_1', name: 'GROUP_NAME_1' }],
        },
      }
      const sut = createSut(props, providedGroups)
      await act(async () => clickOnAddAction(sut))
      await mouseOverGroupAssignOption(sut)

      const blockAllAppsOption = sut.getByText('GROUP_NAME_1').closest('div')

      expect(blockAllAppsOption).toHaveClass('disabledOption')
    })
  })

  describe('device action submenu', () => {
    const mouseOverOption = async (sut, optionText) => {
      const asignPolicyOption = sut.getByText(optionText)
      act(() => {
        fireEvent.mouseOver(asignPolicyOption)
      })
      await flushPromises()
    }

    const mouseOverAssignITPolicyOption = sut => mouseOverOption(sut, 'Assign IT policy override')

    describe('basic device action submenu render', () => {
      it('should be rendered with the Device action option', async () => {
        useClientParamsMock.mockReturnValueOnce({ features: { MdmActions: true } })
        const sut = createSut()
        await act(async () => clickOnAddAction(sut))

        expect(sut.getByText('Device action')).toBeTruthy()
      })

      it('should render with Lock work profile text', async () => {
        useClientParamsMock.mockReturnValueOnce({ features: { MdmActions: true } })
        const props = {
          ...defaultProps,
          areMdmDeviceActionsVisible: true,
        }
        const sut = createSut(props)
        await act(async () => clickOnAddAction(sut))
        await clickOpenDeviceActionMenu(sut)

        expect(sut.getByText('Lock work profile')).toBeTruthy()
      })

      it('should render the Lock work profile modal with a correct default grace period value', async () => {
        useClientParamsMock.mockReturnValueOnce({ features: { MdmActions: true } })

        const props = {
          ...defaultProps,
          areMdmDeviceActionsVisible: true,
        }
        const sut = createSut(props)
        await act(async () => {
          await clickOnAddAction(sut)
          await clickOpenDeviceActionMenu(sut)
          await clickOnElement(sut, 'Lock work profile')
        })
        const gracePeriodInput = await mockChangeGracePeriod(sut, '60')

        expect(gracePeriodInput.value).toBe('60')
        expect(sut.getAllByText('Lock work profile')).toBeTruthy()
      })

      it('should render with Lock device text', async () => {
        useClientParamsMock.mockReturnValueOnce({ features: { MdmActions: true } })
        const props = {
          ...defaultProps,
          areMdmDeviceActionsVisible: true,
        }
        const sut = createSut(props)
        await act(async () => {
          await clickOnAddAction(sut)
          await clickOpenDeviceActionMenu(sut)
        })

        expect(sut.getByText('Lock device')).toBeTruthy()
      })

      it('should render the Lock device modal with a correct default grace period value', async () => {
        useClientParamsMock.mockReturnValueOnce({ features: { MdmActions: true } })
        const props = {
          ...defaultProps,
          areMdmDeviceActionsVisible: true,
        }
        const sut = createSut(props)
        await act(async () => {
          await clickOnAddAction(sut)
          await clickOpenDeviceActionMenu(sut)
          await clickOnElement(sut, 'Lock device')
        })
        const gracePeriodInput = await mockChangeGracePeriod(sut, '60')

        expect(gracePeriodInput.value).toBe('60')
        expect(sut.getAllByText('Lock device')[1]).toBeTruthy()
      })

      it('should render with Assign IT policy override text', async () => {
        useClientParamsMock.mockReturnValueOnce({ features: { MdmActions: true } })
        const sut = createSut()
        await act(async () => {
          await clickOnAddAction(sut)
          await clickOpenDeviceActionMenu(sut)
        })

        expect(sut.getByText('Assign IT policy override')).toBeTruthy()
      })

      it('should render no policy available text when data is not provided', async () => {
        useClientParamsMock.mockReturnValueOnce({ features: { MdmActions: true } })
        const sut = createSut()
        await act(async () => {
          await clickOnAddAction(sut)
          await clickOpenDeviceActionMenu(sut)
          await mouseOverAssignITPolicyOption(sut)
        })

        expect(sut.getByText('No policy available')).toBeTruthy()
      })

      it('should not render Device action when the MdmActions powerup is disabled', async () => {
        useClientParamsMock.mockReturnValueOnce({ features: { DynamicsProfiles: true, MdmActions: false } })
        const sut = createSut()

        await act(async () => clickOnAddAction(sut))

        expect(sut.queryByText('Device action')).toBeFalsy()
      })
    })

    describe('assign IT policy override', () => {
      const addActionMock = jest.fn()

      const props = {
        ...defaultProps,
        addAction: addActionMock,
      }
      const providedITPolicyProfiles = {
        data: [
          { profileGuid: 'IT_POLICY_PROFILE_GUID_1', name: 'IT_POLICY_PROFILE_NAME_1' },
          { profileGuid: 'IT_POLICY_PROFILE_GUID_2', name: 'IT_POLICY_PROFILE_NAME_2' },
        ],
      }

      it('should be rendered with the profiles visible when the assign profile option is hovered', async () => {
        useClientParamsMock.mockReturnValueOnce({ features: { MdmActions: true } })
        const sut = createSut(props, defaultValue, defaultValue, providedITPolicyProfiles)
        await act(async () => {
          await clickOnAddAction(sut)
          await clickOpenDeviceActionMenu(sut)
          await mouseOverAssignITPolicyOption(sut)
        })
        const { getByText } = sut

        expect(getByText('IT_POLICY_PROFILE_NAME_1')).toBeTruthy()
        expect(getByText('IT_POLICY_PROFILE_NAME_2')).toBeTruthy()
      })

      it('should call the add action function when the given policy profile is clicked', async () => {
        useClientParamsMock.mockReturnValueOnce({ features: { MdmActions: true } })
        const sut = createSut(props, defaultValue, defaultValue, providedITPolicyProfiles)
        await act(async () => {
          await clickOnAddAction(sut)
          await clickOpenDeviceActionMenu(sut)
          await mouseOverAssignITPolicyOption(sut)
        })
        act(() => {
          fireEvent.click(sut.getByText('IT_POLICY_PROFILE_NAME_2'))
        })

        expect(addActionMock).toHaveBeenCalledWith({
          actionAttributes: { profileGuid: 'IT_POLICY_PROFILE_GUID_2', profileName: 'IT_POLICY_PROFILE_NAME_2' },
          ...ActionTypes.MdmAssignITPolicyOverrideProfile,
        })
      })
    })

    describe.each`
      actionOption           | actionType
      ${'Lock work profile'} | ${ActionTypes.MdmLockWorkspace}
      ${'Lock device'}       | ${ActionTypes.MdmLockDevice}
    `('%actionOption action assing', ({ actionOption, actionType }) => {
      const addActionMock = jest.fn()
      const errorLabel = 'Grace period error'
      const props = {
        ...defaultProps,
        addAction: addActionMock,
        areMdmDeviceActionsVisible: true,
      }

      beforeEach(() => {
        useClientParamsMock.mockReturnValueOnce({ features: { MdmActions: true } })
      })

      it.each`
        value  | actionAttributes
        ${1}   | ${getActionAttributes(1)}
        ${66}  | ${getActionAttributes(66)}
        ${480} | ${getActionAttributes(480)}
      `(
        `should be called with correct action attributes and the error message should not appear when the ${actionOption} option is clicked, gracePeriod is set to $value and a modal is confirmed`,
        async ({ value, isErrorVisible, errorText, addAction, actionAttributes }) => {
          // given
          const sut = createSut(props)

          // when
          await act(async () => {
            await clickOnAddAction(sut)
            await clickOpenDeviceActionMenu(sut)
            await clickOnElement(sut, actionOption)
          })

          const gracePeriodInput = await mockChangeGracePeriod(sut, value)
          await act(async () => clickOnModalAssignButton(sut))

          // then
          expect(gracePeriodInput.value).toBe(String(value))
          expect(addActionMock).toHaveBeenCalledWith({ actionAttributes: actionAttributes, ...actionType })
          expect(sut.queryByLabelText(errorLabel)).toBeFalsy()
        },
      )

      it.each`
        value  | expectedTextError
        ${-1}  | ${PERIOD_EXCEEDED_ERROR_TEXT}
        ${0}   | ${PERIOD_EXCEEDED_ERROR_TEXT}
        ${481} | ${PERIOD_EXCEEDED_ERROR_TEXT}
        ${666} | ${PERIOD_EXCEEDED_ERROR_TEXT}
      `(
        `should not be called and the error message should appear when the ${actionOption} option is clicked, gracePeriod is set to $value and a modal is confirmed`,
        async ({ value, expectedTextError }) => {
          // given
          const sut = createSut(props)

          // when
          await act(async () => {
            await clickOnAddAction(sut)
            await clickOpenDeviceActionMenu(sut)
            await clickOnElement(sut, actionOption)
          })

          const gracePeriodInput = await mockChangeGracePeriod(sut, value)
          await act(async () => clickOnModalAssignButton(sut))

          // then
          expect(gracePeriodInput.value).toBe(String(value))
          expect(addActionMock).toHaveBeenCalledTimes(0)
          expect(sut.queryByLabelText(errorLabel).textContent).toBe(expectedTextError)
        },
      )
    })

    describe('disable work profile action', () => {
      it('should render the action correctly when the action visibility is set to true', async () => {
        useClientParamsMock.mockReturnValueOnce({ features: { MdmActions: true } })
        const props = { areMdmDeviceActionsVisible: true }
        const sut = createSut(props)

        await act(async () => {
          await clickOnAddAction(sut)
          await clickOpenDeviceActionMenu(sut)
        })

        expect(sut.queryByText('Disable work profile')).toBeTruthy()
      })

      it('should not render the action when the action visibility is set to false', async () => {
        useClientParamsMock.mockReturnValueOnce({ features: { MdmActions: true } })
        const props = { areMdmDeviceActionsVisible: false }
        const sut = createSut(props)

        await act(async () => {
          await clickOnAddAction(sut)
          await clickOpenDeviceActionMenu(sut)
        })

        expect(sut.queryByText('Disable work profile')).toBeFalsy()
      })

      it('should render a disabled all mdm actions when the action has been already assigned', async () => {
        useClientParamsMock.mockReturnValueOnce({ features: { MdmActions: true } })
        const props = {
          ...defaultProps,
          areMdmDeviceActionsVisible: true,
          actions: [{ ...ActionTypes.MdmDisableWorkspace }],
        }

        const sut = createSut(props)
        await act(async () => {
          await clickOnAddAction(sut)
          await clickOpenDeviceActionMenu(sut)
        })

        const mdmDisableWorkspaceAction = sut.getByText('Disable work profile').closest('div')
        const mdmLockDeviceAction = sut.getByText('Lock device').closest('div')
        const mdmLockWorkspaceAction = sut.getByText('Lock work profile').closest('div')
        expect(mdmDisableWorkspaceAction).toHaveClass('disabledOption')
        expect(mdmLockDeviceAction).toHaveClass('disabledOption')
        expect(mdmLockWorkspaceAction).toHaveClass('disabledOption')
      })
    })

    describe('available actions', () => {
      it('actions not returned from AvailableActionsProvider are disabled', async () => {
        useClientParamsMock.mockReturnValueOnce({ features: { MdmActions: true } })
        const props = {
          ...defaultProps,
          areMdmDeviceActionsVisible: true,
          actions: [],
        }

        const sut = createSut(props, defaultValue, defaultValue, defaultValue, {
          data: [
            { actionType: 'mdm:disableWorkspace', pillarTypeId: 'sis.blackberry.com', client: null },
            { actionType: 'mdm:lockWorkspace', pillarTypeId: 'sis.blackberry.com', client: null },
          ],
        })
        await act(async () => {
          await clickOnAddAction(sut)
          await clickOpenDeviceActionMenu(sut)
        })

        const mdmDisableWorkspaceAction = sut.getByText('Disable work profile').closest('div')
        const mdmLockDeviceAction = sut.getByText('Lock device').closest('div')
        const mdmLockWorkspaceAction = sut.getByText('Lock work profile').closest('div')
        const uemAssignGroupAction = sut.getByText('Assign to UEM group').closest('div')
        expect(mdmDisableWorkspaceAction).toHaveClass('menuOption menuItem')
        expect(mdmLockDeviceAction).toHaveClass('disabledOption')
        expect(mdmLockWorkspaceAction).toHaveClass('menuOption menuItem')
        expect(uemAssignGroupAction).toHaveClass('menuItemDisabled')
      })

      it('should render the Lock device modal with a grace period provided from AvailableActionsProvider', async () => {
        useClientParamsMock.mockReturnValueOnce({ features: { MdmActions: true } })

        const props = {
          ...defaultProps,
          areMdmDeviceActionsVisible: true,
        }
        const sut = createSut(props, defaultValue, defaultValue, defaultValue, {
          data: [
            {
              actionType: 'mdm:lockDevice',
              pillarTypeId: 'sis.blackberry.com',
              client: {
                userInputs: {
                  gracePeriod: 2400,
                },
                needUpdated: null,
              },
            },
          ],
        })
        await act(async () => {
          await clickOnAddAction(sut)
          await clickOpenDeviceActionMenu(sut)
          await clickOnElement(sut, 'Lock device')
        })
        const gracePeriodInput = sut.getByLabelText('Grace period input')

        expect(gracePeriodInput.value).toBe('40')
        expect(sut.getAllByText('Lock device')).toBeTruthy()
      })
    })
  })
})
