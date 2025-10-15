// src/pages/Blogs.jsx
import { Link } from "react-router-dom";
import SeccionBase from "../components/SeccionBase.jsx";

const blogs = [
  {
    id: 1,
    img: "/assets/img/nvme.jpg",
    title: "¿Qué es un SSD NVMe?",
    desc: "Descubre las ventajas de los discos NVMe frente a los SSD tradicionales.",
  },
  {
    id: 2,
    img: "/assets/img/periferico.webp",
    title: "Top 5 periféricos gamers 2025",
    desc: "Conoce los mejores accesorios para potenciar tu experiencia de juego.",
  },
  {
    id: 3,
    img: "/assets/img/giphy.gif",
    title: "NVIDIA lanza la serie RTX 5000",
    desc: "La nueva generación de tarjetas gráficas RTX 5000 promete un salto en rendimiento.",
  },
  {
    id: 4,
    img: "/assets/img/AMD.jpg",
    title: "AMD Ryzen 9000: potencia y eficiencia",
    desc: "Los nuevos Ryzen 9000 ofrecen potencia bruta y gran eficiencia energética.",
  },
  {
    id: 5,
    img: "/assets/img/amd-vs-nvidia.jpg",
    title: "NVIDIA vs AMD: ¿Quién lidera en 2025?",
    desc: "Analizamos las diferencias clave entre las últimas GPUs.",
  },
];

export default function Blogs() {
  return (
    <SeccionBase
      titulo="Últimos Blogs de Tecnología"
      subtitulo="Noticias, lanzamientos y comparativas del mundo TechNova"
    >
      <div className="row g-4 justify-content-center">
        {blogs.map((blog) => (
          <div key={blog.id} className="col-12 col-md-6 col-lg-4">
            <div className="card tarjeta-producto bg-dark text-white border-primary shadow-sm hover-scale h-100">
              <img
                src={blog.img}
                alt={blog.title}
                className="card-img-top rounded-top"
                style={{
                  objectFit: "contain",
                  height: "250px",
                  backgroundColor: "#0b0c10",
                  padding: "8px",
                }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{blog.title}</h5>
                <p className="card-text text-secondary small flex-grow-1">
                  {blog.desc}
                </p>
                <Link
                  to={`/blogs/${blog.id}`} // ✅ cada botón lleva su id
                  className="btn btn-morado mt-auto w-100 shadow-sm"
                >
                  Leer más
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SeccionBase>
  );
}
