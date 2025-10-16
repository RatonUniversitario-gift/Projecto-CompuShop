import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { listProducts } from "../api/xano.js";
import { Link } from "react-router-dom";

export default function ProductosDestacados() {
  const { token } = useAuth();
  const { addToCart } = useCart();
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDestacados() {
      try {
        // 🔹 limitamos a 4 productos
        const data = await listProducts({ token, limit: 4 });
        setProductos(data.slice(0, 4));
      } catch (err) {
        console.error("Error al cargar productos destacados:", err);
        setError("No se pudieron cargar los productos destacados.");
      }
    }
    fetchDestacados();
  }, [token]);

  if (error) {
    return <div className="alert alert-danger text-center my-4">{error}</div>;
  }

  if (!productos.length) {
    return (
      <div className="text-center text-secondary py-5">
        <div className="spinner-border text-primary mb-3"></div>
        <p>Cargando productos destacados...</p>
      </div>
    );
  }

  return (
    <section className="seccion-productos-destacados py-5">
      <div className="container text-center">
        <h2 className="text-white mb-4">Productos Destacados</h2>
        <div className="row g-4 justify-content-center">
          {productos.map((p) => {
            const precio = Number(p.precio || 0).toLocaleString("es-CL");
            const imagen =
              p.imagenes?.[0]?.url || p.imagenes?.[0]?.path ||
              "https://via.placeholder.com/300x200?text=Sin+Imagen";

            return (
              <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card tarjeta-producto h-100 bg-dark text-white border-primary shadow-sm hover-scale">
                  <div className="position-relative">
                    <img
                      src={imagen}
                      alt={p.nombre}
                      className="card-img-top rounded-top"
                      style={{
                        height: "220px",
                        objectFit: "contain",
                        padding: "10px",
                        backgroundColor: "#0b0c10",
                      }}
                    />
                    {p.stock > 0 ? (
                      <span className="badge bg-secondary position-absolute top-0 end-0 m-2">
                        En stock
                      </span>
                    ) : (
                      <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                        Sin stock
                      </span>
                    )}
                  </div>

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-1">{p.nombre}</h5>
                    <p className="card-text text-secondary small mb-3">
                      {p.descripcion?.length > 60
                        ? p.descripcion.slice(0, 60) + "..."
                        : p.descripcion}
                    </p>

                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-primary fs-6">${precio}</span>
                        <button
                          className="btn btn-naranja btn-sm"
                          onClick={() => addToCart(p)}
                        >
                          Agregar
                        </button>
                      </div>

                      {/* 🔹 Botón blanco permanente */}
                      <Link
                        to={`/producto/${p.id}`}
                        className="btn btn-detalle btn-sm w-100"
                      >
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5">
          <Link
            to="/productos"
            className="btn btn-morado btn-lg shadow-sm px-4"
          >
            Ir al catálogo completo
          </Link>
        </div>
      </div>
    </section>
  );
}
