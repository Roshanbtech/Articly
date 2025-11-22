// src/components/settings/PreferencesSettings.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

import { updateUserPreferences } from "../../services/user.service";
import type { ArticlyUser } from "../../types/user.types";
import { ApiClientError } from "../../lib/apiClientError";
import type { ApiErrorResponse } from "../../types/api.types";
import Loader from "../common/Loader";
import { listCategories } from "../../services/category.service"; // already used elsewhere

interface PreferencesSettingsProps {
  user: ArticlyUser;
  onUserUpdated: (user: ArticlyUser) => void;
}

interface PreferenceCategory {
  id: string;
  name: string;
}

const GOLD_GRADIENT =
  "linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)";

export default function PreferencesSettings({
  user,
  onUserUpdated,
}: PreferencesSettingsProps) {
  const [categories, setCategories] = useState<PreferenceCategory[]>([]);
  const [selected, setSelected] = useState<string[]>(user.preferences ?? []);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    setSelected(user.preferences ?? []);
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      setLoadingCategories(true);
      setGeneralError(null);
      try {
        // assuming listCategories returns { categories: [...] } or just an array
        const result: any = await listCategories();
        const cats: any[] = Array.isArray(result.categories)
          ? result.categories
          : Array.isArray(result)
          ? result
          : [];

        const mapped: PreferenceCategory[] = cats.map((c) => ({
          id: c.id ?? c._id ?? "",
          name: c.name,
        }));

        if (isMounted) {
          setCategories(mapped.filter((c) => c.id));
        }
      } catch (err: any) {
        console.error("Failed to load categories for preferences", err);
        const msg = "Failed to load categories";
        setGeneralError(msg);
        toast.error(msg);
      } finally {
        if (isMounted) setLoadingCategories(false);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleCategory = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setGeneralError(null);

    try {
      const updated = await updateUserPreferences({
        preferences: selected,
      });
      toast.success("Preferences updated");
      onUserUpdated(updated);
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        const data = err.data as ApiErrorResponse | undefined;
        const msg = data?.message || err.message || "Failed to update preferences";
        setGeneralError(msg);
        toast.error(msg);
      } else {
        console.error("Update preferences failed", err);
        const msg = "Unexpected error occurred. Please try again.";
        setGeneralError(msg);
        toast.error(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {generalError && (
        <div className="rounded-xl border border-red-500/40 bg-red-900/40 px-4 py-3 text-xs text-red-100">
          {generalError}
        </div>
      )}

      <div>
        <h2 className="text-gray-100 text-base font-semibold mb-1">
          Preferences
        </h2>
        <p className="text-xs text-gray-400">
          Choose categories to personalise your feed.
        </p>
      </div>

      {loadingCategories ? (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      ) : categories.length === 0 ? (
        <p className="text-xs text-gray-500">
          No categories available yet. Once categories are created, you will be
          able to customise your preferences here.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const isSelected = selected.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex items-center justify-between px-4 py-2 rounded-xl border text-xs transition-all ${
                    isSelected
                      ? "border-transparent text-black shadow-[0_0_22px_rgba(212,175,55,0.55)]"
                      : "border-white/10 text-gray-200 bg-black/50 hover:border-[#D4AF37]/40 hover:bg-white/5"
                  }`}
                  style={
                    isSelected
                      ? { background: GOLD_GRADIENT }
                      : undefined
                  }
                >
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
              <span>
                Selected:{" "}
                <span className="text-gray-200 font-medium">
                  {selected.length}
                </span>
              </span>
            </div>

            <motion.button
              whileHover={!saving ? { y: -1 } : undefined}
              whileTap={!saving ? { scale: 0.97 } : undefined}
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-black disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_24px_rgba(212,175,55,0.7)]"
              style={{ background: GOLD_GRADIENT }}
            >
              {saving ? (
                <>
                  <span className="scale-75">
                    <Loader />
                  </span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Save Preferences</span>
                </>
              )}
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}
