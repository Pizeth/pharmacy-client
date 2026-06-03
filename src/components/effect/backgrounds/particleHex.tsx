"use client";

import React, { useEffect, useRef } from "react";
import { styled, Box } from "@mui/material";

// ─── Component Configurations ────────────────────────────────────────────────

const PREFIX = "ParticleHexBackground";

// const HEX_CRAD = 7; // Reduced from 32 to match ~1rem (16px) size
// const HEX_BG = "#171717";
// const HEX_HL = "#2a2a2a";
// // const HEX_HLW = 2;
// // const HEX_GAP = 4;
// const HEX_HLW = 1; // Thinned out the stroke width slightly so the smaller grid stays crisp
// const HEX_GAP = 2; // Reduced gap from 4 to 2 to prevent visual fragmentation
// const T_SWITCH = 64;

const NEON_PALETTE = [
  "#cb3301",
  "#ff0066",
  "#ff6666",
  "#feff99",
  "#ffff67",
  "#ccff66",
  "#99fe00",
  "#fe99ff",
  "#ff99cb",
  "#fe349a",
  "#cc99fe",
  "#6599ff",
  "#00ccff",
  "#ffffff",
];

// Pre-calculate geometric properties cleanly
// const unit_x = 3 * HEX_CRAD + HEX_GAP * Math.sqrt(3);
// const unit_y = HEX_CRAD * Math.sqrt(3) * 0.5 + 0.5 * HEX_GAP;
// const off_x = 1.5 * HEX_CRAD + HEX_GAP * Math.sqrt(3) * 0.5;

const wp = NEON_PALETTE.map((c) => {
  const num = parseInt(c.replace("#", ""), 16);
  return {
    r: (num >> 16) & 0xff,
    g: (num >> 8) & 0xff,
    b: num & 0xff,
  };
});
const nwp = wp.length;
// const f = 1 / T_SWITCH;

// ─── Grid Math Objects ───────────────────────────────────────────────────────

// class GridItem {
//   x: number;
//   y: number;
//   radius: number;
//   strokeWidth: number;
//   points: { hex: { x: number; y: number }[]; hl: { x: number; y: number }[] };

//   //   constructor(x: number, y: number) {
//   //     this.x = x || 0;
//   //     this.y = y || 0;
//   //     this.points = { hex: [], hl: [] };
//   //     this.init();
//   //   }

//   constructor(x: number, y: number, radius: number, strokeWidth: number) {
//     this.x = x || 0;
//     this.y = y || 0;
//     this.radius = radius;
//     this.strokeWidth = strokeWidth;
//     this.points = { hex: [], hl: [] };
//     this.init();
//   }

//   init() {
//     const ba = Math.PI / 3;
//     // const ri = HEX_CRAD - 0.5 * HEX_HLW;
//     const ri = this.radius - 0.5 * this.strokeWidth;

//     for (let i = 0; i < 6; i++) {
//       const a = i * ba;
//       this.points.hex.push({
//         // x: this.x + HEX_CRAD * Math.cos(a),
//         // y: this.y + HEX_CRAD * Math.sin(a),
//         x: this.x + this.radius * Math.cos(a),
//         y: this.y + this.radius * Math.sin(a),
//       });

//       if (i > 2) {
//         this.points.hl.push({
//           //   x: this.x + ri * Math.cos(a),
//           //   y: this.y + ri * Math.sin(a),
//           x: this.x + ri * Math.cos(a),
//           y: this.y + ri * Math.sin(a),
//         });
//       }
//     }
//   }

//   // FIXED: Explicit structural method routing
//   draw(ct: CanvasRenderingContext2D) {
//     for (let i = 0; i < 6; i++) {
//       if (i === 0) {
//         ct.moveTo(this.points.hex[i].x, this.points.hex[i].y);
//       } else {
//         ct.lineTo(this.points.hex[i].x, this.points.hex[i].y);
//       }
//     }
//   }

//   // FIXED: Explicit structural method routing
//   highlight(ct: CanvasRenderingContext2D) {
//     for (let i = 0; i < 3; i++) {
//       if (i === 0) {
//         ct.moveTo(this.points.hl[i].x, this.points.hl[i].y);
//       } else {
//         ct.lineTo(this.points.hl[i].x, this.points.hl[i].y);
//       }
//     }
//   }
// }

