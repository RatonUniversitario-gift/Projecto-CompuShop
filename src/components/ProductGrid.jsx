// src/components/ProductGrid.jsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ProductImagesSlider from "./ProductImagesSlider.jsx";
import { listProducts } from "../api/xano";

const CLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

export default function ProductGrid({ token }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [q, setQ] = useState("");

  const LIMIT = 12;

  useEffect(() => {
    void fetchPage({ reset: true });
  }, []);

  async function fetchPage({ reset = false } = {}) {
    try {
      setLoading(true);
      setErr("");
      const nextOffset = reset ? 0 : offset;
      const batch = await listProducts({ token, limit: LIMIT, offset: nextOffset, q });
      setHasMore(batch.length === LIMIT);
      setOffset(nextOffset + batch.length);
      setItems((old) => (reset ? batch : [...old, ...batch]));
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || e.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((p) =>
      [p.nombre, p.marca, p.categoria, p.descripcion].some((f) =>
        String(f || "").toLowerCase().includes(needle)
      )
    );
  }, [items, q]);

  return (
    <div className="container">
      <div className="d-flex align-items-center mb-3 gap-3">
        <h2 className="m-0 flex-grow-1">Productos (Axios)</h2>
        <span className="small text-muted">Usuario: {user?.name || 'No conectado'}</span>
        <input
          placeholder="Buscar por nombre, marca, categoría…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="form-control"
          style={{ width: '320px' }}
        />
        <button
          onClick={() => fetchPage({ reset: true })}
          disabled={loading}
          title="Actualizar desde servidor"
          className="btn btn-outline-secondary"
        >
          Recargar
        </button>
      </div>
      {err && (
        <div className="alert alert-danger mb-3">
          {err}
        </div>
      )}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {filtered.map((p) => (
          <div className="col" key={p.id}>
            <Card product={p} />
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center my-4">
        {hasMore ? (
          <button
            onClick={() => fetchPage({ reset: false })}
            disabled={loading}
            className="btn btn-dark"
          >
            {loading ? "Cargando…" : "Cargar más"}
          </button>
        ) : (
          <span className="text-muted">{loading ? "Cargando…" : "No hay más productos"}</span>
        )}
      </div>
    </div>
  );
}

function Card({ product }) {
  return (
    <div className="card tarjeta-producto h-100 bg-dark text-white border-primary shadow-sm hover-scale">
      <div className="position-relative">
        <ProductImagesSlider images={product.imagenes || product.images} alt={product.nombre} aspect={'4/3'} />
        {/* Badge de stock */}
        {product.stock > 0 ? (
          <span className="badge bg-secondary position-absolute top-0 end-0 m-2">En stock</span>
        ) : (
          <span className="badge bg-danger position-absolute top-0 end-0 m-2">Sin stock</span>
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-1">{product.nombre}</h5>
        <p className="card-text text-secondary small mb-3">{product.descripcion}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="fw-bold text-primary fs-6">{CLP.format(Number(product.precio || 0))}</span>
          {/* Aquí podrías agregar más info si lo necesitas */}
        </div>
      </div>
    </div>
  );
}