"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, ArrowLeft, Loader2 } from 'lucide-react';
import { teams } from '@/lib/teams';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function StandingsPage() {
    const [standings, setStandings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [activeImage, setActiveImage] = useState('/assets/NBASCORES.jpg');

    useEffect(() => {
        fetch('/api/standings')
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    setStandings(data.standings);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-orange-500 mb-8 transition-colors">
                   <ArrowLeft className="w-5 h-5" />
                   Volver al Predictor
                </Link>

                <div className="text-center mb-12 flex flex-col items-center">
                   <Trophy className="w-20 h-20 text-orange-500 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]" />
                   <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text tracking-tighter uppercase mb-2">
                       Posiciones Oficiales
                   </h1>
                   <p className="text-neutral-400 max-w-xl mx-auto text-sm md:text-base mb-8">
                       Puntajes en vivo calculados dinámicamente contra el cuadro maestro.
                   </p>

                   <div className="flex flex-col md:flex-row gap-4 mt-2 justify-center">
                       <button 
                           onClick={() => { setActiveImage('/assets/NBASCORES.jpg'); setIsImageOpen(true); }} 
                           className="relative w-64 h-36 md:w-80 md:h-[180px] rounded-xl overflow-hidden border-2 border-orange-500/30 hover:border-orange-500 transition-all shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] group cursor-zoom-in"
                       >
                           <Image src="/assets/NBASCORES.jpg" alt="NBA Scores Format" fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                           <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                               <span className="text-white font-bold uppercase tracking-widest text-sm bg-black/80 px-4 py-2 rounded-full border border-white/10">Ver Puntajes</span>
                           </div>
                       </button>

                       <button 
                           onClick={() => { setActiveImage('/assets/playoffs.jpg'); setIsImageOpen(true); }} 
                           className="relative w-64 h-36 md:w-80 md:h-[180px] rounded-xl overflow-hidden border-2 border-orange-500/30 hover:border-orange-500 transition-all shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] group cursor-zoom-in"
                       >
                           <Image src="/assets/playoffs.jpg" alt="Playoffs Bracket" fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                           <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                               <span className="text-white font-bold uppercase tracking-widest text-sm bg-black/80 px-4 py-2 rounded-full border border-white/10">Ver Playoffs</span>
                           </div>
                       </button>
                   </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                        <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">Calculando Números...</span>
                    </div>
                ) : (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.1)] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead>
                                    <tr className="bg-neutral-950 text-neutral-400 text-xs md:text-sm uppercase tracking-wider border-b border-neutral-800">
                                        <th className="p-4 md:p-6 font-bold text-center w-24">Posición</th>
                                        <th className="p-4 md:p-6 font-bold">Jugador</th>
                                        <th className="p-4 md:p-6 font-bold max-w-[150px]">Campeón Predicho</th>
                                        <th className="p-4 md:p-6 font-bold text-center">Play-In</th>
                                        <th className="p-4 md:p-6 font-bold text-center">R1</th>
                                        <th className="p-4 md:p-6 font-bold text-center">Semis</th>
                                        <th className="p-4 md:p-6 font-bold text-center">Finales Conf</th>
                                        <th className="p-4 md:p-6 font-bold text-center">Finales</th>
                                        <th className="p-4 md:p-6 font-black text-orange-400 text-right text-lg">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800/50">
                                    {standings.map((s) => (
                                        <tr key={s.id} className="hover:bg-neutral-800/40 transition-colors group">
                                            <td className="p-4 md:p-6 text-center">
                                                <span className={`inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full font-black text-sm md:text-base
                                                    ${s.rank === 1 ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-black shadow-[0_0_20px_rgba(234,179,8,0.5)] scale-110' : 
                                                      s.rank === 2 ? 'bg-gradient-to-br from-neutral-200 to-neutral-400 text-black shadow-[0_0_15px_rgba(163,163,163,0.3)]' : 
                                                      s.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-[0_0_15px_rgba(180,83,9,0.3)]' : 
                                                      'bg-neutral-800 text-neutral-400 font-bold'}`}>
                                                    {s.rank}
                                                </span>
                                            </td>
                                            <td className="p-4 md:p-6 font-bold text-white text-base md:text-lg">{s.name}</td>
                                            <td className="p-4 md:p-6">
                                                {teams[s.champion] ? (
                                                    <div className="flex items-center gap-3">
                                                        {teams[s.champion].logo ? (
                                                            <div className="w-8 h-8 relative rounded-full overflow-hidden bg-neutral-800 border border-neutral-700">
                                                                <Image src={teams[s.champion].logo} alt={teams[s.champion].name} fill className="object-cover p-1" unoptimized/>
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700" />
                                                        )}
                                                        <span className="text-sm text-neutral-300 font-medium">{teams[s.champion].name}</span>
                                                    </div>
                                                ) : <span className="text-neutral-600 text-xs uppercase font-bold tracking-widest">Indeciso</span>}
                                            </td>
                                            <td className="p-4 md:p-6 text-center text-neutral-400 font-medium">{s.scorePlayin} pts</td>
                                            <td className="p-4 md:p-6 text-center text-neutral-400 font-medium">{s.scoreR1} pts</td>
                                            <td className="p-4 md:p-6 text-center text-neutral-400 font-medium">{s.scoreSemis} pts</td>
                                            <td className="p-4 md:p-6 text-center text-neutral-400 font-medium">{s.scoreCf} pts</td>
                                            <td className="p-4 md:p-6 text-center text-neutral-400 font-medium">{s.scoreFinals} pts</td>
                                            <td className="p-4 md:p-6 text-right">
                                                <div className="text-2xl md:text-3xl font-black text-white group-hover:text-orange-400 tracking-tighter transition-colors">
                                                    {s.totalPoints.toFixed(1)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {standings.length === 0 && (
                                        <tr>
                                            <td colSpan={9} className="p-12 text-center text-neutral-500 text-lg">
                                                No se encontraron participantes, ¡o falta el registro maestro <span className="text-orange-500 font-bold">Clave-Clave</span>!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isImageOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsImageOpen(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm cursor-zoom-out"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.3)] bg-neutral-900 border border-neutral-800 flex flex-col cursor-default"
                        >
                            <div className="flex justify-between items-center p-4 border-b border-neutral-800 bg-black/50">
                                <h3 className="font-bold text-white uppercase tracking-widest text-sm">Referencia de Puntajes NBA</h3>
                                <button 
                                    onClick={() => setIsImageOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-orange-500 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="relative w-full flex-1 overflow-auto bg-black p-2 flex justify-center items-center min-h-[50vh]">
                                <img src={activeImage} alt="Referencia" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
