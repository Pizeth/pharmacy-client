"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Configuration for one debounced textual DataTable input.
 */
export interface UseDataTableDebouncedTextInputOptions {
  /**
   * Latest committed/canonical value.
   *
   * For global search this is TanStack's globalFilter value after
   * normalization.
   */
  readonly value: string;

  /**
   * Delay before committing a locally edited value.
   *
   * 0:
   *   immediate behavior
   *
   * > 0:
   *   presentation changes immediately but canonical table state changes
   *   after the delay.
   */
  readonly debounceMs?: number;

  /**
   * Commit the new canonical value.
   */
  readonly onCommit: (value: string) => void;
}

/**
 * Controller returned by useDataTableDebouncedTextInput().
 */
export interface DataTableDebouncedTextInputController {
  /**
   * Immediate presentation value.
   */
  readonly value: string;

  /**
   * Update only the local presentation value.
   *
   * The value is committed automatically after debounceMs.
   */
  readonly setValue: (value: string) => void;

  /**
   * Immediately commit the current presentation value.
   *
   * Useful for:
   *
   * - Enter
   * - blur
   */
  readonly commit: () => void;

  /**
   * Replace and immediately commit a specific value.
   *
   * Useful for clear/reset buttons.
   */
  readonly commitValue: (value: string) => void;
}

/**
 * Keep input typing responsive while delaying canonical DataTable state.
 *
 * This is presentation state, NOT duplicated table/query state.
 *
 * TanStack remains the source of truth after the value is committed.
 *
 * External canonical changes such as:
 *
 *   table reset
 *   restored state
 *   URL synchronization
 *
 * are detected and copied back into the local draft.
 */
export function useDataTableDebouncedTextInput(
  options: UseDataTableDebouncedTextInputOptions,
): DataTableDebouncedTextInputController {
  const { value, debounceMs = 0, onCommit } = options;

  const [draftValue, setDraftValue] = useState(value);

  /**
   * Latest value we believe has been committed to the canonical owner.
   *
   * This distinction is important:
   *
   *   draftValue !== committedValue
   *
   * is a normal situation while the user is typing.
   *
   * Therefore we must NOT synchronize from `value` on every render or
   * the user's draft would immediately be overwritten before the debounce
   * timer finishes.
   */
  const committedValueRef = useRef(value);

  /**
   * Avoid making debounce scheduling depend on callback identity.
   */
  const onCommitRef = useRef(onCommit);

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    onCommitRef.current = onCommit;
  }, [onCommit]);

  const clearTimer = useCallback((): void => {
    if (timerRef.current === undefined) {
      return;
    }

    clearTimeout(timerRef.current);

    timerRef.current = undefined;
  }, []);

  /**
   * Synchronize true EXTERNAL changes.
   *
   * Example:
   *
   *   query.reset()
   *
   * changes canonical value from:
   *
   *   "login"
   *
   * to:
   *
   *   ""
   *
   * That must immediately update the visible input.
   */
  useEffect(() => {
    if (value === committedValueRef.current) {
      return;
    }

    clearTimer();

    committedValueRef.current = value;

    setDraftValue(value);
  }, [clearTimer, value]);

  /**
   * Schedule a canonical commit whenever the local draft changes.
   */
  useEffect(() => {
    if (draftValue === committedValueRef.current) {
      return;
    }

    clearTimer();

    if (debounceMs <= 0) {
      committedValueRef.current = draftValue;

      onCommitRef.current(draftValue);

      return;
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = undefined;

      committedValueRef.current = draftValue;

      onCommitRef.current(draftValue);
    }, debounceMs);

    return clearTimer;
  }, [clearTimer, debounceMs, draftValue]);

  /**
   * Cancel an outstanding timer on unmount.
   */
  useEffect(() => clearTimer, [clearTimer]);

  const setValue = useCallback((nextValue: string): void => {
    setDraftValue(nextValue);
  }, []);

  const commit = useCallback((): void => {
    clearTimer();

    if (draftValue === committedValueRef.current) {
      return;
    }

    committedValueRef.current = draftValue;

    onCommitRef.current(draftValue);
  }, [clearTimer, draftValue]);

  const commitValue = useCallback(
    (nextValue: string): void => {
      clearTimer();

      setDraftValue(nextValue);

      if (nextValue === committedValueRef.current) {
        return;
      }

      committedValueRef.current = nextValue;

      onCommitRef.current(nextValue);
    },
    [clearTimer],
  );

  return {
    value: draftValue,
    setValue,
    commit,
    commitValue,
  };
}
