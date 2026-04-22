// auth.service.ts
import { authClient } from "@/lib/auth-client";

export const authService = {
  async login(email: string, password: string) {
    const { data, error } = await authClient.signIn.email({ email, password });

    if (error) throw error;
    return data;
  },

  async register(payload: { email: string; password: string; name: string }) {
    const { data, error } = await authClient.signUp.email(payload);

    if (error) throw error;
    return data;
  },

  async checkEmail(email: string) {
    // 🔥 optional API endpoint (you implement backend)
    const res = await fetch(`/api/auth/check-email?email=${email}`);
    return res.json();
  },
};

export default authService;
