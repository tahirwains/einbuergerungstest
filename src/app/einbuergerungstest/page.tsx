import Link from "next/link";
import { ModuleList, ProgressCard, QuickActions } from "@/components/Home";
import { GENERAL_COUNT, questions } from "@/lib/data";
import { BASE, EXAM } from "@/lib/site";

export const metadata = {
  title: { absolute: "Einbürgerungstest – alle Fragen nach Themen üben | Wains Vlogs" },
  alternates: { canonical: `${BASE}/` },
};

export default function Home() {
  const stateCount = questions.length - GENERAL_COUNT;
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 pt-5 md:pt-10 pb-24 md:pb-10 flex flex-col gap-8 md:gap-12">
      <section className="flex flex-wrap gap-6 md:gap-8 items-start">
        <div className="flex-[999_1_480px] min-w-0 flex flex-col gap-4">
          <span className="self-start bg-gold-soft text-[13px] font-bold px-3 py-1.5 rounded-full">Leben in Deutschland · Offizieller Fragenkatalog</span>
          <h1 className="font-display text-[30px] md:text-5xl leading-[1.08] tracking-[-0.5px] md:tracking-[-1px] font-bold">
            Einbürgerungstest bestehen – Thema für Thema.
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-[#3f444b] max-w-xl">
            Alle {GENERAL_COUNT} Fragen und die {stateCount} Bundesland-Fragen, sortiert wie in der YouTube-Playlist von Wains Vlogs. Mit Probetest und
            Fortschritt – auch ohne Anmeldung.
          </p>
          <div className="hidden md:flex flex-wrap gap-3">
            <Link href={`${BASE}/lernen/`} className="bg-flag-red hover:bg-flag-red-dark text-white rounded-xl px-6 py-4 font-bold">
              Alle {GENERAL_COUNT} Fragen
            </Link>
            <Link href={`${BASE}/probetest/`} className="bg-white border border-[#d5d8dd] rounded-xl px-6 py-4 font-bold">
              Probetest starten
            </Link>
          </div>
        </div>
        <div className="flex-[1_1_340px] flex flex-col gap-3">
          <ProgressCard />
          <QuickActions />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex justify-between items-baseline gap-2">
          <h2 className="font-display text-lg md:text-2xl font-bold">Themen</h2>
          <span className="text-[13px] text-muted">wie in der YouTube-Playlist</span>
        </div>
        <ModuleList />
      </section>

      <section className="bg-white rounded-2xl p-5 md:p-7 grid grid-cols-3 gap-4 max-w-3xl">
        <h2 className="col-span-3 text-sm text-muted font-semibold">So läuft der echte Test</h2>
        <div className="flex flex-col">
          <span className="font-display text-3xl font-bold text-flag-red">{EXAM.general + EXAM.state}</span>
          <span className="text-[13px] text-muted">Fragen</span>
        </div>
        <div className="flex flex-col">
          <span className="font-display text-3xl font-bold text-flag-red">{EXAM.minutes}</span>
          <span className="text-[13px] text-muted">Minuten</span>
        </div>
        <div className="flex flex-col">
          <span className="font-display text-3xl font-bold text-flag-red">{EXAM.passAt}</span>
          <span className="text-[13px] text-muted">richtig zum Bestehen</span>
        </div>
        <p className="col-span-3 text-sm text-[#3f444b]">
          {EXAM.general} allgemeine Fragen und {EXAM.state} Fragen zu deinem Bundesland, jeweils mit vier Antworten.
        </p>
      </section>
    </div>
  );
}
