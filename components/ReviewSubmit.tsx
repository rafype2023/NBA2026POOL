import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { teams } from '@/lib/teams';
import Image from 'next/image';
import { sendPredictionEmail } from '@/lib/email';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function ReviewSubmit({ data }: any) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const b = data.bracketSelections || {};
  const championId = b['finals']?.winner;
  const champion = teams[championId];

  const handleSubmit = async () => {
    setStatus('submitting');
    
    try {
      // Map the flattened data fields to the expected nested schema structure
      const payload = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        finalsMVP: data.finalsMVP,
        finalScore: data.finalScore,
        playInSelections: {
          westSunsVsClippersWinner: data.westSunsVsClippersWinner,
          westWarriorsVsBlazersWinner: data.westWarriorsVsBlazersWinner,
          westEighthSeedWinner: data.westEighthSeedWinner,
          east76ersVsHeatWinner: data.east76ersVsHeatWinner,
          eastHornetsVsMagicWinner: data.eastHornetsVsMagicWinner,
          eastEighthSeedWinner: data.eastEighthSeedWinner,
        },
        bracketSelections: data.bracketSelections,
        champion: championId,
      };
      
      // Save to MongoDB via API
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Database save failed');

      // Send EmailJS using the original flat data structure
      await sendPredictionEmail({ ...data, champion: championId });

      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (!champion) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-2xl mx-auto text-center">
      <h2 className="text-4xl font-extrabold text-white mb-2">El Campeón de la NBA 2026</h2>
      <h3 className="text-2xl text-orange-400 font-bold mb-8 uppercase tracking-widest">{champion.name}</h3>

      {champion.gif ? (
        <div className="relative w-full max-w-sm mx-auto aspect-square mb-8 rounded-full overflow-hidden border-4 border-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.6)]">
          <Image src={champion.gif} alt={champion.name} fill className="object-cover" unoptimized />
        </div>
      ) : champion.logo ? (
        <Image src={champion.logo} alt={champion.name} width={200} height={200} className="mx-auto mb-8 drop-shadow-2xl" unoptimized />
      ) : null}

      <div className="bg-neutral-800/80 p-6 rounded-2xl text-left mb-8 space-y-4 shadow-xl border border-neutral-700">
        <h4 className="text-xl font-bold text-white border-b border-neutral-700 pb-2">Resumen de tu Predicción</h4>
        <div className="grid grid-cols-2 gap-4 text-sm text-neutral-300">
          <div><span className="text-neutral-500">Jugador:</span> {data.name}</div>
          <div><span className="text-neutral-500">Marcador Final:</span> {data.finalScore}</div>
          <div><span className="text-neutral-500">MVP Finales:</span> {data.finalsMVP}</div>
          <div><span className="text-neutral-500">Campeón:</span> {champion.name}</div>
        </div>
      </div>

      {status === 'idle' && (
        <button 
          onClick={handleSubmit}
          className="w-full py-5 rounded-xl font-black text-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all hover:scale-105"
        >
          CONFIRMAR Y ENVIAR
        </button>
      )}

      {status === 'submitting' && (
        <div className="flex items-center justify-center py-5 text-orange-500 gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="font-bold text-xl">Guardando Predicción...</span>
        </div>
      )}

      {status === 'success' && (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center py-5 text-green-500">
          <CheckCircle2 className="w-16 h-16 mb-2" />
          <span className="font-bold text-2xl text-white">¡Predicción Guardada!</span>
          <p className="text-neutral-400 mt-2">Tus selecciones se guardaron correctamente y se envió un email de confirmación.</p>
        </motion.div>
      )}

      {status === 'error' && (
        <div className="py-5 text-red-500 font-bold">
          Hubo un error al guardar tu predicción. Por favor, intenta de nuevo.
        </div>
      )}
    </motion.div>
  );
}
