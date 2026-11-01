import React, { useEffect, useRef, useState } from "react";

interface RocketProps {
  orbitRadius?: number;
  orbitSpeed?: number;
  rocketScale?: number;
  autoRotate?: boolean;
}

export default function Rocket({
  orbitRadius = 250,
  orbitSpeed = 0.8,
  rocketScale = 0.4,
  autoRotate = true,
}: RocketProps) {
  const orbitRef = useRef<SVGGElement | null>(null);
  const fireRef = useRef<SVGGElement | null>(null);
  const yellowFireRef = useRef<SVGPathElement | null>(null);
  const smokeRef = useRef<SVGGElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const awaitingParticles = useRef<SVGCircleElement[]>([]);
  const rotationSpeed = useRef<number>(orbitSpeed);
  const autoRotateEnabled = useRef<boolean>(autoRotate);
  const animationFrameId = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);
  const lastAngle = useRef<number>(0);
  const currentRotation = useRef<number>(0);

  const centerX = 600;
  const centerY = 600;

  useEffect(() => {
    const loop = () => {
      // Smoke logic
      if (Math.random() > 0.2) {
        const p = getSmokeParticle();
        if (p) fly(p, 1.2 - Math.abs(rotationSpeed.current) / 10);
      }

      // Fire flicker
      const fireScaleY = 0.8 + Math.random() * 0.4;
      if (fireRef.current)
        fireRef.current.style.transform = `scaleY(${fireScaleY})`;
      if (yellowFireRef.current)
        yellowFireRef.current.style.transform = `scale(${
          0.7 + Math.random() * 0.3
        })`;

      // Rotation logic
      if (autoRotateEnabled.current && !isDragging.current) {
        rotationSpeed.current += (orbitSpeed - rotationSpeed.current) / 100;
        currentRotation.current -= rotationSpeed.current;
      }

      if (orbitRef.current) {
        orbitRef.current.setAttribute(
          "transform",
          `rotate(${currentRotation.current} ${centerX} ${centerY})`
        );
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, [orbitSpeed]);

  const getMousePosition = (
    e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent
  ) => {
    if (!svgRef.current) return { x: 0, y: 0, cX: 0, cY: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const cX = rect.left + rect.width / 2;
    const cY = rect.top + rect.height / 2;
    let clientX =
      "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    let clientY =
      "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    return { x: clientX, y: clientY, cX, cY };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    autoRotateEnabled.current = false;
    const { x, y, cX, cY } = getMousePosition(e);
    lastAngle.current = Math.atan2(y - cY, x - cX) * (180 / Math.PI);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    const { x, y, cX, cY } = getMousePosition(e);
    const angle = Math.atan2(y - cY, x - cX) * (180 / Math.PI);
    let delta = angle - lastAngle.current;

    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    currentRotation.current += delta;
    rotationSpeed.current = -delta;
    lastAngle.current = angle;
  };

  const handleEnd = () => {
    isDragging.current = false;
    autoRotateEnabled.current = true;
  };

  const createSmokeParticle = (): SVGCircleElement | null => {
    if (!smokeRef.current) return null;
    const p = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    p.setAttribute("r", "10");
    p.setAttribute("fill", "#EA4E39");
    smokeRef.current.appendChild(p);
    resetParticle(p);
    return p;
  };

  const getSmokeParticle = () =>
    awaitingParticles.current.length
      ? awaitingParticles.current.pop()!
      : createSmokeParticle();

  const fly = (p: SVGCircleElement, speed: number) => {
    const startY = 120;
    const startX = 0;
    const endY = 180 + Math.random() * 60;
    const endX = (Math.random() - 0.5) * 40;
    const startTime = Date.now();
    const duration = speed * 800;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const y = startY + (endY - startY) * progress;
      const x = startX + (endX - startX) * progress;
      const scale = 1 + progress * 2;

      p.setAttribute("cy", y.toString());
      p.setAttribute("cx", x.toString());
      p.setAttribute("opacity", (1 - progress).toString());
      p.setAttribute("transform", `scale(${scale})`);

      if (progress < 1) requestAnimationFrame(animate);
      else resetParticle(p);
    };
    animate();
  };

  const resetParticle = (p: SVGCircleElement) => {
    p.setAttribute("opacity", "0");
    awaitingParticles.current.push(p);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        touchAction: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#051622",
        overflow: "hidden",
      }}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1200 1200"
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {/* Simple Starfield */}
        {[...Array(20)].map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * 1200}
            cy={Math.random() * 1200}
            r={Math.random() * 2}
            fill="white"
            opacity={Math.random()}
          />
        ))}

        {/* Core Planet */}
        <circle cx="600" cy="600" r="100" fill="#167370" />
        <circle
          cx="600"
          cy="600"
          r="120"
          fill="none"
          stroke="rgba(22, 115, 112, 0.2)"
          strokeWidth="1"
        />

        {/* Orbit Group */}
        <g ref={orbitRef}>
          {/* Rocket placement - Rotated -90 to face forward (CCW) */}
          <g
            transform={`translate(${centerX}, ${
              centerY - orbitRadius
            }) rotate(-90) scale(${rocketScale})`}
          >
            <g ref={smokeRef} />

            {/* Engine Flames */}
            <g ref={fireRef} style={{ transformOrigin: "0px 100px" }}>
              <path
                fill="#EB6736"
                d="M-34,134c0-18,15-33,33-33s33,15,33,33c0,18-33,59-33,59S-34,153-34,134"
              />
              <path
                ref={yellowFireRef}
                fill="#ECA643"
                style={{ transformOrigin: "0px 100px" }}
                d="M0,110c-9,0-17,8-17,17c0,9,17,45,17,45s17-35,17-45C17,118,9,110,0,110"
              />
            </g>

            {/* Rocket Body */}
            <g transform="translate(-955, -580)">
              <path
                fill="#0A7370"
                d="M955.5,430.6c-52.1,30.2-87.1,86.5-87,150.9c0,32.5,8.9,62.9,24.4,88.9l125.5-0.1c15.5-26,24.3-56.4,24.3-88.9C1042.6,517,1007.5,460.7,955.5,430.6z"
              />
              <circle fill="#2B2A2A" cx="955.6" cy="578" r="45" />
              <circle fill="#D8D1C3" cx="955.6" cy="578" r="35" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
