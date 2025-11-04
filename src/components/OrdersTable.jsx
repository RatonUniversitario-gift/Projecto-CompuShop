import { useState } from 'react';
import { Table, Badge, Button, Spinner, Modal, Form } from 'react-bootstrap';

export default function OrdersTable({ orders = [], onUpdateStatus }) {
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [comments, setComments] = useState('');

  // Manejadores para el modal
  const handleClose = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setStatusUpdate('');
    setComments('');
  };

  const handleShow = (order, initialStatus) => {
    setSelectedOrder(order);
    setStatusUpdate(initialStatus || '');
    setShowModal(true);
  };

  // Actualizar estado de orden
  const handleUpdateStatus = async () => {
    if (!selectedOrder || !statusUpdate) return;
    
    setLoading(true);
    try {
      // Llamada real delegada al padre
      await Promise.resolve(onUpdateStatus(selectedOrder.id, statusUpdate, comments));
      
      handleClose();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
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

  return (
    <>
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No hay órdenes disponibles</p>
        </div>
      ) : (
        <Table responsive hover variant="dark" className="align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id.toString().padStart(4, '0')}</td>
                <td>
                  {order.datos_envio?.nombre_completo 
                    || (order.user?.name ? order.user.name : null)
                    || (order.user_id ? `Usuario #${order.user_id}` : 'Cliente')}
                </td>
                <td>{formatDate(order.fecha)}</td>
                <td>${order.total?.toLocaleString()}</td>
                <td>{getStatusBadge(order.estado)}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline-primary"
                      onClick={() => handleShow(order, 'aprobado')}
                      disabled={order.estado === 'aprobado' || order.estado === 'enviado' || order.estado === 'entregado' || order.estado === 'rechazado'}
                    >
                      Aprobar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline-info"
                      onClick={() => handleShow(order, 'enviado')}
                      disabled={order.estado === 'enviado' || order.estado === 'entregado' || order.estado === 'rechazado' || order.estado === 'pendiente'}
                    >
                      Enviar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline-danger"
                      onClick={() => handleShow(order, 'rechazado')}
                      disabled={order.estado === 'rechazado' || order.estado === 'enviado' || order.estado === 'entregado'}
                    >
                      Rechazar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal para actualizar estado */}
      <Modal show={showModal} onHide={handleClose} centered backdrop="static" className="text-dark">
        <Modal.Header closeButton>
          <Modal.Title>
            {statusUpdate === 'aprobado' && 'Aprobar Orden'}
            {statusUpdate === 'enviado' && 'Marcar como Enviado'}
            {statusUpdate === 'rechazado' && 'Rechazar Orden'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p><strong>Orden:</strong> #{selectedOrder.id.toString().padStart(4, '0')}</p>
              <p><strong>Cliente:</strong> {selectedOrder.datos_envio?.nombre_completo 
                || (selectedOrder.user?.name ? selectedOrder.user.name : null)
                || (selectedOrder.user_id ? `Usuario #${selectedOrder.user_id}` : 'Cliente')}</p>
              <p><strong>Total:</strong> ${selectedOrder.total?.toLocaleString()}</p>
              
              <Form.Group className="mb-3">
                <Form.Label>Comentarios (opcional)</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </Form.Group>
              
              {statusUpdate === 'rechazado' && (
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Esta acción rechazará la orden y no podrá ser revertida.
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            variant={
              statusUpdate === 'aprobado' ? 'success' : 
              statusUpdate === 'enviado' ? 'info' : 
              'danger'
            } 
            onClick={handleUpdateStatus}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Procesando...
              </>
            ) : (
              <>
                {statusUpdate === 'aprobado' && 'Confirmar Aprobación'}
                {statusUpdate === 'enviado' && 'Confirmar Envío'}
                {statusUpdate === 'rechazado' && 'Confirmar Rechazo'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}