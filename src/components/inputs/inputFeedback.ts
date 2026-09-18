import { atom, type Atom, type PrimitiveAtom } from "jotai";

export type InputFeedbackStatus = "idle" | "checking" | "success";

export interface InputFeedback {
  readonly status: InputFeedbackStatus;
  readonly message?: string;
  /**
   * Prevents a successful response for an older value from being displayed
   * after the user changes the field.
   */
  readonly forValue?: string;
}

export type InputFeedbackAtom = PrimitiveAtom<InputFeedback>;

export const idleInputFeedback: InputFeedback = {
  status: "idle",
};

export const noInputFeedbackAtom: Atom<InputFeedback> =
  atom<InputFeedback>(idleInputFeedback);

export function createInputFeedbackAtom(): InputFeedbackAtom {
  return atom<InputFeedback>({ ...idleInputFeedback });
}
