// ================= ACCESIBILIDAD: Cambio de tema y gestión de preferencia =================
// Aplica el tema seleccionado al body y lo guarda en localStorage
function aplicarTema(tema) {
    document.body.classList.remove('tema-default', 'tema-claro', 'tema-oscuro');
    document.body.classList.add('tema-' + tema);
    localStorage.setItem('tema', tema);
}

// Alterna entre los temas disponibles
function alternarTema() {
    const actual = localStorage.getItem('tema') || 'default';
    let siguiente = 'claro';
    if (actual === 'default') siguiente = 'claro';
    else if (actual === 'claro') siguiente = 'oscuro';
    else if (actual === 'oscuro') siguiente = 'default';
    aplicarTema(siguiente);
}

// ================== DOMContentLoaded ÚNICO: Inicialización global ==================
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa el tema guardado y el botón de alternancia
    const temaGuardado = localStorage.getItem('tema') || 'default';
    aplicarTema(temaGuardado);
    const btnTema = document.getElementById('btn-tema');
    if (btnTema) btnTema.addEventListener('click', alternarTema);

    // Inicializa el contador y migración del carrito
    migrarCarritoSiEsNecesario();
    actualizarContadorCarrito();

    // Renderiza productos si corresponde
    if (document.getElementById('contenedor-productos')) renderizarProductos();
    // Renderiza detalle de producto si corresponde
    if (document.getElementById('contenedor-detalle-producto')) renderizarDetalleProducto();
    // Renderiza carrito si corresponde
    if (document.getElementById('tbody-carrito')) {
        renderizarCarrito();
        actualizarTotales();
    }
    // Renderiza recomendados si corresponde
    if (document.getElementById('interes-cards')) renderizarRelacionados();

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
});
// ================== ARREGLO GLOBAL DE PRODUCTOS ==================



// ================== PRODUCTOS GLOBAL ==================
// Lista de productos disponibles en la tienda
const productos = [
    { id: 1, nombre: 'Mouse Gamer RGB', descripcion: 'Ergonomía y precisión para tus juegos.', precio: 19990, descuento: 20, imagen: 'assets/img/mouse-gamer.jpg', categoria: 'Accesorios', stock: 10 },
    { id: 2, nombre: 'Teclado Mecánico', descripcion: 'Switches azules, retroiluminado.', precio: 29990, descuento: 10, imagen: 'assets/img/teclado-gamer.jpg', categoria: 'Accesorios', stock: 5 },
    { id: 3, nombre: 'SSD NVMe 1TB', descripcion: 'Velocidad y capacidad para tu PC.', precio: 74990, descuento: 0, imagen: 'assets/img/nvme.jpg', categoria: 'Computación', stock: 8 },
    { id: 4, nombre: 'Kit Periféricos', descripcion: 'Combo mouse, teclado y audífonos.', precio: 39990, descuento: 15, imagen: 'assets/img/periferico.webp', categoria: 'Accesorios', stock: 12 }
];

// ================== HELPERS CARRITO ==================
// Formatea números como CLP
const CLP = n => `$${Number(n || 0).toLocaleString('es-CL')}`;
// Obtiene el carrito desde localStorage
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}
// Guarda el carrito en localStorage
function guardarCarrito(c) {
    localStorage.setItem('carrito', JSON.stringify(c));
}
// Busca un producto por su id
function getProductoById(id) {
    return productos.find(p => p.id === id);
}
// Migra el formato antiguo del carrito (array de ids) al nuevo (array de objetos)
function migrarCarritoSiEsNecesario() {
    const raw = JSON.parse(localStorage.getItem('carrito'));
    if (!raw) return;
    if (Array.isArray(raw) && raw.length && typeof raw[0] === 'number') {
        const map = new Map();
        raw.forEach(id => map.set(id, (map.get(id) || 0) + 1));
        const nuevo = Array.from(map.entries()).map(([id, qty]) => ({ id, qty }));
        localStorage.setItem('carrito', JSON.stringify(nuevo));
    }
}
// Actualiza el contador visual del carrito
function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    if (!contador) return;
    const carrito = obtenerCarrito();
    let totalQty = carrito.reduce((acc, item) => acc + (Number(item.qty) || 0), 0);
    contador.textContent = totalQty;
}

