"use client";

import { useRouter } from "next/navigation";
import { states } from "@/lib/data";
import { setState, useProgress } from "@/lib/progress";
import { BASE } from "@/lib/site";

/** Grid of the 16 Bundesländer. Picking one saves it and (optionally) opens its questions. */
export function StatePicker({ navigate = true, onPicked }: { navigate?: boolean; onPicked?: (code: string) => void }) {
  const p = useProgress();
  const router = useRouter();
  return (
    <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {states.map((s) => {
        const active = p.state === s.code;
        return (
          <li key={s.code}>
            <button
              type="button"
              onClick={() => {
                setState(s.code);
                onPicked?.(s.code);
                if (navigate) router.push(`${BASE}/bundesland/${s.slug}/`);
              }}
              aria-pressed={active}
              className={`w-full min-h-14 rounded-xl border-2 px-3 text-left text-sm font-semibold flex items-center gap-2.5 ${active ? "border-flag-red bg-white" : "border-transparent bg-white hover:border-line"}`}
            >
              <span className={`size-8 shrink-0 rounded-lg grid place-items-center text-xs font-bold ${active ? "bg-flag-red text-white" : "bg-paper"}`}>{s.code}</span>
              <span className="leading-tight">{s.name}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
