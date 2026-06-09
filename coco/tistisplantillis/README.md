# Nodo Studio — Template Barba.js + GSAP + PJAX

Template profesional y modular que convierte cualquier sitio HTML estático en una SPA con transiciones fluidas, sin sacrificar SEO ni rendimiento.

---

## Stack

| Tecnología | Versión | Función |
|---|---|---|
| **Barba.js** | 2.9.7 | PJAX — intercepta navegación, carga AJAX, gestiona histórico |
| **GSAP** | 3.12.5 | Animaciones 60fps, timelines, page transitions |
| **ScrollTrigger** | 3.12.5 (plugin GSAP) | Animaciones al scroll |
| HTML/CSS/JS | Vanilla | Sin framework JS, máxima compatibilidad |

---

## Estructura

```
template-barba-gsap/
├── index.html                  ← Home (data-barba-namespace="home")
├── css/
│   ├── base.css                ← Variables CSS, reset, tipografía, utilidades
│   ├── components.css          ← Header, nav, botones, cards, formularios, footer
│   ├── animations.css          ← Loader, overlay, estados iniciales GSAP
│   └── responsive.css          ← Media queries (desktop → mobile)
├── js/
│   ├── main.js                 ← Orquestador / entry point
│   ├── barba-setup.js          ← Configuración Barba.js + transiciones
│   ├── gsap-animations.js      ← Timelines GSAP, ScrollTrigger, hero entrance
│   ├── page-loader.js          ← Loader inicial (2.5s mínimo)
│   └── utils.js                ← Helpers, meta updater, eventos UI
└── pages/
    ├── servicios.html          ← namespace="servicios"
    ├── proyectos.html          ← namespace="proyectos"
    ├── precios.html            ← namespace="precios"
    ├── faq.html                ← namespace="faq" + accordion
    └── contacto.html           ← namespace="contacto" + form
```

---

## Cómo funciona (flujo completo)

```
1. Usuario abre el sitio
        ↓
2. Loader aparece (min 2.5s)
        ↓
3. GSAP + Barba inicializan
        ↓
4. Loader desaparece → animatePageIn() + animateHero()
        ↓
5. initScrollAnimations() → [data-animate] y [data-stagger] se activan

─────── Siguiente navegación ────────

6. Usuario hace clic en un enlace
        ↓
7. Barba intercepta (no reload)
        ↓
8. animatePageOut() → fade out del contenedor actual
        ↓
9. overlayIn() → flash screen cubre la pantalla
        ↓
10. Barba carga nuevo HTML vía AJAX
        ↓
11. window.scrollTo(0,0) — scroll al top
        ↓
12. overlayOut() → fade out del overlay
        ↓
13. animatePageIn() → fade in del nuevo contenedor
        ↓
14. runPageInit() → ScrollTrigger reinicia, hero anima, cards reinician
        ↓
15. URL y title actualizados automáticamente por Barba
```

---

## HTML requerido por página

**Obligatorio en cada página:**

```html
<html data-barba="wrapper">          <!-- en el <html> tag -->
  <body>
    <header> ... </header>           <!-- FUERA del container — no se recarga -->

    <main data-barba="container"
          data-barba-namespace="mi-pagina">   <!-- ÚNICO elemento que Barba reemplaza -->
      <div class="page-content">
        <!-- todo el contenido de la página aquí -->
      </div>
    </main>

    <footer> ... </footer>           <!-- FUERA del container — no se recarga -->
    <script type="module" src="./js/main.js"></script>
  </body>
</html>
```

**Namespaces usados:**
- `home` → index.html
- `servicios`, `proyectos`, `precios`, `faq`, `contacto` → pages/

---

## Sistema de animaciones

### Animación de página

```javascript
// animatePageIn — llamado después de cada transición
animatePageIn(container)   // fade in + translateY del container

// animatePageOut — llamado antes de dejar la página
animatePageOut(container)  // fade out + translateY hacia arriba
```

### Elementos scroll-animados

Añade estos atributos al HTML para activar animaciones automáticas:

