import React from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/estilos.css";
import { Link } from "react-router-dom";



export const DetalleBlogs = () => {
    return (
        <>
          <Header />
          <main className="container py-5">
        <section className="bg-dark text-white p-4 rounded border border-primary mb-4">
            <h2 className="mb-3">¿Qué es un SSD NVMe?</h2>
            <img id="img-ssd" src="assets/img/nvme.jpg" alt="SSD NVMe" className="img-fluid rounded mb-3"/>
            <p>Los discos NVMe ofrecen velocidades de lectura y escritura muy superiores a los SSD SATA tradicionales. Son ideales para gamers y profesionales que requieren alto rendimiento. En este blog te explicamos sus ventajas y cómo elegir el mejor para tu PC.</p>
            <p><strong>Ventajas principales:</strong></p>
            <ul>
                <li>Velocidad de transferencia hasta 5 veces mayor</li>
                <li>Menor latencia</li>
                <li>Instalación sencilla en placas modernas</li>
            </ul>
            <a href="https://www.netapp.com/es/data-storage/nvme/what-is-nvme/" target="_blank">Leer más sobre SSD NVMe</a>
        </section>
        <section className="bg-dark text-white p-4 rounded border border-primary mb-4">
            <h2 className="mb-3">Top 5 periféricos gamers 2025</h2>
            <img src="assets/img/periferico.webp" alt="Periféricos gamers" className="img-fluid rounded mb-3"/>
            <p>Descubre los accesorios que están revolucionando el mundo gamer este año. Desde teclados mecánicos hasta mouse ultra precisos, te mostramos los productos más recomendados por expertos.</p>
                 <ol>
                <li>Teclado mecánico RGB</li>
                <li>Mouse gamer inalámbrico</li>
                <li>Headset con sonido envolvente</li>
                <li>Pad XL antideslizante</li>
                <li>Webcam HD para streaming</li>
            </ol>
            <a href="https://www.fifantastic.com/2025/03/los-mejores-accesorios-gaming-de-2025-auriculares-teclados-sillas-y-mas.html" target="_blank">Leer más sobre periféricos gamers</a>
        </section>
        <section className="bg-dark text-white p-4 rounded border border-primary mb-4">
            <h2 className="mb-3">NVIDIA lanza la serie RTX 5000</h2>
            <img src="assets/img/giphy.gif" alt="NVIDIA RTX 5000" className="img-fluid rounded mb-3"/>
            <p>NVIDIA ha presentado oficialmente la nueva generación de tarjetas gráficas RTX 5000, con arquitectura mejorada y soporte para IA avanzada. Los benchmarks iniciales muestran un aumento de hasta 40% en rendimiento respecto a la serie anterior.</p>
            <ul>
                <li>Ray tracing más realista</li>
                <li>Consumo energético optimizado</li>
                <li>Mejor soporte para creadores de contenido</li>
            </ul>
            <a href="https://www.nvidia.com/es-la/products/workstations/rtx-5000/" target="_blank">Leer más sobre NVIDIA RTX 5000</a>
        </section>
        <section className="bg-dark text-white p-4 rounded border border-primary mb-4">
            <h2 className="mb-3">AMD Ryzen 9000: potencia y eficiencia</h2>
            <img src="assets/img/AMD.jpg" alt="AMD Ryzen 9000" className="img-fluid rounded mb-3"/>
            <p>AMD sorprende con los nuevos procesadores Ryzen 9000, que integran tecnología de 3nm y mejoras en multitarea. Ideales para gaming y productividad, los Ryzen 9000 compiten directamente con Intel y ofrecen excelente relación precio/rendimiento.</p>
            <ul>
                <li>Tecnología de fabricación de 3nm</li>
                <li>Hasta 24 núcleos y 48 hilos</li>
                <li>Compatibilidad con DDR5 y PCIe 5.0</li>
            </ul>
            <a href="https://www.muycomputer.com/2024/06/03/amd-ryzen-9000-especificaciones-rendimiento-y-todo-lo-que-debes-saber/" target="_blank">Leer más sobre AMD Ryzen 9000</a>
        </section>
        <section className="bg-dark text-white p-4 rounded border border-primary mb-4">
            <h2 className="mb-3">NVIDIA vs AMD: ¿Quién lidera en 2025?</h2>
            <img src="assets/img/amd-vs-nvidia.jpg" alt="Comparativo NVIDIA vs AMD" className="img-fluid rounded mb-3"/>
            <p>La competencia entre NVIDIA y AMD sigue creciendo. Analizamos las diferencias clave entre las últimas GPUs de ambas marcas para ayudarte a elegir la mejor opción según tus necesidades.</p>
            <ul>
                <li>NVIDIA: mejor ray tracing y software propietario</li>
                <li>AMD: excelente rendimiento por precio y drivers abiertos</li>
                <li>Ambas marcas ofrecen soporte para tecnologías de IA y gaming de última generación</li>
            </ul>
            <a href="https://www.profesionalreview.com/amd-vs-nvidia/" target="_blank">Leer más sobre NVIDIA vs AMD</a>
        </section>
    </main>
    <Footer />
        </>
    )
}

export default DetalleBlogs;