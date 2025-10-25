// app/auth/callback/page.tsx (Server Component)
// import AuthCallbackPage from "./AuthCallbackPage";

import AuthCallbackPage from "./AuthCallbackPage";

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return <AuthCallbackPage searchParams={searchParams} />;
}
