//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.
import { UesAxiosClient } from '@ues-data/shared'
import type { Response } from '@ues-data/shared-types'

import type ActivationProfilesInterface from './profiles-interface'
import type { ActivationProfile } from './profiles-types'

const makeUrl = (entityId?: string): string => {
  const entityPath = entityId ? `/${entityId}` : ''
  return `/platform/v1/endpoints/admin/profile/enrollment${entityPath}`
}

class ActivationProfilesClass implements ActivationProfilesInterface {
  create(data: ActivationProfile): Response<ActivationProfile> {
    return UesAxiosClient().post(makeUrl(), data, {})
  }

  readOne(entityId: string): Response<ActivationProfile> {
    return UesAxiosClient().get(makeUrl(entityId), {})
  }

  update(entityId: string, data: Partial<ActivationProfile>): Response<ActivationProfile> {
    let url = makeUrl(entityId)
    if (data.resendEmail) {
      url += '?resend=true'
      delete data.resendEmail
    }
    return UesAxiosClient().put(url, data, {})
  }

  remove(entityId: string): Promise<void> {
    return UesAxiosClient().delete(makeUrl(entityId), {})
  }

  removeMultiple(entityIds: string[]): Promise<void> {
    return UesAxiosClient().delete(makeUrl(), {
      data: entityIds,
    })
  }
}

const ActivationProfiles = new ActivationProfilesClass()

export { ActivationProfiles }
export * from './profiles-mock'
