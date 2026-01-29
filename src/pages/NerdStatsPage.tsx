import React, { useState } from 'react';
import { usePizzas } from '@/hooks/usePizzas';
import { useVotes } from '@/hooks/useVotes';
import { usePlayers } from '@/hooks/usePlayers';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Users, Pizza, BarChart3, Award } from 'lucide-react';
import { RankingTab } from '@/components/stats/RankingTab';
import { PizzasTab } from '@/components/stats/PizzasTab';
import { VotersTab } from '@/components/stats/VotersTab';
import { CategoriesTab } from '@/components/stats/CategoriesTab';
import { RecordsTab } from '@/components/stats/RecordsTab';

const NerdStatsPage: React.FC = () => {
  // DISABILITA REALTIME PER QUESTA PAGINA PESANTE
  const { pizzas } = usePizzas({ disableRealtime: true });
  const { votes } = useVotes({ disableRealtime: true });
  const { players } = usePlayers({ disableRealtime: true });

  const [selectedTab, setSelectedTab] = useState('ranking_tab');

  // Loading state
  if (!votes.length || !pizzas.length || !players.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="font-russo text-muted-foreground animate-pulse">Caricamento statistiche...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8 md:max-w-7xl md:mx-auto shadow-2xl shadow-black/20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border py-2 px-4 shadow-sm">
        <div className="text-center">
          <h1 className="font-sans font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            📊 STATS 4 NERD 🤓
          </h1>
          <p className="font-russo text-[10px] text-muted-foreground">
            Tony Buitony Cup Deep Analytics
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="px-4 mt-4">
        <TabsList className="grid w-full grid-cols-5 mb-4 h-auto p-1 bg-muted/50">
          <TabsTrigger value="ranking_tab" className="text-[10px] md:text-sm px-1 py-2 flex flex-col md:flex-row items-center gap-1 data-[state=active]:text-primary">
            <Trophy className="w-4 h-4 md:w-5 md:h-5" />
            <span className="truncate w-full text-center md:w-auto">Classifica</span>
          </TabsTrigger>
          <TabsTrigger value="pizzas_tab" className="text-[10px] md:text-sm px-1 py-2 flex flex-col md:flex-row items-center gap-1 data-[state=active]:text-primary">
            <Pizza className="w-4 h-4 md:w-5 md:h-5" />
            <span className="truncate w-full text-center md:w-auto">Pizze</span>
          </TabsTrigger>
          <TabsTrigger value="voters_tab" className="text-[10px] md:text-sm px-1 py-2 flex flex-col md:flex-row items-center gap-1 data-[state=active]:text-primary">
            <Users className="w-4 h-4 md:w-5 md:h-5" />
            <span className="truncate w-full text-center md:w-auto">Votanti</span>
          </TabsTrigger>
          <TabsTrigger value="categories_tab" className="text-[10px] md:text-sm px-1 py-2 flex flex-col md:flex-row items-center gap-1 data-[state=active]:text-primary">
            <BarChart3 className="w-4 h-4 md:w-5 md:h-5" />
            <span className="truncate w-full text-center md:w-auto">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="records_tab" className="text-[10px] md:text-sm px-1 py-2 flex flex-col md:flex-row items-center gap-1 data-[state=active]:text-primary">
            <Award className="w-4 h-4 md:w-5 md:h-5" />
            <span className="truncate w-full text-center md:w-auto">Records</span>
          </TabsTrigger>
        </TabsList>

        {/* 
            Renderizzo il contenuto dei tab. 
            Il componente Tabs di Radix non smonta/monta il contenuto di default, ma usa hidden.
            Tuttavia, dato che ho spostato la logica pesante DENTRO i componenti, 
            essa verrà eseguita solo quando il componente viene effettivamente montato o le props cambiano.
            Radix Tabs renderizza tutti i TabsContent ma li nasconde.
            Per risparmiare memoria su iPhone, forzo il mount solo del tab attivo.
        */}

        {selectedTab === 'ranking_tab' && (
          <TabsContent value="ranking_tab" forceMount>
            <RankingTab pizzas={pizzas} votes={votes} players={players} />
          </TabsContent>
        )}

        {selectedTab === 'pizzas_tab' && (
          <TabsContent value="pizzas_tab" forceMount>
            <PizzasTab pizzas={pizzas} votes={votes} players={players} />
          </TabsContent>
        )}

        {selectedTab === 'voters_tab' && (
          <TabsContent value="voters_tab" forceMount>
            <VotersTab pizzas={pizzas} votes={votes} players={players} />
          </TabsContent>
        )}

        {selectedTab === 'categories_tab' && (
          <TabsContent value="categories_tab" forceMount>
            <CategoriesTab pizzas={pizzas} votes={votes} players={players} />
          </TabsContent>
        )}

        {selectedTab === 'records_tab' && (
          <TabsContent value="records_tab" forceMount>
            <RecordsTab pizzas={pizzas} votes={votes} players={players} />
          </TabsContent>
        )}

      </Tabs>
    </div>
  );
};

export default NerdStatsPage;
