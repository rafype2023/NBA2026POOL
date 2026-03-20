"use client";

import React, { useState } from 'react';
import UserInfoForm from '@/components/UserInfoForm';
import PlayInStage from '@/components/PlayInStage';
import PlayoffsBracket from '@/components/PlayoffsBracket';
import ReviewSubmit from '@/components/ReviewSubmit';
import { CheckCircle2 } from 'lucide-react';

const steps = [
  { id: 1, name: 'Info' },
  { id: 2, name: 'Play-In' },
  { id: 3, name: 'Bracket' },
  { id: 4, name: 'Review' },
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<any>({});

  const updateData = (newData: any) => {
    setData((prev: any) => ({ ...prev, ...newData }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));

  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-500 via-orange-500 to-red-500 text-transparent bg-clip-text mb-4 tracking-tighter">
          2026 PLAYOFFS PREDICTOR
        </h1>
        
        {/* Progress Tracker */}
        <div className="flex justify-center items-center gap-4 md:gap-8 mt-8">
          {steps.map(s => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                step > s.id ? 'bg-orange-500 text-black shadow-[0_0_10px_rgba(249,115,22,0.8)]' :
                step === s.id ? 'border-2 border-orange-500 text-black shadow-[0_0_10px_rgba(249,115,22,0.8)]' :
                'bg-neutral-800 text-neutral-500'
              }`}>
                {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
              </div>
              <span className={`text-xs font-bold uppercase ${step >= s.id ? 'text-white' : 'text-neutral-600'}`}>
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        {step === 1 && <UserInfoForm data={data} updateData={updateData} onNext={nextStep} />}
        {step === 2 && <PlayInStage data={data} updateData={updateData} onNext={nextStep} />}
        {step === 3 && <PlayoffsBracket data={data} updateData={updateData} onNext={nextStep} />}
        {step === 4 && <ReviewSubmit data={data} />}
      </div>
    </main>
  );
}
