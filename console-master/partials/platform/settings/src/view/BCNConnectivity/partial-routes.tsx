import React from 'react'

import { ContentArea } from '@ues/behaviours'

import GenerateBCN from './GenerateBCN/GenerateBCN'
import BCNSettings from './Settings/BCNSettings'

// Custom partial routes
export const customBcnRoute = {
  path: '/bcncustom',
  children: [
    {
      path: '/generatebcn',
      element: (
        <ContentArea>
          <GenerateBCN />
        </ContentArea>
      ),
    },
    {
      path: '/settings',
      element: (
        <ContentArea>
          <BCNSettings />
        </ContentArea>
      ),
    },
  ],
}
