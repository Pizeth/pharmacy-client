// src/app/(protected)/admin/translations/create/page.tsx
"use client";
// import { useForm } from "@refinedev/react-hook-form";
import { Box, TextField, Button, MenuItem } from "@mui/material";

export default function CreateTranslationPage() {
  //   const {
  //     refineCore: { onFinish },
  //     register,
  //     handleSubmit,
  //   } = useForm({
  //     refineCoreProps: { resource: "translations", action: "create" },
  //   });

  return (
    <Box
      component="form"
      //   onSubmit={handleSubmit(onFinish)}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 500 }}
    >
      {/* <TextField {...register("key", { required: true })} label="Key" />
      <TextField {...register("description")} label="Description" />
      <TextField {...register("category")} label="Category" /> */}
      <Button type="submit" variant="contained">
        Create Key
      </Button>
    </Box>
  );
}
