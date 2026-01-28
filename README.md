# 🍕 Tony Buitony Cup

> **La sfida delle pizze surgelate** — Un'app interattiva per gare di degustazione pizza in tempo reale!

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?style=flat-square&logo=supabase)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)

---

## 🎸 Benvenuti nel Futuro del Coding

**Attenzione:** Quest'app non è stata scritta. È stata *guidata*.

Il 100% del codice che vedi qui è stato generato dall'Intelligenza Artificiale. Non una singola riga è stata digitata manualmente da un essere umano. Questo progetto è la dimostrazione vivente che il ruolo dello sviluppatore è cambiato per sempre.

Oggi non siamo più "Typist" di sintassi. Siamo **Architetti di Sistemi**, **Prompt Engineers** e **Human Debuggers**.

---

## 🤖 Il Workflow AI

Come si costruisce un'app complessa senza scrivere codice? Ecco la ricetta segreta usata per la Tony Buitony Cup:

1.  **Genesi (Lovable.dev)**:
    -   Tutto è iniziato con una frase: *"Voglio un'app per votare le pizze surgelate con gli amici, stile Eurovision ma con più carboidrati."*
    -   Lovable ha generato l'intera UI iniziale, ha impostato il database Supabase e ha creato la prima versione funzionante in pochi minuti.

2.  **Evoluzione (Google Antigravity)**:
    -   Per le rifiniture complesse, il refactoring e la gestione dello stato avanzata, il progetto è passato nell'IDE Antigravity.
    -   Qui l'AI ha agito da "Senior Developer", riscrivendo componenti, ottimizzando i React Hooks e risolvendo bug di concorrenza.

3.  **Revisione Umana**:
    -   Il mio compito? Leggere. Capire. Verificare.
    -   **Code Review is the new Coding**. Se non capisci cosa l'AI ha scritto, non possiedi il software.

---

## 🏗️ Struttura del Progetto

Ecco come è organizzato il cuore dell'applicazione:

```text
src/
├── components/          # Componenti UI riutilizzabili
│   ├── admin/           # Pannello di controllo per la regia
│   ├── landing/         # Schermata iniziale (scelta ruolo)
│   ├── player/          # Interfaccia di voto per gli invitati
│   ├── tv/              # Visualizzazione per il grande schermo
│   └── ui/              # Componenti base (bottoni, card, etc.)
├── contexts/            # Gestione dello stato globale (Ruoli, Auth)
├── hooks/               # Logica di interazione con il database Supabase
├── integrations/        # Configurazione client Supabase
├── lib/                 # Utility varie (classi CSS, etc.)
├── pages/               # Le "Pagine" principali dell'app (Routes)
└── types/               # Definizioni TypeScript (Modelli dati)
```

### Componenti Principali

- **`TVShowView`**: Il cuore pulsante che tutti vedono. Gestisce i vari stati (Attesa, Reveal, Vincitore) con animazioni e background dinamici.
- **`VotingCard`**: L'interfaccia dove i giocatori inseriscono i voti sui 5 parametri pizza.
- **`AdminPage`**: Il telecomando dell'host per comandare la TV e gestire i partecipanti.
- **`RoleContext`**: Assicura che ogni utente veda solo ciò che gli spetta in base al suo ruolo.

---

## 🔍 Il Database (Supabase)

L'app utilizza un database relazionale Postgres con funzionalità Realtime:

- **`players`**: Lista dei partecipanti.
- **`pizzas`**: Elenco delle pizze in gara (scelta cieca tramite numeri).
- **`votes`**: I voti pesati su Aspetto, Gusto, Impasto, Farcitura e Tony Factor.
- **`tv_commands`**: Tabella di sincronizzazione per comandare tutti i client all'unisono.

---

## 🎯 Cos'è Tony Buitony Cup?

È un'app web full-stack per organizzare gare di degustazione pizza.

### ✨ Caratteristiche
-   **Regia TV**: Un'interfaccia Admin che controlla la TV in salotto.
-   **Reveal Cinematografico**: La classifica si svela dal basso verso l'alto, con suspense.
-   **Calcolo Automatico**: Medie ponderate e classifiche istantanee.
-   **Space Drift**: Screensaver fluttuante anti-burnin per gli OLED.

### 🧠 Smart Emoji System
L'app non si limita a mostrare testo. Un algoritmo intelligente analizza i gusti inseriti (es. "Diavola", "4 Formaggi") e assegna automaticamente l'emoji corretta (🌶️, 🧀).
Per i gusti sconosciuti o creativi (es. "Pizza Kebab"), un sistema di hashing deterministico assegna un'emoji cibo unica e costante, garantendo coerenza visiva senza bisogno di database aggiuntivi.

---

## 🚀 Installazione

### Setup Locale

```bash
# 1. Clona il repo
git clone https://github.com/elphio-gh/pizza-vibe-showdown.git
cd pizza-vibe-showdown

# 2. Installa le dipendenze
npm install

# 3. Configura le variabili d'ambiente (.env)
VITE_SUPABASE_URL=tua_url
VITE_SUPABASE_ANON_KEY=tua_chiave

# 4. Avvia il server
npm run dev
```

### 🔐 Accesso
Per motivi di sicurezza, le password di accesso ai ruoli sono configurate nel file `.env` o gestite tramite variabili d'ambiente su Supabase. Chiedi all'amministratore del progetto per le credenziali di test.

---

<div align="center">

**Fatto con 🍕, 🤖 e tanto ❤️ da elphio-gh**

*"La pizza è come il codice: quando è buona, è buonissima. Quando è cattiva... è comunque pizza."*

</div>
