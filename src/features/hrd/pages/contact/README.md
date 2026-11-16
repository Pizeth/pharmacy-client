# Contact page

## Google Maps marker

The contact map uses the branded `public/static/svg/hrd-map-marker.svg` at the
verified coordinates in `siteInfo.ts`. It is a self-contained, optimized emblem
inside a blue/gold pin. The marker moves with map pan/zoom and opens an office
information window with a Google Maps directions link.

Set these browser-visible configuration values in `.env.local` and restart dev
(rebuild for production):

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_browser_key
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_javascript_map_id
```

Enable Maps JavaScript API for the key and restrict it to your site's HTTP
referrers (including localhost for development). The map ID is required by
Advanced Markers; without one, development uses Google's `DEMO_MAP_ID`. Supply
your own map ID for production. No key is committed to the repository.
Until a key and coordinates exist, the existing Google iframe remains visible.
SDK load failures also fall back to that iframe. The SDK loads only when the
map section approaches the viewport, and marker listeners are cleaned up.

The illustration carousel occupies its own full-width section at the very top.
The page adds theme spacing above it to separate it from the shared breadcrumbs;
there is no duplicate page-title block below the carousel.
The contact card sits beside the separate ការស្នើសុំទំនាក់ទំនង form section;
they stack on narrow screens. The map has its own full-width
section below. The former document prompt has been removed.

`ContactForm` validates the name, email, phone/Telegram, subject, and message
before opening a prefilled `mailto:` draft. No submission service is configured;
the UI states that the visitor must send the message from their email app.
The form disables its action when the site's contact email is missing.

`ContactCarousel` uses existing local HRD illustrations, marked as representative
images until approved office/activity photos are provided. It advances every
six seconds with a zoom-out/fade animation and no visible controls. It avoids
advancing while the document is hidden. Reduced-motion users see a static image.
Its presentation and the form use typed `RazethHrd` slots.
The form uses `@/components/inputs` TextField with React Hook Form's FormProvider,
following the i18n forms and retaining shared input styling and validation.
Fields include leading icons. The ផ្ញើសារ action uses an email icon and the
theme's standard button radius, matching the i18n dialog form actions. Form,
carousel, and map surfaces share `--Hrd-contact-section-radius`.
Both section headings use identical line height and margins. Shared input start
adornments inherit focus/error colors for any currentColor icon, including Lucide.

The contact card uses the layered rounded diamonds in
`public/static/svg/patterns/card.svg` as a visual reference. Its colors come from
the department's #26247B blue and logo gold palette, with the original #edad54
title and a subtle theme warning line at the top. The contact information remains on
an opaque, readable surface in both color schemes.

`contactCardArt` and `contactCardShape` are typed `RazethHrd` theme slots.
Decorative shapes ignore pointer input and slide on precise-pointer hover
or keyboard focus within the card. Reduced motion disables these transitions.
The slide duration is 400ms. Four floating shapes remain; dark-mode fills are
opaque theme-aware gold blends in both modes so borders underneath do not show
through. Each shape uses `red-pattern.svg` as a subtle white mask in both modes,
rather than the asset's original red. Diamond sizes and offsets scale with the
card width, with smaller unequal right-hand accents that leave the copy clear.
The left accent slides upward on hover and keyboard focus. Paired light/dark
neumorphic shadows lift the card. A stripe directly below the header uses the
logo's gold gradient (#F0C54C, #EDAC4C, #EA9548), while the lower stripe matches
the department's #26247B blue.
The stripe sits above a white bottom band matching the corner radius. The body
reserves that band, centers its content above the stripe, and stretches the
portrait to the copy's height.
Both divider stripes are 3px thick. Work hours appear with a clock icon in the
white bottom band, using department blue, rather than a separate hours panel.
The bottom band also shows the street address with a location icon. Hours and
address share one line with card-relative font sizing in a 24px band (20px on
small screens). The page grid is a transparent layout
without an enclosing card, border, or padding.
The card uses a 7:4 business-card aspect ratio with compact responsive typography.
The lowest diamond sits at the bottom left to balance the right-hand shapes.
Portraits belong to the contact records; contacts without a photo retain Otto as a fallback.
The header title is centered against balanced logo columns. Its right-side
`contactHeaderPattern` slot uses the local `rumduol.svg` in gold, fading in from
the left, inspired by the Ministry of Commerce footer.
Existing email, telephone, Telegram, and placeholder Meta behavior is preserved.

The hover motion is inspired by
[Javierrocadev's kind-panther-93](https://uiverse.io/Javierrocadev/kind-panther-93).
It is implemented with the project's MUI slots rather than Tailwind.
