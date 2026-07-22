// src/hooks/useFieldValidation.ts
import { useAtomValue, useSetAtom } from "jotai";
import {
  validationMessagesAtom,
  validationScoreAtom,
  validationLoadingAtom,
  setValidationMessageAtom,
  clearValidationMessageAtom,
  setValidationScoreAtom,
  clearValidationScoreAtom,
  setValidationLoadingAtom,
} from "@/Stores/validationStore";

export const useGlobalStore = (source: string) => {
  // 1. Read the state specific to this source
  const message = useAtomValue(validationMessagesAtom)[source];
  const score = useAtomValue(validationScoreAtom)[source];
  const loading = useAtomValue(validationLoadingAtom)[source] || false;

  // 2. Grab all the raw Jotai setters
  const setRawMsg = useSetAtom(setValidationMessageAtom);
  const clearRawMsg = useSetAtom(clearValidationMessageAtom);
  const setRawScore = useSetAtom(setValidationScoreAtom);
  const clearRawScore = useSetAtom(clearValidationScoreAtom);
  const setRawLoading = useSetAtom(setValidationLoadingAtom);

  // 3. Return a clean, pre-bound API for your component
  return {
    message,
    score,
    loading,
    setMessage: (msg: string) => setRawMsg({ source, message: msg }),
    clearMessage: () => clearRawMsg(source),
    setScore: (val: number) => setRawScore({ source, score: val }),
    clearScore: () => clearRawScore(source),
    setLoading: (isLoading: boolean) =>
      setRawLoading({ source, loading: isLoading }),
  };
};
