import DogDataLayerFile from '!!file-loader?name=[path][name].[ext].txt!./apollo/dog/queryDog'
import DogsByPageDataLayerFile from '!!file-loader?name=[path][name].[ext].txt!./apollo/dogs/listDogsByPage'
import DogsProgressivelyDataLayerFile from '!!file-loader?name=[path][name].[ext].txt!./apollo/dogs/listDogsProgressively'
import React, { useMemo } from 'react'

import { useStatefulApolloLazyQuery, useStatefulApolloQuery } from '@ues-data/shared'

import { DogDataLayer, DogsDataLayer } from './apollo'
import { apolloDecorator, MoreApolloData, PagedApolloData } from './apollo/support'
import { argTypes, Data, decorators, DefaultArgs, ErrorComponent, ListArgs, listArgTypes, Loading, renderAction } from './util'

export default {
  title: 'Apollo',
  decorators: [apolloDecorator, ...decorators],
  argTypes,
}

export const SimpleQuery = ({ Failure, Mock, withErrorBoundary }: DefaultArgs) => {
  const { data, loading, error } = useStatefulApolloQuery(DogDataLayer.queryDog, {
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
SimpleQuery.parameters = {
  assets: [DogDataLayerFile],
}

export const OnDemandQuery = ({ Failure, Mock, withErrorBoundary }: DefaultArgs) => {
  const [action, { data, loading, error }] = useStatefulApolloLazyQuery(DogDataLayer.queryDog, {
    variables: { name: Failure ? 'Dud' : 'Buck' },
    mock: Mock || undefined,
  })
  const onClick = React.useCallback(() => action(), [action])
  if (loading) {
    renderAction('OnDemandQuery', 'LOADING')
    return <Loading />
  }
  if (error) {
    renderAction('OnDemandQuery', 'ERROR', error)
    if (withErrorBoundary) throw error
    return <ErrorComponent error={error} />
  }

  renderAction('OnDemandQuery', data ? 'COMPLETE' : 'INIT', data)
  return (
    <>
      <Data data={data} />
      <button onClick={onClick}>Load Query</button>
    </>
  )
}
OnDemandQuery.args = DefaultArgs
OnDemandQuery.parameters = {
  assets: [DogDataLayerFile],
}

const moreVariables = Failure => ({ limit: 3, offset: Failure ? -1 : 0 })
const pageVariables = Failure => ({ limit: 3, page: Failure ? -1 : 1 })

export const ListQuery = ({ Mock, Failure, withErrorBoundary, Mode }: ListArgs) => {
  const variables = useMemo(() => (Mode === 'paged' ? pageVariables : moreVariables)(Failure), [Failure, Mode])
  const { data, loading, error, fetchMore } = useStatefulApolloQuery(
    // @ts-ignore
    Mode === 'paged' ? DogsDataLayer.listDogsByPage : DogsDataLayer.listDogsProgressively,
    {
      variables,
      mock: Mock || undefined,
    },
  )
  if (loading) {
    renderAction('fetchMoreQuery', 'LOADING')
  }
  if (error) {
    renderAction('fetchMoreQuery', 'ERROR', error)
    if (withErrorBoundary) throw error
    return <ErrorComponent error={error} />
  }

  const updateContent = async variables => {
    let fetchResult: any = await fetchMore({ variables })
    if (fetchResult) {
      fetchResult = fetchResult.data
      renderAction('fetchMoreQuery', 'COMPLETE', JSON.stringify(fetchResult.pageInfo), fetchResult)
    }
    return fetchResult
  }

  const Data = Mode === 'paged' ? PagedApolloData : MoreApolloData
  return <Data data={data} fetchMore={updateContent} />
}
ListQuery.args = ListArgs
ListQuery.argTypes = listArgTypes
ListQuery.parameters = {
  assets: [
    { name: 'listDogsProgressively.tsx', url: DogsProgressivelyDataLayerFile },
    { name: 'listDogsByPage.tsx', url: DogsByPageDataLayerFile },
  ],
}
