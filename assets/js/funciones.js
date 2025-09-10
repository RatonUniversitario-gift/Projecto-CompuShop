// === Funciones principales y validaciones para TechNova Store ===

// === Accesibilidad: Cambio de tema ===
function aplicarTema(tema) {
    document.body.classList.remove('tema-default', 'tema-claro', 'tema-oscuro');
    document.body.classList.add('tema-' + tema);
    localStorage.setItem('tema', tema);
}

function alternarTema() {
    const actual = localStorage.getItem('tema') || 'default';
    let siguiente = 'claro';
    if (actual === 'default') siguiente = 'claro';
    else if (actual === 'claro') siguiente = 'oscuro';
    else if (actual === 'oscuro') siguiente = 'default';
    aplicarTema(siguiente);
}

// Eventos al cargar el DOM (registro + tema guardado)
document.addEventListener('DOMContentLoaded', function() {
    // Registro: mostrar mensaje al registrarse
    if (document.getElementById('formulario-registro')) {
        document.getElementById('formulario-registro').addEventListener('submit', function(e) {
            e.preventDefault();
            const form = this;
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }
            // Mostrar mensaje de éxito
            const mensaje = document.getElementById('mensaje-registro');
            mensaje.textContent = '¡Te registraste correctamente!';
            mensaje.classList.remove('d-none', 'text-danger');
            mensaje.classList.add('text-success');
            form.reset();
            form.classList.remove('was-validated');
        });
    }
    const temaGuardado = localStorage.getItem('tema') || 'default';
    aplicarTema(temaGuardado);
    const btnTema = document.getElementById('btn-tema');
    if (btnTema) {
        btnTema.addEventListener('click', alternarTema);
    }
});

// Funciones globales para TechNova Store

// Actualiza el contador del carrito desde localStorage
function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    if (!contador) return;
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    contador.textContent = carrito.length;
}

// Evento global para agregar producto al carrito
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('boton-agregar-carrito')) {
        const id = e.target.getAttribute('data-id');
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito.push(id);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarContadorCarrito();
        mostrarToast('Producto agregado al carrito');
    }
});

// Muestra un mensaje temporal (toast)
function mostrarToast(mensaje) {
    const toast = document.createElement('div');
    toast.className = 'toast position-fixed bottom-0 end-0 m-3 bg-primary text-white p-3 rounded shadow';
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// ================= VALIDACIONES Y FUNCIONES DINÁMICAS =================

// ================= REGIONES Y COMUNAS DE CHILE =================
const regionesComunas = {
    'Región Metropolitana': ['Santiago', 'Puente Alto', 'Maipú', 'La Florida'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana'],
    'Biobío': ['Concepción', 'Talcahuano', 'Los Ángeles', 'Coronel'],
    'Antofagasta': ['Antofagasta', 'Calama', 'Mejillones'],
    'Araucanía': ['Temuco', 'Padre Las Casas', 'Angol']
};

// Cargar regiones en un <select>
function cargarRegiones(selectRegionId) {
    const select = document.getElementById(selectRegionId);
    if (!select) return;
    select.innerHTML = '<option value="">Seleccione...</option>';
    Object.keys(regionesComunas).forEach(region => {
        const opt = document.createElement('option');
        opt.value = region;
        opt.textContent = region;
        select.appendChild(opt);
    });
}

// Cargar comunas según región
function cargarComunas(region, selectComunaId) {
    const select = document.getElementById(selectComunaId);
    if (!select) return;
    select.innerHTML = '<option value="">Seleccione...</option>';
    if (region && regionesComunas[region]) {
        regionesComunas[region].forEach(comuna => {
            const opt = document.createElement('option');
            opt.value = comuna;
            opt.textContent = comuna;
            select.appendChild(opt);
        });
    }
}

// ================= VALIDACIÓN RUN CHILENO =================
function validarRunChileno(run) {
    run = run.replace(/[^0-9kK]/g, '').toUpperCase();
    if (run.length < 7 || run.length > 9) return false;
    let cuerpo = run.slice(0, -1);
    let dv = run.slice(-1);
    let suma = 0, multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i]) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    let dvEsperado = 11 - (suma % 11);
    dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    return dv === dvEsperado;
}

