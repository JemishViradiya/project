//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.
import type { Response } from '@ues-data/shared'
import { UesAxiosClient } from '@ues-data/shared'

import type ScheduledReportsInterface from './scheduledreports-interface'
import type { ScheduledReport } from './scheduledreports-types'

const makeUrl = (guid?: string): string => {
  const itemPath = guid ? `/${guid}` : ''
  return `/platform/v1/scheduledreport${itemPath}`
}

class ScheduledReportsClass implements ScheduledReportsInterface {
  create(tenantId: string, data: ScheduledReport): Response<ScheduledReport> {
    return UesAxiosClient().post(makeUrl(), data, {
      headers: {
        'tenant-id': tenantId,
      },
    })
  }
  update(tenantId: string, guid: string, data: Partial<ScheduledReport>): Response<ScheduledReport> {
    return UesAxiosClient().put(makeUrl(guid), data, {
      headers: {
        'tenant-id': tenantId,
      },
    })
  }
  remove(tenantId: string, guid: string): Promise<void> {
    return UesAxiosClient().delete(makeUrl(guid), {
      headers: {
        'tenant-id': tenantId,
      },
    })
  }

  get(tenantId: string, guid: string): Response<ScheduledReport> {
    return UesAxiosClient().get(makeUrl(guid), {
      headers: {
        'tenant-id': tenantId,
      },
    })
  }
  getAll(tenantId: string): Response<ScheduledReport[]> {
    return UesAxiosClient().get(makeUrl(), {
      headers: {
        'tenant-id': tenantId,
      },
    })
  }
}

const ScheduledReports = new ScheduledReportsClass()

export { ScheduledReports }
export * from './scheduledreports-mock'
