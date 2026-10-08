# Circular document gallery

Design reference: [Ana Tudor's circular gallery](https://codepen.io/thebabydino/pen/XJrYqGb).
The HRD version uses local document records, scoped 3D transforms, theme slots,
and a passive scroll listener while the gallery is visible. It does not replace
the site's scrolling or its existing hero. Previous/next controls work on touch
screens; only the selected card link is keyboard accessible. Reduced motion
disables rotation driven by page scrolling and transition animations.

Theme presentation is registered under `RazethHrd.homeGallery*`. The single
runtime CSS variable stores the current rotation angle.
