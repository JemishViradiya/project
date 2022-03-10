import type { Dispatch, SetStateAction } from 'react'
import React from 'react'
import type { DefaultRootState } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'

import { UesReduxStore } from '../providers/redux'
import type { UesReduxSlices } from '../providers/redux/slices'
import { useMock } from './mockContext'
import type { AbstractMutation, StatefulResult } from './statefulCommon'

export type ReduxMutationType<Args> = (
  variables?: Args,
  opts?: {
    mock?: boolean | undefined
  },
) => unknown

declare type PropNamesOfType<T, PropType> = {
  [K in keyof T]: T[K] extends PropType ? K : never
}[keyof T]

export interface ReduxMutation<Result, Args extends unknown = Partial<Result>, Selected = StatefulResult<Result>>
  extends AbstractMutation<ReduxMutationType<Args>, Args, Result> {
  mockMutation?: ReduxMutationType<Args>
  mockMutationFn?: (args?: Partial<Args>) => Result
  selector: (args?: Args) => (state: DefaultRootState) => Selected
  equalityFn?: (left: Selected, right: Selected) => boolean
  dataProp?: PropNamesOfType<Selected, Result> | string | null
  errorProp?: PropNamesOfType<Selected, Error>
  loadingProp?: PropNamesOfType<Selected, boolean>
  slice?: UesReduxSlices
}

export type ReduxMutationOptions<Args extends unknown> = {
  variables?: Args
  skip?: boolean
  mock?: true | undefined
}

type ReduxMutationStateResult<Result> = {
  loading: boolean
  data?: Result
  error?: Error
  called?: boolean
}

export type ReduxMutationState<Result, Args extends unknown> = [
  (variables?: Args) => void | unknown | Promise<unknown>,
  ReduxMutationStateResult<Result>,
]

const coalesceArgsParam = <Args>(varsArg: { stopPropagation?: unknown } | never) => {
  return (varsArg && typeof varsArg.stopPropagation !== 'function' ? varsArg : undefined) as Args
}

const mockAction = async <Result, Args>(
  mockMutationFn: (args?: Args) => Result,
  vars: Args,
  setMockState: Dispatch<SetStateAction<ReduxMutationStateResult<Result>>>,
  delay = 1000,
) => {
  setMockState(state => ({ ...state, loading: true, called: true }))

  await new Promise(resolve => setTimeout(resolve, delay))

  const data = mockMutationFn(vars)
  setMockState(state => ({
    ...state,
    loading: false,
    called: true,
    data,
  }))
  return data
}

/**
 * Provides a ReduxMutationState<Result, Args> tracking a mutation lifecycle
 *
 * 1. Renders with { loading: true, data?: Result }
 * 2. Success renders with { loading: false, data: Result }
 * 3. Failure renders with { loading: false, error: Error, data?: Result }
 *
 * @param mutationParam {ReduxMutation<Result, Args, Selected>}
 * @param opts {ReduxMutationOptions<Result, Arg>}}
 */
export function useStatefulReduxMutation<Result, Args extends unknown, State, Selected>(
  mutationParam: ReduxMutation<Result, Args, Selected>,
  opts: ReduxMutationOptions<Args> = {},
): ReduxMutationState<Result, Args> {
  const {
    selector,
    equalityFn,
    mockMutation,
    mockMutationFn,
    defaultVariables,
    loadingProp = 'loading',
    errorProp = 'error',
    dataProp = 'data',
  } = mutationParam
  const { variables: variablesParam = defaultVariables } = opts
  const mounted = React.useRef<boolean>(false)
  const variables = React.useRef<Args>(variablesParam)
  React.useEffect(() => {
    variables.current = variablesParam
  }, [variablesParam])

  const dispatch = useDispatch()
  const result = useSelector<State, Selected>(selector(variables.current), equalityFn)
  const mockMe = useMock(mutationParam, opts)
  const shouldMockState = mockMe && !!mockMutationFn
  const mutation = (mockMe && mockMutation) || mutationParam.mutation

  const [mockState, setMockState] = React.useState<ReduxMutationStateResult<Result>>({
    loading: false,
    called: false,
  })

  const action = React.useCallback(
    async (varsArg?: Args | Event, opts?: { delay?: number }) => {
      if (!mounted.current) {
        mounted.current = true
        const mount = mutationParam.slice && UesReduxStore.mountSlice(mutationParam.slice)
        if (mount && mount.then) {
          await mount
        }
      }
      const vars = coalesceArgsParam<Args>(varsArg) || variables.current
      variables.current = vars
      if (!shouldMockState) {
        return dispatch(typeof mutation === 'function' ? mutation(vars, { mock: mockMe }) : mutation)
      }

      return mockAction(mockMutationFn, vars, setMockState, opts?.delay)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shouldMockState, dispatch, mutation, mockMe, mockMutationFn],
  )

  if (shouldMockState) {
    return [action, mockState]
  }

  if (!mounted.current) {
    return [action, { loading: false }]
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const data = result && dataProp ? result[dataProp] : result

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const error = result && result[errorProp]

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const loading = result && result[loadingProp]

  return [
    action,
    {
      loading: loading && !error,
      data,
      error,
    },
  ]
}
