// Questo componente gestisce la scheda di votazione per una singola pizza.
// Include gli slider per i vari criteri e messaggi divertenti (meme) per l'utente.
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pizza, Vote } from '@/types/database';
import { CompactVoteRow } from './CompactVoteRow';
import { useVotes } from '@/hooks/useVotes';
import { useRole } from '@/contexts/RoleContext';
import { ArrowLeft, Send, Check } from 'lucide-react';
import { VoteFeedback } from '@/components/effects/VoteFeedback';
import { getPizzaEmoji } from '@/lib/pizzaUtils';
import { getFeedbackMessage } from '@/lib/feedbackUtils';
import { formatPizzaText } from '@/lib/stringUtils';

interface VotingCardProps {
  pizza: Pizza;
  existingVote?: Vote; // Se l'utente ha già votato, mostriamo i voti salvati
  onBack: () => void;
}

// Messaggi di avvertimento in stile "meme" per rendere l'uso dell'app più simpatico.
const WARNING_MESSAGES = [
  "🍝 'Sta mano po esse fero o po esse piuma'. Il voto è definitivo. 🍝",
  "🚨 Una volta votato, non si torna indietro. Neanche con la DeLorean a 88 miglia orarie! ⚡",
  "⚡ Voto permanente! Più indelebile di un tatuaggio fatto a Magaluf alle 4 di mattina. 🌴",
  "🔒 Il voto è per sempre, come la foto della patente venuta male. 📸",
  "💀 No take-backsies! Questo voto è scritto nella pietra, tipo i Dieci Comandamenti ma con più mozzarella. 🍕",
  "😱 Decidi bene... non puoi usare 'Esci senza salvare' qui! 💾",
  "💍 È una promessa solenne. Più serio di quando dici 'da lunedì dieta'. 🥗",
  "🛑 Altolà al sudore! Questo voto non si cancella, manco con la candeggina. 🧼",
  "🧙‍♂️ Neanche Gandalf può farti passare se cambi idea. YOU SHALL NOT PASS! 🪄",
  "📵 Niente messaggi 'eliminati per tutti'. Qui quello che scrivi resta. Forever. 🕰️",
  "🔥 Questo voto scotta più della teglia appena uscita dal forno. Occhio! 🧤",
  "🎨 Un voto definitivo come un Picasso. O come lo scarabocchio di un bambino sul muro bianco. 🖍️",
  "🚀 Houston, abbiamo un voto. E non torna indietro sulla Terra. 🌑",
  "⚓ Gettata l'ancora! Non si salpa più verso altri punteggi. 🌊",
  "💎 Un voto è per sempre. De Beers spostati. 💍",
  "🧠 Usa il cervello! O lo stomaco, che forse ne sa di più. Ma decidi bene! 🍔",
  "🎲 Il dado è tratto. Alea iacta est, ma con il pomodoro. 🍅",
  "🌵 Più pungente di un cactus se ti penti. Pensaci! 🐫",
  "🍝 Non fare il salto della quaglia. Se voti, voti! 🦅",
  "🎭 Giù la maschera! Questo è il tuo vero voto, senza filtri Instagram. ✨",
  "🧱 Muro di gomma? No, muro di cemento armato. Il voto non rimbalza! 🏗️",
  "🧊 Più freddo del cuore della tua ex se le chiedi di tornare. Irreversibile. ❄️",
  "🧂 Prendi questo voto 'cum grano salis', ma ricorda che il sale non si toglie dalla zuppa. 🍲",
  "🔮 La sfera di cristallo dice... che questo voto rimarrà per l'eternità. ✨",
  "📜 Scritto nelle stelle? No, nel database. Che è pure più sicuro. 🌌",
  "🧨 Attento a dove metti i piedi... e il dito! BOOM! Voto confermato. 💥",
  "🎸 Questo voto spacca! E non si aggiusta con lo scotch. 🩹",
  "🦄 Raro come un unicorno... la possibilità di cambiare voto (spoiler: non esiste). 🌈",
  "🦁 Il cerchio della vita si chiude con questo voto. Nants ingonyama! 🌅",
  "🍪 È il modo in cui si sbriciola il biscotto. Non puoi rimetterlo insieme. 🥛",
  "🧩 Metti l'ultimo tassello. Il puzzle è finito (e incollato). 🖼️",
  "🏰 Come una fortezza medievale: una volta chiuso il ponte levatoio, ciao. 🌉",
  "🚂 Il treno è partito. Prossima fermata: Risultati Finali. 🚉",
  "🎤 Mic drop. Hai detto la tua. Non puoi riprendere il microfono. 👇",
  "🕶️ Deal with it. Il tuo voto è questo. Mettiti gli occhiali da sole e vai avanti. 😎",
  "🥡 Non è un take-away. Se lo ordini (voti), te lo tieni! 🥢",
  "🥝 Più definitivo di quando compri 3kg di kiwi e devi mangiarli tutti prima che marciscano. 🤢",
  "🛒 Carrello chiuso. Procedere al pagamento (emotivo) del tuo voto. 💳",
  "📮 La lettera è nella buca. Non puoi inseguire il postino. 🐕",
  "🚽 O la va o la spacca. E abbiamo tirato la catena. (Metaforicamente). 🧻",
  "🥜 Niente noccioline. Qui si fa sul serio. Sei sicuro? 🐘",
  "🔨 Martellata finale. Aggiudicato! (Se premi invio). ⚖️",
  "🕯️ Il gioco vale la candela? Spero di sì, perché ormai è accesa. 🔥",
  "🧨 Mission Impossible? No, Mission Immutabile. Questo messaggio si autodistruggerà tra... mai. 💣",
  "🗝️ La chiave è gettata nel pozzo. Il lucchetto del voto è chiuso. 🏰",
  "🧬 È nel tuo DNA ormai. Questo voto fa parte di te. 🦠",
  "🛸 Rapito dagli alieni. Il tuo vecchio voto non tornerà più. 👽",
  "🦖 Estinto come i dinosauri. La possibilità di cambiare idea è un fossile. 🦴",
  "🌮 Come la salsa che cola dal taco: non puoi rimetterla dentro. 🌯",
  "🌋 Lapilli di saggezza: un voto eruttato non torna nel vulcano. 🏔️",
];

