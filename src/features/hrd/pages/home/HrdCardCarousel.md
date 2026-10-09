# Circular document gallery

Design reference: [Ana Tudor's circular gallery](https://codepen.io/thebabydino/pen/XJrYqGb).
The HRD version uses local document records, scoped 3D transforms, theme slots,
and eleven visible cards in a ring with five front-facing cards. Rear cards stay
dimmed and non-interactive, so the full ring remains visible during rotation.
Only wheel events over
the gallery scene rotate it; ordinary page scrolling leaves it stationary.
Horizontal pointer drags support touch swipes, while vertical touch gestures
retain page scrolling. Previous/next controls provide a keyboard alternative;
the center three cards flip on hover/focus or touch taps, with their links
keyboard accessible. Reduced motion disables transition animations. The frame
uses a repeating conic gradient over a white/light or near-black/dark base, animating its angle during the
flip, with secondary by default and error on hover. Container-relative sizing
and a 2:3 aspect ratio keep the cards proportional across screen sizes.

Theme presentation is registered under `RazethHrd.homeGallery*`. The
runtime CSS variables store the current rotation and each card's angle.
