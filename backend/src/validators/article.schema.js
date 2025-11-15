import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  tags: z.union([
  z.array(z.string()),
  z.string().transform((val) => val.split(",").map(t => t.trim()).filter(Boolean))
]).optional(),
  category: z.string().min(1, "Category is required"), // categoryId
});

export const updateArticleSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  tags: z.union([
  z.array(z.string()),
  z.string().transform((val) => val.split(",").map(t => t.trim()).filter(Boolean))
]).optional(),
  category: z.string().optional(), // re-categorisation
  isPublished: z.boolean().optional(),
});

export const listArticleSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
});

export const listMyArticlesSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
});
