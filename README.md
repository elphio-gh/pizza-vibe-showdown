# 🍕 Tony Buitony Cup

> **La sfida delle pizze surgelate** — Un'app interattiva per gare di degustazione pizza in tempo reale!

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?style=flat-square&logo=supabase)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)

---

## 🎯 Cos'è Tony Buitony Cup?

**Tony Buitony Cup** è un'applicazione web full-stack per organizzare gare di degustazione pizza in tempo reale. Perfetta per serate tra amici, eventi aziendali o qualsiasi occasione dove si vuole scoprire qual è la pizza surgelata migliore (o più trash) del gruppo!

### ✨ Caratteristiche Principali

- 🎮 **Sistema multi-ruolo** — Giocatori, Admin e TV con interfacce dedicate
- ⚡ **Tempo reale** — Votazioni e classifica aggiornate live via Supabase
- 📱 **QR Code** — I giocatori si uniscono scansionando un codice
- 🎬 **Regia TV Avanzata** — Telecomando per gestire fasi di gara, stop televoto, pausa e reveal
- 🏆 **Reveal cinematografico** — Classifica dal peggiore al vincitore con momenti di suspense
- 🎸 **Intrattenimento TV** — Schermata di attesa con citazioni divertenti e sfondo "Space Drift"
- 👤 **Proprietario visibile** — Ogni pizza mostra chi l'ha registrata
- 📲 **Navigazione mobile** — Tasto indietro del dispositivo gestito correttamente

---

## 👥 I Tre Ruoli

| Ruolo | Descrizione |
|-------|-------------|
| 🎮 **Giocatore** | Sceglie il proprio nickname, registra le proprie pizze, vota quelle degli altri su 5 categorie (Aspetto, Gusto, Impasto, Farcitura, Tony Factor) |
| 👑 **Admin** | **Il Regista**: gestisce la competizione tramite il telecomando "Regia TV". Può mettere in stop il televoto, mandare la pubblicità, e condurre il reveal finale con precisione millimetrica. |
| 📺 **TV** | Lo schermo principale: intrattiene nell'attesa con citazioni e meme, mostra lo stop al televoto, e celebra il vincitore con un reveal emozionante. |

---

## 🗳️ Sistema di Votazione

Ogni pizza viene valutata su **5 categorie** con slider da 0 a 10:

| Categoria | Descrizione |
|-----------|-------------|
| 👀 **Aspetto** | Come si presenta visivamente |
| 😋 **Gusto** | Sapore complessivo |
| 🫓 **Impasto** | Qualità della base |
| 🧀 **Farcitura** | Ingredienti e condimento |
| 🎸 **Tony Factor** | Il fattore X, il feeling, la vibrazione |

Il punteggio finale è la **media delle 5 categorie**.

---

## 🛠️ Stack Tecnologico

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Animazioni**: Framer Motion
- **Backend**: Supabase (PostgreSQL + Realtime)
- **QR Code**: react-qr-code

---

## 🚀 Guida Rapida

### Prerequisiti

- Node.js 18+
- npm o bun
- Account Supabase (gratuito)

### Installazione

```bash
# 1. Clona il repository
git clone https://github.com/tuousername/pizza-vibe-showdown.git
cd pizza-vibe-showdown

# 2. Installa le dipendenze
npm install

# 3. Configura le variabili d'ambiente
cp .env.example .env
# Modifica .env con le tue credenziali Supabase

# 4. Avvia il server di sviluppo
npm run dev
```

### Variabili d'Ambiente

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🎬 Come Funziona una Gara

## 🎬 Come Funziona una Gara

1. **Preparazione** — L'admin accede e prepara la sessione.
2. **Registrazione** — I giocatori scansionano il QR sulla TV e registrano le loro pizze.
3. **Degustazione** — Si assaggiano le pizze (anonimamente numerate).
4. **Votazione** — Ogni giocatore vota le pizze degli altri.
5. **Regia Studio** — L'admin può dichiarare lo **STOP AL TELEVOTO** o mandare la **PAUSA PUBBLICITÀ** per gestire i ritmi della serata.
6. **Reveal** — L'admin avvia la classifica: si parte dal basso, salendo verso il podio.
7. **Suspense Finale** — Prima del vincitore, un momento di tensione con "And the winner is...".
8. **Celebrazione** — Il vincitore viene svelato con gloria, confetti e musica virtuale! 🎉

---

## 📁 Struttura del Progetto

```
src/
├── components/
│   ├── admin/       # Dashboard e Regia TV
│   ├── player/      # Registrazione pizza e votazione
│   ├── tv/          # Schermate TV (Waiting, Reveal, Winner, Pause, Stop)
│   ├── effects/     # Confetti e animazioni
│   └── ui/          # Componenti shadcn/ui
├── hooks/           # Custom hooks (usePizzas, useVotes, useTVCommands...)
├── contexts/        # RoleContext per gestione ruoli
├── pages/           # Route principali
└── integrations/    # Client Supabase
```

---

## 🔐 Password di Default

| Ruolo | Password |
|-------|----------|
| Giocatore | `pizza` |
| Admin | `alfonso` |

---

## 📺 Ottimizzazione TV

L'interfaccia TV è il cuore dello show, ottimizzata per display **16:9**:
- **Attesa Intelligente**: Sfondo "Space Drift" anti burn-in con emoji fluttuanti.
- **Intrattenimento**: Carosello di citazioni divertenti (e inventate) per ingannare l'attesa.
- **Focus Visivo**: Testi grandi, contrasto elevato per leggibilità a distanza.
- **Modalità Fullscreen**: Tasto ESC per uscire.
- **Responsive**: Pulsante TV nascosto su mobile per evitare click accidentali.

---

## 🤝 Contribuire

Le pull request sono benvenute! Per modifiche importanti, apri prima una issue per discutere cosa vorresti cambiare.

---

## 📄 Licenza

MIT © 2025

---

<div align="center">

**Fatto con 🍕 e tanto ❤️ per le serate pizza tra amici**

*"La pizza è come il codice: quando è buona, è buonissima. Quando è cattiva... è comunque pizza."*

</div>
