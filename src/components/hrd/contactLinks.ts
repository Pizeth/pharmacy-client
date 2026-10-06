// src/components/hrd/contactLinks.ts

import type { PublicDocumentsAddress } from "./types";

const HTTP_URL = /^https?:\/\//i;

// Telegram usernames: 5-32 characters, letters/digits/underscore,
// beginning with a letter.
const TELEGRAM_USERNAME = /^[A-Za-z][A-Za-z0-9_]{4,31}$/;

/**
 * True for links that leave the site and should open in a new tab.
 */
export function isExternalUrl(href: string): boolean {
  return HTTP_URL.test(href);
}

/**
 * Build a dialer link. Formatting characters are dropped, a leading +
 * is kept: "+855 97 824 2255" -> "tel:+855978242255".
 */
export function toTelUrl(number: string): string {
  return `tel:${number.replace(/[^\d+]/g, "")}`;
}

/**
 * Normalise a Telegram reference into an https link, or null when the
 * value is not recognised (so callers can fall back to plain text).
 *
 * Only http(s) links are passed through; any other scheme is rejected.
 */
export function toTelegramUrl(value: string): string | null {
  const trimmed = value.trim();

  if (trimmed === "") {
    return null;
  }

  if (HTTP_URL.test(trimmed)) {
    return trimmed;
  }

  if (/^(t|telegram)\.me\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  if (trimmed.startsWith("+")) {
    const digits = trimmed.replace(/\D/g, "");

    return digits.length >= 7 ? `https://t.me/+${digits}` : null;
  }

  const handle = trimmed.replace(/^@/, "");

  return TELEGRAM_USERNAME.test(handle) ? `https://t.me/${handle}` : null;
}

/**
 * Google Maps link for an address: the explicit mapUrl when it is an
 * http(s) link, otherwise a Google Maps search for the address text.
 */
export function toGoogleMapsUrl(address: PublicDocumentsAddress): string {
  const explicit = address.mapUrl?.trim();

  if (explicit && HTTP_URL.test(explicit)) {
    return explicit;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address.text,
  )}`;
}
