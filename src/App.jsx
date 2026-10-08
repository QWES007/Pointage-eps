import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';

export default function App() {
  const [teacher, setTeacher] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) {
    return (
      <div className="min-h-screen w-full relative bg-black/80 backdrop-blur-md p-6 text-white flex flex-col">
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
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-4">
      {/* Voile sombre pour faire ressortir la carte du stade */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px] z-0"></div>

      {/* Bouton d'accès administrateur très visible en haut à droite */}
      <div className="absolute top-6 right-6 z-30">
        <button 
          onClick={() => setShowAdmin(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-2xl backdrop-blur-md border border-indigo-400/40 transition transform hover:scale-105"
        >
          🔐 Accès Admin
        </button>
      </div>

      {/* Carte centrale moderne contenant le formulaire, parfaitement centrée au milieu */}
      <div className="relative z-20 w-full max-w-md mx-auto bg-gray-900/80 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col items-center">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-wide mb-1">Pointage EPS</h1>
          <p className="text-gray-300 text-sm">Espace de pointage des enseignants</p>
        </div>

        <div className="w-full">
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