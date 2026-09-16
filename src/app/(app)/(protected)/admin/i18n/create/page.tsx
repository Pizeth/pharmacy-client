"use client";

import { useRouter } from "next/navigation";
import { Paper, Typography } from "@mui/material";
import { TranslationKeyCreateForm } from "@/features/i18n/translation-keys/forms/TranslationKeyCreateForm";

export default function CreateTranslationPage() {
  const router = useRouter();
  return (
    <Paper sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Create translation key
      </Typography>
      <TranslationKeyCreateForm
        onCancel={() => router.push("/admin/i18n")}
        onCreated={() => {
          router.replace("/admin/i18n");
          router.refresh();
        }}
      />
    </Paper>
  );
}
