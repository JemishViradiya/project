import React from 'react'

import { TabContentComponent } from '@ues-platform/shared'

import { ActivationProfiles } from '.'

// Custom partial routes
export const customProfileRoute = {
  path: '/userPolicies',
  element: <TabContentComponent />,
  children: [ActivationProfiles],
}
