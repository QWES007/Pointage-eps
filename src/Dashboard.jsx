import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { calculateDistance, STADIUM_COORDS, ALLOWED_RADIUS_METERS } from './utils/haversine';

export default function Dashboard({ teacher, onLogout }) {
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

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

  useEffect(() => {
    checkPosition();
  }, []);

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
          type: type, // 'ARRIVAL' ou 'DEPARTURE'
          latitude: location.lat,
          longitude: location.lon,
          distance_meters: Math.round(dist),
          status: status
        }
      ]);

      if (error) throw error;

      if (status === 'VALID') {
        setStatusMsg(`Pointage de type [${type}] validé avec succès (${Math.round(dist)}m du terrain) !`);
      } else {
        setStatusMsg(`Attention : Vous êtes hors zone (${Math.round(dist)}m). Pointage enregistré comme hors zone.`);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement du pointage.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-lg mt-10">
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <div>
            <h1 className="font-bold text-lg">{teacher.full_name}</h1>
            <p className="text-xs text-blue-100">Espace Pointage EPS</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-blue-700 hover:bg-blue-800 text-xs px-3 py-1.5 rounded transition"
          >
            Déconnexion
          </button>
        </div>

        <div className="p-6 space-y-6">
          {statusMsg && (
            <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm text-center">
              {statusMsg}
            </div>
          )}

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
            <p className="text-sm text-slate-600">État du signal GPS</p>
            {loadingGeo ? (
              <p className="text-blue-600 font-medium text-sm animate-pulse">Recherche de la position...</p>
            ) : distance !== null ? (
              <div>
                <p className="text-2xl font-bold text-slate-800">{distance} mètres</p>
                <p className={`text-xs mt-1 font-semibold ${distance <= ALLOWED_RADIUS_METERS ? 'text-green-600' : 'text-red-500'}`}>
                  {distance <= ALLOWED_RADIUS_METERS ? '✓ Dans la zone autorisée' : '✗ Hors de la zone du terrain'}
                </p>
              </div>
            ) : (
              <button onClick={checkPosition} className="text-blue-600 text-sm underline">Réessayer</button>
            )}
            <button
              onClick={checkPosition}
              className="mt-2 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded transition"
            >
              Actualiser ma position
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAttendance('ARRIVAL')}
              disabled={actionLoading || distance === null}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl shadow transition duration-200 text-sm"
            >
              Pointer Arrivée
            </button>

            <button
              onClick={() => handleAttendance('DEPARTURE')}
              disabled={actionLoading || distance === null}
              className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl shadow transition duration-200 text-sm"
            >
              Pointer Départ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}