// Funzioni helper per cambiare Emoji e Testo in base al punteggio raggiunto.
const getScoreEmoji = (score: number): string => {
  if (score <= 3) return '💩';
  if (score <= 5) return '😐';
  if (score <= 7) return '😊';
  if (score <= 9) return '🔥';
  return '🏆';
};



export const VotingCard: React.FC<VotingCardProps> = ({ pizza, existingVote, onBack }) => {
  const { playerId } = useRole();
  // Disabilita realtime per evitare crash su iOS Safari
  const { createVote } = useVotes({ disableRealtime: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Scegliamo un messaggio di avvertimento a caso per questa sessione.
  const [warningMessage] = useState(() =>
    WARNING_MESSAGES[Math.floor(Math.random() * WARNING_MESSAGES.length)]
  );

  // Stato interno per i voti dei 5 criteri.
  const [votes, setVotes] = useState({
    aspetto: existingVote?.aspetto ?? 5,
    gusto: existingVote?.gusto ?? 5,
    impasto: existingVote?.impasto ?? 5,
    farcitura: existingVote?.farcitura ?? 5,
    tony_factor: existingVote?.tony_factor ?? 5,
  });

  const isReadOnly = !!existingVote; // Se esiste già un voto, disabilitiamo le modifiche.

  // Calcolo del punteggio medio pesato (riutilizza la logica definita nei tipi).
  const calculateScore = () => {
    return (
      votes.aspetto * 0.15 +
      votes.gusto * 0.30 +
      votes.impasto * 0.20 +
      votes.farcitura * 0.15 +
      votes.tony_factor * 0.20
    );
  };

  const currentScore = calculateScore();

  // Funzione per inviare il voto al database (Supabase).
  const handleSubmit = async () => {
    if (!playerId || isSubmitting || isReadOnly) return;

    setIsSubmitting(true);
    try {
      await createVote.mutateAsync({
        pizza_id: pizza.id,
        player_id: playerId,
        ...votes,
      });
      setFinalScore(currentScore);
      setShowFeedback(true); // Mostra l'effetto grafico di successo
    } catch (error) {
      console.error('Error submitting vote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 animate-slide-up">
      {showFeedback && (
        <VoteFeedback score={finalScore} onComplete={onBack} />
      )}

      {/* Pulsante per tornare indietro alla lista delle pizze */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-5 h-5" />
        Torna alla lista
      </Button>

      <Card className="bg-card border-2 border-primary/50">
        <CardHeader className="text-center py-3 pb-2">
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">{getPizzaEmoji(pizza.flavor, pizza.number, pizza.emoji)}</span>
            <div>
              <CardTitle className="font-schoolbell text-2xl text-primary">
                {formatPizzaText(pizza.brand)} - {formatPizzaText(pizza.flavor)}
              </CardTitle>
              <p className="font-sans text-xs text-muted-foreground">
                Pizza #{pizza.number}
              </p>
            </div>
          </div>
          {isReadOnly && (
            <div className="flex items-center justify-center gap-2 mt-2 px-3 py-1 bg-green-500/20 rounded-lg">
              <Check className="w-4 h-4 text-green-500" />
              <span className="font-sans font-bold text-sm text-green-500">Già votata!</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="text-center pb-2">
            <p className="font-sans text-sm text-muted-foreground uppercase tracking-widest">
              Voto da 1 a 10
            </p>
          </div>

          {/* Slider compatti per ogni categoria */}
          <CompactVoteRow
            label="Ricchezza farcitura"
            emoji="🧀"
            value={votes.farcitura}
            onChange={(v) => setVotes({ ...votes, farcitura: v })}
            disabled={isReadOnly}
          />
          <CompactVoteRow
            label="Gusto"
            emoji="😋"
            value={votes.gusto}
            onChange={(v) => setVotes({ ...votes, gusto: v })}
            disabled={isReadOnly}
          />
          <CompactVoteRow
            label="Impasto"
            emoji="🥖"
            value={votes.impasto}
            onChange={(v) => setVotes({ ...votes, impasto: v })}
            disabled={isReadOnly}
          />
          <CompactVoteRow
            label="Aspetto"
            emoji="📸"
            value={votes.aspetto}
            onChange={(v) => setVotes({ ...votes, aspetto: v })}
            disabled={isReadOnly}
          />
          <CompactVoteRow
            label="Fattore Tony Buitony"
            emoji="🕶️"
            value={votes.tony_factor}
            onChange={(v) => setVotes({ ...votes, tony_factor: v })}
            disabled={isReadOnly}
          />

          {!isReadOnly && (
            <>
              {/* Box compatto di anteprima del voto */}
              <div className="p-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl border-2 border-primary/30">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl">{getScoreEmoji(currentScore)}</span>
                  <p className="font-display text-3xl text-primary text-glow-orange">
                    {currentScore.toFixed(1)}
                  </p>
                  <p className="font-sans font-bold text-sm text-foreground">
                    {useMemo(() => {
                      // Arrotonda al 0.5 più vicino per cambiare messaggio meno frequentemente
                      const steppedScore = Math.floor(currentScore * 2) / 2;
                      return getFeedbackMessage(steppedScore);
                    }, [Math.floor(currentScore * 2) / 2])}
                  </p>
                </div>
              </div>

              {/* Messaggio compatto di avvertimento */}
              <div className="p-3 border-2 border-destructive/40 bg-destructive/10 rounded-lg space-y-1">
                <p className="font-russo text-xs text-center text-destructive uppercase tracking-widest animate-pulse">
                  ⚠️ Attenzione: Voto Definitivo! ⚠️
                </p>
                <p className="font-sans text-xs text-center text-foreground/90 leading-snug">
                  "{warningMessage}"
                </p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 font-display text-lg gradient-pizza text-primary-foreground box-glow-orange touch-manipulation"
              >
                {isSubmitting ? (
                  'Invio...'
                ) : (
                  <>
                    INVIA VOTO <Send className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
