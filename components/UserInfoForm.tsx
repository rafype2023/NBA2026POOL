import React from 'react';
import { motion } from 'framer-motion';

export default function UserInfoForm({ data, updateData, onNext }: any) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };

  const isComplete = data.name && data.phone && data.email && data.finalsMVP && data.finalScore;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 max-w-xl mx-auto rounded-3xl bg-neutral-900 shadow-2xl border border-neutral-800"
    >
      <h2 className="text-3xl font-extrabold text-white text-center mb-6">Enter Your Details</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-1">Full Name</label>
          <input type="text" name="name" value={data.name || ""} onChange={handleChange} className="w-full bg-neutral-800 border-none rounded-xl text-white px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition" placeholder="John Doe" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-1">Phone Number</label>
          <input type="tel" name="phone" value={data.phone || ""} onChange={handleChange} className="w-full bg-neutral-800 border-none rounded-xl text-white px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition" placeholder="(555) 123-4567" />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-1">Email Address</label>
          <input type="email" name="email" value={data.email || ""} onChange={handleChange} className="w-full bg-neutral-800 border-none rounded-xl text-white px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition" placeholder="john@example.com" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Finals MVP</label>
            <input type="text" name="finalsMVP" value={data.finalsMVP || ""} onChange={handleChange} className="w-full bg-neutral-800 border-none rounded-xl text-white px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition" placeholder="e.g. Shai Gilgeous-Alexander" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Final Match Score</label>
            <input type="text" name="finalScore" value={data.finalScore || ""} onChange={handleChange} className="w-full bg-neutral-800 border-none rounded-xl text-white px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition" placeholder="e.g. 104-98" />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button 
          onClick={onNext}
          disabled={!isComplete} 
          className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:opacity-50 disabled:shadow-none transition-all"
        >
          {isComplete ? "Start Prediction" : "Fill all fields"}
        </button>
      </div>
    </motion.div>
  );
}
