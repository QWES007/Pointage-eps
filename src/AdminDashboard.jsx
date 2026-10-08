import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function AdminDashboard({ onLogout }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState('ALL');

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

  // Liste unique des professeurs pour le filtre et l'export par prof
  const teachersList = Array.from(new Set(logs.map(log => log.professeur))).filter(Boolean);

  const filteredLogs = selectedTeacher === 'ALL' 
    ? logs 
    : logs.filter(log => log.professeur === selectedTeacher);

  // Fonction d'export CSV
  const downloadCSV = (dataToExport, filename) => {
    if (dataToExport.length === 0) {
      alert("Aucune donnée à exporter.");
      return;
    }

    const headers = ["Professeur", "Type", "Distance (m)", "Statut", "Date et Heure"];
    const rows = dataToExport.map(log => [
      `"${log.professeur || ''}"`,
      `"${log.type === 'ARRIVAL' ? 'Arrivée' : 'Départ'}"`,
      log.distance_meters,
      `"${log.status === 'VALID' ? 'Validé' : 'Hors zone'}"`,
      `"${new Date(log.created_at).toLocaleString('fr-FR')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 w-full">
      {/* Conteneur Plein Écran */}
      <div className="w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-6 flex flex-col min-h-[90vh]">
        
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Tableau de Bord Admin - EPS</h1>
            <p className="text-xs text-slate-500">Suivi complet des pointages et rapports des enseignants</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => downloadCSV(filteredLogs, `rapport_pointages_${selectedTeacher === 'ALL' ? 'global' : selectedTeacher}.csv`)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
            >
              📥 Exporter en CSV ({selectedTeacher === 'ALL' ? 'Global' : selectedTeacher})
            </button>
            <button
              onClick={fetchLogs}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs px-3 py-2.5 rounded-xl transition font-medium"
            >
              🔄 Actualiser
            </button>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2.5 rounded-xl transition font-medium"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Filtre par Professeur */}
        <div className="mb-4 flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <label className="text-xs font-semibold text-slate-700">Filtrer par Professeur :</label>
          <select 
            value={selectedTeacher} 
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Tous les professeurs ({logs.length} pointages)</option>
            {teachersList.map((name, idx) => (
              <option key={idx} value={name}>{name}</option>
            ))}
          </select>
        </div>

        {/* Tableau des pointages */}
        {loading ? (
          <p className="text-center text-blue-600 py-16 font-medium">Chargement des données...</p>
        ) : filteredLogs.length === 0 ? (
          <p className="text-center text-slate-500 py-16">Aucun pointage trouvé pour cette sélection.</p>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase text-xs tracking-wider">
                  <th className="p-3.5">Professeur</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Distance</th>
                  <th className="p-3.5">Statut</th>
                  <th className="p-3.5">Date / Heure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-medium text-slate-900">{log.professeur}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        log.type === 'ARRIVAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {log.type === 'ARRIVAL' ? 'Arrivée' : 'Départ'}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600 font-medium">{Math.round(log.distance_meters)} m</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        log.status === 'VALID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {log.status === 'VALID' ? 'Validé' : 'Hors zone'}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500 text-xs font-medium">
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