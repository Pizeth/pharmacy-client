import { Avatar, Box, styled, Typography, useThemeProps } from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import { AvatarProps } from "@/interfaces/auth.interface";
import { useTranslate } from "ra-core";

const AvatarHeader = (inProps: AvatarProps) => {
  const props = useThemeProps({
    props: inProps,
    name: inProps.prefix || PREFIX,
  });
  const {
    avatarIcon = defaultAvatarIcon,
    className,
    sx,
    title,
    ...rest
  } = props;
  const translate = useTranslate();

  return (
    <BoxAvatar className={className} sx={sx} {...rest}>
      <Avatar>{avatarIcon}</Avatar>
      <Typography align="center" variant="h6" fontWeight="bold" gutterBottom>
        {translate("razeth.title.welcome") || title}
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
    </BoxAvatar>
  );
};

const defaultAvatarIcon = <PersonIcon />;
const PREFIX = "RazethAvatar";

// export const AvatarClasses = {
//   content: `${PREFIX}-content`,
//   "& svg": {
//     fill: "#fff",
//   },
// };

const BoxAvatar = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<AvatarProps>(() => ({}));

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
