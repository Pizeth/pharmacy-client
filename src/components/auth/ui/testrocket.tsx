import React, { useEffect, useRef, CSSProperties } from "react";

interface RocketProps {
  orbitRadius?: number;
  orbitSpeed?: number;
  rocketScale?: number;
  autoRotate?: boolean;
}

export default function Rocket({
  orbitRadius = 80,
  orbitSpeed = 0.8,
  rocketScale = 0.15,
  autoRotate = true,
}: RocketProps) {
  const rocketRef = useRef<SVGGElement>(null);
  const fireRef = useRef<SVGGElement>(null);
  const yellowFireRef = useRef<SVGPathElement>(null);
  const smokeRef = useRef<SVGGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const awaitingParticles = useRef<SVGCircleElement[]>([]);
  const rotationSpeed = useRef<number>(orbitSpeed);
  const autoRotateEnabled = useRef<boolean>(autoRotate);
  const animationFrameId = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);
  const lastAngle = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const velocity = useRef<number>(0);
  const currentAngle = useRef<number>(0);

  // Center of the SVG viewBox
  const centerX = 600;
  const centerY = 600;

  useEffect(() => {
    // Initialize rocket position
    if (rocketRef.current) {
      rocketRef.current.style.transformOrigin = `${centerX}px ${centerY}px`;
      updateRocketPosition(0);
    }

    // Animation loop
    const loop = () => {
      // Create smoke particles
      const p = getSmokeParticle();
      if (p) fly(p, 1.2 - Math.abs(rotationSpeed.current) / 500);

      // Update fire scale based on speed
      const fireScaleY = Math.min(
        0.8 + Math.random() * 0.3 - Math.abs(rotationSpeed.current) / 500,
        1.5
      );
      const fireScaleX = Math.min(
        Math.max(1 + Math.abs(rotationSpeed.current) / 100, 0.4),
        1
      );
      const yellowFireScale = 0.8 + Math.random() * 0.3;

      if (fireRef.current) {
        fireRef.current.style.transform = `scaleX(${fireScaleX}) scaleY(${fireScaleY})`;
      }
      if (yellowFireRef.current) {
        yellowFireRef.current.style.transform = `scale(${yellowFireScale}) rotate(${
          -20 + yellowFireScale * 20
        }deg)`;
      }

      // Auto rotate
      if (autoRotateEnabled.current && rocketRef.current) {
        rotationSpeed.current += (orbitSpeed - rotationSpeed.current) / 30;
        currentAngle.current -= rotationSpeed.current;
        updateRocketPosition(currentAngle.current);
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [orbitRadius, orbitSpeed, rocketScale]);

  const updateRocketPosition = (rotationDegrees: number) => {
    if (!rocketRef.current) return;

    const angle = ((rotationDegrees - 90) * Math.PI) / 180;
    const x = centerX + Math.cos(angle) * orbitRadius;
    const y = centerY + Math.sin(angle) * orbitRadius;

    rocketRef.current.style.transform = `translate(${x - centerX}px, ${
      y - centerY
    }px) scale(${rocketScale}) rotate(${rotationDegrees}deg)`;
  };

  const getMousePosition = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return { x: 0, y: 0, centerX: 0, centerY: 0 };

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0]?.clientY : e.clientY;

    return {
      x: clientX,
      y: clientY,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = true;
    autoRotateEnabled.current = false;
    const { x, y, centerX: cx, centerY: cy } = getMousePosition(e);
    lastAngle.current = Math.atan2(y - cy, x - cx);
    lastTime.current = Date.now();
    velocity.current = 0;
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || !rocketRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    const { x, y, centerX: cx, centerY: cy } = getMousePosition(e);
    const angle = Math.atan2(y - cy, x - cx);
    const deltaAngle = angle - lastAngle.current;
    const now = Date.now();
    const deltaTime = Math.max(now - lastTime.current, 1);

    // Calculate rotation speed
    velocity.current = ((deltaAngle * 180) / Math.PI / (deltaTime / 16.67)) * 2;
    rotationSpeed.current = velocity.current;

    // Update rotation
    currentAngle.current += (deltaAngle * 180) / Math.PI;
    updateRocketPosition(currentAngle.current);

    lastAngle.current = angle;
    lastTime.current = now;
  };

  const handleEnd = (e?: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    isDragging.current = false;

    // Simulate throw effect with gradual slowdown
    const initialSpeed = velocity.current;
    const startTime = Date.now();
    const throwDuration = 2000;

    const decelerate = () => {
      if (!rocketRef.current) return;

      const elapsed = Date.now() - startTime;
      if (elapsed < throwDuration && !isDragging.current) {
        const progress = elapsed / throwDuration;
        rotationSpeed.current = initialSpeed * (1 - progress * 0.9);
        currentAngle.current -= rotationSpeed.current;
        updateRocketPosition(currentAngle.current);

        requestAnimationFrame(decelerate);
      } else {
        autoRotateEnabled.current = true;
      }
    };
    decelerate();
  };

  const createSmokeParticle = (): SVGCircleElement | null => {
    if (!smokeRef.current) return null;

    const xmlns = "http://www.w3.org/2000/svg";
    const particle = document.createElementNS(
      xmlns,
      "circle"
    ) as SVGCircleElement;
    particle.setAttribute("class", "smoke_particle");
    particle.setAttribute("r", "10");
    particle.setAttribute("fill", "#EA4E39");
    particle.setAttribute("opacity", "1");
    smokeRef.current.appendChild(particle);
    resetParticle(particle);
    return particle;
  };

  const getSmokeParticle = (): SVGCircleElement | null => {
    return awaitingParticles.current.length
      ? awaitingParticles.current.pop() || null
      : createSmokeParticle();
  };

  const fly = (p: SVGCircleElement, speed: number) => {
    const startY = 730;
    const endY =
      750 - Math.abs(rotationSpeed.current) / 3 + Math.random() * 100;
    const endX = 955 - 40 + Math.random() * 80;
    const startTime = Date.now();
    const duration = speed * 1000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const y = startY + (endY - startY) * progress;
      const opacity = 1 - progress;
      const scale =
        2.5 + (4 - Math.abs(rotationSpeed.current) / 100 - 2.5) * progress;

      p.setAttribute("cy", y.toString());
      p.setAttribute("cx", endX.toString());
      p.setAttribute("opacity", opacity.toString());
      p.setAttribute("transform", `scale(${scale})`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resetParticle(p);
      }
    };
    animate();
  };

  const resetParticle = (p: SVGCircleElement) => {
    p.setAttribute("cx", "955");
    p.setAttribute("cy", "730");
    p.setAttribute("opacity", "1");
    p.setAttribute("fill", "#EA4E39");
    p.setAttribute("transform", "scale(2.5)");
    awaitingParticles.current.push(p);
  };

  const containerStyle: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: `${(orbitRadius + 100) * 2}px`,
    height: `${(orbitRadius + 100) * 2}px`,
    pointerEvents: "auto",
    cursor: isDragging.current ? "grabbing" : "grab",
    touchAction: "none",
    zIndex: 10,
  };

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <svg
        viewBox="0 0 1200 1200"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <g ref={rocketRef} id="rocket">
          <g ref={smokeRef} id="smoke"></g>
          <g id="fire" ref={fireRef} style={{ transformOrigin: "950px 680px" }}>
            <path
              id="red_fire"
              fill="#EB6736"
              d="M921,714.8c0-18.3,14.8-33.1,33.1-33.1c18.3,0,33.1,14.8,33.1,33.1c0,18.3-33.1,59.2-33.1,59.2S921,733.1,921,714.8"
            />
            <path
              ref={yellowFireRef}
              id="yellow_fire"
              fill="#ECA643"
              style={{ transformOrigin: "950px 680px" }}
              d="M954.8,690.9c-9.4,0-16.9,7.6-16.9,17c0,9.4,17,44.5,17,44.5s16.9-35.2,16.9-44.6C971.7,698.4,964.1,690.9,954.8,690.9"
            />
          </g>

          <g id="cosmonaut">
            <rect
              x="929.7"
              y="608.4"
              fill="#059F9F"
              width="51.9"
              height="24.5"
            />
            <circle fill="#F2F2F2" cx="936.6" cy="613.6" r="2.6" />
            <circle fill="#FF662C" cx="943.1" cy="613.6" r="2.6" />
            <circle fill="#F5B547" cx="949.6" cy="613.6" r="2.6" />
            <path
              fill="#059F9F"
              d="M985.5,598c0,1.9-1.6,3.5-3.5,3.5l-50.2,0c-1.9,0-3.5-1.6-3.5-3.5l0-46.8c0-1.9,1.6-3.5,3.5-3.5l50.2,0c1.9,0,3.5,1.6,3.5,3.5L985.5,598z"
            />
            <path
              fill="#D8D1C3"
              d="M981.4,579.2c0,2.1-1.7,3.7-3.7,3.7l-41.5,0c-2,0-3.7-1.7-3.7-3.7l0-19.8c0-2,1.7-3.7,3.7-3.7l41.5,0c2,0,3.7,1.7,3.7,3.7L981.4,579.2z"
            />
            <path
              fill="#79552D"
              d="M977.7,555.7l-41.5,0c-2,0-3.7,1.7-3.7,3.7l0,8.7c3.8,2.7,8.4,4.3,13.4,4.3c10.4,0,19.1-6.8,22-16.2c0.9,6.8,6.5,12.1,13.4,12.5l0-9.3C981.4,557.4,979.8,555.7,977.7,555.7"
            />
            <path
              fill="#79552D"
              d="M967.3,558.8c0,3.8-2,7.2-5.1,9c5.3-0.6,9.4-5,9.4-10.4c0-0.5-0.1-1-0.1-1.6l-4.6,0C967.1,556.7,967.3,557.7,967.3,558.8"
            />
            <path
              fill="#79552D"
              d="M970.2,579.4c-0.6,0-1-0.4-1-1c0-1.5-1.2-2.7-2.7-2.7c-1.5,0-2.7,1.2-2.7,2.7c0,0.6-0.4,1-1,1c-0.6,0-1-0.4-1-1c0-2.6,2.1-4.7,4.7-4.7c2.6,0,4.7,2.1,4.7,4.7C971.2,578.9,970.7,579.4,970.2,579.4z"
            />
            <path
              fill="#79552D"
              d="M951.2,579.4c-0.6,0-1-0.4-1-1c0-1.5-1.2-2.7-2.7-2.7c-1.5,0-2.7,1.2-2.7,2.7c0,0.6-0.4,1-1,1c-0.6,0-1-0.4-1-1c0-2.6,2.1-4.7,4.7-4.7c2.6,0,4.7,2.1,4.7,4.7C952.2,578.9,951.8,579.4,951.2,579.4z"
            />
            <circle fill="#F5B547" cx="978.5" cy="593.1" r="2" />
            <circle fill="#FF662C" cx="972" cy="593.1" r="2" />
            <path
              fill="#5B5757"
              d="M985.5,564.4l0,10.1c8.4,1.9,14.7,9.4,14.7,18.4c0,10.4-8.4,18.8-18.8,18.8c-10.4,0-18.8-8.4-18.8-18.8c0-2.8-2.2-5-5-5c-2.8,0-5,2.2-5,5c0,15.9,12.9,28.8,28.8,28.8c15.9,0,28.8-12.9,28.8-28.8C1010.2,578.4,999.5,566.4,985.5,564.4z"
            />
            <path
              opacity="0.3"
              fill="#F2F2F2"
              d="M945,555.8l-12.5,19.4l0,4.1c0,2.1,1.7,3.7,3.7,3.7l7,0l17.5-27.2L945,555.8z"
            />
          </g>

          <g id="cabin">
            <path
              fill="#0E9E9F"
              d="M855.9,722c-16-43-5.9-87.3,21.3-120.3l24.8,66.5c-17.5,6.5-26.2,26.4-19.7,43.9L855.9,722z"
            />
            <path
              fill="#0E9E9F"
              d="M1054.6,721.9c16-43,5.8-87.3-21.5-120.3l-24.7,66.6c17.5,6.5,26.3,26.4,19.8,43.9L1054.6,721.9z"
            />
            <rect
              x="896.4"
              y="552"
              transform="matrix(0.7067 -0.7075 0.7075 0.7067 -122.3782 822.5777)"
              opacity="0.2"
              fill="#FFFFFF"
              width="69"
              height="13.8"
            />
            <rect
              x="899.7"
              y="567.4"
              transform="matrix(0.7067 -0.7075 0.7075 0.7067 -126.8512 833.3998)"
              opacity="0.2"
              fill="#FFFFFF"
              width="84"
              height="4.5"
            />
            <path
              fill="#0A7370"
              d="M955.5,430.6c-52.1,30.2-87.1,86.5-87,150.9c0,32.5,8.9,62.9,24.4,88.9l125.5-0.1c15.5-26,24.3-56.4,24.3-88.9C1042.6,517,1007.5,460.7,955.5,430.6z M955.6,625.4c-26.2,0-47.5-21.2-47.5-47.5c0-26.2,21.2-47.5,47.5-47.5c26.2,0,47.5,21.2,47.5,47.5C1003.1,604.1,981.8,625.4,955.6,625.4z"
            />
            <path
              fill="#0E9E9F"
              d="M959.1,426c-2.2,1.3-4.3,2.6-6.4,3.9l0.1,96.3c2.1-0.3,4.3-0.4,6.4-0.4c26.2,0,47.5,21.2,47.5,47.5c0,8.9-2.5,17.3-6.7,24.4l45.1,0c0.8-6.8,1.2-13.8,1.2-20.8C1046.3,512.3,1011.2,456.1,959.1,426z"
            />
            <path
              fill="#2B2A2A"
              d="M955.5,520.8c-32.5,0-58.9,26.4-58.8,58.9c0,32.5,26.4,58.9,58.9,58.8c32.5,0,58.9-26.4,58.8-58.9C1014.4,547.2,988,520.8,955.5,520.8z M955.6,620.5c-22.5,0-40.8-18.2-40.8-40.7c0-22.5,18.2-40.8,40.7-40.8c22.5,0,40.8,18.2,40.8,40.7C996.3,602.2,978.1,620.5,955.6,620.5z"
            />
            <g>
              <path
                fill="#FFFFFF"
                d="M905.3,591.7c-0.4,0-0.8-0.2-1-0.5l-17.2-21.3c-0.5-0.6-0.4-1.4,0.2-1.8c0.6-0.5,1.4-0.4,1.8,0.2l17.2,21.3c0.5,0.6,0.4,1.4-0.2,1.8C905.9,591.6,905.6,591.7,905.3,591.7"
              />
              <path
                fill="#FFFFFF"
                d="M887.5,591.7c-0.3,0-0.6-0.1-0.9-0.3c-0.5-0.5-0.6-1.3-0.1-1.8l18.4-21.3c0.5-0.5,1.3-0.6,1.8-0.1c0.5,0.5,0.6,1.3,0.1,1.8l-18.4,21.3C888.2,591.5,887.8,591.7,887.5,591.7"
              />
            </g>
            <circle fill="#2B2A2A" cx="959.9" cy="442.8" r="4.5" />
            <circle fill="#2B2A2A" cx="959.9" cy="475.5" r="4.5" />
            <circle fill="#2B2A2A" cx="959.9" cy="508.1" r="4.5" />
            <circle fill="#2B2A2A" cx="1039" cy="590.9" r="3.7" />
            <rect
              x="1009.4"
              y="558.8"
              fill="#2B2A2A"
              width="12.7"
              height="43"
            />
            <rect
              x="934.3"
              y="670.4"
              fill="#2B2A2A"
              width="42.6"
              height="4.4"
            />
            <circle fill="#2B2A2A" cx="1044.4" cy="704.2" r="4.5" />
            <circle fill="#2B2A2A" cx="867" cy="709" r="4.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}
