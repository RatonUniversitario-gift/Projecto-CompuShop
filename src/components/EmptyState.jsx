import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default function EmptyState({ 
  title = "No hay datos disponibles", 
  message = "No se encontraron elementos para mostrar.", 
  icon = "bi-inbox", 
  actionText = null,
  onAction = null 
}) {
  return (
    <Container className="text-center py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="empty-state p-4">
            <i className={`bi ${icon} display-1 text-muted mb-3`}></i>
            <h3 className="mb-3">{title}</h3>
            <p className="text-muted mb-4">{message}</p>
            {actionText && onAction && (
              <Button variant="primary" onClick={onAction}>
                {actionText}
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}