"use client";

// Progress is saved in the visitor's browser (localStorage), so it works
// without an account and survives closing the app. Later, when a user logs
// in, this same object will be synced to Supabase.

import { useSyncExternalStore } from "react";

export type AnswerStat = { last: 0 | 1; right: number; wrong: number; at: number };
export type ExamRecord = {
  at: number;
  score: number;
  total: number;
  passed: boolean;
  state: string;
  seconds: number;
  wrong: string[];
};

export type Progress = {
  v: 1;
  state: string | null; // chosen Bundesland code
  answers: Record<string, AnswerStat>;
  pos: Record<string, number>; // last position per module / state
  exams: ExamRecord[];
};

const KEY = "ebt-progress-v1";
const EMPTY: Progress = { v: 1, state: null, answers: {}, pos: {}, exams: [] };

let cache: Progress | null = null;
const listeners = new Set<() => void>();

function read(): Progress {
  if (cache) return cache;
  try {
    const s = window.localStorage.getItem(KEY);
    cache = s ? { ...EMPTY, ...JSON.parse(s) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache!;
}

function write(next: Progress) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage full or blocked (private mode) – keep in memory
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** True once the browser data is loaded (avoids flashing "0" on first paint). */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function recordAnswer(id: string, correct: boolean) {
  const p = read();
  const old = p.answers[id] ?? { last: 0, right: 0, wrong: 0, at: 0 };
  write({
    ...p,
    answers: {
      ...p.answers,
      [id]: {
        last: correct ? 1 : 0,
        right: old.right + (correct ? 1 : 0),
        wrong: old.wrong + (correct ? 0 : 1),
        at: Date.now(),
      },
    },
  });
}

export function setPosition(key: string, index: number) {
  const p = read();
  if (p.pos[key] === index) return;
  write({ ...p, pos: { ...p.pos, [key]: index } });
}

export function setState(code: string) {
  write({ ...read(), state: code });
}

export function addExam(rec: ExamRecord) {
  const p = read();
  write({ ...p, exams: [rec, ...p.exams].slice(0, 50) });
}

export function resetProgress() {
  write({ ...EMPTY, state: read().state });
}

export const isLearned = (p: Progress, id: string) => p.answers[id]?.last === 1;
export const isWrong = (p: Progress, id: string) => p.answers[id]?.last === 0;

/** Current progress, read directly (for use inside effects/handlers). */
export const getProgress = () => read();
