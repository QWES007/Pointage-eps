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
    <div className="fixed inset-0 w-screen h-screen overflow-hidden flex items-center justify-center">
      {/* 1. Image du stade en arrière-plan absolu */}
      <img 
        src="/stadium-bg.jpg" 
        alt="Stadion Background" 
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* 2. Voile sombre réglable pour transformer le stade en filigrane discret */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] z-10"></div>

      {/* 3. Bouton d'accès administrateur en haut à droite */}
      <div className="absolute top-6 right-6 z-30">
        <button 
          onClick={() => setShowAdmin(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-2xl backdrop-blur-md border border-indigo-400/40 transition transform hover:scale-105"
        >
          🔐 Accès Admin
        </button>
      </div>

      {/* 4. Carte de connexion / formulaire parfaitement centrée au milieu */}
      <div className="relative z-20 w-full max-w-md mx-4 bg-gray-900/85 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col items-center">
        <div className="text-center mb-6 w-full">
          <h1 className="text-3xl font-extrabold text-white tracking-wide mb-1">Pointage EPS</h1>
          <p className="text-gray-300 text-sm">Espace de pointage des enseignants</p>
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