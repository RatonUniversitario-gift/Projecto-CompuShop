// src/pages/Nosotros.jsx
import SeccionBase from "../components/SeccionBase.jsx";

export default function Nosotros() {
  return (
    <SeccionBase
      titulo="Sobre TechNova Store"
      subtitulo="Innovación, calidad y pasión por la tecnología"
    >
      <section className="bg-dark text-white p-4 rounded-4 border border-primary shadow-lg">
        <p className="mb-3">
          <strong>TechNova Store</strong> es una tienda online especializada en tecnología de alto
          rendimiento, diseñada para entusiastas, profesionales y gamers que buscan lo último en
          hardware, periféricos y soluciones inteligentes.
        </p>
        <p className="mb-3">
          Inspirados en las mejores prácticas del comercio electrónico moderno, construimos una
          plataforma intuitiva, rápida y visualmente atractiva, donde la experiencia del usuario
          es prioridad. Desde la navegación hasta el checkout, todo fue diseñado con fluidez y
          confianza en mente.
        </p>
        <p>
          Ya sea que busques una tarjeta gráfica para tu setup o un teclado mecánico premium, en{" "}
          <strong>TechNova Store</strong> encontrarás productos seleccionados y soporte experto.
        </p>

        <h4 className="mt-4 text-primary">Desarrolladores</h4>
        <ul className="list-unstyled">
          <li>👨‍💻 Gabriel Astorga</li>
          <li>👨‍💻 Ignacio Pizarro</li>
        </ul>
      </section>
    </SeccionBase>
  );
}
