// Importamos React y hooks necesarios para formularios y estado
import React, { useState } from 'react'
// Importamos el hook de autenticación para obtener token y usuario
import { useAuth } from '../context/AuthContext.jsx'
// Importamos funciones de API existentes para el flujo con Axios
import { createProduct, uploadImages } from '../api/xano.js'

// Componente de la página de creación de productos
export default function CreateProduct() {
  // Obtenemos token del contexto
  const { token } = useAuth()
  // Estado del formulario de producto
  // Usamos las mismas claves que los inputs (inglés) para evitar
  // el warning de controlled/uncontrolled y mantener consistencia
  const [form, setForm] = useState({ name: '', description: '', price: 0, stock: 0, brand: '', category: '' })
  // Estado para archivos de imágenes seleccionados
  const [files, setFiles] = useState([])
  // Estado para mostrar errores
  const [error, setError] = useState('')
  // Estado para mostrar resultado del producto creado
  const [result, setResult] = useState(null)
  // Estado de carga durante la creación
  const [creating, setCreating] = useState(false)

  // Handler para cambios en inputs del formulario
  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Handler para selección de archivos
  function onFiles(e) {
    setFiles(Array.from(e.target.files || []))
  }

  // Handler para crear producto
  async function onCreate(e) {
    e.preventDefault()
    setError('')
    setCreating(true)
    setResult(null)
    try {
      // Subir imágenes si se seleccionaron
      let images = []
      if (files.length > 0) {
        images = await uploadImages(token, files)
      }
      // Crear producto enviando las imágenes en el mismo POST
      const created = await createProduct(token, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        brand: form.brand,
        category: form.category,
        imagenes: images.length > 0 ? images : undefined,
        activo: true,
      })
      setResult(created)
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Error al crear producto')
    } finally {
      setCreating(false)
    }
  }

  return (
    <>
      <main className="container py-5">
        <section className="row justify-content-center">
          <div className="col-12 col-md-8">
            <div className="card bg-dark text-white border-primary p-4 mb-4">
              <h2 className="text-center mb-4">Crear producto</h2>
              <form onSubmit={onCreate}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" name="name" value={form.name} onChange={onChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Marca</label>
                    <input type="text" className="form-control" name="brand" value={form.brand} onChange={onChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Categoría</label>
                    <input type="text" className="form-control" name="category" value={form.category} onChange={onChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Precio</label>
                    <input type="number" className="form-control" name="price" value={form.price} onChange={onChange} required min={0} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Stock</label>
                    <input type="number" className="form-control" name="stock" value={form.stock} onChange={onChange} required min={0} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" name="description" value={form.description} onChange={onChange} rows={2} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Imágenes</label>
                    <input type="file" className="form-control" multiple accept="image/*" onChange={onFiles} />
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {/* Mapeo de archivos a imágenes */}
                  {files.map((f, i) => (
                    // Imagen con miniatura
                    <img key={i} src={URL.createObjectURL(f)} alt={f.name} className="img-thumbnail" style={{ width: '96px', height: '96px', objectFit: 'cover' }} />
                  ))}
                </div>
                <div className="d-flex justify-content-end mt-4">
                  <button className="btn btn-primary" type="submit" disabled={creating}>Crear producto</button>
                </div>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {result && <div className="alert alert-success mt-3">Producto creado correctamente (ID: {result.id})</div>}
              </form>
              {/* Resultado si existe */}
              {result && (
                <div className="bg-light p-3 rounded mt-4">
                  <h3 className="mt-0">Producto creado/actualizado</h3>
                  <pre className="m-0">{JSON.stringify(result, null, 2)}</pre>
                  {/* Imágenes del producto si existen */}
                  {Array.isArray(result.imagenes) && result.imagenes.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {result.imagenes.map((img, i) => (
                        <img key={i} src={img.url || img.path} alt={img.filename || `img-${i}`} className="img-thumbnail" style={{ width: '96px', height: '96px', objectFit: 'cover' }} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}