import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

export function setFormIssues<T extends FieldValues>(
  form: Pick<UseFormReturn<T>, "setError">,
  issues: readonly { path: readonly PropertyKey[]; message: string }[],
) {
  const fields = new Set<string>();
  for (const issue of issues) {
    const name = issue.path.join(".");
    if (!name || fields.has(name)) continue;
    form.setError(name as FieldPath<T>, { type: "submitValidation", message: issue.message }, { shouldFocus: fields.size === 0 });
    fields.add(name);
  }
}

export function showFieldIssue<T extends FieldValues>(
  form: Pick<UseFormReturn<T>, "setError">,
  target: EventTarget,
  issues: readonly { path: readonly PropertyKey[]; message: string }[],
) {
  const name = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
    ? target.name
    : target instanceof HTMLElement && target.getAttribute("role") === "combobox"
      ? target.closest<HTMLElement>("[data-form-field]")?.dataset.formField
      : undefined;
  if (!name) return;
  const issue = issues.find(item => item.path.join(".") === name);
  if (issue) form.setError(name as FieldPath<T>, { type: "submitValidation", message: issue.message });
}
