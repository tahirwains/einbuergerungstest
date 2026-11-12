import { Exam } from "@/components/Exam";
import { BASE } from "@/lib/site";

export const metadata = {
  title: "Probetest – 33 Fragen wie im echten Einbürgerungstest",
  description: "Probetest zum Einbürgerungstest: 30 allgemeine Fragen und 3 Bundesland-Fragen, 60 Minuten, Auswertung am Ende.",
  alternates: { canonical: `${BASE}/probetest/` },
};

export default function ProbetestPage() {
  return <Exam />;
}
