/* =====================================================================
   PRESENTACIÓN · diapositivas dentro de la plataforma
   ---------------------------------------------------------------------
   Se ven en la página o a pantalla completa (sirve para compartir
   pantalla en una videollamada). Teclas: flechas para avanzar,
   E para escribir sobre la diapositiva, B para abrir el pizarrón en
   blanco y Esc para salir. Lo escrito queda guardado en cada
   diapositiva mientras la página siga abierta.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, icono } = MA;

  function crearPresentacion(raiz, { diapositivas, partes, alTerminarParte, clave = 'm1.diapositiva', etiqueta = 'Partes de las ideas clave' }) {
    let actual = MA.clamp(MA.almacen.leer(clave, 0) || 0, 0, diapositivas.length - 1);
    let presentando = false, escribiendo = false;
    const tinta = new Map();   // diapositiva -> trazos

    raiz.classList.add('pres');
    raiz.innerHTML = `
      <div class="pres-barra">
        <div class="segmentado pres-partes" role="group" aria-label="${etiqueta}">
          ${partes.map(p => `<button type="button" class="segmento" data-parte="${p.id}" aria-pressed="false">${p.nombre}<span class="texto-3">${p.minutos}</span></button>`).join('')}
        </div>
        <button type="button" class="btn btn-secundario btn-chico" data-pres="presentar">${icono('pantalla')}Pantalla completa</button>
      </div>
      <div class="pres-marco">
        <div class="pres-hoja">
          <div class="pres-escena" tabindex="0" role="region" aria-label="Diapositiva" aria-live="polite"></div>
          <canvas class="pres-tinta" aria-hidden="true"></canvas>
        </div>
        <div class="pres-control">
          <button type="button" class="btn btn-secundario btn-chico" data-pres="anterior">${icono('flechaI')}<span class="txt">Anterior</span></button>
          <div class="pres-puntos" role="group" aria-label="Ir a una diapositiva"></div>
          <button type="button" class="btn btn-chico" data-pres="siguiente"><span class="txt">Siguiente</span>${icono('flechaD')}</button>
          <span class="pres-separador" aria-hidden="true"></span>
          <button type="button" class="btn btn-fantasma btn-chico" data-pres="escribir" aria-pressed="false" title="Escribir sobre la diapositiva (E)">${icono('lapiz')}<span class="txt">Escribir</span></button>
          <button type="button" class="btn btn-fantasma btn-chico" data-pres="pizarron" title="Pizarrón en blanco (B)">${icono('pizarra')}<span class="txt">Pizarrón</span></button>
          <button type="button" class="btn-icono pres-salir" data-pres="salir" aria-label="Salir de la pantalla completa" title="Salir (Esc)">${icono('cerrar')}</button>
        </div>
        <div class="pres-tinta-barra" hidden>${MA.Pizarra.barraHtml()}</div>
      </div>
      <p class="pres-ayuda texto-3">También se avanza con las flechas del teclado. «Escribir» permite anotar sobre la diapositiva.</p>`;

    const escena = $('.pres-escena', raiz);
    const lienzo = MA.Pizarra.crearLienzo($('.pres-tinta', raiz));
    lienzo.activar(false);
    MA.Pizarra.conectarBarra($('.pres-tinta-barra', raiz), lienzo);
    const parteDe = i => partes.find(p => i >= p.desde && i <= p.hasta);

    function pintar() {
      const d = diapositivas[actual], p = parteDe(actual);
      escena.innerHTML = `
        <article class="diapo ${d.clase || ''}" aria-label="Diapositiva ${actual + 1} de ${diapositivas.length}: ${MA.esc(d.titulo)}">
          <header class="diapo-cabeza"><span>${p.corto}</span><span>${actual - p.desde + 1} de ${p.hasta - p.desde + 1}</span></header>
          <div class="diapo-cuerpo">${d.html}</div>
          <footer class="diapo-pie"><span class="diapo-marca">${icono('avion')}Misión admisión</span><span>Diapositiva ${actual + 1} de ${diapositivas.length}</span></footer>
        </article>`;
      $$('[data-parte]', raiz).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.parte === p.id)));
      $('.pres-puntos', raiz).innerHTML = diapositivas.slice(p.desde, p.hasta + 1).map((x, k) => {
        const i = p.desde + k;
        return `<button type="button" class="pres-punto" data-ir="${i}" aria-label="Diapositiva ${i + 1}: ${MA.esc(x.titulo)}" ${i === actual ? 'aria-current="step"' : ''}></button>`;
      }).join('');
      $('[data-pres="anterior"]', raiz).disabled = actual === 0;
      $('[data-pres="siguiente"]', raiz).disabled = actual === diapositivas.length - 1;
      if (!tinta.has(actual)) tinta.set(actual, []);
      lienzo.usarTrazos(tinta.get(actual));
      MA.almacen.guardar(clave, actual);
      if (actual === p.hasta && alTerminarParte) alTerminarParte(p.id);
    }
    function ir(i) { actual = MA.clamp(i, 0, diapositivas.length - 1); pintar(); }
    function irParte(id) { const p = partes.find(x => x.id === id); if (p) ir(p.desde); }
    function alternarEscritura(forzar) {
      escribiendo = typeof forzar === 'boolean' ? forzar : !escribiendo;
      raiz.classList.toggle('escribiendo', escribiendo);
      lienzo.activar(escribiendo);
      $('.pres-tinta-barra', raiz).hidden = !escribiendo;
      $('[data-pres="escribir"]', raiz).setAttribute('aria-pressed', String(escribiendo));
      requestAnimationFrame(() => lienzo.redibujar());
    }
    function presentar(si) {
      presentando = si;
      raiz.classList.toggle('presentando', si);
      document.body.classList.toggle('con-presentacion', si);
      if (si) {
        // Pantalla completa de toda la página (así el pizarrón también se ve encima). Es opcional:
        // si el navegador la rechaza, queda el modo a ventana completa.
        // Con Keyboard Lock (Chrome y Edge) la página recibe el Esc: así un Esc cierra el pizarrón sin
        // salir de la pantalla completa. Mantener Esc presionado sigue saliendo, como siempre.
        try {
          const r = document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
          if (r && r.then) r.then(() => { if (navigator.keyboard && navigator.keyboard.lock) navigator.keyboard.lock(['Escape']).catch(() => {}); }).catch(() => {});
        } catch (e) { /* sin pantalla completa */ }
        escena.focus({ preventScroll: true });
      } else {
        try { if (navigator.keyboard && navigator.keyboard.unlock) navigator.keyboard.unlock(); } catch (e) { /* nada */ }
        try { if (document.fullscreenElement) { const r = document.exitFullscreen(); if (r && r.catch) r.catch(() => {}); } } catch (e) { /* nada */ }
        raiz.scrollIntoView({ block: 'nearest' });
      }
      requestAnimationFrame(() => lienzo.redibujar());
    }
    // Si el navegador sale de pantalla completa (por ejemplo, con Esc mientras el pizarrón está
    // abierto), la presentación sigue ocupando la ventana: se cierra con otro Esc o con la ×.
    document.addEventListener('fullscreenchange', () => {
      // Sin Keyboard Lock, el Esc que saca de pantalla completa no llega a la página: se cierra también el pizarrón
      if (!document.fullscreenElement && MA.Pizarra.abierta()) MA.Pizarra.cerrar();
      requestAnimationFrame(() => lienzo.redibujar());
    });

    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b) || b.closest('.pres-tinta-barra')) return;
      if (b.dataset.parte) irParte(b.dataset.parte);
      else if (b.dataset.ir != null) ir(Number(b.dataset.ir));
      else if (b.dataset.pres === 'anterior') ir(actual - 1);
      else if (b.dataset.pres === 'siguiente') ir(actual + 1);
      else if (b.dataset.pres === 'presentar') presentar(true);
      else if (b.dataset.pres === 'salir') presentar(false);
      else if (b.dataset.pres === 'escribir') alternarEscritura();
      else if (b.dataset.pres === 'pizarron') MA.Pizarra.abrir();
    });
    document.addEventListener('keydown', e => {
      if (!presentando && !raiz.contains(document.activeElement)) return;
      if (raiz.offsetParent === null && !presentando) return;
      if (e.altKey || e.metaKey) return;
      const k = e.key;
      if (e.ctrlKey) {
        if ((k === 'z' || k === 'Z') && escribiendo) { e.preventDefault(); lienzo.deshacer(); }
        return;
      }
      if (k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && presentando)) { e.preventDefault(); ir(actual + 1); }
      else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); ir(actual - 1); }
      else if (k === 'Home' && presentando) { e.preventDefault(); ir(parteDe(actual).desde); }
      else if (k === 'End' && presentando) { e.preventDefault(); ir(parteDe(actual).hasta); }
      else if (k === 'e' || k === 'E') alternarEscritura();
      else if (k === 'b' || k === 'B') MA.Pizarra.abrir();
      else if (k === 'Escape' && presentando) presentar(false);
    });

    pintar();
    return { ir, irParte, salir: () => { if (presentando) presentar(false); } };
  }

  MA.Presentacion = { crear: crearPresentacion };
})();