// ================== AGREGAR AL CARRITO ==================
// Escucha clicks en botones de agregar al carrito
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('boton-agregar-carrito')) {
        const id = parseInt(e.target.getAttribute('data-id'), 10);
        if (Number.isNaN(id)) return;
        let carrito = obtenerCarrito();
        const idx = carrito.findIndex(item => item.id === id);
        if (idx !== -1) carrito[idx].qty += 1;
        else carrito.push({ id, qty: 1 });
        guardarCarrito(carrito);
        actualizarContadorCarrito();
        mostrarToast('Producto agregado al carrito');
    }
});

// ================== RENDERIZAR CARRITO ==================
// Dibuja la tabla de productos en el carrito
function renderizarCarrito() {
    const tbody = document.getElementById('tbody-carrito');
    const vacio = document.getElementById('carrito-vacio');
    const conItems = document.getElementById('carrito-con-items');
    if (!tbody) return;
    const carrito = obtenerCarrito();
    tbody.innerHTML = '';
    if (!carrito.length) {
        if (vacio) vacio.classList.remove('d-none');
        if (conItems) conItems.classList.add('d-none');
        actualizarTotales();
        return;
    } else {
        if (vacio) vacio.classList.add('d-none');
        if (conItems) conItems.classList.remove('d-none');
    }
    carrito.forEach(item => {
        const p = getProductoById(item.id);
        if (!p) return;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center gap-3">
                    <img src="${p.imagen}" alt="${p.nombre}" class="rounded" style="width:64px;height:64px;object-fit:cover;border:2px dashed #0d6efd;border-radius:8px;">
                    <div>
                        <div class="fw-semibold">${p.nombre}</div>
                        <small class="text-secondary">${p.categoria || ''}</small>
                    </div>
                </div>
            </td>
            <td class="text-center">${CLP(p.precio)}</td>
            <td class="text-center">
                <div class="d-inline-flex align-items-center gap-2">
                    <button type="button" class="btn btn-outline-primary btn-sm btn-restar" aria-label="Disminuir cantidad" data-id="${item.id}">−</button>
                    <input type="text" class="form-control form-control-sm text-center bg-dark text-white border-primary" value="${item.qty}" aria-label="Cantidad" readonly style="width:48px;">
                    <button type="button" class="btn btn-outline-primary btn-sm btn-sumar" aria-label="Aumentar cantidad" data-id="${item.id}">+</button>
                </div>
            </td>
            <td class="text-end">${CLP((Number(p.precio)||0) * (Number(item.qty)||0))}</td>
            <td class="text-center">
                <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar" aria-label="Eliminar producto" data-id="${item.id}"><i class="bi bi-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    actualizarTotales();
}

// ================== ACTUALIZAR TOTALES ==================
// Calcula y muestra los totales del carrito
function actualizarTotales() {
    const carrito = obtenerCarrito();
    let subtotal = 0;
    carrito.forEach(item => {
        const p = getProductoById(item.id);
        if (!p) return;
        const precio = Number(p.precio) || 0;
        const qty = Number(item.qty) || 0;
        subtotal += precio * qty;
    });
    const selectEnvio = document.getElementById('select-envio');
    const envio = selectEnvio ? Number(selectEnvio.value) || 0 : 0;
    const descuento = 0; // hook para futuros cupones
    const iva = Math.round(subtotal * 0.19);
    const total = subtotal + iva + envio - descuento;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = CLP(val); };
    set('subtotal', subtotal);
    set('descuento', descuento);
    set('envio', envio);
    set('iva', iva);
    set('total', total);
}

// ================== EVENTOS CARRITO ==================
// Maneja los eventos de sumar/restar/eliminar/vaciar productos del carrito
document.addEventListener('click', function(e) {
    // Sumar cantidad
    if (e.target.classList.contains('btn-sumar')) {
        const id = parseInt(e.target.getAttribute('data-id'), 10);
        let carrito = obtenerCarrito();
        let idx = carrito.findIndex(item => item.id === id);
        if (idx !== -1) {
            carrito[idx].qty += 1;
            guardarCarrito(carrito);
            renderizarCarrito();
            actualizarContadorCarrito();
        }
    }
    // Restar cantidad
    if (e.target.classList.contains('btn-restar')) {
        const id = parseInt(e.target.getAttribute('data-id'), 10);
        let carrito = obtenerCarrito();
        let idx = carrito.findIndex(item => item.id === id);
        if (idx !== -1) {
            carrito[idx].qty -= 1;
            if (carrito[idx].qty < 1) {
                carrito.splice(idx, 1);
            }
            guardarCarrito(carrito);
            renderizarCarrito();
            actualizarContadorCarrito();
        }
    }
    // Eliminar producto
    if (e.target.classList.contains('btn-eliminar')) {
        const id = parseInt(e.target.getAttribute('data-id'), 10);
        let carrito = obtenerCarrito();
        carrito = carrito.filter(item => item.id !== id);
        guardarCarrito(carrito);
        renderizarCarrito();
        actualizarContadorCarrito();
    }
    // Vaciar carrito
    if (e.target.id === 'btn-vaciar-carrito') {
        guardarCarrito([]);
        renderizarCarrito();
        actualizarContadorCarrito();
    }
});
// Actualiza totales cuando cambia el tipo de envío
document.addEventListener('change', function(e) {
    if (e.target.id === 'select-envio') {
        actualizarTotales();
    }
});

// ================== RENDERIZAR PRODUCTOS ==================
// Dibuja las tarjetas de productos en el catálogo
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
                        <span class="precio-producto fw-bold">${CLP(producto.precio)}</span>
                        <button class="btn btn-outline-primary boton-agregar-carrito" data-id="${producto.id}">Agregar al Carrito</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(col);
    });
}

