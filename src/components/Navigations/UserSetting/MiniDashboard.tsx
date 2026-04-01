import { MiniDashboardProps } from "@/interfaces/component-props.interface";
import Box from "@mui/material/Box";
import { alpha, styled, useThemeProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const PREFIX = "RazethMiniDashboard";
const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
})(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  "& .MuiBox-root": {
    a: {
      color: alpha(theme.palette.primary.main, 0.75),
      "&:hover": {
        textDecoration: "underline",
        color: theme.palette.primary.main,
      },
    },
  },
}));

const Content = styled(Box, {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})(({ theme }) => ({
  position: "relative",
  display: "inline-flex",
}));

const MiniDashboard = (inProps: MiniDashboardProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { children, mainCaption, subCaption, link, ...rest } = props;
  return (
    <Root {...rest}>
      <Content>{children}</Content>
      <Box>
        <Typography variant="caption" fontWeight={700} display="block">
          {mainCaption}
        </Typography>
        <Typography
          variant="caption"
          color="primary"
          fontWeight={700}
          component="a"
          href={link}
        >
          {subCaption}
        </Typography>
      </Box>
    </Root>
  );
};

export default MiniDashboard;
