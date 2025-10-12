function Header() {
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
          <span className="fs-3 fw-bold nombre-tienda-naranja">TechNova Store</span>

        </a>

        <nav className="menu-navegacion mb-2 mb-md-0">
          <ul className="nav">
            <li className="nav-item"><a className="nav-link text-white" href="#">Inicio</a></li>
            <li className="nav-item"><a className="nav-link text-white" href="#">Productos</a></li>
            <li className="nav-item"><a className="nav-link text-white" href="#">Blogs</a></li>
            <li className="nav-item"><a className="nav-link text-white" href="#">Nosotros</a></li>
            <li className="nav-item"><a className="nav-link text-white" href="#">Contacto</a></li>
            <li className="nav-item"><a className="nav-link text-white" href="#">Login</a></li>
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
