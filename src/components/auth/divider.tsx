import { DividerProps } from "@/interfaces/auth.interface";
import {
  Box,
  Divider,
  styled,
  Theme,
  Typography,
  useThemeProps,
} from "@mui/material";

export const RazethDivider = (inProps: DividerProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { className, title, sx, ...rest } = props;
  return (
    <StyledDivider className={className} sx={sx} {...rest}>
      <Box
        // sx={{
        //   position: "relative",
        //   display: "flex",
        //   alignItems: "center",
        //   my: 2,
        // }}
        className={DividerClasses.content}
      >
        <Divider />
        <Typography
          variant="body2"
          //   sx={{
          //     px: 2,
          //     backgroundColor: theme.palette.background.paper,
          //     color: "text.secondary",
          //   }}
        >
          {title}
        </Typography>
        <Divider />
      </Box>
    </StyledDivider>
  );
};

const PREFIX = "RazethDivider";

export const DividerClasses = {
  content: `${PREFIX}-content`,
  button: `${PREFIX}-button`,
  icon: `${PREFIX}-icon`,
};

export const DividerStyles = (theme: Theme) => ({
  [`& .${DividerClasses.content}`]: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    ["& .MuiDivider-root"]: { flex: 1 },
    ["& .MuiTypography-root"]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.secondary,
    },
  },
});

const StyledDivider = styled("div", {
  name: PREFIX,
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => DividerStyles(theme));

export default RazethDivider;
