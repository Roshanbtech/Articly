import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  Lock,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';
import axios from 'axios';
import type { CancelTokenSource } from 'axios';
import { toast } from 'sonner';

import Loader from '../../components/common/Loader';
import InteractiveBackground from '../../components/backgrounds/InteractiveBackground';

import { useAuth } from '../../hooks/useAuth';
import { createCancelTokenSource } from '../../config/apiClient';
import { ApiClientError } from '../../lib/apiClientError';
import type { FieldErrorMap } from '../../lib/validation';
import { mapValidationErrors } from '../../lib/validation';
import { listCategories } from '../../services/category.service';

import type { AuthUser } from '../../types/auth.types';
import type { Category } from '../../types/category.types';

interface RegistrationProps {
  onRegister: (user: AuthUser) => void;
  onNavigateToLogin: () => void;
}

type Step = 1 | 2 | 3;

const GOLD = '#D4AF37';

interface RegistrationFormState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: string;
  password: string;
  confirmPassword: string;
  preferences: string[]; // category IDs
}

const INITIAL_FORM_STATE: RegistrationFormState = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  dob: '',
  password: '',
  confirmPassword: '',
  preferences: [],
};

const isStepValid = (step: Step, form: RegistrationFormState) => {
  if (step === 1) {
    return (
      !!form.firstName.trim() &&
      !!form.lastName.trim() &&
      !!form.phone.trim() &&
      !!form.email.trim()
    );
  }

  if (step === 2) {
    return (
      !!form.dob &&
      !!form.password &&
      !!form.confirmPassword &&
      form.password.length >= 8
    );
  }

  if (step === 3) {
    return form.preferences.length > 0;
  }

  return false;
};

// ---------- Reusable fields -------------------------------------------------

interface TextFieldProps {
  label: string;
  icon?: React.ReactNode;
  type?: string;
  value: string;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
}

const TextField = React.memo(
  ({
    label,
    icon,
    type = 'text',
    value,
    placeholder,
    error,
    onChange,
  }: TextFieldProps) => (
    <div>
      <label className="block text-sm text-gray-300 mb-2">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full py-3 pr-4 bg-black/60 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
            icon ? 'pl-12' : 'pl-4'
          } ${
            error
              ? 'border border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border border-[#D4AF37]/40 focus:ring-[#D4AF37] focus:border-[#D4AF37]'
          }`}
          required
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
);

interface PasswordFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  visible: boolean;
  error?: string;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
}

const PasswordField = React.memo(
  ({
    label,
    value,
    placeholder,
    visible,
    error,
    onChange,
    onToggleVisibility,
  }: PasswordFieldProps) => (
    <div>
      <label className="block text-sm text-gray-300 mb-2">{label}</label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-12 pr-12 py-3 bg-black/60 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border border-[#D4AF37]/40 focus:ring-[#D4AF37] focus:border-[#D4AF37]'
          }`}
          required
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37] hover:text-[#f4e7b0]"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
);

// ---------- Step components -------------------------------------------------

interface StepProps {
  form: RegistrationFormState;
  errors: FieldErrorMap;
  onChange: (field: keyof RegistrationFormState, value: string | string[]) => void;
}

const BasicInfoStep = React.memo(
  ({ form, errors, onChange }: StepProps) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="First Name"
          value={form.firstName}
          placeholder="John"
          icon={<User className="w-5 h-5 text-[#D4AF37]" />}
          error={errors.firstName}
          onChange={(value) => onChange('firstName', value)}
        />
        <TextField
          label="Last Name"
          value={form.lastName}
          placeholder="Doe"
          icon={<User className="w-5 h-5 text-[#D4AF37]" />}
          error={errors.lastName}
          onChange={(value) => onChange('lastName', value)}
        />
      </div>

      <TextField
        label="Phone Number"
        type="tel"
        value={form.phone}
        placeholder="07XXXXXXXX"
        icon={<Phone className="w-5 h-5 text-[#D4AF37]" />}
        error={errors.phone}
        onChange={(value) => onChange('phone', value)}
      />

      <TextField
        label="Email Address"
        type="email"
        value={form.email}
        placeholder="john@example.com"
        icon={<Mail className="w-5 h-5 text-[#D4AF37]" />}
        error={errors.email}
        onChange={(value) => onChange('email', value)}
      />
    </div>
  )
);

