// src/components/link/types.ts

/**
 * One row of the static public document directory.
 *
 * Where the file lives (first match wins when a row is activated):
 *
 * - driveUrl: opened in a new tab (Google Drive share link, etc.)
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
  readonly fileType: string;
  readonly description: string;
  readonly driveUrl?: string;
  readonly fileUrl?: string;
}

export interface PublicDocumentsContactInfo {
  readonly address?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly hours?: string;
}

export interface PublicDocumentsSiteInfo {
  readonly name: string;
  readonly tagline: string;
  readonly organization: string;
  readonly contact: PublicDocumentsContactInfo;
}
