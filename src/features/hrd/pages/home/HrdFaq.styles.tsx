"use client";
import { styled } from "@mui/material/styles";
import { hrdSlot } from "../../styles/styled";

export const Root=styled("section",hrdSlot("HomeFaq"))(({theme})=>({
  padding:theme.spacing(5,0),scrollMarginTop:180
}));
export const Header=styled("div",hrdSlot("HomeFaqHeader"))(({theme})=>({
  display:"flex",alignItems:"center",gap:theme.spacing(2),marginBottom:theme.spacing(3),
  "& > svg":{
    color:"var(--Hrd-gold, #E8B841)",
    width:theme.spacing(6),height:theme.spacing(6),padding:theme.spacing(1),
    boxSizing:"border-box",flexShrink:0,borderRadius:"50%",
    backgroundColor:(theme.vars??theme).palette.background.paper,
    boxShadow:theme.vars.palette.customShadows.neumorphic,
    ...theme.applyStyles("light", {
      backgroundColor:"#26247B",
      backgroundImage:"linear-gradient(145deg, #37358E, #201E69)",
      boxShadow:"-4px -4px 9px rgb(214 225 250 / 45%), 4px 4px 9px rgb(59 74 125 / 38%), inset 1px 1px 1px rgb(179 187 229 / 30%), inset -1px -1px 1px rgb(12 11 54 / 40%)",
    }),
  },
  "& h2":{lineHeight:1.8}
}));
export const List=styled("div",hrdSlot("HomeFaqList"))(({theme})=>({
  display:"grid",gap:theme.spacing(1.5)
}));
export const Item=styled("details",hrdSlot("HomeFaqItem"))(({theme})=>({
  background:(theme.vars??theme).palette.background.paper,
  border:`1px solid ${(theme.vars??theme).palette.divider}`,
  borderRadius:theme.shape.borderRadius,
  "&[open]":{borderColor:"var(--Hrd-gold, #E8B841)"}
}));
export const Question=styled("summary",hrdSlot("HomeFaqQuestion"))(({theme})=>({
  listStyle:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",
  gap:theme.spacing(2),padding:theme.spacing(2,3),alignItems:"center",
  "&::-webkit-details-marker":{display:"none"},
  "& svg":{flexShrink:0,transition:"transform 200ms ease"},
  "details[open] & svg":{transform:"rotate(180deg)"},
  "&:focus-visible":{outline:`2px solid ${(theme.vars??theme).palette.primary.main}`,outlineOffset:2},
  "@media(prefers-reduced-motion:reduce)": {"& svg":{transition:"none"}},
  [theme.breakpoints.down("sm")]:{padding:theme.spacing(2)}
}));
export const Answer=styled("div",hrdSlot("HomeFaqAnswer"))(({theme})=>({
  padding:theme.spacing(0,3,3),display:"grid",gap:theme.spacing(2),
  "& p":{lineHeight:2.0},
  "& a":{display:"inline-flex",alignItems:"center",gap:theme.spacing(1),width:"fit-content",
    color:(theme.vars??theme).palette.primary.main,fontWeight:700,textDecoration:"none"},
  "& a:hover":{textDecoration:"underline"},
  [theme.breakpoints.down("sm")]:{padding:theme.spacing(0,2,2)}
}));
