import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { listProducts } from "../api/xano.js";
import { Link } from "react-router-dom";

export default function ProductosDestacados() {
  const { token } = useAuth();
  const { addToCart } = useCart();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    async function fetchDestacados() {
      try {
        const data = await listProducts({ token, limit: 4 });
        setProductos(data);
      } catch (err) {
        console.error("Error al cargar productos destacados:", err);
      }
    }
    fetchDestacados();
  }, [token]);

  return (
    <section className="seccion-productos-destacados py-5">
      <div className="container text-center">
        <h2 className="text-white mb-4">Productos Destacados</h2>
        <div className="row g-4 justify-content-center">
          {productos.map((p) => (
            <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card tarjeta-producto bg-dark text-white border-primary shadow-sm h-100">
                <img
                  src={p.imagenes?.[0]?.path || "/assets/img/default-product.png"}
                  alt={p.nombre}
                  className="card-img-top"
                  style={{
                    objectFit: "contain",
                    height: "220px",
                    backgroundColor: "#0b0c10",
                    padding: "10px",
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{p.nombre}</h5>
                  <p className="text-secondary small flex-grow-1">
                    {p.descripcion}
                  </p>
                  <h6 className="text-primary fw-bold mb-3">${p.precio}</h6>

                  {/* === Botones de acción === */}
                  <div className="d-flex gap-2 mt-auto">
                    <button
                      onClick={() => addToCart(p)}
                      className="btn btn-naranja w-50"
                    >
                      <i className="bi bi-cart-plus me-1"></i>Agregar
                    </button>

                    <Link
                      to={`/producto/${p.id}`}
                      className="btn btn-detalle w-50"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* === Botón al catálogo === */}
        <div className="mt-5">
          <Link to="/productos" className="btn btn-morado btn-lg shadow-sm px-4">
            Ir al catálogo completo
          </Link>
        </div>
      </div>
    </section>
  );
}
