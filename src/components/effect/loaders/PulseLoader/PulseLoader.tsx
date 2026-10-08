"use client";
import { Portal } from "@mui/material";
import { useEffect, useState } from "react";
import * as S from "./PulseLoader.styles";

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
      <S.Root role="status" aria-label="Loading…" aria-live="polite" aria-busy="true">
        <S.Emblem aria-hidden="true">
          <S.Glow />
          <S.Pulse />
          <S.Avatar src="/static/images/logo.svg" alt="" neumorphic softGlow />
          <S.Progress>{[0, 1, 2, 3, 4, 5, 6].map(index => <S.Orbit key={index} />)}</S.Progress>
        </S.Emblem>
        <S.Message variant="body2" aria-hidden="true">
          {messageIndex === null ? "Loading…" : LOADING_MESSAGES[messageIndex]}
        </S.Message>
      </S.Root>
    </Portal>
  );
}
