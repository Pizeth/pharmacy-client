import type {
  Updater,
} from "@tanstack/table-core";

export function resolveDataTableUpdater<TValue>(
  updater:
    Updater<TValue>,
  previous:
    TValue,
): TValue {
  if (
    typeof updater ===
    "function"
  ) {
    const update =
      updater as (
        previous:
          TValue,
      ) => TValue;

    return update(
      previous,
    );
  }

  return updater;
}
