import { useState } from 'react';
// Henter posisjon, adresse og tale-funksjoner
import { hentPosisjon } from './lib/geo';
import { reverseGeocode } from './lib/api';
import { tale } from './lib/tts';

export default function App() {
  // State for posisjon, adresse, feil og lasting
  const [posisjon, setPosisjon] = useState(null);
  const [adresse, setAdresse] = useState(null);
  const [feil, setFeil] = useState(null);
  const [laster, setLaster] = useState(false);

  // Håndterer klikk på "Hvor er jeg?"-knappen
  async function hentMinPosisjon() {
    setLaster(true); // Starter lasting
    setFeil(null);   // Nullstiller feil
    setPosisjon(null); // Nullstiller posisjon
    setAdresse(null);  // Nullstiller adresse

    try {
      // Henter posisjon
      const pos = await hentPosisjon();
      setPosisjon(pos.coords);

      // Henter adresse basert på posisjon
      const data = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      console.log("API-respons:", data);
      setAdresse(data.adresse);

      // Leser opp adressen
      tale(`Du er nær ${data.adresse}`);
    } catch (e) {
      // Setter feil hvis noe går galt
      setFeil(e.message);
    } finally {
      setLaster(false); // Stopper lasting
    }
  }

  return (
     <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        fontFamily: "system-ui, sans-serif"
      }}
    >
      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
        <h1>Hvorerjeg?</h1>
        <p>Trykk for å hente nærmeste adresse. Den leses også høyt.</p>

        {/* Selve knappen som starter hele flyten */}
        <button
          onClick={hentMinPosisjon}
          disabled={laster}
          style={{
            padding: "18px 28px",
            fontSize: 18,
            borderRadius: 12,
            border: "none",
            boxShadow: "0 8px 24px rgba(0,0,0,.15)",
            cursor: laster ? "not-allowed" : "pointer"
          }}
        >
          {laster ? "Henter..." : "Finn adressen min"}
        </button>

        {/* Når vi har en adresse, vis den (aria-live hjelper skjermlesere) */}
        {adresse && (
          <div style={{ marginTop: 24 }} aria-live="polite">
            <strong>Adresse:</strong>
            <br />
            {adresse}
          </div>
        )}

        {/* Vis feilmeldinger i rødt om noe gikk galt */}
        {feil && (
          <div style={{ marginTop: 24, color: "crimson" }}>
            {feil}
          </div>
        )}
      </div>
    </main>
  );
}