import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { calculateDistance, STADIUM_COORDS, ALLOWED_RADIUS_METERS } from './utils/haversine';

export default function Dashboard({ teacher, onLogout }) {
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [myHistory, setMyHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const checkPosition = () => {
    setLoadingGeo(true);
    if (!navigator.geolocation) {
      alert('La géolocalisation n’est pas supportée par votre navigateur.');
      setLoadingGeo(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocation({ lat, lon });

        const dist = calculateDistance(lat, lon, STADIUM_COORDS.latitude, STADIUM_COORDS.longitude);
        setDistance(Math.round(dist));
        setLoadingGeo(false);
      },
      (error) => {
        alert('Impossible de récupérer votre position GPS. Veuillez activer le GPS.');
        setLoadingGeo(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const fetchMyHistory = async () => {
    setLoadingHistory(true);
    const { data, error } = await supabase
      .from('attendance_logs')
      .select('*')
      .eq('teacher_id', teacher.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setMyHistory(data || []);
    }
    setLoadingHistory(false);
  };

  useEffect(() => {
    checkPosition();
    fetchMyHistory();
  }, [teacher.id]);

  const handleAttendance = async (type) => {
    if (!location) {
      alert("Position GPS non disponible. Veuillez actualiser.");
      return;
    }

    setActionLoading(true);
    setStatusMsg('');

    const dist = calculateDistance(location.lat, location.lon, STADIUM_COORDS.latitude, STADIUM_COORDS.longitude);
    const status = dist <= ALLOWED_RADIUS_METERS ? 'VALID' : 'OUT_OF_ZONE';

    try {
      const { error } = await supabase.from('attendance_logs').insert([
        {
          teacher_id: teacher.id,
          type: type,
          latitude: location.lat,
          longitude: location.lon,
          distance_meters: Math.round(dist),
          status: status
        }
      ]);

      if (error) throw error;

      if (status === 'VALID') {
        setStatusMsg(`Pointage [${type === 'ARRIVAL' ? 'Arrivée' : 'Départ'}] validé avec succès (${Math.round(dist)}m du terrain) !`);
      } else {
        setStatusMsg(`Attention : Vous êtes hors zone (${Math.round(dist)}m). Pointage enregistré hors zone.`);
      }

      // Rafraîchir l'historique personnel
      fetchMyHistory();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement du pointage.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* En-tête Espace Enseignant */}
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-md flex justify-between items-center">
          <div>
            <h1 className="font-bold text-xl">{teacher.full_name}</h1>
            <p className="text-xs text-blue-100">Espace Personnel - Pointage EPS</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-blue-700 hover:bg-blue-800 text-xs font-semibold px-4 py-2 rounded-xl transition"
          >
            Déconnexion
          </button>
        </div>

        {/* Message de statut */}
        {statusMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm text-center font-medium shadow-sm">
            {statusMsg}
          </div>
        )}

        {/* Bloc GPS et Actions */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-6 border border-slate-200">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">État du signal GPS</p>
            {loadingGeo ? (
              <p className="text-blue-600 font-medium text-sm animate-pulse">Recherche de la position...</p>
            ) : distance !== null ? (
              <div>
                <p className="text-3xl font-bold text-slate-800">{distance} mètres</p>
                <p className={`text-xs mt-1 font-semibold ${distance <= ALLOWED_RADIUS_METERS ? 'text-green-600' : 'text-red-500'}`}>
                  {distance <= ALLOWED_RADIUS_METERS ? '✓ Dans la zone autorisée' : '✗ Hors de la zone du terrain'}
                </p>
              </div>
            ) : (
              <button onClick={checkPosition} className="text-blue-600 text-sm underline">Réessayer</button>
            )}
            <button
              onClick={checkPosition}
              className="mt-2 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg transition font-medium"
            >
              Actualiser ma position
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAttendance('ARRIVAL')}
              disabled={actionLoading || distance === null}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl shadow transition text-sm flex items-center justify-center gap-2"
            >
              🟢 Pointer Arrivée
            </button>

            <button
              onClick={() => handleAttendance('DEPARTURE')}
              disabled={actionLoading || distance === null}
              className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl shadow transition text-sm flex items-center justify-center gap-2"
            >
              🔴 Pointer Départ
            </button>
          </div>
        </div>

        {/* Historique Personnel de l'Enseignant */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
          <h2 className="text-base font-bold text-slate-800 mb-4">Mon Historique de Pointage</h2>
          {loadingHistory ? (
            <p className="text-center text-slate-500 py-6 text-sm">Chargement de votre historique...</p>
          ) : myHistory.length === 0 ? (
            <p className="text-center text-slate-400 py-6 text-sm">Vous n'avez effectué aucun pointage pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 uppercase">
                    <th className="p-3">Type</th>
                    <th className="p-3">Distance</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3">Date et Heure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {myHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${
                          item.type === 'ARRIVAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.type === 'ARRIVAL' ? 'Arrivée' : 'Départ'}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-700">{item.distance_meters} m</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${
                          item.status === 'VALID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status === 'VALID' ? 'Validé' : 'Hors zone'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">
                        {new Date(item.created_at).toLocaleString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}