// ================= VALIDACIONES EN TIEMPO REAL =================
document.addEventListener('DOMContentLoaded', function() {
    // Registro.html
    if (document.getElementById('formulario-registro')) {
        cargarRegiones('region');
        document.getElementById('region').addEventListener('change', function() {
            cargarComunas(this.value, 'comuna');
        });
        document.getElementById('run').addEventListener('input', function() {
            const error = document.getElementById('error-run');
            if (!validarRunChileno(this.value)) {
                this.classList.add('is-invalid');
                error.style.display = 'block';
            } else {
                this.classList.remove('is-invalid');
                error.style.display = 'none';
            }
        });
    }
    // Admin-usuarios.html
    if (document.getElementById('formulario-usuario-admin')) {
        cargarRegiones('region-admin');
        document.getElementById('region-admin').addEventListener('change', function() {
            cargarComunas(this.value, 'comuna-admin');
        });
        document.getElementById('run-admin').addEventListener('input', function() {
            const error = document.getElementById('error-run-admin');
            if (!validarRunChileno(this.value)) {
                this.classList.add('is-invalid');
                error.style.display = 'block';
            } else {
                this.classList.remove('is-invalid');
                error.style.display = 'none';
            }
        });
    }
    // Admin-productos.html: alerta stock crítico
    if (document.getElementById('formulario-producto-admin')) {
        const stock = document.getElementById('stock-producto');
        const stockCritico = document.getElementById('stock-critico-producto');
        const alerta = document.getElementById('alerta-stock-critico');
        function checkAlerta() {
            if (stock && stockCritico && alerta) {
                const s = parseInt(stock.value) || 0;
                const sc = parseInt(stockCritico.value) || 0;
                if (sc > 0 && s <= sc) {
                    alerta.classList.remove('d-none');
                } else {
                    alerta.classList.add('d-none');
                }
            }
        }
        stock.addEventListener('input', checkAlerta);
        stockCritico.addEventListener('input', checkAlerta);
    }
});

