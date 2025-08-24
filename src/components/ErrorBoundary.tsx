import { Component, ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: any }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }

  componentDidCatch(error: any, info: any) {
    console.error('🛑 React render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ fontFamily: 'sans-serif', padding: 32 }}>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Something went wrong rendering the dashboard.</h1>
          <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, overflowX: 'auto' }}>
            {String(this.state.error)}
          </pre>
          <p style={{ fontSize: 12, color: '#555' }}>Check the browser console for a full stack trace.</p>
        </div>
      )
    }
    return this.props.children
  }
}
