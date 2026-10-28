/* =====================================================================
   Herramienta · mesa de áreas (juntar, armar y desarmar)
   ---------------------------------------------------------------------
   Una multiplicación es un rectángulo: los lados son los factores y
   cada pedazo es lado por lado. La misma figura sirve para los tres
   pasos del módulo:
     juntar   → solo se suman las piezas de la misma forma: x² con x²
                (cuadrados), x con x (tiras) y números con números
                (cuadraditos), como m con m;
     armar    → la distributiva: con los lados, se calcula cada pedazo
                (todos contra todos) y después se juntan los del mismo tipo;
     desarmar → el factor común: con los pedazos, se busca el lado que
                comparten, sacando de a poco lo que está en todos
                (¿son pares?, ¿terminan en 0 o en 5?, ¿están en la tabla
                del 3?, ¿todos tienen x?). Sin MCM ni MCD. Si algún
                término es negativo, no se dibuja (no hay áreas
                negativas): se ve cada término dividido entre lo que
                está en todos, que es la idea real del factor común.
   Cada resultado se escribe en dos partes, el número y la letra:
   números con números y letras con letras, como en el módulo 2.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, icono } = MA;
  const { n, op, vr } = MA.f;
  const { pot } = MA.M2;
  const C = MA.M3;
  const igual = op('=');

  const PRIMOS = [2, 3, 5, 7];
  const MODOS = { juntar: 'Juntar', armar: 'Armar · distributiva', desarmar: 'Desarmar · factor común' };
  const GRUPOS = { juntar: 'Juntar', armar: 'Armar', desarmar: 'Desarmar' };
  const NOTA_SUMA = { 2: 'Cuadrados con cuadrados.', 1: 'Tiras con tiras.', 0: 'Números con números.' };

  // Por qué un número no está en una tabla, con el caso concreto
  function porQueNoEsta(k, c) {
    const v = Math.abs(c);
    if (k === 2) return `${MA.fmt(v)} no es par: termina en ${v % 10}.`;
    if (k === 5) return `${MA.fmt(v)} no termina en 0 ni en 5.`;
    if (k === 3) {
      const s = String(v).split('').reduce((a, d) => a + Number(d), 0);
      return `${MA.fmt(v)} no está en la tabla del 3${v > 9 ? ` (sus cifras suman ${s})` : ''}.`;
    }
    return `${MA.fmt(v)} no está en la tabla del ${k}.`;
  }
  const porQueSiEsta = k => ({ 2: 'son pares', 3: 'están en la tabla del 3', 5: 'terminan en 0 o en 5', 7: 'están en la tabla del 7' }[k]);

  // La cuenta de plata de una suma con negativos (como en el radar de signos). También la usan las flechas.
  function plata(x, y) {
    const s = x + y;
    if (x >= 0 && y >= 0) return `tengo ${x} y recibo ${y}: tengo ${s}`;
    if (x < 0 && y < 0) return `debo ${-x} y me endeudo con ${-y} más: debo ${-s}`;
    const [tengo, debo] = x >= 0 ? [x, -y] : [y, -x];
    return s >= 0 ? `tengo ${tengo} y debo ${debo}: pago y me quedan ${s}` : `tengo ${tengo} y debo ${debo}: pago y todavía debo ${-s}`;
  }

  /* ---------- Campo de un término: el número y la letra por separado ----------
     tipos: los exponentes que se ofrecen (0 = sin letra). Si la letra
     está elegida y el número se deja vacío, vale 1 (o −1 con un «−»). */
  function campoHtml(id, letra, tipos = [0, 1, 2]) {
    const etiqueta = e => (e === 0 ? `Sin ${letra}` : e === 1 ? vr(letra) : pot(vr(letra), e));
    return `
      <span class="ar-campo">
        <span class="campo-grupo"><input id="${id}" class="campo ar-num" type="text" inputmode="text" autocomplete="off" spellcheck="false" placeholder="Número" aria-label="Número"></span>
        <span class="segmentado ar-tipos" role="group" aria-label="Letra">${tipos.map(e => `<button type="button" class="segmento" data-tipo="${e}" aria-pressed="false">${etiqueta(e)}</button>`).join('')}</span>
      </span>`;
  }
  function leerCampo(raiz, id) {
    const sel = $('.ar-tipos [aria-pressed="true"]', raiz);
    const txt = $('#' + id, raiz).value.trim().replace(/[−–]/g, '-').replace(/^\+/, '');
    if (!sel) return { falta: 'letra' };
    const e = Number(sel.dataset.tipo);
    if (e > 0 && (txt === '' || txt === '-')) return { t: [txt === '-' ? -1 : 1, e] };
    const cands = MA.leerNumeros(txt);
    return cands.length ? { t: [cands.find(Number.isInteger) ?? cands[0], e] } : { falta: 'numero' };
  }
  // Los botones de la letra funcionan como un selector de una sola opción
  function marcarTipo(boton) {
    $$('[data-tipo]', boton.parentElement).forEach(b => b.setAttribute('aria-pressed', String(b === boton)));
  }
  const avisoFalta = (falta, letra) => (falta === 'letra'
    ? ['Falta elegir la letra.', `Al lado del número: sin ${letra}, con ${letra} o con ${letra}².`]
    : ['Falta el número.', 'Con el signo menos si es negativo. Si delante de la letra no hay número, se deja vacío.']);

  function crearAreas(raiz, opciones = {}) {
    const st = { reto: null, origen: null, fase: null, prediccion: null, fichas: [], sel: null, par: null, celdas: [], celda: 0, afuera: [1, 0], adentro: [], fallos: 0, pistas: 0 };
    let idFicha = 0;
    const letra = () => st.reto.letra || 'x';

    raiz.classList.add('banco', 'mesa-ar');
    raiz.innerHTML = `
      <div class="banco-cabeza">
        <div>
          <span class="etiqueta">Herramienta 1</span>
          <h3>Mesa de áreas</h3>
        </div>
        <div class="ar-retos" role="group" aria-label="Retos de la mesa de áreas"></div>
      </div>
      <div class="bz-origen ar-origen" hidden></div>
      <div class="cv-reto ar-reto"></div>
      <div class="ar-mesa" aria-live="polite"></div>
      <div class="mf-pregunta ar-pregunta" hidden></div>
      <div class="mo-calculo ar-calculo" hidden></div>
      <div class="banco-pie">
        <div class="mensaje ar-mensaje" role="status" aria-live="polite"></div>
        <div class="fila-botones ar-botones"></div>
      </div>
      <section class="cv-bitacora" aria-label="Pasos">
        <h4>Pasos</h4>
        <p class="texto-3">Lo mismo que se escribe en el papel, renglón por renglón.</p>
        <ol class="bz-pasos ar-pasos"></ol>
      </section>`;

    const msg = $('.ar-mensaje', raiz);
    function ponerMensaje(tipo, titulo, texto) {
      if (!tipo) { msg.className = 'mensaje ar-mensaje'; msg.innerHTML = ''; return; }
      const ico = { ok: 'checkCirculo', aviso: 'alerta', info: 'info', error: 'errorCirculo' }[tipo];
      msg.className = 'mensaje ar-mensaje ' + tipo;
      msg.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }
    const pasos = [];
    function agregarPaso(html, nota) { pasos.push({ html, nota }); pintarPasos(); }
    const pintarPasos = () => { $('.ar-pasos', raiz).innerHTML = pasos.map(p => `<li><span class="mt">${p.html}</span>${p.nota ? `<span class="bz-paso-nota">${p.nota}</span>` : ''}</li>`).join(''); };

    function pintarRetos() {
      $('.ar-retos', raiz).innerHTML = Object.keys(GRUPOS).map(g => {
        const botones = C.RETOS_AREAS.map((r, i) => {
          if (r.modo !== g) return '';
          const hecho = MA.progreso.hecho('m3.areas.' + r.id);
          return `<button type="button" class="segmento" data-reto="${r.id}" aria-pressed="${!!(st.reto && st.reto.id === r.id)}" aria-label="Reto ${i + 1}${hecho ? ', completo' : ''}">${i + 1}${hecho ? `<span class="ok">${icono('check')}</span>` : ''}</button>`;
        }).join('');
        return `<span class="ar-grupo"><span class="ar-grupo-nombre">${GRUPOS[g]}</span>${botones}</span>`;
      }).join('');
    }

    /* ---------- Escritura ---------- */
    const th = t => C.terminoHtml(t, letra());
    const tt = t => C.terminoTexto(t, letra());
    // Un factor negativo que no va primero, entre paréntesis: x · (−3)
    const facHtml = t => (t[0] < 0 ? C.par(th(t)) : th(t));
    const facTexto = t => (t[0] < 0 ? `(${tt(t)})` : tt(t));
    const sumaHtml = (a, b) => `${th(a)} ${op(b[0] < 0 ? '−' : '+')} ${C.cuerpoHtml(b, letra())}`;
    const sumaTexto = (a, b) => `${tt(a)} ${b[0] < 0 ? '−' : '+'} ${C.cuerpoTexto(b, letra())}`;
    const escritoHtml = () => C.productoHtml([[st.afuera], st.adentro], letra());
    const escritoTexto = () => C.productoTexto([[st.afuera], st.adentro], letra());
    const nadaAfuera = () => st.afuera[0] === 1 && st.afuera[1] === 0;
    function planteamientoHtml() {
      const r = st.reto, l = letra();
      if (r.modo === 'armar') return C.productoHtml([r.alto, r.ancho], l);
      if (r.grupos) {
        let k = 0;
        return r.grupos.map(g => { const html = C.par(C.polinomioHtml(r.terminos.slice(k, k + g), l)); k += g; return html; }).join(` ${op('+')} `);
      }
      return C.polinomioHtml(r.terminos, l);
    }
    const resultado = () => C.juntar(st.fichas.map(f => f.t));
    const resultadoHtml = () => (st.reto.modo === 'desarmar' ? (nadaAfuera() ? C.polinomioHtml(st.reto.terminos, letra()) : escritoHtml()) : C.polinomioHtml(resultado(), letra()));
    const resultadoTexto = () => (st.reto.modo === 'desarmar' ? (nadaAfuera() ? C.polinomioTexto(st.reto.terminos, letra()) : escritoTexto()) : C.polinomioTexto(resultado(), letra()));
    const buscarPareja = () => {
      for (let i = 0; i < st.fichas.length; i++) for (let j = i + 1; j < st.fichas.length; j++) if (st.fichas[i].t[1] === st.fichas[j].t[1]) return [st.fichas[i], st.fichas[j]];
      return null;
    };
    const celdaDe = (i, j) => st.celdas.find(c => c.i === i && c.j === j);

    /* ---------- Cargar un reto ---------- */
    const primeraFase = () => ({ juntar: 'juntar', armar: 'dibujar', desarmar: 'sacar' }[st.reto.modo]);
    function cargar(reto, origen) {
      st.reto = reto;
      st.origen = origen || null;
      st.prediccion = null;
      st.sel = null;
      st.par = null;
      st.fallos = 0;
      st.pistas = 0;
      pasos.length = 0;
      if (!origen && reto.id) MA.almacen.guardar('m3.areas.reto', reto.id);
      const i = C.RETOS_AREAS.indexOf(reto);
      $('.ar-reto', raiz).innerHTML = `
        <div class="ar-reto-pildoras">${i >= 0 ? `<span class="pildora">Reto ${i + 1} de ${C.RETOS_AREAS.length}</span>` : ''}<span class="pildora pildora-primaria">${MODOS[reto.modo]}</span></div>
        <h4>${reto.titulo || 'Ejercicio de la práctica'}</h4>
        ${reto.contexto ? `<p>${reto.contexto}</p>` : ''}`;
      const ori = $('.ar-origen', raiz);
      ori.hidden = !origen;
      if (origen) ori.innerHTML = `<span>${icono('hoja')}${origen.etiqueta}</span><button type="button" class="btn btn-secundario btn-chico" data-accion="volver">${icono('flechaI')}${origen.textoVolver}</button>`;
      agregarPaso(planteamientoHtml(), 'El planteamiento.');
      if (reto.modo === 'juntar') {
        st.fichas = reto.terminos.map(t => ({ id: idFicha++, t: t.slice() }));
        if (reto.grupos) agregarPaso(`${igual} ${C.polinomioHtml(reto.terminos, letra())}`, 'Con un + delante, los paréntesis se quitan sin cambiar nada.');
      }
      if (reto.modo === 'armar') {
        st.celdas = [];
        reto.alto.forEach((a, i2) => reto.ancho.forEach((b, j) => st.celdas.push({ i: i2, j, t: C.multiplicarTerminos(a, b), hecho: false })));
        st.celda = 0;
        st.fichas = [];
      }
      if (reto.modo === 'desarmar') {
        st.afuera = [1, 0];
        st.adentro = reto.terminos.map(t => t.slice());
      }
      st.fase = reto.opciones ? 'predecir' : primeraFase();
      ponerMensaje(null);
      pintarRetos();
      pintar();
    }

    /* ---------- Dibujo ---------- */
    function rectArmar() {
      const r = st.reto, act = st.fase === 'celdas' ? st.celdas[st.celda] : null;
      return C.rectanguloHtml(r.alto, r.ancho, {
        letra: letra(),
        celda: (i, j) => (celdaDe(i, j).hecho ? th(celdaDe(i, j).t) : '?'),
        claseCelda: (i, j) => `${celdaDe(i, j).hecho ? '' : 'pendiente'} ${act === celdaDe(i, j) ? 'activa' : ''}`,
        claseLado: (tipo, k) => (act && ((tipo === 'fila' && act.i === k) || (tipo === 'columna' && act.j === k)) ? 'lado-activo' : '')
      });
    }
    function rectDesarmar() {
      return C.rectanguloHtml([st.afuera], st.adentro, {
        letra: letra(),
        uniforme: true,
        area: (i, j) => st.reto.terminos[j],
        claseLado: tipo => (tipo === 'fila' ? `ar-comun ${nadaAfuera() ? 'ar-uno' : ''}` : '')
      });
    }
    // Con un término negativo no se dibuja: no hay áreas negativas
    const sinDibujo = () => st.reto.modo === 'desarmar' && st.reto.terminos.some(t => t[0] < 0);
    const losPedazos = () => (sinDibujo() ? 'los términos' : 'los pedazos');
    // En su lugar, cada término dividido entre lo que está en todos: 20t ÷ 5t = 4
    function divisionHtml() {
      const ts = st.reto.terminos, hay = !nadaAfuera();
      const falta = '<span class="ar-incognita">?</span>';
      return `
        <p class="ar-division-titulo">Encontrar el término en común que divide a ${ts.length === 2 ? 'ambos' : 'todos'}.</p>
        <div class="ar-division" role="group" aria-label="Cada término dividido entre lo que está en todos">
          ${ts.map((t, j) => `
            <div class="ar-div-col">
              <span class="mt ar-div-termino">${th(t)}</span>
              <span class="mt ar-div-entre">${op('÷')} ${hay ? th(st.afuera) : falta}</span>
              <span class="mt ar-div-cociente">${igual} ${hay ? th(st.adentro[j]) : falta}</span>
            </div>`).join('')}
        </div>`;
    }
    function fichaHtml(f) {
      const sel = st.sel === f.id || (st.par && st.par.includes(f.id));
      const activa = st.fase === 'juntar' && !st.par;
      return `<button type="button" class="ar-pieza t${Math.min(f.t[1], 3)} ${f.t[0] < 0 ? 'neg' : ''} ${sel ? 'sel' : ''}" data-ficha="${f.id}" aria-pressed="${sel}" ${activa ? '' : 'disabled'}>${th(f.t)}</button>`;
    }

    function pintar() {
      const r = st.reto, l = letra();
      const mesa = $('.ar-mesa', raiz), preg = $('.ar-pregunta', raiz), calc = $('.ar-calculo', raiz);
      preg.hidden = true;
      calc.hidden = true;
      let enfocar = false;
      if (st.fase === 'predecir') {
        mesa.innerHTML = `<div class="mt ar-expr">${planteamientoHtml()}</div>`;
        preg.hidden = false;
        preg.innerHTML = `
          <p class="cv-preg-titulo">${icono('pista')}Antes de empezar: ¿cómo va a quedar?</p>
          <div class="fila-botones">${r.opciones.map((o, k) => `<button type="button" class="btn btn-secundario btn-chico" data-predice="${k}">${MA.esc(o)}</button>`).join('')}</div>
          <p class="texto-3">Es una predicción: al final se compara con lo que quede.</p>`;
      } else if (r.modo === 'desarmar') {
        mesa.innerHTML = `
          ${sinDibujo() ? divisionHtml() : `<div class="ar-figura">${rectDesarmar()}</div>`}
          <div class="mt ar-linea">${C.polinomioHtml(r.terminos, l)}${nadaAfuera() ? '' : ` ${igual} <span class="ar-resultado ${st.fase === 'listo' ? 'listo' : ''}">${escritoHtml()}</span>`}</div>`;
        if (st.fase === 'sacar') {
          preg.hidden = false;
          preg.innerHTML = `
            <p class="cv-preg-titulo">${icono('mano')}¿Qué está en todos ${losPedazos()}? Se saca de a poco.</p>
            <div class="fila-botones ar-sacar">
              ${PRIMOS.map(k => `<button type="button" class="btn btn-secundario btn-chico" data-sacar="${k}">Sacar ${k}</button>`).join('')}
              <button type="button" class="btn btn-secundario btn-chico" data-sacar="letra">Sacar ${vr(l)}</button>
              <button type="button" class="btn btn-secundario btn-chico" data-sacar="0">Ya no se puede</button>
            </div>
            <p class="texto-3">Pares: terminan en 0, 2, 4, 6 u 8. Tabla del 5: terminan en 0 o en 5. Tabla del 3: sus cifras suman 3, 6, 9, 12…</p>`;
        }
      } else {
        // Juntar, o armar: primero el rectángulo y después las piezas que salen de él
        const conRect = r.modo === 'armar' && st.fase !== 'dibujar';
        const piezas = st.fichas.length ? `<div class="ar-fichas" role="group" aria-label="Piezas">${st.fichas.map(fichaHtml).join('')}</div>` : '';
        const linea = st.fase === 'listo'
          ? `<div class="mt ar-linea">${planteamientoHtml()} ${igual} <span class="ar-resultado listo">${resultadoHtml()}</span></div>`
          : st.fichas.length ? `<div class="mt ar-linea">${C.polinomioHtml(st.fichas.map(f => f.t), l)}</div>` : '';
        mesa.innerHTML = st.fase === 'dibujar'
          ? `<div class="mt ar-expr">${planteamientoHtml()}</div>`
          : `${conRect ? `<div class="ar-figura">${rectArmar()}</div>` : ''}${piezas}${linea}`;
        if (st.fase === 'dibujar') {
          preg.hidden = false;
          preg.innerHTML = `
            <p class="cv-preg-titulo">${icono('mano')}Una multiplicación es un rectángulo: los lados son los factores y cada pedazo es lado por lado.</p>
            <div class="fila-botones"><button type="button" class="btn btn-chico" data-accion="dibujar">Dibujar el rectángulo</button></div>`;
        }
        if (st.fase === 'juntar' && !st.par) {
          preg.hidden = false;
          preg.innerHTML = `<p class="cv-preg-titulo">${icono('mano')}${st.sel == null ? 'Tocar dos piezas de la misma forma para juntarlas.' : 'Ahora, otra de la misma forma.'}</p>`;
        }
      }
      // Recuadro para escribir: un pedazo del rectángulo o la suma de dos piezas
      if (st.fase === 'celdas') {
        const c = st.celdas[st.celda], a = r.alto[c.i], b = r.ancho[c.j];
        calc.hidden = false;
        calc.innerHTML = `
          <label for="ar-num"><span class="mt">${facHtml(a)} ${op('·')} ${facHtml(b)}</span> <span class="mo-igual">=</span></label>
          ${campoHtml('ar-num', l)}
          <button type="button" class="btn btn-chico" data-accion="calcular">Comprobar</button>
          <p class="texto-3">Primero el número y después la letra: ¿cuántas ${MA.esc(l)} hay entre los dos?</p>`;
        enfocar = true;
      } else if (st.fase === 'juntar' && st.par) {
        const [a, b] = st.par.map(id => st.fichas.find(f => f.id === id));
        calc.hidden = false;
        calc.innerHTML = `
          <label for="ar-num"><span class="mt">${sumaHtml(a.t, b.t)}</span> <span class="mo-igual">=</span></label>
          ${campoHtml('ar-num', l)}
          <button type="button" class="btn btn-chico" data-accion="calcular">Comprobar</button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="cancelar">Elegir otras</button>
          <p class="texto-3">Se suman los números de adelante. La letra, ¿cambia o no?</p>`;
        enfocar = true;
      }
      if (enfocar) setTimeout(() => { const campo = $('#ar-num', raiz); if (campo) campo.focus({ preventScroll: true }); }, 30);
      pintarBotones();
    }

    // Botones del pie: ayudas mientras se resuelve; al terminar, cómo seguir
    function pintarBotones() {
      const cont = $('.ar-botones', raiz);
      if (st.fase !== 'listo') {
        cont.innerHTML = `
          <button type="button" class="btn btn-secundario btn-chico" data-accion="pista">${icono('pista')}Pista</button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="reiniciar">${icono('reiniciar')}Reiniciar</button>`;
        return;
      }
      const i = C.RETOS_AREAS.indexOf(st.reto), sig = C.RETOS_AREAS[i + 1];
      const seguir = st.origen ? `<button type="button" class="btn" data-accion="volver">${icono('flechaI')}${st.origen.textoFinal || st.origen.textoVolver}</button>`
        : sig ? `<button type="button" class="btn" data-sig="${sig.id}">Siguiente reto${icono('flechaD')}</button>`
        : i >= 0 && opciones.final ? `<button type="button" class="btn" data-accion="final">${opciones.final.texto}${icono('flechaD')}</button>` : '';
      cont.innerHTML = `${seguir}<button type="button" class="btn btn-secundario" data-accion="reiniciar">${icono('reiniciar')}Repetir</button>`;
    }

    /* ---------- Predecir y dibujar ---------- */
    function predecir(k) {
      st.prediccion = k;
      st.fase = primeraFase();
      ponerMensaje('info', `Predicción: ${MA.esc(st.reto.opciones[k])}.`, 'Ahora, a comprobarlo.');
      pintar();
    }
    function dibujar() {
      st.fase = 'celdas';
      st.celda = 0;
      st.fallos = 0;
      ponerMensaje('ok', 'Así se ve la multiplicación.', `Son ${st.celdas.length} pedazos: cada término de un lado por cada término del otro.`);
      pintar();
    }

    /* ---------- Armar: cada pedazo ---------- */
    function textoLetra(e1, e2, e) {
      const l = letra();
      if (e === 2 && e1 === 1) return `Letras con letras: ${l} · ${l} son dos ${l} multiplicadas, ${l}².`;
      if (e === 1) return `Letras con letras: hay una sola ${l} (el otro es un número), así que queda ${l}.`;
      if (e === 0) return `Letras con letras: ninguno de los dos tiene ${l}, así que queda un número solo.`;
      return `Letras con letras: se cuentan las ${l}, ${e1} + ${e2} = ${e}.`;
    }
    function calcularCelda() {
      const r = st.reto, c = st.celdas[st.celda], a = r.alto[c.i], b = r.ancho[c.j];
      const lectura = leerCampo(raiz, 'ar-num');
      if (lectura.falta) { ponerMensaje('aviso', ...avisoFalta(lectura.falta, letra())); return; }
      const [v, e] = lectura.t;
      if (v === c.t[0] && e === c.t[1]) {
        c.hecho = true;
        st.fallos = 0;
        ponerMensaje('ok', '¡Correcto!', `${MA.esc(facTexto(a))} · ${MA.esc(facTexto(b))} = ${MA.esc(tt(c.t))}.`);
        st.celda = st.celdas.findIndex(x => !x.hecho);
        if (st.celda < 0) { terminarCeldas(); return; }
        pintar();
        return;
      }
      st.fallos++;
      const partes = [];
      const sumada = a[0] + b[0];
      // La letra sola lleva un 1 invisible: 3 · x es 3 · 1 adelante
      const uno = [a, b].some(t => Math.abs(t[0]) === 1 && t[1] > 0) ? ` (la ${letra()} sola lleva un 1)` : '';
      if (v === sumada && v !== c.t[0] && a[1] === b[1] && e === a[1]) {
        partes.push(`Eso sería sumar: ${MA.esc(facTexto(a))} + ${MA.esc(facTexto(b))}. Aquí se multiplica: números con números y letras con letras.`);
      } else {
        if (v !== c.t[0]) {
          if (v === -c.t[0]) partes.push(`El número está bien, pero el signo no: ${Math.sign(a[0]) === Math.sign(b[0]) ? 'signos iguales dan +' : 'signos distintos dan −'}.`);
          else if (v === sumada) partes.push(`Ese número sale de sumar ${MA.fmt(a[0])} + ${MA.fmt(b[0])}${uno}. Al multiplicar, los números se multiplican.`);
          else partes.push(`Números con números: ${MA.fmt(a[0])} · ${MA.fmt(b[0])}${uno}.`);
        }
        if (e !== c.t[1]) partes.push(textoLetra(a[1], b[1], c.t[1]));
      }
      if (st.fallos >= 2) partes.push(`Da ${MA.esc(tt(c.t))}: escribirlo para seguir.`);
      ponerMensaje('error', 'Todavía no.', partes.join(' '));
      const campo = $('#ar-num', raiz);
      if (campo) campo.select();
    }
    function terminarCeldas() {
      const r = st.reto, l = letra();
      const ts = st.celdas.map(c => c.t);
      agregarPaso(`${planteamientoHtml()} ${igual} ${C.polinomioHtml(ts, l)}`, `Todos contra todos: ${ts.length} pedazos.`);
      st.fichas = ts.map(t => ({ id: idFicha++, t: t.slice() }));
      if (buscarPareja()) {
        st.fase = 'juntar';
        ponerMensaje('ok', '¡Rectángulo completo!', 'Ahora, juntar los pedazos del mismo tipo: tienen la misma forma y el mismo color.');
        pintar();
        return;
      }
      ponerMensaje('ok', '¡Rectángulo completo!', 'No hay pedazos del mismo tipo: no hay nada que juntar.');
      terminar();
    }

    /* ---------- Juntar: dos piezas de la misma forma ---------- */
    function distintoTipo(a, b) {
      const l = letra(), clave = [a[1], b[1]].sort().join('-');
      return ({
        '1-2': `Un cuadrado (${l}²) y una tira (${l}) no se juntan, igual que m² con m.`,
        '0-1': `Una tira (${l}) y un cuadradito (un número suelto) no se juntan, igual que metros con segundos.`,
        '0-2': `Un cuadrado (${l}²) y un cuadradito (un número suelto) no se juntan.`
      }[clave] || 'Son de distinto tipo.') + ' Se juntan solo los de la misma forma.';
    }
    function tocarFicha(id) {
      if (st.sel == null || st.sel === id) { st.sel = st.sel === id ? null : id; ponerMensaje(null); pintar(); return; }
      const a = st.fichas.find(f => f.id === st.sel), b = st.fichas.find(f => f.id === id);
      st.sel = null;
      if (a.t[1] !== b.t[1]) { ponerMensaje('error', 'No son del mismo tipo.', distintoTipo(a.t, b.t)); pintar(); return; }
      st.par = [a.id, b.id];
      st.fallos = 0;
      ponerMensaje(null);
      pintar();
    }
    function sumarPar() {
      const l = letra();
      const [a, b] = st.par.map(id => st.fichas.find(f => f.id === id));
      const lectura = leerCampo(raiz, 'ar-num');
      if (lectura.falta) { ponerMensaje('aviso', ...avisoFalta(lectura.falta, l)); return; }
      const [v, e] = lectura.t;
      const suma = [a.t[0] + b.t[0], a.t[1]];
      if (v === suma[0] && (e === suma[1] || suma[0] === 0)) {
        const donde = Math.min(st.fichas.indexOf(a), st.fichas.indexOf(b));
        st.fichas = st.fichas.filter(f => f !== a && f !== b);
        if (suma[0] !== 0) st.fichas.splice(donde, 0, { id: idFicha++, t: suma });
        agregarPaso(`${sumaHtml(a.t, b.t)} ${igual} ${suma[0] === 0 ? n(0) : th(suma)}`, suma[0] === 0 ? 'Se anulan, como deber y pagar lo mismo.' : NOTA_SUMA[Math.min(suma[1], 2)]);
        st.par = null;
        st.fallos = 0;
        ponerMensaje('ok', '¡Correcto!', suma[0] === 0 ? 'Se anularon: quedó cero.' : '');
        if (!buscarPareja()) { terminar(); return; }
        pintar();
        return;
      }
      st.fallos++;
      const partes = [];
      if (v !== suma[0]) {
        if (v === a.t[0] * b.t[0] && v !== suma[0]) partes.push(`Ese número sale de multiplicar. Aquí se suman: ${MA.esc(sumaTexto([a.t[0], 0], [b.t[0], 0]))}.`);
        else if (v === -suma[0]) partes.push(`El número está bien, pero el signo no. Pensarlo con plata: «${plata(a.t[0], b.t[0])}».`);
        else if (a.t[0] < 0 || b.t[0] < 0) partes.push(`Pensarlo con plata: «${plata(a.t[0], b.t[0]).split(':')[0]}».`);
        else partes.push(`Revisar la cuenta: ${MA.esc(sumaTexto([a.t[0], 0], [b.t[0], 0]))}.`);
      }
      if (e !== suma[1]) {
        partes.push(suma[1] === 0
          ? `Son números sueltos: no aparece ninguna ${l}.`
          : e > suma[1]
            ? `Al sumar, la letra no cambia: ${a.t[1] === 1 ? 'tiras más tiras siguen siendo tiras' : 'cuadrados más cuadrados siguen siendo cuadrados'}. El exponente cambia al multiplicar.`
            : `La letra no se pierde: ${a.t[1] === 1 ? `siguen siendo tiras (${l})` : `siguen siendo cuadrados (${l}²)`}.`);
      }
      if (st.fallos >= 2) partes.push(`Da ${MA.esc(tt(suma))}: escribirlo para seguir.`);
      ponerMensaje('error', 'Todavía no.', partes.join(' '));
      const campo = $('#ar-num', raiz);
      if (campo) campo.select();
    }

    /* ---------- Desarmar: sacar de a poco ---------- */
    function queQueda() {
      const k = PRIMOS.find(p => st.adentro.every(t => t[0] % p === 0));
      if (k) return { k, texto: `Todos ${porQueSiEsta(k)}: sale un ${k}.` };
      if (st.adentro.every(t => t[1] >= 1)) return { k: 'letra', texto: `Todos tienen al menos una ${letra()}: sale una.` };
      return null;
    }
    function sacar(k) {
      const l = letra();
      const antes = nadaAfuera() ? `${C.polinomioHtml(st.reto.terminos, l)} ${igual}` : igual;
      if (k === 0) {
        const q = queQueda();
        if (q) { ponerMensaje('error', 'Todavía se puede.', q.texto.replace('sale', 'todavía sale')); return; }
        terminar();
        return;
      }
      if (k === 'letra') {
        const sin = st.adentro.find(t => t[1] === 0);
        if (sin) { ponerMensaje('error', `No todos tienen ${MA.esc(l)}.`, `${MA.esc(tt(sin))} no tiene ${MA.esc(l)}: para sacarla, tiene que estar en todos ${losPedazos()}.`); return; }
        st.afuera = [st.afuera[0], st.afuera[1] + 1];
        st.adentro = st.adentro.map(([c, e]) => [c, e - 1]);
        agregarPaso(`${antes} ${escritoHtml()}`, `Todos tienen al menos una ${l}: se saca una.`);
        ponerMensaje('ok', `Se sacó una ${MA.esc(l)}.`, `Queda ${MA.esc(escritoTexto())}.`);
      } else {
        const no = st.adentro.find(t => t[0] % k !== 0);
        if (no) { ponerMensaje('error', `El ${k} no está en todos.`, `${porQueNoEsta(k, no[0])} Para sacar un número, tiene que estar en todos ${losPedazos()}.`); return; }
        const previo = st.afuera[0];
        st.afuera = [previo * k, st.afuera[1]];
        st.adentro = st.adentro.map(([c, e]) => [c / k, e]);
        agregarPaso(`${antes} ${escritoHtml()}`, `Todos ${porQueSiEsta(k)}: se saca un ${k}.${previo !== 1 ? ` Afuera queda ${previo} · ${k} = ${previo * k}.` : ''}`);
        ponerMensaje('ok', `Se sacó un ${k}.`, `Queda ${MA.esc(escritoTexto())}.`);
      }
      pintar();
    }

    /* ---------- Final ---------- */
    function terminar() {
      const r = st.reto, l = letra();
      st.fase = 'listo';
      st.sel = null;
      st.par = null;
      if (r.modo === 'desarmar') {
        if (nadaAfuera()) agregarPaso(C.polinomioHtml(r.terminos, l), `No hay nada en todos ${losPedazos()}: queda igual.`);
        else {
          const vuelta = st.adentro.map(t => C.multiplicarTerminos(st.afuera, t));
          agregarPaso(`${st.adentro.map(t => `${th(st.afuera)} ${op('·')} ${facHtml(t)}`).join(` ${op('+')} `)} ${igual} ${C.polinomioHtml(vuelta, l)}`, 'Comprobación: al armar de vuelta, sale lo mismo.');
        }
      } else {
        agregarPaso(resultadoHtml(), 'Lo que queda, en orden: primero las x², después las x y al final los números.'.replace(/x/g, l));
      }
      let extra = '';
      if (st.prediccion != null && r.opciones) {
        const pq = typeof r.porQue === 'object' ? (r.porQue || {})[st.prediccion] : r.porQue;
        extra = st.prediccion === r.correcta
          ? ` La predicción (${MA.esc(r.opciones[st.prediccion])}) era correcta.`
          : ` Se predijo ${MA.esc(r.opciones[st.prediccion])}: ${pq || ''}`;
      }
      ponerMensaje('ok', '¡Listo!', `Queda ${MA.esc(resultadoTexto())}.${extra}${r.nota ? ' ' + r.nota : ''}`);
      if (r.id && !st.origen) {
        if (MA.progreso.marcar('m3.areas.' + r.id)) MA.aviso('Reto completado.');
        pintarRetos();
      }
      pintar();
    }

    function pista() {
      const r = st.reto, l = letra();
      if (st.fase === 'listo') { ponerMensaje('info', 'Ya está resuelto.', ''); return; }
      st.pistas++;
      let texto;
      if (st.fase === 'predecir') {
        texto = r.modo === 'armar' ? 'Pensarlo como un rectángulo: cada término de un lado por cada término del otro.'
          : r.modo === 'desarmar' ? '¿Qué está en todos los pedazos: un número, una letra o los dos?'
          : `Se juntan solo los del mismo tipo: ${l}² con ${l}², ${l} con ${l} y números con números.`;
      } else if (st.fase === 'dibujar') texto = 'Tocar «Dibujar el rectángulo».';
      else if (st.fase === 'celdas') {
        const c = st.celdas[st.celda], a = r.alto[c.i], b = r.ancho[c.j];
        texto = `Para ${MA.esc(facTexto(a))} · ${MA.esc(facTexto(b))}: primero los números (${MA.fmt(a[0])} · ${MA.fmt(b[0])}) y después las letras (¿cuántas ${MA.esc(l)} hay entre los dos?).`;
      } else if (st.fase === 'juntar') {
        if (st.par) texto = 'Se suman los números de adelante. La letra no cambia: sigue siendo la misma pieza.';
        else { const p = buscarPareja(); texto = `Las piezas ${MA.esc(tt(p[0].t))} y ${MA.esc(tt(p[1].t))} son de la misma forma.`; }
      } else if (st.fase === 'sacar') {
        const q = queQueda();
        texto = !q ? 'Ya no queda nada que esté en todos: tocar «Ya no se puede».'
          : st.pistas < 2 ? `Tres preguntas: ¿todos son pares? ¿Terminan en 0 o en 5? ¿Están en la tabla del 3? Y además: ¿todos tienen ${MA.esc(l)}?`
          : q.texto;
      }
      ponerMensaje('info', 'Pista.', texto);
    }

    /* ---------- Eventos ---------- */
    const calcular = () => (st.fase === 'celdas' ? calcularCelda() : sumarPar());
    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b)) return;
      if (b.dataset.reto) { cargar(C.RETOS_AREAS.find(x => x.id === b.dataset.reto)); return; }
      if (b.dataset.sig) {
        cargar(C.RETOS_AREAS.find(x => x.id === b.dataset.sig));
        raiz.scrollIntoView({ behavior: MA.movimientoReducido() ? 'auto' : 'smooth', block: 'start' });
        return;
      }
      if (b.dataset.predice != null) { predecir(Number(b.dataset.predice)); return; }
      if (b.dataset.ficha != null) { tocarFicha(Number(b.dataset.ficha)); return; }
      if (b.dataset.tipo != null) { marcarTipo(b); return; }
      if (b.dataset.sacar != null) { sacar(b.dataset.sacar === 'letra' ? 'letra' : Number(b.dataset.sacar)); return; }
      const a = b.dataset.accion;
      if (a === 'dibujar') dibujar();
      else if (a === 'calcular') calcular();
      else if (a === 'cancelar') { st.par = null; ponerMensaje(null); pintar(); }
      else if (a === 'pista') pista();
      else if (a === 'reiniciar') cargar(st.reto, st.origen);
      else if (a === 'volver' && st.origen) st.origen.volver();
      else if (a === 'final' && opciones.final) opciones.final.ir();
    });
    raiz.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'ar-num') { e.preventDefault(); calcular(); } });
    MA.bus.on('progreso', clave => { if (clave === null) pintarRetos(); });

    const guardado = MA.almacen.leer('m3.areas.reto', null);
    const primero = C.RETOS_AREAS.find(r => r.id === guardado)
      || C.RETOS_AREAS.find(r => !MA.progreso.hecho('m3.areas.' + r.id)) || C.RETOS_AREAS[0];
    cargar(primero);

    return {
      cargarProblema(problema, origen) { cargar(Object.assign({ titulo: 'Ejercicio de la práctica' }, problema), origen); }
    };
  }

  MA.Areas = { crear: crearAreas, campoHtml, leerCampo, marcarTipo, avisoFalta, plata };
})();
