# Pizza Vibe Showdown

Benvenuto a Pizza Vibe Showdown, un'applicazione interattiva in tempo reale per la valutazione di pizze.

Questo progetto permette agli utenti di partecipare a una "sfida" dove possono registrare le proprie pizze e votare quelle inviate da altri. I risultati vengono mostrati in diretta su un'interfaccia simile a una TV, gestita da un amministratore.

**URL del Progetto**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## Di cosa si tratta?

Pizza Vibe Showdown è un'applicazione full-stack creata per dimostrare funzionalità in tempo reale in modo divertente e interattivo. Si compone di tre ruoli utente principali:

*   **Giocatore**: Può unirsi a una sessione, registrare una pizza con un nome e degli ingredienti, e votare le pizze degli altri giocatori usando uno slider "vibe".
*   **Admin**: Controlla il flusso del gioco. L'admin può gestire i giocatori, le pizze, resettare il gioco e controllare cosa viene mostrato sullo schermo della TV.
*   **TV**: Uno schermo pubblico che mostra un codice QR per permettere ai giocatori di unirsi, visualizza le statistiche di voto in tempo reale e celebra il vincitore al termine della votazione.

Questo progetto è stato costruito con:

-   Vite
-   TypeScript
-   React
-   shadcn-ui
-   Tailwind CSS
-   Supabase (per il backend e il database in tempo reale)

## Struttura del Progetto

Il progetto è organizzato in diverse directory principali:

*   `src/`: Contiene tutto il codice sorgente principale per l'applicazione React.
*   `public/`: Contiene asset statici come `favicon.ico` e `robots.txt`.
*   `supabase/`: Gestisce il backend Supabase, incluse le migrazioni del database.

### Albero delle Cartelle

```
/
├───.env
├───.gitignore
├───bun.lockb
├───components.json
├───eslint.config.js
├───index.html
├───package-lock.json
├───package.json
├───postcss.config.js
├───README.md
├───tailwind.config.ts
├───tsconfig.app.json
├───tsconfig.json
├───tsconfig.node.json
├───vite.config.ts
├───vitest.config.ts
├───.git/
├───.lovable/
├───public/
│   ├───favicon.ico
│   ├───placeholder.svg
│   └───robots.txt
├───src/
│   ├───App.css
│   ├───App.tsx
│   ├───index.css
│   ├───main.tsx
│   ├───vite-env.d.ts
│   ├───components/
│   ├───contexts/
│   ├───hooks/
│   ├───integrations/
│   ├───lib/
│   ├───pages/
│   ├───test/
│   └───types/
└───supabase/
    ├───config.toml
    └───migrations/
```

### File e Directory Principali

#### Directory Radice
-   `package.json`: Elenca le dipendenze del progetto e definisce gli script per l'esecuzione, la compilazione e il test dell'applicazione (`npm run dev`, `npm run build`).
-   `vite.config.ts`: File di configurazione per Vite, lo strumento di compilazione utilizzato per questo progetto.
-   `tailwind.config.ts`: Configurazione per Tailwind CSS, utilizzato per lo stile dell'applicazione.
-   `tsconfig.json`: Opzioni del compilatore TypeScript per il progetto.
-   `index.html`: Il punto di ingresso HTML principale per la single-page application.

#### Directory `src`
-   `main.tsx`: Il punto di ingresso dell'applicazione, dove viene renderizzato il componente React radice.
-   `App.tsx`: Il componente principale dell'applicazione che imposta il routing per le diverse pagine.
-   `pages/`: Contiene i componenti di primo livello per ogni pagina/vista dell'applicazione.
    -   `Index.tsx`: La pagina di destinazione dove gli utenti selezionano il loro ruolo (Giocatore, Admin o TV).
    -   `AdminPage.tsx`: La vista principale per il ruolo di Admin.
    -   `PlayerPage.tsx`: La vista principale per il ruolo di Giocatore.
    -   `TVShowPage.tsx`: La vista principale per lo schermo TV.
-   `components/`: Contiene tutti i componenti React riutilizzabili, organizzati per funzionalità o ruolo.
    -   `admin/`: Componenti specifici per la dashboard dell'Admin.
    -   `player/`: Componenti utilizzati nella vista del Giocatore (es. schede di voto, registrazione pizza).
    -   `tv/`: Componenti per lo schermo TV (es. codice QR, celebrazione del vincitore).
    -   `shared/`: Componenti utilizzati in più parti dell'applicazione.
    -   `ui/`: Elementi UI generici forniti da `shadcn-ui` (es. Button, Card, Dialog).
-   `hooks/`: Hook personalizzati di React che incapsulano la logica di business e la gestione dello stato.
    -   `usePizzas.ts`, `usePlayers.ts`, `useVotes.ts`: Hook per interagire con il database Supabase per gestire pizze, giocatori e voti.
    -   `useTVCommands.ts`: Gestisce i comandi in tempo reale inviati dall'Admin alla TV.
-   `contexts/`: Provider di React Context per condividere lo stato globale, come il ruolo dell'utente corrente.
-   `integrations/supabase/`: Gestisce la connessione al backend Supabase.
    -   `client.ts`: Inizializza il client Supabase.
    -   `types.ts`: Definizioni di tipo TypeScript generate dallo schema del database Supabase.
-   `types/`: Tipi TypeScript specifici del progetto, in particolare per la struttura del database.

#### Directory `supabase`
-   `migrations/`: Contiene i file di migrazione SQL che definiscono lo schema del database, incluse le tabelle per `pizzas`, `players`, `votes`, e `game_sessions`.

## Come Eseguire Questo Progetto

Per lavorare su questo progetto in locale, è necessario avere Node.js e npm installati.

```sh
# Passo 1: Clona il repository.
git clone <IL_TUO_URL_GIT>

# Passo 2: Naviga nella directory del progetto.
cd pizza-vibe-showdown

# Passo 3: Installa le dipendenze necessarie.
npm i

# Passo 4: Imposta le tue variabili d'ambiente.
# Crea un file .env copiando l'esempio e inserisci i tuoi dati di Supabase.
cp .env.example .env

# Passo 5: Avvia il server di sviluppo.
npm run dev
```

## Come Eseguire il Deploy
Questo progetto è pronto per essere distribuito su servizi come Netlify, Vercel o GitHub Pages. Puoi anche distribuirlo tramite Lovable.

Apri semplicemente [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) e clicca su Share -> Publish.
