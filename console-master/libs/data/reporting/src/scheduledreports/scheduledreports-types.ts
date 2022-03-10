export interface ScheduledReport {
  guid?: string
  name: string
  enabled: boolean
  rawDataAttached: boolean
  recurrence: Recurrence
  reportType: ReportType
  reportParams: {
    dashboardId: string
  }
  details: {
    from: string
    subject: string
    body: string
    recipients: string[]
    bcc: boolean
  }
}

export enum Recurrence {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
}

export enum ReportType {
  SCREENSHOT_PDF = 'SCREENSHOT_PDF',
}
