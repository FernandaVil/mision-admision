/* =====================================================================
   MOTOR DE UNIDADES (para la mesa de conversión con factor unitario)
   ---------------------------------------------------------------------
   Las unidades se guardan como mapas de exponentes:
     km/h -> { km: 1, h: -1 }      cm² -> { cm: 2 }
   Una equivalencia "1 km = 1000 m" se guarda como dos lados a y b.
   En la cadena, cada factor es { eq, inv }: por defecto va a/b
   (1 km / 1000 m) y al invertirlo queda b/a (1000 m / 1 km).
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;

  const limpiar = e => { const r = {}; Object.keys(e).forEach(k => { if (e[k]) r[k] = e[k]; }); return r; };
  const mult = (a, b, k = 1) => {
    const r = Object.assign({}, a);
    Object.keys(b).forEach(u => { r[u] = (r[u] || 0) + k * b[u]; });
    return limpiar(r);
  };
  const firma = e => Object.keys(limpiar(e)).sort().map(k => k + '^' + e[k]).join('*');
  const igual = (a, b) => firma(a) === firma(b);
  const SUP = { 2: '²', 3: '³', 4: '⁴' };
  const sup = n => (n === 1 ? '' : SUP[n] || '^' + n);

  /* Equivalencias disponibles para los bancos */
  const EQUIV = {
    km_m: { a: [1, { km: 1 }], b: [1000, { m: 1 }] },
    m_cm: { a: [1, { m: 1 }], b: [100, { cm: 1 }] },
    m_mm: { a: [1, { m: 1 }], b: [1000, { mm: 1 }] },
    h_min: { a: [1, { h: 1 }], b: [60, { min: 1 }] },
    min_s: { a: [1, { min: 1 }], b: [60, { s: 1 }] },
    h_s: { a: [1, { h: 1 }], b: [3600, { s: 1 }] },
    L_mL: { a: [1, { L: 1 }], b: [1000, { mL: 1 }] },
    kg_g: { a: [1, { kg: 1 }], b: [1000, { g: 1 }] },
    ft_m: { a: [1, { ft: 1 }], b: [0.3, { m: 1 }] }
  };

  /* Nombres con unidades derivadas conocidas (solo para mostrar) */
  const NOMBRADAS = [[{ kg: 1, m: 1, s: -2 }, 'N']];

  function texto(u) {
    if (!u) return '';
    for (const [m, nombre] of NOMBRADAS) if (igual(m, u)) return nombre;
    const num = [], den = [];
    Object.keys(u).forEach(k => (u[k] > 0 ? num : den).push(k + sup(Math.abs(u[k]))));
    if (!num.length && !den.length) return '';
    const arriba = num.length ? num.join('·') : '1';
    if (!den.length) return arriba;
    return arriba + '/' + (den.length > 1 ? '(' + den.join('·') + ')' : den[0]);
  }
  const textoUnaParte = u => Object.keys(u).map(k => k + sup(Math.abs(u[k]))).join('·');

  function orientar(fc) {
    const eq = EQUIV[fc.eq];
    return fc.inv ? { num: eq.b, den: eq.a } : { num: eq.a, den: eq.b };
  }
  const separar = u => {
    const arriba = {}, abajo = {};
    Object.keys(u).forEach(k => { if (u[k] > 0) arriba[k] = u[k]; else abajo[k] = -u[k]; });
    return { arriba, abajo };
  };

  /* Estado completo de la cadena: unidades netas, valor, cancelaciones */
  function estado(problema, cadena) {
    let u = Object.assign({}, problema.inicio.u);
    let valor = problema.inicio.valor;
    const arribaNums = [problema.inicio.valor], abajoNums = [];
    // Fichas de unidad: origen -1 = cantidad inicial; 0..n = factores
    const fichas = [];
    const ini = separar(problema.inicio.u);
    Object.keys(ini.arriba).forEach(k => fichas.push({ origen: -1, lugar: 'arriba', unidad: k, exp: ini.arriba[k] }));
    Object.keys(ini.abajo).forEach(k => fichas.push({ origen: -1, lugar: 'abajo', unidad: k, exp: ini.abajo[k] }));

    cadena.forEach((fc, i) => {
      const { num, den } = orientar(fc);
      u = mult(mult(u, num[1], 1), den[1], -1);
      valor *= num[0] / den[0];
      arribaNums.push(num[0]);
      abajoNums.push(den[0]);
      Object.keys(num[1]).forEach(k => fichas.push({ origen: i, lugar: 'arriba', unidad: k, exp: num[1][k] }));
      Object.keys(den[1]).forEach(k => fichas.push({ origen: i, lugar: 'abajo', unidad: k, exp: den[1][k] }));
    });

    // Cancelación "a mano": de izquierda a derecha, arriba contra abajo
    const porUnidad = {};
    fichas.forEach(fi => { (porUnidad[fi.unidad] = porUnidad[fi.unidad] || []).push(fi); fi.restante = fi.exp; });
    Object.keys(porUnidad).forEach(k => {
      const ar = porUnidad[k].filter(fi => fi.lugar === 'arriba');
      const ab = porUnidad[k].filter(fi => fi.lugar === 'abajo');
      let quedan = Math.min(ar.reduce((s, fi) => s + fi.exp, 0), ab.reduce((s, fi) => s + fi.exp, 0));
      [ar, ab].forEach(lista => {
        let q = quedan;
        lista.forEach(fi => { const usa = Math.min(fi.restante, q); fi.restante -= usa; q -= usa; });
      });
    });
    fichas.forEach(fi => { fi.estado = fi.restante === 0 ? 'cancelada' : fi.restante < fi.exp ? 'parcial' : 'viva'; });

    // Factores que alejan de la meta (orientación al revés o que no ayudan)
    const sospechosos = cadena.map(fc => {
      const { num, den } = orientar(fc);
      const aporte = mult(num[1], den[1], -1);
      return Object.keys(aporte).some(k => {
        const dif = (u[k] || 0) - (problema.meta[k] || 0);
        return dif !== 0 && Math.sign(dif) === Math.sign(aporte[k]);
      });
    });

    // Qué falta: unidades por eliminar y por conseguir
    const porEliminar = [], porConseguir = [];
    Object.keys(u).forEach(k => {
      const falta = u[k] - (problema.meta[k] || 0);
      if (falta !== 0 && !(problema.meta[k])) porEliminar.push({ unidad: k, lugar: u[k] > 0 ? 'arriba' : 'abajo', veces: Math.abs(u[k]) });
    });
    Object.keys(problema.meta).forEach(k => {
      if ((u[k] || 0) !== problema.meta[k]) porConseguir.push({ unidad: k, lugar: problema.meta[k] > 0 ? 'arriba' : 'abajo' });
    });

    return {
      u, valor, fichas, sospechosos, porEliminar, porConseguir,
      arribaNums, abajoNums,
      listo: igual(u, problema.meta)
    };
  }

  MA.unidades = { EQUIV, mult, igual, texto, textoUnaParte, sup, orientar, separar, estado };
})();
