import faker from 'faker'
import React from 'react'

import { action } from '@storybook/addon-actions'
import centered from '@storybook/addon-centered'
import { storiesOf } from '@storybook/react'

import PanelList from './PanelList'

const stories = storiesOf('PanelList', module)

stories.addDecorator(centered)

const data = {
  totalCount: 100,
  listData: [...Array(100)].map(() => {
    return {
      id: faker.random.uuid(),
      name: faker.name.firstName(),
      company: faker.company.companyName(),
      lastUpdated: faker.date.past(),
    }
  }),
}

const list = (
  <PanelList
    key="panel-list"
    data={data.listData}
    totalMatches={data.totalCount}
    fetchData={action('Fetching data')}
    loading={false}
    resource="tenant"
    disabledRows={[]}
    rowTemplate={[
      rowData => {
        return (
          <div>
            <p>
              <strong>{rowData.name}</strong>
            </p>
          </div>
        )
      },
      rowData => {
        return (
          <div>
            <div>
              <p>
                <strong>Date</strong>
              </p>
              <p>{rowData.lastUpdated.toString()}</p>
            </div>
          </div>
        )
      },
      rowData => {
        return (
          <div>
            <div>
              <p>
                <strong>Company</strong>
              </p>
              <p>{rowData.company}</p>
            </div>
          </div>
        )
      },
    ]}
  />
)

stories.add('default', () => {
  return list
})
