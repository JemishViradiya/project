//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params */
/* eslint-disable sonarjs/no-duplicate-string */

import type { Response } from '@ues-data/shared-types'

import type SoftwareTemplateInterface from './software-template-interface'
import type { SoftwareTemplate } from './software-template-types'

const is = 'SoftwareTemplateClass'

const softwareTemplateMock: SoftwareTemplate[] = [
  {
    id: 'mtd.blackberry.com',
    name: 'Dynamics SDK (MTD)',
    scope: 'MTDScores.All MPSEvents.All',
    is_global: false,
    client_metadata: {},
    allow_tpc_auth: null,
    org_id: 'blackberry',
    is_display_in_template_list: false,
    is_display_as_authorized_software: true,
    skip_authorized_software_check: false,
    is_static: true,
    version: '1.0',
    restricted: true,
    created: '2020-09-18T17:05:36.000Z',
    last_modified: '2020-09-18T17:05:36.000Z',
  },
  {
    id: 'dave.test.com',
    name: 'DAC App1',
    scope: '*',
    is_global: false,
    client_metadata: {},
    allow_tpc_auth: null,
    org_id: 'blackberry',
    is_display_in_template_list: false,
    is_display_as_authorized_software: true,
    skip_authorized_software_check: false,
    is_static: true,
    version: '1.0',
    restricted: true,
    created: '2020-09-18T17:05:36.000Z',
    last_modified: '2020-09-18T17:05:36.000Z',
  },
  {
    id: 'oidc.blackberry',
    name: 'OIDC',
    scope: '*',
    is_global: false,
    client_metadata: {},
    allow_tpc_auth: null,
    org_id: 'blackberry',
    is_display_in_template_list: false,
    is_display_as_authorized_software: false,
    skip_authorized_software_check: true,
    is_static: true,
    version: '1.0',
    restricted: true,
    created: '2020-09-18T17:05:36.000Z',
    last_modified: '2020-09-18T17:05:36.000Z',
  },
  {
    id: 'telemetry.sis.blackberry.com',
    name: 'BlackBerry Intelligent Security Telemetry',
    scope: '*',
    is_global: false,
    client_metadata: {},
    allow_tpc_auth: null,
    org_id: 'blackberry',
    version: '1.0',
    restricted: true,
    created: '2020-09-18T17:05:36.000Z',
    last_modified: '2020-09-18T17:05:36.000Z',
  },
  {
    id: 'uem.blackberry',
    name: 'BlackBerry UEM',
    scope: '*',
    is_global: false,
    client_metadata: {},
    allow_tpc_auth: null,
    org_id: 'blackberry',
    version: '1.0',
    restricted: true,
    created: '2020-09-18T17:05:36.000Z',
    last_modified: '2020-09-18T17:05:36.000Z',
  },
  {
    id: 'sis.blackberry.com',
    name: 'BlackBerry Intelligent Security Analytics',
    scope: '*',
    is_global: false,
    client_metadata: {},
    allow_tpc_auth: false,
    org_id: 'blackberry',
    is_display_in_template_list: true,
    is_display_as_authorized_software: false,
    skip_authorized_software_check: false,
    is_static: true,
    version: '1.0',
    restricted: true,
    created: '2020-09-18T17:05:36.000Z',
    last_modified: '2020-09-18T17:05:36.000Z',
  },
  {
    id: 'dynamics.blackberry.com',
    name: 'BlackBerry Intelligent Security SDK',
    scope: '*',
    is_global: false,
    client_metadata: {},
    allow_tpc_auth: null,
    org_id: 'blackberry',
    is_display_in_template_list: false,
    is_display_as_authorized_software: false,
    skip_authorized_software_check: false,
    is_static: true,
    version: '1.0',
    restricted: true,
    created: '2020-09-18T17:05:36.000Z',
    last_modified: '2020-09-18T17:05:36.000Z',
  },
  {
    id: 'eotapi.blackberry.com',
    name: 'EoTapi',
    scope: '*',
    is_global: false,
    client_metadata: {},
    allow_tpc_auth: null,
    org_id: 'blackberry',
    is_display_in_template_list: true,
    is_display_as_authorized_software: true,
    skip_authorized_software_check: false,
    is_static: true,
    version: '1.0',
    restricted: true,
    created: '2020-09-18T17:05:36.000Z',
    last_modified: '2020-09-18T17:05:36.000Z',
  },
]

const SoftwareTemplateMock: SoftwareTemplateInterface = {
  createSoftwareTemplate(template: SoftwareTemplate): Response<SoftwareTemplate> {
    console.log(`${is}: createSoftwareTemplate(${[...arguments]})`)
    return Promise.resolve({ data: template })
  },
  getSoftwareTemplates(): Response<SoftwareTemplate[]> {
    console.log(`${is}: getSoftwareTemplates(${[...arguments]})`)
    const result = softwareTemplateMock.filter(sw => sw && sw.is_static)
    return Promise.resolve({ data: result })
  },
  getAllTemplates: async (softwareIds: string): Response<SoftwareTemplate[]> => {
    const result = await SoftwareTemplateMock.getSoftwareTemplates()
    const idArray = softwareIds && softwareIds.length > 0 ? softwareIds.split(',') : []
    const nonStatic = softwareTemplateMock.filter(sw => sw && !sw.is_static)
    if (idArray.length > 0 && nonStatic.length > 0) {
      result.data.push(...nonStatic.filter(sw => sw && idArray.includes(sw.id)))
    }
    return Promise.resolve({ data: result.data })
  },
  getSoftwareTemplateById(id: string): Response<SoftwareTemplate> {
    console.log(`${is}: getSoftwareTemplateById(${[...arguments]})`)
    let resp: SoftwareTemplate
    softwareTemplateMock.forEach(auth => {
      if (auth.id === id) {
        resp = auth
      }
    })
    return Promise.resolve({ data: resp })
  },
  updateSoftwareTemplate(id: string, template: SoftwareTemplate): Response<SoftwareTemplate> {
    console.log(`${is}: updateSoftwareTemplate(${[...arguments]})`)
    return Promise.resolve({ data: template })
  },
  deleteSoftwareTemplate(id: string): Response<Record<string, unknown>> {
    console.log(`${is}: deleteSoftwareTemplate(${[...arguments]})`)
    return Promise.resolve({ data: { id, statusCode: 200 } })
  },
}

export { SoftwareTemplateMock }
