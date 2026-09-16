"use client";

import { useRouter } from "next/navigation";
import { AddRounded } from "@mui/icons-material";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { TranslationKeyCreateForm } from "@/features/i18n/translation-keys/forms";

export default function CreateTranslationPage() {
  const router = useRouter();

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          backgroundImage: "none",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: "warning.main",
                color: "warning.contrastText",
                flexShrink: 0,
              }}
            >
              <AddRounded />
            </Box>

            <Box>
              <Typography variant="h5" component="h1" fontWeight={700}>
                Create translation key
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Add key metadata to the translation registry.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ p: 3 }}>
          <TranslationKeyCreateForm
            onCancel={() => {
              router.push("/admin/i18n");
            }}
            onCreated={() => {
              router.replace("/admin/i18n");

              router.refresh();
            }}
          />
        </Box>
      </Paper>
    </Container>
  );
}
