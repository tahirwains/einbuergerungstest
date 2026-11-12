import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-600.css";
import "@fontsource/space-grotesk/latin-700.css";
import "./globals.css";
import { BottomNav, Footer, Header } from "@/components/SiteChrome";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Einbürgerungstest 2026 – alle Fragen üben | Wains Vlogs",
    template: "%s | Einbürgerungstest · Wains Vlogs",
  },
  description:
    "Alle 310 Fragen und 160 Bundesland-Fragen zum Einbürgerungstest „Leben in Deutschland“, nach Themen sortiert. Mit Probetest und Fortschritt – auch ohne Anmeldung.",
};

export const viewport: Viewport = {
  themeColor: "#141414",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-dvh flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
