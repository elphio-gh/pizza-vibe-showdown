import { Pizza, Vote, Player, PizzaWithScore, calculateVoteScore, calculatePizzaScore } from '@/types/database';
import { Eye, Heart, Music, Pizza as PizzaIcon, Utensils } from 'lucide-react';
import React from 'react';

// Interfaces
export interface PlayerStats {
    id: string;
    username: string;
    totalVotes: number;
    averageGiven: number;
    maxVote: number;
    minVote: number;
    pizzaRegistered: boolean;
    categoryAverages: {
        aspetto: number;
        gusto: number;
        impasto: number;
        farcitura: number;
        tony_factor: number;
    };
    votesGiven: Array<{
        pizza: { id: string; brand: string; flavor: string; emoji: string | null; number: number };
        vote: Vote;
        score: number;
    }>;
}

export interface CategoryStats {
    name: string;
    emoji: string;
    average: number;
    max: number;
    min: number;
    weight: string;
}

export interface PizzaDetailedStats {
    pizza: PizzaWithScore;
    categoryAverages: {
        aspetto: number;
        gusto: number;
        impasto: number;
        farcitura: number;
        tony_factor: number;
    };
    categoryDetails: Array<{
        name: string;
        emoji: string;
        average: number;
        min: number;
        max: number;
        votes: number[];
    }>;
}

// 1. Calculate Rankings
export const calculateRankings = (pizzas: Pizza[], votes: Vote[], players: Player[]) => {
    const pizzasWithScores: PizzaWithScore[] = pizzas.map(pizza => {
        const pizzaVotes = votes.filter(v => v.pizza_id === pizza.id);
        const registeredByPlayer = players.find(p => p.id === pizza.registered_by);
        return {
            ...pizza,
            averageScore: calculatePizzaScore(pizzaVotes),
            voteCount: pizzaVotes.length,
            votes: pizzaVotes,
            registeredByPlayer
        };
    }).sort((a, b) => b.averageScore - a.averageScore);

    return pizzasWithScores;
};

// 2. Calculate Pizza Details
export const calculatePizzaDetails = (pizzasWithScores: PizzaWithScore[]) => {
    const pizzaDetailedStats: PizzaDetailedStats[] = pizzasWithScores.map(pizza => {
        const pizzaVotes = pizza.votes;
        const categoryDetails = [
            { key: 'aspetto', name: 'Aspetto', emoji: '👀' },
            { key: 'gusto', name: 'Gusto', emoji: '😋' },
            { key: 'impasto', name: 'Impasto', emoji: '🍞' },
            { key: 'farcitura', name: 'Farcitura', emoji: '🧀' },
            { key: 'tony_factor', name: 'Tony Factor', emoji: '🎸' }
        ].map(cat => {
            const catVotes = pizzaVotes.map(v => v[cat.key as keyof Vote] as number);
            return {
                name: cat.name,
                emoji: cat.emoji,
                average: catVotes.length > 0 ? catVotes.reduce((a, b) => a + b, 0) / catVotes.length : 0,
                min: catVotes.length > 0 ? Math.min(...catVotes) : 0,
                max: catVotes.length > 0 ? Math.max(...catVotes) : 0,
                votes: catVotes
            };
        });

        return {
            pizza,
            categoryAverages: {
                aspetto: categoryDetails[0].average,
                gusto: categoryDetails[1].average,
                impasto: categoryDetails[2].average,
                farcitura: categoryDetails[3].average,
                tony_factor: categoryDetails[4].average
            },
            categoryDetails
        };
    });
    return pizzaDetailedStats;
};

