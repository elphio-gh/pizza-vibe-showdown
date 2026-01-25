export interface Player {
  id: string;
  username: string;
  created_at: string;
  is_online: boolean;
  last_seen: string | null;
  is_confirmed: boolean;
}

export interface Pizza {
  id: string;
  number: number;
  brand: string;
  flavor: string;
  registered_by: string | null;
  created_at: string;
}

export interface Vote {
  id: string;
  pizza_id: string;
  player_id: string;
  aspetto: number;
  gusto: number;
  impasto: number;
  farcitura: number;
  tony_factor: number;
  created_at: string;
}

export interface TVCommand {
  id: string;
  command: 'waiting' | 'reveal' | 'winner' | 'next' | 'reset';
  current_position: number;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  token: string;
  player_id: string | null;
  created_at: string;
  expires_at: string;
  is_active: boolean;
}

export type Role = 'player' | 'admin' | 'tv' | null;

export interface PizzaWithScore extends Pizza {
  averageScore: number;
  voteCount: number;
  votes: Vote[];
  registeredByPlayer?: Player;
}

// Calculate weighted score for a vote
export const calculateVoteScore = (vote: Vote): number => {
  return (
    vote.aspetto * 0.15 +      // 15%
    vote.gusto * 0.30 +        // 30%
    vote.impasto * 0.20 +      // 20%
    vote.farcitura * 0.15 +    // 15%
    vote.tony_factor * 0.20    // 20%
  );
};

// Calculate average score for a pizza
export const calculatePizzaScore = (votes: Vote[]): number => {
  if (votes.length === 0) return 0;
  const totalScore = votes.reduce((acc, vote) => acc + calculateVoteScore(vote), 0);
  return totalScore / votes.length;
};

// Get ranked pizzas with tie handling
export const getRankedPizzas = (pizzasWithScores: PizzaWithScore[]): PizzaWithScore[][] => {
  if (pizzasWithScores.length === 0) return [];
  
  // Sort by score descending, then by vote count descending (secondary criteria)
  const sorted = [...pizzasWithScores].sort((a, b) => {
    if (b.averageScore !== a.averageScore) {
      return b.averageScore - a.averageScore;
    }
    // Secondary: more votes = higher rank
    return b.voteCount - a.voteCount;
  });

  // Group by score (ex aequo)
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

// Random nickname generator
const adjectives = [
  'Super', 'Mega', 'Ultra', 'Turbo', 'Hyper', 'Epic', 'Cosmic', 'Atomic',
  'Funky', 'Groovy', 'Radical', 'Gnarly', 'Bodacious', 'Tubular', 'Stellar',
  'Blazing', 'Flying', 'Dancing', 'Jumping', 'Rolling', 'Spinning', 'Zooming'
];

const nouns = [
  'Pizza', 'Slice', 'Cheese', 'Pepperoni', 'Mozzarella', 'Dough', 'Crust',
  'Tomato', 'Basil', 'Olive', 'Mushroom', 'Pepper', 'Onion', 'Anchovy',
  'Elvis', 'Tony', 'Buitony', 'Champion', 'Master', 'Legend', 'Ninja'
];

export const generateRandomNickname = (): string => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 99) + 1;
  return `${adj}${noun}${num}`;
};

// Generate session token
export const generateSessionToken = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};