// ================= VALIDACIÓN DE FORMULARIOS BOOTSTRAP =================
(function() {

// ================= ARREGLO DE PRODUCTOS (SIMULADO) =================
const productos = [
    { id: 1, nombre: 'Mouse Gamer RGB', descripcion: 'Ergonomía y precisión para tus juegos.', precio: 19990, descuento: 20, imagen: 'assets/img/mouse-gamer.jpg', categoria: 'Accesorios', stock: 10 },
    { id: 2, nombre: 'Teclado Mecánico', descripcion: 'Switches azules, retroiluminado.', precio: 29990, descuento: 10, imagen: 'assets/img/teclado-gamer.jpg', categoria: 'Accesorios', stock: 5 },
    { id: 3, nombre: 'SSD NVMe 1TB', descripcion: 'Velocidad y capacidad para tu PC.', precio: 74990, descuento: 0, imagen: 'assets/img/nvme.jpg', categoria: 'Computación', stock: 8 },
    { id: 4, nombre: 'Kit Periféricos', descripcion: 'Combo mouse, teclado y audífonos.', precio: 39990, descuento: 15, imagen: 'assets/img/periferico.webp', categoria: 'Accesorios', stock: 12 }
];

// Renderizar productos en productos.html
function renderizarProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;
    contenedor.innerHTML = '';
    productos.forEach(producto => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4';
        col.innerHTML = `
            <div class="card tarjeta-producto h-100 bg-dark text-white border-primary">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion} ${producto.descuento > 0 ? `<span class='badge bg-success'>-${producto.descuento}%</span>` : ''}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="precio-producto fw-bold">$${producto.precio.toLocaleString('es-CL')}</span>
                        <button class="btn btn-outline-primary boton-agregar-carrito" data-id="${producto.id}">Agregar al Carrito</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(col);
    });
}

// Renderizar detalle de producto
function renderizarDetalleProducto() {
    const contenedor = document.getElementById('contenedor-detalle-producto');
    if (!contenedor) return;
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const producto = productos.find(p => p.id === id);
    if (!producto) {
        contenedor.innerHTML = '<div class="alert alert-danger">Producto no encontrado.</div>';
        return;
    }
    contenedor.innerHTML = `
        <div class="card bg-dark text-white border-primary">
            <div class="row g-0">
                <div class="col-md-5">
                    <img src="${producto.imagen}" class="img-fluid rounded-start" alt="${producto.nombre}">
                </div>
                <div class="col-md-7">
                    <div class="card-body">
                        <h2 class="card-title">${producto.nombre}</h2>
                        <p class="card-text">${producto.descripcion}</p>
                        <span class="precio-producto fw-bold fs-4">$${producto.precio.toLocaleString('es-CL')}</span>
                        <div class="mt-3">
                            <button class="btn btn-primary boton-agregar-carrito" data-id="${producto.id}">Agregar al Carrito</button>
                        </div>
                        ${producto.descuento > 0 ? `<div class='mt-3'><span class='badge bg-success'>-${producto.descuento}% descuento</span></div>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ================= CARRITO DE COMPRAS =================
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}
function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Evento para agregar producto al carrito
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('boton-agregar-carrito')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        let carrito = obtenerCarrito();
        carrito.push(id);
        guardarCarrito(carrito);
        actualizarContadorCarrito();
        mostrarToast('Producto agregado al carrito');
    }
});

// Al cargar la página, renderiza productos y actualiza carrito
document.addEventListener('DOMContentLoaded', function() {
    actualizarContadorCarrito();
    renderizarProductos();
    renderizarDetalleProducto();
});

// ================= SIMULACIÓN DE COMPRA =================
// (Aquí iría la lógica para simular la compra, vaciar el carrito, etc.)

// ================= CONTACTO: VALIDACIÓN Y ENVÍO =================
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('formulario-contacto')) {
        let verificado = false;
        const iconos = document.querySelectorAll('.icono-verificacion');
        const inputVerificacion = document.getElementById('verificacion');
        iconos.forEach(btn => {
            btn.addEventListener('click', function() {
                iconos.forEach(b => b.classList.remove('border-success'));
                if (btn.dataset.valor === 'circulo') {
                    btn.classList.add('border-success');
                    inputVerificacion.value = 'ok';
                } else {
                    inputVerificacion.value = '';
                }
            });
        });

        // Validación y envío del formulario de contacto
        document.getElementById('formulario-contacto').addEventListener('submit', function(e) {
            e.preventDefault();
            const form = this;
            if (!form.checkValidity() || inputVerificacion.value !== 'ok') {
                form.classList.add('was-validated');
                if (inputVerificacion.value !== 'ok') {
                    inputVerificacion.classList.add('is-invalid');
                }
                return;
            }
            const mensaje = document.getElementById('mensaje-contacto');
            mensaje.textContent = '¡Tu información ha sido enviada! Te contactaremos pronto.';
            mensaje.classList.remove('d-none', 'text-danger');
            mensaje.classList.add('text-success');
            form.reset();
            form.classList.remove('was-validated');
            iconos.forEach(b => b.classList.remove('border-success'));
            inputVerificacion.value = '';
        });
    }
});

// Validación general con Bootstrap
'use strict';
const forms = document.querySelectorAll('form');
Array.from(forms).forEach(function(form) {
    form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
    }, false);
});
})();

// Actualizar contador al cargar la página
document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);

// Simulación de redirección en enlaces
document.querySelectorAll('a').forEach(function(enlace) {
    enlace.addEventListener('click', function(e) {
        const href = enlace.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('mailto:')) {
            // window.location.href = href; // Descomentar para simular redirección
        }
    });
});