// 3. Calculate Player Stats
export const calculatePlayerStats = (players: Player[], votes: Vote[], pizzas: Pizza[]) => {
    const playerStats: PlayerStats[] = players.map(player => {
        const playerVotes = votes.filter(v => v.player_id === player.id);
        const voteScores = playerVotes.map(v => calculateVoteScore(v));
        const hasPizza = pizzas.some(p => p.registered_by === player.id);

        const categoryAverages = {
            aspetto: playerVotes.length > 0 ? playerVotes.reduce((acc, v) => acc + v.aspetto, 0) / playerVotes.length : 0,
            gusto: playerVotes.length > 0 ? playerVotes.reduce((acc, v) => acc + v.gusto, 0) / playerVotes.length : 0,
            impasto: playerVotes.length > 0 ? playerVotes.reduce((acc, v) => acc + v.impasto, 0) / playerVotes.length : 0,
            farcitura: playerVotes.length > 0 ? playerVotes.reduce((acc, v) => acc + v.farcitura, 0) / playerVotes.length : 0,
            tony_factor: playerVotes.length > 0 ? playerVotes.reduce((acc, v) => acc + v.tony_factor, 0) / playerVotes.length : 0
        };

        const votesGiven = playerVotes.map(vote => {
            const pizza = pizzas.find(p => p.id === vote.pizza_id);
            return {
                pizza: pizza ? { id: pizza.id, brand: pizza.brand, flavor: pizza.flavor, emoji: pizza.emoji, number: pizza.number } : { id: '', brand: 'Unknown', flavor: '', emoji: null, number: 0 },
                vote,
                score: calculateVoteScore(vote)
            };
        }).sort((a, b) => b.score - a.score);

        return {
            id: player.id,
            username: player.username,
            totalVotes: playerVotes.length,
            averageGiven: voteScores.length > 0 ? voteScores.reduce((a, b) => a + b, 0) / voteScores.length : 0,
            maxVote: voteScores.length > 0 ? Math.max(...voteScores) : 0,
            minVote: voteScores.length > 0 ? Math.min(...voteScores) : 0,
            pizzaRegistered: hasPizza,
            categoryAverages,
            votesGiven
        };
    }).filter(p => p.totalVotes > 0).sort((a, b) => a.username.localeCompare(b.username));

    return playerStats;
};

// 4. Calculate Category Stats
export const calculateCategoryStats = (votes: Vote[]) => {
    const categoryStats: CategoryStats[] = [
        {
            name: 'Aspetto',
            emoji: '👀',
            average: votes.reduce((acc, v) => acc + v.aspetto, 0) / votes.length,
            max: Math.max(...votes.map(v => v.aspetto)),
            min: Math.min(...votes.map(v => v.aspetto)),
            weight: '15%'
        },
        {
            name: 'Gusto',
            emoji: '😋',
            average: votes.reduce((acc, v) => acc + v.gusto, 0) / votes.length,
            max: Math.max(...votes.map(v => v.gusto)),
            min: Math.min(...votes.map(v => v.gusto)),
            weight: '30%'
        },
        {
            name: 'Impasto',
            emoji: '🍞',
            average: votes.reduce((acc, v) => acc + v.impasto, 0) / votes.length,
            max: Math.max(...votes.map(v => v.impasto)),
            min: Math.min(...votes.map(v => v.impasto)),
            weight: '20%'
        },
        {
            name: 'Farcitura',
            emoji: '🧀',
            average: votes.reduce((acc, v) => acc + v.farcitura, 0) / votes.length,
            max: Math.max(...votes.map(v => v.farcitura)),
            min: Math.min(...votes.map(v => v.farcitura)),
            weight: '15%'
        },
        {
            name: 'Tony Factor',
            emoji: '🎸',
            average: votes.reduce((acc, v) => acc + v.tony_factor, 0) / votes.length,
            max: Math.max(...votes.map(v => v.tony_factor)),
            min: Math.min(...votes.map(v => v.tony_factor)),
            weight: '20%'
        }
    ];
    return categoryStats;
};

