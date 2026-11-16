"use client";

import { useId } from "react";
import * as S from "./PulseLoader.styles";

// Adapted from aadium's friendly-puma-64 (MIT); see THIRD_PARTY_LICENSES.md.
export default function GradientRing() {
  const gradientId = `pulse-gradient-${useId().replace(/:/g, "")}`;
  return (
    <S.GradientRing aria-hidden="true">
      <svg viewBox="0 0 66 66">
        <defs>
          <linearGradient id={gradientId}>
            <stop offset="0%" stopColor="var(--PulseLoader-gradient-primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--PulseLoader-gradient-error)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="33" cy="33" r="20" fill="none" stroke={`url(#${gradientId})`}
          strokeWidth="0.75" strokeDasharray="100" strokeDashoffset="20" strokeLinecap="round" />
      </svg>
    </S.GradientRing>
  );
}
