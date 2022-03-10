import React from 'react'

import { render } from '@testing-library/react'

import ActionTypes from '../../../components/ActionType'
import Action from './Action'

const t = global.T()
const defaultProps = {
  t: translationId => t(translationId),
  deleteAction: () => {},
}

const createSut = props => {
  return render(<Action {...defaultProps} {...props} />)
}

describe('riskEngineTable Common tests', () => {
  it('should render delete button', () => {
    const actionType = ActionTypes.UemAssignGroup.actionType

    const sut = createSut({ actionType })

    expect(sut.queryAllByRole('button').length).toBe(1)
  })

  it('should not render delete button when is not editable', () => {
    const actionType = ActionTypes.UemAssignGroup.actionType
    const canEdit = false

    const sut = createSut({ actionType, canEdit })

    expect(sut.queryAllByRole('button').length).toBe(0)
  })

  describe('action', () => {
    it.each`
      actionName                                                       | actionType                                                 | expectedName                                                      | actionAttributes
      ${'UemAssignGroup with specified groupName'}                     | ${ActionTypes.UemAssignGroup.actionType}                   | ${'mockGroupName'}                                                | ${{ groupName: 'mockGroupName' }}
      ${'UemAssignGroup with undefined groupName'}                     | ${ActionTypes.UemAssignGroup.actionType}                   | ${'Unknown group name'}                                           | ${null}
      ${'AppBlockApplication'}                                         | ${ActionTypes.AppBlockApplication.actionType}              | ${'Block the BlackBerry Dynamics app that initiated the request'} | ${null}
      ${'UemBlockApplications'}                                        | ${ActionTypes.UemBlockApplications.actionType}             | ${'Block all BlackBerry Dynamics apps'}                           | ${null}
      ${'AppAssignDynamicsProfile with specified profileName'}         | ${ActionTypes.AppAssignDynamicsProfile.actionType}         | ${'mockDynamicsProfile'}                                          | ${{ profileName: 'mockDynamicsProfile' }}
      ${'AppAssignDynamicsProfile with undefined profileName'}         | ${ActionTypes.AppAssignDynamicsProfile.actionType}         | ${'Unknown profile name'}                                         | ${null}
      ${'MdmAssignITPolicyOverrideProfile with specified profileName'} | ${ActionTypes.MdmAssignITPolicyOverrideProfile.actionType} | ${'mockITPolicyOverrideProfile'}                                  | ${{ profileName: 'mockITPolicyOverrideProfile' }}
      ${'MdmAssignITPolicyOverrideProfile with undefined profileName'} | ${ActionTypes.MdmAssignITPolicyOverrideProfile.actionType} | ${'Unknown policy name'}                                          | ${null}
      ${'MdmLockWorkspace'}                                            | ${ActionTypes.MdmLockWorkspace.actionType}                 | ${'Lock work profile'}                                            | ${null}
      ${'MdmLockDevice'}                                               | ${ActionTypes.MdmLockDevice.actionType}                    | ${'Lock device'}                                                  | ${null}
      ${'MdmDisableWorkspace'}                                         | ${ActionTypes.MdmDisableWorkspace.actionType}              | ${'Disable work profile'}                                         | ${null}
    `('$actionName is rendered correctly', async ({ actionType, expectedName, actionAttributes }) => {
      const { getByText } = createSut({ actionType, actionAttributes })

      expect(getByText(expectedName)).not.toBeNull()
    })
  })
})
