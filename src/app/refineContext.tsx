"use client";

import authProvider from "@/lib/providers/authProvider";
import { i18nProvider } from "@/lib/providers/i18nProvider";
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
      /* Replace with your actual API URL */
      dataProvider={dataProvider(API_URL)}
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
