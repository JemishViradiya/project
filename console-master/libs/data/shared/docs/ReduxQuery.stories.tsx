import React, { useMemo } from 'react'

import { useStatefulReduxQuery } from '../src'
import { MoreData } from './MoreData'
import { PageData } from './PageData'
import { DogDataLayer } from './redux/dog'
import DogDataLayerSources from './redux/dog.sources'
import { DogsDataLayer } from './redux/dogs'
import DogsDataLayerSources from './redux/dogs.sources'
import { uesDecorator } from './redux/support'
import { argTypes, Data, decorators, DefaultArgs, ErrorComponent, ListArgs, listArgTypes, Loading, renderAction } from './util'

export default {
  title: 'Redux',
  decorators: [uesDecorator, ...decorators],
}

export const SimpleQuery = ({ Failure, Mock, withErrorBoundary }: DefaultArgs) => {
  const { data, loading, error } = useStatefulReduxQuery(DogDataLayer.queryDog, {
    variables: { name: Failure ? 'Dud' : 'Buck' },
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
SimpleQuery.argTypes = argTypes
SimpleQuery.parameters = { assets: DogDataLayerSources }

export const OnDemandQuery = ({ Failure, Mock, withErrorBoundary }: DefaultArgs) => {
  const [ready, setReady] = React.useState<boolean>(false)
  const { data, loading, error } = useStatefulReduxQuery(DogDataLayer.queryDog, {
    variables: { name: Failure ? 'Dud' : 'Buck' },
    skip: !ready,
    mock: Mock || undefined,
  })
  const onClick = React.useCallback(() => setReady(true), [])
  if (loading) {
    renderAction('OnDemandDynamicQuery', 'LOADING')
    return <Loading />
  }
  if (error) {
    renderAction('OnDemandDynamicQuery', 'ERROR', error)
    if (withErrorBoundary) throw error
    return <ErrorComponent error={error} />
  }
  renderAction('OnDemandDynamicQuery', data ? 'COMPLETE' : 'IDLE', data)
  return (
    <>
      <Data data={data} />
      <button onClick={onClick}>Load Query</button>
    </>
  )
}
OnDemandQuery.args = DefaultArgs
OnDemandQuery.argTypes = argTypes
OnDemandQuery.parameters = { assets: DogDataLayerSources }

const moreVariables = Failure => ({ limit: 3, offset: Failure ? -1 : 0 })
const pageVariables = Failure => ({ limit: 3, page: Failure ? -1 : 1 })

export const ListQuery = ({ Mock, Failure, withErrorBoundary, Mode }: ListArgs) => {
  const variables = useMemo(() => (Mode === 'paged' ? pageVariables : moreVariables)(Failure), [Failure, Mode])
  const { data, loading, error, fetchMore } = useStatefulReduxQuery(
    // @ts-ignore
    Mode === 'paged' ? DogsDataLayer.listDogsByPage : DogsDataLayer.listDogsProgressively,
    {
      variables,
      mock: Mock || undefined,
    },
  )
  if (loading) {
    renderAction('ListQuery', 'LOADING')
  }
  if (error) {
    renderAction('ListQuery', 'ERROR', error)
    if (withErrorBoundary) throw error
    return <ErrorComponent error={error} />
  }

  renderAction('ListQuery', 'COMPLETE', data)
  const Data = Mode === 'paged' ? PageData : MoreData
  return <Data {...data} loading={loading} fetchMore={fetchMore} />
}
ListQuery.args = ListArgs
ListQuery.argTypes = listArgTypes
ListQuery.parameters = { assets: DogsDataLayerSources }
