import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { teams, initialSeeds } from '@/lib/teams';
import Image from 'next/image';

const MatchupCard = ({ teamA, teamB, selectedWinner, onSelect, title }: any) => {
  const tA = teams[teamA];
  const tB = teams[teamB];

  if (!tA || !tB) return null;

  return (
    <div className="bg-neutral-800/50 p-4 rounded-2xl border border-neutral-700">
      <h3 className="text-neutral-400 text-sm font-semibold mb-3 text-center">{title}</h3>
      <div className="flex justify-between items-center gap-4">
        <button 
          onClick={() => onSelect(teamA)}
          className={`flex-1 flex flex-col items-center p-3 rounded-xl transition-all ${selectedWinner === teamA ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.5)] scale-105' : 'bg-neutral-900 hover:bg-neutral-700 text-white'}`}
        >
          {tA.logo && <Image src={tA.logo} alt={tA.name} width={40} height={40} className="mb-2 object-contain" unoptimized />}
          <span className="text-sm font-bold">{tA.name}</span>
        </button>
        <div className="text-neutral-500 font-bold text-sm">VS</div>
        <button 
          onClick={() => onSelect(teamB)}
          className={`flex-1 flex flex-col items-center p-3 rounded-xl transition-all ${selectedWinner === teamB ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.5)] scale-105' : 'bg-neutral-900 hover:bg-neutral-700 text-white'}`}
        >
          {tB.logo && <Image src={tB.logo} alt={tB.name} width={40} height={40} className="mb-2 object-contain" unoptimized />}
          <span className="text-sm font-bold">{tB.name}</span>
        </button>
      </div>
    </div>
  );
};

export default function PlayInStage({ data, updateData, onNext }: any) {
  const { west, east } = initialSeeds;
  
  // Handlers for West
  const handleWestG1 = (winner: string) => {
    updateData({ westSunsVsClippersWinner: winner, westEighthSeedWinner: null });
  };
  const handleWestG2 = (winner: string) => {
    updateData({ westWarriorsVsBlazersWinner: winner, westEighthSeedWinner: null });
  };
  
  // Handlers for East
  const handleEastG1 = (winner: string) => {
    updateData({ eastHeatVsHawksWinner: winner, eastEighthSeedWinner: null });
  };
  const handleEastG2 = (winner: string) => {
    updateData({ east76ersVsHornetsWinner: winner, eastEighthSeedWinner: null });
  };

  const westLoserG1 = data.westSunsVsClippersWinner ? (data.westSunsVsClippersWinner === west.playin.game1[0] ? west.playin.game1[1] : west.playin.game1[0]) : null;
  const eastLoserG1 = data.eastHeatVsHawksWinner ? (data.eastHeatVsHawksWinner === east.playin.game1[0] ? east.playin.game1[1] : east.playin.game1[0]) : null;

  const isComplete = data.westSunsVsClippersWinner && data.westWarriorsVsBlazersWinner && data.westEighthSeedWinner &&
                     data.eastHeatVsHawksWinner && data.east76ersVsHornetsWinner && data.eastEighthSeedWinner;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 max-w-4xl mx-auto"
    >
      <h2 className="text-3xl font-extrabold text-white text-center mb-8 tracking-wide">Torneo Play-In</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* West Play-in */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-blue-400 border-b border-blue-900 pb-2">Conferencia Oeste</h2>
          <MatchupCard 
            title="Juego 1 (Ganador obtiene el 7mo Sembrado)" 
            teamA={west.playin.game1[0]} teamB={west.playin.game1[1]} 
            selectedWinner={data.westSunsVsClippersWinner} 
            onSelect={handleWestG1} 
          />
          <MatchupCard 
            title="Juego 2 (Perdedor es eliminado)" 
            teamA={west.playin.game2[0]} teamB={west.playin.game2[1]} 
            selectedWinner={data.westWarriorsVsBlazersWinner} 
            onSelect={handleWestG2} 
          />
          <AnimatePresence>
            {westLoserG1 && data.westWarriorsVsBlazersWinner && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <div className="mt-4">
                  <MatchupCard 
                    title="Juego 3 (Ganador obtiene el 8vo Sembrado)" 
                    teamA={westLoserG1} teamB={data.westWarriorsVsBlazersWinner} 
                    selectedWinner={data.westEighthSeedWinner} 
                    onSelect={(w: string) => updateData({ westEighthSeedWinner: w })} 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* East Play-in */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-red-400 border-b border-red-900 pb-2">Conferencia Este</h2>
          <MatchupCard 
            title="Juego 1 (Ganador obtiene el 7mo Sembrado)" 
            teamA={east.playin.game1[0]} teamB={east.playin.game1[1]} 
            selectedWinner={data.eastHeatVsHawksWinner} 
            onSelect={handleEastG1} 
          />
          <MatchupCard 
            title="Juego 2 (Perdedor es eliminado)" 
            teamA={east.playin.game2[0]} teamB={east.playin.game2[1]} 
            selectedWinner={data.east76ersVsHornetsWinner} 
            onSelect={handleEastG2} 
          />
          <AnimatePresence>
            {eastLoserG1 && data.east76ersVsHornetsWinner && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <div className="mt-4">
                  <MatchupCard 
                    title="Juego 3 (Ganador obtiene el 8vo Sembrado)" 
                    teamA={eastLoserG1} teamB={data.east76ersVsHornetsWinner} 
                    selectedWinner={data.eastEighthSeedWinner} 
                    onSelect={(w: string) => updateData({ eastEighthSeedWinner: w })} 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <button 
          onClick={onNext}
          disabled={!isComplete} 
          className="px-12 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:opacity-50 disabled:shadow-none transition-all"
        >
          {isComplete ? "Continuar a los Playoffs" : "Selecciona todos los ganadores"}
        </button>
      </div>
    </motion.div>
  );
}
