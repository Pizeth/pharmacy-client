"use client";

import { Grid, useTheme, useThemeProps } from "@mui/material";
import type { AuthProps } from "@/interfaces/component-props.interface";
import SideImage from "./sideImage";
import AvatarHeader from "./avatar";
import SocialLogin from "./socialLogin";
import Footer from "./ui/footer";
import Divider from "./divider";
import PulseLoader from "../effect/loaders/loader";
import { useAuthSession } from "./hooks/useAuthSession";
import { AuthAmbient, AuthImage, AuthEffects } from "./components/AuthBackground";
import { Root, Overlay, Content, LoginCard } from "./styles/auth.styles";
import { AuthFormPanel } from "./components/AuthFormPanel";

const PREFIX = "RazethAuth";
export const Auth = (inProps: AuthProps) => {
  const props = useThemeProps({
    props: inProps,
    name: PREFIX,
  });
  const {
    sideImage = defaultSideImage,
    avatarIcon = defaultAvatar,
    children,
    divider = defaultDivider,
    social,
    authNavigationLinks,
    footer = defaultFooter,
    variant = "full",
    src = "/static/images/astronaut.png",
    alt = "Picture of the astronaut",
    enableToggle = true,
    defaultMode = "signin",
    className,
    sx,
    ...rest
  } = props;
  const theme = useTheme();
  const { isLoading, authenticated, currentMode, handleToggle } = useAuthSession(defaultMode);
  if (isLoading || authenticated) {
    return <PulseLoader />;
  }
  return (<Root variant={variant} className={className} sx={sx} {...rest}>
    <Auth.overlay>
      <Auth.ambient />
      <Auth.effect shootingStarCount={theme.custom.sideImage.shootingStarMaxCount} twinkleStarCount={theme.custom.sideImage.twinkleStarMaxCount} />
      <Auth.image src={src} alt={alt} />
      <Content>
        <Auth.card>
          <Grid container spacing={0}>
            {sideImage}
            <AuthFormPanel
              mode={currentMode}
              onToggle={handleToggle}
              enableToggle={enableToggle}
              avatar={avatarIcon}
              navigation={authNavigationLinks}
              divider={divider}
              social={social === undefined ? <SocialLogin allowTelegramSignup={currentMode === "signup"} /> : social}
            >{children}</AuthFormPanel>
          </Grid>
        </Auth.card>
        {footer}
      </Content>
    </Auth.overlay>
  </Root>);
};
Auth.overlay = Overlay;
Auth.ambient = AuthAmbient;
Auth.image = AuthImage;
Auth.effect = AuthEffects;
Auth.card = LoginCard;
const defaultSideImage = (<SideImage src={process.env.NEXT_PUBLIC_PLACEHOLDER} />);
const defaultAvatar = (<AvatarHeader src={process.env.NEXT_PUBLIC_EARTH_IMAGE_URL ||
  "https://assets.razeth.com/sea-planet-water-Earth-map-Arctic-193611-wallhere.com.jpg"} />);
const defaultDivider = <Divider />;
const defaultFooter = <Footer />;
export { Content as LoginContent, LoginCard } from "./styles/auth.styles";

export default Auth;
