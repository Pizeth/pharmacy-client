// src/store/validationStore.ts
import { atom } from "jotai";

export const validationMessagesAtom = atom<Record<string, string>>({});
export const validationScoreAtom = atom<Record<string, number>>({});

export const setValidationMessageAtom = atom(
  null,
  (get, set, update: { source: string; message: string }) => {
    set(validationMessagesAtom, (prev) => ({
      ...prev,
      [update.source]: update.message,
    }));
  },
);

export const clearValidationMessageAtom = atom(
  null,
  (get, set, source: string) => {
    set(validationMessagesAtom, (prev) => {
      const newMessages = { ...prev };
      delete newMessages[source];
      return newMessages;
    });
  },
);

export const setValidationScoreAtom = atom(
  null,
  (get, set, update: { source: string; score: number }) => {
    set(validationScoreAtom, (prev) => ({
      ...prev,
      [update.source]: update.score,
    }));
  },
);

export const clearValidationScoreAtom = atom(
  null,
  (get, set, source: string) => {
    set(validationScoreAtom, (prev) => {
      const newScores = { ...prev };
      delete newScores[source];
      return newScores;
    });
  },
);
