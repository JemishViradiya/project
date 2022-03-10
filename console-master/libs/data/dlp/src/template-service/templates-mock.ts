//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params, sonarjs/no-duplicate-string */

import { v4 as uuidv4 } from 'uuid'

import type { PagableResponse, Response } from '@ues-data/shared-types'

import { DefaultDataEntity } from '../data-entity-service/data-entities-mock'
import type { PageableSortableQueryParams } from '../types'
import { DATA_TYPES, INFO_TYPES, REGION } from '../types'
import type TemplatesInterface from './templates-interface'
import type { Template } from './templates-types'

const is = 'TemplatesClass'

const random = Math.random()

let index = 0

const templatesGuids = [
  '0a68bd67-6fd0-4e38-8045-766e7abe3e10',
  '9226ad27-95ca-4544-8d33-2d8a28ebfe37',
  'cf3b05c1-d464-4d07-b5e4-286917a7016f',
  '8c59fcbd-6def-4306-bfe8-32b57b8a3ccd',
  '6f943b1f-39e3-4aa3-875b-96f3790b0be0',
  'dac363fa-a3ef-4fe0-a3ab-08cbfb9a8cc5',
  '2db87d24-e6a0-4771-b6f2-6efaf39ae38c',
  '689e9b6d-29f5-433b-b7be-7d55ff2a2389',
  '5679f300-0463-4449-b42e-7972fa17d228',
]

const templatesGuidIndex = currGuid => {
  return templatesGuids.findIndex(guid => currGuid === guid)
}

const DefaultTemplate = (typeItem: DATA_TYPES): Template => {
  if (index >= templatesGuids.length) {
    index = 0
  }

  const firstDataEntityGuid = templatesGuids[index++]
  const secondDataEntityGuid = templatesGuids[index++]
  const thirdDataEntityGuid = templatesGuids[index++]

  return {
    guid: uuidv4(),
    name: 'Template name ' + Math.floor(Math.random() * 10000),
    description: 'Template description ' + Math.floor(Math.random() * 10000),
    type: typeItem,
    // status: Math.floor(Math.random() * 2) === 0 ? STATUS.IN_USE : STATUS.NOT_IN_USE,
    regions: [Object.values(REGION)[Math.floor(Math.random() * 2)], Object.values(REGION)[3 + Math.floor(Math.random() * 2)]].join(
      ',',
    ),
    infoTypes: [
      Object.keys(INFO_TYPES)[Math.floor(Math.random() * 2)],
      Object.keys(INFO_TYPES)[2 + Math.floor(Math.random() * 2)],
    ].join(','),
    dataEntities: [
      DefaultDataEntity(firstDataEntityGuid, templatesGuidIndex(firstDataEntityGuid)),
      DefaultDataEntity(secondDataEntityGuid, templatesGuidIndex(secondDataEntityGuid)),
      DefaultDataEntity(thirdDataEntityGuid, templatesGuidIndex(thirdDataEntityGuid)),
    ],
    condition: {
      and: [
        { '>': [{ var: `${firstDataEntityGuid}` }, 2] },
        {
          or: [{ '>': [{ var: `${secondDataEntityGuid}` }, 2] }, { '>': [{ var: `${thirdDataEntityGuid}` }, 2] }],
        },
      ],
    },

    created: 'Tue Feb 02 2021 15:24:09 GMT+0200',
    updated: 'Tue Feb 02 2021 15:24:09 GMT+0200',
  }
}

export const associatedTemplates: Template[] = [
  DefaultTemplate(DATA_TYPES.PREDEFINED),
  DefaultTemplate(DATA_TYPES.PREDEFINED),
  DefaultTemplate(DATA_TYPES.PREDEFINED),
  DefaultTemplate(DATA_TYPES.PREDEFINED),
  DefaultTemplate(DATA_TYPES.PREDEFINED),
  DefaultTemplate(DATA_TYPES.PREDEFINED),
]
export const mockedTemplates: Template[] = [
  ...associatedTemplates,
  DefaultTemplate(DATA_TYPES.CUSTOM),
  DefaultTemplate(DATA_TYPES.CUSTOM),
  DefaultTemplate(DATA_TYPES.CUSTOM),
  DefaultTemplate(DATA_TYPES.CUSTOM),
  DefaultTemplate(DATA_TYPES.CUSTOM),
  DefaultTemplate(DATA_TYPES.CUSTOM),
]

export const templateEntitiesResponse = (
  templates: Template[],
  params?: PageableSortableQueryParams<Template>,
): PagableResponse<Template> => ({
  totals: {
    pages: 1,
    elements: templates.length,
  },
  navigation: {
    next: 'next',
    previous: 'prev',
  },
  count: templates.length,
  elements: params ? templates.slice(0, params?.max) : templates,
})

class TemplatesMockClass implements TemplatesInterface {
  create(template: Template): Response<Partial<Template> | Template> {
    console.log(`${is}: create(${[...arguments]})`)
    template.guid = uuidv4()
    mockedTemplates.push(template)
    console.log(`${is}: mock get templates ${JSON.stringify(template)}`)
    return Promise.resolve({
      data: template,
    })
  }

  associateTemplate(templatesId: string[]): Response<unknown> {
    console.log(`${is}: associateTemplate(${[...arguments]})`)
    return Promise.resolve({})
  }

  disassociateTemplate(templatesId: string[]): Response<unknown> {
    console.log(`${is}: disassociateTemplate(${[...arguments]})`)
    return Promise.resolve({})
  }

  read(templateId: string): Response<Template | Partial<Template>> {
    console.log(`${is}: read(${templateId})`)
    const template: Template = mockedTemplates.find(element => element.guid === templateId)
    console.log(`${is}: read template ${JSON.stringify(template)}`)
    return Promise.resolve({ data: template })
  }

  readAll(
    params?: PageableSortableQueryParams<Template>,
  ): Response<PagableResponse<Template> | Partial<PagableResponse<Template>>> {
    console.log(`${is}: readAll():  ${JSON.stringify(templateEntitiesResponse(mockedTemplates, params))}`)

    return Promise.resolve({ data: templateEntitiesResponse(mockedTemplates, params) })
  }

  readAssociated(
    params?: PageableSortableQueryParams<Template>,
  ): Response<PagableResponse<Template> | Partial<PagableResponse<Template>>> {
    const associateTemplatesData = templateEntitiesResponse(associatedTemplates.slice(0, 3), params)
    console.log(`${is}: readAssociated():  ${JSON.stringify(associateTemplatesData)}`)
    return Promise.resolve({ data: associateTemplatesData })
  }

  update(template: Partial<Template>): Response<Template | Partial<Template>> {
    console.log(`${is}: update(${[...arguments]})`)
    const index = mockedTemplates.findIndex(element => element.guid === template.guid)
    if (index >= 0) {
      mockedTemplates[index] = { ...mockedTemplates[index], ...template }
      return Promise.resolve({ data: mockedTemplates[index] })
    }
    return Promise.reject({ error: 'TemplateNotFound' })
  }
  remove(templateId: string): Response<unknown> {
    console.log(`${is}: remove(${[...arguments]})`)
    const index = mockedTemplates.findIndex(element => element.guid === templateId)
    if (index >= 0) {
      if (index === 1) {
        return Promise.reject({
          response: {
            status: 400,
          },
        })
      } else {
        mockedTemplates.splice(index, 1)
        return Promise.resolve({})
      }
    }
    return Promise.reject({ error: 'TemplateNotFound' })
  }
}

const TemplatesMockApi = new TemplatesMockClass()

export { TemplatesMockApi }
