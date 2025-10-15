// src/api/xano.js
import axios from "axios";

// 🌐 Base URL de tu API Xano (definida en .env)
const STORE_BASE = import.meta.env.VITE_XANO_STORE_BASE;

<<<<<<< Updated upstream
// ----------------------
// Crear headers de autorización
=======
// 🧩 Helper: header de autorización
>>>>>>> Stashed changes
export const makeAuthHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});

<<<<<<< Updated upstream
// ----------------------
// 1) Crear producto
=======
// 🧩 Helper: normaliza la estructura de una imagen
function normalizeImage(img) {
  if (!img) return null;
  const path =
    img.path ||
    img.url ||
    img.file_path ||
    img.location ||
    img?.file?.path ||
    (Array.isArray(img?.files) ? img.files[0]?.path : undefined) ||
    img?.image?.path ||
    "";
  if (!path) return null;

  return {
    access: img.access ?? "public",
    path,
    name:
      img.name ??
      img.filename ??
      img?.file?.name ??
      img?.image?.name ??
      "imagen",
    type: img.type ?? img.filetype ?? "",
    size: img.size ?? 0,
    mime: img.mime ?? img.mimetype ?? "",
    meta: img.meta ?? {},
  };
}

//
// ===============================
// 1️⃣ Crear producto
// ===============================
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
    imagenes: Array.isArray(payload.imagenes)
      ? payload.imagenes.map(normalizeImage).filter(Boolean)
      : [],
  };

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

//
// ===============================
// 2️⃣ Subir imágenes
// ===============================
>>>>>>> Stashed changes
export async function uploadImages(token, files) {
  try {
    const fd1 = new FormData();
    for (const f of files) fd1.append("content[]", f);

    const { data } = await axios.post(`${STORE_BASE}/upload/image`, fd1, {
      headers: makeAuthHeader(token),
    });

<<<<<<< Updated upstream
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
=======
    const filesArr =
      Array.isArray(data) ||
      Array.isArray(data?.files) ||
      Array.isArray(data?.file)
        ? data
        : Array.isArray(data?.image)
        ? data.image
        : [];

    return filesArr.map(normalizeImage).filter(Boolean);
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "";
    // Fallback a endpoint alternativo si el anterior no existe
    if (err?.response?.status === 404 || /Unable to locate request/i.test(msg)) {
      const fd1 = new FormData();
      for (const f of files) fd1.append("content[]", f);

      const { data } = await axios.post(`${STORE_BASE}/upload/image`, fd1, {
        headers: { ...makeAuthHeader(token) },
      });

      const filesArr =
        Array.isArray(data) ||
        Array.isArray(data?.files) ||
        Array.isArray(data?.file)
          ? data
          : Array.isArray(data?.image)
          ? data.image
          : [];

      return filesArr.map(normalizeImage).filter(Boolean);
>>>>>>> Stashed changes
    }

    throw err;
  }
}

<<<<<<< Updated upstream
// ----------------------
// 3) Adjuntar imágenes al producto
=======
//
// ===============================
// 3️⃣ Adjuntar imágenes a producto
// ===============================
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
// ----------------------
// 4) Listar productos
export async function listProducts({ token, limit = 12, offset = 0, q = "" } = {}) {
=======
//
// ===============================
// 4️⃣ Listar productos
// ===============================
export async function listProducts({
  token,
  limit = 12,
  offset = 0,
  q = "",
} = {}) {
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
//
// ===============================
// 5️⃣ Actualizar producto (PATCH)
// ===============================
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======

//
// ===============================
// 6️⃣ Eliminar producto (DELETE)
// ===============================
export async function deleteProduct(token, id) {
  const { data } = await axios.delete(`${STORE_BASE}/product/${id}`, {
    headers: makeAuthHeader(token),
  });
  return data;
}
>>>>>>> Stashed changes
