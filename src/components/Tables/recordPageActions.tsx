"use client";
import { createContext, useContext, type ReactNode } from "react";
import { Toolbar } from "./resourceRecordStyles";
const Context = createContext<ReactNode>(null);
export const RecordPageActionsProvider = Context.Provider;
export function RecordPageActions() {
  const actions = useContext(Context);
  return actions ? <Toolbar aria-label="Record actions">{actions}</Toolbar> : null;
}
