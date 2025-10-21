// src/pages/Checkout.jsx
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import SeccionBase from "../components/SeccionBase.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    direccion_envio: "",
    telefono_contacto: "",
    comentarios: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const total = cart.reduce(
    (s, p) => s + (p.precio || 0) * (p.quantity || 1),
    0
  );

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🖼️ Helper para imagen
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

  // ✅ Confirmar compra
  const handleConfirmar = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("⚠️ Debes iniciar sesión para confirmar la compra.");
      navigate("/login");
      return;
    }

    if (!form.direccion_envio || !form.telefono_contacto) {
      setErrorMsg("Por favor completa todos los datos de envío.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // Simular procesamiento
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Guardar pedido antes de limpiar carrito
      localStorage.setItem(
        "ultimoPedido",
        JSON.stringify({
          items: cart,
          total,
          fecha: new Date().toISOString(),
          direccion_envio: form.direccion_envio,
          telefono_contacto: form.telefono_contacto,
          comentarios: form.comentarios,
        })
      );

      // ⚠️ redirigir ANTES de limpiar el carrito
      navigate("/checkout-confirmado");

      // limpiar carrito (después de redirección)
      setTimeout(() => clearCart(), 300);
    } catch (err) {
      console.error("Error al procesar compra:", err);
      setErrorMsg("❌ Ocurrió un error al procesar la compra.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    navigate("/carrito");
    return null;
  }

  return (
    <SeccionBase
      titulo="Confirmar pedido"
      subtitulo="Revisa tu orden e ingresa los datos de envío"
    >
      <div className="container py-4 text-white">
        <div className="row g-4">
          {/* 🧾 Resumen */}
          <div className="col-12 col-md-6">
            <div
              className="card h-100"
              style={{
                backgroundColor: "#101820",
                border: "1px solid #00b4d8",
                color: "#ffffff",
                boxShadow: "0 0 10px rgba(0,180,216,0.25)",
              }}
            >
              <div className="card-body">
                <h5
                  className="mb-4 fw-bold"
                  style={{ color: "#00b4d8", letterSpacing: "0.5px" }}
                >
                  Resumen de tu compra
                </h5>

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center border-bottom border-secondary py-3 gap-3"
                  >
                    <img
                      src={getImage(item)}
                      alt={item.nombre}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 8,
                        objectFit: "contain",
                        backgroundColor: "#0b0c10",
                      }}
                    />
                    <div className="flex-grow-1">
                      <strong style={{ color: "#fff" }}>{item.nombre}</strong>
                      <div style={{ color: "rgba(255,255,255,0.7)" }}>
                        {item.quantity} x ${item.precio.toLocaleString()}
                      </div>
                    </div>
                    <span
                      className="fw-bold"
                      style={{ color: "#00cc66", fontSize: "1rem" }}
                    >
                      ${(item.precio * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}

                <hr className="border-primary" />
                <h4
                  className="text-end mt-3 fw-bold"
                  style={{ color: "#00cc66", fontSize: "1.5rem" }}
                >
                  Total: ${total.toLocaleString()}
                </h4>
              </div>
            </div>
          </div>

          {/* 📦 Formulario */}
          <div className="col-12 col-md-6">
            <form
              className="p-4 rounded h-100"
              onSubmit={handleConfirmar}
              style={{
                backgroundColor: "#101820",
                border: "1px solid #00b4d8",
                boxShadow: "0 0 10px rgba(0,180,216,0.25)",
              }}
            >
              <h5
                className="mb-4 fw-bold"
                style={{ color: "#00b4d8", letterSpacing: "0.5px" }}
              >
                Datos de envío
              </h5>

              <div className="mb-3">
                <label className="form-label text-white">Dirección</label>
                <input
                  type="text"
                  name="direccion_envio"
                  className="form-control bg-dark text-white border-secondary"
                  value={form.direccion_envio}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-white">Teléfono</label>
                <input
                  type="text"
                  name="telefono_contacto"
                  className="form-control bg-dark text-white border-secondary"
                  value={form.telefono_contacto}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-white">Comentarios</label>
                <textarea
                  name="comentarios"
                  className="form-control bg-dark text-white border-secondary"
                  rows={3}
                  value={form.comentarios}
                  onChange={onChange}
                ></textarea>
              </div>

              {errorMsg && (
                <div className="alert alert-danger py-2 text-center">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="btn w-100 mt-3 fw-semibold py-2"
                style={{
                  backgroundColor: "#00b4d8",
                  color: "#fff",
                  border: "none",
                }}
                disabled={loading}
              >
                {loading ? "Procesando..." : "Confirmar compra"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </SeccionBase>
  );
}
