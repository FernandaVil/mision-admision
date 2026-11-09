/* =====================================================================
   Herramienta · la torre de lanzamiento
   ---------------------------------------------------------------------
   Una pelota que se lanza hacia arriba, se suelta desde lo alto o sale
   de lado. Deja una huella en cada segundo, como el radar de pista del
   módulo 4, y lleva dos flechas: el peso (violeta), que no cambia, y la
   velocidad (azul punteada), que se achica, se apaga en lo más alto y
   crece hacia abajo. Ahí se ve que la velocidad no es una fuerza: es lo
   que trae, y el peso se la va cambiando.
   Al lado, los instrumentos y la gráfica de velocidad, que se dibuja
   mientras vuela y cruza el cero en lo más alto. Un segundo de la torre
   dura un segundo de verdad.
   Antes de lanzar se predice o se calcula: la torre no se mueve hasta
   que se responde, y lo que mostraría la respuesta (la aceleración en lo
   más alto, en el reto 1) se tapa hasta preguntarlo.
   Arriba positivo y g = 10, como en las diapositivas. De lado, cada eje
   por su lado: la velocidad se dibuja partida en sus dos ejes.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, icono } = MA;
  const W = 420, H = 336, PISO = 300, TECHO = 34, R = 9;
  const XV = 236, XT0 = 46, XT1 = 92;   // la pelota que sube desde el piso; la torre
  const KV = 2.2, PESO_PX = 46;         // píxeles por m/s de la flecha de velocidad; largo del peso
  const T_GRAF = 8, V_GRAF = 50;        // la gráfica siempre igual: sus ejes no dicen la respuesta

  function crearTorre(raiz, opciones = {}) {
    const C = MA.M6, M5 = MA.M5, RT = C.RETOS_TORRE, { caida } = C;
    const reducido = MA.movimientoReducido();
    const st = { reto: null, origen: null, iPaso: 0, t: 0, fase: 'paso', token: 0, raf: null, corriendo: false, pendientes: [], revelados: new Set() };

    raiz.classList.add('banco', 'mesa-tr');
    raiz.innerHTML = `
      <div class="banco-cabeza">
        <div><span class="etiqueta">Herramienta</span><h3>La torre de lanzamiento</h3></div>
        <div class="segmentado m4-grupo tr-retos" role="group" aria-label="Retos de la torre"></div>
      </div>
      <div class="bz-origen tr-origen" hidden></div>
      <div class="cv-reto tr-reto"></div>
      <div class="tr-mesa">
        <div class="tr-escena"></div>
        <div class="tr-lado">
          <div class="tr-tablero"></div>
          <div class="tr-grafica"></div>
          <p class="texto-3 tr-leyenda"><span class="tr-ley-peso">Violeta: el peso.</span> <span class="tr-ley-vel">Azul punteada: la velocidad, que no es una fuerza.</span> Ámbar: una huella en cada segundo.</p>
        </div>
      </div>
      <div class="tr-panel"></div>
      <div class="banco-pie">
        <div class="mensaje tr-mensaje" role="status" aria-live="polite"></div>
        <div class="fila-botones tr-botones"></div>
      </div>
      <section class="cv-bitacora" aria-label="Pasos">
        <h4>Pasos</h4>
        <p class="texto-3">Lo mismo que se escribe en el papel, renglón por renglón.</p>
        <ol class="bz-pasos tr-pasos"></ol>
      </section>`;

    /* ---------- Mensajes y bitácora ---------- */
    const msg = $('.tr-mensaje', raiz);
    function ponerMensaje(tipo, titulo, texto) {
      if (!tipo) { msg.className = 'mensaje tr-mensaje'; msg.innerHTML = ''; return; }
      const ico = { ok: 'checkCirculo', aviso: 'alerta', info: 'info', error: 'errorCirculo' }[tipo];
      msg.className = 'mensaje tr-mensaje ' + tipo;
      msg.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }
    const pasos = [];
    function agregarPaso(etiqueta, html, nota) {
      pasos.push({ etiqueta, html, nota });
      $('.tr-pasos', raiz).innerHTML = pasos.map(p => `<li><span class="bz-paso-etq">${p.etiqueta}</span><span class="mt">${p.html || ''}</span>${p.nota ? `<span class="bz-paso-nota">${p.nota}</span>` : ''}</li>`).join('');
    }
    function borrarPasos() { pasos.length = 0; $('.tr-pasos', raiz).innerHTML = ''; }

    /* ---------- Escala ----------
       La altura se mide desde el piso hasta la base de la pelota. */
    function escala() {
      const r = st.reto, py = (PISO - TECHO) / r.alto;
      const x0 = r.lado ? XT1 + 12 : r.torre ? XT1 + 18 : XV;
      const px = r.lado ? (W - 30 - x0) / r.ancho : 0;
      return { y: h => PISO - h * py, x: d => x0 + d * px, x0 };
    }
    const redondo = (x, k = 1) => { const v = Math.round(x * 10 ** k) / 10 ** k; return Math.abs(v) < 1e-9 ? 0 : v; };
    const tFin = h => (h === 'suelo' ? Math.max(...st.reto.tiros.map(caida.tSuelo)) : h);

    function rayas(x0, x1, y) {
      let s = '';
      for (let x = x0; x < x1; x += 16) s += `M${x} ${y}l-8 9`;
      return `<path class="m5-rayado" d="${s}"/>`;
    }

    function regla(E) {
      const r = st.reto, paso = r.alto <= 30 ? 5 : r.alto <= 60 ? 10 : r.alto <= 100 ? 20 : 25;
      let s = `<line class="m6-regla" x1="30" y1="${PISO}" x2="30" y2="${E.y(r.alto).toFixed(1)}"/>`;
      for (let h = 0; h <= r.alto + 1e-9; h += paso) {
        const y = E.y(h).toFixed(1);
        s += `<line class="m6-regla" x1="26" y1="${y}" x2="34" y2="${y}"/><text class="m6-regla-num" x="22" y="${(Number(y) + 4).toFixed(1)}" text-anchor="end">${MA.fmt(h)}</text>`;
      }
      s += `<text class="m6-regla-num" x="30" y="${(E.y(r.alto) - 10).toFixed(1)}" text-anchor="middle">m</text>`;
      if (r.lado) {
        const yr = PISO + 30;
        s += `<line class="m6-regla" x1="${E.x0}" y1="${yr}" x2="${E.x(r.ancho).toFixed(1)}" y2="${yr}"/>`;
        for (let d = 0; d <= r.ancho + 1e-9; d += r.ancho > 80 ? 20 : 10) {
          const x = E.x(d).toFixed(1);
          s += `<line class="m6-regla" x1="${x}" y1="${yr - 4}" x2="${x}" y2="${yr + 4}"/><text class="m6-regla-num" x="${x}" y="${yr + 18}" text-anchor="middle">${MA.fmt(d)}</text>`;
        }
        s += `<text class="m6-regla-num" x="${(E.x(r.ancho) + 14).toFixed(1)}" y="${yr + 4}">m</text>`;
      }
      return s;
    }

    /* ---------- El dibujo ---------- */
    function dibujar() {
      const r = st.reto, E = escala();
      let s = `<line class="m5-piso" x1="12" y1="${PISO}" x2="${W - 8}" y2="${PISO}"/>${r.lado ? '' : rayas(24, W - 8, PISO)}${regla(E)}`;
      if (r.torre) {
        const yt = E.y(r.tiros[0].h0);
        let ventanas = '';
        for (let y = yt + 18; y < PISO - 10; y += 26) ventanas += `M${XT0 + 10} ${y.toFixed(1)}h${XT1 - XT0 - 20}`;
        s += `<rect class="m6-torre" x="${XT0}" y="${yt.toFixed(1)}" width="${XT1 - XT0}" height="${(PISO - yt).toFixed(1)}"/><path class="m6-torre-raya" d="${ventanas}"/>`;
      }
      const ahora = Math.floor(st.t + 1e-9);
      const dosCuerpos = r.tiros.length > 1;
      // Las huellas de cada segundo
      for (let k = 1; k <= ahora; k++) {
        const ps = r.tiros.map(tiro => ({ tiro, p: caida.pos(tiro, k) })).filter(o => k <= caida.tSuelo(o.tiro) + 1e-9);
        if (dosCuerpos && ps.length === 2) {
          const y = E.y(ps[0].p.h) - R;
          s += `<line class="m6-guia" x1="${E.x(ps[0].p.x).toFixed(1)}" y1="${y.toFixed(1)}" x2="${E.x(ps[1].p.x).toFixed(1)}" y2="${y.toFixed(1)}"/>`;
        }
        ps.forEach(({ tiro, p }, i) => {
          const x = E.x(p.x), y = E.y(p.h) - R;
          s += `<circle class="m6-huella" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5"/>`;
          if (dosCuerpos && i === 0) return;
          const baja = !r.lado && !r.torre && k > tiro.v0 / C.G + 1e-9;
          s += `<text class="m6-huella-num" x="${(x + (baja ? -12 : 12)).toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="${baja ? 'end' : 'start'}">${k} s</text>`;
        });
      }
      // Los cuerpos y sus flechas
      let desc = [];
      r.tiros.forEach((tiro, i) => {
        const p = caida.pos(tiro, st.t), x = E.x(p.x), y = E.y(p.h) - R;
        s += `<g class="m5-cuerpo"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${R}"/><path class="m5-raya" d="M${(x - R).toFixed(1)} ${y.toFixed(1)}q${R} -5 ${2 * R} 0"/></g>`;
        if (tiro.nombre && dosCuerpos) s += `<text class="m5-rotulo" x="${(x + (i === 0 ? -14 : 14)).toFixed(1)}" y="${(y - 12).toFixed(1)}" text-anchor="${i === 0 ? 'end' : 'start'}">${tiro.nombre}</text>`;
        if (!p.enSuelo) {
          s += M5.flechaSvg(x, y, { dir: 'aba', px: PESO_PX, clase: 'peso', texto: i === 0 ? 'Peso' : '', ox: -12, et: { x: x - 16, y: y + PESO_PX + 16, ancla: 'end' } }, 0);
          const vv = Math.min(Math.abs(p.v) * KV, 100);
          if (vv >= 8) s += M5.flechaSvg(x, y, { dir: p.v > 0 ? 'arr' : 'aba', px: vv, clase: 'vel', texto: r.lado ? '' : 'v', ox: 12 }, 0);
          if (tiro.vx) s += M5.flechaSvg(x, y, { dir: 'der', px: Math.min(tiro.vx * KV, 100), clase: 'vel', texto: '', oy: -12 }, 0);
        }
        desc.push(`${tiro.nombre ? tiro.nombre + ': ' : ''}altura ${MA.fmt(redondo(p.h))} m, velocidad vertical ${MA.fmt(redondo(p.v))} m/s`);
      });
      $('.tr-escena', raiz).innerHTML = `
        <svg class="m5-fig tr-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="La torre de lanzamiento a los ${MA.fmt(redondo(st.t))} s. ${MA.esc(desc.join('. '))}">${s}</svg>`;
    }

    function pintarTablero() {
      const r = st.reto;
      const dato = (nombre, valor, unidad, clase = '') => `<div class="rp-instrumento ${clase}"><small>${nombre}</small><div><b>${valor}</b><span>${unidad}</span></div></div>`;
      const ultimo = r.tiros[r.tiros.length - 1], p = caida.pos(ultimo, st.t);
      const tapada = (r.ocultos || []).includes('a') && !st.revelados.has('a');
      let html = dato('Tiempo', MA.fmt(redondo(st.t)), 's') + dato('Altura', MA.fmt(redondo(p.h)), 'm');
      if (r.lado) {
        html += dato('Velocidad horizontal', MA.fmt(ultimo.vx || 0), 'm/s') + dato('Velocidad vertical', MA.fmt(redondo(p.v)), 'm/s') + dato('Distancia horizontal', MA.fmt(redondo(p.x)), 'm');
      } else {
        html += dato('Velocidad', MA.fmt(redondo(p.v)), 'm/s', 'rp-i-v') + dato('Aceleración', tapada ? '?' : MA.fmt(-C.G), 'm/s²', 'rp-i-a');
      }
      $('.tr-tablero', raiz).innerHTML = html;
    }

    // La gráfica de velocidad: se dibuja mientras vuela. Los ejes son siempre los mismos (8 s y ±50 m/s),
    // porque unos ejes a la medida dirían cuánto tarda o con qué velocidad llega
    function pintarGrafica() {
      const r = st.reto, cont = $('.tr-grafica', raiz);
      cont.hidden = !!r.lado;
      if (r.lado) { cont.innerHTML = ''; return; }
      const tiro = r.tiros[0], T = T_GRAF, arriba = V_GRAF, abajo = -V_GRAF;
      const X0 = 46, X1 = 300, Y0 = 20, Y1 = 152;
      const x = t => X0 + t / T * (X1 - X0), y = v => Y0 + (arriba - v) / (arriba - abajo) * (Y1 - Y0);
      const cero = y(0).toFixed(1);
      let marcas = '';
      for (let k = 1; k <= T; k++) marcas += `<line class="m5-g-guia" x1="${x(k).toFixed(1)}" y1="${Number(cero) - 4}" x2="${x(k).toFixed(1)}" y2="${Number(cero) + 4}"/>${k % 2 === 0 ? `<text class="m5-g-num" x="${x(k).toFixed(1)}" y="${Number(cero) + 18}" text-anchor="middle">${k}</text>` : ''}`;
      [arriba, abajo].forEach(v => { marcas += `<line class="m5-g-guia" x1="${X0}" y1="${y(v).toFixed(1)}" x2="${X1}" y2="${y(v).toFixed(1)}"/><text class="m5-g-num" x="${X0 - 6}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${MA.fmt(v)}</text>`; });
      const tt = Math.min(st.t, T), vt = tiro.v0 - C.G * tt;
      const linea = tt > 0 ? `<polyline class="m5-g-linea" points="${x(0).toFixed(1)},${y(tiro.v0).toFixed(1)} ${x(tt).toFixed(1)},${y(vt).toFixed(1)}"/><circle class="tr-g-punto" cx="${x(tt).toFixed(1)}" cy="${y(vt).toFixed(1)}" r="4"/>` : '';
      cont.innerHTML = `
        <svg class="m5-graf tr-graf" viewBox="0 0 322 176" role="img" aria-label="Gráfica de velocidad contra tiempo, con arriba positivo. ${tt > 0 ? `Va de ${MA.fmt(tiro.v0)} m/s a ${MA.fmt(redondo(vt))} m/s en ${MA.fmt(redondo(tt))} s` : 'Todavía vacía'}">
          ${marcas}
          <path class="m5-g-eje" d="M${X0} ${Y0 - 8}V${Y1}M${X0} ${cero}H${X1 + 6}"/>
          <path class="m5-g-punta" d="M${X0} ${Y0 - 14}l-5 9h10zM${X1 + 12} ${cero}l-9 -5v10z"/>
          ${linea}
          <text class="m5-g-rot" x="${X0 + 8}" y="${Y0 - 6}">Velocidad (m/s)</text>
          <text class="m5-g-rot" x="${X1 + 12}" y="${Number(cero) - 8}" text-anchor="end">t (s)</text>
        </svg>`;
    }

    function pintar() { dibujar(); pintarTablero(); pintarGrafica(); }

    // Corre la torre hasta un segundo, despacio: un segundo de la torre es un segundo de verdad
    function animar(hasta, luego) {
      const token = ++st.token;
      st.corriendo = true;
      $$('.tr-panel button', raiz).forEach(b => { b.disabled = true; });
      const fin = () => { st.corriendo = false; luego(); };
      if (reducido || hasta <= st.t) { st.t = Math.max(st.t, hasta); pintar(); fin(); return; }
      const de = st.t, t0 = performance.now();
      const paso = ahora => {
        if (token !== st.token) return;
        st.t = Math.min(hasta, de + (ahora - t0) / 1000);
        pintar();
        if (st.t < hasta) st.raf = requestAnimationFrame(paso); else fin();
      };
      st.raf = requestAnimationFrame(paso);
    }

    /* ---------- Los retos ---------- */
    function pintarRetos() {
      $('.tr-retos', raiz).innerHTML = RT.map((r, i) => {
        const hecho = MA.progreso.hecho('m6.torre.' + r.id);
        return `<button type="button" class="segmento" data-reto="${r.id}" aria-pressed="${!st.origen && st.reto === r}" aria-label="Reto ${i + 1}: ${MA.esc(r.titulo)}${hecho ? ', hecho' : ''}" title="${MA.esc(r.titulo)}">${i + 1}${hecho ? `<span class="ok">${icono('check')}</span>` : ''}</button>`;
      }).join('');
    }

    function cargar(reto, origen) {
      if (st.raf) cancelAnimationFrame(st.raf);
      st.token++;
      Object.assign(st, { reto, origen: origen || null, iPaso: 0, t: reto.t0 || 0, fase: 'paso', corriendo: false, pendientes: [], revelados: new Set() });
      if (!origen) MA.almacen.guardar('m6.torre.reto', reto.id);
      const i = RT.indexOf(reto);
      $('.tr-reto', raiz).innerHTML = `
        <div class="m4-pildoras"><span class="pildora">Reto ${i + 1} de ${RT.length}</span></div>
        <h4>${reto.titulo}</h4>
        <p>${reto.contexto}</p>`;
      const ori = $('.tr-origen', raiz);
      ori.hidden = !origen;
      ori.innerHTML = origen ? `<span>${icono('hoja')}${origen.etiqueta}</span><button type="button" class="btn btn-secundario btn-chico" data-accion="volver">${icono('flechaI')}${origen.textoVolver}</button>` : '';
      borrarPasos();
      if (reto.inicio) agregarPaso(reto.inicio.etq, reto.inicio.html, reto.inicio.nota);
      ponerMensaje(null);
      pintarRetos();
      prepararPaso();
    }

    const pasoActual = () => st.reto.pasos[st.iPaso];

    function prepararPaso() {
      pintar();
      pintarPanel();
      pintarBotones();
    }

    function pintarPanel() {
      const panel = $('.tr-panel', raiz);
      if (st.fase !== 'paso') { panel.innerHTML = ''; return; }
      const p = pasoActual();
      if (p.tipo === 'predice') {
        panel.innerHTML = `
          <div class="mf-pregunta tr-pregunta">
            <p class="cv-preg-titulo">${icono('pista')}<span>${p.pregunta}</span></p>
            <div class="fila-botones">${p.opciones.map((o, k) => `<button type="button" class="btn btn-secundario btn-chico" data-predice="${k}">${o.txt}</button>`).join('')}</div>
            <p class="texto-3">Primero la predicción; después se ve.</p>
          </div>`;
      } else if (p.tipo === 'numero') {
        panel.innerHTML = `
          <div class="mo-calculo tr-calculo">
            <label for="tr-campo">${p.pregunta}</label>
            <span class="campo-grupo"><input id="tr-campo" class="campo" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="Número">${p.unidad ? `<span class="campo-unidad">${p.unidad}</span>` : ''}</span>
            <button type="button" class="btn btn-chico" data-accion="numero">Comprobar</button>
          </div>`;
      } else if (p.tipo === 'serie') {
        panel.innerHTML = `
          <div class="mo-calculo tr-serie">
            <p class="tr-serie-preg">${p.pregunta}</p>
            <div class="tr-serie-campos">${p.ts.map((t, i) => `
              <label class="tr-serie-campo" for="tr-s${i}"><span>En ${MA.fmt(t)} s</span>
                <span class="campo-grupo"><input id="tr-s${i}" class="campo" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-serie="${i}"><span class="campo-unidad">${p.unidad}</span></span>
              </label>`).join('')}
            </div>
            <button type="button" class="btn btn-chico" data-accion="serie">Comprobar</button>
          </div>`;
      } else if (p.tipo === 'lanza') {
        panel.innerHTML = `
          <div class="mf-pregunta tr-pregunta">
            <p class="cv-preg-titulo">${icono('mano')}<span>${p.pide}</span></p>
            <div class="fila-botones"><button type="button" class="btn" data-accion="lanzar">${icono('flechaD')}${p.boton}</button></div>
          </div>`;
      }
    }

    function pintarBotones() {
      const cont = $('.tr-botones', raiz);
      if (st.fase !== 'listo') {
        cont.innerHTML = `<button type="button" class="btn btn-fantasma btn-chico" data-accion="reiniciar">${icono('reiniciar')}Reiniciar</button>`;
        return;
      }
      const i = RT.indexOf(st.reto), sig = RT[i + 1], l = st.reto.luego;
      let seguir = '';
      if (st.origen) seguir = `<button type="button" class="btn" data-accion="volver">${icono('flechaI')}${st.origen.textoFinal || st.origen.textoVolver}</button>`;
      else {
        if (l) seguir += `<button type="button" class="btn" data-accion="luego">${l.texto}${icono('flechaD')}</button>`;
        if (sig) seguir += `<button type="button" class="${l ? 'btn btn-secundario' : 'btn'}" data-sig="${sig.id}">Siguiente reto${icono('flechaD')}</button>`;
        else if (opciones.final) seguir += `<button type="button" class="btn" data-accion="final">${opciones.final.texto}${icono('flechaD')}</button>`;
      }
      cont.innerHTML = `${seguir}<button type="button" class="btn btn-secundario" data-accion="reiniciar">${icono('reiniciar')}Repetir</button>`;
    }

    function avanzar() {
      if (st.iPaso < st.reto.pasos.length - 1) { st.iPaso++; prepararPaso(); return; }
      st.fase = 'listo';
      pintar();
      pintarPanel();
      pintarBotones();
      if (MA.progreso.marcar('m6.torre.' + st.reto.id)) MA.aviso('Reto completado.');
      pintarRetos();
    }

    function predecir(k) {
      const p = pasoActual(), o = p.opciones[k];
      $$('.tr-panel [data-predice]', raiz).forEach(b => { b.disabled = true; b.classList.toggle('tr-elegida', b.dataset.predice === String(k)); });
      // Algunas predicciones se comprueban recién al lanzar
      if (p.espera) {
        st.pendientes.push({ ok: !!o.ok });
        ponerMensaje('info', 'Anotado.', `«${o.txt}». Se comprueba al lanzar.`);
        avanzar();
        return;
      }
      const cerrar = () => {
        const buena = p.opciones.find(x => x.ok);
        ponerMensaje(o.ok ? 'ok' : 'aviso', o.ok ? '¡Correcto!' : `La respuesta es «${buena.txt}».`, p.explica);
        if (p.renglon) agregarPaso(p.etq, p.renglon);
        if (p.revela) st.revelados.add(p.revela);
        avanzar();
      };
      if (p.lanza != null) { ponerMensaje('info', 'Ahí va.', ''); animar(tFin(p.lanza), cerrar); } else cerrar();
    }

    function lanzar() {
      const p = pasoActual();
      ponerMensaje(null);
      animar(tFin(p.hasta), () => {
        const fallo = st.pendientes.some(x => !x.ok);
        ponerMensaje(fallo ? 'aviso' : 'ok', fallo ? 'Las huellas lo muestran.' : '¡Muy bien!', p.final);
        (p.renglones || []).forEach(([etq, html]) => agregarPaso(etq, html));
        if (p.renglon) agregarPaso(p.etq, p.renglon);
        st.pendientes = [];
        avanzar();
      });
    }

    function revisarNumero() {
      const p = pasoActual(), campo = $('#tr-campo', raiz);
      const cands = MA.leerNumeros(campo.value).map(x => (p.abs ? Math.abs(x) : x));
      if (!cands.length) { ponerMensaje('aviso', 'Solo el número.', 'Sin la unidad. Ejemplos válidos: 2,5 · −10 · 1/2'); campo.focus(); return; }
      if (cands.some(x => MA.casiIgual(x, p.respuesta, 0.01))) {
        agregarPaso(p.etq, p.renglon, p.nota);
        ponerMensaje('ok', '¡Correcto!', p.nota || '');
        avanzar();
        return;
      }
      const err = (p.errores || []).find(e => cands.some(x => MA.casiIgual(x, e.valor, 0.01)));
      ponerMensaje('error', 'Todavía no.', err ? err.msg : 'Hay que revisar el renglón otra vez, con lo que dice el enunciado.');
      campo.select();
    }

    function revisarSerie() {
      const p = pasoActual();
      const campos = p.ts.map((_, i) => $('#tr-s' + i, raiz));
      const vals = campos.map(c => MA.leerNumeros(c.value));
      const vacio = vals.findIndex(v => !v.length);
      if (vacio >= 0) { ponerMensaje('aviso', 'Falta un número.', 'Un número en cada casilla, sin la unidad.'); campos[vacio].focus(); return; }
      let primero = -1;
      campos.forEach((c, i) => {
        const ok = vals[i].some(x => MA.casiIgual(x, p.respuestas[i], 0.01));
        c.classList.toggle('tr-bien', ok);
        c.classList.toggle('tr-mal', !ok);
        if (!ok && primero < 0) primero = i;
      });
      if (primero < 0) {
        agregarPaso(p.etq, p.renglon, p.nota);
        ponerMensaje('ok', '¡Correcto!', p.nota || '');
        avanzar();
        return;
      }
      const texto = (p.error && p.error(vals[primero][0], primero)) || `En ${MA.fmt(p.ts[primero])} s todavía no. La gravedad le quita 10 m/s en cada segundo.`;
      ponerMensaje('error', 'Todavía no.', texto);
      campos[primero].select();
    }

    /* ---------- Eventos ---------- */
    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b) || b.disabled) return;
      if (b.dataset.reto) { cargar(RT.find(r => r.id === b.dataset.reto)); return; }
      if (b.dataset.sig) { cargar(RT.find(r => r.id === b.dataset.sig)); raiz.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' }); return; }
      if (st.corriendo) return;
      if (b.dataset.predice != null) { predecir(Number(b.dataset.predice)); return; }
      const a = b.dataset.accion;
      if (a === 'lanzar') lanzar();
      else if (a === 'numero') revisarNumero();
      else if (a === 'serie') revisarSerie();
      else if (a === 'reiniciar') cargar(st.reto, st.origen);
      else if (a === 'volver' && st.origen) st.origen.volver();
      else if (a === 'final' && opciones.final) opciones.final.ir();
      else if (a === 'luego' && st.reto.luego) location.hash = st.reto.luego.ir;
    });
    raiz.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      if (e.target.id === 'tr-campo') { e.preventDefault(); revisarNumero(); }
      else if (e.target.dataset && e.target.dataset.serie != null) {
        e.preventDefault();
        const sig = $('#tr-s' + (Number(e.target.dataset.serie) + 1), raiz);
        if (sig && !sig.value) sig.focus(); else revisarSerie();
      }
    });
    MA.bus.on('progreso', () => pintarRetos());

    const guardado = MA.almacen.leer('m6.torre.reto', null);
    cargar(RT.find(r => r.id === guardado) || RT.find(r => !MA.progreso.hecho('m6.torre.' + r.id)) || RT[0]);

    return {
      cargarReto(id) { const r = RT.find(x => x.id === id); if (r) cargar(r); },
      cargarProblema(id, origen) { const r = RT.find(x => x.id === id); if (r) cargar(r, origen); }
    };
  }

  MA.Torre = { crear: crearTorre };
})();
