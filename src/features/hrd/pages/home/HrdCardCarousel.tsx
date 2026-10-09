"use client";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { GlobalStyles, Typography } from "@mui/material";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { PUBLIC_DOCUMENTS } from "../../documents/data/publicDocuments";
import * as S from "./HrdCardCarousel.styles";

const cards = PUBLIC_DOCUMENTS;
const angleStep = 360 / cards.length;

/** Scoped circular gallery inspired by Ana Tudor's CodePen XJrYqGb. */
export function HrdCardCarousel() {
  const [angle, setAngle] = useState(0);
  const [flipped, setFlipped] = useState<number | null>(null);
  const scene = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; angle: number; horizontal: boolean; card: number | null } | null>(null);
  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    let settle: ReturnType<typeof setTimeout>;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      event.preventDefault();
      setFlipped(null);
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const pixels = delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientHeight : 1);
      setAngle(current => current - pixels * 0.12);
      clearTimeout(settle);
      settle = setTimeout(() => setAngle(current => Math.round(current / angleStep) * angleStep), 180);
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => { element.removeEventListener("wheel", onWheel); clearTimeout(settle); };
  }, []);
  const selected = ((Math.round(-angle / angleStep) % cards.length) + cards.length) % cards.length;
  const step = (direction: number) => { setFlipped(null); setAngle(current => (Math.round(current / angleStep) - direction) * angleStep); };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!start.horizontal) {
      if (Math.abs(dx) < 8 || Math.abs(dx) <= Math.abs(dy)) return;
      start.horizontal = true;
      setFlipped(null);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    setAngle(start.angle + dx * 0.25);
  };
  const end = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.horizontal) setAngle(current => Math.round(current / angleStep) * angleStep);
    else if (event.type === "pointerup" && event.pointerType !== "mouse" && drag.current?.card != null &&
      Math.hypot(event.clientX - drag.current.x, event.clientY - drag.current.y) < 8 && !(event.target as HTMLElement).closest("a")) {
      const index = drag.current.card;
      setFlipped(current => current === index ? null : index);
    }
    drag.current = null;
  };
  return <S.Root aria-label="ឯកសារជារង្វង់" aria-roledescription="carousel">
    <GlobalStyles styles={S.frameProperties} />
    <S.Heading variant="h5">ឯកសារសម្រាប់មន្រ្តីរាជការ</S.Heading>
    <S.Scene ref={scene} aria-label="រមូរឬអូសដើម្បីប្ដូរឯកសារ" onPointerDown={event => {
      if (event.button !== 0) return;
      const card = (event.target as HTMLElement).closest<HTMLElement>('article[data-flippable="true"]');
      drag.current = { x: event.clientX, y: event.clientY, angle, horizontal: false, card: card ? Number(card.dataset.index) : null };
    }} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}>
      {/* Runtime rotation geometry; all permanent presentation belongs to theme slots. */}
      <S.Assembly style={{ "--Hrd-gallery-angle": `${angle}deg` } as CSSProperties}>
        {cards.map((document, index) => {
          const distance = Math.min((index - selected + cards.length) % cards.length, (selected - index + cards.length) % cards.length);
          return <S.Card key={document.id} data-index={index} data-active={selected === index} data-facing={distance <= 2}
            data-flippable={distance <= 1} data-flipped={flipped === index && distance <= 1} aria-hidden={distance > 1}
            style={{ "--Hrd-gallery-card-angle": `${index * angleStep}deg` } as CSSProperties}>
          <S.Flip>
            <S.Face><FileText size={64} strokeWidth={1} aria-hidden="true" />
              <Typography variant="caption">{document.category}</Typography>
              <Typography variant="subtitle1" fontWeight={700}>{document.title}</Typography>
            </S.Face>
            <S.Face data-side="back">
              <Typography variant="body2">{document.description}</Typography>
              <Typography variant="caption">{document.fileTypes.join(" / ")} • {document.fileSize}</Typography>
              <S.DocumentLink href="/hrd/documents" tabIndex={distance <= 1 ? 0 : -1}>បើកបណ្ដុំឯកសារ</S.DocumentLink>
            </S.Face>
          </S.Flip>
        </S.Card>;
        })}
      </S.Assembly>
    </S.Scene>
    <S.Controls>
      <S.Control aria-label="ឯកសារមុន" onClick={() => step(-1)}><ArrowLeft size={20} /></S.Control>
      <Typography variant="body2" aria-live="polite">{selected + 1} / {cards.length}</Typography>
      <S.Control aria-label="ឯកសារបន្ទាប់" onClick={() => step(1)}><ArrowRight size={20} /></S.Control>
    </S.Controls>
  </S.Root>;
}
