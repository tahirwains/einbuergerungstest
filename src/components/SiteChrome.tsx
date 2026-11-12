"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { BASE, YOUTUBE_URL } from "@/lib/site";

export function FlagStripe() {
  return (
    <div aria-hidden className="flex flex-col">
      <div className="h-1 bg-ink" />
      <div className="h-1 bg-flag-red" />
      <div className="h-1 bg-gold" />
    </div>
  );
}

const nav = [
  { href: `${BASE}/`, label: "Start", icon: "home" },
  { href: `${BASE}/lernen/`, label: "Lernen", icon: "book" },
  { href: `${BASE}/probetest/`, label: "Probetest", icon: "timer" },
  { href: `${BASE}/statistik/`, label: "Statistik", icon: "chart" },
];

function isActive(path: string, href: string) {
  if (href === `${BASE}/`) return path === href || path === BASE;
  return path.startsWith(href) || (href.endsWith("/lernen/") && (path.includes("/bundesland/") || path.includes("/fehler/")));
}

export function Header() {
  const path = usePathname() ?? "";
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-line">
      <FlagStripe />
      <div className="mx-auto max-w-6xl px-4 md:px-6 h-16 flex items-center gap-6">
        <Link href={`${BASE}/`} className="flex items-center gap-2.5 text-ink no-underline">
          <span className="size-9 rounded-[10px] bg-ink grid place-items-center text-gold">
            <Icon name="landmark" className="size-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display font-bold text-[17px]">Einbürgerungstest</span>
            <span className="text-xs text-muted">von Wains Vlogs</span>
          </span>
        </Link>
        <nav aria-label="Hauptmenü" className="hidden md:flex gap-1 flex-1">
          {nav.slice(1).map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`px-3 py-2.5 rounded-lg font-semibold text-[15px] ${isActive(path, n.href) ? "bg-paper text-ink" : "text-ink/80 hover:bg-paper"}`}
            >
              {n.label}
            </Link>
          ))}
          <Link href={`${BASE}/bundesland/`} className={`px-3 py-2.5 rounded-lg font-semibold text-[15px] ${path.includes("/bundesland/") ? "bg-paper" : "text-ink/80 hover:bg-paper"}`}>
            Bundesländer
          </Link>
        </nav>
        {YOUTUBE_URL ? (
          <a href={YOUTUBE_URL} className="hidden md:inline-flex ml-auto text-sm font-semibold text-flag-red" target="_blank" rel="noopener">
            YouTube
          </a>
        ) : null}
      </div>
    </header>
  );
}

export function BottomNav() {
  const path = usePathname() ?? "";
  return (
    <nav aria-label="Hauptmenü" className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-line grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
      {nav.map((n) => {
        const active = isActive(path, n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className={`h-16 flex flex-col items-center justify-center gap-1 text-[11px] font-semibold ${active ? "text-flag-red" : "text-muted"}`}
          >
            <Icon name={n.icon} />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-soft mt-16 pb-20 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 flex flex-wrap gap-x-7 gap-y-3 items-center text-sm">
        <span className="flex-1 basis-64 text-white font-semibold">Einbürgerungstest · Wains Vlogs</span>
        <Link href="/impressum/" className="text-white hover:underline">Impressum</Link>
        <Link href="/datenschutz/" className="text-white hover:underline">Datenschutz</Link>
        {YOUTUBE_URL ? (
          <a href={YOUTUBE_URL} className="text-gold hover:underline" target="_blank" rel="noopener">YouTube</a>
        ) : null}
        <p className="basis-full text-xs text-soft">
          Fragen: Gesamtfragenkatalog „Leben in Deutschland“ des Bundesamts für Migration und Flüchtlinge (BAMF). Keine offizielle Seite des BAMF.
        </p>
      </div>
    </footer>
  );
}
