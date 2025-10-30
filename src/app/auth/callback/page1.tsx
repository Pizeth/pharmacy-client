// app/auth/callback/page.tsx (Server Component)
// import AuthCallbackPage from "./AuthCallbackPage";

// import AuthCallbackPage from "./AuthCallbackPage";

// export default function Page({
//   searchParams,
// }: {
//   searchParams: Record<string, string>;
// }) {
//   return <AuthCallbackPage searchParams={searchParams} />;
// }

// app/auth/callback/page.tsx
// import AuthCallbackPage from "./AuthCallbackPage";

// export default async function Page({
//   searchParams,
// }: {
//   // searchParams?: { [key: string]: string | string[] | undefined };
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// }) {
//   // Await the promise that Next.js passes in
//   const resolved = await searchParams;

//   return <AuthCallbackPage searchParams={resolved} />;
//   // return <AuthCallbackPage searchParams={searchParams ?? {}} />;
// }
