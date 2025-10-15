// src/components/Header.jsx
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const { cartCount } = useCart();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <header className="bg-dark text-white py-3 shadow-sm border-bottom border-primary">
      <div className="container d-flex justify-content-between align-items-center flex-wrap">
        {/* === Logo === */}
        <Link
          to="/"
          className="d-flex align-items-center text-decoration-none mb-2 mb-md-0"
        >
          <img
            src="/assets/img/1757355736.png"
            alt="Logo TechNova Store"
            className="logo me-2"
            height="48"
          />
          <span className="fs-3 fw-bold">
            <span className="nombre-tienda-azul">TechNova</span>{" "}
            <span className="nombre-tienda-naranja">Store</span>
          </span>
        </Link>

        {/* === Navegación === */}
        <nav className="menu-navegacion mb-2 mb-md-0">
          <ul className="nav">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/productos">
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/blogs">
                Blogs
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/nosotros">
                Nosotros
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/contacto">
                Contacto
              </Link>
            </li>

            {/* === Enlaces solo para Admin === */}
            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-warning" to="/admin">
                    Admin Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-warning" to="/admin/productos">
                    Admin Productos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-warning" to="/admin/usuarios">
                    Admin Usuarios
                  </Link>
                </li>
              </>
            )}

            <li className="nav-item">
              {user ? (
                <Link className="nav-link text-white" to="/logout">
                  Logout
                </Link>
              ) : (
                <Link className="nav-link text-white" to="/login">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>

        {/* === Carrito === */}
        <div className="d-flex align-items-center">
          <Link
            to="/carrito"
            className="text-white position-relative me-3"
            aria-label="Ver carrito"
          >
            <i className="bi bi-bag fs-4"></i>
            {cartCount > 0 && (
              <span className="badge badge-carrito position-absolute top-0 start-100 translate-middle">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
