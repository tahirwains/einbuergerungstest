"use client";

import Link from "next/link";
import { useState } from "react";
import { getState } from "@/lib/data";
import { resetProgress, useHydrated, useProgress } from "@/lib/progress";
import { BASE } from "@/lib/site";
import { ModuleList, ProgressCard } from "./Home";

export function Stats() {
  const p = useProgress();
  const ready = useHydrated();
  const [confirm, setConfirm] = useState(false);
  if (!ready) return null;
  const best = p.exams.reduce((m, e) => Math.max(m, e.score), 0);
  const passed = p.exams.filter((e) => e.passed).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-[minmax(0,380px)_1fr] items-start">
        <ProgressCard />
        <section className="bg-white rounded-2xl p-5 flex flex-col gap-3">
          <h2 className="font-display text-lg font-bold">Probetests</h2>
          {p.exams.length === 0 ? (
            <p className="text-sm text-muted">
              Noch kein Probetest gemacht.{" "}
              <Link href={`${BASE}/probetest/`} className="font-semibold">
                Jetzt starten
              </Link>
            </p>
          ) : (
            <>
              <p className="text-sm text-muted">
                {p.exams.length} gemacht · {passed} bestanden · bestes Ergebnis {best}/33
              </p>
              <ul className="flex flex-col divide-y divide-line">
                {p.exams.slice(0, 10).map((e) => (
                  <li key={e.at} className="flex items-center gap-3 py-2.5 text-sm">
                    <span className={`size-2.5 rounded-full ${e.passed ? "bg-ok" : "bg-flag-red"}`} aria-hidden />
                    <span className="flex-1">
                      {new Date(e.at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })} · {getState(e.state)?.name}
                    </span>
                    <span className="font-semibold">
                      {e.score}/{e.total}
                    </span>
                    <span className={`text-xs font-semibold ${e.passed ? "text-ok-text" : "text-flag-red-dark"}`}>{e.passed ? "bestanden" : "nicht bestanden"}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg md:text-2xl font-bold">Fortschritt nach Thema</h2>
        <ModuleList />
      </section>

      <section className="bg-white rounded-2xl p-5 flex flex-col gap-3 max-w-xl">
        <h2 className="font-semibold">Fortschritt zurücksetzen</h2>
        <p className="text-sm text-muted">Löscht alle Antworten und Probetests in diesem Browser. Dein Bundesland bleibt gespeichert.</p>
        {confirm ? (
          <div className="flex flex-wrap gap-2.5">
            <button onClick={() => setConfirm(false)} className="min-h-12 px-4 rounded-xl border border-[#d5d8dd] font-semibold text-sm">
              Abbrechen
            </button>
            <button
              onClick={() => {
                resetProgress();
                setConfirm(false);
              }}
              className="min-h-12 px-4 rounded-xl bg-flag-red text-white font-semibold text-sm"
            >
              Ja, alles löschen
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirm(true)} className="self-start min-h-12 px-4 rounded-xl border border-[#d5d8dd] font-semibold text-sm">
            Zurücksetzen
          </button>
        )}
      </section>
    </div>
  );
}
