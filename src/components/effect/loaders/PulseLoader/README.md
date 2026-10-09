# Pulse loader

`PulseLoader.tsx` composes the shared avatar with `/static/images/logo.svg`.
`PulseLoader.styles.tsx` owns permanent presentation through typed
`theme.components.RazethLoader.styleOverrides` slots: `root`, `emblem`, `avatar`,
`pulse`, `progress`, `orbit`, `glow`, `ring`, `frame`, `background`, `particle`, and `message`.

The fullscreen `frame` adds a blurred rotating gradient inner glow inspired by
[Ana Tudor's inner glow card](https://codepen.io/thebabydino/pen/WNVPdJg).
Its registered CSS angle animates theme primary, secondary, and error colors.
The clipped frame ignores pointer input; reduced motion leaves a static glow.

The `storm`, `stormCore` and `stormParticle` slots add a primary/error solar corona just
outside the rings, inspired by [Zarko Rvovic's solar storm](https://codepen.io/nocni_sovac/pen/xxNxKoQ).
Its 400 blurred particles use deterministic angles and staggered 4s lifetimes,
inside a 15s counter-rotating field. A radial mask keeps the center transparent.

Counter-rotating broken rings and a slow particle field are inspired by
[Colin Horn's rotate/pulse loader](https://codepen.io/colinhorn/pen/zdNMVy).
The rings use primary main/light theme colors and staggered opacity fades, with
constant dimensions and the reference's 30s reverse / 15s forward rotations.
The inner ring has independently rotating masked gaps: 3.5s reverse and 8s forward.
Cycling text overlays the logo center using the theme's regular font family,
the login caption's gold color, outline shadows and glow, at 1rem with a thin black
stroke and a dark red pill background (40% opacity, 50px corners) with the shared neumorphic shadow.
Background particles reuse the navigation's tsParticles slim engine and shared
initializer, with main-colored and faint light-colored fields across a full-width,
half-height horizontal band. Particle sizes range up to 10px and 15px respectively.
Canvas colors resolve from the active theme scheme. Reduced motion hides
the particle fields and stops the ring animations.
The existing red pulse, orbit dots, logo, and cycling messages are retained.

The portal keeps the fullscreen layer outside backdrop-filter containers.
Reduced-motion preferences disable decorative animations. The existing
`effect/loaders/loader` import remains a compatibility entry point.
