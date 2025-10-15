import { useEffect, useState } from "react";
import { listProducts } from "../api/xano.js";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function ProductosDestacados() {
  const { addToCart } = useCart();
<<<<<<< Updated upstream
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
=======
  const [items, setItems] = useState([]);

  const BASE_URL = "https://x8ki-letl-twmt.n7.xano.io/api:K1k2AGUp";
  const buildImageUrl = (img) => {
   
    const precio = Number(producto.precio || 0).toLocaleString("es-CL");
    const imagen =
      producto.imagenes?.[0]?.url ||
      producto.imagenes?.[0] ||
      "https://via.placeholder.com/300x200?text=Sin+Imagen";
>>>>>>> Stashed changes

  useEffect(() => {
    (async () => {
      try {
<<<<<<< Updated upstream
        const data = await listProducts({ token, limit: 4 });
        setProductos(data);
      } catch (err) {
        console.error("Error al cargar productos destacados:", err);
        setError("No se pudieron cargar los productos destacados.");
=======
        const data = await listProducts({ limit: 8 });
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("No se pudieron cargar destacados:", e);
>>>>>>> Stashed changes
      }
    })();
  }, []);

  if (!items.length) return null;

  if (error) {
    return (
      <div className="alert alert-danger text-center my-4">{error}</div>
    );
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
      <div className="container">
        <h2 className="text-center text-white mb-4">Productos destacados</h2>
        <div className="row g-4 justify-content-center">
<<<<<<< Updated upstream
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
                    {p.descuento && (
                      <span className="badge bg-success position-absolute top-0 start-0 m-2">
                        -{p.descuento}%
                      </span>
                    )}
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
                        <span className="fw-bold text-primary fs-6">
                          ${precio}
                        </span>
                        <button
                          className="btn btn-naranja btn-sm"
                          onClick={() => addToCart(p)}
                        >
                          Agregar
                        </button>
                      </div>
                      <Link
                        to={`/producto/${p.id}`}
                        className="btn btn-outline-primary btn-sm w-100"
                      >
                        Ver detalle
                      </Link>
                    </div>
=======
          {items.map((p) => (
            <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card tarjeta-producto bg-dark text-white border-primary shadow-sm h-100">
                <img
                  src={imagen(p.imagenes?.[0])}
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
                    {p.descripcion?.length > 60
                      ? p.descripcion.slice(0, 60) + "…"
                      : p.descripcion}
                  </p>
                  <h6 className="text-primary fw-bold mb-3">
                    ${Number(p.precio || 0).toLocaleString("es-CL")}
                  </h6>

                  <div className="d-flex gap-2 mt-auto">
                    <button
                      onClick={() => addToCart(p)}
                      className="btn btn-naranja w-50"
                    >
                      <i className="bi bi-cart-plus me-1"></i>Agregar
                    </button>

                    <Link to={`/producto/${p.id}`} className="btn btn-detalle w-50">
                      Ver detalle
                    </Link>
>>>>>>> Stashed changes
                  </div>
                </div>
              </div>
            );
          })}
        </div>
<<<<<<< Updated upstream

        <div className="mt-5">
          <Link
            to="/productos"
            className="btn btn-morado btn-lg shadow-sm px-4"
          >
            Ir al catálogo completo
          </Link>
        </div>
=======
>>>>>>> Stashed changes
      </div>
    </section>
  );
}