```html
<!-- Fade up (default) -->
<div data-animate>...</div>

<!-- Variantes -->
<div data-animate="fade">...</div>         <!-- solo opacity -->
<div data-animate="slide-left">...</div>   <!-- desde la izquierda -->
<div data-animate="slide-right">...</div>  <!-- desde la derecha -->
<div data-animate="scale">...</div>        <!-- escala + opacity -->

<!-- Stagger group — anima los hijos con delay entre cada uno -->
<div data-stagger="0.1">
  <div>hijo 1</div>
  <div>hijo 2</div>
  <div>hijo 3</div>
</div>

<!-- Contador animado -->
<span data-counter="42" data-suffix="%">0%</span>
```

### Hero entrance

Cualquier página con una sección `.hero` activa `animateHero()` automáticamente. Añade estas clases para controlar el orden de entrada:

```html
.hero__eyebrow    → entra primero
.hero__title      → entra segundo
.hero__subtitle   → entra tercero
.hero__actions    → entra cuarto
.hero__visual     → entra último (scale)
```

---

## Configuración

En `js/main.js`, ajusta el objeto `CONFIG`:

```javascript
const CONFIG = {
  loaderDuration:          2500,   // ms — duración mínima del loader inicial
  pageTransitionDuration:  0.4,    // s  — duración por defecto de transiciones
  staggerDelay:            0.1,    // s  — delay entre elementos staggered
  enableScrollAnimations:  true,   // activar/desactivar scroll animations
  enableCursorGlow:        true,   // efecto glow que sigue al cursor
  enablePrefetch:          true,   // Barba prefetch en hover
};
```

### Variables CSS (en `css/base.css`)

```css
:root {
  --clr-primary:       #4e53be;   /* Cambiar para otro proyecto */
  --clr-primary-light: #6c72e5;
  --trans-base:        0.4s var(--ease-out);
  --loader-duration:   2.5s;
  /* etc. */
}
```

---

## Añadir una página nueva

1. Copia `pages/servicios.html` como base
2. Cambia `data-barba-namespace="nuevo-nombre"`
3. Actualiza `<title>` y meta tags
4. Añade el enlace en el header/footer de todas las páginas
5. Si tiene lógica especial, añade una view en `barba-setup.js`:

```javascript
{
  namespace: 'nuevo-nombre',
  afterEnter({ next }) {
    // lógica específica de la página
  }
}
```

---

## Performance

- **Barba cachea** las páginas visitadas por defecto — no recarga AJAX si el usuario vuelve atrás
- **ScrollTrigger.kill()** previene memory leaks en cada transición
- **will-change** aplicado solo a elementos que animan (container, [data-animate])
- **Reduced motion**: si el usuario tiene `prefers-reduced-motion: reduce`, todas las animaciones se omiten
- **Responsive**: duraciones de animación escalan según breakpoint (mobile: 0.2-0.4s, desktop: 0.6-0.85s)

---

## Adaptar para Hitachi / La Chiquitana / otros clientes

1. **Colores**: Cambia `--clr-primary` y `--clr-primary-light` en `base.css`
2. **Fuentes**: Cambia el Google Fonts import y `--font-main`
3. **Loader**: El box con gradient usa los colores primarios — cambia automáticamente
4. **Namespaces**: Nómbralos según las páginas del proyecto (e.g. `implantes`, `servicios`, `contacto`)
5. **Contenido**: Reemplaza texto y secciones — la arquitectura JS no depende del contenido

---

## Debugging

```javascript
// Ver todas las transiciones Barba en consola
barba.on('*', (e) => console.log('[Barba]', e));

// Ver todos los ScrollTriggers activos
ScrollTrigger.getAll().forEach(t => console.log(t.trigger, t));

// Medir duración de una transición
barba.hooks.before(() => console.time('transition'));
barba.hooks.after(() => console.timeEnd('transition'));
```

---

## Checklist de deploy

- [ ] Cambiar colores en `:root` para el cliente
- [ ] Actualizar todos los `<title>` y meta descriptions
- [ ] Verificar que `data-barba-namespace` es único en cada página
- [ ] Probar botones Atrás/Adelante del navegador
- [ ] Probar en mobile (menú hamburguesa, animaciones reducidas)
- [ ] Verificar que Google Analytics (si aplica) recibe pageviews en transiciones Barba
- [ ] Comprobar que el form de contacto envía correctamente
- [ ] Lighthouse: apuntar a 90+ en Performance

---

*Nodo Studio — L'Hospitalet de Llobregat, Barcelona*
