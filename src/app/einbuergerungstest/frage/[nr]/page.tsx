import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { generalQuestions, KEYS, modules } from "@/lib/data";
import { BASE } from "@/lib/site";

// One page per question, so people can find single questions on Google.

export const dynamicParams = false;
export function generateStaticParams() {
  return generalQuestions.map((q) => ({ nr: String(q.n) }));
}

const find = (nr: string) => generalQuestions.find((q) => String(q.n) === nr);

export async function generateMetadata({ params }: { params: Promise<{ nr: string }> }) {
  const q = find((await params).nr);
  if (!q) return {};
  const short = q.q.length > 70 ? q.q.slice(0, 67).trimEnd() + "…" : q.q;
  return {
    title: `Frage ${q.n}: ${short}`,
    description: `Einbürgerungstest Frage ${q.n}: ${q.q} Richtige Antwort: ${q.o[q.a]}.`,
    alternates: { canonical: `${BASE}/frage/${q.n}/` },
  };
}

export default async function FragePage({ params }: { params: Promise<{ nr: string }> }) {
  const q = find((await params).nr);
  if (!q) notFound();
  const mod = modules.find((m) => m.id === q.m)!;
  const i = generalQuestions.indexOf(q);
  const prev = generalQuestions[i - 1];
  const next = generalQuestions[i + 1];

  return (
    <article className="mx-auto max-w-2xl px-4 md:px-0 pt-6 md:pt-10 pb-24 flex flex-col gap-5">
      <nav aria-label="Brotkrumen" className="text-[13px] text-muted flex flex-wrap gap-1.5">
        <Link href={`${BASE}/`} className="hover:underline">Einbürgerungstest</Link>
        <span aria-hidden>/</span>
        <Link href={`${BASE}/lernen/${mod.slug}/`} className="hover:underline">{mod.title}</Link>
        <span aria-hidden>/</span>
        <span>Frage {q.n}</span>
      </nav>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-flag-red">Frage {q.n} von {generalQuestions.length}</span>
        <h1 className="font-display text-2xl md:text-[28px] leading-snug font-semibold">{q.q}</h1>
      </div>

      {q.img ? (
        <figure className="m-0 bg-white rounded-2xl p-3 border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={q.img} alt={`Abbildung zu Frage ${q.n}`} className="w-full h-auto max-h-[360px] object-contain mx-auto" />
        </figure>
      ) : null}

      <ol className="flex flex-col gap-2.5 list-none p-0 m-0">
        {q.o.map((text, k) => {
          const right = k === q.a;
          return (
            <li key={k} className={`flex items-start gap-3 px-3.5 py-3 rounded-[14px] border-2 ${right ? "border-ok bg-ok-bg" : "border-line bg-white"}`}>
              <span className={`size-7 shrink-0 rounded-lg grid place-items-center font-bold text-sm ${right ? "bg-ok text-white" : "bg-paper"}`}>{KEYS[k]}</span>
              <span className="flex-1 text-[15px] leading-snug pt-[3px]">{text}</span>
              {right ? <Icon name="check" className="size-5 mt-[3px] text-ok" label="richtige Antwort" /> : null}
            </li>
          );
        })}
      </ol>

      <p className="bg-white rounded-xl px-4 py-3 text-[15px]">
        <strong>Richtige Antwort:</strong> {KEYS[q.a]} – {q.o[q.a]}
      </p>

      <Link href={`${BASE}/lernen/${mod.slug}/?f=${q.n}`} className="min-h-12 rounded-xl bg-flag-red hover:bg-flag-red-dark text-white font-bold inline-flex items-center justify-center gap-2">
        Selbst testen <Icon name="next" className="size-4" />
      </Link>

      <div className="grid grid-cols-2 gap-2.5">
        {prev ? (
          <Link href={`${BASE}/frage/${prev.n}/`} className="min-h-12 rounded-xl bg-white border border-line font-semibold text-sm inline-flex items-center justify-center gap-2">
            <Icon name="back" className="size-4" /> Frage {prev.n}
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`${BASE}/frage/${next.n}/`} className="min-h-12 rounded-xl bg-white border border-line font-semibold text-sm inline-flex items-center justify-center gap-2">
            Frage {next.n} <Icon name="next" className="size-4" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
