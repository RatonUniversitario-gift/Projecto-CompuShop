
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';

export default function Logout() {
  const { logoutAxios, logoutFetch } = useAuth();
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function run() {
      try {
        await logoutAxios();
        setMsg('Sesión cerrada (Axios).');
        navigate('/home');
      } catch (e) {
        setMsg(e?.message || 'Error al cerrar sesión');
      }
    }
    run();
  }, []);

  return (
    <>
      <Header />
      <main className="container py-5">
        <section className="row justify-content-center">
          <div className="col-12 col-md-6">
            <div className="card bg-dark text-white border-primary">
              <div className="card-body text-center">
                <h2 className="mb-4">Cerrar Sesión</h2>
                {msg && <div className="alert alert-info">{msg}</div>}
                <button className="btn btn-secondary" onClick={async () => { await logoutFetch(); setMsg('Sesión cerrada (Fetch).'); navigate('/home'); }}>Cerrar con Fetch</button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}