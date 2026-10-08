import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';

export default function App() {
  const [teacher, setTeacher] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) {
    return (
      <div className="min-h-screen w-full bg-slate-950 p-6 text-white flex flex-col">
        <div className="max-w-7xl mx-auto mb-6 w-full">
          <button 
            onClick={() => setShowAdmin(false)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg transition"
          >
            ← Retour au Pointage
          </button>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <AdminDashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Bouton d'accès administrateur discret en haut à droite */}
      <div className="absolute top-6 right-6 z-30">
        <button 
          onClick={() => setShowAdmin(true)}
          className="bg-white/10 hover:bg-white/20 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg backdrop-blur-md border border-white/20 transition transform hover:scale-105"
        >
          🔐 Accès Admin
        </button>
      </div>

      {/* Carte centrale moderne inspirée de la maquette */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/25 p-8 rounded-3xl shadow-2xl flex flex-col items-center relative z-20">
        
        {/* Icône utilisateur distinctive */}
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4 text-blue-600 border border-white/40">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>

        <div className="text-center mb-6 w-full">
          <h1 className="text-3xl font-extrabold text-white tracking-wider mb-1">LOGIN</h1>
          <p className="text-blue-100 text-sm">Pointage EPS - Espace Enseignant</p>
        </div>

        <div className="w-full flex flex-col items-center">
          {!teacher ? (
            <Login onLoginSuccess={(teacherData) => setTeacher(teacherData)} />
          ) : (
            <Dashboard teacher={teacher} onLogout={() => setTeacher(null)} />
          )}
        </div>
      </div>
    </div>
  );
}