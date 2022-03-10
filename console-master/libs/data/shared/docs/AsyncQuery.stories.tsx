import AsyncDataLayerFile from '!!file-loader?name=[path][name].[ext].txt!./async/dog/queryDog'
import React from 'react'

import { useStatefulAsyncQuery } from '../src'
import { DogDataLayer } from './async'
import { argTypes, Data, decorators, DefaultArgs, ErrorComponent, Loading, renderAction } from './util'

export default {
  title: 'Async',
  decorators: [...decorators],
  argTypes,
}

const queryVariables = { name: 'Buck' }
const failureQueryVariables = { name: 'Dud' }

export const SimpleQuery = ({ Failure, Mock, withErrorBoundary }: DefaultArgs) => {
  const { data, loading, error } = useStatefulAsyncQuery(DogDataLayer.queryDog, {
    variables: Failure ? failureQueryVariables : queryVariables,
    mock: Mock || undefined,
  })
  if (loading) {
    renderAction('SimpleQuery', 'LOADING')
    return <Loading />
  }
  if (error) {
    renderAction('SimpleQuery', 'ERROR', error)
    if (withErrorBoundary) throw error
    return <ErrorComponent error={error} />
  }
  renderAction('SimpleQuery', 'COMPLETE', data)
  return <Data data={data} />
}
SimpleQuery.args = DefaultArgs
SimpleQuery.parameters = {
  assets: [AsyncDataLayerFile],
}

export const MultiResultQuery = ({ Failure, Mock, withErrorBoundary }: DefaultArgs) => {
  const { data, loading, error } = useStatefulAsyncQuery(DogDataLayer.queryDogWithCache, {
    variables: Failure ? failureQueryVariables : queryVariables,
    mock: Mock || undefined,
  })
  if (loading) {
    renderAction('MultiResultQuery', 'LOADING')
    return <Loading />
  }
  if (error) {
    renderAction('MultiResultQuery', 'ERROR', error)
    if (withErrorBoundary) throw error
    return <ErrorComponent error={error} />
  }
  renderAction('MultiResultQuery', 'COMPLETE', data)
  return <Data data={data} />
}
MultiResultQuery.args = DefaultArgs
MultiResultQuery.parameters = {
  assets: [AsyncDataLayerFile],
}
