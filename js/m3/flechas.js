/* =====================================================================
   Herramienta · todos contra todos (del dibujo al papel)
   ---------------------------------------------------------------------
   La distributiva como se escribe en el papel: cada término del primer
   factor multiplica a cada término del segundo, y cada multiplicación
   es una flecha. Son los mismos pedazos del rectángulo de áreas, con
   los mismos colores (azul x², ámbar x, violeta número), pero sin
   lados que medir: por eso sirve con negativos, porque no hay áreas
   negativas.
   Se avanza flecha por flecha. Cada flecha llega con su pregunta
   (¿cuánto da x · (−3)?) y el resultado se ve en el paso siguiente,
   para decirlo antes de mirarlo. Al final se junta lo del mismo tipo
   (con plata, si hay negativos) y, si hay un número adelante, se
   multiplica por él. Lo usan la tarjeta «Del dibujo al papel» y la
   comprobación de la llave maestra.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, icono } = MA;
  const { n, op, mt, pega } = MA.f;
  const C = MA.M3;
  const por = op('·'), igual = op('=');
  let figuras = 0;   // cada figura lleva sus propias puntas de flecha (ids distintos)

  /* ---------- El dibujo ----------
     Un svg con letra de 22 unidades: los términos en una fila, las
     flechas del primer término por encima y las del segundo por debajo.
     Los anchos son aproximados: cada flecha apunta al centro de su
     término, y la más larga sale más afuera para no cruzarse. */
  const ALTO_LETRA = 16, BAJO_LETRA = 6, RADIO = 8.5;
  const ANCHOS = { '(': 8, ')': 8, '+': 14, '−': 14, '²': 8, '³': 8 };
  const anchoDe = (txt, letra) => [...txt].reduce((s, ch) => s + (ANCHOS[ch] || (ch === letra ? 12 : 13)), 0);
  const tipo = t => Math.min(t[1], 2);
  const r = v => Math.round(v * 10) / 10;

  function dibujo(filas, cols, flechas, letra, id) {
    const fichas = [];
    [filas, cols].forEach((f, k) => {
      if (k === 1) fichas.push({ hueco: 6 });
      if (f.length > 1) fichas.push({ txt: '(' });
      f.forEach((t, i) => {
        if (i > 0) fichas.push({ txt: t[0] < 0 ? '−' : '+', op: true });
        fichas.push({ txt: i === 0 ? C.terminoTexto(t, letra) : C.cuerpoTexto(t, letra), termino: `${k}-${i}` });
      });
      if (f.length > 1) fichas.push({ txt: ')' });
    });
    let x = 12;
    fichas.forEach((f, j) => {
      const antes = fichas[j - 1];
      if (antes) x += f.op || antes.op ? 9 : 1;
      f.ancho = f.hueco || anchoDe(f.txt, letra);
      f.c = x + f.ancho / 2;
      x += f.ancho;
    });
    const W = x + 12;
    const centro = clave => fichas.find(f => f.termino === clave).c;
    flechas.forEach(f => {
      f.x1 = centro(`0-${f.i}`) + ((cols.length - 1) / 2 - f.j) * 6;
      f.x2 = centro(`1-${f.j}`);
      f.h = 14 + 0.26 * Math.abs(f.x2 - f.x1);
      f.arriba = f.i === 0;
    });
    const subir = Math.max(0, ...flechas.filter(f => f.arriba).map(f => 0.75 * f.h));
    const bajar = Math.max(0, ...flechas.filter(f => !f.arriba).map(f => 0.75 * f.h));
    const base = 4 + RADIO + subir + 5 + ALTO_LETRA;
    const H = base + BAJO_LETRA + 4 + (bajar ? bajar + RADIO : 0) + 4;

    const puntas = [0, 1, 2].map(t => `<marker id="${id}-t${t}" class="tc-punta t${t}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z"/></marker>`).join('');
    const arcos = flechas.map((f, k) => {
      const y0 = f.arriba ? base - ALTO_LETRA - 5 : base + BAJO_LETRA + 4;
      const s = f.arriba ? -1 : 1, d = 0.12 * (f.x2 - f.x1);
      const cy = y0 + s * f.h, ay = y0 + s * 0.75 * f.h, ax = (f.x1 + f.x2) / 2;
      return `
        <g class="tc-flecha t${tipo(f.p)}" data-k="${k + 1}">
          <path d="M${r(f.x1)} ${r(y0)}C${r(f.x1 + d)} ${r(cy)} ${r(f.x2 - d)} ${r(cy)} ${r(f.x2)} ${r(y0)}" marker-end="url(#${id}-t${tipo(f.p)})"/>
          <circle cx="${r(ax)}" cy="${r(ay)}" r="${RADIO}"/>
          <text x="${r(ax)}" y="${r(ay + 4)}" text-anchor="middle">${k + 1}</text>
        </g>`;
    }).join('');
    const conLetra = txt => txt.split(letra).join(`<tspan class="tc-vr">${letra}</tspan>`);
    const fila = fichas.filter(f => f.txt).map(f => `<text x="${r(f.c)}" y="${r(base)}" text-anchor="middle" class="tc-t${f.termino ? '' : ' tc-op'}"${f.termino ? ` data-termino="${f.termino}"` : ''}>${conLetra(f.txt)}</text>`).join('');
    return `
      <svg class="tc-svg" viewBox="0 0 ${r(W)} ${r(H)}" width="${r(W * 1.45)}" role="img" aria-label="Flechas de todos contra todos para ${MA.esc(C.productoTexto([filas, cols], letra))}">
        <defs>${puntas}</defs>
        ${arcos}
        ${fila}
      </svg>`;
  }

  /* ---------- La figura, paso a paso ----------
     o: { alto, ancho, letra, delante (el número de adelante, 1 si no
     hay), titulo, final (lo que se agrega al último paso) }. */
  const CUANTOS = { 1: ['Un término', 'un término'], 2: ['Dos términos', 'dos términos'], 3: ['Tres términos', 'tres términos'] };
  const cuantos = (k, i) => (CUANTOS[k] || [`${k} términos`, `${k} términos`])[i];

  function crear(contenedor, o) {
    const letra = o.letra || 'x';
    const filas = o.alto.filter(t => t[0] !== 0), cols = o.ancho.filter(t => t[0] !== 0);
    const delante = o.delante == null ? 1 : o.delante;
    const id = 'tc' + (++figuras);
    const flechas = [];
    filas.forEach((a, i) => cols.forEach((b, j) => flechas.push({ i, j, a, b, p: C.multiplicarTerminos(a, b) })));
    const N = flechas.length;
    const pedazos = flechas.map(f => f.p), junto = C.juntar(pedazos);
    // Lo que se junta: los pedazos del mismo tipo que salen más de una vez
    const porTipo = {};
    pedazos.forEach(t => { (porTipo[t[1]] = porTipo[t[1]] || []).push(t); });
    const grupos = Object.keys(porTipo).map(Number).sort((a, b) => b - a).map(e => porTipo[e]).filter(g => g.length > 1);
    const PASOS = { todas: N + 1, juntar: grupos.length ? N + 2 : null };
    PASOS.delante = delante !== 1 ? (PASOS.juntar || PASOS.todas) + 1 : null;
    const ultimo = PASOS.delante || PASOS.juntar || PASOS.todas;
    let paso = 0;

    const th = t => C.terminoHtml(t, letra);
    // Un factor negativo que no va primero, entre paréntesis: x · (−3)
    const multHtml = f => `${th(f.a)} ${por} ${f.b[0] < 0 ? C.par(th(f.b)) : th(f.b)}`;
    function signo(f) {
      const negativos = [f.a, f.b].filter(t => t[0] < 0).length;
      if (negativos === 2) return 'signos iguales dan +';
      if (negativos === 1) return 'signos distintos dan −';
      return f.a[1] > 0 && f.b[1] > 0 ? `las ${letra} se cuentan` : '';
    }
    const resuelta = f => `${mt(multHtml(f), igual, th(f.p))}${signo(f) ? `: ${signo(f)}` : ''}.`;
    const pregunta = (f, k) => `Flecha ${k}: ¿cuánto da ${mt(multHtml(f))}?`;
    function juntarTexto() {
      const partes = grupos.map(g => {
        const s = g.reduce((acc, t) => acc + t[0], 0);
        const cuenta = mt(C.polinomioHtml(g, letra), igual, s === 0 ? n(0) : th([s, g[0][1]]));
        const conPlata = g.length === 2 && g.some(t => t[0] < 0) ? ` Con plata, ${MA.Areas.plata(g[0][0], g[1][0])}.` : '';
        return `${cuenta}.${conPlata}`;
      });
      return `Se junta lo del mismo tipo: ${partes.join(' ')} Queda ${mt(C.polinomioHtml(junto, letra))}.`;
    }
    const final = junto.map(t => [t[0] * delante, t[1]]);
    const delanteHtml = () => mt(pega(n(delante), C.par(C.polinomioHtml(junto, letra))), igual, C.polinomioHtml(final, letra));

    function textoDe(p) {
      let t;
      if (p === 0) t = `${cuantos(filas.length, 0)} por ${cuantos(cols.length, 1)}: salen ${N} flechas, una por cada pedazo.`;
      else if (p <= N) t = `${p > 1 ? resuelta(flechas[p - 2]) + ' ' : ''}${pregunta(flechas[p - 1], p)}${p === 1 ? ' Decirlo de cabeza antes de seguir.' : ''}`;
      else if (p === PASOS.todas) t = `${resuelta(flechas[N - 1])}${PASOS.juntar ? ' Falta juntar lo del mismo tipo.' : ''}`;
      else if (p === PASOS.juntar) t = juntarTexto();
      else t = `Falta el ${MA.fmt(delante)} de adelante: ${delanteHtml()}.`;
      return p === ultimo && o.final ? `${t} ${o.final}` : t;
    }

    contenedor.classList.add('tc-figura');
    contenedor.innerHTML = `
      ${o.titulo ? `<p class="tc-titulo">${o.titulo}</p>` : ''}
      <div class="tc-lienzo">${dibujo(filas, cols, flechas, letra, id)}</div>
      <ol class="tc-productos">${flechas.map((f, k) => `<li class="tc-prod t${tipo(f.p)}" data-k="${k + 1}"><span class="tc-n">${k + 1}</span><span class="mt">${multHtml(f)} ${igual} <span class="tc-res">${th(f.p)}</span><span class="tc-falta">?</span></span></li>`).join('')}</ol>
      <div class="tc-papel" hidden></div>
      <p class="tc-texto" aria-live="polite"></p>
      <div class="fila-botones tc-botones">
        <button type="button" class="btn btn-secundario btn-chico" data-paso="-1">${icono('flechaI')}Anterior</button>
        <button type="button" class="btn btn-chico" data-paso="1"></button>
      </div>`;

    function pintar() {
      const actual = paso >= 1 && paso <= N ? flechas[paso - 1] : null;
      $$('.tc-flecha', contenedor).forEach(g => {
        const k = Number(g.dataset.k);
        g.classList.toggle('visible', k <= paso);
        g.classList.toggle('actual', k === paso);
      });
      $$('.tc-t[data-termino]', contenedor).forEach(t => {
        const activo = actual && (t.dataset.termino === `0-${actual.i}` || t.dataset.termino === `1-${actual.j}`);
        t.setAttribute('class', `tc-t${activo ? ` activo t${tipo(actual.p)}` : ''}`);
      });
      $$('.tc-prod', contenedor).forEach(li => {
        const k = Number(li.dataset.k);
        li.classList.toggle('visible', k <= paso);
        li.classList.toggle('actual', k === paso && paso <= N);
        li.classList.toggle('resuelta', k < paso);
      });
      // Lo que queda en el papel, renglón por renglón
      const papel = $('.tc-papel', contenedor);
      papel.hidden = paso < PASOS.todas;
      if (!papel.hidden) {
        const renglones = [mt(C.productoHtml([filas, cols], letra), igual, C.polinomioHtml(pedazos, letra))];
        if (PASOS.juntar && paso >= PASOS.juntar) renglones.push(mt(igual, C.polinomioHtml(junto, letra)));
        if (PASOS.delante && paso >= PASOS.delante) renglones.push(delanteHtml());
        papel.innerHTML = renglones.join('');
      }
      $('.tc-texto', contenedor).innerHTML = textoDe(paso);
      $('[data-paso="-1"]', contenedor).disabled = paso === 0;
      $('[data-paso="1"]', contenedor).innerHTML = paso === ultimo ? `${icono('reiniciar')}Ver de nuevo` : paso < N ? `Siguiente flecha${icono('flechaD')}` : `Siguiente paso${icono('flechaD')}`;
    }
    contenedor.addEventListener('click', e => {
      const b = e.target.closest('[data-paso]');
      if (!b) return;
      const d = Number(b.dataset.paso);
      paso = d > 0 && paso === ultimo ? 0 : MA.clamp(paso + d, 0, ultimo);
      pintar();
    });
    pintar();
  }

  MA.Flechas = { crear };
})();
