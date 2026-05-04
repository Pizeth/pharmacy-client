// useFormOrchestrator.ts

export const useFormOrchestrator = (form: any) => {
  const { formState } = form;

  const isValid =
    formState.isValid &&
    !formState.isValidating &&
    Object.keys(formState.errors).length === 0;

  const isReady = isValid && !formState.isSubmitting;

  return {
    isValid,
    isReady,
    isSubmitting: formState.isSubmitting,
  };
};
