'use strict';

/* ============================================================
   Utilidades
   ============================================================ */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const uid = () => (crypto.randomUUID ? crypto.randomUUID()
  : 'x-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10));

const esc = (t) => String(t ?? '').replace(/[&<>"']/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const fLargo = new Intl.DateTimeFormat('es-MX',
  { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const fCorto = new Intl.DateTimeFormat('es-MX',
  { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const DIA = 86400000;

function aviso(texto) {
  const el = $('#aviso');
  el.textContent = texto;
  el.hidden = false;
  clearTimeout(aviso._t);
  aviso._t = setTimeout(() => { el.hidden = true; }, 2200);
}

const ICONOS = {
  caja: '<svg viewBox="0 0 24 24"><path d="M12 2 3 6v12l9 4 9-4V6zm0 2.2 6.3 2.8L12 9.8 5.7 7zM5 8.6l6 2.7v8.1l-6-2.7zm14 8.1-6 2.7v-8.1l6-2.7z"/></svg>',
  mas: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m1 11v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" class="flecha"><path d="M9 6l6 6-6 6z"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" class="chevron"><path d="M9 6l6 6-6 6z"/></svg>',
  nota: '<svg viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2M6 9h12v2H6zm0 4h8v2H6z"/></svg>',
  notaLlena: '<svg viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2M6 9h12v2H6zm0 4h8v2H6z"/></svg>',
  menu: '<svg viewBox="0 0 24 24"><path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/></svg>',
  reloj: '<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7zm1 4h-2v6l5 3 1-1.7-4-2.3z"/></svg>',
  pdf: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 7V3.5L18.5 9zM8 13h8v2H8zm0 4h5v2H8z"/></svg>',
  texto: '<svg viewBox="0 0 24 24"><path d="M3 5h18v2H3zm0 4h12v2H3zm0 4h18v2H3zm0 4h12v2H3z"/></svg>'
};

const ICONO_SEV = {
  critico:     '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2 1 21h22zm0 6 7.5 13h-15zM11 11h2v5h-2zm0 6h2v2h-2z"/></svg>',
  alto:        '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2 1 21h22zM11 9h2v6h-2zm0 7h2v2h-2z"/></svg>',
  medio:       '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7zm1 4h-2v6l5 3 1-1.7-4-2.3z"/></svg>',
  oportunidad: '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m4 7v5h-2v-1.6l-3.3 3.3-1.4-1.4L12.6 11H11V9z"/></svg>',
  info:        '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m1 15h-2v-6h2zm0-8h-2V7h2z"/></svg>'
};

const ETIQUETA_SEV = {
  critico: 'Crítico', alto: 'Atención', medio: 'Seguimiento',
  oportunidad: 'Oportunidad', info: 'Contexto'
};
const PESO_SEV = { critico: 0, alto: 1, medio: 2, oportunidad: 3, info: 4 };


/* ============================================================
   Catálogo inicial
   ============================================================ */
const SEMILLA = [
  ['COCA', ['Coca 355 ml', 'Coca 500 ml (Retornable)', 'Coca 600 ml',
            'Coca 1.5 L (Retornable)', 'Coca 2 L', 'Coca 2.5 L (Retornable)', 'Coca 3 L']],
  ['CIEL', ['Ciel 600 ml', 'Ciel 1 L', 'Ciel 1.5 L (Retornable)']],
  ['COCA SABOR', ['Sidral 2 L', 'Fresca 2 L', 'Spray 2 L', 'Fanta 2 L', 'Kiwi 2 L',
                  'Fanta Fresa 2 L', 'Sidral 3 L', 'Fresca 3 L', 'Spray 3 L', 'Fanta 3 L',
                  'Valle Frut 2.5 L (Retornable)', 'Valle Sidral 2.5 L (Retornable)',
                  'Fanta 2.5 L (Retornable)']]
];


/* ============================================================
   Almacén local (sin red)
   ============================================================ */
const Store = {
  categorias: [],
  productos: [],
  inventarios: [],

  cargar() {
    try {
      const cat = JSON.parse(localStorage.getItem('inv.catalogo') || 'null');
      if (cat && cat.categorias && cat.categorias.length) {
        this.categorias = cat.categorias;
        this.productos = cat.productos || [];
      } else this.sembrar();
    } catch { this.sembrar(); }

    try {
      this.inventarios = JSON.parse(localStorage.getItem('inv.inventarios') || '[]');
    } catch { this.inventarios = []; }
  },

  sembrar() {
    this.categorias = [];
    this.productos = [];
    SEMILLA.forEach(([nombre, prods], i) => {
      const cat = { id: uid(), nombre, orden: i };
      this.categorias.push(cat);
      prods.forEach((n, j) => this.productos.push(
        { id: uid(), nombre: n, categoriaID: cat.id, activo: true, orden: j }
      ));
    });
    this.guardarCatalogo();
  },

  guardarCatalogo() {
    localStorage.setItem('inv.catalogo',
      JSON.stringify({ categorias: this.categorias, productos: this.productos }));
  },
  guardarInventarios() {
    localStorage.setItem('inv.inventarios', JSON.stringify(this.inventarios));
  },

  categoriasOrdenadas() {
    return [...this.categorias].sort((a, b) => a.orden - b.orden);
  },
  productosDe(catID, soloActivos = false) {
    return this.productos
      .filter(p => p.categoriaID === catID && (!soloActivos || p.activo))
      .sort((a, b) => a.orden - b.orden);
  },
  totalActivos() { return this.productos.filter(p => p.activo).length; },
  recientes() { return [...this.inventarios].sort((a, b) => b.fecha - a.fecha); },
  ultimo() { return this.recientes()[0] || null; },
  previos(inv) {
    return this.inventarios
      .filter(i => i.fecha < inv.fecha && i.id !== inv.id)
      .sort((a, b) => b.fecha - a.fecha);
  },

  /* --- categorías --- */
  agregarCategoria(nombre) {
    nombre = nombre.trim(); if (!nombre) return;
    const orden = Math.max(-1, ...this.categorias.map(c => c.orden)) + 1;
    this.categorias.push({ id: uid(), nombre, orden });
    this.guardarCatalogo();
  },
  renombrarCategoria(id, nombre) {
    nombre = nombre.trim(); if (!nombre) return;
    const c = this.categorias.find(c => c.id === id);
    if (c) { c.nombre = nombre; this.guardarCatalogo(); }
  },
  eliminarCategoria(id) {
    this.categorias = this.categorias.filter(c => c.id !== id);
    this.productos = this.productos.filter(p => p.categoriaID !== id);
    this.guardarCatalogo();
  },

  /* --- productos --- */
  agregarProducto(nombre, catID) {
    nombre = nombre.trim(); if (!nombre) return;
    const orden = Math.max(-1, ...this.productosDe(catID).map(p => p.orden)) + 1;
    this.productos.push({ id: uid(), nombre, categoriaID: catID, activo: true, orden });
    this.guardarCatalogo();
  },
  actualizarProducto(id, nombre, catID) {
    nombre = nombre.trim(); if (!nombre) return;
    const p = this.productos.find(p => p.id === id); if (!p) return;
    if (p.categoriaID !== catID) {
      p.orden = Math.max(-1, ...this.productosDe(catID).map(x => x.orden)) + 1;
      p.categoriaID = catID;
    }
    p.nombre = nombre;
    this.guardarCatalogo();
  },
  alternarActivo(id) {
    const p = this.productos.find(p => p.id === id);
    if (p) { p.activo = !p.activo; this.guardarCatalogo(); }
  },
  eliminarProducto(id) {
    this.productos = this.productos.filter(p => p.id !== id);
    this.guardarCatalogo();
  },

  /* --- inventarios --- */
  nuevoInventario() {
    const lineas = [];
    for (const cat of this.categoriasOrdenadas())
      for (const p of this.productosDe(cat.id, true))
        lineas.push({
          id: uid(), productoID: p.id, nombreProducto: p.nombre,
          nombreCategoria: cat.nombre, cantidad: null, observaciones: ''
        });
    return { id: uid(), fecha: Date.now(), lineas, notaGeneral: '' };
  },
  guardarInventario(inv) {
    inv.fecha = Date.now();
    const i = this.inventarios.findIndex(x => x.id === inv.id);
    if (i >= 0) this.inventarios[i] = inv; else this.inventarios.push(inv);
    this.guardarInventarios();
  },
  eliminarInventario(id) {
    this.inventarios = this.inventarios.filter(i => i.id !== id);
    this.guardarInventarios();
  }
};

/* Derivados de un inventario */
const capturadas = inv => inv.lineas.filter(l => l.cantidad !== null && l.cantidad !== undefined);
const totalUnidades = inv => capturadas(inv).reduce((s, l) => s + l.cantidad, 0);
const enCero = inv => inv.lineas.filter(l => l.cantidad === 0).length;


/* ============================================================
   Motor de estrategia (progresivo)
   ============================================================ */
const COBERTURA_CRITICA = 3, COBERTURA_BAJA = 7, SOBRESTOCK = 45, CONTEOS_ESTANCAMIENTO = 3;

function generarEstrategia(inv, historial) {
  const previos = historial.filter(i => i.fecha < inv.fecha).sort((a, b) => b.fecha - a.fecha);
  let hallazgos = [...analizarQuiebres(inv)];

  if (!previos.length) {
    hallazgos.push(...analizarSituacionInicial(inv));
  } else {
    hallazgos.push(...analizarRotacion(inv, previos));
    hallazgos.push(...analizarEstancamiento(inv, previos));
    hallazgos.push(...analizarSobrestock(inv, previos));
  }

  hallazgos.sort((a, b) => PESO_SEV[a.severidad] - PESO_SEV[b.severidad]);

  return {
    resumen: construirResumen(inv, previos, hallazgos),
    hallazgos,
    inventariosPrevios: previos.length,
    profundidad: previos.length === 0 ? 'Análisis de situación actual'
      : previos.length <= 2 ? 'Análisis comparativo inicial'
      : 'Análisis de tendencia con historial'
  };
}

function analizarQuiebres(inv) {
  const agotados = inv.lineas.filter(l => l.cantidad === 0);
  if (!agotados.length) return [];
  return [{
    severidad: 'critico',
    titulo: `${agotados.length} producto${agotados.length === 1 ? '' : 's'} en cero`,
    detalle: listar(agotados.map(l => l.nombreProducto)),
    accion: 'Cada día en cero es venta que se va con la competencia. Inclúyelos en el pedido '
          + 'inmediato y, mientras llegan, ofrece la presentación más cercana para no perder al cliente.'
  }];
}

function analizarSituacionInicial(inv) {
  const out = [];
  const conStock = capturadas(inv).filter(l => l.cantidad > 0);

  if (!conStock.length) return [{
    severidad: 'info', titulo: 'Punto de partida registrado',
    detalle: 'Este es tu primer inventario.',
    accion: 'Levanta el siguiente conteo en unos días. Con dos mediciones la app ya puede '
          + 'calcular rotación y anticipar quiebres.'
  }];

  const cants = conStock.map(l => l.cantidad).sort((a, b) => a - b);
  const mediana = cants[Math.floor(cants.length / 2)];

  const bajos = conStock.filter(l => l.cantidad <= Math.max(1, Math.floor(mediana / 4)));
  if (bajos.length) out.push({
    severidad: 'alto', titulo: 'Existencias bajas frente al resto del anaquel',
    detalle: listar(bajos.map(l => `${l.nombreProducto} — ${l.cantidad}`)),
    accion: `Están muy por debajo del promedio de tu inventario (mediana ${mediana}). `
          + 'Si son productos que sí se mueven, refuérzalos antes de que caigan a cero.'
  });

  const porCat = {};
  conStock.forEach(l => { porCat[l.nombreCategoria] = (porCat[l.nombreCategoria] || 0) + l.cantidad; });
  const total = Math.max(1, Object.values(porCat).reduce((a, b) => a + b, 0));
  const top = Object.entries(porCat).sort((a, b) => b[1] - a[1])[0];
  if (top) {
    const pct = Math.round(top[1] / total * 100);
    if (pct >= 50) out.push({
      severidad: 'oportunidad',
      titulo: `${pct}% de tu inventario está en ${top[0]}`,
      detalle: `${top[1]} de ${total} unidades totales.`,
      accion: 'Tienes el capital concentrado en una sola línea. Empuja esa categoría con exhibición '
            + 'al frente y precio de impulso, y revisa si las otras líneas están cortas por falta '
            + 'de pedido o de demanda real.'
    });
  }

  out.push({
    severidad: 'info', titulo: 'Punto de partida registrado',
    detalle: `${capturadas(inv).length} productos capturados, ${totalUnidades(inv)} unidades en total.`,
    accion: 'Levanta el siguiente conteo en unos días. A partir del segundo inventario la app '
          + 'calcula rotación, días de cobertura y detecta producto estancado.'
  });
  return out;
}

function analizarRotacion(inv, previos) {
  const riesgo = [], motores = [];

  for (const l of inv.lineas) {
    if (l.cantidad === null || l.cantidad === undefined || l.cantidad <= 0) continue;
    const v = velocidadDiaria(l.productoID, inv, previos);
    if (!v || v <= 0) continue;
    const cobertura = l.cantidad / v;
    motores.push([l.nombreProducto, v]);
    if (cobertura <= COBERTURA_BAJA) riesgo.push([l.nombreProducto, cobertura, l.cantidad]);
  }

  const out = [];
  const criticos = riesgo.filter(r => r[1] <= COBERTURA_CRITICA);
  if (criticos.length) out.push({
    severidad: 'critico',
    titulo: `Se agotan en menos de ${COBERTURA_CRITICA} días`,
    detalle: listar(criticos.map(r => `${r[0]} — quedan ${r[2]}, alcanzan ~${fmtDias(r[1])}`)),
    accion: 'Son tus productos de mayor rotación y están por quebrar. Súbelos al pedido con '
          + 'prioridad y aumenta la cantidad respecto al pedido anterior: se están vendiendo '
          + 'más rápido de lo que los repones.'
  });

  const proximos = riesgo.filter(r => r[1] > COBERTURA_CRITICA);
  if (proximos.length) out.push({
    severidad: 'alto',
    titulo: `Cobertura corta (menos de ${COBERTURA_BAJA} días)`,
    detalle: listar(proximos.map(r => `${r[0]} — quedan ${r[2]}, alcanzan ~${fmtDias(r[1])}`)),
    accion: 'Todavía tienes margen, pero inclúyelos en el próximo pedido para no llegar al cero '
          + 'entre visitas del proveedor.'
  });

  const top = motores.sort((a, b) => b[1] - a[1]).slice(0, 3);
  if (top.length >= 2) out.push({
    severidad: 'oportunidad', titulo: 'Tus productos que más rotan',
    detalle: listar(top.map(m => `${m[0]} — ~${fmtVel(m[1])}`)),
    accion: 'Estos mueven tu venta. Ponlos a la altura de la vista y al alcance de la mano, nunca '
          + 'permitas que falten, y úsalos de gancho: colócalos junto a los productos lentos para '
          + 'que arrastren su salida.'
  });

  return out;
}

function analizarEstancamiento(inv, previos) {
  const ventana = previos.slice(0, CONTEOS_ESTANCAMIENTO - 1);
  if (ventana.length < CONTEOS_ESTANCAMIENTO - 1) return [];

  const estancados = [];
  for (const l of inv.lineas) {
    if (l.cantidad === null || l.cantidad === undefined || l.cantidad <= 0) continue;
    const previas = ventana
      .map(i => i.lineas.find(x => x.productoID === l.productoID)?.cantidad)
      .filter(c => c !== null && c !== undefined);
    if (previas.length !== ventana.length) continue;
    if (previas.every(c => c === l.cantidad))
      estancados.push(`${l.nombreProducto} — ${l.cantidad} sin moverse`);
  }
  if (!estancados.length) return [];

  return [{
    severidad: 'medio',
    titulo: `Producto sin movimiento en ${CONTEOS_ESTANCAMIENTO} conteos`,
    detalle: listar(estancados),
    accion: 'Es dinero detenido en el anaquel. Cámbialo de lugar a una zona de paso, amárralo en '
          + 'paquete con un producto de alta rotación, o bájale el margen para recuperar el capital '
          + 'y reinvertirlo en lo que sí se vende.'
  }];
}

function analizarSobrestock(inv, previos) {
  const excesos = [];
  for (const l of inv.lineas) {
    if (l.cantidad === null || l.cantidad === undefined || l.cantidad <= 0) continue;
    const v = velocidadDiaria(l.productoID, inv, previos);
    if (!v || v <= 0) continue;
    const cobertura = l.cantidad / v;
    if (cobertura >= SOBRESTOCK)
      excesos.push(`${l.nombreProducto} — ${l.cantidad} para ~${fmtDias(cobertura)}`);
  }
  if (!excesos.length) return [];

  return [{
    severidad: 'oportunidad', titulo: 'Inventario por encima de lo que rota',
    detalle: listar(excesos),
    accion: 'Tienes más producto del que vendes en mes y medio. Reduce la cantidad en el próximo '
          + 'pedido y arma una promoción de volumen para acelerar la salida antes de que ocupe '
          + 'espacio de un producto más rentable.'
  }];
}

/** Unidades por día según las bajas observadas entre conteos.
 *  Un aumento se interpreta como resurtido y no cuenta como venta. */
function velocidadDiaria(productoID, actual, previos) {
  const serie = [actual, ...previos].sort((a, b) => a.fecha - b.fecha);
  if (serie.length < 2) return null;

  let consumidas = 0, dias = 0;
  for (let i = 1; i < serie.length; i++) {
    const a = serie[i - 1].lineas.find(l => l.productoID === productoID)?.cantidad;
    const b = serie[i].lineas.find(l => l.productoID === productoID)?.cantidad;
    if (a === null || a === undefined || b === null || b === undefined) continue;

    const d = (serie[i].fecha - serie[i - 1].fecha) / DIA;
    if (d <= 0.02) continue;
    if (b < a) { consumidas += a - b; dias += d; }
  }
  if (consumidas <= 0 || dias <= 0) return null;
  return consumidas / dias;
}

function construirResumen(inv, previos, hallazgos) {
  const n = capturadas(inv).length, u = totalUnidades(inv);
  const p = [`${n} producto${n === 1 ? '' : 's'} capturado${n === 1 ? '' : 's'}, ${u} unidades en existencia.`];

  if (!previos.length) {
    p.push('Primer levantamiento: el análisis describe tu situación actual. Con el siguiente '
         + 'conteo comienzan las proyecciones de rotación.');
  } else {
    p.push(`Comparado contra ${previos.length === 1 ? '1 inventario previo' : previos.length + ' inventarios previos'}.`);
    const d = u - totalUnidades(previos[0]);
    if (d < 0) p.push(`Salieron ${Math.abs(d)} unidades netas desde el conteo anterior.`);
    else if (d > 0) p.push(`Entraron ${d} unidades netas desde el conteo anterior.`);
    else p.push('El total de unidades no cambió desde el conteo anterior.');
  }

  const c = hallazgos.filter(h => h.severidad === 'critico').length;
  if (c) p.push(`${c} punto${c === 1 ? '' : 's'} requiere${c === 1 ? '' : 'n'} acción inmediata.`);
  return p.join(' ');
}

function listar(items) {
  const v = items.slice(0, 8);
  let t = v.map(x => '• ' + x).join('\n');
  if (items.length > v.length) t += `\n• y ${items.length - v.length} más`;
  return t;
}
const fmtDias = d => d < 1 ? 'menos de 1 día'
  : `${Math.round(d)} día${Math.round(d) === 1 ? '' : 's'}`;
const fmtVel = v => v >= 1 ? `${v.toFixed(1)} al día` : `${(v * 7).toFixed(1)} por semana`;


/* ============================================================
   Navegación
   ============================================================ */
let borrador = null;      // inventario en captura
let reporteActual = null; // { inv, estrategia, esNuevo }

function irA(id) {
  $$('.pantalla').forEach(p => p.classList.toggle('activa', p.id === id));
  $$('#tabs button').forEach(b => b.classList.toggle('activa', b.dataset.tab === id));
  $('#tabs').hidden = (id === 'p-captura' || id === 'p-reporte');
  const sc = $('#' + id + ' .scroll');
  if (sc) sc.scrollTop = 0;
}

$$('#tabs button').forEach(b => b.addEventListener('click', () => {
  const t = b.dataset.tab;
  if (t === 'p-inicio') pintarInicio();
  if (t === 'p-historial') pintarHistorial();
  if (t === 'p-catalogo') pintarCatalogo();
  irA(t);
}));


/* ============================================================
   Pantalla: Inicio
   ============================================================ */
function pintarInicio() {
  const ult = Store.ultimo();
  const cats = Store.categoriasOrdenadas();

  let html = `
    <div class="hero">
      <div class="hero-icono">${ICONOS.caja}</div>
      <div>
        <h2>Control de Inventario</h2>
        <p>${Store.totalActivos()} productos activos</p>
      </div>
    </div>
    <button class="btn-grande" id="btn-nuevo" ${Store.totalActivos() ? '' : 'disabled'}>
      ${ICONOS.mas}<span>Levantar inventario</span>${ICONOS.flecha}
    </button>`;

  if (ult) {
    html += `
      <div class="tarjeta tocable" id="tar-ultimo">
        <p class="rotulo">Último inventario</p>
        <div style="font-size:15px;font-weight:650;margin-bottom:12px">
          ${esc(fLargo.format(ult.fecha))}
        </div>
        <div class="metricas">
          <div class="metrica"><b>${totalUnidades(ult)}</b><span>unidades</span></div>
          <div class="metrica"><b style="color:var(--azul)">${capturadas(ult).length}</b><span>capturados</span></div>
          <div class="metrica"><b style="color:${enCero(ult) ? 'var(--rojo)' : 'var(--verde)'}">${enCero(ult)}</b><span>en cero</span></div>
        </div>
        ${Store.inventarios.length >= 2
          ? `<p style="margin:12px 0 0;font-size:12px;color:var(--verde);font-weight:600">
               ${Store.inventarios.length} inventarios acumulados — el análisis ya usa tu historial</p>` : ''}
      </div>`;
  }

  html += tarjetaResumen();

  html += `<div class="tarjeta"><p class="rotulo">Catálogo</p>`;
  if (!cats.length) {
    html += `<p style="margin:0;font-size:13.5px;color:var(--gris)">Sin categorías. Créalas en la pestaña Catálogo.</p>`;
  } else {
    cats.forEach(c => {
      html += `<div style="display:flex;align-items:center;gap:9px;padding:5px 0">
        <span style="width:7px;height:7px;border-radius:50%;background:var(--rojo)"></span>
        <span style="flex:1;font-size:14.5px">${esc(c.nombre)}</span>
        <b style="font-size:14.5px;color:var(--gris);font-variant-numeric:tabular-nums">${Store.productosDe(c.id, true).length}</b>
      </div>`;
    });
  }
  html += `</div>`;

  $('#cuerpo-inicio').innerHTML = html;

  $('#btn-nuevo')?.addEventListener('click', iniciarCaptura);
  $('#tar-ultimo')?.addEventListener('click', () => abrirReporte(Store.ultimo(), false));
}


/* ---------- Resumen inteligente de Inicio ---------- */

const RES = {
  baja:    { c: 'var(--azul)',  i: '↓' },
  sube:    { c: 'var(--verde)', i: '↑' },
  igual:   { c: 'var(--gris)',  i: '=' },
  critico: { c: 'var(--rojo)',  i: '!' },
  alto:    { c: 'var(--ambar)', i: '!' },
  bien:    { c: 'var(--verde)', i: '✓' },
  info:    { c: 'var(--gris)',  i: '·' }
};

function lineaResumen(tipo, titulo, detalle) {
  const r = RES[tipo] || RES.info;
  return `<div class="res-linea" style="--c:${r.c}">
    <span class="res-icono">${r.i}</span>
    <div class="res-txt">
      <b>${esc(titulo)}</b>
      ${detalle ? `<span>${esc(detalle)}</span>` : ''}
    </div>
  </div>`;
}

/** Estado actual con un conteo; tendencias y comparaciones cuando hay historial. */
function tarjetaResumen() {
  const ult = Store.ultimo();
  if (!ult) return '';

  const previos = Store.previos(ult);
  const dias = Math.floor((Date.now() - ult.fecha) / DIA);
  const cuando = dias <= 0 ? 'hoy' : dias === 1 ? 'ayer' : `hace ${dias} días`;

  let filas = '';

  // Movimiento neto contra el conteo anterior
  if (previos.length) {
    const ahora = totalUnidades(ult), antes = totalUnidades(previos[0]);
    const d = ahora - antes;
    const pct = antes ? Math.round(Math.abs(d) / antes * 100) : 0;
    const entre = Math.max(1, Math.round((ult.fecha - previos[0].fecha) / DIA));
    const lapso = `en ${entre} día${entre === 1 ? '' : 's'}`;

    if (d < 0) {
      filas += lineaResumen('baja', `Salieron ${Math.abs(d)} unidades`,
        `${pct}% menos que el conteo anterior, ${lapso}`);
    } else if (d > 0) {
      filas += lineaResumen('sube', `Entraron ${d} unidades`,
        `${pct}% más que el conteo anterior — hubo resurtido`);
    } else {
      filas += lineaResumen('igual', 'El total no se movió',
        `Mismas unidades que el conteo anterior, ${lapso}`);
    }
  }

  // Lo que exige acción, tomado del mismo motor que el reporte
  const est = generarEstrategia(ult, previos);
  const urgentes = est.hallazgos.filter(h => h.severidad === 'critico' || h.severidad === 'alto');

  urgentes.slice(0, 2).forEach(h => {
    const primero = (h.detalle || '').split('\n')[0].replace(/^•\s*/, '');
    filas += lineaResumen(h.severidad, h.titulo, primero);
  });

  if (!urgentes.length) {
    filas += lineaResumen('bien', 'Sin focos rojos',
      'Ningún producto en cero ni por agotarse.');
  }

  // Qué falta para que el análisis sea de tendencia
  if (previos.length < 2) {
    const faltan = 2 - previos.length;
    filas += lineaResumen('info',
      `${faltan} conteo${faltan === 1 ? '' : 's'} más para ver tendencia`,
      'Con tres mediciones se detecta producto estancado y rotación estable.');
  }

  return `<div class="tarjeta">
    <p class="rotulo">Resumen<span class="sub">Último conteo ${cuando}</span></p>
    ${filas}
  </div>`;
}


/* ============================================================
   Pantalla: Captura
   ============================================================ */
function iniciarCaptura() {
  borrador = Store.nuevoInventario();
  pintarCaptura();
  irA('p-captura');
}

function pintarCaptura() {
  const grupos = agrupar(borrador.lineas);
  let html = '';

  for (const [cat, lineas] of grupos) {
    const hechos = lineas.filter(l => l.cantidad !== null).length;
    html += `<div class="grupo">
      <div class="grupo-cab">
        <span class="nombre">${esc(cat)}</span>
        <span class="cuenta" data-cuenta="${esc(cat)}">${hechos}/${lineas.length}</span>
      </div>
      <div class="grupo-cuerpo">`;

    for (const l of lineas) {
      html += filaCaptura(l);
    }
    html += `</div></div>`;
  }

  html += `<div class="grupo">
    <div class="grupo-cab"><span class="nombre">Observaciones generales</span></div>
    <div class="grupo-cuerpo" style="padding:12px">
      <textarea id="nota-general" placeholder="Nota general del inventario (opcional)"
        style="width:100%;border:0;background:none;font:15px/1.45 inherit;font-family:inherit;resize:vertical;min-height:62px;color:var(--tinta)">${esc(borrador.notaGeneral)}</textarea>
    </div>
  </div>`;

  $('#cuerpo-captura').innerHTML = html;
  $('#nota-general').addEventListener('input', e => { borrador.notaGeneral = e.target.value; });

  $$('#cuerpo-captura input.cantidad').forEach(inp => {
    inp.addEventListener('input', e => {
      const l = borrador.lineas.find(x => x.id === e.target.dataset.id);
      let v = e.target.value.replace(/\D/g, '').slice(0, 6);
      if (e.target.value !== v) e.target.value = v;
      l.cantidad = v === '' ? null : parseInt(v, 10);
      actualizarFila(l);
      actualizarProgreso();
    });
    inp.addEventListener('focus', e => e.target.select());
  });

  $$('#cuerpo-captura textarea.obs').forEach(ta => {
    ajustarAlto(ta);
    ta.addEventListener('input', e => {
      const l = borrador.lineas.find(x => x.id === e.target.dataset.obs);
      l.observaciones = e.target.value;
      ajustarAlto(e.target);
    });
  });

  actualizarProgreso();
}

/** Crece a lo alto según el texto; nunca aparece barra horizontal. */
function ajustarAlto(ta) {
  ta.style.height = 'auto';
  ta.style.height = ta.scrollHeight + 'px';
}

function filaCaptura(l) {
  const clase = l.cantidad === null || l.cantidad === undefined ? ''
    : (l.cantidad === 0 ? 'cero' : 'ok');
  return `<div class="fila" data-fila="${l.id}">
    <span class="punto ${clase}"></span>
    <div class="nombre">
      <span class="titulo-prod">${esc(l.nombreProducto)}</span>
      <textarea class="obs" data-obs="${l.id}" rows="1"
                placeholder="Observaciones (opcional)">${esc(l.observaciones)}</textarea>
    </div>
    <input class="cantidad" data-id="${l.id}" type="text" inputmode="numeric"
           pattern="[0-9]*" placeholder="" value="${l.cantidad ?? ''}">
  </div>`;
}

function actualizarFila(l) {
  const fila = $(`[data-fila="${l.id}"]`); if (!fila) return;
  const punto = $('.punto', fila);
  punto.className = 'punto ' + (l.cantidad === null || l.cantidad === undefined ? ''
    : (l.cantidad === 0 ? 'cero' : 'ok'));

  // contador del grupo
  const grupo = borrador.lineas.filter(x => x.nombreCategoria === l.nombreCategoria);
  const cnt = $(`[data-cuenta="${CSS.escape(l.nombreCategoria)}"]`);
  if (cnt) cnt.textContent = `${grupo.filter(x => x.cantidad !== null).length}/${grupo.length}`;
}

function actualizarProgreso() {
  const n = capturadas(borrador).length, t = borrador.lineas.length;
  $('#progreso-texto').textContent = `${n} de ${t} capturados`;
  $('#progreso-unidades').textContent = `${totalUnidades(borrador)} unidades`;
  $('#progreso-barra').style.width = (t ? n / t * 100 : 0) + '%';
  $('#guardar-captura').disabled = n === 0;
}

$('#cancelar-captura').addEventListener('click', () => {
  if (!capturadas(borrador).length) { borrador = null; pintarInicio(); irA('p-inicio'); return; }
  modalConfirmar({
    titulo: 'Descartar conteo',
    ayuda: 'Tienes cantidades capturadas que aún no se han guardado.',
    textoOK: 'Descartar', peligro: true,
    onOK: () => { borrador = null; pintarInicio(); irA('p-inicio'); }
  });
});

$('#guardar-captura').addEventListener('click', () => {
  document.activeElement?.blur();
  Store.guardarInventario(borrador);
  const guardado = borrador;
  borrador = null;
  abrirReporte(guardado, true);
});

function agrupar(lineas) {
  const orden = [], mapa = new Map();
  for (const l of lineas) {
    if (!mapa.has(l.nombreCategoria)) { orden.push(l.nombreCategoria); mapa.set(l.nombreCategoria, []); }
    mapa.get(l.nombreCategoria).push(l);
  }
  return orden.map(c => [c, mapa.get(c)]);
}


/* ============================================================
   Pantalla: Reporte
   ============================================================ */
function abrirReporte(inv, esNuevo) {
  const estrategia = generarEstrategia(inv, Store.previos(inv));
  reporteActual = { inv, estrategia, esNuevo };
  pintarReporte();
  irA('p-reporte');
}

function pintarReporte() {
  const { inv, estrategia, esNuevo } = reporteActual;

  let html = '';
  if (esNuevo) html += `<p style="margin:0 0 4px;font-size:13px;font-weight:650;color:var(--verde)">✓ Guardado correctamente</p>`;
  html += `<h2 style="margin:0 0 14px;font-size:20px;font-weight:700;letter-spacing:-.3px">${esc(fLargo.format(inv.fecha))}</h2>`;

  html += `<div class="tarjeta"><div class="metricas">
      <div class="metrica"><b>${totalUnidades(inv)}</b><span>unidades</span></div>
      <div class="metrica"><b style="color:var(--azul)">${capturadas(inv).length}</b><span>productos</span></div>
      <div class="metrica"><b style="color:${enCero(inv) ? 'var(--rojo)' : 'var(--verde)'}">${enCero(inv)}</b><span>en cero</span></div>
    </div></div>`;

  html += `<div style="display:flex;align-items:center;gap:8px;margin:18px 0 9px">
      <p class="rotulo" style="margin:0;flex:1">Estrategia<span class="sub">${esc(estrategia.profundidad)}</span></p>
      ${estrategia.inventariosPrevios > 0
        ? `<span class="insignia">${estrategia.inventariosPrevios + 1} conteos</span>` : ''}
    </div>`;

  html += `<div class="tarjeta"><p style="margin:0;font-size:14.5px;line-height:1.5">${esc(estrategia.resumen)}</p></div>`;

  for (const h of estrategia.hallazgos) {
    html += `<div class="tarjeta hallazgo sev-${h.severidad}">
      <div class="sev">${ICONO_SEV[h.severidad]}${esc(ETIQUETA_SEV[h.severidad])}</div>
      <h3>${esc(h.titulo)}</h3>
      ${h.detalle ? `<div class="detalle">${esc(h.detalle)}</div>` : ''}
      <div class="accion">${esc(h.accion)}</div>
    </div>`;
  }

  html += `<p class="rotulo" style="margin:20px 0 9px">Detalle del conteo</p>
    <div class="tarjeta sin-aire">`;
  for (const [cat, lineas] of agrupar(capturadas(inv))) {
    html += `<div style="padding:13px 14px 6px;font-size:11px;font-weight:800;letter-spacing:.6px;color:var(--rojo)">${esc(cat)}</div>`;
    for (const l of lineas) {
      html += `<div style="display:flex;justify-content:space-between;gap:12px;padding:6px 14px;font-size:14px">
        <span>${esc(l.nombreProducto)}${l.observaciones
          ? `<div style="font-size:11.5px;color:var(--gris);margin-top:2px">${esc(l.observaciones)}</div>` : ''}</span>
        <b style="font-variant-numeric:tabular-nums;color:${l.cantidad === 0 ? 'var(--rojo)' : 'inherit'}">${l.cantidad}</b>
      </div>`;
    }
  }
  if (inv.notaGeneral) {
    html += `<div style="border-top:1px solid var(--borde);margin-top:10px;padding:13px 14px">
      <div style="font-size:10.5px;font-weight:800;color:var(--gris);letter-spacing:.5px">NOTA GENERAL</div>
      <div style="font-size:13.5px;margin-top:4px">${esc(inv.notaGeneral)}</div></div>`;
  } else html += `<div style="height:10px"></div>`;
  html += `</div>`;

  html += `<div style="margin-top:16px">
      <button class="btn-secundario relleno" id="btn-pdf">${ICONOS.pdf}Guardar / imprimir PDF</button>
      <button class="btn-secundario" id="btn-texto">${ICONOS.texto}Compartir como texto</button>
    </div>`;

  $('#cuerpo-reporte').innerHTML = html;
  $('#btn-pdf').addEventListener('click', () => window.print());
  $('#btn-texto').addEventListener('click', compartirTexto);
}

$('#volver-reporte').addEventListener('click', () => {
  const eraNuevo = reporteActual?.esNuevo;
  reporteActual = null;
  if (eraNuevo) { pintarInicio(); irA('p-inicio'); }
  else { pintarHistorial(); irA('p-historial'); }
});

function textoReporte() {
  const { inv, estrategia } = reporteActual;
  const L = ['INVENTARIO', fLargo.format(inv.fecha), '—'.repeat(26),
    `Productos capturados: ${capturadas(inv).length}`,
    `Unidades totales: ${totalUnidades(inv)}`,
    `En cero: ${enCero(inv)}`, ''];

  for (const [cat, lineas] of agrupar(capturadas(inv))) {
    L.push('', cat.toUpperCase());
    lineas.forEach(l => L.push(`  ${l.nombreProducto}: ${l.cantidad}`
      + (l.observaciones ? `  — ${l.observaciones}` : '')));
  }
  if (inv.notaGeneral) L.push('', 'NOTA GENERAL', inv.notaGeneral);

  L.push('', '—'.repeat(26), `ESTRATEGIA — ${estrategia.profundidad.toUpperCase()}`, estrategia.resumen);
  estrategia.hallazgos.forEach(h => {
    L.push('', `[${ETIQUETA_SEV[h.severidad].toUpperCase()}] ${h.titulo}`);
    if (h.detalle) L.push(h.detalle);
    L.push('→ ' + h.accion);
  });
  return L.join('\n');
}

async function compartirTexto() {
  const texto = textoReporte();
  try {
    if (navigator.share) { await navigator.share({ title: 'Inventario', text: texto }); return; }
    await navigator.clipboard.writeText(texto);
    aviso('Reporte copiado al portapapeles');
  } catch (e) {
    if (e && e.name === 'AbortError') return;
    try { await navigator.clipboard.writeText(texto); aviso('Reporte copiado'); }
    catch { aviso('No se pudo compartir'); }
  }
}


/* ============================================================
   Pantalla: Historial
   ============================================================ */
function pintarHistorial() {
  const lista = Store.recientes();

  if (!lista.length) {
    $('#cuerpo-historial').innerHTML = `<div class="vacio">
      ${ICONOS.reloj}<h3>Sin inventarios</h3>
      <p>Los conteos que guardes aparecerán aquí con su fecha y hora,
         y se usarán para afinar la estrategia.</p></div>`;
    return;
  }

  let html = `<div class="tarjeta sin-aire">`;
  lista.forEach(inv => {
    html += `<div class="item-hist tocable" data-inv="${inv.id}">
      <div class="txt">
        <div class="fecha">${esc(fCorto.format(inv.fecha))}</div>
        <div class="meta">${totalUnidades(inv)} unidades · ${capturadas(inv).length} productos${
          enCero(inv) ? ` · <span class="rojo">${enCero(inv)} en cero</span>` : ''}</div>
      </div>
      <button class="btn-menu" data-borrar="${inv.id}" aria-label="Eliminar">${ICONOS.menu}</button>
      ${ICONOS.chevron}
    </div>`;
  });
  html += `</div>
    <p style="font-size:12.5px;color:var(--gris);padding:4px 4px 0;line-height:1.5">${
      lista.length >= 3
        ? `Con ${lista.length} inventarios la estrategia ya detecta tendencia, rotación y producto estancado.`
        : 'Acumula al menos 3 inventarios para que la estrategia detecte producto estancado y tendencia.'}</p>`;

  $('#cuerpo-historial').innerHTML = html;

  $$('#cuerpo-historial [data-inv]').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('[data-borrar]')) return;
      abrirReporte(Store.inventarios.find(i => i.id === el.dataset.inv), false);
    });
  });
  $$('#cuerpo-historial [data-borrar]').forEach(b => {
    b.addEventListener('click', e => {
      e.stopPropagation();
      modalConfirmar({
        titulo: 'Eliminar inventario',
        ayuda: 'Se borra este conteo y deja de usarse en el análisis. No se puede deshacer.',
        textoOK: 'Eliminar', peligro: true,
        onOK: () => { Store.eliminarInventario(b.dataset.borrar); pintarHistorial(); aviso('Inventario eliminado'); }
      });
    });
  });
}


/* ============================================================
   Pantalla: Catálogo
   ============================================================ */
function pintarCatalogo() {
  const cats = Store.categoriasOrdenadas();
  let html = '';

  if (!cats.length) {
    html = `<div class="vacio"><h3>Catálogo vacío</h3>
      <p>Crea tu primera categoría con el botón «+ Categoría» de arriba.</p></div>`;
  }

  cats.forEach(cat => {
    const prods = Store.productosDe(cat.id);
    html += `<div class="grupo">
      <div class="grupo-cab">
        <span class="nombre">${esc(cat.nombre)}</span>
        <button class="btn-menu" data-cat-menu="${cat.id}" aria-label="Opciones">${ICONOS.menu}</button>
      </div>
      <div class="grupo-cuerpo">`;

    prods.forEach(p => {
      html += `<div class="fila-prod tocable ${p.activo ? '' : 'inactivo'}" data-prod="${p.id}">
        <span class="punto ${p.activo ? 'ok' : ''}"></span>
        <span class="nombre">${esc(p.nombre)}</span>
        ${p.activo ? '' : '<span class="etiqueta-off">Inactivo</span>'}
        ${ICONOS.chevron}
      </div>`;
    });

    html += `<button class="btn-agregar" data-add="${cat.id}">${ICONOS.mas}Agregar producto</button>
      </div></div>`;
  });

  html += `<p style="font-size:12.5px;color:var(--gris);padding:4px;line-height:1.5">
    Los productos desactivados no aparecen al levantar inventario, pero se conservan
    en los reportes anteriores.</p>`;

  $('#cuerpo-catalogo').innerHTML = html;

  $$('[data-prod]').forEach(el => el.addEventListener('click',
    () => modalProducto(Store.productos.find(p => p.id === el.dataset.prod))));
  $$('[data-add]').forEach(b => b.addEventListener('click',
    () => modalProducto(null, b.dataset.add)));
  $$('[data-cat-menu]').forEach(b => b.addEventListener('click',
    () => modalCategoria(Store.categorias.find(c => c.id === b.dataset.catMenu))));
}

$('#nueva-categoria').addEventListener('click', () => modalCategoria(null));


/* ============================================================
   Modales
   ============================================================ */
function abrirModal(html) {
  $('#modal').innerHTML = html;
  $('#velo').hidden = false;
  document.body.style.overflow = 'hidden';
}
function cerrarModal() {
  $('#velo').hidden = true;
  $('#modal').innerHTML = '';
  document.body.style.overflow = '';
}
$('#velo').addEventListener('click', e => { if (e.target.id === 'velo') cerrarModal(); });

function modalProducto(prod, catIDporDefecto) {
  const cats = Store.categoriasOrdenadas();
  if (!cats.length) { aviso('Primero crea una categoría'); return; }
  const actual = prod ? prod.categoriaID : catIDporDefecto;

  abrirModal(`
    <h2>${prod ? 'Editar producto' : 'Nuevo producto'}</h2>
    <label for="m-nombre">Nombre</label>
    <input type="text" id="m-nombre" placeholder="Ej. Coca 600 ml" value="${esc(prod?.nombre || '')}">
    <label for="m-cat">Categoría</label>
    <select id="m-cat">
      ${cats.map(c => `<option value="${c.id}" ${c.id === actual ? 'selected' : ''}>${esc(c.nombre)}</option>`).join('')}
    </select>
    ${prod ? `<label class="interruptor" style="text-transform:none;letter-spacing:0;font-weight:500;color:var(--tinta)">
        <span>Activo en el inventario</span>
        <input type="checkbox" id="m-activo" ${prod.activo ? 'checked' : ''}>
      </label>` : ''}
    <div class="modal-botones">
      <button class="b-cancelar" id="m-cancelar">Cancelar</button>
      <button class="b-ok" id="m-ok">Guardar</button>
    </div>
    ${prod ? `<div class="modal-botones"><button class="b-borrar" id="m-borrar">Eliminar producto</button></div>` : ''}`);

  const inp = $('#m-nombre');
  inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length);

  $('#m-cancelar').onclick = cerrarModal;
  $('#m-ok').onclick = () => {
    const nombre = $('#m-nombre').value.trim();
    if (!nombre) { aviso('Escribe un nombre'); return; }
    const cat = $('#m-cat').value;
    if (prod) {
      Store.actualizarProducto(prod.id, nombre, cat);
      if ($('#m-activo').checked !== prod.activo) Store.alternarActivo(prod.id);
    } else Store.agregarProducto(nombre, cat);
    cerrarModal(); pintarCatalogo();
    aviso(prod ? 'Producto actualizado' : 'Producto agregado');
  };
  if (prod) $('#m-borrar').onclick = () => {
    cerrarModal();
    modalConfirmar({
      titulo: 'Eliminar producto',
      ayuda: `«${prod.nombre}» se quita del catálogo. Los inventarios ya guardados no se modifican.`,
      textoOK: 'Eliminar', peligro: true,
      onOK: () => { Store.eliminarProducto(prod.id); pintarCatalogo(); aviso('Producto eliminado'); }
    });
  };
}

