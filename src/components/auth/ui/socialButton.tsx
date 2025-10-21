import { Button, styled } from "@mui/material";

// Custom styled button for social login
const SocialButton = styled(Button)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1),
  width: "100%",
  padding: theme.spacing(1),
  textTransform: "none",
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.action.hover,
  },
  "& svg": {
    width: 16,
    height: 16,
  },
}));

export default SocialButton;
