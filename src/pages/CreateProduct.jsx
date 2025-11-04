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
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    console.log(`${selectedFiles.length} archivos seleccionados:`, selectedFiles.map(f => f.name));
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
        console.log(`Subiendo ${files.length} imágenes...`);
        images = await uploadImages(token, files)
        console.log('Imágenes subidas:', images);
      }
      
      // Crear producto enviando las imágenes en el mismo POST
      const productData = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        brand: form.brand,
        category: form.category,
        imagenes: images.length > 0 ? images : undefined,
        activo: true,
      };
      
      console.log('Creando producto con datos:', productData);
      const created = await createProduct(token, productData);
      console.log('Producto creado:', created);
      
      setResult(created);
      
      // Limpiar formulario después de crear exitosamente
      setForm({ name: '', description: '', price: 0, stock: 0, brand: '', category: '' });
      setFiles([]);
      
    } catch (err) {
      console.error('Error al crear producto:', err);
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
                {/* Preview de imágenes seleccionadas */}
                {files.length > 0 && (
                  <div className="mt-3">
                    <h6 className="text-info">Imágenes seleccionadas ({files.length}):</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {files.map((f, i) => (
                        <div key={i} className="position-relative">
                          <img 
                            src={URL.createObjectURL(f)} 
                            alt={f.name} 
                            className="img-thumbnail" 
                            style={{ width: '96px', height: '96px', objectFit: 'cover' }} 
                          />
                          <small className="position-absolute bottom-0 start-0 bg-dark text-white px-1" style={{ fontSize: '10px' }}>
                            {i + 1}
                          </small>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="d-flex justify-content-end mt-4">
                  <button className="btn btn-primary" type="submit" disabled={creating}>Crear producto</button>
                </div>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {result && <div className="alert alert-success mt-3">Producto creado correctamente (ID: {result.id})</div>}
              </form>
              {/* Resultado */}
              {result && (
                <div className="alert alert-success">
                  <h5>✅ Producto creado exitosamente</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>ID:</strong> {result.id}</p>
                      <p><strong>Nombre:</strong> {result.nombre ?? result.name}</p>
                      <p><strong>Precio:</strong> ${Number(result.precio ?? result.price ?? 0)}</p>
                      <p><strong>Stock:</strong> {result.stock}</p>
                      <p><strong>Marca:</strong> {result.marca ?? result.brand}</p>
                      <p><strong>Categoría:</strong> {result.categoria ?? result.category}</p>
                      <p><strong>Descripción:</strong> {result.descripcion ?? result.description}</p>
                    </div>
                    <div className="col-md-6">
                      {/* Mostrar imágenes del resultado */}
                      {result.imagenes && result.imagenes.length > 0 && (
                        <div>
                          <h6 className="text-success">Imágenes subidas ({result.imagenes.length}):</h6>
                          <div className="d-flex flex-wrap gap-2">
                            {result.imagenes.map((img, i) => {
                              const imageUrl = img.url || 
                                             (img.path ? `https://x8ki-letl-twmt.n7.xano.io${img.path}` : null) || 
                                             (typeof img === 'string' ? img : null);
                              
                              return imageUrl ? (
                                <div key={i} className="position-relative">
                                  <img 
                                    src={imageUrl} 
                                    alt={`Imagen ${i + 1}`} 
                                    className="img-thumbnail" 
                                    style={{ width: '96px', height: '96px', objectFit: 'cover' }} 
                                  />
                                  <small className="position-absolute bottom-0 start-0 bg-success text-white px-1" style={{ fontSize: '10px' }}>
                                    {i + 1}
                                  </small>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}