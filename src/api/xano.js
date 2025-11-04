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
      payload.category ?? payload.categoria ?? payload.categoría ?? "",
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

  const { data } = await axios.post(`${STORE_BASE}/product`, adaptedPayload, {
    headers: {
      ...makeAuthHeader(token),
      "Content-Type": "application/json",
    },
  });

  return data;
}

// ----------------------
// 2) Subir imágenes
export async function uploadImages(token, files) {
  // Subimos CADA archivo individualmente a /upload/image con campo "content".
  // Esto evita el caso observado de duplicar la misma imagen y omitir la otra.
  const uploaded = [];
  for (const f of files) {
    try {
      const fd = new FormData();
      fd.append("content", f);
      const { data } = await axios.post(`${STORE_BASE}/upload/image`, fd, {
        headers: makeAuthHeader(token),
      });
      const arr = Array.isArray(data)
        ? data
        : data?.images || data?.files || (data?.img ? [data.img] : []);
      if (Array.isArray(arr) && arr.length) {
        // Para una llamada individual, tomamos el último o único elemento.
        uploaded.push(arr[arr.length - 1]);
      }
    } catch (err1) {
      const status1 = err1?.response?.status;
      const msg1 = err1?.response?.data?.message || err1.message || "";
      console.warn(`Fallo al subir en /upload/image (${f.name}):`, status1, msg1);
      // Fallback: /upload con files[] si el endpoint alterno existe
      try {
        const fd2 = new FormData();
        fd2.append("files[]", f);
        const { data: d2 } = await axios.post(`${STORE_BASE}/upload`, fd2, {
          headers: makeAuthHeader(token),
        });
        const arr2 = Array.isArray(d2) ? d2 : d2?.files || d2?.images || [];
        if (Array.isArray(arr2) && arr2.length) {
          uploaded.push(arr2[arr2.length - 1]);
        }
      } catch (err2) {
        const status2 = err2?.response?.status;
        const msg2 = err2?.response?.data?.message || err2.message || "";
        console.warn(`Fallo al subir en /upload (${f.name}):`, status2, msg2);
      }
    }
  }
  return uploaded;
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
      payload.category ?? payload.categoria ?? payload.categoría ?? "",
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

// ----------------------
// Carrito y pedidos
export async function getOrCreateCart(token, userId) {
  if (!userId) throw new Error("userId es obligatorio para el carrito");
  let carts = [];
  try {
    const { data } = await axios.get(`${STORE_BASE}/cart`, {
      headers: makeAuthHeader(token),
      params: { user_id: userId },
    });
    carts = Array.isArray(data) ? data : [];
  } catch {
    const { data } = await axios.get(`${STORE_BASE}/cart`, {
      headers: makeAuthHeader(token),
    });
    carts = Array.isArray(data) ? data : [];
  }
  const openCart = carts.find(
    (c) => c.user_id === userId && c.estado !== "cerrado"
  );
  if (openCart) return openCart;
  const { data: created } = await axios.post(
    `${STORE_BASE}/cart`,
    {
      user_id: userId,
      estado: "abierto",
      total: 0,
    },
    {
      headers: {
        ...makeAuthHeader(token),
        "Content-Type": "application/json",
      },
    }
  );
  return created;
}

export async function listCartItems(token, cartId) {
  if (!cartId) throw new Error("cartId es obligatorio");
  const { data } = await axios.get(`${STORE_BASE}/cart_item`, {
    headers: makeAuthHeader(token),
    params: { cart_id: cartId },
  });
  const arr = Array.isArray(data) ? data : [];
  return arr.filter((ci) => ci.cart_id === cartId);
}

export async function getProduct(token, id) {
  if (!id) throw new Error("ID de producto obligatorio");
  const { data } = await axios.get(`${STORE_BASE}/product/${id}`, {
    headers: makeAuthHeader(token),
  });
  return data;
}

export async function getCartWithItems(token, cartId) {
  const { data: cart } = await axios.get(`${STORE_BASE}/cart/${cartId}`, {
    headers: makeAuthHeader(token),
  });
  const items = await listCartItems(token, cartId);
  const ids = [...new Set(items.map((i) => i.product_id))];
  const products = await Promise.all(
    ids.map((id) => getProduct(token, id).catch(() => ({ id, precio: 0 })))
  );
  const priceMap = new Map(products.map((p) => [p.id, Number(p.precio ?? 0)]));
  const itemsDetailed = items.map((i) => ({
    ...i,
    precio_unitario: priceMap.get(i.product_id) ?? 0,
    subtotal: Number(i.cantidad ?? 0) * (priceMap.get(i.product_id) ?? 0),
  }));
  const total = itemsDetailed.reduce((s, it) => s + Number(it.subtotal ?? 0), 0);
  return { ...cart, items: itemsDetailed, totalCalculado: total };
}

// ✅ NUEVA versión de checkoutCart con dirección y teléfono
export async function checkoutCart(token, { user_id, direccion_envio, telefono_contacto }) {
  if (!user_id) throw new Error("user_id es obligatorio");

  // Obtener el carrito abierto
  const carts = await axios.get(`${STORE_BASE}/cart`, {
    headers: makeAuthHeader(token),
    params: { user_id },
  });
  const openCart = Array.isArray(carts.data)
    ? carts.data.find((c) => c.estado !== "cerrado")
    : null;
  if (!openCart) throw new Error("No se encontró carrito abierto.");

  const summary = await getCartWithItems(token, openCart.id);

  const orderPayload = {
    user_id,
    total: summary.totalCalculado,
    direccion_envio,
    telefono_contacto,
    estado: "pendiente",
    fecha: new Date().toISOString(),
  };

  // Crear pedido
  const { data: order } = await axios.post(`${STORE_BASE}/order`, orderPayload, {
    headers: { ...makeAuthHeader(token), "Content-Type": "application/json" },
  });

  // Crear order_items
  await Promise.all(
    summary.items.map((it) =>
      axios.post(
        `${STORE_BASE}/order_item`,
        {
          order_id: order.id,
          product_id: it.product_id,
          cantidad: Number(it.cantidad ?? 0),
          precio_unitario: Number(it.precio_unitario ?? 0),
          subtotal: Number(it.subtotal ?? 0),
        },
        {
          headers: { ...makeAuthHeader(token), "Content-Type": "application/json" },
        }
      )
    )
  );

  // Cerrar carrito
  await axios.patch(
    `${STORE_BASE}/cart/${openCart.id}`,
    { estado: "cerrado", total: summary.totalCalculado },
    { headers: { ...makeAuthHeader(token), "Content-Type": "application/json" } }
  );

  return order;
}

// ✅ Crear orden directamente desde los items del carrito local
export async function createOrderFromItems(
  token,
  {
    user_id,
    items = [],
    estado = "pendiente",
    fecha = new Date().toISOString(),
    direccion_envio,
    telefono_contacto,
  }
) {
  if (!user_id) throw new Error("user_id es obligatorio");
  const normalized = Array.isArray(items) ? items : [];
  const itemsDetailed = normalized.map((it) => {
    const cantidad = Number(it.quantity ?? it.cantidad ?? 1);
    const precio = Number(it.precio ?? it.price ?? it.precio_unitario ?? 0);
    const product_id = Number(it.id ?? it.product_id);
    return {
      product_id,
      cantidad,
      precio_unitario: precio,
      subtotal: cantidad * precio,
    };
  });
  const total = itemsDetailed.reduce((s, i) => s + Number(i.subtotal ?? 0), 0);

  const orderPayload = {
    user_id,
    total,
    estado,
    fecha,
  };

  // Adjuntar campos opcionales si existen en la tabla
  if (direccion_envio != null) orderPayload.direccion_envio = direccion_envio;
  if (telefono_contacto != null) orderPayload.telefono_contacto = telefono_contacto;

  const { data: order } = await axios.post(`${STORE_BASE}/order`, orderPayload, {
    headers: { ...makeAuthHeader(token), "Content-Type": "application/json" },
  });

  await Promise.all(
    itemsDetailed.map((it) =>
      axios.post(
        `${STORE_BASE}/order_item`,
        {
          order_id: order.id,
          product_id: it.product_id,
          cantidad: it.cantidad,
          precio_unitario: it.precio_unitario,
          subtotal: it.subtotal,
        },
        {
          headers: { ...makeAuthHeader(token), "Content-Type": "application/json" },
        }
      )
    )
  );

  return order;
}

// ----------------------
// Listar usuarios (solo lectura)
export async function listUsers({ token, limit = 100, offset = 0, q = "" } = {}) {
  const params = {};
  if (limit != null) params.limit = limit;
  if (offset != null) params.offset = offset;
  if (q) params.q = q;

  const { data } = await axios.get(`${STORE_BASE}/user`, {
    headers: makeAuthHeader(token),
    params,
  });

  return Array.isArray(data) ? data : [];
}

// ----------------------
// Obtener todos los usuarios reales de Xano
export async function getAllUsers(token) {
  try {
    const { data } = await axios.get(`https://x8ki-letl-twmt.n7.xano.io/api:K1k2AGUp/user`, {
      headers: makeAuthHeader(token),
    });
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al obtener usuarios reales:", error);
    return [];
  }
}

// ----------------------
// Órdenes
export async function listOrders({ token, limit = 100, offset = 0, user_id } = {}) {
  const params = {};
  if (limit != null) params.limit = limit;
  if (offset != null) params.offset = offset;
  if (user_id != null) params.user_id = user_id;

  const { data } = await axios.get(`${STORE_BASE}/order`, {
    headers: makeAuthHeader(token),
    params,
  });

  return Array.isArray(data) ? data : [];
}

export async function getOrder(token, id) {
  if (!id) throw new Error("ID de orden obligatorio");
  const { data } = await axios.get(`${STORE_BASE}/order/${id}`, {
    headers: makeAuthHeader(token),
  });
  return data;
}

export async function listOrderItems(token, orderId) {
  if (!orderId) throw new Error("orderId es obligatorio");
  const { data } = await axios.get(`${STORE_BASE}/order_item`, {
    headers: makeAuthHeader(token),
    params: { order_id: orderId },
  });
  const arr = Array.isArray(data) ? data : [];
  return arr.filter((oi) => oi.order_id === orderId);
}

export async function updateOrderStatus(token, orderId, estado, comentarios) {
  if (!orderId) throw new Error("orderId es obligatorio");
  const payload = {};
  if (estado != null) payload.estado = estado;
  if (comentarios != null) payload.comentarios = comentarios;
  const { data } = await axios.patch(
    `${STORE_BASE}/order/${orderId}`,
    payload,
    { headers: { ...makeAuthHeader(token), "Content-Type": "application/json" } }
  );
  return data;
}

export async function listUserOrders(token, userId, { limit = 100, offset = 0 } = {}) {
  if (!userId) throw new Error("userId es obligatorio");
  return listOrders({ token, user_id: userId, limit, offset });
}
