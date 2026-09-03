"use client";

import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";

export default function ApiTester() {
  const [url, setUrl] = useState(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/i18n/keys/query`,
  );
  const [method, setMethod] = useState("POST");
  const [headers, setHeaders] = useState(
    '{\n  "Content-Type": "application/json"\n}',
  );
  const [body, setBody] = useState(
    '{\n  "page": 1,\n  "pageSize": 25,\n  "search": {\n    "term": "Login"\n  }\n}',
  );
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);

  const handleSend = async () => {
    setLoading(true);
    setResponse("");
    setStatus(null);

    try {
      const parsedHeaders = headers ? JSON.parse(headers) : {};
      const options: RequestInit = {
        method,
        headers: parsedHeaders,
        credentials: "include",
      };

      if (["POST", "PUT", "PATCH"].includes(method) && body) {
        options.body = JSON.stringify(JSON.parse(body));
      }

      const res = await fetch(url, options);
      setStatus(res.status);
      const data = await res.json();

      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid request or JSON";
      setResponse(JSON.stringify({ error: message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleCheckSession = async () => {
    setLoading(true);

    setStatus(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`,
        {
          method: "GET",

          credentials: "include",
        },
      );

      setStatus(res.status);

      const data: unknown = await res.json();

      setResponse(JSON.stringify(data, null, 2));
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to read the current session";

      setResponse(
        JSON.stringify(
          {
            error: message,
          },
          null,
          2,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        API Client
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        {/* Request Bar */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            sx={{ width: 120 }}
          >
            <MenuItem value="GET">GET</MenuItem>
            <MenuItem value="POST">POST</MenuItem>
            <MenuItem value="PUT">PUT</MenuItem>
            <MenuItem value="DELETE">DELETE</MenuItem>
          </Select>

          <TextField
            fullWidth
            label="URL Endpoint"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <Button
            variant="contained"
            size="large"
            onClick={handleSend}
            disabled={loading}
            sx={{ minWidth: 100 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Send"}
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={handleCheckSession}
            disabled={loading}
          >
            Session
          </Button>
        </Box>

        {/* Inputs Section */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Headers (JSON format)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              inputProps={{ style: { fontFamily: "monospace" } }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Request Body (JSON format)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              inputProps={{ style: { fontFamily: "monospace" } }}
            />
          </Grid>
        </Grid>
      </Paper>

      {status !== null && (
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1,
          }}
        >
          HTTP {status}
        </Typography>
      )}

      {/* Response Panel */}
      <Paper sx={{ p: 3, bgcolor: "#1e1e1e", color: "#fff" }}>
        <Typography variant="subtitle2" sx={{ color: "#aaa", mb: 1 }}>
          Response Output
        </Typography>
        <Box
          component="pre"
          sx={{
            margin: 0,
            overflowX: "auto",
            fontFamily: "monospace",
            fontSize: "0.875rem",
            maxHeight: "400px",
          }}
        >
          {response || "// Response will appear here after request..."}
        </Box>
      </Paper>
    </Container>
  );
}
