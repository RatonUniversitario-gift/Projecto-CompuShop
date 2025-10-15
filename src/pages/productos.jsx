import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useEffect, useState } from "react";
import { listProducts } from "../api/xano.js";
import { Link } from "react-router-dom";
import SeccionBase from "../components/SeccionBase.jsx";

export default function Productos() {
  const { token } = useAuth();
  const { addToCart } = useCart();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    async function fetchProductos() {
      try {
        const data = await listProducts({ token });
        setProductos(data);
      } catch (err) {
        console.error("Error al obtener productos:", err);
      }
    }
    fetchProductos();
  }, [token]);

  return (
    <SeccionBase
      titulo="Catálogo de Productos"
      subtitulo="Explora los productos disponibles en TechNova Store"
    >
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
    </SeccionBase>
  );
}
