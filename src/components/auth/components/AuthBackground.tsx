"use client";

import { useMemo } from "react";
import { useTheme } from "@mui/material";
import Image from "next/image";
import type { EffectProps } from "@/interfaces/auth.interface";
import ShootingStars from "../effects/shootingStars";
import TwinkleStars from "../effects/twinkleStars";
import MeteorShower from "../effects/meteors";
import RocketAnimation from "../effects/rocket";
import { Ambient, Astronaut, Effect } from "../styles/auth.styles";

export const AuthAmbient = () => <Ambient />;
export const AuthImage = ({ src, alt }: {
  src: string;
  alt: string;
}) => (<Astronaut>
  <Image preload={false} loading="lazy" src={src} alt={alt} fill style={{ objectFit: "contain" }} unoptimized />
  <RocketAnimation size="10em" position="fixed" transform="translate(-50%, -50%)" />
</Astronaut>);
export const AuthEffects = ({ shootingStarCount, twinkleStarCount }: EffectProps) => {
  const theme = useTheme();
  const sideImageConfig = useMemo(() => theme.custom?.sideImage || {}, [theme.custom?.sideImage]);
  const meteorConfig = useMemo(() => theme.custom?.meteor || {}, [theme.custom?.meteor]);
  const starColors = useMemo(() => sideImageConfig?.starColors || ["#fff"], [sideImageConfig?.starColors]);
  return (<Effect>
    <ShootingStars maxCount={shootingStarCount || 5} spawnInterval={sideImageConfig?.shootingStarSpawnInterval || 2000} curveFactor={sideImageConfig?.curveFactor || 50} trajectoryMix={sideImageConfig?.trajectoryMix} colors={sideImageConfig?.starColors} glowIntensity={sideImageConfig?.glowIntensity || 1.25} baseSpeed={sideImageConfig?.baseSpeed || 0.075} baseSize={sideImageConfig?.starSize || 0.5} enabled={true} />
    <TwinkleStars maxCount={twinkleStarCount || 10} spawnInterval={sideImageConfig?.twinkleStarSpawnInterval || 3000} minLifetime={sideImageConfig?.twinkleStarMinLifetime || 10000} maxLifetime={sideImageConfig?.twinkleStarMaxLifetime || 25000} colors={starColors} baseSize={sideImageConfig?.starSize || 0.5} enabled={true} />
    <MeteorShower enabled={meteorConfig.enabled} interval={meteorConfig.interval} configs={meteorConfig.configs} />
  </Effect>);
};
