"use client";

import Link from "next/link";
import { GENERAL_COUNT, generalQuestions, getState, modules, questionsForModule, questionsForState } from "@/lib/data";
import { useHydrated, useProgress, type Progress } from "@/lib/progress";
import { BASE } from "@/lib/site";
import { Icon } from "./Icon";

function stats(p: Progress) {
  const learned = generalQuestions.filter((q) => p.answers[q.id]?.last === 1).length;
  let right = 0;
  let total = 0;
  for (const a of Object.values(p.answers)) {
    right += a.right;
    total += a.right + a.wrong;
  }
  const wrongNow = Object.values(p.answers).filter((a) => a.last === 0).length;
  return { learned, rate: total ? Math.round((right / total) * 100) : null, wrongNow };
}

export function ProgressCard() {
  const p = useProgress();
  const ready = useHydrated();
  const s = stats(p);
  const pct = Math.round((s.learned / GENERAL_COUNT) * 100);
  const state = getState(p.state);
  return (
    <section className="bg-ink text-white rounded-[20px] p-5 flex flex-col gap-4" aria-label="Dein Fortschritt">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <span className="text-[13px] text-soft">Dein Fortschritt</span>
          <span className="font-display text-3xl font-bold">
            {ready ? s.learned : "–"} <span className="text-base text-soft font-medium">/ {GENERAL_COUNT} Fragen</span>
          </span>
        </div>
        <span className="bg-gold text-ink text-xs font-bold px-2.5 py-1.5 rounded-full">{ready ? pct : 0} %</span>
      </div>
      <div className="h-2 bg-[#33363b] rounded-full overflow-hidden">
        <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${ready ? pct : 0}%` }} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col">
          <span className="text-lg font-bold">{s.rate === null ? "–" : `${s.rate} %`}</span>
          <span className="text-xs text-soft">richtig</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold">{ready ? p.exams.length : "–"}</span>
          <span className="text-xs text-soft">Probetests</span>
        </div>
        <Link href={`${BASE}/bundesland/`} className="flex flex-col hover:underline">
          <span className="text-lg font-bold truncate">{state?.name ?? "Wählen"}</span>
          <span className="text-xs text-soft">Bundesland</span>
        </Link>
      </div>
      <p className="text-xs text-soft">Dein Fortschritt wird in diesem Browser gespeichert – ohne Anmeldung.</p>
    </section>
  );
}

export function QuickActions() {
  const p = useProgress();
  const next = modules.find((m) => questionsForModule(m.id).some((q) => p.answers[q.id]?.last !== 1)) ?? modules[0];
  const pos = p.pos[next.id];
  const nextQ = questionsForModule(next.id)[pos ?? 0];
  const wrongNow = Object.values(p.answers).filter((a) => a.last === 0).length;
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <Link href={`${BASE}/probetest/`} className="bg-flag-red text-white rounded-2xl p-3.5 flex flex-col gap-2.5 min-h-24 hover:bg-flag-red-dark">
        <Icon name="timer" />
        <span className="flex flex-col">
          <span className="font-bold text-[15px]">Probetest</span>
          <span className="text-xs text-white/85">33 Fragen · 60 Min</span>
        </span>
      </Link>
      <Link href={`${BASE}/lernen/${next.slug}/`} className="bg-white border border-line text-ink rounded-2xl p-3.5 flex flex-col gap-2.5 min-h-24 hover:border-muted">
        <Icon name="next" />
        <span className="flex flex-col">
          <span className="font-bold text-[15px]">Weiterlernen</span>
          <span className="text-xs text-muted truncate">
            {next.title} · Frage {nextQ?.n ?? next.from}
          </span>
        </span>
      </Link>
      {wrongNow > 0 ? (
        <Link href={`${BASE}/fehler/`} className="col-span-2 bg-err-bg text-flag-red-dark rounded-2xl px-4 min-h-14 flex items-center gap-3 font-semibold text-sm">
          <Icon name="repeat" /> {wrongNow} {wrongNow === 1 ? "Fehler" : "Fehler"} wiederholen
          <Icon name="next" className="size-4 ml-auto" />
        </Link>
      ) : null}
    </div>
  );
}

export function ModuleList({ showState = true }: { showState?: boolean }) {
  const p = useProgress();
  const state = getState(p.state);
  const items = modules.map((m) => {
    const qs = questionsForModule(m.id);
    const done = qs.filter((q) => p.answers[q.id]?.last === 1).length;
    return { key: m.id, href: `${BASE}/lernen/${m.slug}/`, badge: String(m.n), title: m.title, done, total: qs.length, red: false };
  });
  if (showState) {
    const qs = state ? questionsForState(state.code) : [];
    items.push({
      key: "state",
      href: state ? `${BASE}/bundesland/${state.slug}/` : `${BASE}/bundesland/`,
      badge: state?.code ?? "?",
      title: state ? `Bundesland: ${state.name}` : "Bundesland wählen",
      done: qs.filter((q) => p.answers[q.id]?.last === 1).length,
      total: state ? qs.length : 10,
      red: true,
    });
  }
  return (
    <ul className="grid gap-2 md:grid-cols-2">
      {items.map((m) => (
        <li key={m.key}>
          <Link href={m.href} className="bg-white rounded-[14px] px-3 py-2.5 flex items-center gap-3 min-h-16 border border-transparent hover:border-line">
            <span
              className={`size-10 rounded-[10px] grid place-items-center font-display font-bold text-[15px] shrink-0 ${m.red ? "bg-flag-red text-white" : "bg-gold-soft text-ink"}`}
            >
              {m.badge}
            </span>
            <span className="flex-1 min-w-0 flex flex-col gap-1.5">
              <span className="flex justify-between gap-2">
                <span className="font-semibold text-sm truncate">{m.title}</span>
                <span className="text-xs text-muted shrink-0">
                  {m.done}/{m.total}
                </span>
              </span>
              <span className="h-[5px] bg-[#ecedf0] rounded-full overflow-hidden block">
                <span className="block h-full bg-ink rounded-full" style={{ width: `${(m.done / m.total) * 100}%` }} />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
