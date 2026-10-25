/* =====================================================================
   MOTOR ALGEBRAICO MÍNIMO (para la balanza de despejes)
   ---------------------------------------------------------------------
   Un "lado" de la ecuación es una suma de monomios multiplicada por un
   factor común:   lado = { t: [monomios], f: {var: exponente} }
   Un monomio es   { c: coeficiente, e: {var: exponente} }   (v·t -> {v:1,t:1})
   El factor f solo se usa cuando hay varios términos, así se conserva la
   forma de libro  (vf − v0) / a  en vez de repartirla.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;

  /* ---------- Exponentes ---------- */
  const limpiar = e => { const r = {}; Object.keys(e).forEach(k => { if (e[k]) r[k] = e[k]; }); return r; };
  const multExp = (a, b, k = 1) => {
    const r = Object.assign({}, a);
    Object.keys(b).forEach(v => { r[v] = (r[v] || 0) + k * b[v]; });
    return limpiar(r);
  };
  const firma = e => Object.keys(e).sort().map(k => k + '^' + e[k]).join('*');
  const vacio = e => Object.keys(e).length === 0;
  const clonar = m => ({ c: m.c, e: Object.assign({}, m.e) });

  function normalizar(lado) {
    const grupos = new Map();
    lado.t.forEach(m => {
      const s = firma(m.e);
      if (grupos.has(s)) grupos.get(s).c += m.c;
      else grupos.set(s, clonar(m));
    });
    let t = Array.from(grupos.values()).filter(m => Math.abs(m.c) > 1e-12);
    let fac = limpiar(lado.f || {});
    if (t.length <= 1) {
      if (t.length === 1 && !vacio(fac)) t = [{ c: t[0].c, e: multExp(t[0].e, fac) }];
      fac = {};
    }
    return { t, f: fac };
  }

  /* Lee un lado escrito como texto: "v*t", "d/t", "v0 + a*t" */
  function leer(texto) {
    const t = [];
    texto.replace(/\s+/g, '').split(/(?=[+-])/).forEach(trozo => {
      if (!trozo) return;
      let c = 1, s = trozo;
      if (s[0] === '+') s = s.slice(1);
      else if (s[0] === '-') { c = -1; s = s.slice(1); }
      const e = {};
      s.split(/(?=[*/])/).forEach(fac => {
        let k = 1, nombre = fac;
        if (fac[0] === '*') nombre = fac.slice(1);
        else if (fac[0] === '/') { k = -1; nombre = fac.slice(1); }
        if (!nombre) return;
        if (/^\d+(\.\d+)?$/.test(nombre)) { c *= k === 1 ? parseFloat(nombre) : 1 / parseFloat(nombre); return; }
        e[nombre] = (e[nombre] || 0) + k;
      });
      t.push({ c, e: limpiar(e) });
    });
    return normalizar({ t, f: {} });
  }

  /* ---------- Operaciones sobre un lado ----------
     op = { tipo: 'mul' | 'div' | 'sum' | 'res', v: 'nombre' }          */
  function multiplicar(lado, v, k) {
    if (lado.t.length <= 1) return normalizar({ t: lado.t.map(m => ({ c: m.c, e: multExp(m.e, { [v]: k }) })), f: {} });
    return normalizar({ t: lado.t.map(clonar), f: multExp(lado.f, { [v]: k }) });
  }
  function sumar(lado, v, s) {
    const t = lado.t.map(m => ({ c: m.c, e: multExp(m.e, lado.f) }));
    t.push({ c: s, e: { [v]: 1 } });
    return normalizar({ t, f: {} });
  }
  function aplicar(lado, op) {
    if (op.tipo === 'mul') return multiplicar(lado, op.v, 1);
    if (op.tipo === 'div') return multiplicar(lado, op.v, -1);
    if (op.tipo === 'sum') return sumar(lado, op.v, 1);
    return sumar(lado, op.v, -1);
  }

  /* ---------- Consultas ---------- */
  function evaluar(lado, valores) {
    const prod = e => Object.keys(e).reduce((p, k) => p * Math.pow(valores[k], e[k]), 1);
    return lado.t.reduce((s, m) => s + m.c * prod(m.e), 0) * prod(lado.f);
  }
  const contiene = (lado, v) => lado.t.some(m => m.e[v]) || !!lado.f[v];
  const esSola = (lado, v) => lado.t.length === 1 && lado.t[0].c === 1 && firma(lado.t[0].e) === v + '^1';
  function despejada(ec, v) {
    if (esSola(ec.izq, v) && !contiene(ec.der, v)) return 'izq';
    if (esSola(ec.der, v) && !contiene(ec.izq, v)) return 'der';
    return null;
  }
  const claveLado = l => l.t.map(m => m.c + ':' + firma(m.e)).sort().join('+') + '|' + firma(l.f);
  const claveEc = ec => { const a = claveLado(ec.izq), b = claveLado(ec.der); return a < b ? a + '=' + b : b + '=' + a; };

  /* Búsqueda en anchura: ¿cuál es la mejor siguiente operación (aplicada
     a ambos lados) para dejar sola la meta? Sirve para dar pistas desde
     cualquier punto, incluso después de un desvío.                       */
  function siguientePaso(ec, meta, ops, profundidad = 4) {
    if (despejada(ec, meta)) return { listo: true };
    const visto = new Set([claveEc(ec)]);
    let frontera = [{ ec, primero: null }];
    for (let d = 0; d < profundidad; d++) {
      const nueva = [];
      for (const nodo of frontera) {
        for (const op of ops) {
          const sig = { izq: aplicar(nodo.ec.izq, op), der: aplicar(nodo.ec.der, op) };
          const k = claveEc(sig);
          if (visto.has(k)) continue;
          visto.add(k);
          const primero = nodo.primero || op;
          if (despejada(sig, meta)) return { op: primero, pasos: d + 1 };
          nueva.push({ ec: sig, primero });
        }
      }
      frontera = nueva;
    }
    return null;
  }

  /* ---------- Unidades de un lado (para las lecturas de la balanza) ---------- */
  function unidadLado(lado, U) {
    if (!lado.t.length) return null;
    const deMono = m => Object.keys(m.e).reduce((u, v) => multExp(u, U[v] || {}, m.e[v]), {});
    const u0 = deMono(lado.t[0]);
    if (lado.t.some(m => firma(deMono(m)) !== firma(u0))) return null;
    return Object.keys(lado.f).reduce((u, v) => multExp(u, U[v] || {}, lado.f[v]), u0);
  }

  /* ---------- Render a HTML ----------
     nombre(v) devuelve el HTML de una variable (o de su valor numérico). */
  const F = () => MA.f;
  const nombreVar = N => v => `<span class="vr">${N[v] || v}</span>`;

  function item(it, nombre) {
    let h = nombre(it.v);
    if (it.exp > 1) h += `<sup>${it.exp}</sup>`;
    return it.marca ? `<span class="cancela">${h}</span>` : h;
  }
  const producto = (lista, nombre) => lista.map(it => item(it, nombre)).join(' ' + F().op('·') + ' ');
  function separar(e) {
    const num = [], den = [];
    Object.keys(e).forEach(v => (e[v] > 0 ? num : den).push({ v, exp: Math.abs(e[v]) }));
    return { num, den };
  }
  function monoHtml(m, nombre) {
    const { num, den } = separar(m.e);
    const coef = Math.abs(m.c);
    const partes = [];
    if (coef !== 1 || !num.length) partes.push(F().n(coef));
    if (num.length) partes.push(producto(num, nombre));
    const arriba = partes.join(' ' + F().op('·') + ' ');
    return den.length ? F().fr(arriba, producto(den, nombre)) : arriba;
  }
  function sumaHtml(t, nombre, marcados = []) {
    return t.map((m, i) => {
      const cuerpo = monoHtml({ c: Math.abs(m.c), e: m.e }, nombre);
      let h;
      if (i === 0) h = (m.c < 0 ? F().op('−') + ' ' : '') + cuerpo;
      else h = F().op(m.c < 0 ? '−' : '+') + ' ' + cuerpo;
      return marcados.includes(i) ? `<span class="cancela">${h}</span>` : h;
    }).join(' ');
  }
  const conParentesis = h => `<span class="par">(</span>${h}<span class="par">)</span>`;

  function ladoHtml(lado, nombre) {
    if (!lado.t.length) return F().n(0);
    if (lado.t.length === 1) return (lado.t[0].c < 0 ? F().op('−') + ' ' : '') + monoHtml({ c: Math.abs(lado.t[0].c), e: lado.t[0].e }, nombre);
    const suma = sumaHtml(lado.t, nombre);
    if (vacio(lado.f)) return suma;
    const { num, den } = separar(lado.f);
    const arriba = num.length ? producto(num, nombre) + ' ' + F().op('·') + ' ' + conParentesis(suma) : suma;
    return den.length ? F().fr(arriba, producto(den, nombre)) : arriba;
  }

  /* Forma intermedia ANTES de simplificar, con las piezas que se cancelan
     marcadas (.cancela). Devuelve null si en ese paso no se cancela nada. */
  function expandir(e, signo) {
    const r = [];
    Object.keys(e).forEach(v => {
      if (Math.sign(e[v]) !== signo) return;
      for (let i = 0; i < Math.min(Math.abs(e[v]), 4); i++) r.push({ v, exp: 1 });
    });
    return r;
  }
  function marcarUno(lista, v) {
    const it = lista.find(x => x.v === v && !x.marca);
    if (it) it.marca = true;
  }
  function intermedioHtml(lado, op, nombre) {
    if (op.tipo === 'mul' || op.tipo === 'div') {
      const k = op.tipo === 'mul' ? 1 : -1;
      const base = lado.t.length === 1 ? lado.t[0].e : lado.f;
      if (!(base[op.v] && Math.sign(base[op.v]) === -k)) return null;
      const num = expandir(base, 1), den = expandir(base, -1);
      const nuevo = { v: op.v, exp: 1, marca: true };
      if (k === 1) { num.push(nuevo); marcarUno(den, op.v); } else { den.push(nuevo); marcarUno(num, op.v); }
      let arriba;
      if (lado.t.length === 1) {
        const m = lado.t[0];
        const partes = [];
        if (Math.abs(m.c) !== 1 || !num.length) partes.push(F().n(Math.abs(m.c)));
        if (num.length) partes.push(producto(num, nombre));
        arriba = (m.c < 0 ? F().op('−') + ' ' : '') + partes.join(' ' + F().op('·') + ' ');
      } else {
        const suma = sumaHtml(lado.t, nombre);
        arriba = num.length ? producto(num, nombre) + ' ' + F().op('·') + ' ' + conParentesis(suma) : suma;
      }
      return den.length ? F().fr(arriba, producto(den, nombre)) : arriba;
    }
    if (!vacio(lado.f)) return null;
    const s = op.tipo === 'sum' ? 1 : -1;
    const idx = lado.t.findIndex(m => firma(m.e) === op.v + '^1' && m.c + s === 0);
    if (idx < 0) return null;
    const t = lado.t.map(clonar).concat([{ c: s, e: { [op.v]: 1 } }]);
    return sumaHtml(t, nombre, [idx, t.length - 1]);
  }

  MA.algebra = {
    leer, aplicar, evaluar, contiene, despejada, siguientePaso, claveEc, unidadLado,
    nombreVar,
    ladoHtml: (lado, N) => ladoHtml(lado, nombreVar(N)),
    ladoValoresHtml: (lado, valores) => ladoHtml(lado, v => `<span class="num">${MA.fmtSig(valores[v], 4)}</span>`),
    intermedioHtml: (lado, op, N) => intermedioHtml(lado, op, nombreVar(N)),
    opTexto: (op, N) => ({ mul: '×', div: '÷', sum: '+', res: '−' }[op.tipo]) + ' ' + (N ? N[op.v] || op.v : op.v)
  };
})();
