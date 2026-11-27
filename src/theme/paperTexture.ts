// Adapted from https://github.com/megh-bari/pattern-craft/blob/main/src/data/patterns.ts
export const paperTexture = (ink: string) =>
  `radial-gradient(circle at 1px 1px, rgb(${ink} / 8%) 1px, transparent 0) 0 0 / 8px 8px,
   repeating-linear-gradient(0deg, transparent 0 2px, rgb(${ink} / 2%) 2px 4px) 0 0 / 32px 32px,
   repeating-linear-gradient(90deg, transparent 0 2px, rgb(${ink} / 2%) 2px 4px) 0 0 / 32px 32px`;
