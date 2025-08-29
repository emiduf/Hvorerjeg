export function hentPosisjon() {
  return new Promise((resolve, reject) => {
    // Sjekk om geolokasjon er støttet
    if (!navigator.geolocation) {
      reject(new Error('Nettleseren støtter ikke geolokasjon'))
      return;
    }

    // Be om posisjon
    navigator.geolocation.hentPosisjon(
      // Sender posisjonsobjektet
      resolve,
      // Håndterer feil
      (e) => {
        if (e.code === e.PERMISSION_DENIED) {
          reject(new Error('Brukeren nektet tilgang til posisjon'))
        } else if (e.code === e.POSITION_UNAVAILABLE) {
          reject(new Error('Posisjon er utilgjengelig'))
        } else if (e.code === e.TIMEOUT) {
          reject(new Error('Tidsavbrudd ved henting av posisjon'))
        } else {
          reject(new Error('Ukjent feil ved henting av posisjon'))
        }
      },
      
      // Søker nøyaktig posisjon i maks 10 sekunder
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  });
}
   