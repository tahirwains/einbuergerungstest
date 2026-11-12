"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getQuestion, questionLabel, type Question } from "@/lib/data";
import { getProgress, recordAnswer, setPosition, useProgress } from "@/lib/progress";
import { QuestionView } from "./QuestionView";
import { Icon } from "./Icon";

type Props = {
  ids: string[];
  posKey: string; // where to remember the last position
  eyebrow: string;
  title: string;
  backHref: string;
  doneHref: string;
  doneLabel: string;
  resume?: boolean; // continue at the last saved position
};

export function Practice({ ids, posKey, eyebrow, title, backHref, doneHref, doneLabel, resume = true }: Props) {
  const list = useMemo(() => ids.map((id) => getQuestion(id)).filter(Boolean) as Question[], [ids]);
  const progress = useProgress();
  const params = useSearchParams();
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  // Start where the user left off, or at ?f=<number> from a link.
  useEffect(() => {
    if (ready) return;
    const f = Number(params.get("f"));
    let start = 0;
    if (f) {
      const found = list.findIndex((q) => q.n === f);
      if (found >= 0) start = found;
    } else if (resume) {
      const saved = getProgress().pos[posKey];
      if (saved !== undefined) start = Math.min(saved, list.length - 1);
    }
    setIdx(start);
    setReady(true);
  }, [params, posKey, list, ready, resume]);

  const finished = idx >= list.length;
  const q = list[Math.min(idx, list.length - 1)];

  function go(to: number) {
    setPicked(null);
    setIdx(to);
    if (to < list.length) setPosition(posKey, to);
    else setPosition(posKey, 0);
    window.scrollTo({ top: 0 });
  }

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    recordAnswer(q.id, i === q.a);
  }

  if (!list.length) return null;

  const learnedHere = list.filter((x) => progress.answers[x.id]?.last === 1).length;

  return (
    <div className="mx-auto max-w-2xl pb-40 md:pb-10">
      <div className="flex items-center gap-2 px-2 md:px-0 pt-3 pb-2">
        <Link href={backHref} aria-label="Zurück" className="size-11 grid place-items-center rounded-full hover:bg-white">
          <Icon name="back" />
        </Link>
        <div className="flex-1 min-w-0 flex flex-col">
          <span className="text-xs text-muted">{eyebrow}</span>
          <span className="font-bold text-[15px] truncate">{title}</span>
        </div>
        <span className="text-xs font-semibold bg-white border border-line rounded-full px-3 py-1.5">
          {learnedHere}/{list.length} gelernt
        </span>
      </div>

      {finished ? (
        <div className="mx-4 md:mx-0 mt-4 bg-white rounded-2xl p-6 flex flex-col gap-4 items-start">
          <span className="size-12 rounded-full bg-ok-bg text-ok grid place-items-center">
            <Icon name="check" className="size-6" />
          </span>
          <h1 className="font-display text-2xl font-bold">Geschafft!</h1>
          <p className="text-muted">
            Du hast alle {list.length} Fragen durchgearbeitet. {learnedHere} davon hast du zuletzt richtig beantwortet.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <button onClick={() => go(0)} className="min-h-12 px-5 rounded-xl border border-[#d5d8dd] bg-white font-semibold">
              Nochmal von vorne
            </button>
            <Link href={doneHref} className="min-h-12 px-5 rounded-xl bg-ink text-white font-semibold inline-flex items-center">
              {doneLabel}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="px-4 md:px-0 pb-3 flex flex-col gap-2">
            <div className="flex justify-between text-[13px] text-muted">
              <span>
                <strong className="text-ink">{idx + 1}</strong> von {list.length}
              </span>
              <span>{questionLabel(q)}</span>
            </div>
            <div className="h-1.5 bg-line rounded-full overflow-hidden">
              <div className="h-full bg-ink rounded-full transition-all" style={{ width: `${((idx + 1) / list.length) * 100}%` }} />
            </div>
          </div>

          <div className={`px-4 md:px-0 ${ready ? "" : "opacity-0"}`}>
            <QuestionView key={q.id} question={q} picked={picked} reveal onPick={pick} />
          </div>

          <details className="mx-4 md:mx-0 mt-6 bg-white rounded-2xl border border-line group">
            <summary className="cursor-pointer list-none flex items-center gap-2 px-4 min-h-12 font-semibold text-sm">
              <Icon name="grid" className="size-4" /> Alle Fragen in diesem Thema
            </summary>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(44px,1fr))] gap-1.5 p-3 pt-0">
              {list.map((x, i) => {
                const a = progress.answers[x.id];
                const cls =
                  i === idx
                    ? "border-flag-red bg-white"
                    : a?.last === 1
                      ? "border-ok bg-ok-bg"
                      : a?.last === 0
                        ? "border-flag-red/40 bg-err-bg"
                        : "border-line bg-white";
                return (
                  <button key={x.id} onClick={() => go(i)} aria-label={questionLabel(x)} className={`h-11 rounded-lg border-2 text-sm font-semibold ${cls}`}>
                    {x.n}
                  </button>
                );
              })}
            </div>
          </details>

          <div className="fixed md:static bottom-16 inset-x-0 z-20 bg-white md:bg-transparent border-t md:border-0 border-line px-4 md:px-0 py-3 md:mt-6 grid grid-cols-2 gap-2.5 max-w-2xl mx-auto">
            <button
              onClick={() => go(Math.max(0, idx - 1))}
              disabled={idx === 0}
              className="min-h-12 rounded-xl border border-[#d5d8dd] bg-white font-semibold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Icon name="back" className="size-4" /> Vorherige
            </button>
            <button onClick={() => go(idx + 1)} className="min-h-12 rounded-xl bg-ink text-white font-semibold text-sm inline-flex items-center justify-center gap-2">
              {idx + 1 === list.length ? "Fertig" : "Nächste Frage"} <Icon name="next" className="size-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
