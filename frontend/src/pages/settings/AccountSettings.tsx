// src/pages/settings/AccountSettings.tsx
import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, SlidersHorizontal, Shield } from "lucide-react";

import Navbar from "../../components/common/Navbar";
import InteractiveBackground from "../../components/backgrounds/InteractiveBackground";
import Loader from "../../components/common/Loader";

import { useAuth } from "../../hooks/useAuth";
import { useUserSettings } from "../../hooks/useUserSettings";

import ProfileSettings from "../../components/settings/ProfileSettings";
import PreferencesSettings from "../../components/settings/PreferencesSettings";
import SecuritySettings from "../../components/settings/SecuritySettings";

type SettingsTab = "profile" | "preferences" | "security";

interface AccountSettingsProps {
  onLogout: () => void;
}

const GOLD_GRADIENT =
  "linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)";

export default function AccountSettings({ onLogout }: AccountSettingsProps) {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading, error, setUser } = useUserSettings();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  const handleUserUpdated = (updated: any) => {
    setUser(updated);
  };

  // If auth not resolved, keep consistent with Navbar behaviour
  if (!authUser) {
    return null;
  }

  const renderTabButton = (
    id: SettingsTab,
    label: string,
    Icon: typeof User
  ) => {
    const isActive = activeTab === id;
    return (
      <button
        type="button"
        onClick={() => setActiveTab(id)}
        className={`flex flex-1 items-center justify-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-all ${
          isActive
            ? "text-gray-50 border-[#D4AF37]"
            : "text-gray-400 border-transparent hover:text-gray-100 hover:border-white/20"
        }`}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <InteractiveBackground />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10 min-h-screen flex flex-col"
      >
        <Navbar
          user={authUser}
          currentPage={location.pathname}
          onNavigate={handleNavigate}
          onLogout={onLogout}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.55)] mb-3"
              style={{ background: GOLD_GRADIENT }}
            >
              <User className="w-4 h-4 text-black" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-black">
                Settings
              </span>
            </div>
            <h1 className="text-gray-100 mb-2 text-2xl font-semibold">
              Account Settings
            </h1>
            <p className="text-sm text-gray-400">
              Manage your profile, preferences, and security.
            </p>
          </motion.div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-16">
              <Loader />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="mb-6 rounded-xl border border-red-500/40 bg-red-900/40 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          {/* Content card */}
          {!loading && user && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/60 backdrop-blur-2xl rounded-2xl p-6 shadow-[0_0_35px_rgba(0,0,0,0.9)] border border-[#D4AF37]/25"
            >
              {/* Tabs */}
              <div className="flex items-center rounded-2xl bg-black/60 border border-white/10 overflow-hidden mb-6">
                {renderTabButton("profile", "Profile", User)}
                {renderTabButton("preferences", "Preferences", SlidersHorizontal)}
                {renderTabButton("security", "Security", Shield)}
              </div>

              {/* Active tab */}
              <div className="mt-4">
                {activeTab === "profile" && (
                  <ProfileSettings
                    user={user}
                    onUserUpdated={handleUserUpdated}
                  />
                )}
                {activeTab === "preferences" && (
                  <PreferencesSettings
                    user={user}
                    onUserUpdated={handleUserUpdated}
                  />
                )}
                {activeTab === "security" && <SecuritySettings />}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
