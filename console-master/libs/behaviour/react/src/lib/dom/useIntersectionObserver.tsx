import type React from 'react'
import { useEffect, useState } from 'react'

/** Based on Google WebDev Blog
 * https://developers.google.com/web/updates/2017/09/sticky-headers
 */
export const useIntersectionObserver = (ref: React.MutableRefObject<Element>): boolean => {
  const [hasIntersection, setIntersection] = useState<boolean>(false)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      setIntersection(!entries[0].isIntersecting)
    })
    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [ref])

  return hasIntersection
}