// 5. Calculate Records & Fun Facts
export const calculateRecords = (votes: Vote[], pizzas: Pizza[], players: Player[], pizzasWithScores: PizzaWithScore[], playerStats: PlayerStats[], categoryStats: CategoryStats[]) => {
    // 6. RECORD E FUN FACTS
    const allVoteScores = votes.map(v => ({ ...v, score: calculateVoteScore(v) }));
    const highestSingleVote = allVoteScores.reduce((max, v) => v.score > max.score ? v : max, allVoteScores[0]);
    const lowestSingleVote = allVoteScores.reduce((min, v) => v.score < min.score ? v : min, allVoteScores[0]);

    const mostVotedPizza = pizzasWithScores.reduce((max, p) => p.voteCount > max.voteCount ? p : max, pizzasWithScores[0]);
    const leastVotedPizza = pizzasWithScores.filter(p => p.voteCount > 0).reduce((min, p) => p.voteCount < min.voteCount ? p : min, pizzasWithScores[0]);

    const globalAverage = votes.reduce((acc, v) => acc + calculateVoteScore(v), 0) / votes.length;

    // Distribuzione voti
    const voteDistribution = Array.from({ length: 10 }, (_, i) => {
        const bucket = i + 1;
        return {
            range: `${bucket}`,
            count: allVoteScores.filter(v => {
                const roundedBucket = Math.floor(v.score);
                if (bucket === 10) {
                    return roundedBucket >= 10 || (v.score >= 9.5 && v.score < 10);
                }
                return roundedBucket === bucket || (roundedBucket === bucket - 1 && v.score >= bucket);
            }).length
        };
    });

    // Self-voters
    const selfVoters = votes.filter(v => {
        const pizza = pizzas.find(p => p.id === v.pizza_id);
        return pizza?.registered_by === v.player_id;
    });

    // Controversialità
    const pizzasWithVariance = pizzasWithScores.map(pizza => {
        if (pizza.votes.length < 2) return { ...pizza, variance: 0 };
        const scores = pizza.votes.map(v => calculateVoteScore(v));
        const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
        const variance = scores.reduce((acc, s) => acc + Math.pow(s - mean, 2), 0) / scores.length;
        return { ...pizza, variance };
    });
    const mostControversial = [...pizzasWithVariance].sort((a, b) => b.variance - a.variance)[0];
    const mostAgreed = [...pizzasWithVariance].filter(p => p.votes.length > 1).sort((a, b) => a.variance - b.variance)[0];

    // Chi ha dato il voto più polarizzato (differenza max-min più alta)
    const mostPolarizedVoter = [...playerStats].sort((a, b) => (b.maxVote - b.minVote) - (a.maxVote - a.minVote))[0];
    const mostConsistentVoter = [...playerStats].filter(p => p.totalVotes > 2).sort((a, b) => (a.maxVote - a.minVote) - (b.maxVote - b.minVote))[0];

    // Categoria più severa / più generosa per votante
    const categoryRankings = categoryStats.map(c => ({ name: c.name, emoji: c.emoji, avg: c.average })).sort((a, b) => b.avg - a.avg);
    const mostGenerouscategory = categoryRankings[0];
    const mostStingyCategory = categoryRankings[categoryRankings.length - 1];

    // MEME STATS CALCS
    const impastoSommelier = [...playerStats]
        .sort((a, b) => b.categoryAverages.impasto - a.categoryAverages.impasto)[0];

    const theAesthete = [...playerStats]
        .sort((a, b) => b.categoryAverages.aspetto - a.categoryAverages.aspetto)[0];

    const theRocker = [...playerStats]
        .sort((a, b) => b.categoryAverages.tony_factor - a.categoryAverages.tony_factor)[0];

    const theContrarian = [...playerStats].map(player => {
        const playerVotes = votes.filter(v => v.player_id === player.id);
        if (playerVotes.length === 0) return { ...player, deviation: 0 };

        const totalDeviation = playerVotes.reduce((acc, vote) => {
            const pizza = pizzasWithScores.find(p => p.id === vote.pizza_id);
            if (!pizza) return acc;
            return acc + Math.abs(calculateVoteScore(vote) - pizza.averageScore);
        }, 0);

        return { ...player, deviation: totalDeviation / playerVotes.length };
    }).sort((a, b) => b.deviation - a.deviation)[0];

    return {
        highestSingleVote,
        lowestSingleVote,
        mostVotedPizza,
        leastVotedPizza,
        globalAverage,
        voteDistribution,
        selfVoters,
        mostControversial,
        mostAgreed,
        mostPolarizedVoter,
        mostConsistentVoter,
        mostGenerouscategory,
        mostStingyCategory,
        impastoSommelier,
        theAesthete,
        theRocker,
        theContrarian
    }
}
