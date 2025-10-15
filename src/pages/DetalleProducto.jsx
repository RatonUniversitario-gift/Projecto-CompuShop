import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import ProductImagesSlider from "../components/ProductImagesSlider.jsx";
import axios from "axios";

export default function DetalleProducto() {
  const { id } = useParams();
  const { token } = useAuth();
  const { addToCart } = useCart();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const STORE_BASE = import.meta.env.VITE_XANO_STORE_BASE;
  const BASE_URL = "https://x8ki-letl-twmt.n7.xano.io/api:K1k2AGUp";

  useEffect(() => {
    async function fetchProducto() {
      try {
        setLoading(true);
        const { data } = await axios.get(`${STORE_BASE}/product/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setProducto(data);
      } catch (err) {
        console.error("Error al cargar producto:", err);
        setError("No se pudo cargar la información del producto.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducto();
  }, [id, token, STORE_BASE]);

  if (loading) {
    return (
      <main className="container py-5 text-center text-white">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p>Cargando producto...</p>
      </main>
    );
  }

  if (error || !producto) {
    return (
      <main className="container py-5 text-center text-danger">
        <h4>{error || "Producto no encontrado."}</h4>
        <Link to="/productos" className="btn btn-outline-primary mt-4">
          Volver al catálogo
        </Link>
      </main>
    );
  }

  const precio = Number(producto.precio || 0).toLocaleString("es-CL");

  // 🔧 Armar URLs absolutas de imágenes
  const imagenesConUrl = (producto.imagenes || []).map((img) => ({
    ...img,
    path: img.path?.startsWith("http")
      ? img.path
      : `${BASE_URL}${img.path?.startsWith("/") ? "" : "/"}${img.path}`,
  }));

  return (
    <main className="container py-5 text-white">
      <div className="row align-items-center g-4">
        {/* === Columna de imágenes === */}
        <div className="col-12 col-md-6">
          <ProductImagesSlider
            images={imagenesConUrl.length ? imagenesConUrl : [{ path: "/assets/img/placeholder.png" }]}
            alt={producto.nombre}
          />
        </div>

        {/* === Columna de información === */}
        <div className="col-12 col-md-6">
          <h2 className="mb-3 text-primary fw-bold">{producto.nombre}</h2>
          <p className="text-secondary">{producto.descripcion}</p>

          {producto.descuento && (
            <span className="badge bg-success mb-2">
              -{producto.descuento}% de descuento
            </span>
          )}

          <h3 className="fw-bold text-light mb-4">${precio}</h3>

          <p>
            <strong>Marca:</strong> {producto.marca || "No especificada"} <br />
            <strong>Categoría:</strong> {producto.categoria || "General"} <br />
            <strong>Stock:</strong>{" "}
            {producto.stock > 0 ? (
              <span className="text-success">Disponible ({producto.stock})</span>
            ) : (
              <span className="text-danger">Sin stock</span>
            )}
          </p>

          <div className="d-flex flex-wrap gap-3 mt-4">
            <button
              className="btn btn-naranja"
              onClick={() => addToCart(producto)} // ✅ pasa el producto correctamente
              disabled={producto.stock === 0}
            >
              <i className="bi bi-cart-plus me-2"></i>Agregar al carrito
            </button>

            <Link to="/productos" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left"></i> Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
