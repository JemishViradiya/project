import { useCallback, useState } from 'react'

export default initialValue => {
  const [content, setContent] = useState({ current: initialValue })
  const setValue = useCallback(
    value => {
      if (value !== content.current) {
        setContent({
          current: value,
          last: content.current,
        })
      }
    },
    [content, setContent],
  )
  return [content.current, content.last, setValue]
}
