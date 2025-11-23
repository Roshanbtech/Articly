import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, RefreshCcw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GridBackground from '../../components/backgrounds/GridBackground';

const GOLD_GRADIENT =
  'linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)';

interface ErrorBoundaryInnerProps {
  children: React.ReactNode;
  onGoHome: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Class-based boundary: catches render errors.
 * Navigation is injected via onGoHome from a functional wrapper (so we can use useNavigate).
 */
class ErrorBoundaryInner extends React.Component<
  ErrorBoundaryInnerProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: undefined,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Central hook for logging (Sentry, LogRocket, etc.)
    // eslint-disable-next-line no-console
    console.error('Articly ErrorBoundary caught an error', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="relative min-h-screen bg-black text-gray-100 overflow-hidden">
        <GridBackground />

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="max-w-lg w-full rounded-3xl border border-[#D4AF37]/40 bg-black/85 backdrop-blur-2xl shadow-[0_0_45px_rgba(0,0,0,0.95)] px-8 py-10 text-center"
          >
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-[0_0_30px_rgba(212,175,55,0.7)]"
              style={{ background: GOLD_GRADIENT }}
            >
              <AlertOctagon className="w-8 h-8 text-black" />
            </div>

            <h1 className="text-2xl font-semibold mb-2 text-gray-50">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-400 mb-4">
              An unexpected error occurred while rendering this screen.
              You can try again or go back to your home view.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium border border-[#D4AF37]/60 text-[#f4e7b0] hover:bg-white/5 transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>Try again</span>
              </button>

              <button
                type="button"
                onClick={this.props.onGoHome}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium text-black shadow-[0_0_24px_rgba(212,175,55,0.7)]"
                style={{ background: GOLD_GRADIENT }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go back to home</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
}

/**
 * Functional wrapper to inject React Router navigation into the class boundary.
 */
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const handleGoHome = React.useCallback(() => {
    // For your app: "/" already redirects to /auth/login via AppRoutes,
    // or you can send user role-based later if needed.
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <ErrorBoundaryInner onGoHome={handleGoHome}>
      {children}
    </ErrorBoundaryInner>
  );
};

export default ErrorBoundary;
