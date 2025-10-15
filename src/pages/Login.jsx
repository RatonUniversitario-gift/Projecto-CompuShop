// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onAxios(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { user } = await login({ email, password });
      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setErr(
        error?.response?.data?.message ||
          error.message ||
          "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="seccion-productos-destacados py-5 min-vh-100 d-flex align-items-center">
      <div className="container">
        <section className="row justify-content-center">
          <div className="col-12 col-md-6">
            <div className="card bg-dark text-white border-primary shadow-lg">
              <div className="card-body p-4">
                <h2 className="text-center mb-4 text-light">Inicio de Sesión</h2>
                <form onSubmit={onAxios}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      required
                      minLength={4}
                      maxLength={16}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-morado w-100 py-2"
                    disabled={loading}
                    type="submit"
                  >
                    Iniciar Sesión
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <span className="text-light">¿No tienes cuenta?</span>
                  <Link to="/registro" className="btn btn-detalle ms-2">
                    Crea una
                  </Link>
                </div>

                {err && <div className="alert alert-danger mt-3">{err}</div>}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
