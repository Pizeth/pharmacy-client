import { useState } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  alpha,
  styled,
  IconButton,
  Box,
  Fade,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const PREFIX = "RazethSearch";
const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  // 1. Glassmorphism Container logic
  padding: theme.spacing(1),
  // margin: theme.spacing(0),
  display: "flex",
  justifyContent: "center",
  background: `${alpha(theme.palette.background.paper, 0.925)}`,
  // borderRadius: 50,
}));

const FormInput = styled(FormControl, {
  name: PREFIX,
  slot: "Wrapper",
  overridesResolver: (_props, styles) => styles.wrapper,
})(({ theme }) => ({
  //   "&:hover": {
  //     backgroundColor: alpha(theme.palette.common.white, 0.25),
  //     svg: {
  //       fill: theme.palette.error.main,
  //     },
  //   },
  transition: "transform 0.2s ease-in-out",
  "&:focus-within": { transform: "scale(1.025)" },
  margin: theme.spacing(0),
  width: "fill-available",
  // [theme.breakpoints.up("sm")]: {
  //   // marginLeft: theme.spacing(3),
  //   width: "auto",
  // },
}));

const Label = styled(InputLabel, {
  name: PREFIX,
  slot: "Label",
  overridesResolver: (_props, styles) => styles.label,
})<{ shrink?: boolean }>(({ theme, shrink }) => ({
  left: shrink ? 0 : theme.spacing(4),
  fontFamily: "var(--font-interkhmerloopless)",
  // color: alpha(theme.palette.text.primary, 0.5),
  transform: !shrink
    ? "translate(14px, 9px) scale(1)"
    : "translate(14px, -9px) scale(0.75)",
  pointerEvents: "none",
  // color: theme.palette.error.main,
  borderRadius: 50,
  // backgroundColor: shrink ? theme.palette.background.paper : "transparent",
  backgroundColor: shrink
    ? alpha(theme.palette.common.black, 0.05)
    : "transparent",
  backdropFilter: "blur(10px) saturate(150%)",
  // border: `1px solid ${alpha(theme.palette.common.white, 0.075)}`,
  // Color when focused
  "&:hover": {
    color: theme.palette.error.main,
  },
  "&.Mui-focused": {
    color: theme.palette.error.main,
  },
}));

