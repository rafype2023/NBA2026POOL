"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, X } from 'lucide-react';

export default function TipsPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const eastVideos = [
    { id: 'e1', title: 'Boston Celtics', src: '/tips/e-celtics.mp4' },
    { id: 'e2', title: 'Detroit Pistons', src: '/tips/e-detroit.mp4' },
    { id: 'e3', title: 'New York Knicks', src: '/tips/e-knicks.mp4' },
    { id: 'e4', title: 'Philadelphia 76ers', src: '/tips/e-sixers.mp4' },
  ];

  const westVideos = [
    { id: 'w1', title: 'Shai Gilgeous-Alexander - OKC Thunder', src: '/tips/w- shai.mp4' },
    { id: 'w2', title: 'Nikola Jokic - Denver Nuggets', src: '/tips/w-jokic.mp4' },
    { id: 'w3', title: 'Los Angeles Lakers', src: '/tips/w-lekrs.mp4' },
    { id: 'w4', title: 'Victor Wembanyama - San Antonio Spurs', src: '/tips/w-wemby.mp4' },
  ];

  const renderVideoGrid = (videos: typeof eastVideos) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {videos.map((v) => (
        <div 
          key={v.id} 
          onClick={() => setSelectedVideo(v.src)}
          className="group cursor-pointer bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 shadow-lg transition-all hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] flex flex-col"
        >
          <div className="aspect-video bg-black relative">
            <video 
              src={`${v.src}#t=0.1`} 
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none"
              preload="metadata"
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-500/80 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-blue-500 transition-all backdrop-blur-sm">
                <Play className="w-5 h-5 md:w-6 md:h-6 ml-1" />
              </div>
            </div>
          </div>
          <div className="p-3 bg-gradient-to-b from-neutral-800 to-neutral-900 flex-1 flex flex-col justify-center">
            <h2 className="text-sm md:text-base font-bold text-neutral-200 text-center leading-tight line-clamp-2">
              {v.title}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 mb-8 transition-colors font-bold uppercase tracking-wider text-sm">
          <ArrowLeft className="w-5 h-5" />
          Volver al Inicio
        </Link>
        
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-500 via-orange-500 to-red-500 text-transparent bg-clip-text mb-12 tracking-tighter">
          VIDEOS Y CONSEJOS
        </h1>
        
        {/* Eastern Conference Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-blue-500 uppercase tracking-widest mb-6 border-b-2 border-blue-500/30 pb-2">
            Conferencia Este
          </h2>
          {renderVideoGrid(eastVideos)}
        </div>

        {/* Western Conference Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-orange-500 uppercase tracking-widest mb-6 border-b-2 border-orange-500/30 pb-2">
            Conferencia Oeste
          </h2>
          {renderVideoGrid(westVideos)}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)] bg-black border border-neutral-800">
            <button 
              className="absolute top-4 right-4 z-10 w-10 h-10 md:w-12 md:h-12 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
              onClick={() => setSelectedVideo(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video w-full bg-black">
              <video 
                src={selectedVideo} 
                className="w-full h-full"
                controls
                autoPlay
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
