import React from "react";

export const Productos = () => {
  return (
    <div>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {/* Iteramos sobre los productos filtrados y renderizamos una tarjeta para cada uno */}
        {filtered.map((p) => (
          <div className="col" key={p.id}>
            <Card product={p} />
          </div>
        ))}
      </div>
</div>
  );
};

export default Productos;
