import { useLayoutEffect, useRef } from 'react'

export default reset => {
  const listRef = useRef()

  useLayoutEffect(() => {
    const { current } = listRef
    if (reset && current && current.resetScroll) {
      current.resetScroll()
    }
  }, [listRef, reset])

  return listRef
}
