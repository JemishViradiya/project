import { isEqual } from 'lodash-es'

import { FeatureName, useFeatures } from '@ues-data/shared'
import { HelpLinks } from '@ues/assets'
import type { DatetimeRangeFilter } from '@ues/behaviours'

export enum HelpLinkScope {
  MOBILE_DEVICES = 'MOBILE_DEVICES',
  USERS = 'USERS',
  USER_GROUPS = 'USER_GROUPS',
  DIRECTORY_CONNECTIONS = 'DIRECTORY_CONNECTIONS',
  CONNECTIVITY_NODE = 'CONNECTIVITY_NODE',
}

const cronosLinks = {
  [HelpLinkScope.MOBILE_DEVICES]: HelpLinks.AssetsMobileDevices,
  [HelpLinkScope.USERS]: HelpLinks.AssetsUsers,
  [HelpLinkScope.USER_GROUPS]: HelpLinks.AssetsUserGroups,
  [HelpLinkScope.DIRECTORY_CONNECTIONS]: HelpLinks.DirectoryConnections,
  [HelpLinkScope.CONNECTIVITY_NODE]: HelpLinks.ConnectivityNode,
}

export const usePlatformHelpLink = (scope: HelpLinkScope) => {
  const features = useFeatures()
  const cronosNavigation = features.isEnabled(FeatureName.UESCronosNavigation)

  return cronosNavigation ? cronosLinks[scope] : undefined
}
