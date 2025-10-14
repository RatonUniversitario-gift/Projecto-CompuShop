function Footer() {
  return (
    <footer className="bg-dark text-light py-5  border-top border-primary">
      <div className="container">
        <div className="row gy-4">
          <div className="col-12 col-md-3">
            <div className="d-flex align-items-center mb-2">
              <img
                src="/assets/img/1757355736.png"
                alt="Logo TechNova"
                height="48"
                className="me-2"
              />
              <h5 className="text-primary fw-bold mb-0">TechNova Store</h5>
            </div>
            <p className="small text-secondary mb-2">
              Tu tienda online de tecnología, componentes y gadgets premium.
            </p>
            <p className="small text-secondary">Innovación y rendimiento para cada usuario.</p>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="text-uppercase text-primary mb-3">Enlaces rápidos</h6>
            <ul className="list-unstyled small">
              <li><a href="#" className="text-light text-decoration-none">Inicio</a></li>
              <li><a href="#" className="text-light text-decoration-none">Productos</a></li>
              <li><a href="#" className="text-light text-decoration-none">Blogs</a></li>
              <li><a href="#" className="text-light text-decoration-none">Contacto</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="text-uppercase text-primary mb-3">Soporte</h6>
            <ul className="list-unstyled small">
              <li><a href="#" className="text-light text-decoration-none">Preguntas frecuentes</a></li>
              <li><a href="#" className="text-light text-decoration-none">Términos y condiciones</a></li>
              <li><a href="#" className="text-light text-decoration-none">Política de privacidad</a></li>
              <li><a href="#" className="text-light text-decoration-none">Garantías y devoluciones</a></li>
            </ul>
          </div>

          <div className="col-12 col-md-3">
            <h6 className="text-uppercase text-primary mb-3">Contáctanos</h6>
            <p className="small mb-1">📧 contacto@technova.cl</p>
            <p className="small mb-3">📞 +56 9 1234 5678</p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light fs-5"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-light fs-5"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-light fs-5"><i className="bi bi-twitter"></i></a>
            </div>
          </div>
        </div>
        <hr className="border-primary my-4" />
        <p className="text-center small mb-0 text-secondary">
          © 2025 TechNova Store — Desarrollado por Gabriel Astorga & Ignacio Pizarro
        </p>
      </div>
    </footer>
  );
}

export default Footer;
