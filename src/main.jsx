import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/estilos.css"; // tu CSS TechNova

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/estilos.css";
import "./index.css";

// ✅ No uses BrowserRouter aquí (ya está en App.jsx)
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
