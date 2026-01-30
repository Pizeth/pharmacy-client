import IconButton from "@mui/material/IconButton";
import { useThemeControl } from "./theme-wrapper";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { toggleTheme, mode } = useThemeControl();
  return (
    <IconButton
      color="inherit"
      size="large"
      // edge="end"
      aria-label="Theme toggle"
      aria-haspopup="true"
      onClick={toggleTheme}
      // sx={{
      //   position: "fixed",
      //   top: "2.5vmin",
      //   right: "2.5vmin",
      //   border: "1px solid",
      //   borderColor: "divider",
      //   mt: 0.5,
      //   // borderRadius: 2,
      //   opacity: 0.5,
      //   "&:hover": { opacity: 1 },
      // }}
    >
      {mode === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </IconButton>
  );
};

export default ThemeToggle;
