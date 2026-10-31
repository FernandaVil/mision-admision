/* =====================================================================
   Módulo 4 · contenido (física mecánica I: cinemática)
   ---------------------------------------------------------------------
   - mov: las cuentas del movimiento en línea recta (las usa el radar).
   - FORMULAS y balanzaHtml: las tres fórmulas, dibujadas como balanzas.
   - RETOS_RADAR: radar de pista (ids: m4.radar.*). Cada reto trae
     varios vuelos con otros números: si la predicción falla, se prueba
     con otro vuelo, así no se avanza copiando lo que mostró el radar.
   - RETOS_FORMULAS: despejes en la balanza (ids: m4.form.*).
   - EJERCICIOS: entrenamiento (ids: m4.prac.*). Los tres últimos son
     misiones de vuelo con pistas escalonadas.
   Un vuelo es { v0, a, hasta, … }: MRU es a = 0. hasta dice cuándo se
   detiene el radar: 't' (a los p.t segundos), 'meta' (al llegar a
   p.meta metros), 'para' (cuando frena hasta 0) o 'vf' (al llegar a
   p.vf m/s). Unidades del SI: m, s, m/s y m/s².
   Los ids de retos y ejercicios no se cambian: el avance se guarda
   con ellos en el navegador.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { vr, un, n, op, fr, mt, q, tach, raiz } = MA.f;
  const { pot, neg } = MA.M2;
  const por = op('·'), igual = op('='), mas = op('+'), menos = op('−'), entre = op('÷');
  const f = x => MA.fmt(x);

  /* ---------- Letras y fórmulas ---------- */
  const L = { d: vr('d'), v: vr('v'), t: vr('t'), a: vr('a'), v0: vr('v', '0'), vf: vr('v', 'f') };
  const t2 = pot(vr('t'), 2);
  const medio = fr(n(1), n(2));
  const FORMULAS = {
    mru: { nombre: 'Velocidad constante', corto: 'MRU', izq: L.d, der: `${L.v} ${por} ${L.t}`,
      uso: 'Cuando la velocidad no cambia: cada segundo avanza lo mismo.',
      letras: [[L.d, 'distancia', 'm'], [L.v, 'velocidad', 'm/s'], [L.t, 'tiempo', 's']] },
    vel: { nombre: 'Con aceleración: la velocidad', corto: 'MRUV', izq: L.vf, der: `${L.v0} ${mas} ${L.a} ${por} ${L.t}`,
      uso: 'Cuánto va marcando el velocímetro: arranca en v₀ y cada segundo gana a.',
      letras: [[L.vf, 'velocidad final', 'm/s'], [L.v0, 'velocidad inicial', 'm/s'], [L.a, 'aceleración', 'm/s²'], [L.t, 'tiempo', 's']] },
    dist: { nombre: 'Con aceleración: la distancia', corto: 'MRUV', izq: L.d, der: `${L.v0} ${por} ${L.t} ${mas} ${medio} ${por} ${L.a} ${por} ${t2}`,
      uso: 'Cuántos metros lleva. Si parte del reposo, v₀ = 0 y queda ½ · a · t².',
      letras: [[L.d, 'distancia', 'm'], [L.v0, 'velocidad inicial', 'm/s'], [L.a, 'aceleración', 'm/s²'], [L.t, 'tiempo', 's']] }
  };
  const formulaHtml = k => mt(FORMULAS[k].izq, igual, FORMULAS[k].der);

  // Una igualdad dibujada como balanza: un plato por lado y el «=» en el apoyo
  function balanzaHtml(izq, der, o = {}) {
    const plato = (lado, html) => `
      <div class="fb-plato" data-lado="${lado}">
        <span class="fb-op" aria-hidden="true"></span>
        <div class="fb-carga"><span class="mt">${html}</span></div>
        <i class="fb-bandeja"></i><i class="fb-poste"></i>
      </div>`;
    return `
      <div class="fb-balanza${o.mini ? ' fb-mini' : ''}">
        <div class="fb-brazo">
          <div class="fb-platos">${plato('izq', izq)}<span class="sr-solo">es igual a</span>${plato('der', der)}</div>
          <div class="fb-viga"></div>
        </div>
        <div class="fb-fulcro" aria-hidden="true"><span>=</span></div>
        <div class="fb-base"></div>
      </div>`;
  }

  // El avión visto desde arriba, con la nariz en (x, y) y mirando a la derecha (el icono «avion» girado)
  const AVION = 'M12 1.8c.7 0 1.2.9 1.2 2.2v5.1l8.3 4.6v2.1l-8.3-2.5v4.6l2.6 1.9v1.7L12 20.6l-3.8.9v-1.7l2.6-1.9v-4.6l-8.3 2.5v-2.1l8.3-4.6V4c0-1.3.5-2.2 1.2-2.2z';
  const avionSvg = (x, y, s = 1.75, clase = 'rp-avion') => `<g class="${clase}" transform="translate(${(x - 10.2 * s).toFixed(1)} ${y}) rotate(90) scale(${s}) translate(-12 -12)"><path d="${AVION}"/></g>`;

  /* ---------- Cuentas del movimiento ----------
     Al frenar se detiene en v = 0 y ya no retrocede. */
  const tParada = p => (p.a < 0 ? p.v0 / -p.a : Infinity);
  function estado(p, t) {
    const s = Math.min(t, tParada(p)), a = p.a || 0;
    return { v: p.v0 + a * s, d: p.v0 * s + a * s * s / 2 };
  }
  // Cuánto tarda en llegar a una distancia (Infinity si no llega)
  function tiempoHasta(p, d) {
    if (d <= 0) return 0;
    if (!p.a) return p.v0 > 0 ? d / p.v0 : Infinity;
    const adentro = p.v0 * p.v0 + 2 * p.a * d;
    if (adentro < 0) return Infinity;
    const t = (-p.v0 + Math.sqrt(adentro)) / p.a;
    return t >= 0 && t <= tParada(p) + 1e-9 ? t : Infinity;
  }
  function tiempoFinal(p) {
    if (p.hasta === 't') return p.t;
    if (p.hasta === 'meta') return tiempoHasta(p, p.meta);
    if (p.hasta === 'para') return tParada(p);
    if (p.hasta === 'vf') return p.a ? (p.vf - p.v0) / p.a : Infinity;
    return Infinity;
  }
  // Lo que se pregunta: la distancia, el tiempo o la velocidad al final del vuelo
  function medir(p) {
    const t = tiempoFinal(p), e = estado(p, t);
    return p.mide === 't' ? t : p.mide === 'v' ? e.v : e.d;
  }
  const mov = { tParada, estado, tiempoHasta, tiempoFinal, medir };

  // 0 → 3 → 6 → 9: la velocidad de cada segundo
  const serie = p => Array.from({ length: Math.round(tiempoFinal(p)) + 1 }, (_, k) => f(estado(p, k).v)).join(' → ');
  // 1 + 3 + 5 + 7: lo recorrido en cada segundo
  const tramos = p => Array.from({ length: Math.round(tiempoFinal(p)) }, (_, k) => f(estado(p, k + 1).d - estado(p, k).d)).join(' + ');
  const dvt = mt(L.d, igual, L.v, por, L.t);

  /* ---------- Radar de pista ----------
     grupo: 'mru' (velocidad constante) o 'mruv' (con aceleración).
     pista: largo de la pista en metros (el mismo para todos los vuelos
     del reto, así la escala no adelanta la respuesta). marca: una línea
     en la pista. elige: 'v0' si la predicción es la velocidad con la que
     vuela el radar. */
  const RETOS_RADAR = [
    {
      id: 'r1', grupo: 'mru', titulo: 'Cada segundo, lo mismo', pista: 100, hasta: 't', mide: 'd',
      contexto: 'Una avioneta rueda por la pista con velocidad constante: el velocímetro marca siempre lo mismo.',
      vuelos: [{ v0: 10, t: 3 }, { v0: 15, t: 4 }, { v0: 25, t: 2 }],
      pregunta: p => `¿Cuántos metros habrá recorrido a los ${f(p.t)} s?`,
      errores: p => [
        { valor: p.v0 + p.t, msg: `Ese resultado sale de sumar ${f(p.v0)} + ${f(p.t)}. La velocidad dice cuánto avanza en cada segundo: son ${f(p.v0)} m, ${f(p.t)} veces.` },
        { valor: p.v0 / p.t, msg: `Ese resultado sale de dividir. Cada segundo se suman otros ${f(p.v0)} m: se multiplica.` }
      ],
      explica: p => `Cada segundo avanza ${f(p.v0)} m: ${Array(p.t).fill(f(p.v0)).join(' + ')} = ${f(p.v0 * p.t)} m. Es ${dvt}. Las huellas de la pista quedaron parejas.`
    },
    {
      id: 'r2', grupo: 'mru', titulo: '¿Cuánto tarda?', pista: 200, hasta: 'meta', mide: 't', marca: p => p.meta,
      contexto: 'La misma avioneta, ahora con una marca pintada en la pista.',
      vuelos: [{ v0: 20, meta: 100 }, { v0: 25, meta: 150 }, { v0: 15, meta: 120 }],
      pregunta: p => `¿En cuántos segundos llega a la marca de ${f(p.meta)} m?`,
      errores: p => [
        { valor: p.v0 * p.meta, msg: `Ese resultado sale de multiplicar. Cada segundo avanza ${f(p.v0)} m: hay que ver cuántas veces cabe ${f(p.v0)} en ${f(p.meta)}.` },
        { valor: p.meta - p.v0, msg: `Ese resultado sale de restar ${f(p.meta)} − ${f(p.v0)}: son los metros que le faltan después del primer segundo, no los segundos.` },
        { valor: p.v0 / p.meta, msg: `Ese resultado sale de dividir al revés: es ${f(p.meta)} ÷ ${f(p.v0)}, la distancia entre la velocidad.` }
      ],
      explica: p => `Cada segundo avanza ${f(p.v0)} m, y ${f(p.v0)} cabe ${f(p.meta / p.v0)} veces en ${f(p.meta)}: ${f(p.meta)} ÷ ${f(p.v0)} = ${f(p.meta / p.v0)} s. Es ${mt(L.t, igual, L.d, entre, L.v)}, el despeje del módulo 1.`
    },
    {
      id: 'r3', grupo: 'mru', titulo: '¿Qué velocidad hace falta?', pista: 200, hasta: 't', mide: 'v', elige: 'v0', marca: p => p.meta,
      contexto: 'Ahora el radar vuela con la velocidad de la predicción: hay que llegar a la marca justo a tiempo.',
      vuelos: [{ meta: 120, t: 4 }, { meta: 100, t: 5 }, { meta: 150, t: 6 }],
      respuesta: p => p.meta / p.t,
      pregunta: p => `¿A qué velocidad hay que ir para llegar a la marca de ${f(p.meta)} m justo a los ${f(p.t)} s?`,
      errores: p => [
        { valor: p.meta * p.t, msg: `Ese resultado sale de multiplicar ${f(p.meta)} · ${f(p.t)}. Los ${f(p.meta)} m se reparten entre los ${f(p.t)} s: se divide.` },
        { valor: p.meta - p.t, msg: `Ese resultado sale de restar ${f(p.meta)} − ${f(p.t)}: metros menos segundos no da una velocidad.` }
      ],
      explica: p => `En ${f(p.t)} s tiene que avanzar ${f(p.meta)} m: ${f(p.meta)} ÷ ${f(p.t)} = ${f(p.meta / p.t)} m en cada segundo. Es ${mt(L.v, igual, L.d, entre, L.t)}.`
    },
    {
      id: 'r4', grupo: 'mruv', titulo: 'Gana velocidad cada segundo', pista: 40, hasta: 't', mide: 'v',
      contexto: 'Un avión parte del reposo y acelera parejo: cada segundo gana la misma velocidad.',
      vuelos: [{ v0: 0, a: 3, t: 4 }, { v0: 0, a: 2, t: 5 }, { v0: 0, a: 4, t: 3 }],
      pregunta: p => `¿Qué velocidad marcará el radar a los ${f(p.t)} s?`,
      errores: p => [
        { valor: p.a + p.t, msg: `Ese resultado sale de sumar ${f(p.a)} + ${f(p.t)}. La aceleración dice cuánto gana en cada segundo: son ${f(p.a)} m/s, ${f(p.t)} veces.` },
        { valor: p.a * p.t * p.t / 2, msg: 'Esa es la distancia, en metros. La pregunta es la velocidad: lo que gana cada segundo, por los segundos.' },
        { valor: p.a * p.t * p.t, msg: 'Ese resultado sale de multiplicar por el tiempo dos veces. La velocidad gana lo mismo cada segundo: se multiplica una sola vez.' }
      ],
      explica: p => `Cada segundo gana ${f(p.a)} m/s: ${serie(p)}. Es ${mt(L.vf, igual, L.v0, mas, L.a, por, L.t)} ${mt(igual, n(0), mas, n(p.a), por, n(p.t), igual, n(p.a * p.t))}. Las huellas se separan cada vez más.`
    },
    {
      id: 'r5', grupo: 'mruv', titulo: 'Arranca lento', pista: 40, hasta: 't', mide: 'd',
      contexto: 'El mismo despegue: ahora la pregunta es la distancia. Ojo: no fue todo el tiempo a la misma velocidad.',
      vuelos: [{ v0: 0, a: 2, t: 4 }, { v0: 0, a: 4, t: 3 }, { v0: 0, a: 2, t: 5 }],
      pregunta: p => `¿Cuántos metros habrá recorrido a los ${f(p.t)} s?`,
      errores: p => {
        const vf = p.a * p.t;
        return [
          { valor: vf * p.t, msg: `Ese resultado sale de multiplicar la velocidad final (${f(vf)} m/s) por el tiempo, como si hubiera ido a ${f(vf)} m/s desde el principio. Pero arrancó en 0.` },
          { valor: vf, msg: `Esa es la velocidad a los ${f(p.t)} s, en m/s. La pregunta es la distancia.` },
          { valor: vf / 2, msg: 'Esa es la velocidad promedio: falta multiplicarla por el tiempo.' }
        ];
      },
      explica: p => {
        const vf = p.a * p.t;
        return `Arrancó en 0 y llegó a ${f(vf)} m/s: en promedio fue a ${f(vf / 2)} m/s, y ${f(vf / 2)} · ${f(p.t)} = ${f(vf / 2 * p.t)} m. En la bitácora: ${tramos(p)} = ${f(vf / 2 * p.t)}. Cada segundo recorre ${f(p.a)} m más que el anterior.`;
      }
    },
    {
      id: 'r6', grupo: 'mruv', titulo: 'Frenar también es acelerar', pista: 100, hasta: 'para', mide: 't',
      contexto: 'Un avión que acaba de aterrizar frena parejo: cada segundo pierde la misma velocidad. Por eso la aceleración es negativa.',
      vuelos: [{ v0: 20, a: -5 }, { v0: 30, a: -6 }, { v0: 24, a: -4 }],
      pregunta: () => '¿En cuántos segundos se detiene?',
      errores: p => [
        { valor: p.v0 * -p.a, msg: `Ese resultado sale de multiplicar ${f(p.v0)} · ${f(-p.a)}. Cada segundo pierde ${f(-p.a)} m/s: hay que ver cuántas veces cabe ${f(-p.a)} en ${f(p.v0)}.` },
        { valor: p.v0 / p.a, msg: `El tiempo no es negativo. Arriba queda 0 − ${f(p.v0)} = −${f(p.v0)}, y −${f(p.v0)} ÷ (−${f(-p.a)}) da positivo: menos entre menos da más.` },
        { valor: p.v0 + p.a, msg: 'Esa es la velocidad que le queda después del primer segundo, en m/s. La pregunta es cuántos segundos tarda en llegar a 0.' }
      ],
      explica: p => `Cada segundo pierde ${f(-p.a)} m/s: ${serie(p)}. Son ${f(p.v0 / -p.a)} s. Con la fórmula: ${mt(n(0), igual, n(p.v0), mas, neg(p.a), por, L.t)}, así que ${mt(L.t, igual, n(p.v0), entre, n(-p.a), igual, n(p.v0 / -p.a))}.`
    },
    {
      id: 'r7', grupo: 'mruv', titulo: '¿Cuánta pista usa al frenar?', pista: 100, hasta: 'para', mide: 'd',
      contexto: 'El mismo frenado: ahora, los metros de pista que usa hasta detenerse.',
      vuelos: [{ v0: 20, a: -5 }, { v0: 30, a: -6 }, { v0: 24, a: -4 }],
      pregunta: () => '¿Cuántos metros recorre hasta detenerse?',
      errores: p => {
        const t = p.v0 / -p.a, d = p.v0 * t / 2;
        return [
          { valor: p.v0 * t, msg: `Ese resultado sale de multiplicar ${f(p.v0)} m/s por ${f(t)} s, como si no frenara.` },
          { valor: t, msg: 'Ese es el tiempo, en segundos. La pregunta es la distancia.' },
          { valor: p.v0 * t + d, msg: 'Ese resultado sale de sumar lo que frena. Al frenar, cada segundo recorre menos: el total es menos que si no frenara.' }
        ];
      },
      explica: p => {
        const t = p.v0 / -p.a;
        return `Pasó de ${f(p.v0)} m/s a 0: en promedio fue a ${f(p.v0 / 2)} m/s durante ${f(t)} s, y ${f(p.v0 / 2)} · ${f(t)} = ${f(p.v0 / 2 * t)} m. En la bitácora: ${tramos(p)}, cada segundo un poco menos.`;
      }
    }
  ];

  /* ---------- Fórmulas en la balanza ----------
     Cada paso: una pregunta (qué se hace en los dos platos), las
     opciones (ok: la buena; porQue: por qué no las otras), cómo quedan
     los platos con lo que se cancela tachado (antes) y ya limpio
     (despues). Al final se lee al revés (final) y se comprueba con los
     números de un reto del radar. */
  // Parte del reposo: no es una operación sino un dato (dato: true)
  const pasoV0 = der => ({
    dato: true,
    pregunta: `Parte del reposo: ${mt(L.v0, igual, n(0))}. ¿Qué pasa con ${mt(L.v0, por, L.t)}?`,
    etiqueta: `${mt(L.v0, igual, n(0))}`,
    opciones: [
      { html: 'Vale 0 y se va', ok: true },
      { html: `Queda ${L.t}`, porQue: `Cualquier número por 0 da 0: ${mt(n(0), por, L.t, igual, n(0))}, no ${L.t}.` },
      { html: `Queda ${L.v0}`, porQue: `${L.v0} vale 0, y ${mt(n(0), por, L.t, igual, n(0))}: no queda nada.` }
    ],
    antes: { izq: L.d, der: `${tach(`${n(0)} ${por} ${L.t} ${mas}`)} ${der}` },
    despues: { izq: L.d, der },
    nota: `${mt(n(0), por, L.t, igual, n(0))}: el primer término se va.`,
    pista: 'Cualquier número multiplicado por 0 da 0.'
  });
  const pasoPor2 = {
    pregunta: `¿Qué se hace en los dos platos para que se vaya el ${medio}?`,
    etiqueta: `${op('×')} ${n(2)} en los dos platos`,
    opciones: [
      { html: `${op('×')} ${n(2)}`, ok: true },
      { html: `${entre} ${n(2)}`, porQue: `Así queda ${fr(n(1), n(4))}: el ${medio} se achica en vez de irse. Lo contrario de dividir entre 2 es multiplicar por 2.` },
      { html: `${menos} ${medio}`, porQue: `El ${medio} no está sumando: está multiplicando. Restarlo no lo separa de la ${L.a}.` }
    ],
    antes: { izq: `${n(2)} ${por} ${L.d}`, der: `${tach(n(2))} ${por} ${fr(n(1), tach(n(2)))} ${por} ${L.a} ${por} ${t2}` },
    despues: { izq: `${n(2)} ${por} ${L.d}`, der: `${L.a} ${por} ${t2}` },
    nota: `${mt(n(2), por, medio, igual, n(1))}: el ${medio} se va.`,
    pista: `El ${medio} es «dividir entre 2». Lo contrario de dividir es multiplicar.`
  };
  const restarV0 = otra => ({
    pregunta: '¿Qué se quita primero, en los dos platos?',
    etiqueta: `${menos} ${L.v0} en los dos platos`,
    opciones: [
      { html: `${entre} ${otra}`, porQue: `Se puede, pero la ${L.v0} queda dividida y todo se enreda. La regla de oro del módulo 1: primero se quita lo que suma o resta; después, lo que multiplica o divide.` },
      { html: `${menos} ${L.v0}`, ok: true },
      { html: `${mas} ${L.v0}`, porQue: `La ${L.v0} ya está sumando: sumarla otra vez da ${mt(n(2), por, L.v0)}. Lo contrario de sumar es restar.` }
    ],
    antes: { izq: `${L.vf} ${menos} ${L.v0}`, der: `${tach(L.v0)} ${mas} ${L.a} ${por} ${L.t} ${tach(`${menos} ${L.v0}`)}` },
    despues: { izq: `${L.vf} ${menos} ${L.v0}`, der: `${L.a} ${por} ${L.t}` },
    nota: `${mt(L.v0, menos, L.v0, igual, n(0))}: la ${L.v0} se cancela.`,
    pista: `Regla de oro: primero se quita lo que suma o resta. La ${L.v0} está sumando.`
  });
  // En a · t la a va primero: se tacha la que divide y queda la otra
  const dividir = (cual, otra, izq, der, porQueOtra) => ({
    pregunta: `¿Y ahora? ¿Qué deja sola la ${der}?`,
    etiqueta: `${entre} ${cual} en los dos platos`,
    opciones: [
      { html: `${entre} ${otra}`, porQue: porQueOtra },
      { html: `${entre} ${cual}`, ok: true },
      { html: `${menos} ${cual}`, porQue: `La ${cual} no está sumando: está multiplicando. Lo contrario de multiplicar es dividir.` }
    ],
    antes: { izq: fr(izq, cual), der: fr(cual === L.a ? `${tach(cual)} ${por} ${der}` : `${der} ${por} ${tach(cual)}`, tach(cual)) },
    despues: { izq: fr(izq, cual), der },
    nota: `${mt(cual, entre, cual, igual, n(1))}: la ${cual} se cancela.`,
    pista: `La ${cual} está multiplicando. Lo contrario de multiplicar es dividir.`
  });
  const vfv0 = `${L.vf} ${menos} ${L.v0}`;

  const RETOS_FORMULAS = [
    {
      id: 'f1', formula: 'mru', meta: L.t, titulo: '¿Cuánto tarda?',
      contexto: 'Se conocen la distancia y la velocidad. Para calcular el tiempo hace falta la t sola: es el reto 2 del radar, con letras.',
      pasos: [{
        pregunta: `¿Qué se hace en los dos platos para dejar sola la ${L.t}?`,
        etiqueta: `${entre} ${L.v} en los dos platos`,
        opciones: [
          { html: `${op('×')} ${L.v}`, porQue: `Así la ${L.v} queda dos veces: ${mt(L.v, por, L.v, por, L.t)}. La ${L.v} está multiplicando, y lo contrario de multiplicar es dividir.` },
          { html: `${menos} ${L.v}`, porQue: `La ${L.v} no está sumando: está multiplicando. Restarla no la separa de la ${L.t}.` },
          { html: `${entre} ${L.v}`, ok: true }
        ],
        antes: { izq: fr(L.d, L.v), der: fr(`${tach(L.v)} ${por} ${L.t}`, tach(L.v)) },
        despues: { izq: fr(L.d, L.v), der: L.t },
        nota: `${mt(L.v, entre, L.v, igual, n(1))}: la ${L.v} se cancela.`,
        pista: `La ${L.t} está multiplicada por la ${L.v}. Lo contrario de multiplicar es dividir.`
      }],
      final: `${L.t} ${igual} ${fr(L.d, L.v)}`,
      comprobar: {
        pregunta: `Con el reto 2 del radar: ${q(100, 'm')} a ${q(20, 'm/s')}. ¿Cuánto da la ${L.t}?`, respuesta: 5, unidad: 's',
        calculo: mt(L.t, igual, fr(n(100), n(20)), igual, q(5, 's')),
        errores: [
          { valor: 2000, msg: 'Ese resultado sale de multiplicar. Con la t sola, la d va arriba y la v abajo: se divide.' },
          { valor: 0.2, msg: 'Ese resultado sale de dividir al revés: es d ÷ v, 100 ÷ 20.' }
        ]
      }
    },
    {
      id: 'f2', formula: 'mru', meta: L.v, titulo: 'La velocidad necesaria',
      contexto: 'Ahora se conocen la distancia y el tiempo, y hace falta la velocidad: el reto 3 del radar, con letras.',
      pasos: [{
        pregunta: `¿Qué se hace en los dos platos para dejar sola la ${L.v}?`,
        etiqueta: `${entre} ${L.t} en los dos platos`,
        opciones: [
          { html: `${entre} ${L.t}`, ok: true },
          { html: `${entre} ${L.v}`, porQue: `Así se queda sola la ${L.t}, no la ${L.v}: ese fue el reto 1.` },
          { html: `${op('×')} ${L.t}`, porQue: `Así la ${L.t} queda dos veces. La ${L.t} está multiplicando, y lo contrario de multiplicar es dividir.` }
        ],
        antes: { izq: fr(L.d, L.t), der: fr(`${L.v} ${por} ${tach(L.t)}`, tach(L.t)) },
        despues: { izq: fr(L.d, L.t), der: L.v },
        nota: `${mt(L.t, entre, L.t, igual, n(1))}: la ${L.t} se cancela.`,
        pista: `La ${L.v} está multiplicada por la ${L.t}. ¿Qué operación separa a la ${L.t}?`
      }],
      final: `${L.v} ${igual} ${fr(L.d, L.t)}`,
      comprobar: {
        pregunta: `Con el reto 3 del radar: ${q(120, 'm')} en ${q(4, 's')}. ¿Cuánto da la ${L.v}?`, respuesta: 30, unidad: 'm/s',
        calculo: mt(L.v, igual, fr(n(120), n(4)), igual, q(30, 'm/s')),
        errores: [
          { valor: 480, msg: 'Ese resultado sale de multiplicar. Con la v sola, la d va arriba y la t abajo: se divide.' },
          { valor: 116, msg: 'Ese resultado sale de restar 120 − 4. La raya de la fracción es un ÷.' }
        ]
      }
    },
    {
      id: 'f3', formula: 'vel', meta: L.a, titulo: 'La aceleración',
      contexto: 'Se conocen la velocidad inicial, la final y el tiempo. ¿Cómo se despeja la aceleración? Son dos pasos.',
      pasos: [
        restarV0(L.t),
        dividir(L.t, L.a, vfv0, L.a, `Así se queda sola la ${L.t}, no la ${L.a}: ese es el reto 4.`)
      ],
      final: `${L.a} ${igual} ${fr(vfv0, L.t)}`,
      comprobar: {
        pregunta: `Con el reto 4 del radar: parte del reposo y a los ${q(4, 's')} va a ${q(12, 'm/s')}. ¿Cuánto da la ${L.a}?`, respuesta: 3, unidad: 'm/s²',
        calculo: mt(L.a, igual, fr(`${n(12)} ${menos} ${n(0)}`, n(4)), igual, q(3, 'm/s²')),
        errores: [
          { valor: 48, msg: 'Ese resultado sale de multiplicar 12 · 4. La t está abajo: divide.' },
          { valor: 8, msg: 'Ese resultado sale de restar 12 − 4. Arriba va vf − v₀ = 12 − 0, y eso se divide entre la t.' }
        ]
      }
    },
    {
      id: 'f4', formula: 'vel', meta: L.t, titulo: '¿Cuánto tarda en frenar?',
      contexto: 'La misma fórmula, ahora para el tiempo. Sirve para el frenado del reto 6 del radar, con su aceleración negativa.',
      pasos: [
        restarV0(L.a),
        dividir(L.a, L.t, vfv0, L.t, `Así se queda sola la ${L.a}, no la ${L.t}: ese fue el reto 3.`)
      ],
      final: `${L.t} ${igual} ${fr(vfv0, L.a)}`,
      comprobar: {
        pregunta: `Con el reto 6 del radar: frena de ${q(20, 'm/s')} a 0, con ${mt(L.a, igual, q(-5, 'm/s²'))}. ¿Cuánto da la ${L.t}?`, respuesta: 4, unidad: 's',
        calculo: mt(L.t, igual, fr(`${n(0)} ${menos} ${n(20)}`, neg(-5)), igual, fr(n(-20), neg(-5)), igual, q(4, 's')),
        errores: [
          { valor: -4, msg: 'El tiempo no es negativo. Arriba queda 0 − 20 = −20, y −20 ÷ (−5) = +4: menos entre menos da más.' },
          { valor: 100, msg: 'Ese resultado sale de multiplicar 20 · 5. La a está abajo: divide.' },
          { valor: 0.25, msg: 'Ese resultado sale de dividir al revés: arriba va vf − v₀ y abajo la a.' }
        ]
      }
    },
    {
      id: 'f5', formula: 'dist', meta: L.a, titulo: 'La aceleración de un despegue',
      contexto: 'La fórmula de la distancia, cuando parte del reposo. Tres pasos: el primero no es una operación, es un dato.',
      pasos: [
        pasoV0(`${medio} ${por} ${L.a} ${por} ${t2}`),
        pasoPor2,
        {
          pregunta: `¿Qué deja sola la ${L.a}?`,
          etiqueta: `${entre} ${t2} en los dos platos`,
          opciones: [
            { html: `${entre} ${L.t}`, porQue: `Queda una ${L.t}: ${mt(t2, entre, L.t, igual, L.t)}, porque los exponentes se restan (módulo 2). Lo que acompaña a la ${L.a} es ${t2}.` },
            { html: `${entre} ${t2}`, ok: true },
            { html: `${entre} ${L.a}`, porQue: `Así se queda sola la ${t2}, no la ${L.a}.` }
          ],
          antes: { izq: fr(`${n(2)} ${por} ${L.d}`, t2), der: fr(`${L.a} ${por} ${tach(t2)}`, tach(t2)) },
          despues: { izq: fr(`${n(2)} ${por} ${L.d}`, t2), der: L.a },
          nota: `${mt(t2, entre, t2, igual, n(1))}: la ${t2} se cancela.`,
          pista: `La ${L.a} está multiplicada por ${t2}, entera.`
        }
      ],
      final: `${L.a} ${igual} ${fr(`${n(2)} ${por} ${L.d}`, t2)}`,
      comprobar: {
        pregunta: `Con el reto 5 del radar: desde el reposo recorre ${q(16, 'm')} en ${q(4, 's')}. ¿Cuánto da la ${L.a}?`, respuesta: 2, unidad: 'm/s²',
        calculo: mt(L.a, igual, fr(`${n(2)} ${por} ${n(16)}`, pot(n(4), 2)), igual, fr(n(32), n(16)), igual, q(2, 'm/s²')),
        errores: [
          { valor: 1, msg: 'Faltó el 2 de arriba: 2 · 16 = 32, y 32 ÷ 16 = 2.' },
          { valor: 8, msg: 'Ese resultado sale de dividir entre t y no entre t²: abajo va 4² = 16.' },
          { valor: 4, msg: 'Ese resultado sale de 16 ÷ 4. Arriba va 2 · 16 y abajo 4² = 16.' }
        ]
      }
    },
    {
      id: 'f6', formula: 'dist', meta: L.t, titulo: '¿Cuánto tarda en recorrer la pista?',
      contexto: 'La misma fórmula, desde el reposo, ahora para el tiempo. Cuatro pasos: el último deshace el cuadrado.',
      pasos: [
        pasoV0(`${medio} ${por} ${L.a} ${por} ${t2}`),
        pasoPor2,
        {
          pregunta: `¿Qué deja sola la ${t2}?`,
          etiqueta: `${entre} ${L.a} en los dos platos`,
          opciones: [
            { html: `${entre} ${t2}`, porQue: `Así se queda sola la ${L.a}: ese fue el reto 5.` },
            { html: `${menos} ${L.a}`, porQue: `La ${L.a} no está sumando: está multiplicando.` },
            { html: `${entre} ${L.a}`, ok: true }
          ],
          antes: { izq: fr(`${n(2)} ${por} ${L.d}`, L.a), der: fr(`${tach(L.a)} ${por} ${t2}`, tach(L.a)) },
          despues: { izq: fr(`${n(2)} ${por} ${L.d}`, L.a), der: t2 },
          nota: `${mt(L.a, entre, L.a, igual, n(1))}: la ${L.a} se cancela.`,
          pista: `La ${t2} está multiplicada por la ${L.a}.`
        },
        {
          pregunta: `La ${L.t} está al cuadrado. ¿Qué la deja sola?`,
          etiqueta: `${op('√')} en los dos platos`,
          opciones: [
            { html: `${entre} ${n(2)}`, porQue: `El exponente no multiplica: ${mt(t2, igual, L.t, por, L.t)}, no ${mt(n(2), por, L.t)} (módulo 2). Lo contrario de elevar al cuadrado es sacar la raíz.` },
            { html: `${op('√')}`, ok: true },
            { html: `${entre} ${L.t}`, porQue: `Queda una ${L.t} en cada plato: la ${L.t} pasaría a estar en los dos lados.` }
          ],
          antes: { izq: raiz(fr(`${n(2)} ${por} ${L.d}`, L.a)), der: raiz(t2) },
          despues: { izq: raiz(fr(`${n(2)} ${por} ${L.d}`, L.a)), der: L.t },
          nota: `${mt(raiz(t2), igual, L.t)}: la raíz deshace el cuadrado.`,
          pista: 'Lo contrario de elevar al cuadrado es sacar la raíz cuadrada.'
        }
      ],
      final: `${L.t} ${igual} ${raiz(fr(`${n(2)} ${por} ${L.d}`, L.a))}`,
      comprobar: {
        pregunta: `Desde el reposo, con ${mt(L.a, igual, q(2, 'm/s²'))}, ¿cuánto tarda en recorrer ${q(100, 'm')}?`, respuesta: 10, unidad: 's',
        calculo: mt(L.t, igual, raiz(fr(`${n(2)} ${por} ${n(100)}`, n(2))), igual, raiz(n(100)), igual, q(10, 's')),
        errores: [
          { valor: 100, msg: 'Eso es t² = 100: falta la raíz. ¿Qué número por sí mismo da 100?' },
          { valor: 50, msg: 'Faltó el 2 de arriba y la raíz: 2 · 100 ÷ 2 = 100, y √100 = 10.' }
        ]
      }
    }
  ];

  /* ---------- Entrenamiento ----------
     Del más sencillo al más parecido al examen, y la guía se va
     retirando. Básico e intermedio: números redondos y un botón para
     abrir la herramienta. Tipo examen y retos (misiones de vuelo):
     números reales para la calculadora, como en el examen, sin
     herramienta, y pistas de estrategia que no hacen las cuentas; se
     abren después del primer intento. Así se practica el ejercicio
     completo, de principio a fin, y no solo el paso que pide la mesa. */
  const tachU = u => tach(un(u));
  const EJERCICIOS = [
    // ----- Básico -----
    {
      id: 'e1', nivel: 'basico', tema: 'mru', tipo: 'numero', respuesta: 600, unidad: 'm',
      enunciado: `Un helicóptero vuela en línea recta a ${q(50, 'm/s')}, siempre a la misma velocidad. ¿Cuántos metros recorre en ${q(12, 's')}?`,
      plano: 'Un helicóptero vuela en línea recta a 50 m/s, siempre a la misma velocidad. ¿Cuántos metros recorre en 12 s?',
      errores: [
        { valor: 62, msg: 'Ese resultado sale de sumar 50 + 12. Cada segundo avanza 50 m: son 12 veces 50.' },
        { valor: 50 / 12, msg: 'Ese resultado sale de dividir. Cada segundo se suman otros 50 m: se multiplica.' }
      ],
      pistas: ['Velocidad constante: cada segundo avanza lo mismo. ¿Cuánto avanza en 1 s?', `${dvt}: ${mt(n(50), por, n(12))}. Para hacerlo de cabeza: ${mt(n(50), por, n(12), igual, n(100), por, n(6))}.`],
      solucion: [`${mt(L.d, igual, L.v, por, L.t, igual, n(50), un('m/s'), por, n(12), un('s'))}`, `Los segundos se cancelan: ${mt(fr(un('m'), tachU('s')), por, tachU('s'), igual, un('m'))}.`, `Respuesta: ${q(600, 'm')}.`],
      herramienta: { boton: 'Verlo en el radar de pista', icono: 'radar', mesa: 'radar', problema: { v0: 50, a: 0, hasta: 't', t: 12, pista: 800, mide: 'd', pregunta: '¿Cuántos metros recorre en 12 s?' } }
    },
    {
      id: 'e2', nivel: 'basico', tema: 'unidades', tipo: 'numero', respuesta: 20, unidad: 'm/s',
      enunciado: `Una avioneta rueda por la pista a ${q(72, 'km/h')}. ¿Cuánto es en m/s?`,
      plano: 'Una avioneta rueda por la pista a 72 km/h. ¿Cuánto es en m/s?',
      errores: [
        { valor: 259.2, msg: 'Ese resultado sale de multiplicar por 3,6. Eso es para pasar de m/s a km/h; de km/h a m/s se divide.' },
        { valor: 72000, msg: 'Faltaron las horas: los km se volvieron metros, pero la hora también hay que pasarla a segundos (3600 s).' }
      ],
      pistas: ['Es el reto 3 de la mesa de conversión del módulo 1: 1 km = 1000 m y 1 h = 3600 s.', `Los dos factores juntos dan ${mt(fr(n(1000), n(3600)), igual, fr(n(1), n('3,6')))}: de km/h a m/s se divide entre 3,6. De cabeza: ${mt(n(72), entre, n('3,6'), igual, n(720), entre, n(36))}.`],
      solucion: [`${mt(n(72), fr(tachU('km'), tachU('h')), por, fr(`${n(1000)} ${un('m')}`, `${n(1)} ${tachU('km')}`), por, fr(`${n(1)} ${tachU('h')}`, `${n(3600)} ${un('s')}`))}`, `${mt(fr(n(72000), n(3600)), igual, n(20))}`, `Respuesta: ${q(20, 'm/s')}.`]
    },
    {
      id: 'e3', nivel: 'basico', tema: 'mruv', tipo: 'numero', respuesta: 30, unidad: 'm/s',
      enunciado: `Un avión parte del reposo y acelera a ${q(3, 'm/s²')}. ¿Qué velocidad lleva a los ${q(10, 's')}?`,
      plano: 'Un avión parte del reposo y acelera a 3 m/s². ¿Qué velocidad lleva a los 10 s?',
      errores: [
        { valor: 13, msg: 'Ese resultado sale de sumar 3 + 10. Cada segundo gana 3 m/s: son 10 veces 3.' },
        { valor: 150, msg: 'Esa es la distancia, en metros: ½ · 3 · 10². La pregunta es la velocidad.' },
        { valor: 300, msg: 'Ese resultado sale de multiplicar por el tiempo dos veces. La velocidad gana lo mismo cada segundo: se multiplica una vez.' }
      ],
      pistas: ['Parte del reposo: v₀ = 0. Cada segundo gana 3 m/s.', `${mt(L.vf, igual, L.v0, mas, L.a, por, L.t, igual, n(0), mas, n(3), por, n(10))}.`],
      solucion: [`Parte del reposo: ${mt(L.v0, igual, n(0))}.`, `${mt(L.vf, igual, n(0), mas, n(3), por, n(10), igual, n(30))}`, `Respuesta: ${q(30, 'm/s')}.`],
      herramienta: { boton: 'Verlo en el radar de pista', icono: 'radar', mesa: 'radar', problema: { v0: 0, a: 3, hasta: 't', t: 10, pista: 200, mide: 'v', pregunta: '¿Qué velocidad lleva a los 10 s?' } }
    },
    // ----- Intermedio -----
    {
      id: 'e4', nivel: 'intermedio', tema: 'mru', tipo: 'numero', respuesta: 60, unidad: 's',
      enunciado: `Un dron recorre ${q(900, 'm')} en línea recta a una velocidad constante de ${q(15, 'm/s')}. ¿Cuántos segundos tarda?`,
      plano: 'Un dron recorre 900 m en línea recta a una velocidad constante de 15 m/s. ¿Cuántos segundos tarda?',
      errores: [
        { valor: 13500, msg: 'Ese resultado sale de multiplicar. Con la t sola, la d va arriba y la v abajo: se divide.' },
        { valor: 885, msg: 'Ese resultado sale de restar 900 − 15. La pregunta es cuántas veces caben 15 m en 900 m.' }
      ],
      pistas: ['Se busca el tiempo: hay que despejar la t de d = v · t.', `${mt(L.t, igual, fr(L.d, L.v), igual, fr(n(900), n(15)))}. De cabeza: ${mt(n(15), por, n(60), igual, n(900))}.`],
      solucion: [`${mt(L.t, igual, fr(L.d, L.v))}`, `${mt(L.t, igual, fr(`${n(900)} ${un('m')}`, `${n(15)} ${un('m/s')}`), igual, n(60), un('s'))}`, `Respuesta: ${q(60, 's')}, es decir, un minuto.`],
      herramienta: { boton: 'Despejar en la balanza', icono: 'balanza', mesa: 'formulas', problema: 'f1' }
    },
    {
      id: 'e5', nivel: 'intermedio', tema: 'mruv', tipo: 'numero', respuesta: 5, unidad: 'm/s²',
      enunciado: `Un avión en la pista pasa de ${q(20, 'm/s')} a ${q(60, 'm/s')} en ${q(8, 's')}, acelerando parejo. ¿Cuál es su aceleración?`,
      plano: 'Un avión en la pista pasa de 20 m/s a 60 m/s en 8 s, acelerando parejo. ¿Cuál es su aceleración?',
      errores: [
        { valor: 10, msg: 'Ese resultado sale de sumar las velocidades: (60 + 20) ÷ 8. Lo que ganó es la diferencia: 60 − 20.' },
        { valor: 7.5, msg: 'Faltó restar la velocidad inicial: no arrancó en 0, sino en 20 m/s.' },
        { valor: 320, msg: 'Ese resultado sale de multiplicar 40 · 8. Lo que ganó se reparte entre los segundos: se divide.' }
      ],
      pistas: ['¿Cuánta velocidad ganó en total? De 20 a 60.', `${mt(L.a, igual, fr(vfv0, L.t), igual, fr(`${n(60)} ${menos} ${n(20)}`, n(8)))}.`],
      solucion: [`Ganó ${mt(n(60), menos, n(20), igual, q(40, 'm/s'))} en 8 s.`, `${mt(L.a, igual, fr(n(40), n(8)), igual, n(5))}`, `Respuesta: ${q(5, 'm/s²')}: cada segundo gana 5 m/s.`],
      herramienta: { boton: 'Despejar en la balanza', icono: 'balanza', mesa: 'formulas', problema: 'f3' }
    },
    {
      id: 'e6', nivel: 'intermedio', tema: 'mruv', tipo: 'numero', respuesta: 50, unidad: 'm',
      enunciado: `Un carro parte del reposo y acelera a ${q(4, 'm/s²')} durante ${q(5, 's')}. ¿Cuántos metros recorre?`,
      plano: 'Un carro parte del reposo y acelera a 4 m/s² durante 5 s. ¿Cuántos metros recorre?',
      errores: [
        { valor: 100, msg: 'Ese resultado sale de multiplicar la velocidad final (20 m/s) por el tiempo, como si hubiera ido a 20 m/s desde el principio. Falta el ½: en promedio fue a 10 m/s.' },
        { valor: 20, msg: 'Esa es la velocidad a los 5 s, en m/s. La pregunta es la distancia.' },
        { valor: 10, msg: 'Ese resultado sale de ½ · 4 · 5: falta el cuadrado del tiempo.' },
        { valor: 200, msg: 'Ese resultado sale de elevar al cuadrado el 4 · 5. Solo la t va al cuadrado: ½ · 4 · 5².' }
      ],
      pistas: ['Parte del reposo: v₀ = 0, y la fórmula de la distancia queda d = ½ · a · t².', `${mt(L.d, igual, medio, por, n(4), por, pot(n(5), 2), igual, medio, por, n(4), por, n(25))}. O con el promedio: fue de 0 a 20 m/s.`],
      solucion: [`${mt(L.d, igual, medio, por, L.a, por, t2)}`, `${mt(L.d, igual, medio, por, n(4), por, n(25), igual, n(2), por, n(25), igual, n(50))}`, `Con el promedio: de 0 a 20 m/s, en promedio 10 m/s, y ${mt(n(10), por, n(5), igual, n(50))}.`, `Respuesta: ${q(50, 'm')}.`],
      herramienta: { boton: 'Verlo en el radar de pista', icono: 'radar', mesa: 'radar', problema: { v0: 0, a: 4, hasta: 't', t: 5, pista: 100, mide: 'd', pregunta: '¿Cuántos metros recorre en 5 s?' } }
    },
    // ----- Tipo examen -----
    // Desde aquí, como en el examen: con calculadora, sin herramientas y con
    // pistas de estrategia (qué pensar), no de cuentas. Las pistas se abren
    // después del primer intento (primeroIntentar en modulo4.js).
    {
      id: 'e7', nivel: 'examen', tema: 'mruv', tipo: 'opciones', correcta: 0,
      enunciado: `Un móvil parte del reposo con aceleración constante. En los primeros ${q(2, 's')} recorre ${q(6, 'm')}. ¿Cuántos metros habrá recorrido a los ${q(4, 's')}?`,
      plano: 'Un móvil parte del reposo con aceleración constante. En los primeros 2 s recorre 6 m. ¿Cuántos metros habrá recorrido a los 4 s?',
      opciones: [q(24, 'm'), q(12, 'm'), q(18, 'm'), q(36, 'm')],
      opcionesPlano: ['24 m', '12 m', '18 m', '36 m'],
      porQue: {
        1: 'El doble de tiempo no da el doble de distancia: además, cada segundo va más rápido. La distancia va con t², y 2² = 4.',
        2: 'Ese resultado sale de sumar otros 6 m dos veces, como si cada segundo recorriera lo mismo. Con aceleración, cada segundo recorre más.',
        3: 'Ese resultado sale de elevar al cuadrado los 6 m. Lo que va al cuadrado es el tiempo: el doble de tiempo, 4 veces la distancia.'
      },
      pistas: ['¿Qué fórmula relaciona la distancia con el tiempo cuando parte del reposo? ¿Qué le pasa a la distancia si el tiempo cambia?', 'Otro camino: con los datos de los primeros 2 s se puede calcular la aceleración, y con ella, la distancia a los 4 s.'],
      solucion: [`Con los primeros datos: ${mt(n(6), igual, medio, por, L.a, por, pot(n(2), 2), igual, n(2), por, L.a)}, así que ${mt(L.a, igual, q(3, 'm/s²'))}.`, `${mt(L.d, igual, medio, por, n(3), por, pot(n(4), 2), igual, medio, por, n(3), por, n(16), igual, n(24))}`, 'Atajo: el doble de tiempo da 4 veces la distancia: 6 · 4 = 24 m. Es lo mismo que se ve en el radar: 1, 4, 9, 16.']
    },
    {
      id: 'e8', nivel: 'examen', tema: 'unidades', tipo: 'opciones', correcta: 0,
      enunciado: `Un avión de pasajeros vuela a ${q(828, 'km/h')} con velocidad constante. ¿Cuántos kilómetros recorre en 2 h 15 min?`,
      plano: 'Un avión de pasajeros vuela a 828 km/h con velocidad constante. ¿Cuántos kilómetros recorre en 2 h 15 min?',
      opciones: [q(1863, 'km'), q(1780.2, 'km'), q(230, 'km'), q(368, 'km')],
      opcionesPlano: ['1863 km', '1780,2 km', '230 km', '368 km'],
      porQue: {
        1: 'Ese resultado sale de escribir 2 h 15 min como 2,15 h. Pero 15 minutos son un cuarto de hora: 2,25 h.',
        2: '828 ÷ 3,6 = 230 es la velocidad en m/s. Aquí no hace falta pasar a m/s: la velocidad está en km/h y el tiempo se pasa a horas.',
        3: 'Ese resultado sale de dividir 828 entre 2,25. Con velocidad constante, la distancia es la velocidad por el tiempo.'
      },
      pistas: ['Las horas y los minutos no se escriben con coma tal cual: ¿qué parte de una hora son 15 minutos?', 'Si la velocidad está en km/h y la pregunta es en km, conviene dejar el tiempo en horas.'],
      solucion: [`${mt('<span>15 min</span>', igual, fr(n(15), n(60)), un('h'), igual, q(0.25, 'h'))}, así que el tiempo es ${q(2.25, 'h')}.`, `${mt(L.d, igual, n(828), por, n(2.25), igual, n(1863))}`, `Respuesta: ${q(1863, 'km')}.`]
    },
    {
      id: 'e9', nivel: 'examen', tema: 'mruv', tipo: 'opciones', correcta: 0,
      enunciado: `Un avión aterriza a ${q(252, 'km/h')} y frena con una aceleración de ${q(-3.5, 'm/s²')}. ¿Cuánto tarda en detenerse?`,
      plano: 'Un avión aterriza a 252 km/h y frena con una aceleración de −3,5 m/s². ¿Cuánto tarda en detenerse?',
      opciones: [q(20, 's'), q(72, 's'), q(-20, 's'), q(245, 's')],
      opcionesPlano: ['20 s', '72 s', '−20 s', '245 s'],
      porQue: {
        1: 'Ese resultado sale de usar los 252 km/h sin convertir. La aceleración está en m/s²: la velocidad tiene que ir en m/s.',
        2: 'Un tiempo no es negativo. Arriba queda 0 menos la velocidad inicial, que es negativo, y abajo la aceleración, también negativa: menos entre menos da más.',
        3: 'Ese resultado sale de multiplicar la velocidad por la aceleración. Cada segundo pierde 3,5 m/s: hay que ver cuántas veces cabe 3,5 en la velocidad.'
      },
      pistas: ['¿Qué dato esconde «detenerse»? ¿Las unidades de la velocidad van con las de la aceleración?', 'Sirve la fórmula de la velocidad, despejada para el tiempo. Ojo con los signos.'],
      solucion: [`${mt(q(252, 'km/h'), entre, n('3,6'), igual, q(70, 'm/s'))}`, `${mt(L.t, igual, fr(vfv0, L.a), igual, fr(`${n(0)} ${menos} ${n(70)}`, neg(-3.5)), igual, fr(n(-70), neg(-3.5)))}`, 'Menos entre menos da más: 70 ÷ 3,5 = 20.', `Respuesta: ${q(20, 's')}.`]
    },
    // ----- Reto: misiones de vuelo, de principio a fin -----
    {
      id: 'e10', nivel: 'reto', tema: 'mision', tipo: 'numero', respuesta: 1339.29, unidad: 'm',
      enunciado: `<b>Misión 1 · despegue.</b> Un avión de pasajeros parte del reposo y acelera parejo a ${q(2.1, 'm/s²')} hasta su velocidad de despegue, ${q(270, 'km/h')}. ¿Cuántos metros de pista usa para despegar?`,
      plano: 'Misión 1, despegue. Un avión de pasajeros parte del reposo y acelera parejo a 2,1 m/s² hasta su velocidad de despegue, 270 km/h. ¿Cuántos metros de pista usa para despegar?',
      errores: [
        { valor: 17357, msg: 'Ese resultado sale de usar los 270 km/h sin convertir. La aceleración está en m/s²: la velocidad tiene que ir en m/s.' },
        { valor: 2678.6, msg: 'Ese resultado sale de multiplicar la velocidad de despegue por el tiempo, como si hubiera ido así desde el principio. Arrancó en 0: falta el ½.' },
        { valor: 35.71, msg: 'Ese es el tiempo hasta despegar, en segundos. Falta la distancia.' },
        { valor: 1360.8, msg: 'Casi. Ese resultado sale de redondear el tiempo a 36 s antes de elevarlo al cuadrado, y el cuadrado agranda la diferencia. Conviene usar el tiempo con todos sus decimales.' }
      ],
      pistas: [
        'Antes de calcular, los datos y las unidades: ¿cuánto vale la velocidad inicial? ¿La velocidad de despegue está en las mismas unidades que la aceleración?',
        'Son dos pasos: con la fórmula de la velocidad se sabe cuánto tarda en llegar a la de despegue; con ese tiempo, la fórmula de la distancia.',
        'En la calculadora, el tiempo va con todos sus decimales (o guardado en la memoria). El cuadrado va solo sobre el tiempo: ½ · a · (t)².'
      ],
      solucion: [`${mt(q(270, 'km/h'), entre, n('3,6'), igual, q(75, 'm/s'))}`, `${mt(L.t, igual, fr(`${n(75)} ${menos} ${n(0)}`, n(2.1)), igual, q(35.71, 's'))}`, `${mt(L.d, igual, medio, por, n(2.1), por, pot(n(35.71), 2), igual, n(1339.3))}`, `Con el promedio: fue de 0 a 75 m/s, en promedio a 37,5 m/s: ${mt(n(37.5), por, n(35.71), igual, n(1339.3))}.`, `Respuesta: unos ${q(1339, 'm')}.`]
    },
    {
      id: 'e11', nivel: 'reto', tema: 'mision', tipo: 'numero', respuesta: 812.5, unidad: 'm',
      enunciado: `<b>Misión 2 · frenado en pista.</b> Un avión toca la pista a ${q(234, 'km/h')} y frena con una aceleración de ${q(-2.6, 'm/s²')} hasta detenerse. ¿Cuántos metros de pista usa al frenar?`,
      plano: 'Misión 2, frenado en pista. Un avión toca la pista a 234 km/h y frena con una aceleración de −2,6 m/s² hasta detenerse. ¿Cuántos metros de pista usa al frenar?',
      errores: [
        { valor: 25, msg: 'Ese es el tiempo de frenado, en segundos. Falta la distancia.' },
        { valor: 1625, msg: 'Ese resultado sale de multiplicar la velocidad de aterrizaje por el tiempo, como si no frenara. Al frenar, cada segundo recorre menos.' },
        { valor: 2437.5, msg: 'El ½ · a · t² es negativo, porque la aceleración es negativa: se resta, no se suma.' },
        { valor: 10530, msg: 'Ese resultado sale de usar los 234 km/h sin convertir. La aceleración está en m/s²: la velocidad tiene que ir en m/s.' }
      ],
      pistas: [
        'Antes de calcular: ¿qué dato esconde «hasta detenerse»? ¿Las unidades coinciden?',
        'Dos pasos, como en el despegue: primero cuánto tarda en frenar; después, cuánta pista usa. La aceleración va con su signo menos en las dos fórmulas.',
        'Para comprobar, sale también con la velocidad promedio: de la velocidad de aterrizaje a 0.'
      ],
      solucion: [`${mt(q(234, 'km/h'), entre, n('3,6'), igual, q(65, 'm/s'))}`, `${mt(L.t, igual, fr(`${n(0)} ${menos} ${n(65)}`, neg(-2.6)), igual, q(25, 's'))}`, `${mt(L.d, igual, n(65), por, n(25), mas, medio, por, neg(-2.6), por, pot(n(25), 2), igual, n(1625), menos, n(812.5), igual, n(812.5))}`, `Con el promedio: ${mt(n(32.5), por, n(25), igual, n(812.5))}.`, `Respuesta: ${q(812.5, 'm')}.`]
    },
    {
      id: 'e12', nivel: 'reto', tema: 'mision', tipo: 'opciones', correcta: 0,
      enunciado: `<b>Misión 3 · una pista corta.</b> Una avioneta de entrenamiento despega cuando llega a ${q(100, 'km/h')}. Parte del reposo y acelera a ${q(1.9, 'm/s²')}. La pista del aeródromo mide ${q(220, 'm')}. ¿Le alcanza para despegar?`,
      plano: 'Misión 3, una pista corta. Una avioneta de entrenamiento despega cuando llega a 100 km/h. Parte del reposo y acelera a 1,9 m/s². La pista del aeródromo mide 220 m. ¿Le alcanza para despegar?',
      opciones: ['Sí le alcanza: necesita unos 203 m', 'No le alcanza: necesita unos 406 m', 'No le alcanza: necesita unos 2632 m', 'Sí le alcanza: necesita unos 15 m'],
      opcionesPlano: ['Sí le alcanza: necesita unos 203 m', 'No le alcanza: necesita unos 406 m', 'No le alcanza: necesita unos 2632 m', 'Sí le alcanza: necesita unos 15 m'],
      porQue: {
        1: 'Los 406 m salen de multiplicar la velocidad de despegue por el tiempo, como si hubiera ido así desde el principio. Arrancó en 0: falta el ½.',
        2: 'Los 2632 m salen de usar los 100 km/h sin convertir a m/s.',
        3: '15 es el tiempo hasta despegar, en segundos, no la distancia.'
      },
      pistas: [
        'Hay que comparar dos distancias: la que necesita para llegar a la velocidad de despegue y la que mide la pista.',
        'Primero las unidades; después, el tiempo hasta despegar y la distancia, como en la misión 1.',
        'En la calculadora conviene no redondear el tiempo antes de elevarlo al cuadrado.'
      ],
      solucion: [`${mt(q(100, 'km/h'), entre, n('3,6'), igual, q(27.78, 'm/s'))}`, `${mt(L.t, igual, fr(n(27.78), n(1.9)), igual, q(14.62, 's'))}`, `${mt(L.d, igual, medio, por, n(1.9), por, pot(n(14.62), 2), igual, q(203, 'm'))}`, 'Necesita unos 203 m y la pista mide 220 m: sí le alcanza, con unos 17 m de margen.']
    }
  ];

  const NIVELES = { basico: 'Básico', intermedio: 'Intermedio', examen: 'Tipo examen', reto: 'Reto' };
  const TEMAS = { mru: 'Velocidad constante', mruv: 'Con aceleración', unidades: 'km/h y m/s', mision: 'Misión de vuelo' };

  /* ---------- Plan de la clase (lo ve el estudiante en la cabecera del módulo) ---------- */
  const PLAN_CLASE = [
    ['5 min', 'Ideas clave, parte 1: distancia, velocidad y tiempo.'],
    ['9 min', 'Radar de pista: el modo libre con velocidad constante y los retos 1 a 3.'],
    ['6 min', 'Ideas clave, parte 2: la aceleración.'],
    ['10 min', 'Radar de pista: el modo libre con aceleración y los retos 4 a 6.'],
    ['6 min', 'Ideas clave, parte 3: las tres fórmulas como balanzas.'],
    ['8 min', 'Fórmulas en la balanza: retos 1, 3 y 5.'],
    ['30 min', 'Entrenamiento, como en el examen: los ejercicios 7 y 9, y las misiones de despegue y de frenado (10 y 11), con calculadora y de principio a fin.'],
    ['3 min', 'Cierre. De tarea: el reto 7 del radar, los retos 2, 4 y 6 de las fórmulas, los ejercicios 1 a 6, el 8 y la misión 3.']
  ];

  MA.M4 = {
    FORMULAS, RETOS_RADAR, RETOS_FORMULAS, EJERCICIOS, NIVELES, TEMAS, PLAN_CLASE,
    L, t2, medio, mov, formulaHtml, balanzaHtml, avionSvg
  };
})();
