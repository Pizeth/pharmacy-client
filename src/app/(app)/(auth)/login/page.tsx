"use client";
import { AuthPage } from '@refinedev/core';
import { Auth } from '@/components/auth/auth';
export default function LoginPage() {
  return <AuthPage type="login" renderContent={() => <Auth />} />;
}
