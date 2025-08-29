// leser opp tekst hvis nettleseren støtter det
export function tale(tekst) {
  if (!('speechSynthesis' in window)) return;

// Stopp eventuell pågående tale
window.speechSynthesis.cancel();

// Konfigurer tale
const utter = new SpeechSynthesisUtterance(tekst);
utter.lang = 'nb-NO';
utter.rate = 1;
utter.pitch = 1;

// Velg norsk stemme hvis tilgjengelig
const voices = window.speechSynthesis.getVoices();
const norskStemme = voices.find(voice => voice.lang === 'nb-NO');
if (norskStemme) {
  utter.voice = norskStemme;
}

  // Start tale
  window.speechSynthesis.speak(utter);

}
