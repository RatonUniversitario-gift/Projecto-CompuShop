import React, { useEffect, useState } from "react";
import { listProducts } from "../api/xano.js";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function ProductGrid({ token }) {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    async function cargar() {
      try {
        const data = await listProducts({ token });
        setProductos(data);
      } catch (e) {
        setError("Error al cargar los productos desde Xano");
      }
    }
    cargar();
  }, [token]);

  if (error) {
    return (
      <div className="alert alert-danger text-center my-4">{error}</div>
    );
  }

  if (!productos.length) {
    return (
      <div className="text-center text-secondary py-5">
        <div className="spinner-border text-primary mb-3"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="row g-4 justify-content-center">
      {productos.map((p) => {
        const precio = Number(p.precio || 0).toLocaleString("es-CL");
        
        // Construir URL de imagen correctamente
        let imagen = "https://via.placeholder.com/300x200?text=Sin+Imagen";
        if (Array.isArray(p.imagenes) && p.imagenes.length > 0) {
          const imgData = p.imagenes[0];
          if (imgData?.url) {
            imagen = imgData.url;
          } else if (imgData?.path) {
            const BASE = "https://x8ki-letl-twmt.n7.xano.io";
            imagen = `${BASE}${imgData.path.startsWith("/") ? "" : "/"}${imgData.path}`;
          } else if (typeof imgData === 'string') {
            if (imgData.startsWith('http')) {
              imagen = imgData;
            } else {
              const BASE = "https://x8ki-letl-twmt.n7.xano.io";
              imagen = `${BASE}${imgData.startsWith("/") ? "" : "/"}${imgData}`;
            }
          }
        }

        const hasMultipleImages = Array.isArray(p.imagenes) && p.imagenes.length > 1;

        return (
          <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card tarjeta-producto h-100 bg-dark text-white border-primary shadow-sm hover-scale">
              <div className="position-relative">
                <img
                  src={imagen}
                  alt={p.nombre}
                  className="card-img-top rounded-top"
                  style={{ height: "220px", objectFit: "contain", padding: "10px" }}
                />
                {/* Indicador de múltiples imágenes */}
                {hasMultipleImages && (
                  <span className="badge bg-info position-absolute top-0 start-0 m-2">
                    <i className="bi bi-images"></i> {p.imagenes.length}
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
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-primary fs-6">${precio}</span>
                    <button
                      className="btn btn-naranja btn-sm"
                      onClick={() => addToCart(p)}
                    >
                      Agregar al carrito
                    </button>
                  </div>

                  {/* 🔹 Botón blanco permanente */}
                  <Link
                    to={`/producto/${p.id}`}
                    className="btn btn-detalle btn-sm mt-3 w-100"
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
  );
}
