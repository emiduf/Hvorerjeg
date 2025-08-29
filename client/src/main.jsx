import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Finner id=root i index.html og kobler React til denne
ReactDOM.createRoot(document.getElementById("root")).render(
  // Bruker StrictMode for å hjelpe med å finne potensielle problemer i appen
  <React.StrictMode>
    <App />
  </React.StrictMode>
);