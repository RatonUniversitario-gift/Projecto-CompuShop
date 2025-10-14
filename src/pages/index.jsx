import React from 'react';

export const Index = () => {
  return (
    <div className="fondo-oscuro">
      {/* ================= HEADER ================= */}
      <header className="bg-dark text-white py-3">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Logo */}
          {/* Si usas React Router, reemplaza <a> por <Link> */}
          <a href="/" className="d-flex align-items-center text-decoration-none">
            <img src="/assets/img/1757355736.png" alt="Logo TechNova Store" className="logo me-2" height="48" />
            <span className="fs-3 fw-bold nombre-tienda">TechNova Store</span>
          </a>
          {/* Navegación */}
          <nav className="menu-navegacion">
            <ul className="nav">
              <li className="nav-item"><a className="nav-link text-white" href="/">Inicio</a></li>
              <li className="nav-item"><a className="nav-link text-white" href="/productos">Productos</a></li>
              <li className="nav-item"><a className="nav-link text-white" href="/blogs">Blogs</a></li>
              <li className="nav-item"><a className="nav-link text-white" href="/nosotros">Nosotros</a></li>
              <li className="nav-item"><a className="nav-link text-white" href="/contacto">Contacto</a></li>
              <li className="nav-item"><a className="nav-link text-white" href="/login">Login</a></li>
            </ul>
          </nav>
          {/* Carrito y tema */}
          <div className="d-flex align-items-center">
            <div className="posicion-carrito">
              <a href="/carrito" className="text-white position-relative" aria-label="Ver carrito">
                <i className="bi bi-bag fs-4"></i>
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">0</span>
              </a>
            </div>
            <button className="btn btn-outline-primary ms-3" aria-label="Cambiar tema" title="Cambiar tema">
              <i className="bi bi-circle-half"></i> Tema
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="hero-section py-5">
        <div className="container text-center">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h1 className="display-4 fw-bold text-white">Bienvenido a TechNova Store</h1>
              <p className="lead text-light">Tu tienda online de tecnología con los mejores productos y ofertas.</p>
              <a href="/productos" className="btn btn-primary boton-ver-productos">Ver productos</a>
            </div>
            <div className="col-md-6">
              <img src="/assets/img/1757355736.png" alt="Tecnología" className="img-fluid rounded sombra-hero" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN: Productos Destacados ================= */}
      <main className="container seccion-productos-destacados py-5">
        <h2 className="text-center text-white mb-4">Productos Destacados</h2>
        <div className="row justify-content-center">
          {productosDestacados.map(producto => (
            <div key={producto.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="card tarjeta-producto h-100 bg-dark text-white border-primary">
                <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />
                <div className="card-body">
                  <h5 className="card-title">{producto.nombre}</h5>
                  <p className="card-text">
                    {producto.descripcion} <span className={`badge ${producto.badgeClass}`}>{producto.descuento}</span>
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="precio-producto fw-bold">{producto.precio}</span>
                    <button className="btn btn-outline-primary boton-agregar-carrito" data-id={producto.id}>Agregar al Carrito</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-dark text-light py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3 mb-md-0">
              <h5>TechNova Store</h5>
              <p>© 2025 Todos los derechos reservados.</p>
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <h5>Contacto</h5>
              <p>Email: contacto@technova.cl</p>
              <p>Teléfono: +56 9 1234 5678</p>
            </div>
            <div className="col-md-4">
              <h5>Redes Sociales</h5>
              <a href="#" className="text-light me-2"><i className="bi bi-facebook"></i></a>
              <a href="https://www.instagram.com/c10h15n.20/" className="text-light me-2" target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-light"><i className="bi bi-twitter"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};