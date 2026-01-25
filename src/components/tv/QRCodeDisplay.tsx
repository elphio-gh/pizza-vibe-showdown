import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useSessions } from '@/hooks/useSessions';
import { generateSessionToken } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';

export const QRCodeDisplay: React.FC = () => {
  const [sessionToken, setSessionToken] = useState<string>('');
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const createNewSession = async () => {
      const token = generateSessionToken();
      
      // Insert session to DB
      const { error } = await supabase
        .from('sessions')
        .insert([{ token, is_active: true }]);
      
      if (!error) {
        setSessionToken(token);
        // Build URL with token parameter
        const baseUrl = window.location.origin;
        setQrUrl(`${baseUrl}/player?token=${token}`);
      }
    };

    createNewSession();

    // Refresh token every 10 minutes for security
    const interval = setInterval(createNewSession, 600000);

    return () => clearInterval(interval);
  }, []);

  if (!qrUrl) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin text-4xl">🍕</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-card/80 backdrop-blur-sm rounded-2xl border-2 border-primary/30 box-glow-orange">
      <p className="font-game text-lg text-primary animate-pulse-glow">
        📱 Scansiona per partecipare!
      </p>
      
      <div className="p-4 bg-white rounded-xl">
        <QRCodeSVG 
          value={qrUrl} 
          size={180}
          level="H"
          includeMargin
          imageSettings={{
            src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍕</text></svg>",
            height: 30,
            width: 30,
            excavate: true,
          }}
        />
      </div>

      <div className="text-center">
        <p className="font-game text-sm text-muted-foreground">
          oppure vai su
        </p>
        <p className="font-display text-lg text-secondary">
          {window.location.host}/player
        </p>
      </div>
    </div>
  );
};
