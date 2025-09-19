// app/auth/login/page.tsx
"use client";
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

export function LoginPage1() {
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

// app/auth/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Separator } from '@/components/ui/separator';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, Mail, Lock, CheckIcon } from 'lucide-react';
import { Card, CardHeader, CardContent, Alert, Input } from "@mui/material";
import { Button } from "react-admin";

// Provider configuration with icons and colors
const PROVIDERS = {
  google: {
    name: 'Google',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
    bgColor: 'bg-white hover:bg-gray-50',
    textColor: 'text-gray-900',
    borderColor: 'border-gray-300',
  },
  facebook: {
    name: 'Facebook',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    bgColor: 'bg-[#1877F2] hover:bg-[#166FE5]',
    textColor: 'text-white',
    borderColor: 'border-[#1877F2]',
  },
  discord: {
    name: 'Discord',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
    bgColor: 'bg-[#5865F2] hover:bg-[#4752C4]',
    textColor: 'text-white',
    borderColor: 'border-[#5865F2]',
  },
};

interface LoginPageProps {
  onSuccess?: (user: any) => void;
  redirectTo?: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPageClaude({ onSuccess, redirectTo }: LoginPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'form' | 'oauth'>('form');
  
  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<LoginFormData>>({});

  // Handle OAuth callback results
  useEffect(() => {
    const error = searchParams?.get('error');
    const authSuccess = searchParams?.get('auth');
    const logout = searchParams?.get('logout');

    if (error) {
      setError(decodeURIComponent(error));
    } else if (authSuccess === 'success') {
      setSuccess('Authentication successful! Redirecting...');
      setTimeout(() => {
        if (onSuccess) {
          onSuccess({ authenticated: true });
        } else {
          router.push(redirectTo || '/admin');
        }
      }, 1500);
    } else if (logout === 'success') {
      setSuccess('Logged out successfully');
      setTimeout(() => setSuccess(null), 3000);
    }
  }, [searchParams, onSuccess, redirectTo, router]);

  const validateForm = (): boolean => {
    const errors: Partial<LoginFormData> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading('form');
      setError(null);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
      
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for session cookies
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Login successful! Redirecting...');
        
        // Store user info if provided
        if (data.user) {
          localStorage.setItem('oidc_user', JSON.stringify(data.user));
          if (data.tokens) {
            localStorage.setItem('oidc_tokens', JSON.stringify(data.tokens));
          }
        }

        setTimeout(() => {
          if (onSuccess) {
            onSuccess(data.user);
          } else {
            router.push(redirectTo || '/admin');
          }
        }, 1500);
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleProviderLogin = async (provider: string) => {
    try {
      setLoading(provider);
      setError(null);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
      const loginUrl = `${backendUrl}/auth/${provider}/login`;
      
      window.location.href = loginUrl;
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to initiate login. Please try again.');
      setLoading(null);
    }
  };

  const isLoading = (type: string) => loading === type;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center pb-6" title="Welcome back" subheader="Sign in to your account to continue">
            {/* <CardTitle className="text-2xl font-bold tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to your account to continue
            </CardDescription> */}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Success Message */}
            {success && (
              <Alert className="border-green-200 bg-green-50" icon={<CheckIcon fontSize="inherit" />} severity="success" variant="outlined">
                <CheckCircle2 className="h-4 w-4 text-green-600" />{success}
                {/* <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription> */}
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert variant="outlined" icon={<AlertCircle className="h-4 w-4" fontSize="inherit" />} severity="error">
               {error}
                {/* <AlertDescription>
                  {error}
                </AlertDescription> */}
              </Alert>
            )}

            {/* Login Type Selector */}
            <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50">
              <button
                type="button"
                onClick={() => setLoginType('form')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                  loginType === 'form'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Email & Password
              </button>
              <button
                type="button"
                onClick={() => setLoginType('oauth')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                  loginType === 'oauth'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Social Login
              </button>
            </div>

            {/* Form Login */}
            {loginType === 'form' && (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={loading !== null}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                      onClick={() => {
                        // Handle forgot password
                        router.push('/auth/forgot-password');
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      disabled={loading !== null}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={loading !== null}
                >
                  {isLoading('form') ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </form>
            )}

            {/* OAuth Login */}
            {loginType === 'oauth' && (
              <div className="space-y-3">
                {Object.entries(PROVIDERS).map(([key, provider]) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="lg"
                    className={`w-full h-12 ${provider.bgColor} ${provider.textColor} ${provider.borderColor} transition-all duration-200 font-medium`}
                    onClick={() => handleProviderLogin(key)}
                    disabled={loading !== null}
                  >
                    {isLoading(key) ? (
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    ) : (
                      <span className="mr-3">{provider.icon}</span>
                    )}
                    {isLoading(key) 
                      ? `Connecting to ${provider.name}...`
                      : `Continue with ${provider.name}`
                    }
                  </Button>
                ))}
              </div>
            )}

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  New to our platform?
                </span>
              </div>
            </div>

            {/* Sign up link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/auth/register')}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Create an account
              </button>
            </div>

            {/* Additional Info */}
            <div className="text-center text-xs text-gray-600 mt-6">
              <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Need help? Contact our support team</p>
        </div>
      </div>
    </div>
  );
}
              </Alert>
            )}

            {/* Provider Buttons */}
            <div className="space-y-3">
              {Object.entries(PROVIDERS).map(([key, provider]) => (
                <Button
                  key={key}
                  variant="outline"
                  size="lg"
                  className={`w-full h-12 ${provider.bgColor} ${provider.textColor} ${provider.borderColor} transition-all duration-200 font-medium`}
                  onClick={() => handleProviderLogin(key)}
                  disabled={loading !== null}
                >
                  {isLoading(key) ? (
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  ) : (
                    <span className="mr-3">{provider.icon}</span>
                  )}
                  {isLoading(key) 
                    ? `Connecting to ${provider.name}...`
                    : `Continue with ${provider.name}`
                  }
                </Button>
              ))}
            </div>

            {/* Additional Info */}
            <div className="text-center text-sm text-gray-600 mt-8">
              <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Need help? Contact our support team</p>
        </div>
      </div>
    </div>
  );
}