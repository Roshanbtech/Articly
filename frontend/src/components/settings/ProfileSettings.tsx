// src/components/settings/ProfileSettings.tsx
import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, User } from "lucide-react";
import { toast } from "sonner";

import type { ArticlyUser } from "../../types/user.types";
import { updateProfile } from "../../services/user.service";
import { ApiClientError } from "../../lib/apiClientError";
import type { ApiErrorResponse } from "../../types/api.types";
import {
  mapValidationErrors,
  type FieldErrorMap,
} from "../../lib/validation";
import Loader from "../common/Loader";

interface ProfileSettingsProps {
  user: ArticlyUser;
  onUserUpdated: (user: ArticlyUser) => void;
}

const GOLD_GRADIENT =
  "linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)";

export default function ProfileSettings({
  user,
  onUserUpdated,
}: ProfileSettingsProps) {
  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.profileImage || null
  );

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setImagePreview(user.profileImage || null);
    setImageFile(null);
    setFieldErrors({});
    setGeneralError(null);
  }, [user]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else if (user.profileImage) {
      setImagePreview(user.profileImage);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setGeneralError(null);

    try {
      const updated = await updateProfile({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        profileImageFile: imageFile ?? undefined,
      });

      toast.success("Profile updated successfully");
      onUserUpdated(updated);
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        const data = err.data as ApiErrorResponse | undefined;
        if (data?.errors && Array.isArray(data.errors)) {
          setFieldErrors(mapValidationErrors(data.errors));
        }
        const msg = data?.message || err.message || "Profile update failed";
        setGeneralError(msg);
        toast.error(msg);
      } else {
        console.error("Profile update failed", err);
        const msg = "Unexpected error occurred. Please try again.";
        setGeneralError(msg);
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {generalError && (
        <div className="rounded-xl border border-red-500/40 bg-red-900/40 px-4 py-3 text-xs text-red-100">
          {generalError}
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-gray-100 text-base font-semibold mb-1">
          Profile
        </h2>
        <p className="text-xs text-gray-400">
          Manage your account information and avatar.
        </p>
      </div>

      {/* Avatar + upload */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-black/70 border border-[#D4AF37]/40 flex items-center justify-center overflow-hidden">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-[#D4AF37]">
              {initials.trim() ? (
                <span className="text-sm font-semibold">{initials}</span>
              ) : (
                <User className="w-6 h-6" />
              )}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[#D4AF37]/40 text-xs text-gray-100 hover:bg-white/5 cursor-pointer">
            <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
            <span>Upload new photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="text-[10px] text-gray-500">
            PNG/JPG up to 2MB. Square images work best.
          </p>
        </div>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/70 border border-white/10 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/70"
            placeholder="John"
          />
          {fieldErrors.firstName && (
            <p className="mt-1 text-[11px] text-red-400">
              {fieldErrors.firstName}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/70 border border-white/10 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/70"
            placeholder="Doe"
          />
          {fieldErrors.lastName && (
            <p className="mt-1 text-[11px] text-red-400">
              {fieldErrors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Readonly fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-gray-400 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            value={user.phone}
            disabled
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-gray-400 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Submit */}
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
              <span>Saving...</span>
            </>
          ) : (
            <>
              <User className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}
