import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

export default function LoadingSpinner({ 
  size = 'md', 
  message = 'Cargando...', 
  fullscreen = false,
  variant = 'primary'
}) {
  const spinnerSize = size === 'sm' ? '' : (size === 'lg' ? 'spinner-grow-lg' : '');
  
  if (fullscreen) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" style={{ zIndex: 1050 }}>
        <div className="text-center">
          <Spinner animation="border" role="status" variant={variant} className={spinnerSize}>
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          {message && <p className="mt-3">{message}</p>}
        </div>
      </div>
    );
  }
  
  return (
    <Container className="text-center py-4">
      <Spinner animation="border" role="status" variant={variant} className={spinnerSize}>
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
      {message && <p className="mt-3">{message}</p>}
    </Container>
  );
}