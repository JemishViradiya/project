import useClientParams from '../hooks/useClientParams'
import { getRoutes } from './getRoutes'

export const useStandaloneApps = () => {
  const routes = getRoutes(window.location.pathname)
  const navigation = routes['navigation']
  const userNavigation = routes['userNavigation']
  const settingsNavigation = routes['settingsNavigation']
  const { features: { IpAddressRisk } = {} } = useClientParams()
  // check if IpAddressRisk already in settings
  if (IpAddressRisk && !settingsNavigation['navigation'].some(item => item['IpAddressRisk'])) {
    settingsNavigation['navigation'].push(routes['IpAddressRisk'])
  }
  navigation.push(settingsNavigation)
  return { userNavigation, navigation }
}
