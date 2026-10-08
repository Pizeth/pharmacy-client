"use client";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Typography } from "@mui/material";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { PUBLIC_DOCUMENTS } from "../../documents/data/publicDocuments";
import * as S from "./HrdCardCarousel.styles";

const cards = PUBLIC_DOCUMENTS.slice(0, 6);

/** Scoped circular gallery inspired by Ana Tudor's CodePen XJrYqGb. */
export function HrdCardCarousel() {
  const [angle, setAngle] = useState(0);
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (typeof window.matchMedia !== "function" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let previous = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const delta = window.scrollY - previous;
        previous = window.scrollY;
        const bounds = root.current?.getBoundingClientRect();
        if (bounds && bounds.top < window.innerHeight && bounds.bottom > 160) setAngle(current => current - delta * 0.12);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);
  const selected = ((Math.round(-angle / 60) % cards.length) + cards.length) % cards.length;
  const step = (direction: number) => setAngle(current => (Math.round(current / 60) - direction) * 60);
  return <S.Root ref={root} aria-label="ឯកសារជារង្វង់" aria-roledescription="carousel">
    <S.Heading variant="h5">ឯកសារសម្រាប់មន្រ្តីរាជការ</S.Heading>
    <S.Scene>
      {/* Runtime rotation geometry; all permanent presentation belongs to theme slots. */}
      <S.Assembly style={{ "--Hrd-gallery-angle": `${angle}deg` } as CSSProperties}>
        {cards.map((document, index) => <S.Card key={document.id} data-active={selected === index} aria-hidden={selected !== index}>
          <S.Flip>
            <S.Face><FileText size={64} strokeWidth={1} aria-hidden="true" />
              <Typography variant="caption">{document.category}</Typography>
              <Typography variant="subtitle1" fontWeight={700}>{document.title}</Typography>
            </S.Face>
            <S.Face data-side="back">
              <Typography variant="body2">{document.description}</Typography>
              <Typography variant="caption">{document.fileTypes.join(" / ")} • {document.fileSize}</Typography>
              <S.DocumentLink href="/hrd/documents" tabIndex={selected === index ? 0 : -1}>បើកបណ្ដុំឯកសារ</S.DocumentLink>
            </S.Face>
          </S.Flip>
        </S.Card>)}
      </S.Assembly>
    </S.Scene>
    <S.Controls>
      <S.Control aria-label="ឯកសារមុន" onClick={() => step(-1)}><ArrowLeft size={20} /></S.Control>
      <Typography variant="body2" aria-live="polite">{selected + 1} / {cards.length}</Typography>
      <S.Control aria-label="ឯកសារបន្ទាប់" onClick={() => step(1)}><ArrowRight size={20} /></S.Control>
    </S.Controls>
  </S.Root>;
}
