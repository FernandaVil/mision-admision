/* =====================================================================
   PIZARRÓN · escribir a mano en la pantalla
   ---------------------------------------------------------------------
   - MA.Pizarra.crearLienzo(canvas): superficie de dibujo con lápiz,
     borrador, colores, deshacer y limpiar. Guarda los trazos en
     coordenadas proporcionales (0 a 1), así se redibujan bien si cambia
     el tamaño, y con colores del tema (cambian con claro u oscuro).
   - MA.Pizarra.abrir(): hoja en blanco a pantalla completa, disponible
     en cualquier momento (botón de la cabecera o tecla B en las
     diapositivas). Esc la cierra.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, icono } = MA;

  const COLORES = [
    { id: 'texto', nombre: 'Tinta' },
    { id: 'primario', nombre: 'Azul' },
    { id: 'ambar', nombre: 'Ámbar' },
    { id: 'error', nombre: 'Rojo' }
  ];

  function crearLienzo(canvas) {
    const ctx = canvas.getContext('2d');
    const st = { trazos: [], actual: null, herramienta: 'lapiz', color: 'texto', activo: true };
    const dpr = () => Math.max(1, window.devicePixelRatio || 1);

    function ajustar() {
      const r = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width * dpr())), h = Math.max(1, Math.round(r.height * dpr()));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; return true; }
      return false;
    }
    const colorDe = token => getComputedStyle(canvas).getPropertyValue('--' + token).trim() || '#13202f';
    function dibujar(t, desde = 1) {
      const w = canvas.width, h = canvas.height, p = t.puntos;
      ctx.save();
      ctx.globalCompositeOperation = t.goma ? 'destination-out' : 'source-over';
      ctx.strokeStyle = colorDe(t.color);
      ctx.lineWidth = Math.max(1.5, (t.goma ? 0.03 : 0.0032) * Math.max(w, h * 1.6));
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      if (p.length === 1) {
        ctx.moveTo(p[0][0] * w, p[0][1] * h);
        ctx.lineTo(p[0][0] * w + 0.1, p[0][1] * h + 0.1);
      } else {
        ctx.moveTo(p[desde - 1][0] * w, p[desde - 1][1] * h);
        for (let i = desde; i < p.length; i++) ctx.lineTo(p[i][0] * w, p[i][1] * h);
      }
      ctx.stroke();
      ctx.restore();
    }
    function redibujar() {
      ajustar();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      st.trazos.forEach(t => dibujar(t));
    }
    const pos = e => {
      const r = canvas.getBoundingClientRect();
      return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
    };

    canvas.addEventListener('pointerdown', e => {
      if (!st.activo || e.button > 0) return;
      e.preventDefault();
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* nada */ }
      if (ajustar()) redibujar();
      st.actual = { color: st.color, goma: st.herramienta === 'goma', puntos: [pos(e)] };
      dibujar(st.actual);
    });
    canvas.addEventListener('pointermove', e => {
      if (!st.actual) return;
      const lista = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
      const antes = st.actual.puntos.length;
      (lista.length ? lista : [e]).forEach(ev => st.actual.puntos.push(pos(ev)));
      dibujar(st.actual, antes);
    });
    const terminar = () => { if (st.actual) { st.trazos.push(st.actual); st.actual = null; } };
    canvas.addEventListener('pointerup', terminar);
    canvas.addEventListener('pointercancel', terminar);
    if (window.ResizeObserver) new ResizeObserver(() => redibujar()).observe(canvas);
    else window.addEventListener('resize', redibujar);

    return {
      herramienta(h) { st.herramienta = h; },
      color(c) { st.color = c; st.herramienta = 'lapiz'; },
      activar(si) { st.activo = si; },
      deshacer() { st.trazos.pop(); redibujar(); },
      limpiar() { st.trazos.length = 0; redibujar(); },
      // Para tener una hoja distinta por diapositiva: se le pasa el arreglo de trazos de cada una
      usarTrazos(lista) { st.trazos = lista; st.actual = null; redibujar(); },
      redibujar
    };
  }

  /* Barra de herramientas reutilizable (pizarrón y escritura sobre diapositivas) */
  function barraHtml() {
    return `
      <div class="pz-herramientas">
        <div class="pz-grupo" role="group" aria-label="Color">
          ${COLORES.map((c, i) => `<button type="button" class="pz-color" data-pz-color="${c.id}" aria-pressed="${i === 0}" aria-label="${c.nombre}" title="${c.nombre}"><span style="background: var(--${c.id})"></span></button>`).join('')}
        </div>
        <div class="pz-grupo" role="group" aria-label="Herramienta">
          <button type="button" class="pz-btn" data-pz-herr="lapiz" aria-pressed="true">${icono('lapiz')}<span>Lápiz</span></button>
          <button type="button" class="pz-btn" data-pz-herr="goma" aria-pressed="false">${icono('goma')}<span>Borrador</span></button>
        </div>
        <div class="pz-grupo">
          <button type="button" class="pz-btn" data-pz="deshacer" title="Deshacer (Ctrl + Z)">${icono('deshacer')}<span>Deshacer</span></button>
          <button type="button" class="pz-btn" data-pz="limpiar">${icono('basura')}<span>Limpiar</span></button>
        </div>
      </div>`;
  }
  function conectarBarra(barra, lienzo) {
    const marcar = (sel, b) => $$(sel, barra).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    barra.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !barra.contains(b)) return;
      if (b.dataset.pzColor) {
        lienzo.color(b.dataset.pzColor);
        marcar('[data-pz-color]', b);
        marcar('[data-pz-herr]', $('[data-pz-herr="lapiz"]', barra));
      } else if (b.dataset.pzHerr) {
        lienzo.herramienta(b.dataset.pzHerr);
        marcar('[data-pz-herr]', b);
      } else if (b.dataset.pz === 'deshacer') lienzo.deshacer();
      else if (b.dataset.pz === 'limpiar') lienzo.limpiar();
    });
  }

  /* ---------- Pizarrón en blanco (ventana a pantalla completa) ---------- */
  let modal = null, lienzoModal = null, foco = null;
  function crearModal() {
    modal = MA.crear('div', 'pizarron');
    modal.id = 'pizarron';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Pizarrón');
    modal.innerHTML = `
      <div class="pz-barra">
        <span class="pz-titulo">${icono('pizarra')}Pizarrón</span>
        ${barraHtml()}
        <button type="button" class="btn btn-secundario btn-chico" data-pz="cerrar">${icono('cerrar')}Cerrar</button>
      </div>
      <div class="pz-hoja"><canvas aria-label="Hoja del pizarrón"></canvas></div>`;
    document.body.appendChild(modal);
    lienzoModal = crearLienzo($('canvas', modal));
    conectarBarra($('.pz-barra', modal), lienzoModal);
    $('[data-pz="cerrar"]', modal).addEventListener('click', cerrar);
  }
  function abrir() {
    if (!modal) crearModal();
    foco = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('con-pizarron');
    requestAnimationFrame(() => lienzoModal.redibujar());
    $('[data-pz="cerrar"]', modal).focus({ preventScroll: true });
  }
  function cerrar() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('con-pizarron');
    if (foco && document.contains(foco)) foco.focus({ preventScroll: true });
  }
  const abierta = () => !!modal && !modal.hidden;

  // En fase de captura: con el pizarrón abierto, Esc lo cierra y las demás teclas no mueven nada detrás
  document.addEventListener('keydown', e => {
    if (!abierta()) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); cerrar(); return; }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); lienzoModal.deshacer(); }
    e.stopImmediatePropagation();
  }, true);

  MA.Pizarra = { crearLienzo, barraHtml, conectarBarra, abrir, cerrar, abierta };
})();
