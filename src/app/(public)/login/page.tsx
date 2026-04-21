"use client";

import { useLogin } from "@refinedev/core";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import { useState } from "react";

export default function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
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
