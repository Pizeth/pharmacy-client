import { SideImageProps } from "@/interfaces/auth.interface";
import {
  Grid,
  styled,
  useMediaQuery,
  useTheme,
  useThemeProps,
} from "@mui/material";
import Image from "next/image";

/* Image section - hidden on mobile */
const SideImage = (inProps: SideImageProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const {
    src = `${process.env.NEXT_PUBLIC_PLACEHOLDER}` ||
      "/static/images/placeholder-mcs-orange.svg",
    ...rest
  } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    !isMobile && (
      <StyledSideImage size={{ xs: 12, md: 6 }} {...rest}>
        <Image
          src={src}
          // placeholder="empty"
          alt="Background"
          fill
          priority={true}
          //   className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </StyledSideImage>
    )
  );
};

const PREFIX = "RazethSideImage";

// export const SideImageStyles = (theme: Theme) => ({
//   [`& .${SideImageClasses.content}`]: {
//     position: "relative",
//     // height: { xs: "auto", md: "auto" },
//     height: "100%",
//     backgroundColor:
//       theme.palette.mode === "dark"
//         ? "rgba(0, 0, 0, 0.2)"
//         : theme.palette.grey[200],
//     "& img": {
//       position: "absolute",
//       inset: 0,
//       width: "100%",
//       height: "100%",
//       objectFit: "cover",
//       ...(theme.palette.mode === "dark" &&
//         {
//           // filter: "brightness(0.25) grayscale(1)",
//           // filter:
//           //   "grayscale(1) sepia(1) saturate(5) hue-rotate(315deg) brightness(1)",
//         }),
//     },
//   },
// });

const StyledSideImage = styled(Grid, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<SideImageProps>(() => ({}));

export default SideImage;
