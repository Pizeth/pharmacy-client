// scripts/generate-tanstack-features.ts

import fs from "node:fs";
import path from "node:path";
import { stockFeatures } from "@tanstack/table-core";
import { featureAliases } from "../src/components/DataTable/core/features/featureAliases";
import type { TanStackStockFeatureSlot } from "../src/components/DataTable/core/features/featureAliases";
import { ignoredTanStackFeatures } from "../src/components/DataTable/core/features/ignoredTanStackFeatures";

/**
 * Whether the generator should verify the generated file
 * without modifying it.
 *
 * Usage:
 *
 *   tsx scripts/generate-tanstack-features.ts
 *
 * or:
 *
 *   tsx scripts/generate-tanstack-features.ts --check
 */
const checkOnly = process.argv.includes("--check");

/**
 * Project paths.
 */
const rootDir = process.cwd();

const outputPath = path.join(
  rootDir,
  "src",
  "components",
  "DataTable",
  "core",
  "features",
  "featureMap.generated.ts",
);

/**
 * Small logging helpers.
 */
function fail(message: string): never {
  console.error(`❌ ${message}`);

  process.exit(1);
}

function logCollection(title: string, values: readonly string[]): void {
  console.log(`\n${title}`);

  for (const value of values) {
    console.log(`  - ${value}`);
  }
}

/**
 * Discover all stock feature slots exported by the installed
 * TanStack's package version.
 *
 * Object.keys() returns string[] and loses the relationship
 * with keyof StockFeatures.
 *
 * Restore that relationship at this single runtime boundary.
 */
const tanstackFeatureSlots = (
  Object.keys(stockFeatures) as TanStackStockFeatureSlot[]
).sort();

if (tanstackFeatureSlots.length === 0) {
  fail("No TanStack stock features were discovered.");
}

/**
 * Public TanStack slots intentionally exposed through our stable
 * DataTable feature aliases.
 */
const exposedFeatureSlots: TanStackStockFeatureSlot[] =
  Object.values(featureAliases);

/**
 * Slots that have been reviewed but intentionally remain
 * unsupported by our public API.
 */
const ignoredFeatureSlots: TanStackStockFeatureSlot[] = [
  ...ignoredTanStackFeatures,
].sort();

/**
 * All sets intentionally use the SAME domain type.
 *
 * Do not let TypeScript infer each Set from its narrower
 * source union, otherwise Set.has() becomes incompatible
 * across exposed/ignored feature groups.
 */
const tanstackFeatureSet = new Set<TanStackStockFeatureSlot>(
  tanstackFeatureSlots,
);

const exposedFeatureSet = new Set<TanStackStockFeatureSlot>(
  exposedFeatureSlots,
);

const ignoredFeatureSet = new Set<TanStackStockFeatureSlot>(
  ignoredFeatureSlots,
);

/**
 * -----------------------------------------------------------
 * Validation 1
 *
 * Exposed aliases that no longer exist upstream.
 *
 * Every DataTable alias must point to an actual stock feature
 * exported by the installed TanStack version.
 * -----------------------------------------------------------
 */
const missingExposedFeatures = exposedFeatureSlots.filter(
  (slot) => !tanstackFeatureSet.has(slot),
);

if (missingExposedFeatures.length > 0) {
  logCollection(
    "DataTable aliases referencing missing TanStack features:",
    missingExposedFeatures,
  );

  fail(
    "One or more DataTable feature aliases are incompatible with the installed @tanstack/table-core version.",
  );
}

/**
 * -----------------------------------------------------------
 * Validation 2
 *
 * A feature must not be both exposed and ignored.
 *
 * Every ignored feature must still exist.
 *
 * This catches upstream removals/renames and prevents the
 * ignored list from silently becoming stale.
 * -----------------------------------------------------------
 */
const staleIgnoredFeatures = ignoredFeatureSlots.filter(
  (slot) => !tanstackFeatureSet.has(slot),
);

if (staleIgnoredFeatures.length > 0) {
  logCollection(
    "Ignored features no longer provided by TanStack:",
    staleIgnoredFeatures,
  );

  fail("ignoredTanStackFeatures contains obsolete feature slots.");
}

/**
 * -----------------------------------------------------------
 * Validation 3
 *
 * A feature cannot simultaneously be exposed and ignored.
 * -----------------------------------------------------------
 */
const overlappingFeatures = exposedFeatureSlots.filter((slot) =>
  ignoredFeatureSet.has(slot),
);

if (overlappingFeatures.length > 0) {
  logCollection(
    "Features that are both exposed and ignored:",
    overlappingFeatures,
  );

  fail("A TanStack feature cannot be both exposed and ignored.");
}

