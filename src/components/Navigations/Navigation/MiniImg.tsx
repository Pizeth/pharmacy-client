import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Image from "next/image";
const PREFIX = "RazethMiniImg";
const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (props, styles) => styles.root
})(({
  theme
}) => ({
  flexGrow: 1,
  top: 0,
  left: 0,
  [theme.breakpoints.up("xs")]: {
    display: "flex"
  },
  [theme.breakpoints.up("sm")]: {
    display: "block"
  },
  img: {
    p: 0.5,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transition: "0.75s",
    pointerEvents: "none",
    zIndex: 3
  }
}));
export interface MiniImgProps {
  src?: string | undefined;
  alt?: string;
  children?: React.ReactNode;
  preload?: boolean;
  loading?: "eager" | "lazy";
  style?: React.CSSProperties;
  unoptimized?: boolean;
}
const MiniImg = (props: MiniImgProps) => {
  const {
    src = "/static/images/logo.svg",
    alt = "Image",
    children,
    preload = false,
    loading = "eager",
    style,
    unoptimized = true
  } = props;
  return <Root>
      <Image src={src} alt={alt} preload={preload} loading={loading} fill style={style} unoptimized={unoptimized} />
      {children}
    </Root>;
};
export default MiniImg;
