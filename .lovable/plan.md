

# Piano di Sviluppo: Tony Buitony Cup

## Panoramica del Progetto

Creeremo una WebApp completa per gestire una competizione di degustazione pizze surgelate con tre ruoli distinti: Giocatore, Admin e TV Show. L'app avra' un design ispirato ai game show degli anni '90/2000 con elementi meme culture.

## Stack Tecnologico

| Componente | Tecnologia |
|------------|------------|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Backend/Database | Supabase (Lovable Cloud) |
| Real-time | Supabase Realtime Subscriptions |
| Routing | React Router DOM |
| State Management | React Context + TanStack Query |

## Schema Database Supabase

### Tabelle

```text
+------------------+     +------------------+     +------------------+
|     players      |     |      pizzas      |     |      votes       |
+------------------+     +------------------+     +------------------+
| id (uuid, PK)    |     | id (uuid, PK)    |     | id (uuid, PK)    |
| username (text)  |     | number (int)     |     | pizza_id (FK)    |
| created_at       |     | brand (text)     |     | player_id (FK)   |
|                  |     | flavor (text)    |     | aspetto (1-10)   |
|                  |     | created_at       |     | gusto (1-10)     |
|                  |     | registered_by    |     | impasto (1-10)   |
+------------------+     +------------------+     | farcitura (1-10) |
                                                  | tony_factor(1-10)|
+------------------+                              | created_at       |
|   tv_commands    |                              +------------------+
+------------------+
| id (uuid, PK)    |
| command (text)   |  -> 'waiting', 'reveal', 'winner', 'next', 'reset'
| current_position |
| created_at       |
+------------------+
```

## Struttura File del Progetto

```text
src/
├── components/
│   ├── ui/                    # shadcn components (gia' presenti)
│   ├── landing/
│   │   ├── LandingPage.tsx
│   │   ├── RoleButton.tsx
│   │   └── PasswordModal.tsx
│   ├── player/
│   │   ├── PlayerOnboarding.tsx
│   │   ├── PizzaRegistration.tsx
│   │   ├── PizzaList.tsx
│   │   ├── VotingCard.tsx
│   │   └── VoteSlider.tsx
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── PizzaManager.tsx
│   │   ├── VoteManager.tsx
│   │   └── TVController.tsx
│   ├── tv/
│   │   ├── TVShowView.tsx
│   │   ├── WaitingMode.tsx
│   │   ├── RevealMode.tsx
│   │   ├── WinnerCelebration.tsx
│   │   └── LiveStats.tsx
│   ├── shared/
│   │   ├── Navigation.tsx
│   │   ├── PizzaCard.tsx
│   │   └── ScoreDisplay.tsx
│   └── effects/
│       ├── Confetti.tsx
│       ├── ThugLifeGlasses.tsx
│       ├── SadElvis.tsx
│       └── VoteFeedback.tsx
├── contexts/
│   ├── RoleContext.tsx
│   └── PlayerContext.tsx
├── hooks/
│   ├── usePizzas.ts
│   ├── useVotes.ts
│   ├── useTVCommands.ts
│   └── useRealtimeSubscription.ts
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── pages/
│   ├── Index.tsx              # Landing Page
│   ├── PlayerPage.tsx
│   ├── AdminPage.tsx
│   ├── TVShowPage.tsx
│   └── NotFound.tsx
└── types/
    └── database.ts
```

## Fasi di Implementazione

### Fase 1: Setup Database e Infrastruttura

1. Attivare Supabase tramite Lovable Cloud
2. Creare le tabelle: `players`, `pizzas`, `votes`, `tv_commands`
3. Configurare Row Level Security (RLS) policies
4. Setup real-time subscriptions

### Fase 2: Design System "Tony Buitony"

1. Definire la palette colori neon/vibrante:
   - Arancione Pizza: `#FF6B35`
   - Giallo Crosta: `#FFD93D`
   - Blu Elettrico: `#6C63FF`
   - Rosa Neon: `#FF1493`
   - Sfondo Scuro: `#1A1A2E`

