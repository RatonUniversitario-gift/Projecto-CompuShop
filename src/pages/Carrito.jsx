import { useCart } from "../context/CartContext.jsx";
import SeccionBase from "../components/SeccionBase.jsx";
import { Link } from "react-router-dom";

export default function Carrito() {
  const { cart, increment, decrement, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((s, p) => s + (p.precio || 0) * (p.quantity || 1), 0);

  if (!cart || cart.length === 0) {
    return (
      <SeccionBase titulo="Tu carrito está vacío 😢">
        <div className="text-center">
          <p className="text-secondary mb-4">
            Aún no has agregado productos a tu carrito.
          </p>
          <Link to="/productos" className="btn btn-morado btn-lg shadow-sm px-4">
            Ir al catálogo
          </Link>
        </div>
      </SeccionBase>
    );
  }

  return (
    <SeccionBase titulo="Tu Carrito de Compras">
      <div className="container text-light">
        {cart.map((item) => (
          <div
            key={item.id}
            className="d-flex justify-content-between align-items-center bg-dark p-3 mb-3 rounded border border-primary"
          >
            <div className="d-flex align-items-center gap-3">
              {item?.imagenes?.[0]?.path && (
                <img
                  src={item.imagenes[0].path}
                  alt={item.nombre}
                  style={{ width: 72, height: 72, objectFit: "contain", background: "#0b0c10", borderRadius: 8 }}
                />
              )}
              <div>
                <h5 className="mb-1">{item.nombre}</h5>
                <div className="small text-secondary">
                  <span className="text-success fw-semibold">
                    ${Number(item.precio || 0).toLocaleString()}
                  </span>{" "}
                  c/u
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-outline-light btn-sm" onClick={() => decrement(item.id)}>-</button>
              <span className="badge bg-secondary">{item.quantity || 1}</span>
              <button className="btn btn-outline-light btn-sm" onClick={() => increment(item.id)}>+</button>
            </div>

            <div className="text-end">
              <div className="text-light fw-bold">
                ${(Number(item.precio || 0) * (item.quantity || 1)).toLocaleString()}
              </div>
              <button className="btn btn-outline-danger btn-sm mt-2" onClick={() => removeFromCart(item.id)}>
                Quitar
              </button>
            </div>
          </div>
        ))}

        <hr className="border-primary" />
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-outline-light" onClick={clearCart}>
            Vaciar carrito
          </button>
          <h4 className="mb-0 text-white">
            Total: <span className="text-white fw-bold">${total.toLocaleString()}</span>
          </h4>
        </div>

        <div className="text-end mt-3">
          <button className="btn btn-morado">Compra realizada</button>
        </div>
      </div>
    </SeccionBase>
  );
}
