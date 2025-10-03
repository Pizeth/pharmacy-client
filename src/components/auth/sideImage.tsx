import { SideImageProps } from "@/interfaces/auth.interface";
import { Grid, useMediaQuery, useTheme, useThemeProps } from "@mui/material";
import Image from "next/image";

/* Image section - hidden on mobile */
const SideImage = (inProps: SideImageProps) => {
  const props = useThemeProps({
    props: inProps,
    name: PREFIX,
  });
  const { src = "static/images/placeholder-mcs-orange.svg", ...rest } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    !isMobile && (
      <Grid
        size={{ md: 6 }}
        sx={{
          position: "relative",
          height: { xs: "auto", md: "auto" },
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(0, 0, 0, 0.2)"
              : theme.palette.grey[200],
          "& img": {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            ...(theme.palette.mode === "dark" &&
              {
                // filter: "brightness(0.25) grayscale(1)",
                // filter:
                //   "grayscale(1) sepia(1) saturate(5) hue-rotate(315deg) brightness(1)",
              }),
          },
        }}
      >
        <Image
          priority={false}
          placeholder="empty"
          // src={placeholder}
          src={src}
          width={64}
          height={64}
          alt="Image"
          //   className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </Grid>
    )
  );
};

const PREFIX = "RazethSideImage";

export const LoginFormClasses = {
  content: `${PREFIX}-content`,
  button: `${PREFIX}-button`,
  icon: `${PREFIX}-icon`,
};

export const SideImageStyles = (theme: Theme) => ({
  [`& .${LoginFormClasses.content}`]: {
    minWidth: 300,
    padding: `${theme.spacing(0)}`,
  },
  [`& .${LoginFormClasses.content}:last-child`]: {
    paddingBottom: `${theme.spacing(0)}`,
  },
  [`& .${LoginFormClasses.button}`]: {
    marginTop: theme.spacing(2),
    mt: 1,
    py: 1.5,
    fontWeight: 600,
  },
  [`& .${LoginFormClasses.icon}`]: {
    margin: theme.spacing(0.3),
  },
});

const StyledLoginForm = styled(Form, {
  name: PREFIX,
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => LoginFormStyles(theme));

export default SideImage;
