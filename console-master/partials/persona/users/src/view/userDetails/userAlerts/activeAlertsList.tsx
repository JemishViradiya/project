import React from 'react'

import { queryUserActiveAlerts } from '@ues-data/persona'
import { useStatefulReduxQuery } from '@ues-data/shared'

import { AlertsList } from './alertsList'

interface ActiveAlertsListProps {
  userId: string
}

export const ActiveAlertsList: React.FC<ActiveAlertsListProps> = ({ userId }: ActiveAlertsListProps) => {
  const { data, loading } = useStatefulReduxQuery(queryUserActiveAlerts, { variables: { userId } })
  const alerts = data?.data ?? []

  return <AlertsList alerts={alerts} pending={loading} />
}
