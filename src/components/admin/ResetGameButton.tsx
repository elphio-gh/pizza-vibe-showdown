import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const ResetGameButton: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const queryClient = useQueryClient();

  const handleReset = async () => {
    if (confirmText !== 'RESET') return;
    
    setIsResetting(true);
    try {
      // Delete in order to respect foreign keys
      // 1. Delete all votes
      const { error: votesError } = await supabase.from('votes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (votesError) throw votesError;
      
      // 2. Delete all pizzas
      const { error: pizzasError } = await supabase.from('pizzas').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (pizzasError) throw pizzasError;
      
      // 3. Delete all sessions
      const { error: sessionsError } = await supabase.from('sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (sessionsError) throw sessionsError;
      
      // 4. Delete all players
      const { error: playersError } = await supabase.from('players').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (playersError) throw playersError;
      
      // 5. Reset TV command to waiting
      const { error: tvError } = await supabase
        .from('tv_commands')
        .update({ command: 'waiting', current_position: 0 })
        .neq('id', '00000000-0000-0000-0000-000000000000');
      if (tvError) throw tvError;
      
      // Invalidate all queries
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['pizzas'] });
      queryClient.invalidateQueries({ queryKey: ['votes'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['tv-command'] });
      
      // Clear localStorage
      localStorage.removeItem('tony-session-token');
      localStorage.removeItem('tony-player-profiles');
      localStorage.removeItem('tony-current-player');
      
      toast({
        title: "🔄 Reset completato!",
        description: "Tutti i dati sono stati eliminati. Pronto per una nuova partita!",
      });
      
      setShowConfirm(false);
      setConfirmText('');
    } catch (error) {
      console.error('Reset error:', error);
      toast({
        title: "Errore durante il reset",
        description: "Si è verificato un errore. Riprova.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <Button 
        variant="destructive" 
        onClick={() => setShowConfirm(true)}
        className="w-full"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset Nuova Partita
      </Button>

      <AlertDialog open={showConfirm} onOpenChange={(open) => { setShowConfirm(open); setConfirmText(''); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-6 h-6" />
              Conferma Reset Totale
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>
                  Stai per <strong>eliminare definitivamente</strong> tutti i dati:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-destructive">
                  <li>Tutti i giocatori</li>
                  <li>Tutte le pizze registrate</li>
                  <li>Tutti i voti espressi</li>
                  <li>Tutte le sessioni attive</li>
                </ul>
                <p className="font-semibold">
                  Questa azione NON può essere annullata!
                </p>
                <div className="pt-2">
                  <p className="text-sm mb-2">
                    Per confermare, scrivi <strong>RESET</strong> nel campo sottostante:
                  </p>
                  <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                    placeholder="Scrivi RESET per confermare"
                    className="border-destructive"
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReset} 
              className="bg-destructive"
              disabled={confirmText !== 'RESET' || isResetting}
            >
              {isResetting ? 'Resetting...' : 'Elimina Tutto'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
