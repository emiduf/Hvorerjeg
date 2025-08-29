import { Router } from "express";
import axios from "axios";

//lager en router for reverse geocoding endepunktet
const router = Router();  

router.get("/", async (req, res) => {
  //henter ut koordinater fra query parameters
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);

  //sjekker at koordinatene er gyldige tall
  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ error: "Ugyldige koordinater" });
}

  try {
    const respons = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: {format: "jsonv2", lat, lon, addressdetails: 1},
      headers: {"User-Agent": "Hvorerjeg/1.0 (github.com/emiduf/hvorerjeg)"},
      timeout: 8000, //avbryt om det tar mer enn 8 sekunder
  });

  //lesbar addresse fra responsen
  const adresse = respons.data?.display_name;

  if (!adresse) {
    return res.status(404).json({ error: "Fant ikke adressen" });
  }

  //sender respons til front-end
  res.json({
     adresse, //full streng med adressen
     components: respons.data.address ?? null, //komponenter av adressen som gate, by, postnummer osv
     provider: "Nominatim OpenStreetMap" //info for om leverandør av geokoding
  });
} catch (e) {
    res.status(502).json({ error: "Feil ved henting av adresse" });
  }
});

//eksporterer routeren for bruk i server.js
export default router;