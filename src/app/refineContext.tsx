"use client";

import authProvider from "@/lib/providers/authProvider";
import { i18nProvider } from "@/lib/providers/i18nProvider";
import {
  TRANSLATION_KEY_REFINE_DATA_PROVIDER_NAME,
  translationKeyRefineDataProvider,
} from "@/features/i18n/translation-keys/refine";
import { API_URL } from "@/types/constants";
import { Refine } from "@refinedev/core";
import dataProvider from "@refinedev/nestjsx-crud";
import routerProvider from "@refinedev/nextjs-router";
import { Suspense } from "react";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
export const RefineContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <Refine
      i18nProvider={i18nProvider}
      routerProvider={routerProvider}
      /**
       * Keep the existing NestJS CRUD provider as the application default.
       *
       * TranslationKey's production DataTable uses a named provider which
       * executes its established POST /i18n/keys/query Standard API contract
       * through Refine's useList/TanStack Query lifecycle.
       */
      dataProvider={{
        default: dataProvider(API_URL),
        [TRANSLATION_KEY_REFINE_DATA_PROVIDER_NAME]:
          translationKeyRefineDataProvider,
      }}
      authProvider={authProvider}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
        // Tell Refine where your auth pages live
        disableTelemetry: true,
      }}
      /* Define your resources here */
      resources={[
        // {
        //   name: "dashboard",
        //   list: "/dashboard",
        //   meta: { label: "ផ្ទាំងសូចនាករ" }, // Example Khmer label
        // },
        {
          name: "login",
          list: "/login",
          // meta: { label: "ផ្ទាំងចូលប្រើប្រាស់" }, // Example Khmer label
          // show: "/admin/login",
        },
        {
          name: "translations",
          list: "/admin/i18n",
          create: "/admin/i18n/create",
          edit: "/admin/i18n/edit/:id",
          meta: { label: "Translations" },
        },
        {
          name: "documents",
          list: "/admin/documents",
          meta: { label: "Documents" },
        },
      ]}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </Refine>
  );
};

export default RefineContext;
