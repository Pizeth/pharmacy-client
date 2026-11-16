// src/components/auth/LogoutButton.tsx
"use client";

import { useLogout } from "@refinedev/core";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export const LogoutButton = () => {
  const { mutate: logout, isPending } = useLogout();

  return (
    <Button
      variant="outlined"
      color="error"
      size="small"
      startIcon={<LogoutIcon />}
      loading={isPending}
      onClick={() => logout()}
    >
      Sign out
    </Button>
  );
};

export default LogoutButton;
