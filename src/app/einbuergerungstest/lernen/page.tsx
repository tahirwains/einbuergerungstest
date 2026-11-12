import Link from "next/link";
import { ModuleList } from "@/components/Home";
import { Icon } from "@/components/Icon";
import { GENERAL_COUNT } from "@/lib/data";
import { BASE } from "@/lib/site";

export const metadata = {
  title: "Lernen – alle Fragen nach Themen",
  description: `Alle ${GENERAL_COUNT} Fragen des Einbürgerungstests in 5 Themen, in der Reihenfolge der YouTube-Playlist.`,
  alternates: { canonical: `${BASE}/lernen/` },
};

export default function LernenPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 pt-6 md:pt-10 pb-24 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Lernen</h1>
        <p className="text-muted max-w-xl">
          Alle {GENERAL_COUNT} Fragen in 5 Themen, in derselben Reihenfolge wie die Videos. Du siehst nach jeder Antwort sofort, ob sie richtig war.
        </p>
      </div>
      <ModuleList />
      <Link href={`${BASE}/fehler/`} className="self-start inline-flex items-center gap-2 min-h-12 px-4 rounded-xl bg-white border border-line font-semibold text-sm">
        <Icon name="repeat" className="size-4" /> Meine Fehler wiederholen
      </Link>
    </div>
  );
}
