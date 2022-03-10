import React from 'react'
import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'

import { i18next } from '@ues/assets/node'

const AllTheProviders = ({ children }) => {
  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
}

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }

export const loadNamespaces = async (...ns) => {
  await i18next.loadNamespaces(ns)
  return i18next.getFixedT(null, ns[0])
}
