import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

import GridBackground from '../../components/backgrounds/GridBackground';
import { useAuth } from '../../hooks/useAuth';

const GOLD_GRADIENT =
  'linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    if (user?.role === 'admin') {
      navigate('/admin', { replace: true });
    } else if (user) {
      navigate('/user', { replace: true });
    } else {
      navigate('/auth/login', { replace: true });
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-gray-100 overflow-hidden">
      <GridBackground />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="max-w-md w-full rounded-3xl border border-[#D4AF37]/40 bg-black/85 backdrop-blur-2xl shadow-[0_0_45px_rgba(0,0,0,0.95)] px-8 py-10 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-[0_0_30px_rgba(212,175,55,0.7)]"
            style={{ background: GOLD_GRADIENT }}
          >
            <AlertTriangle className="w-8 h-8 text-black" />
          </div>

          <h1 className="text-2xl font-semibold mb-2 text-gray-50">
            404 – Page Not Found
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            The route you tried to open doesn’t exist in Articly. 
            It may have moved, been renamed, or never existed.
          </p>

          <button
            type="button"
            onClick={handleGoHome}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium text-black shadow-[0_0_24px_rgba(212,175,55,0.7)]"
            style={{ background: GOLD_GRADIENT }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go back to home</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
