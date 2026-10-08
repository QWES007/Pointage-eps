import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';

export default function App() {
  const [teacher, setTeacher] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto mb-4">
          <button 
            onClick={() => setShowAdmin(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded shadow transition"
          >
            ← Retour au Pointage
          </button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Bouton discret d'accès administrateur en haut à droite */}
      <button 
        onClick={() => setShowAdmin(true)}
        className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-md shadow z-50 transition"
      >
        Accès Admin
      </button>

      {!teacher ? (
        <Login onLoginSuccess={(teacherData) => setTeacher(teacherData)} />
      ) : (
        <Dashboard teacher={teacher} onLogout={() => setTeacher(null)} />
      )}
    </div>
  );
}