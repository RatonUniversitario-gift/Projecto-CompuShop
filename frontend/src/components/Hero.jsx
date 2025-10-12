function Hero() {
  return (
    <section className="hero-section py-5">
      <div className="container text-center">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0 text-md-start text-center">
            <h1 className="display-5 fw-bold text-white mb-3">
              Bienvenido a <span className="nombre-tienda-naranja">TechNova Store</span>
            </h1>
            <p className="lead text-light mb-4">
              Tu tienda online de tecnología con los mejores productos y ofertas exclusivas.
            </p>
            <a href="#" className="btn btn-primary btn-lg boton-ver-productos">
              Ver productos
            </a>
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

export default Hero;
