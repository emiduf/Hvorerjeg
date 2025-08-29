export async function reverseGeocode(lat, lon) {
  // Kall til backend for å hente adresse basert på lat/lon
  const respons = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`);
  if (!respons.ok) {
    throw new Error('Feil ved henting av adresse');
  }
  return respons.json();
}