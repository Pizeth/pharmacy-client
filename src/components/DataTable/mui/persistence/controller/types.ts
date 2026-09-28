import type {
  RowData,
} from "@tanstack/table-core";

import type {
  MuiDataTableDensity,
} from "../../density";
import type {
  DataTableDisplayMode,
} from "../../presentation";
import type {
  MuiDataTableInstance,
} from "../../table";
import type {
  DataTablePersistenceStorage,
  DataTablePersistedVisualStateStore,
} from "../storage";

export interface DataTablePersistedVisualStateConfig {
  /**
   * Stable preference scope owned by the consuming application/resource.
   */
  readonly storageId: string;

  /**
   * Optional replacement for browser localStorage.
   *
   * When omitted, the controller resolves the browser adapter after mount.
   */
  readonly storage?: DataTablePersistenceStorage;

  /**
   * Allows a configured persistence boundary to be temporarily disabled
   * without changing the storage key.
   *
   * Default: true.
   */
  readonly enabled?: boolean;
}

export interface UseDataTablePersistedVisualStateControllerOptions<
  TData extends RowData,
> {
  readonly table: MuiDataTableInstance<TData>;

  readonly persistence:
    | false
    | DataTablePersistedVisualStateConfig;

  readonly density?: MuiDataTableDensity;
  readonly defaultDensity: MuiDataTableDensity;
  readonly onDensityChange?: (
    density: MuiDataTableDensity,
  ) => void;

  readonly displayMode?: DataTableDisplayMode;
  readonly defaultDisplayMode: DataTableDisplayMode;
  readonly onDisplayModeChange?: (
    mode: DataTableDisplayMode,
  ) => void;

  /**
   * Persisted card/auto display modes are meaningful only when the current
   * DataTable has a card renderer.
   */
  readonly cardAvailable: boolean;
}

export interface DataTablePersistedVisualStateController {
  readonly enabled: boolean;
  readonly hydrated: boolean;

  readonly store?:
    DataTablePersistedVisualStateStore;

  readonly density:
    MuiDataTableDensity;

  readonly displayMode:
    DataTableDisplayMode;

  readonly setDensity: (
    density: MuiDataTableDensity,
  ) => void;

  readonly setDisplayMode: (
    mode: DataTableDisplayMode,
  ) => void;

  /**
   * Persist only state families which are not externally controlled.
   */
  readonly persistDensity: boolean;
  readonly persistDisplayMode: boolean;
  readonly persistColumnVisibility: boolean;
  readonly persistColumnOrder: boolean;
  readonly persistColumnSizing: boolean;
  readonly persistColumnPinning: boolean;
}
