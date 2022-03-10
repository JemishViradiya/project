/* eslint-disable react/forbid-foreign-prop-types */
import React, { memo, useCallback, useMemo } from 'react'

import { GeozoneListUpdateMutation } from '@ues-data/bis'
import { useStatefulApolloMutation } from '@ues-data/shared'

import GeozoneMutatorPopup from './GeozoneMutatorPopup'

const EditGeozone = memo(({ onDone, ...props }) => {
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
  const [mutation, mutationState] = useStatefulApolloMutation(GeozoneListUpdateMutation, mutationOptions)

  return <GeozoneMutatorPopup mutation={mutation} mutationState={mutationState} {...props} onDone={onClose} />
})

if (GeozoneMutatorPopup.propTypes) {
  const { mutation, mutationState, ...MutatorPropTypes } = GeozoneMutatorPopup.propTypes

  EditGeozone.propTypes = MutatorPropTypes
}

EditGeozone.displayName = 'EditGeozone'

export default EditGeozone
