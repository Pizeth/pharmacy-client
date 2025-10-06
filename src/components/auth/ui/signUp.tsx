import { Box, Link, styled, Theme, useThemeProps } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { SignUpProps } from "@/interfaces/auth.interface";

const SignupLink = (inProps: SignUpProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const {
    message = "Don't have an account?",
    title = "Sign Up",
    icon = defaultIcon,
    sx,
    className,
    ...rest
  } = props;
  return (
    <StyledSignUpLink className={className} sx={sx} {...rest}>
      <Box
        // sx={{
        //   textAlign: "center",
        //   mt: 1,
        //   color: "text.secondary",
        // }}
        className={SideImageClasses.content}
      >
        {/* Don&apos;t have an account?{" "} */}
        {message + " "}
        <Link
          href="#"
          sx={{
            color: "primary.main",
            textDecoration: "underline",
            textUnderlineOffset: "2px",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          {title + " "} {icon}
        </Link>
      </Box>
    </StyledSignUpLink>
  );
};

const PREFIX = "RazethSideImage";

export const SideImageClasses = {
  content: `${PREFIX}-content`,
  button: `${PREFIX}-button`,
  icon: `${PREFIX}-icon`,
};

const defaultIcon = <PersonAddIcon />;

export const SingupLinktyles = (theme: Theme) => ({
  [`& .${SideImageClasses.content}`]: {
    textAlign: "center",
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
    a: {
      //   color: theme.palette.primary.main,
      //   textDecoration: "underline",
      //   textUnderlineOffset: "2px",
      textTransform: "uppercase",
      svg: {
        paddingBottom: "2px",
      },
    },
  },

  // [`& .${SideImageClasses.content}:last-child`]: {
  //   paddingBottom: `${theme.spacing(0)}`,
  // },
});

const StyledSignUpLink = styled("div", {
  name: PREFIX,
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => SingupLinktyles(theme));

export default SignupLink;
