import React from 'react'

import { ContentArea } from '@ues/behaviours'

export const TabsWrapper = ({ children }) => (
  <ContentArea m={0} pt={1} pl={6} pr={6} pb={6} alignItems="flex-start" height={'100%'}>
    {children}
  </ContentArea>
)
