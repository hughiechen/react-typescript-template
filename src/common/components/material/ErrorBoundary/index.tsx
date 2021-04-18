import React from 'react'
import { errorHandler } from '@/common/utils/errorHandler'
import { ErrorPlaceholder } from './ErrorPlaceholder'
import { ReactLifecycleException } from './ReactLifecycleException'

export interface ErrorBoundaryProps {
  errorComponent?: React.ReactNode
  children?: React.ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends React.PureComponent<ErrorBoundaryProps, State> {
  static defaultProps: PickOptional<ErrorBoundaryProps> = {
    errorComponent: <ErrorPlaceholder />,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  state: State = {
    hasError: false,
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.props.children !== prevProps.children) {
      this.setState({ hasError: false })
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    errorHandler.catch(new ReactLifecycleException(error.message, error.stack ?? '', errorInfo.componentStack))
  }

  render() {
    return this.state.hasError ? this.props.errorComponent : this.props.children
  }
}

export { ErrorPlaceholder }

export default ErrorBoundary
