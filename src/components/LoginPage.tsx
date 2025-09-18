import * as React from "react";

// SVG Icon Components for a clean, self-contained design
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 9.182C34.553 5.166 29.695 3 24 3C12.954 3 4 11.954 4 23s8.954 20 20 20s20-8.954 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 13 24 13c3.059 0 5.842 1.154 7.961 3.039L38.802 9.182C34.553 5.166 29.695 3 24 3C16.318 3 9.656 6.753 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 43c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.519-3.355-11.024-7.94l-6.522 5.025C9.505 39.556 16.227 43 24 43z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.058 36.372 44 31.881 44 26c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const DiscordIcon = () => (
  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.317 4.3698C18.673 3.3218 16.896 2.5008 15 2.0638C14.996 2.0618 14.992 2.0588 14.987 2.0568C14.831 2.0198 14.668 1.9898 14.5 1.9688C14.219 1.9328 13.931 1.9118 13.636 1.9018C13.568 1.8988 13.498 1.8968 13.428 1.8948C13.068 1.8848 12.704 1.8788 12.336 1.8788C12.232 1.8788 12.128 1.8798 12.025 1.8818C11.642 1.8838 11.258 1.8898 10.872 1.9018C10.574 1.9118 10.284 1.9328 10 1.9688C9.83203 1.9898 9.66903 2.0198 9.51303 2.0568C9.50803 2.0588 9.50403 2.0618 9.50003 2.0638C7.10403 2.5008 5.32703 3.3218 3.68303 4.3698C2.23803 5.2548 1.08503 6.4588 0.316031 7.8978C0.211031 8.1208 0.125031 8.3538 0.0610312 8.5918C0.0270312 8.7238 -0.00096875 8.8588 -0.00096875 8.9958C0.00203125 9.1238 0.0100312 9.2518 0.0230312 9.3788C0.183031 10.9758 0.702031 12.4938 1.52303 13.8448C2.51603 15.4858 3.84903 16.8978 5.44103 18.0288C5.46703 18.0468 5.49403 18.0648 5.52103 18.0828C6.01403 18.4418 6.53903 18.7618 7.08803 19.0378C7.15203 19.0688 7.21703 19.0998 7.28403 19.1288C7.48803 19.2218 7.69703 19.3088 7.91203 19.3878C8.36103 19.5518 8.82503 19.6898 9.30303 19.8018C9.44503 19.8348 9.58703 19.8648 9.73003 19.8928C10.233 19.9828 10.744 20.0468 11.259 20.0868C11.373 20.0938 11.488 20.0988 11.604 20.1028C11.751 20.1068 11.897 20.1088 12.043 20.1088C12.285 20.1088 12.528 20.1038 12.77 20.0938C13.251 20.0758 13.728 20.0398 14.197 19.9828C14.659 19.9278 15.113 19.8458 15.556 19.7378C16.035 19.6208 16.5 19.4798 16.948 19.3128C17.168 19.2298 17.382 19.1408 17.589 19.0468C18.125 18.7758 18.636 18.4618 19.117 18.1078C19.141 18.0918 19.165 18.0758 19.189 18.0598C20.769 16.9268 22.094 15.5188 23.083 13.8818C23.896 12.5368 24.411 11.0288 24.569 9.4448C24.582 9.3168 24.59 9.1898 24.592 9.0618C24.593 8.9278 24.565 8.7948 24.532 8.6638C24.468 8.4238 24.382 8.1888 24.276 7.9618C23.514 6.5278 22.37 5.3308 20.932 4.4508C20.738 4.3908 20.535 4.3318 20.325 4.2748C20.321 4.2728 20.317 4.2708 20.313 4.2688L20.317 4.3698Z" />
  </svg>
);

// Define a type for the component's props to satisfy TypeScript
interface ProviderButtonProps {
  provider: string;
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  textColor?: string;
}

const ProviderButton: React.FC<ProviderButtonProps> = ({
  provider,
  icon,
  label,
  bgColor,
  textColor = "white",
}) => (
  <a
    href={`/api/auth/${provider}`} // IMPORTANT: Adjust if your API prefix is different
    className={`w-full flex items-center justify-center py-3 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 ${bgColor}`}
    style={{ textDecoration: "none" }}
  >
    {icon}
    <span className={`font-semibold text-sm ${textColor}`}>{label}</span>
  </a>
);

export const LoginPage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-2xl shadow-xl">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
        <p className="mt-2 text-sm text-gray-500">
          Sign in to continue to your dashboard
        </p>
      </div>

      <div className="space-y-4">
        <ProviderButton
          provider="google"
          label="Continue with Google"
          icon={<GoogleIcon />}
          bgColor="bg-white"
          textColor="text-gray-700"
        />
        <ProviderButton
          provider="facebook"
          label="Continue with Facebook"
          icon={<FacebookIcon />}
          bgColor="bg-blue-600"
        />
        <ProviderButton
          provider="discord"
          label="Continue with Discord"
          icon={<DiscordIcon />}
          bgColor="bg-indigo-600"
        />
      </div>

      <div className="text-center text-xs text-gray-400">
        By continuing, you agree to our Terms of Service.
      </div>
    </div>
  </div>
);

