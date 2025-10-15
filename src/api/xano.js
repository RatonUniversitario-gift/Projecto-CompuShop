// src/api/xano.js
import axios from "axios";

const STORE_BASE = import.meta.env.VITE_XANO_STORE_BASE;

// ----------------------
// Crear headers de autorización
export const makeAuthHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});

// ----------------------
// 1) Crear producto
export async function createProduct(token, payload) {
  const adaptedPayload = {
    nombre: payload.name ?? payload.nombre ?? "",
    descripcion: payload.description ?? payload.descripcion ?? "",
    precio: Number(payload.price ?? payload.precio ?? 0),
    stock: Number(payload.stock ?? payload.existencias ?? 0),
    marca: payload.brand ?? payload.marca ?? "",
    categoria:
      payload.category ??
      payload.categoria ??
      payload.categoría ??
      "",
    activo: payload.activo ?? true,
  };

  if (Array.isArray(payload.imagenes)) {
    adaptedPayload.imagenes = payload.imagenes
      .map((img) => ({
        access: img.access ?? "public",
        path:
          img.path ??
          img.url ??
          img.file_path ??
          img.location ??
          img?.file?.path ??
          img?.image?.path ??
          (Array.isArray(img?.files) ? img.files[0]?.path : undefined) ??
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

  const { data } = await axios.post(
    `${STORE_BASE}/product`,
    adaptedPayload,
    {
      headers: {
        ...makeAuthHeader(token),
        "Content-Type": "application/json",
      },
    }
  );

  return data;
}

// ----------------------
// 2) Subir imágenes
export async function uploadImages(token, files) {
  try {
    const fd1 = new FormData();
    for (const f of files) fd1.append("content[]", f);

    const { data } = await axios.post(`${STORE_BASE}/upload/image`, fd1, {
      headers: makeAuthHeader(token),
    });

    return Array.isArray(data) ? data : data.files || [];
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "";

    if (err?.response?.status === 404 || /Unable to locate request/i.test(msg)) {
      const fd2 = new FormData();
      for (const f of files) fd2.append("files[]", f);

      const { data } = await axios.post(`${STORE_BASE}/upload`, fd2, {
        headers: makeAuthHeader(token),
      });

      return Array.isArray(data) ? data : data.files || [];
    }

    throw err;
  }
}

// ----------------------
// 3) Adjuntar imágenes al producto
export async function attachImagesToProduct(token, productId, imagesFullArray) {
  const { data } = await axios.patch(
    `${STORE_BASE}/product/${productId}`,
    { imagenes: imagesFullArray },
    {
      headers: {
        ...makeAuthHeader(token),
        "Content-Type": "application/json",
      },
    }
  );

  return data;
}

// ----------------------
// 4) Listar productos
export async function listProducts({ token, limit = 12, offset = 0, q = "" } = {}) {
  const params = {};
  if (limit != null) params.limit = limit;
  if (offset != null) params.offset = offset;
  if (q) params.q = q;

  const { data } = await axios.get(`${STORE_BASE}/product`, {
    headers: makeAuthHeader(token),
    params,
  });

  return Array.isArray(data) ? data : [];
}

// ----------------------
// 5) Borrar producto
export async function deleteProduct(token, productId) {
  if (!productId) throw new Error("El ID del producto es obligatorio.");

  const { data } = await axios.delete(`${STORE_BASE}/product/${productId}`, {
    headers: makeAuthHeader(token),
  });

  return data;
}

// ----------------------
// 6) Actualizar producto
export async function updateProduct(token, id, payload) {
  if (!id) throw new Error("El ID del producto es obligatorio.");

  const adaptedPayload = {
    nombre: payload.name ?? payload.nombre ?? "",
    descripcion: payload.description ?? payload.descripcion ?? "",
    precio: Number(payload.price ?? payload.precio ?? 0),
    stock: Number(payload.stock ?? payload.existencias ?? 0),
    marca: payload.brand ?? payload.marca ?? "",
    categoria:
      payload.category ??
      payload.categoria ??
      payload.categoría ??
      "",
    activo: payload.activo ?? true,
  };

  const { data } = await axios.patch(
    `${STORE_BASE}/product/${id}`,
    adaptedPayload,
    {
      headers: {
        ...makeAuthHeader(token),
        "Content-Type": "application/json",
      },
    }
  );

  return data;
}
