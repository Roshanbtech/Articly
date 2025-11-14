import { z } from "zod";

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const updateUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  preferences: z.array(z.string()).optional(),
  profileImage: z.string().url("Invalid profile image URL").optional(), 
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z
    .string()
    .regex(
      passwordRegex,
      "Password must be 8+ chars, include uppercase, lowercase, number, and special char"
    ),
});

export const updatePreferencesSchema = z.object({
  preferences: z.array(z.string()).default([]),
});


