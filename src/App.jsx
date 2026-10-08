import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';

export default function App() {
  const [teacher, setTeacher] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) {
    return (
      <div className="min-h-screen w-full relative bg-black/70 backdrop-blur-sm p-4 text-white">
        <div className="max-w-7xl mx-auto mb-4">
          <button 
            onClick={() => setShowAdmin(false)}
            className="bg-gray-800/90 hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-600 transition"
          >
            ← Retour au Pointage
          </button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-4">
      {/* Voile sombre semi-transparent pour faire ressortir la boîte de connexion */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0"></div>

      {/* Bouton d'accès administrateur calé en haut à droite */}
      <div className="absolute top-4 right-4 z-30">
        <button 
          onClick={() => setShowAdmin(true)}
          className="bg-indigo-600/90 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xl backdrop-blur-md border border-indigo-500/30 transition"
        >
          Accès Admin
        </button>
      </div>

      {/* Contenu central dynamique parfaitement centré */}
      <div className="relative z-20 w-full max-w-md flex flex-col items-center justify-center">
        {!teacher ? (
          <Login onLoginSuccess={(teacherData) => setTeacher(teacherData)} />
        ) : (
          <Dashboard teacher={teacher} onLogout={() => setTeacher(null)} />
        )}
      </div>
    </div>
  );
}