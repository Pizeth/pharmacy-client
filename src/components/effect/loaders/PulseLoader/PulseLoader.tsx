"use client";
import { GlobalStyles, Portal, useMediaQuery } from "@mui/material";
import { useColorScheme, useTheme } from "@mui/material/styles";
import { useEffect, useId, useMemo, useState } from "react";
import { NextParticlesProvider } from "@tsparticles/nextjs";
import type { ISourceOptions } from "@tsparticles/engine";
import { initParticles } from "@/theme/effects/initParticles";
import * as S from "./PulseLoader.styles";

const STORM_PARTICLES = Array.from({ length: 400 }, (_, index) => <S.StormParticle key={index} />);

const LOADING_MESSAGES = [
  "Initializing System",
  "Syncing Neural Interface",
  "Loading Assets",
  "Calibrating Interface",
  "Fetching Data Streams",
  "Optimizing Core",
  "Establishing Connection",
];

export default function PulseLoader() {
  const theme = useTheme();
  const { mode, systemMode } = useColorScheme();
  const scheme = mode === "system" ? systemMode : mode;
  const palette = scheme ? theme.colorSchemes?.[scheme]?.palette ?? theme.palette : theme.palette;
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const particleId = useId().replace(/:/g, "");
  const particleOptions = useMemo(() => {
    const options = (color: string, count: number, size: number): ISourceOptions => ({
      fullScreen: { enable: false }, fpsLimit: 30, detectRetina: true,
      pauseOnBlur: true, pauseOnOutsideViewport: true,
      particles: {
        number: { value: count }, paint: { fill: { color: { value: color }, enable: true } },
        shape: { type: "circle" }, links: { enable: false },
        opacity: { value: { min: 0.1, max: 0.5 }, animation: { enable: true, speed: 0.5, sync: false } },
        size: { value: { min: 1, max: size } },
        move: { enable: true, speed: 0.5, outModes: { default: "bounce" } },
      },
      interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } },
    });
    return { core: options(palette.primary.main, 70, 10), ambient: options(palette.primary.light, 100, 15) };
  }, [palette.primary.main, palette.primary.light]);
  const [messageIndex, setMessageIndex] = useState<number | null>(null);
  useEffect(() => {
    setMessageIndex(Math.floor(Math.random() * LOADING_MESSAGES.length));
    const timer = window.setInterval(() => {
      setMessageIndex(current => ((current ?? 0) + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <Portal>
      <GlobalStyles styles={'@property --PulseLoader-frame-angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }'} />
      <S.Root role="status" aria-label="Loading…" aria-live="polite" aria-busy="true">
        <S.Background aria-hidden="true">
          {!reducedMotion && <NextParticlesProvider init={initParticles}>
            <S.Particle id={`pulse-ambient-${particleId}`} data-layer="ambient" options={particleOptions.ambient} />
            <S.Particle id={`pulse-core-${particleId}`} data-layer="core" options={particleOptions.core} />
          </NextParticlesProvider>}
        </S.Background>
        <S.Frame aria-hidden="true" />
        <S.Emblem aria-hidden="true">
          <S.Storm><S.StormCore>{STORM_PARTICLES}</S.StormCore></S.Storm>
          <S.Ring data-ring="outer" />
          <S.Ring data-ring="middle" />
          <S.Ring data-ring="inner">
            <svg viewBox="0 0 140 140" aria-hidden="true">
              <defs>
                <mask id={`pulse-ring-${particleId}`} maskUnits="userSpaceOnUse" x="0" y="0" width="140" height="140">
                  <rect width="140" height="140" fill="white" />
                  <rect data-gap="horizontal" x="-7" y="50" width="154" height="40" fill="black" />
                  <rect data-gap="vertical" x="50" y="-7" width="40" height="154" fill="black" />
                </mask>
              </defs>
              <circle cx="70" cy="70" r="68.5" fill="none" stroke="var(--PulseLoader-ring-color)" strokeWidth="3" mask={`url(#pulse-ring-${particleId})`} />
            </svg>
          </S.Ring>
          <S.Glow />
          <S.Pulse />
          <S.Avatar src="/static/images/logo.svg" alt="" neumorphic softGlow />
          <S.Progress>{[0, 1, 2, 3, 4, 5, 6].map(index => <S.Orbit key={index} />)}</S.Progress>
          <S.Message variant="h6">
            {messageIndex === null ? "Loading…" : LOADING_MESSAGES[messageIndex]}
          </S.Message>
        </S.Emblem>
      </S.Root>
    </Portal>
  );
}
