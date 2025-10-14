
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import { Link } from "react-router-dom";

const blogs = [
    {
        img: "/assets/img/nvme.jpg",
        title: "¿Qué es un SSD NVMe?",
        desc: "Descubre las ventajas de los discos NVMe frente a los SSD tradicionales.",
        link: "/detalleblogs?id=1"
    },
    {
        img: "/assets/img/periferico.webp",
        title: "Top 5 periféricos gamers 2025",
        desc: "Conoce los mejores accesorios para potenciar tu experiencia de juego.",
        link: "/detalleblogs?id=2"
    },
    {
        img: "/assets/img/giphy.gif",
        title: "NVIDIA lanza la serie RTX 5000",
        desc: "La nueva generación de tarjetas gráficas RTX 5000 promete un salto en rendimiento y eficiencia para gamers y creadores.",
        link: "/detalleblogs?id=3"
    },
    {
        img: "/assets/img/AMD.jpg",
        title: "AMD Ryzen 9000: potencia y eficiencia",
        desc: "AMD presenta sus nuevos procesadores Ryzen 9000, ideales para gaming y productividad extrema.",
        link: "/detalleblogs?id=4"
    },
    {
        img: "/assets/img/amd-vs-nvidia.jpg",
        title: "NVIDIA vs AMD: ¿Quién lidera en 2025?",
        desc: "Analizamos las diferencias clave entre las últimas GPUs de NVIDIA y AMD para ayudarte a elegir la mejor opción.",
        link: "/detalleblogs?id=5"
    }
];

export default function Blogs() {
    return (
        <>
            <Header />
            <main className="container py-5">
                <h2 className="text-center text-white mb-4">Últimos Blogs de Tecnología</h2>
                <div className="row">
                    {blogs.map((blog, i) => (
                        <div className="col-12 col-md-6 col-lg-4 mb-4" key={i}>
                            <div className="card bg-dark text-white border-primary h-100">
                                <img src={blog.img} className="card-img-top" alt={blog.title} />
                                <div className="card-body">
                                    <h5 className="card-title">{blog.title}</h5>
                                    <p className="card-text">{blog.desc}</p>
                                    <Link to={blog.link} className="btn btn-outline-primary boton-ver-blog">Leer más</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}