// src/types/admin-dashboard.types.ts

export interface AdminCounts {
  totalUsers: number;
  totalArticles: number;
  totalCategories: number;
  totalReactions: number;
  totalBanners: number;
  activeBanners: number;
  blockedUsers: number;
}

export interface AdminOverviewUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
  createdAt: string;
}

export interface AdminOverviewArticle {
  _id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  likesCount: number;
  createdAt: string;
}

export interface AdminOverviewResponse {
  success: boolean;
  counts: AdminCounts;
  recentUsers: AdminOverviewUser[];
  recentArticles: AdminOverviewArticle[];
}

// ---------- Top users ----------

export interface AdminTopUser {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'user' | 'admin';
    // preferences: string[];
    profileImage: string;
  };
  articleCount: number;
  isBlocked: boolean;
  createdAt: string;
}

export interface AdminTopUsersResponse {
  success: boolean;
  topUsers: AdminTopUser[];
}

// ---------- Top categories ----------

export interface AdminTopCategory {
  category: {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
  };
  articleCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface AdminTopCategoriesResponse {
  success: boolean;
  topCategories: AdminTopCategory[];
}

// ---------- Top articles ----------

export interface AdminTopArticle {
  id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  category: string;
  author: string; // user id
  likesCount: number;
  dislikesCount: number;
  blocksCount: number;
  createdAt: string;
}

export interface AdminTopArticlesResponse {
  success: boolean;
  topArticles: AdminTopArticle[];
}

// ---------- Recent users (dedicated endpoint) ----------

export interface AdminRecentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  profileImage: string;
  isBlocked: boolean;
  createdAt: string;
}

export interface AdminRecentUsersResponse {
  success: boolean;
  recentUsers: AdminRecentUser[];
}

// ---------- Recent articles (dedicated endpoint) ----------

export interface AdminRecentArticle {
  id: string;
  title: string;
  description: string;
//   images: string[];
  tags: string[];
  category: string;
  categoryName: string;
  author: string;
  likesCount: number;
  createdAt: string;
}

export interface AdminRecentArticlesResponse {
  success: boolean;
  recentArticles: AdminRecentArticle[];
}

// ---------- User growth ----------

export interface AdminUserGrowthPoint {
  label: string; // e.g. "2025-11"
  count: number;
  year: number;
  month: number;
}

export interface AdminUserGrowthResponse {
  success: boolean;
  monthsBack: number;
  userGrowth: AdminUserGrowthPoint[];
}
