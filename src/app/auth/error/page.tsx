import { redirect } from "next/navigation";
import { createOAuthErrorLoginRedirect } from "@/lib/auth/oauthError";

export default async function AuthErrorPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  // Provider descriptions and arbitrary error query values are deliberately not rendered.
  redirect(createOAuthErrorLoginRedirect(typeof params.callbackUrl === "string" ? params.callbackUrl : undefined));
}
