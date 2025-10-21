// src/pages/CheckoutConfirmado.jsx
import SeccionBase from "../components/SeccionBase.jsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CheckoutConfirmado() {
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    // Recuperar último pedido del localStorage (si se guardó antes de limpiar carrito)
    const savedOrder = localStorage.getItem("ultimoPedido");
    if (savedOrder) {
      setPedido(JSON.parse(savedOrder));
    }
  }, []);

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

  return (
    <SeccionBase titulo="¡Compra realizada con éxito! 🎉">
      <div
        className="d-flex flex-column align-items-center text-center"
        style={{
          minHeight: "70vh",
          backgroundColor: "#101820",
          borderRadius: "10px",
          padding: "3rem 1.5rem",
          boxShadow: "0 0 15px rgba(0,180,216,0.2)",
        }}
      >
        <i
          className="bi bi-bag-check-fill mb-4"
          style={{ color: "#00CC66", fontSize: "4rem" }}
        ></i>

        <h3
          className="fw-bold mb-3"
          style={{ color: "#FFFFFF", letterSpacing: "0.5px" }}
        >
          ¡Gracias por tu compra!
        </h3>

        <p
          className="mb-4"
          style={{
            color: "rgba(255,255,255,0.85)",
            maxWidth: "600px",
            lineHeight: "1.6",
          }}
        >
          Tu pedido ha sido confirmado exitosamente.  
          A continuación encontrarás el detalle de tu orden:
        </p>

        {/* 🧾 Detalle del pedido */}
        <div
          className="p-4 my-3 text-start"
          style={{
            backgroundColor: "#0b0c10",
            border: "1px solid #00b4d8",
            borderRadius: "10px",
            color: "#fff",
            width: "100%",
            maxWidth: "600px",
            boxShadow: "0 0 12px rgba(0,180,216,0.25)",
          }}
        >
          {pedido && pedido.items?.length > 0 ? (
            <>
              {pedido.items.map((item) => (
                <div
                  key={item.id}
                  className="d-flex align-items-center justify-content-between border-bottom border-secondary py-2"
                >
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={getImage(item)}
                      alt={item.nombre}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        objectFit: "contain",
                        backgroundColor: "#101820",
                      }}
                    />
                    <div>
                      <strong style={{ color: "#fff" }}>{item.nombre}</strong>
                      <div style={{ color: "#bbb", fontSize: "0.9rem" }}>
                        {item.quantity} x ${item.precio.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <span
                    className="fw-bold"
                    style={{ color: "#00CC66", fontSize: "1rem" }}
                  >
                    ${(item.precio * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}

              <hr className="border-primary" />
              <div className="d-flex justify-content-between">
                <span>Fecha:</span>
                <strong style={{ color: "#00CC66" }}>
                  {new Date().toLocaleDateString("es-CL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </strong>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>Total pagado:</span>
                <strong style={{ color: "#00CC66", fontSize: "1.2rem" }}>
                  ${pedido.total?.toLocaleString()}
                </strong>
              </div>
            </>
          ) : (
            <p className="text-center text-secondary mb-0">
              No hay información del pedido reciente.
            </p>
          )}
        </div>

        {/* 🔵 Botón principal */}
        <Link
          to="/productos"
          className="btn fw-semibold mt-4 px-5 py-2 shadow-lg"
          style={{
            backgroundColor: "#00B4D8",
            color: "#FFFFFF",
            border: "none",
            fontSize: "1.1rem",
            letterSpacing: "0.3px",
          }}
        >
          <i className="bi bi-shop me-2"></i>Seguir comprando
        </Link>
      </div>
    </SeccionBase>
  );
}
