import { notFound } from "next/navigation";

import { EditTranslationKeyRoute } from "./EditTranslationKeyRoute";

export interface EditTranslationKeyPageProps {
  readonly params: Promise<{
    readonly id: string;
  }>;
}

export default async function EditTranslationKeyPage(
  props: EditTranslationKeyPageProps,
) {
  const { id } = await props.params;

  const recordId = Number(id);

  if (
    !Number.isSafeInteger(recordId) ||
    recordId <= 0
  ) {
    notFound();
  }

  return (
    <EditTranslationKeyRoute
      recordId={recordId}
    />
  );
}
