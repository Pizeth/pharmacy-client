"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import * as S from "./HrdContactPage.styles";

const slides = [
  { src: "/static/images/hrd-office.svg", label: "នាយកដ្ឋានធនធានមនុស្ស" },
  { src: "/static/images/placeholder-mcs.svg", label: "ក្រសួងមុខងារសាធារណៈ" },
  { src: "/static/images/placeholder-mcs-orange.svg", label: "ទំនាក់ទំនង និងសេវាសាធារណៈ" },
] as const;

export function ContactCarousel() {
  const [index, setIndex] = useState(0);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex(current => (current + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);
  return <S.Carousel aria-label="រូបភាពតំណាងនាយកដ្ឋាន" aria-roledescription="carousel">
    <S.CarouselImage key={index} src={slides[index].src} alt={slides[index].label} width={1600} height={600} />
  </S.Carousel>;
}
