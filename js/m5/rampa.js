/* =====================================================================
   Herramienta 2 · la rampa
   ---------------------------------------------------------------------
   Una caja sobre una rampa con un deslizador de 0° a 90°. El peso se
   queda vertical y no cambia, mientras la normal gira y se acorta. Un
   botón parte el peso en sus dos pedazos, que forman un triángulo con el
   peso de hipotenusa, y el tablero muestra el seno y el coseno con su
   división. Así se ven de una vez los dos extremos (0° y 90°, que es la
   caída libre).
   Antes de mover nada, se predice: el deslizador se abre después de
   responder. La carrera del melón y la sandía usa las cuentas del radar
   de pista (MA.M4.mov), con a = g · sen θ.
   Sin fricción, para no enredar: la fricción ya está en la mesa de
   fuerzas.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, icono } = MA;
  const RAD = Math.PI / 180;
  const X1 = 330, Y1 = 220, LARGO = 200, S = 100, MEDIA = 24, PESO_PX = 80;
  const LARGO_M = 10, PESO_N = 400, G = 10;

  function crearRampa(raiz, opciones = {}) {
    const C = MA.M5, R = C.RETOS_RAMPA;
    const reducido = MA.movimientoReducido();
    const st = { reto: null, iPaso: 0, angulo: 30, partido: false, bloqueado: false, fase: 'paso', token: 0, raf: null, carrera: null };

    raiz.classList.add('banco', 'mesa-rm');
    raiz.innerHTML = `
      <div class="banco-cabeza">
        <div><span class="etiqueta">Herramienta 2</span><h3>La rampa</h3></div>
        <div class="segmentado m4-grupo rm-retos" role="group" aria-label="Retos de la rampa"></div>
      </div>
      <div class="cv-reto rm-reto"></div>
      <div class="rm-mesa">
        <div class="rm-escena"></div>
        <div class="rm-lado">
          <label class="bz-deslizador rm-deslizador">
            <span>Inclinación de la rampa</span>
            <output class="mono rm-valor"></output>
            <input type="range" min="0" max="90" step="1" class="rm-rango" aria-label="Inclinación de la rampa, en grados">
          </label>
          <button type="button" class="btn btn-secundario btn-chico rm-partir" data-accion="partir" aria-pressed="false">${icono('intercambiar')}Partir el peso en dos</button>
          <div class="rm-tablero"></div>
        </div>
      </div>
      <div class="rm-panel"></div>
      <div class="banco-pie">
        <div class="mensaje rm-mensaje" role="status" aria-live="polite"></div>
        <div class="fila-botones rm-botones"></div>
      </div>
      <section class="cv-bitacora" aria-label="Pasos">
        <h4>Pasos</h4>
        <p class="texto-3">Lo mismo que se escribe en el papel, renglón por renglón.</p>
        <ol class="bz-pasos rm-pasos"></ol>
      </section>`;

    /* ---------- Mensajes y bitácora ---------- */
    const msg = $('.rm-mensaje', raiz);
    function ponerMensaje(tipo, titulo, texto) {
      if (!tipo) { msg.className = 'mensaje rm-mensaje'; msg.innerHTML = ''; return; }
      const ico = { ok: 'checkCirculo', aviso: 'alerta', info: 'info', error: 'errorCirculo' }[tipo];
      msg.className = 'mensaje rm-mensaje ' + tipo;
      msg.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }
    const pasos = [];
    function agregarPaso(etiqueta, html, nota) {
      pasos.push({ etiqueta, html, nota });
      $('.rm-pasos', raiz).innerHTML = pasos.map(p => `<li><span class="bz-paso-etq">${p.etiqueta}</span><span class="mt">${p.html || ''}</span>${p.nota ? `<span class="bz-paso-nota">${p.nota}</span>` : ''}</li>`).join('');
    }
    function borrarPasos() { pasos.length = 0; $('.rm-pasos', raiz).innerHTML = ''; }

    /* ---------- La rampa y sus flechas ---------- */
    function dibujar() {
      if (st.carrera) { dibujarCarrera(st.carrera.d); return; }
      const th = st.angulo, c = Math.cos(th * RAD), s = Math.sin(th * RAD);
      const xa = X1 - LARGO * c, ya = Y1 - LARGO * s;
      const [ux, uy] = C.vector('sube', th), [nx, ny] = C.vector('sale', th);
      const px = X1 + ux * S, py = Y1 + uy * S;
      const cx = px + nx * MEDIA, cy = py + ny * MEDIA;
      const r = 34;
      const arco = th > 2 ? `<path class="m5-arco" d="M${X1 - r} ${Y1}A${r} ${r} 0 0 1 ${(X1 - r * c).toFixed(1)} ${(Y1 - r * s).toFixed(1)}"/>` : '';
      const fl = (dir, l, clase, texto, et) => C.flechaSvg(cx, cy, { dir, px: l, clase, texto, et }, th);
      // Los dos pedazos forman un triángulo: el peso es la hipotenusa
      const [ex, ey] = C.vector('entra', th), lc = PESO_PX * c, ls = PESO_PX * s;
      const partes = st.partido ? `
        ${C.flechaSvg(cx, cy, { dir: 'baja', px: ls, ox: ex * lc, oy: ey * lc, clase: 'parte', texto: 'Rampa abajo', et: { x: cx + ex * lc - 8, y: cy + ey * lc + 24, ancla: 'end' } }, th)}
        ${fl('entra', lc, 'parte', 'Contra la rampa', { x: cx + ex * lc / 2 - 12, y: cy + ey * lc / 2 + 4, ancla: 'end' })}` : '';
      $('.rm-escena', raiz).innerHTML = `
        <svg class="m5-fig rm-svg" viewBox="0 0 420 310" role="img" aria-label="Rampa a ${MA.fmt(th)} grados. El peso es vertical y la normal, perpendicular a la rampa">
          <line class="m5-piso" x1="20" y1="${Y1}" x2="400" y2="${Y1}"/>
          <polygon class="m5-rampa" points="${X1},${Y1} ${xa.toFixed(1)},${Y1} ${xa.toFixed(1)},${ya.toFixed(1)}"/>
          ${arco}
          <text class="m5-rotulo" x="${X1 + 10}" y="${Y1 + 18}">${MA.fmt(th)}°</text>
          ${C.cuerpoSvg('caja', cx, cy, th)}
          ${partes}
          ${fl('aba', PESO_PX, 'peso', 'Peso')}
          ${fl('sale', PESO_PX * c, 'contacto', 'Normal')}
        </svg>`;
    }

    function pintarTablero() {
      const th = st.angulo, c = Math.cos(th * RAD), s = Math.sin(th * RAD);
      const alto = LARGO_M * s, base = LARGO_M * c;
      const dato = (nombre, valor, unidad, clase = '') => `<div class="rp-instrumento ${clase}"><small>${nombre}</small><div><b>${valor}</b>${unidad ? `<span>${unidad}</span>` : ''}</div></div>`;
      const dec = (x, k) => MA.fmt(Math.abs(x) < 1e-9 ? 0 : x, k);
      $('.rm-valor', raiz).textContent = `${MA.fmt(th)}°`;
      // En la carrera, las cuentas de cada uno recién al llegar: antes dirían la respuesta
      if (st.carrera) {
        const fila = (nombre, masa) => {
          const fuerza = masa * G * s;
          return `${dato(`${nombre}: rampa abajo`, dec(fuerza, 0), 'N')}${dato(`${nombre}: aceleración`, dec(fuerza / masa, 1), 'm/s²', 'rm-i-sen')}`;
        };
        $('.rm-tablero', raiz).innerHTML = st.carrera.fin ? `${fila('Melón', 2)}${fila('Sandía', 10)}` : '';
        return;
      }
      // Con medidas propias, el tablero daría la respuesta
      if (st.reto && st.reto.sinTablero) { $('.rm-tablero', raiz).innerHTML = ''; return; }
      $('.rm-tablero', raiz).innerHTML = `
        ${dato('Seno: opuesto ÷ hipotenusa', dec(s, 3), `${dec(alto, 1)} ÷ ${LARGO_M} m`, 'rm-i-sen')}
        ${dato('Coseno: adyacente ÷ hipotenusa', dec(c, 3), `${dec(base, 1)} ÷ ${LARGO_M} m`)}
        ${dato('Peso', MA.fmt(PESO_N), 'N', 'rm-i-peso')}
        ${dato('Rampa abajo', dec(PESO_N * s, 0), 'N')}
        ${dato('Contra la rampa', dec(PESO_N * c, 0), 'N')}
        ${dato('Normal', dec(PESO_N * c, 0), 'N')}`;
    }

    function pintarAngulo() {
      const rango = $('.rm-rango', raiz);
      rango.value = String(st.angulo);
      rango.disabled = st.bloqueado || !!st.carrera;
      $('.rm-deslizador', raiz).hidden = !!st.carrera || !!st.reto.sinTablero;
      dibujar();
      pintarTablero();
    }

    // Lleva la rampa a un ángulo, despacio, para que se vea el cambio
    function moverA(meta, luego) {
      const token = ++st.token;
      if (reducido) { st.angulo = meta; pintarAngulo(); luego(); return; }
      const de = st.angulo, t0 = performance.now(), dur = 900;
      const paso = ahora => {
        if (token !== st.token) return;
        const u = Math.min(1, (ahora - t0) / dur);
        st.angulo = Math.round(de + (meta - de) * (1 - (1 - u) * (1 - u)));
        pintarAngulo();
        if (u < 1) st.raf = requestAnimationFrame(paso); else luego();
      };
      st.raf = requestAnimationFrame(paso);
    }

    /* ---------- La carrera ---------- */
    function dibujarCarrera(d) {
      const th = st.angulo, c = Math.cos(th * RAD), s = Math.sin(th * RAD);
      const L = 170, usable = L - 36;
      const uno = (xFin, nombre, rx, ry, masa) => {
        const xa = xFin - L * c, ya = Y1 - L * s;
        const u = MA.clamp(d / LARGO_M, 0, 1);
        const x = xa + (18 + usable * u) * c + s * ry, y = ya + (18 + usable * u) * s - c * ry;
        return `
          <polygon class="m5-rampa" points="${xFin},${Y1} ${xa.toFixed(1)},${Y1} ${xa.toFixed(1)},${ya.toFixed(1)}"/>
          <text class="m5-rotulo" x="${xa.toFixed(1)}" y="${(ya - 24).toFixed(1)}">${nombre}, ${masa} kg</text>
          <g class="m5-cuerpo" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${th})"><ellipse rx="${rx}" ry="${ry}"/><path class="m5-raya" d="M${-rx * 0.5} ${-ry * 0.8}q${-rx * 0.2} ${ry * 0.8} 0 ${ry * 1.6}M${rx * 0.5} ${-ry * 0.8}q${rx * 0.2} ${ry * 0.8} 0 ${ry * 1.6}"/></g>`;
      };
      $('.rm-escena', raiz).innerHTML = `
        <svg class="m5-fig rm-svg" viewBox="0 0 420 310" role="img" aria-label="Carrera entre un melón de 2 kg y una sandía de 10 kg, cada uno en su rampa, igual de inclinadas">
          <line class="m5-piso" x1="20" y1="${Y1}" x2="400" y2="${Y1}"/>
          ${uno(200, 'Melón', 14, 11, 2)}
          ${uno(400, 'Sandía', 24, 18, 10)}
          <text class="m5-rotulo" x="210" y="${Y1 + 30}" text-anchor="middle">Mismo ángulo, sin fricción: ${MA.fmt(th)}°</text>
        </svg>`;
    }
    function correr(luego) {
      const token = ++st.token, a = G * Math.sin(st.angulo * RAD);
      const T = Math.sqrt(2 * LARGO_M / a);
      st.carrera = { d: 0 };
      pintarAngulo();
      const llegar = () => { st.carrera.d = LARGO_M; st.carrera.fin = true; pintarAngulo(); luego(); };
      if (reducido) { llegar(); return; }
      const t0 = performance.now(), ritmo = 0.7;
      const paso = ahora => {
        if (token !== st.token) return;
        const t = (ahora - t0) / 1000 * ritmo;
        st.carrera.d = MA.M4.mov.estado({ v0: 0, a }, Math.min(t, T)).d;
        dibujar();
        if (t < T) st.raf = requestAnimationFrame(paso); else llegar();
      };
      st.raf = requestAnimationFrame(paso);
    }

    /* ---------- Los retos ---------- */
    function pintarRetos() {
      $('.rm-retos', raiz).innerHTML = R.map((r, i) => {
        const hecho = MA.progreso.hecho('m5.rampa.' + r.id);
        return `<button type="button" class="segmento" data-reto="${r.id}" aria-pressed="${st.reto === r}" aria-label="Reto ${i + 1}: ${MA.esc(r.titulo)}${hecho ? ', hecho' : ''}" title="${MA.esc(r.titulo)}">${i + 1}${hecho ? `<span class="ok">${icono('check')}</span>` : ''}</button>`;
      }).join('');
    }

    function cargar(reto) {
      if (st.raf) cancelAnimationFrame(st.raf);
      st.token++;
      st.reto = reto;
      st.iPaso = 0;
      st.fase = 'paso';
      st.carrera = reto.carrera ? { d: 0 } : null;
      st.partido = false;
      st.angulo = reto.angulo;
      MA.almacen.guardar('m5.rampa.reto', reto.id);
      const i = R.indexOf(reto);
      $('.rm-reto', raiz).innerHTML = `
        <div class="m4-pildoras"><span class="pildora">Reto ${i + 1} de ${R.length}</span></div>
        <h4>${reto.titulo}</h4>
        <p>${reto.contexto}</p>`;
      borrarPasos();
      ponerMensaje(null);
      pintarRetos();
      pintarPartir();
      prepararPaso();
    }
    function pintarPartir() {
      const b = $('.rm-partir', raiz);
      b.setAttribute('aria-pressed', String(st.partido));
      b.hidden = !!st.reto.carrera || !!st.reto.sinTablero;
    }

    function prepararPaso() {
      const p = st.reto.pasos[st.iPaso];
      st.bloqueado = p.tipo !== 'mueve';
      pintarAngulo();
      pintarPanel();
      pintarBotones();
    }

    function pintarPanel() {
      const panel = $('.rm-panel', raiz);
      if (st.fase !== 'paso') { panel.innerHTML = ''; return; }
      const p = st.reto.pasos[st.iPaso];
      if (p.tipo === 'predice') {
        panel.innerHTML = `
          <div class="mf-pregunta rm-pregunta">
            <p class="cv-preg-titulo">${icono('pista')}<span>${p.pregunta}</span></p>
            <div class="fila-botones">${p.opciones.map((o, k) => `<button type="button" class="btn btn-secundario btn-chico" data-predice="${k}">${o.txt}</button>`).join('')}</div>
            <p class="texto-3">Primero la predicción; después se ve.</p>
          </div>`;
      } else if (p.tipo === 'mueve') {
        panel.innerHTML = `<div class="mf-pregunta rm-pregunta"><p class="cv-preg-titulo">${icono('mano')}<span>${p.pide}</span></p></div>`;
      } else if (p.tipo === 'numero') {
        panel.innerHTML = `
          <div class="mo-calculo rm-calculo">
            <label for="rm-campo">${p.pregunta}</label>
            <span class="campo-grupo"><input id="rm-campo" class="campo" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="Número">${p.unidad ? `<span class="campo-unidad">${p.unidad}</span>` : ''}</span>
            <button type="button" class="btn btn-chico" data-accion="numero">Comprobar</button>
          </div>`;
      }
    }

    function pintarBotones() {
      const cont = $('.rm-botones', raiz);
      if (st.fase !== 'listo') {
        cont.innerHTML = `<button type="button" class="btn btn-fantasma btn-chico" data-accion="reiniciar">${icono('reiniciar')}Reiniciar</button>`;
        return;
      }
      const i = R.indexOf(st.reto), sig = R[i + 1], l = st.reto.luego;
      let seguir = '';
      if (l) seguir += `<button type="button" class="btn" data-accion="luego">${l.texto}${icono('flechaD')}</button>`;
      if (sig) seguir += `<button type="button" class="${l ? 'btn btn-secundario' : 'btn'}" data-sig="${sig.id}">Siguiente reto${icono('flechaD')}</button>`;
      else if (opciones.final) seguir += `<button type="button" class="btn" data-accion="final">${opciones.final.texto}${icono('flechaD')}</button>`;
      cont.innerHTML = `${seguir}<button type="button" class="btn btn-secundario" data-accion="reiniciar">${icono('reiniciar')}Repetir</button>`;
    }

    function avanzar() {
      if (st.iPaso < st.reto.pasos.length - 1) { st.iPaso++; prepararPaso(); return; }
      st.fase = 'listo';
      st.bloqueado = false;
      pintarPanel();
      pintarBotones();
      $('.rm-rango', raiz).disabled = !!st.carrera;
      if (MA.progreso.marcar('m5.rampa.' + st.reto.id)) MA.aviso('Reto completado.');
      pintarRetos();
    }

    function predecir(k) {
      const p = st.reto.pasos[st.iPaso], o = p.opciones[k];
      const panel = $('.rm-panel', raiz);
      panel.querySelectorAll('[data-predice]').forEach(b => { b.disabled = true; });
      const titulo = o.ok ? '¡Correcto!' : `La respuesta es «${p.opciones.find(x => x.ok).txt}».`;
      const tipo = o.ok ? 'ok' : 'aviso';
      const cerrar = () => {
        if (p.explica) {
          ponerMensaje(tipo, titulo, p.explica);
          if (p.renglon) agregarPaso(p.etq, p.renglon, p.explica.split(':')[0] + '.');
        } else {
          ponerMensaje(o.ok ? 'ok' : 'info', o.ok ? '¡Bien pensado!' : 'A comprobarlo.', o.ok ? p.siBien : p.siMal);
        }
        avanzar();
      };
      if (p.correr) { ponerMensaje('info', 'Ahí van.', 'Los dos salen al mismo tiempo.'); correr(cerrar); }
      else if (p.moverA != null) moverA(p.moverA, cerrar);
      else cerrar();
    }

    function alMoverRango(valor) {
      st.angulo = Number(valor);
      pintarAngulo();
      const p = st.reto.pasos[st.iPaso];
      if (st.fase === 'paso' && p && p.tipo === 'mueve' && st.angulo >= p.hasta) {
        ponerMensaje('ok', '¡Muy bien!', p.final);
        if (p.renglon) agregarPaso(p.etq, p.renglon, 'Con más inclinación, la normal es menor.');
        avanzar();
      }
    }

    function revisarNumero() {
      const p = st.reto.pasos[st.iPaso], campo = $('#rm-campo', raiz);
      const cands = MA.leerNumeros(campo.value);
      if (!cands.length) { ponerMensaje('aviso', 'Solo el número.', 'Sin la unidad. Ejemplos válidos: 0,5 · 1/2'); campo.focus(); return; }
      if (cands.some(x => MA.casiIgual(x, p.respuesta, 0.01))) {
        agregarPaso(p.etq, p.renglon, p.nota);
        ponerMensaje('ok', '¡Correcto!', p.nota || '');
        avanzar();
        return;
      }
      const err = (p.errores || []).find(e => cands.some(x => MA.casiIgual(x, e.valor, 0.01)));
      ponerMensaje('error', 'Todavía no.', err ? err.msg : 'Hay que mirar otra vez qué lado o qué parte se pide.');
      campo.select();
    }

    /* ---------- Eventos ---------- */
    raiz.addEventListener('input', e => { if (e.target.classList.contains('rm-rango')) alMoverRango(e.target.value); });
    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b)) return;
      if (b.dataset.reto) { cargar(R.find(r => r.id === b.dataset.reto)); return; }
      if (b.dataset.sig) { cargar(R.find(r => r.id === b.dataset.sig)); raiz.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' }); return; }
      if (b.dataset.predice != null) { predecir(Number(b.dataset.predice)); return; }
      const a = b.dataset.accion;
      if (a === 'partir') { st.partido = !st.partido; pintarPartir(); dibujar(); }
      else if (a === 'numero') revisarNumero();
      else if (a === 'reiniciar') cargar(st.reto);
      else if (a === 'final' && opciones.final) opciones.final.ir();
      else if (a === 'luego' && opciones.irMesa) opciones.irMesa(st.reto.luego.reto);
    });
    raiz.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'rm-campo') { e.preventDefault(); revisarNumero(); } });
    MA.bus.on('progreso', () => pintarRetos());

    const guardado = MA.almacen.leer('m5.rampa.reto', null);
    cargar(R.find(r => r.id === guardado) || R.find(r => !MA.progreso.hecho('m5.rampa.' + r.id)) || R[0]);

    return { cargarReto(id) { const r = R.find(x => x.id === id); if (r) cargar(r); } };
  }

  MA.Rampa = { crear: crearRampa };
})();
