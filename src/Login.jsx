import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // Assurez-vous que le chemin vers votre client Supabase est correct

export default function Login({ onLoginSuccess }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Interrogation de la base de données Supabase pour authentifier l'enseignant
      const { data, error: sbError } = await supabase
        .from('v_attendance_with_teachers') // ou votre table de référence des enseignants
        .select('*')
        .eq('phone', phone)
        .eq('password', password)
        .single();

      if (sbError || !data) {
        setError('Numéro de téléphone ou mot de passe incorrect.');
      } else {
        onLoginSuccess(data);
      }
    } catch (err) {
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full flex flex-col items-center space-y-4">
      {error && (
        <div className="w-full bg-red-500/20 border border-red-500 text-red-200 text-xs p-3 rounded-xl text-center">
          {error}
        </div>
      )}

      <div className="w-full flex flex-col space-y-1">
        <label className="text-xs font-semibold text-gray-200 text-left">Téléphone</label>
        <input 
          type="text" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ex: 0700000000" 
          required
          className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition text-sm"
        />
      </div>

      <div className="w-full flex flex-col space-y-1">
        <label className="text-xs font-semibold text-gray-200 text-left">Mot de passe</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••" 
          required
          className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition text-sm"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg border border-indigo-400/30 transition transform hover:scale-[1.02] text-sm flex items-center justify-center cursor-pointer"
      >
        {loading ? "Connexion en cours..." : "Se connecter"}
      </button>
    </form>
  );
}