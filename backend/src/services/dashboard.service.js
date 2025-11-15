import * as dashboardRepo from "../repositories/dashboard.repo.js";
import { articleDTO } from "../dtos/article.dto.js";
import { categoryDTO } from "../dtos/category.dto.js";
import { publicUserDTO } from "../dtos/user.dto.js";

// ---- OVERVIEW ----
export const getOverview = async () => {
  const counts = await dashboardRepo.getCoreCounts();

  const [recentUsers, recentArticles] = await Promise.all([
    dashboardRepo.getRecentUsers(5),
    dashboardRepo.getRecentArticles(5),
  ]);

  return {
    counts,
    recentUsers,
    recentArticles,
  };
};

// ---- TOP USERS ----
export const getTopUsers = async (limit = 5) => {
  const rows = await dashboardRepo.getTopUsersByArticleCount(limit);

  return rows.map((row) => ({
    user: publicUserDTO(row),
    articleCount: row.articleCount,
    isBlocked: row.isBlocked,
    createdAt: row.createdAt,
  }));
};

// ---- TOP CATEGORIES ----
export const getTopCategories = async (limit = 5) => {
  const rows = await dashboardRepo.getTopCategoriesByUsage(limit);

  return rows.map((row) => ({
    category: categoryDTO(row),
    articleCount: row.articleCount,
    isActive: row.isActive,
    createdAt: row.createdAt,
  }));
};

// ---- TOP ARTICLES ----
export const getTopArticles = async (limit = 5) => {
  const articles = await dashboardRepo.getTopArticlesByLikes(limit);
  return articles.map(articleDTO);
};

// ---- RECENT USERS ----
export const getRecentUsers = async (limit = 5) => {
  const users = await dashboardRepo.getRecentUsers(limit);
  return users.map((u) => publicUserDTO(u));
};

// ---- RECENT ARTICLES ----
export const getRecentArticles = async (limit = 5) => {
  const articles = await dashboardRepo.getRecentArticles(limit);
  return articles.map(articleDTO);
};

// ---- USER GROWTH ----
export const getUserGrowth = async (monthsBack = 6) => {
  const rows = await dashboardRepo.getUserGrowthByMonth(monthsBack);

  return rows.map((r) => ({
    label: `${r.year}-${String(r.month).padStart(2, "0")}`,
    count: r.count,
    year: r.year,
    month: r.month,
  }));
};