class GridItem {
  x: number;
  y: number;
  radius: number;
  points: { x: number; y: number }[];

  constructor(x: number, y: number, radius: number) {
    this.x = x || 0;
    this.y = y || 0;
    this.radius = radius;
    this.points = [];
    this.init();
  }

  init() {
    const ba = Math.PI / 3;
    // Pre-calculate all 6 vertices of the hexagon to guarantee a complete cell structure
    for (let i = 0; i < 6; i++) {
      const a = i * ba;
      this.points.push({
        x: this.x + this.radius * Math.cos(a),
        y: this.y + this.radius * Math.sin(a),
      });
    }
  }

  // Draw FULL closed paths to bring back the solid honeycomb grid layout
  draw(ct: CanvasRenderingContext2D) {
    for (let i = 0; i < 6; i++) {
      if (i === 0) {
        ct.moveTo(this.points[i].x, this.points[i].y);
      } else {
        ct.lineTo(this.points[i].x, this.points[i].y);
      }
    }
    // Close the loop cleanly back to vertex 0
    ct.lineTo(this.points[0].x, this.points[0].y);
  }
}

class Grid {
  cols: number;
  rows: number;
  items: GridItem[];
  n: number;

  //   constructor(rows: umber, cols: number) {
  //     this.cols = cols |n| 16;
  //     this.rows = rows || 16;
  //     this.items = [];
  //     this.n = 0;
  //     this.init();
  //   }

  constructor(
    rows: number,
    cols: number,
    radius: number,
    // strokeWidth: number,
    unitX: number,
    unitY: number,
    offsetX: number,
  ) {
    this.cols = cols || 16;
    this.rows = rows || 16;
    this.items = [];
    this.n = 0;

    for (let row = 0; row < this.rows; row++) {
      const y = row * unitY;
      for (let col = 0; col < this.cols; col++) {
        const x = (row % 2 === 0 ? 0 : offsetX) + col * unitX;
        // this.items.push(new GridItem(x, y, radius, strokeWidth));
        this.items.push(new GridItem(x, y, radius));
      }
    }
    this.n = this.items.length;
  }

  //   init() {
  //     for (let row = 0; row < this.rows; row++) {
  //       const y = row * unit_y;
  //       for (let col = 0; col < this.cols; col++) {
  //         const x = (row % 2 === 0 ? 0 : off_x) + col * unit_x;
  //         this.items.push(new GridItem(x, y));
  //       }
  //     }
  //     this.n = this.items.length;
  //   }

  //   draw(ct: CanvasRenderingContext2D) {
  //     ct.fillStyle = HEX_BG;
  //     ct.beginPath();
  //     for (let i = 0; i < this.n; i++) {
  //       this.items[i].draw(ct);
  //     }
  //     ct.closePath();
  //     ct.fill();

  //     ct.strokeStyle = HEX_HL;
  //     ct.lineWidth = HEX_HLW;
  //     ct.beginPath();
  //     for (let i = 0; i < this.n; i++) {
  //       this.items[i].highlight(ct);
  //     }
  //     ct.closePath();
  //     ct.stroke();
  //   }

  // draw(ct: CanvasRenderingContext2D, gridStrokeColor: string) {
  //   // Note: Removed the fillStyle background draw to achieve 100% transparency
  //   ct.strokeStyle = gridStrokeColor;
  //   ct.beginPath();
  //   for (let i = 0; i < this.n; i++) {
  //     this.items[i].highlight(ct);
  //   }
  //   ct.closePath();
  //   ct.stroke();
  // }
  draw(ct: CanvasRenderingContext2D) {
    for (let i = 0; i < this.n; i++) {
      this.items[i].draw(ct);
    }
  }
}

// ─── MUI Slots Definition ────────────────────────────────────────────────────

const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
})({
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "hidden",
});

const CanvasLayer = styled("canvas", {
  name: PREFIX,
  slot: "CanvasLayer",
})({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none", // Allows seamless interaction overlays
});

const ContentWrap = styled(Box, {
  name: PREFIX,
  slot: "ContentWrap",
})({
  position: "relative",
  zIndex: 2,
  width: "100%",
  height: "100%",
});

