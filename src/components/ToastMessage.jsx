import { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

export default function ToastMessage({ show, message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  const getBgColor = () => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'light';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return 'bi bi-check-circle-fill';
      case 'error': return 'bi bi-exclamation-circle-fill';
      case 'warning': return 'bi bi-exclamation-triangle-fill';
      case 'info': return 'bi bi-info-circle-fill';
      default: return 'bi bi-bell-fill';
    }
  };

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1060 }}>
      <Toast 
        show={visible} 
        onClose={() => {
          setVisible(false);
          if (onClose) onClose();
        }} 
        delay={5000} 
        autohide 
        bg={getBgColor()}
      >
        <Toast.Header closeButton>
          <i className={`${getIcon()} me-2`}></i>
          <strong className="me-auto">
            {type === 'success' && 'Éxito'}
            {type === 'error' && 'Error'}
            {type === 'warning' && 'Advertencia'}
            {type === 'info' && 'Información'}
          </strong>
        </Toast.Header>
        <Toast.Body className={type === 'warning' ? 'text-dark' : 'text-white'}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}