const Input = styled(OutlinedInput, {
  name: PREFIX,
  slot: "Input",
  overridesResolver: (_props, styles) => styles.input,
})(({ theme }) => ({
  padding: theme.spacing(0, 0, 0, 1),
  // vertical padding + font size from searchIcon
  //   paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  //   transition: theme.transitions.create("width"),
  //   [theme.breakpoints.up("sm")]: {
  //     width: "10ch",
  //     "&:focus": {
  //       width: "100%",
  //     },
  //   },
  //   borderRadius: 50,
  "&.Mui-focused .MuiSvgIcon-root": {
    color: theme.palette.error.main,
  },

  // backgroundColor: alpha(theme.palette.common.white, 0.125),
  transition: theme.transitions.create(["background-color", "width"]),

  // 3. The Glass Effect
  backgroundColor: alpha(theme.palette.common.white, 0.05),
  backdropFilter: "blur(10px) saturate(150%)",
  border: `1px solid ${alpha(theme.palette.common.white, 0.075)}`,
  input: {
    fontFamily: "'Roboto Mono', monospace, var(--font-interkhmerloopless)", // Different font for input if desired
    fontSize: "0.925rem",
    // fontWeight: 400,
    color: theme.palette.text.primary,
    paddingLeft: theme.spacing(1),
    transition: theme.transitions.create("width"),
    // [theme.breakpoints.up("sm")]: {
    //   width: "10ch",
    //   "&:focus": {
    //     width: "20ch",
    //   },
    // },
    "&:focus": {
      color: theme.palette.error.main,
    },
  },
  svg: {
    transform: "scaleX(-1)",
    marginLeft: theme.spacing(0),
  },
  // 1. Remove the default border
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    svg: {
      fill: theme.palette.error.main,
      transition: "fill 0.25s ease-in-out",
    },
    // 2. Ensure the border doesn't reappear on hover
    "& .MuiOutlinedInput-notchedOutline": {
      // border: "none",
    },
  },
  // 3. Ensure the border doesn't reappear when focused
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  // subtle shadow on focus instead of a border
  "&.Mui-focused": {
    // backgroundColor: alpha(theme.palette.background.paper, 0.25),
    // boxShadow: `0 0 0 2px ${alpha(theme.palette.error.main, 0.25)}`,
    backgroundColor: alpha(theme.palette.common.white, 0.07),
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.25)}`,
    border: `1px solid ${alpha(theme.palette.error.main, 0.5)}`,
  },
  //   // 5. Keep your original input width transition
  // "& .MuiOutlinedInput-input": {
  //   padding: theme.spacing(1.5, 2, 1.5, 0),
  //   transition: theme.transitions.create("width"),
  //   [theme.breakpoints.up("sm")]: {
  //     width: "10ch",
  //     "&:focus": {
  //       width: "20ch",
  //     },
  //   },
  // },
}));

const ActionButton = styled(IconButton, {
  name: PREFIX,
  slot: "ActionButton",
  overridesResolver: (_props, styles) => styles.actionButton,
})(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(1),
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const GlobalSearch = ({ label = "ស្វែងរក..." }: { label?: string }) => {
  // 1. Manually track focus and value to control the shrink state
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  // The label should shrink if the input is focused OR has text
  const shouldShrink = focused || value.length > 0;

  const handleClear = () => {
    setValue("");
  };

  return (
    <Root>
      <FormInput variant="outlined">
        <Label shrink={shouldShrink} htmlFor="outlined-adornment-password">
          {label}
        </Label>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          notched={shouldShrink}
          label={label} // Required for the outline to calculate the cutout width
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          // 2. The Clear Button logic
          endAdornment={
            value.length > 0 ? (
              <InputAdornment position="start">
                <Fade in={value.length > 0}>
                  <ActionButton onClick={handleClear} size="small">
                    <ClearIcon fontSize="small" />
                  </ActionButton>
                </Fade>
              </InputAdornment>
            ) : null // 3. Returns null so the input takes up the full space
          }
        />
      </FormInput>
    </Root>
  );

  //   return (
  //     <Root>
  //       <Label
  //         // shrink={shouldShrink} // 2. Override default behavior
  //         sx={
  //           {
  //             // 3. When NOT shrunk, shift the label to the right to avoid the Search icon
  //             //   ...(!shouldShrink && {
  //             //     transform: "translate(44px, 16px) scale(1)",
  //             //   }),
  //           }
  //         }
  //       >
  //         ស្វែងរក...
  //       </Label>

  //       <Input
  //         value={value}
  //         onChange={(e) => setValue(e.target.value)}
  //         onFocus={() => setFocused(true)}
  //         onBlur={() => setFocused(false)}
  //         // label="ស្វែងរក" // Required for the outline to calculate the cutout width
  //         notched={shouldShrink} // 4. Tell the outline when to cut the notch
  //         // startAdornment={
  //         //   <InputAdornment position="start">
  //         //     <SearchIcon />
  //         //   </InputAdornment>
  //         // }
  //         // sx={{
  //         //   borderRadius: 50,
  //         //   backgroundColor: alpha(theme.palette.common.white, 0.15),
  //         //   transition: theme.transitions.create(["background-color", "width"]),
  //         //   "&:hover": {
  //         //     backgroundColor: alpha(theme.palette.common.white, 0.25),
  //         //     "& svg": {
  //         //       fill: theme.palette.error.main,
  //         //     },
  //         //   },
  //         //   // 5. Keep your original input width transition
  //         //   "& .MuiOutlinedInput-input": {
  //         //     transition: theme.transitions.create("width"),
  //         //     [theme.breakpoints.up("sm")]: {
  //         //       width: "12ch",
  //         //       "&:focus": {
  //         //         width: "20ch",
  //         //       },
  //         //     },
  //         //   },
  //         // }}
  //       />
  //     </Root>
  //   );
};

export default GlobalSearch;
