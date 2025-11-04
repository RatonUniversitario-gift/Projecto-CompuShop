// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { MessageProvider } from "./context/MessageContext.jsx";

// === Estilos globales ===
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/estilos.css";

// === Componentes comunes ===
import Header from "./components/Header.jsx";
import HeaderAdmin from "./components/HeaderAdmin.jsx";
import Footer from "./components/Footer.jsx";

// === Páginas principales ===
import Home from "./pages/Home.jsx";
import Productos from "./pages/productos.jsx";
import DetalleProducto from "./pages/DetalleProducto.jsx";
import Carrito from "./pages/Carrito.jsx";
import Login from "./pages/Login.jsx";
import Logout from "./pages/Logout.jsx";
import CreateProduct from "./pages/CreateProduct.jsx";
import Registro from "./pages/Registro.jsx";
import Checkout from "./pages/Checkout.jsx";
import CheckoutConfirmado from "./pages/CheckoutConfirmado.jsx";


// === Páginas informativas ===
import Blogs from "./pages/Blogs.jsx";
import BlogDetalle from "./pages/BlogDetalle.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Contacto from "./pages/Contacto.jsx";

// === Páginas de administración ===
import AdminHome from "./pages/AdminHome.jsx";
import AdminProductos from "./pages/AdminProductos.jsx";
import AdminOrdenes from "./pages/AdminOrdenes.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";

// === Páginas de usuario ===
import MisPedidos from "./pages/MisPedidos.jsx";
import Perfil from "./pages/Perfil.jsx";

/* 🔒 Ruta protegida con validación de usuario y rol */
function PrivateRoute({ element: Component, requiredRole }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && user.role !== requiredRole) {
    alert("⚠️ Acceso restringido. Solo administradores pueden ingresar.");
    return <Navigate to="/" replace />;
  }

  // 🔥 Si el usuario es admin, muestra HeaderAdmin
  const isAdmin = user?.role === "admin";

  return (
    <>
      {isAdmin ? <HeaderAdmin /> : <Header />}
      {Component}
      <Footer />
    </>
  );
}

/* 🌐 Router principal */
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MessageProvider>
          <BrowserRouter>
            <Routes>
            {/* === Páginas públicas === */}
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Home />
                  <Footer />
                </>
              }
            />
            <Route
              path="/productos"
              element={
                <>
                  <Header />
                  <Productos />
                  <Footer />
                </>
              }
            />
            <Route
              path="/producto/:id"
              element={
                <>
                  <Header />
                  <DetalleProducto />
                  <Footer />
                </>
              }
            />
            <Route
              path="/blogs"
              element={
                <>
                  <Header />
                  <Blogs />
                  <Footer />
                </>
              }
            />
            <Route
              path="/blogs/:id"
              element={
                <>
                  <Header />
                  <BlogDetalle />
                  <Footer />
                </>
              }
            />
            <Route
              path="/nosotros"
              element={
                <>
                  <Header />
                  <Nosotros />
                  <Footer />
                </>
              }
            />
            <Route
              path="/contacto"
              element={
                <>
                  <Header />
                  <Contacto />
                  <Footer />
                </>
              }
            />

            {/* === Páginas funcionales === */}
            <Route
              path="/carrito"
              element={
                <>
                  <Header />
                  <Carrito />
                  <Footer />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Header />
                  <Login />
                  <Footer />
                </>
              }
            />
            <Route
              path="/registro"
              element={
                <>
                  <Header />
                  <Registro />
                  <Footer />
                </>
              }
            />
            <Route
              path="/logout"
              element={
                <>
                  <Header />
                  <Logout />
                  <Footer />
                </>
              }
            />
            <Route
              path="/checkout"
              element={
                <>
                  <Header />
                  <Checkout />
                  <Footer />
                </>
              }
            />

            <Route
              path="/checkout-confirmado"
              element={
                <>
                  <Header />
                  <CheckoutConfirmado />
                  <Footer />
                </>
              }
            />

            {/* === Rutas de administración === */}
            <Route
              path="/admin"
              element={<PrivateRoute element={<AdminHome />} requiredRole="admin" />}
            />
            <Route
              path="/admin/productos"
              element={<PrivateRoute element={<AdminProductos />} requiredRole="admin" />}
            />
            <Route
              path="/admin/usuarios"
              element={<PrivateRoute element={<AdminUsers />} requiredRole="admin" />}
            />
            <Route
              path="/admin/ordenes"
              element={<PrivateRoute element={<AdminOrdenes />} requiredRole="admin" />}
            />
            
            {/* === Rutas de usuario === */}
            <Route
              path="/perfil"
              element={<PrivateRoute element={<Perfil />} />}
            />
            <Route
              path="/mis-pedidos"
              element={<PrivateRoute element={<MisPedidos />} />}
            />
            <Route
              path="/admin/crear-producto"
              element={<PrivateRoute element={<CreateProduct />} requiredRole="admin" />}
            />

            {/* === Redirección por defecto === */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </MessageProvider>
      </CartProvider>
    </AuthProvider>
  );
}
