// src/store/validationStore.ts
import { atom } from "jotai";

export const validationMessagesAtom = atom<Record<string, string>>({});
export const validationScoreAtom = atom<Record<string, number>>({});
export const validationLoadingAtom = atom<Record<string, boolean>>({});

export const setValidationMessageAtom = atom(
  null,
  (_get, set, update: { source: string; message: string }) => {
    set(validationMessagesAtom, (prev) => ({
      ...prev,
      [update.source]: update.message,
    }));
  },
);

export const clearValidationMessageAtom = atom(
  null,
  (_get, set, source: string) => {
    set(validationMessagesAtom, (prev) => {
      const newMessages = { ...prev };
      delete newMessages[source];
      return newMessages;
    });
  },
);

export const setValidationScoreAtom = atom(
  null,
  (_get, set, update: { source: string; score: number }) => {
    set(validationScoreAtom, (prev) => ({
      ...prev,
      [update.source]: update.score,
    }));
  },
);

export const clearValidationScoreAtom = atom(
  null,
  (_get, set, source: string) => {
    set(validationScoreAtom, (prev) => {
      const newScores = { ...prev };
      delete newScores[source];
      return newScores;
    });
  },
);

export const setValidationLoadingAtom = atom(
  null,
  (_get, set, update: { source: string; loading: boolean }) => {
    set(validationLoadingAtom, (prev) => ({
      ...prev,
      [update.source]: update.loading,
    }));
  },
);

export const resetAllValidationsAtom = atom(null, (_get, set) => {
  set(validationMessagesAtom, {});
  set(validationScoreAtom, {});
  set(validationLoadingAtom, {});
});
