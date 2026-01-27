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

## 🔍 Reverse Engineering del Database

Poiché il database è stato creato magicamente da Lovable, non abbiamo scritto script SQL. Ma guardando il file `types.ts`, possiamo dedurre esattamente come ragiona il backend. Ecco lo "Schema Dedotto":

### 1. `players`
La tabella degli utenti. Non c'è un'autenticazione complessa, solo un nickname.
-   **`id`**: UUID univoco.
-   **`username`**: Il nome che appare in classifica.
-   **`is_confirmed`**: Per evitare che qualcuno entri per sbaglio.

### 2. `pizzas`
Le vere protagoniste.
-   **`brand`** & **`flavor`**: Marca e gusto (es. "Buitoni" - "Margherita").
-   **`number`**: Il numero assegnato per la degustazione alla cieca (Pizza #1, Pizza #2...).
-   **`registered_by`**: Una Foreign Key che punta a `players`. L'AI ha capito da sola che ogni pizza deve avere un "proprietario".

### 3. `votes`
Il cuore della logica di business.
-   Collega un `player_id` a una `pizza_id`.
-   Contiene i 5 voti sacri: **Aspetto, Gusto, Impasto, Farcitura, Tony Factor**.
-   Tutti campi numerici (`number`), pronti per le medie matematiche.

### 4. `tv_commands`
La magia del telecomando.
-   Questa tabella ha una sola riga che viene aggiornata costantemente.
-   L'Admin scrive qui lo stato ("WAITING", "VOTING", "REVEAL").
-   Tutti i client (TV e cellulari) ascoltano i cambiamenti su questa tabella per reagire all'unisono.

---

## 🏗️ Architettura & State Management

Perché **React + Supabase Realtime**?

Per un'app di voting live, il ritardo è il nemico. L'AI ha scelto questa stack per un motivo preciso: la **Sincronizzazione**.

### Il pattern `useEffect` + `onPostgresChanges`
Invece di chiedere al server "ci sono nuovi voti?" ogni secondo (Polling), l'app apre una WebSocket.
Quando qualcuno vota, Supabase "urla" il cambiamento a tutti i client connessi.

Nel codice troverai spesso questo pattern (generato dall'AI):

```typescript
useEffect(() => {
  const channel = supabase
    .channel('public:tv_commands')
    .on('postgres_changes', { event: 'UPDATE', table: 'tv_commands' }, (payload) => {
      // Aggiorna lo stato immediatamente!
      setTvState(payload.new.command);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, []);
```

Questo è ciò che rende l'esperienza fluida come una mozzarella filante.

---

## 🎯 Cos'è Tony Buitony Cup?

È un'app web full-stack per organizzare gare di degustazione pizza.

### ✨ Caratteristiche
-   **Regia TV**: Un'interfaccia Admin che controlla la TV in salotto.
-   **Reveal Cinematografico**: La classifica si svela dal basso verso l'alto, con suspense e musica.
-   **Calcolo Automatico**: Medie ponderate e classifiche istantanee.
-   **Space Drift**: Uno screensaver fluttuante per evitare il burn-in del tuo OLED mentre mangi.

---

## 🚀 Installazione

Vuoi far girare questo mostro di carboidrati sul tuo PC?

### Prerequisiti
-   Node.js 18+
-   Un account Supabase (gratuito)

### Setup

```bash
# 1. Clona il repo
git clone https://github.com/tuousername/pizza-vibe-showdown.git
cd pizza-vibe-showdown

# 2. Installa le dipendenze
npm install

# 3. Configura le variabili d'ambiente
# Crea un progetto su Supabase e prendi le chiavi
cp .env.example .env

# 4. Avvia il server
npm run dev
```

### 🔐 Password di Default
Per entrare nei ruoli protetti durante i test:
-   **Giocatore**: `pizza`
-   **Admin**: `alfonso`

> **Nota del Manutentore:** Se trovi un bug, ricorda: l'ha scritto un'AI. Il tuo compito non è lamentarti, ma fare da **Human Debugger**. Apri la console, leggi l'errore, e spiega all'AI come risolverlo. Benvenuto nel futuro.

---

<div align="center">

**Fatto con 🍕, 🤖 e tanto ❤️**

*"La pizza è come il codice: quando è buona, è buonissima. Quando è cattiva... è comunque pizza."*

</div>
