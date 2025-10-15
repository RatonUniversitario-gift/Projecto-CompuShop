import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import  ProductGrid  from "../components/ProductGrid.jsx";
import { useEffect, useState } from "react";
import { listProducts } from "../api/xano.js";
import { Link } from "react-router-dom";
import SeccionBase from "../components/SeccionBase.jsx";
import ProductGrid from "../components/ProductGrid.jsx";

export default function Productos() {
  const { token } = useAuth();
  const { addToCart } = useCart();
  const [productos, setProductos] = useState([]);

<<<<<<< Updated upstream
  const baseURL = import.meta.env.VITE_XANO_STORE_BASE || "";
=======
  const BASE_URL = "https://x8ki-letl-twmt.n7.xano.io/api:K1k2AGUp";
  const buildImageUrl = (img) => {
    if (!img) return "/assets/img/placeholder.png";
    const raw =
      img.path ||
      img.url ||
      img.file_path ||
      img.location ||
      (Array.isArray(img.files) ? img.files[0]?.path : "") ||
      img?.image?.path ||
      "";
    if (!raw) return "/assets/img/placeholder.png";
    return raw.startsWith("http")
      ? raw
      : `${BASE_URL}${raw.startsWith("/") ? "" : "/"}${raw}`;
  };
>>>>>>> Stashed changes

  useEffect(() => {
    async function fetchProductos() {
      try {
        const data = await listProducts({ token });
        setProductos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al obtener productos:", err);
      }
    }
    if (token) fetchProductos();
  }, [token]);

  return (
    <SeccionBase
      titulo="Catálogo de Productos"
      subtitulo="Explora los productos disponibles en TechNova Store"
    >
<<<<<<< Updated upstream
      <div>
        <ProductGrid/>
      </div>
=======
    <div>
      <ProductGrid/>
    </div>
>>>>>>> Stashed changes
    </SeccionBase>
  );
}
