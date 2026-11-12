export const metadata = { title: "Datenschutzerklärung", robots: { index: false } };

// TODO: Have this checked / generated (e.g. with a DSGVO generator) before going live,
// and extend it when Google login (Supabase) and AdSense are added.
export default function Datenschutz() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 pb-24 flex flex-col gap-4">
      <h1 className="font-display text-3xl font-bold">Datenschutzerklärung</h1>
      <p className="bg-gold-soft rounded-xl p-3 text-sm font-semibold">Entwurf – vor dem Start prüfen und vervollständigen.</p>
      <h2 className="font-semibold mt-2">Verantwortlicher</h2>
      <p>[NAME, ADRESSE, E-MAIL – wie im Impressum]</p>
      <h2 className="font-semibold mt-2">Lernfortschritt</h2>
      <p>
        Dein Lernfortschritt (beantwortete Fragen, Probetests, gewähltes Bundesland) wird nur lokal in deinem Browser gespeichert (localStorage). Diese Daten werden nicht an
        uns übertragen. Du kannst sie jederzeit unter „Statistik“ oder über die Browser-Einstellungen löschen.
      </p>
      <h2 className="font-semibold mt-2">Hosting</h2>
      <p>[HOSTING-ANBIETER, z. B. Cloudflare – Server-Logfiles]</p>
      <h2 className="font-semibold mt-2">Schriftarten</h2>
      <p>Die Schriftarten werden von unserem eigenen Server geladen. Es werden keine Daten an Google Fonts übertragen.</p>
    </div>
  );
}
