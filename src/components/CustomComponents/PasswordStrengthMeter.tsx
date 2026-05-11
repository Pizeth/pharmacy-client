import { Typography, Box, styled } from "@mui/material";
import { PasswordStrengthMeterProps } from "@/types/Types";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import { padding } from "@mui/system";

// const MESSAGE = import.meta.env.VITE_PASSWORD_HINT;

// const getColor = (strength: number): string => {
//   switch (strength) {
//     case 0:
//       return "#f44336"; // Red
//     case 1:
//       return "#ff9800"; // Orange
//     case 2:
//       return "#ffeb3b"; // Yellow
//     case 3:
//       return "#4caf50"; // Light Green
//     case 4:
//       return "#2e7d32"; // Dark Green
//     default:
//       return "#e0e0e0"; // Grey
//   }
// };

// const getColor = (strength: number) => {
//   const colors = ["#f44336", "#ff9900", "#ffeb3b", "#4caf50", "#2e7d32"];
//   return colors[Math.min(strength, colors.length - 1)];
// };

// export const PasswordStrengthMeter = ({
//   passwordStrength,
//   passwordFeedback,
//   value,
// }: PasswordStrengthMeterProps) => (
//   <Box mt={1}>
//     <LinearProgressWithLabel
//       variant="determinate"
//       value={(passwordStrength / 4) * 100}
//       // style={{ backgroundColor: getColor(passwordStrength), height: 8 }}
//       sx={{
//         backgroundColor: (theme) => theme.palette.grey[300],
//         "& .MuiLinearProgress-bar": {
//           backgroundColor: getColor(passwordStrength),
//         },
//       }}
//     />
//     <Typography variant="caption" color="textSecondary">
//       {value ? passwordFeedback : MESSAGE}
//     </Typography>
//   </Box>
// );
const Root = styled(Box)(({ theme }) => ({
  p: {
    "&.MuiTypography-caption": {
      paddingLeft: theme.spacing(1.5),
    },
  },
}));

export const PasswordStrengthMeter = ({
  passwordStrength,
  passwordFeedback,
}: // value,
PasswordStrengthMeterProps) => (
  <Root>
    <LinearProgressWithLabel
      variant="determinate"
      value={(passwordStrength / 4) * 100}
      strength={passwordStrength} // Pass strength to LinearProgressWithLabel
    />
    <Typography
      className={"passHint"}
      component={"p"}
      variant="caption"
      color="textSecondary"
    >
      {passwordFeedback}
      {/* {value ? passwordFeedback : MESSAGE} */}
    </Typography>
  </Root>
);

export default PasswordStrengthMeter;
