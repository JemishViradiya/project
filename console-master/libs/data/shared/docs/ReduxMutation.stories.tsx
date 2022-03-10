import React from 'react'

import { useStatefulReduxMutation } from '../src'
import { DogDataLayer } from './redux/dog'
import DogDataLayerSources from './redux/dog.sources'
import { uesDecorator } from './redux/support'
import { argTypes, Data, decorators, DefaultArgs, ErrorComponent, Loading, renderAction } from './util'

export default {
  title: 'Redux',
  decorators: [uesDecorator, ...decorators],
  argTypes,
  parameters: {
    assets: DogDataLayerSources,
  },
}

export const SimpleMutation = ({ Failure, Mock, withErrorBoundary }: DefaultArgs) => {
  const [action, { data, loading, error }] = useStatefulReduxMutation(DogDataLayer.mutateDog, {
    variables: { name: Failure ? 'Dud' : 'Buck', isFriend: true },
    mock: Mock || undefined,
  })
  const onClick = () => action()
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
