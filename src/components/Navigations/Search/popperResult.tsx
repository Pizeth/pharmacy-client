import { PoperResultProps } from "@/interfaces/component-props.interface";
import {
  Fade,
  List,
  ListItemButton,
  ListItemText,
  Paper as MuiPaper,
  Popper,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { alpha, styled, useThemeProps } from "@mui/material/styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useEffect, useRef } from "react";

interface Product {
  id: number;
  userId: number;
  title: string;
  body: string;
}

const PREFIX = "RazethSearchPoppers";
const Root = styled(Popper, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<{ width: number | string | undefined }>(({ theme, width }) => ({
  width: width,
  zIndex: 1300,
}));

const Paper = styled(MuiPaper, {
  name: PREFIX,
  slot: "Paper",
  overridesResolver: (_props, styles) => styles.paper,
})(({ theme }) => ({
  marginTop: theme.spacing(1),
  borderRadius: "5px",
  overflow: "hidden", // Clips the ripple effects to the border radius
  backgroundColor: alpha(theme.palette.background.paper, 0.75),
  backdropFilter: "blur(0.125rem)",
  border: `1px solid ${alpha(theme.palette.common.white, 0.125)}`,
}));

const ErrorBox = styled(Box, {
  name: PREFIX,
  slot: "ErrorBox",
  overridesResolver: (_props, styles) => styles.errorBox,
})(({ theme }) => ({
  padding: theme.spacing(0.5),
  display: "flex",
  alignItems: "center",
  color: theme.palette.error.main,
  svg: {
    marginRight: theme.spacing(0.5),
  },
}));

const ScrollableList = styled(List, {
  name: PREFIX,
  slot: "ScrollableList",
  overridesResolver: (_props, styles) => styles.scrollableList,
})(({ theme }) => ({
  padding: theme.spacing(0),
  maxHeight: "50vmin", // 1. Limit the height
  overflowY: "auto", // 2. Enable internal scrolling
  // 3. Smooth scrollbar styling (optional but looks great)
  "&::-webkit-scrollbar": { width: "6px" },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: alpha(theme.palette.text.primary, 0.1),
    borderRadius: "10px",
  },
  "& .MuiButtonBase-root": {
    padding: theme.spacing(0),
    "& .MuiListItemText-root": {
      margin: theme.spacing(0.5, 1, 1, 1),
    },
  },
}));

const PoperResult = (inProps: PoperResultProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const {
    open,
    anchorEl,
    width,
    placement,
    results,
    error,
    activeIndex,
    onSelect,
    setValue,
    setOpen,
    ...rest
  } = props;

  console.log("results", results);
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (activeIndex !== -1 && listRef.current) {
      const activeElement = listRef.current.children[
        activeIndex
      ] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          block: "nearest", // Only scrolls if the item is out of view
          behavior: "smooth",
        });
      }
    }
  }, [activeIndex]);
  return (
    <Root
      open={open}
      anchorEl={anchorEl}
      placement={placement}
      transition
      width={width}
      {...rest}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={250}>
          <Paper elevation={7}>
            {error ? (
              <ErrorBox>
                <ErrorOutlineIcon fontSize="small" />
                <Typography variant="caption" align="center">
                  {error}
                </Typography>
              </ErrorBox>
            ) : results.length > 0 ? (
              <ScrollableList ref={listRef} dense>
                {results.map((product: Product, index: number) => (
                  <ListItemButton
                    key={product.id}
                    selected={index === activeIndex}
                    dense
                    disableGutters
                    divider
                    onClick={() => {
                      onSelect?.(product);
                      setValue(product.title);
                      setOpen(false);
                    }}
                    component="a"
                    href="/fts"
                  >
                    <ListItemText
                      primary={product.title}
                      secondary={product.body}
                    />
                  </ListItemButton>
                ))}
              </ScrollableList>
            ) : (
              <Typography
                align="center"
                color="textSecondary"
                variant="subtitle2"
                noWrap
                // gutterBottom

                sx={{
                  p: 1.25,
                }}
              >
                No products found
              </Typography>
            )}
          </Paper>
        </Fade>
      )}
    </Root>
  );
};
export default PoperResult;
