import type { DataTablePersistenceStorage } from "@/components/DataTable/mui/persistence/storage";
import { DATA_TABLE_EXPANSION_COLUMN_ID } from "@/components/DataTable/mui/columns/expansion";
import { DATA_TABLE_SELECTION_COLUMN_ID } from "@/components/DataTable/mui/columns/selection";
import { DATA_TABLE_ACTIONS_COLUMN_ID } from "@/components/DataTable/mui/columns/actions";
const leading = [DATA_TABLE_EXPANSION_COLUMN_ID, DATA_TABLE_SELECTION_COLUMN_ID];
const utilities = [...leading, DATA_TABLE_ACTIONS_COLUMN_ID];
export const adminUtilityColumnPinning = { start: leading, end: [DATA_TABLE_ACTIONS_COLUMN_ID] };
/** Preserve saved data-column preferences while restoring the shared utility layout. */
export const adminTableStorage: DataTablePersistenceStorage = {
  getItem(key) {
    const raw = typeof window === "undefined" ? null : window.localStorage.getItem(key);
    if (!raw) return raw;
    try {
      const state = JSON.parse(raw);
      if (!state || state.version !== 1) return raw;
      const dataColumns = (value: unknown) => Array.isArray(value) ? value.filter(id => typeof id === "string" && !utilities.includes(id)) : [];
      state.columnPinning = { start: [...leading, ...dataColumns(state.columnPinning?.start)], end: [...dataColumns(state.columnPinning?.end), DATA_TABLE_ACTIONS_COLUMN_ID] };
      if (Array.isArray(state.columnOrder)) state.columnOrder = [...leading, ...dataColumns(state.columnOrder), DATA_TABLE_ACTIONS_COLUMN_ID];
      return JSON.stringify(state);
    } catch { return raw; }
  },
  setItem(key, value) { if (typeof window !== "undefined") window.localStorage.setItem(key, value); },
  removeItem(key) { if (typeof window !== "undefined") window.localStorage.removeItem(key); },
};
