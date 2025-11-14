import { z } from "zod";

export const createBannerSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  link: z.string().url("Link must be a valid URL").optional(),
  // image is via file upload
});

export const updateBannerSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  link: z.string().url().optional(),
  isActive: z.boolean().optional(),
});
