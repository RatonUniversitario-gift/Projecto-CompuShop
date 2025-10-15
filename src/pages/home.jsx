// src/pages/Home.jsx
import Hero from "../components/Hero.jsx";
import ProductosDestacados from "../components/ProductosDestacados.jsx";

export default function Home() {
  return (
    <main className="bg-dark text-white p-0 m-0">
      {/* === HERO === */}
      <section className="hero-section m-0 p-0">
        <Hero />
      </section>

      {/* === PRODUCTOS DESTACADOS === */}
      <section className="productos-destacados-section m-0 p-0">
        <ProductosDestacados />
      </section>
    </main>
  );
}
