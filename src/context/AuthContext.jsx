// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

// URLs desde variables de entorno
const AUTH_BASE = import.meta.env.VITE_XANO_AUTH_BASE;
const TOKEN_TTL_SEC = Number(import.meta.env.VITE_XANO_TOKEN_TTL_SEC || "86400");

// ✅ Lista de correos administradores desde .env
const ADMIN_EMAILS =
  (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

const AuthContext = createContext(null);

// Decodifica un JWT para obtener su payload
function decodeJwt(token) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = payload.length % 4;
    if (pad) payload += "=".repeat(4 - pad);
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("auth_token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("auth_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [expiresAt, setExpiresAt] = useState(() => {
    const raw = localStorage.getItem("auth_exp");
    return raw ? Number(raw) : null;
  });

  // Persistir token y calcular expiración
  useEffect(() => {
    if (!token) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_exp");
      setExpiresAt(null);
      return;
    }

    localStorage.setItem("auth_token", token);
    const payload = decodeJwt(token);
    const expMs = payload?.exp
      ? payload.exp * 1000
      : Date.now() + TOKEN_TTL_SEC * 1000;
    setExpiresAt(expMs);
    localStorage.setItem("auth_exp", String(expMs));
  }, [token]);

  // Persistir usuario
  useEffect(() => {
    if (user) localStorage.setItem("auth_user", JSON.stringify(user));
    else localStorage.removeItem("auth_user");
  }, [user]);

  // Si tenemos token pero el usuario no tiene id, derivarlo del JWT
  useEffect(() => {
    if (token && user && !user.id) {
      const payload = decodeJwt(token);
      const uid = payload?.user_id ?? payload?.id ?? payload?.sub;
      if (uid != null) setUser((prev) => ({ ...prev, id: uid }));
    }
  }, [token, user]);

  // Asegurar perfil completo: intentar obtener /auth/me y hacer fallback al JWT
  useEffect(() => {
    if (!token) return;
    let canceled = false;
    (async () => {
      if (user?.id) return; // ya tenemos id
      try {
        const { data } = await axios.get(`${AUTH_BASE}/auth/me`, {
          headers: makeAuthHeader(token),
        });
        if (!canceled) setUser((prev) => (prev ? { ...prev, ...data } : data));
      } catch (e) {
        const payload = decodeJwt(token);
        const uid = payload?.user_id ?? payload?.id ?? payload?.sub;
        if (uid != null && !canceled)
          setUser((prev) => (prev ? { ...prev, id: uid } : { id: uid }));
      }
    })();
    return () => {
      canceled = true;
    };
  }, [token, user?.id]);

  // Headers
  const makeAuthHeader = (t) => ({ Authorization: `Bearer ${t}` });

  // ✅ LOGIN con detección de admin por email
  async function login({ email, password }) {
    const { data } = await axios.post(`${AUTH_BASE}/auth/login`, {
      email,
      password,
    });

    const newToken = data?.authToken || data?.token || "";
    let newUser = data?.user || { name: data?.name || email, email };

    // Asegurar ID del usuario desde el JWT si no viene en la respuesta
    if (!newUser?.id && newToken) {
      const payload = decodeJwt(newToken);
      const uid = payload?.user_id ?? payload?.id ?? payload?.sub;
      if (uid != null) newUser = { ...newUser, id: uid };
    }

    // 🔥 Detectar admin según la lista de correos del .env
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
    newUser.role = isAdmin ? "admin" : "user";

    setToken(newToken);
    setUser(newUser);

    return { token: newToken, user: newUser };
  }

  // ✅ Logout
  async function logout() {
    try {
      await axios.post(`${AUTH_BASE}/auth/logout`, {}, { headers: makeAuthHeader(token) });
    } catch {
      console.warn("Logout falló en backend, pero se limpió localmente");
    }
    setToken("");
    setUser(null);
    setExpiresAt(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }
   
  // Actualizar datos del usuario
  function updateUserData(userData) {
    if (!user) return null;
    
    // En un entorno real, aquí se haría una llamada a la API
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    return updatedUser;
  }
   
  // Bloquear/desbloquear usuario (solo para admin)
  async function toggleUserBlock(userId, isBlocked) {
    if (!user || user.role !== "admin") return null;
    
    try {
      // Simulamos una llamada a API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // En un entorno real, aquí se haría una llamada a la API
      // Obtenemos usuarios del localStorage (simulación)
      const usersStr = localStorage.getItem('users');
      let users = usersStr ? JSON.parse(usersStr) : [];
      
      // Actualizamos el estado del usuario
      users = users.map(u => {
        if (u.id === userId) {
          return { ...u, blocked: isBlocked };
        }
        return u;
      });
      
      // Guardamos en localStorage
      localStorage.setItem('users', JSON.stringify(users));
      
      return true;
    } catch (error) {
      console.error("Error al cambiar estado de bloqueo:", error);
      return false;
    }
  }

  // ✅ Refresh token
  async function refresh() {
    const { data } = await axios.post(`${AUTH_BASE}/auth/refresh_token`, {}, { headers: makeAuthHeader(token) });
    const newToken = data?.authToken || data?.token || "";
    setToken(newToken);
    return newToken;
  }

  // Expiración automática
  useEffect(() => {
    if (!expiresAt) return;
    const MARGIN_MS = 2 * 60 * 1000;
    const delay = Math.max(expiresAt - Date.now() - MARGIN_MS, 0);
    const id = setTimeout(async () => {
      if (window.confirm("Tu sesión está por expirar. ¿Renovar?")) {
        try {
          await refresh();
        } catch {
          alert("No se pudo renovar la sesión. Se cerrará.");
          await logout();
        }
      }
    }, delay);
    return () => clearTimeout(id);
  }, [expiresAt]);

  const value = useMemo(
    () => ({
      token,
      user,
      expiresAt,
      login,
      logout,
      refresh,
      updateUserData,
      toggleUserBlock,
      isAuthenticated: !!token && !!user,
      isAdmin: user?.role === "admin",
    }),
    [token, user, expiresAt]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
