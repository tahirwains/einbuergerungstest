"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { Practice } from "@/components/Practice";
import { questions } from "@/lib/data";
import { getProgress, useHydrated } from "@/lib/progress";
import { BASE } from "@/lib/site";

function FehlerInner() {
  // Freeze the list when the page opens, so it doesn't change while answering.
  const [ids] = useState(() => {
    const p = getProgress();
    return questions.filter((q) => p.answers[q.id]?.last === 0).map((q) => q.id);
  });

  if (!ids.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-10 pb-24 flex flex-col gap-4 items-start">
        <h1 className="font-display text-3xl font-bold">Keine Fehler</h1>
        <p className="text-muted">Super! Im Moment hast du keine falsch beantworteten Fragen. Fehler aus dem Lernen und aus Probetests landen automatisch hier.</p>
        <Link href={`${BASE}/lernen/`} className="min-h-12 px-5 rounded-xl bg-ink text-white font-semibold inline-flex items-center">
          Weiterlernen
        </Link>
      </div>
    );
  }
  return (
    <Practice
      ids={ids}
      posKey="fehler"
      resume={false}
      eyebrow="Wiederholen"
      title={`Meine Fehler (${ids.length})`}
      backHref={`${BASE}/`}
      doneHref={`${BASE}/`}
      doneLabel="Zur Startseite"
    />
  );
}

export default function FehlerPage() {
  const ready = useHydrated();
  if (!ready) return null;
  return (
    <Suspense>
      <FehlerInner />
    </Suspense>
  );
}
