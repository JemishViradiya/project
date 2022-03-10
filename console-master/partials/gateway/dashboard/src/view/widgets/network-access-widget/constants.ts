import { TimeIntervalId } from '@ues-data/dashboard'
import { ReportingServiceInterval } from '@ues-data/gateway'

export const DATA_INTERVAL = {
  [TimeIntervalId.Last24Hours]: ReportingServiceInterval.Hour,
  [TimeIntervalId.Today]: ReportingServiceInterval.Hour,
  [TimeIntervalId.Yesterday]: ReportingServiceInterval.Hour,
  [TimeIntervalId.Last2Days]: ReportingServiceInterval.Hour,
  [TimeIntervalId.Last7Days]: ReportingServiceInterval.Day,
  [TimeIntervalId.LastWeek]: ReportingServiceInterval.Hour,
  [TimeIntervalId.ThisWeek]: ReportingServiceInterval.Hour,
  [TimeIntervalId.LastMonth]: ReportingServiceInterval.Day,
  [TimeIntervalId.ThisMonth]: ReportingServiceInterval.Day,
  [TimeIntervalId.Last30Days]: ReportingServiceInterval.Day,
  [TimeIntervalId.Last60Days]: ReportingServiceInterval.Week,
  [TimeIntervalId.Last2Months]: ReportingServiceInterval.Week,
  [TimeIntervalId.Last90Days]: ReportingServiceInterval.Week,
  [TimeIntervalId.Last3Months]: ReportingServiceInterval.Week,
  [TimeIntervalId.Last120Days]: ReportingServiceInterval.Week,
}
