"use client";

import { Refine } from "@refinedev/core";

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
export function DocumentTableFixturePreview() {
  return (
    <Refine
      dataProvider={documentFixtureDataProvider}
      options={{
        disableTelemetry: true,
      }}
    >
      <DocumentTable />
    </Refine>
  );
}
