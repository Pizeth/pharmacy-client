/**
 * Canonical row shape for the modern Document/FTS DataTable proof.
 *
 * This intentionally models only the fields already referenced by the
 * resource's existing semantic query contract.
 *
 * It is separate from src/components/fts/mockData.ts:
 *
 * - the legacy MRT fixture remains a UI/reference fixture
 * - this type is the resource/server-facing row contract used by the new
 *   TanStack v9 + MUI + Refine path
 */
export interface DocumentRecord {
  readonly id: number;
  readonly documentNumber: string;
  readonly title: string;
  readonly description: string | null;
  readonly status: string;
  readonly processingDays: number;
  readonly isEnabled: boolean;
  readonly createdAt: string;
}
