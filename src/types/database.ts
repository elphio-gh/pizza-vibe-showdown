// Definizione delle tipologie di dati (interfacce) utilizzate in tutta l'applicazione.
// Questo ci aiuta a evitare errori: TypeScript ci avverte se cerchiamo di usare un campo che non esiste.

// Rappresenta un utente che partecipa alla gara.
export interface Player {
  id: string;
  username: string;
  created_at: string;
  is_online: boolean;
  last_seen: string | null;
  is_confirmed: boolean;
}

// Rappresenta una pizza in gara.
export interface Pizza {
  id: string;
  number: number;      // Numero assegnato per il "blind test"
  brand: string;       // Marca (es: Buitoni)
  flavor: string;      // Gusto (es: Margherita)
  emoji: string | null; // Emoji personalizzata o assegnata
  registered_by: string | null; // ID del giocatore che l'ha portata
  created_at: string;
}

// Rappresenta un voto dato da un giocatore a una pizza.
export interface Vote {
  id: string;
  pizza_id: string;
  player_id: string;
  aspetto: number;     // Voto da 1 a 10
  gusto: number;
  impasto: number;
  farcitura: number;
  tony_factor: number; // Il tocco speciale "rock" della pizza!
  created_at: string;
}

// Comandi inviati dall'Admin per controllare cosa vede la TV.
export interface TVCommand {
  id: string;
  command: 'waiting' | 'reveal' | 'winner' | 'next' | 'reset' | 'stop_televote' | 'pause' | 'pre_winner';
  current_position: number;
  created_at: string;
  updated_at: string;
}

// Gestione della sessione di login locale.
export interface Session {
  id: string;
  token: string;
  player_id: string | null;
  created_at: string;
  expires_at: string;
  is_active: boolean;
}

export type Role = 'player' | 'admin' | 'tv' | null;

// Interfaccia estesa per includere i calcoli dei punteggi.
export interface PizzaWithScore extends Pizza {
  averageScore: number;
  voteCount: number;
  votes: Vote[];
  registeredByPlayer?: Player;
}

// LOGICA DI CALCOLO
// Calcola il punteggio pesato di un singolo voto.
// Ogni categoria ha un peso diverso (es: il gusto conta più dell'aspetto).
export const calculateVoteScore = (vote: Vote): number => {
  return (
    vote.aspetto * 0.15 +      // 15%
    vote.gusto * 0.30 +        // 30%
    vote.impasto * 0.20 +      // 20%
    vote.farcitura * 0.15 +    // 15%
    vote.tony_factor * 0.20    // 20%
  );
};

// Calcola la media dei voti per una pizza.
export const calculatePizzaScore = (votes: Vote[]): number => {
  if (votes.length === 0) return 0;
  const totalScore = votes.reduce((acc, vote) => acc + calculateVoteScore(vote), 0);
  return totalScore / votes.length;
};

// Crea la classifica finale gestendo anche i pareggi (ex aequo).
export const getRankedPizzas = (pizzasWithScores: PizzaWithScore[]): PizzaWithScore[][] => {
  if (pizzasWithScores.length === 0) return [];

  // Ordina per punteggio medio decrescente.
  const sorted = [...pizzasWithScores].sort((a, b) => {
    if (b.averageScore !== a.averageScore) {
      return b.averageScore - a.averageScore;
    }
    // In caso di parità, chi ha più voti vince.
    return b.voteCount - a.voteCount;
  });

  // Raggruppa le pizze che hanno lo stesso punteggio.
  const groups: PizzaWithScore[][] = [];
  let currentGroup: PizzaWithScore[] = [];
  let currentScore = -1;

  for (const pizza of sorted) {
    if (Math.abs(pizza.averageScore - currentScore) < 0.01) {
      currentGroup.push(pizza);
    } else {
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }
      currentGroup = [pizza];
      currentScore = pizza.averageScore;
    }
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
};

// Genera un codice casuale per la sessione dell'utente.
export const generateSessionToken = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

