"use client";

import Link from "next/link";
import { Typography } from "@mui/material";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { HRD_FAQ } from "../../data/hrdFaq";
import * as S from "./HrdFaq.styles";

/** Native details keep FAQ keyboard- and touch-accessible without additional state. */
export function HrdFaq() {
  return <S.Root id="hrd-faq" aria-labelledby="hrd-faq-heading">
    <S.Header>
      <HelpCircle size={30} aria-hidden="true" />
      <div>
        <Typography id="hrd-faq-heading" component="h2" variant="h4">សំណួរដែលសួរញឹកញាប់</Typography>
      </div>
    </S.Header>
    <S.List>
      {HRD_FAQ.map((item)=><S.Item key={item.id}>
        <S.Question><Typography component="span" variant="subtitle1">{item.question}</Typography><ChevronDown size={20} aria-hidden="true" /></S.Question>
        <S.Answer>
          <Typography variant="body1">{item.answer}</Typography>
          {item.href && <Link href={item.href}>{item.linkLabel}<ArrowRight size={16} aria-hidden="true" /></Link>}
        </S.Answer>
      </S.Item>)}
    </S.List>
  </S.Root>;
}
