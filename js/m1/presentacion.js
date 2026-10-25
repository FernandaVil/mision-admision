/* =====================================================================
   PRESENTACIÓN · diapositivas dentro de la plataforma
   ---------------------------------------------------------------------
   Pensada para compartir pantalla en una videollamada: modo
   «Presentar» a pantalla completa, flechas del teclado para avanzar,
   N para mostrar u ocultar las notas del tutor y Esc para salir.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, icono } = MA;

  function crearPresentacion(raiz, { diapositivas, partes, notasHtml, alTerminarParte }) {
    let actual = MA.clamp(MA.almacen.leer('m1.diapositiva', 0) || 0, 0, diapositivas.length - 1);
    let conNotas = false, presentando = false;

    raiz.classList.add('pres');
    raiz.innerHTML = `
      <div class="pres-barra">
        <div class="segmentado pres-partes" role="group" aria-label="Partes de la presentación">
          ${partes.map(p => `<button type="button" class="segmento" data-parte="${p.id}" aria-pressed="false">${p.nombre}<span class="texto-3">${p.minutos}</span></button>`).join('')}
        </div>
        <div class="fila-botones">
          <button type="button" class="btn btn-secundario btn-chico" data-pres="notas" aria-pressed="false">${icono('libro')}Notas del tutor</button>
          <button type="button" class="btn btn-chico" data-pres="presentar">${icono('pantalla')}Presentar</button>
        </div>
      </div>
      <div class="pres-marco">
        <div class="pres-escena" tabindex="0" role="region" aria-label="Diapositiva" aria-live="polite"></div>
        <div class="pres-control">
          <button type="button" class="btn btn-secundario btn-chico" data-pres="anterior">${icono('flechaI')}<span class="txt">Anterior</span></button>
          <div class="pres-puntos" role="group" aria-label="Ir a una diapositiva"></div>
          <button type="button" class="btn btn-chico" data-pres="siguiente"><span class="txt">Siguiente</span>${icono('flechaD')}</button>
          <button type="button" class="btn-icono pres-salir" data-pres="salir" aria-label="Salir de la presentación" title="Salir (Esc)">${icono('cerrar')}</button>
        </div>
        <aside class="pres-notas" hidden aria-label="Notas para el tutor"></aside>
      </div>
      <p class="pres-ayuda texto-3">Avanza con las flechas del teclado. Ojo: si compartes esta pantalla, las notas del tutor también se ven. Para leerlas en privado, abre la <a href="#guia">guía de la clase</a> en tu celular.</p>`;

    const escena = $('.pres-escena', raiz);
    const notas = $('.pres-notas', raiz);
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
      notas.innerHTML = `<h4>Notas para el tutor · ${MA.esc(d.titulo)}</h4>${notasHtml(d)}`;
      MA.almacen.guardar('m1.diapositiva', actual);
      if (actual === p.hasta && alTerminarParte) alTerminarParte(p.id);
    }
    function ir(i) { actual = MA.clamp(i, 0, diapositivas.length - 1); pintar(); }
    function irParte(id) { const p = partes.find(x => x.id === id); if (p) ir(p.desde); }
    function alternarNotas(forzar) {
      conNotas = typeof forzar === 'boolean' ? forzar : !conNotas;
      notas.hidden = !conNotas;
      $('[data-pres="notas"]', raiz).setAttribute('aria-pressed', String(conNotas));
    }
    function presentar(si) {
      presentando = si;
      raiz.classList.toggle('presentando', si);
      document.body.classList.toggle('con-presentacion', si);
      if (si) {
        // La pantalla completa es opcional: si el navegador la rechaza, queda el modo a ventana completa
        try { const r = raiz.requestFullscreen && raiz.requestFullscreen(); if (r && r.catch) r.catch(() => {}); } catch (e) { /* sin pantalla completa */ }
        escena.focus({ preventScroll: true });
      } else {
        try { if (document.fullscreenElement) { const r = document.exitFullscreen(); if (r && r.catch) r.catch(() => {}); } } catch (e) { /* nada */ }
        raiz.scrollIntoView({ block: 'nearest' });
      }
    }
    document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && presentando) presentar(false); });

    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b)) return;
      if (b.dataset.parte) irParte(b.dataset.parte);
      else if (b.dataset.ir != null) ir(Number(b.dataset.ir));
      else if (b.dataset.pres === 'anterior') ir(actual - 1);
      else if (b.dataset.pres === 'siguiente') ir(actual + 1);
      else if (b.dataset.pres === 'notas') alternarNotas();
      else if (b.dataset.pres === 'presentar') presentar(true);
      else if (b.dataset.pres === 'salir') presentar(false);
    });
    document.addEventListener('keydown', e => {
      if (!presentando && !raiz.contains(document.activeElement)) return;
      if (raiz.offsetParent === null && !presentando) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const k = e.key;
      if (k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && presentando)) { e.preventDefault(); ir(actual + 1); }
      else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); ir(actual - 1); }
      else if (k === 'Home' && presentando) { e.preventDefault(); ir(parteDe(actual).desde); }
      else if (k === 'End' && presentando) { e.preventDefault(); ir(parteDe(actual).hasta); }
      else if (k === 'n' || k === 'N') alternarNotas();
      else if (k === 'Escape' && presentando) presentar(false);
    });

    pintar();
    return { ir, irParte, salir: () => { if (presentando) presentar(false); } };
  }

  MA.Presentacion = { crear: crearPresentacion };
})();
