// src/pages/CreateProduct.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  createProduct,
  uploadImages,
  attachImagesToProduct,
} from "../api/xano.js";
import SeccionBase from "../components/SeccionBase.jsx";

export default function CreateProduct() {
  const { token } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    brand: "",
    category: "",
  });
  const [msg, setMsg] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      // 1️⃣ Crear producto básico
      const producto = await createProduct(token, form);

      // 2️⃣ Subir imágenes si existen
      if (images.length > 0) {
        const subidas = await uploadImages(token, images);
        if (subidas.length > 0) {
          await attachImagesToProduct(token, producto.id, subidas);
        }
      }

      setMsg("✅ Producto creado exitosamente");
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        brand: "",
        category: "",
      });
      setImages([]);
      setPreview([]);
    } catch (err) {
      console.error(err);
      setMsg("❌ Error al crear producto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SeccionBase titulo="Crear nuevo producto">
      <form
        onSubmit={handleSubmit}
        className="bg-dark p-4 rounded border border-primary"
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Marca</label>
            <input
              name="brand"
              className="form-control"
              value={form.brand}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-12">
            <label className="form-label">Descripción</label>
            <textarea
              name="description"
              className="form-control"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Precio</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Stock</label>
            <input
              type="number"
              name="stock"
              className="form-control"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Categoría</label>
            <input
              name="category"
              className="form-control"
              value={form.category}
              onChange={handleChange}
              required
            />
          </div>

          {/* Subir imágenes */}
          <div className="col-md-12 mt-3">
            <label className="form-label">Imágenes del producto</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="form-control"
            />
            {preview.length > 0 && (
              <div className="d-flex flex-wrap gap-3 mt-3">
                {preview.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="preview"
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "contain",
                      borderRadius: "8px",
                      border: "1px solid #0d6efd",
                      background: "#0b0c10",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          className="btn btn-primary mt-4"
          type="submit"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar producto"}
        </button>

        {msg && <div className="alert alert-info mt-3">{msg}</div>}
      </form>
    </SeccionBase>
  );
}
