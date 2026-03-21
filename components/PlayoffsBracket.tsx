import React from 'react';
import { motion } from 'framer-motion';
import { teams, initialSeeds } from '@/lib/teams';
import Image from 'next/image';

const SeriesSelector = ({ teamA, teamB, seriesId, selections, updateSelections, title }: any) => {
  const tA = teams[teamA];
  const tB = teams[teamB];

  const currentSelection = selections[seriesId] || {};

  const handleWinner = (winner: string) => updateSelections(seriesId, { ...currentSelection, winner });
  const handleGames = (games: string) => updateSelections(seriesId, { ...currentSelection, games });

  if (!tA || !tB) return null;

  return (
    <div className="bg-neutral-800/80 p-3 rounded-xl border border-neutral-700 mb-4 shadow-lg">
      <div className="text-xs text-neutral-400 font-bold mb-2 text-center uppercase tracking-wider">{title}</div>
      <div className="flex justify-between items-center gap-2">
        <button 
          onClick={() => handleWinner(teamA)}
          className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-all ${currentSelection.winner === teamA ? 'bg-orange-500 text-black shadow-[0_0_10px_rgba(249,115,22,0.5)] scale-105' : 'bg-neutral-900 border border-neutral-700'}`}
        >
          {tA.logo && <Image src={tA.logo} alt={tA.name} width={24} height={24} className="object-contain" unoptimized />}
          <span className="text-xs font-bold truncate">{tA.name}</span>
        </button>
        <span className="text-neutral-500 text-xs font-black">VS</span>
        <button 
          onClick={() => handleWinner(teamB)}
          className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-all ${currentSelection.winner === teamB ? 'bg-orange-500 text-black shadow-[0_0_10px_rgba(249,115,22,0.5)] scale-105' : 'bg-neutral-900 border border-neutral-700'}`}
        >
          <span className="text-xs font-bold truncate">{tB.name}</span>
          {tB.logo && <Image src={tB.logo} alt={tB.name} width={24} height={24} className="object-contain" unoptimized />}
        </button>
      </div>
      
      {currentSelection.winner && (
        <div className="mt-3 flex justify-center gap-1 opacity-100 transition-opacity">
          {['4-0', '4-1', '4-2', '4-3'].map(g => (
            <button 
              key={g} 
              onClick={() => handleGames(g)}
              className={`px-2 py-1 text-xs font-bold rounded ${currentSelection.games === g ? 'bg-white text-black' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'}`}
            >
              {g}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function PlayoffsBracket({ data, updateData, onNext }: any) {
  const b = data.bracketSelections || {};
  
  const updateSelections = (seriesId: string, payload: any) => {
    updateData({ bracketSelections: { ...b, [seriesId]: payload } });
  };

  // Determine Matchups Round 1
  const westR1 = {
    s1: { a: initialSeeds.west[1], b: data.westEighthSeedWinner },
    s2: { a: initialSeeds.west[4], b: initialSeeds.west[5] },
    s3: { a: initialSeeds.west[3], b: initialSeeds.west[6] },
    s4: { a: initialSeeds.west[2], b: data.westSunsVsClippersWinner }
  };
  const eastR1 = {
    s1: { a: initialSeeds.east[1], b: data.eastEighthSeedWinner },
    s2: { a: initialSeeds.east[4], b: initialSeeds.east[5] },
    s3: { a: initialSeeds.east[3], b: initialSeeds.east[6] },
    s4: { a: initialSeeds.east[2], b: data.eastHeatVsHawksWinner }
  };

  // Round 2
  const westR2 = {
    s1: { a: b['west_r1_s1']?.winner, b: b['west_r1_s2']?.winner },
    s2: { a: b['west_r1_s3']?.winner, b: b['west_r1_s4']?.winner }
  };
  const eastR2 = {
    s1: { a: b['east_r1_s1']?.winner, b: b['east_r1_s2']?.winner },
    s2: { a: b['east_r1_s3']?.winner, b: b['east_r1_s4']?.winner }
  };

  // Conf Finals
  const westCF = { a: b['west_r2_s1']?.winner, b: b['west_r2_s2']?.winner };
  const eastCF = { a: b['east_r2_s1']?.winner, b: b['east_r2_s2']?.winner };

  // Finals
  const finals = { a: b['west_cf']?.winner, b: b['east_cf']?.winner };
  const champion = b['finals']?.winner;

  // Check Completion
  const seriesIds = [
    'west_r1_s1', 'west_r1_s2', 'west_r1_s3', 'west_r1_s4',
    'east_r1_s1', 'east_r1_s2', 'east_r1_s3', 'east_r1_s4',
    'west_r2_s1', 'west_r2_s2', 'east_r2_s1', 'east_r2_s2',
    'west_cf', 'east_cf', 'finals'
  ];
  const isComplete = seriesIds.every(id => b[id] && b[id].winner && b[id].games);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 w-full">
      <h2 className="text-3xl font-extrabold text-white text-center mb-8 tracking-wide">Cuadro de Playoffs</h2>
      
      <div className="flex flex-col xl:flex-row justify-between gap-6 overflow-x-auto pb-8 snap-x">
        {/* West Content */}
        <div className="flex-1 min-w-[300px] snap-center">
          <h3 className="text-xl font-bold text-blue-400 mb-4 text-center">OESTE</h3>
          <SeriesSelector title="1 vs 8" teamA={westR1.s1.a} teamB={westR1.s1.b} seriesId="west_r1_s1" selections={b} updateSelections={updateSelections} />
          <SeriesSelector title="4 vs 5" teamA={westR1.s2.a} teamB={westR1.s2.b} seriesId="west_r1_s2" selections={b} updateSelections={updateSelections} />
          <SeriesSelector title="3 vs 6" teamA={westR1.s3.a} teamB={westR1.s3.b} seriesId="west_r1_s3" selections={b} updateSelections={updateSelections} />
          <SeriesSelector title="2 vs 7" teamA={westR1.s4.a} teamB={westR1.s4.b} seriesId="west_r1_s4" selections={b} updateSelections={updateSelections} />
        </div>

        {/* Conf Semis West */}
        <div className="flex-1 min-w-[300px] flex flex-col justify-around snap-center">
          <SeriesSelector title="Semifinales Oeste 1" teamA={westR2.s1.a} teamB={westR2.s1.b} seriesId="west_r2_s1" selections={b} updateSelections={updateSelections} />
          <SeriesSelector title="Semifinales Oeste 2" teamA={westR2.s2.a} teamB={westR2.s2.b} seriesId="west_r2_s2" selections={b} updateSelections={updateSelections} />
        </div>

        {/* Center / Finals */}
        <div className="flex-1 min-w-[320px] flex flex-col justify-center snap-center relative">
          <div className="absolute inset-0 bg-neutral-900 border border-neutral-700 rounded-3xl -z-10 shadow-2xl"></div>
          <div className="p-4">
            <SeriesSelector title="Finales del Oeste" teamA={westCF.a} teamB={westCF.b} seriesId="west_cf" selections={b} updateSelections={updateSelections} />
            <div className="my-8">
              <SeriesSelector title="FINALES DE LA NBA" teamA={finals.a} teamB={finals.b} seriesId="finals" selections={b} updateSelections={updateSelections} />
            </div>
            <SeriesSelector title="Finales del Este" teamA={eastCF.a} teamB={eastCF.b} seriesId="east_cf" selections={b} updateSelections={updateSelections} />
          </div>
        </div>

        {/* Conf Semis East */}
        <div className="flex-1 min-w-[300px] flex flex-col justify-around snap-center">
          <SeriesSelector title="Semifinales Este 1" teamA={eastR2.s1.a} teamB={eastR2.s1.b} seriesId="east_r2_s1" selections={b} updateSelections={updateSelections} />
          <SeriesSelector title="Semifinales Este 2" teamA={eastR2.s2.a} teamB={eastR2.s2.b} seriesId="east_r2_s2" selections={b} updateSelections={updateSelections} />
        </div>

        {/* East Content */}
        <div className="flex-1 min-w-[300px] snap-center">
          <h3 className="text-xl font-bold text-red-400 mb-4 text-center">ESTE</h3>
          <SeriesSelector title="1 vs 8" teamA={eastR1.s1.a} teamB={eastR1.s1.b} seriesId="east_r1_s1" selections={b} updateSelections={updateSelections} />
          <SeriesSelector title="4 vs 5" teamA={eastR1.s2.a} teamB={eastR1.s2.b} seriesId="east_r1_s2" selections={b} updateSelections={updateSelections} />
          <SeriesSelector title="3 vs 6" teamA={eastR1.s3.a} teamB={eastR1.s3.b} seriesId="east_r1_s3" selections={b} updateSelections={updateSelections} />
          <SeriesSelector title="2 vs 7" teamA={eastR1.s4.a} teamB={eastR1.s4.b} seriesId="east_r1_s4" selections={b} updateSelections={updateSelections} />
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <button 
          onClick={onNext}
          disabled={!isComplete} 
          className="px-12 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:opacity-50 disabled:shadow-none transition-all"
        >
          {isComplete ? "Revisar y Enviar" : "Completa el cuadro"}
        </button>
      </div>
    </motion.div>
  );
}
