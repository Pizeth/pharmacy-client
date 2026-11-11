import { useEffect, useRef } from "react";

export function useInvalidLabelShake(invalid: boolean) {
  const labelRef = useRef<HTMLLabelElement>(null);
  useEffect(() => {
    const label = labelRef.current;
    if (!invalid || !label) return;

    label.classList.add("shake");
    const timer = setTimeout(() => label.classList.remove("shake"), 500);
    return () => {
      clearTimeout(timer);
      label.classList.remove("shake");
    };
  }, [invalid]);
  return labelRef;
}
