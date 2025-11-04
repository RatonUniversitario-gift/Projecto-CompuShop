import { createContext, useContext, useState } from 'react';
import ToastMessage from '../components/ToastMessage';

const MessageContext = createContext();

export function useMessage() {
  return useContext(MessageContext);
}

export function MessageProvider({ children }) {
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // Mostrar mensaje toast
  const showToast = (message, type = 'success') => {
    setToast({
      show: true,
      message,
      type
    });
  };

  // Ocultar mensaje toast
  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      show: false
    }));
  };

  // Funciones de ayuda para diferentes tipos de mensajes
  const showSuccess = (message) => showToast(message, 'success');
  const showError = (message) => showToast(message, 'error');
  const showWarning = (message) => showToast(message, 'warning');
  const showInfo = (message) => showToast(message, 'info');

  return (
    <MessageContext.Provider value={{
      showToast,
      hideToast,
      showSuccess,
      showError,
      showWarning,
      showInfo
    }}>
      {children}
      <ToastMessage
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </MessageContext.Provider>
  );
}