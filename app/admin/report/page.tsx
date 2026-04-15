"use client";

import React, { useState } from 'react';
import { teams } from '@/lib/teams';

export default function AdminReportPage() {
  const [code, setCode] = useState('');
  const [predictions, setPredictions] = useState<any[]>(null as any);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Acceso Denegado');
      }

      setPredictions(data.predictions);
    } catch (err: any) {
      setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const getTeamName = (id: string) => teams[id]?.name || id || 'N/A';
  
  const seriesLabels: Record<string, string> = {
    'west_r1_s1': 'Oeste: 1 vs 8',
    'west_r1_s2': 'Oeste: 4 vs 5',
    'west_r1_s3': 'Oeste: 3 vs 6',
    'west_r1_s4': 'Oeste: 2 vs 7',
    'west_r2_s1': 'Oeste: Semifinal 1',
    'west_r2_s2': 'Oeste: Semifinal 2',
    'west_cf': 'Oeste: Final Conferencia',
    'east_r1_s1': 'Este: 1 vs 8',
    'east_r1_s2': 'Este: 4 vs 5',
    'east_r1_s3': 'Este: 3 vs 6',
    'east_r1_s4': 'Este: 2 vs 7',
    'east_r2_s1': 'Este: Semifinal 1',
    'east_r2_s2': 'Este: Semifinal 2',
    'east_cf': 'Este: Final Conferencia',
    'finals': 'Finales de la NBA'
  };

  // The login screen if not authenticated
  if (!predictions) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-black text-white mb-6 text-center">🔐 Reporte PDF (Login)</h1>
          {error && <p className="text-red-500 mb-4 text-center font-bold">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded-xl p-4 text-white focus:border-orange-500 outline-none"
                placeholder="Código Secreto..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all"
            >
              {loading ? 'Cargando Datos...' : 'GENERAR REPORTE'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // The Report View
  return (
    <div className="min-h-screen bg-neutral-100 text-black">
      
      {/* Floating Print Button - Hidden on Print */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Imprimir / Guardar PDF
        </button>
      </div>

      <div className="print-container">
        {predictions.map((p, pIndex) => (
          <div key={pIndex} className="page-break bg-white w-full mx-auto p-12 relative flex flex-col justify-start" style={{ minHeight: '297mm', maxWidth: '210mm' }}>
            
            {/* Header section */}
            <div className="border-b-4 border-black pb-4 mb-6">
              <h1 className="text-4xl font-black uppercase tracking-tight text-center">{p.name}</h1>
            </div>

            {/* High level Data */}
            <div className="grid grid-cols-3 gap-4 mb-8">
               <div className="bg-neutral-100 p-4 rounded-lg text-center border border-neutral-200 flex flex-col items-center justify-center">
                  <div className="text-xs uppercase font-bold text-neutral-500 mb-2">Campeón NBA</div>
                  <div className="flex items-center gap-2">
                    {teams[p.champion]?.logo && (
                      <img src={teams[p.champion].logo} alt={getTeamName(p.champion)} className="w-8 h-8 object-contain drop-shadow-sm" />
                    )}
                    <span className="text-xl font-black text-blue-700 leading-none">{getTeamName(p.champion)}</span>
                  </div>
               </div>
               <div className="bg-neutral-100 p-4 rounded-lg text-center border border-neutral-200 flex flex-col items-center justify-center">
                  <div className="text-xs uppercase font-bold text-neutral-500 mb-1">MVP Finales</div>
                  <div className="text-lg font-black">{p.finalsMVP}</div>
               </div>
               <div className="bg-neutral-100 p-4 rounded-lg text-center border border-neutral-200 flex flex-col items-center justify-center">
                  <div className="text-xs uppercase font-bold text-neutral-500 mb-1">Marcador Final</div>
                  <div className="text-lg font-black">{p.finalScore}</div>
               </div>
            </div>

            {/* Play-In Section */}
            <div className="mb-6">
              <h2 className="text-lg font-black bg-black text-white px-3 py-1 mb-2">RESULTADOS PLAY-IN</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm border border-neutral-300 p-4 rounded-lg">
                <div className="flex justify-between border-b border-dotted border-neutral-300 pb-1">
                  <span className="text-neutral-600 font-bold">Oeste 7vs8</span>
                  <span className="font-black">{getTeamName(p.playInSelections?.westSunsVsClippersWinner)}</span>
                </div>
                <div className="flex justify-between border-b border-dotted border-neutral-300 pb-1">
                  <span className="text-neutral-600 font-bold">Este 7vs8</span>
                  <span className="font-black">{getTeamName(p.playInSelections?.east76ersVsHeatWinner)}</span>
                </div>
                <div className="flex justify-between border-b border-dotted border-neutral-300 pb-1">
                  <span className="text-neutral-600 font-bold">Oeste 9vs10</span>
                  <span className="font-black">{getTeamName(p.playInSelections?.westWarriorsVsBlazersWinner)}</span>
                </div>
                <div className="flex justify-between border-b border-dotted border-neutral-300 pb-1">
                  <span className="text-neutral-600 font-bold">Este 9vs10</span>
                  <span className="font-black">{getTeamName(p.playInSelections?.eastHornetsVsMagicWinner)}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-neutral-600 font-bold">Oeste 8vo Seed</span>
                  <span className="font-black">{getTeamName(p.playInSelections?.westEighthSeedWinner)}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-neutral-600 font-bold">Este 8vo Seed</span>
                  <span className="font-black">{getTeamName(p.playInSelections?.eastEighthSeedWinner)}</span>
                </div>
              </div>
            </div>

            {/* Bracket Breakdown */}
            <div className="flex-1">
              <h2 className="text-lg font-black bg-black text-white px-3 py-1 mb-3">CUADRO DE PLAYOFFS</h2>
              
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-neutral-200 text-black border border-neutral-300">
                    <th className="p-2 text-left w-1/2 border-r border-neutral-300">Serie</th>
                    <th className="p-2 text-center w-1/4 border-r border-neutral-300">Ganador</th>
                    <th className="p-2 text-center w-1/4">Juegos</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(seriesLabels).map((sKey, i) => {
                    const sel = p.bracketSelections?.[sKey];
                    return (
                      <tr key={sKey} className={`border border-neutral-300 ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}>
                        <td className="p-1.5 px-3 border-r border-neutral-300 font-bold text-neutral-700">{seriesLabels[sKey]}</td>
                        <td className="p-1.5 px-3 border-r border-neutral-300 text-center font-black uppercase text-blue-800">{getTeamName(sel?.winner)}</td>
                        <td className="p-1.5 px-3 text-center font-bold text-neutral-600">{sel?.games || 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer watermark */}
            <div className="mt-8 pt-4 border-t border-neutral-200 text-center text-xs text-neutral-400 uppercase font-bold">
              Reporte Oficial Predicciones NBA 2026 • Generado {new Date().toLocaleDateString()}
            </div>

          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background-color: white !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page-break { page-break-after: always; box-shadow: none !important; margin: 0 !important; width: 100% !important; min-height: 100vh !important; }
          .print-container { padding: 0 !important; margin: 0 !important; }
        }
        @media screen {
          .print-container { padding: 2rem 0; }
          .page-break { box-shadow: 0 10px 25px rgba(0,0,0,0.1); margin-bottom: 3rem; border: 1px solid #ddd; }
        }
      `}} />
    </div>
  );
}
