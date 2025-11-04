// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Alert, Spinner, Card } from "react-bootstrap";
import SeccionBase from "../components/SeccionBase.jsx";
import { useMessage } from "../context/MessageContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const { showError } = useMessage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Ingrese un email válido";
    }
    
    // Validar contraseña
    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function onAxios(e) {
    e.preventDefault();
    setErr("");
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const { user } = await login({ email, password });
      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error.message || "Error al iniciar sesión";
      setErr(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SeccionBase>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <Card className="bg-dark text-white border-primary shadow-lg">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4 text-light">Inicio de Sesión</h2>

              <Form onSubmit={onAxios}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="email">Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({...errors, email: ""});
                    }}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="password">Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({...errors, password: ""});
                    }}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  className="w-100 py-2"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
              </Form>

              <div className="mt-4 text-center">
                <span className="text-light">¿No tienes cuenta?</span>
                <Link to="/registro" className="btn btn-outline-light ms-2">
                  Crea una
                </Link>
              </div>

              {err && <Alert variant="danger" className="mt-3">{err}</Alert>}
            </Card.Body>
          </Card>
        </div>
      </div>
    </SeccionBase>
  );
}
