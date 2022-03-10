//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { FeatureName } from '@ues-data/shared-types'
import { ADD_NETWORK_SERVICES_URL, AriaElementLabel, CommonFns } from '@ues/assets-e2e'

import {
  getInputGroup,
  validateInputGroupRemove,
  validateInputGroupsValues,
  validateInputGroupValueUpdate,
  validateUnsavedChangesDialog,
} from '../../../support/utils'

const { getButton, visitView } = CommonFns(I)

const NETWORK_SERVICE_NAME = 'blackberrysquare'
const NETWORK_SERVICE_DESTINATION = '1.1.1.1'
const MIN_NAME_LENGTH = 3

describe('Settings: Network Service Editor', () => {
  before(() => {
    visitView(ADD_NETWORK_SERVICES_URL, { [FeatureName.UESBigAclEnabled]: true }, [
      'components',
      'gateway-settings',
      'general/form',
    ])
  })

  context('Network Service Editor', () => {
    const FIRST_ADDRESS_FIELD = 0
    const FIRST_COL_NEW_GRID_ITEM_NAME = 'grid-item-10'
    const SECOND_COL_NEW_GRID_ITEM_NAME = 'grid-item-10'
    const ADDRESSES = ['12.244.233.165', '10.100.100.125']

    it('should add a new address', () => {
      getInputGroup(FIRST_ADDRESS_FIELD).clear().type(ADDRESSES[0])

      validateInputGroupsValues([ADDRESSES[0]])
    })

    it('should edit an address', () => {
      validateInputGroupValueUpdate(FIRST_ADDRESS_FIELD, ADDRESSES[1])
    })

    it('should remove an address', () => {
      getButton(AriaElementLabel.InputGroupAddButton).eq(0).should('not.be.disabled').click()
      validateInputGroupRemove(0)
    })

    // TODO Add validation for Ports after merge Port Name drop down changes

    it('should add a new grid row', () => {
      I.findByRole('gridcell', { name: FIRST_COL_NEW_GRID_ITEM_NAME }).should('not.exist')
      I.findByRole('gridcell', { name: SECOND_COL_NEW_GRID_ITEM_NAME }).should('not.exist')

      getButton(I.translate('components:inputGroups.buttonAdd')).should('not.be.disabled').click()

      I.findByRole('gridcell', { name: FIRST_COL_NEW_GRID_ITEM_NAME }).should('exist')
      I.findByRole('gridcell', { name: SECOND_COL_NEW_GRID_ITEM_NAME }).should('exist')
      getButton('remove-grid-row-button-1').should('exist')
    })

    it('should remove a grid row', () => {
      getButton('remove-grid-row-button-1').should('not.be.disabled').click()

      I.findByRole('gridcell', { name: FIRST_COL_NEW_GRID_ITEM_NAME }).should('not.exist')
      I.findByRole('gridcell', { name: SECOND_COL_NEW_GRID_ITEM_NAME }).should('not.exist')

      getButton('remove-grid-row-button-1').should('not.exist')
    })

    it('should show a dialog when there are unsaved changes', () => {
      getInputGroup(FIRST_ADDRESS_FIELD).clear().type(ADDRESSES[0])
    })

    it('should disable an action button when there is no data', () => {
      I.findByRole('button', { name: AriaElementLabel.StickyActionsSaveButton }).should('be.disabled')
    })

    it('should disable an action button and show a validation error message for an invalid name', () => {
      I.findByRole('textbox', { name: 'Name' }).clear().type('N')
      I.findByText(I.translate('general/form:validationErrors.minLength', { min: MIN_NAME_LENGTH })).should('exist')
      I.findByRole('button', { name: AriaElementLabel.StickyActionsSaveButton }).should('be.disabled')
    })

    it('should disable an action button and show a validation error message for name with leading spaces', () => {
      I.findByRole('textbox', { name: 'Name' }).clear().type(' Name')
      I.findByText(I.translate('general/form:validationErrors.whitespace')).should('exist')
      I.findByRole('button', { name: AriaElementLabel.StickyActionsSaveButton }).should('be.disabled')
    })

    it('should disable an action button and show a validation error message for name with trailing spaces', () => {
      I.findByRole('textbox', { name: 'Name' }).clear().type('Name ')
      I.findByText(I.translate('general/form:validationErrors.whitespace')).should('exist')
      I.findByRole('button', { name: AriaElementLabel.StickyActionsSaveButton }).should('be.disabled')
    })

    it('should disable an action button and show a validation error message for an invalid target set', () => {
      I.findByRole('grid').findAllByRole('textbox').eq(FIRST_ADDRESS_FIELD).type('1.1.')
      I.findByText(I.translate('networkServices.destinationValidationMessage')).should('exist')
      I.findByRole('button', { name: AriaElementLabel.StickyActionsSaveButton }).should('be.disabled')
    })

    it('should disable an action button for an empty target set and no network service reference selected', () => {
      I.findByRole('textbox', { name: 'Name' }).clear().type(NETWORK_SERVICE_NAME)
      I.findByRole('button', { name: 'remove-grid-row-button-0' }).click()
      I.findByRole('button', { name: AriaElementLabel.StickyActionsSaveButton }).should('be.disabled')
    })

    it('should enable an action button when a name is valid and the target set is valid', () => {
      I.findByRole('textbox', { name: 'Name' }).clear().type(NETWORK_SERVICE_NAME)
      getButton(I.translate('components:inputGroups.buttonAdd')).should('not.be.disabled').click()
      I.findByRole('grid').findAllByRole('textbox').eq(FIRST_ADDRESS_FIELD).clear().type(NETWORK_SERVICE_DESTINATION)
      I.findByRole('button', { name: AriaElementLabel.StickyActionsSaveButton }).should('not.be.disabled')
    })

    it('should enable an action button when a name is valid and the Network Service reference is selected', () => {
      I.findByRole('textbox', { name: 'Name' }).clear().type('Network Service')
      I.findByRole('combobox').click()
      I.findAllByRole('option').eq(1).click()
      I.findByRole('textbox', { name: 'Name' }).focus()
      I.findByRole('grid').findAllByRole('textbox').eq(0).clear()
      I.findByRole('button', { name: AriaElementLabel.StickyActionsSaveButton }).should('not.be.disabled')
    })

    it('should show tooltips for columns', () => {
      I.findByRole('button', { name: AriaElementLabel.TargetSetShowDestinationTooltipButton }).click()
      I.findByText(I.translate('networkServices.tooltipAddress')).should('exist')
      I.findByRole('button', { name: AriaElementLabel.TargetSetShowProtocolTooltipButton }).click()
      I.findByText(I.translate('networkServices.tooltipProtocol')).should('exist')

      validateUnsavedChangesDialog(true)
    })
  })
})
