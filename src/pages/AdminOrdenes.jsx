import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import OrdersTable from '../components/OrdersTable';
import { useAuth } from '../context/AuthContext';
import { listOrders, updateOrderStatus } from '../api/xano';

export default function AdminOrdenes() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar órdenes al montar el componente
  useEffect(() => {
    loadOrders();
  }, []);

  // Función para cargar órdenes desde API real
  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listOrders({ token, limit: 200 });
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      setError('No se pudieron cargar las órdenes. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // (Eliminado) Actualización local con simulación. Usamos la API real abajo.

  // Actualizar estado de una orden usando API real
  const handleUpdateOrderStatus = async (orderId, newStatus, comments) => {
    try {
      const updated = await updateOrderStatus(token, orderId, newStatus, comments);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, estado: updated.estado, comentarios_admin: updated.comentarios ?? o.comentarios_admin } : o)));
    } catch (err) {
      console.error('Error al actualizar estado de orden:', err);
      setError('No se pudo actualizar el estado de la orden.');
    }
  };

  return (
    <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="mb-3">Gestión de Órdenes</h1>
            <p className="text-muted">
              Administre las órdenes de los clientes, actualice estados y gestione envíos.
            </p>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Cargando órdenes...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Card bg="dark" text="white">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Órdenes ({orders.length})</h5>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <OrdersTable 
                orders={orders} 
                onUpdateStatus={handleUpdateOrderStatus} 
              />
            </Card.Body>
          </Card>
        )}
    </Container>
  );
}