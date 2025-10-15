// src/components/Hero.jsx
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero-section py-5">
      <div className="container text-center">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0 text-md-start text-center">
            <h1 className="display-3 fw-bold text-white mb-3">
              Bienvenido a
              <span className="nombre-tienda-azul"> TechNova </span>
              <span className="nombre-tienda-naranja">Store</span>
            </h1>
            <p className="lead text-light mb-4">
              Tu tienda online de tecnología con los mejores productos y ofertas exclusivas.
            </p>
            <Link to="/productos" className="btn btn-morado">
              Ver productos
            </Link>
          </div>

          <div className="col-md-6">
            <img
              src="/assets/img/1757355736.png"
              alt="Tecnología moderna"
              className="img-fluid rounded sombra-hero"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
