"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { generalQuestions, getQuestion, getState, KEYS, questionLabel, questionsForState, type Question } from "@/lib/data";
import { addExam, recordAnswer, useHydrated, useProgress } from "@/lib/progress";
import { BASE, EXAM } from "@/lib/site";
import { Icon } from "./Icon";
import { QuestionView } from "./QuestionView";
import { StatePicker } from "./StatePicker";

type Running = {
  ids: string[];
  answers: (number | null)[];
  marked: boolean[];
  idx: number;
  startedAt: number;
  state: string;
};
type Result = { ids: string[]; answers: (number | null)[]; seconds: number; state: string };

const KEY = "ebt-exam-v1";
const LIMIT = EXAM.minutes * 60;

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function loadRunning(): Running | null {
  try {
    const s = localStorage.getItem(KEY);
    return s ? (JSON.parse(s) as Running) : null;
  } catch {
    return null;
  }
}
function saveRunning(r: Running | null) {
  try {
    if (r) localStorage.setItem(KEY, JSON.stringify(r));
    else localStorage.removeItem(KEY);
  } catch {}
}

const fmt = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

export function Exam() {
  const ready = useHydrated();
  const progress = useProgress();
  const [run, setRun] = useState<Running | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [saved, setSaved] = useState<Running | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const r = loadRunning();
    if (r && (Date.now() - r.startedAt) / 1000 < LIMIT) setSaved(r);
    else saveRunning(null);
  }, []);

  const update = useCallback((r: Running) => {
    setRun(r);
    saveRunning(r);
  }, []);

  const submit = useCallback((r: Running) => {
    const seconds = Math.min(LIMIT, Math.round((Date.now() - r.startedAt) / 1000));
    const qs = r.ids.map((id) => getQuestion(id)!);
    let score = 0;
    const wrong: string[] = [];
    qs.forEach((q, i) => {
      const a = r.answers[i];
      if (a === q.a) score++;
      else wrong.push(q.id);
      if (a !== null) recordAnswer(q.id, a === q.a);
    });
    addExam({ at: Date.now(), score, total: qs.length, passed: score >= EXAM.passAt, state: r.state, seconds, wrong });
    saveRunning(null);
    setRun(null);
    setConfirming(false);
    setResult({ ids: r.ids, answers: r.answers, seconds, state: r.state });
    window.scrollTo({ top: 0 });
  }, []);

  // Timer
  useEffect(() => {
    if (!run) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [run]);
  const left = run ? Math.max(0, LIMIT - (now - run.startedAt) / 1000) : LIMIT;
  useEffect(() => {
    if (run && left <= 0) submit(run);
  }, [left, run, submit]);

  function start(stateCode: string) {
    const general = shuffle(generalQuestions).slice(0, EXAM.general);
    const st = shuffle(questionsForState(stateCode)).slice(0, EXAM.state);
    const ids = [...general, ...st].map((q) => q.id);
    setResult(null);
    setSaved(null);
    setNow(Date.now());
    update({ ids, answers: ids.map(() => null), marked: ids.map(() => false), idx: 0, startedAt: Date.now(), state: stateCode });
    window.scrollTo({ top: 0 });
  }

  if (!ready) return null;

  if (result) return <ExamResult result={result} onRestart={() => start(result.state)} />;

  if (!run) {
    const state = getState(progress.state);
    return (
      <div className="mx-auto max-w-2xl px-4 md:px-0 pt-6 md:pt-10 pb-24 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Probetest</h1>
          <p className="text-muted">
            Wie im echten Test: {EXAM.general + EXAM.state} Fragen ({EXAM.general} allgemein + {EXAM.state} zu deinem Bundesland), {EXAM.minutes} Minuten Zeit.
            Bestanden ab {EXAM.passAt} richtigen Antworten. Die Lösungen siehst du erst am Ende.
          </p>
        </div>

        {saved ? (
          <div className="bg-gold-soft rounded-2xl p-4 flex flex-wrap items-center gap-3">
            <span className="flex-1 basis-56 text-sm font-semibold">
              Du hast einen Probetest angefangen ({saved.answers.filter((a) => a !== null).length} von {saved.ids.length} beantwortet).
            </span>
            <button onClick={() => { setNow(Date.now()); update(saved); setSaved(null); }} className="min-h-12 px-5 rounded-xl bg-ink text-white font-semibold">
              Fortsetzen
            </button>
          </div>
        ) : null}

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold">{state ? "Dein Bundesland" : "Wähle zuerst dein Bundesland"}</h2>
          <StatePicker navigate={false} />
        </section>

        <button
          onClick={() => state && start(state.code)}
          disabled={!state}
          className="min-h-14 rounded-xl bg-flag-red hover:bg-flag-red-dark text-white font-bold text-base inline-flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <Icon name="timer" /> {state ? `Probetest starten (${state.name})` : "Bundesland wählen"}
        </button>
      </div>
    );
  }

  const q = getQuestion(run.ids[run.idx])!;
  const answered = run.answers.filter((a) => a !== null).length;
  const open = run.ids.length - answered;
  const isState = q.t === "s";
  const setIdx = (i: number) => {
    setConfirming(false);
    update({ ...run, idx: i });
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="pb-40 md:pb-10">
      <div className="bg-ink text-white">
        <div className="mx-auto max-w-2xl px-4 md:px-0 py-2.5 flex items-center gap-2.5">
          <div className="flex-1 flex flex-col">
            <span className="text-xs text-soft">Probetest · {getState(run.state)?.name}</span>
            <span className="font-bold text-[15px]">
              Frage {run.idx + 1} von {run.ids.length}
            </span>
          </div>
          <div
            role="timer"
            aria-label={`Verbleibende Zeit ${fmt(left)}`}
            className={`flex items-center gap-1.5 rounded-full px-3 py-2 font-display font-bold ${left < 300 ? "bg-flag-red text-white" : "bg-gold text-ink"}`}
          >
            <Icon name="timer" className="size-4" />
            {fmt(left)}
          </div>
          <button onClick={() => setConfirming(true)} className="min-h-11 px-3 rounded-[10px] border border-muted font-semibold text-[13px]">
            Abgeben
          </button>
        </div>
      </div>

      <nav aria-label="Fragenübersicht" className="bg-white border-b border-line">
        <div className="mx-auto max-w-2xl flex gap-2 px-4 md:px-0 py-3 overflow-x-auto">
          {run.ids.map((id, i) => {
            const current = i === run.idx;
            const cls = current
              ? "border-flag-red bg-white"
              : run.marked[i]
                ? "border-[#e0b100] bg-gold-soft"
                : run.answers[i] !== null
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white";
            return (
              <button key={id} onClick={() => setIdx(i)} aria-label={`Frage ${i + 1}`} aria-current={current ? "step" : undefined} className={`shrink-0 size-11 rounded-xl border-2 font-bold text-sm ${cls}`}>
                {i + 1}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-4 md:px-0 pt-4 flex flex-col gap-3">
        {confirming ? (
          <div role="alertdialog" aria-label="Test abgeben" className="bg-white border-2 border-ink rounded-2xl p-4 flex flex-col gap-3">
            <p className="font-semibold">
              {open > 0 ? `Noch ${open} ${open === 1 ? "Frage" : "Fragen"} offen. Trotzdem abgeben?` : "Alle Fragen beantwortet. Test jetzt abgeben?"}
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button onClick={() => setConfirming(false)} className="min-h-12 rounded-xl border border-[#d5d8dd] bg-white font-semibold text-sm">
                Weiter bearbeiten
              </button>
              <button onClick={() => submit(run)} className="min-h-12 rounded-xl bg-flag-red text-white font-semibold text-sm">
                Abgeben
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-muted bg-line px-2 py-1 rounded-md">{isState ? "Bundesland-Frage" : "Allgemeine Frage"}</span>
          <button
            onClick={() => update({ ...run, marked: run.marked.map((m, i) => (i === run.idx ? !m : m)) })}
            aria-pressed={run.marked[run.idx]}
            className={`min-h-11 px-3 rounded-[10px] border text-[13px] font-semibold inline-flex items-center gap-1.5 ${run.marked[run.idx] ? "border-[#e0b100] bg-gold-soft" : "border-line bg-white"}`}
          >
            <Icon name="flag" className="size-4" /> {run.marked[run.idx] ? "Markiert" : "Markieren"}
          </button>
        </div>

        <QuestionView
          key={q.id}
          question={q}
          picked={run.answers[run.idx]}
          reveal={false}
          onPick={(i) => update({ ...run, answers: run.answers.map((a, k) => (k === run.idx ? i : a)) })}
        />
      </div>

      <div className="fixed md:static bottom-16 inset-x-0 z-20 bg-white md:bg-transparent border-t md:border-0 border-line px-4 md:px-0 py-3 md:mt-6 grid grid-cols-2 gap-2.5 max-w-2xl mx-auto">
        <button
          onClick={() => setIdx(Math.max(0, run.idx - 1))}
          disabled={run.idx === 0}
          className="min-h-12 rounded-xl border border-[#d5d8dd] bg-white font-semibold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <Icon name="back" className="size-4" /> Zurück
        </button>
        {run.idx + 1 < run.ids.length ? (
          <button onClick={() => setIdx(run.idx + 1)} className="min-h-12 rounded-xl bg-flag-red text-white font-semibold text-sm inline-flex items-center justify-center gap-2">
            Weiter <Icon name="next" className="size-4" />
          </button>
        ) : (
          <button onClick={() => setConfirming(true)} className="min-h-12 rounded-xl bg-ink text-white font-semibold text-sm">
            Test abgeben
          </button>
        )}
      </div>
    </div>
  );
}

function ExamResult({ result, onRestart }: { result: Result; onRestart: () => void }) {
  const qs = result.ids.map((id) => getQuestion(id)!) as Question[];
  const right = qs.filter((q, i) => result.answers[i] === q.a).length;
  const generalRight = qs.filter((q, i) => q.t === "g" && result.answers[i] === q.a).length;
  const stateRight = right - generalRight;
  const passed = right >= EXAM.passAt;
  const wrong = qs.map((q, i) => ({ q, a: result.answers[i] })).filter((x) => x.a !== x.q.a);
  const C = 2 * Math.PI * 52;

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-0 pt-6 pb-24 flex flex-col gap-4">
      <section className="bg-white rounded-[20px] p-6 flex flex-col items-center gap-3">
        <div className="relative size-[132px]">
          <svg viewBox="0 0 120 120" className="size-[132px] -rotate-90" role="img" aria-label={`${right} von ${qs.length} richtig`}>
            <circle cx="60" cy="60" r="52" fill="none" stroke="#ecedf0" strokeWidth="10" />
            <circle cx="60" cy="60" r="52" fill="none" stroke={passed ? "#0f7b4a" : "#c8102e"} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(right / qs.length) * C} ${C}`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-[34px] font-bold leading-none">{right}</span>
            <span className="text-[13px] text-muted">von {qs.length}</span>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 font-bold px-3.5 py-2 rounded-full ${passed ? "bg-ok-bg text-ok-text" : "bg-err-bg text-flag-red-dark"}`}>
          <Icon name={passed ? "check" : "x"} className="size-4" /> {passed ? "Bestanden" : "Nicht bestanden"}
        </span>
        <p className="text-sm text-muted text-center">
          Mindestens {EXAM.passAt} richtige Antworten nötig · Zeit {fmt(result.seconds)}
        </p>
      </section>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white rounded-[14px] px-4 py-3 flex flex-col">
          <span className="text-xs text-muted">Allgemein</span>
          <span className="font-display font-bold text-xl">{generalRight} / {EXAM.general}</span>
        </div>
        <div className="bg-white rounded-[14px] px-4 py-3 flex flex-col">
          <span className="text-xs text-muted">{getState(result.state)?.name}</span>
          <span className="font-display font-bold text-xl">{stateRight} / {EXAM.state}</span>
        </div>
      </div>

      {wrong.length ? (
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-lg font-bold">{wrong.length} {wrong.length === 1 ? "Fehler" : "Fehler"}</h2>
          {wrong.map(({ q, a }) => (
            <details key={q.id} className="bg-white rounded-xl">
              <summary className="cursor-pointer list-none flex gap-2.5 items-center px-3 min-h-12 py-2">
                <span className="text-xs font-bold text-flag-red-dark bg-err-bg px-1.5 py-1 rounded-md shrink-0">{questionLabel(q)}</span>
                <span className="text-[13px] leading-snug line-clamp-1">{q.q}</span>
              </summary>
              <div className="px-3 pb-3 flex flex-col gap-1.5 text-sm">
                <p className="font-semibold">{q.q}</p>
                <p className="text-flag-red-dark">Deine Antwort: {a === null ? "keine" : `${KEYS[a]} – ${q.o[a]}`}</p>
                <p className="text-ok-text font-semibold">Richtig: {KEYS[q.a]} – {q.o[q.a]}</p>
              </div>
            </details>
          ))}
        </section>
      ) : null}

      <div className="grid grid-cols-2 gap-2.5">
        <Link href={`${BASE}/fehler/`} className="min-h-12 rounded-xl border border-[#d5d8dd] bg-white font-semibold text-sm inline-flex items-center justify-center">
          Fehler wiederholen
        </Link>
        <button onClick={onRestart} className="min-h-12 rounded-xl bg-flag-red text-white font-semibold text-sm">
          Neuer Probetest
        </button>
      </div>
    </div>
  );
}
