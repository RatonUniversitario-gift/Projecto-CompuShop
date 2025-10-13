import Header from "../components/Header";
import { Footer } from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/estilos.css";
import { Link } from "react-router-dom";


export const Blogs = () => {
    return (
        <>
            <Header />
            <main className="container py-5">
                <h2 className="text-center text-white mb-4">Últimos Blogs de Tecnología</h2>
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-4 mb-4">
                        <div className="card bg-dark text-white border-primary h-100">
                            <img src="assets/img/nvme.jpg" className="card-img-top" alt="Blog 1" />
                            <div className="card-body">
                                <h5 className="card-title">¿Qué es un SSD NVMe?</h5>
                                <p className="card-text">Descubre las ventajas de los discos NVMe frente a los SSD tradicionales.</p>
                                <Link to="/detalleblogs" className="btn btn-outline-primary boton-ver-blog">Leer más</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 mb-4">
                        <div className="card bg-dark text-white border-primary h-100">
                            <img src="assets/img/periferico.webp" className="card-img-top" alt="Blog 2" />
                            <div className="card-body">
                                <h5 className="card-title">Top 5 periféricos gamers 2025</h5>
                                <p className="card-text">Conoce los mejores accesorios para potenciar tu experiencia de juego.</p>
                                <Link to="/detalleblogs" className="btn btn-outline-primary boton-ver-blog">Leer más</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 mb-4">
                        <div className="card bg-dark text-white border-primary h-100">
                            <img src="assets/img/giphy.gif" className="card-img-top" alt="NVIDIA News" />
                            <div className="card-body">
                                <h5 className="card-title">NVIDIA lanza la serie RTX 5000</h5>
                                <p className="card-text">La nueva generación de tarjetas gráficas RTX 5000 promete un salto en rendimiento y eficiencia para gamers y creadores.</p>
                                <Link to="/detalleblogs" className="btn btn-outline-primary boton-ver-blog">Leer más</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 mb-4">
                        <div className="card bg-dark text-white border-primary h-100">
                            <img src="assets/img/AMD.jpg" className="card-img-top" alt="AMD News" />
                            <div className="card-body">
                                <h5 className="card-title">AMD Ryzen 9000: potencia y eficiencia</h5>
                                <p className="card-text">AMD presenta sus nuevos procesadores Ryzen 9000, ideales para gaming y productividad extrema.</p>
                                <Link to="/detalleblogs" className="btn btn-outline-primary boton-ver-blog">Leer más</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 mb-4">
                        <div className="card bg-dark text-white border-primary h-100">
                            <img src="assets/img/amd-vs-nvidia.jpg" className="card-img-top" alt="Comparativo NVIDIA vs AMD" />
                            <div className="card-body">
                                <h5 className="card-title">NVIDIA vs AMD: ¿Quién lidera en 2025?</h5>
                                <p className="card-text">Analizamos las diferencias clave entre las últimas GPUs de NVIDIA y AMD para ayudarte a elegir la mejor opción.</p>
                                <Link to="/detalleblogs" className="btn btn-outline-primary boton-ver-blog">Leer más</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Blogs;