import { useCallback, useEffect, useState } from 'react'

import { useStatefulApolloLazyQuery } from '@ues-data/shared'

export default (query, options = {}, callbackFn) => {
  const [inProgress, setInProgress] = useState(false)
  const [callbackParams, setCallbackParams] = useState([])
  const [queryTrigger, { called, data, loading }] = useStatefulApolloLazyQuery(query, options)
  const callback = useCallback(
    args => {
      setInProgress(true)
      setCallbackParams(args)
      queryTrigger(options)
    },
    [options, queryTrigger],
  )
  useEffect(() => {
    if (called && inProgress && !loading) {
      setInProgress(false)
      callbackFn(data, callbackParams)
    }
  }, [callbackFn, callbackParams, called, data, inProgress, loading])
  return callback
}
