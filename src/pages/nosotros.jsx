
import Header from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';

export default function Nosotros() {
  return (
    <>
      <Header />
      <main className="container py-5">
        <section className="bg-dark text-white p-4 rounded border border-primary">
          <h2 className="text-center mb-4">Sobre TechNova Store</h2>
          <p className="mb-3">
            TechNova Store es una tienda online especializada en tecnología de alto rendimiento, diseñada para entusiastas, profesionales y gamers que buscan lo último en hardware, periféricos y soluciones inteligentes para el hogar y la oficina. Inspirados en las mejores prácticas del comercio electrónico moderno, hemos construido una plataforma intuitiva, rápida y visualmente atractiva, donde la experiencia del usuario es la prioridad. Cada detalle desde la navegación hasta el checkout ha sido cuidadosamente diseñado para ofrecer fluidez, confianza y satisfacción en cada compra. Ya sea que estés buscando una tarjeta gráfica para tu setup, un teclado mecánico premium o una solución de almacenamiento profesional, en TechNova Store encontrarás productos seleccionados, descripciones claras y soporte técnico cuando lo necesites.
            <br />Innovación. Calidad. Experiencia.<br />Bienvenido a la nueva era de las compras tecnológicas.
          </p>
          <h3 className="mt-4">Desarrolladores</h3>
          <ul>
            <li>Gabriel Astorga</li>
            <li>Ignacio Pizarro</li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}