import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;
            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    height: '100vh', padding: 32, textAlign: 'center', gap: 16,
                    background: 'var(--bg-base)', color: 'var(--text-primary)',
                }}>
                    <div style={{ fontSize: 48, marginBottom: 8 }}>⚠</div>
                    <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Something went wrong</h1>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 400, lineHeight: 1.6 }}>
                        An unexpected error occurred. Please try refreshing the page.
                    </p>
                    <pre style={{
                        fontSize: 11, padding: 12, background: 'var(--bg-overlay)', borderRadius: 'var(--radius-md)',
                        maxWidth: '100%', overflow: 'auto', textAlign: 'left', color: 'var(--text-secondary)',
                    }}>
                        {this.state.error?.message}
                    </pre>
                    <button
                        className="btn btn-primary"
                        style={{ padding: '8px 24px', fontSize: 13 }}
                        onClick={() => window.location.reload()}
                    >
                        Reload page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}