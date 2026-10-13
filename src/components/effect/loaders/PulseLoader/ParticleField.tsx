"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as S from "./PulseLoader.styles";
import { GLOW_RADIUS_RATIO } from "./geometry";

// Match the reference's CSS `ease` between its 10/20/60/90/100% keyframes.
function ease(value: number) {
  let low = 0, high = 1, t = value;
  for (let i = 0; i < 12; i++) {
    const x = 0.75 * t * (1 - t) + t * t * t;
    if (x < value) low = t; else high = t;
    t = (low + high) / 2;
  }
  return 0.3 * t * (1 - t) ** 2 + 3 * t * t * (1 - t) + t ** 3;
}
const EASE = Array.from({ length: 1001 }, (_, i) => ease(i / 1000));
const eased = (value: number) => EASE[Math.round(Math.max(0, Math.min(1, value)) * 1000)];

export function stormPhase(phase: number) {
  return {
    opacity: phase < 0.1 ? eased(phase / 0.1) : phase < 0.9 ? 1 : 1 - eased((phase - 0.9) / 0.1),
    radius: phase < 0.2 ? eased(phase / 0.2) : phase < 0.6 ? 1 : phase < 0.9 ? 1 + 0.2 * eased((phase - 0.6) / 0.3) : 1.2 * (1 - eased((phase - 0.9) / 0.1)),
    depth: phase < 0.2 ? 0 : phase < 0.6 ? 1.6 * eased((phase - 0.2) / 0.4) : phase < 0.9 ? 1.6 : 1.6 * (1 - eased((phase - 0.9) / 0.1)),
  };
}
const PHASES = Array.from({ length: 1000 }, (_, i) => stormPhase(i / 1000));

const STORM = Array.from({ length: 400 }, (_, i) => {
  const y = (i * 137.508 % 360) * Math.PI / 180;
  const z = (i * 73.19 % 360) * Math.PI / 180;
  return { cos: Math.cos(y), sin: Math.sin(y), tilt: Math.sin(z), delay: i * 10 };
});
const FIELD = Array.from({ length: 170 }, (_, i) => ({
  x: (i * 0.618034) % 1, y: (i * 0.414214) % 1,
  size: 1 + (i * 7 % (i < 70 ? 10 : 15)), phase: i * 2.39996,
}));

function sprite(color: string, blur: number) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 80;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = color;
    ctx.filter = `blur(${blur}px)`;
    ctx.beginPath(); ctx.arc(40, 40, 5.5, 0, Math.PI * 2); ctx.fill();
  }
  return canvas;
}

export default function ParticleField({ emblemRef, main, light }: {
  emblemRef: RefObject<HTMLDivElement | null>; main: string; light: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current, emblem = emblemRef.current;
    if (!canvas || !emblem) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Bake blur once, rather than filtering 400 moving elements every frame.
    const corona = sprite(main, 10), core = sprite(main, 0), ambient = sprite(light, 0);
    let width = 0, height = 0, cx = 0, cy = 0, radius = 0, frame = 0;
    let elapsed = 4000, previous = 0;
    const resize = () => {
      const bounds = canvas.getBoundingClientRect(), logo = emblem.getBoundingClientRect();
      width = bounds.width; height = bounds.height;
      // Decorative blur needs no retina-sized full-screen backing buffer.
      canvas.width = Math.ceil(width); canvas.height = Math.ceil(height);
      cx = logo.x - bounds.x + logo.width / 2; cy = logo.y - bounds.y + logo.height / 2;
      radius = logo.width * GLOW_RADIUS_RATIO;
    };
    const draw = (now: number) => {
      elapsed += previous ? Math.min(now - previous, 100) : 0; previous = now;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < FIELD.length; i++) {
        const p = FIELD[i], size = p.size * 80 / 11;
        const x = ((p.x + elapsed / 200000) % 1) * width;
        const y = height * (0.25 + ((p.y + elapsed / 300000) % 1) * 0.5);
        ctx.globalAlpha = (0.1 + 0.4 * (0.5 + 0.5 * Math.sin(elapsed / 2000 + p.phase))) * (i < 70 ? 1 : 0.18);
        ctx.drawImage(i < 70 ? core : ambient, x - size / 2, y - size / 2, size, size);
      }
      ctx.save();
      // The original opaque center masks the storm. Keep our logo and rings visible.
      ctx.beginPath(); ctx.rect(0, 0, width, height); ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip("evenodd");
      const rotation = -elapsed / 15000 * Math.PI * 2, cos = Math.cos(rotation), sin = Math.sin(rotation);
      const size = 32 * radius / 150;
      for (const p of STORM) {
        const phase = PHASES[Math.floor(((elapsed - p.delay) % 4000 + 4000) % 4000 / 4)];
        // Keep the reference's lifetime/rotation while tightening its projection
        // around the glow circle rather than filling the viewport with a plume.
        const travel = 1 + (phase.radius - 1) * 0.35;
        const depth = phase.depth * 0.15;
        const x = radius * (p.cos * travel + p.sin * p.tilt * depth);
        const y = radius * (p.sin * travel - p.cos * p.tilt * depth);
        ctx.globalAlpha = phase.opacity * 0.35;
        ctx.drawImage(corona, cx + x * cos - y * sin - size / 2, cy + x * sin + y * cos - size / 2, size, size);
      }
      ctx.restore(); ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };
    const visibility = () => {
      cancelAnimationFrame(frame); previous = 0;
      if (!document.hidden) frame = requestAnimationFrame(draw);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas); observer.observe(emblem);
    resize(); visibility(); document.addEventListener("visibilitychange", visibility);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, [emblemRef, main, light]);
  return <S.Particle ref={canvasRef} aria-hidden="true" />;
}
