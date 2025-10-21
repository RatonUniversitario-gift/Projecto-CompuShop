// src/pages/AdminUsuarios.jsx
import { useEffect, useState } from "react";
import SeccionBase from "../components/SeccionBase.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { listUsers } from "../api/xano.js"; // ✅ conexión a tabla user segura

export default function AdminUsuarios() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await listUsers({ token });
        // 🔒 Filtrar solo los campos necesarios
        const safeData = data.map((u) => ({
          id: u.id,
          name: u.name || u.nombre || "—",
          email: u.email,
          rol: u.rol || "user",
        }));
        setItems(safeData);
      } catch (e) {
        console.error("Error al obtener usuarios:", e);
        setErr("⚠️ No se pudieron cargar los usuarios desde Xano.");
      }
    })();
  }, [token]);

  return (
    <SeccionBase titulo="Usuarios Registrados" subtitulo="Información básica de cuentas">
      {err && <div className="alert alert-warning">{err}</div>}

      <div className="table-responsive">
        <table className="table table-dark table-hover align-middle border border-primary">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={
                        u.rol.toLowerCase() === "admin"
                          ? "badge bg-warning text-dark"
                          : "badge bg-secondary"
                      }
                    >
                      {u.rol}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-secondary py-4">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SeccionBase>
  );
}
