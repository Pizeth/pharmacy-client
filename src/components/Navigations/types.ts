"use client";

import type { ReactNode, RefObject } from "react";
import type { CSSProperties } from "react";
export interface NavigationGeometry extends CSSProperties {
  readonly "--Navigation-expanded-height": string;
}
export interface DrawerAppBarProps {
  children: ReactNode;
  disabledMenu?: boolean;
  backgroundColor?: string;
  /** Shared trail by default; a feature layout may render its own trail once. */
  breadcrumbs?: ReactNode;
}
export interface NavigationHeaderProps {
  headerRef: RefObject<HTMLElement | null>;
  compactDesktop: boolean;
  mobile: boolean;
  scrolled: boolean;
  open: boolean;
  disabledMenu: boolean;
  onToggle: () => void;
}
export interface NavigationDrawerProps {
  geometry?: NavigationGeometry;
  compactDesktop: boolean;
  mobileScrolled: boolean;
  disabledMenu: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}
