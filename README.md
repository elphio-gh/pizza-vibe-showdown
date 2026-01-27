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
- 🏆 **Reveal cinematografico** — Classifica dal peggiore al vincitore con animazioni
- 🎸 **Stile rockettaro** — Design dark con neon, emoji e tanta ironia

---

## 👥 I Tre Ruoli

| Ruolo | Descrizione |
|-------|-------------|
| 🎮 **Giocatore** | Si unisce con username e password, registra le proprie pizze, vota quelle degli altri su 5 categorie (Aspetto, Gusto, Impasto, Farcitura, Tony Factor) |
| 👑 **Admin** | Gestisce la competizione: controlla giocatori, pizze, comanda la TV e conduce il reveal della classifica |
| 📺 **TV** | Schermo da proiettare: mostra QR per unirsi, statistiche live, classifica animata e celebrazione del vincitore |

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

1. **Preparazione** — L'admin accede e prepara la sessione
2. **Registrazione** — I giocatori scansionano il QR sulla TV e registrano le loro pizze
3. **Degustazione** — Si assaggiano le pizze (anonimamente numerate)
4. **Votazione** — Ogni giocatore vota le pizze degli altri
5. **Reveal** — L'admin avvia la classifica: dal peggiore al vincitore, una pizza alla volta
6. **Celebrazione** — Il vincitore viene celebrato con confetti e animazioni! 🎉

---

## 📁 Struttura del Progetto

```
src/
├── components/
│   ├── admin/       # Dashboard e controlli admin
│   ├── player/      # Registrazione pizza e votazione
│   ├── tv/          # Schermate TV (waiting, reveal, winner)
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

L'interfaccia TV è ottimizzata per display **16:9** e include:
- Anti burn-in con animazioni di sfondo
- Modalità fullscreen
- Tasto ESC per uscire
- 📱 Pulsante TV nascosto su mobile (visibile solo su tablet/desktop)

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
