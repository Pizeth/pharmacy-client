// src/components/hrd/types.ts

/**
 * One row of the static public document directory.
 *
 * Where the file lives (first match wins when a row is activated):
 *
 * - driveUrl: opened in a new tab (Google Drive file/folder link, etc.)
 * - fileUrl:  same-origin/static file, downloaded directly
 * - neither:  a small placeholder text file is generated so the page
 *             is demoable before real files are attached
 */
export interface PublicDocumentRecord {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly fileSize: string;
  readonly lastUpdated: string;

  /**
   * Every format the document is published in, e.g. ["PDF", "DOCX"].
   *
   * At least one is required. The first entry is the primary format,
   * used to name generated placeholder downloads and as the fallback
   * extension for fileUrl downloads.
   */
  readonly fileTypes: readonly [string, ...string[]];

  readonly description: string;
  readonly driveUrl?: string;
  readonly fileUrl?: string;
}

/**
 * One person to contact by phone.
 *
 * Rendered on a single line as two independent links:
 *
 *   <name -> Telegram>  (<number -> phone call>)
 */
export interface PublicDocumentsPhoneContact {
  /** Display name. Links to Telegram when `telegram` is set. */
  readonly name?: string;

  /** Phone number, shown as written. Opens the dialer (tel:). */
  readonly number: string;

  /**
   * Telegram profile for this person. Accepts:
   *
   * - a full link:     "https://t.me/username"
   * - a short link:    "t.me/username"
   * - a handle:        "@username" or "username"
   * - a phone number:  "+85512345678" (only resolves if the person's
   *                    Telegram privacy settings allow it)
   *
   * Values that cannot be recognised are ignored, leaving the name as
   * plain text.
   */
  readonly telegram?: string;
}

export interface PublicDocumentsAddress {
  /** Address text shown in the footer. */
  readonly text: string;

  /**
   * Google Maps link for the exact place (a "Share" link or a
   * https://www.google.com/maps/... URL). When omitted, the link falls
   * back to a Google Maps search for `text`.
   */
  readonly mapUrl?: string;
}

export interface PublicDocumentsContactInfo {
  readonly address?: PublicDocumentsAddress;
  readonly phones?: readonly PublicDocumentsPhoneContact[];
  readonly email?: string;
  readonly hours?: string;
}

export interface PublicDocumentsSiteInfo {
  readonly name: string;
  readonly tagline: string;
  readonly organization: string;
  readonly contact: PublicDocumentsContactInfo;
}
