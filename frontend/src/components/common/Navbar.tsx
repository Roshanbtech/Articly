import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  FileText,
  Settings,
  LogOut,
  LayoutDashboard,
  FolderTree,
  Image,
  Menu,
  X,
  Sparkle,
} from 'lucide-react';

interface BasicUser {
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
}

interface NavbarProps {
  user: BasicUser | null | undefined; // allow undefined/null
  currentPage: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const GOLD_GRADIENT =
  'linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)';

export default function Navbar({
  user,
  currentPage,
  onNavigate,
  onLogout,
}: NavbarProps) {
  // If auth not resolved or user not logged in, don’t render navbar at all
  if (!user) return null;

  // NEW: mobile menu state
  const [mobileOpen, setMobileOpen] = useState(false);

  const userNavItems = [
    { id: 'dashboard', label: 'Feed', icon: Home, path: '/user' },
    { id: 'list', label: 'My Articles', icon: FileText, path: '/user/articles' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/user/settings' },
  ];

  const adminNavItems = [
    { id: 'admin', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'categories', label: 'Categories', icon: FolderTree, path: '/admin/categories' },
    { id: 'banners', label: 'Banners', icon: Image, path: '/admin/banners' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const navItems = user.role === 'admin' ? adminNavItems : userNavItems;

  const handleMobileNavigate = (path: string) => {
    onNavigate(path);
    setMobileOpen(false);
  };

  const handleMobileLogout = () => {
    setMobileOpen(false);
    onLogout();
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 backdrop-blur-2xl bg-black/80 border-b border-[#D4AF37]/25 shadow-[0_0_40px_rgba(0,0,0,0.9)]"
    >
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand + Nav */}
          <div className="flex items-center gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.55)]"
              style={{ background: GOLD_GRADIENT }}
            >
              <span className="text-sm font-semibold tracking-[0.18em] uppercase text-black">
                <Sparkle className="inline-block w-4 h-4 mr-1 -mt-1" />
                Articly
              </span>
            </motion.div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.path;

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onNavigate(item.path)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all border ${
                      isActive
                        ? 'text-black shadow-[0_0_24px_rgba(212,175,55,0.7)]'
                        : 'text-gray-200 bg-transparent border-transparent hover:border-[#D4AF37]/40 hover:bg-white/5'
                    }`}
                    style={
                      isActive
                        ? { background: GOLD_GRADIENT, borderColor: 'transparent' }
                        : undefined
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right: User + Logout / Mobile menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm text-gray-100">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] tracking-[0.18em] uppercase text-[#D4AF37]">
                {user.role}
              </p>
            </div>

            {/* Desktop logout */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-red-900/30 text-red-200 hover:bg-red-700/40 border border-red-500/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </motion.button>

            {/* Mobile hamburger (shows on < md) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex md:hidden items-center justify-center p-2 rounded-xl border border-[#D4AF37]/40 text-gray-100 hover:bg-white/5 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="md:hidden border-t border-[#D4AF37]/20 bg-black/95 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => handleMobileNavigate(item.path)}
                  className={`flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm border transition-all ${
                    isActive
                      ? 'bg-[#D4AF37] text-black border-transparent'
                      : 'text-gray-200 border-transparent hover:border-[#D4AF37]/40 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={handleMobileLogout}
              className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm bg-red-900/40 text-red-200 border border-red-500/40 hover:bg-red-700/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
