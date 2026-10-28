"use client";
import { useId, useState, type PointerEvent } from "react";
import { Button, Popover, Slider, Typography } from "@mui/material";
import ColorLensOutlined from "@mui/icons-material/ColorLensOutlined";
import { hexToHsv, hsvToHex, validBadgeColor, type BadgeHsv } from "./badgeColor";
import * as S from "./styles";

export function BadgeColorPicker({ value, disabled, onChange }: {
  readonly value: string; readonly disabled?: boolean; readonly onChange: (value: string) => void;
}) {
  const hex = validBadgeColor(value) ? value.toLowerCase() : "#1565c0";
  const [selection, setSelection] = useState(() => ({ hex, hsv: hexToHsv(hex) }));
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const id = useId();
  if (hex !== selection.hex) setSelection({ hex, hsv: hexToHsv(hex) });
  const hsv = hex === selection.hex ? selection.hsv : hexToHsv(hex);
  const update = (next: BadgeHsv) => {
    const nextHex = hsvToHex(next);
    setSelection({ hex: nextHex, hsv: next });
    onChange(nextHex);
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - box.left - box.width / 2;
    const y = event.clientY - box.top - box.height / 2;
    update({ ...hsv, h: (Math.atan2(y, x) * 180 / Math.PI + 450) % 360, s: Math.min(1, Math.hypot(x, y) / (box.width / 2)) });
  };
  const radians = (hsv.h - 90) * Math.PI / 180;
  return <>
    <S.ColorPicker type="button" aria-label="Pick badge color" aria-haspopup="dialog" aria-expanded={!!anchor && !disabled} aria-controls={anchor ? id : undefined}
      disabled={disabled} onClick={event => setAnchor(event.currentTarget)}>
      <ColorLensOutlined fontSize="small" />
      <S.ColorSwatch style={{ backgroundColor: hex }} />
    </S.ColorPicker>
    <Popover open={!!anchor && !disabled} anchorEl={anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}>
      <S.ColorPanel id={id} role="dialog" aria-label="Badge color picker">
        <Typography variant="subtitle2">Badge color</Typography>
        <Typography id={`${id}-help`} variant="caption">Drag to choose a color. Arrow keys adjust hue and saturation.</Typography>
        <S.ColorWheel role="slider" tabIndex={0} aria-label="Color wheel" aria-valuemin={0} aria-valuemax={359} aria-valuenow={Math.round(hsv.h) % 360}
          aria-valuetext={`Hue ${Math.round(hsv.h)} degrees, saturation ${Math.round(hsv.s * 100)} percent`} aria-describedby={`${id}-help`}
          onPointerDown={event => { if (event.button !== 0) return; event.currentTarget.setPointerCapture(event.pointerId); event.currentTarget.focus(); move(event); }}
          onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) move(event); }}
          onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
          onKeyDown={event => {
            const step = event.shiftKey ? 10 : 1;
            if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            update({ ...hsv, h: event.key === "Home" ? 0 : event.key === "End" ? 359 : (hsv.h + (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0) + 360) % 360,
              s: Math.max(0, Math.min(1, hsv.s + (event.key === "ArrowUp" ? step / 100 : event.key === "ArrowDown" ? -step / 100 : 0))) });
          }}>
          <S.ColorThumb style={{ left: `${50 + 50 * hsv.s * Math.cos(radians)}%`, top: `${50 + 50 * hsv.s * Math.sin(radians)}%`, backgroundColor: hsvToHex({ ...hsv, v: 1 }) }} />
        </S.ColorWheel>
        <Typography id={`${id}-brightness`} variant="caption">Brightness</Typography>
        <Slider aria-labelledby={`${id}-brightness`} value={Math.round(hsv.v * 100)} min={0} max={100} valueLabelDisplay="auto" onChange={(_, value) => update({ ...hsv, v: value as number / 100 })} />
        <Typography variant="body2">{hex.toUpperCase()}</Typography>
        <Button type="button" onClick={() => setAnchor(null)}>Done</Button>
      </S.ColorPanel>
    </Popover>
  </>;
}