function modalCategoria(cat) {
  abrirModal(`
    <h2>${cat ? 'Editar categoría' : 'Nueva categoría'}</h2>
    <label for="m-nombre">Nombre</label>
    <input type="text" id="m-nombre" placeholder="Ej. COCA SABOR" value="${esc(cat?.nombre || '')}">
    <div class="modal-botones">
      <button class="b-cancelar" id="m-cancelar">Cancelar</button>
      <button class="b-ok" id="m-ok">Guardar</button>
    </div>
    ${cat ? `<div class="modal-botones"><button class="b-borrar" id="m-borrar">Eliminar categoría</button></div>` : ''}`);

  $('#m-nombre').focus();
  $('#m-cancelar').onclick = cerrarModal;
  $('#m-ok').onclick = () => {
    const nombre = $('#m-nombre').value.trim();
    if (!nombre) { aviso('Escribe un nombre'); return; }
    if (cat) Store.renombrarCategoria(cat.id, nombre);
    else Store.agregarCategoria(nombre);
    cerrarModal(); pintarCatalogo();
  };
  if (cat) $('#m-borrar').onclick = () => {
    cerrarModal();
    modalConfirmar({
      titulo: 'Eliminar categoría',
      ayuda: `Se elimina «${cat.nombre}» y todos sus productos. Los inventarios ya guardados no se modifican.`,
      textoOK: 'Eliminar', peligro: true,
      onOK: () => { Store.eliminarCategoria(cat.id); pintarCatalogo(); aviso('Categoría eliminada'); }
    });
  };
}

function modalConfirmar({ titulo, ayuda, textoOK, onOK }) {
  abrirModal(`
    <h2>${esc(titulo)}</h2>
    <p class="ayuda">${esc(ayuda)}</p>
    <div class="modal-botones">
      <button class="b-cancelar" id="m-cancelar">Cancelar</button>
      <button class="b-ok" id="m-ok">${esc(textoOK)}</button>
    </div>`);
  $('#m-cancelar').onclick = cerrarModal;
  $('#m-ok').onclick = () => { cerrarModal(); onOK(); };
}


/* ============================================================
   Arranque
   ============================================================ */
Store.cargar();
pintarInicio();
irA('p-inicio');


if ('serviceWorker' in navigator) {
  addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('sw.js');
      await navigator.serviceWorker.ready;
      // Confirmación única: sin esto no hay forma de saber en qué momento
      // la app ya quedó guardada y se puede trabajar sin conexión.
      if (!localStorage.getItem('inv.listaOffline')) {
        localStorage.setItem('inv.listaOffline', '1');
        aviso('App guardada en el dispositivo. Ya funciona sin internet.');
      }
    } catch {}
  });
}
