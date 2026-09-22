# Control de Inventario

App web instalable (PWA) para levantar inventario sin internet y generar
estrategia de venta a partir de los conteos acumulados.

- 23 productos precargados en 3 categorías (COCA, CIEL, COCA SABOR)
- Catálogo editable: agregar, renombrar, cambiar de categoría, desactivar, eliminar
- Solo pide cantidad; las observaciones son opcionales
- Cada conteo guarda fecha y hora automáticamente
- Estrategia progresiva: con 1 conteo analiza la situación; con 2+ calcula
  rotación, días de cobertura, producto estancado y sobrestock
- Exporta a PDF (imprimir) o comparte como texto
- 100% offline: los datos viven en el navegador del dispositivo

---

## Publicar

La app necesita una dirección **https** para poder instalarse y funcionar
sin conexión (Safari solo activa el modo offline en sitios seguros).

### Opción A — Netlify Drop (más rápido, sin cuenta)

1. Entra a `app.netlify.com/drop`
2. Arrastra la carpeta `InventarioWeb` completa
3. Te da una dirección https al instante

### Opción B — GitHub Pages (permanente, gratis)

1. Crea un repositorio nuevo en GitHub
2. Sube el contenido de esta carpeta
3. En *Settings → Pages*, elige la rama `main` y carpeta `/ (root)`
4. Tu dirección queda como `https://<usuario>.github.io/<repo>/`

---

## Instalar en el iPad o iPhone

1. Abre la dirección https en **Safari** (no Chrome — solo Safari puede instalar)
2. Toca el botón **Compartir** (cuadro con flecha hacia arriba)
3. Elige **Agregar a pantalla de inicio**
4. Ábrela desde el ícono. A partir de ahí funciona sin internet.

La primera vez debe abrirse con conexión para guardar la app en el dispositivo.
Después ya no la necesita.

---

## Notas

- Los datos se guardan en el dispositivo donde usas la app. No se sincronizan
  entre el iPad y el iPhone: cada uno lleva su propio inventario.
- Para respaldar, usa **Compartir como texto** en cualquier reporte.
- Si actualizas los archivos, sube también el número de versión en
  `index.html` (`?v=5`) y en `sw.js` (`inventario-v5`) para que el
  dispositivo tome la versión nueva.

---

## Estructura

```
index.html      pantallas y navegación
styles.css      diseño
app.js          datos, motor de estrategia y render
sw.js           service worker (modo offline)
manifest.json   ícono, nombre y pantalla completa
icons/          íconos de la app
```
