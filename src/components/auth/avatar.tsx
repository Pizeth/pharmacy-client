import { Avatar, Box, Typography, useThemeProps } from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import { AvatarProps } from "@/interfaces/auth.interface";

const AvatarHeader = (inProps: AvatarProps) => {
  const props = useThemeProps({
    props: inProps,
    name: PREFIX,
  });
  const { avatarIcon = defaultAvatarIcon, className, ...rest } = props;

  return (
    <Box {...rest}>
      <div className={className}>
        <Avatar>{avatarIcon}</Avatar>
      </div>
      <Typography align="center" variant="h6" fontWeight="bold" gutterBottom>
        Welcome back
      </Typography>
      {/* <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          maxWidth: "300px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        Login to your MCS account
      </Typography> */}
    </Box>
  );
};

const defaultAvatarIcon = <PersonIcon />;
const PREFIX = "RazethAvatar";

export const AvatarClasses = {
  content: `${PREFIX}-content`,
  "& svg": {
    fill: "#fff",
  },
};

// export const AvatarStyles = () => ({
//   //   textAlign: "center",
//   [`& .${AvatarClasses.avatar}`]: {
//     margin: "1em",
//     display: "flex",
//     justifyContent: "center",
//   },
// });

// const StyledAvatar = styled(Box, {
//   name: PREFIX,
//   overridesResolver: (_props, styles) => styles.root,
// })(AvatarStyles);

export default AvatarHeader;
