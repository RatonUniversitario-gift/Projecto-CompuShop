import { useCart } from "../context/CartContext.jsx";
import SeccionBase from "../components/SeccionBase.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Carrito() {
  const { cart, increment, decrement, removeFromCart, clearCart } = useCart();
  const total = cart.reduce(
    (s, p) => s + (p.precio || 0) * (p.quantity || 1),
    0
  );

  const navigate = useNavigate();
  const [compraRealizada, setCompraRealizada] = useState(false);

  // 🛒 Si el carrito está vacío
  if (!cart || cart.length === 0) {
    return (
      <SeccionBase titulo="Tu carrito está vacío 😢">
        <div className="text-center">
          <p className="text-secondary mb-4">
            Aún no has agregado productos a tu carrito.
          </p>
          <Link to="/productos" className="btn btn-morado btn-lg shadow-sm px-4">
            Ir al catálogo
          </Link>
        </div>
      </SeccionBase>
    );
  }

  // ✨ Imagen segura desde Xano
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

  // ✅ Acción de compra
  const handleCompra = () => {
    setCompraRealizada(true);
    clearCart();
    setTimeout(() => navigate("/"), 2500); // redirigir después de 2.5s
  };

  return (
    <SeccionBase titulo="Tu Carrito de Compras">
      <div className="container text-light py-3">
        {/* 💚 Modal de confirmación */}
        {compraRealizada && (
          <div className="compra-modal fade-in">
            <div className="modal-content bg-dark text-white text-center p-4 rounded-4 border border-success shadow-lg">
              <i className="bi bi-check-circle-fill text-success display-3 mb-3"></i>
              <h4 className="fw-bold mb-2">¡Compra realizada con éxito!</h4>
              <p className="text-secondary mb-0">
                Serás redirigido al inicio en unos segundos...
              </p>
            </div>
          </div>
        )}

        <div className="table-responsive">
          <table className="table align-middle text-white">
            <thead>
              <tr className="text-primary border-bottom border-primary">
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
                    className="align-middle border-bottom border-secondary"
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
                            background: "#0b0c10",
                            borderRadius: 10,
                            boxShadow: "0 0 12px rgba(0,180,216,0.4)",
                          }}
                        />
                        <div>
                          <h6 className="mb-1 fw-bold">{item.nombre}</h6>
                          <small className="text-secondary">
                            {item.marca || "TechNova"} |{" "}
                            <span className="text-success fw-semibold">
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
                          className="btn btn-outline-light btn-sm rounded-circle px-2"
                          onClick={() => decrement(item.id)}
                        >
                          <i className="bi bi-dash-lg"></i>
                        </button>
                        <span className="badge bg-secondary fs-6 px-3">
                          {item.quantity || 1}
                        </span>
                        <button
                          className="btn btn-outline-light btn-sm rounded-circle px-2"
                          onClick={() => increment(item.id)}
                        >
                          <i className="bi bi-plus-lg"></i>
                        </button>
                      </div>
                    </td>

                    {/* 💰 Precio y Subtotal */}
                    <td className="text-center text-success fw-bold">
                      ${Number(item.precio).toLocaleString()}
                    </td>
                    <td className="text-center text-success fw-bold">
                      ${subtotal.toLocaleString()}
                    </td>

                    {/* 🗑 Quitar */}
                    <td className="text-center">
                      <button
                        className="btn btn-rojo btn-sm"
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
            className="btn btn-detalle px-4 fw-semibold"
            onClick={clearCart}
          >
            Vaciar carrito
          </button>

          <h4 className="mb-0 fw-bold text-white">
            Total:{" "}
            <span className="text-white text-glow fs-3">
              ${total.toLocaleString()}
            </span>
          </h4>
        </div>

        <div className="text-end mt-4">
          <button
            className="btn btn-verde btn-lg px-5 shadow-lg"
            onClick={handleCompra}
          >
            <i className="bi bi-bag-check me-2"></i>Realizar compra
          </button>
        </div>
      </div>
    </SeccionBase>
  );
}
