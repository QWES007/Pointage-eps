import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import stadiumBg from './assets/stadium-bg.jpg'; // Import de votre image (ajustez le chemin si besoin)

export default function App() {
  const [teacher, setTeacher] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center p-4 relative"
        style={{ backgroundImage: `url(${stadiumBg})` }}
      >
        {/* Voile sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-0"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto mb-4">
          <button 
            onClick={() => setShowAdmin(false)}
            className="bg-gray-800/80 hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-600 transition"
          >
            ← Retour au Pointage
          </button>
        </div>
        <div className="relative z-10">
          <AdminDashboard />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4"
      style={{ backgroundImage: `url(${stadiumBg})` }}
    >
      {/* Voile sombre semi-transparent en arrière-plan pour faire ressortir les formulaires */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-0"></div>

      {/* Bouton d'accès administrateur parfaitement calé en haut à droite */}
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={() => setShowAdmin(true)}
          className="bg-indigo-600/90 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xl backdrop-blur-md border border-indigo-500/30 transition"
        >
          Accès Admin
        </button>
      </div>

      {/* Contenu central dynamique avec effet de carte moderne */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center">
        {!teacher ? (
          <Login onLoginSuccess={(teacherData) => setTeacher(teacherData)} />
        ) : (
          <Dashboard teacher={teacher} onLogout={() => setTeacher(null)} />
        )}
      </div>
    </div>
  );
}