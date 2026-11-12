import type { MetadataRoute } from "next";
import { generalQuestions, modules, states } from "@/lib/data";
import { BASE, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${SITE_URL}${p}`;
  return [
    { url: u("/") },
    { url: u(`${BASE}/`), priority: 1 },
    { url: u(`${BASE}/lernen/`) },
    { url: u(`${BASE}/probetest/`) },
    { url: u(`${BASE}/bundesland/`) },
    ...modules.map((m) => ({ url: u(`${BASE}/lernen/${m.slug}/`) })),
    ...states.map((s) => ({ url: u(`${BASE}/bundesland/${s.slug}/`) })),
    ...generalQuestions.map((q) => ({ url: u(`${BASE}/frage/${q.n}/`), priority: 0.5 })),
  ];
}
