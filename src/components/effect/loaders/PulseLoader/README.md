# Pulse loader

`PulseLoader.tsx` composes the shared avatar with `/static/images/logo.svg`.
`PulseLoader.styles.tsx` owns permanent presentation through typed
`theme.components.RazethLoader.styleOverrides` slots: `root`, `emblem`, `avatar`,
`pulse`, `progress`, and `message`.

The portal keeps the fullscreen layer outside backdrop-filter containers.
Reduced-motion preferences disable decorative animations. The existing
`effect/loaders/loader` import remains a compatibility entry point.
