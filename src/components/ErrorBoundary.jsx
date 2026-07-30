import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px 20px',
          maxWidth: '600px',
          margin: '80px auto',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
        }}>
          <h2 style={{ color: '#e74c3c', marginBottom: '12px' }}>页面出错了</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            应用遇到了一个错误，请刷新页面重试。
          </p>
          <details style={{
            textAlign: 'left',
            background: '#fff5f5',
            border: '1px solid #fcc',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '13px',
            color: '#333',
            maxHeight: '300px',
            overflow: 'auto',
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '8px' }}>
              错误详情
            </summary>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {this.state.error && this.state.error.toString()}
              {'\n\n'}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 24px',
              background: '#4a6cf7',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            刷新页面
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}