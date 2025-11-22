// src/components/settings/SecuritySettings.tsx
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { changePassword } from "../../services/user.service";
import { ApiClientError } from "../../lib/apiClientError";
import type { ApiErrorResponse } from "../../types/api.types";
import { mapValidationErrors, type FieldErrorMap } from "../../lib/validation";
import Loader from "../common/Loader";

const GOLD_GRADIENT =
  "linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)";

export default function SecuritySettings() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);

    if (newPassword !== confirmPassword) {
      setFieldErrors({
        confirmPassword: "New password and confirmation do not match",
      });
      return;
    }

    setSubmitting(true);

    try {
      await changePassword({
        oldPassword,
        newPassword,
      });

      toast.success("Password changed successfully");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFieldErrors({});
      setGeneralError(null);
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        const data = err.data as ApiErrorResponse | undefined;

        if (data?.errors && Array.isArray(data.errors)) {
          setFieldErrors(mapValidationErrors(data.errors));
        }

        const firstFieldMsg = data?.errors?.[0]?.message;
        const msg =
          firstFieldMsg ||
          data?.message ||
          err.message ||
          "Failed to change password";

        setGeneralError(msg);
        toast.error(msg);
      } else {
        console.error("Change password failed", err);
        const msg = "Unexpected error occurred. Please try again.";
        setGeneralError(msg);
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderPasswordField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    show: boolean,
    setShow: (v: boolean) => void,
    name: "oldPassword" | "newPassword" | "confirmPassword",
    placeholder: string
  ) => (
    <div>
      <label className="block text-xs font-medium text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 pr-9 rounded-xl bg-black/70 border border-white/10 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/70"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-100"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {fieldErrors[name] && (
        <p className="mt-1 text-[11px] text-red-400">{fieldErrors[name]}</p>
      )}
      {name === "confirmPassword" && fieldErrors.confirmPassword && (
        <p className="mt-1 text-[11px] text-red-400">
          {fieldErrors.confirmPassword}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {generalError && (
        <div className="rounded-xl border border-red-500/40 bg-red-900/40 px-4 py-3 text-xs text-red-100">
          {generalError}
        </div>
      )}

      <div>
        <h2 className="text-gray-100 text-base font-semibold mb-1">Security</h2>
        <p className="text-xs text-gray-400">
          Update your password and strengthen account security.
        </p>
      </div>

      <div className="space-y-4">
        {renderPasswordField(
          "Current Password",
          oldPassword,
          setOldPassword,
          showOld,
          setShowOld,
          "oldPassword",
          "Enter current password"
        )}
        {renderPasswordField(
          "New Password",
          newPassword,
          setNewPassword,
          showNew,
          setShowNew,
          "newPassword",
          "Enter new password"
        )}
        {renderPasswordField(
          "Confirm New Password",
          confirmPassword,
          setConfirmPassword,
          showConfirm,
          setShowConfirm,
          "confirmPassword",
          "Re-enter new password"
        )}
      </div>

      <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/10 px-4 py-3 text-[11px] text-yellow-100 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 mt-0.5 text-[#D4AF37]" />
        <p className="leading-tight">
          Password must be at least 8 characters long and include uppercase,
          lowercase, number, and special character.
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <motion.button
          whileHover={!submitting ? { y: -1 } : undefined}
          whileTap={!submitting ? { scale: 0.97 } : undefined}
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-black disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_24px_rgba(212,175,55,0.7)]"
          style={{ background: GOLD_GRADIENT }}
        >
          {submitting ? (
            <>
              <span className="scale-75">
                <Loader />
              </span>
              <span>Updating...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Change Password</span>
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}
