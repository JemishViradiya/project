import AsyncDataLayerFile from '!!file-loader?name=[path][name].[ext].txt!./async/dog/mutateDog'
import React from 'react'

import { useStatefulAsyncMutation } from '../src'
import { DogDataLayer } from './async'
import { argTypes, Data, decorators, DefaultArgs, ErrorComponent, Loading, renderAction } from './util'

export default {
  title: 'Async',
  decorators: [...decorators],
  argTypes,
}

const queryVariables = { name: 'Buck' }
const failureQueryVariables = { name: 'Dud' }

export const SimpleMutation = ({ Mock, Failure, withErrorBoundary }: DefaultArgs) => {
  const [action, { data, loading, error }] = useStatefulAsyncMutation(DogDataLayer.mutateDog, {
    variables: Failure ? failureQueryVariables : queryVariables,
    mock: Mock || undefined,
  })
  const onClick = React.useCallback(() => action(), [action])
  if (loading) {
    renderAction('SimpleMutation', 'LOADING')
    return <Loading />
  }
  if (error) {
    renderAction('SimpleMutation', 'ERROR', error)
    if (withErrorBoundary) throw error
    return <ErrorComponent error={error} />
  }

  renderAction('SimpleMutation', data ? 'COMPLETE' : 'INIT', data)
  return (
    <>
      <Data data={data} />
      <button onClick={onClick}>Trigger Mutation</button>
    </>
  )
}
SimpleMutation.args = DefaultArgs
SimpleMutation.parameters = {
  assets: [AsyncDataLayerFile],
}
