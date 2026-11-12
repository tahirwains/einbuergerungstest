// Central settings. Change these in one place.

// Your domain, once bought (used for sitemap and Google). Can also be set as
// NEXT_PUBLIC_SITE_URL in Cloudflare.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.wainsvlogs.de";

// All Einbürgerungstest pages live under this folder, so that later
// /fuehrerschein or /ratgeber can sit next to it on the same domain.
export const BASE = "/einbuergerungstest";

// Your YouTube channel link. Leave empty to hide the YouTube link.
export const YOUTUBE_URL = "";

export const EXAM = {
  general: 30,
  state: 3,
  minutes: 60,
  passAt: 17,
} as const;
