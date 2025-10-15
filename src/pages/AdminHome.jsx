import { Link } from "react-router-dom";
import SeccionBase from "../components/SeccionBase.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminHome() {
  const { user } = useAuth();

  return (
    <SeccionBase titulo="Panel de Administración" subtitulo={`Bienvenido, ${user?.name || "Admin"}`}>
      <div className="row g-4">
        <div className="col-12 col-md-4">
          <div className="card bg-dark text-white border-primary shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Productos</h5>
              <p className="text-secondary">Crea, edita y elimina productos del catálogo.</p>
              <Link to="/admin/productos" className="btn btn-morado w-100">Administrar productos</Link>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card bg-dark text-white border-primary shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Usuarios</h5>
              <p className="text-secondary">Listado de usuarios y roles (solo lectura o según backend).</p>
              <Link to="/admin/usuarios" className="btn btn-morado w-100">Ver usuarios</Link>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card bg-dark text-white border-primary shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Crear Producto</h5>
              <p className="text-secondary">Agrega nuevos productos al catálogo.</p>
              <Link to="/admin/crear-producto" className="btn btn-morado w-100">Crear producto</Link>
            </div>
          </div>
        </div>
      </div>
    </SeccionBase>
  );
}
