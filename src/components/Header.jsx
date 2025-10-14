import { Link } from "react-router-dom";
export const Header = () => {
  return (
    <header className="bg-dark text-white py-3 shadow-sm border-bottom border-primary">
      <div className="container d-flex justify-content-between align-items-center flex-wrap">
        <a href="#" className="d-flex align-items-center text-decoration-none mb-2 mb-md-0">
          <img
            src="/assets/img/1757355736.png"
            alt="Logo TechNova Store"
            className="logo me-2"
            height="48"
          />
          <span className="fs-3 fw-bold">
            <span className="nombre-tienda-azul">TechNova</span>{' '}
            <span className="nombre-tienda-naranja">Store</span>
          </span>

        </a>

        <nav className="menu-navegacion mb-2 mb-md-0">
          <ul className="nav">
            <li className="nav-item"><Link to="/" className="nav-link text-white">Inicio</Link></li>
            <li className="nav-item"><Link to="/productos" className="nav-link text-white">Productos</Link></li>
            <li className="nav-item"><Link to="/blogs" className="nav-link text-white">Blogs</Link></li>
            <li className="nav-item"><Link to="/nosotros" className="nav-link text-white">Nosotros</Link></li>
            <li className="nav-item"><Link to="/contacto" className="nav-link text-white">Contacto</Link></li>
            <li className="nav-item"><Link to="/login" className="nav-link text-white">Login</Link></li>
          </ul>
        </nav>

        <div className="d-flex align-items-center">
          <a href="#" className="text-white position-relative me-3" aria-label="Ver carrito">
            <i className="bi bi-bag fs-4"></i>
            <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">0</span>
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
