import raw from "@/data/questions.json";

export type Question = {
  id: string; // internal id, e.g. G082 / BY08 – never shown to users
  t: "g" | "s"; // general or state question
  n: number; // number shown to users (playlist order / state number)
  m: string | null; // learning module id
  s: string | null; // state code
  q: string;
  o: string[];
  a: number; // index of correct option
  img: string | null;
  ts: number; // 1 = answer may change after elections
};

export type Module = { id: string; n: number; slug: string; title: string; longTitle: string; from: number; to: number };
export type State = { code: string; slug: string; name: string };

const data = raw as { version: string; modules: Module[]; states: State[]; questions: Question[] };

export const DATA_VERSION = data.version;
export const modules = data.modules;
export const states = data.states;
export const questions = data.questions;

export const generalQuestions = questions.filter((q) => q.t === "g").sort((a, b) => a.n - b.n);
export const GENERAL_COUNT = generalQuestions.length;

const byId = new Map(questions.map((q) => [q.id, q]));
export const getQuestion = (id: string) => byId.get(id);

export const getModule = (slug: string) => modules.find((m) => m.slug === slug);
export const getState = (codeOrSlug: string | null | undefined) =>
  states.find((s) => s.code === codeOrSlug || s.slug === codeOrSlug);

export const questionsForModule = (moduleId: string) =>
  generalQuestions.filter((q) => q.m === moduleId);

export const questionsForState = (code: string) =>
  questions.filter((q) => q.s === code).sort((a, b) => a.n - b.n);

/** Label users see, e.g. "Frage 82" or "Bayern 8". */
export function questionLabel(q: Question) {
  if (q.t === "g") return `Frage ${q.n}`;
  return `${getState(q.s)?.name ?? q.s} ${q.n}`;
}

export const KEYS = ["A", "B", "C", "D"];
