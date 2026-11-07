/* =====================================================================
   Herramienta 1 · mesa de fuerzas
   ---------------------------------------------------------------------
   El diagrama de cuerpo libre, paso a paso, con la llave «¿Quién lo
   toca?»:
   1. Marcar qué toca el cuerpo (los últimos retos lo saltan).
   2. Poner las flechas. La lista trae también fuerzas falsas. La punta se
      arrastra: la dirección se ajusta a 8 posiciones (en la rampa, también
      paralela y perpendicular) y el largo a corto, medio o largo. Así se
      puede decir exactamente qué falló, y funciona con dedo, lápiz, mouse
      y teclado (← → giran, ↑ ↓ cambian el largo).
   3. «Comprobar» explica el primer error que encuentra, sin corregirlo:
      no se avanza por ensayo y error.
   4. Predecir con las flechas: ¿se anulan?, ¿qué hace el cuerpo? Si hay
      datos, la suma con signos, la neta y la aceleración, y el cuerpo sale
      con huellas de cada segundo.
   5. En algunos retos, la pareja de una fuerza (tercera ley).
   Con modo 'cambia' el diagrama ya viene hecho, como en el examen: se
   cuenta un cambio y se decide qué flechas crecen, bajan o siguen igual.
   No usa MA.arrastrable, que arrastra un clon hacia un destino: aquí la
   punta se gira con eventos de puntero, como en el borrador de la práctica.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, icono } = MA;

  function crearMesa(raiz, opciones = {}) {
    const C = MA.M5, R = C.RETOS_FUERZAS, FZ = C.FUERZAS;
    const { igual } = MA.f;
    const reducido = MA.movimientoReducido();
    const st = { reto: null, origen: null, fase: 'toca', flechas: [], marcados: new Set(), iPregunta: 0, signos: {}, cambios: {}, neta: 0, token: 0, arrastre: null, raf: null };

    raiz.classList.add('banco', 'mesa-fz');
    raiz.innerHTML = `
      <div class="banco-cabeza">
        <div><span class="etiqueta">Herramienta 1</span><h3>Mesa de fuerzas</h3></div>
        <div class="m4-retos fz-retos" role="group" aria-label="Retos de la mesa de fuerzas"></div>
      </div>
      <div class="bz-origen fz-origen" hidden></div>
      <div class="cv-reto fz-reto"></div>
      <div class="fz-mesa">
        <div class="fz-escena"></div>
        <div class="fz-panel"></div>
      </div>
      <div class="banco-pie">
        <div class="mensaje fz-mensaje" role="status" aria-live="polite"></div>
        <div class="fila-botones fz-botones"></div>
      </div>
      <section class="cv-bitacora" aria-label="Pasos">
        <h4>Pasos</h4>
        <p class="texto-3">Lo mismo que se escribe en el papel, renglón por renglón.</p>
        <ol class="bz-pasos fz-pasos"></ol>
      </section>`;

    /* ---------- Mensajes y bitácora ---------- */
    const msg = $('.fz-mensaje', raiz);
    function ponerMensaje(tipo, titulo, texto) {
      if (!tipo) { msg.className = 'mensaje fz-mensaje'; msg.innerHTML = ''; return; }
      const ico = { ok: 'checkCirculo', aviso: 'alerta', info: 'info', error: 'errorCirculo' }[tipo];
      msg.className = 'mensaje fz-mensaje ' + tipo;
      msg.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }
    const pasos = [];
    function agregarPaso(etiqueta, html, nota) { pasos.push({ etiqueta, html, nota }); pintarPasos(); }
    const pintarPasos = () => {
      $('.fz-pasos', raiz).innerHTML = pasos.map(p => `<li><span class="bz-paso-etq">${p.etiqueta}</span><span class="mt">${p.html || ''}</span>${p.nota ? `<span class="bz-paso-nota">${p.nota}</span>` : ''}</li>`).join('');
    };

    /* ---------- Retos ---------- */
    function pintarRetos() {
      const boton = r => {
        const i = R.indexOf(r), hecho = MA.progreso.hecho('m5.fuerzas.' + r.id);
        return `<button type="button" class="segmento" data-reto="${r.id}" aria-pressed="${!st.origen && st.reto === r}" aria-label="Reto ${i + 1}: ${MA.esc(r.titulo)}${hecho ? ', hecho' : ''}" title="${MA.esc(r.titulo)}">${i + 1}${hecho ? `<span class="ok">${icono('check')}</span>` : ''}</button>`;
      };
      $('.fz-retos', raiz).innerHTML = Object.keys(C.GRUPOS_FUERZAS).map(g =>
        `<span class="m4-grupo"><span class="m4-grupo-nombre">${C.GRUPOS_FUERZAS[g]}</span>${R.filter(r => r.grupo === g).map(boton).join('')}</span>`).join('');
    }

    function cargar(reto, origen) {
      parar();
      st.token++;
      st.reto = reto;
      st.origen = origen || null;
      st.flechas = [];
      st.marcados = new Set();
      st.iPregunta = 0;
      st.signos = {};
      st.cambios = {};
      st.neta = 0;
      st.fase = reto.modo === 'cambia' ? 'cambia' : reto.toca ? 'toca' : 'flechas';
      if (!origen) MA.almacen.guardar('m5.fuerzas.reto', reto.id);
      const i = R.indexOf(reto);
      $('.fz-reto', raiz).innerHTML = `
        <div class="m4-pildoras"><span class="pildora">Reto ${i + 1} de ${R.length}</span><span class="pildora">${C.GRUPOS_FUERZAS[reto.grupo]}</span></div>
        <h4>${reto.titulo}</h4>
        <p>${reto.contexto}</p>`;
      const ori = $('.fz-origen', raiz);
      ori.hidden = !origen;
      if (origen) ori.innerHTML = `<span>${icono('hoja')}${origen.etiqueta}</span><button type="button" class="btn btn-secundario btn-chico" data-accion="volver">${icono('flechaI')}${origen.textoVolver}</button>`;
      pasos.length = 0;
      pintarPasos();
      ponerMensaje(null);
      pintarRetos();
      pintarEscena();
      pintarPanel();
      pintarBotones();
    }

    /* ---------- La escena y las flechas ---------- */
    const geo = () => C.geometria(st.reto.escena);
    const editable = () => st.fase === 'flechas';

    function pintarEscena() {
      const e = st.reto.escena;
      $('.fz-escena', raiz).innerHTML = `
        <svg class="m5-fig fz-svg ${st.fase === 'toca' || st.reto.modo === 'cambia' ? '' : 'm5-solo'}" viewBox="0 0 ${C.ANCHO} ${C.ALTO}" role="group" aria-label="${MA.esc(st.reto.titulo)}: el cuerpo y sus fuerzas">
          ${C.fondo(e)}
          <g class="fz-flechas"></g>
        </svg>`;
      pintarFlechas();
    }

    const textoFlecha = fl => `${FZ[fl.id].nombre}: apunta ${C.NOMBRE_DIR[fl.dir]}, flecha ${C.NOMBRE_LARGO[fl.largo]}. Las flechas del teclado la giran y cambian su largo; Suprimir la quita.`;

    function pintarFlechas() {
      const cont = $('.fz-flechas', raiz);
      if (!cont) return;
      const g = geo();
      if (st.reto.modo === 'cambia') {
        cont.innerHTML = st.reto.base.map(fl => C.flechaSvg(g.cx, g.cy, Object.assign({}, fl, { largo: st.fase === 'listo' && st.reto.efecto[fl.id] === 'crece' ? 3 : fl.largo }), g.ang)).join('');
        return;
      }
      cont.innerHTML = st.flechas.map(fl => {
        const dib = C.flechaSvg(g.cx, g.cy, { dir: fl.dir, largo: fl.largo, clase: FZ[fl.id].clase || 'contacto', texto: FZ[fl.id].etq }, g.ang);
        if (!editable()) return dib;
        const [ux, uy] = C.vector(fl.dir, g.ang), l = C.LARGOS[fl.largo];
        const x = g.cx + ux * l, y = g.cy + uy * l;
        return `
          <g class="fz-f" data-id="${fl.id}" tabindex="0" role="button" aria-label="${MA.esc(textoFlecha(fl))}">
            <line class="fz-toque" x1="${g.cx}" y1="${g.cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>
            ${dib}
            <circle class="fz-asa" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9"/>
            <circle class="fz-asa-toque" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="20"/>
          </g>`;
      }).join('');
    }

    // Una flecha nueva no apunta a ningún lado que pueda ser la respuesta
    function dirNueva() {
      const lista = st.reto.escena.tipo === 'rampa'
        ? ['der', 'izq', 'arr', 'entra', 'baja', 'sube', 'sale', 'aba']
        : ['arrder', 'abaizq', 'arrizq', 'abader', 'der', 'izq', 'arr', 'aba'];
      return lista.find(d => !st.flechas.some(f => f.dir === d)) || lista[0];
    }
    function alternarFuerza(id) {
      const i = st.flechas.findIndex(f => f.id === id);
      if (i >= 0) st.flechas.splice(i, 1);
      else st.flechas.push({ id, dir: dirNueva(), largo: 2 });
      ponerMensaje(null);
      pintarFlechas();
      pintarChips();
    }
    function pintarChips() {
      raiz.querySelectorAll('[data-fuerza]').forEach(b => b.setAttribute('aria-pressed', String(st.flechas.some(f => f.id === b.dataset.fuerza))));
    }

    /* ---------- Arrastrar la punta ---------- */
    const cuadro = () => $('.fz-escena', raiz);
    function puntoEn(svg, e) {
      const pt = svg.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    }
    function apuntar(fl, svg, e) {
      const g = geo(), p = puntoEn(svg, e);
      const dx = p.x - g.cx, dy = p.y - g.cy, dist = Math.hypot(dx, dy);
      if (dist < 18) return;
      let mejor = fl.dir, tope = -2;
      C.direcciones(st.reto.escena.tipo).forEach(d => {
        const [ux, uy] = C.vector(d, g.ang), punto = (ux * dx + uy * dy) / dist;
        if (punto > tope) { tope = punto; mejor = d; }
      });
      let largo = 1, cerca = Infinity;
      [1, 2, 3].forEach(k => { const c = Math.abs(C.LARGOS[k] - dist); if (c < cerca) { cerca = c; largo = k; } });
      if (mejor !== fl.dir || largo !== fl.largo) { fl.dir = mejor; fl.largo = largo; pintarFlechas(); }
    }
    cuadro().addEventListener('pointerdown', e => {
      const f = e.target.closest && e.target.closest('.fz-f');
      if (!f || !editable()) return;
      const svg = f.ownerSVGElement;
      st.arrastre = { id: f.dataset.id, puntero: e.pointerId, svg };
      try { svg.setPointerCapture(e.pointerId); } catch (err) { /* nada */ }
      svg.classList.add('fz-arrastrando');
      e.preventDefault();
    });
    cuadro().addEventListener('pointermove', e => {
      const a = st.arrastre;
      if (!a || a.puntero !== e.pointerId) return;
      const fl = st.flechas.find(x => x.id === a.id);
      if (fl) apuntar(fl, a.svg, e);
    });
    const soltar = e => {
      const a = st.arrastre;
      if (!a || a.puntero !== e.pointerId) return;
      a.svg.classList.remove('fz-arrastrando');
      st.arrastre = null;
      ponerMensaje(null);
    };
    cuadro().addEventListener('pointerup', soltar);
    cuadro().addEventListener('pointercancel', soltar);
    // Con el dedo, tocar una flecha no mueve la página; tocar el resto del dibujo sí
    cuadro().addEventListener('touchstart', e => {
      if (editable() && e.target.closest && e.target.closest('.fz-f')) e.preventDefault();
    }, { passive: false });
    cuadro().addEventListener('keydown', e => {
      const f = e.target.closest && e.target.closest('.fz-f');
      if (!f || !editable()) return;
      const fl = st.flechas.find(x => x.id === f.dataset.id);
      if (!fl) return;
      const dirs = C.direcciones(st.reto.escena.tipo), i = dirs.indexOf(fl.dir);
      if (e.key === 'ArrowRight') fl.dir = dirs[(i + 1) % dirs.length];
      else if (e.key === 'ArrowLeft') fl.dir = dirs[(i + dirs.length - 1) % dirs.length];
      else if (e.key === 'ArrowUp') fl.largo = Math.min(3, fl.largo + 1);
      else if (e.key === 'ArrowDown') fl.largo = Math.max(1, fl.largo - 1);
      else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); alternarFuerza(fl.id); return; }
      else return;
      e.preventDefault();
      pintarFlechas();
      const otra = raiz.querySelector(`.fz-f[data-id="${fl.id}"]`);
      if (otra) otra.focus({ preventScroll: true });
    });

    /* ---------- El panel de cada paso ---------- */
    const preguntaHtml = (p, n, total) => `
      <div class="mf-pregunta fz-pregunta">
        <p class="cv-preg-titulo">${icono('pista')}<span>${p.pregunta}</span></p>
        <div class="fila-botones">${p.opciones.map((o, k) => `<button type="button" class="btn btn-secundario btn-chico fz-opcion" data-opcion="${k}">${o.txt}</button>`).join('')}</div>
        ${total > 1 ? `<p class="texto-3">Pregunta ${n + 1} de ${total}.</p>` : ''}
      </div>`;

    function pintarPanel() {
      const r = st.reto, panel = $('.fz-panel', raiz);
      switch (st.fase) {
        case 'toca':
          panel.innerHTML = `
            <span class="etiqueta">Paso 1: ¿quién lo toca?</span>
            <div class="mf-pregunta fz-pregunta">
              <p class="cv-preg-titulo">${icono('pista')}<span>¿Qué está tocando el cuerpo? Puede ser más de una.</span></p>
              <div class="segmentado fz-toca" role="group" aria-label="Lo que toca el cuerpo">${r.toca.opciones.map((o, k) => `<button type="button" class="segmento" data-toca="${k}" aria-pressed="${st.marcados.has(k)}">${o.txt}</button>`).join('')}</div>
              <div class="fila-botones"><button type="button" class="btn btn-chico" data-accion="toca">Comprobar</button></div>
            </div>`;
          break;
        case 'flechas':
          panel.innerHTML = `
            <span class="etiqueta">${r.toca ? 'Paso 2' : 'Paso 1'}: las flechas</span>
            <div class="mf-pregunta fz-pregunta">
              <p class="cv-preg-titulo">${icono('fuerzas')}<span>Tocar una fuerza la agrega; tocarla otra vez la quita. Arrastrar la punta gira la flecha y cambia su largo.</span></p>
              <div class="segmentado fz-lista" role="group" aria-label="Fuerzas para dibujar">${r.lista.map(id => `<button type="button" class="segmento" data-fuerza="${id}" aria-pressed="${st.flechas.some(f => f.id === id)}">${FZ[id].nombre}</button>`).join('')}</div>
              <div class="fila-botones"><button type="button" class="btn btn-chico" data-accion="flechas">Comprobar las flechas</button></div>
              <p class="texto-3">Con el teclado: Tab hasta la flecha, ← → la giran, ↑ ↓ cambian el largo.</p>
            </div>`;
          break;
        case 'pregunta':
          panel.innerHTML = `<span class="etiqueta">Leer las flechas</span>${preguntaHtml(r.preguntas[st.iPregunta], st.iPregunta, r.preguntas.length)}`;
          break;
        case 'pareja':
          panel.innerHTML = `<span class="etiqueta">Tercera ley: la pareja</span>${preguntaHtml(r.pareja, 0, 1)}`;
          break;
        case 'signos': {
          const N = r.numeros;
          panel.innerHTML = `
            <span class="etiqueta">La suma, con signos</span>
            <div class="mf-pregunta fz-pregunta">
              <p class="cv-preg-titulo">${icono('pista')}<span>¿Con qué signo entra cada flecha? Hacia la derecha suma; hacia la izquierda resta.</span></p>
              <div class="fz-signos">${N.terminos.map(t => `
                <div class="fz-fila"><span>${t.nombre}: ${MA.f.q(t.valor, 'N')}</span>
                  <div class="segmentado" role="group" aria-label="Signo de ${t.nombre}">
                    <button type="button" class="segmento" data-signo="${t.id}" data-valor="1" aria-pressed="${st.signos[t.id] === 1}" aria-label="Suma">+</button>
                    <button type="button" class="segmento" data-signo="${t.id}" data-valor="-1" aria-pressed="${st.signos[t.id] === -1}" aria-label="Resta">−</button>
                  </div>
                </div>`).join('')}</div>
              <div class="fila-botones"><button type="button" class="btn btn-chico" data-accion="signos">Comprobar</button></div>
            </div>`;
          break;
        }
        case 'neta':
        case 'acel': {
          const N = r.numeros, esNeta = st.fase === 'neta';
          const suma = N.terminos.map(t => `${t.signo > 0 ? '+' : '−'}${MA.fmt(t.valor)}`).join(' ');
          panel.innerHTML = `
            <span class="etiqueta">${esNeta ? 'La fuerza neta' : 'La aceleración'}</span>
            <div class="mo-calculo fz-calculo">
              <label for="fz-campo"><span class="mt">${esNeta ? `${C.SF} ${igual} ${suma} ${igual}` : `${C.L.a} ${igual} ${C.SF} ${MA.f.op('÷')} ${C.L.m} ${igual} ${MA.fmt(st.neta)} ${MA.f.op('÷')} ${MA.fmt(N.masa)} ${igual}`}</span></label>
              <span class="campo-grupo"><input id="fz-campo" class="campo" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="Número"><span class="campo-unidad">${esNeta ? 'N' : 'm/s²'}</span></span>
              <button type="button" class="btn btn-chico" data-accion="numero">Comprobar</button>
              <p class="texto-3">${esNeta ? 'Primero las flechas: lo que suma y resta.' : 'Después la masa: lo que divide.'}</p>
            </div>`;
          setTimeout(() => { const c = $('#fz-campo', raiz); if (c) c.focus({ preventScroll: true }); }, 30);
          break;
        }
        case 'cambia':
          panel.innerHTML = `
            <span class="etiqueta">¿Qué flechas cambian?</span>
            <div class="mf-pregunta fz-pregunta">
              <p class="cv-preg-titulo">${icono('pista')}<span>${r.cambio}</span></p>
              <div class="fz-signos">${r.base.map(fl => `
                <div class="fz-fila"><span>${FZ[fl.id].nombre}</span>
                  <div class="segmentado" role="group" aria-label="${FZ[fl.id].nombre}">
                    ${[['baja', 'Baja'], ['igual', 'Sigue igual'], ['crece', 'Crece']].map(([v, t]) => `<button type="button" class="segmento" data-cambia="${fl.id}" data-valor="${v}" aria-pressed="${st.cambios[fl.id] === v}">${t}</button>`).join('')}
                  </div>
                </div>`).join('')}</div>
              <div class="fila-botones"><button type="button" class="btn btn-chico" data-accion="cambia">Comprobar</button></div>
            </div>`;
          break;
        case 'animando':
          panel.innerHTML = `<span class="etiqueta">Mirar las huellas</span><p class="texto-2">Una huella en cada segundo: se van separando, como en el radar de pista.</p>`;
          break;
        default:
          panel.innerHTML = `<span class="etiqueta">Reto terminado</span><p class="texto-2">${r.cierre}</p>`;
      }
    }

    function pintarBotones() {
      const cont = $('.fz-botones', raiz);
      if (st.fase === 'animando') { cont.innerHTML = ''; return; }
      if (st.fase !== 'listo') {
        cont.innerHTML = `
          <button type="button" class="btn btn-secundario btn-chico" data-accion="pista">${icono('pista')}Pista</button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="reiniciar">${icono('reiniciar')}Reiniciar</button>`;
        return;
      }
      const r = st.reto, i = R.indexOf(r), sig = R[i + 1], l = r.luego;
      const botonSig = (clase = 'btn') => `<button type="button" class="${clase}" data-sig="${sig.id}">Siguiente reto${icono('flechaD')}</button>`;
      let seguir = '';
      if (st.origen) seguir = `<button type="button" class="btn" data-accion="volver">${icono('flechaI')}${st.origen.textoFinal || st.origen.textoVolver}</button>`;
      else if (l) {
        seguir = `<button type="button" class="btn" data-accion="luego">${l.texto}${icono('flechaD')}</button>`;
        if (sig && l.reto !== sig.id) seguir += botonSig('btn btn-secundario');
      } else if (sig) seguir = botonSig();
      else if (opciones.final) seguir = `<button type="button" class="btn" data-accion="final">${opciones.final.texto}${icono('flechaD')}</button>`;
      cont.innerHTML = `${seguir}<button type="button" class="btn btn-secundario" data-accion="reiniciar">${icono('reiniciar')}Repetir</button>`;
    }

    function irAFase(fase) {
      const antes = st.fase;
      st.fase = fase;
      // Al dejar de editar, las flechas quedan fijas; al pasar a dibujar, el cuerpo queda solo
      if (antes === 'toca' || antes === 'flechas' || fase === 'listo') pintarEscena();
      pintarPanel();
      pintarBotones();
    }

    /* ---------- Paso 1: qué lo toca ---------- */
    function revisarToca() {
      const ops = st.reto.toca.opciones;
      const mal = [...st.marcados].find(k => !ops[k].ok);
      if (mal != null) { ponerMensaje('error', 'Todavía no.', ops[mal].porQue); return; }
      const falta = ops.findIndex((o, k) => o.ok && !st.marcados.has(k));
      if (falta >= 0) { ponerMensaje('aviso', 'Falta algo.', 'Hay que mirar otra vez: ¿qué más está en contacto con el cuerpo?'); return; }
      const lo = ops.filter(o => o.ok).map((o, k) => (k ? o.txt[0].toLowerCase() + o.txt.slice(1) : o.txt)).join(' y ');
      agregarPaso('¿Quién lo toca?', '', `${lo}. Además, el peso, que va siempre.`);
      ponerMensaje('ok', '¡Correcto!', st.reto.toca.bien);
      irAFase('flechas');
    }

    /* ---------- Paso 2: las flechas ---------- */
    function revisarFlechas() {
      const r = st.reto, puestas = st.flechas;
      const decir = t => ponerMensaje('error', 'Todavía no.', t);
      if (!puestas.length) { ponerMensaje('aviso', 'Faltan las flechas.', 'Hay que tocar una fuerza para agregarla. La primera va siempre: el peso.'); return; }
      const falsa = puestas.find(f => FZ[f.id].falsa);
      if (falsa) { decir(FZ[falsa.id].porQue); return; }
      const sobra = puestas.find(f => !r.fuerzas[f.id]);
      if (sobra) { decir((r.sobran || {})[sobra.id] || `¿Quién hace la flecha de ${FZ[sobra.id].nombre.toLowerCase()}? Aquí, nadie.`); return; }
      const mala = puestas.find(f => f.dir !== r.fuerzas[f.id].dir);
      if (mala) { decir(((r.dirMal || {})[mala.id] || {})[mala.dir] || FZ[mala.id].mal); return; }
      const falta = Object.keys(r.fuerzas).find(id => !puestas.some(f => f.id === id));
      if (falta) { decir(falta === 'peso' ? 'Falta una flecha que va siempre: el peso.' : 'Falta una flecha. ¿Qué otra cosa toca o empuja al cuerpo?'); return; }
      const largo = id => puestas.find(f => f.id === id).largo;
      const distinta = (r.iguales || []).find(([a, b]) => largo(a) !== largo(b));
      if (distinta) { decir(distinta[2]); return; }
      const corta = (r.mayores || []).find(([a, b]) => largo(a) <= largo(b));
      if (corta) { decir(corta[2]); return; }
      agregarPaso('Las flechas', '', puestas.map(f => FZ[f.id].nombre.toLowerCase()).join(', ').replace(/^./, c => c.toUpperCase()) + '.');
      ponerMensaje('ok', '¡Bien dibujado!', 'Todas tienen dueño y apuntan bien.');
      siguientePaso();
    }

    // Después de las flechas: preguntas, números, pareja y fin, en ese orden
    function siguientePaso() {
      const r = st.reto;
      if (st.fase === 'flechas' && r.preguntas && r.preguntas.length) { st.iPregunta = 0; irAFase('pregunta'); return; }
      if ((st.fase === 'flechas' || st.fase === 'pregunta') && r.numeros) { irAFase('signos'); return; }
      if (st.fase !== 'pareja' && r.pareja) { irAFase('pareja'); return; }
      terminar();
    }

    function responder(btn) {
      const r = st.reto, p = st.fase === 'pareja' ? r.pareja : r.preguntas[st.iPregunta];
      const o = p.opciones[Number(btn.dataset.opcion)];
      if (!o.ok) {
        btn.classList.add('incorrecta');
        btn.disabled = true;
        ponerMensaje('error', 'Todavía no.', o.porQue);
        return;
      }
      if (st.fase === 'pareja') {
        agregarPaso('La pareja', '', o.txt + '.');
        ponerMensaje('ok', '¡Correcto!', 'Una pareja siempre está en dos cuerpos: «A sobre B» y «B sobre A».');
        terminar();
        return;
      }
      agregarPaso(p.etq, p.renglon || '', p.nota || o.txt + '.');
      ponerMensaje('ok', '¡Correcto!', p.nota || o.txt + '.');
      if (st.iPregunta < r.preguntas.length - 1) { st.iPregunta++; pintarPanel(); } else siguientePaso();
    }

    /* ---------- Los números ---------- */
    function revisarSignos() {
      const N = st.reto.numeros;
      if (N.terminos.some(t => st.signos[t.id] == null)) { ponerMensaje('aviso', 'Falta un signo.', 'Cada flecha entra con el suyo.'); return; }
      const mal = N.terminos.find(t => st.signos[t.id] !== t.signo);
      const suma = N.terminos.map(t => `${t.signo > 0 ? '+' : '−'}${MA.fmt(t.valor)}`).join(' ');
      if (mal) { ponerMensaje('error', 'Todavía no.', `${mal.nombre} va ${mal.signo > 0 ? 'hacia la derecha: suma' : 'hacia la izquierda: resta'}. La que va en contra resta.`); return; }
      agregarPaso('La suma', `${C.SF} ${igual} ${suma}`, 'Hacia la derecha suma; hacia la izquierda resta.');
      ponerMensaje(null);
      irAFase('neta');
    }
    function revisarNumero() {
      const N = st.reto.numeros, campo = $('#fz-campo', raiz), esNeta = st.fase === 'neta';
      const cands = MA.leerNumeros(campo.value);
      if (!cands.length) { ponerMensaje('aviso', 'Solo el número.', 'Sin la unidad. Ejemplos válidos: 120 · 2,5'); campo.focus(); return; }
      const neta = N.terminos.reduce((s, t) => s + t.signo * t.valor, 0);
      const bien = esNeta ? neta : neta / N.masa;
      if (cands.some(x => MA.casiIgual(x, bien, 0.01))) {
        if (esNeta) {
          st.neta = neta;
          agregarPaso('La fuerza neta', `${C.SF} ${igual} ${MA.f.q(neta, 'N')}`);
          ponerMensaje('ok', '¡Correcto!', 'Primero las flechas. Ahora, la masa.');
          irAFase('acel');
        } else {
          agregarPaso('La aceleración', `${C.L.a} ${igual} ${MA.fmt(neta)} ${MA.f.op('÷')} ${MA.fmt(N.masa)} ${igual} ${MA.f.q(bien, 'm/s²')}`, `Cada segundo gana ${MA.fmt(bien)} m/s.`);
          ponerMensaje('ok', '¡Muy bien!', `Cada segundo gana ${MA.fmt(bien)} m/s. A mirar las huellas.`);
          animarHuellas(bien);
        }
        return;
      }
      const err = (esNeta ? N.erroresNeta : N.erroresA).find(e => cands.some(x => MA.casiIgual(x, e.valor, 0.01)));
      ponerMensaje('error', 'Todavía no.', err ? err.msg : (esNeta ? 'Hay que sumar las flechas con sus signos.' : 'La fuerza neta se divide entre la masa.'));
      campo.select();
    }

    // El cuerpo sale con huellas de cada segundo: los mismos números del radar de pista
    function parar() { if (st.raf) cancelAnimationFrame(st.raf); st.raf = null; }
    function animarHuellas(a) {
      const token = ++st.token, T = 4, X0 = 60, ESC = 300 / (a * T * T / 2), SUELO = 164;
      st.fase = 'animando';
      pintarPanel();
      pintarBotones();
      const mov = t => MA.M4.mov.estado({ v0: 0, a }, t).d;
      $('.fz-escena', raiz).innerHTML = `
        <svg class="m5-fig fz-svg" viewBox="0 0 ${C.ANCHO} ${C.ALTO}" role="img" aria-label="La caja acelera y deja una huella en cada segundo, cada vez más separadas">
          <line class="m5-piso" x1="20" y1="${SUELO}" x2="400" y2="${SUELO}"/>
          <g class="fz-huellas"></g>
          <g class="fz-movil"></g>
        </svg>`;
      const huellas = $('.fz-huellas', raiz), movil = $('.fz-movil', raiz);
      let puestas = -1, ultimaEtq = -99;
      const cuadroAnim = t => {
        const x = X0 + mov(t) * ESC;
        movil.innerHTML = `${C.cuerpoSvg('caja', x, SUELO - 24)}${C.flechaSvg(x, SUELO - 24, { dir: 'der', px: 58, clase: 'neta', texto: 'Neta', et: { x: x + 30, y: SUELO - 62, ancla: 'middle' } }, 0)}`;
        const k = Math.floor(t + 1e-6);
        while (puestas < k) {
          puestas++;
          const xh = X0 + mov(puestas) * ESC;
          // Si dos huellas quedan muy juntas, la segunda va sin etiqueta
          const etq = xh - ultimaEtq >= 34 ? `<text class="rp-etq-huella" x="${xh.toFixed(1)}" y="${SUELO + 42}" text-anchor="middle">${puestas} s</text>` : '';
          if (etq) ultimaEtq = xh;
          huellas.insertAdjacentHTML('beforeend', `<line class="rp-huella" x1="${xh.toFixed(1)}" y1="${SUELO + 4}" x2="${xh.toFixed(1)}" y2="${SUELO + 26}"/>${etq}`);
        }
      };
      const fin = () => { if (token === st.token) { cuadroAnim(T); finAnimacion(); } };
      if (reducido) { fin(); return; }
      const t0 = performance.now();
      const paso = ahora => {
        if (token !== st.token) return;
        const t = (ahora - t0) / 1000;
        if (t >= T) { fin(); return; }
        cuadroAnim(t);
        st.raf = requestAnimationFrame(paso);
      };
      st.raf = requestAnimationFrame(paso);
    }
    function finAnimacion() {
      if (st.reto.pareja) { st.fase = 'pareja'; pintarPanel(); pintarBotones(); return; }
      terminar();
    }

    /* ---------- Modo «¿qué flechas cambian?» ---------- */
    function revisarCambio() {
      const r = st.reto;
      if (r.base.some(fl => !st.cambios[fl.id])) { ponerMensaje('aviso', 'Falta una flecha.', 'Hay que decidir qué pasa con cada una.'); return; }
      const mala = r.base.find(fl => st.cambios[fl.id] !== r.efecto[fl.id]);
      if (mala) { ponerMensaje('error', 'Todavía no.', r.porQue[mala.id]); return; }
      r.renglones.forEach(([etq, html, nota]) => agregarPaso(etq, html, nota));
      terminar();
    }

    /* ---------- Fin ---------- */
    function terminar() {
      const r = st.reto;
      if (r.numeros) { st.fase = 'listo'; pintarPanel(); pintarBotones(); }   // deja a la vista las huellas
      else irAFase('listo');
      ponerMensaje('ok', '¡Muy bien!', r.cierre);
      if (MA.progreso.marcar('m5.fuerzas.' + r.id)) MA.aviso('Reto completado.');
      pintarRetos();
    }

    function pista() {
      const r = st.reto;
      const textos = {
        toca: 'Lo que no toca al cuerpo no da flecha. La única excepción es la Tierra: esa es el peso, y va siempre.',
        flechas: 'Primero el peso. Después, una flecha por cada cosa que lo toca. De cada una, ¿quién la hace?',
        pregunta: 'Hay que mirar el largo de las flechas y lo que dice el enunciado sobre la velocidad.',
        pareja: 'Una pareja es «A sobre B» y «B sobre A»: está en dos cuerpos distintos.',
        signos: 'Hacia la derecha suma; hacia la izquierda resta. La que va en contra resta.',
        neta: 'Se suman los números con su signo. Es como plata y deudas.',
        acel: 'La fuerza neta se divide entre la masa.',
        cambia: 'Cada eje por su lado: ¿en qué eje está lo que cambió?'
      };
      ponerMensaje('info', 'Pista.', textos[st.fase] || r.cierre);
    }

    /* ---------- Eventos ---------- */
    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b)) return;
      if (b.dataset.reto) { cargar(R.find(r => r.id === b.dataset.reto)); return; }
      if (b.dataset.sig) { cargar(R.find(r => r.id === b.dataset.sig)); raiz.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' }); return; }
      if (b.dataset.fuerza) { alternarFuerza(b.dataset.fuerza); return; }
      if (b.dataset.toca != null) {
        const k = Number(b.dataset.toca);
        if (st.marcados.has(k)) st.marcados.delete(k); else st.marcados.add(k);
        b.setAttribute('aria-pressed', String(st.marcados.has(k)));
        return;
      }
      if (b.dataset.opcion != null) { responder(b); return; }
      if (b.dataset.signo) {
        st.signos[b.dataset.signo] = Number(b.dataset.valor);
        pintarPanel();
        return;
      }
      if (b.dataset.cambia) {
        st.cambios[b.dataset.cambia] = b.dataset.valor;
        pintarPanel();
        return;
      }
      const a = b.dataset.accion;
      if (a === 'toca') revisarToca();
      else if (a === 'flechas') revisarFlechas();
      else if (a === 'signos') revisarSignos();
      else if (a === 'numero') revisarNumero();
      else if (a === 'cambia') revisarCambio();
      else if (a === 'pista') pista();
      else if (a === 'reiniciar') cargar(st.reto, st.origen);
      else if (a === 'volver' && st.origen) st.origen.volver();
      else if (a === 'final' && opciones.final) opciones.final.ir();
      else if (a === 'luego') {
        const l = st.reto.luego;
        if (l.reto) { cargar(R.find(r => r.id === l.reto)); raiz.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' }); }
        if (l.ir && !l.reto) location.hash = l.ir;
      }
    });
    raiz.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'fz-campo') { e.preventDefault(); revisarNumero(); } });
    MA.bus.on('progreso', () => pintarRetos());

    const guardado = MA.almacen.leer('m5.fuerzas.reto', null);
    cargar(R.find(r => r.id === guardado) || R.find(r => !MA.progreso.hecho('m5.fuerzas.' + r.id)) || R[0]);

    return {
      cargarReto(id) { const r = R.find(x => x.id === id); if (r) cargar(r); },
      // problema: el id de un reto (los ejercicios abren el reto que necesitan)
      cargarProblema(problema, origen) { const r = R.find(x => x.id === problema); if (r) cargar(r, origen); }
    };
  }

  MA.MesaFuerzas = { crear: crearMesa };
})();
