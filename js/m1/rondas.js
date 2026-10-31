/* =====================================================================
   Módulo 1 · rondas de práctica
   ---------------------------------------------------------------------
   Cinco habilidades: prefijos, horas y minutos, km/h y m/s, despejes
   con números y todo mezclado. En cada ronda los ejercicios van de lo
   fácil a lo difícil (k es la posición). Los errores típicos se
   calculan con los mismos números y siguen el estilo de la práctica:
   «Ese resultado sale de…». El motor está en js/rondas.js.
   Los ids de las habilidades no se cambian: el dominio se guarda con
   ellos (m1.rondas.<id>).
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { vr, un, n, op, fr, mt, q, tach } = MA.f;
  const por = op('·'), igual = op('='), entre = op('÷'), mas = op('+');
  const qn = (valor, unidad) => `${n(valor)} ${un(unidad)}`;
  const qt = (valor, unidad) => `${n(valor)} ${tach(un(unidad))}`;
  const cad = (...p) => mt(p.join(` ${por} `));
  const r6 = x => Math.round(x * 1e6) / 1e6;   // evita colas como 2,4999999
  const f = MA.fmt;
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };

  /* ---------- Prefijos ---------- */
  const NOMBRE = { km: 'kilómetros', m: 'metros', cm: 'centímetros', mm: 'milímetros', kg: 'kilogramos', g: 'gramos', L: 'litros', mL: 'mililitros', 'm²': 'metros cuadrados', 'cm²': 'centímetros cuadrados' };
  const UNO = { km: 'kilómetro', m: 'metro', cm: 'centímetro', mm: 'milímetro', kg: 'kilogramo', g: 'gramo', L: 'litro', mL: 'mililitro', 'm²': 'metro cuadrado', 'cm²': 'centímetro cuadrado' };
  const PARES = [
    { g: 'km', c: 'm', f: 1000 }, { g: 'm', c: 'cm', f: 100 }, { g: 'm', c: 'mm', f: 1000 },
    { g: 'cm', c: 'mm', f: 10 }, { g: 'kg', c: 'g', f: 1000 }, { g: 'L', c: 'mL', f: 1000 }
  ];
  const AREA = { g: 'm²', c: 'cm²', f: 10000, area: true };
  const LUGARES = { 10: 'un lugar', 100: 'dos lugares', 1000: 'tres lugares', 10000: 'cuatro lugares' };
  const CONFUSO = { 10: 100, 100: 1000, 1000: 100, 10000: 100 };   // el factor que se confunde con el bueno

  const prefijos = {
    id: 'prefijos', nombre: 'Prefijos: kilo, centi y mili', icono: 'regla', porRonda: 8,
    detalle: 'km, m, cm, mm, kg y L. Al final, áreas.',
    generar(R, k) {
      const par = k >= 6 ? AREA : R.elegir(PARES);
      // Al principio, de la unidad grande a la chica; después, al revés y con decimales
      const baja = k < 3 ? true : k < 5 ? false : R.azar() < 0.5;
      const dificil = k >= 5;
      const v = baja
        ? R.elegir(dificil ? [0.8, 0.25, 0.05, 1.2, 0.3, 0.75] : [2, 3, 4, 5, 1.5, 2.5, 3.5])
        : r6(R.elegir(dificil ? [0.8, 0.25, 0.6, 1.2, 0.05] : [1.5, 2.5, 3, 4.5, 6]) * par.f);
      const [de, a] = baja ? [par.g, par.c] : [par.c, par.g];
      const res = r6(baja ? v * par.f : v / par.f);
      const otro = CONFUSO[par.f];
      const malFactor = par.area
        ? 'Ese resultado sale de usar 1 m² = 100 cm². El área se convierte dos veces: 1 m² = 100 cm · 100 cm = 10 000 cm².'
        : `Ese resultado sale de usar ${f(otro)}. La equivalencia es 1 ${par.g} = ${f(par.f)} ${par.c}.`;
      const errores = baja
        ? [{ valor: r6(v / par.f), msg: `Ese resultado sale de dividir entre ${f(par.f)}. Pero el ${UNO[a]} es más chico que el ${UNO[de]}: hacen falta más, así que el número debe crecer.` },
          { valor: r6(v * otro), msg: malFactor }]
        : [{ valor: r6(v * par.f), msg: `Ese resultado sale de multiplicar por ${f(par.f)}. Pero el ${UNO[a]} es más grande que el ${UNO[de]}: hacen falta menos, así que el número debe achicarse.` },
          { valor: r6(v / otro), msg: malFactor }];
      const factor = baja ? fr(qn(par.f, a), qt(1, de)) : fr(qn(1, a), qt(par.f, de));
      return {
        enunciado: `Convertir ${q(v, de)} a ${NOMBRE[a]}.`,
        plano: `Convertir ${f(v)} ${de} a ${NOMBRE[a]}.`,
        respuesta: res, unidad: a, errores,
        pista: `${mt(qn(1, par.g), igual, qn(par.f, par.c))}${par.area ? ', porque 1 m² es 100 cm · 100 cm' : ''}. ¿El número debe crecer o achicarse?`,
        solucion: [
          cad(qt(v, de), factor),
          `${mt(n(v), baja ? por : entre, n(par.f), igual, n(res))}: ${baja ? 'multiplicar por' : 'dividir entre'} ${f(par.f)} corre la coma ${LUGARES[par.f]} a la ${baja ? 'derecha' : 'izquierda'}.`,
          `Respuesta: ${q(res, a)}`
        ]
      };
    }
  };

  /* ---------- Horas, minutos y segundos ---------- */
  // De una unidad a la que es 60 veces más chica (h → min, min → s), con la trampa de leer el decimal como reloj
  function porSesenta(R, dificil, o) {
    const v = R.elegir(dificil ? o.dificiles : o.faciles);
    const res = r6(v * 60), ent = Math.floor(v), dec = r6(v - ent), c = Math.round(dec * 100);
    const ctx = R.elegir(o.contextos);
    const leido = ent ? `${ent} ${o.de} ${c} ${o.a}` : `${c} ${o.a}`;
    const errores = [
      { valor: r6(v * 100), msg: `Ese resultado sale de tomar ${o.unoDe} como 100 ${o.nombreA}. ${o.cuantos}` },
      { valor: v / 60, msg: `Ese resultado sale de dividir entre 60. Los ${o.nombreA} son más chicos que ${o.losDe}: el número debe crecer.` }
    ];
    if (dec) errores.push({ valor: ent * 60 + c, msg: `Ese resultado sale de leer ${f(v)} ${o.de} como ${leido}. Pero ${f(dec)} ${o.de} no son ${c} ${o.a}: son ${f(dec)} · 60 = ${f(r6(dec * 60))} ${o.a}.` });
    return {
      enunciado: `${ctx} ${q(v, o.de)}. ¿Cuántos ${o.nombreA} son?`,
      plano: `${ctx} ${f(v)} ${o.de}. ¿Cuántos ${o.nombreA} son?`,
      respuesta: res, unidad: o.a, errores,
      pista: dec
        ? `${mt(qn(1, o.de), igual, qn(60, o.a))}. Se multiplica todo el número por 60, con decimales y todo.`
        : `${mt(qn(1, o.de), igual, qn(60, o.a))}. ¿El número de ${o.nombreA} debe ser mayor o menor que ${f(v)}?`,
      solucion: [
        cad(qt(v, o.de), fr(qn(60, o.a), qt(1, o.de))),
        `${mt(n(v), por, n(60), igual, n(res))}.${dec && ent ? ` Truco: ${ent} ${o.de} son ${ent * 60} ${o.a} y ${f(dec)} ${o.de} son ${f(r6(dec * 60))} ${o.a}.` : ''}`,
        `Respuesta: ${q(res, o.a)}`
      ]
    };
  }
  const HMIN = {
    de: 'h', a: 'min', nombreA: 'minutos', unoDe: 'la hora', losDe: 'las horas', cuantos: 'Una hora tiene 60.',
    contextos: ['Un vuelo dura', 'Una práctica en el simulador dura', 'Un viaje en bus dura'],
    faciles: [2, 3, 4, 1.5, 2.5, 0.5], dificiles: [1.2, 2.3, 1.4, 3.1, 0.2, 2.25, 1.75]
  };
  const MINS = {
    de: 'min', a: 's', nombreA: 'segundos', unoDe: 'el minuto', losDe: 'los minutos', cuantos: 'Un minuto tiene 60.',
    contextos: ['Un despegue dura', 'Una prueba de motor dura', 'Un ascenso dura'],
    faciles: [2, 3, 5, 1.5, 2.5, 4], dificiles: [1.3, 1.2, 2.1, 0.4, 1.25, 0.75]
  };
  const TIEMPO = {
    hmin: (R, dificil) => porSesenta(R, dificil, HMIN),
    mins: (R, dificil) => porSesenta(R, dificil, MINS),
    hs(R) {
      const v = R.elegir([1, 2, 3, 0.5, 1.5, 0.25]), res = r6(v * 3600);
      return {
        enunciado: `¿Cuántos segundos son ${q(v, 'h')}?`, plano: `¿Cuántos segundos son ${f(v)} h?`,
        respuesta: res, unidad: 's',
        errores: [
          { valor: r6(v * 60), msg: 'Eso está en minutos: falta pasar de minutos a segundos, otra vez por 60.' },
          { valor: r6(v * 10000), msg: 'Ese resultado sale de tomar la hora como 100 minutos y el minuto como 100 segundos. Son 60 y 60.' },
          { valor: v / 3600, msg: 'Ese resultado sale de dividir. Los segundos son mucho más chicos que las horas: el número debe crecer.' }
        ],
        pista: `${mt(qn(1, 'h'), igual, qn(60, 'min'))} y ${mt(qn(1, 'min'), igual, qn(60, 's'))}: hacen falta dos factores.`,
        solucion: [
          cad(qt(v, 'h'), fr(qt(60, 'min'), qt(1, 'h')), fr(qn(60, 's'), qt(1, 'min'))),
          mt(n(v), por, n(60), por, n(60), igual, n(v), por, n(3600), igual, n(res)),
          `Respuesta: ${q(res, 's')}. Atajo: ${mt(qn(1, 'h'), igual, qn(3600, 's'))}.`
        ]
      };
    },
    minh(R, dificil) {
      const v = R.elegir(dificil ? [75, 105, 135, 12, 36, 6] : [30, 15, 45, 90]);
      const res = r6(v / 60), g = mcd(v, 60), horas = Math.floor(v / 60), resto = v % 60;
      const errores = [
        { valor: v * 60, msg: 'Ese resultado sale de multiplicar por 60. Las horas son más grandes que los minutos: el número debe achicarse.' },
        { valor: v / 100, msg: 'Ese resultado sale de tomar la hora como 100 minutos. Una hora tiene 60.' }
      ];
      if (horas && resto) errores.push({ valor: horas + resto / 100, msg: `Ese resultado sale de escribir ${horas} h ${resto} min como ${f(horas + resto / 100)} h. Pero ${resto} min son ${f(r6(resto / 60))} h, no ${f(resto / 100)} h.` });
      return {
        enunciado: `¿Cuántas horas son ${q(v, 'min')}?`, plano: `¿Cuántas horas son ${v} min?`,
        respuesta: res, unidad: 'h', errores,
        pista: `${mt(qn(1, 'h'), igual, qn(60, 'min'))}. Para pasar a horas se divide entre 60: ¿cuántas veces caben 60 minutos en ${v}?`,
        solucion: [
          cad(qt(v, 'min'), fr(qn(1, 'h'), qt(60, 'min'))),
          mt(fr(n(v), n(60)), igual, ...(g > 1 ? [fr(n(v / g), n(60 / g)), igual] : []), n(res)),
          `Respuesta: ${q(res, 'h')}`
        ]
      };
    },
    // Dos unidades juntas: 2 h 15 min o 1 min 20 s
    mixto(R) {
      const [g, c, nombreC, ctx] = R.azar() < 0.5 ? ['h', 'min', 'minutos', 'Un vuelo dura'] : ['min', 's', 'segundos', 'Un ascenso dura'];
      const x = g === 'h' ? R.ent(1, 3) : R.ent(1, 4);
      const y = R.elegir(g === 'h' ? [10, 15, 20, 25, 35, 40, 45, 50] : [10, 15, 20, 30, 40, 45]);
      const res = x * 60 + y, unoG = g === 'h' ? 'la hora' : 'el minuto';
      return {
        enunciado: `${ctx} ${mt(qn(x, g), qn(y, c))}. ¿Cuántos ${nombreC} son en total?`,
        plano: `${ctx} ${x} ${g} ${y} ${c}. ¿Cuántos ${nombreC} son en total?`,
        respuesta: res, unidad: c,
        errores: [
          { valor: r6((x + y / 100) * 60), msg: `Ese resultado sale de leer ${x} ${g} ${y} ${c} como ${f(x + y / 100)} ${g}. Pero los ${nombreC} van de 60 en 60: cada parte se convierte por separado y después se suma.` },
          { valor: x * 100 + y, msg: `Ese resultado sale de tomar ${unoG} como 100 ${nombreC}. Son 60: ${x} ${g} son ${x * 60} ${c}.` },
          { valor: x * 60, msg: `Faltó sumar los ${y} ${c}.` }
        ],
        pista: `Son dos unidades juntas: primero se pasan ${g === 'h' ? 'las horas' : 'los minutos'} a ${nombreC} y después se suman los ${nombreC} que ya estaban.`,
        solucion: [
          mt(qn(x, g), igual, n(x), por, qn(60, c), igual, qn(x * 60, c)),
          mt(qn(x * 60, c), mas, qn(y, c), igual, qn(res, c)),
          `Respuesta: ${q(res, c)}`
        ]
      };
    }
  };
  const tiempo = {
    id: 'tiempo', nombre: 'Horas, minutos y segundos', icono: 'reloj', porRonda: 8,
    detalle: 'De 60 en 60, con la trampa de los decimales.',
    generar(R, k) {
      const tipo = ['hmin', 'mins', 'hs', 'minh', 'mixto', R.elegir(['minh', 'mixto']), 'hmin', 'mins'][k];
      return TIEMPO[tipo](R, k >= 5);
    }
  };

  /* ---------- km/h y m/s ---------- */
  const QUIEN_VUELA = ['Un helicóptero vuela a', 'Una avioneta despega a', 'Un carro va a', 'Un dron vuela a', 'Un tren va a'];
  const velocidad = {
    id: 'velocidad', nombre: 'km/h y m/s', icono: 'intercambiar', porRonda: 8,
    detalle: 'Dos factores a la vez y el atajo del 3,6.',
    generar(R, k) {
      const aMs = k < 4 ? true : k < 6 ? false : R.azar() < 0.5;
      const ms = R.elegir(k < 6 ? [5, 10, 15, 20, 25, 30] : [40, 50, 60, 12.5, 2.5, 35]);
      const kmh = r6(ms * 3.6);
      const ctx = R.elegir(QUIEN_VUELA);
      const [v, de, a, res] = aMs ? [kmh, 'km/h', 'm/s', ms] : [ms, 'm/s', 'km/h', kmh];
      const comun = {
        enunciado: `${ctx} ${q(v, de)}. ¿Cuánto es en ${a}?`,
        plano: `${ctx} ${f(v)} ${de}. ¿Cuánto es en ${a}?`,
        respuesta: res, unidad: a
      };
      if (aMs) return Object.assign(comun, {
        errores: [
          { valor: r6(kmh * 3.6), msg: 'Ese resultado sale de multiplicar por 3,6. De km/h a m/s el número se achica: se divide entre 3,6.' },
          { valor: kmh * 1000, msg: 'Ahí se convirtieron los km a m, pero faltó pasar las horas a segundos.' },
          { valor: kmh / 3600, msg: 'Ahí se pasaron las horas a segundos, pero faltó convertir los km a metros.' },
          { valor: kmh * 1000 / 60, msg: 'Ese resultado sale de usar 1 h = 60 s. Una hora tiene 3600 s.' }
        ],
        pista: 'Hacen falta dos factores: uno que cancele los km (arriba) y otro que cancele las h (abajo).',
        solucion: [
          cad(fr(qt(kmh, 'km'), qt(1, 'h')), fr(qn(1000, 'm'), qt(1, 'km')), fr(qt(1, 'h'), qn(3600, 's'))),
          `${mt(fr(`${n(kmh)} ${por} ${n(1000)}`, n(3600)), igual, n(ms))}. Atajo: ${mt(n(kmh), entre, n(3.6), igual, n(r6(kmh * 10)), entre, n(36), igual, n(ms))}.`,
          `Respuesta: ${q(ms, 'm/s')}`
        ]
      });
      return Object.assign(comun, {
        errores: [
          { valor: ms / 3.6, msg: 'Ese resultado sale de dividir entre 3,6. De m/s a km/h el número crece: se multiplica por 3,6.' },
          { valor: ms / 1000, msg: 'Ahí se pasaron los metros a km, pero faltó pasar los segundos a horas.' },
          { valor: ms * 3600, msg: 'Ahí se pasaron los segundos a horas, pero faltó pasar los metros a km.' },
          { valor: r6(ms * 60 / 1000), msg: 'Ese resultado sale de usar 1 h = 60 s. Una hora tiene 3600 s.' }
        ],
        pista: 'Hacen falta dos factores: uno que cancele los m (arriba) y otro que cancele los s (abajo).',
        solucion: [
          cad(fr(qt(ms, 'm'), qt(1, 's')), fr(qn(1, 'km'), qt(1000, 'm')), fr(qt(3600, 's'), qn(1, 'h'))),
          `${mt(fr(`${n(ms)} ${por} ${n(3600)}`, n(1000)), igual, n(kmh))}. Atajo: ${mt(n(ms), por, n(3.6), igual, n(kmh))}.`,
          `Respuesta: ${q(kmh, 'km/h')}`
        ]
      });
    }
  };

  /* ---------- Despejar y reemplazar ---------- */
  const FORMULA = {
    dvt: mt(vr('d'), igual, vr('v'), por, vr('t')),
    fma: mt(vr('F'), igual, vr('m'), por, vr('a')),
    vat: mt(vr('v', 'f'), igual, vr('v', '0'), mas, vr('a'), por, vr('t'))
  };
  const PLANO = { dvt: 'd = v · t', fma: 'F = m · a', vat: 'vf = v0 + a · t' };
  // Despeje de una multiplicación: incógnita = conocido ÷ divisor
  function despejeSimple(o) {
    const sinComa = o.divisor % 1 !== 0;   // 4500 ÷ 1,5: arriba y abajo por 2
    const g = Number.isInteger(o.conocido) && Number.isInteger(o.divisor) ? mcd(o.conocido, o.divisor) : 1;
    const pasos = [fr(n(o.conocido), n(o.divisor))];
    if (sinComa) pasos.push(fr(n(r6(o.conocido * 2)), n(r6(o.divisor * 2))));
    else if (g > 1 && g !== o.divisor) pasos.push(fr(n(o.conocido / g), n(o.divisor / g)));
    return {
      enunciado: o.enunciado, plano: o.plano, respuesta: o.res, unidad: o.unidad,
      errores: [
        { valor: o.conocido * o.divisor, msg: `Ese resultado sale de multiplicar ${o.letraConocido} · ${o.letraDivisor}. La ${o.incognita} está multiplicada por la ${o.letraDivisor}: se dividen los dos lados entre ${o.letraDivisor}.` },
        { valor: o.divisor / o.conocido, msg: `Esa es la división al revés: ${o.incognita} = ${o.letraConocido} ÷ ${o.letraDivisor}.` }
      ],
      pista: `La ${vr(o.incognita)} está multiplicada por la ${vr(o.letraDivisor)}: se dividen los dos lados entre ${vr(o.letraDivisor)}.`,
      solucion: [
        `${FORMULA[o.formula]} → se dividen los dos lados entre ${vr(o.letraDivisor)} → ${mt(vr(o.incognita), igual, fr(vr(o.letraConocido), vr(o.letraDivisor)))}`,
        `${mt(vr(o.incognita), igual, pasos.join(` ${igual} `), igual, n(o.res))}${sinComa ? ': arriba y abajo por 2, para quitar la coma.' : ''}`,
        `Respuesta: ${q(o.res, o.unidad)}${o.extra || ''}`
      ]
    };
  }
  const DESPEJES = {
    dt(R, k) {
      const v = R.elegir([60, 80, 90, 120, 200, 300, 400, 500, 600, 800]);
      const t = R.elegir(k < 4 ? [2, 3, 4, 5] : [1.5, 2.5, 0.5, 3.5]);
      const d = r6(v * t);
      const quien = v > 150 ? 'Un avión' : R.elegir(['Un carro', 'Un bus', 'Un helicóptero']);
      const min = r6((t % 1) * 60);
      return despejeSimple({
        formula: 'dvt', incognita: 't', letraConocido: 'd', letraDivisor: 'v', conocido: d, divisor: v, res: t, unidad: 'h',
        enunciado: `${quien} va a ${q(v, 'km/h')}, siempre a la misma velocidad. Con ${FORMULA.dvt}, ¿cuánto tarda en recorrer ${q(d, 'km')}?`,
        plano: `${quien} va a ${v} km/h, siempre a la misma velocidad. Con ${PLANO.dvt}, ¿cuánto tarda en recorrer ${f(d)} km?`,
        extra: t % 1 ? `, es decir, ${Math.floor(t) ? `${Math.floor(t)} h y ` : ''}${min} min.` : ''
      });
    },
    dv(R) {
      const v = R.elegir([60, 80, 90, 120, 300, 400, 500, 600, 800]), t = R.elegir([2, 3, 4, 5]), d = v * t;
      const quien = v > 150 ? 'Un avión' : R.elegir(['Un carro', 'Un bus']);
      return despejeSimple({
        formula: 'dvt', incognita: 'v', letraConocido: 'd', letraDivisor: 't', conocido: d, divisor: t, res: v, unidad: 'km/h',
        enunciado: `${quien} recorre ${q(d, 'km')} en ${q(t, 'h')}, siempre a la misma velocidad. Con ${FORMULA.dvt}, ¿cuál es su velocidad?`,
        plano: `${quien} recorre ${f(d)} km en ${t} h, siempre a la misma velocidad. Con ${PLANO.dvt}, ¿cuál es su velocidad?`
      });
    },
    fm(R) {
      const m = R.elegir([500, 800, 1000, 1200, 1500, 2000, 2500, 3000]), a = R.elegir([0.5, 1.5, 2, 2.5, 3, 4]), F = r6(m * a);
      return despejeSimple({
        formula: 'fma', incognita: 'm', letraConocido: 'F', letraDivisor: 'a', conocido: F, divisor: a, res: m, unidad: 'kg',
        enunciado: `El motor de una avioneta produce una fuerza neta de ${q(F, 'N')} y le da una aceleración de ${q(a, 'm/s²')}. Con ${FORMULA.fma}, ¿cuál es la masa de la avioneta?`,
        plano: `El motor de una avioneta produce una fuerza neta de ${f(F)} N y le da una aceleración de ${f(a)} m/s². Con ${PLANO.fma}, ¿cuál es la masa de la avioneta?`
      });
    },
    fa(R) {
      const m = R.elegir([800, 1000, 1200, 1500, 2000]), a = R.elegir([0.5, 1.5, 2, 2.5, 3]), F = r6(m * a);
      return despejeSimple({
        formula: 'fma', incognita: 'a', letraConocido: 'F', letraDivisor: 'm', conocido: F, divisor: m, res: a, unidad: 'm/s²',
        enunciado: `Una fuerza neta de ${q(F, 'N')} empuja un carro de ${q(m, 'kg')}. Con ${FORMULA.fma}, ¿qué aceleración le da?`,
        plano: `Una fuerza neta de ${f(F)} N empuja un carro de ${f(m)} kg. Con ${PLANO.fma}, ¿qué aceleración le da?`
      });
    },
    vt0(R) {
      const a = R.ent(2, 5), t = R.ent(4, 15), vf = a * t;
      return {
        enunciado: `Un avión parte del reposo y llega a ${q(vf, 'm/s')} con una aceleración constante de ${q(a, 'm/s²')}. Con ${FORMULA.vat}, ¿cuánto tarda?`,
        plano: `Un avión parte del reposo y llega a ${vf} m/s con una aceleración constante de ${a} m/s². Con ${PLANO.vat}, ¿cuánto tarda?`,
        respuesta: t, unidad: 's',
        errores: [
          { valor: vf * a, msg: 'Ese resultado sale de multiplicar vf · a. La t está multiplicada por la a: hay que dividir entre a.' },
          { valor: a / vf, msg: 'Esa es la división al revés: t = vf ÷ a.' },
          { valor: vf - a, msg: 'Ese resultado sale de restar la aceleración. La a no suma: multiplica a la t, así que se divide entre a.' }
        ],
        pista: `«Parte del reposo» quiere decir que la velocidad inicial es cero: ${mt(vr('v', '0'), igual, n(0))}.`,
        solucion: [
          `${mt(vr('v', '0'), igual, n(0))}, porque parte del reposo: queda ${mt(vr('v', 'f'), igual, vr('a'), por, vr('t'))}.`,
          `Se dividen los dos lados entre ${vr('a')}: ${mt(vr('t'), igual, fr(vr('v', 'f'), vr('a')), igual, fr(n(vf), n(a)), igual, n(t))}`,
          `Respuesta: ${q(t, 's')}`
        ]
      };
    },
    // vf = v0 + a · t, con v0 distinto de cero: se busca t o a
    vt(R) { return dosPasos(R, 't'); },
    va(R) { return dosPasos(R, 'a'); }
  };
  function dosPasos(R, busca) {
    const v0 = R.elegir(busca === 't' ? [5, 10, 15, 20] : [10, 20, 30, 40]);
    const a = R.ent(2, busca === 't' ? 5 : 6), t = busca === 't' ? R.ent(3, 10) : R.elegir([4, 5, 8, 10]);
    const vf = v0 + a * t;
    const [res, otra, unidad] = busca === 't' ? [t, a, 's'] : [a, t, 'm/s²'];
    const quien = R.elegir(['Un carro', 'Una avioneta', 'Un tren']);
    const enunciado = busca === 't'
      ? `${quien} va a ${q(v0, 'm/s')} y acelera a ${q(a, 'm/s²')} hasta llegar a ${q(vf, 'm/s')}. Con ${FORMULA.vat}, ¿cuánto tarda?`
      : `Un avión pasa de ${q(v0, 'm/s')} a ${q(vf, 'm/s')} en ${q(t, 's')}. Con ${FORMULA.vat}, ¿cuál es su aceleración?`;
    const plano = busca === 't'
      ? `${quien} va a ${v0} m/s y acelera a ${a} m/s² hasta llegar a ${vf} m/s. Con ${PLANO.vat}, ¿cuánto tarda?`
      : `Un avión pasa de ${v0} m/s a ${vf} m/s en ${t} s. Con ${PLANO.vat}, ¿cuál es su aceleración?`;
    const L = busca === 't' ? 'a' : 't';   // la que divide
    return {
      enunciado, plano, respuesta: res, unidad,
      errores: [
        { valor: (vf + v0) / otra, msg: 'El v₀ está sumando: para quitarlo se resta, no se suma.' },
        { valor: vf / otra - v0, msg: `Ahí se dividió entre ${L} solo una parte. Primero se resta v₀ en los dos lados y después se divide toda la resta entre ${L}.` },
        { valor: vf / otra, msg: 'Faltó restar v₀ antes de dividir.' },
        { valor: (vf - v0) * otra, msg: `La ${busca} está multiplicada por la ${L}: para quitarla se divide, no se multiplica.` }
      ],
      pista: `Regla de oro: primero se quita lo que suma (${vr('v', '0')}); después, lo que multiplica (${vr(L)}).`,
      solucion: [
        `Se resta ${vr('v', '0')} en los dos lados: ${mt(vr('v', 'f'), op('−'), vr('v', '0'), igual, vr('a'), por, vr('t'))}`,
        `Se dividen los dos lados entre ${vr(L)}: ${mt(vr(busca), igual, fr(`${vr('v', 'f')} ${op('−')} ${vr('v', '0')}`, vr(L)))}`,
        mt(vr(busca), igual, fr(`${n(vf)} ${op('−')} ${n(v0)}`, n(otra)), igual, fr(n(vf - v0), n(otra)), igual, q(res, unidad))
      ]
    };
  }
  const despejes = {
    id: 'despejes', nombre: 'Despejar y reemplazar', icono: 'balanza', porRonda: 8,
    detalle: 'd = v · t, F = m · a y vf = v₀ + a · t, con números.',
    generar(R, k) { return DESPEJES[['dt', 'dv', 'fm', 'fa', 'dt', 'vt0', 'vt', 'va'][k]](R, k); }
  };

  /* ---------- Todo mezclado ---------- */
  // Despejar y convertir a la vez: la velocidad en km/h y el tiempo en minutos
  function combinado(R) {
    const v = R.elegir([60, 90, 120, 180]), tm = R.elegir([10, 15, 20, 30, 40, 45]);
    const d = r6(v * tm / 60), g = mcd(tm, 60);
    return {
      enunciado: `Un carro viaja a ${q(v, 'km/h')} durante ${q(tm, 'min')}. Con ${FORMULA.dvt}, ¿qué distancia recorre, en kilómetros?`,
      plano: `Un carro viaja a ${v} km/h durante ${tm} min. Con d = v · t, ¿qué distancia recorre, en kilómetros?`,
      respuesta: d, unidad: 'km',
      errores: [
        { valor: v * tm, msg: `Ese resultado sale de multiplicar ${v} · ${tm} sin convertir: km/h por min no da km. Primero hay que pasar los minutos a horas.` },
        { valor: v / tm, msg: 'Ese resultado sale de dividir. La fórmula es d = v · t, con el tiempo en horas.' },
        { valor: r6(v * tm / 100), msg: 'Ese resultado sale de tomar la hora como 100 minutos. Una hora tiene 60.' }
      ],
      pista: 'Las unidades tienen que coincidir: la velocidad está en km/h, así que el tiempo va en horas.',
      solucion: [
        `Se convierte el tiempo: ${cad(qt(tm, 'min'), fr(qn(1, 'h'), qt(60, 'min')))} ${igual} ${mt(fr(n(tm / g), n(60 / g)), un('h'))}`,
        mt(vr('d'), igual, vr('v'), por, vr('t'), igual, n(v), por, fr(n(tm / g), n(60 / g)), igual, q(d, 'km')),
        `Respuesta: ${q(d, 'km')}`
      ]
    };
  }
  const mezcla = {
    id: 'mezcla', nombre: 'Todo mezclado', icono: 'objetivo', porRonda: 8,
    detalle: 'Un poco de cada una, sin saber cuál viene, y una que junta despeje y conversión.',
    generarRonda(R) {
      const fuentes = R.barajar([
        () => prefijos.generar(R, 4), () => prefijos.generar(R, 7),
        () => tiempo.generar(R, 4), () => tiempo.generar(R, 6),
        () => velocidad.generar(R, 2), () => velocidad.generar(R, 5),
        () => despejes.generar(R, 3), () => despejes.generar(R, 6),
        () => combinado(R)
      ]).slice(0, 8);
      const lista = [];
      fuentes.forEach(fn => lista.push(R.distinto(lista, fn)));
      return lista;
    }
  };

  MA.M1.RONDAS = [prefijos, tiempo, velocidad, despejes, mezcla];
})();