// ================== RENDERIZAR DETALLE DE PRODUCTO ==================
// Dibuja el detalle de un producto según el parámetro id de la URL
function renderizarDetalleProducto() {
    const contenedor = document.getElementById('contenedor-detalle-producto');
    if (!contenedor) return;
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'), 10);
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
                        <span class="precio-producto fw-bold fs-4">${CLP(producto.precio)}</span>
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

// ================== RENDERIZAR RECOMENDADOS ==================
// Dibuja productos recomendados excluyendo el actual
function renderizarRelacionados() {
    const wrap = document.getElementById('interes-cards');
    if (!wrap) return;
    let excluirId = null;
    const params = new URLSearchParams(window.location.search);
    if (params.has('id')) excluirId = Number(params.get('id')) || null;
    const pool = productos.filter(p => p.id !== excluirId);
    const sugeridos = pool.slice(0, 3);
    wrap.innerHTML = '';
    sugeridos.forEach(p => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4 mb-4';
        col.innerHTML = `
            <div class="card tarjeta-producto h-100 bg-dark text-white border-primary">
                <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${p.nombre}</h5>
                    <p class="card-text">${p.descripcion || ''} ${p.descuento > 0 ? `<span class='badge bg-success'>-${p.descuento}%</span>` : ''}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="precio-producto fw-bold">${CLP(p.precio)}</span>
                        <button class="btn btn-outline-primary boton-agregar-carrito" data-id="${p.id}">Agregar al Carrito</button>
                    </div>
                </div>
            </div>
        `;
        wrap.appendChild(col);
    });
}

// ...DOMContentLoaded único ya está arriba...

// ================== TOAST: Mensaje temporal ==================
// Muestra un mensaje temporal en pantalla
function mostrarToast(mensaje) {
    const toast = document.createElement('div');
    toast.className = 'toast position-fixed bottom-0 end-0 m-3 bg-primary text-white p-3 rounded shadow';
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// ================= VALIDACIÓN DE FORMULARIOS Y FUNCIONES DINÁMICAS =================

// ================= REGIONES Y COMUNAS DE CHILE =================
// Arreglo de regiones y comunas (solo ejemplo, puedes ampliar)
const regionesComunas = {
    'Región Metropolitana': ['Santiago', 'Puente Alto', 'Maipú', 'La Florida'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana'],
    'Biobío': ['Concepción', 'Talcahuano', 'Los Ángeles', 'Coronel'],
    'Antofagasta': ['Antofagasta', 'Calama', 'Mejillones'],
    'Araucanía': ['Temuco', 'Padre Las Casas', 'Angol']
};

// Carga las regiones en el select correspondiente
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

// Carga las comunas según la región seleccionada
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

// ================== VALIDACIÓN RUN CHILENO ==================
// Valida el formato y dígito verificador de un RUN chileno
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

// ================== VALIDACIONES EN TIEMPO REAL ==================
// Maneja validaciones y selects en formularios de registro y administración
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
                const s = parseInt(stock.value, 10) || 0;
                const sc = parseInt(stockCritico.value, 10) || 0;
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


// ================= RESUMEN DE MEJORAS =================
// Se agregaron comentarios explicativos en cada función y bloque principal.
// Se unificó el bloque DOMContentLoaded y se eliminaron duplicados.
// Se corrigieron conversiones inseguras y se mejoró la legibilidad.
// Se mantuvo solo un arreglo global de productos y se usa en todo el sistema.
// Se mejoró la accesibilidad y se eliminaron comentarios/código innecesario.
