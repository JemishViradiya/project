//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { createContext } from 'react'

import { Hooks } from '@ues-gateway/shared'

const { useCategoriesData } = Hooks

interface EventsContextInterface {
  categories?: Partial<ReturnType<typeof useCategoriesData>>
}

export const EventsContext = createContext<EventsContextInterface>({
  categories: {
    categoryIdsMap: {},
    categoryNamesMap: {},
    categories: [],
  },
})

export const EventsContextProvider: React.FC = ({ children }) => {
  const categories = useCategoriesData()

  return <EventsContext.Provider value={{ categories }}>{children}</EventsContext.Provider>
}
