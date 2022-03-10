/* eslint-disable react/forbid-foreign-prop-types */
import React, { memo, useCallback, useMemo } from 'react'

import { GeozoneListAddMutation } from '@ues-data/bis'
import { useStatefulApolloMutation } from '@ues-data/shared'

import { default as Popup } from '../../googleMaps/Popup'
import GeozoneMutatorPopup from './GeozoneMutatorPopup'

const CreateGeozone = memo(({ onDone, ...props }) => {
  const onClose = useCallback(() => {
    props.shape.setMap(null)
    onDone()
  }, [props.shape, onDone])

  const mutationOptions = useMemo(
    () => ({
      onCompleted: onClose,
    }),
    [onClose],
  )
  const [mutation, mutationState] = useStatefulApolloMutation(GeozoneListAddMutation, mutationOptions)

  return (
    <Popup position={props.position} invertedPosition={props.invertedPosition} stayOpen>
      <GeozoneMutatorPopup mutation={mutation} mutationState={mutationState} {...props} onDone={onClose} />
    </Popup>
  )
})

if (GeozoneMutatorPopup.propTypes) {
  const { mutation, mutationState, ...MutatorPropTypes } = GeozoneMutatorPopup.propTypes

  CreateGeozone.propTypes = MutatorPropTypes
}

CreateGeozone.displayName = 'CreateGeozone'

export default CreateGeozone
