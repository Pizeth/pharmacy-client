import React from "react";

const SphereShadow = () => {
  // 1. ORIGINAL "JUPITER" SHADOW (Your previous code)
  const jupiterShadow = {
    boxShadow: `
      0px 0 0.2vmin RGBA(255, 255, 255, 0.2), 
      -0.05vmin 0px 0.8vmin #c3f4ff inset, 
      1.5vmin 0.2vmin 2.5vmin #000 inset, 
      -2.4vmin -0.2vmin 3.4vmin #c3f4ff99 inset,
      25vmin 0px 4.4vmin #00000066 inset, 
      15vmin 0px 3.8vmin #000000aa inset`,
  };

  // 2. NEW "NASA EARTH" SHADOW
  // To mimic the NASA photo, we need a strong directional light (Sun) and a deep terminator.
  const nasaShadow = {
    boxShadow: `
      /* 1. Outer Atmosphere (Halo) - subtle blue glow outside the planet */
      0 0 30px -5px rgba(64, 160, 255, 0.4),
      
      /* 2. Sunlit Surface Highlight - bright white/cyan hit on the left */
      inset 10px 0 20px -5px rgba(200, 240, 255, 0.7),
      
      /* 3. Rayleigh Scattering - deeper blue atmosphere gradients */
      inset 20px 0 50px 0px rgba(0, 100, 255, 0.4),
      
      /* 4. The Terminator - Deep shadow transition */
      inset -20px 0 80px 0px rgba(0,0,0,0.8),
      
      /* 5. Deep Space Night - Pure black fill on the far right */
      inset -50px 0 60px 20px rgba(0,0,0,1)
    `,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-8 gap-12 font-sans text-white">
      <div className="max-w-2xl text-center space-y-4">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          Atmospheric Simulations
        </h1>
        <p className="text-gray-400">
          Comparing the original Jupiter shadow with the new NASA-style Earth
          atmosphere.
        </p>
      </div>

      <div className="flex flex-wrap gap-16 justify-center items-center">
        {/* EXAMPLE 1: JUPITER (Original) */}
        <div className="flex flex-col items-center gap-6">
          <span className="text-orange-300 font-mono text-xs tracking-[0.2em] uppercase">
            Jupiter Style
          </span>

          <div className="relative w-64 h-64">
            {/* Planet Texture */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full rounded-full bg-orange-900 block"
            >
              <defs>
                <linearGradient id="jupiterGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="50" fill="url(#jupiterGrad)" />
              {/* Bands */}
              <path
                d="M0,30 Q50,40 100,30"
                stroke="#92400e"
                strokeWidth="8"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M0,60 Q50,50 100,60"
                stroke="#92400e"
                strokeWidth="12"
                fill="none"
                opacity="0.6"
              />
            </svg>

            {/* The Overlay Shadow */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none z-10"
              style={jupiterShadow}
            />
          </div>
        </div>

        {/* EXAMPLE 2: NASA EARTH (New) */}
        <div className="flex flex-col items-center gap-6">
          <span className="text-blue-300 font-mono text-xs tracking-[0.2em] uppercase">
            NASA Earth Style
          </span>

          <div className="relative w-64 h-64">
            {/* Planet Texture (Simple Blue Gradient for demo) */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full rounded-full bg-blue-900 block"
            >
              <defs>
                <radialGradient id="oceanGrad" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#1e40af" /> {/* Deep Blue */}
                  <stop offset="100%" stopColor="#0f172a" />{" "}
                  {/* Dark Space Blue */}
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="50" fill="url(#oceanGrad)" />

              {/* Simple Clouds */}
              <g opacity="0.6" fill="white">
                <path
                  d="M20,40 Q30,30 40,40 T60,35 T80,45"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="blur(1px)"
                />
                <path
                  d="M10,60 Q25,65 40,60 T70,70"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="blur(1px)"
                />
              </g>
            </svg>

            {/* The Overlay Shadow - NASA Style */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none z-10"
              style={nasaShadow}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-900 rounded-lg border border-gray-800 max-w-2xl w-full">
        <h3 className="text-blue-400 font-mono mb-4 text-sm">
          CSS Config for NASA Look
        </h3>
        <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto">
          {`box-shadow: 
  /* 1. Outer Atmosphere (Halo) */
  0 0 30px -5px rgba(64, 160, 255, 0.4),
      
  /* 2. Sunlit Surface Highlight */
  inset 10px 0 20px -5px rgba(200, 240, 255, 0.7),
      
  /* 3. Rayleigh Scattering (Deep Blue) */
  inset 20px 0 50px 0px rgba(0, 100, 255, 0.4),
      
  /* 4. The Terminator */
  inset -20px 0 80px 0px rgba(0,0,0,0.8),
      
  /* 5. Deep Night Side */
  inset -50px 0 60px 20px rgba(0,0,0,1);`}
        </pre>
      </div>
    </div>
  );
};

export default SphereShadow;
