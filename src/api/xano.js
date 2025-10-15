// src/api/xano.js
import axios from "axios";

const STORE_BASE = import.meta.env.VITE_XANO_STORE_BASE;

export const makeAuthHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});


// ✅ Crear producto con manejo robusto de imágenes y errores
export async function createProduct(token, payload) {
  // Adaptamos nombres de campos
  const adaptedPayload = {
    nombre: payload.name || "",
    descripcion: payload.description || "",
    precio: Number(payload.price) || 0,
    stock: Number(payload.stock) || 0,
    marca: payload.brand || "",
    categoria: payload.category || "",
    activo: payload.activo ?? true,
    imagenes: [], // 🔥 siempre se envía aunque esté vacío
  };

  // Si hay imágenes en el payload, las normalizamos
  if (Array.isArray(payload.imagenes) && payload.imagenes.length > 0) {
    adaptedPayload.imagenes = payload.imagenes
      .map((img) => ({
        access: img.access ?? "public",
        path:
          img.path ??
          img.url ??
          img.file_path ??
          img.location ??
          img?.file?.path ??
          (Array.isArray(img?.files)
            ? img.files[0]?.path
            : undefined) ??
          img?.image?.path ??
          "",
        name:
          img.name ??
          img.filename ??
          img?.file?.name ??
          img?.image?.name ??
          "",
        type: img.type ?? img.filetype ?? "",
        size: img.size ?? 0,
        mime: img.mime ?? img.mimetype ?? "",
        meta: img.meta ?? {},
      }))
      .filter((i) => i.path);
  }

  try {
    const { data } = await axios.post(`${STORE_BASE}/product`, adaptedPayload, {
      headers: { ...makeAuthHeader(token), "Content-Type": "application/json" },
    });

    console.log("✅ Producto creado:", data);
    return data;
  } catch (err) {
    console.error("❌ Error al crear producto:", err.response?.data || err);
    throw new Error(
      err.response?.data?.message ||
        err.response?.data?.error ||
        "Error desconocido al crear producto"
    );
  }
}


// ===============================
// 2️⃣ Subir imágenes
// ===============================
export async function uploadImages(token, files) {
  try {
    const fd = new FormData();
    for (const f of files) fd.append("files", f);

    const { data } = await axios.post(`${STORE_BASE}/upload/images`, fd, {
      headers: { ...makeAuthHeader(token) },
    });

    let filesArr = [];
    if (Array.isArray(data)) filesArr = data;
    else if (Array.isArray(data?.files)) filesArr = data.files;
    else if (data?.file) filesArr = Array.isArray(data.file) ? data.file : [data.file];
    else if (data?.image) filesArr = Array.isArray(data.image) ? data.image : [data.image];

    return filesArr
      .map((img) => ({
        access: img.access ?? "public",
        path:
          img.path ??
          img.url ??
          img.file_path ??
          img.location ??
          img?.file?.path ??
          (Array.isArray(img?.files) ? img.files[0]?.path : undefined) ??
          img?.image?.path ??
          "",
        name:
          img.name ??
          img.filename ??
          img?.file?.name ??
          img?.image?.name ??
          "",
        type: img.type ?? img.filetype ?? "",
        size: img.size ?? 0,
        mime: img.mime ?? img.mimetype ?? "",
        meta: img.meta ?? {},
      }))
      .filter((i) => i.path);
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "";
    if (err?.response?.status === 404 || /Unable to locate request/i.test(msg)) {
      const fd1 = new FormData();
      for (const f of files) fd1.append("content[]", f);
      const { data } = await axios.post(`${STORE_BASE}/upload/image`, fd1, {
        headers: { ...makeAuthHeader(token) },
      });

      let filesArr = [];
      if (Array.isArray(data)) filesArr = data;
      else if (Array.isArray(data?.files)) filesArr = data.files;
      else if (data?.file) filesArr = Array.isArray(data.file) ? data.file : [data.file];
      else if (data?.image) filesArr = Array.isArray(data.image) ? data.image : [data.image];

      return filesArr
        .map((img) => ({
          access: img.access ?? "public",
          path:
            img.path ??
            img.url ??
            img.file_path ??
            img.location ??
            img?.file?.path ??
            (Array.isArray(img?.files) ? img.files[0]?.path : undefined) ??
            img?.image?.path ??
            "",
          name:
            img.name ??
            img.filename ??
            img?.file?.name ??
            img?.image?.name ??
            "",
          type: img.type ?? img.filetype ?? "",
          size: img.size ?? 0,
          mime: img.mime ?? img.mimetype ?? "",
          meta: img.meta ?? {},
        }))
        .filter((i) => i.path);
    }
    throw err;
  }
}


// ===============================
// 3️⃣ Adjuntar imágenes a producto
// ===============================
export async function attachImagesToProduct(token, productId, imagesFullArray) {
  const { data } = await axios.patch(
    `${STORE_BASE}/product/${productId}`,
    { imagenes: imagesFullArray },
    {
      headers: { ...makeAuthHeader(token), "Content-Type": "application/json" },
    }
  );
  return data;
}


// ===============================
// 4️⃣ Listar productos
// ===============================
export async function listProducts({ token, limit = 12, offset = 0, q = "" } = {}) {
  const params = {};
  if (limit != null) params.limit = limit;
  if (offset != null) params.offset = offset;
  if (q) params.q = q;

  const { data } = await axios.get(`${STORE_BASE}/product`, {
    headers: { ...makeAuthHeader(token) },
    params,
  });

  return Array.isArray(data) ? data : [];
}


// ===============================
// 5️⃣ Actualizar producto (PATCH)
// ===============================
export async function updateProduct(token, id, payload) {
  const adapted = {
    nombre: payload.name ?? payload.nombre,
    descripcion: payload.description ?? payload.descripcion,
    precio: payload.price ?? payload.precio,
    stock: payload.stock,
    marca: payload.brand ?? payload.marca,
    categoria: payload.category ?? payload.categoria,
    activo: payload.activo ?? true,
  };

  const { data } = await axios.patch(`${STORE_BASE}/product/${id}`, adapted, {
    headers: { ...makeAuthHeader(token), "Content-Type": "application/json" },
  });

  return data;
}


// ===============================
// 6️⃣ Eliminar producto (DELETE)
// ===============================
export async function deleteProduct(token, id) {
  const { data } = await axios.delete(`${STORE_BASE}/product/${id}`, {
    headers: makeAuthHeader(token),
  });
  return data;
}
