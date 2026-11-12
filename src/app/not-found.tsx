import Link from "next/link";
import { BASE } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-12 pb-24 flex flex-col gap-4 items-start">
      <h1 className="font-display text-3xl font-bold">Seite nicht gefunden</h1>
      <Link href={`${BASE}/`} className="min-h-12 px-5 rounded-xl bg-ink text-white font-semibold inline-flex items-center">
        Zum Einbürgerungstest
      </Link>
    </div>
  );
}
