// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

// URLs desde variables de entorno
const AUTH_BASE = import.meta.env.VITE_XANO_AUTH_BASE;
const TOKEN_TTL_SEC = Number(import.meta.env.VITE_XANO_TOKEN_TTL_SEC || '86400');

const AuthContext = createContext(null);

// Decodifica un JWT para obtener su payload (incluye 'exp' si existe)
function decodeJwt(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    let payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = payload.length % 4;
    if (pad) payload += '='.repeat(4 - pad);
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [expiresAt, setExpiresAt] = useState(() => {
    const raw = localStorage.getItem('auth_exp');
    return raw ? Number(raw) : null;
  });

  // Persistir token y calcular expiración
  useEffect(() => {
    if (!token) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_exp');
      setExpiresAt(null);
      return;
    }

    localStorage.setItem('auth_token', token);
    const payload = decodeJwt(token);
    const expMs = payload?.exp ? payload.exp * 1000 : Date.now() + TOKEN_TTL_SEC * 1000;
    setExpiresAt(expMs);
    localStorage.setItem('auth_exp', String(expMs));
  }, [token]);

  // Persistir usuario
  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user));
    else localStorage.removeItem('auth_user');
  }, [user]);

  // Función auxiliar para headers
  const makeAuthHeader = (t) => ({ Authorization: `Bearer ${t}` });

  // ✅ Solo Axios: login
  async function login({ email, password }) {
    const { data } = await axios.post(`${AUTH_BASE}/auth/login`, { email, password });
    const newToken = data?.authToken || data?.token || '';
    const newUser = data?.user || { name: data?.name || email };
    setToken(newToken);
    setUser(newUser);
    return { token: newToken, user: newUser };
  }

  // ✅ Solo Axios: logout
  async function logout() {
    try {
      await axios.post(`${AUTH_BASE}/auth/logout`, {}, { headers: makeAuthHeader(token) });
    } catch (e) {
      console.warn('Logout falló en el backend, pero se limpió localmente');
    }
    setToken('');
    setUser(null);
    setExpiresAt(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_exp');
  }

  // ✅ Solo Axios: refresh (opcional, si tu Xano lo soporta)
  async function refresh() {
    const { data } = await axios.post(`${AUTH_BASE}/auth/refresh_token`, {}, { headers: makeAuthHeader(token) });
    const newToken = data?.authToken || data?.token || '';
    setToken(newToken);
    return newToken;
  }

  // Efecto de aviso de expiración (opcional, pero útil)
  useEffect(() => {
    if (!expiresAt) return;
    const MARGIN_MS = 2 * 60 * 1000; // 2 minutos antes
    const delay = Math.max(expiresAt - Date.now() - MARGIN_MS, 0);
    const id = setTimeout(async () => {
      if (window.confirm('Tu sesión está por expirar. ¿Renovar?')) {
        try {
          await refresh();
        } catch (e) {
          alert('No se pudo renovar la sesión. Se cerrará.');
          await logout();
        }
      }
    }, delay);
    return () => clearTimeout(id);
  }, [expiresAt]);

  const value = useMemo(() => ({
    token,
    user,
    expiresAt,
    login,
    logout,
    refresh,
  }), [token, user, expiresAt]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}