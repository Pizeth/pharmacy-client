import { useCallback, useEffect, useRef, useState } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  alpha,
  styled,
  IconButton,
  Box,
  CircularProgress,
  ClickAwayListener,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import PoperResult from "./popperResult";

interface SmartSearchProps {
  onSelect?: (product: any) => void;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

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
  maxWidth: "50ch",
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
  // svg: {
  //   transform: "scaleX(-1)",
  //   marginLeft: theme.spacing(0),
  // },
  // 1. Remove the default border
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    svg: {
      // fill: theme.palette.error.main,
      color: theme.palette.error.main,
      transition: "color 0.25s ease-in-out",
    },
    // 2. Ensure the border doesn't reappear on hover
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
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
  "& .MuiInputAdornment-root": {
    "&.MuiInputAdornment-positionStart": {
      opacity: 0.5,
      transform: "scaleX(-1)",
      // marginLeft: theme.spacing(0),
    },
    "&.MuiInputAdornment-positionEnd": {
      // opacity: 0.5,
      // transform: "scaleX(-1)",
      margin: theme.spacing(1),
      svg: {
        color: theme.palette.text.primary,
      },
    },
    // svg: {
    //   opacity: 0.5,
    //   transform: "scaleX(-1)",
    //   marginLeft: theme.spacing(0),
    // },
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
  // color: theme.palette.text.secondary,
  // marginLeft: theme.spacing(1),
  padding: theme.spacing(0),
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const GlobalSearch = ({ label = "ស្វែងរក..." }: { label?: string }) => {
  // Refs & Anchors
  const containerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(""); // Immediate UI state
  const [loading, setLoading] = useState(false);
  // 1. Manually track focus and value to control the shrink state
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1); // -1 means nothing is highlighted

  // 1. The Search Logic (Connect this to your API)
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      // onSearchResults?.([]); // Clear results if query is empty
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      // Replace this with your actual API call:
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${query}`,
        // `https://jsonplaceholder.typicode.com/posts`,
      );
      // console.log(response.data);
      // setResults([response.data]);
      Array.isArray(response.data)
        ? setResults(response.data)
        : setResults([response.data]);
      setError(null);
      console.log("results in search: ", results);
      setOpen(response.data.length > 0 || query.length > 0);

      // console.log(`API Call: Fetching results for "${query}"...`);

      // Simulating a 1-second network delay
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock result
      // const mockData = [{ id: 1, name: `Result for ${query}` }];
      // onSearchResults?.(mockData);
    } catch (err) {
      console.error("Search failed", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setOpen(true); // Open to show the error message
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Debounce
  useEffect(() => {
    const timer = setTimeout(() => performSearch(value), 500);
    // If the dropdown is open and has results, lock the body scroll
    if (open && results.length > 0) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      // Cleanup function: Restore the scroll when the dropdown closes
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
    return () => clearTimeout(timer);
  }, [value, performSearch]);

  const handleSelect = (product: Product) => {
    setValue(product.name);
    setOpen(false);
    setActiveIndex(-1);
    console.log("Selected:", product);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) {
          handleSelect(results[activeIndex]);
        }
        break;
      case "Escape":
        setOpen(false);
        setActiveIndex(-1);
        handleClear();
        break;
    }
  };

  const handleClear = () => {
    setValue("");
    setResults([]);
    setOpen(false);
    setError(null);
  };

  // The label should shrink if the input is focused OR has text
  const shouldShrink = open || focused || value.length > 0;

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Root>
        <FormInput variant="outlined" ref={containerRef}>
          <Label shrink={shouldShrink} htmlFor="outlined-adornment-password">
            {label}
          </Label>
          <Input
            value={value}
            label={label} // Required for the outline to calculate the cutout width
            onChange={(e) => {
              setValue(e.target.value);
              setActiveIndex(-1); // Reset highlight when typing
            }}
            // onKeyDown={handleKeyDown}
            // onChange={(e) => {
            //   setValue(e.target.value);
            //   if (e.target.value.length > 0)
            //     setLoading(true); // Simulate start loading
            //   else setLoading(false);
            // }}
            onFocus={() => {
              setFocused(true);
              // setOpen(error !== null);
            }}
            onBlur={() => setFocused(false)}
            notched={shouldShrink}
            // onKeyDown={(e) => e.key === "Escape" && handleClear()}
            onKeyDown={handleKeyDown}
            startAdornment={
              <InputAdornment position="start" className="reverse">
                <SearchIcon />
              </InputAdornment>
            }
            // 2. The Clear Button logic
            // endAdornment={
            //   value.length > 0 ? (
            //     <InputAdornment position="start">
            //       <Fade in={value.length > 0}>
            //         <ActionButton onClick={handleClear} size="small">
            //           <ClearIcon fontSize="small" />
            //         </ActionButton>
            //       </Fade>
            //     </InputAdornment>
            //   ) : null // 3. Returns null so the input takes up the full space
            // }
            // 1. DYNAMIC END ADORNMENT
            endAdornment={
              loading || value.length > 0 ? (
                <InputAdornment position="end">
                  {loading ? (
                    <CircularProgress
                      size="1rem"
                      thickness={5}
                      // sx={{ color: theme.palette.primary.main }}
                    />
                  ) : (
                    <ActionButton onClick={handleClear} size="small">
                      <ClearIcon fontSize="small" />
                    </ActionButton>
                  )}
                </InputAdornment>
              ) : null
            }
          />
          {/* 3. The Results Dropdown (Popper) */}
          {/* <Popper
            open={open}
            anchorEl={containerRef.current}
            placement="bottom"
            transition
            // width={containerRef.current?.clientWidth}
            style={{
              width: containerRef.current?.clientWidth,
              zIndex: 1300,
              // marginTop: 8,
            }}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={250}>
                <Paper
                  elevation={7}
                  sx={{
                    mt: 1,
                    borderRadius: "50px",
                    overflow: "hidden",
                    backgroundColor: (theme) =>
                      alpha(theme.palette.background.paper, 0.75),
                    backdropFilter: "blur(0.125rem)",
                  }}
                >
                  {error ? (
                    <Box
                      sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        color: "error.main",
                      }}
                    >
                      <ErrorOutlineIcon sx={{ mr: 1 }} />
                      <Typography variant="body2">{error}</Typography>
                    </Box>
                  ) : results.length > 0 ? (
                    <List sx={{ py: 0 }}>
                      {results.map((product: Product) => (
                        <ListItemButton
                          key={product.id}
                          onClick={() => {
                            onSelect?.(product);
                            setValue(product.name);
                            setOpen(false);
                          }}
                        >
                          <ListItemText
                            primary={product.name}
                            secondary={`${product.category} • $${product.price}`}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  ) : (
                    <Typography
                      sx={{
                        p: 2,
                        textAlign: "center",
                        color: "text.secondary",
                      }}
                    >
                      No products found
                    </Typography>
                  )}
                </Paper>
              </Fade>
            )}
          </Popper> */}
          <PoperResult
            open={open}
            anchorEl={containerRef.current}
            width={containerRef.current?.clientWidth}
            results={results}
            error={error}
            activeIndex={activeIndex}
            setValue={setValue}
            setOpen={setOpen}
            onSelect={(p) => console.log("Selected:", p)}
          />
        </FormInput>
      </Root>
    </ClickAwayListener>
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
