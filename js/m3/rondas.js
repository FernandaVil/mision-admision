/* =====================================================================
   Módulo 3 · rondas de práctica
   ---------------------------------------------------------------------
   Seis habilidades: armar (todos contra todos), factor común,
   diferencia de cuadrados, las raíces con la llave maestra, «¿Qué llave
   abre?» (solo elegir la llave, con el chequeo en orden) y candados
   mezclados (factorizar sin saber qué llave viene).
   Cada opción equivocada de una factorización se explica armándola de
   vuelta, como en el módulo: si da otra cosa, se dice qué da; si da lo
   mismo, está incompleta. Elegir la llave maestra cuando hay un camino
   más corto no es un error (también abre). Nada de MCM ni MCD: el
   factor común se saca de a poco. El motor está en js/rondas.js.
   Los ids de las habilidades no se cambian (m3.rondas.<id>).
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const C = MA.M3;
  const { pot } = MA.M2;
  const { vr, n, op, fr, mt, pega, raiz } = MA.f;
  const igual = op('='), por = op('·'), mas = op('+'), menos = op('−');
  const f = MA.fmt;
  const P = (ts, l) => C.polinomioHtml(ts, l), PT = (ts, l) => C.polinomioTexto(ts, l);
  const Pr = (fs, l) => C.productoHtml(fs, l), PrT = (fs, l) => C.productoTexto(fs, l);
  const T = (t, l) => C.terminoTexto(t, l);
  const tn = x => (x < 0 ? `(${f(x)})` : f(x));   // un número negativo, entre paréntesis
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const noCero = (R, a, b) => { let x; do { x = R.ent(a, b); } while (x === 0); return x; };
  const NO = 'No se factoriza';
  const PISTA_LLAVE = 'Probar en orden: ¿hay algo en todos los términos? ¿Son dos cuadrados con una resta? Si no, la llave maestra.';

  /* ---------- Opciones ---------- */
  // Polinomios (para armar): [{ ts, msg }], la primera es la correcta
  function opcionesPoli(cands) {
    const lista = [];
    cands.forEach(c => { const t = PT(c.ts); if (lista.length < 4 && !lista.some(x => x.t === t)) lista.push(Object.assign({ t }, c)); });
    const porQue = {};
    lista.forEach((c, i) => { if (i) porQue[i] = c.msg; });
    return { tipo: 'opciones', opciones: lista.map(c => mt(P(c.ts))), opcionesPlano: lista.map(c => c.t), correcta: 0, porQue };
  }
  // Factorizaciones: [{ fs } o { texto }], la primera es la correcta. Lo que no trae
  // mensaje se explica armándolo de vuelta; si da lo mismo, está incompleto.
  function opcionesFactor(objetivo, cands, l = 'x') {
    const meta = PT(C.juntar(objetivo), l);
    const lista = [];
    cands.forEach(c => { const t = c.texto || PrT(c.fs, l); if (lista.length < 4 && !lista.some(x => x.t === t)) lista.push(Object.assign({ t }, c)); });
    const porQue = {};
    lista.forEach((c, i) => {
      if (!i) return;
      if (c.msg) { porQue[i] = c.msg; return; }
      const vuelta = PT(C.multiplicar(...c.fs), l);
      porQue[i] = vuelta === meta ? 'Está bien, pero incompleto: lo de adentro todavía tiene algo en común.' : `Armando de vuelta da ${vuelta}.${c.extra ? ' ' + c.extra : ''}`;
    });
    return { tipo: 'opciones', opciones: lista.map(c => c.texto || mt(Pr(c.fs, l))), opcionesPlano: lista.map(c => c.t), correcta: 0, porQue };
  }
  const conDistractores = (R, cands) => [cands[0], ...R.barajar(cands.slice(1))];

  /* ---------- Armar: todos contra todos ---------- */
  function unoPorParentesis(R) {
    const k = R.ent(2, 6), a = R.ent(1, 5), b = noCero(R, -9, 9);
    return [[[k, 0]], [[a, 1], [b, 0]], [
      { ts: [[k * a, 1], [b, 0]], msg: `El ${k} multiplica a todos los de adentro, también al ${f(b)}: ${k} · ${tn(b)} = ${f(k * b)}.` },
      { ts: [[a, 1], [k * b, 0]], msg: `El ${k} también multiplica a la x: ${k} · ${T([a, 1])} = ${T([k * a, 1])}.` },
      { ts: [[k * a, 1], [-k * b, 0]], msg: `${k} · ${tn(b)} = ${f(k * b)}: ${b < 0 ? 'signos distintos dan −' : 'signos iguales dan +'}.` }
    ]];
  }
  function xPorParentesis(R) {
    const k = R.ent(2, 5), a = R.ent(1, 4), b = noCero(R, -9, 9);
    return [[[k, 1]], [[a, 1], [b, 0]], [
      { ts: [[k * a, 2], [k * b, 0]], msg: `Falta la x en el segundo pedazo: ${k}x · ${tn(b)} = ${T([k * b, 1])}.` },
      { ts: [[k * a, 1], [k * b, 1]], msg: `x · x = x²: el primer pedazo es ${T([k * a, 2])}.` },
      { ts: [[k * a, 2], [b, 1]], msg: `El ${k} también multiplica al ${f(b)}: ${k}x · ${tn(b)} = ${T([k * b, 1])}.` }
    ]];
  }
  function dosParentesis(R, conNegativo) {
    let p, q;
    do {
      p = conNegativo ? noCero(R, -9, 9) : R.ent(1, 9);
      q = conNegativo ? noCero(R, -9, 9) : R.ent(1, 9);
    } while (p + q === 0 || (conNegativo && p > 0 && q > 0));
    const b = p + q, c = p * q, medio = `${T([q, 1])} y ${T([p, 1])}`;
    return [[[1, 1], [p, 0]], [[1, 1], [q, 0]], [
      { ts: [[1, 2], [c, 0]], msg: `Faltan los dos pedazos del medio: ${medio}. El rectángulo tiene 4 pedazos, no 2.` },
      { ts: [[1, 2], [b, 1], [-c, 0]], msg: `El último pedazo es ${tn(p)} · ${tn(q)} = ${f(c)}.` },
      { ts: [[1, 2], [-b, 1], [c, 0]], msg: `Los del medio son ${medio}: juntos dan ${T([b, 1])}.` },
      { ts: [[1, 2], [c, 1], [b, 0]], msg: `Los del medio se juntan sumando (${tn(p)} + ${tn(q)}) y el último sale de multiplicar (${tn(p)} · ${tn(q)}).` }
    ]];
  }
  function masPorMenos(R) {
    const p = R.ent(2, 9);
    return [[[1, 1], [p, 0]], [[1, 1], [-p, 0]], [
      { ts: [[1, 2], [p * p, 0]], msg: `El último pedazo es ${p} · (−${p}) = −${p * p}: signos distintos dan −.` },
      { ts: [[1, 2], [-2 * p, 1], [-p * p, 0]], msg: `Los del medio son −${p}x y ${p}x: se anulan, como deber ${p} y pagar ${p}.` },
      { ts: [[1, 2], [-2 * p, 0]], msg: `El último pedazo es ${p} · (−${p}) = −${p * p}.` }
    ]];
  }
  function conA(R) {
    const a = R.ent(2, 3);
    let p, q;
    do { p = noCero(R, -6, 6); q = noCero(R, -6, 6); } while (a * q + p === 0 || p === q || mcd(a, p) > 1);
    const b = a * q + p, c = p * q;
    return [[[a, 1], [p, 0]], [[1, 1], [q, 0]], [
      { ts: [[a, 2], [p + q, 1], [c, 0]], msg: `El ${a}x también multiplica al ${f(q)}: da ${T([a * q, 1])}. Con el ${T([p, 1])}, el del medio es ${T([b, 1])}.` },
      { ts: [[a, 2], [c, 0]], msg: 'Faltan los dos pedazos del medio: el rectángulo tiene 4 pedazos, no 2.' },
      { ts: [[a, 2], [b, 1], [-c, 0]], msg: `El último pedazo es ${tn(p)} · ${tn(q)} = ${f(c)}.` },
      { ts: [[a, 2], [a * p + q, 1], [c, 0]], msg: `Ojo con quién multiplica a quién: ${a}x · ${tn(q)} y ${tn(p)} · x.` }
    ]];
  }
  const armar = {
    id: 'armar', nombre: 'Armar: todos contra todos', icono: 'cuadricula', porRonda: 6,
    detalle: 'La distributiva: un número por un paréntesis y dos paréntesis.',
    generar(R, k) {
      const [alto, ancho, cands] = [unoPorParentesis, xPorParentesis, R => dosParentesis(R, false), R => dosParentesis(R, true), masPorMenos, conA][k](R);
      const res = C.multiplicar(alto, ancho);
      return Object.assign(opcionesPoli([{ ts: res }, ...R.barajar(cands)]), {
        enunciado: `Multiplicar: ${mt(Pr([alto, ancho]))}.`,
        plano: `Multiplicar: ${PrT([alto, ancho])}.`,
        pista: 'Todos contra todos: una flecha de cada término de un lado a cada término del otro. Después se junta lo del mismo tipo.',
        solucion: [
          mt(Pr([alto, ancho]), igual, P(C.pedazos(alto, ancho))),
          alto.length > 1 ? `Se junta lo del mismo tipo: ${mt(P(res))}.` : `Queda ${mt(P(res))}.`
        ],
        herramienta: { boton: 'Probarlo en la mesa de áreas', icono: 'cuadricula', mesa: 'areas', problema: { modo: 'armar', alto, ancho } }
      });
    }
  };

  /* ---------- Factor común: sacar de a poco ---------- */
  const FRASE = { 2: 'son pares', 3: 'están en la tabla del 3', 5: 'terminan en 0 o en 5' };
  const OTRA = { 2: 'Siguen siendo pares: sale otro 2.', 3: 'Siguen en la tabla del 3: sale otro 3.', 5: 'Siguen terminando en 0 o en 5: sale otro 5.' };
  function primos(g) { const ps = []; [2, 3, 5].forEach(p => { while (g % p === 0) { ps.push(p); g /= p; } }); return ps; }
  // Los pasos de «sacar de a poco», uno por cada número que sale y uno por la letra
  function deAPoco(g, conLetra, cuantos, l) {
    const quien = cuantos === 2 ? 'Los dos' : 'Todos';
    const vistos = new Set();
    const pasos = primos(g).map(p => { const t = vistos.has(p) ? OTRA[p] : `${quien} ${FRASE[p]}: sale un ${p}.`; vistos.add(p); return t; });
    if (conLetra) pasos.push(`${quien} tienen ${l}: sale una ${l}.`);
    return pasos;
  }
  // En pocas palabras, qué hay en todos: «los dos son pares y tienen x»
  function razon(g, conLetra, cuantos, l) {
    const partes = g > 1 ? [FRASE[primos(g)[0]]] : [];
    if (conLetra) partes.push(`tienen ${l}`);
    return `${cuantos === 2 ? 'los dos' : 'todos'} ${partes.join(' y ')}`;
  }
  function genFactor(R, k) {
    const tipo = ['num', 'compuesto', 'letra', 'letraCompuesto', 'tres', 'fisica'][k];
    let l = 'x', g, conLetra = true, inner;
    const coprimos = (ra, rb) => { let a, b; do { a = R.ent(...ra); b = rb === 'noCero' ? noCero(R, -9, 9) : R.ent(...rb); } while (mcd(a, b) > 1); return [a, b]; };
    if (tipo === 'num' || tipo === 'compuesto') {
      conLetra = false;
      g = R.elegir(tipo === 'num' ? [2, 3, 5] : [4, 6, 10, 12]);
      const [a, b] = coprimos([1, 7], 'noCero');
      inner = [[a, 1], [b, 0]];
    } else if (tipo === 'letra' || tipo === 'letraCompuesto') {
      g = R.elegir(tipo === 'letra' ? [1, 2, 3, 5] : [4, 6]);
      const [a, b] = coprimos([1, 5], 'noCero');
      inner = [[a, 1], [b, 0]];
    } else if (tipo === 'tres') {
      conLetra = false;
      g = R.elegir([2, 3, 5]);
      inner = [[1, 2], [noCero(R, -6, 6), 1], [noCero(R, -9, 9), 0]];
    } else {   // la piedra lanzada hacia arriba: 20t − 5t² = 5t(4 − t)
      l = 't';
      g = R.elegir([5, 5, 2, 4]);
      const [a, b] = coprimos([2, 8], [1, 3]);
      inner = [[a, 0], [-b, 1]];
    }
    const comun = [[g, conLetra ? 1 : 0]];
    const fs = [comun, inner];
    const poly = C.pedazos(comun, inner);   // conserva el orden: 20t − 5t²
    const ultimo = inner.length - 1;
    const cambiaUltimo = fn => inner.map((t, i) => (i === ultimo ? fn(t) : t));
    const cands = [{ fs }];
    if (primos(g).length > 1) {
      const p = primos(g)[0];
      cands.push({ fs: [[[p, comun[0][1]]], inner.map(([c, e]) => [c * g / p, e])], msg: 'Está bien, pero incompleto: los números de adentro todavía tienen algo en común.' });
    }
    if (conLetra) {
      if (g > 1) {
        cands.push({ fs: [[[g, 0]], inner.map(([c, e]) => [c, e + 1])], msg: `Está bien, pero incompleto: todavía queda una ${l} en todos.` });
        cands.push({ fs: [[[1, 1]], inner.map(([c, e]) => [c * g, e])], msg: 'Está bien, pero incompleto: los números de adentro todavía tienen algo en común.' });
      } else cands.push({ texto: NO, msg: `Sí se puede: ${razon(g, true, 2, l)}.` });
      cands.push({ fs: [comun, inner.map(([c, e]) => [c, e + 1])], extra: `Al sacar una ${l}, a cada término le queda una menos.` });
    } else if (inner.length === 2) {
      cands.push({ fs: [[[g, 1]], inner.map(([c]) => [c, 0])], msg: `El ${f(g * inner[ultimo][0])} no tiene x: la x no está en todos.` });
    } else {
      cands.push({ fs: [comun, inner.map(([c, e], i) => (i === 1 ? [c * g, e] : [c, e]))], extra: `Al ${T(poly[1], l)} también se le saca el ${g}.` });
    }
    if (g > 1) cands.push({ fs: [comun, cambiaUltimo(([c, e]) => [c * g, e])], extra: `Al ${T(poly[ultimo], l)} también se le saca el ${T(comun[0], l)}.` });
    cands.push({ fs: [comun, cambiaUltimo(([c, e]) => [-c, e])], extra: 'El signo de cada término se queda adentro tal como estaba.' });
    const fisica = tipo === 'fisica';
    return Object.assign(opcionesFactor(poly, conDistractores(R, cands), l), {
      enunciado: fisica
        ? `La altura de una piedra lanzada hacia arriba es ${mt(vr('h'), igual, P(poly, l))}. Factorizar por completo ${mt(P(poly, l))}.`
        : `Factorizar por completo: ${mt(P(poly, l))}.`,
      plano: fisica
        ? `La altura de una piedra lanzada hacia arriba es h = ${PT(poly, l)}. Factorizar por completo ${PT(poly, l)}.`
        : `Factorizar por completo: ${PT(poly, l)}.`,
      pista: `Sacar de a poco: ¿son pares? ¿Terminan en 0 o en 5? ¿Están en la tabla del 3? ¿Todos tienen ${l}?`,
      solucion: [
        ...deAPoco(g, conLetra, poly.length, l),
        `Queda ${mt(P(poly, l), igual, Pr(fs, l))}.`,
        `Comprobación, armando de vuelta: ${mt(Pr(fs, l), igual, P(poly, l))}.`
      ],
      herramienta: { boton: 'Probarlo en la mesa de áreas', icono: 'cuadricula', mesa: 'areas', problema: Object.assign({ modo: 'desarmar', terminos: poly }, l === 't' ? { letra: 't' } : {}) }
    });
  }
  const factor = {
    id: 'factor', nombre: 'Factor común', icono: 'mano', porRonda: 6,
    detalle: 'Sacar de a poco lo que está en todos los términos.',
    generar: genFactor
  };

  /* ---------- Diferencia de cuadrados ---------- */
  function genCuadrado(R, tipo) {
    if (tipo === 'comun') return cuadradoComun(R);
    let a = 1, k;
    if (tipo === 'coef') { do { a = R.ent(2, 5); k = R.ent(1, 9); } while (mcd(a, k) > 1); }
    else k = R.ent(2, tipo === 'suma' ? 9 : 12);
    const A = a * a, K = k * k, resta = tipo !== 'suma';
    const poly = [[A, 2], [resta ? -K : K, 0]];
    const ax = T([a, 1]), mas_ = [[a, 1], [k, 0]], menos_ = [[a, 1], [-k, 0]];
    let cands;
    if (resta) {
      cands = [
        { fs: [mas_, menos_] },
        { fs: [menos_, menos_], extra: 'Los del medio no se anulan: hace falta un + y un −.' },
        { fs: [mas_, mas_], extra: 'Los del medio no se anulan: hace falta un + y un −.' },
        { texto: NO, msg: 'Sí se puede: con una resta, dos cuadrados se desarman.' }
      ];
      if (a > 1) cands.push({ fs: [[[A, 1], [k, 0]], [[A, 1], [-k, 0]]], msg: `La raíz de ${T([A, 2])} es ${ax}, porque ${ax} · ${ax} = ${T([A, 2])}.` });
      if (k > 2) {
        const mitad = K % 2 === 0 ? K / 2 : K;
        cands.push({ fs: [[[a, 1], [mitad, 0]], [[a, 1], [-mitad, 0]]], msg: `La raíz de ${K} ${mitad !== K ? 'no es la mitad: ' : ''}es ${k}, porque ${k} · ${k} = ${K}.` });
      }
    } else {
      cands = [
        { texto: NO },
        { fs: [mas_, menos_], msg: `Armando de vuelta da ${PT([[A, 2], [-K, 0]])}: hace falta una resta, y aquí hay una suma.` },
        { fs: [mas_, mas_], extra: 'Sobran los del medio.' },
        { fs: [menos_, menos_], extra: 'Sobran los del medio.' }
      ];
    }
    return Object.assign(opcionesFactor(poly, conDistractores(R, cands)), {
      enunciado: `Factorizar: ${mt(P(poly))}.`, plano: `Factorizar: ${PT(poly)}.`,
      pista: 'Para la diferencia de cuadrados hacen falta tres cosas: dos términos, una resta y que los dos sean cuadrados.',
      solucion: resta ? [
        `${mt(P([[A, 2]]), igual, P([[a, 1]]), por, P([[a, 1]]))} y ${mt(n(K), igual, n(k), por, n(k))}.`,
        `${mt(P(poly), igual, Pr([mas_, menos_]))}.`,
        `Comprobación: ${mt(Pr([mas_, menos_]), igual, P(C.pedazos(mas_, menos_)), igual, P(poly))}: los del medio se anulan.`
      ] : [
        'Hay una suma, no una resta: la diferencia de cuadrados no entra.',
        `Con la llave maestra: a = ${A}, b = 0 y c = ${K}. Adentro de la raíz da ${mt(n(0), menos, n(4), por, n(A), por, n(K), igual, n(-4 * A * K))}, que es negativo. No se factoriza.`
      ],
      herramienta: { boton: 'Probarlo en la mesa de cuadrados', icono: 'cuadrados', mesa: 'cuadrados', problema: { a: [A, 2], b: [K, 0], signo: resta ? '−' : '+' } }
    });
  }
  // Un candado de dos llaves: primero el factor común y después la diferencia de cuadrados
  function cuadradoComun(R) {
    const g = R.elegir([2, 3, 5]), k = R.ent(2, 6), K = k * k;
    const poly = [[g, 2], [-g * K, 0]], dentro = [[1, 2], [-K, 0]];
    const mas_ = [[1, 1], [k, 0]], menos_ = [[1, 1], [-k, 0]], fs = [[[g, 0]], mas_, menos_];
    return Object.assign(opcionesFactor(poly, [
      { fs },
      { fs: [[[g, 0]], dentro], msg: `Está bien, pero incompleto: ${PT(dentro)} todavía se desarma.` },
      { fs: [mas_, menos_], msg: `Falta el ${g}: armando de vuelta da ${PT(dentro)}.` },
      { fs: [[[g, 0]], [[1, 1], [K, 0]], [[1, 1], [-K, 0]]], msg: `La raíz de ${K} es ${k}, porque ${k} · ${k} = ${K}.` }
    ]), {
      enunciado: `Factorizar por completo: ${mt(P(poly))}.`, plano: `Factorizar por completo: ${PT(poly)}.`,
      pista: '¿Hay algo en todos los términos? Si una llave abre solo una parte, se mira otra vez lo que quedó.',
      solucion: [
        `Factor común: ${mt(P(poly), igual, Pr([[[g, 0]], dentro]))}.`,
        `Diferencia de cuadrados: ${mt(P(dentro), igual, Pr([mas_, menos_]))}.`,
        `Queda ${mt(Pr(fs))}.`
      ],
      herramienta: { boton: 'Comprobarlo con la llave maestra', icono: 'llave', mesa: 'llave', problema: { a: g, b: 0, c: -g * K } }
    });
  }
  const cuadrados = {
    id: 'cuadrados', nombre: 'Diferencia de cuadrados', icono: 'cuadrados', porRonda: 6,
    detalle: 'Dos cuadrados con una resta, y de vez en cuando una trampa con suma.',
    generarRonda(R) {
      const tipos = ['simple', 'simple', 'coef', 'coef', 'comun', 'simple'];
      if (R.azar() < 0.75) tipos[R.ent(1, 5)] = 'suma';
      const lista = [];
      tipos.forEach(t => lista.push(R.distinto(lista, () => genCuadrado(R, t))));
      return lista;
    }
  };

  /* ---------- Llave maestra: las raíces ---------- */
  // Raíces enteras y distintas, sin cero, que no sean opuestas (eso sería una diferencia de cuadrados)
  function dosRaices(R) {
    let r1, r2;
    do { r1 = noCero(R, -9, 9); r2 = noCero(R, -9, 9); } while (r1 === r2 || r1 === -r2);
    return [r1, r2];
  }
  // El trinomio: a = 1 con raíces enteras (o una doble), o a = 2 con una raíz entera y otra en medios
  function trinomio(R, tipo) {
    if (tipo === 'a2') {
      const r = noCero(R, -5, 5), s = R.elegir([-7, -5, -3, -1, 1, 3, 5, 7]);
      return { a: 2, b: -(s + 2 * r), c: r * s, raices: [r, s / 2], fs: [[[2, 1], [-s, 0]], [[1, 1], [-r, 0]]] };
    }
    let r1, r2;
    if (tipo === 'doble') { r1 = r2 = noCero(R, -7, 7); } else [r1, r2] = dosRaices(R);
    return { a: 1, b: -(r1 + r2), c: r1 * r2, raices: [r1, r2], fs: [[[1, 1], [-r1, 0]], [[1, 1], [-r2, 0]]] };
  }
  const numHtml = x => (Number.isInteger(x) ? n(x) : fr(n(x * 2), n(2)));
  const numTexto = x => (Number.isInteger(x) ? f(x) : `${f(x * 2)}/2`);
  // El paréntesis que da una raíz: la raíz 3 da (x − 3) y la raíz −5 da (x + 5)
  const parRaiz = r => C.par(`${vr('x')} ${r > 0 ? menos : mas} ${numHtml(Math.abs(r))}`);
  // Adentro de la raíz, con paréntesis: (b)² − 4 · (a) · (c)
  const adentroHtml = ({ a, b, c }) => mt(pot(C.par(n(b)), 2), menos, n(4), por, C.par(n(a)), por, C.par(n(c)), igual, n(b * b), 4 * a * c > 0 ? menos : mas, n(Math.abs(4 * a * c)), igual, n(b * b - 4 * a * c));

  const llave = {
    id: 'llave', nombre: 'Llave maestra: las raíces', icono: 'llave', porRonda: 6,
    detalle: 'Reemplazar con paréntesis y no perder ningún signo.',
    generar(R, k) {
      const t = trinomio(R, k === 4 ? 'doble' : k === 5 ? 'a2' : 'uno');
      const { a, b, c } = t, D = b * b - 4 * a * c, s = Math.round(Math.sqrt(D));
      const mayor = (-b + s) / (2 * a), menor = (-b - s) / (2 * a);
      const pide = k === 3 ? 'menor' : 'mayor', sg = pide === 'mayor' ? 1 : -1, resp = pide === 'mayor' ? mayor : menor;
      const poly = [[a, 2], [b, 1], [c, 0]];
      return {
        enunciado: `Resolver ${mt(P(poly), igual, n(0))} con la llave maestra. Escribir la raíz ${pide}.`,
        plano: `Resolver ${PT(poly)} = 0 con la llave maestra. Escribir la raíz ${pide}.`,
        respuesta: resp,
        errores: [
          { valor: (b + sg * s) / (2 * a), msg: b < 0 ? `Ese resultado sale de usar −b = ${f(b)}. Pero b = ${f(b)}, y −(${f(b)}) = ${f(-b)}: signos pegados.` : `Ese resultado sale de olvidar el menos de −b: con b = ${f(b)}, −b = ${f(-b)}.` },
          { valor: -b + sg * s, msg: `Falta dividir entre 2 · a = ${2 * a}.` },
          { valor: pide === 'mayor' ? menor : mayor, msg: `Esa es la otra raíz, la ${pide === 'mayor' ? 'menor' : 'mayor'}. Se pide la ${pide}.` },
          { valor: -b + sg * s / (2 * a), msg: 'La raya de la fracción divide a todo lo de arriba: al −b y a la raíz.' },
          { valor: (-b + sg * D) / (2 * a), msg: `Falta sacar la raíz: √${D} = ${s}.` },
          ...(a > 1 ? [{ valor: (-b + sg * s) / 2, msg: `Abajo va 2 · a = 2 · ${a} = ${2 * a}.` }] : [])
        ],
        pista: `Con a = ${a}, b = ${f(b)} y c = ${f(c)}, cada uno con su signo y entre paréntesis: ${mt(C.llaveHtml({ a, b, c }))}`,
        solucion: [
          mt(C.llaveHtml({ a, b, c })),
          `Adentro de la raíz: ${adentroHtml(t)}.`,
          D === 0
            ? `Adentro da 0: ${mt(vr('x'), igual, fr(n(-b), n(2 * a)), igual, numHtml(mayor))}. Las dos raíces son iguales.`
            : `${mt(raiz(n(D)), igual, n(s))}. Con el +: ${mt(fr(`${n(-b)} ${mas} ${n(s)}`, n(2 * a)), igual, numHtml(mayor))}. Con el −: ${mt(fr(`${n(-b)} ${menos} ${n(s)}`, n(2 * a)), igual, numHtml(menor))}.`,
          `La raíz ${pide} es ${numTexto(resp)}. Factorizado: ${mt(P(poly), igual, Pr(t.fs))}.`
        ],
        herramienta: { boton: 'Probarlo en la llave maestra', icono: 'llave', mesa: 'llave', problema: { a, b, c } }
      };
    }
  };

  /* ---------- ¿Qué llave abre? ---------- */
  function genCandado(R, tipo) {
    const nada = '¿Hay algo en todos? No.';
    let poly, correcta, porQue, tambien, solucion;
    if (tipo === 'A1' || tipo === 'A2') {
      const conX = tipo === 'A2';
      const g = R.elegir(conX ? [1, 2, 3, 5] : [2, 3, 5, 6]);
      let a, b;
      do { a = R.ent(1, 5); b = noCero(R, -9, 9); } while (mcd(a, b) > 1);
      const fs = [[[g, conX ? 1 : 0]], [[a, 1], [b, 0]]];
      poly = C.pedazos(...fs);
      const rz = razon(g, conX, 2, 'x');
      correcta = 0;
      tambien = conX ? [2] : [];
      porQue = conX ? {
        1: `${T(poly[1])} no es un cuadrado, así que esa llave no entra. Y hay algo en común: ${rz}.`,
        2: `Con c = 0, la llave maestra sirve. Pero en el chequeo el factor común llega antes: ${rz}.`,
        3: `Sí se puede: ${rz}.`
      } : {
        1: 'Para la diferencia de cuadrados hacen falta dos cuadrados con una resta, y aquí no hay x².',
        2: 'La llave maestra necesita una x², y aquí no hay.',
        3: `Sí se puede: ${rz}.`
      };
      solucion = [`¿Hay algo en todos? Sí: ${rz}.`, `${mt(P(poly), igual, Pr(fs))}.`];
    } else if (tipo === 'B1' || tipo === 'B2') {
      let a = 1, k;
      if (tipo === 'B2') { do { a = R.ent(2, 5); k = R.ent(1, 9); } while (mcd(a, k) > 1); } else k = R.ent(2, 10);
      const fs = [[[a, 1], [k, 0]], [[a, 1], [-k, 0]]], ax = T([a, 1]);
      poly = [[a * a, 2], [-k * k, 0]];
      correcta = 1;
      tambien = [2];
      porQue = {
        0: `Entre ${T(poly[0])} y ${k * k} no hay nada en común: ningún número ni ninguna x está en los dos.`,
        2: 'Con b = 0, la llave maestra sirve. Pero en el chequeo la diferencia de cuadrados llega antes y lo abre en un paso.',
        3: 'Sí se puede: con una resta, dos cuadrados se desarman.'
      };
      solucion = [nada, `¿Dos cuadrados con una resta? Sí: ${T(poly[0])} = ${ax} · ${ax} y ${k * k} = ${k} · ${k}.`, `${mt(P(poly), igual, Pr(fs))}.`];
    } else if (tipo === 'C1' || tipo === 'C2') {
      const t = trinomio(R, tipo === 'C2' ? 'a2' : 'uno');
      poly = [[t.a, 2], [t.b, 1], [t.c, 0]];
      const D = t.b * t.b - 4 * t.a * t.c;
      correcta = 2;
      porQue = {
        0: tipo === 'C1'
          ? `Entre x², ${T([t.b, 1])} y ${f(t.c)} no hay nada en común: la x² lleva un 1 y el ${f(t.c)} no tiene x.`
          : `No hay nada en todos: el ${f(t.b)} no es par, y el ${f(t.c)} no tiene x.`,
        1: 'Son tres términos, no dos cuadrados con una resta.',
        3: `Con la llave se sabe: adentro de la raíz da ${f(D)}, así que sí tiene raíces.`
      };
      solucion = [nada, '¿Dos cuadrados con una resta? No: son tres términos.', `La llave maestra: adentro de la raíz da ${f(D)}. ${mt(P(poly), igual, Pr(t.fs))}.`];
    } else if (tipo === 'D1') {
      const k = R.ent(2, 9);
      poly = [[1, 2], [k * k, 0]];
      correcta = 3;
      porQue = {
        0: `Entre x² y ${k * k} no hay nada en común.`,
        1: 'Con una suma no se puede: la diferencia de cuadrados necesita una resta.',
        2: `La llave no abre: adentro de la raíz da 0 − 4 · 1 · ${k * k} = ${f(-4 * k * k)}, que es negativo.`
      };
      solucion = [nada, 'Hay una suma, no una resta: la diferencia de cuadrados no entra.', `La llave maestra: adentro de la raíz da ${f(-4 * k * k)}, negativo. No se factoriza.`];
    } else {   // D2: tres términos, y adentro de la raíz da negativo
      const b = noCero(R, -6, 6), c = Math.floor(b * b / 4) + R.ent(1, 6), D = b * b - 4 * c;
      poly = [[1, 2], [b, 1], [c, 0]];
      correcta = 3;
      porQue = {
        0: `Entre x², ${T([b, 1])} y ${c} no hay nada en común: la x² lleva un 1 y el ${c} no tiene x.`,
        1: 'Son tres términos, no dos cuadrados con una resta.',
        2: `La llave no abre: adentro de la raíz da ${f(D)}, que es negativo.`
      };
      solucion = [nada, '¿Dos cuadrados con una resta? No: son tres términos.', `La llave maestra: adentro de la raíz da ${adentroHtml({ a: 1, b, c })}, negativo. No se factoriza.`];
    }
    return {
      enunciado: `¿Qué llave logra abrir el candado ${mt(P(poly))}?`,
      plano: `¿Qué llave logra abrir el candado ${PT(poly)}?`,
      tipo: 'opciones', fijas: true, opciones: C.LLAVES.slice(), opcionesPlano: C.LLAVES.slice(),
      correcta, porQue, tambien, tituloTambien: 'También lo abre, pero por el camino largo.',
      pista: PISTA_LLAVE, solucion
    };
  }
  const llaves = {
    id: 'llaves', nombre: '¿Qué llave abre?', icono: 'objetivo', porRonda: 10,
    detalle: 'Diez candados rápidos: solo elegir la llave, con el chequeo en orden.',
    generarRonda(R) {
      const tipos = R.barajar(['A1', 'A2', 'B1', 'B2', 'C1', 'C1', 'C2', 'D1', 'D2', R.elegir(['A2', 'B1', 'C1'])]);
      const lista = [];
      tipos.forEach(t => lista.push(R.distinto(lista, () => genCandado(R, t))));
      return lista;
    }
  };

  /* ---------- Candados mezclados ---------- */
  // Un trinomio para factorizar con opciones; las equivocadas se explican armándolas de vuelta
  function genTrinomio(R, tipo) {
    const t = trinomio(R, tipo), { a, b, c } = t;
    const poly = [[a, 2], [b, 1], [c, 0]], D = b * b - 4 * a * c;
    const [f1, f2] = t.fs;
    const cambia = fa => fa.map(([k, e]) => [e === 0 ? -k : k, e]);   // el signo del número del paréntesis
    const cands = [{ fs: t.fs }, { fs: [cambia(f1), cambia(f2)] }, { fs: [cambia(f1), f2] }, { fs: [f1, cambia(f2)] }];
    cands.push(a === 1 ? { fs: [[[1, 1], [-c, 0]], [[1, 1], [1, 0]]] } : { fs: [[[1, 1], [f1[1][0], 0]], [[2, 1], [f2[1][0], 0]]] });
    const [r1, r2] = t.raices;
    const armado = a === 1
      ? `La raíz ${numTexto(r1)} da ${mt(parRaiz(r1))} y la raíz ${numTexto(r2)} da ${mt(parRaiz(r2))}: ${mt(P(poly), igual, Pr(t.fs))}.`
      : `Con la a adelante: ${mt(pega(n(a), parRaiz(r2), parRaiz(r1)))}. El ${a} entra al paréntesis de la fracción: ${mt(P(poly), igual, Pr(t.fs))}.`;
    return Object.assign(opcionesFactor(poly, conDistractores(R, cands)), {
      enunciado: `Factorizar: ${mt(P(poly))}.`, plano: `Factorizar: ${PT(poly)}.`,
      pista: PISTA_LLAVE,
      solucion: [
        '¿Hay algo en todos? No. ¿Dos cuadrados con una resta? No: son tres términos. Va la llave maestra.',
        `${mt(C.llaveHtml({ a, b, c }))}: adentro de la raíz da ${D}, y ${mt(raiz(n(D)), igual, n(Math.round(Math.sqrt(D))))}. Las raíces son ${numTexto(r1)} y ${numTexto(r2)}.`,
        armado
      ],
      herramienta: { boton: 'Probarlo en la llave maestra', icono: 'llave', mesa: 'llave', problema: { a, b, c } }
    });
  }
  const mezcla = {
    id: 'mezcla', nombre: 'Candados mezclados', icono: 'intercambiar', porRonda: 6,
    detalle: 'Factorizar sin saber qué llave viene.',
    generarRonda(R) {
      const fuentes = R.barajar([
        () => genFactor(R, 1), () => genFactor(R, 3),
        () => genCuadrado(R, 'simple'), () => genCuadrado(R, R.elegir(['coef', 'comun'])),
        () => genTrinomio(R, 'uno'), () => genTrinomio(R, 'a2')
      ]);
      const lista = [];
      fuentes.forEach(fn => lista.push(R.distinto(lista, fn)));
      return lista;
    }
  };

  MA.M3.RONDAS = [armar, factor, cuadrados, llave, llaves, mezcla];
})();
