import { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Modal, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getAllUsers } from '../api/xano.js';

export default function AdminUsers() {
  const { user, toggleUserBlock } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Usar la función getAllUsers de xano.js
      const data = await getAllUsers(user?.token);
      
      // Transformar los datos si es necesario
      const usersData = Array.isArray(data) ? data.map(u => ({
        id: u.id,
        nombre: u.nombre || '',
        apellido: u.apellido || '',
        email: u.email || '',
        role: u.rol || 'user',
        blocked: u.bloqueado || false,
        createdAt: u.created_at || new Date().toISOString()
      })) : [];
      
      setUsers(usersData);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('No se pudieron cargar los usuarios desde la API. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = (selectedUser) => {
    setSelectedUser(selectedUser);
    setShowModal(true);
  };

  const confirmToggleBlock = async () => {
    if (!selectedUser) return;
    
    setActionLoading(true);
    try {
      const success = await toggleUserBlock(selectedUser.id, !selectedUser.blocked);
      
      if (success) {
        // Actualizar la lista local
        setUsers(users.map(u => {
          if (u.id === selectedUser.id) {
            return { ...u, blocked: !u.blocked };
          }
          return u;
        }));
        
        setActionSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          setSelectedUser(null);
          setActionSuccess(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <Container fluid className="py-4">
        <h1 className="mb-4">Gestión de Usuarios</h1>
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Cargando usuarios...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table responsive hover striped>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className={u.blocked ? 'table-danger' : ''}>
                  <td>{u.id}</td>
                  <td>{u.nombre} {u.apellido}</td>
                  <td>{u.email}</td>
                  <td>
                    <Badge bg={u.role === 'admin' ? 'primary' : 'secondary'}>
                      {u.role === 'admin' ? 'Admin' : 'Cliente'}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={u.blocked ? 'danger' : 'success'}>
                      {u.blocked ? 'Bloqueado' : 'Activo'}
                    </Badge>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button 
                      size="sm" 
                      variant={u.blocked ? 'outline-success' : 'outline-danger'}
                      onClick={() => handleToggleBlock(u)}
                      disabled={u.id === user?.id} // No permitir bloquear al usuario actual
                    >
                      {u.blocked ? 'Desbloquear' : 'Bloquear'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={() => !actionLoading && setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedUser?.blocked ? 'Desbloquear Usuario' : 'Bloquear Usuario'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {actionSuccess ? (
            <Alert variant="success">
              ¡Usuario {selectedUser?.blocked ? 'desbloqueado' : 'bloqueado'} correctamente!
            </Alert>
          ) : (
            <>
              <p>¿Estás seguro que deseas {selectedUser?.blocked ? 'desbloquear' : 'bloquear'} al usuario?</p>
              <p><strong>Usuario:</strong> {selectedUser?.nombre} {selectedUser?.apellido}</p>
              <p><strong>Email:</strong> {selectedUser?.email}</p>
              
              {!selectedUser?.blocked && (
                <Alert variant="warning">
                  El usuario no podrá iniciar sesión mientras esté bloqueado.
                </Alert>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!actionSuccess && (
            <>
              <Button 
                variant="secondary" 
                onClick={() => setShowModal(false)}
                disabled={actionLoading}
              >
                Cancelar
              </Button>
              <Button 
                variant={selectedUser?.blocked ? 'success' : 'danger'} 
                onClick={confirmToggleBlock}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    Procesando...
                  </>
                ) : (
                  selectedUser?.blocked ? 'Confirmar Desbloqueo' : 'Confirmar Bloqueo'
                )}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}