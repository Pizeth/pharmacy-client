# Pulse loader

`PulseLoader.tsx` composes the shared avatar with `/static/images/logo.svg`.
`PulseLoader.styles.tsx` owns permanent presentation through typed
`theme.components.RazethLoader.styleOverrides` slots: `root`, `emblem`, `avatar`,
`pulse`, `progress`, `orbit`, `glow`, `outerGlow`, `ring`, `gradientRing`, `frame`, `background`, `circleBackground`, `particle`, and `message`.

The fullscreen `frame` adds a blurred rotating gradient inner glow inspired by
[Ana Tudor's inner glow card](https://codepen.io/thebabydino/pen/WNVPdJg).
Its registered CSS angle animates theme primary, secondary, and error colors.
The clipped frame ignores pointer input; reduced motion leaves a static glow.

The `storm` and `particle` slots add a primary-main solar corona just
outside the rings, inspired by [Zarko Rvovic's solar storm](https://codepen.io/nocni_sovac/pen/xxNxKoQ).
Its 400 blurred particles use deterministic angles and staggered 4s lifetimes,
inside a 15s counter-rotating field. Canvas projection follows the reference's
CSS ease, with compressed radial/depth travel, 40%-sized sprites, and 35% opacity
to keep the corona subtle and close to the circle. An inverse circular
clip preserves the existing logo and rings in place of the reference's black disk.

Counter-rotating broken rings and a slow particle field are inspired by
[Colin Horn's rotate/pulse loader](https://codepen.io/colinhorn/pen/zdNMVy).
The rings use primary main/light theme colors and staggered opacity fades, with
constant dimensions and the reference's 30s reverse / 15s forward rotations.
The inner ring has independently rotating masked gaps: 3.5s reverse and 8s forward.
Cycling text overlays the logo center using the theme's regular font family,
the login caption's gold color, outline shadows and glow, at 1rem with a thin black
stroke and a dark red pill background (40% opacity, 50px corners) with the shared neumorphic shadow.
Background particles share the corona's canvas, with main-colored and faint light-colored fields across a full-width,
half-height horizontal band. Particle sizes range up to 10px and 15px respectively.
Blurred sprites are cached once, angles precomputed, and the backing buffer uses
CSS-pixel resolution. One animation loop pauses in hidden tabs and is cleaned up
on unmount; resizing uses ResizeObserver. No tsParticles engine or 400 animated
DOM elements are mounted by this loader. The navbar's tsParticles remains independent.
Canvas colors resolve from the active theme scheme. Reduced motion hides
the particle fields and stops the ring animations.
The outer glow circle adds the reference's 20px inward primary shadow without
another border or ring. The red orbit dots sit outside this circle with theme.spacing(1.5) clearance,
while retaining their original size. The existing red pulse, logo, and cycling messages are retained.
The emblem scales to keep that outer orbit within both viewport dimensions.
The fixed root uses 100dvh and border-box sizing to center against the mobile viewport.
The `gradientRing` slot adds aadium's thin, round-capped gradient arc in the narrow
gap around the logo, above its frame: primary head to transparent error tail, a 0.75-unit
stroke, rotating every 1.2s.
The `outerGlow` slot adds lucky-falcon-75's 1.7s primary/error glow spinner
between the middle and outermost broken rings, with a transparent center.
The `circleBackground` slot clips SelfMadeSystem's short-newt-53 blurred streaks
and 8px dotted screen to the outer glow spinner inside the third broken ring.
It uses the reference's warm gradients, shared `hi` motion, and 5s hue flicker.
The gradient arc matches the logo frame diameter.

The portal keeps the fullscreen layer outside backdrop-filter containers.
Reduced-motion preferences disable decorative animations. The existing
`effect/loaders/loader` import remains a compatibility entry point.
