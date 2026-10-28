/* =====================================================================
   Herramienta · la llave maestra (fórmula cuadrática)
   ---------------------------------------------------------------------
   Una sola llave para cualquier trinomio ax² + bx + c:
     1) escribir a, b y c, cada uno con su signo (x² sola: a = 1; si
        falta un término, vale 0);
     2) reemplazar en la llave, siempre con paréntesis, y calcular paso
        por paso: (b)², 4 · (a) · (c) y lo de adentro de la raíz. Aquí
        están las trampas del radar de signos: (−5)² = +25,
        25 − (−24) = 25 + 24 y −(−5) = +5;
     3) si adentro da negativo, no hay raíces y no se factoriza; si da
        0, hay una raíz repetida; si da un cuadrado exacto, hay dos;
     4) cada raíz r da el paréntesis que se vuelve cero con x = r, que
        es (x − r). Se elige probando, no de memoria;
     5) la a va adelante; si una raíz es fracción, la a entra a su
        paréntesis (distributiva). Al final se comprueba armando de
        vuelta: en los pasos y, con «Comprobar», flecha por flecha
        (todos contra todos, como en el papel). No se manda a la mesa
        de áreas: casi siempre hay negativos, y no hay áreas negativas.
   «Paso por paso» se puede desmarcar para pedir solo lo esencial.
   La fórmula se resuelve a la vista: mientras se escriben a, b y c,
   sus huecos se llenan; en las cuentas titila la parte que se pide, y
   cada resultado reemplaza a su parte en la fórmula (el último queda
   en verde un momento).
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, icono } = MA;
  const { n, op, vr, fr, pega, raiz } = MA.f;
  const { pot } = MA.M2;
  const C = MA.M3;
  const igual = op('='), por = op('·'), mas = op('+'), menos = op('−');

  /* ---------- Fracciones exactas (las raíces pueden ser fracciones) ---------- */
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const rat = (p, q = 1) => { if (q < 0) { p = -p; q = -q; } const g = mcd(p, q); return { p: p / g, q: q / g }; };
  const valor = v => (typeof v === 'number' ? v : v.p / v.q);
  const ratTexto = r => (r.q === 1 ? MA.fmt(r.p) : `${r.p < 0 ? '−' : ''}${Math.abs(r.p)}/${r.q}`);
  const ratHtml = r => (r.q === 1 ? n(r.p) : r.p < 0 ? pega(menos, fr(n(-r.p), n(r.q))) : fr(n(r.p), n(r.q)));
  const parN = v => C.par(n(v));   // siempre con paréntesis: (−5)
  // El paréntesis de una raíz: la raíz 3 da (x − 3); la raíz −3, (x + 3); la raíz 0, x
  const absDe = r => ({ p: Math.abs(r.p), q: r.q });
  const factorRaizHtml = (r, l) => (r.p === 0 ? vr(l) : C.par(`${vr(l)} ${r.p > 0 ? menos : mas} ${ratHtml(absDe(r))}`));
  const factorRaizTexto = (r, l) => (r.p === 0 ? l : `(${l} ${r.p > 0 ? '−' : '+'} ${ratTexto(absDe(r))})`);

  const AYUDA = {
    b2: 'El número por sí mismo. El paréntesis incluye el signo.',
    '4ac': 'De izquierda a derecha, con la regla de los signos.',
    d: 'Lo de adentro de la raíz. Ojo con los signos pegados.',
    '-b': 'El menos de adelante cambia el signo.',
    '2a': 'Lo de abajo de la llave.',
    x1: 'Primero lo de arriba y después la división. Sirven las fracciones (1/2).',
    x2: 'Primero lo de arriba y después la división. Sirven las fracciones (1/2).'
  };

  function crearLlave(contenedor, opciones = {}) {
    const raizEl = contenedor;
    const st = { reto: null, origen: null, fase: null, hechos: {}, raices: [], k: 0, factores: [], fallos: 0, comprobar: null, final: null,
      ultimo: null,   // la última cuenta hecha: se marca en verde en la fórmula
      pasoAPaso: MA.almacen.leer('m3.llave.pasos', true) !== false };

    raizEl.classList.add('banco', 'mesa-ll');
    raizEl.innerHTML = `
      <div class="banco-cabeza">
        <div>
          <span class="etiqueta">Herramienta 3</span>
          <h3>Llave maestra</h3>
        </div>
        <div class="segmentado ll-retos" role="group" aria-label="Retos de la llave maestra"></div>
      </div>
      <div class="bz-origen ll-origen" hidden></div>
      <div class="cv-reto ll-reto"></div>
      <div class="ll-mesa" aria-live="polite">
        <div class="mt ll-tri"></div>
        <div class="ll-formula"><div class="mt ll-llave"></div></div>
      </div>
      <div class="mf-pregunta ll-pregunta" hidden></div>
      <div class="mo-calculo ll-calculo" hidden></div>
      <details class="ll-ficha">
        <summary>${icono('chevD', 'chev')}Cuadrados exactos, para sacar la raíz sin calculadora</summary>
        ${C.fichaCuadradosHtml(15)}
      </details>
      <div class="ll-comprobar" hidden></div>
      <div class="banco-pie">
        <div class="cv-banco-cabeza">
          <p class="texto-2 mo-instruccion ll-instruccion"></p>
          <label class="cv-predecir"><input type="checkbox" class="ll-pasoapaso" ${st.pasoAPaso ? 'checked' : ''}><span>Paso por paso</span></label>
        </div>
        <div class="mensaje ll-mensaje" role="status" aria-live="polite"></div>
        <div class="fila-botones ll-botones"></div>
      </div>
      <section class="cv-bitacora" aria-label="Pasos">
        <h4>Pasos</h4>
        <p class="texto-3">Lo mismo que se escribe en el papel, renglón por renglón.</p>
        <ol class="bz-pasos ll-pasos"></ol>
      </section>`;

    const msg = $('.ll-mensaje', raizEl);
    function ponerMensaje(tipo, titulo, texto) {
      if (!tipo) { msg.className = 'mensaje ll-mensaje'; msg.innerHTML = ''; return; }
      const ico = { ok: 'checkCirculo', aviso: 'radar', info: 'info', error: 'errorCirculo' }[tipo];
      msg.className = 'mensaje ll-mensaje ' + tipo;
      msg.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }
    const pasos = [];
    function agregarPaso(html, nota) { pasos.push({ html, nota }); pintarPasos(); }
    const pintarPasos = () => { $('.ll-pasos', raizEl).innerHTML = pasos.map(p => `<li><span class="mt">${p.html}</span>${p.nota ? `<span class="bz-paso-nota">${p.nota}</span>` : ''}</li>`).join(''); };

    function pintarRetos() {
      $('.ll-retos', raizEl).innerHTML = C.RETOS_LLAVE.map((r, i) => {
        const hecho = MA.progreso.hecho('m3.llave.' + r.id);
        return `<button type="button" class="segmento" data-reto="${r.id}" aria-pressed="${!!(st.reto && st.reto.id === r.id)}">Reto ${i + 1}${hecho ? `<span class="ok">${icono('check')}</span>` : ''}</button>`;
      }).join('');
    }

    const letra = () => st.reto.letra || 'x';
    const triHtml = colores => C.trinomioHtml(st.reto, letra(), colores);
    const triTexto = () => C.trinomioTexto(st.reto, letra());
    const cuentas = () => {
      const { a, b, c } = st.reto;
      const D = b * b - 4 * a * c, R = D >= 0 ? Math.round(Math.sqrt(D)) : NaN;
      return { b2: b * b, cuatro: 4 * a * c, D, R, exacto: D >= 0 && R * R === D };
    };

    /* ---------- Los pasos de la cuenta ----------
       La lista se arma con lo que ya se hizo: si «Paso por paso» está
       desmarcado, solo se piden lo de adentro de la raíz, la raíz y las
       dos raíces del trinomio. */
    function lista() {
      const { a, b, c } = st.reto, h = st.hechos, pp = st.pasoAPaso;
      const { b2, cuatro, D, R, exacto } = cuentas();
      const L = [];
      if ('b2' in h || (pp && !('d' in h))) L.push({ clave: 'b2', etiqueta: pot(parN(b), 2), valor: b2 });
      if ('4ac' in h || (pp && !('d' in h))) L.push({ clave: '4ac', etiqueta: `${n(4)} ${por} ${parN(a)} ${por} ${parN(c)}`, valor: cuatro });
      L.push({ clave: 'd', valor: D, etiqueta: 'b2' in h && '4ac' in h
        ? `${n(b2)} ${menos} ${cuatro < 0 ? parN(cuatro) : n(cuatro)}`
        : `${pot(parN(b), 2)} ${menos} ${n(4)} ${por} ${parN(a)} ${por} ${parN(c)}` });
      if (!exacto) return L;
      if (D > 0) L.push({ clave: 'r', etiqueta: raiz(n(D)), valor: R });
      const antesDeX = !('x1' in h);
      if ('-b' in h || (pp && antesDeX)) L.push({ clave: '-b', etiqueta: pega(menos, parN(b)), valor: -b });
      if ('2a' in h || (pp && antesDeX)) L.push({ clave: '2a', etiqueta: `${n(2)} ${por} ${parN(a)}`, valor: 2 * a });
      const arriba = '-b' in h ? n(-b) : pega(menos, parN(b));
      const abajo = '2a' in h ? n(2 * a) : `${n(2)} ${por} ${parN(a)}`;
      if (D === 0) L.push({ clave: 'x1', etiqueta: fr(arriba, abajo), valor: rat(-b, 2 * a) });
      else {
        L.push({ clave: 'x1', etiqueta: fr(`${arriba} ${mas} ${n(R)}`, abajo), valor: rat(-b + R, 2 * a) });
        L.push({ clave: 'x2', etiqueta: fr(`${arriba} ${menos} ${n(R)}`, abajo), valor: rat(-b - R, 2 * a) });
      }
      return L;
    }
    const pendiente = () => lista().find(p => !(p.clave in st.hechos));
    const conX = p => (p.clave === 'x1' || p.clave === 'x2' ? `${vr('x', p.clave[1])} ${igual} ` : '');

    /* ---------- Cargar un reto ---------- */
    function cargar(reto, origen) {
      st.reto = reto;
      st.origen = origen || null;
      st.fase = 'abc';
      st.hechos = {};
      st.raices = [];
      st.factores = [];
      st.k = 0;
      st.fallos = 0;
      st.comprobar = null;
      st.ultimo = null;
      pasos.length = 0;
      const comp = $('.ll-comprobar', raizEl);
      comp.hidden = true;
      comp.innerHTML = '';
      if (!origen && reto.id) MA.almacen.guardar('m3.llave.reto', reto.id);
      const i = C.RETOS_LLAVE.indexOf(reto);
      $('.ll-reto', raizEl).innerHTML = `
        ${i >= 0 ? `<span class="pildora">Reto ${i + 1} de ${C.RETOS_LLAVE.length}</span>` : ''}
        <h4>${reto.titulo || 'Ejercicio de la práctica'}</h4>
        ${reto.contexto ? `<p>${reto.contexto}</p>` : ''}`;
      const ori = $('.ll-origen', raizEl);
      ori.hidden = !origen;
      if (origen) ori.innerHTML = `<span>${icono('hoja')}${origen.etiqueta}</span><button type="button" class="btn btn-secundario btn-chico" data-accion="volver">${icono('flechaI')}${origen.textoVolver}</button>`;
      agregarPaso(triHtml(false), 'El planteamiento.');
      ponerMensaje(null);
      pintarRetos();
      pintar();
    }

    /* ---------- La llave en pantalla ----------
       Con a, b y c, los huecos se llenan mientras se escribe y titila el
       que se está escribiendo. En las cuentas titila la parte que se pide
       y cada resultado reemplaza a su parte. Al final quedan las raíces,
       cada una con su cuenta. */
    function formulaHtml() {
      const { a, b } = st.reto, h = st.hechos;
      if (st.fase === 'abc') {
        const activo = document.activeElement, v = {};
        ['a', 'b', 'c'].forEach(k => {
          const campo = $('#ll-' + k, raizEl), x = campo ? MA.leerNumeros(campo.value) : [];
          if (x.length) v[k] = x[0];
        });
        return C.llaveHtml(v, activo && /^ll-[abc]$/.test(activo.id) ? activo.id.slice(3) : null);
      }
      const { b2, cuatro, D, R } = cuentas();
      const p = st.fase === 'calculo' ? pendiente() : null;
      const parte = (clave, html, extra = '') => `<span class="ll-parte${p && p.clave === clave ? ' ll-actual' : ''}${st.ultimo === clave ? ' ll-recien' : ''}${extra}">${html}</span>`;
      const hueco = k => `<span class="ll-hueco ll-${k}">${parN(st.reto[k])}</span>`;
      const tMb = '-b' in h ? n(-b) : pega(menos, hueco('b'));
      const t2a = '2a' in h ? n(2 * a) : `${n(2)} ${por} ${hueco('a')}`;
      if (p ? p.clave === 'x1' || p.clave === 'x2' : 'x1' in h) {
        const arriba = signo => (D === 0 ? parte('-b', tMb) : `${parte('-b', tMb)} ${op(signo)} ${parte('r', n(R))}`);
        const fila = (k, signo) => `<span class="mt ll-fila-raiz">${parte(k, `${vr('x', D === 0 ? '' : k[1])} ${igual} ${fr(arriba(signo), parte('2a', t2a))}${k in h ? ` ${igual} ${ratHtml(h[k])}` : ''}`)}</span>`;
        return D === 0 ? fila('x1', '+') : fila('x1', '+') + fila('x2', '−');
      }
      const tB2 = 'b2' in h ? n(b2) : pot(hueco('b'), 2);
      const t4ac = '4ac' in h ? (cuatro < 0 ? parN(cuatro) : n(cuatro)) : `${n(4)} ${por} ${hueco('a')} ${por} ${hueco('c')}`;
      const adentro = parte('d', 'd' in h ? n(D) : `${parte('b2', tB2)} ${menos} ${parte('4ac', t4ac)}`);
      const tRaiz = 'r' in h ? n(R) : 'd' in h && D === 0 ? n(0) : raiz(adentro);
      // Si adentro dio negativo (o no es exacto), la raíz queda marcada: ahí se traba la llave
      return `${vr('x')} ${igual} ${fr(`${parte('-b', tMb)} ${op('±')} ${parte('r', tRaiz, st.fase === 'sin' ? ' ll-atasco' : '')}`, parte('2a', t2a))}`;
    }
    function pintarFormula() {
      const el = $('.ll-llave', raizEl), html = formulaHtml();
      el.classList.toggle('ll-en-raices', html.includes('ll-fila-raiz'));
      el.innerHTML = html;
    }

    /* ---------- Dibujo ---------- */
    function pintar() {
      const l = letra();
      const preg = $('.ll-pregunta', raizEl), calc = $('.ll-calculo', raizEl);
      const terminado = st.fase === 'listo' || st.fase === 'sin';
      $('.ll-tri', raizEl).innerHTML = st.fase === 'listo'
        ? `${triHtml(true)} ${igual} <span class="ar-resultado listo">${st.final}</span>`
        : triHtml(st.fase !== 'abc');
      preg.hidden = st.fase !== 'factores';
      calc.hidden = !(st.fase === 'abc' || st.fase === 'calculo');
      $('.ll-instruccion', raizEl).textContent = {
        abc: 'Escribir a, b y c, cada uno con su signo.',
        calculo: 'Calcular lo que pide el recuadro, como en el papel.',
        factores: 'Cada raíz da un paréntesis.',
        listo: 'Resuelto.',
        sin: 'No se puede factorizar.'
      }[st.fase];
      if (st.fase === 'abc') {
        calc.innerHTML = `
          <div class="ll-abc">
            ${['a', 'b', 'c'].map(k => `<label class="ll-campo ll-${k}" for="ll-${k}"><span class="ll-letra">${vr(k)}</span><span class="mo-igual">=</span><span class="campo-grupo"><input id="ll-${k}" class="campo" type="text" inputmode="text" autocomplete="off" spellcheck="false" placeholder="Número"></span></label>`).join('')}
          </div>
          <button type="button" class="btn btn-chico" data-accion="abc">Comprobar</button>
          <p class="texto-3">La a acompaña a ${MA.esc(l)}², la b acompaña a ${MA.esc(l)} y la c es el número solo. Si delante de la letra no hay número, vale 1; si falta un término, vale 0.</p>`;
        setTimeout(() => { const campo = $('#ll-a', raizEl); if (campo) campo.focus({ preventScroll: true }); }, 30);
      } else if (st.fase === 'calculo') {
        const p = pendiente();
        const ayuda = p.clave === 'r' ? `¿Qué número multiplicado por sí mismo da ${cuentas().D}? La ficha de cuadrados ayuda.` : AYUDA[p.clave];
        calc.innerHTML = `
          <label for="ll-campo"><span class="mt">${conX(p)}${p.etiqueta}</span> <span class="mo-igual">=</span></label>
          <span class="campo-grupo"><input id="ll-campo" class="campo" type="text" inputmode="text" autocomplete="off" spellcheck="false" placeholder="Número"></span>
          <button type="button" class="btn btn-chico" data-accion="calcular">Comprobar</button>
          <p class="texto-3">${ayuda}</p>`;
        setTimeout(() => { const campo = $('#ll-campo', raizEl); if (campo) campo.focus({ preventScroll: true }); }, 30);
      } else if (st.fase === 'factores') {
        const r = st.raices[st.k], abs = absDe(r);
        const candidatos = [rat(abs.p, abs.q), rat(-abs.p, abs.q)];
        preg.innerHTML = `
          <p class="cv-preg-titulo">${icono('pista')}La raíz es <span class="mt">${ratHtml(r)}</span>. ¿Qué paréntesis se vuelve cero con <span class="mt">${vr(l)} ${igual} ${ratHtml(r)}</span>?</p>
          <div class="fila-botones">${candidatos.map((x, k) => `<button type="button" class="btn btn-secundario btn-chico" data-factor="${k}"><span class="mt">${factorRaizHtml(x, l)}</span></button>`).join('')}</div>
          <p class="texto-3">Se reemplaza la ${MA.esc(l)} por la raíz y se mira cuál da cero.</p>`;
      }
      // Al final, porque en a, b y c la fórmula lee los campos que se acaban de armar
      pintarFormula();
      pintarBotones(terminado);
    }

    function pintarBotones(terminado) {
      const cont = $('.ll-botones', raizEl);
      if (!terminado) {
        cont.innerHTML = `
          <button type="button" class="btn btn-secundario btn-chico" data-accion="pista">${icono('pista')}Pista</button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="reiniciar">${icono('reiniciar')}Reiniciar</button>`;
        return;
      }
      const i = C.RETOS_LLAVE.indexOf(st.reto), sig = C.RETOS_LLAVE[i + 1];
      const seguir = st.origen ? `<button type="button" class="btn" data-accion="volver">${icono('flechaI')}${st.origen.textoFinal || st.origen.textoVolver}</button>`
        : sig ? `<button type="button" class="btn" data-sig="${sig.id}">Siguiente reto${icono('flechaD')}</button>`
        : i >= 0 && opciones.final ? `<button type="button" class="btn" data-accion="final">${opciones.final.texto}${icono('flechaD')}</button>` : '';
      const comprobar = st.comprobar ? `<button type="button" class="btn btn-secundario" data-accion="comprobar">${icono('lapiz')}Comprobar: todos contra todos</button>` : '';
      cont.innerHTML = `${seguir}${comprobar}<button type="button" class="btn btn-secundario" data-accion="reiniciar">${icono('reiniciar')}Repetir</button>`;
    }

    /* ---------- a, b y c ---------- */
    function porQueABC(k, dado) {
      const l = letra(), val = st.reto[k];
      const nombre = { a: `el número que acompaña a ${l}²`, b: `el número que acompaña a ${l}`, c: 'el número solo, sin letra' }[k];
      if (val !== 0 && dado === -val) return `El número está bien, pero el signo no: el signo que está delante es parte del número. La ${k} es ${nombre}, con su signo.`;
      if (val === 1 && k !== 'c') return `Si delante de ${k === 'a' ? `${l}²` : l} no hay número, hay un 1 invisible: ${k} = 1.`;
      if (val === -1 && k !== 'c') return `Delante de −${k === 'a' ? `${l}²` : l} hay un 1 invisible: ${k} = −1.`;
      if (val === 0) return `No hay ${k === 'b' ? `término con ${l}` : 'número solo'}: ${k} = 0.`;
      const otro = ['a', 'b', 'c'].find(o => o !== k && st.reto[o] === dado);
      if (otro) return `Ese número es la ${otro}. La ${k} es ${nombre}.`;
      return `La ${k} es ${nombre}.`;
    }
    function comprobarABC() {
      const lee = k => MA.leerNumeros($('#ll-' + k, raizEl).value);
      const vals = { a: lee('a'), b: lee('b'), c: lee('c') };
      const vacio = ['a', 'b', 'c'].find(k => !vals[k].length);
      if (vacio) { ponerMensaje('info', `Falta la ${vacio}.`, 'Escribir los tres números, cada uno con su signo.'); $('#ll-' + vacio, raizEl).focus(); return; }
      const malo = ['a', 'b', 'c'].find(k => !vals[k].includes(st.reto[k]));
      if (malo) {
        st.fallos++;
        ponerMensaje('error', `Revisar la ${malo}.`, porQueABC(malo, vals[malo][0]));
        $('#ll-' + malo, raizEl).select();
        return;
      }
      const { a, b, c } = st.reto;
      st.fallos = 0;
      st.fase = 'calculo';
      agregarPaso(`${vr('a')} ${igual} ${pega(n(a), ',')} ${vr('b')} ${igual} ${pega(n(b), ',')} ${vr('c')} ${igual} ${n(c)}`, 'Cada uno con su signo.');
      agregarPaso(C.llaveHtml({ a, b, c }), 'Se reemplaza en la llave, siempre con paréntesis.');
      ponerMensaje('ok', '¡Correcto!', 'Ahora, a reemplazar en la llave: cada número va en su hueco, con paréntesis.');
      pintar();
    }

    /* ---------- Las cuentas ---------- */
    function errorPaso(p, dado) {
      const { a, b, c } = st.reto, { b2, cuatro, D } = cuentas(), f = MA.fmt;
      switch (p.clave) {
        case 'b2':
          if (dado === -b2) return `(${f(b)})² = (${f(b)}) · (${f(b)}): signos iguales dan +. Un número al cuadrado nunca da negativo.`;
          if (dado === 2 * b) return `Ese resultado sale de multiplicar por 2. Al cuadrado es el número por sí mismo: (${f(b)}) · (${f(b)}).`;
          return `Al cuadrado es el número por sí mismo: (${f(b)}) · (${f(b)}).`;
        case '4ac':
          if (dado === -cuatro) return `El número está bien, pero el signo no: ${a * c > 0 ? 'signos iguales dan +' : 'signos distintos dan −'}.`;
          return `De izquierda a derecha: 4 · (${f(a)}) = ${f(4 * a)}, y después por (${f(c)}).`;
        case 'd':
          if (cuatro < 0 && dado === b2 + cuatro) return { aviso: true, titulo: 'Cuidado, signos pegados.', texto: `${f(b2)} − (${f(cuatro)}): los dos signos pegados se cambian por un +, y queda ${f(b2)} + ${f(-cuatro)}.` };
          if (cuatro > 0 && dado === b2 + cuatro) return `Es una resta: ${f(b2)} − ${f(cuatro)}.`;
          return `Revisar la cuenta: ${f(b2)} − ${cuatro < 0 ? `(${f(cuatro)})` : f(cuatro)}.`;
        case 'r':
          if (dado === -p.valor) return 'La raíz cuadrada se toma positiva: el ± de la llave ya se encarga del signo.';
          if (dado * 2 === D) return `La raíz no es la mitad: ${f(dado)} · ${f(dado)} = ${f(dado * dado)}. ¿Qué número multiplicado por sí mismo da ${f(D)}?`;
          if (Number.isInteger(dado)) return `${f(dado)} · ${f(dado)} = ${f(dado * dado)}, no ${f(D)}. ¿Qué número multiplicado por sí mismo da ${f(D)}?`;
          return `¿Qué número multiplicado por sí mismo da ${f(D)}? La ficha de cuadrados ayuda.`;
        case '-b':
          if (b < 0 && dado === b) return { aviso: true, titulo: 'Cuidado, signos pegados.', texto: `−(${f(b)}): los dos signos pegados se cambian por un +, y queda +${f(-b)}.` };
          if (b > 0 && dado === b) return `El menos de adelante cambia el signo: −(${f(b)}) = ${f(-b)}.`;
          return 'El menos de adelante cambia el signo del número.';
        case '2a':
          return `2 · (${f(a)}).`;
        default: {
          const R = cuentas().R, arriba = p.clave === 'x1' ? -b + R : -b - R;
          if (MA.casiIgual(dado, arriba, 0.0001) && 2 * a !== 1) return `Falta dividir entre ${f(2 * a)}.`;
          const conB = (p.clave === 'x1' ? b + R : b - R) / (2 * a);
          if (b !== 0 && MA.casiIgual(dado, conB, 0.0001)) return { aviso: true, titulo: 'Cuidado con −b.', texto: `Ese resultado sale de usar ${f(b)} arriba. Lo que va es −b = −(${f(b)}) = ${f(-b)}.` };
          if (MA.casiIgual(dado, -valor(p.valor), 0.0001)) return 'El número está bien, pero el signo no. Pensarlo con plata.';
          return `Primero la cuenta de arriba (${f(-b)} ${p.clave === 'x1' ? '+' : '−'} ${f(R)} = ${f(arriba)}) y después la división entre ${f(2 * a)}.`;
        }
      }
    }
    function notaPaso(p) {
      const { b } = st.reto, { cuatro, D, R } = cuentas(), f = MA.fmt;
      return {
        b2: b < 0 ? 'El paréntesis incluye el signo: menos por menos da más.' : '',
        '4ac': '',
        d: `Lo de adentro de la raíz.${cuatro < 0 ? ` Signos pegados: − (${f(cuatro)}) = + ${f(-cuatro)}.` : ''}`,
        r: `${f(R)} · ${f(R)} = ${f(D)}.`,
        '-b': b < 0 ? `Signos pegados: −(${f(b)}) = +${f(-b)}.` : '',
        '2a': '',
        x1: D === 0 ? 'Con 0 adentro de la raíz, más y menos dan lo mismo: hay una sola raíz.' : 'Con el +.',
        x2: 'Con el −.'
      }[p.clave];
    }
    function calcular() {
      const p = pendiente();
      const campo = $('#ll-campo', raizEl);
      const cands = MA.leerNumeros(campo.value);
      if (!cands.length) { ponerMensaje('info', 'Solo el número.', 'Con el signo menos si es negativo: −4. Las fracciones, con barra: 1/2.'); campo.focus(); return; }
      const v = valor(p.valor);
      if (cands.some(x => MA.casiIgual(x, v, 0.0001))) {
        st.hechos[p.clave] = p.valor;
        st.fallos = 0;
        st.ultimo = p.clave;
        const res = typeof p.valor === 'number' ? n(p.valor) : ratHtml(p.valor);
        agregarPaso(`${conX(p)}${p.etiqueta} ${igual} ${res}`, notaPaso(p));
        ponerMensaje('ok', '¡Correcto!', '');
        const { D, exacto } = cuentas();
        if (p.clave === 'd' && D < 0) { sinRaices(); return; }
        if (p.clave === 'd' && !exacto) { noExacto(); return; }
        if (!pendiente()) { aFactores(); return; }
        pintar();
        return;
      }
      st.fallos++;
      const err = errorPaso(p, cands[0]);
      const e = typeof err === 'string' ? { titulo: 'Todavía no.', texto: err } : err;
      let texto = e.texto;
      if (st.fallos >= 2) texto += ` Da ${typeof p.valor === 'number' ? MA.fmt(p.valor) : ratTexto(p.valor)}: escribirlo para seguir.`;
      ponerMensaje(e.aviso ? 'aviso' : 'error', e.titulo, texto);
      campo.select();
    }

    function sinRaices() {
      const { D } = cuentas();
      st.fase = 'sin';
      agregarPaso(raiz(n(D)), 'Ningún número multiplicado por sí mismo da negativo: no hay raíces.');
      ponerMensaje('ok', '¡Listo!', `Adentro de la raíz da ${MA.fmt(D)}, un número negativo, y ningún número multiplicado por sí mismo da negativo. No hay raíces: ${MA.esc(triTexto())} no se puede factorizar.${st.reto.nota ? ' ' + st.reto.nota : ''}`);
      marcar();
      pintar();
    }
    function noExacto() {
      const { D } = cuentas();
      st.fase = 'sin';
      ponerMensaje('aviso', 'No es un cuadrado exacto.', `${MA.fmt(D)} no es ningún número entero multiplicado por sí mismo: con números enteros no se puede. En el examen casi siempre es señal de un error de signos.`);
      pintar();
    }

    /* ---------- De las raíces a los paréntesis ---------- */
    function aFactores() {
      const { a, b } = st.reto, { D, R } = cuentas(), l = letra();
      st.raices = D === 0 ? [rat(-b, 2 * a)] : [rat(-b + R, 2 * a), rat(-b - R, 2 * a)];
      st.k = 0;
      st.factores = [];
      st.fase = 'factores';
      ponerMensaje('ok', D === 0 ? '¡La raíz!' : '¡Las dos raíces!', `${st.raices.map(ratTexto).join(' y ')}. Ahora, de las raíces a los paréntesis.`);
      saltarCeros(l);
    }
    // La raíz 0 da el factor x sin preguntar: con x = 0, x vale 0
    function saltarCeros(l) {
      while (st.k < st.raices.length && st.raices[st.k].p === 0) {
        st.factores.push(st.raices[st.k]);
        agregarPaso(`${vr(l)} ${igual} ${n(0)}`, `La raíz 0 da el factor ${l}: con ${l} = 0, vale 0.`);
        st.k++;
      }
      if (st.k >= st.raices.length) { terminar(); return; }
      pintar();
    }
    function elegirFactor(k) {
      st.ultimo = null;
      const l = letra(), r = st.raices[st.k], abs = absDe(r);
      const cand = k === 0 ? rat(abs.p, abs.q) : rat(-abs.p, abs.q);
      const signo = cand.p > 0 ? '−' : '+';
      const prueba = rat(r.p * cand.q - cand.p * r.q, r.q * cand.q);   // raíz − candidato
      const cuenta = `${ratTexto(r)} ${signo} ${ratTexto(abs)} = ${ratTexto(prueba)}`;
      if (prueba.p !== 0) {
        st.fallos++;
        ponerMensaje('error', 'Ese no se vuelve cero.', `Con ${MA.esc(l)} = ${ratTexto(r)}: ${cuenta}. Tiene que dar 0.`);
        return;
      }
      st.fallos = 0;
      st.factores.push(r);
      agregarPaso(`${factorRaizHtml(r, l)} con ${vr(l)} ${igual} ${ratHtml(r)}: ${ratHtml(r)} ${op(signo)} ${ratHtml(abs)} ${igual} ${n(0)}`, `La raíz ${ratTexto(r)} da el paréntesis ${factorRaizTexto(r, l)}.`);
      ponerMensaje('ok', '¡Correcto!', `Con ${MA.esc(l)} = ${ratTexto(r)}: ${cuenta}.`);
      if (st.raices.length === 1) {
        st.factores.push(r);
        agregarPaso(pega(factorRaizHtml(r, l), factorRaizHtml(r, l)), 'La raíz se repite: el paréntesis va dos veces.');
      }
      st.k++;
      saltarCeros(l);
    }

    /* ---------- Final ---------- */
    function marcar() {
      if (st.reto.id && !st.origen) {
        if (MA.progreso.marcar('m3.llave.' + st.reto.id)) MA.aviso('Reto completado.');
        pintarRetos();
      }
    }
    function terminar() {
      const { a } = st.reto, l = letra(), { D } = cuentas();
      // Si una raíz es fracción p/q y el a se puede dividir entre q, el q entra a su paréntesis: 2(x − ½) = 2x − 1
      let resto = a;
      const binomios = st.factores.map(r => {
        if (r.q > 1 && resto % r.q === 0) { resto /= r.q; return { r, t: [[r.q, 1], [-r.p, 0]], entra: r.q }; }
        return { r, t: r.p === 0 ? [[1, 1]] : [[1, 1], [-r.p, 0]], entra: 0 };
      });
      const adelante = resto === 1 ? '' : resto === -1 ? menos : n(resto);
      const final = pega(adelante, ...binomios.map(x => C.factorHtml(x.t, l)));
      const delante = resto === 1 ? '' : resto === -1 ? '−' : MA.fmt(resto);
      const finalTexto = `${delante}${binomios.map(x => C.factorTexto(x.t, l)).join('')}${D === 0 ? ` = ${delante}${C.factorTexto(binomios[0].t, l)}²` : ''}`;
      const conRaices = pega(a === 1 ? '' : a === -1 ? menos : n(a), ...st.factores.map(r => factorRaizHtml(r, l)));
      agregarPaso(`${triHtml(false)} ${igual} ${conRaices}`, a === 1 ? 'Cada raíz da un paréntesis.' : 'La a va adelante: a por los dos paréntesis.');
      const entra = binomios.find(x => x.entra);
      if (entra) agregarPaso(`${igual} ${final}`, `El ${entra.entra} entra al paréntesis de la fracción (distributiva): ${entra.entra}${factorRaizTexto(entra.r, l)} = ${C.polinomioTexto(entra.t, l)}.`);
      if (D === 0) agregarPaso(`${igual} ${pega(adelante, pot(C.factorHtml(binomios[0].t, l), 2))}`, 'El mismo paréntesis dos veces: al cuadrado.');
      // Comprobación: armar de vuelta
      const [f1, f2] = binomios.map(x => x.t);
      const p = C.multiplicar(f1, f2);
      if (resto === 1) {
        const ped = C.pedazos(f1, f2);
        agregarPaso(`${C.productoHtml([f1, f2], l)} ${igual} ${C.polinomioHtml(ped, l)} ${igual} ${C.polinomioHtml(p, l)}`, 'Comprobación: al armar de vuelta, sale el trinomio del principio.');
      } else {
        agregarPaso(`${final} ${igual} ${pega(adelante, C.par(C.polinomioHtml(p, l)))} ${igual} ${C.polinomioHtml(p.map(t => [t[0] * resto, t[1]]), l)}`, 'Comprobación: al armar de vuelta, sale el trinomio del principio.');
      }
      // Para comprobar con flechas: los dos paréntesis y el número de adelante
      st.comprobar = { alto: f1, ancho: f2, delante: resto };
      st.final = D === 0 ? `${final} ${igual} ${pega(adelante, pot(C.factorHtml(binomios[0].t, l), 2))}` : final;
      st.fase = 'listo';
      ponerMensaje('ok', '¡Listo!', `${MA.esc(triTexto())} = ${MA.esc(finalTexto)}.${st.reto.nota ? ' ' + st.reto.nota : ''}`);
      marcar();
      pintar();
    }

    // Armar de vuelta como en el papel: todos contra todos, flecha por flecha
    function comprobarConFlechas() {
      const cont = $('.ll-comprobar', raizEl);
      cont.hidden = false;
      cont.innerHTML = '<div></div>';
      MA.Flechas.crear(cont.firstChild, Object.assign({
        letra: letra(),
        titulo: 'Comprobación: armar de vuelta con todos contra todos',
        final: 'Sale el trinomio del principio: la factorización está bien.'
      }, st.comprobar));
      cont.scrollIntoView({ behavior: MA.movimientoReducido() ? 'auto' : 'smooth', block: 'nearest' });
    }

    function pista() {
      const { a, b, c } = st.reto, l = letra();
      if (st.fase === 'abc') { ponerMensaje('info', 'Pista.', `Ir término por término: el de ${MA.esc(l)}² da a, el de ${MA.esc(l)} da b y el número solo da c. El signo que está delante va con el número.`); return; }
      if (st.fase === 'calculo') {
        const p = pendiente(), { b2, cuatro, D } = cuentas(), f = MA.fmt;
        const textos = {
          b2: `(${f(b)}) · (${f(b)}).`,
          '4ac': `4 · (${f(a)}) · (${f(c)}): primero 4 · (${f(a)}) = ${f(4 * a)}.`,
          d: `${f(b2)} − ${cuatro < 0 ? `(${f(cuatro)})` : f(cuatro)}${cuatro < 0 ? ': dos signos pegados se cambian por un +.' : '.'}`,
          r: `¿Qué número por sí mismo da ${f(D)}? Buscarlo en la ficha de cuadrados.`,
          '-b': `−(${f(b)})${b < 0 ? ': dos signos pegados se cambian por un +.' : ': el menos cambia el signo.'}`,
          '2a': `2 · (${f(a)}).`,
          x1: 'Primero se suma lo de arriba y después se divide.',
          x2: 'Primero se resta lo de arriba y después se divide.'
        };
        ponerMensaje('info', 'Pista.', textos[p.clave]);
        return;
      }
      if (st.fase === 'factores') {
        const r = st.raices[st.k];
        ponerMensaje('info', 'Pista.', `Reemplazar ${MA.esc(l)} por ${ratTexto(r)} en cada paréntesis y hacer la cuenta: el que da 0 es el bueno.`);
        return;
      }
      ponerMensaje('info', 'Ya está resuelto.', '');
    }

    /* ---------- Eventos ---------- */
    raizEl.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raizEl.contains(b)) return;
      if (b.dataset.reto) { cargar(C.RETOS_LLAVE.find(x => x.id === b.dataset.reto)); return; }
      if (b.dataset.sig) {
        cargar(C.RETOS_LLAVE.find(x => x.id === b.dataset.sig));
        raizEl.scrollIntoView({ behavior: MA.movimientoReducido() ? 'auto' : 'smooth', block: 'start' });
        return;
      }
      if (b.dataset.factor != null) { elegirFactor(Number(b.dataset.factor)); return; }
      const a = b.dataset.accion;
      if (a === 'abc') comprobarABC();
      else if (a === 'calcular') calcular();
      else if (a === 'pista') pista();
      else if (a === 'reiniciar') cargar(st.reto, st.origen);
      else if (a === 'volver' && st.origen) st.origen.volver();
      else if (a === 'final' && opciones.final) opciones.final.ir();
      else if (a === 'comprobar' && st.comprobar) comprobarConFlechas();
    });
    raizEl.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      if (e.target.id === 'll-campo') { e.preventDefault(); calcular(); }
      else if (/^ll-[abc]$/.test(e.target.id)) { e.preventDefault(); comprobarABC(); }
    });
    $('.ll-pasoapaso', raizEl).addEventListener('change', e => {
      st.pasoAPaso = e.target.checked;
      MA.almacen.guardar('m3.llave.pasos', st.pasoAPaso);
      if (st.fase === 'calculo') { st.ultimo = null; ponerMensaje(null); pintar(); }
    });
    // Mientras se escriben a, b y c, la llave se va llenando y titila el hueco del campo activo
    const campoABC = e => st.fase === 'abc' && /^ll-[abc]$/.test(e.target.id);
    raizEl.addEventListener('input', e => { if (campoABC(e)) pintarFormula(); });
    raizEl.addEventListener('focusin', e => { if (campoABC(e)) pintarFormula(); });
    raizEl.addEventListener('focusout', e => { if (campoABC(e)) setTimeout(pintarFormula, 0); });
    MA.bus.on('progreso', clave => { if (clave === null) pintarRetos(); });

    const guardado = MA.almacen.leer('m3.llave.reto', null);
    const primero = C.RETOS_LLAVE.find(r => r.id === guardado)
      || C.RETOS_LLAVE.find(r => !MA.progreso.hecho('m3.llave.' + r.id)) || C.RETOS_LLAVE[0];
    cargar(primero);

    return {
      cargarProblema(problema, origen) { cargar(Object.assign({ titulo: 'Ejercicio de la práctica' }, problema), origen); }
    };
  }

  MA.Llave = { crear: crearLlave };
})();
