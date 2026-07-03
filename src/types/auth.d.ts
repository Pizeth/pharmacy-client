import { authClient } from "@/lib/auth-client";
export type AuthAction = "signin" | "signup";
export type AsyncRuleType = "email" | "username" | "none";
export type AsyncValidator = (value: string) => Promise<string | boolean>;
// export type AsyncMap = Record<string?, AsyncValidator>;
export type AsyncMap = Record<string, AsyncValidator | undefined>;
// Define the shape of your async validation map
// type AsyncMap<T extends FieldValues> = {
//   [K in keyof T]?: (value: T[K]) => Promise<string | true>;
// };
export type FieldStatus =
  | "idle"
  | "typing"
  | "validating"
  | "valid"
  | "error"
  | "cancelled"
  | "required";

export type SignInResult =
  | Awaited<ReturnType<typeof authClient.signIn.username>>
  | Awaited<ReturnType<typeof authClient.signIn.email>>;

export type Status = "idle" | "loading" | "success" | "error";
