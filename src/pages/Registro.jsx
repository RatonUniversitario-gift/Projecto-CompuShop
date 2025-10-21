// src/pages/Registro.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SeccionBase from "../components/SeccionBase.jsx";

const AUTH_BASE = import.meta.env.VITE_XANO_AUTH_BASE;

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await axios.post(`${AUTH_BASE}/auth/signup`, {
        name: form.nombre.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      alert("✅ Cuenta creada correctamente. Ahora inicia sesión.");
      navigate("/login");
    } catch (e) {
      console.error("Error al registrarse:", e);
      setErr(e?.response?.data?.message || e.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SeccionBase titulo="Crear cuenta">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <form className="bg-dark p-4 rounded border border-primary" onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre completo</label>
              <input
                name="nombre"
                className="form-control"
                value={form.nombre}
                onChange={onChange}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={onChange}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={onChange}
                minLength={6}
                required
              />
            </div>

            <button className="btn btn-morado w-100" disabled={loading}>
              Crear cuenta
            </button>

            {err && <div className="alert alert-danger mt-3">{err}</div>}

            <div className="text-center mt-3">
              <Link to="/login" className="btn btn-detalle">
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </SeccionBase>
  );
}
