import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';

export default function App() {
  const [teacher, setTeacher] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) {
    return (
      <div className="min-h-screen w-full relative bg-gray-900 text-white p-4">
        {/* Image d'arrière-plan en plein écran absolu */}
        <img 
          src="/stadium-bg.jpg" 
          alt="Stadion EPS" 
          className="fixed inset-0 w-full h-full object-cover z-0"
        />
        {/* Voile sombre */}
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto mb-4">
          <button 
            onClick={() => setShowAdmin(false)}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-600 transition"
          >
            ← Retour au Pointage
          </button>
        </div>
        <div className="relative z-20">
          <AdminDashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* Image d'arrière-plan en plein écran absolu qui couvre 100% de la vue */}
      <img 
        src="/stadium-bg.jpg" 
        alt="Stadion EPS" 
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Voile sombre semi-transparent par-dessus l'image */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10"></div>

      {/* Bouton d'accès administrateur calé en haut à droite */}
      <div className="absolute top-4 right-4 z-30">
        <button 
          onClick={() => setShowAdmin(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xl border border-indigo-500/30 transition"
        >
          Accès Admin
        </button>
      </div>

      {/* Contenu central dynamique et centré */}
      <div className="relative z-20 w-full max-w-md flex flex-col items-center justify-center p-4">
        {!teacher ? (
          <Login onLoginSuccess={(teacherData) => setTeacher(teacherData)} />
        ) : (
          <Dashboard teacher={teacher} onLogout={() => setTeacher(null)} />
        )}
      </div>
    </div>
  );
}