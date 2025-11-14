import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().max(500).optional(),
  iconUrl: z.string().url("Invalid icon URL").optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  description: z.string().max(500).optional(),
  iconUrl: z.string().url("Invalid icon URL").optional(),
});

