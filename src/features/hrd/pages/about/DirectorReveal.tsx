"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { Typography } from "@mui/material";
import { HRD_DIRECTOR_PHOTO } from "../../data/aboutContent";
import type { PersonProfile } from "../../types/hrdAbout.types";
import * as S from "./DirectorReveal.styles";

export function DirectorReveal({ person }: { person: PersonProfile | null }) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const expanded = pinned || hovered;
  const id = useId();
  return <S.Root data-expanded={expanded} onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }} onPointerLeave={() => setHovered(false)}>
    <S.Seal type="button" aria-expanded={expanded} aria-controls={id} aria-label="បង្ហាញព័ត៌មានប្រធាននាយកដ្ឋាន" onClick={() => setPinned(value => !value)}>
      <Image src={person?.photo ?? HRD_DIRECTOR_PHOTO} alt="" width={180} height={180} />
    </S.Seal>
    <S.Copy data-copy id={id} aria-hidden={!expanded}>
      <Typography component="h2" variant="h5">{person?.name ?? "ប្រធាននាយកដ្ឋានធនធានមនុស្ស"}</Typography>
      <Typography variant="body2">{person?.position ?? "ឈ្មោះកំពុងរៀបចំ"}</Typography>
    </S.Copy>
    <S.Visual data-visual aria-hidden="true">
      <Image src={person?.photo ?? HRD_DIRECTOR_PHOTO} alt="" fill sizes="240px" />
    </S.Visual>
  </S.Root>;
}
