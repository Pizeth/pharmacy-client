# Navigation structure

`src/components/Navigations/DrawerAppBar.tsx` is the application navigation entry.
Its existing named/default exports and props remain compatible. The untouched
pre-refactor snapshot is `DrawerAppBar-old.tsx`; it is reference material and must
not be imported by the live application. `AppBar.tsx` is a separate historical
alternative and is not used by this layout.

## Ownership

| Area | Responsibility |
| --- | --- |
| `DrawerAppBar.tsx` | Drawer visibility, responsive state, shared particle provider, main content |
| `components/NavigationHeader.tsx` | Expanded/compact branding, mobile toggle, desktop menu, header particles |
| `components/NavigationDrawer.tsx` | Drawer shell, logo, search, inline menu, close-on-navigation |
| `components/DrawerAccount.tsx` | Account subscription and popup anchor, theme switch, legacy notice |
| `styles/*.styles.tsx` | Named permanent presentation slots, split into header, drawer, account, layout |
| `Navigation/NavItems.tsx` | Desktop hover/keyboard dropdowns and inline drawer expansion |
| `Navigation/NavItems.styles.tsx` | Route menu presentation; route data stays in `configs/navConfig.tsx` |
| `Navigation/useHeaderScrollState.ts` | Expanded-height measurement, compact hysteresis, restoration and resize cleanup |
| `Search/search.tsx` | Input focus, keyboard selection and dropdown interaction |
| `Search/useNavigationSearch.ts` | Debounce, request cancellation, results and error state |
| `UserSetting/Settings.tsx` | Guest/authenticated menu and login/logout actions |
| `UserSetting/Settings.styles.tsx` | Menu surface, animation wrapper, actions and profile presentation |

Keep existing import paths available for callers. The folder `index.ts` exposes
the application entry; internal components import their owning files directly.
Do not introduce an additional account/auth subscription in the header.

## Theme slots

`styles/slots.ts` defines `NavigationSlotMap` and the typed `navigationSlot()`
helper. `src/theme.d.ts` registers these families with MUI. Permanent styles belong
in named styled slots; no CSS modules or local `sx`. Typography remains on MUI
variants and the existing theme font variables.

Existing families stay available: `RazethDrawer`, `RazethNav`, `RazethSearch`,
`RazethSearchPoppers`, `RazethUserSetting`, `RazethDrawerTheme`, and
`RazethNavigationLayout`. The mobile button, compact logo button, main logo
button, and drawer header now have separate slots. Their previous `content`
override is applied first as a compatibility alias, followed by the specific
slot override.

```tsx
components: {
  RazethDrawer: {
    styleOverrides: {
      mobileMenuButton: { outlineOffset: 3 },
      footer: { paddingBlock: 16 },
    },
  },
}
```

`--Navigation-expanded-height` is measured runtime geometry and is intentionally
the only layout value supplied through an inline style. Header, main content,
and drawer use the same measurement. Preserve the 112/64px mobile header,
desktop compact behavior, full-width footer, theme background switch, gold
divider alignment, and the transparent mobile button with gold outlined glyph.

## Search and rendering work

Header and user-menu particle option objects are memoized. Account state and
popup anchor updates are owned by `DrawerAccount`, rather than the entire layout.
Unused imports, experimental styles, commented implementations and static `sx`
rules were removed from the active path.

The search transport still uses the existing JSONPlaceholder demo endpoint; this
refactor does not introduce a real search backend. Input changes clear the
debounce timer and abort the previous request; late responses cannot replace
newer results. Body-scroll locking has its own cleanup, independent of requests.
Keyboard selection uses the same result title as pointer selection. Search
inputs use unique IDs, and the clear action has an accessible label.

## Verification

Run `npm test -- --runInBand --roots src --testPathPatterns src/components/Navigations`
and `npx tsc --noEmit`. New tests cover shell coordination, measured offsets,
slot overrides and legacy aliases, request debounce, stale responses and errors.
Existing tests cover hover/keyboard menus, inline drawer selection, account state,
and restored/resize header geometry. For broad refactors, run the full suite with
`npm test -- --runInBand --roots src` to avoid scanning changing `.next` files.

Browser checks should cover expanded and compact desktop navigation, narrow
drawer expansion and automatic closing, theme switching and guest account menu.
Do not restart the developer's server or perform a real logout for verification.

October 20, 2026 verification: all 138 application suites / 790 tests passed;
the navigation subset passed 8 suites / 22 tests, and TypeScript passed. The live
development site was checked at desktop and 390px widths, including expanded and
compact headers, desktop dropdown opening, inline drawer expansion, child-link
navigation with automatic closing, theme switching, and account popup opening.
The original light theme and browser viewport were restored afterward. No runtime
console errors were reported during these checks. Authenticated popup behavior
was inspected without logging out; guest behavior remains covered by unit tests.
