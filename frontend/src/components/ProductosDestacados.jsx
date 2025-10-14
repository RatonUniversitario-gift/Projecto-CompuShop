function ProductosDestacados() {
  return (
    <main className="seccion-productos-destacados py-5">
      <div className="container">
        <h2 className="text-center text-white mb-5">Productos Destacados</h2>

        <div className="row g-4 justify-content-center">
          {/* === Card 1 === */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card tarjeta-producto h-100 bg-dark text-white border-primary shadow-sm hover-scale">
              <div className="position-relative">
                <img src="/assets/img/mouse-gamer.jpg" className="card-img-top rounded-top" alt="Mouse Gamer RGB" />
                <span className="badge bg-success position-absolute top-0 start-0 m-2">-20%</span>
                <span className="badge bg-secondary position-absolute top-0 end-0 m-2">En stock</span>
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-1">Mouse Gamer RGB</h5>
                <p className="card-text text-secondary small mb-3">Ergonomía, precisión y diseño LED para gamers exigentes.</p>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-primary fs-6">$19.990</span>
                  <button className="btn btn-naranja btn-sm">Agregar al carrito</button>
                </div>
              </div>
            </div>
          </div>

          {/* === Card 2 === */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card tarjeta-producto h-100 bg-dark text-white border-primary shadow-sm hover-scale">
              <div className="position-relative">
                <img src="/assets/img/teclado-gamer.jpg" className="card-img-top rounded-top" alt="Teclado Mecánico LED" />
                <span className="badge bg-danger position-absolute top-0 start-0 m-2">-15%</span>
                <span className="badge bg-secondary position-absolute top-0 end-0 m-2">En stock</span>
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-1">Teclado Mecánico LED</h5>
                <p className="card-text text-secondary small mb-3">Switches premium e iluminación RGB personalizable.</p>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-primary fs-6">$39.990</span>
                  <button className="btn btn-naranja btn-sm">Agregar al carrito</button>
                </div>
              </div>
            </div>
          </div>

          {/* === Card 3 === */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card tarjeta-producto h-100 bg-dark text-white border-primary shadow-sm hover-scale">
              <div className="position-relative">
                <img src="/assets/img/nvme.jpg" className="card-img-top rounded-top" alt="SSD NVMe 1TB" />
                <span className="badge bg-info position-absolute top-0 start-0 m-2">Nuevo</span>
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-1">SSD NVMe 1TB</h5>
                <p className="card-text text-secondary small mb-3">Rendimiento ultrarrápido para gaming y trabajo intensivo.</p>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-primary fs-6">$74.990</span>
                  <button className="btn btn-naranja btn-sm">Agregar al carrito</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductosDestacados;
