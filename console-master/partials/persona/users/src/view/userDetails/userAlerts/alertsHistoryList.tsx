import React from 'react'

import { queryUserHistoryAlerts } from '@ues-data/persona'
import { useStatefulReduxQuery } from '@ues-data/shared'

import { AlertsList } from './alertsList'

interface AlertHistoryListProps {
  userId: string
}

export const AlertHistoryList: React.FC<AlertHistoryListProps> = ({ userId }: AlertHistoryListProps) => {
  const { data, loading } = useStatefulReduxQuery(queryUserHistoryAlerts, { variables: { userId } })
  const alerts = data?.data ?? []

  return <AlertsList alerts={alerts} pending={loading} />
}
