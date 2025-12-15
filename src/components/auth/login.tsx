"use client";
import React, { useEffect, useRef } from "react";
import { useCheckAuth } from "ra-core";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { styled, useTheme, useThemeProps } from "@mui/material/styles";
import PasswordLogin from "./passwordLogin";
import SocialLogin from "./socialLogin";
import SideImage from "./sideImage";
import AvatarHeader from "./avatar";
import { EffectProps, LoginProps } from "@/interfaces/auth.interface";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import { RazethDivider as Divider } from "./divider";
import SignupLink from "./ui/signUp";
import Footer from "./ui/footer";
import Image from "next/image";
import { StyleComponent } from "@/types/classKey";
import SocialButton from "./ui/socialButton";
import { Instagram, Meta, Telegram, YouTube } from "../icons/socialIcons";
import MCS from "../icons/mcs";
import { v7 } from "uuid";
import { MeteorShower } from "./ui/meteor";
import ShootingStars from "./effects/shootingStar";
import TwinkleStars from "./effects/twinkleStar";

const PREFIX = "RazethLogin";

const Root = styled("div", {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<LoginProps>(() => ({}));

const Overlay = styled(Box, {
  name: PREFIX,
  slot: "Overlay",
  overridesResolver: (_props, styles) => styles.overlay,
})(() => ({}));

const Ambient = styled(Box, {
  name: PREFIX,
  slot: "Ambient",
  overridesResolver: (_props, styles) => styles.ambient,
})(() => ({}));

const Effect = styled(Box, {
  name: PREFIX,
  slot: "Effect",
  overridesResolver: (_props, styles) => styles.effect,
})(() => ({}));

const Astronaut = styled(Box, {
  name: PREFIX,
  slot: "Image",
  overridesResolver: (_props, styles) => styles.image,
})(() => ({}));

const Heading = styled(Typography, {
  name: PREFIX,
  slot: "Heading",
  overridesResolver: (_props, styles) => styles.heading,
})(() => ({}));

const Icons = styled(Box, {
  name: PREFIX,
  slot: "Icon",
  overridesResolver: (_props, styles) => styles.icon,
})(() => ({}));

// Slot components
const Content = styled(Box, {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})(() => ({}));

const LoginCard = styled(Card, {
  name: PREFIX,
  slot: "Card",
  overridesResolver: (_props, styles) => styles.card,
})(() => ({}));

// Provider configuration
const PROVIDERS = {
  // web: {
  //   name: "Web",
  //   icon: <MCS />,
  //   className: "web",
  // },
  meta: {
    name: "Meta",
    icon: <Meta />,
    className: "meta",
  },
  instagram: {
    name: "Instagram",
    icon: <Instagram />,
    className: "instagram",
  },
  telegram: {
    name: "Telegram",
    icon: <Telegram />,
    className: "telegram",
  },
  youtube: {
    name: "Youtube",
    icon: <YouTube />,
    className: "youtube",
  },
};

// const LoginAvatar = styled(Box, {
//   name: PREFIX,
//   slot: "Avatar",
//   overridesResolver: (_props, styles) => styles.avatar,
// })(() => ({}));

// Main component + slot API
export const Login = (
  inProps: LoginProps & {
    Content?: StyleComponent;
    Card?: StyleComponent;
  }
) => {
  const props = useThemeProps({
    props: inProps,
    name: PREFIX,
  });
  const {
    sideImage = defaultSideImage,
    avatarIcon = defaultAvatar,
    children = defaultLoginForm,
    divider = defaultDivider,
    social = defaultSocial,
    signUp = defaultSignUp,
    footer = defaultFooter,
    variant = "full",
    src = "/static/images/astronaut.png",
    alt = "Picture of the astronaut",
    // heading = "Find me on Social Media",
    className,
    sx,
    // backgroundImage,
    ...rest
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const checkAuth = useCheckAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  useEffect(() => {
    checkAuth({}, false)
      .then(() => {
        // already authenticated, redirect to the home page
        navigate("/");
      })
      .catch(() => {
        // not authenticated, stay on the login page
      });
  }, [checkAuth, navigate]);

  return (
    <Root
      ref={containerRef}
      variant={variant}
      className={className}
      sx={sx}
      {...rest}
    >
      <Login.overlay>
        <Login.ambient />
        <Login.effect
          count={theme.custom.sideImage.shootingStarCount}
          shootingStarClass={theme.custom.sideImage.shootingClass}
          twinkleClass={theme.custom.sideImage.twinkleClass}
        />
        <Login.image src={src} alt={alt} />
        <Login.content>
          <Login.card>
            <Grid container spacing={0}>
              {/* Image section - hidden on mobile */}
              {sideImage}

              {/* Form section */}
              <Grid size={{ xs: 12, md: 6 }}>
                <CardContent>
                  <Box>
                    {avatarIcon}
                    {children}
                    {divider}
                    {social}
                    {signUp}
                  </Box>
                </CardContent>
              </Grid>
            </Grid>
          </Login.card>
          {/* {footer} */}
        </Login.content>
        {/* <Login.Heading>{heading}</Login.Heading> */}
        <Login.icon>
          {Object.entries(PROVIDERS).map(([key, provider]) => (
            <SocialButton
              key={key}
              variant="outlined"
              icon={provider.icon}
              // className={provider.className}
            >
              {/* {provider.name} */}
            </SocialButton>
          ))}
        </Login.icon>
      </Login.overlay>
    </Root>
  );
};

Login.overlay = Overlay;
Login.ambient = () => (
  <Ambient>
    <Box className="stars" />
    <Box className="twinkling" />
    <Box className="clouds" />
  </Ambient>
);
Login.image = ({ src, alt }: { src: string; alt: string }) => (
  <Astronaut>
    <Image
      preload={false}
      loading="lazy"
      src={src}
      alt={alt}
      fill
      style={{ objectFit: "contain" }}
      unoptimized
    />
  </Astronaut>
);
Login.effect = ({ count, shootingStarClass, twinkleClass }: EffectProps) => {
  const theme = useTheme();
  // Get configurations from theme
  const meteorConfig = theme.custom?.meteor;
  const sideImageConfig = theme.custom?.sideImage;

  return (
    <Effect>
      {/* {Array.from({ length: count }).map((_, i) => (
        <span key={v7()} className={shootingStarClass}>
          <span key={i} />
        </span>
      ))}
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} className={twinkleClass} />
      ))} */}
      {/* Dynamic Shooting Stars */}
      <ShootingStars
        count={sideImageConfig?.shootingStarCount || 20}
        interval={sideImageConfig?.shootingStarInterval || 5}
        curveFactor={sideImageConfig?.curveFactor || 50}
        trajectoryMix={sideImageConfig?.trajectoryMix}
        colors={sideImageConfig?.starColors}
        glowIntensity={sideImageConfig?.glowIntensity}
        baseSpeed={sideImageConfig?.baseSpeed}
        baseSize={sideImageConfig?.starSize}
      />

      {/* Dynamic Twinkle Stars */}
      <TwinkleStars
        count={sideImageConfig?.shootingStarCount || 12}
        colors={sideImageConfig?.starColors}
        baseSize={sideImageConfig?.starSize}
      />

      {/* Dynamic Meteor shower */}
      <MeteorShower
        enabled={meteorConfig.enabled}
        interval={meteorConfig.interval}
        configs={meteorConfig.configs}
      />
    </Effect>
  );
};
// Login.heading = Heading;
Login.icon = Icons;
Login.content = Content;
Login.card = LoginCard;
// Login.Avatar = LoginAvatar;

const defaultLoginForm = (
  <PasswordLogin
    forgotPasswordUrl={process.env.NEXT_PUBLIC_FORGOT_PASSWORD_URL}
  />
);
const defaultSideImage = (
  <SideImage src={process.env.NEXT_PUBLIC_PLACEHOLDER} />
);
// const defaultAvatar = <PersonIcon />;
const defaultAvatar = (
  <AvatarHeader
    src={
      // "https://api.dicebear.com/9.x/adventurer-neutral/svg?radius=50&seed=Razeth"
      "https://pub-ce3376330760464f8be1e4a3b46318c0.r2.dev/sea-planet-water-Earth-map-Arctic-193611-wallhere.com.jpg"
    }
    avatarIcon={<PersonIcon />}
  />
);
const defaultDivider = <Divider />;
const defaultSocial = <SocialLogin />;
const defaultSignUp = <SignupLink link="/auth/register" />;
const defaultFooter = <Footer />;

// ✅ Named exports (optional, for tree-shaking)
export {
  // Header as LoginHeader,
  Content as LoginContent,
  LoginCard,
};

export default Login;

// export default function LoginPage() {
//   return (
//     <Login Content={Content} Card={LoginCard}>
//       <Login.Content>
//         <Login.Card>
//           <Grid container spacing={0}>
//             {/* Image section - hidden on mobile */}
//             {defaultSideImage}

//             {/* Form section */}
//             <Grid size={{ xs: 12, md: 6 }}>
//               <CardContent>
//                 <Box>
//                   {defaultAvatar}
//                   {defaultLoginForm}
//                   {defaultDivider}
//                   {SocialLogin}
//                   {defaultSignUp}
//                 </Box>
//               </CardContent>
//             </Grid>
//           </Grid>
//         </Login.Card>
//         {defaultFooter}
//       </Login.Content>
//     </Login>
//   );
// }

// const LoginOld = (inProps: LoginProps) => {
//   const props = useThemeProps({
//     props: inProps,
//     name: PREFIX,
//   });
//   const {
//     avatarIcon = defaultAvatar,
//     children = defaultLoginForm,
//     divider = defaultDivider,
//     signUp = defaultSignUp,
//     footer = defaultFooter,
//     variant = "full",
//     className,
//     sx,
//     // backgroundImage,
//     // avatarIcon = defaultAvatar,
//     ...rest
//   } = props;
//   const containerRef = useRef<HTMLDivElement>(null);
//   const checkAuth = useCheckAuth();
//   // const theme = useTheme();
//   const navigate = useNavigate();
//   useEffect(() => {
//     checkAuth({}, false)
//       .then(() => {
//         // already authenticated, redirect to the home page
//         navigate("/");
//       })
//       .catch(() => {
//         // not authenticated, stay on the login page
//       });
//   }, [checkAuth, navigate]);

//   return (
//     <Root
//       ref={containerRef}
//       variant={variant}
//       className={className}
//       sx={sx}
//       {...rest}
//       // sx={{
//       //   minHeight: "100vh",
//       //   display: "flex",
//       //   alignItems: "center",
//       //   justifyContent: "center",
//       //   p: 2,
//       //   backgroundColor:
//       //     theme.palette.mode === "dark"
//       //       ? theme.palette.grey[900]
//       //       : theme.palette.grey[100],
//       // }}
//     >
//       <Box
//         className={LoginClasses.content}
//         // sx={{ width: "100%", maxWidth: { xs: "100%", md: "750px" } }}
//       >
//         <Card
//           className={LoginClasses.card}
//           // sx={{ overflow: "hidden", borderRadius: 2, boxShadow: 3 }}
//         >
//           <Grid container>
//             {/* Image section - hidden on mobile */}
//             <SideImage src="static/images/placeholder-mcs-orange.svg" />

//             {/* Form section */}
//             <Grid size={{ xs: 12, md: 6 }}>
//               <CardContent
//                 className="card-content"
//                 // sx={{ p: { xs: 3, md: 4 } }}
//               >
//                 <Box
//                   className="card-box"
//                   // sx={{ display: "flex", flexDirection: "column", gap: 0 }}
//                 >
//                   {avatarIcon}
//                   {children}
//                   {/* <Box
//                     sx={{
//                       position: "relative",
//                       display: "flex",
//                       alignItems: "center",
//                       my: 2,
//                     }}
//                   >
//                     <Divider sx={{ flex: 1 }} />
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         px: 2,
//                         backgroundColor: theme.palette.background.paper,
//                         color: "text.secondary",
//                       }}
//                     >
//                       Or continue with
//                     </Typography>
//                     <Divider sx={{ flex: 1 }} />
//                   </Box> */}
//                   {divider}
//                   {SocialLogin}

//                   {/* <Box
//                     sx={{
//                       textAlign: "center",
//                       mt: 1,
//                       color: "text.secondary",
//                     }}
//                   >
//                     Don&apos;t have an account?{" "}
//                     <Link
//                       href="#"
//                       sx={{
//                         color: "primary.main",
//                         textDecoration: "underline",
//                         textUnderlineOffset: "2px",
//                         "&:hover": {
//                           textDecoration: "underline",
//                         },
//                       }}
//                     >
//                       Sign up
//                     </Link>
//                   </Box> */}
//                   {signUp}
//                 </Box>
//               </CardContent>
//             </Grid>
//           </Grid>
//         </Card>

//         {/* <Box
//           sx={{
//             mt: 2,
//             textAlign: "center",
//             color: "text.secondary",
//             fontSize: "0.75rem",
//             a: {
//               color: "primary.main",
//               textDecoration: "underline",
//               textUnderlineOffset: "2px",
//               "&:hover": {
//                 textDecoration: "underline",
//               },
//             },
//           }}
//         >
//           By clicking continue, you agree to our{" "}
//           <Link href="#">Terms of Service</Link> and{" "}
//           <Link href="#">Privacy Policy</Link>.
//         </Box> */}
//         {footer}
//       </Box>
//     </Root>
//   );
// };

// export const LoginClasses = {
//   root: `${PREFIX}-root`,
//   content: `${PREFIX}-content`,
//   button: `${PREFIX}-button`,
//   icon: `${PREFIX}-icon`,
//   card: `${PREFIX}-card`,
//   avatar: `${PREFIX}-avatar`,
// };

// export const LoginStyles = (theme: Theme) => ({
//   [` .${LoginClasses.root}`]: {
//     minHeight: "100vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: theme.spacing(2),
//     backgroundColor:
//       theme.palette.mode === "dark"
//         ? theme.palette.grey[900]
//         : theme.palette.grey[100],
//   },
//   [`& .${LoginClasses.content}`]: {
//     width: "100%",
//     maxWidth: "100%",
//     [theme.breakpoints.up("md")]: {
//       maxWidth: "750px",
//     },
//     // maxWidth: { xs: "100%", md: "750px" },
//     [`& .${LoginClasses.card}`]: {
//       overflow: "hidden",
//       borderRadius: theme.spacing(2),
//       boxShadow: theme.shadows[3],
//       ["& .card-content"]: {
//         padding: theme.spacing(3, 4),
//         ["& .card-box"]: {
//           display: "flex",
//           flexDirection: "column",
//           gap: 0,
//         },
//       },
//     },
//   },
//   [`& .${LoginClasses.avatar}`]: {
//     margin: theme.spacing(0, 0, 1.5, 0),
//     display: "flex",
//     justifyContent: "center",
//     ["& .MuiAvatar-root"]: { backgroundColor: "#e72d32" },
//     "& svg": {
//       fill: "#fff",
//     },
//   },
//   // [`& .MuiBox-root`]: {
//   //   gap: theme.spacing(0),
//   // },
//   // [`& .${LoginClasses.content}`]: {
//   //   minWidth: 300,
//   //   padding: `${theme.spacing(0)}`,
//   // },
//   // [`& .${LoginClasses.button}`]: {
//   //   // marginTop: theme.spacing(2),
//   //   mt: 1,
//   //   py: 1.5,
//   //   fontWeight: 600,
//   // },
//   // [`& .${LoginClasses.icon}`]: {
//   //   margin: theme.spacing(0.3),
//   // },
// });

// const Root = styled("div", {
//   name: PREFIX,
//   slot: "Root",
//   overridesResolver: (_props, styles) => styles.root,
// })<LoginProps>(({ theme }) => LoginStyles(theme));

// Root styled component
