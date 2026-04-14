"use client";

import React, { useState } from 'react';
import { teams } from '@/lib/teams';
import { motion } from 'framer-motion';

export default function AdminPage() {
  const [code, setCode] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Acceso Denegado');
      }

      setStats(data.stats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTeamName = (id: string) => {
    return teams[id]?.name || id;
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-black text-white mb-6 text-center">🔐 Admin Login</h1>
          {error && <p className="text-red-500 mb-4 text-center font-bold">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-neutral-400 mb-2 font-bold text-sm">Código Secreto</label>
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded-xl p-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="Ingresa el código..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black py-4 rounded-xl transition-all"
            >
              {loading ? 'Verificando...' : 'ENTRAR'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderSortedObj = (obj: Record<string, number>, labelMapper?: (k: string) => string) => {
    return Object.entries(obj || {})
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => (
        <div key={key} className="flex justify-between items-center py-2 border-b border-neutral-800 last:border-0 text-sm">
          <span className="text-neutral-300 font-bold">{labelMapper ? labelMapper(key) : key}</span>
          <span className="text-orange-500 font-black bg-orange-500/10 px-3 py-1 rounded-full">{count}</span>
        </div>
      ));
  };

  const renderChampions3D = (obj: Record<string, number>) => {
    const entries = Object.entries(obj || {}).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) return null;
    const maxCount = entries[0][1];

    return (
      <div className="flex flex-col gap-5 mt-4">
        {entries.map(([id, count], index) => {
          const widthPercent = Math.max((count / maxCount) * 100, 5);
          const team = teams[id];
          
          return (
             <div key={id} className="relative w-full h-12 flex items-center gap-2">
               {team && team.logo ? (
                 <div className="w-10 h-10 flex-shrink-0 bg-white rounded-full p-1 shadow-[0_0_15px_rgba(249,115,22,0.4)] z-10 relative">
                   <img src={team.logo} alt={team.name} className="w-full h-full object-contain drop-shadow-md" />
                 </div>
               ) : (
                 <div className="w-10 h-10 flex-shrink-0 bg-neutral-800 rounded-full border border-neutral-600 flex items-center justify-center text-xs font-bold text-white z-10">
                   {id}
                 </div>
               )}
               
               <div className="relative flex-1 h-10 bg-neutral-900 rounded-r-xl border border-neutral-800 shadow-[inset_0_4px_6px_rgba(0,0,0,0.8)] ring-1 ring-white/5 overflow-hidden">
                  {/* The 3D Bar */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ duration: 1.2, delay: index * 0.1, ease: 'easeOut' }}
                    className="absolute top-0 left-0 h-full flex items-center justify-end pr-3 rounded-r-xl"
                    style={{
                      background: 'linear-gradient(180deg, #fca5a5 0%, #ef4444 30%, #b91c1c 80%, #7f1d1d 100%)',
                      boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.5), 5px 0 15px rgba(239,68,68,0.5)',
                      borderRight: '1px solid #fca5a5',
                      borderTop: '1px solid #fecaca'
                    }}
                  >
                     <span className="font-black text-white text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] relative z-20">
                       {count}
                     </span>
                  </motion.div>
                  
                  {/* Label overlaid */}
                  <div className="absolute top-0 left-4 h-full flex items-center pointer-events-none z-10 mix-blend-screen text-white">
                    <span className="font-extrabold uppercase tracking-wider text-sm drop-shadow-[0_2px_2px_rgba(0,0,0,1)] text-white/90">
                      {getTeamName(id)}
                    </span>
                  </div>
               </div>
             </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-neutral-800 pb-4">
          <h1 className="text-3xl md:text-5xl font-black text-orange-500">Estadísticas Admin</h1>
          <div className="text-neutral-400 font-bold bg-neutral-900 px-4 py-2 rounded-xl border border-neutral-800">
            Total Predicciones: <span className="text-white text-xl ml-2">{stats.total}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Champions */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-lg md:col-span-2 lg:col-span-3">
            <h2 className="text-2xl font-black text-white mb-6 border-b border-neutral-800 pb-2">
              🏆 Distribución de Campeones (3D)
            </h2>
            {renderChampions3D(stats.champions)}
          </div>

          {/* MVPs */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              ⭐ MVP de las Finales
            </h2>
            <div className="space-y-1">
              {renderSortedObj(stats.mvps)}
            </div>
          </div>

          {/* Play-In West Game 1 */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              Oeste: Suns vs Clippers
            </h2>
            <div className="space-y-1">
              {renderSortedObj(stats.playIn.westSunsVsClippersWinner, getTeamName)}
            </div>
          </div>

          {/* Play-In West Game 2 */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              Oeste: Warriors vs Blazers
            </h2>
            <div className="space-y-1">
              {renderSortedObj(stats.playIn.westWarriorsVsBlazersWinner, getTeamName)}
            </div>
          </div>

           {/* Play-In West 8th Seed */}
           <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              Oeste: Octavo Sembrado
            </h2>
            <div className="space-y-1">
              {renderSortedObj(stats.playIn.westEighthSeedWinner, getTeamName)}
            </div>
          </div>

          {/* Play-In East Game 1 */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              Este: 76ers vs Heat
            </h2>
            <div className="space-y-1">
              {renderSortedObj(stats.playIn.east76ersVsHeatWinner, getTeamName)}
            </div>
          </div>

          {/* Play-In East Game 2 */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              Este: Hornets vs Magic
            </h2>
            <div className="space-y-1">
              {renderSortedObj(stats.playIn.eastHornetsVsMagicWinner, getTeamName)}
            </div>
          </div>

          {/* Play-In East 8th Seed */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              Este: Octavo Sembrado
            </h2>
            <div className="space-y-1">
              {renderSortedObj(stats.playIn.eastEighthSeedWinner, getTeamName)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
