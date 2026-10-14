"use client";
import { styled } from "@mui/material/styles";
import { hrdSlot } from "../../styles/styled";

export const Root=styled("section",hrdSlot("HomeFaq"))(({theme})=>({
  padding:theme.spacing(5,0),scrollMarginTop:180
}));
export const Header=styled("div",hrdSlot("HomeFaqHeader"))(({theme})=>({
  display:"flex",alignItems:"center",gap:theme.spacing(2),marginBottom:theme.spacing(3),
  "& > svg":{color:(theme.vars??theme).palette.primary.main},
  "& h2":{lineHeight:1.8}
}));
export const List=styled("div",hrdSlot("HomeFaqList"))(({theme})=>({
  display:"grid",gap:theme.spacing(1.5)
}));
export const Item=styled("details",hrdSlot("HomeFaqItem"))(({theme})=>({
  background:(theme.vars??theme).palette.background.paper,
  border:`1px solid ${(theme.vars??theme).palette.divider}`,
  borderRadius:theme.shape.borderRadius,
  "&[open]":{borderColor:(theme.vars??theme).palette.primary.main}
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
