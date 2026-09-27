"use client";

import { useRouter } from "next/navigation";

import {
  TranslationKeyEditPage,
} from "@/features/i18n/translation-keys";

export interface EditTranslationKeyRouteProps {
  readonly recordId: number;
}

export function EditTranslationKeyRoute(
  props: EditTranslationKeyRouteProps,
) {
  const { recordId } = props;

  const router = useRouter();

  const backToList = () => {
    router.push("/admin/i18n");
  };

  return (
    <TranslationKeyEditPage
      recordId={recordId}
      onBack={backToList}
      onUpdated={() => {
        router.replace("/admin/i18n");
        router.refresh();
      }}
    />
  );
}