/**
 * -----------------------------------------------------------
 * Validation 4 — synchronization check
 *
 * Detect upstream features that have not yet been reviewed.
 *
 * This is the important future-proofing check.
 *
 * Every stock TanStack feature must belong to one of:
 *
 *   exposed
 *   ignored
 *
 * Therefore if TanStack adds a brand-new feature after an
 * upgrade, it lands in neither set and this check fails.
 *
 * That forces us to consciously review the new upstream API.
 * -----------------------------------------------------------
 */
const unreviewedFeatures = tanstackFeatureSlots.filter(
  (slot) => !exposedFeatureSet.has(slot) && !ignoredFeatureSet.has(slot),
);

if (unreviewedFeatures.length > 0) {
  logCollection(
    "🚨 New/unreviewed TanStack stock features detected:",
    unreviewedFeatures,
  );

  console.error(`
Review each feature above and choose one action:

1. Expose it through DataTable:
   Add a stable alias to featureAliases.ts

or:

2. Do not expose it yet:
   Add the TanStack slot to ignoredTanStackFeatures.ts
`);

  fail("TanStack feature synchronization requires review.");
}

/**
 * -----------------------------------------------------------
 * Generate static imports
 *
 * We only generate imports for features that DataTable
 * actually exposes.
 *
 * This is intentional.
 *
 * We do NOT ship the complete `stockFeatures` object into the
 * frontend bundle.
 * -----------------------------------------------------------
 */
const uniqueImportedFeatures = Array.from(new Set(exposedFeatureSlots)).sort();

const importLines = uniqueImportedFeatures
  .map((feature) => `  ${feature},`)
  .join("\n");

/**
 * Generate:
 *
 * sorting: {
 *   slot: "rowSortingFeature",
 *   feature: rowSortingFeature,
 * },
 */
const mapEntries = Object.entries(featureAliases)
  .map(
    ([publicName, tanstackSlot]) => `  ${publicName}: {
    slot: "${tanstackSlot}",
    feature: ${tanstackSlot},
  },`,
  )
  .join("\n\n");

const output = `// -----------------------------------------------------------------------------
// AUTO-GENERATED FILE.
//
// Generated by:
//   scripts/generate-tanstack-features.ts
//
// Source:
//   @tanstack/table-core stockFeatures
//
// DO NOT EDIT THIS FILE MANUALLY.
//
// Public DataTable feature names are defined in:
//   featureAliases.ts
//
// Intentionally unsupported TanStack features are defined in:
//   ignoredTanStackFeatures.ts
// -----------------------------------------------------------------------------

import {
${importLines}
} from "@tanstack/table-core";


/**
 * Runtime mapping between DataTable's stable public feature
 * names and the corresponding TanStack feature slots.
 *
 * This map contains only features explicitly exposed by
 * DataTable.
 */
export const featureMap = {
${mapEntries}
} as const;


/**
 * Exact generated feature map type.
 */
export type FeatureMap =
  typeof featureMap;
`;

/**
 * -----------------------------------------------------------
 * --check mode
 *
 * Useful in CI.
 *
 * It ensures:
 *
 * 1. all upstream features were reviewed
 * 2. aliases are valid
 * 3. ignored features are valid
 * 4. generated source is up to date
 * -----------------------------------------------------------
 */
if (checkOnly) {
  if (!fs.existsSync(outputPath)) {
    fail(`Generated feature map does not exist: ${outputPath}`);
  }

  const existingOutput = fs.readFileSync(outputPath, "utf8");

  if (existingOutput !== output) {
    console.error(`
❌ Generated TanStack feature map is out of date.

Run:

  npm run generate:tanstack-features
`);

    process.exit(1);
  }

  console.log(`✅ TanStack feature synchronization passed.`);

  console.log(`   ${tanstackFeatureSlots.length} stock features discovered`);

  console.log(`   ${exposedFeatureSlots.length} exposed by DataTable`);

  console.log(`   ${ignoredFeatureSlots.length} intentionally ignored`);

  if (ignoredFeatureSlots.length > 0) {
    console.log(`\nIgnored TanStack features:`);

    for (const feature of ignoredFeatureSlots) {
      console.log(`  - ${feature}`);
    }
  }

  process.exit(0);
}

/**
 * -----------------------------------------------------------
 * Write generated source.
 * -----------------------------------------------------------
 */
fs.mkdirSync(path.dirname(outputPath), {
  recursive: true,
});

fs.writeFileSync(outputPath, output, "utf8");

console.log(`✅ Generated TanStack feature map.`);

console.log(`   ${tanstackFeatureSlots.length} stock features discovered`);

console.log(`   ${exposedFeatureSlots.length} exposed by DataTable`);

console.log(`   ${ignoredFeatureSlots.length} intentionally ignored`);

if (ignoredFeatureSlots.length > 0) {
  console.log(`\nIgnored TanStack features:`);

  for (const feature of ignoredFeatureSlots) {
    console.log(`  - ${feature}`);
  }
}

console.log(`   Output: ${outputPath}`);
