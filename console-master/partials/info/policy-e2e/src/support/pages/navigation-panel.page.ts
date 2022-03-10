import { BasePage } from './base.page'

const getNavigation = () => I.findByRole(BasePage.ROLES.NAVIGATION)

export const NavigationPanel = {
  getNavigation,
  ...BasePage,
}
