import { Stats } from "@/components/Stats";
import { BASE } from "@/lib/site";

export const metadata = {
  title: "Meine Statistik",
  alternates: { canonical: `${BASE}/statistik/` },
  robots: { index: false },
};

export default function StatistikPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 pt-6 md:pt-10 pb-24 flex flex-col gap-6">
      <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Meine Statistik</h1>
      <Stats />
    </div>
  );
}
