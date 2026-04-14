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
      <h2 className="text-3xl font-extrabold text-white text-center mb-6">Ingresa tus Datos</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-1">Nombre Completo</label>
          <input type="text" name="name" value={data.name || ""} onChange={handleChange} className="w-full bg-neutral-800 border-none rounded-xl text-white px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition" placeholder="Juan Pérez" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-1">Número de Teléfono</label>
          <input type="tel" name="phone" value={data.phone || ""} onChange={handleChange} className="w-full bg-neutral-800 border-none rounded-xl text-white px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition" placeholder="(555) 123-4567" />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-1">Correo Electrónico</label>
          <input type="email" name="email" value={data.email || ""} onChange={handleChange} className="w-full bg-neutral-800 border-none rounded-xl text-white px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition" placeholder="juan@ejemplo.com" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">MVP de las Finales</label>
            <input type="text" name="finalsMVP" value={data.finalsMVP || ""} onChange={handleChange} className="w-full bg-neutral-800 border-none rounded-xl text-white px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition" placeholder="ej. Shai Gilgeous-Alexander" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Marcador Final</label>
            <input type="text" name="finalScore" value={data.finalScore || ""} onChange={handleChange} className="w-full bg-neutral-800 border-none rounded-xl text-white px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition" placeholder="ej. 104-98" />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="text-center">
          <button 
            disabled={true} 
            className="w-full py-4 rounded-xl font-bold text-lg bg-neutral-600 text-neutral-400 cursor-not-allowed shadow-none"
          >
            Completa todos los campos
          </button>
          <p className="text-red-500 font-bold text-xl mt-4 uppercase tracking-widest animate-pulse">YA empezaron los Juegos</p>
        </div>
      </div>
    </motion.div>
  );
}
