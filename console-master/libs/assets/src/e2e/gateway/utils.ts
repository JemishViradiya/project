//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { FeatureName } from '@ues-data/shared-types'

import {
  COMMON_DELETE_BUTTON,
  COMMON_EDIT_BUTTON,
  CONDITIONS,
  RBAC_NO_ACCESS_MESSAGE,
  RBAC_NO_PERMISSION,
  RBAC_RESOURCE_NOT_FOUND,
  RBAC_RESOURCE_NOT_FOUND_MESSAGE,
  STANDARD_TIMEOUT,
} from './fixtures'
import { AriaElementLabel } from './types'

const KEYBOARD_ESC_INDICATOR = '{esc}'

export const CommonFns = (I: any) => {
  const getButton = (name: string) => I.findAllByRole('button', { name })

  const columnHeaderShould = (condition: string) => I.findByRole('columnheader', { name: 'Order' }).should(condition)

  const getSwitchButton = (name: string) => I.findByRole('checkbox', { name })

  const tableCellShould = (condition: string, name: string) => I.findByRole('cell', { name }).should(condition)

  const tableShould = (condition: string) => I.findByRole('table').should(condition)

  const infiniteTableShould = (condition: string) => I.findByLabelText(AriaElementLabel.InfiniteTable).should(condition)

  const loadingIconShould = (condition: string) => I.findByRole('progressbar', { timeout: STANDARD_TIMEOUT }).should(condition)

  const pressEscape = (cy: any) => cy.get('body').type(KEYBOARD_ESC_INDICATOR)

  const visitView = async (
    path: string,
    additionalLocalStorageFlags: Record<FeatureName | string, boolean> = {},
    additionalTranslationNamespaces: string[] = [],
    options: any = {},
  ) => {
    const translationNamespaces = ['gateway/common', 'formats', ...additionalTranslationNamespaces]
    const localStorageFlags = Object.entries({
      UES_DATA_MOCK: true,
      [FeatureName.SingleNXApp]: false,
      ...additionalLocalStorageFlags,
    })

    await I.loadI18nNamespaces(...translationNamespaces)

    await I.visit(path, {
      ...options,
      onBeforeLoad: contentWindow => {
        if (options.onBeforeLoad) {
          options.onBeforeLoad(contentWindow)
        }
        localStorageFlags.forEach(([name, value]) => contentWindow.localStorage.setItem(name, value.toString()))
      },
    })
  }

  const getTextbox = (text: string) => {
    return I.findByText(text).should(CONDITIONS.BE_VISIBLE).next().findByRole('textbox')
  }

  const validateAccess = (access: boolean) => {
    if (access) {
      I.findByText(I.translate(RBAC_NO_PERMISSION)).should(CONDITIONS.NOT_EXIST)
      I.findByText(I.translate(RBAC_NO_ACCESS_MESSAGE)).should(CONDITIONS.NOT_EXIST)
    } else {
      I.findByText(I.translate(RBAC_NO_PERMISSION)).should(CONDITIONS.BE_VISIBLE)
      I.findByText(I.translate(RBAC_NO_ACCESS_MESSAGE)).should(CONDITIONS.BE_VISIBLE)
    }
  }

  const alertMessageShouldBeEqual = (message: string) => {
    I.findAllByRole('alert').findAllByText(message)
    return I
  }

  const validateNoEditOrDeleteTableIcon = () => {
    I.findAllByRole('row').each((row, index) => {
      if (index !== 0) {
        I.wrap(row)
          .findAllByRole('button', { name: I.translate(COMMON_EDIT_BUTTON) })
          .should(CONDITIONS.NOT_EXIST)
        I.wrap(row)
          .findAllByRole('button', { name: I.translate(COMMON_DELETE_BUTTON) })
          .should(CONDITIONS.NOT_EXIST)
      }
    })
  }

  const validateResourceNotFound = () => {
    I.findByText(I.translate(RBAC_RESOURCE_NOT_FOUND)).should(CONDITIONS.EXIST)
    I.findByText(I.translate(RBAC_RESOURCE_NOT_FOUND_MESSAGE)).should(CONDITIONS.EXIST)
  }

  const getRankCells = () => {
    return I.findAllByRole('cell').get('[data-field=rank]')
  }

  const validateURL = (path: string) => {
    I.location().should(loc => {
      I.expect(loc.hash).to.eq(path)
    })
  }

  return {
    CONDITIONS,
    alertMessageShouldBeEqual,
    columnHeaderShould,
    getButton,
    getSwitchButton,
    getTextbox,
    infiniteTableShould,
    loadingIconShould,
    pressEscape,
    tableCellShould,
    tableShould,
    validateAccess,
    validateNoEditOrDeleteTableIcon,
    validateResourceNotFound,
    visitView,
    getRankCells,
    validateURL,
  }
}
