/* =====================================================================
   HERRAMIENTA · MESA DE OPERACIONES (signos y orden de las operaciones)
   ---------------------------------------------------------------------
   La expresión se muestra con cada operación como un botón. Se toca la
   que va primero y se escribe cuánto da (como en el papel, renglón por
   renglón). Si la elegida todavía no puede ir, la mesa explica qué
   tiene que ir antes y por qué. El orden sale del árbol de la expresión:
   una operación está lista cuando sus dos lados ya son números.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, icono } = MA;
  const { n, fr } = MA.f;

  /* ---------- Números racionales exactos ---------- */
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const rat = (a, b = 1) => { if (b < 0) { a = -a; b = -b; } const g = mcd(a, b); return { a: a / g, b: b / g }; };
  const R = {
    '+': (x, y) => rat(x.a * y.b + y.a * x.b, x.b * y.b),
    '-': (x, y) => rat(x.a * y.b - y.a * x.b, x.b * y.b),
    '*': (x, y) => rat(x.a * y.a, x.b * y.b),
    '/': (x, y) => rat(x.a * y.b, x.b * y.a),
    '^': (x, y) => { let r = rat(1); for (let i = 0; i < y.a; i++) r = R['*'](r, x); return r; }
  };
  const valor = r => r.a / r.b;
  const ratTexto = r => (r.b === 1 ? MA.fmt(r.a) : `${r.a < 0 ? '−' : ''}${Math.abs(r.a)}/${r.b}`);
  const ratHtml = r => (r.b === 1 ? n(r.a) : `${r.a < 0 ? '<span class="op">−</span>' : ''}${fr(n(Math.abs(r.a)), n(r.b))}`);

  /* ---------- Lectura de la expresión ---------- */
  function leer(texto) {
    const toks = texto.replace(/\s+/g, '').match(/\d+|[-+*/^()]/g);
    let i = 0, id = 0;
    const ver = () => toks[i], tomar = () => toks[i++];
    const num = v => ({ t: 'num', v: rat(v), id: id++ });
    function expr() {
      let l = term();
      while (ver() === '+' || ver() === '-') { const o = tomar(); l = { t: 'bin', o, l, r: term(), id: id++ }; }
      return l;
    }
    function term() {
      let l = unario();
      while (ver() === '*' || ver() === '/') { const o = tomar(); l = { t: 'bin', o, l, r: unario(), id: id++ }; }
      return l;
    }
    function unario() {
      if (ver() === '-') {
        tomar();
        // «-5» es un número negativo; «-3^2» es el opuesto de 3²
        if (/^\d+$/.test(ver()) && toks[i + 1] !== '^') return num(-Number(tomar()));
        return { t: 'neg', x: unario(), id: id++ };
      }
      return potencia();
    }
    function potencia() {
      const base = primario();
      if (ver() === '^') { tomar(); return { t: 'bin', o: '^', l: base, r: primario(), id: id++ }; }
      return base;
    }
    function primario() {
      if (ver() === '(') { tomar(); const e = expr(); tomar(); if (e.t !== 'num') e.par = true; else e.parNeg = true; return e; }
      return num(Number(tomar()));
    }
    return expr();
  }

  const SIMBOLO = { '+': '+', '-': '−', '*': '·', '/': '÷' };
  const NOMBRE = { '+': 'la suma', '-': 'la resta', '*': 'la multiplicación', '/': 'la división', '^': 'la potencia', neg: 'el signo menos' };
  const lista = nodo => nodo.t === 'num' || (nodo.t === 'bin' ? nodo.l.t === 'num' && nodo.r.t === 'num' : nodo.x.t === 'num');
  const nivel = nodo => (nodo.t === 'neg' ? 2 : { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 }[nodo.o]);

  /* Texto plano (para mensajes) */
  function plano(nodo, izq = true) {
    if (nodo.t === 'num') { const s = ratTexto(nodo.v); return nodo.v.a < 0 && (!izq || nodo.parNeg) ? `(${s})` : s; }
    let s;
    if (nodo.t === 'neg') s = `−${plano(nodo.x, false)}`;
    else if (nodo.o === '^') s = `${plano(nodo.l, false)}^${plano(nodo.r, false)}`.replace(/\^(\d)$/, (m, d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
    else s = `${plano(nodo.l, izq && !nodo.par)} ${SIMBOLO[nodo.o]} ${plano(nodo.r, false)}`;
    return nodo.par ? `(${s})` : s;
  }

  /* HTML: con botones (interactiva) o sin ellos (bitácora) */
  function html(nodo, opc, izq = true) {
    const { activa, sel } = opc;
    let s;
    if (nodo.t === 'num') {
      s = ratHtml(nodo.v);
      if (nodo.v.a < 0 && (!izq || nodo.parNeg)) s = `<span class="op">(</span>${s}<span class="op">)</span>`;
      return nodo.id === opc.nuevo ? `<span class="mo-nuevo">${s}</span>` : s;
    }
    const boton = sim => (activa ? `<button type="button" class="mo-op ${lista(nodo) ? 'lista' : ''}" data-op="${nodo.id}" aria-label="${NOMBRE[nodo.t === 'neg' ? 'neg' : nodo.o]}: ${MA.esc(plano(nodo))}">${sim}</button>` : `<span class="op">${sim}</span>`);
    if (nodo.t === 'neg') s = `${boton('−')}${html(nodo.x, opc, false)}`;
    else if (nodo.o === '^') s = `${html(nodo.l, opc, false)}<sup class="exp mo-exp">${activa ? boton(ratTexto(nodo.r.v)) : ratTexto(nodo.r.v)}</sup>`;
    else s = `${html(nodo.l, opc, izq && !nodo.par)} ${boton(SIMBOLO[nodo.o])} ${html(nodo.r, opc, false)}`;
    if (nodo.par) s = `<span class="op">(</span>${s}<span class="op">)</span>`;
    if (nodo.t === 'neg' && !izq && !nodo.par) s = `<span class="op">(</span>${s}<span class="op">)</span>`;
    return nodo.id === sel ? `<span class="mo-sel">${s}</span>` : s;
  }

  /* ---------- Por qué una operación todavía no puede ir ---------- */
  function porQueNo(nodo) {
    const hijos = nodo.t === 'neg' ? [nodo.x] : [nodo.l, nodo.r];
    const bloquea = hijos.find(h => h.t !== 'num');
    const txt = `<b>${MA.esc(plano(bloquea))}</b>`;
    if (nodo.t === 'neg' && bloquea.t === 'bin' && bloquea.o === '^') return `${MA.esc(plano(nodo))} significa −(${MA.esc(plano(bloquea))}): el cuadrado es solo del número. Primero la potencia, ${txt}, y después el signo.`;
    if (bloquea.par) return `Primero se resuelve lo que está entre paréntesis: ${txt}.`;
    if (bloquea.t === 'bin' && bloquea.o === '^') return `La potencia va antes: primero ${txt}.`;
    if (bloquea.t === 'neg') return `Antes hay que resolver ${txt}.`;
    if (nivel(bloquea) > nivel(nodo)) return `Multiplicar y dividir van antes que sumar y restar: primero ${txt}.`;
    if (nivel(bloquea) === nivel(nodo)) return `${nodo.o === '+' || nodo.o === '-' ? 'Sumar y restar' : 'Multiplicar y dividir'} tienen el mismo rango: van de izquierda a derecha. Primero ${txt}.`;
    return `Antes hay que resolver ${txt}.`;
  }

  /* Error típico al escribir un resultado */
  function errorTipico(nodo, x, y, correcto, dado) {
    const c = valor(correcto);
    if (nodo.t === 'neg') return 'Solo cambia el signo.';
    if (MA.casiIgual(Math.abs(dado), Math.abs(c)) && Math.sign(dado) !== Math.sign(c)) {
      if (nodo.o === '*' || nodo.o === '/') return `El número está bien, pero el signo no. Signos ${Math.sign(valor(x)) === Math.sign(valor(y)) ? 'iguales dan +' : 'distintos dan −'}.`;
      if (nodo.o === '^') return `El paréntesis incluye el signo: ${MA.esc(plano(nodo))} es (${MA.esc(ratTexto(x))}) multiplicado por sí mismo ${ratTexto(y)} veces. ${y.a % 2 === 0 ? 'Un número par de negativos da +.' : 'Un número impar de negativos da −.'}`;
      return 'Revisar el signo: pensarlo como plata (deudas y pagos).';
    }
    if (nodo.o === '-' && valor(y) < 0 && MA.casiIgual(dado, valor(x) + valor(y))) return 'Restar un negativo es sumar: − (−2) = + 2.';
    if (nodo.o === '^' && MA.casiIgual(dado, valor(x) * valor(y))) return `${MA.esc(ratTexto(x))} elevado a ${ratTexto(y)} no es ${MA.esc(ratTexto(x))} · ${ratTexto(y)}: es ${MA.esc(ratTexto(x))} multiplicado por sí mismo ${ratTexto(y)} veces.`;
    return 'Revisar la cuenta.';
  }

  function crearOperaciones(raiz) {
    const C = MA.M2;
    const st = { reto: null, arbol: null, pendiente: null, fallos: 0, origen: null, escribir: MA.almacen.leer('m2.op.escribir', true) !== false, nuevo: null };

    raiz.classList.add('banco', 'mesa-op');
    raiz.innerHTML = `
      <div class="banco-cabeza">
        <div>
          <span class="etiqueta">Herramienta 2</span>
          <h3>Mesa de operaciones</h3>
        </div>
        <div class="segmentado mo-retos" role="group" aria-label="Retos de operaciones"></div>
      </div>
      <div class="bz-origen mo-origen" hidden></div>
      <div class="cv-reto mo-reto"></div>
      <div class="mo-mesa"><div class="mt mo-expr" aria-live="polite"></div></div>
      <div class="mo-calculo" hidden></div>
      <div class="banco-pie">
        <div class="cv-banco-cabeza">
          <p class="texto-2 mo-instruccion">Tocar la operación que va primero.</p>
          <label class="cv-predecir"><input type="checkbox" class="mo-escribir" ${st.escribir ? 'checked' : ''}><span>Escribir cada resultado</span></label>
        </div>
        <div class="mensaje mo-mensaje" role="status" aria-live="polite"></div>
        <div class="fila-botones mo-botones"></div>
      </div>
      <section class="cv-bitacora" aria-label="Pasos">
        <h4>Pasos</h4>
        <p class="texto-3">Un renglón por operación, como en el papel.</p>
        <ol class="bz-pasos mo-pasos"></ol>
      </section>`;

    const msg = $('.mo-mensaje', raiz);
    function ponerMensaje(tipo, titulo, texto) {
      if (!tipo) { msg.className = 'mensaje mo-mensaje'; msg.innerHTML = ''; return; }
      const ico = { ok: 'checkCirculo', aviso: 'alerta', info: 'info', error: 'errorCirculo' }[tipo];
      msg.className = 'mensaje mo-mensaje ' + tipo;
      msg.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }
    const pasos = [];
    const pintarPasos = () => { $('.mo-pasos', raiz).innerHTML = pasos.map(p => `<li><span class="mt">${p.html}</span>${p.nota ? `<span class="bz-paso-nota">${p.nota}</span>` : ''}</li>`).join(''); };

    function pintarRetos() {
      $('.mo-retos', raiz).innerHTML = C.RETOS_OPERACIONES.map((r, i) => {
        const hecho = MA.progreso.hecho('m2.op.' + r.id);
        return `<button type="button" class="segmento" data-reto="${r.id}" aria-pressed="${!!(st.reto && st.reto.id === r.id)}">Reto ${i + 1}${hecho ? `<span class="ok">${icono('check')}</span>` : ''}</button>`;
      }).join('');
    }

    function cargar(reto, origen) {
      st.reto = reto;
      st.origen = origen || null;
      st.arbol = leer(reto.expr);
      st.pendiente = null;
      st.nuevo = null;
      st.fallos = 0;
      pasos.length = 0;
      pasos.push({ html: html(st.arbol, {}), nota: 'El planteamiento.' });
      if (!origen && reto.id) MA.almacen.guardar('m2.op.reto', reto.id);
      const i = C.RETOS_OPERACIONES.indexOf(reto);
      $('.mo-reto', raiz).innerHTML = `
        ${i >= 0 ? `<span class="pildora">Reto ${i + 1} de ${C.RETOS_OPERACIONES.length}</span>` : ''}
        <h4>${reto.titulo || 'Ejercicio de la práctica'}</h4>
        ${reto.contexto ? `<p>${reto.contexto}</p>` : ''}`;
      const ori = $('.mo-origen', raiz);
      ori.hidden = !origen;
      if (origen) ori.innerHTML = `<span>${icono('hoja')}Ejercicio ${origen.numero} de la práctica</span><button type="button" class="btn btn-secundario btn-chico" data-accion="volver">${icono('flechaI')}Volver a la práctica</button>`;
      ponerMensaje(null);
      pintarRetos();
      pintarPasos();
      pintar();
    }

    function buscar(nodo, id, padre = null) {
      if (nodo.id === id) return { nodo, padre };
      const hijos = nodo.t === 'bin' ? [nodo.l, nodo.r] : nodo.t === 'neg' ? [nodo.x] : [];
      for (const h of hijos) { const r = buscar(h, id, nodo); if (r) return r; }
      return null;
    }
    function reemplazar(id, nuevo) {
      const { padre } = buscar(st.arbol, id);
      if (!padre) { st.arbol = nuevo; return; }
      if (padre.t === 'neg') padre.x = nuevo;
      else if (padre.l.id === id) padre.l = nuevo;
      else padre.r = nuevo;
    }
    const resultadoDe = nodo => (nodo.t === 'neg' ? rat(-nodo.x.v.a, nodo.x.v.b) : R[nodo.o](nodo.l.v, nodo.r.v));

    // Botones del pie: ayudas mientras se resuelve; al terminar, cómo seguir
    function pintarBotones(terminado) {
      const cont = $('.mo-botones', raiz);
      if (!terminado) {
        cont.innerHTML = `
          <button type="button" class="btn btn-secundario btn-chico" data-accion="pista">${icono('pista')}Pista</button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="reiniciar">${icono('reiniciar')}Reiniciar</button>`;
        return;
      }
      const i = C.RETOS_OPERACIONES.indexOf(st.reto), sig = C.RETOS_OPERACIONES[i + 1];
      const seguir = st.origen ? `<button type="button" class="btn" data-accion="volver">${icono('flechaI')}Volver al ejercicio ${st.origen.numero}</button>`
        : sig ? `<button type="button" class="btn" data-sig="${sig.id}">Siguiente reto${icono('flechaD')}</button>`
        : i >= 0 ? `<a class="btn" href="#m2-ideas-p3">Seguir con las ideas clave, parte 3${icono('flechaD')}</a>` : '';
      cont.innerHTML = `${seguir}<button type="button" class="btn btn-secundario" data-accion="reiniciar">${icono('reiniciar')}Repetir</button>`;
    }

    function pintar() {
      const terminado = st.arbol.t === 'num';
      pintarBotones(terminado);
      $('.mo-expr', raiz).innerHTML = html(st.arbol, { activa: !terminado && !st.pendiente, sel: st.pendiente ? st.pendiente.id : null, nuevo: st.nuevo });
      $('.mo-instruccion', raiz).textContent = terminado ? 'Resuelto.' : st.pendiente ? 'Escribir cuánto da la parte resaltada.' : 'Tocar la operación que va primero.';
      const calc = $('.mo-calculo', raiz);
      calc.hidden = !st.pendiente;
      if (st.pendiente) {
        calc.innerHTML = `
          <label for="mo-campo"><span class="mt">${html(st.pendiente, {})}</span> <span class="mo-igual">=</span></label>
          <span class="campo-grupo"><input id="mo-campo" class="campo" type="text" inputmode="text" autocomplete="off" spellcheck="false" placeholder="Número"></span>
          <button type="button" class="btn btn-chico" data-accion="calcular">Comprobar</button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="cancelar">Elegir otra</button>
          <p class="texto-3">Los negativos llevan el signo menos: −4. Las fracciones, con barra: 3/2.</p>`;
        setTimeout(() => { const c = $('#mo-campo', raiz); if (c) c.focus({ preventScroll: true }); }, 30);
      }
    }

    function aplicar(nodo, nota) {
      const v = resultadoDe(nodo);
      const nuevo = { t: 'num', v, id: nodo.id };
      reemplazar(nodo.id, nuevo);
      st.nuevo = nodo.id;
      st.pendiente = null;
      st.fallos = 0;
      pasos.push({ html: html(st.arbol, { nuevo: nodo.id }), nota });
      pintarPasos();
      if (st.arbol.t === 'num') {
        ponerMensaje('ok', '¡Listo!', `El resultado es ${MA.esc(ratTexto(st.arbol.v))}.`);
        if (st.reto.id && !st.origen) {
          if (MA.progreso.marcar('m2.op.' + st.reto.id)) MA.aviso('Reto completado.');
          pintarRetos();
        }
      }
      pintar();
    }

    function elegir(id) {
      const { nodo } = buscar(st.arbol, id);
      if (!lista(nodo)) {
        ponerMensaje('error', 'Esa todavía no.', porQueNo(nodo));
        return;
      }
      const textoOp = `${plano(nodo)} = ${ratTexto(resultadoDe(nodo))}`;
      if (!st.escribir) { ponerMensaje('ok', '¡Bien elegida!', MA.esc(textoOp)); aplicar(nodo, MA.esc(textoOp)); return; }
      st.pendiente = nodo;
      st.fallos = 0;
      ponerMensaje('ok', '¡Bien elegida!', 'Ahora, ¿cuánto da?');
      pintar();
    }

    function calcular() {
      const nodo = st.pendiente;
      const campo = $('#mo-campo', raiz);
      const cands = MA.leerNumeros(campo.value);
      if (!cands.length) { ponerMensaje('aviso', 'Solo el número.', 'Ejemplos válidos: 12 · −4 · 3/2'); campo.focus(); return; }
      const correcto = resultadoDe(nodo);
      if (cands.some(c => MA.casiIgual(c, valor(correcto), 0.0001))) {
        ponerMensaje('ok', '¡Correcto!', '');
        aplicar(nodo, MA.esc(`${plano(nodo)} = ${ratTexto(correcto)}`));
        return;
      }
      st.fallos++;
      const x = nodo.t === 'neg' ? nodo.x.v : nodo.l.v, y = nodo.t === 'neg' ? null : nodo.r.v;
      let texto = errorTipico(nodo, x, y, correcto, cands[0]);
      if (st.fallos >= 2) texto += ` Da ${MA.esc(ratTexto(correcto))}: escribirlo para seguir.`;
      ponerMensaje('error', 'Todavía no.', texto);
      campo.select();
    }

    function pista() {
      if (st.arbol.t === 'num') { ponerMensaje('info', 'Ya está resuelto.', st.reto.id ? 'Se puede seguir con el próximo reto.' : ''); return; }
      if (st.pendiente) { ponerMensaje('info', 'Pista.', 'Hacer la cuenta en el papel. Con signos: al multiplicar, iguales dan + y distintos dan −; al sumar, pensar en plata.'); return; }
      // La primera operación lista, según el orden
      const listas = [];
      (function rec(nd) {
        if (nd.t === 'num') return;
        if (lista(nd)) listas.push(nd);
        if (nd.t === 'bin') { rec(nd.l); rec(nd.r); } else rec(nd.x);
      })(st.arbol);
      const conPar = listas.find(x => x.par);
      const sug = conPar || listas.sort((a, b) => nivel(b) - nivel(a))[0];
      const razon = conPar ? 'está entre paréntesis' : sug.t === 'bin' && sug.o === '^' ? 'es una potencia' : nivel(sug) === 2 ? 'multiplicar y dividir van antes que sumar y restar' : 'va de izquierda a derecha';
      ponerMensaje('info', 'Pista.', `Mirar <b>${MA.esc(plano(sug))}</b>: ${razon}.`);
    }

    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b)) return;
      if (b.dataset.reto) { cargar(C.RETOS_OPERACIONES.find(x => x.id === b.dataset.reto)); return; }
      if (b.dataset.sig) {
        cargar(C.RETOS_OPERACIONES.find(x => x.id === b.dataset.sig));
        raiz.scrollIntoView({ behavior: MA.movimientoReducido() ? 'auto' : 'smooth', block: 'start' });
        return;
      }
      if (b.dataset.op != null) { elegir(Number(b.dataset.op)); return; }
      const a = b.dataset.accion;
      if (a === 'calcular') calcular();
      else if (a === 'cancelar') { st.pendiente = null; ponerMensaje(null); pintar(); }
      else if (a === 'pista') pista();
      else if (a === 'reiniciar') cargar(st.reto, st.origen);
      else if (a === 'volver' && st.origen) st.origen.volver();
    });
    raiz.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'mo-campo') calcular(); });
    $('.mo-escribir', raiz).addEventListener('change', e => {
      st.escribir = e.target.checked;
      MA.almacen.guardar('m2.op.escribir', st.escribir);
      if (!st.escribir && st.pendiente) { const nd = st.pendiente; aplicar(nd, MA.esc(`${plano(nd)} = ${ratTexto(resultadoDe(nd))}`)); }
    });
    MA.bus.on('progreso', clave => { if (clave === null) pintarRetos(); });

    const guardado = MA.almacen.leer('m2.op.reto', null);
    const primero = C.RETOS_OPERACIONES.find(r => r.id === guardado)
      || C.RETOS_OPERACIONES.find(r => !MA.progreso.hecho('m2.op.' + r.id)) || C.RETOS_OPERACIONES[0];
    cargar(primero);

    return {
      cargarProblema(problema, origen) { cargar({ expr: problema.expr, titulo: 'Ejercicio de la práctica' }, origen); }
    };
  }

  MA.Operaciones = { crear: crearOperaciones, leer };
})();
