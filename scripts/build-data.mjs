// Converts the full question dataset into a compact file the website loads.
// Run: npm run data   (also runs automatically before build)
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const file = readdirSync("data").find((f) => f.startsWith("all-questions") && f.endsWith(".json"));
// German URL slugs, e.g. "Demokratie und Wahlen" -> "demokratie-und-wahlen"
const slugify = (t) =>
  t.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const src = JSON.parse(readFileSync(`data/${file}`, "utf8"));

const modules = src.learningModules
  .filter((m) => m.isPublished)
  .sort((a, b) => a.order - b.order)
  .map((m) => ({ id: m.id, n: m.order, slug: slugify(m.shortTitleDe), title: m.shortTitleDe, longTitle: m.titleDe, from: m.startQuestion, to: m.endQuestion }));

const states = [];
const questions = src.questions
  .filter((q) => q.active !== false)
  .map((q) => {
    if (q.type === "state" && !states.find((s) => s.code === q.stateCode)) {
      states.push({ code: q.stateCode, slug: q.stateSlug, name: q.stateName });
    }
    return {
      id: q.id,
      t: q.type === "general" ? "g" : "s",
      n: q.type === "general" ? q.customOrderNumber : q.stateQuestionNumber,
      m: q.learningModuleId ?? null,
      s: q.stateCode ?? null,
      q: q.question,
      o: q.options.map((o) => o.text),
      a: q.correctAnswerIndex,
      img: q.images?.[0] ? "/" + q.images[0] : null,
      ts: q.timeSensitive ? 1 : 0,
    };
  });

states.sort((a, b) => a.name.localeCompare(b.name, "de"));
const out = { version: src.metadata.datasetVersion, modules, states, questions };
writeFileSync("src/data/questions.json", JSON.stringify(out));
console.log(`questions.json: ${questions.length} Fragen, ${modules.length} Themen, ${states.length} Bundesländer`);
