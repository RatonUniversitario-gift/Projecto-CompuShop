import React from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';

export default function ErrorState({ 
  title = "Ha ocurrido un error", 
  message = "No se pudo completar la operación solicitada.", 
  error = null,
  actionText = "Reintentar",
  onAction = null 
}) {
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Alert variant="danger">
            <div className="text-center mb-3">
              <i className="bi bi-exclamation-triangle-fill display-4"></i>
            </div>
            <h4 className="alert-heading text-center">{title}</h4>
            <p className="mb-3">{message}</p>
            
            {error && (
              <div className="bg-light p-2 rounded mb-3 small">
                <code className="d-block text-danger">{typeof error === 'object' ? JSON.stringify(error, null, 2) : error}</code>
              </div>
            )}
            
            {onAction && (
              <div className="text-center mt-3">
                <Button variant="outline-danger" onClick={onAction}>
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  {actionText}
                </Button>
              </div>
            )}
          </Alert>
        </Col>
      </Row>
    </Container>
  );
}