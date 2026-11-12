# Einbürgerungstest – Wains Vlogs

Website zum Üben des Einbürgerungstests: alle 310 Fragen nach Themen (Reihenfolge der YouTube-Playlist),
160 Bundesland-Fragen, Probetest (33 Fragen, 60 Min) und Fortschritt im Browser – ohne Anmeldung.

## Apne computer par chalana

1. [Node.js](https://nodejs.org) (LTS) install karein.
2. Is folder mein terminal kholein aur chalayein:
   ```bash
   npm install
   npm run dev
   ```
3. Browser mein kholein: http://localhost:3000/einbuergerungstest/

## Sawal ya images badalna

- Sawal: `data/all-questions.modular.v1.0.1.json` (asal file). Build ke waqt `scripts/build-data.mjs`
  is se chhoti file `src/data/questions.json` banata hai. Hath se sirf asal JSON badlein.
- Images: `public/images/...` – path wahi ho jo JSON mein likha hai.

## Zaroori settings

`src/lib/site.ts`:
- `SITE_URL` – apna domain (jaise `https://www.wainsvlogs.de`)
- `YOUTUBE_URL` – apne channel ka link (khaali ho to link nahi dikhta)

Live karne se pehle `src/app/impressum/page.tsx` aur `src/app/datenschutz/page.tsx` mein apni asli maloomat bharein.

## Cloudflare Pages par live karna (free)

1. Code GitHub par push karein.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → GitHub repo chunein.
3. Settings:
   - Framework preset: **Next.js (Static HTML Export)**
   - Build command: `npm run build`
   - Output directory: `out`
4. Deploy. Har naye push par site khud update hogi.
5. Domain: Custom domains → `wainsvlogs.de` add karein.

## Struktur

- `src/app/einbuergerungstest/` – saare pages (Start, Lernen, Bundesland, Probetest, Fehler, Statistik, Frage/[nr])
- `src/components/` – QuestionView, Practice, Exam, …
- `src/lib/progress.ts` – progress browser (localStorage) mein. Baad mein Supabase se sync.

## Agla qadam

- Google-Login + Sync (Supabase)
- Ratgeber-Artikel (Markdown)
- Cookie-Banner (Google CMP) + AdSense
