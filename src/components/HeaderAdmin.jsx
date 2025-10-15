// src/components/HeaderAdmin.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function HeaderAdmin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-dark text-white py-3 shadow-sm border-bottom border-primary">
      <div className="container d-flex justify-content-between align-items-center flex-wrap">
        {/* === Logo y título === */}
        <Link
          to="/admin"
          className="d-flex align-items-center text-decoration-none mb-2 mb-md-0"
        >
          <img
            src="/assets/img/1757355736.png"
            alt="Logo TechNova Admin"
            className="logo me-2"
            height="48"
          />
          <span className="fs-3 fw-bold">
            <span className="nombre-tienda-azul">TechNova</span>{" "}
            <span className="text-warning">Admin</span>
          </span>
        </Link>

        {/* === Menú de administración === */}
        <nav className="menu-navegacion mb-2 mb-md-0">
          <ul className="nav">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/usuarios">
                Usuarios
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/productos">
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/crear-producto">
                Crear Producto
              </Link>
            </li>
          </ul>
        </nav>

        {/* === Usuario + Logout === */}
        <div className="d-flex align-items-center gap-3">
          <span className="text-light small">
            👤 {user?.name || "Admin"}
          </span>
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm"
          >
            <i className="bi bi-box-arrow-right me-1"></i>Salir
          </button>
        </div>
      </div>
    </header>
  );
}
