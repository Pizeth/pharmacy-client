// auth.schema.ts
import authService from "@/services/auth.service";
import { username } from "better-auth/plugins/username";
import { z } from "zod";

const refinedIdentifier = z.string().superRefine((val, ctx) => {
  if (val.includes("@")) {
    const emailResult = z.email().safeParse(val);
    if (!emailResult.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid email format",
      });
    }
  } else {
    if (val.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Username must be at least 3 characters",
      });
    }
  }
});

export const loginSchema = z.object({
  identifier: refinedIdentifier,
  password: z.string().min(10),
});

export const registerSchema = z
  .object({
    username: z.string().min(5).max(100),
    email: z.email(),
    password: z.string().min(10),
    confirmPassword: z.string(),
  })
  .superRefine(async (data, ctx) => {
    // 🔥 async email check
    const exists = await authService.checkEmail(data.email);

    if (exists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Email already in use",
      });
    }

    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
