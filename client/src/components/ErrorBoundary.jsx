import { Component } from 'react';
import Alert from './ui/Alert';
import Button from './ui/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
          <div className="max-w-md">
            <Alert
              variant="error"
              title="Oops! Something went wrong"
              message={this.state.error?.message || 'An unexpected error occurred'}
            />
            <div className="mt-6 space-y-3">
              <Button
                variant="primary"
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.href = '/';
                }}
              >
                Go Home
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <summary className="cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs overflow-auto text-slate-600 dark:text-slate-400">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
