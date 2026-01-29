// Pagina "Nerd Stats" - Statistiche dettagliate della serata
// Accessibile solo via URL diretto (/stats), non linkata da nessuna parte
import React, { useMemo, useState } from 'react';
import { usePizzas } from '@/hooks/usePizzas';
import { useVotes } from '@/hooks/useVotes';
import { usePlayers } from '@/hooks/usePlayers';
import { calculateVoteScore, calculatePizzaScore, Vote, PizzaWithScore } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Trophy, Users, Pizza, BarChart3, Award, TrendingUp, TrendingDown, Star, Flame, Heart, Eye, Utensils, Music, ChevronDown, ChevronRight, User } from 'lucide-react';

// Tipi per le statistiche calcolate
interface PlayerStats {
  id: string;
  username: string;
  totalVotes: number;
  averageGiven: number;
  maxVote: number;
  minVote: number;
  pizzaRegistered: boolean;
  // Dettaglio voti per categoria
  categoryAverages: {
    aspetto: number;
    gusto: number;
    impasto: number;
    farcitura: number;
    tony_factor: number;
  };
  // Tutti i voti dati dal giocatore
  votesGiven: Array<{
    pizza: { id: string; brand: string; flavor: string; emoji: string | null; number: number };
    vote: Vote;
    score: number;
  }>;
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

interface PizzaDetailedStats {
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

const NerdStatsPage: React.FC = () => {
  const { pizzas } = usePizzas();
  const { votes } = useVotes({ disableRealtime: true });
  const { players } = usePlayers();
  const [selectedTab, setSelectedTab] = useState('classifica');
  const [expandedPlayers, setExpandedPlayers] = useState<Set<string>>(new Set());
  const [expandedPizzas, setExpandedPizzas] = useState<Set<string>>(new Set());

  const togglePlayer = (id: string) => {
    setExpandedPlayers(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePizza = (id: string) => {
    setExpandedPizzas(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

    // 2. STATISTICHE DETTAGLIATE PER PIZZA
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

    // 3. STATISTICHE GIOCATORI con dettagli voti
    const playerStats: PlayerStats[] = players.map(player => {
      const playerVotes = votes.filter(v => v.player_id === player.id);
      const voteScores = playerVotes.map(v => calculateVoteScore(v));
      const hasPizza = pizzas.some(p => p.registered_by === player.id);

      // Medie per categoria
      const categoryAverages = {
        aspetto: playerVotes.length > 0 ? playerVotes.reduce((acc, v) => acc + v.aspetto, 0) / playerVotes.length : 0,
        gusto: playerVotes.length > 0 ? playerVotes.reduce((acc, v) => acc + v.gusto, 0) / playerVotes.length : 0,
        impasto: playerVotes.length > 0 ? playerVotes.reduce((acc, v) => acc + v.impasto, 0) / playerVotes.length : 0,
        farcitura: playerVotes.length > 0 ? playerVotes.reduce((acc, v) => acc + v.farcitura, 0) / playerVotes.length : 0,
        tony_factor: playerVotes.length > 0 ? playerVotes.reduce((acc, v) => acc + v.tony_factor, 0) / playerVotes.length : 0
      };

      // Tutti i voti dati
      const votesGiven = playerVotes.map(vote => {
        const pizza = pizzas.find(p => p.id === vote.pizza_id);
        return {
          pizza: pizza ? { id: pizza.id, brand: pizza.brand, flavor: pizza.flavor, emoji: pizza.emoji, number: pizza.number } : { id: '', brand: 'Unknown', flavor: '', emoji: null, number: 0 },
          vote,
          score: calculateVoteScore(vote)
        };
      }).sort((a, b) => a.pizza.number - b.pizza.number);

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
    }).filter(p => p.totalVotes > 0);

    // 4. CLASSIFICHE VOTANTI
    const generousVoters = [...playerStats].sort((a, b) => b.averageGiven - a.averageGiven);
    const stingyVoters = [...playerStats].sort((a, b) => a.averageGiven - b.averageGiven);

    // 5. STATISTICHE PER CATEGORIA GLOBALE
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

    // 6. RECORD E FUN FACTS
    const allVoteScores = votes.map(v => ({ ...v, score: calculateVoteScore(v) }));
    const highestSingleVote = allVoteScores.reduce((max, v) => v.score > max.score ? v : max, allVoteScores[0]);
    const lowestSingleVote = allVoteScores.reduce((min, v) => v.score < min.score ? v : min, allVoteScores[0]);

    const mostVotedPizza = pizzasWithScores.reduce((max, p) => p.voteCount > max.voteCount ? p : max, pizzasWithScores[0]);
    const leastVotedPizza = pizzasWithScores.filter(p => p.voteCount > 0).reduce((min, p) => p.voteCount < min.voteCount ? p : min, pizzasWithScores[0]);

    const globalAverage = votes.reduce((acc, v) => acc + calculateVoteScore(v), 0) / votes.length;

    // Distribuzione voti
    const voteDistribution = Array.from({ length: 10 }, (_, i) => {
      const min = i + 1;
      const max = i + 2;
      return {
        range: `${min}`,
        count: allVoteScores.filter(v => v.score >= min && v.score < max).length
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

    // Pizza con miglior punteggio per categoria
    const bestByCategory = ['aspetto', 'gusto', 'impasto', 'farcitura', 'tony_factor'].map(cat => {
      const sorted = [...pizzaDetailedStats].sort((a, b) => 
        b.categoryAverages[cat as keyof typeof b.categoryAverages] - a.categoryAverages[cat as keyof typeof a.categoryAverages]
      );
      return {
        category: cat,
        categoryName: cat === 'tony_factor' ? 'Tony Factor' : cat.charAt(0).toUpperCase() + cat.slice(1),
        emoji: cat === 'aspetto' ? '👀' : cat === 'gusto' ? '😋' : cat === 'impasto' ? '🍞' : cat === 'farcitura' ? '🧀' : '🎸',
        best: sorted[0],
        worst: sorted[sorted.length - 1]
      };
    });

    // Media voti per ora (se possibile)
    const votesByHour = votes.reduce((acc, v) => {
      const hour = new Date(v.created_at).getHours();
      if (!acc[hour]) acc[hour] = [];
      acc[hour].push(v);
      return acc;
    }, {} as Record<number, Vote[]>);

    const hourlyStats = Object.entries(votesByHour).map(([hour, hourVotes]) => ({
      hour: parseInt(hour),
      count: hourVotes.length,
      average: hourVotes.reduce((acc, v) => acc + calculateVoteScore(v), 0) / hourVotes.length
    })).sort((a, b) => a.hour - b.hour);

    return {
      pizzasWithScores,
      pizzaDetailedStats,
      playerStats,
      generousVoters,
      stingyVoters,
      categoryStats,
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
      bestByCategory,
      hourlyStats,
      totalVotes: votes.length,
      totalPizzas: pizzas.length,
      totalPlayers: players.length,
      participatingPlayers: playerStats.length
    };
  }, [pizzas, votes, players]);

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
            📊 STATS 4 NERD 🤓
          </h1>
          <p className="font-russo text-xs text-muted-foreground mt-1">
            Tony Buitony Cup Deep Analytics
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
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="classifica" className="text-xs px-1">🏆</TabsTrigger>
          <TabsTrigger value="pizze" className="text-xs px-1">🍕</TabsTrigger>
          <TabsTrigger value="votanti" className="text-xs px-1">👥</TabsTrigger>
          <TabsTrigger value="categorie" className="text-xs px-1">📈</TabsTrigger>
          <TabsTrigger value="records" className="text-xs px-1">🎯</TabsTrigger>
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

        {/* TAB 2: PIZZE - Dettaglio categorie per pizza */}
        <TabsContent value="pizze" className="space-y-3">
          <h2 className="font-display text-lg text-primary flex items-center gap-2">
            <Pizza className="w-5 h-5" /> Dettaglio Pizze
          </h2>

          {stats.pizzaDetailedStats.map((item, index) => (
            <Collapsible
              key={item.pizza.id}
              open={expandedPizzas.has(item.pizza.id)}
              onOpenChange={() => togglePizza(item.pizza.id)}
            >
              <Card className={index === 0 ? 'border-primary' : ''}>
                <CollapsibleTrigger className="w-full">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{item.pizza.emoji || '🍕'}</div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="font-russo text-sm truncate">#{item.pizza.number} {item.pizza.brand}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{item.pizza.flavor}</div>
                      </div>
                      <div className="font-display text-lg text-secondary">{item.pizza.averageScore.toFixed(2)}</div>
                      {expandedPizzas.has(item.pizza.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 pb-3 px-3">
                    <div className="border-t border-border pt-3 space-y-2">
                      {item.categoryDetails.map(cat => (
                        <div key={cat.name} className="flex items-center gap-2">
                          <span className="text-sm">{cat.emoji}</span>
                          <span className="font-russo text-xs flex-1">{cat.name}</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                              style={{ width: `${(cat.average / 10) * 100}%` }}
                            />
                          </div>
                          <span className="font-display text-sm text-secondary min-w-[2.5rem] text-right">{cat.average.toFixed(1)}</span>
                        </div>
                      ))}
                      <div className="text-[10px] text-muted-foreground pt-2 flex justify-between">
                        <span>{item.pizza.voteCount} voti totali</span>
                        {item.pizza.registeredByPlayer && (
                          <span>di {item.pizza.registeredByPlayer.username}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </TabsContent>

        {/* TAB 3: VOTANTI - Dettaglio voti per ogni utente */}
        <TabsContent value="votanti" className="space-y-4">
          {/* Classifiche rapide */}
          <div className="grid grid-cols-2 gap-2">
            <Card className="bg-gradient-to-br from-green-500/10 to-transparent">
              <CardContent className="p-2">
                <div className="text-[10px] text-muted-foreground mb-1">🎁 Più Generoso</div>
                <div className="font-russo text-sm truncate">{stats.generousVoters[0]?.username}</div>
                <div className="font-display text-primary">{stats.generousVoters[0]?.averageGiven.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-500/10 to-transparent">
              <CardContent className="p-2">
                <div className="text-[10px] text-muted-foreground mb-1">😤 Più Tirchio</div>
                <div className="font-russo text-sm truncate">{stats.stingyVoters[0]?.username}</div>
                <div className="font-display text-destructive">{stats.stingyVoters[0]?.averageGiven.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          <h3 className="font-display text-sm text-primary flex items-center gap-2">
            <User className="w-4 h-4" /> Tutti i Votanti
          </h3>

          {stats.playerStats.map(player => (
            <Collapsible
              key={player.id}
              open={expandedPlayers.has(player.id)}
              onOpenChange={() => togglePlayer(player.id)}
            >
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">
                        {player.averageGiven >= 7 ? '💖' : player.averageGiven >= 6 ? '😊' : '😐'}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="font-russo text-sm">{player.username}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {player.totalVotes} voti • media {player.averageGiven.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right text-[10px] text-muted-foreground">
                        <div>max: {player.maxVote.toFixed(1)}</div>
                        <div>min: {player.minVote.toFixed(1)}</div>
                      </div>
                      {expandedPlayers.has(player.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 pb-3 px-3">
                    <div className="border-t border-border pt-3 space-y-3">
                      {/* Medie per categoria */}
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-2">Medie per categoria:</div>
                        <div className="grid grid-cols-5 gap-1 text-center">
                          <div>
                            <div className="text-sm">👀</div>
                            <div className="font-display text-xs">{player.categoryAverages.aspetto.toFixed(1)}</div>
                          </div>
                          <div>
                            <div className="text-sm">😋</div>
                            <div className="font-display text-xs">{player.categoryAverages.gusto.toFixed(1)}</div>
                          </div>
                          <div>
                            <div className="text-sm">🍞</div>
                            <div className="font-display text-xs">{player.categoryAverages.impasto.toFixed(1)}</div>
                          </div>
                          <div>
                            <div className="text-sm">🧀</div>
                            <div className="font-display text-xs">{player.categoryAverages.farcitura.toFixed(1)}</div>
                          </div>
                          <div>
                            <div className="text-sm">🎸</div>
                            <div className="font-display text-xs">{player.categoryAverages.tony_factor.toFixed(1)}</div>
                          </div>
                        </div>
                      </div>

                      {/* Lista voti dati */}
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-2">Voti dati:</div>
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                          {player.votesGiven.map(v => (
                            <div key={v.vote.id} className="flex items-center gap-2 text-[11px] bg-muted/30 rounded p-1.5">
                              <span>{v.pizza.emoji || '🍕'}</span>
                              <span className="flex-1 truncate font-russo">#{v.pizza.number} {v.pizza.brand}</span>
                              <span className="font-display text-secondary">{v.score.toFixed(1)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </TabsContent>

        {/* TAB 4: CATEGORIE */}
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

          {/* Miglior/Peggior pizza per categoria */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-russo">🏅 Best & Worst per Categoria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.bestByCategory.map(item => (
                <div key={item.category} className="flex items-center gap-2 text-[11px]">
                  <span>{item.emoji}</span>
                  <span className="font-russo flex-1">{item.categoryName}</span>
                  <div className="text-right">
                    <span className="text-green-500">🥇 #{item.best.pizza.number}</span>
                    <span className="text-muted-foreground mx-1">|</span>
                    <span className="text-red-500">💀 #{item.worst.pizza.number}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

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

          {/* Voti per ora */}
          {stats.hourlyStats.length > 1 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-russo">⏰ Voti per Ora</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {stats.hourlyStats.map(h => (
                    <div key={h.hour} className="flex items-center gap-2 text-[11px]">
                      <span className="font-russo w-12">{h.hour}:00</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(h.count / Math.max(...stats.hourlyStats.map(x => x.count))) * 100}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground">{h.count} voti</span>
                      <span className="font-display text-secondary">{h.average.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TAB 5: RECORDS */}
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
                  <span className="font-russo text-sm">Voto più alto</span>
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
                  <span className="font-russo text-sm">Voto più basso</span>
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

          {/* Votante più polarizzato */}
          {stats.mostPolarizedVoter && (
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🎢</span>
                  <span className="font-russo text-sm">Votante Più Polarizzato</span>
                </div>
                <div className="font-display text-lg">{stats.mostPolarizedVoter.username}</div>
                <div className="text-[10px] text-muted-foreground">
                  Range voti: {stats.mostPolarizedVoter.minVote.toFixed(1)} → {stats.mostPolarizedVoter.maxVote.toFixed(1)} (Δ{(stats.mostPolarizedVoter.maxVote - stats.mostPolarizedVoter.minVote).toFixed(1)})
                </div>
              </CardContent>
            </Card>
          )}

          {/* Votante più consistente */}
          {stats.mostConsistentVoter && (
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">⚖️</span>
                  <span className="font-russo text-sm">Votante Più Consistente</span>
                </div>
                <div className="font-display text-lg">{stats.mostConsistentVoter.username}</div>
                <div className="text-[10px] text-muted-foreground">
                  Range voti: {stats.mostConsistentVoter.minVote.toFixed(1)} → {stats.mostConsistentVoter.maxVote.toFixed(1)} (Δ{(stats.mostConsistentVoter.maxVote - stats.mostConsistentVoter.minVote).toFixed(1)})
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
                  <span className="font-display text-lg">
                    #{stats.mostControversial.number} {stats.mostControversial.brand}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Varianza: {stats.mostControversial.variance.toFixed(2)} - "Amore o odio!"
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pizza più unanime */}
          {stats.mostAgreed && (
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🤝</span>
                  <span className="font-russo text-sm">Pizza più unanime</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{stats.mostAgreed.emoji || '🍕'}</span>
                  <span className="font-display text-lg">
                    #{stats.mostAgreed.number} {stats.mostAgreed.brand}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Varianza: {stats.mostAgreed.variance.toFixed(2)} - "Tutti d'accordo!"
                </div>
              </CardContent>
            </Card>
          )}

          {/* Categoria insights */}
          <div className="grid grid-cols-2 gap-2">
            <Card className="bg-green-500/10">
              <CardContent className="p-2">
                <div className="text-[10px] text-muted-foreground">Categoria più alta</div>
                <div className="text-lg">{stats.mostGenerouscategory.emoji}</div>
                <div className="font-russo text-sm">{stats.mostGenerouscategory.name}</div>
                <div className="font-display text-primary">{stats.mostGenerouscategory.avg.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="bg-red-500/10">
              <CardContent className="p-2">
                <div className="text-[10px] text-muted-foreground">Categoria più bassa</div>
                <div className="text-lg">{stats.mostStingyCategory.emoji}</div>
                <div className="font-russo text-sm">{stats.mostStingyCategory.name}</div>
                <div className="font-display text-destructive">{stats.mostStingyCategory.avg.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Self-voters */}
          {stats.selfVoters.length > 0 && (
            <Card className="border-destructive">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🤡</span>
                  <span className="font-russo text-sm">CHEATERS DETECTED!</span>
                </div>
                <div className="text-sm text-destructive">
                  {stats.selfVoters.length} hanno votato la propria pizza! SHAME! 🔔
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
                  <span className="font-display">{stats.globalAverage.toFixed(2)}</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-muted-foreground">Voti/Giocatore:</span>
                  <span className="font-display">
                    {(stats.totalVotes / stats.participatingPlayers).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-muted-foreground">Voti/Pizza:</span>
                  <span className="font-display">
                    {(stats.totalVotes / stats.totalPizzas).toFixed(1)}
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
          🍕 Tony Buitony Cup © 2024 - Stats 4 Nerd 🤓
        </p>
      </div>
    </div>
  );
};

export default NerdStatsPage;
