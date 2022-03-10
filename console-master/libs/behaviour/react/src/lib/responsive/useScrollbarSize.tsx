import React, { createContext, useContext, useEffect, useState } from 'react'

import type { SizeProps } from './utils'

const getSize = (el: HTMLElement): SizeProps => {
  if (el) {
    el.style.display = 'block'
    const { width, height } = el.getBoundingClientRect()
    return { width, height }
  } else {
    return initialValue
  }
}

const createRuler = () => {
  const subject = document.createElement('div')
  Object.assign(subject.style, {
    overflow: 'scroll',
    visibility: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'block !important',
  })
  document.body.insertAdjacentElement('beforeend', subject)
  return subject
}
const ruler = createRuler()

// guess initial value
let initialValue: SizeProps = getSize(ruler)
const Context = createContext(initialValue)

export const ScrollbarSizeProvider: React.FC = ({ children }): JSX.Element => {
  const [size, setSize] = useState(initialValue)

  useEffect(() => {
    const resizeObserver = new window.ResizeObserver(() => {
      setSize((initialValue = getSize(ruler)))
    })
    resizeObserver.observe(ruler)
    return () => resizeObserver.disconnect()
  }, [])

  return <Context.Provider value={size}>{children}</Context.Provider>
}

export function useScrollbarSize(): SizeProps {
  return useContext(Context)
}
