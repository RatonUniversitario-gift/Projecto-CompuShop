// src/pages/BlogDetalle.jsx
import { useParams, Link } from "react-router-dom";
import SeccionBase from "../components/SeccionBase.jsx";

const blogs = [
  {
    id: 1,
    title: "¿Qué es un SSD NVMe?",
    img: "/assets/img/nvme.jpg",
    content: (
      <>
        <p>
          Los discos NVMe ofrecen velocidades de lectura y escritura muy superiores a los SSD SATA tradicionales. 
          Son ideales para gamers y profesionales que requieren alto rendimiento.
        </p>
        <ul>
          <li>Velocidad de transferencia hasta 5 veces mayor</li>
          <li>Menor latencia</li>
          <li>Instalación sencilla en placas modernas</li>
        </ul>
      </>
    ),
    source: "https://www.netapp.com/es/data-storage/nvme/what-is-nvme/",
  },
  {
    id: 2,
    title: "Top 5 periféricos gamers 2025",
    img: "/assets/img/periferico.webp",
    content: (
      <>
        <p>
          Descubre los accesorios que están revolucionando el mundo gamer este año. 
          Desde teclados mecánicos hasta mouse ultra precisos.
        </p>
        <ol>
          <li>Teclado mecánico RGB</li>
          <li>Mouse gamer inalámbrico</li>
          <li>Headset con sonido envolvente</li>
          <li>Pad XL antideslizante</li>
          <li>Webcam HD para streaming</li>
        </ol>
      </>
    ),
    source:
      "https://www.fifantastic.com/2025/03/los-mejores-accesorios-gaming-de-2025-auriculares-teclados-sillas-y-mas.html",
  },
  {
    id: 3,
    title: "NVIDIA lanza la serie RTX 5000",
    img: "/assets/img/giphy.gif",
    content: (
      <>
        <p>
          NVIDIA ha presentado oficialmente la nueva generación de tarjetas gráficas RTX 5000, con mejoras en IA y ray tracing.
        </p>
        <ul>
          <li>Ray tracing más realista</li>
          <li>Consumo energético optimizado</li>
          <li>Mejor soporte para creadores de contenido</li>
        </ul>
      </>
    ),
    source: "https://www.nvidia.com/es-la/products/workstations/rtx-5000/",
  },
  {
    id: 4,
    title: "AMD Ryzen 9000: potencia y eficiencia",
    img: "/assets/img/AMD.jpg",
    content: (
      <>
        <p>
          AMD sorprende con los nuevos procesadores Ryzen 9000, con tecnología de 3 nm y mejoras en multitarea. 
          Ideales para gaming y productividad extrema.
        </p>
        <ul>
          <li>Tecnología de 3 nm</li>
          <li>Hasta 24 núcleos</li>
          <li>Compatibilidad con DDR5 y PCIe 5.0</li>
        </ul>
      </>
    ),
    source:
      "https://www.muycomputer.com/2024/06/03/amd-ryzen-9000-especificaciones-rendimiento-y-todo-lo-que-debes-saber/",
  },
  {
    id: 5,
    title: "NVIDIA vs AMD: ¿Quién lidera en 2025?",
    img: "/assets/img/amd-vs-nvidia.jpg",
    content: (
      <>
        <p>
          Analizamos las diferencias clave entre las últimas GPUs de NVIDIA y AMD 
          para ayudarte a elegir la mejor opción.
        </p>
        <ul>
          <li>NVIDIA: mejor ray tracing y software propietario</li>
          <li>AMD: rendimiento/precio excelente</li>
          <li>Ambas soportan IA y gaming avanzado</li>
        </ul>
      </>
    ),
    source: "https://www.profesionalreview.com/amd-vs-nvidia/",
  },
];

export default function BlogDetalle() {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === Number(id));

  if (!blog) {
    return (
      <SeccionBase titulo="Blog no encontrado">
        <p className="text-center text-light">
          El artículo solicitado no existe.
        </p>
        <Link to="/blogs" className="btn btn-outline-primary mt-3">
          Volver a blogs
        </Link>
      </SeccionBase>
    );
  }

  return (
    <SeccionBase titulo={blog.title}>
      <div className="bg-dark text-white p-4 rounded-4 border border-primary shadow-lg">
        <img
          src={blog.img}
          alt={blog.title}
          className="img-fluid rounded mb-4 border border-primary"
          style={{ objectFit: "contain", maxHeight: "400px", background: "#0b0c10" }}
        />
        {blog.content}
        <a
          href={blog.source}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-morado mt-3 me-3"
        >
          Leer más completo
        </a>
        <Link to="/blogs" className="btn btn-outline-primary mt-3">
          Volver a blogs
        </Link>
      </div>
    </SeccionBase>
  );
}