// ─── Component Implementation ────────────────────────────────────────────────

interface ParticleHexBackgroundProps {
  children?: React.ReactNode;
  /** Radius of each hexagon in pixels. Defaults to 16 (~1rem) */
  size?: number;
  /** Width of the grid outline lines. Defaults to 1.5 */
  stroke?: number;
  /** Distance gap spacing between hexagons. Defaults to 2 */
  gap?: number;
  /** Total frames required to switch between colors. Lower is faster. Defaults to 64 */
  speed?: number;
  /** Outer boundary of the pointer illumination aura in pixels. Defaults to 140 */
  glowRadius?: number;
  /** Color of the idle background hexagon lines. Defaults to a subtle slate grey translucent overlay */
  gridStrokeColor?: string;
}

export const ParticleHexBackground = ({
  children,
  size = 5,
  stroke = 1,
  gap = 0,
  speed = 128,
  // glowRadius = 50,
  glowRadius,
  //   gridStrokeColor = "rgba(42, 42, 42, 0.5)",
  gridStrokeColor = "rgba(255, 255, 255, 0.12)", // Seamless transparent overlay
}: ParticleHexBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fxCanvasRef = useRef<HTMLCanvasElement>(null);
  // const gridCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const fxCanvas = fxCanvasRef.current;
    // const gridCanvas = gridCanvasRef.current;
    if (!container || !fxCanvas /* ||!gridCanvas*/) return;

    const fxCtx = fxCanvas.getContext("2d");
    // const gridCtx = gridCanvas.getContext("2d");
    if (!fxCtx /*|| !gridCtx*/) return;

    // Track layout parameters dynamically
    let w = container.clientWidth;
    let h = container.clientHeight;
    // let _min = 0.75 * Math.min(w, h);
    let source = { x: ~~(w / 2), y: ~~(h / 2) };
    let isHovered = false; // TRACKS HOVER STATE
    let glowAlpha = 0; // ANIMATES OPACITY (0 = invisible, 1 = fully bright)
    const fadeSpeed = 0.1; // Controls how fast it fades in/out (lower = smoother)

    // Define a local variable to hold the active radius calculation
    let currentGlowRadius = glowRadius || 0.125 * Math.min(w, h);

    let t = 0;
    let csi = 0;
    let requestId: number | null = null;
    let gridInstance: Grid | null = null;

    // Recalculate geometric matrix dependent variables based on current props
    const unit_x = 3 * size + gap * Math.sqrt(3);
    const unit_y = size * Math.sqrt(3) * 0.5 + 0.5 * gap;
    const off_x = 1.5 * size + gap * Math.sqrt(3) * 0.5;
    const f = 1 / speed;

    const fillBackground = (
      ctx: CanvasRenderingContext2D,
      bgFill: string | CanvasGradient,
    ) => {
      ctx.fillStyle = bgFill;
      ctx.beginPath();
      ctx.rect(0, 0, w, h);
      ctx.closePath();
      ctx.fill();
    };

    const buildGridInstance = () => {
      const rows = ~~(h / unit_y) + 2;
      const cols = ~~(w / unit_x) + 2;
      gridInstance = new Grid(rows, cols, size, unit_x, unit_y, off_x);
    };

    const neonLoop = () => {
      if (!gridInstance) return;
      //   const k = (t % T_SWITCH) * f;
      const k = (t % speed) * f;
      const rgb = {
        r: ~~(wp[csi].r * (1 - k) + wp[(csi + 1) % nwp].r * k),
        g: ~~(wp[csi].g * (1 - k) + wp[(csi + 1) % nwp].g * k),
        b: ~~(wp[csi].b * (1 - k) + wp[(csi + 1) % nwp].b * k),
      };

      // const rgbStr = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
      //   const light = fxCtx.createRadialGradient(
      //     source.x,
      //     source.y,
      //     0,
      //     source.x,
      //     source.y,
      //     0.875 * _min,
      //   );

      // Smoothly interpolate glowAlpha towards 1 (if hovering) or 0 (if left)
      if (isHovered) {
        glowAlpha += (1 - glowAlpha) * fadeSpeed;
      } else {
        glowAlpha += (0 - glowAlpha) * fadeSpeed;
      }

      // 1. Wipe the layer frame completely transparent
      fxCtx.globalCompositeOperation = "source-over";
      fxCtx.clearRect(0, 0, w, h);

      // 2. Draw your secondary canvas element CACHE directly onto this frame
      // fxCtx.drawImage(gridCanvas, 0, 0);

      // 3. Switch global compositing operation safely AFTER rendering the base line structures
      // fxCtx.globalCompositeOperation = "source-atop";

      //   const light = fxCtx.createRadialGradient(
      //     source.x,
      //     source.y,
      //     0, // Hotspot center
      //     source.x,
      //     source.y,
      //     glowRadius, // Tight outer boundary radius
      //   );

      // 2. PASS 1: Paint the raw underlying default background mesh
      fxCtx.lineWidth = stroke;
      fxCtx.strokeStyle = gridStrokeColor;
      fxCtx.beginPath();
      gridInstance.draw(fxCtx);
      fxCtx.stroke();

      // ONLY compute and draw the glowing layer if it's visually visible (> 0.001)
      if (glowAlpha > 0.001) {
        // 3. PASS 2: Create full, solid color strokes under the pointer area
        fxCtx.lineWidth = stroke + 0.125; // Tiny weight boost to give it an emissive glow look
        fxCtx.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        fxCtx.beginPath();
        gridInstance.draw(fxCtx);
        fxCtx.stroke();

        // 4. Construct illumination radial vectors
        const light = fxCtx.createRadialGradient(
          source.x,
          source.y,
          0,
          source.x,
          source.y,
          currentGlowRadius,
        );

        const stp =
          0.5 -
          0.5 * Math.sin(7 * t * f) * Math.cos(5 * t * f) * Math.sin(3 * t * f);

        //   light.addColorStop(0, rgbStr);
        //   light.addColorStop(Math.max(0, Math.min(1, stp)), "rgba(0,0,0,.03)");

        // 2. Adjust color stops for a sharper falloff so it doesn't bleed out broadly
        // light.addColorStop(0, rgbStr);
        // light.addColorStop(
        //   Math.max(0, Math.min(1, stp * 0.8)),
        //   "rgba(0,0,0,0.4)",
        // ); // Darkens sooner
        // light.addColorStop(1, "rgba(0,0,0,1)"); // Forces absolute darkness at the edge of the glow radius

        // light.addColorStop(0, rgbStr);
        // 5. FIXED: Translucent color stops fading out to 0 alpha tracking channels
        // light.addColorStop(0, rgbStr);
        // light.addColorStop(
        //   Math.max(0, Math.min(1, stp * 0.8)),
        //   "rgba(0,0,0,0.1)",
        // );
        // light.addColorStop(1, "rgba(0,0,0,0)"); // Absolute transparency channels!

        //   fillBackground(fxCtx, "rgba(0,0,0,.02)");
        // fillBackground(fxCtx, light);

        // fxCtx.fillStyle = light;
        // fxCtx.beginPath();
        // fxCtx.rect(0, 0, w, h);
        // fxCtx.closePath();
        // fxCtx.fill();

        // Pure solid mask falloff to protect theme background integrations
        // MULTIPLY THE STOPS BY glowAlpha TO ACHIEVE THE SMOOTH FADE EFFECT
        light.addColorStop(0, `rgba(255, 255, 255, ${glowAlpha})`);
        light.addColorStop(
          Math.max(0, Math.min(1, stp * 0.75)),
          // "rgba(255, 255, 255, 0.6)",
          `rgba(255, 255, 255, ${glowAlpha * 0.6})`,
        );
        light.addColorStop(1, "rgba(255, 255, 255, 0)");

        fxCtx.globalCompositeOperation = "destination-in";
        fxCtx.fillStyle = light;
        fxCtx.beginPath();
        fxCtx.rect(0, 0, w, h);
        fxCtx.closePath();
        fxCtx.fill();

        // 5. PASS 4: Restore normal composition back on top
        fxCtx.globalCompositeOperation = "source-over";
        fxCtx.lineWidth = stroke;
        fxCtx.strokeStyle = gridStrokeColor;
        fxCtx.beginPath();
        gridInstance.draw(fxCtx);
        fxCtx.stroke();
      }

      t++;
      //   if (t % T_SWITCH === 0) {
      if (t % speed === 0) {
        csi++;
        if (csi === nwp) {
          csi = 0;
          t = 0;
        }
      }

      requestId = requestAnimationFrame(neonLoop);
    };

    // Re-architect handleResize to read structural data directly on event trigger callbacks
    const handleResize = () => {
      if (
        !container ||
        !fxCanvas
        // || !gridCanvasRef.current
      )
        return;

      // w = containerRef.current.clientWidth;
      // h = containerRef.current.clientHeight;
      // //   _min = 0.75 * Math.min(w, h);

      // fxCanvasRef.current.width = w;
      // fxCanvasRef.current.height = h;

      w = container.clientWidth;
      h = container.clientHeight;

      fxCanvas.width = w;
      fxCanvas.height = h;

      // gridCanvasRef.current.width = w;
      // gridCanvasRef.current.height = h;

      // const rows = ~~(h / unit_y) + 2;
      // const cols = ~~(w / unit_x) + 2;

      //   gridInstance = new Grid(rows, cols);
      //   gridInstance.draw(gridCtx);

      // Draw the static grid onto its own transparent canvas cache layer
      // gridCtx.clearRect(0, 0, w, h);
      // gridInstance = new Grid(rows, cols, size, stroke, unit_x, unit_y, off_x);
      // gridInstance.draw(gridCtx, gridStrokeColor);

      // Dynamic calculation update:
      // If a prop was passed, use it. Otherwise, fall back to 75% of the smallest screen edge.
      currentGlowRadius =
        glowRadius !== undefined ? glowRadius : 0.125 * Math.min(w, h);

      console.log("Resize detected. Rebuilding grid with new dimensions:", {
        width: w,
        height: h,
        glowRadius: currentGlowRadius,
      });

      buildGridInstance();

      if (!source || source.x === 0) {
        source = { x: ~~(w / 2), y: ~~(h / 2) };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      isHovered = true; // Set to true as soon as the mouse moves inside
      const rect = container.getBoundingClientRect();
      source = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      isHovered = false; // Triggers the fade-out process
    };

    // Initial setup
    handleResize();
    neonLoop();

    // ───────────────────────────────────────────────────────────────────────────
    // THE NEW LAYOUT MONITOR COUPLING ENGINE
    // ───────────────────────────────────────────────────────────────────────────
    // Instantiating a native ResizeObserver detects layout box model mutations
    // even if the user viewport doesn't shift a single pixel!
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    // Begin active observation on the outer bounding box component node element
    resizeObserver.observe(container);

    // Event binding
    // window.addEventListener("resize", handleResize);
    // Bind mouse interactive events
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave); // BIND LEAVE EVENT

    // Dynamic clean garbage-collection teardown loop
    return () => {
      // Teardown observers and unbind element hooks cleanly
      resizeObserver.disconnect();
      // window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
    };
    // Re-initialize the setup cleanly if configuration variables shift
  }, [size, stroke, gap, speed, glowRadius, gridStrokeColor]);

  // return (
  //   <Root ref={containerRef}>
  //     {/* Background neon light canvas shader layer */}
  //     <CanvasLayer ref={fxCanvasRef} style={{ zIndex: 0 }} />
  //     {/* Hex grid mask container overlay layer */}
  //     <CanvasLayer
  //       ref={gridCanvasRef}
  //       style={{ zIndex: 1, mixBlendMode: "multiply" }}
  //     />
  //     {/* destination-in mode ensures our glowing overlay only paints onto the visible hexagon path mask lines */}
  //     {/* <CanvasLayer ref={gridCanvasRef} style={{ zIndex: 1 }} /> */}

  //     {/* Translucent overlay wrapper context slot */}
  //     <ContentWrap>{children}</ContentWrap>
  //   </Root>
  // );

  return (
    <Root ref={containerRef}>
      <CanvasLayer ref={fxCanvasRef} />
      <ContentWrap>{children}</ContentWrap>
    </Root>
  );
};

export default ParticleHexBackground;
