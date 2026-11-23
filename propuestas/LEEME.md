# Plantilla de propuestas

Mockup de tres páginas para enseñar a un comercio cómo se vería su web. El ejemplo relleno es Marcs Carreras (enmarcación en Sant Gervasi). La mecánica sale de las dos plantillas de Nodo: el cambio de página con barra (Barba) y el motion al entrar y al hacer scroll (GSAP). El scroll es el nativo: Lenis en la web de Nodo está apagado a propósito.

## Ver el ejemplo

Abre `marcscarreras/index.html` con un servidor estático (GitHub Pages o `python3 -m http.server` dentro de `propuestas/marcscarreras`). Barba no funciona bien si el archivo se abre con `file://`.

## El siguiente cliente

1. Copia la carpeta `marcscarreras` y ponle el nombre del comercio.
2. En las tres páginas, cambia el bloque marcado `CAMBIAR`: nombre, textos, horario, correo y teléfono. Solo datos que estén en su web o en una ficha pública.
3. En `css/shop.css`, cambia los cuatro colores del bloque `CAMBIAR`.
4. Cuando haya fotos reales, mételas en `fotos/` y sustituye el interior de cada `.art` por `<img alt="" src="fotos/pieza.jpg">`. El marco no se toca.

No hace falta tocar `js/shop.js`. El nombre del loader, la moldura, el filtro de trabajos y el formulario salen del HTML.

Páginas: inicio (oficio + moldura que se cambia), trabajos (muro filtrable), visita (horario y correo). Si un comercio no necesita el muro, se borra `obra.html` y su enlace.
