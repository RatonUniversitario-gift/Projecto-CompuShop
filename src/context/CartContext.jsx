import { createContext, useContext, useEffect, useState, useMemo } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Carga inicial desde localStorage
  const [cartItems, setCartItems] = useState(() => {
    const raw = localStorage.getItem("cart_items");
    return raw ? JSON.parse(raw) : [];
  });
  const [total, setTotal] = useState(() => {
    const raw = localStorage.getItem("cart_total");
    return raw ? Number(raw) : 0;
  });

  // Persistencia automática
  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
    const newTotal = cartItems.reduce(
      (acc, item) =>
        acc + (item.precio || item.price || 0) * (item.quantity || 1),
      0
    );
    localStorage.setItem("cart_total", String(newTotal));
    setTotal(newTotal);
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const increment = (id) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
      )
    );
  };

  const decrement = (id) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, quantity: (i.quantity || 1) - 1 } : i
        )
        .filter((i) => (i.quantity || 1) > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = useMemo(
    () => cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0),
    [cartItems]
  );

  const value = {
    cartItems,
    cart: cartItems,        // alias para compatibilidad
    total,
    cartCount,
    addToCart,
    removeFromCart,
    increment,
    decrement,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
