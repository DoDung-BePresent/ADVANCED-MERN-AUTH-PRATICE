import { z } from "zod";

export const emailSchema = z.string().trim().email().min(1, {
  message: "Email is required",
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().trim().min(1, {
    message: "Password is required",
  }),
});

export const signUpSchema = z
  .object({
    name: z.string().trim().min(1, {
      message: "Name is required",
    }),
    email: emailSchema,
    password: z.string().trim().min(1, {
      message: "Password is required",
    }),
    confirmPassword: z.string().trim().min(1, {
      message: "Confirm Password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: z.string().trim().min(1, {
      message: "Password is required",
    }),
    confirmPassword: z.string().trim().min(1, {
      message: "Confirm Password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });
