"use client";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, TouchEvent } from "react";
import { GlobalStyles, Typography } from "@mui/material";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { PUBLIC_DOCUMENTS } from "../../documents/data/publicDocuments";
import * as S from "./HrdCardCarousel.styles";

const cards = PUBLIC_DOCUMENTS;
const angleStep = 360 / cards.length;
// Finger drift on a stationary mobile tap can exceed the mouse-oriented 8px
// threshold. Classify deliberate horizontal travel separately from a tap.
const touchSwipeThreshold = 16;
const touchTapSlop = 18;

/** Scoped circular gallery inspired by Ana Tudor's CodePen XJrYqGb. */
export function HrdCardCarousel() {
  const [angle, setAngle] = useState(0);
  const [flipped, setFlipped] = useState<number | null>(null);
  const scene = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; angle: number; horizontal: boolean; card: number | null } | null>(null);
  const touch = useRef<{ x: number; y: number; angle: number; horizontal: boolean; card: number | null; link: boolean } | null>(null);
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
    // Touch events remain targeted at the original 3D card throughout a swipe;
    // pointer capture after the first move can lose that target on mobile.
    if (event.pointerType === "touch") return;
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
    if (event.pointerType === "touch") return;
    if (drag.current?.horizontal) setAngle(current => Math.round(current / angleStep) * angleStep);
    else if (event.type === "pointerup" && event.pointerType !== "mouse" && drag.current?.card != null &&
      Math.hypot(event.clientX - drag.current.x, event.clientY - drag.current.y) < 8 && !(event.target as HTMLElement).closest("a")) {
      const index = drag.current.card;
      setFlipped(current => current === index ? null : index);
    }
    drag.current = null;
  };
  const cancelTouch = () => {
    const gesture = touch.current;
    touch.current = null;
    // A second finger or a browser touchcancel can interrupt a partially
    // rotated gesture. Always settle before discarding its starting state.
    if (gesture?.horizontal) setAngle(current => Math.round(current / angleStep) * angleStep);
  };
  const startTouch = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) { cancelTouch(); return; }
    const point = event.touches[0];
    const target = event.target;
    const card = target instanceof Element ? target.closest<HTMLElement>('article[data-flippable="true"]') : null;
    touch.current = {
      x: point.clientX, y: point.clientY, angle, horizontal: false,
      card: card ? Number(card.dataset.index) : null,
      link: target instanceof Element && target.closest("a") !== null,
    };
  };
  const moveTouch = (event: TouchEvent<HTMLDivElement>) => {
    const start = touch.current;
    if (!start) return;
    if (event.touches.length !== 1) { cancelTouch(); return; }
    const point = event.touches[0];
    const dx = point.clientX - start.x;
    const dy = point.clientY - start.y;
    if (!start.horizontal) {
      // Let the browser own vertical scrolling. The scene uses touch-action: pan-y.
      if (Math.abs(dx) < touchSwipeThreshold || Math.abs(dx) <= Math.abs(dy)) return;
      start.horizontal = true;
      setFlipped(null);
    }
    setAngle(start.angle + dx * 0.25);
  };
  const endTouch = (event: TouchEvent<HTMLDivElement>) => {
    // One finger of a multi-touch sequence may end while another remains.
    // Treat that as cancellation, never as a completed tap/swipe.
    if (event.touches.length > 0) { cancelTouch(); return; }
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const point = event.changedTouches[0];
    if (start.horizontal) {
      // Suppress synthetic link clicks after a drag, but not on ordinary taps.
      if (event.cancelable) event.preventDefault();
      setAngle(current => Math.round(current / angleStep) * angleStep);
    } else if (point && start.card !== null && !start.link &&
      Math.hypot(point.clientX - start.x, point.clientY - start.y) <= touchTapSlop) {
      setFlipped(current => current === start.card ? null : start.card);
    }
  };
  return <S.Root aria-label="ឯកសារជារង្វង់" aria-roledescription="carousel">
    <GlobalStyles styles={S.frameProperties} />
    <S.Heading variant="h5">ឯកសារសម្រាប់មន្រ្តីរាជការ</S.Heading>
    <S.Scene ref={scene} aria-label="រមូរឬអូសដើម្បីប្ដូរឯកសារ" onPointerDown={event => {
      if (event.pointerType === "touch" || event.button !== 0) return;
      const card = (event.target as HTMLElement).closest<HTMLElement>('article[data-flippable="true"]');
      drag.current = { x: event.clientX, y: event.clientY, angle, horizontal: false, card: card ? Number(card.dataset.index) : null };
    }} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}
      onTouchStart={startTouch} onTouchMove={moveTouch} onTouchEnd={endTouch} onTouchCancel={cancelTouch}>
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
