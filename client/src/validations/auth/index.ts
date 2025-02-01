import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().trim().email().min(1, {
    message: "Email is required",
  }),
  password: z.string().trim().min(1, {
    message: "Password is required",
  }),
});

export const SignUpSchema = z
  .object({
    name: z.string().trim().min(1, {
      message: "Name is required",
    }),
    email: z.string().trim().email().min(1, {
      message: "Email is required",
    }),
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
