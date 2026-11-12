import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Practice } from "@/components/Practice";
import { getModule, modules, questionsForModule } from "@/lib/data";
import { BASE } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const m = getModule((await params).slug);
  if (!m) return {};
  return {
    title: `${m.longTitle} – Fragen ${m.from} bis ${m.to}`,
    description: `Übe die Einbürgerungstest-Fragen ${m.from} bis ${m.to} zum Thema „${m.longTitle}“ mit sofortiger Auswertung.`,
    alternates: { canonical: `${BASE}/lernen/${m.slug}/` },
  };
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const m = getModule((await params).slug);
  if (!m) notFound();
  const ids = questionsForModule(m.id).map((q) => q.id);
  return (
    <Suspense>
      <Practice
        ids={ids}
        posKey={m.id}
        eyebrow={`Thema ${m.n} · Fragen ${m.from}–${m.to}`}
        title={m.title}
        backHref={`${BASE}/lernen/`}
        doneHref={`${BASE}/lernen/`}
        doneLabel="Nächstes Thema"
      />
    </Suspense>
  );
}
