import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  return (
    <>
      <Header />
      <main className="container py-5 text-center text-white">
        <h2>Cerrando sesión...</h2>
      </main>
      <Footer />
    </>
  );
}
