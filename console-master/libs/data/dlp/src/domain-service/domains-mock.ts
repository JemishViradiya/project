//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params, sonarjs/no-duplicate-string */

import * as httpStatus from 'http-status-codes'
import { v4 as uuidv4 } from 'uuid'

import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { PageableSortableQueryParams, PageableSortableQueryParamsWithPolicesAssignment } from '../types'
import type BrowserDomainsInterface from './domain-interface'
import type { BrowserDomain } from './domains-types'

const is = 'BrowserDomainsMockClass'

const domain1 = 'dropmefiles.com'
const domain2 = 'gitlab.rim.net'
const domain3 = 'wikis.rim.net'
const domain4 = 'dropbox.com'
const domain5 = 'sharepoint.com'

const browserDomainName = [domain1, domain2, domain3, domain4, domain5]

const browserDomain = (guid: string, enabled: string, domainName: string): BrowserDomain => ({
  domain: domainName,
  guid: guid,
  description: 'General description',
  enabled: enabled,
  certThumbprint: 'BC534223AA1B93EF85BAB4CE4BEE7D3F4CF4E101C56AA678CA33843028F2738A',
  created: '2021-02-16T09:07:44Z',
  updated: '2021-02-16T09:07:44Z',
  policiesAssigned: 0,
})

export const mockedBrowserDomains: BrowserDomain[] = browserDomainName.map(d =>
  browserDomain(uuidv4(), Math.floor(Math.random() * 2) === 0 || d === domain4 || d === domain5 ? `true` : `false`, d),
)

export const browserDomainEntitiesResponse = (
  params?: PageableSortableQueryParams<BrowserDomain>,
): PagableResponse<BrowserDomain> => ({
  totals: {
    pages: 1,
    elements: mockedBrowserDomains.length,
  },
  navigation: {
    next: 'next',
    previous: 'prev',
  },
  count: mockedBrowserDomains.length,
  elements: params ? mockedBrowserDomains.slice(0, params?.max) : mockedBrowserDomains,
})

export const mockedValidationStatusForDomain = (domainName: string) => {
  if (domainName === domain2) {
    return httpStatus.BAD_REQUEST
  }
  if (domainName === domain3) {
    return httpStatus.FAILED_DEPENDENCY
  }
  return httpStatus.OK
}

class BrowserDomainsMockClass implements BrowserDomainsInterface {
  create(browserDomain: BrowserDomain): Response<Partial<BrowserDomain> | BrowserDomain> {
    console.log(`${is}: create(${[...arguments]})`)
    browserDomain.guid = uuidv4()
    mockedBrowserDomains.push(browserDomain)
    console.log(`${is}: mock get browserDomains ${JSON.stringify(browserDomain)}`)
    return Promise.resolve({
      data: browserDomain,
    })
  }

  read(browserDomainGuid: string): Response<BrowserDomain | Partial<BrowserDomain>> {
    console.log(`${is}: read(${browserDomainGuid})`)
    const browserDomain: BrowserDomain = mockedBrowserDomains.find(element => element.guid === browserDomainGuid)
    console.log(`${is}: read browserDomain ${JSON.stringify(browserDomain)}`)
    return Promise.resolve({ data: browserDomain })
  }

  readAll(
    params?: PageableSortableQueryParamsWithPolicesAssignment<BrowserDomain>,
  ): Response<PagableResponse<BrowserDomain> | Partial<PagableResponse<BrowserDomain>>> {
    console.log(`${is}: readAll():  ${JSON.stringify(browserDomainEntitiesResponse(params))}`)

    return Promise.resolve({ data: browserDomainEntitiesResponse(params) })
  }

  update(browserDomainGuid: string, browserDomain: Partial<BrowserDomain>): Response<BrowserDomain | Partial<BrowserDomain>> {
    console.log(`${is}: update(${[...arguments]})`)
    const index = mockedBrowserDomains.findIndex(element => element.guid === browserDomainGuid)
    if (index >= 0) {
      mockedBrowserDomains[index] = { ...mockedBrowserDomains[index], ...browserDomain }
      return Promise.resolve({ data: mockedBrowserDomains[index] })
    }
    return Promise.reject({ error: 'BrowserDomainNotFound' })
  }
  remove(browserDomainGuid: string): Response<unknown> {
    console.log(`${is}: remove(${[...arguments]})`)
    const index = mockedBrowserDomains.findIndex(element => element.guid === browserDomainGuid)
    if (index >= 0) {
      if (index === 1) {
        return Promise.reject({
          response: {
            status: 400,
          },
        })
      } else {
        mockedBrowserDomains.splice(index, 1)
        return Promise.resolve({})
      }
    }
    return Promise.reject({ error: 'BrowserDomainNotFound' })
  }

  validate(domainName: string): Response<unknown> {
    console.log(`${is}: validate(${domainName})`)
    const responseStatusCode = mockedValidationStatusForDomain(domainName)
    if (responseStatusCode !== httpStatus.OK) {
      return Promise.reject({
        response: {
          status: responseStatusCode,
        },
      })
    } else {
      return Promise.resolve({ status: responseStatusCode })
    }
  }
}

const BrowserDomainMockApi = new BrowserDomainsMockClass()

export { BrowserDomainMockApi }
