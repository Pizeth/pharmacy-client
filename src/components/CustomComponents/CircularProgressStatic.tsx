import Box from "@mui/material/Box";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import { styled, useThemeProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const PREFIX = "RazethCircularProgressStatic";
const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  position: "relative",
  display: "inline-flex",
}));

const Caption = styled(Box, {
  name: PREFIX,
  slot: "Caption",
  overridesResolver: (_props, styles) => styles.caption,
})(({ theme }) => ({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const CircularProgressStatic = (inProps: CircularProgressProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { value = 0, ...rest } = props;
  return (
    <Root sx={{ position: "relative", display: "inline-flex" }} {...rest}>
      <CircularProgress
        color="primary"
        enableTrackSlot
        size="2.25rem"
        variant="determinate"
        {...props}
      />
      <Caption>
        <Typography
          variant="caption"
          component="div"
          color={value <= 50 ? "textSecondary" : "primary"}
        >{`${Math.round(value)}%`}</Typography>
      </Caption>
      {/* <svg width="32" height="32" viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke={alpha(theme.palette.divider, 0.1)}
          strokeWidth="3"
        />
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth="3"
          strokeDasharray={88}
          strokeDashoffset={88 - (88 * value) / 100}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg> */}
    </Root>
  );
};

export default CircularProgressStatic;
