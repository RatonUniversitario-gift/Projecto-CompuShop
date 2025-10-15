import { useEffect, useState } from "react";
import SeccionBase from "../components/SeccionBase.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";

const AUTH_BASE = import.meta.env.VITE_XANO_AUTH_BASE;

export default function AdminUsuarios() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      try {
        const { data } = await axios.get(`${AUTH_BASE}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr("Endpoint de usuarios no disponible en Xano. (Opcional)");
      }
    })();
  }, [token]);

  return (
    <SeccionBase titulo="Usuarios">
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
            {items.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name || u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.role || "user"}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-secondary py-4">
                  Sin datos (o endpoint no disponible).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SeccionBase>
  );
}
