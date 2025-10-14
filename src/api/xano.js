// src/api/xano.js
import axios from "axios";

const STORE_BASE = import.meta.env.VITE_XANO_STORE_BASE;

export const makeAuthHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});

// 1) Crear producto
export async function createProduct(token, payload) {
  // Adaptamos los nombres de campos para que coincidan con la base de datos
  const adaptedPayload = {
    nombre: payload.name,
    descripcion: payload.description,
    precio: payload.price,
    stock: payload.stock,
    marca: payload.brand,
    categoria: payload.category,
    activo: payload.activo ?? true
  };

  // Incluir imágenes si vienen en el payload
  if (Array.isArray(payload.imagenes)) {
    // Normalizamos a la forma esperada por Xano: requiere al menos `path`
    adaptedPayload.imagenes = payload.imagenes
      .map((img) => ({
        access: img.access ?? "public",
        path: img.path ?? img.url ?? img.file_path ?? img.location ?? img?.file?.path ?? (Array.isArray(img?.files) ? img.files[0]?.path : undefined) ?? img?.image?.path ?? "",
        name: img.name ?? img.filename ?? img?.file?.name ?? img?.image?.name ?? "",
        type: img.type ?? img.filetype ?? "",
        size: img.size ?? 0,
        mime: img.mime ?? img.mimetype ?? "",
        meta: img.meta ?? {},
      }))
      .filter((i) => i.path);
  }
  
  const { data } = await axios.post(
    `${STORE_BASE}/product`,
    adaptedPayload,
    {
      headers: { ...makeAuthHeader(token), "Content-Type": "application/json" }
    }
  );
  return data;
}

// 2) Subir imágenes
export async function uploadImages(token, files) {
  // Preferir tu nuevo endpoint dedicado
  try {
    const fd = new FormData();
    for (const f of files) fd.append("files", f); // Xano: múltiples con misma key
    const { data } = await axios.post(
      `${STORE_BASE}/upload/images`,
      fd,
      { headers: { ...makeAuthHeader(token) } }
    );
    // Normalizamos diferentes formas de respuesta
    let filesArr = [];
    if (Array.isArray(data)) filesArr = data;
    else if (Array.isArray(data?.files)) filesArr = data.files;
    else if (data?.file) filesArr = Array.isArray(data.file) ? data.file : [data.file];
    else if (data?.image) filesArr = Array.isArray(data.image) ? data.image : [data.image];
    return filesArr
      .map((img) => ({
        access: img.access ?? "public",
        path: img.path ?? img.url ?? img.file_path ?? img.location ?? img?.file?.path ?? (Array.isArray(img?.files) ? img.files[0]?.path : undefined) ?? img?.image?.path ?? "",
        name: img.name ?? img.filename ?? img?.file?.name ?? img?.image?.name ?? "",
        type: img.type ?? img.filetype ?? "",
        size: img.size ?? 0,
        mime: img.mime ?? img.mimetype ?? "",
        meta: img.meta ?? {},
      }))
      .filter((i) => i.path);
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "";
    // Fallback a endpoints estándar si tu custom no existe
    if (err?.response?.status === 404 || /Unable to locate request/i.test(msg)) {
      const fd1 = new FormData();
      for (const f of files) fd1.append("content[]", f);
      const { data } = await axios.post(
        `${STORE_BASE}/upload/image`,
        fd1,
        { headers: { ...makeAuthHeader(token) } }
      );
      let filesArr = [];
      if (Array.isArray(data)) filesArr = data;
      else if (Array.isArray(data?.files)) filesArr = data.files;
      else if (data?.file) filesArr = Array.isArray(data.file) ? data.file : [data.file];
      else if (data?.image) filesArr = Array.isArray(data.image) ? data.image : [data.image];
      return filesArr
        .map((img) => ({
          access: img.access ?? "public",
          path: img.path ?? img.url ?? img.file_path ?? img.location ?? img?.file?.path ?? (Array.isArray(img?.files) ? img.files[0]?.path : undefined) ?? img?.image?.path ?? "",
          name: img.name ?? img.filename ?? img?.file?.name ?? img?.image?.name ?? "",
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

// 3) Adjuntar imágenes al producto
export async function attachImagesToProduct(token, productId, imagesFullArray) {
  const { data } = await axios.patch(
    `${STORE_BASE}/product/${productId}`,
    { imagenes: imagesFullArray }, // ⚠️ ¡Tu campo se llama "imagenes", no "images"!
    {
      headers: { ...makeAuthHeader(token), "Content-Type": "application/json" }
    }
  );
  return data;
}

// 4) Listar productos
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