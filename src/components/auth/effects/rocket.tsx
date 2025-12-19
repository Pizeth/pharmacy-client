import React, { useEffect, useRef, useState } from "react";

/**
 * Interface for the smoke particles managed via DOM
 */
interface SmokeParticle extends SVGCircleElement {
  // Add any custom properties if needed, otherwise extends base
}

export default function RocketAnimation() {
  //   const rocketRef = useRef(null);
  //   const fireRef = useRef(null);
  //   const yellowFireRef = useRef(null);
  //   const smokeRef = useRef(null);
  //   const starsRef = useRef(null);
  //   const svgRef = useRef(null);

  // Typed Refs
  const rocketRef = useRef<SVGGElement | null>(null);
  const fireRef = useRef<SVGGElement | null>(null);
  const yellowFireRef = useRef<SVGPathElement | null>(null);
  const smokeRef = useRef<SVGGElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  //   const awaitingParticles = useRef([]);
  const awaitingStars = useRef([]);
  const currentNStars = useRef(-1);
  //   const rotationSpeed = useRef(0.5);
  //   const autoRotate = useRef(true);
  //   const t = useRef(0);
  //   const animationFrameId = useRef(null);
  //   const isDragging = useRef(false);
  //   const lastAngle = useRef(0);
  //   const lastTime = useRef(0);
  //   const velocity = useRef(0);

  // Logic Refs
  const awaitingParticles = useRef<SVGCircleElement[]>([]);
  const rotationSpeed = useRef<number>(0.5);
  const autoRotate = useRef<boolean>(true);
  const t = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);
  const lastAngle = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const velocity = useRef<number>(0);

  // State for cursor UI
  const [cursor, setCursor] = useState<"grab" | "grabbing">("grab");

  useEffect(() => {
    // Initialize rocket position
    if (rocketRef.current) {
      rocketRef.current.style.transformOrigin = "center";
      // Positioned at an offset from center to allow "orbiting"
      rocketRef.current.style.transform =
        "translate(200px, 0) scale(1) rotate(0deg)";
    }

    // Animation loop
    const loop = () => {
      t.current++;

      // Create stars periodically
      //   if (t.current % 10 === 0) {
      //     const star = getStar();
      //     showStar(star);
      //   }

      // Create smoke particles
      const p = getSmokeParticle();
      fly(p, 1 - rotationSpeed.current / 500);

      // Update fire scale based on speed
      const fireScaleY = Math.min(
        0.8 + Math.random() * 0.3 - rotationSpeed.current / 500,
        1.5
      );
      const fireScaleX = Math.min(
        Math.max(1 + rotationSpeed.current / 100, 0.4),
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

      // Auto rotate logic
      if (autoRotate.current && rocketRef.current) {
        rotationSpeed.current += (0.5 - rotationSpeed.current) / 30;
        const currentTransform = rocketRef.current.style.transform;
        const match = currentTransform.match(/rotate\(([-\d.]+)deg\)/);
        let currentRotation = match ? parseFloat(match[1]) : 0;
        currentRotation -= rotationSpeed.current;
        rocketRef.current.style.transform = currentTransform.replace(
          /rotate\([-\d.]+deg\)/,
          `rotate(${currentRotation}deg)`
        );
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    // loop();
    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  //   const getMousePosition = (e) => {
  //     const rect = svgRef.current.getBoundingClientRect();
  //     const centerX = rect.left + rect.width / 2;
  //     const centerY = rect.top + rect.height / 2;
  //     return {
  //       x: e.clientX || e.touches?.[0]?.clientX,
  //       y: e.clientY || e.touches?.[0]?.clientY,
  //       centerX,
  //       centerY,
  //     };
  //   };

  const getMousePosition = (
    e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent
  ) => {
    if (!svgRef.current) return { x: 0, y: 0, centerX: 0, centerY: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    return { x: clientX, y: clientY, centerX, centerY };
  };

  //   const handleStart = (e) => {
  //     e.preventDefault();
  //     isDragging.current = true;
  //     autoRotate.current = false;
  //     const { x, y, centerX, centerY } = getMousePosition(e);
  //     lastAngle.current = Math.atan2(y - centerY, x - centerX);
  //     lastTime.current = Date.now();
  //     velocity.current = 0;
  //   };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    autoRotate.current = false;
    setCursor("grabbing");
    const { x, y, centerX, centerY } = getMousePosition(e);
    lastAngle.current = Math.atan2(y - centerY, x - centerX);
    lastTime.current = Date.now();
    velocity.current = 0;
  };

  //   const handleMove = (e) => {
  //     if (!isDragging.current) return;
  //     e.preventDefault();

  //     const { x, y, centerX, centerY } = getMousePosition(e);
  //     const angle = Math.atan2(y - centerY, x - centerX);
  //     const deltaAngle = angle - lastAngle.current;
  //     const now = Date.now();
  //     const deltaTime = Math.max(now - lastTime.current, 1);

  //     // Calculate rotation speed
  //     velocity.current = ((deltaAngle * 180) / Math.PI / (deltaTime / 16.67)) * 2;
  //     rotationSpeed.current = velocity.current;

  //     // Update rotation
  //     const currentTransform = rocketRef.current.style.transform;
  //     const match = currentTransform.match(/rotate\(([-\d.]+)deg\)/);
  //     let currentRotation = match ? parseFloat(match[1]) : 0;
  //     currentRotation += (deltaAngle * 180) / Math.PI;
  //     rocketRef.current.style.transform = currentTransform.replace(
  //       /rotate\([-\d.]+deg\)/,
  //       `rotate(${currentRotation}deg)`
  //     );

  //     lastAngle.current = angle;
  //     lastTime.current = now;
  //   };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || !rocketRef.current) return;
    // e.preventDefault();

    const { x, y, centerX, centerY } = getMousePosition(e);
    const angle = Math.atan2(y - centerY, x - centerX);
    const deltaAngle = angle - lastAngle.current;
    const now = Date.now();
    const deltaTime = Math.max(now - lastTime.current, 1);

    // Calculate rotation speed
    velocity.current = ((deltaAngle * 180) / Math.PI / (deltaTime / 16.67)) * 2;
    rotationSpeed.current = velocity.current;

    // Update rotation
    const currentTransform = rocketRef.current.style.transform;
    const match = currentTransform.match(/rotate\(([-\d.]+)deg\)/);
    let currentRotation = match ? parseFloat(match[1]) : 0;
    currentRotation += (deltaAngle * 180) / Math.PI;

    rocketRef.current.style.transform = currentTransform.replace(
      /rotate\([-\d.]+deg\)/,
      `rotate(${currentRotation}deg)`
    );

    lastAngle.current = angle;
    lastTime.current = now;
  };

  //   const handleEnd = () => {
  //     if (!isDragging.current) return;
  //     isDragging.current = false;

  //     // Simulate throw effect with gradual slowdown
  //     const initialSpeed = velocity.current;
  //     const startTime = Date.now();
  //     const throwDuration = 2000;

  //     const decelerate = () => {
  //       const elapsed = Date.now() - startTime;
  //       if (elapsed < throwDuration && !isDragging.current) {
  //         const progress = elapsed / throwDuration;
  //         rotationSpeed.current = initialSpeed * (1 - progress * 0.9);

  //         const currentTransform = rocketRef.current.style.transform;
  //         const match = currentTransform.match(/rotate\(([-\d.]+)deg\)/);
  //         let currentRotation = match ? parseFloat(match[1]) : 0;
  //         currentRotation -= rotationSpeed.current;
  //         rocketRef.current.style.transform = currentTransform.replace(
  //           /rotate\([-\d.]+deg\)/,
  //           `rotate(${currentRotation}deg)`
  //         );

  //         requestAnimationFrame(decelerate);
  //       } else {
  //         autoRotate.current = true;
  //       }
  //     };
  //     decelerate();
  //   };

  const handleEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setCursor("grab");

    // Simulate throw effect with gradual slowdown
    const initialSpeed = velocity.current;
    const startTime = Date.now();
    const throwDuration = 2000;

    const decelerate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < throwDuration && !isDragging.current && rocketRef.current) {
        const progress = elapsed / throwDuration;
        rotationSpeed.current = initialSpeed * (1 - progress * 0.9);

        const currentTransform = rocketRef.current.style.transform;
        const match = currentTransform.match(/rotate\(([-\d.]+)deg\)/);
        let currentRotation = match ? parseFloat(match[1]) : 0;
        currentRotation -= rotationSpeed.current;
        rocketRef.current.style.transform = currentTransform.replace(
          /rotate\([-\d.]+deg\)/,
          `rotate(${currentRotation}deg)`
        );

        requestAnimationFrame(decelerate);
      } else {
        autoRotate.current = true;
      }
    };
    decelerate();
  };

  //   const createSmokeParticle = () => {
  //     const xmlns = "http://www.w3.org/2000/svg";
  //     const particle = document.createElementNS(xmlns, "circle");
  //     particle.setAttribute("class", "smoke_particle");
  //     particle.setAttribute("r", "10");
  //     particle.setAttribute("fill", "#EA4E39");
  //     particle.setAttribute("opacity", "1");
  //     smokeRef.current?.appendChild(particle);
  //     resetParticle(particle);
  //     return particle;
  //   };

  const createSmokeParticle = (): SVGCircleElement => {
    const xmlns = "http://www.w3.org/2000/svg";
    const particle = document.createElementNS(xmlns, "circle");
    // particle.setAttribute("class", "smoke_particle");
    particle.setAttribute("r", "10");
    particle.setAttribute("fill", "#EA4E39");
    particle.setAttribute("opacity", "1");
    smokeRef.current?.appendChild(particle);
    return particle;
  };

  //   const createStar = () => {
  //     const xmlns = "http://www.w3.org/2000/svg";
  //     const xlinkns = "http://www.w3.org/1999/xlink";
  //     currentNStars.current++;
  //     const star = document.createElementNS(xmlns, "use");
  //     star.setAttributeNS(xlinkns, "xlink:href", "#star");
  //     star.setAttribute("id", `star_${currentNStars.current}`);
  //     starsRef.current?.appendChild(star);
  //     resetStar(star);
  //     return star;
  //   };

  //   const getSmokeParticle = () => {
  //     return awaitingParticles.current.length
  //       ? awaitingParticles.current.pop()
  //       : createSmokeParticle();
  //   };

  const getSmokeParticle = (): SVGCircleElement => {
    const p = awaitingParticles.current.length
      ? (awaitingParticles.current.pop() as SVGCircleElement)
      : createSmokeParticle();
    resetParticle(p);
    return p;
  };

  //   const getStar = () => {
  //     return awaitingStars.current.length
  //       ? awaitingStars.current.pop()
  //       : createStar();
  //   };

  //   const fly = (p, speed) => {
  //     const startY = 730;
  //     const endY = 750 - rotationSpeed.current / 3 + Math.random() * 100;
  //     const endX = 955 - 40 + Math.random() * 80;
  //     const startTime = Date.now();
  //     const duration = speed * 1000;

  //     const animate = () => {
  //       const elapsed = Date.now() - startTime;
  //       const progress = Math.min(elapsed / duration, 1);

  //       const y = startY + (endY - startY) * progress;
  //       const opacity = 1 - progress;
  //       const scale = 2.5 + (4 - rotationSpeed.current / 100 - 2.5) * progress;

  //       p.setAttribute("cy", y);
  //       p.setAttribute("cx", endX);
  //       p.setAttribute("opacity", opacity);
  //       p.setAttribute("transform", `scale(${scale})`);

  //       if (progress < 1) {
  //         requestAnimationFrame(animate);
  //       } else {
  //         resetParticle(p);
  //       }
  //     };
  //     animate();
  //   };

  const fly = (p: SVGCircleElement, speed: number) => {
    const startY = 730;
    const endY = 750 - rotationSpeed.current / 3 + Math.random() * 100;
    const endX = 955 - 40 + Math.random() * 80;
    const startTime = Date.now();
    const duration = speed * 1000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const y = startY + (endY - startY) * progress;
      const opacity = 1 - progress;
      const scale = 2.5 + (4 - rotationSpeed.current / 100 - 2.5) * progress;

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

  //   const showStar = (s) => {
  //     const startTime = Date.now();
  //     const duration = 1000;

  //     const fadeIn = () => {
  //       const elapsed = Date.now() - startTime;
  //       const progress = Math.min(elapsed / duration, 1);

  //       s.setAttribute("opacity", progress);
  //       s.setAttribute("transform", `scale(${progress})`);

  //       if (progress < 1) {
  //         requestAnimationFrame(fadeIn);
  //       } else {
  //         setTimeout(() => hideStar(s), 0);
  //       }
  //     };
  //     fadeIn();
  //   };

  //   const hideStar = (s) => {
  //     const startTime = Date.now();
  //     const duration = 1000;

  //     const fadeOut = () => {
  //       const elapsed = Date.now() - startTime;
  //       const progress = Math.min(elapsed / duration, 1);

  //       s.setAttribute("opacity", 1 - progress);
  //       s.setAttribute("transform", `scale(${1 - progress * 0.9})`);

  //       if (progress < 1) {
  //         requestAnimationFrame(fadeOut);
  //       } else {
  //         resetStar(s);
  //       }
  //     };
  //     fadeOut();
  //   };

  //   const resetParticle = (p) => {
  //     p.setAttribute("cx", "955");
  //     p.setAttribute("cy", "730");
  //     p.setAttribute("opacity", "1");
  //     p.setAttribute("fill", "#EA4E39");
  //     p.setAttribute("transform", "scale(2.5)");
  //     awaitingParticles.current.push(p);
  //   };

  const resetParticle = (p: SVGCircleElement) => {
    p.setAttribute("cx", "955");
    p.setAttribute("cy", "730");
    p.setAttribute("opacity", "1");
    p.setAttribute("fill", "#EA4E39");
    p.setAttribute("transform", "scale(2.5)");
    awaitingParticles.current.push(p);
  };

  //   const resetStar = (s) => {
  //     const ray = 200 + Math.random() * 200;
  //     const angle = Math.random() * Math.PI * 2;
  //     const posX = 600 + Math.cos(angle) * ray;
  //     const posY = 600 + Math.sin(angle) * ray;
  //     s.setAttribute("opacity", "0");
  //     s.setAttribute("transform", `translate(${posX}, ${posY}) scale(1)`);
  //     awaitingStars.current.push(s);
  //   };

  //   return (
  //     <div
  //       style={{
  //         width: "100vw",
  //         height: "100vh",
  //         backgroundColor: "#22222a",
  //         position: "relative",
  //         overflow: "hidden",
  //         cursor: isDragging.current ? "grabbing" : "grab",
  //         touchAction: "none",
  //       }}
  //       onMouseDown={handleStart}
  //       onMouseMove={handleMove}
  //       onMouseUp={handleEnd}
  //       onMouseLeave={handleEnd}
  //       onTouchStart={handleStart}
  //       onTouchMove={handleMove}
  //       onTouchEnd={handleEnd}
  //     >
  //       <svg
  //         ref={svgRef}
  //         viewBox="0 0 1200 1200"
  //         style={{
  //           position: "absolute",
  //           margin: "auto",
  //           height: "100%",
  //           width: "100%",
  //           top: 0,
  //           bottom: 0,
  //           left: 0,
  //           right: 0,
  //         }}
  //       >
  //         <defs>
  //           <g id="star">
  //             <rect x="9" y="0" fill="#FFE498" width="2" height="20" />
  //             <rect x="0" y="9" fill="#FFE498" width="20" height="2" />
  //           </g>
  //         </defs>

  //         <g ref={starsRef} id="stars"></g>

  //         <g id="moon">
  //           <circle fill="#ECDFBB" cx="600" cy="600" r="135" />
  //           <path
  //             fill="#F1DEA3"
  //             d="M487.3,621.6c0-74.2,60.1-134.3,134.3-134.3c32.7,0,62.7,11.7,86,31.1C683,486,643.9,465,600,465c-74.6,0-135,60.4-135,135c0,43.9,21,83,53.5,107.6C499,684.3,487.3,654.3,487.3,621.6z"
  //           />
  //           <ellipse
  //             transform="matrix(0.8563 -0.5164 0.5164 0.8563 -187.6616 353.484)"
  //             fill="#F1DEA3"
  //             cx="541.5"
  //             cy="514"
  //             rx="24.7"
  //             ry="16.1"
  //           />
  //           <ellipse
  //             transform="matrix(-0.4752 -0.8799 0.8799 -0.4752 528.5117 1400.9026)"
  //             fill="#F1DEA3"
  //             cx="682"
  //             cy="542.8"
  //             rx="37.7"
  //             ry="25.1"
  //           />
  //           <ellipse
  //             transform="matrix(-0.4752 -0.8799 0.8799 -0.4752 496.7872 1306.4282)"
  //             fill="#F1DEA3"
  //             cx="638"
  //             cy="505.1"
  //             rx="11.8"
  //             ry="11.4"
  //           />
  //           <ellipse
  //             transform="matrix(0.8862 0.4632 -0.4632 0.8862 340.2807 -211.1433)"
  //             fill="#F1DEA3"
  //             cx="600"
  //             cy="587.2"
  //             rx="35.3"
  //             ry="40.3"
  //           />
  //           <path
  //             fill="#F1DEA3"
  //             d="M474.2,550.9c-5.9,15.2-9.2,31.8-9.2,49.1c0,29.6,9.5,56.9,25.7,79.2c24-11.5,38.8-39.7,34.6-70.2C521.1,579,499.8,556.1,474.2,550.9z"
  //           />
  //           <ellipse fill="#F1DEAE" cx="600" cy="701.3" rx="38" ry="23.6" />
  //           <ellipse
  //             transform="matrix(0.945 0.327 -0.327 0.945 235.2577 -199.3432)"
  //             fill="#F1DEA3"
  //             cx="710.5"
  //             cy="600"
  //             rx="11"
  //             ry="14.9"
  //           />
  //           <path
  //             fill="#C3BA95"
  //             d="M599.5,683.8c-0.8,0-1.5-0.7-1.5-1.5v-69.9c0-15-12.2-27.2-27.2-27.2c-15,0-27.2,12.2-27.2,27.2c0,0.8-0.7,1.5-1.5,1.5c-0.8,0-1.5-0.7-1.5-1.5c0-16.7,13.6-30.2,30.2-30.2c16.7,0,30.2,13.6,30.2,30.2v69.9C601,683.1,600.3,683.8,599.5,683.8z"
  //           />
  //           <path
  //             fill="#C3BA95"
  //             d="M570.5,653.3c-11.8,0-21.4-9.6-21.4-21.4c0-0.8,0.7-1.5,1.5-1.5c0.8,0,1.5,0.7,1.5,1.5c0,10.1,8.2,18.3,18.3,18.3c10.1,0,18.3-8.2,18.3-18.3c0-0.8,0.7-1.5,1.5-1.5c0.8,0,1.5,0.7,1.5,1.5C591.8,643.7,582.3,653.3,570.5,653.3z"
  //           />
  //           <path
  //             fill="#C3BA95"
  //             d="M638.2,653.3c-11.8,0-21.4-9.6-21.4-21.4c0-0.8,0.7-1.5,1.5-1.5c0.8,0,1.5,0.7,1.5,1.5c0,10.1,8.2,18.3,18.3,18.3c10.1,0,18.3-8.2,18.3-18.3c0-0.8,0.7-1.5,1.5-1.5c0.8,0,1.5,0.7,1.5,1.5C659.6,643.7,650,653.3,638.2,653.3z"
  //           />
  //           <path
  //             fill="#C3BA95"
  //             d="M601.3,731.3c-9.2,0-16.7-7.5-16.7-16.7c0-0.7,0.5-1.2,1.2-1.2c0.7,0,1.2,0.5,1.2,1.2c0,7.9,6.4,14.3,14.3,14.3c7.9,0,14.3-6.4,14.3-14.3c0-0.7,0.5-1.2,1.2-1.2c0.7,0,1.2,0.5,1.2,1.2C618,723.8,610.5,731.3,601.3,731.3z"
  //           />
  //           <path
  //             fill="#C3BA95"
  //             d="M599.4,704.5c-31.8,0-60.6-16.2-77.2-43.4c-0.7-1.1-0.3-2.5,0.8-3.2c1.1-0.7,2.5-0.3,3.2,0.8c15.7,25.8,43.1,41.2,73.3,41.2c30.4,0,58.9-16.4,74.2-42.7c0.6-1.1,2-1.5,3.1-0.8c1.1,0.6,1.5,2,0.8,3.1C661.4,687.3,631.4,704.5,599.4,704.5z"
  //           />
  //           <path
  //             fill="#C3BA95"
  //             d="M685.3,660.9c-3,0-5.9-0.8-8.5-2.3c-3.9-2.3-6.8-6-7.9-10.3c-1.2-4.4-0.6-9,1.7-12.9c0.6-1.1,2-1.5,3.1-0.8c1.1,0.6,1.5,2,0.8,3.1c-1.7,2.9-2.1,6.2-1.2,9.5c0.9,3.2,2.9,5.9,5.8,7.6c2.9,1.7,6.2,2.1,9.5,1.2c3.2-0.9,5.9-2.9,7.6-5.8c0.6-1.1,2-1.5,3.1-0.8c1.1,0.6,1.5,2,0.8,3.1c-2.3,3.9-6,6.8-10.3,7.9C688.3,660.7,686.8,660.9,685.3,660.9z"
  //           />
  //           <path
  //             fill="#C3BA95"
  //             d="M514,661.8c-1.5,0-3-0.2-4.4-0.6c-4.4-1.2-8.1-4-10.3-7.9c-0.6-1.1-0.3-2.5,0.8-3.1c1.1-0.6,2.5-0.3,3.1,0.8c1.7,2.9,4.3,4.9,7.6,5.8c3.2,0.9,6.6,0.4,9.5-1.2c2.9-1.7,4.9-4.3,5.8-7.6c0.9-3.2,0.4-6.6-1.2-9.5c-0.6-1.1-0.3-2.5,0.8-3.1c1.1-0.6,2.5-0.3,3.1,0.8c2.3,3.9,2.9,8.5,1.7,12.9c-1.2,4.4-4,8.1-7.9,10.3C519.9,661,517,661.8,514,661.8z"
  //           />
  //         </g>

  //         <g ref={rocketRef} id="rocket">
  //           <g ref={smokeRef} id="smoke"></g>
  //           <g id="fire" ref={fireRef} style={{ transformOrigin: "950px 680px" }}>
  //             <path
  //               id="red_fire"
  //               fill="#EB6736"
  //               d="M921,714.8c0-18.3,14.8-33.1,33.1-33.1c18.3,0,33.1,14.8,33.1,33.1c0,18.3-33.1,59.2-33.1,59.2S921,733.1,921,714.8"
  //             />
  //             <path
  //               ref={yellowFireRef}
  //               id="yellow_fire"
  //               fill="#ECA643"
  //               style={{ transformOrigin: "950px 680px" }}
  //               d="M954.8,690.9c-9.4,0-16.9,7.6-16.9,17c0,9.4,17,44.5,17,44.5s16.9-35.2,16.9-44.6C971.7,698.4,964.1,690.9,954.8,690.9"
  //             />
  //           </g>

  //           <g id="cosmonaut">
  //             <rect
  //               x="929.7"
  //               y="608.4"
  //               fill="#059F9F"
  //               width="51.9"
  //               height="24.5"
  //             />
  //             <circle fill="#F2F2F2" cx="936.6" cy="613.6" r="2.6" />
  //             <circle fill="#FF662C" cx="943.1" cy="613.6" r="2.6" />
  //             <circle fill="#F5B547" cx="949.6" cy="613.6" r="2.6" />
  //             <path
  //               fill="#059F9F"
  //               d="M985.5,598c0,1.9-1.6,3.5-3.5,3.5l-50.2,0c-1.9,0-3.5-1.6-3.5-3.5l0-46.8c0-1.9,1.6-3.5,3.5-3.5l50.2,0c1.9,0,3.5,1.6,3.5,3.5L985.5,598z"
  //             />
  //             <path
  //               fill="#D8D1C3"
  //               d="M981.4,579.2c0,2.1-1.7,3.7-3.7,3.7l-41.5,0c-2,0-3.7-1.7-3.7-3.7l0-19.8c0-2,1.7-3.7,3.7-3.7l41.5,0c2,0,3.7,1.7,3.7,3.7L981.4,579.2z"
  //             />
  //             <path
  //               fill="#79552D"
  //               d="M977.7,555.7l-41.5,0c-2,0-3.7,1.7-3.7,3.7l0,8.7c3.8,2.7,8.4,4.3,13.4,4.3c10.4,0,19.1-6.8,22-16.2c0.9,6.8,6.5,12.1,13.4,12.5l0-9.3C981.4,557.4,979.8,555.7,977.7,555.7"
  //             />
  //             <path
  //               fill="#79552D"
  //               d="M967.3,558.8c0,3.8-2,7.2-5.1,9c5.3-0.6,9.4-5,9.4-10.4c0-0.5-0.1-1-0.1-1.6l-4.6,0C967.1,556.7,967.3,557.7,967.3,558.8"
  //             />
  //             <path
  //               fill="#79552D"
  //               d="M970.2,579.4c-0.6,0-1-0.4-1-1c0-1.5-1.2-2.7-2.7-2.7c-1.5,0-2.7,1.2-2.7,2.7c0,0.6-0.4,1-1,1c-0.6,0-1-0.4-1-1c0-2.6,2.1-4.7,4.7-4.7c2.6,0,4.7,2.1,4.7,4.7C971.2,578.9,970.7,579.4,970.2,579.4z"
  //             />
  //             <path
  //               fill="#79552D"
  //               d="M951.2,579.4c-0.6,0-1-0.4-1-1c0-1.5-1.2-2.7-2.7-2.7c-1.5,0-2.7,1.2-2.7,2.7c0,0.6-0.4,1-1,1c-0.6,0-1-0.4-1-1c0-2.6,2.1-4.7,4.7-4.7c2.6,0,4.7,2.1,4.7,4.7C952.2,578.9,951.8,579.4,951.2,579.4z"
  //             />
  //             <circle fill="#F5B547" cx="978.5" cy="593.1" r="2" />
  //             <circle fill="#FF662C" cx="972" cy="593.1" r="2" />
  //             <path
  //               fill="#5B5757"
  //               d="M985.5,564.4l0,10.1c8.4,1.9,14.7,9.4,14.7,18.4c0,10.4-8.4,18.8-18.8,18.8c-10.4,0-18.8-8.4-18.8-18.8c0-2.8-2.2-5-5-5c-2.8,0-5,2.2-5,5c0,15.9,12.9,28.8,28.8,28.8c15.9,0,28.8-12.9,28.8-28.8C1010.2,578.4,999.5,566.4,985.5,564.4z"
  //             />
  //             <path
  //               opacity="0.3"
  //               fill="#F2F2F2"
  //               d="M945,555.8l-12.5,19.4l0,4.1c0,2.1,1.7,3.7,3.7,3.7l7,0l17.5-27.2L945,555.8z"
  //             />
  //           </g>

  //           <g id="cabin">
  //             <path
  //               fill="#0E9E9F"
  //               d="M855.9,722c-16-43-5.9-87.3,21.3-120.3l24.8,66.5c-17.5,6.5-26.2,26.4-19.7,43.9L855.9,722z"
  //             />
  //             <path
  //               fill="#0E9E9F"
  //               d="M1054.6,721.9c16-43,5.8-87.3-21.5-120.3l-24.7,66.6c17.5,6.5,26.3,26.4,19.8,43.9L1054.6,721.9z"
  //             />
  //             <rect
  //               x="896.4"
  //               y="552"
  //               transform="matrix(0.7067 -0.7075 0.7075 0.7067 -122.3782 822.5777)"
  //               opacity="0.2"
  //               fill="#FFFFFF"
  //               width="69"
  //               height="13.8"
  //             />
  //             <rect
  //               x="899.7"
  //               y="567.4"
  //               transform="matrix(0.7067 -0.7075 0.7075 0.7067 -126.8512 833.3998)"
  //               opacity="0.2"
  //               fill="#FFFFFF"
  //               width="84"
  //               height="4.5"
  //             />
  //             <path
  //               fill="#0A7370"
  //               d="M955.5,430.6c-52.1,30.2-87.1,86.5-87,150.9c0,32.5,8.9,62.9,24.4,88.9l125.5-0.1c15.5-26,24.3-56.4,24.3-88.9C1042.6,517,1007.5,460.7,955.5,430.6z M955.6,625.4c-26.2,0-47.5-21.2-47.5-47.5c0-26.2,21.2-47.5,47.5-47.5c26.2,0,47.5,21.2,47.5,47.5C1003.1,604.1,981.8,625.4,955.6,625.4z"
  //             />
  //             <path
  //               fill="#0E9E9F"
  //               d="M959.1,426c-2.2,1.3-4.3,2.6-6.4,3.9l0.1,96.3c2.1-0.3,4.3-0.4,6.4-0.4c26.2,0,47.5,21.2,47.5,47.5c0,8.9-2.5,17.3-6.7,24.4l45.1,0c0.8-6.8,1.2-13.8,1.2-20.8C1046.3,512.3,1011.2,456.1,959.1,426z"
  //             />
  //             <path
  //               fill="#2B2A2A"
  //               d="M955.5,520.8c-32.5,0-58.9,26.4-58.8,58.9c0,32.5,26.4,58.9,58.9,58.8c32.5,0,58.9-26.4,58.8-58.9C1014.4,547.2,988,520.8,955.5,520.8z M955.6,620.5c-22.5,0-40.8-18.2-40.8-40.7c0-22.5,18.2-40.8,40.7-40.8c22.5,0,40.8,18.2,40.8,40.7C996.3,602.2,978.1,620.5,955.6,620.5z"
  //             />
  //             <g>
  //               <path
  //                 fill="#FFFFFF"
  //                 d="M905.3,591.7c-0.4,0-0.8-0.2-1-0.5l-17.2-21.3c-0.5-0.6-0.4-1.4,0.2-1.8c0.6-0.5,1.4-0.4,1.8,0.2l17.2,21.3c0.5,0.6,0.4,1.4-0.2,1.8C905.9,591.6,905.6,591.7,905.3,591.7"
  //               />
  //               <path
  //                 fill="#FFFFFF"
  //                 d="M887.5,591.7c-0.3,0-0.6-0.1-0.9-0.3c-0.5-0.5-0.6-1.3-0.1-1.8l18.4-21.3c0.5-0.5,1.3-0.6,1.8-0.1c0.5,0.5,0.6,1.3,0.1,1.8l-18.4,21.3C888.2,591.5,887.8,591.7,887.5,591.7"
  //               />
  //             </g>
  //             <circle fill="#2B2A2A" cx="959.9" cy="442.8" r="4.5" />
  //             <circle fill="#2B2A2A" cx="959.9" cy="475.5" r="4.5" />
  //             <circle fill="#2B2A2A" cx="959.9" cy="508.1" r="4.5" />
  //             <circle fill="#2B2A2A" cx="1039" cy="590.9" r="3.7" />
  //             <rect
  //               x="1009.4"
  //               y="558.8"
  //               fill="#2B2A2A"
  //               width="12.7"
  //               height="43"
  //             />
  //             <rect
  //               x="934.3"
  //               y="670.4"
  //               fill="#2B2A2A"
  //               width="42.6"
  //               height="4.4"
  //             />
  //             <circle fill="#2B2A2A" cx="1044.4" cy="704.2" r="4.5" />
  //             <circle fill="#2B2A2A" cx="867" cy="709" r="4.5" />
  //           </g>
  //         </g>
  //       </svg>

  //       <div
  //         style={{
  //           position: "absolute",
  //           width: "100%",
  //           bottom: 40,
  //           fontFamily: '"Open Sans", sans-serif',
  //           color: "#167370",
  //           fontSize: "0.9em",
  //           textTransform: "uppercase",
  //           textAlign: "center",
  //           userSelect: "none",
  //         }}
  //       >
  //         Drag to throw the rocket
  //       </div>

  //       <div
  //         style={{
  //           position: "absolute",
  //           width: "100%",
  //           bottom: 20,
  //           fontFamily: '"Open Sans", sans-serif',
  //           color: "#565368",
  //           fontSize: "0.7em",
  //           textTransform: "uppercase",
  //           textAlign: "center",
  //         }}
  //       >
  //         Modern React - No dependencies needed!
  //       </div>
  //     </div>
  //   );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        // backgroundColor: "#22222a",
        // position: "relative",
        // overflow: "hidden",
        // cursor: isDragging.current ? "grabbing" : "grab",
        // width: "100vw",
        // height: "100vh",
        position: "absolute",
        // top: 0,
        // left: 0,
        overflow: "hidden",
        cursor: cursor,
        touchAction: "none",
        pointerEvents: "auto",
        zIndex: 10,
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
          position: "absolute",
          margin: "auto",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          //   width: "100%",
          //   height: "100%",
          //   display: "block",
        }}
      >
        {/* Only Rocket Content Group */}
        <g ref={rocketRef} id="rocket">
          <g ref={smokeRef} id="smoke"></g>

          {/* Engine Flames */}
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

          {/* Cosmonaut in the Window */}
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

          {/* Rocket Body / Cabin */}
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

      {/* <div
        style={{
          position: "absolute",
          width: "100%",
          bottom: 40,
          fontFamily: '"Open Sans", sans-serif',
          color: "#167370",
          fontSize: "0.9em",
          textTransform: "uppercase",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        Drag to throw the rocket
      </div>

      <div
        style={{
          position: "absolute",
          width: "100%",
          bottom: 20,
          fontFamily: '"Open Sans", sans-serif',
          color: "#565368",
          fontSize: "0.7em",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        Modern React - No dependencies needed!
      </div> */}

      {/* <div
        style={{
          position: "absolute",
          width: "100%",
          bottom: 20,
          fontFamily: "sans-serif",
          color: "rgba(255,255,255,0.4)",
          fontSize: "0.7em",
          textTransform: "uppercase",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        Drag the rocket to orbit your Earth
      </div> */}
    </div>
  );
}
