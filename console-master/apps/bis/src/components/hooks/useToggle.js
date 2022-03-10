import { useState } from 'react'

import { useEventHandler } from '@ues-behaviour/react'

export default (propValue, { ignoreEvent = false } = {}) => {
  const [value, setValue] = useState(!!propValue)
  const toggle = useEventHandler(() => {
    setValue(value => !value)
  }, [ignoreEvent])
  return [value, toggle, setValue]
}
