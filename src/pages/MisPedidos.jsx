import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Accordion, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SeccionBase from '../components/SeccionBase';
import { listUserOrders, listOrderItems, getProduct } from '../api/xano';

export default function MisPedidos() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && token) {
      loadUserOrders();
    }
  }, [user, token]);

  const loadUserOrders = async () => {
    setLoading(true);
    try {
      // Derivar userId de forma robusta
      const decodeJwt = (t) => {
        if (!t) return null;
        try {
          const parts = t.split('.');
          if (parts.length < 2) return null;
          let payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const pad = payload.length % 4;
          if (pad) payload += '='.repeat(4 - pad);
          return JSON.parse(atob(payload));
        } catch {
          return null;
        }
      };

      const payload = decodeJwt(token);
      const uid = user?.id ?? user?.user_id ?? payload?.user_id ?? payload?.id ?? payload?.sub;
      if (!uid) throw new Error('No se pudo determinar el usuario autenticado');
      const baseOrders = await listUserOrders(token, uid);
      const ordersArray = Array.isArray(baseOrders) ? baseOrders : [];

      // Enriquecer con items y productos para mostrar detalle
      const enriched = await Promise.all(
        ordersArray.map(async (order) => {
          try {
            const items = await listOrderItems(token, order.id);
            const detailedItems = await Promise.all(
              items.map(async (it) => {
                try {
                  const prod = await getProduct(token, it.product_id);
                  
                  // Construir URL de imagen correctamente
                  let imagen = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
                  if (Array.isArray(prod?.imagenes) && prod.imagenes.length > 0) {
                    const imgData = prod.imagenes[0];
                    if (imgData?.url) {
                      imagen = imgData.url;
                    } else if (imgData?.path) {
                      const BASE = "https://x8ki-letl-twmt.n7.xano.io";
                      imagen = `${BASE}${imgData.path.startsWith("/") ? "" : "/"}${imgData.path}`;
                    } else if (typeof imgData === 'string') {
                      if (imgData.startsWith('http')) {
                        imagen = imgData;
                      } else {
                        const BASE = "https://x8ki-letl-twmt.n7.xano.io";
                        imagen = `${BASE}${imgData.startsWith("/") ? "" : "/"}${imgData}`;
                      }
                    }
                  }
                  
                  return {
                    nombre: prod?.nombre ?? `Producto #${it.product_id}`,
                    precio: Number(it.precio_unitario ?? prod?.precio ?? 0),
                    cantidad: Number(it.cantidad ?? 0),
                    imagen,
                  };
                } catch {
                  return {
                    nombre: `Producto #${it.product_id}`,
                    precio: Number(it.precio_unitario ?? 0),
                    cantidad: Number(it.cantidad ?? 0),
                    imagen: 'https://via.placeholder.com/300x200?text=Sin+Imagen',
                  };
                }
              })
            );
            return { ...order, items: detailedItems };
          } catch {
            return { ...order, items: [] };
          }
        })
      );

      setOrders(enriched);
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      setError('No se pudieron cargar tus pedidos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Obtener color de badge según estado
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pendiente':
        return <Badge bg="warning" text="dark">Pendiente</Badge>;
      case 'aprobado':
        return <Badge bg="success">Aprobado</Badge>;
      case 'enviado':
        return <Badge bg="info">Enviado</Badge>;
      case 'entregado':
        return <Badge bg="primary">Entregado</Badge>;
      case 'rechazado':
        return <Badge bg="danger">Rechazado</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Obtener mensaje según estado
  const getStatusMessage = (status) => {
    switch (status) {
      case 'pendiente':
        return 'Tu pedido está siendo revisado por nuestro equipo.';
      case 'aprobado':
        return 'Tu pedido ha sido aprobado y está siendo preparado.';
      case 'enviado':
        return 'Tu pedido está en camino. ¡Pronto llegará a tu dirección!';
      case 'entregado':
        return 'Tu pedido ha sido entregado. ¡Gracias por tu compra!';
      case 'rechazado':
        return 'Lo sentimos, tu pedido ha sido rechazado. Contacta con soporte para más información.';
      default:
        return 'Estado de pedido desconocido.';
    }
  };

  return (
    <SeccionBase>
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="mb-3">Mis Pedidos</h1>
            <p className="text-muted">
              Consulta el estado de tus pedidos y su historial.
            </p>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Cargando tus pedidos...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : orders.length === 0 ? (
          <Card className="text-center p-5">
            <Card.Body>
              <h4>No tienes pedidos realizados</h4>
              <p className="text-muted">Cuando realices una compra, podrás ver el seguimiento aquí.</p>
              <Button as={Link} to="/" variant="primary" className="mt-3">
                Ir a comprar
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Accordion defaultActiveKey="0">
            {orders.map((order, index) => (
              <Accordion.Item key={order.id} eventKey={index.toString()}>
                <Accordion.Header>
                  <div className="d-flex justify-content-between align-items-center w-100 me-3">
                    <span><strong>Pedido #{order.id.toString().padStart(4, '0')}</strong> - {formatDate(order.fecha)}</span>
                    <div>
                      {getStatusBadge(order.estado)}
                      <span className="ms-3">${order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col md={8}>
                      <h5>Productos</h5>
                      <div className="mb-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="d-flex align-items-center mb-2 border-bottom pb-2">
                            <div 
                              className="me-3" 
                              style={{
                                width: '60px',
                                height: '60px',
                                backgroundImage: `url(${item.imagen})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: '4px'
                              }}
                            />
                            <div className="flex-grow-1">
                              <div>{item.nombre}</div>
                              <div className="text-muted">
                                {item.cantidad} x ${item.precio.toLocaleString()}
                              </div>
                            </div>
                            <div className="fw-bold">
                              ${(item.cantidad * item.precio).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <h5>Estado del pedido</h5>
                      <Alert variant={
                        order.estado === 'pendiente' ? 'warning' :
                        order.estado === 'aprobado' ? 'success' :
                        order.estado === 'enviado' ? 'info' :
                        order.estado === 'entregado' ? 'primary' :
                        'danger'
                      }>
                        {getStatusMessage(order.estado)}
                      </Alert>
                      
                      {order.comentarios_admin && (
                        <div className="mb-3">
                          <h6>Comentarios:</h6>
                          <p className="fst-italic">"{order.comentarios_admin}"</p>
                        </div>
                      )}
                    </Col>
                    
                    <Col md={4}>
                      <Card bg="light" className="mb-3">
                        <Card.Header>Resumen</Card.Header>
                        <Card.Body>
                          <p><strong>Total:</strong> ${order.total.toLocaleString()}</p>
                          <p><strong>Método de pago:</strong> {order.metodo_pago}</p>
                          <p><strong>Fecha:</strong> {formatDate(order.fecha)}</p>
                        </Card.Body>
                      </Card>
                      
                      <Card bg="light">
                        <Card.Header>Datos de envío</Card.Header>
                        <Card.Body>
                          <p><strong>Nombre:</strong> {order.datos_envio?.nombre_completo || order.nombre_completo || '—'}</p>
                          <p><strong>Dirección:</strong> {order.datos_envio?.direccion_envio || order.direccion_envio || '—'}</p>
                          <p><strong>Ciudad:</strong> {order.datos_envio?.ciudad || order.ciudad || '—'}</p>
                          <p><strong>Código postal:</strong> {order.datos_envio?.codigo_postal || order.codigo_postal || '—'}</p>
                          <p><strong>Teléfono:</strong> {order.datos_envio?.telefono_contacto || order.telefono_contacto || '—'}</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </Container>
    </SeccionBase>
  );
}