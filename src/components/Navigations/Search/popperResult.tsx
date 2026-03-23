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

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
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
  borderRadius: "50px",
  overflow: "hidden",
  backgroundColor: alpha(theme.palette.background.paper, 0.75),
  backdropFilter: "blur(0.125rem)",
}));

const ErrorBox = styled(Box, {
  name: PREFIX,
  slot: "ErrorBox",
  overridesResolver: (_props, styles) => styles.errorBox,
})(({ theme }) => ({
  padding: 2,
  display: "flex",
  alignItems: "center",
  color: theme.palette.error.main,
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
    onSelect,
    setValue,
    setOpen,
    ...rest
  } = props;

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
                <ErrorOutlineIcon sx={{ mr: 1 }} />
                <Typography variant="body2">{error}</Typography>
              </ErrorBox>
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
                align="center"
                color="textSecondary"
                variant="subtitle2"
                noWrap
                // gutterBottom

                sx={{
                  p: 1.25,
                  // textAlign: "center",
                  // color: "text.secondary",
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
