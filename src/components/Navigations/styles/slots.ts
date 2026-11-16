import type { CSSInterpolation } from "@mui/material/styles";
export interface NavigationSlotMap {
  RazethDrawer: "root" | "appBar" | "appBarContainer" | "toolbar" | "logoSection" | "caption" | "stackWrapper" | "content" | "mobileMenuButton" | "compactLogoButton" | "navMenuButton" | "drawerHeader" | "desktopToolbar" | "drawer" | "accountButton" | "accountAvatar" | "footer" | "legacyCard" | "legacyTitle" | "legacyDescription" | "legacyLink" | "accountCopy" | "accountName" | "accountDescription" | "backdrop" | "hamburgerNav";
  RazethNav: "root" | "list" | "pill" | "hoverBorder" | "item" | "sidebarItem" | "link" | "icon" | "text" | "groupButton" | "drawerRoot" | "drawerList" | "drawerItem" | "drawerGroupButton" | "drawerChildLink" | "drawerChildIcon" | "groupArrow" | "menu";
  RazethSearch: "root" | "wrapper" | "actionButton" | "input" | "label";
  RazethSearchPoppers: "root" | "paper" | "errorBox" | "scrollableList" | "empty";
  RazethUserSetting: "publicAction" | "header" | "wrapper" | "popover" | "surface" | "content" | "accentBar" | "divider" | "list" | "footer" | "action";
  RazethDrawerTheme: "root" | "label";
  RazethNavigationLayout: "main" | "headerDivider";
}

/** Existing component names and slot keys remain the theme override contract. */
export function navigationSlot<Name extends keyof NavigationSlotMap>(name: Name, slot: Capitalize<NavigationSlotMap[Name]>, legacySlot?: NavigationSlotMap[Name]) {
  const key = slot.charAt(0).toLowerCase() + slot.slice(1);
  return {
    name,
    slot,
    overridesResolver: (_props: unknown, styles: Record<string, CSSInterpolation>) => legacySlot ? [styles[legacySlot], styles[key]] : styles[key]
  };
}
