import type { DashboardProps, TimeIntervalId } from '@ues-data/dashboard'

import { getInitialGlobalTime } from './actions'
import { ActionType } from './types'

const defaultState: DashboardProps[] = null

function compareTitles(db1, db2) {
  const title1 = db1.title
  const title2 = db2.title
  if (title1 && title2) {
    if (title1.toLowerCase() < title2.toLowerCase()) return -1
    if (title1.toLowerCase() > title2.toLowerCase()) return 1
    return 0
  }
  if (title1 === title2) return 0
  if (!title1) return 1
  if (!title2) return -1
}

const dashPropsFromJSON = (jsonConfig): DashboardProps => {
  const { dashboardId, layoutState, cardState, title, globalTime, requiredServices } = jsonConfig
  return {
    cardState,
    globalTime: getInitialGlobalTime(globalTime as TimeIntervalId),
    id: dashboardId,
    layoutState,
    title,
    requiredServices,
  }
}

function dashboardReducer(state = defaultState, action) {
  if (action.type === ActionType.INITIALIZE_STATE) {
    const jsonConfigs = action.payload
    jsonConfigs.sort(compareTitles)
    return jsonConfigs.map(jsonConfig => dashPropsFromJSON(jsonConfig))
  } else {
    return state
  }
}

export default dashboardReducer
