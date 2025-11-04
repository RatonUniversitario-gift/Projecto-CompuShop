// src/pages/CheckoutConfirmado.jsx
import SeccionBase from "../components/SeccionBase.jsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Alert, Button, Card, Badge, Spinner } from "react-bootstrap";

export default function CheckoutConfirmado() {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedOrder = localStorage.getItem("ultimoPedido");
    if (savedOrder) {
      setPedido(JSON.parse(savedOrder));
    }
    setTimeout(() => setLoading(false), 800);
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

  const orderNumber = pedido ? `ORD-${Math.floor(100000 + Math.random() * 900000)}` : '';

  if (loading) {
    return (
      <SeccionBase titulo="Procesando tu pedido">
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
          <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
          <p className="mt-3 text-white">Estamos procesando tu pedido...</p>
        </div>
      </SeccionBase>
    );
  }

  if (!pedido) {
    return (
      <SeccionBase titulo="No se encontró información del pedido">
        <Alert variant="danger" className="my-4">
          No se encontró información del pedido. Por favor, intenta realizar la compra nuevamente.
        </Alert>
        <div className="text-center mt-4">
          <Link to="/carrito">
            <Button variant="primary">Volver al carrito</Button>
          </Link>
        </div>
      </SeccionBase>
    );
  }

  return (
    <SeccionBase titulo="¡Compra realizada con éxito! 🎉">
      <div
        className="container py-4"
        style={{
          backgroundColor: "#101820",
          borderRadius: "10px",
          padding: "2rem",
          boxShadow: "0 0 15px rgba(0,180,216,0.2)",
        }}
      >
        <div className="text-center mb-4">
          <i className="bi bi-bag-check-fill mb-3" style={{ color: "#00CC66", fontSize: "4rem" }}></i>
          <h3 className="fw-bold mb-3 text-white">¡Gracias por tu compra!</h3>
          <p className="text-white mb-4">
            Tu pedido ha sido recibido y está siendo procesado.
            <br />
            Te enviaremos actualizaciones sobre el estado de tu pedido.
          </p>
          <div className="d-flex justify-content-center mb-4">
            <Badge bg="info" className="fs-6 px-3 py-2">
              Número de orden: {orderNumber}
            </Badge>
          </div>
        </div>

        <Card className="mb-4" bg="dark" text="white" border="primary">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Detalles del Pedido</h5>
          </Card.Header>
          <Card.Body>
            <div className="row">
              <div className="col-md-6 mb-3">
                <h6 className="text-muted">Información de Envío</h6>
                <p className="mb-1">{pedido.envio?.nombre}</p>
                <p className="mb-1">{pedido.envio?.direccion}</p>
                <p className="mb-1">
                  {pedido.envio?.ciudad}, {pedido.envio?.estado} {pedido.envio?.codigoPostal}
                </p>
                <p className="mb-0">{pedido.envio?.telefono}</p>
              </div>
              <div className="col-md-6 mb-3">
                <h6 className="text-muted">Método de Pago</h6>
                <p className="mb-1">
                  {pedido.pago?.tipo === "tarjeta" ? "Tarjeta de crédito" : "Transferencia bancaria"}
                </p>
                {pedido.pago?.tipo === "tarjeta" && (
                  <p className="mb-0">**** **** **** {pedido.pago?.numeroTarjeta?.slice(-4)}</p>
                )}
              </div>
            </div>

            <h6 className="border-bottom border-secondary pb-2 mb-3 text-muted">Productos</h6>
            {pedido.items?.map((item) => (
              <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center">
                  <img
                    src={getImage(item)}
                    alt={item.nombre}
                    style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "10px", borderRadius: "4px" }}
                  />
                  <div>
                    <p className="mb-0 fw-bold">{item.nombre}</p>
                    <small className="text-muted">Cantidad: {item.cantidad}</small>
                  </div>
                </div>
                <span>${item.precio * item.cantidad}</span>
              </div>
            ))}

            <div className="border-top border-secondary mt-3 pt-3">
              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span>
                  $
                  {(pedido.items
                    ?.reduce((total, item) => total + (parseFloat(item.precio) || 0) * (parseInt(item.cantidad) || 0), 0) || 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Envío</span>
                <span>${(parseFloat(pedido.costoEnvio) || 0).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold mt-2">
                <span>Total</span>
                <span>
                  $
                  {(
                    (pedido.items
                      ?.reduce((total, item) => total + (parseFloat(item.precio) || 0) * (parseInt(item.cantidad) || 0), 0) || 0)
                    + (parseFloat(pedido.costoEnvio) || 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>

        <div className="text-center mt-4">
          <p className="text-white mb-4">Recibirás un correo electrónico con la confirmación de tu pedido.</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/">
              <Button variant="outline-light">Seguir comprando</Button>
            </Link>
            <Link to="/mis-pedidos">
              <Button variant="primary">Ver mis pedidos</Button>
            </Link>
          </div>
        </div>
      </div>
    </SeccionBase>
  );
}
