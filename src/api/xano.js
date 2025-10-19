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

// ----------------------
// Carrito: helpers básicos
export async function getOrCreateCart(token, userId) {
  if (!userId) throw new Error("userId es obligatorio para el carrito");
  // Intento: obtener carritos del usuario
  let carts = [];
  try {
    const { data } = await axios.get(`${STORE_BASE}/cart`, {
      headers: makeAuthHeader(token),
      params: { user_id: userId },
    });
    carts = Array.isArray(data) ? data : [];
  } catch {
    // Si falla filtros, obtenemos todos y filtramos en cliente
    const { data } = await axios.get(`${STORE_BASE}/cart`, {
      headers: makeAuthHeader(token),
    });
    carts = Array.isArray(data) ? data : [];
  }
  const openCart = carts.find((c) => (c.user_id === userId) && (c.estado !== 'cerrado'));
  if (openCart) return openCart;
  const { data: created } = await axios.post(`${STORE_BASE}/cart`, {
    user_id: userId,
    estado: 'abierto',
    total: 0,
  }, { headers: { ...makeAuthHeader(token), "Content-Type": "application/json" } });
  return created;
}

export async function listCartItems(token, cartId) {
  if (!cartId) throw new Error("cartId es obligatorio");
  try {
    const { data } = await axios.get(`${STORE_BASE}/cart_item`, {
      headers: makeAuthHeader(token),
      params: { cart_id: cartId },
    });
    const arr = Array.isArray(data) ? data : [];
    // Si el filtro del backend no aplica, filtramos aquí
    return arr.filter((ci) => ci.cart_id === cartId);
  } catch {
    const { data } = await axios.get(`${STORE_BASE}/cart_item`, {
      headers: makeAuthHeader(token),
    });
    const arr = Array.isArray(data) ? data : [];
    return arr.filter((ci) => ci.cart_id === cartId);
  }
}

export async function addItemToCart(token, { cartId, productId, cantidad = 1 }) {
  if (!cartId || !productId) throw new Error("cartId y productId son obligatorios");
  const { data } = await axios.post(`${STORE_BASE}/cart_item`, {
    cart_id: cartId,
    product_id: productId,
    cantidad: Number(cantidad ?? 1),
  }, { headers: { ...makeAuthHeader(token), "Content-Type": "application/json" } });
  await recalculateCartTotal(token, cartId);
  return data;
}

export async function updateCartItemQty(token, itemId, cantidad) {
  if (!itemId) throw new Error("itemId es obligatorio");
  const { data } = await axios.patch(`${STORE_BASE}/cart_item/${itemId}`, {
    cantidad: Number(cantidad ?? 1),
  }, { headers: { ...makeAuthHeader(token), "Content-Type": "application/json" } });
  // Intentamos obtener el cartId del item para recalcular
  try {
    const { data: item } = await axios.get(`${STORE_BASE}/cart_item/${itemId}`, { headers: makeAuthHeader(token) });
    if (item?.cart_id) await recalculateCartTotal(token, item.cart_id);
  } catch { /* noop */ }
  return data;
}

export async function removeItemFromCart(token, itemId, cartId) {
  if (!itemId) throw new Error("itemId es obligatorio");
  const { data } = await axios.delete(`${STORE_BASE}/cart_item/${itemId}`, { headers: makeAuthHeader(token) });
  if (cartId) await recalculateCartTotal(token, cartId);
  return data;
}

export async function getProduct(token, id) {
  if (!id) throw new Error("ID de producto obligatorio");
  const { data } = await axios.get(`${STORE_BASE}/product/${id}`, { headers: makeAuthHeader(token) });
  return data;
}

export async function getCartWithItems(token, cartId) {
  if (!cartId) throw new Error("cartId es obligatorio");
  const { data: cart } = await axios.get(`${STORE_BASE}/cart/${cartId}`, { headers: makeAuthHeader(token) });
  const items = await listCartItems(token, cartId);
  const ids = [...new Set(items.map((i) => i.product_id))];
  const products = await Promise.all(ids.map((id) => getProduct(token, id).catch(() => ({ id, precio: 0 }))));
  const priceMap = new Map(products.map((p) => [p.id, Number(p.precio ?? 0)]));
  const itemsDetailed = items.map((i) => ({
    ...i,
    precio_unitario: priceMap.get(i.product_id) ?? 0,
    subtotal: Number(i.cantidad ?? 0) * (priceMap.get(i.product_id) ?? 0),
  }));
  const total = itemsDetailed.reduce((s, it) => s + Number(it.subtotal ?? 0), 0);
  return { ...cart, items: itemsDetailed, totalCalculado: total };
}

export async function recalculateCartTotal(token, cartId) {
  const summary = await getCartWithItems(token, cartId);
  const { data } = await axios.patch(`${STORE_BASE}/cart/${cartId}`, {
    total: summary.totalCalculado,
    actualizado_en: new Date().toISOString(),
  }, { headers: { ...makeAuthHeader(token), "Content-Type": "application/json" } });
  return data?.total ?? summary.totalCalculado;
}

export async function checkoutCart(token, cartId) {
  if (!cartId) throw new Error("cartId es obligatorio");
  const summary = await getCartWithItems(token, cartId);
  const cartResp = await axios.get(`${STORE_BASE}/cart/${cartId}`, { headers: makeAuthHeader(token) });
  const cart = cartResp.data;
  const orderPayload = {
    user_id: cart.user_id,
    total: summary.totalCalculado,
    estado: 'pendiente',
    fecha: new Date().toISOString(),
  };
  const { data: order } = await axios.post(`${STORE_BASE}/order`, orderPayload, {
    headers: { ...makeAuthHeader(token), "Content-Type": "application/json" },
  });
  // Crear order_items para cada item
  await Promise.all(summary.items.map((it) => axios.post(`${STORE_BASE}/order_item`, {
    order_id: order.id,
    product_id: it.product_id,
    cantidad: Number(it.cantidad ?? 0),
    precio_unitario: Number(it.precio_unitario ?? 0),
    subtotal: Number(it.subtotal ?? 0),
  }, { headers: { ...makeAuthHeader(token), "Content-Type": "application/json" } })));
  // Cerrar carrito
  await axios.patch(`${STORE_BASE}/cart/${cartId}`, { estado: 'cerrado', total: summary.totalCalculado }, {
    headers: { ...makeAuthHeader(token), "Content-Type": "application/json" },
  });
  // Vaciar items del carrito
  const items = await listCartItems(token, cartId);
  await Promise.allSettled(items.map((it) => axios.delete(`${STORE_BASE}/cart_item/${it.id}`, { headers: makeAuthHeader(token) })));
  return { order, total: summary.totalCalculado, items_count: summary.items.length };
}

// ----------------------
// Listar usuarios
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
