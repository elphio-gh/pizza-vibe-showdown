// Pagina "Nerd Stats" - Statistiche dettagliate della serata
// Accessibile solo via URL diretto (/stats), non linkata da nessuna parte
import React, { useMemo, useState } from 'react';
import { usePizzas } from '@/hooks/usePizzas';
import { useVotes } from '@/hooks/useVotes';
import { usePlayers } from '@/hooks/usePlayers';
import { calculateVoteScore, calculatePizzaScore, Vote, PizzaWithScore } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Users, Pizza, BarChart3, Award, TrendingUp, TrendingDown, Star, Flame, Heart, Eye, Utensils, Music } from 'lucide-react';

// Tipi per le statistiche calcolate
interface PlayerStats {
  id: string;
  username: string;
  totalVotes: number;
  averageGiven: number;
  maxVote: number;
  minVote: number;
  pizzaRegistered: boolean;
}

interface CategoryStats {
  name: string;
  emoji: string;
  icon: React.ReactNode;
  average: number;
  max: number;
  min: number;
  weight: string;
}

const NerdStatsPage: React.FC = () => {
  const { pizzas } = usePizzas();
  const { votes } = useVotes({ disableRealtime: true }); // Disabilita realtime per risparmiare risorse
  const { players } = usePlayers();
  const [selectedTab, setSelectedTab] = useState('classifica');

  // CALCOLA TUTTE LE STATISTICHE
  const stats = useMemo(() => {
    if (!votes.length || !pizzas.length || !players.length) {
      return null;
    }

    // 1. CLASSIFICA PIZZE con punteggi
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

    // 2. STATISTICHE GIOCATORI
    const playerStats: PlayerStats[] = players.map(player => {
      const playerVotes = votes.filter(v => v.player_id === player.id);
      const voteScores = playerVotes.map(v => calculateVoteScore(v));
      const hasPizza = pizzas.some(p => p.registered_by === player.id);
      
      return {
        id: player.id,
        username: player.username,
        totalVotes: playerVotes.length,
        averageGiven: voteScores.length > 0 ? voteScores.reduce((a, b) => a + b, 0) / voteScores.length : 0,
        maxVote: voteScores.length > 0 ? Math.max(...voteScores) : 0,
        minVote: voteScores.length > 0 ? Math.min(...voteScores) : 0,
        pizzaRegistered: hasPizza
      };
    }).filter(p => p.totalVotes > 0);

    // 3. CLASSIFICHE VOTANTI
    const generousVoters = [...playerStats].sort((a, b) => b.averageGiven - a.averageGiven);
    const stingyVoters = [...playerStats].sort((a, b) => a.averageGiven - b.averageGiven);
    const mostActiveVoters = [...playerStats].sort((a, b) => b.totalVotes - a.totalVotes);

    // 4. STATISTICHE PER CATEGORIA
    const categoryStats: CategoryStats[] = [
      {
        name: 'Aspetto',
        emoji: '👀',
        icon: <Eye className="w-4 h-4" />,
        average: votes.reduce((acc, v) => acc + v.aspetto, 0) / votes.length,
        max: Math.max(...votes.map(v => v.aspetto)),
        min: Math.min(...votes.map(v => v.aspetto)),
        weight: '15%'
      },
      {
        name: 'Gusto',
        emoji: '😋',
        icon: <Heart className="w-4 h-4" />,
        average: votes.reduce((acc, v) => acc + v.gusto, 0) / votes.length,
        max: Math.max(...votes.map(v => v.gusto)),
        min: Math.min(...votes.map(v => v.gusto)),
        weight: '30%'
      },
      {
        name: 'Impasto',
        emoji: '🍞',
        icon: <Pizza className="w-4 h-4" />,
        average: votes.reduce((acc, v) => acc + v.impasto, 0) / votes.length,
        max: Math.max(...votes.map(v => v.impasto)),
        min: Math.min(...votes.map(v => v.impasto)),
        weight: '20%'
      },
      {
        name: 'Farcitura',
        emoji: '🧀',
        icon: <Utensils className="w-4 h-4" />,
        average: votes.reduce((acc, v) => acc + v.farcitura, 0) / votes.length,
        max: Math.max(...votes.map(v => v.farcitura)),
        min: Math.min(...votes.map(v => v.farcitura)),
        weight: '15%'
      },
      {
        name: 'Tony Factor',
        emoji: '🎸',
        icon: <Music className="w-4 h-4" />,
        average: votes.reduce((acc, v) => acc + v.tony_factor, 0) / votes.length,
        max: Math.max(...votes.map(v => v.tony_factor)),
        min: Math.min(...votes.map(v => v.tony_factor)),
        weight: '20%'
      }
    ];

    // 5. RECORD E FUN FACTS
    const allVoteScores = votes.map(v => ({ ...v, score: calculateVoteScore(v) }));
    const highestSingleVote = allVoteScores.reduce((max, v) => v.score > max.score ? v : max, allVoteScores[0]);
    const lowestSingleVote = allVoteScores.reduce((min, v) => v.score < min.score ? v : min, allVoteScores[0]);
    
    // Pizza con più voti
    const mostVotedPizza = pizzasWithScores.reduce((max, p) => p.voteCount > max.voteCount ? p : max, pizzasWithScores[0]);
    
    // Media globale
    const globalAverage = votes.length > 0 
      ? votes.reduce((acc, v) => acc + calculateVoteScore(v), 0) / votes.length 
      : 0;

    // Distribuzione voti (per istogramma)
    const voteDistribution = Array.from({ length: 10 }, (_, i) => {
      const min = i + 1;
      const max = i + 2;
      return {
        range: `${min}`,
        count: allVoteScores.filter(v => v.score >= min && v.score < max).length
      };
    });

    // Chi ha votato la propria pizza? (se possibile - non dovrebbe essere possibile ma check)
    const selfVoters = votes.filter(v => {
      const pizza = pizzas.find(p => p.id === v.pizza_id);
      return pizza?.registered_by === v.player_id;
    });

    // Controversialità: pizza con più varianza nei voti
    const pizzasWithVariance = pizzasWithScores.map(pizza => {
      if (pizza.votes.length < 2) return { ...pizza, variance: 0 };
      const scores = pizza.votes.map(v => calculateVoteScore(v));
      const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
      const variance = scores.reduce((acc, s) => acc + Math.pow(s - mean, 2), 0) / scores.length;
      return { ...pizza, variance };
    });
    const mostControversial = [...pizzasWithVariance].sort((a, b) => b.variance - a.variance)[0];
    const mostAgreed = [...pizzasWithVariance].filter(p => p.votes.length > 1).sort((a, b) => a.variance - b.variance)[0];

    return {
      pizzasWithScores,
      playerStats,
      generousVoters,
      stingyVoters,
      mostActiveVoters,
      categoryStats,
      highestSingleVote,
      lowestSingleVote,
      mostVotedPizza,
      globalAverage,
      voteDistribution,
      selfVoters,
      mostControversial,
      mostAgreed,
      totalVotes: votes.length,
      totalPizzas: pizzas.length,
      totalPlayers: players.length,
      participatingPlayers: playerStats.length
    };
  }, [pizzas, votes, players]);

  // Loading state
  if (!stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="font-russo text-muted-foreground">Caricamento statistiche...</p>
        </div>
      </div>
    );
  }

  // No data state
  if (stats.totalVotes === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🍕❓</div>
          <h2 className="font-display text-2xl text-primary mb-2">Nessun dato!</h2>
          <p className="font-russo text-muted-foreground">Non ci sono ancora voti da analizzare.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <div className="text-center">
          <h1 className="font-display text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            📊 NERD STATS 🤓
          </h1>
          <p className="font-russo text-xs text-muted-foreground mt-1">
            Tony Buitony Cup Analytics
          </p>
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="grid grid-cols-4 gap-2 p-4 bg-card/50">
        <div className="text-center">
          <div className="text-2xl font-display text-primary">{stats.totalPizzas}</div>
          <div className="text-[10px] text-muted-foreground font-russo">Pizze</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-display text-secondary">{stats.totalVotes}</div>
          <div className="text-[10px] text-muted-foreground font-russo">Voti</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-display text-accent">{stats.participatingPlayers}</div>
          <div className="text-[10px] text-muted-foreground font-russo">Votanti</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-display text-destructive">{stats.globalAverage.toFixed(1)}</div>
          <div className="text-[10px] text-muted-foreground font-russo">Media</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="px-4">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="classifica" className="text-xs px-2">🏆</TabsTrigger>
          <TabsTrigger value="votanti" className="text-xs px-2">👥</TabsTrigger>
          <TabsTrigger value="categorie" className="text-xs px-2">📈</TabsTrigger>
          <TabsTrigger value="records" className="text-xs px-2">🎯</TabsTrigger>
        </TabsList>

        {/* TAB 1: CLASSIFICA */}
        <TabsContent value="classifica" className="space-y-3">
          <h2 className="font-display text-lg text-primary flex items-center gap-2">
            <Trophy className="w-5 h-5" /> Classifica Finale
          </h2>
          
          {stats.pizzasWithScores.map((pizza, index) => (
            <Card key={pizza.id} className={`${index === 0 ? 'border-primary box-glow-orange' : ''}`}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-display text-primary min-w-[2rem] text-center">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{pizza.emoji || '🍕'}</span>
                      <div className="truncate">
                        <div className="font-russo text-sm truncate">{pizza.brand} - {pizza.flavor}</div>
                        <div className="text-[10px] text-muted-foreground">
                          Pizza #{pizza.number} • {pizza.voteCount} voti
                          {pizza.registeredByPlayer && (
                            <span className="text-primary"> • {pizza.registeredByPlayer.username}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl text-secondary">{pizza.averageScore.toFixed(2)}</div>
                    <div className="text-[10px] text-muted-foreground">pts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* TAB 2: VOTANTI */}
        <TabsContent value="votanti" className="space-y-4">
          {/* I più generosi */}
          <div>
            <h3 className="font-display text-sm text-primary flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4" /> 🎁 I Più Generosi
            </h3>
            <div className="space-y-2">
              {stats.generousVoters.slice(0, 5).map((player, index) => (
                <Card key={player.id} className="bg-card/50">
                  <CardContent className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{index === 0 ? '💖' : index === 1 ? '💕' : '❤️'}</span>
                      <span className="font-russo text-sm">{player.username}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-primary">{player.averageGiven.toFixed(2)}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">avg</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* I più tirchi */}
          <div>
            <h3 className="font-display text-sm text-destructive flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4" /> 😤 I Più Tirchi
            </h3>
            <div className="space-y-2">
              {stats.stingyVoters.slice(0, 5).map((player, index) => (
                <Card key={player.id} className="bg-card/50">
                  <CardContent className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{index === 0 ? '🧊' : index === 1 ? '❄️' : '🥶'}</span>
                      <span className="font-russo text-sm">{player.username}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-destructive">{player.averageGiven.toFixed(2)}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">avg</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* I più attivi */}
          <div>
            <h3 className="font-display text-sm text-accent flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4" /> 🔥 I Più Attivi
            </h3>
            <div className="space-y-2">
              {stats.mostActiveVoters.slice(0, 5).map((player, index) => (
                <Card key={player.id} className="bg-card/50">
                  <CardContent className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{index === 0 ? '🚀' : index === 1 ? '⚡' : '💨'}</span>
                      <span className="font-russo text-sm">{player.username}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-accent">{player.totalVotes}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">voti</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: CATEGORIE */}
        <TabsContent value="categorie" className="space-y-4">
          <h2 className="font-display text-lg text-primary flex items-center gap-2">
            <BarChart3 className="w-5 h-5" /> Analisi Categorie
          </h2>

          {stats.categoryStats.map(cat => (
            <Card key={cat.name}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cat.emoji}</span>
                    <span className="font-russo text-sm">{cat.name}</span>
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{cat.weight}</span>
                  </div>
                  <div className="font-display text-lg text-secondary">{cat.average.toFixed(2)}</div>
                </div>
                {/* Progress bar visiva */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                    style={{ width: `${(cat.average / 10) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                  <span>Min: {cat.min}</span>
                  <span>Max: {cat.max}</span>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Distribuzione voti */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-russo flex items-center gap-2">
                📊 Distribuzione Voti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-24 gap-1">
                {stats.voteDistribution.map((bucket, i) => {
                  const maxCount = Math.max(...stats.voteDistribution.map(b => b.count));
                  const height = maxCount > 0 ? (bucket.count / maxCount) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-gradient-to-t from-primary to-secondary rounded-t"
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                      <span className="text-[8px] text-muted-foreground">{bucket.range}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: RECORDS */}
        <TabsContent value="records" className="space-y-3">
          <h2 className="font-display text-lg text-primary flex items-center gap-2">
            <Award className="w-5 h-5" /> Record & Fun Facts
          </h2>

          {/* Voto più alto */}
          {stats.highestSingleVote && (
            <Card className="border-secondary">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🚀</span>
                  <span className="font-russo text-sm">Voto più alto della serata</span>
                </div>
                <div className="text-2xl font-display text-secondary">
                  {stats.highestSingleVote.score.toFixed(2)}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {pizzas.find(p => p.id === stats.highestSingleVote.pizza_id)?.brand} - 
                  dato da {players.find(p => p.id === stats.highestSingleVote.player_id)?.username}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Voto più basso */}
          {stats.lowestSingleVote && (
            <Card className="border-destructive">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">💀</span>
                  <span className="font-russo text-sm">Voto più basso della serata</span>
                </div>
                <div className="text-2xl font-display text-destructive">
                  {stats.lowestSingleVote.score.toFixed(2)}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {pizzas.find(p => p.id === stats.lowestSingleVote.pizza_id)?.brand} - 
                  dato da {players.find(p => p.id === stats.lowestSingleVote.player_id)?.username}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pizza più controversa */}
          {stats.mostControversial && stats.mostControversial.variance > 0 && (
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🎭</span>
                  <span className="font-russo text-sm">Pizza più controversa</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{stats.mostControversial.emoji || '🍕'}</span>
                  <span className="font-display text-lg text-foreground">
                    {stats.mostControversial.brand} - {stats.mostControversial.flavor}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Varianza: {stats.mostControversial.variance.toFixed(2)} - "Amore o odio, niente vie di mezzo!"
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pizza più d'accordo */}
          {stats.mostAgreed && (
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🤝</span>
                  <span className="font-russo text-sm">Pizza più unanime</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{stats.mostAgreed.emoji || '🍕'}</span>
                  <span className="font-display text-lg text-foreground">
                    {stats.mostAgreed.brand} - {stats.mostAgreed.flavor}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Varianza: {stats.mostAgreed.variance.toFixed(2)} - "Tutti d'accordo su questa!"
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pizza più votata */}
          {stats.mostVotedPizza && (
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🗳️</span>
                  <span className="font-russo text-sm">Pizza più votata</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{stats.mostVotedPizza.emoji || '🍕'}</span>
                  <span className="font-display text-lg text-foreground">
                    {stats.mostVotedPizza.brand}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {stats.mostVotedPizza.voteCount} voti totali
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fun fact: self-voters */}
          {stats.selfVoters.length > 0 && (
            <Card className="border-destructive">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🤡</span>
                  <span className="font-russo text-sm">CHEATERS DETECTED!</span>
                </div>
                <div className="text-sm text-destructive">
                  {stats.selfVoters.length} persone hanno votato la propria pizza... SHAME! 🔔
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statistiche generali */}
          <Card className="bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📈</span>
                <span className="font-russo text-sm">Riassunto Serata</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pizze in gara:</span>
                  <span className="font-display text-primary">{stats.totalPizzas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Voti totali:</span>
                  <span className="font-display text-secondary">{stats.totalVotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Votanti:</span>
                  <span className="font-display text-accent">{stats.participatingPlayers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Media globale:</span>
                  <span className="font-display text-foreground">{stats.globalAverage.toFixed(2)}</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-muted-foreground">Voti/Giocatore (media):</span>
                  <span className="font-display text-foreground">
                    {(stats.totalVotes / stats.participatingPlayers).toFixed(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center mt-8 px-4">
        <p className="text-[10px] text-muted-foreground font-russo">
          🍕 Tony Buitony Cup © 2024 - Stats for Nerds 🤓
        </p>
      </div>
    </div>
  );
};

export default NerdStatsPage;
