"use client";

import { Refine } from "@refinedev/core";

import type { DataTableDisplayMode } from "@/components/DataTable";

import { DocumentTable } from "../table";

import { documentFixtureDataProvider } from "./documentFixtureDataProvider";

/**
 * Route-safe visual acceptance harness for the modern Document table.
 *
 * The production backend still has no canonical Document list endpoint, so the
 * protected preview route uses the deterministic fixture provider instead of
 * inventing a server contract or coupling DocumentTable to fixture data.
 *
 * A nested Refine boundary is intentional: only this preview subtree receives
 * the fixture provider. The application-wide provider remains unchanged.
 */
export interface DocumentTableFixturePreviewProps {
  readonly defaultDisplayMode?: DataTableDisplayMode;
}

export function DocumentTableFixturePreview(
  props: DocumentTableFixturePreviewProps,
) {
  const { defaultDisplayMode } = props;
  return (
    <Refine
      dataProvider={documentFixtureDataProvider}
      options={{
        disableTelemetry: true,
      }}
    >
      <DocumentTable defaultDisplayMode={defaultDisplayMode} />
    </Refine>
  );
}