interface SecurityStepProps extends StepProps {
  dobInputRef: React.RefObject<HTMLInputElement | null>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

const SecurityStep = React.memo(
  ({
    form,
    errors,
    onChange,
    dobInputRef,
    showPassword,
    showConfirmPassword,
    onTogglePassword,
    onToggleConfirmPassword,
  }: SecurityStepProps) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Date of Birth
        </label>
        <div className="relative">
          <button
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37] hover:text-[#f4e7b0]"
            onClick={() => dobInputRef.current?.showPicker?.()}
          >
            <Calendar className="w-5 h-5" />
          </button>
          <input
            ref={dobInputRef}
            type="date"
            value={form.dob}
            onChange={(e) => onChange('dob', e.target.value)}
            className={`w-full pl-12 pr-4 py-3 bg-black/60 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
              errors.dob
                ? 'border border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border border-[#D4AF37]/40 focus:ring-[#D4AF37] focus:border-[#D4AF37]'
            }`}
            required
          />
        </div>
        {errors.dob && (
          <p className="mt-1 text-xs text-red-400">{errors.dob}</p>
        )}
      </div>

      <PasswordField
        label="Password"
        value={form.password}
        placeholder="Create a strong password"
        visible={showPassword}
        error={errors.password}
        onChange={(value) => onChange('password', value)}
        onToggleVisibility={onTogglePassword}
      />

      <PasswordField
        label="Confirm Password"
        value={form.confirmPassword}
        placeholder="Confirm your password"
        visible={showConfirmPassword}
        error={errors.confirmPassword}
        onChange={(value) => onChange('confirmPassword', value)}
        onToggleVisibility={onToggleConfirmPassword}
      />
    </div>
  )
);