2. Creare animazioni custom:
   - Coriandoli per voti alti
   - Occhiali "Thug Life" che scendono
   - Elvis triste per voti bassi
   - Effetti glow e neon

3. Font grandi e leggibili per TV

### Fase 3: Landing Page e Navigazione

1. Tre pulsanti giganti con icone:
   - GIOCATORE (icona utente)
   - ADMIN (icona scudo/chiave)
   - TV SHOW (icona monitor)

2. Modal password per Admin e TV
3. Menu navigazione sempre visibile

### Fase 4: Modulo Giocatore

1. **Onboarding**: Input nome con validazione
2. **Registrazione Pizza**: Form marca + gusto, ID automatico
3. **Lista Pizze**: Cards cliccabili con info
4. **Scheda Voto**: 5 slider (1-10) con emoji
5. **Logica Blocco**: Dopo invio voto, sola lettura

### Fase 5: Modulo Admin

1. **Dashboard**: Overview statistiche
2. **Gestione Pizze**: CRUD completo
3. **Gestione Voti**: Visualizza/modifica/elimina
4. **Controllo TV**:
   - Pulsante "Modalita' Attesa"
   - Pulsante "Mostra Prossima"
   - Pulsante "Mostra Vincitore"
   - Pulsante "Reset Gara"

### Fase 6: Modulo TV Show

1. **Fullscreen Button**: Toggle schermo intero
2. **Modalita' Attesa**:
   - Logo animato Tony Buitony
   - Statistiche live (pizze registrate, voti totali)
   - Countdown/timer opzionale

3. **Modalita' Reveal**:
   - Classifica animata (dall'ultimo al primo)
   - Ogni pizza appare con effetto drammatico
   - Punteggio che si "conta" animato

4. **Vincitore**:
   - Esplosione coriandoli
   - Occhiali Thug Life
   - Musica vittoria (opzionale)

### Fase 7: Effetti Speciali e Feedback

1. **Voto Basso (< 5)**:
   - Emoji triste
   - Effetto "violini"
   - Elvis che piange

2. **Voto Alto (> 8)**:
   - Esplosione coriandoli
   - Occhiali Thug Life che scendono
   - Effetto "WOW" con particelle

### Fase 8: Testing e Polish

1. Test real-time sync multi-device
2. Responsive testing (mobile/tablet/TV)
3. Performance optimization
4. README.md dettagliato

## Dettagli Tecnici

### Real-time Sync con Supabase

```typescript
// Esempio di subscription real-time
const channel = supabase
  .channel('tv-commands')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'tv_commands' },
    (payload) => {
      // Aggiorna lo stato TV istantaneamente
      setTVCommand(payload.new);
    }
  )
  .subscribe();
```

### Gestione Ruoli con Context

```typescript
// RoleContext per gestire il ruolo corrente
type Role = 'player' | 'admin' | 'tv' | null;

const RoleContext = createContext<{
  role: Role;
  setRole: (role: Role) => void;
  playerName: string | null;
}>();
```

### Calcolo Punteggio Pizza

```typescript
// Media pesata dei 5 criteri
const calculateScore = (vote: Vote) => {
  return (
    vote.aspetto * 0.15 +      // 15%
    vote.gusto * 0.30 +        // 30%
    vote.impasto * 0.20 +      // 20%
    vote.farcitura * 0.15 +    // 15%
    vote.tony_factor * 0.20    // 20%
  );
};
```

## Risultato Atteso

Una WebApp divertente e funzionale che:
- Permette ai giocatori di registrare pizze e votare da mobile
- Da' all'admin controllo totale sulla competizione
- Offre uno spettacolo TV coinvolgente su grandi schermi
- Si sincronizza in tempo reale tra tutti i dispositivi
- Intrattiene con effetti visivi e riferimenti meme culture

## Note Finali

Il README includera':
- Istruzioni di installazione
- Configurazione Supabase
- Guida al deploy su Lovable
- Credenziali di default (password: "pizza")

