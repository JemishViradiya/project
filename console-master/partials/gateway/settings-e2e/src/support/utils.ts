//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { apolloQuery } from '@ues-behaviour/shared-e2e'
import { AriaElementLabel, CommonFns } from '@ues/assets-e2e'

const { getButton } = CommonFns(I)

const DEFAULT_INPUT_GROUPS_WRAPPER = 'grid'

export const getInputGroups = (wrapper = DEFAULT_INPUT_GROUPS_WRAPPER) => {
  return I.findByRole(wrapper).findAllByRole('textbox')
}

export const getInputGroup = (index: number, wrapper?: string) => {
  return getInputGroups(wrapper).eq(index)
}

export const validateInputGroupsValues = (testData: string[], wrapper?: string) => {
  getInputGroups(wrapper).should('have.length', testData.length)

  getInputGroups(wrapper).each((input, index) => {
    I.wrap(input)
      .invoke('val')
      .then(val => expect(val).eq(testData[index]))
  })
}

export const validateInputGroupValueUpdate = (index: number, value: string, wrapper?: string) => {
  getInputGroup(index, wrapper).clear().type(value)

  getInputGroup(index, wrapper)
    .invoke('val')
    .then(val => expect(val).eq(value))
}

export const validateInputGroupRemove = (index: number, wrapper?: string) => {
  let value = null

  getInputGroup(index, wrapper)
    .invoke('val')
    .then(val => (value = val))

  getInputGroup(index, wrapper).should('exist')
  getButton(`remove-input-group-button-${index}`).click()

  getInputGroups(wrapper).each(input => {
    I.wrap(input)
      .invoke('val')
      .then(val => expect(val).not.eq(value))
  })
}

export const validateUnsavedChangesDialog = (saveChanges = false) => {
  const headingName = I.translate('common.unsavedChangesTitle')
  const cancelButtonName = I.translate('common.buttonCancel')
  const confirmButtonName = I.translate('common.leavePage')

  I.findByRoleOptionsWithin('generic', { name: I.translate(AriaElementLabel.FormButtonPanel) }, 'button', {
    name: AriaElementLabel.DiscardChangesButton,
  }).click()

  I.findByRole('heading', { name: headingName }).should('exist')
  I.findByRoleWithin('dialog', 'button', { name: cancelButtonName }).should('exist')
  I.findByRoleWithin('dialog', 'button', { name: confirmButtonName }).should('exist')

  if (saveChanges) {
    I.findByRoleWithin('dialog', 'button', { name: confirmButtonName }).click()
  } else {
    I.findByRoleWithin('dialog', 'button', { name: cancelButtonName }).click()
  }
}

export const getMockedIsAclQueryVisitOptions = (result: boolean) => ({
  onBeforeLoad: contentWindow => {
    contentWindow.model.mockAll({
      id: 'bis.isACL',
      data: apolloQuery({
        queryName: 'isACL',
        result,
      }),
    })
  },
})
