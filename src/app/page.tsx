import Link from "next/link";
import { Icon } from "@/components/Icon";
import { BASE } from "@/lib/site";

// Domain start page (wainsvlogs.de). Later: Führerschein and Ratgeber sections.
export default function SiteHome() {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 pt-8 md:pt-14 pb-24 flex flex-col gap-8">
      <div className="flex flex-col gap-3 max-w-2xl">
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-tight">Wains Vlogs – Leben in Deutschland</h1>
        <p className="text-muted text-lg">Lernhilfen für den Einbürgerungstest und bald auch für den Führerschein.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Link href={`${BASE}/`} className="bg-ink text-white rounded-2xl p-6 flex flex-col gap-3 min-h-40 hover:bg-black">
          <span className="size-10 rounded-[10px] bg-gold text-ink grid place-items-center">
            <Icon name="landmark" />
          </span>
          <span className="font-display text-2xl font-bold">Einbürgerungstest</span>
          <span className="text-soft text-sm">Alle 310 Fragen nach Themen, Bundesland-Fragen und Probetest.</span>
        </Link>
        <div className="bg-white rounded-2xl p-6 flex flex-col gap-3 min-h-40 border border-line">
          <span className="size-10 rounded-[10px] bg-paper grid place-items-center">
            <Icon name="book" />
          </span>
          <span className="font-display text-2xl font-bold">Führerschein</span>
          <span className="text-muted text-sm">Bald verfügbar.</span>
        </div>
      </div>
    </div>
  );
}
