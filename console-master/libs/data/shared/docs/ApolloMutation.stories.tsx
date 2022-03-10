import DogDataLayerFile from '!!file-loader?name=[path][name].[ext].txt!./apollo/dog/mutateDog'
import React from 'react'

import { useStatefulApolloMutation } from '../src'
import { DogDataLayer } from './apollo'
import { apolloDecorator } from './apollo/support'
import { argTypes, Data, decorators, DefaultArgs, ErrorComponent, Loading, renderAction } from './util'

export default {
  title: 'Apollo',
  decorators: [apolloDecorator, ...decorators],
  argTypes,
  parameters: {
    assets: [{ name: 'dog.ts', url: DogDataLayerFile }],
  },
}

export const SimpleMutation = ({ Failure, Mock, withErrorBoundary }: DefaultArgs) => {
  const [action, { data, loading, error }] = useStatefulApolloMutation(DogDataLayer.mutateDog, {
    variables: { name: Failure ? 'Dud' : 'Buck' },
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
