import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useEffect, useState } from "react";
import { listProducts } from "../api/xano.js";
import { Link } from "react-router-dom";
import SeccionBase from "../components/SeccionBase.jsx";
import ProductGrid from "../components/ProductGrid.jsx";

export default function Productos() {
  const { token } = useAuth();
  const { addToCart } = useCart();
  const [productos, setProductos] = useState([]);

  const baseURL = import.meta.env.VITE_XANO_STORE_BASE || "";

  useEffect(() => {
    async function fetchProductos() {
      try {
        const data = await listProducts({ token });
        setProductos(data);
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
      <div>
        <ProductGrid/>
      </div>
    </SeccionBase>
  );
}
