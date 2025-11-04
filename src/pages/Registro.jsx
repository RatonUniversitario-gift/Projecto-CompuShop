// src/pages/Registro.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import SeccionBase from "../components/SeccionBase.jsx";
import { useMessage } from "../context/MessageContext.jsx";

const AUTH_BASE = import.meta.env.VITE_XANO_AUTH_BASE;

export default function Registro() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useMessage();
  const [form, setForm] = useState({ 
    nombre: "", 
    email: "", 
    password: "",
    confirmPassword: "",
    telefono: "",
    direccion: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");

  const validateForm = () => {
    const newErrors = {};
    
    // Validar nombre
    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (form.nombre.trim().length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Ingrese un email válido";
    }
    
    // Validar contraseña
    if (!form.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (form.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    // Validar confirmación de contraseña
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    
    // Validar teléfono (opcional)
    if (form.telefono && !/^\d{9,10}$/.test(form.telefono.trim())) {
      newErrors.telefono = "Ingrese un número de teléfono válido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Limpiar error específico cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors({...errors, [name]: ""});
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      await axios.post(`${AUTH_BASE}/auth/signup`, {
        name: form.nombre.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.telefono.trim(),
        address: form.direccion.trim()
      });

      showSuccess("Cuenta creada correctamente. Ahora inicia sesión.");
      navigate("/login");
    } catch (e) {
      console.error("Error al registrarse:", e);
      const errorMsg = e?.response?.data?.message || e.message || "Error al registrarse";
      setErr(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SeccionBase titulo="Crear cuenta">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <Form className="bg-dark p-4 rounded border border-primary" onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                name="nombre"
                value={form.nombre}
                onChange={onChange}
                placeholder="Ej: Juan Pérez"
                isInvalid={!!errors.nombre}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nombre}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="correo@ejemplo.com"
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChange}
                isInvalid={!!errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono (opcional)</Form.Label>
              <Form.Control
                name="telefono"
                value={form.telefono}
                onChange={onChange}
                placeholder="Ej: 912345678"
                isInvalid={!!errors.telefono}
              />
              <Form.Control.Feedback type="invalid">
                {errors.telefono}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Dirección (opcional)</Form.Label>
              <Form.Control
                name="direccion"
                value={form.direccion}
                onChange={onChange}
                placeholder="Ej: Calle Principal 123"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Creando cuenta...
                </>
              ) : (
                'Crear cuenta'
              )}
            </Button>

            {err && <Alert variant="danger" className="mt-3">{err}</Alert>}

            <div className="text-center mt-3">
              <Link to="/login" className="btn btn-outline-light">
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </SeccionBase>
  );
}
