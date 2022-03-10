import { NavDashboard, NavEvents, NavProfilePolicy, NavSettings, NavUsers } from '@ues/assets'

export const getRoutes = prefix => {
  return {
    publicPath: '/',
    navigation: [
      {
        name: 'bisStandalone.dashboard',
        icon: NavDashboard,
        route: `${prefix}#/dashboard`,
      },
      {
        name: 'bisStandalone.users',
        icon: NavUsers,
        route: `${prefix}#/users`,
      },
      {
        name: 'bisStandalone.policies',
        icon: NavProfilePolicy,
        route: `${prefix}#/policies`,
      },
      {
        name: 'bisStandalone.events',
        icon: NavEvents,
        route: `${prefix}#/events`,
      },
    ],
    settingsNavigation: {
      name: 'bisStandalone.settings',
      icon: NavSettings,
      route: `${prefix}#/settings`,
      navigation: [
        {
          name: 'bisStandalone.generalSettings',
          route: `${prefix}#/settings/general`,
        },
        {
          name: 'bisStandalone.riskEngines',
          route: `${prefix}#/settings/risk-engines`,
        },
        {
          name: 'bisStandalone.geozones',
          route: `${prefix}#/settings/geozones`,
        },
      ],
    },
    IpAddressRisk: {
      name: 'bisStandalone.ipAddresses',
      route: `${prefix}#/settings/ip-addresses/trusted`,
    },
  }
}
