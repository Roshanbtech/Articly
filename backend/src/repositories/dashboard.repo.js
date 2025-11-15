import User from "../models/User.js";
import Article from "../models/Article.js";
import Category from "../models/Category.js";
import Reaction from "../models/Reaction.js";
import Banner from "../models/Banner.js";

// ---- CORE COUNTS ----
export const getCoreCounts = async () => {
  const [totalUsers, totalArticles, totalCategories, totalReactions, totalBanners] =
    await Promise.all([
      User.countDocuments(),
      Article.countDocuments(),
      Category.countDocuments(),
      Reaction.countDocuments(),
      Banner.countDocuments(),
    ]);

  const [activeBanners, blockedUsers] = await Promise.all([
    Banner.countDocuments({ isActive: true }),
    User.countDocuments({ isBlocked: true }),
  ]);

  return {
    totalUsers,
    totalArticles,
    totalCategories,
    totalReactions,
    totalBanners,
    activeBanners,
    blockedUsers,
  };
};

// ---- TOP USERS BY ARTICLE COUNT ----
export const getTopUsersByArticleCount = async (limit = 5) => {
  const result = await Article.aggregate([
    {
      $group: {
        _id: "$author",
        articleCount: { $sum: 1 },
      },
    },
    { $sort: { articleCount: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: "$user._id",
        firstName: "$user.firstName",
        lastName: "$user.lastName",
        email: "$user.email",
        role: "$user.role",
        isBlocked: "$user.isBlocked",
        articleCount: 1,
        createdAt: "$user.createdAt",
      },
    },
  ]);

  return result;
};

// ---- TOP CATEGORIES BY ARTICLE USAGE ----
export const getTopCategoriesByUsage = async (limit = 5) => {
  const result = await Article.aggregate([
    {
      $group: {
        _id: "$category",
        articleCount: { $sum: 1 },
      },
    },
    { $sort: { articleCount: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $project: {
        _id: "$category._id",
        name: "$category.name",
        description: "$category.description",
        iconUrl: "$category.iconUrl",
        isActive: "$category.isActive",
        articleCount: 1,
        createdAt: "$category.createdAt",
      },
    },
  ]);

  return result;
};

// ---- TOP ARTICLES BY LIKES ----
export const getTopArticlesByLikes = async (limit = 5) => {
  const result = await Article.find({ isPublished: true })
    .sort({ likesCount: -1, createdAt: -1 })
    .limit(limit)
    .select("title description likesCount dislikesCount blocksCount category author images createdAt");

  return result;
};

// ---- RECENT USERS ----
export const getRecentUsers = async (limit = 5) => {
  return User.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("firstName lastName email role isBlocked createdAt");
};

// ---- RECENT ARTICLES ----
export const getRecentArticles = async (limit = 5) => {
  return Article.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("title description category author likesCount createdAt");
};

// ---- USER GROWTH (LAST 6 MONTHS) ----
export const getUserGrowthByMonth = async (monthsBack = 6) => {
  const now = new Date();
  const start = new Date(now);
  start.setMonth(start.getMonth() - monthsBack + 1);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const pipeline = [
    {
      $match: {
        createdAt: { $gte: start, $lte: now },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        count: 1,
      },
    },
  ];

  const result = await User.aggregate(pipeline);
  return result;
};
