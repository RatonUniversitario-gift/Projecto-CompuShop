// src/pages/Contacto.jsx
import SeccionBase from "../components/SeccionBase.jsx";

export default function Contacto() {
  return (
    <SeccionBase
      titulo="Contáctanos"
      subtitulo="¿Tienes dudas, sugerencias o necesitas ayuda con tu compra?"
    >
      <form
        className="bg-dark p-4 rounded-4 border border-primary shadow-lg mx-auto"
        style={{ maxWidth: "600px" }}
      >
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input type="text" className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input type="email" className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Mensaje</label>
          <textarea className="form-control" rows="4" required></textarea>
        </div>
        <button className="btn btn-morado w-100 mt-2 shadow-sm" type="submit">
          Enviar mensaje
        </button>
      </form>
    </SeccionBase>
  );
}
