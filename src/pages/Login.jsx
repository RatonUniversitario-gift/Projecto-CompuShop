
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onAxios(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/home');
    } catch (error) {
      setErr(error?.response?.data?.message || error.message || 'Error al iniciar sesión (Axios)');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="container py-5">
        <section className="row justify-content-center">
          <div className="col-12 col-md-6">
            <div className="card bg-dark text-white border-primary">
              <div className="card-body">
                <h2 className="text-center mb-4">Inicio de Sesión</h2>
                <form className="formulario-login" onSubmit={onAxios}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                    <input type="email" className="form-control" id="email" name="email" required value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input type="password" className="form-control" id="password" name="password" required minLength={4} maxLength={10} value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                  <button className="btn btn-primary w-100 boton-login" disabled={loading} type="submit">Iniciar Sesión</button>
                </form>
                <div className="mt-3 text-center">
                  <span className="text-light">¿No tienes cuenta?</span>
                  <Link to="/registro" className="btn btn-outline-info ms-2">Crea una</Link>
                </div>
                {err && <div className="alert alert-danger mt-3">{err}</div>}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
