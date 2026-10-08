import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';

export default function App() {
  const [teacher, setTeacher] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-md p-6 text-white overflow-y-auto flex flex-col">
        <div className="max-w-7xl mx-auto mb-6 w-full">
          <button 
            onClick={() => setShowAdmin(false)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg border border-indigo-400/30 transition transform hover:scale-105"
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
    <div className="fixed inset-0 w-screen h-screen flex flex-col md:flex-row bg-slate-900 overflow-hidden">
      {/* Bouton d'accès administrateur flottant en haut à droite */}
      <div className="absolute top-6 right-6 z-30">
        <button 
          onClick={() => setShowAdmin(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-2xl backdrop-blur-md border border-indigo-400/40 transition transform hover:scale-105"
        >
          🔐 Accès Admin
        </button>
      </div>

      {/* Colonne Gauche : L'image complète du stade (non masquée, nette) */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-black">
        <img 
          src="/stadium-bg.jpg" 
          alt="Stade EPS" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden"></div>
      </div>

      {/* Colonne Droite : Espace de connexion moderne avec effet glassmorphism épuré */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center p-6 sm:p-12 bg-slate-900/95 relative z-20">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col items-center">
          
          {/* Icône / En-tête style carte login */}
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 border border-indigo-400/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          <div className="text-center mb-6 w-full">
            <h1 className="text-3xl font-extrabold text-white tracking-wide mb-1">Pointage EPS</h1>
            <p className="text-gray-300 text-sm">Connexion à l'espace enseignant</p>
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
    </div>
  );
}