// src/pages/Carrito.jsx
import { useCart } from "../context/CartContext.jsx";
import SeccionBase from "../components/SeccionBase.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Carrito() {
  const { cart, increment, decrement, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [compraRealizada, setCompraRealizada] = useState(false);
  const total = cart.reduce(
    (s, p) => s + (p.precio || 0) * (p.quantity || 1),
    0
  );

  // 🛒 Si el carrito está vacío
  if (!cart || cart.length === 0) {
    return (
      <SeccionBase titulo="Tu carrito está vacío 🛒">
        <div
          className="text-center d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <p className="text-white mb-4">
            Aún no has agregado productos a tu carrito.
          </p>
          <Link
            to="/productos"
            className="btn btn-morado btn-lg shadow-sm px-4"
          >
            Ir al catálogo
          </Link>
        </div>
      </SeccionBase>
    );
  }

  // 🖼 Imagen segura desde Xano
  const getImage = (item) => {
    const img =
      item.imagenes?.[0]?.path ||
      item.imagenes?.[0]?.url ||
      item.imagenes?.[0]?.file_path ||
      item.imagenes?.path ||
      "/assets/img/placeholder.png";

    if (img.startsWith("http")) return img;
    const BASE = "https://x8ki-letl-twmt.n7.xano.io";
    return `${BASE}${img.startsWith("/") ? "" : "/"}${img}`;
  };

  // 🚫 Bloquear acceso al checkout si no hay sesión iniciada
  const handleCheckout = () => {
    if (!user) {
      alert("⚠️ Debes iniciar sesión para continuar con la compra.");
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  return (
    <SeccionBase titulo="Tu Carrito de Compras">
      <div
        className="container py-3"
        style={{
          backgroundColor: "#101820",
          borderRadius: "10px",
          padding: "1.5rem",
          boxShadow: "0 0 15px rgba(0,180,216,0.2)",
        }}
      >
        {/* 🧾 Tabla de productos */}
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr
                style={{
                  backgroundColor: "#0b0c10",
                  borderBottom: "2px solid #00b4d8",
                  color: "#fff",
                }}
              >
                <th>Producto</th>
                <th className="text-center">Cantidad</th>
                <th className="text-center">Precio</th>
                <th className="text-center">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => {
                const imagen = getImage(item);
                const subtotal =
                  Number(item.precio || 0) * (item.quantity || 1);

                return (
                  <tr
                    key={item.id}
                    style={{
                      backgroundColor: "#ffffff", // 💡 fondo claro
                      color: "#000000", // 💬 texto negro
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    {/* 🖼 Imagen + Nombre */}
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={imagen}
                          alt={item.nombre}
                          onError={(e) =>
                            (e.target.src = "/assets/img/placeholder.png")
                          }
                          style={{
                            width: 72,
                            height: 72,
                            objectFit: "contain",
                            background: "#f5f5f5",
                            borderRadius: 10,
                            boxShadow: "0 0 8px rgba(0,0,0,0.2)",
                          }}
                        />
                        <div>
                          <h6 className="mb-1 fw-bold text-dark">
                            {item.nombre}
                          </h6>
                          <small style={{ color: "#333" }}>
                            {item.marca || "TechNova"} |{" "}
                            <span
                              style={{
                                color: "#00cc66", // 💚 verde oscuro legible sobre blanco
                                fontWeight: "bold",
                              }}
                            >
                              ${Number(item.precio).toLocaleString()}
                            </span>{" "}
                            c/u
                          </small>
                        </div>
                      </div>
                    </td>

                    {/* 🔢 Cantidad */}
                    <td className="text-center">
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <button
                          className="btn btn-sm rounded-circle fw-bold"
                          style={{
                            backgroundColor: "#00b4d8",
                            color: "#fff",
                            border: "none",
                            width: "32px",
                            height: "32px",
                            lineHeight: "1",
                          }}
                          onClick={() => decrement(item.id)}
                        >
                          −
                        </button>

                        <span
                          className="badge fs-6 px-3"
                          style={{
                            backgroundColor: "#0b0c10",
                            color: "#fff",
                            border: "1px solid #00b4d8",
                            minWidth: "38px",
                          }}
                        >
                          {item.quantity || 1}
                        </span>

                        <button
                          className="btn btn-sm rounded-circle fw-bold"
                          style={{
                            backgroundColor: "#00b4d8",
                            color: "#fff",
                            border: "none",
                            width: "32px",
                            height: "32px",
                            lineHeight: "1",
                          }}
                          onClick={() => increment(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* 💰 Precio y Subtotal */}
                    <td
                      className="text-center fw-bold"
                      style={{ color: "#00cc66" }}
                    >
                      ${Number(item.precio).toLocaleString()}
                    </td>
                    <td
                      className="text-center fw-bold"
                      style={{ color: "#00cc66" }}
                    >
                      ${subtotal.toLocaleString()}
                    </td>

                    {/* 🗑 Quitar */}
                    <td className="text-center">
                      <button
                        className="btn btn-sm fw-semibold"
                        style={{
                          backgroundColor: "#e63946",
                          color: "#fff",
                          border: "none",
                        }}
                        onClick={() => removeFromCart(item.id)}
                      >
                        <i className="bi bi-x-circle me-1"></i> Quitar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <hr className="border-primary my-4" />

        {/* ⚙️ Totales y acciones */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <button
            className="btn px-4 fw-semibold text-white"
            style={{
              backgroundColor: "#2a2d34",
              border: "1px solid #00b4d8",
            }}
            onClick={clearCart}
          >
            Vaciar carrito
          </button>

          <h4 className="mb-0 fw-bold text-white">
            Total:{" "}
            <span style={{ color: "#7CFF7C", fontSize: "1.6rem" }}>
              ${total.toLocaleString()}
            </span>
          </h4>
        </div>

        {/* 🔵 Botón principal */}
        <div className="text-end mt-4">
          <button
            className="btn btn-lg px-5 shadow-lg fw-semibold"
            style={{
              backgroundColor: "#00b4d8",
              color: "#fff",
              border: "none",
            }}
            onClick={handleCheckout}
          >
            <i className="bi bi-bag-check me-2"></i>Continuar con la compra
          </button>
        </div>
      </div>
    </SeccionBase>
  );
}
