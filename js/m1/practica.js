/* =====================================================================
   ÁREA DE PRÁCTICA · tarjetas de ejercicios progresivos + borrador
   ---------------------------------------------------------------------
   Un ejercicio a la vez, sin calculadora. Ayudas en orden:
   pista 1 → pista 2 → solución paso a paso. Si la respuesta coincide
   con un error típico, la retroalimentación explica ese error.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, icono } = MA;
  const LETRAS = 'ABCDEF';

  /* Barajado estable por ejercicio (la opción correcta no siempre es la A) */
  function semilla(txt) { let h = 2166136261; for (const c of txt) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }
  function barajarEstable(n, id) {
    let a = semilla(id);
    const azar = () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const orden = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(azar() * (i + 1)); [orden[i], orden[j]] = [orden[j], orden[i]]; }
    return orden;
  }

  function crearPractica(raiz, opciones = {}) {
    const C = MA.M1;
    const lista = C.EJERCICIOS;
    const estado = MA.almacen.leer('practica.m1', {}) || {};
    const borradores = new Map();
    let actual = Math.min(MA.almacen.leer('practica.m1.actual', 0) || 0, lista.length - 1);

    raiz.innerHTML = `
      <nav class="pr-mapa" aria-label="Ejercicios"></nav>
      <article class="tarjeta pr-tarjeta" aria-live="off">
        <header class="pr-cabeza"></header>
        <div class="pr-enunciado"></div>
        <div class="pr-respuesta"></div>
        <div class="mensaje pr-feedback" role="status" aria-live="polite"></div>
        <div class="fila-botones pr-ayudas">
          <button type="button" class="btn btn-secundario btn-chico" data-accion="pista">${icono('pista')}<span></span></button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="solucion">${icono('libro')}Ver solución</button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="herramienta" hidden></button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="ia">${icono('chat')}Pedir ayuda a la IA</button>
        </div>
        <ol class="pr-pistas"></ol>
        <div class="pr-solucion" hidden>
          <h4>Solución paso a paso</h4>
          <ol></ol>
        </div>
        <footer class="pr-nav">
          <button type="button" class="btn btn-secundario" data-accion="anterior">${icono('flechaI')}Anterior</button>
          <button type="button" class="btn" data-accion="siguiente">Siguiente${icono('flechaD')}</button>
        </footer>
      </article>
      <section class="tarjeta pr-borrador" aria-label="Borrador">
        <div class="pr-borrador-cabeza">
          <div><h4>Borrador</h4><p class="texto-3">Escribe con el dedo, el lápiz o el mouse. Cada ejercicio tiene su propia hoja (se borra al cerrar la página).</p></div>
          <div class="segmentado" role="group" aria-label="Herramientas del borrador">
            <button type="button" class="segmento" data-trazo="lapiz" aria-pressed="true">${icono('lapiz')}Lápiz</button>
            <button type="button" class="segmento" data-trazo="goma" aria-pressed="false">${icono('goma')}Borrador</button>
            <button type="button" class="segmento" data-trazo="limpiar">${icono('basura')}Limpiar hoja</button>
          </div>
        </div>
        <div class="pr-lienzo"><canvas width="1600" height="800" aria-label="Hoja de borrador"></canvas></div>
      </section>`;

    const tarjeta = $('.pr-tarjeta', raiz);
    const fb = $('.pr-feedback', raiz);
    // Texto plano para la IA, con las opciones en el mismo orden (y letras) que se ven en pantalla
    function planoDe(ej) {
      if (ej.tipo !== 'opciones' || !ej.opcionesPlano) return ej.plano;
      const orden = barajarEstable(ej.opciones.length, ej.id);
      return `${ej.plano} Opciones: ${orden.map((k, pos) => `${LETRAS[pos]}) ${ej.opcionesPlano[k]}`).join('; ')}.`;
    }
    const anunciarEj = () => {
      const ej = lista[actual];
      MA.bus.emit('ejercicio-activo', { numero: actual + 1, plano: planoDe(ej), tema: C.TEMAS[ej.tema] });
    };
    const datosDe = ej => (estado[ej.id] = estado[ej.id] || { resuelto: false, intentos: 0, pistas: 0, solucion: false });
    const guardar = () => MA.almacen.guardar('practica.m1', estado);

    function ponerMensaje(tipo, titulo, texto) {
      const ico = { ok: 'checkCirculo', aviso: 'alerta', info: 'info', error: 'errorCirculo' }[tipo];
      fb.className = 'mensaje pr-feedback ' + tipo;
      fb.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }

    function pintarMapa() {
      const punto = (ej, i) => {
        const d = estado[ej.id] || {};
        return `<button type="button" class="pr-punto ${d.resuelto ? 'resuelto' : ''} ${i === actual ? 'actual' : ''}" data-ir="${i}"
          aria-label="Ejercicio ${i + 1}${d.resuelto ? ', resuelto' : ''}" ${i === actual ? 'aria-current="step"' : ''}>${d.resuelto ? icono('check') : i + 1}</button>`;
      };
      $('.pr-mapa', raiz).innerHTML = Object.keys(C.NIVELES).map(nivel => {
        const items = lista.map((ej, i) => (ej.nivel === nivel ? punto(ej, i) : '')).join('');
        return items ? `<span class="pr-grupo"><span class="pr-mapa-nivel">${C.NIVELES[nivel]}</span>${items}</span>` : '';
      }).join('');
    }

    function mostrar(i) {
      guardarBorrador();
      actual = MA.clamp(i, 0, lista.length - 1);
      MA.almacen.guardar('practica.m1.actual', actual);
      const ej = lista[actual], d = datosDe(ej);
      $('.pr-cabeza', raiz).innerHTML = `
        <span class="etiqueta">Ejercicio ${actual + 1} de ${lista.length}</span>
        <span class="pildora ${ej.nivel === 'examen' ? 'pildora-primaria' : ''}">${C.NIVELES[ej.nivel]}</span>
        <span class="pildora">${C.TEMAS[ej.tema]}</span>
        ${d.resuelto ? `<span class="pildora pildora-exito pr-estado">${icono('check')}Resuelto</span>` : ''}`;
      $('.pr-enunciado', raiz).innerHTML = `<p>${ej.enunciado}</p>`;

      const resp = $('.pr-respuesta', raiz);
      if (ej.tipo === 'opciones') {
        const orden = barajarEstable(ej.opciones.length, ej.id);
        resp.innerHTML = `<div class="pr-opciones" role="group" aria-label="Opciones">${orden.map((k, pos) => `
          <button type="button" class="pr-opcion" data-k="${k}"><span class="pr-letra">${LETRAS[pos]}</span><span>${ej.opciones[k]}</span></button>`).join('')}</div>`;
        if (d.resuelto) $(`.pr-opcion[data-k="${ej.correcta}"]`, resp).classList.add('correcta');
      } else {
        resp.innerHTML = `
          <label class="pr-etiqueta-campo" for="pr-campo">Tu respuesta</label>
          <div class="pr-fila-campo">
            <span class="campo-grupo">
              <input id="pr-campo" class="campo" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="Escribe el número">
              ${ej.unidad ? `<span class="campo-unidad">${ej.unidad}</span>` : ''}
            </span>
            <button type="button" class="btn" data-accion="comprobar">Comprobar</button>
          </div>
          <p class="texto-3 pr-ayuda-campo">Solo el número. Sirven la coma o el punto decimal (2,5 o 2.5) y las fracciones (1/3).</p>`;
        const campo = $('#pr-campo', resp);
        campo.addEventListener('keydown', e => { if (e.key === 'Enter') comprobar(); });
        if (d.resuelto) campo.value = MA.fmt(ej.respuesta).replace(/ /g, '');
      }

      fb.className = 'mensaje pr-feedback';
      fb.innerHTML = '';
      if (d.resuelto) ponerMensaje('ok', 'Ya resolviste este ejercicio.', 'Puedes repasarlo o seguir con el siguiente.');

      $('.pr-pistas', raiz).innerHTML = ej.pistas.slice(0, d.pistas).map((p, k) => `<li><b>Pista ${k + 1}.</b> ${p}</li>`).join('');
      pintarBotonPista(ej, d);
      const sol = $('.pr-solucion', raiz);
      $('ol', sol).innerHTML = ej.solucion.map(p => `<li>${p}</li>`).join('');
      sol.hidden = !d.solucion;
      $('[data-accion="solucion"]', raiz).innerHTML = `${icono('libro')}${d.solucion ? 'Ocultar solución' : 'Ver solución'}`;

      const bh = $('[data-accion="herramienta"]', raiz);
      bh.hidden = !ej.herramienta;
      if (ej.herramienta) bh.innerHTML = ej.herramienta.tipo === 'balanza' ? `${icono('balanza')}Probarlo en la balanza` : `${icono('regla')}Probarlo en la mesa de conversión`;

      $('[data-accion="anterior"]', raiz).disabled = actual === 0;
      const sig = $('[data-accion="siguiente"]', raiz);
      sig.disabled = actual === lista.length - 1;
      sig.classList.toggle('btn-secundario', !d.resuelto);
      pintarMapa();
      cargarBorrador();
      // Solo se anuncia al asistente si la práctica está a la vista
      if (raiz.offsetParent !== null) anunciarEj();
    }

    function pintarBotonPista(ej, d) {
      const b = $('[data-accion="pista"]', raiz);
      const quedan = d.pistas < ej.pistas.length;
      b.disabled = !quedan;
      $('span', b).textContent = quedan ? `Pista ${d.pistas + 1} de ${ej.pistas.length}` : 'Ya viste todas las pistas';
    }

    function acierto(ej, d) {
      const primera = d.intentos === 0 && d.pistas === 0 && !d.solucion;
      d.resuelto = true;
      guardar();
      MA.progreso.marcar('m1.prac.' + ej.id);
      ponerMensaje('ok', 'Correcto.', primera ? 'A la primera y sin ayudas: muy bien.' : 'Bien hecho. Lo importante es que entiendas el procedimiento; si quieres, compáralo con la solución.');
      const sig = $('[data-accion="siguiente"]', raiz);
      sig.classList.remove('btn-secundario');
      $('.pr-cabeza', raiz).insertAdjacentHTML('beforeend', $('.pr-estado', raiz) ? '' : `<span class="pildora pildora-exito pr-estado">${icono('check')}Resuelto</span>`);
      pintarMapa();
    }
    function fallo(ej, d, texto) {
      d.intentos++;
      guardar();
      const extra = d.intentos >= 2 && d.pistas < ej.pistas.length ? ' Si quieres, pide una pista: para eso están.' : '';
      ponerMensaje('error', 'Todavía no.', texto + extra);
    }
    function comprobar() {
      const ej = lista[actual], d = datosDe(ej);
      const campo = $('#pr-campo', raiz);
      const cands = MA.leerNumeros(campo.value);
      if (!cands.length) { ponerMensaje('aviso', 'Escribe solo el número.', 'Sin unidades. Ejemplos válidos: 20 · 2,5 · 1/3'); campo.focus(); return; }
      if (cands.some(c => MA.casiIgual(c, ej.respuesta, ej.tolerancia || 0.01))) { acierto(ej, d); return; }
      const err = (ej.errores || []).find(er => cands.some(c => MA.casiIgual(c, er.valor, 0.01)));
      fallo(ej, d, err ? err.msg : 'Revisa el planteamiento: ¿se cancelan bien las unidades? ¿El tamaño del número tiene sentido?');
    }
    function elegirOpcion(btn) {
      const ej = lista[actual], d = datosDe(ej);
      const k = Number(btn.dataset.k);
      $$('.pr-opcion', raiz).forEach(b => b.classList.remove('incorrecta'));
      if (k === ej.correcta) { btn.classList.add('correcta'); acierto(ej, d); }
      else { btn.classList.add('incorrecta'); fallo(ej, d, (ej.porQue && ej.porQue[k]) || 'Esa no es. Compruébala reemplazando números sencillos.'); }
    }

    /* ---------- Borrador ---------- */
    const lienzo = $('canvas', raiz);
    const ctx = lienzo.getContext('2d');
    let trazo = 'lapiz', dibujando = false, ultimo = null;
    const pos = e => {
      const r = lienzo.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (lienzo.width / r.width), y: (e.clientY - r.top) * (lienzo.height / r.height) };
    };
    function linea(a, b) {
      ctx.globalCompositeOperation = trazo === 'goma' ? 'destination-out' : 'source-over';
      ctx.strokeStyle = getComputedStyle(raiz).getPropertyValue('--texto').trim() || '#13202f';
      ctx.lineWidth = trazo === 'goma' ? 44 : 4.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    lienzo.addEventListener('pointerdown', e => {
      dibujando = true;
      try { lienzo.setPointerCapture(e.pointerId); } catch (err) { /* nada */ }
      ultimo = pos(e);
      linea(ultimo, { x: ultimo.x + 0.1, y: ultimo.y + 0.1 });
    });
    lienzo.addEventListener('pointermove', e => {
      if (!dibujando) return;
      const eventos = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      (eventos.length ? eventos : [e]).forEach(ev => { const p = pos(ev); linea(ultimo, p); ultimo = p; });
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => lienzo.addEventListener(t, () => { dibujando = false; }));
    function guardarBorrador() {
      const ej = lista[actual];
      if (ej && lienzo) try { borradores.set(ej.id, ctx.getImageData(0, 0, lienzo.width, lienzo.height)); } catch (e) { /* nada */ }
    }
    function cargarBorrador() {
      ctx.clearRect(0, 0, lienzo.width, lienzo.height);
      const img = borradores.get(lista[actual].id);
      if (img) ctx.putImageData(img, 0, 0);
    }
    $$('[data-trazo]', raiz).forEach(b => b.addEventListener('click', () => {
      if (b.dataset.trazo === 'limpiar') { ctx.clearRect(0, 0, lienzo.width, lienzo.height); return; }
      trazo = b.dataset.trazo;
      $$('[data-trazo="lapiz"], [data-trazo="goma"]', raiz).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    }));

    /* ---------- Eventos ---------- */
    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b)) return;
      if (b.dataset.ir != null) { mostrar(Number(b.dataset.ir)); return; }
      if (b.classList.contains('pr-opcion')) { elegirOpcion(b); return; }
      const ej = lista[actual], d = datosDe(ej);
      switch (b.dataset.accion) {
        case 'comprobar': comprobar(); break;
        case 'pista':
          if (d.pistas < ej.pistas.length) {
            d.pistas++;
            guardar();
            $('.pr-pistas', raiz).insertAdjacentHTML('beforeend', `<li class="nueva"><b>Pista ${d.pistas}.</b> ${ej.pistas[d.pistas - 1]}</li>`);
            pintarBotonPista(ej, d);
          }
          break;
        case 'solucion':
          d.solucion = !d.solucion;
          guardar();
          $('.pr-solucion', raiz).hidden = !d.solucion;
          b.innerHTML = `${icono('libro')}${d.solucion ? 'Ocultar solución' : 'Ver solución'}`;
          break;
        case 'herramienta':
          if (opciones.abrirHerramienta) opciones.abrirHerramienta(ej, actual + 1);
          break;
        case 'ia':
          if (MA.Asistente) MA.Asistente.abrir({ plantilla: 'pista', incluirEjercicio: true });
          break;
        case 'anterior': mostrar(actual - 1); tarjeta.scrollIntoView({ block: 'nearest' }); break;
        case 'siguiente': mostrar(actual + 1); tarjeta.scrollIntoView({ block: 'nearest' }); break;
      }
    });
    MA.bus.on('progreso', clave => {
      if (clave === null) { Object.keys(estado).forEach(k => delete estado[k]); guardar(); mostrar(actual); }
    });

    mostrar(actual);

    return {
      irA(id) { const i = lista.findIndex(x => x.id === id); if (i >= 0) mostrar(i); },
      anunciar: anunciarEj
    };
  }

  MA.Practica = { crear: crearPractica };
})();
