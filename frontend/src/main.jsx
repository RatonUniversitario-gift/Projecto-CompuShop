import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home.jsx";
import {Nosotros} from "./pages/Nosotros.jsx";
import {Blogs} from "./pages/Blogs.jsx";
import {DetalleBlogs} from "./pages/detalleBlog.jsx";
import "./styles/estilos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/nosotros' element={<Nosotros />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/detalleblogs' element={<DetalleBlogs />} />
      </Routes>
    </BrowserRouter>
  
);
