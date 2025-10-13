import { DividerProps } from "@/interfaces/auth.interface";
import { Box, Divider, styled, Typography, useThemeProps } from "@mui/material";
import { useTranslate } from "ra-core";

export const RazethDivider = (inProps: DividerProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { className, title, sx, ...rest } = props;
  const translate = useTranslate();
  return (
    <StyledDivider className={className} sx={sx} {...rest}>
      <Divider />
      <Typography variant="body2">
        {title || translate("razeth.auth.social_login")}
      </Typography>
      <Divider />
    </StyledDivider>
  );
};

const PREFIX = "RazethDivider";

// export const DividerStyles = (theme: Theme) => ({
//   [`& .${DividerClasses.content}`]: {
//     position: "relative",
//     display: "flex",
//     alignItems: "center",
//     marginTop: theme.spacing(2),
//     marginBottom: theme.spacing(2),
//     ["& .MuiDivider-root"]: { flex: 1 },
//     ["& .MuiTypography-root"]: {
//       paddingLeft: theme.spacing(2),
//       paddingRight: theme.spacing(2),
//       backgroundColor: theme.palette.background.paper,
//       color: theme.palette.text.secondary,
//     },
//   },
// });

const StyledDivider = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<DividerProps>(() => ({}));

export default RazethDivider;
