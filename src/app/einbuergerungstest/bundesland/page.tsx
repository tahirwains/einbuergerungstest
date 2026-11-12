import { StatePicker } from "@/components/StatePicker";
import { BASE } from "@/lib/site";

export const metadata = {
  title: "Bundesland-Fragen – alle 16 Bundesländer",
  description: "Die 10 Fragen zu jedem Bundesland aus dem Einbürgerungstest, inklusive Wappen- und Kartenfragen.",
  alternates: { canonical: `${BASE}/bundesland/` },
};

export default function BundeslandPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 pt-6 md:pt-10 pb-24 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">In welchem Bundesland wohnst du?</h1>
        <p className="text-muted max-w-xl">
          Im Test kommen 3 von 10 Fragen zu deinem Bundesland. Deine Auswahl wird gespeichert und auch für den Probetest verwendet.
        </p>
      </div>
      <StatePicker />
    </div>
  );
}
