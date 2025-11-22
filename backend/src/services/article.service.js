import mongoose from "mongoose";
import * as articleRepo from "../repositories/article.repo.js";
import * as userRepo from "../repositories/user.repo.js";
import { getPagination } from "../utils/pagination.js";
// import Article from "../models/Article.js";

const normalizeId = (value) => {
  if (!value) return null;

  // Direct string
  if (typeof value === "string") return value;

  // Mongoose doc or ObjectId with _id
  if (value._id) return value._id.toString();

  // Raw ObjectId
  return value.toString();
};

export const createArticle = async (authorId, payload, imageUrls = []) => {
  const { title, description, tags, category } = payload;

  const article = await articleRepo.createArticle({
    title,
    description,
    images: imageUrls,
    tags: tags || [],
    category: new mongoose.Types.ObjectId(category),
    author: authorId,
    likesCount: 0,
    dislikesCount: 0,
    blocksCount: 0,
    isPublished: true,
  });

  return article;
};

export const getArticleById = async (id) => {
  const article = await articleRepo.findById(id);
  if (!article) throw { status: 404, message: "Article not found" };
  return article;
};

// Only author can update; admin could be added later if required
export const updateArticle = async (currentUser, articleId, payload, imageUrls, tags) => {
  const article = await articleRepo.findById(articleId);
  if (!article) throw { status: 404, message: "Article not found" };

  const authorId = normalizeId(article.author);
  const currentUserId = normalizeId(currentUser._id);

  if (
    authorId !== currentUserId &&
    currentUser.role !== "admin"
  ) {
    throw { status: 403, message: "You are not allowed to edit this article" };
  }

  const updateData = { ...payload };

  if (imageUrls && imageUrls.length > 0) {
    updateData.images = imageUrls;
  }

  if(Array.isArray(tags)) {
    updateData.tags = tags;
  }

  const updated = await articleRepo.updateById(articleId, updateData);
  return updated;
};

export const deleteArticle = async (currentUser, articleId) => {
  const article = await articleRepo.findById(articleId);
  if (!article) throw { status: 404, message: "Article not found" };

  const authorId = normalizeId(article.author);
  const currentUserId = normalizeId(currentUser._id);

  if ( authorId !== currentUserId &&
    currentUser.role !== "admin"
  ) {
    throw { status: 403, message: "You are not allowed to delete this article" };
  }

  await articleRepo.deleteById(articleId);
};

export const listMyArticles = async (authorId, query) => {
  const { page, limit, skip } = getPagination(query);
  const { search } = query;

  const filter = { author: authorId };

  if (search && search.trim().length > 0) {
    filter.$text = { $search: search.trim() };
  }

  const [articles, total] = await Promise.all([
    articleRepo.findMany(filter, { skip, limit }),
    articleRepo.count(filter),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return { articles, total, page, limit, totalPages };
};

export const listFeedArticles = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const { search, category } = query;

  const user = await userRepo.findById(userId);
  if (!user) throw { status: 404, message: "User not found" };

  const filter = { isPublished: true };

  // exclude blocked articles
  if (user.blockedArticles && user.blockedArticles.length > 0) {
    filter._id = { $nin: user.blockedArticles };
  }

  // category filter from query
  if (category) {
    filter.category = new mongoose.Types.ObjectId(category);
  } else if (user.preferences && user.preferences.length > 0) {
    // if no category query, prioritize preferred categories
    filter.category = { $in: user.preferences };
  }

  if (search && search.trim().length > 0) {
    filter.$text = { $search: search.trim() };
  }

  const [articles, total] = await Promise.all([
    articleRepo.findMany(filter, { skip, limit }),
    articleRepo.count(filter),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return { articles, total, page, limit, totalPages };
};

export const togglePublish = async (currentUser, articleId) => {
  const article = await articleRepo.findById(articleId);
  if (!article) throw { status: 404, message: "Article not found" };

  const authorId = normalizeId(article.author);
  const currentUserId = normalizeId(currentUser._id);
  if ( authorId !== currentUserId &&
    currentUser.role !== "admin"
  ) {
    throw { status: 403, message: "You are not allowed to toggle this article" };
  }
  article.isPublished = !article.isPublished;
  await article.save();

  return article;
};
