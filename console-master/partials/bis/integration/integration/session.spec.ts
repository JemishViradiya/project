/* eslint-env node, codeceptjs/codeceptjs, mocha */
/* eslint-disable no-unused-expressions */

import { AppShell, AppShellVenue, MyAccount } from '@ues-behaviour/shared-e2e/pages'

Feature('User Session')

Scenario('Login to Venue Console', { retries: 2 }, async ({ I, login }) => {
  await login('admin')
  I.visit('/')

  AppShellVenue.waitForPage({ title: 'Dashboard' })

  AppShellVenue.clickUserMenu({ name: 'User Info' })

  MyAccount.waitForPage()
})
  .tag('@Login')
  .tag('@Ajax')

Scenario('Login to UES Console', { retries: 2 }, async ({ I, login }) => {
  const t = await I.loadI18nNamespaces('dashboard')
  await login('admin')
  I.visit('/uc/dashboard')
  // TODO: this is totally not traced
  I.url().should.eventually.contain('/uc/dashboard')

  AppShell.waitForPage({ title: I.translate('dashboard:pageTitle') })
})
  .tag('@Login')
  .tag('@Ajax')