/**
 * How to use this component with react-admin:
 *
 * 1. Save this file as `LoginPage.tsx` in your components directory.
 *
 * 2. In your `App.tsx` or wherever you render the <Admin> component,
 * import this LoginPage component.
 *
 * 3. Pass it to the `loginPage` prop of the <Admin> component.
 *
 * Example:
 *
 * import { Admin, Resource, Layout } from 'react-admin';
 * import dataProvider from './dataProvider'; // your dataProvider
 * import { LoginPage } from './LoginPage';
 *
 * const App = () => (
 * <Admin
 * dataProvider={dataProvider}
 * loginPage={LoginPage} // <-- Use the custom login page here
 * >
 * <Resource name="posts" list={...} />
 * </Admin>
 * );
 *
 * export default App;
 *
 *
 * How the Auth Flow Continues:
 *
 * - When a user clicks a button, they are sent to your NestJS backend.
 * - Your backend's Passport strategy redirects them to the provider (e.g., Google).
 * - After they log in, the provider redirects them back to your backend's callback URL.
 * - Your backend finalizes authentication, sets a session cookie or a JWT.
 * - Your backend then redirects the user back to your Next.js/react-admin app (e.g., '/').
 * - Now, your `react-admin` authProvider's `checkAuth` method will be called on page load.
 * It should check for the session cookie/JWT to verify the user is logged in.
 */

// ---------------------------
// LoginPage React component (default export)
// - shows email/password form for react-admin credential login
// - shows OAuth buttons (Google, Facebook, Discord) which redirect to /api/auth/signin/<provider>
// - Tailwind classes for quick styling — include Tailwind in your project
// ---------------------------

export default function LoginPage1() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const submitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    // If you use react-admin's useLogin, you'd call login({ username, password })
    // Here we call authProvider directly for demonstration (you'll usually pass authProvider to <Admin />)
    try {
      //   await authProvider.login({ username, password });
      // on success the authProvider should redirect or resolve
    } catch (err) {
      // handle error (show notification etc.)
      console.error("Login failed", err);
      alert("Login failed");
    }
  };

  const oauthSignIn = (provider: string) => {
    const callback = window.location.href;
    window.location.href = `/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent(
      callback
    )}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Sign in to your admin
        </h1>

        <div className="space-y-4">
          <button
            onClick={() => oauthSignIn("google")}
            className="w-full py-2 rounded-lg border flex items-center justify-center gap-3 hover:shadow"
            aria-label="Sign in with Google"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 533.5 544.3"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M533.5 278.4c0-18.5-1.6-37.1-4.9-55.1H272v104.4h146.9c-6.3 34.1-25 62.9-53.5 82.1v68.1h86.5c50.6-46.6 80.6-115.5 80.6-199.5z"
                fill="#4285F4"
              />
              <path
                d="M272 544.3c72.9 0 134.1-24.2 178.8-65.6l-86.5-68.1c-24.1 16.2-55 25.9-92.3 25.9-70.9 0-131-47.9-152.3-112.2H28.6v70.4C73.4 485.8 166 544.3 272 544.3z"
                fill="#34A853"
              />
              <path
                d="M119.7 322.8c-10.9-32.4-10.9-67.3 0-99.7V152.7H28.6C-9 213.5-9 330.8 28.6 391.6l91.1-68.8z"
                fill="#FBBC05"
              />
              <path
                d="M272 109.3c39.6 0 75 13.6 102.9 40.5l77.2-77.2C407.8 24.6 346.6 0 272 0 166 0 73.4 58.5 28.6 152.7l91.1 70.4C141 158.9 201.1 109.3 272 109.3z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() => oauthSignIn("facebook")}
            className="w-full py-2 rounded-lg border flex items-center justify-center gap-3 hover:shadow"
            aria-label="Sign in with Facebook"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 12C22 6.48 17.52 2 12 2S2 6.48 2 12c0 4.84 3.44 8.84 7.94 9.8v-6.93H7.9v-2.87h2.04V9.4c0-2.01 1.2-3.12 3.03-3.12.88 0 1.8.16 1.8.16v1.98h-1.01c-.99 0-1.3.62-1.3 1.26v1.5h2.22l-.35 2.87h-1.87v6.93C18.56 20.84 22 16.84 22 12z"
                fill="#1877F2"
              />
            </svg>
            <span>Continue with Facebook</span>
          </button>

          <button
            onClick={() => oauthSignIn("discord")}
            className="w-full py-2 rounded-lg border flex items-center justify-center gap-3 hover:shadow"
            aria-label="Sign in with Discord"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 71 55"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M60.4 4.2C54.9 1.7 49.1.6 43.3.8c-1.1 2-2.4 4.2-3.3 6.1-9.8-1.5-19.6-1.5-29.4 0-1-2-2.2-4.1-3.3-6.1-5.7-.2-11.5.9-17 3.4C-1 17.5-.1 34.9 4 49.3c12.7 9 27 6.5 38.9 2.9 1-1.4 1.9-2.9 2.9-4.4-6.9 2-13.8 3.4-20.6.4 3.6-2.4 7.1-4.9 10.4-7.9 11.3 4.5 22.9 4.5 34.2 0 3.3 3 6.8 5.5 10.4 7.9-6.9 2.9-13.8 1.6-20.6-.4 1 1.5 1.9 3 2.9 4.4 11.9 3.7 26.2 6 38.9-2.9 4.1-14.4 5-31.8-8.7-45.1z"
                fill="#5865F2"
              />
            </svg>
            <span>Continue with Discord</span>
          </button>

          <div className="my-4 border-t" />

          <form onSubmit={submitCredentials} className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-700">Email</span>
              <input
                className="mt-1 block w-full rounded-md border px-3 py-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="you@example.com"
                type="email"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Password</span>
              <input
                className="mt-1 block w-full rounded-md border px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-blue-600 text-white"
            >
              Sign in with email
            </button>
          </form>
        </div>

        <p className="text-xs text-center text-gray-500 mt-4">
          By continuing you agree to the terms and that you have read our
          privacy policy.
        </p>
      </div>
    </div>
  );
}