interface InterestsStepProps extends StepProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const InterestsStep = React.memo(
  ({
    form,
    errors,
    onChange,
    categories,
    loading,
    error,
  }: InterestsStepProps) => {
    const togglePreference = (categoryId: string) => {
      const exists = form.preferences.includes(categoryId);
      const updated = exists
        ? form.preferences.filter((c) => c !== categoryId)
        : [...form.preferences, categoryId];

      onChange('preferences', updated);
    };

    if (loading) {
      return <p className="text-sm text-gray-400">Loading interests…</p>;
    }

    if (error) {
      return (
        <p className="text-sm text-red-400">
          {error} – please refresh and try again.
        </p>
      );
    }

    if (!categories.length) {
      return (
        <p className="text-sm text-gray-400">
          No interests configured. Please contact support.
        </p>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm text-gray-300">
              Select Your Interests (Choose at least one)
            </label>
          </div>
          {errors.preferences && (
            <p className="mb-2 text-xs text-red-400">{errors.preferences}</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => {
              const isSelected = form.preferences.includes(category.id);

              return (
                <motion.button
                  key={category.id}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => togglePreference(category.id)}
                  className={`py-3 px-4 rounded-xl text-sm transition-all border ${
                    isSelected
                      ? 'text-black shadow-[0_0_20px_rgba(212,175,55,0.7)]'
                      : 'bg-black/50 text-gray-200 hover:bg-black/70 border-[#D4AF37]/30'
                  }`}
                  style={
                    isSelected
                      ? {
                          background:
                            'linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)',
                          borderColor: 'transparent',
                        }
                      : undefined
                  }
                >
                  {category.name}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

const ProgressIndicator: React.FC<{ step: Step }> = React.memo(({ step }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
            i === step
              ? 'text-black shadow-[0_0_18px_rgba(212,175,55,0.7)] scale-110'
              : i < step
              ? 'text-black shadow-[0_0_12px_rgba(212,175,55,0.6)]'
              : 'bg-black/60 text-gray-500 border-[#D4AF37]/35'
          }`}
          style={
            i === step
              ? {
                  background:
                    'linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)',
                  borderColor: 'transparent',
                }
              : i < step
              ? {
                  background: GOLD,
                  borderColor: 'transparent',
                }
              : undefined
          }
        >
          {i < step ? <Check className="w-5 h-5" /> : i}
        </motion.div>
        {i < 3 && (
          <div
            className={`w-12 h-1 mx-2 rounded-full transition-all ${
              i < step ? 'bg-[#D4AF37]' : 'bg-white/10'
            }`}
          />
        )}
      </div>
    ))}
  </div>
));

// ---------- Main component --------------------------------------------------

const Registration: React.FC<RegistrationProps> = ({
  onRegister,
  onNavigateToLogin,
}) => {
  const { register } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState<RegistrationFormState>(INITIAL_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({});
  const [formError, setFormError] = useState<string | null>(null);

  const dobInputRef = useRef<HTMLInputElement | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const registerCancelSourceRef = useRef<CancelTokenSource | null>(null);
  const categoriesCancelSourceRef = useRef<CancelTokenSource | null>(null);

useEffect(() => {
  const src = createCancelTokenSource();
  categoriesCancelSourceRef.current = src;

  (async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);

      const categoryList = await listCategories(
        { page: 1, limit: 50 },
        src.token
      );

      setCategories(categoryList);
    } catch (err: any) {
      // If the request was cancelled, do nothing
      if (axios.isAxiosError(err) && err.code === 'ERR_CANCELED') {
        return;
      }

      if (err instanceof ApiClientError) {
        setCategoriesError(err.message || 'Unable to load categories');
      } else {
        setCategoriesError('Unable to load categories');
      }
    } finally {
      setCategoriesLoading(false);
    }
  })();

  return () => {
    // Cancel in-flight requests on unmount
    if (categoriesCancelSourceRef.current) {
      categoriesCancelSourceRef.current.cancel(
        'Registration component unmounted - categories'
      );
    }
    if (registerCancelSourceRef.current) {
      registerCancelSourceRef.current.cancel(
        'Registration component unmounted - register'
      );
    }
  };
}, []);

  const handleFieldChange = useCallback(
    (field: keyof RegistrationFormState, value: string | string[]) => {
      setForm((prev) => ({ ...prev, [field]: value as any }));
      setFieldErrors((prev) => {
        const clone = { ...prev };
        delete clone[field as string];
        return clone;
      });
    },
    []
  );

  const goNext = useCallback(() => {
    setStep((prev) => {
      const next = (prev + 1) as Step;
      return next <= 3 ? next : prev;
    });
  }, []);

  const goBack = useCallback(() => {
    setStep((prev) => {
      const next = (prev - 1) as Step;
      return next >= 1 ? next : prev;
    });
  }, []);

  const canProceed = useMemo(() => isStepValid(step, form), [step, form]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setFormError(null);
      setFieldErrors({});

      if (form.password !== form.confirmPassword) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: 'Passwords do not match',
        }));
        setStep(2);
        return;
      }

      setLoading(true);

      registerCancelSourceRef.current?.cancel('New registration request');
      const src = createCancelTokenSource();
      registerCancelSourceRef.current = src;

      try {
        const payload = {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.replace(/\D/g, ''), // 10-digit numeric
          dob: form.dob || undefined,
          password: form.password,
          preferences: form.preferences,
        };

        const { user } = await register(payload, {
          cancelToken: src.token,
        });

        toast.success("User registration successful! Welcome aboard.");

        onRegister(user);
      } catch (err) {
        if (err instanceof ApiClientError) {
          const data = err.data;
          if (data?.errors?.length) {
            const mapped = mapValidationErrors(data.errors);
            setFieldErrors(mapped);

            const fields = Object.keys(mapped);

            if (
              fields.some((f) =>
                ['firstName', 'lastName', 'phone', 'email'].includes(f)
              )
            ) {
              setStep(1);
            } else if (
              fields.some((f) => ['dob', 'password', 'confirmPassword'].includes(f))
            ) {
              setStep(2);
            } else if (fields.includes('preferences')) {
              setStep(3);
            }
          } else {
            const msg = data?.message || err.message || 'Registration failed';
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
    [form, onRegister, register]
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-black">
      <InteractiveBackground />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="rounded-3xl border border-[#D4AF37]/25 bg-black/60 backdrop-blur-2xl shadow-[0_0_45px_rgba(0,0,0,0.8)] p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-block px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.6)] mb-4"
              style={{
                background:
                  'linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)',
              }}
            >
              <h1 className="text-sm font-semibold tracking-[0.18em] uppercase text-black">
                Create Account
              </h1>
            </div>
            <p className="text-sm text-gray-400">Join Articly today.</p>
          </div>

          {formError && (
            <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              {formError}
            </div>
          )}

          <ProgressIndicator step={step} />

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  <BasicInfoStep
                    form={form}
                    errors={fieldErrors}
                    onChange={handleFieldChange}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  <SecurityStep
                    form={form}
                    errors={fieldErrors}
                    onChange={handleFieldChange}
                    dobInputRef={dobInputRef}
                    showPassword={showPassword}
                    showConfirmPassword={showConfirmPassword}
                    onTogglePassword={() => setShowPassword((v) => !v)}
                    onToggleConfirmPassword={() =>
                      setShowConfirmPassword((v) => !v)
                    }
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  <InterestsStep
                    form={form}
                    errors={fieldErrors}
                    onChange={handleFieldChange}
                    categories={categories}
                    loading={categoriesLoading}
                    error={categoriesError}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={goBack}
                  className="flex-1 py-3 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-gray-100 hover:bg-black/80 transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </motion.button>
              )}

              {step < 3 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={goNext}
                  disabled={!canProceed}
                  className="flex-1 py-3 rounded-xl text-black shadow-[0_0_30px_rgba(212,175,55,0.7)] hover:shadow-[0_0_40px_rgba(212,175,55,0.9)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background:
                      'linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)',
                  }}
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!canProceed || loading}
                  className="flex-1 py-3 rounded-xl text-black shadow-[0_0_30px_rgba(212,175,55,0.7)] hover:shadow-[0_0_40px_rgba(212,175,55,0.9)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background:
                      'linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)',
                  }}
                >
                  {loading ? <Loader /> : 'Create Account'}
                </motion.button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <button
                onClick={onNavigateToLogin}
                className="text-[#D4AF37] hover:text-[#f4e7b0] font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Registration;
