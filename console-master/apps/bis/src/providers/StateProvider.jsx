import moment from 'moment'
import PropTypes from 'prop-types'
import React, { createContext, memo, useEffect, useMemo } from 'react'

import { GeneralSettingsQuery } from '@ues-data/bis'
import { useStatefulApolloMutation, useStatefulApolloQuery } from '@ues-data/shared'

import {
  getDateScope,
  getRangeValue,
  getReducedDate,
  getRelatedKey,
  isRetentionPeriodCustom,
  Periods,
} from '../components/util/DateHelper'
import { getTimePeriodQuery, updateTimePeriodMutation } from '../localState/TimePeriod'

const NO_RANGE_VALUE = ''
const isPeriodCustom = periodValue => periodValue === Periods.LAST_CUSTOM_DAYS.key
const isCurrentPeriodGreaterThanRetentionPeriod = (lastDaysNumber, dataRetentionPeriod) => lastDaysNumber > dataRetentionPeriod
const isCurrentPeriodSmallerThanRetentionPeriod = (lastDaysNumber, dataRetentionPeriod) => lastDaysNumber < dataRetentionPeriod
const isRetentionPeriodGreaterThanDaysNumber = (dataRetentionPeriod, daysNumber) => dataRetentionPeriod > daysNumber
const isRetentionPeriodSmallerThanDaysNumber = (dataRetentionPeriod, daysNumber) => dataRetentionPeriod < daysNumber

const isRangeBeyondRetentionPeriodLimit = (dataRetentionPeriod, start) =>
  dataRetentionPeriod && getReducedDate(dataRetentionPeriod, true) > start

const getPeriodNotCustomConditions = (periodValue, dataRetentionPeriod, updateTimePeriod) => {
  const lastDaysNumber = Periods[periodValue] ? Periods[periodValue].daysNumber : 365
  if (isCurrentPeriodGreaterThanRetentionPeriod(lastDaysNumber, dataRetentionPeriod)) {
    if (isRetentionPeriodCustom(dataRetentionPeriod)) {
      updateTimePeriod({
        variables: getRangeValue(Periods.LAST_CUSTOM_DAYS.key, NO_RANGE_VALUE, NO_RANGE_VALUE, dataRetentionPeriod),
      })
    } else {
      updateTimePeriod({ variables: getRangeValue(getRelatedKey(dataRetentionPeriod)) })
    }
  } else if (isCurrentPeriodSmallerThanRetentionPeriod(lastDaysNumber, dataRetentionPeriod)) {
    updateTimePeriod({ variables: getRangeValue(periodValue) })
  }
}

const getPeriodCustomConditions = (dataRetentionPeriod, updateTimePeriod, daysNumber) => {
  if (isRetentionPeriodSmallerThanDaysNumber(dataRetentionPeriod, daysNumber)) {
    if (isRetentionPeriodCustom(dataRetentionPeriod)) {
      updateTimePeriod({
        variables: getRangeValue(Periods.LAST_CUSTOM_DAYS.key, NO_RANGE_VALUE, NO_RANGE_VALUE, dataRetentionPeriod),
      })
    } else {
      updateTimePeriod({ variables: getRangeValue(getRelatedKey(dataRetentionPeriod)) })
    }
  } else if (isRetentionPeriodGreaterThanDaysNumber(dataRetentionPeriod, daysNumber)) {
    const { startDate, endDate } = getDateScope(daysNumber)
    updateTimePeriod({ variables: getRangeValue(null, startDate, endDate, null) })
  }
}

const getRangeBeyondRetentionPeriodLimitConditions = (dataRetentionPeriod, end, updateTimePeriod) => {
  let endValue
  if (end < getReducedDate(dataRetentionPeriod, true)) {
    endValue = moment().unix().toString()
  }
  const startValue = getReducedDate(dataRetentionPeriod, true).toString()
  updateTimePeriod({ variables: getRangeValue(null, startValue, endValue || end) })
}

export const Context = createContext({
  dataRetentionPeriod: {},
  currentTimePeriod: {},
  updateTimePeriod: () => {},
})
const { Provider, Consumer } = Context

const StateProvider = memo(({ children }) => {
  const [updateTimePeriod] = useStatefulApolloMutation(updateTimePeriodMutation)
  const { data: dataGeneral, loading: loadingGeneral } = useStatefulApolloQuery(GeneralSettingsQuery)
  const { data: dataTime, loading: loadingTime } = useStatefulApolloQuery(getTimePeriodQuery)

  const [dataRetentionPeriod, currentTimePeriod, periodValue, start, end, daysNumber] = useMemo(() => {
    let dataRetentionPeriod
    let currentTimePeriod
    let periodValue
    let start
    let end
    let daysNumber
    if (!loadingGeneral && dataGeneral && dataGeneral.settings) {
      dataRetentionPeriod = dataGeneral.settings.dataRetentionPeriod
    }
    if (!loadingTime && dataTime && dataTime.currentTimePeriod) {
      currentTimePeriod = dataTime.currentTimePeriod
      periodValue = currentTimePeriod.last
      start = currentTimePeriod.start
      end = currentTimePeriod.end
      daysNumber = currentTimePeriod.daysNumber
    }
    return [dataRetentionPeriod, currentTimePeriod, periodValue, start, end, daysNumber]
  }, [dataGeneral, dataTime, loadingGeneral, loadingTime])

  useEffect(() => {
    if (dataRetentionPeriod && periodValue) {
      if (!isPeriodCustom(periodValue)) {
        getPeriodNotCustomConditions(periodValue, dataRetentionPeriod, updateTimePeriod)
      } else if (isPeriodCustom(periodValue)) {
        getPeriodCustomConditions(dataRetentionPeriod, updateTimePeriod, daysNumber)
      }
    } else if (isRangeBeyondRetentionPeriodLimit(dataRetentionPeriod, start)) {
      getRangeBeyondRetentionPeriodLimitConditions(dataRetentionPeriod, end, updateTimePeriod)
    }
  }, [dataRetentionPeriod, daysNumber, end, periodValue, start, updateTimePeriod])

  const value = useMemo(
    () => ({
      dataRetentionPeriod,
      currentTimePeriod,
      updateTimePeriod,
    }),
    [currentTimePeriod, dataRetentionPeriod, updateTimePeriod],
  )
  return <Provider value={value}>{children}</Provider>
})

StateProvider.Consumer = Consumer

StateProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default StateProvider
