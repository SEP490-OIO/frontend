/**
 * ErrorBoundary — catches unhandled JavaScript errors in the component tree.
 *
 * React error boundaries MUST be class components (no hooks equivalent).
 * This is the one exception to our "functional components only" rule.
 *
 * Errors are logged to console for debugging but NOT shown to the user.
 * Instead, the fallback component (ErrorPage) displays a friendly message.
 */

import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  /** Component to render when an error is caught */
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to console for debugging — in production, this could send to
    // an error tracking service (Sentry, etc.)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
