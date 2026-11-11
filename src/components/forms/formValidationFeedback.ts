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
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
  const issue = issues.find(item => item.path.join(".") === target.name);
  if (issue) form.setError(target.name as FieldPath<T>, { type: "submitValidation", message: issue.message });
}
