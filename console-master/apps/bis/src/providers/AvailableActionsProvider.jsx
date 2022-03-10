import PropTypes from 'prop-types'
import React, { createContext, useMemo } from 'react'

import { ActionTypesQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

export const Context = createContext([])
const { Provider, Consumer } = Context

const AvailableActionsContext = ({ children }) => {
  const { loading, error, data = {} } = useStatefulApolloQuery(ActionTypesQuery)
  const { availableActions } = data

  const value = useMemo(
    () => ({
      loading,
      error,
      data: availableActions,
    }),
    [loading, error, availableActions],
  )
  return <Provider value={value}>{children}</Provider>
}

AvailableActionsContext.propTypes = {
  children: PropTypes.node.isRequired,
}

AvailableActionsContext.Consumer = Consumer
export default AvailableActionsContext
