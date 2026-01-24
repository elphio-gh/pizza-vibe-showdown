export interface Player {
  id: string;
  username: string;
  created_at: string;
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

export type Role = 'player' | 'admin' | 'tv' | null;

export interface PizzaWithScore extends Pizza {
  averageScore: number;
  voteCount: number;
  votes: Vote[];
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
