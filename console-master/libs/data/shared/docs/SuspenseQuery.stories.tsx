import AsyncDataLayerFile from '!!file-loader?name=[path][name].[ext].txt!./async/dog/queryDog'
import React from 'react'

import { useSuspenseQuery } from '../src'
import { DogDataLayer } from './async'
import { argTypes, Data, decorators, DefaultArgs, renderAction } from './util'

export default {
  title: 'Suspense',
  decorators: decorators,
  argTypes: {
    Failure: argTypes.Failure,
    Mock: argTypes.Mock,
  },
  args: { Mock: DefaultArgs['Mock'], Failure: DefaultArgs['Failure'] },
  parameters: { assets: [AsyncDataLayerFile] },
}

export const SimpleQuery = ({ Failure, Mock }: DefaultArgs) => {
  renderAction('SimpleQuery')
  const data = useSuspenseQuery(DogDataLayer.queryDog, { variables: { name: Failure ? 'Dud' : 'Buck' }, mock: Mock || undefined })
  renderAction('SimpleQuery', 'COMPLETE')
  return <Data data={data} />
}
