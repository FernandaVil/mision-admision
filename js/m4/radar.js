/* =====================================================================
   Herramienta 1 · radar de pista
   ---------------------------------------------------------------------
   Un avión en una pista vista desde arriba y cuatro instrumentos:
   tiempo, velocidad, distancia y aceleración. Cada segundo deja una
   huella: con velocidad constante quedan parejas; con aceleración se
   separan, y al frenar se juntan. La flecha azul es la velocidad. La
   bitácora anota un renglón por segundo, como en el papel.
   En los retos primero se escribe la predicción y después vuela: el
   radar se detiene justo en lo que se preguntó. Si la predicción
   falla, se explica el error y se ofrece otro vuelo con otros números,
   para que no se avance copiando lo que mostró el radar. En el modo
   libre se mueven los deslizadores y se despega cuando se quiera.
   Los vuelos largos de la práctica se ven en cámara rápida.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, icono } = MA;
  const ALTO = 196, IZQ = 52, DER = 26, Y = 102;
  const LIBRE = { pista: 400, tMax: 12 };
  const UNIDAD = { d: 'm', t: 's', v: 'm/s' };
  const GRUPOS = { mru: 'Velocidad constante', mruv: 'Con aceleración' };
  const PASOS = [1, 2, 5, 10, 20, 30, 60];
  const ESCALAS = [5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
  const PISTA = {
    mru: 'La velocidad dice cuántos metros avanza en cada segundo.',
    mruv: 'La aceleración dice cuánta velocidad gana (o pierde) en cada segundo. Para la distancia sirve la velocidad promedio: la de la mitad entre la del principio y la del final.'
  };

  // 4,0 · 12,5: siempre con un decimal mientras vuela, para que los números no salten
  const fijo = x => { const s = MA.fmt(Math.round(x * 10) / 10, 1); return /,/.test(s) ? s : s + ',0'; };
  const f = x => MA.fmt(x, 1);

  function crearRadar(raiz, opciones = {}) {
    const C = MA.M4, M = C.mov, R = C.RETOS_RADAR;
    const reducido = MA.movimientoReducido();
    const st = {
      reto: null, vuelo: 0, origen: null, libre: { modo: 'mru', v: 20, v0: 0, a: 2 },
      p: null, pista: LIBRE.pista, tFin: 0, finPista: false, ritmo: 1, paso: 1, vmax: 1,
      t: 0, fase: 'listo', prediccion: null, repitiendo: false, raf: null, ultimo: 0, pintadas: null
    };

    raiz.classList.add('banco', 'mesa-rp');
    raiz.innerHTML = `
      <div class="banco-cabeza">
        <div><span class="etiqueta">Herramienta 1</span><h3>Radar de pista</h3></div>
        <div class="m4-retos rp-retos" role="group" aria-label="Retos del radar"></div>
      </div>
      <div class="bz-origen rp-origen" hidden></div>
      <div class="cv-reto rp-reto"></div>
      <div class="rp-controles" hidden></div>
      <div class="rp-escena"><svg class="rp-svg" aria-hidden="true" focusable="false"></svg></div>
      <div class="rp-tablero" aria-label="Instrumentos">
        ${[['t', 'Tiempo', 's'], ['v', 'Velocidad', 'm/s'], ['d', 'Distancia', 'm'], ['a', 'Aceleración', 'm/s²']].map(([k, nombre, u]) => `
          <div class="rp-instrumento rp-i-${k}"><small>${nombre}</small><div><b data-lee="${k}">0,0</b> <span>${u}</span></div></div>`).join('')}
      </div>
      <div class="mf-pregunta rp-pregunta" hidden></div>
      <div class="banco-pie">
        <div class="mensaje rp-mensaje" role="status" aria-live="polite"></div>
        <div class="fila-botones rp-botones"></div>
      </div>
      <section class="cv-bitacora" aria-label="Bitácora del vuelo">
        <h4>Bitácora del vuelo</h4>
        <p class="texto-3">Un renglón por segundo, como se escribiría en el papel.</p>
        <div class="tabla-envoltura"><table class="tabla rp-tabla"><thead></thead><tbody></tbody></table></div>
      </section>`;

    const svg = $('.rp-svg', raiz), escena = $('.rp-escena', raiz), msg = $('.rp-mensaje', raiz);
    let ancho = 640;
    const x = d => IZQ + MA.clamp(d / st.pista, 0, 1) * (ancho - IZQ - DER);

    function ponerMensaje(tipo, titulo, texto) {
      if (!tipo) { msg.className = 'mensaje rp-mensaje'; msg.innerHTML = ''; return; }
      const ico = { ok: 'checkCirculo', aviso: 'alerta', info: 'info', error: 'errorCirculo' }[tipo];
      msg.className = 'mensaje rp-mensaje ' + tipo;
      msg.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }

    /* ---------- Cuentas del vuelo ---------- */
    const unidad = () => (st.reto && st.reto.elige ? 'm/s' : UNIDAD[st.p.mide]);
    const respuesta = () => (st.reto && st.reto.respuesta ? st.reto.respuesta(st.p) : M.medir(st.p));
    function calcularVuelo() {
      const p = st.p;
      st.pista = p.pista;
      let tf = p.hasta === 'libre' ? Math.min(LIBRE.tMax, M.tParada(p)) : M.tiempoFinal(p);
      const tp = M.tiempoHasta(p, st.pista);
      st.finPista = tp < tf - 1e-9;
      tf = Math.min(tf, tp);
      st.tFin = isFinite(tf) ? tf : 0;   // sin velocidad y sin acelerar, no se mueve
      st.ritmo = st.tFin > 12 ? Math.ceil(st.tFin / 8) : 1;
      st.paso = PASOS.find(s => st.tFin / s <= 12) || 60;
      st.vmax = Math.max(1, p.v0, M.estado(p, st.tFin).v);
    }
    // Con movimiento reducido, el radar salta de huella en huella
    const tiempoVisible = () => (reducido && st.fase === 'volando' ? Math.floor(st.t / st.paso + 1e-9) * st.paso : st.t);

    /* ---------- Dibujo ---------- */
    function dibujarFondo() {
      ancho = Math.max(300, Math.round(escena.clientWidth || 640));
      svg.setAttribute('viewBox', `0 0 ${ancho} ${ALTO}`);
      const lugar = Math.max(4, Math.floor((ancho - IZQ - DER) / 64));
      const paso = ESCALAS.find(s => st.pista / s <= lugar) || 1000;
      let escala = '';
      for (let d = 0; d <= st.pista + 1e-9; d += paso) {
        const xd = x(d).toFixed(1);
        escala += `<line class="rp-tick" x1="${xd}" y1="146" x2="${xd}" y2="153"/><text class="rp-etq-escala" x="${xd}" y="167" text-anchor="middle">${MA.fmt(d)}${d + paso > st.pista + 1e-9 ? ' m' : ''}</text>`;
      }
      let marca = '';
      if (st.p.marca != null) {
        const xm = x(st.p.marca), cerca = xm > ancho - 90;
        marca = `<line class="rp-marca" x1="${xm.toFixed(1)}" y1="54" x2="${xm.toFixed(1)}" y2="150"/>
          <text class="rp-etq-marca" x="${xm.toFixed(1)}" y="188" text-anchor="${cerca ? 'end' : 'middle'}">${st.p.textoMarca || 'Marca'}: ${MA.fmt(st.p.marca)} m</text>`;
      }
      svg.innerHTML = `
        <defs><marker id="rp-punta" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3.5" markerHeight="3.5" orient="auto"><path class="rp-punta" d="M0 0L10 5L0 10z"/></marker></defs>
        <rect class="rp-asfalto" x="6" y="62" width="${ancho - 12}" height="80" rx="6"/>
        <line class="rp-umbral" x1="${x(0)}" y1="66" x2="${x(0)}" y2="138"/>
        <line class="rp-eje" x1="${x(0) + 10}" y1="${Y}" x2="${ancho - 14}" y2="${Y}"/>
        ${escala}${marca}
        <g class="rp-huellas"></g>
        <line class="rp-flecha" x1="0" y1="${Y}" x2="0" y2="${Y}" marker-end="url(#rp-punta)"/>
        ${C.avionSvg(x(0), Y)}`;
      st.pintadas = null;
    }
    function dibujar() {
      const t = tiempoVisible(), e = M.estado(st.p, t), xn = x(e.d);
      $('.rp-avion', svg).setAttribute('transform', `translate(${(xn - 17.85).toFixed(1)} ${Y}) rotate(90) scale(1.75) translate(-12 -12)`);
      const fl = $('.rp-flecha', svg);
      fl.style.display = e.v > 0.05 ? '' : 'none';
      fl.setAttribute('x1', (xn + 5).toFixed(1));
      fl.setAttribute('x2', Math.min(ancho - 4, xn + 14 + 78 * e.v / st.vmax).toFixed(1));
      $('[data-lee="t"]', raiz).textContent = fijo(t);
      $('[data-lee="v"]', raiz).textContent = fijo(e.v);
      $('[data-lee="d"]', raiz).textContent = fijo(e.d);
      $('[data-lee="a"]', raiz).textContent = MA.fmt(st.p.a || 0);
      // Las huellas y la bitácora cambian una vez por segundo
      const k = Math.floor(t / st.paso + 1e-9), clave = k + st.fase;
      if (clave !== st.pintadas) { st.pintadas = clave; pintarHuellas(k); pintarBitacora(k); }
    }
    function pintarHuellas(k) {
      let h = '', ultimaEtq = -99, dAntes = 0;
      for (let i = 0; i <= k && i * st.paso <= st.tFin + 1e-9; i++) {
        const ti = i * st.paso, d = M.estado(st.p, ti).d, xd = x(d);
        h += `<line class="rp-huella" x1="${xd.toFixed(1)}" y1="36" x2="${xd.toFixed(1)}" y2="62"/>`;
        if (xd - ultimaEtq >= 26) { h += `<text class="rp-etq-huella" x="${xd.toFixed(1)}" y="28" text-anchor="middle">${MA.fmt(ti)} s</text>`; ultimaEtq = xd; }
        if (i > 0 && xd - x(dAntes) >= 44) h += `<text class="rp-etq-tramo" x="${((xd + x(dAntes)) / 2).toFixed(1)}" y="136" text-anchor="middle">${f(d - dAntes)} m</text>`;
        dAntes = d;
      }
      $('.rp-huellas', svg).innerHTML = h;
    }
    function pintarBitacora(k) {
      const filas = [];
      for (let i = 0; i <= k && i * st.paso <= st.tFin + 1e-9; i++) filas.push(i * st.paso);
      if (st.fase === 'fin' && st.tFin - filas[filas.length - 1] > 1e-6) filas.push(st.tFin);
      $('.rp-tabla thead', raiz).innerHTML = `<tr><th scope="col">Tiempo</th><th scope="col">Velocidad</th><th scope="col">Distancia</th><th scope="col">${st.paso === 1 ? 'En ese segundo' : `En esos ${st.paso} s`}</th></tr>`;
      $('.rp-tabla tbody', raiz).innerHTML = filas.map((ti, j) => {
        const e = M.estado(st.p, ti), antes = j ? M.estado(st.p, filas[j - 1]).d : 0;
        const ultima = st.fase === 'fin' && j === filas.length - 1;
        return `<tr${ultima ? ' class="rp-ultima"' : ''}><td>${f(ti)} s</td><td>${f(e.v)} m/s</td><td>${f(e.d)} m</td><td>${j ? `+${f(e.d - antes)} m` : '—'}</td></tr>`;
      }).join('');
    }
    if (window.ResizeObserver) {
      let medida = 0;
      new ResizeObserver(() => {
        const w = Math.round(escena.clientWidth);
        if (!w || w === medida || !st.p) return;
        medida = w;
        dibujarFondo();
        dibujar();
      }).observe(escena);
    }

    /* ---------- Vuelo ---------- */
    function parar() { if (st.raf) cancelAnimationFrame(st.raf); st.raf = null; }
    function volar() {
      parar();
      st.fase = 'volando';
      pintarBotones();
      pintarControles();
      st.ultimo = performance.now();
      const cuadro = ahora => {
        st.t = Math.min(st.tFin, st.t + Math.min(0.1, (ahora - st.ultimo) / 1000) * st.ritmo);
        st.ultimo = ahora;
        if (st.t >= st.tFin - 1e-9) { st.t = st.tFin; st.raf = null; aterrizar(); return; }
        dibujar();
        st.raf = requestAnimationFrame(cuadro);
      };
      st.raf = requestAnimationFrame(cuadro);
    }
    function aterrizar() {
      st.fase = 'fin';
      dibujar();
      pintarControles();
      if (st.repitiendo) { st.repitiendo = false; pintarBotones(); return; }
      if (st.p.hasta === 'libre') resumenLibre();
      else evaluar();
      pintarBotones();
    }
    function repetir() {
      st.t = 0;
      st.repitiendo = true;
      st.pintadas = null;
      volar();
    }

    /* ---------- Retos y problemas: predecir, volar y comparar ---------- */
    function prepararPrediccion(p, cabeza) {
      parar();
      st.p = p;
      st.fase = 'predecir';
      st.prediccion = null;
      st.repitiendo = false;
      st.t = 0;
      calcularVuelo();
      $('.rp-reto', raiz).innerHTML = `${cabeza}<div class="rp-datos">${datosHtml(p)}</div>`;
      const caja = $('.rp-pregunta', raiz);
      caja.hidden = false;
      caja.innerHTML = `
        <p class="cv-preg-titulo">${icono('pista')}<span>Antes de despegar: ${st.reto ? st.reto.pregunta(p) : p.pregunta}</span></p>
        <div class="rp-prediccion">
          <label class="sr-solo" for="rp-campo">Predicción</label>
          <span class="campo-grupo"><input id="rp-campo" class="campo" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="Predicción"><span class="campo-unidad">${unidad()}</span></span>
          <button type="button" class="btn btn-chico" data-accion="despegar">${icono('avion')}Despegar y comprobar</button>
        </div>
        <p class="texto-3">Primero la predicción, de cabeza o en el papel. Después vuela el radar y se compara.</p>`;
      ponerMensaje(null);
      pintarControles();
      pintarOrigen();
      dibujarFondo();
      dibujar();
      pintarBotones();
      pintarRetos();
    }
    function datosHtml(p) {
      const d = [];
      if (st.reto && st.reto.elige) d.push('Velocidad constante: la de la predicción');
      else if (!p.a) d.push(`Velocidad constante: ${f(p.v0)} m/s`);
      else {
        d.push(p.v0 ? `Velocidad inicial: ${f(p.v0)} m/s` : 'Parte del reposo: v₀ = 0');
        d.push(`Aceleración: ${f(p.a)} m/s²`);
      }
      if (p.hasta === 'vf') d.push(`Hasta llegar a ${f(p.vf)} m/s`);
      if (p.hasta === 'para') d.push('Hasta detenerse');
      if (st.ritmo > 1) d.push(`Cámara rápida: ×${st.ritmo}`);
      return d.map((t, i) => `<span class="pildora${i === d.length - 1 && st.ritmo > 1 ? ' pildora-ambar' : ''}">${t}</span>`).join('');
    }
    function cargarReto(reto, vuelo = 0) {
      st.reto = reto;
      st.origen = null;
      st.vuelo = vuelo % reto.vuelos.length;
      MA.almacen.guardar('m4.radar.reto', reto.id);
      const p = Object.assign({ v0: 0, a: 0, hasta: reto.hasta, mide: reto.mide, pista: reto.pista }, reto.vuelos[st.vuelo]);
      if (reto.marca) p.marca = reto.marca(p);
      const i = R.indexOf(reto);
      prepararPrediccion(p, `
        <div class="m4-pildoras"><span class="pildora">Reto ${i + 1} de ${R.length}</span><span class="pildora">Vuelo ${st.vuelo + 1} de ${reto.vuelos.length}</span></div>
        <h4>${reto.titulo}</h4>
        <p>${reto.contexto}</p>`);
    }
    function despegar() {
      const campo = $('#rp-campo', raiz);
      const cands = MA.leerNumeros(campo.value);
      if (!cands.length) { ponerMensaje('aviso', 'Primero, la predicción.', 'Solo el número. Ejemplos válidos: 30 · 2,5'); campo.focus(); return; }
      const resp = respuesta();
      const valor = cands.find(c => MA.casiIgual(c, resp, 0.01)) !== undefined ? resp : cands[0];
      if (st.reto && st.reto.elige) {
        if (!(valor > 0)) { ponerMensaje('aviso', 'La velocidad tiene que ser positiva.', 'Con 0 m/s el avión no se mueve.'); campo.focus(); return; }
        st.p.v0 = valor;
        calcularVuelo();
        dibujarFondo();
      }
      st.prediccion = valor;
      campo.disabled = true;
      $('[data-accion="despegar"]', raiz).hidden = true;
      $('.rp-pregunta .texto-3', raiz).textContent = `Predicción: ${MA.fmt(valor)} ${unidad()}.`;
      ponerMensaje(null);
      st.t = 0;
      volar();
    }
    function evaluar() {
      const r = st.reto, p = st.p, u = unidad(), resp = respuesta(), pred = st.prediccion;
      st.acierto = MA.casiIgual(pred, resp, 0.01);
      const fin = M.estado(p, st.tFin);
      const pista = st.finPista ? ' Se acabó la pista.' : '';
      if (!r) {
        if (st.acierto) ponerMensaje('ok', '¡Correcto!', `El radar marca ${f(resp)} ${u}. Ahora, a escribirlo en el ejercicio.${pista}`);
        else ponerMensaje('error', `El radar marca ${f(resp)} ${u}, no ${f(pred)}.`, `Conviene volver al ejercicio y seguir las pistas en orden: primero los datos, después el tiempo y al final lo que se pregunta.${pista}`);
        return;
      }
      if (st.acierto) {
        ponerMensaje('ok', '¡Correcto!', r.explica(p));
        if (MA.progreso.marcar('m4.radar.' + r.id)) MA.aviso('Reto completado.');
        pintarRetos();
        return;
      }
      const err = r.errores(p).find(e => MA.casiIgual(pred, e.valor, 0.01));
      const titulo = r.elige
        ? `A ${f(pred)} m/s, a los ${f(p.t)} s va en ${f(fin.d)} m: ${fin.d < p.meta ? 'no llega a la marca' : 'se pasa de la marca'}.${pista}`
        : `El radar marca ${f(resp)} ${u}, no ${f(pred)}.`;
      ponerMensaje('error', titulo, `${err ? err.msg + ' ' : ''}${r.explica(p)} Ahora, otro vuelo con otros números.`);
    }

    /* ---------- Modo libre ---------- */
    function cargarLibre() {
      parar();
      st.reto = null;
      st.origen = null;
      MA.almacen.guardar('m4.radar.reto', 'libre');
      $('.rp-pregunta', raiz).hidden = true;
      $('.rp-reto', raiz).innerHTML = `
        <h4>Modo libre</h4>
        <p>Elegir el tipo de movimiento, mover los deslizadores y despegar. La pista mide ${MA.fmt(LIBRE.pista)} m y cada vuelo dura hasta ${LIBRE.tMax} s.</p>`;
      pintarOrigen();
      prepararLibre();
      pintarRetos();
    }
    function prepararLibre() {
      parar();
      const l = st.libre;
      st.p = l.modo === 'mru' ? { v0: l.v, a: 0, hasta: 'libre', pista: LIBRE.pista } : { v0: l.v0, a: l.a, hasta: 'libre', pista: LIBRE.pista };
      st.fase = 'listo';
      st.t = 0;
      st.repitiendo = false;
      calcularVuelo();
      ponerMensaje(null);
      pintarControles();
      dibujarFondo();
      dibujar();
      pintarBotones();
    }
    function pintarControles() {
      const caja = $('.rp-controles', raiz);
      caja.hidden = !!(st.reto || st.origen);
      if (caja.hidden) return;
      const l = st.libre, quieto = st.fase === 'volando' || st.fase === 'pausa';
      const rango = (k, nombre, min, max, paso, u) => `
        <label class="bz-deslizador">
          <span class="bz-ds-nombre">${nombre}</span>
          <output class="mono">${MA.fmt(l[k])} ${u}</output>
          <input type="range" min="${min}" max="${max}" step="${paso}" value="${l[k]}" data-rango="${k}" aria-label="${nombre}" ${quieto ? 'disabled' : ''}>
        </label>`;
      caja.innerHTML = `
        <div class="segmentado" role="group" aria-label="Tipo de movimiento">
          <button type="button" class="segmento" data-modo="mru" aria-pressed="${l.modo === 'mru'}" ${quieto ? 'disabled' : ''}>Velocidad constante</button>
          <button type="button" class="segmento" data-modo="mruv" aria-pressed="${l.modo === 'mruv'}" ${quieto ? 'disabled' : ''}>Con aceleración</button>
        </div>
        <div class="rp-deslizadores">
          ${l.modo === 'mru' ? rango('v', 'Velocidad', 5, 40, 5, 'm/s')
            : rango('v0', 'Velocidad inicial', 0, 30, 5, 'm/s') + rango('a', 'Aceleración', -6, 6, 1, 'm/s²')}
        </div>`;
    }
    function resumenLibre() {
      const p = st.p, e = M.estado(p, st.tFin);
      const fin = st.finPista ? 'Se acabó la pista.' : p.a < 0 && e.v < 0.01 ? 'Se detuvo.' : `Fin del vuelo: ${LIBRE.tMax} s.`;
      const huellas = !p.a ? `Las huellas quedaron parejas: cada segundo avanzó ${f(p.v0)} m.`
        : p.a > 0 ? `Las huellas se separan: cada segundo avanzó ${f(p.a)} m más que el anterior, y la velocidad subió ${f(p.a)} m/s.`
        : `Las huellas se juntan: cada segundo avanzó ${f(-p.a)} m menos que el anterior, y la velocidad bajó ${f(-p.a)} m/s.`;
      ponerMensaje('info', fin, `En ${f(st.tFin)} s recorrió ${f(e.d)} m y terminó a ${f(e.v)} m/s. ${huellas}`);
    }
    function despegarLibre() {
      if (st.tFin <= 0) { ponerMensaje('aviso', 'Así no se mueve.', 'Sin velocidad inicial y sin una aceleración positiva, el avión se queda quieto. Para frenar, primero hay que ir rápido.'); return; }
      if (st.fase === 'fin') { st.t = 0; st.pintadas = null; }
      ponerMensaje(null);
      volar();
    }

    /* ---------- Botones, retos y origen ---------- */
    function pintarBotones() {
      const cont = $('.rp-botones', raiz), b = [];
      const boton = (accion, texto, ico, clase = 'btn') => b.push(`<button type="button" class="${clase}" data-accion="${accion}">${ico ? icono(ico) : ''}${texto}</button>`);
      if (!st.reto && !st.origen) {
        if (st.fase === 'listo') boton('libre-despegar', 'Despegar', 'avion');
        else if (st.fase === 'volando') { boton('pausa', 'Pausa', null, 'btn btn-secundario'); boton('reiniciar', 'Reiniciar', 'reiniciar', 'btn btn-fantasma'); }
        else if (st.fase === 'pausa') { boton('continuar', 'Continuar', 'avion'); boton('reiniciar', 'Reiniciar', 'reiniciar', 'btn btn-fantasma'); }
        else boton('libre-despegar', 'Despegar otra vez', 'avion');
      } else if (st.fase === 'predecir') {
        if (st.reto) boton('pista', 'Pista', 'pista', 'btn btn-secundario btn-chico');
      } else if (st.fase === 'fin') {
        if (st.origen) boton('volver', st.origen.textoFinal || st.origen.textoVolver, 'flechaI');
        else if (!st.acierto) boton('otro', 'Otro vuelo', 'reiniciar');
        else {
          const i = R.indexOf(st.reto), sig = R[i + 1];
          if (sig && sig.grupo !== st.reto.grupo && opciones.cambioGrupo) { boton('cambio', opciones.cambioGrupo.texto, null); boton('siguiente', `Siguiente reto${icono('flechaD')}`, null, 'btn btn-secundario'); }
          else if (sig) boton('siguiente', `Siguiente reto${icono('flechaD')}`, null);
          else if (opciones.final) boton('final', `${opciones.final.texto}${icono('flechaD')}`, null);
        }
        boton('repetir', 'Repetir el vuelo', 'reiniciar', 'btn btn-secundario');
      }
      cont.innerHTML = b.join('');
    }
    function pintarRetos() {
      const boton = r => {
        const i = R.indexOf(r), hecho = MA.progreso.hecho('m4.radar.' + r.id);
        return `<button type="button" class="segmento" data-reto="${r.id}" aria-pressed="${!st.origen && st.reto === r}" aria-label="Reto ${i + 1}: ${MA.esc(r.titulo)}${hecho ? ', hecho' : ''}" title="${MA.esc(r.titulo)}">${i + 1}${hecho ? `<span class="ok">${icono('check')}</span>` : ''}</button>`;
      };
      $('.rp-retos', raiz).innerHTML =
        `<span class="m4-grupo"><button type="button" class="segmento" data-reto="libre" aria-pressed="${!st.origen && !st.reto}">Libre</button></span>` +
        Object.keys(GRUPOS).map(g => `<span class="m4-grupo"><span class="m4-grupo-nombre">${GRUPOS[g]}</span>${R.filter(r => r.grupo === g).map(boton).join('')}</span>`).join('');
    }
    function pintarOrigen() {
      const ori = $('.rp-origen', raiz);
      ori.hidden = !st.origen;
      if (st.origen) ori.innerHTML = `<span>${icono('hoja')}${st.origen.etiqueta}</span><button type="button" class="btn btn-secundario btn-chico" data-accion="volver">${icono('flechaI')}${st.origen.textoVolver}</button>`;
    }

    /* ---------- Eventos ---------- */
    const subir = () => raiz.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' });
    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b)) return;
      if (b.dataset.reto) { if (b.dataset.reto === 'libre') cargarLibre(); else cargarReto(R.find(r => r.id === b.dataset.reto)); return; }
      if (b.dataset.modo) { st.libre.modo = b.dataset.modo; prepararLibre(); return; }
      switch (b.dataset.accion) {
        case 'despegar': despegar(); break;
        case 'libre-despegar': despegarLibre(); break;
        case 'pausa': parar(); st.fase = 'pausa'; pintarBotones(); break;
        case 'continuar': volar(); break;
        case 'reiniciar': prepararLibre(); break;
        case 'repetir': repetir(); break;
        case 'otro': cargarReto(st.reto, st.vuelo + 1); break;
        case 'siguiente': cargarReto(R[R.indexOf(st.reto) + 1]); subir(); break;
        case 'cambio': opciones.cambioGrupo.ir(); break;
        case 'final': opciones.final.ir(); break;
        case 'volver': if (st.origen) { const o = st.origen; parar(); o.volver(); } break;
        case 'pista': ponerMensaje('info', 'Pista.', PISTA[st.reto.grupo]); break;
      }
    });
    raiz.addEventListener('input', e => {
      const k = e.target.dataset && e.target.dataset.rango;
      if (!k) return;
      st.libre[k] = Number(e.target.value);
      $('output', e.target.parentElement).textContent = `${MA.fmt(st.libre[k])} ${k === 'a' ? 'm/s²' : 'm/s'}`;
      const l = st.libre;
      st.p = l.modo === 'mru' ? { v0: l.v, a: 0, hasta: 'libre', pista: LIBRE.pista } : { v0: l.v0, a: l.a, hasta: 'libre', pista: LIBRE.pista };
      st.fase = 'listo';
      st.t = 0;
      calcularVuelo();
      ponerMensaje(null);
      dibujar();
      pintarBotones();
    });
    raiz.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'rp-campo') { e.preventDefault(); despegar(); } });
    MA.bus.on('progreso', () => pintarRetos());

    const guardado = MA.almacen.leer('m4.radar.reto', 'libre');
    const reto = R.find(r => r.id === guardado);
    if (reto) cargarReto(reto); else cargarLibre();

    return {
      // problema: { v0, a, hasta, t | meta | vf, pista, mide, pregunta, marca?, textoMarca? }
      cargarProblema(problema, origen) {
        st.reto = null;
        st.origen = origen || null;
        prepararPrediccion(Object.assign({ v0: 0, a: 0 }, problema), '<h4>El ejercicio, en el radar</h4><p>Los mismos datos del enunciado. Primero la predicción; después, el vuelo.</p>');
      },
      redibujar() { dibujarFondo(); dibujar(); }
    };
  }

  MA.RadarPista = { crear: crearRadar };
})();
