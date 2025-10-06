import { SideImageProps } from "@/interfaces/auth.interface";
import {
  Grid,
  styled,
  Theme,
  useMediaQuery,
  useTheme,
  useThemeProps,
} from "@mui/material";
import Image from "next/image";

/* Image section - hidden on mobile */
const SideImage = (inProps: SideImageProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { src = "static/images/placeholder-mcs-orange.svg", ...rest } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    !isMobile && (
      <StyledSideImage size={{ xs: 12, md: 6 }} {...rest}>
        <div className={SideImageClasses.content}>
          <Image
            src={src}
            placeholder="empty"
            alt="Background"
            fill
            priority={false}
            //   className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </StyledSideImage>
    )
  );
};

const PREFIX = "RazethSideImage";

export const SideImageClasses = {
  content: `${PREFIX}-content`,
  button: `${PREFIX}-button`,
  icon: `${PREFIX}-icon`,
};

export const SideImageStyles = (theme: Theme) => ({
  [`& .${SideImageClasses.content}`]: {
    position: "relative",
    // height: { xs: "auto", md: "auto" },
    height: "100%",
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
  },

  // [`& .${SideImageClasses.content}:last-child`]: {
  //   paddingBottom: `${theme.spacing(0)}`,
  // },
});

const StyledSideImage = styled(Grid, {
  name: PREFIX,
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => SideImageStyles(theme));

export default SideImage;
