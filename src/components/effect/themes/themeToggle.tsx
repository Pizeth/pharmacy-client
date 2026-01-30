import IconButton from "@mui/material/IconButton";
import { useThemeControl } from "./theme-wrapper";
import { Moon, Sun } from "lucide-react";

const themeToggle = () => {
  const { toggleTheme, mode } = useThemeControl();
  return (
    <IconButton
      onClick={toggleTheme}
      color="inherit"
      sx={{
        position: "fixed",
        top: "5vmin",
        right: "5vmin",
        border: "1px solid",
        borderColor: "divider",
        mt: 0.5,
        borderRadius: 2,
      }}
    >
      {mode === "dark" ? <Sun size={"10vmin"} /> : <Moon size={"10vmin"} />}
    </IconButton>
  );
};

export default themeToggle;
