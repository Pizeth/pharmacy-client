# Shared avatar

`AvatarContainer` owns the circular avatar composition used by authentication,
navbar logos, account controls, and the user settings menu. It composes the existing
`AvatarFrame` (neumorphic well and animated border) and `AvatarWrapper` (animated
background, pulse, texture, and optional hover icon). Keep those layers shared;
do not duplicate their effects in consumers.

Pass `src`, `alt`, and `fallback` for a profile image or anonymous placeholder.
An image error displays the fallback. Pass `children` for custom foregrounds such
as the auth globe or the navbar's Next Image logo. Pass `hoverIcon` for the
logo-to-menu transition. The caller owns click handlers and button semantics.

The shared frame uses a thin one-pixel inner border and a tight theme-spacing
inset. `neumorphic` defaults to `true`; pass `false` to remove the well shadow
while retaining the animated border and background. `DrawerToggle` defaults to
`false`, with an explicit prop or its theme defaultProps able to enable it.
When neumorphism is off, the frame's paper background is transparent as well.
`softGlow` independently controls the outer primary-color glow. It defaults to
`false` on avatars and `true` on hamburger logos, and supports theme defaultProps.

`role` is the existing **badge label** API, not a DOM role. Omit it for anonymous
avatars and navbar logos; no badge is invented. `icon`, `size`, `color`, and
`variant` configure the optional badge.

Use `theme.components.RazethAvatarContainer.defaultProps` and the typed `root`,
`chip`, and `foreground` style overrides. Existing `RazethAvatarFrame`,
`RazethAvatarWrapper`, `RazethAvatar`, and `RazethNavToggle` slots remain intact.
Keep permanent presentation in slots rather than adding CSS modules or inline
`sx`. The circular frame derives its height from its width, including narrow
mobile navbar columns.
