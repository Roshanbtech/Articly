// src/pages/dashboard/AdminDashboard.tsx
import { useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  TrendingUp,
  Activity,
  Eye,
  ThumbsUp,
  Crown,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Navbar from "../../components/common/Navbar";
import SkeletonCard from "../../components/skeletons/SkeletonCard";
import InteractiveBackground from "../../components/backgrounds/InteractiveBackground";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";
import { useAuth } from "../../hooks/useAuth";
import type { AdminTopArticle } from "../../types/admin-dashboard.types";

interface AdminDashboardProps {
  onLogout: () => void;
}

const GOLD = "#D4AF37";
const CATEGORY_COLORS = [
  "#8b5cf6",
  "#ec4899",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#6366f1",
];

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, loading, error } = useAdminDashboard(6);

  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  const stats = useMemo(() => {
    if (!data?.counts) return [];

    const { counts } = data;

    return [
      {
        label: "Total Users",
        value: counts.totalUsers.toString(),
        icon: Users,
        color: "from-purple-500 to-purple-600",
      },
      {
        label: "Total Articles",
        value: counts.totalArticles.toString(),
        icon: FileText,
        color: "from-pink-500 to-pink-600",
      },
      {
        label: "Total Reactions",
        value: counts.totalReactions.toString(),
        icon: Activity,
        color: "from-blue-500 to-blue-600",
      },
      {
        label: "Total Categories",
        value: counts.totalCategories.toString(),
        icon: Eye,
        color: "from-green-500 to-green-600",
      },
    ];
  }, [data]);

  const userGrowthData = useMemo(
    () =>
      (data?.userGrowth ?? []).map((point) => ({
        month: MONTH_LABELS[point.month - 1] ?? point.label,
        users: point.count,
      })),
    [data]
  );

  const categoryData = useMemo(
    () =>
      (data?.topCategories ?? []).map((item, index) => ({
        name: item.category.name,
        value: item.articleCount,
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
        iconUrl: item.category.iconUrl,
      })),
    [data]
  );

  const authorNameById = useMemo(() => {
    const map: Record<string, string> = {};

    data?.topUsers.forEach((tu) => {
      map[tu.user.id] = `${tu.user.firstName} ${tu.user.lastName}`;
    });

    data?.recentUsers.forEach((ru) => {
      map[ru.id] = `${ru.firstName} ${ru.lastName}`;
    });

    data?.overviewRecentUsers.forEach((ou) => {
      map[ou._id] = `${ou.firstName} ${ou.lastName}`;
    });

    return map;
  }, [data]);

  const topArticles: AdminTopArticle[] = data?.topArticles ?? [];
  const topUsers = data?.topUsers ?? [];
  const recentUsers = data?.recentUsers ?? [];
  const recentArticles = data?.recentArticles ?? [];

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
          user={user}
          currentPage={location.pathname}
          onNavigate={handleNavigate}
          onLogout={onLogout}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.55)] mb-3"
              style={{
                background:
                  "linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)",
              }}
            >
              <TrendingUp className="w-4 h-4 text-black" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-black">
                Admin Analytics
              </span>
            </div>
            <h1 className="text-gray-100 mb-2 text-2xl font-semibold">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-400">
              Monitor Articly performance, users, and content at a glance.
            </p>
          </motion.div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="mb-6 rounded-xl border border-red-500/40 bg-red-900/40 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          {!loading && !error && data && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              >
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ y: -5 }}
                      className="bg-black/60 backdrop-blur-2xl rounded-2xl p-6 shadow-[0_0_35px_rgba(0,0,0,0.9)] border border-[#D4AF37]/25 hover:shadow-[0_0_45px_rgba(212,175,55,0.45)] transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                      <p className="text-xl font-semibold text-gray-50">
                        {stat.value}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-black/60 backdrop-blur-2xl rounded-2xl p-6 shadow-[0_0_35px_rgba(0,0,0,0.9)] border border-[#D4AF37]/25"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-100 text-sm font-medium">
                      User Growth
                    </h3>
                    <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis
                        dataKey="month"
                        stroke="#9ca3af"
                        tick={{ fill: "#9ca3af", fontSize: 12 }}
                      />
                      <YAxis
                        stroke="#9ca3af"
                        tick={{ fill: "#9ca3af", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.9)",
                          borderRadius: 12,
                          border: "1px solid rgba(212,175,55,0.5)",
                          backdropFilter: "blur(10px)",
                          color: "#f9fafb",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke={GOLD}
                        strokeWidth={3}
                        dot={{ fill: GOLD, r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-black/60 backdrop-blur-2xl rounded-2xl p-6 shadow-[0_0_35px_rgba(0,0,0,0.9)] border border-[#D4AF37]/25"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-100 text-sm font-medium">
                      Category Distribution
                    </h3>
                    <Activity className="w-5 h-5 text-pink-400" />
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) =>
                          `${entry.name} ${((entry.percent ?? 0) * 100).toFixed(
                            0
                          )}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.9)",
                          borderRadius: 12,
                          border: "1px solid rgba(212,175,55,0.5)",
                          backdropFilter: "blur(10px)",
                          color: "#D4AF37", 
                        }}
                        labelStyle={{ color: "#D4AF37" }} 
                        itemStyle={{ color: "#D4AF37" }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="mt-4 space-y-2">
                    {categoryData.map((cat) => (
                      <div
                        key={cat.name}
                        className="flex items-center gap-3 text-xs text-gray-300"
                      >
                        {cat.iconUrl && (
                          <img
                            src={cat.iconUrl}
                            alt={cat.name}
                            className="w-6 h-6 rounded-md object-cover"
                          />
                        )}
                        <span className="flex-1">{cat.name}</span>
                        <span className="text-gray-400">
                          {cat.value} articles
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-black/60 backdrop-blur-2xl rounded-2xl p-6 shadow-[0_0_35px_rgba(0,0,0,0.9)] border border-[#D4AF37]/25"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-100 text-sm font-medium">
                      Top Articles
                    </h3>
                    <Crown className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="space-y-4">
                    {topArticles.map((article: AdminTopArticle, index) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center gap-4 p-3 bg-black/60 rounded-xl hover:bg-black/80 border border-white/5 transition-all"
                      >
                        <div
                          className="flex-shrink-0 w-8 h-8 rounded-full text-black flex items-center justify-center"
                          style={{
                            background:
                              "linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)",
                          }}
                        >
                          {/* {index + 1} */}
                          <img
                            src={
                              article.images && article.images.length > 0
                                ? article.images[0]
                                : ""
                            }
                            alt={article.title}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-100 truncate">
                            {article.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            by{" "}
                            {authorNameById[article.author] ?? "Unknown author"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-300">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            {article.likesCount}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-black/60 backdrop-blur-2xl rounded-2xl p-6 shadow-[0_0_35px_rgba(0,0,0,0.9)] border border-[#D4AF37]/25"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-100 text-sm font-medium">
                      Top Contributors
                    </h3>
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="space-y-4">
                    {topUsers.map((contributor, index) => (
                      <motion.div
                        key={contributor.user.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center gap-4 p-3 bg-black/60 rounded-xl hover:bg-black/80 border border-white/5 transition-all"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center">
                          {contributor.user.profileImage ? (
                            <img
                              src={contributor.user.profileImage}
                              alt={contributor.user.firstName}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            `${contributor.user.firstName[0]}${contributor.user.lastName[0]}`
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-100">
                            {contributor.user.firstName}{" "}
                            {contributor.user.lastName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {contributor.articleCount} articles
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-black/60 backdrop-blur-2xl rounded-2xl p-6 shadow-[0_0_35px_rgba(0,0,0,0.9)] border border-[#D4AF37]/25"
                >
                  <h3 className="text-gray-100 mb-6 text-sm font-medium">
                    Recent Users
                  </h3>
                  <div className="space-y-3">
                    {recentUsers.map((u, index) => (
                      <motion.div
                        key={u.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-3 bg-black/60 rounded-xl hover:bg-black/80 border border-white/5 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400 flex items-center justify-center text-white overflow-hidden">
                            {u.profileImage ? (
                              <img
                                src={u.profileImage}
                                alt={`${u.firstName} ${u.lastName}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              `${u.firstName[0]}${u.lastName[0]}`
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-100">
                              {u.firstName} {u.lastName}
                            </p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-black/60 backdrop-blur-2xl rounded-2xl p-6 shadow-[0_0_35px_rgba(0,0,0,0.9)] border border-[#D4AF37]/25"
                >
                  <h3 className="text-gray-100 mb-6 text-sm font-medium">
                    Recent Articles
                  </h3>
                  <div className="space-y-3">
                    {recentArticles.map((article, index) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-3 bg-black/60 rounded-xl hover:bg-black/80 border border-white/5 transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm text-gray-100 line-clamp-1">
                            {article.title}
                          </p>
                          <span className="text-xs px-2 py-1 rounded-full bg-indigo-900/40 text-indigo-200 border border-indigo-500/40 ml-2 whitespace-nowrap">
                            {article?.categoryName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>
                            by{" "}
                            {authorNameById[article.author] ?? "Unknown author"}
                          </span>
                          <span>
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
