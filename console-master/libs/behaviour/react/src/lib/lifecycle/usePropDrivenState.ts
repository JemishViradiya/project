import { useEffect, useRef, useState } from 'react'

const defaultCompareFn = (a: unknown, b: unknown) => a === b

// eslint-disable-next-line @typescript-eslint/ban-types
export const usePropDrivenState = <State extends {}>(
  externalState: State,
  compareFn: (a?: State, b?: State) => boolean = defaultCompareFn,
) => {
  const stateHook = useState<State>(externalState)
  const [, setState] = stateHook

  const ref = useRef<State>(externalState)
  useEffect(() => {
    if (!compareFn(externalState, ref.current)) {
      ref.current = externalState
      setState(externalState)
    }
  }, [compareFn, externalState, setState])
  return stateHook
}
