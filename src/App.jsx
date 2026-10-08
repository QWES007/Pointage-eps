import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';

export default function App() {
  const [teacher, setTeacher] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminError, setAdminError] = useState('');

  const ADMIN_PASSWORD = "Admin2026@EPS";

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setAdminError('');
    } else {
      setAdminError('Mot de passe administrateur incorrect.');
    }
  };

  if (showAdmin) {
    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-white">
            <div className="w-16 h-16 bg-red-600/20 border border-red-500 rounded-2xl flex items-center justify-center shadow-lg mb-4 text-red-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-1">Sécurité Admin</h2>
            <p className="text-xs text-gray-300 mb-6 text-center">Entrez le mot de passe pour accéder au tableau de bord</p>
            
            <form onSubmit={handleAdminLogin} className="w-full flex flex-col space-y-4">
              {adminError && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 text-xs p-3 rounded-xl text-center">
                  {adminError}
                </div>
              )}
              <input 
                type="password"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="Mot de passe admin"
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition text-sm"
              />
              <div className="flex space-x-3 mt-2">
                <button
                  type="button"
                  onClick={() => { setShowAdmin(false); setIsAdminAuthenticated(false); setAdminPasswordInput(''); setAdminError(''); }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-xl transition text-sm cursor-pointer"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition text-sm cursor-pointer"
                >
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen w-full bg-slate-950 p-6 text-white flex flex-col">
        <div className="max-w-7xl mx-auto mb-6 w-full">
          <button 
            onClick={() => { setShowAdmin(false); setIsAdminAuthenticated(false); setAdminPasswordInput(''); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg transition cursor-pointer"
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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-6 right-6 z-30">
        <button 
          onClick={() => setShowAdmin(true)}
          className="bg-white/10 hover:bg-white/20 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg backdrop-blur-md border border-white/20 transition transform hover:scale-105 cursor-pointer"
        >
          🔐 Accès Admin
        </button>
      </div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col items-center z-10">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4 text-blue-600 border border-white/40">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>

        <div className="text-center mb-6 w-full">
          <h1 className="text-3xl font-extrabold text-white tracking-wider mb-1">LOGIN</h1>
          <p className="text-blue-100 text-sm">Pointage EPS - Espace Enseignant</p>
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