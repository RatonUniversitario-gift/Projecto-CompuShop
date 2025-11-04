// src/pages/Checkout.jsx
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { createOrderFromItems } from "../api/xano.js";
import SeccionBase from "../components/SeccionBase.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre_completo: "",
    direccion_envio: "",
    ciudad: "",
    codigo_postal: "",
    telefono_contacto: "",
    email: "",
    metodo_pago: "tarjeta",
    comentarios: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Prellenar datos del usuario si está disponible
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        nombre_completo: user.nombre || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const total = cart.reduce(
    (s, p) => s + (p.precio || 0) * (p.quantity || 1),
    0
  );

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Validación de formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.nombre_completo.trim()) 
      newErrors.nombre_completo = "El nombre es obligatorio";
    
    if (!form.direccion_envio.trim()) 
      newErrors.direccion_envio = "La dirección es obligatoria";
    
    if (!form.ciudad.trim()) 
      newErrors.ciudad = "La ciudad es obligatoria";
    
    if (!form.codigo_postal.trim()) 
      newErrors.codigo_postal = "El código postal es obligatorio";
    else if (!/^\d{4,5}$/.test(form.codigo_postal))
      newErrors.codigo_postal = "Formato de código postal inválido";
    
    if (!form.telefono_contacto.trim()) 
      newErrors.telefono_contacto = "El teléfono es obligatorio";
    else if (!/^\d{9,10}$/.test(form.telefono_contacto))
      newErrors.telefono_contacto = "Formato de teléfono inválido";
    
    if (!form.email.trim()) 
      newErrors.email = "El email es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Formato de email inválido";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

    // Validar formulario
    if (!validateForm()) {
      setErrorMsg("Por favor completa correctamente todos los campos requeridos.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // Validación adicional de token
      if (!token) {
        setErrorMsg("Sesión no válida. Vuelve a iniciar sesión.");
        navigate("/login");
        return;
      }

      // Crear orden real en Xano desde el carrito local
      const order = await createOrderFromItems(token, {
        user_id: user.id,
        items: cart,
        estado: "pendiente",
        fecha: new Date().toISOString(),
        direccion_envio: form.direccion_envio,
        telefono_contacto: form.telefono_contacto,
      });

      // Guardar un resumen para la pantalla de confirmado y el id de la orden
      const resumen = {
        id: order.id,
        items: cart.map((i) => ({ id: i.id, nombre: i.nombre, precio: i.precio, cantidad: i.quantity })),
        total,
        envio: {
          nombre: form.nombre_completo,
          direccion: form.direccion_envio,
          ciudad: form.ciudad,
          estado: "",
          codigoPostal: form.codigo_postal,
          telefono: form.telefono_contacto,
        },
        pago: { tipo: form.metodo_pago },
        costoEnvio: 0,
      };
      localStorage.setItem("ultimoPedido", JSON.stringify(resumen));
      localStorage.setItem("ultimoPedidoId", String(order.id));

      // Redirigir ANTES de limpiar carrito
      navigate("/checkout-confirmado");

      // limpiar carrito (después de redirección)
      setTimeout(() => clearCart(), 300);
    } catch (err) {
      console.error("Error al procesar compra:", err);
      setErrorMsg("❌ Ocurrió un error al procesar la compra. Por favor intenta nuevamente.");
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
        {errorMsg && (
          <Alert variant="danger" className="mb-4">
            {errorMsg}
          </Alert>
        )}
        
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
            <Form
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

              <Form.Group className="mb-3">
                <Form.Label>Nombre completo</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre_completo"
                  className={`bg-dark text-white border-secondary ${errors.nombre_completo ? 'is-invalid' : ''}`}
                  value={form.nombre_completo}
                  onChange={onChange}
                />
                {errors.nombre_completo && (
                  <Form.Text className="text-danger">
                    {errors.nombre_completo}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  className={`bg-dark text-white border-secondary ${errors.email ? 'is-invalid' : ''}`}
                  value={form.email}
                  onChange={onChange}
                />
                {errors.email && (
                  <Form.Text className="text-danger">
                    {errors.email}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  name="direccion_envio"
                  className={`bg-dark text-white border-secondary ${errors.direccion_envio ? 'is-invalid' : ''}`}
                  value={form.direccion_envio}
                  onChange={onChange}
                />
                {errors.direccion_envio && (
                  <Form.Text className="text-danger">
                    {errors.direccion_envio}
                  </Form.Text>
                )}
              </Form.Group>

              <div className="row">
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    type="text"
                    name="ciudad"
                    className={`bg-dark text-white border-secondary ${errors.ciudad ? 'is-invalid' : ''}`}
                    value={form.ciudad}
                    onChange={onChange}
                  />
                  {errors.ciudad && (
                    <Form.Text className="text-danger">
                      {errors.ciudad}
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>Código Postal</Form.Label>
                  <Form.Control
                    type="text"
                    name="codigo_postal"
                    className={`bg-dark text-white border-secondary ${errors.codigo_postal ? 'is-invalid' : ''}`}
                    value={form.codigo_postal}
                    onChange={onChange}
                  />
                  {errors.codigo_postal && (
                    <Form.Text className="text-danger">
                      {errors.codigo_postal}
                    </Form.Text>
                  )}
                </Form.Group>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono_contacto"
                  className={`bg-dark text-white border-secondary ${errors.telefono_contacto ? 'is-invalid' : ''}`}
                  value={form.telefono_contacto}
                  onChange={onChange}
                  required
                />
                {errors.telefono_contacto && (
                  <Form.Text className="text-danger">
                    {errors.telefono_contacto}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Método de pago</Form.Label>
                <Form.Select 
                  name="metodo_pago"
                  className="bg-dark text-white border-secondary"
                  value={form.metodo_pago}
                  onChange={onChange}
                >
                  <option value="tarjeta">Tarjeta de crédito/débito</option>
                  <option value="transferencia">Transferencia bancaria</option>
                  <option value="paypal">PayPal</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Comentarios (opcional)</Form.Label>
                <Form.Control
                  as="textarea"
                  name="comentarios"
                  className="bg-dark text-white border-secondary"
                  value={form.comentarios}
                  onChange={onChange}
                  rows="3"
                />
              </Form.Group>

              <div className="d-grid gap-2 mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Procesando...
                    </>
                  ) : (
                    "Confirmar compra"
                  )}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </SeccionBase>
  );
}
