import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Practice } from "@/components/Practice";
import { getState, questionsForState, states } from "@/lib/data";
import { BASE } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return states.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = getState((await params).slug);
  if (!s) return {};
  return {
    title: `Einbürgerungstest ${s.name} – die 10 Bundesland-Fragen`,
    description: `Die 10 Fragen zu ${s.name} aus dem Einbürgerungstest, mit Wappen- und Kartenfragen und sofortiger Auswertung.`,
    alternates: { canonical: `${BASE}/bundesland/${s.slug}/` },
  };
}

export default async function StatePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = getState((await params).slug);
  if (!s) notFound();
  const ids = questionsForState(s.code).map((q) => q.id);
  return (
    <Suspense>
      <Practice
        ids={ids}
        posKey={`state-${s.code}`}
        eyebrow="Bundesland-Fragen"
        title={s.name}
        backHref={`${BASE}/bundesland/`}
        doneHref={`${BASE}/probetest/`}
        doneLabel="Probetest starten"
      />
    </Suspense>
  );
}
