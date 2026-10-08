import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

export default function App() {
  const [teacher, setTeacher] = useState(null);

  return (
    <div>
      {!teacher ? (
        <Login onLoginSuccess={(teacherData) => setTeacher(teacherData)} />
      ) : (
        <Dashboard teacher={teacher} onLogout={() => setTeacher(null)} />
      )}
    </div>
  );
}