import React from 'react'

type State = {
  error?: Error
}

type Props = {
  fallback?: React.ReactElement
  children?: React.ReactNode
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {} as State
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error(error.message, errorInfo.componentStack || errorInfo)
  }

  render(): JSX.Element {
    if (this.state.error) {
      // You can render any custom fallback UI
      if (!this.props.fallback) {
        return <h1>Something went wrong.</h1>
      }
      return React.cloneElement(this.props.fallback, this.state)
    }

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{this.props.children}</>
  }
}
