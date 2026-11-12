import Link from "next/link";
import { BASE } from "@/lib/site";

// wainsvlogs.de/ opens the Einbürgerungstest directly.
// Cloudflare does this with public/_redirects; this page is only a fallback.
export const metadata = { robots: { index: false }, alternates: { canonical: `${BASE}/` } };

export default function SiteHome() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-12 pb-24">
      <meta httpEquiv="refresh" content={`0; url=${BASE}/`} />
      <Link href={`${BASE}/`} className="font-semibold">
        Weiter zum Einbürgerungstest
      </Link>
    </div>
  );
}
