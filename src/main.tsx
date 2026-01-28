// Punto di ingresso dell'applicazione React.
// Qui colleghiamo il nostro codice al documento HTML.
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Inizializza il rendering dell'app nel contenitore con id 'root'.
createRoot(document.getElementById("root")!).render(<App />);
