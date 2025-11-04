import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import SeccionBase from '../components/SeccionBase';

export default function Perfil() {
  const { user, updateUserData } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigo_postal: ''
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      // Cargar datos del usuario
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        ciudad: user.ciudad || '',
        codigo_postal: user.codigo_postal || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validar campos
      if (!formData.nombre || !formData.email) {
        throw new Error('Nombre y email son campos obligatorios');
      }

      // Simular actualización en API
      await new Promise(resolve => setTimeout(resolve, 800));

      // Actualizar datos del usuario en el contexto
      updateUserData({
        ...user,
        ...formData
      });

      setSuccess(true);
      setEditing(false);
    } catch (err) {
      setError(err.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SeccionBase>
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="mb-3">Mi Perfil</h1>
            <p className="text-muted">
              Gestiona tu información personal y preferencias.
            </p>
          </Col>
        </Row>

        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Información Personal</h5>
                {!editing && (
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => setEditing(true)}
                  >
                    Editar
                  </Button>
                )}
              </Card.Header>
              <Card.Body>
                {success && (
                  <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
                    Tu perfil ha sido actualizado correctamente.
                  </Alert>
                )}
                
                {error && (
                  <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          disabled={!editing}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Apellido</Form.Label>
                        <Form.Control
                          type="text"
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleChange}
                          disabled={!editing}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editing}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </Form.Group>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ciudad</Form.Label>
                        <Form.Control
                          type="text"
                          name="ciudad"
                          value={formData.ciudad}
                          onChange={handleChange}
                          disabled={!editing}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Código Postal</Form.Label>
                        <Form.Control
                          type="text"
                          name="codigo_postal"
                          value={formData.codigo_postal}
                          onChange={handleChange}
                          disabled={!editing}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {editing && (
                    <div className="d-flex gap-2">
                      <Button 
                        type="submit" 
                        variant="primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                            Guardando...
                          </>
                        ) : 'Guardar Cambios'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline-secondary"
                        onClick={() => {
                          setEditing(false);
                          // Restaurar datos originales
                          if (user) {
                            setFormData({
                              nombre: user.nombre || '',
                              apellido: user.apellido || '',
                              email: user.email || '',
                              telefono: user.telefono || '',
                              direccion: user.direccion || '',
                              ciudad: user.ciudad || '',
                              codigo_postal: user.codigo_postal || ''
                            });
                          }
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Resumen de Cuenta</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <div 
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}
                    >
                      {user?.nombre?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h5 className="mb-0">{user?.nombre} {user?.apellido}</h5>
                      <p className="text-muted mb-0">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <p><strong>Tipo de cuenta:</strong> {user?.rol === 'admin' ? 'Administrador' : 'Cliente'}</p>
                  <p><strong>Miembro desde:</strong> {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>

                <div className="d-grid">
                  <Button as="a" href="/mis-pedidos" variant="outline-primary">
                    Ver mis pedidos
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </SeccionBase>
  );
}