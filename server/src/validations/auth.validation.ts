import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .min(1)
  .max(255);

export const registerSchema = z
  .object({
    name: z.string().trim().min(1).max(255),
    email: emailSchema,
    password: z.string().trim().min(6).max(255),
    confirmPassword: z.string().trim().min(6).max(255),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().trim().min(1).max(255),
});

export const resetPasswordSchema = z.object({
  password: z.string().trim().min(6).max(255),
  verificationCode: z.string().trim().min(1).max(25),
});
