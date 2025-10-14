// src/components/UserBar.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function UserBar() {
  const { user, token, expiresAt } = useAuth();
  const [showToken, setShowToken] = useState(false);

  function fmtRemaining(ms) {
    if (ms == null) return '—';
    if (ms <= 0) return 'expirado';
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}m ${sec}s`;
  }

  const expText = expiresAt ? new Date(expiresAt).toLocaleString() : 'desconocido';
  const remainingText = fmtRemaining(expiresAt ? (expiresAt - Date.now()) : null);
  const tokenPreview = token ? (showToken ? token : `${token.slice(0, 12)}…`) : '—';

  return (
    <div>
      {/* Texto indicando el estado de conexión */}
      <div className="alert alert-secondary py-2 mb-3">
        <strong>Usuario:</strong> {user?.name ? user.name : 'No conectado'}
      </div>

      {/* Banner de sesión: solo cuando el usuario ha iniciado sesión */}
      {user && token && (
        <div className="border rounded p-3 mb-3">
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <strong>Sesión</strong>
            <span className="text-muted">Expira: {expText}</span>
            <span className="text-muted">Restante: {remainingText}</span>
          </div>
          <div className="mt-2">
            <strong>Token:</strong> <code className="text-break">{tokenPreview}</code>
            <button
              className="btn btn-sm btn-outline-secondary ms-2"
              onClick={() => setShowToken((v) => !v)}
            >
              {showToken ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}