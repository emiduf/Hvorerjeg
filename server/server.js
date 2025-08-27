import express from 'express'; //webserver rammeverk
import cors from 'cors'; //tillater front-end å kommunisere med back-end
import dotenv from 'dotenv'; //henter miljøvariabler fra .env fil

//importerer ruten som håndterer geokoding
import reverseGeocodeRouter from './routes/reverseGeocode.js';

//leser miljøvariabler fra .env fil
dotenv.config();

//lager selve server appen
const app = express();

//bruker cors for å tillate kommunikasjon mellom front-end og back-end
app.use(cors()); 

//gjør at serveren kan lese JSON i request body
app.use(express.json()); 

//registrerer ruten for geokoding på /api/reverse-geocode endepunktet
app.use('/api/reverse-geocode', reverseGeocodeRouter);

//tester at serveren kjører
app.get("api/health", (_req, res) => res.json({ok: true}));

//bruker port fra miljøvariabler eller 3001 som default
const PORT = process.env.PORT || 3001; 

//starter serveren og kjører på valgt port
app.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT}`);
});