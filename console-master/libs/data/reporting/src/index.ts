import { ScheduledReports } from './scheduledreports/scheduledreports'
import { ScheduledReportsMock } from './scheduledreports/scheduledreports-mock'

const ScheduledReportsApi = {
  ScheduledReports,
}

const ScheduledReportsApiMock = {
  ScheduledReports: ScheduledReportsMock,
}

export { ScheduledReportsApi, ScheduledReportsApiMock }
export * from './scheduledreports/scheduledreports-types'
