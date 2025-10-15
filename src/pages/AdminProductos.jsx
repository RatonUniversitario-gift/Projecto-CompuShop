import { useEffect, useState } from "react";
import SeccionBase from "../components/SeccionBase.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { listProducts, updateProduct, deleteProduct } from "../api/xano.js";

export default function AdminProductos() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState(null); // id en edición
  const [form, setForm] = useState({}); // datos edición
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await listProducts({ token, limit: 100, q });
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [q]);

  const startEdit = (p) => {
    setEditRow(p.id);
    setForm({
      name: p.nombre,
      description: p.descripcion,
      price: p.precio,
      stock: p.stock,
      brand: p.marca,
      category: p.categoria,
      activo: p.activo ?? true,
    });
  };

  const cancelEdit = () => {
    setEditRow(null);
    setForm({});
  };

  const saveEdit = async (id) => {
    await updateProduct(token, id, form);
    cancelEdit();
    await load();
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    await deleteProduct(token, id);
    await load();
  };

  return (
    <SeccionBase titulo="Administrar Productos" subtitulo="Editar o eliminar productos del catálogo">
      <div className="d-flex gap-2 mb-3">
        <input
          placeholder="Buscar por nombre..."
          className="form-control bg-dark text-white border-primary"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn btn-outline-primary" onClick={load}>Refrescar</button>
      </div>

      {loading ? (
        <div className="text-center text-secondary">Cargando...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle border border-primary">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre / Marca</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Activo</th>
                <th style={{ width: 220 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>

                  <td>
                    {editRow === p.id ? (
                      <>
                        <input
                          className="form-control form-control-sm bg-dark text-white border-primary mb-2"
                          value={form.name || ""}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Nombre"
                        />
                        <input
                          className="form-control form-control-sm bg-dark text-white border-primary"
                          value={form.brand || ""}
                          onChange={(e) => setForm({ ...form, brand: e.target.value })}
                          placeholder="Marca"
                        />
                      </>
                    ) : (
                      <>
                        <div className="fw-semibold">{p.nombre}</div>
                        <div className="text-secondary small">{p.marca}</div>
                      </>
                    )}
                  </td>

                  <td>
                    {editRow === p.id ? (
                      <input
                        type="number"
                        className="form-control form-control-sm bg-dark text-white border-primary"
                        value={form.price || 0}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      />
                    ) : (
                      <span className="text-success fw-semibold">
                        ${Number(p.precio || 0).toLocaleString()}
                      </span>
                    )}
                  </td>

                  <td>
                    {editRow === p.id ? (
                      <input
                        type="number"
                        className="form-control form-control-sm bg-dark text-white border-primary"
                        value={form.stock || 0}
                        onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                      />
                    ) : (
                      p.stock
                    )}
                  </td>

                  <td>
                    {editRow === p.id ? (
                      <input
                        className="form-control form-control-sm bg-dark text-white border-primary"
                        value={form.category || ""}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      />
                    ) : (
                      p.categoria
                    )}
                  </td>

                  <td>
                    {editRow === p.id ? (
                      <select
                        className="form-select form-select-sm bg-dark text-white border-primary"
                        value={form.activo ? "1" : "0"}
                        onChange={(e) =>
                          setForm({ ...form, activo: e.target.value === "1" })
                        }
                      >
                        <option value="1">Sí</option>
                        <option value="0">No</option>
                      </select>
                    ) : (
                      <span className={p.activo ? "badge bg-success" : "badge bg-secondary"}>
                        {p.activo ? "Sí" : "No"}
                      </span>
                    )}
                  </td>

                  <td>
                    {editRow === p.id ? (
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-morado" onClick={() => saveEdit(p.id)}>
                          Guardar
                        </button>
                        <button className="btn btn-sm btn-outline-light" onClick={cancelEdit}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(p)}>
                          Editar
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => remove(p.id)}>
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-secondary py-4">
                    No hay productos para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </SeccionBase>
  );
}
