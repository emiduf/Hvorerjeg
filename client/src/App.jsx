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
  const [kopiert, setKopiert] = useState(false);

  // Håndterer klikk på "Hvor er jeg?"-knappen
  async function hentMinPosisjon() {
    setLaster(true); // Starter lasting
    setFeil(null);   // Nullstiller feil
    setPosisjon(null); // Nullstiller posisjon
    setAdresse(null);  // Nullstiller adresse
    setKopiert(false); // Nullstiller kopiert-status

    try {
      // Henter posisjon
      const pos = await hentPosisjon();
      setPosisjon(pos.coords);

      // Henter adresse basert på posisjon
      const data = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
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

  // Kopier adresse til utklippstavlen
  function kopierAdresse() {
    if (adresse) {
      navigator.clipboard.writeText(adresse);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 2000);
    }
  }

  const knappTekst = laster
    ? "Henter..."
    : adresse
      ? "Kopier"
      : "Finn adresse";

  const knappFarge = adresse
    ? "#bbb"
    : "crimson";

  const knappHoverFarge = adresse
    ? "#999"
    : "#b2002a";

  const knappCursor = laster
    ? "not-allowed"
    : "pointer";

  const knappOnClick = adresse
    ? kopierAdresse
    : hentMinPosisjon;

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
      <style>
        {`
          .custom-btn {
            transition: background 0.2s;
          }
          .custom-btn:not(:disabled):hover {
            background: ${knappHoverFarge} !important;
          }
        `}
      </style>
      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
        <h1
          style={{
            letterSpacing: "0.04em",
            fontSize: 44,
            marginBottom: 16,
            lineHeight: 1.2
          }}
        >
          Hvor er jeg?
        </h1>
        <p
          style={{
            fontSize: 22,
            lineHeight: 1.7,
            marginBottom: 32,
            whiteSpace: "nowrap"
          }}
        >
          Trykk for å hente nærmeste adresse. Den leses også høyt.
        </p>

        {/* Selve knappen som starter hele flyten */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <button
            onClick={knappOnClick}
            disabled={laster}
            className="custom-btn"
            style={{
              width: 340,
              height: 100,
              background: knappFarge,
              color: "white",
              fontSize: 32,
              borderRadius: 36,
              border: "none",
              boxShadow: "0 12px 32px rgba(0,0,0,.18)",
              cursor: knappCursor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {knappTekst}
          </button>
        </div>

        {/* Bekreftelse på kopiering */}
        {kopiert && (
          <div style={{ color: "green", fontSize: 20, marginBottom: 12 }}>
            Adressen er kopiert!
          </div>
        )}

        {/* Når vi har en adresse, vis den */}
        {adresse && (
          <div style={{ marginTop: 24, ariaLive: "polite" }}>
            <div
              style={{
                fontSize: 36,
                fontWeight: "bold",
                padding: "24px 0 16px 0"
              }}
            >
              Adresse:
            </div>
            <div
              style={{
                fontSize: 22,
                lineHeight: 1.7
              }}
            >
              {adresse}
            </div>
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