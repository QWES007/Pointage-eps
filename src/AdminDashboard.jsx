import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function AdminDashboard({ onLogout }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('v_attendance_with_teachers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur chargement historique:', error);
    } else {
      setLogs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Tableau de Bord Admin</h1>
            <p className="text-xs text-slate-500">Suivi des pointages EPS - Complexe Jesse-Jackson</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={fetchLogs}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs px-3 py-2 rounded transition"
            >
              Actualiser
            </button>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded transition"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-blue-600 py-10 font-medium">Chargement des pointages...</p>
        ) : logs.length === 0 ? (
          <p className="text-center text-slate-500 py-10">Aucun pointage enregistré pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-3">Professeur</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Distance</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Date / Heure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-800">{log.professeur}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        log.type === 'ARRIVAL' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {log.type === 'ARRIVAL' ? 'Arrivée' : 'Départ'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{Math.round(log.distance_meters)} m</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        log.status === 'VALID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {log.status === 'VALID' ? 'Validé' : 'Hors zone'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 text-xs">
                      {new Date(log.created_at).toLocaleString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}