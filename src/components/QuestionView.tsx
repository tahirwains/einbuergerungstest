import { KEYS, type Question } from "@/lib/data";
import { Icon } from "./Icon";

type Props = {
  question: Question;
  picked: number | null;
  /** learn mode: show right/wrong after picking. exam mode: only show selection. */
  reveal: boolean;
  onPick: (index: number) => void;
};

export function QuestionView({ question, picked, reveal, onPick }: Props) {
  const answered = picked !== null;
  const isImageChoice = question.o.every((o) => /^Bild \d$/.test(o));

  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-display text-[21px] md:text-2xl leading-snug font-semibold tracking-[-0.2px] mb-1">{question.q}</h1>

      {question.img ? (
        <figure className="m-0 bg-white rounded-2xl p-3 border border-line">
          <a href={question.img} target="_blank" rel="noopener" className="block" aria-label="Bild vergrößern">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={question.img} alt="Abbildung zur Frage" className="w-full h-auto max-h-[340px] object-contain mx-auto" />
          </a>
        </figure>
      ) : null}

      <div className={isImageChoice ? "grid grid-cols-2 gap-2.5" : "flex flex-col gap-2.5"}>
        {question.o.map((text, i) => {
          const correct = i === question.a;
          const right = reveal && answered && correct;
          const wrong = reveal && answered && picked === i && !correct;
          const selected = !reveal && picked === i;
          const state = right
            ? "border-ok bg-ok-bg"
            : wrong
              ? "border-flag-red bg-err-bg"
              : selected
                ? "border-ink bg-white ring-4 ring-gold/50"
                : "border-line bg-white hover:border-muted";
          const badge = right ? "bg-ok text-white" : wrong ? "bg-flag-red text-white" : selected ? "bg-ink text-white" : "bg-paper text-ink";
          return (
            <button
              key={i}
              type="button"
              onClick={() => onPick(i)}
              disabled={reveal && answered}
              aria-pressed={picked === i}
              className={`w-full text-left flex items-start gap-3 px-3.5 py-3 min-h-14 rounded-[14px] border-2 transition-colors disabled:cursor-default ${state}`}
            >
              <span className={`size-7 shrink-0 rounded-lg grid place-items-center font-bold text-sm ${badge}`}>{KEYS[i]}</span>
              <span className={`flex-1 text-[15px] leading-snug pt-[3px] ${selected ? "font-semibold" : ""}`}>{text}</span>
              {right ? <Icon name="check" className="size-5 mt-[3px] text-ok" label="richtig" /> : null}
              {wrong ? <Icon name="x" className="size-5 mt-[3px] text-flag-red" label="falsch" /> : null}
            </button>
          );
        })}
      </div>

      {reveal && answered ? (
        <div
          role="status"
          className={`rounded-xl px-3.5 py-3 text-sm font-semibold ${picked === question.a ? "bg-ok-bg text-ok-text" : "bg-err-bg text-flag-red-dark"}`}
        >
          {picked === question.a
            ? "Richtig!"
            : `Leider falsch. Richtig ist ${KEYS[question.a]}: ${question.o[question.a]}`}
        </div>
      ) : null}

      {question.ts ? (
        <p className="text-xs text-muted">Hinweis: Diese Antwort kann sich nach Wahlen ändern. Stand: Fragenkatalog des BAMF.</p>
      ) : null}
    </div>
  );
}
