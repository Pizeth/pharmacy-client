"use client";

import { AuthPage, useLogin } from "@refinedev/core";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@/components/auth/auth";
import PulseLoader from "@/components/effect/loaders/loader";

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const res = await fetch("/api/auth/me");

      if (res.ok) {
        router.push("/");
      }
    };

    check();
  }, [router]);
}

type LoginForm = {
  email: string;
  password: string;
};

export function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();
  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<LoginForm>({
  //   defaultValues: {
  //     email: "",
  //     password: "",
  //   },
  // });

  // const onSubmit = (values: LoginForm) => {
  //   login(values);
  // };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    // <AuthPage type="login" formProps={{ onSubmit: handleSubmit }}>
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
          <Typography
            component="h1"
            variant="h5"
            sx={{
              mb: 3,
              textAlign: "center",
              fontFamily: "var(--font-moul)", // Using your Khmer font
            }}
          >
            ចូលប្រើប្រព័ន្ធ
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              អ៊ីមែល ឬលេខសម្ងាត់មិនត្រឹមត្រូវ
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="អ៊ីមែល"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="លេខសម្ងាត់"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isPending}
              sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: "bold" }}
            >
              {isPending ? "កំពុងបញ្ជូន..." : "ចូល"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

// login.tsx
// import { AuthPage } from "@refinedev/mui";
// import AvatarHeader from "@/components/auth/AvatarHeader";
// import SideImage from "@/components/auth/SideImage";
// import Footer from "@/components/auth/Footer";
// import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPageNew() {
  <Suspense fallback={<PulseLoader />}>
    return <AuthPage type="login" renderContent={() => <Auth />} />;
  </Suspense>;
}
