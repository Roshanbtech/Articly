import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Lock, LogIn, Sparkles } from 'lucide-react';
import type { CancelTokenSource } from 'axios';

import Loader from '../../components/common/Loader';
import InteractiveBackground from '../../components/backgrounds/InteractiveBackground';

import { useAuth } from '../../hooks/useAuth';
import { createCancelTokenSource } from '../../config/apiClient';
import { ApiClientError } from '../../lib/apiClientError';
import { mapValidationErrors } from '../../lib/validation';
import type { FieldErrorMap } from '../../lib/validation';
import type { AuthUser } from '../../types/auth.types';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: (user: AuthUser) => void;
  onNavigateToRegister: () => void;
}

const Login: React.FC<LoginProps> = React.memo(
  ({ onLogin, onNavigateToRegister }) => {
    const { login } = useAuth();

    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [formError, setFormError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({});

    const cancelSourceRef = useRef<CancelTokenSource | null>(null);

    useEffect(() => {
      return () => {
        cancelSourceRef.current?.cancel('Login component unmounted');
      };
    }, []);

    const identifierPlaceholder = useMemo(
      () =>
        loginMethod === 'email'
          ? 'Enter your email'
          : 'Enter your 10-digit phone',
      [loginMethod]
    );

    const normalizeIdentifier = useCallback(() => {
      if (loginMethod === 'phone') {
        return identifier.replace(/\D/g, '');
      }
      return identifier.trim();
    }, [identifier, loginMethod]);

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setFormError(null);
        setFieldErrors({});

        cancelSourceRef.current?.cancel('New login request');
        const src = createCancelTokenSource();
        cancelSourceRef.current = src;

        try {
          const normalized = normalizeIdentifier();

          const { user } = await login(
            {
              identifier: normalized,
              password,
            },
            { cancelToken: src.token }
          );

          toast.success("Login successful! Welcome back.");

          onLogin(user);
        } catch (err) {
          if (err instanceof ApiClientError) {
            const data = err.data;

            if (data?.errors?.length) {
              setFieldErrors(mapValidationErrors(data.errors));
            } else {
              const msg = data?.message || err.message || 'Login failed';
              setFormError(msg);
              toast.error(msg);
            }
          } else {
            const msg = 'Something went wrong. Please try again.';
            setFormError(msg);
            toast.error(msg);
          }
        } finally {
          setLoading(false);
        }
      },
      [login, normalizeIdentifier, onLogin, password]
    );

    const identifierError = fieldErrors.identifier;
    const passwordError = fieldErrors.password;

    return (
      <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
        <InteractiveBackground />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="relative z-10 w-full max-w-md px-4"
        >
          <div className="rounded-3xl border border-[#D4AF37]/25 bg-black/60 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] p-8">
            {/* Header / Brand */}
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-8"
            >
              <div
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.55)] mb-4"
                style={{
                  background:
                    'linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)',
                }}
              >
                <Sparkles className="w-5 h-5 text-black" />
                <h1 className="text-sm font-semibold tracking-[0.18em] uppercase text-black">
                  Articly
                </h1>
              </div>
              <p className="text-sm text-gray-400">
                Welcome back. Sign in to continue.
              </p>
            </motion.div>

            {formError && (
              <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                {formError}
              </div>
            )}

            {/* Login Method Toggle */}
            <div className="flex gap-2 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-3 rounded-xl transition-all border ${
                  loginMethod === 'email'
                    ? 'text-black shadow-[0_0_25px_rgba(212,175,55,0.6)]'
                    : 'bg-transparent text-gray-300 border-[#D4AF37]/40'
                }`}
                style={
                  loginMethod === 'email'
                    ? {
                        background:
                          'linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)',
                        borderColor: 'transparent',
                      }
                    : undefined
                }
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-3 rounded-xl transition-all border ${
                  loginMethod === 'phone'
                    ? 'text-black shadow-[0_0_25px_rgba(212,175,55,0.6)]'
                    : 'bg-transparent text-gray-300 border-[#D4AF37]/40'
                }`}
                style={
                  loginMethod === 'phone'
                    ? {
                        background:
                          'linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)',
                        borderColor: 'transparent',
                      }
                    : undefined
                }
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Phone
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Identifier */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]">
                    {loginMethod === 'email' ? (
                      <Mail className="w-5 h-5" />
                    ) : (
                      <Phone className="w-5 h-5" />
                    )}
                  </div>
                  <input
                    type={loginMethod === 'email' ? 'email' : 'tel'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={identifierPlaceholder}
                    className={`w-full pl-12 pr-4 py-3 bg-black/60 border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      identifierError
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-[#D4AF37]/40 focus:ring-[#D4AF37] focus:border-[#D4AF37]'
                    }`}
                    required
                  />
                </div>
                {identifierError && (
                  <p className="mt-1 text-xs text-red-400">
                    {identifierError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full pl-12 pr-4 py-3 bg-black/60 border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      passwordError
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-[#D4AF37]/40 focus:ring-[#D4AF37] focus:border-[#D4AF37]'
                    }`}
                    required
                  />
                </div>
                {passwordError && (
                  <p className="mt-1 text-xs text-red-400">
                    {passwordError}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-black font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    'linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)',
                  boxShadow: '0 0 35px rgba(212, 175, 55, 0.7)',
                }}
              >
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don&apos;t have an account?{' '}
                <button
                  onClick={onNavigateToRegister}
                  className="text-[#D4AF37] hover:text-[#f4e7b0] font-medium transition-colors"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
);

export default Login;
