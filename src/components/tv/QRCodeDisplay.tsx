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
    <div className="p-2 bg-white rounded-xl shadow-2xl border-2 border-primary/20">
      <QRCodeSVG
        value={qrUrl}
        size={140}
        level="H"
        includeMargin
        imageSettings={{
          src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍕</text></svg>",
          height: 25,
          width: 25,
          excavate: true,
        }}
      />
    </div>
  );
};
