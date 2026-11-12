export const metadata = { title: "Impressum", robots: { index: false } };

// TODO: Fill in your real details before going live (§ 5 DDG).
export default function Impressum() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 pb-24 flex flex-col gap-4">
      <h1 className="font-display text-3xl font-bold">Impressum</h1>
      <p className="bg-gold-soft rounded-xl p-3 text-sm font-semibold">Platzhalter – vor dem Start mit echten Angaben ausfüllen.</p>
      <h2 className="font-semibold mt-2">Angaben gemäß § 5 DDG</h2>
      <p>[VOR- UND NACHNAME]<br />[STRASSE UND HAUSNUMMER]<br />[PLZ ORT]</p>
      <h2 className="font-semibold mt-2">Kontakt</h2>
      <p>E-Mail: [E-MAIL-ADRESSE]</p>
      <h2 className="font-semibold mt-2">Hinweis</h2>
      <p className="text-sm text-muted">
        Die Fragen stammen aus dem Gesamtfragenkatalog „Leben in Deutschland“ des Bundesamts für Migration und Flüchtlinge (BAMF). Dies ist keine offizielle Seite des BAMF.
      </p>
    </div>
  );
}
