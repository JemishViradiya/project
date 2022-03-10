import React from 'react'

import { DisplayableError, GenericErrorBoundaryEvents } from '@ues-data/shared-types'

import type { ErrorBoundary } from './ErrorBoundary'

type State = {
  error?: Error
  errorMessage?: string
}

type Props = {
  fallback: React.ReactElement
  children?: React.ReactNode
}

const GenericErrorBoundaryContext = React.createContext(false)
const handleSuppressed = (_event: Event) => {
  const error = _event['error']
  if (error instanceof DisplayableError && error.suppressed) {
    _event.preventDefault()
  }
}

export class GenericErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {} as State
  }
  static contextType = GenericErrorBoundaryContext
  static displayName = 'GenericErrorBoundary'

  context: boolean

  previousError?: Error

  static getDerivedStateFromError(error: ErrorBoundary) {
    return { error, errorMessage: error.toString() }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (error instanceof DisplayableError && error.suppressed) {
      return
    }
    console.log(`${GenericErrorBoundary.displayName}: ${error.message}\n${info.componentStack}`)
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.updateIfInError)
    window.addEventListener(GenericErrorBoundaryEvents.Invalidate, this.updateIfInError)
    window.addEventListener('error', handleSuppressed)
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.updateIfInError)
    window.addEventListener(GenericErrorBoundaryEvents.Invalidate, this.updateIfInError)
    window.removeEventListener('error', handleSuppressed)
  }

  updateIfInError = (_event: Event) => {
    if (this.previousError !== this.state?.error) {
      this.previousError = this.state?.error
      this.forceUpdate()
    }
  }

  render(): JSX.Element {
    const isNested = this.context
    const { children, fallback } = this.props
    const { error, errorMessage } = this.state
    const previousError = this.previousError
    this.previousError = error

    if (error && error !== previousError) {
      return <React.Suspense fallback={null}>{React.cloneElement(fallback, { error, nested: isNested })}</React.Suspense>
    }
    if (previousError) this.previousError = undefined

    return (
      <GenericErrorBoundaryContext.Provider value={true} key={errorMessage}>
        <React.Fragment key={errorMessage}>{children}</React.Fragment>
      </GenericErrorBoundaryContext.Provider>
    )
  }
}
