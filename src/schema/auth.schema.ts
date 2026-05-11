// auth.schema.ts
import authService from "@/services/auth.service";
import { z } from "zod";

// ── Identifier: accepts either an email or a username ────────────────────────
const refinedIdentifier = z.string().superRefine((val, ctx) => {
  if (val.includes("@")) {
    const result = z.email().safeParse(val);
    if (!result.success) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid email format",
      });
    }
  } else {
    if (val.length < 3) {
      ctx.addIssue({
        code: "custom",
        message: "Username must be at least 3 characters",
      });
    }
  }
});

// ── Login ────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  identifier: refinedIdentifier,
  password: z.string().min(10, "Password must be at least 10 characters"),
});

// ── Register ─────────────────────────────────────────────────────────────────
// NOTE: Async email-uniqueness check intentionally removed from this schema.
//
// Keeping it here caused the API to be called on every onChange keystroke via
// zodResolver. Instead, use useAsyncFieldRule("email") on the email TextField
// for real-time UX feedback — the hook debounces and cancels stale requests.
// The schema is now purely synchronous: structural + cross-field checks only.
export const registerSchema = z
  .object({
    // Full name — rendered as "Full Name" field in the form
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    username: z
      .string()
      .trim()
      .min(1, "Username is required!") // Catches empty strings first
      .min(5, "Username must be at least 5 characters")
      .max(100),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .trim()
      .min(1, "Password is required!") // Catches empty strings first
      .min(10, "Password must be at least 10 characters"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    // 🔥 async email check
    // const exists = await authService.checkEmail(data.email);

    // if (exists) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     path: ["email"],
    //     message: "Email already in use",
    //   });
    // }

    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
