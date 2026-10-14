"use client";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { HrdPageContainer } from "../../components/layout/HrdPageLayout";
import { hrdSlot } from "../../styles/styled";

export const Root = styled(HrdPageContainer, hrdSlot("ContactRoot"))(({theme})=>({
  paddingBottom:theme.spacing(9),color:(theme.vars??theme).palette.text.primary,
  "& a":{color:"inherit",textDecoration:"none",overflowWrap:"anywhere"},
  "& a:hover":{textDecoration:"underline"},
}));
export const Header = styled("header",hrdSlot("ContactHeader"))(({theme})=>({
  textAlign:"center",padding:theme.spacing(5,0,6),"& h1":{lineHeight:1.9}
}));
export const Accent = styled("span",hrdSlot("ContactAccent"))(()=>({
  display:"block",width:54,height:4,background:"#d8b36c",margin:"14px auto"
}));
export const Layout = styled("div",hrdSlot("ContactLayout"))(({theme})=>({
  display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,0.95fr)",gap:theme.spacing(4),alignItems:"start",
  [theme.breakpoints.down("md")]:{gridTemplateColumns:"minmax(0,1fr)"}
}));
export const IdCard = styled("article",hrdSlot("ContactIdCard"))(({theme})=>({
  minWidth:0,overflow:"hidden",borderRadius:theme.shape.borderRadius*2,
  border:`1px solid ${(theme.vars??theme).palette.divider}`,
  background:(theme.vars??theme).palette.background.paper,
  boxShadow:theme.shadows[7]
}));
export const CardMasthead = styled("div",hrdSlot("ContactCardMasthead"))(({theme})=>({
  display:"flex",justifyContent:"space-between",alignItems:"center",gap:theme.spacing(2),
  padding:theme.spacing(2.5,3),background:"linear-gradient(115deg,#073968,#164f80)",color:"#fff",
  borderBottom:"4px solid #d8b36c",
  [theme.breakpoints.down("sm")]:{padding:theme.spacing(2)}
}));
export const Brand = styled("div",hrdSlot("ContactBrand"))(({theme})=>({
  display:"flex",alignItems:"center",gap:theme.spacing(1.5),minWidth:0,
  "& .MuiTypography-root":{display:"block",overflowWrap:"anywhere"}
}));
export const BrandLogo = styled("span",hrdSlot("ContactBrandLogo"))(()=>({
  display:"grid",placeItems:"center",background:"#fff",borderRadius:"50%",width:72,height:72,flexShrink:0,
  "& img":{objectFit:"contain"}
}));
export const CardType=styled(Typography,hrdSlot("ContactCardType"))(()=>({
  color:"#f2d7a1",letterSpacing:".14em",fontWeight:700,
  "@media(max-width:500px)":{display:"none"}
}));
export const Person=styled("div",hrdSlot("ContactPerson"))(({theme})=>({
  display:"grid",gridTemplateColumns:"180px minmax(0,1fr)",alignItems:"center",gap:theme.spacing(3),
  padding:theme.spacing(4,3),background:theme.alpha((theme.vars??theme).palette.primary.main,.045),
  [theme.breakpoints.down("sm")]:{gridTemplateColumns:"1fr",justifyItems:"center",textAlign:"center",padding:theme.spacing(3,2)}
}));
export const Portrait=styled("div",hrdSlot("ContactPortrait"))(({theme})=>({
  width:180,aspectRatio:"4/5",position:"relative",overflow:"hidden",borderRadius:theme.shape.borderRadius,
  border:"5px solid white",boxShadow:theme.shadows[4],
  "& img":{objectFit:"cover"},
  [theme.breakpoints.down("sm")]:{width:144}
}));
export const PersonInfo=styled("div",hrdSlot("ContactPersonInfo"))(({theme})=>({
  minWidth:0,display:"grid",gap:theme.spacing(1),"& h2":{lineHeight:1.65,overflowWrap:"anywhere"}
}));
export const Role=styled("div",hrdSlot("ContactRole"))(({theme})=>({
  display:"grid",gap:theme.spacing(.5),marginTop:theme.spacing(1),
  "& span":{color:(theme.vars??theme).palette.text.secondary}
}));
export const PlaceholderNote=styled(Typography,hrdSlot("ContactPlaceholderNote"))(({theme})=>({
  display:"block",color:(theme.vars??theme).palette.text.secondary
}));
export const CardDetails=styled("div",hrdSlot("ContactCardDetails"))(({theme})=>({
  padding:theme.spacing(3),display:"grid",gap:theme.spacing(2),
  "& h3":{borderBottom:`1px solid ${(theme.vars??theme).palette.divider}`,paddingBottom:theme.spacing(1)}
}));
export const DetailLine=styled("div",hrdSlot("ContactDetailLine"))(({theme})=>({
  display:"flex",alignItems:"start",gap:theme.spacing(1.5),
  "& svg":{flexShrink:0,marginTop:3,color:(theme.vars??theme).palette.primary.main},
  "& > div":{minWidth:0,display:"grid",gap:theme.spacing(.5)}
}));
export const DetailLabel=styled(Typography,hrdSlot("ContactDetailLabel"))(({theme})=>({
  color:(theme.vars??theme).palette.text.secondary
}));
export const SocialActions=styled("div",hrdSlot("ContactSocialActions"))(({theme})=>({
  display:"flex",flexWrap:"wrap",gap:theme.spacing(1.5),padding:theme.spacing(2,3,3),
  "& .MuiButton-root":{borderRadius:30}
}));
export const Location=styled("section",hrdSlot("ContactLocation"))(({theme})=>({
  minWidth:0,display:"grid",gap:theme.spacing(2),background:(theme.vars??theme).palette.background.paper,
  border:`1px solid ${(theme.vars??theme).palette.divider}`,padding:theme.spacing(3)
}));
export const SectionHeader=styled("div",hrdSlot("ContactSectionHeader"))(({theme})=>({
  display:"flex",alignItems:"center",gap:theme.spacing(1.5),
  "& svg":{color:(theme.vars??theme).palette.primary.main}
}));
export const Map=styled("iframe",hrdSlot("ContactMap"))(({theme})=>({
  display:"block",width:"100%",height:400,border:0,borderRadius:theme.shape.borderRadius,
  background:(theme.vars??theme).palette.action.hover,
  [theme.breakpoints.down("sm")]:{height:300}
}));
export const Address=styled("div",hrdSlot("ContactAddress"))(({theme})=>({
  display:"grid",justifyItems:"start",gap:theme.spacing(2),"& p":{lineHeight:1.9}
}));
