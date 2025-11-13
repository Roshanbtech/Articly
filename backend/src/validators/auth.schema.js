import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  dob: z.string().optional(), 
  password: z.string().regex(passwordRegex, 
    "Password must be 8+ chars, include uppercase, lowercase, number, and special char"),
  preferences: z.array(z.string()).optional(),
  profileImage: z.string().url().optional(), 
});

export const loginSchema = z.object({
  identifier: z.string().min(3, "Email or phone required"),
  password: z.string().regex(passwordRegex, "Invalid password format"),
});
