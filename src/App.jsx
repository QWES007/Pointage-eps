import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';

export default function App() {
  const [teacher, setTeacher] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  // Style d'arrière-plan commun pour les deux vues
  const bgStyle = {
    backgroundImage: `url('/stadium-bg.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed' // Garde l'image fixe pendant le scroll
  };

  if (showAdmin) {
    return (
      <div 
        className="min-h-screen p-4 relative"
        style={bgStyle}
      >
        {/* Voile sombre semi-transparent pour la lisibilité */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        
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
      className="relative w-full min-h-screen flex flex-col items-center justify-center p-4"
      style={bgStyle}
    >
      {/* Voile sombre semi-transparent en arrière-plan */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Bouton d'accès administrateur parfaitement calé en haut à droite */}
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={() => setShowAdmin(true)}
          className="bg-indigo-600/90 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xl backdrop-blur-md border border-indigo-500/30 transition"
        >
          Accès Admin
        </button>
      </div>

      {/* Contenu central dynamique et centré */}
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