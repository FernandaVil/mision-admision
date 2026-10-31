/* =====================================================================
   Módulo 2 · rondas de práctica
   ---------------------------------------------------------------------
   Cuatro habilidades propias (sumar y restar fracciones, multiplicar y
   dividir, orden de las operaciones y potencias con letras), el radar
   de signos, que vive en su sección pero sus rondas cuentan igual, y
   todo mezclado. Para dividir se usan extremos y medios, con
   sus colores, como en la mesa. El motor está en js/rondas.js.
   Los ids de las habilidades no se cambian (m2.rondas.<id>).
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { vr, un, n, op, fr, mt, q, tach, doble, ext, med, pega } = MA.f;
  const { pot, neg } = MA.M2;
  const por = op('·'), igual = op('='), entre = op('÷'), mas = op('+'), menos = op('−');
  const prod = (...xs) => xs.join(` ${por} `);
  const parentesis = html => `${op('(')}${html}${op(')')}`;
  const f = MA.fmt;
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  // Fracción simplificada: [arriba, abajo, el número entre el que se dividió]
  const simp = (p, q) => { const g = mcd(p, q); return [p / g, q / g, g]; };
  const fx = (p, q) => (q === 1 ? n(p) : fr(n(p), n(q)));
  const simplificar = (a, b, p, q, g) => (g > 1
    ? `${mt(fr(n(a), n(b)), igual, fx(p, q))}: arriba y abajo entre ${g}.`
    : 'No se puede simplificar: arriba y abajo no tienen un divisor en común.');

  /* ---------- Sumar y restar fracciones ---------- */
  function mismoAbajo(R, resta) {
    const b = R.ent(3, 9);
    const a = resta ? R.ent(2, b - 1) : R.ent(1, b - 1);
    const c = resta ? R.ent(1, a - 1) : R.ent(1, b - 1);
    const arriba = resta ? a - c : a + c;
    const [p, q, g] = simp(arriba, b);
    const s = resta ? menos : mas, st = resta ? '−' : '+';
    return {
      enunciado: `Calcular ${mt(fr(n(a), n(b)), s, fr(n(c), n(b)))}.`,
      plano: `Calcular ${a}/${b} ${st} ${c}/${b}.`,
      respuesta: p / q,
      errores: resta ? [] : [{ valor: arriba / (2 * b), msg: `Ese resultado sale de sumar también los de abajo. Con el mismo abajo, los pedazos son del mismo tamaño: abajo queda ${b}.` }],
      pista: `Abajo hay el mismo número: son pedazos del mismo tamaño. Solo se ${resta ? 'restan' : 'suman'} los de arriba.`,
      solucion: [
        mt(fr(n(a), n(b)), s, fr(n(c), n(b)), igual, fr(`${n(a)} ${s} ${n(c)}`, n(b)), igual, fr(n(arriba), n(b))),
        ...(g > 1 ? [simplificar(arriba, b, p, q, g)] : [])
      ]
    };
  }
  function mariposa(R, resta) {
    let a, b, c, d;
    do {
      b = R.ent(2, 9); d = R.ent(2, 9);
      a = R.ent(1, b - 1); c = R.ent(1, d - 1);
      if (resta && a * d < b * c) [a, b, c, d] = [c, d, a, b];
    } while (b === d || a * d === b * c || mcd(a, b) > 1 || mcd(c, d) > 1);
    const ad = a * d, bc = b * c, bd = b * d;
    const arriba = resta ? ad - bc : ad + bc;
    const [p, q, g] = simp(arriba, bd);
    const s = resta ? menos : mas, st = resta ? '−' : '+';
    const errores = [
      { valor: resta ? (a - c) / (b - d) : (a + c) / (b + d), msg: `Ese resultado sale de ${resta ? 'restar' : 'sumar'} arriba con arriba y abajo con abajo. Con distinto abajo hace falta la mariposa.` },
      { valor: arriba / (b + d), msg: `En la mariposa, abajo se multiplica: ${b} · ${d} = ${bd}.` }
    ];
    if (resta) errores.push({ valor: -arriba / bd, msg: `El número está bien, pero el signo no: primero va el producto de la izquierda (${a} · ${d}) y después se resta el otro (${b} · ${c}).` });
    return {
      enunciado: `Calcular ${mt(fr(n(a), n(b)), s, fr(n(c), n(d)))}.`,
      plano: `Calcular ${a}/${b} ${st} ${c}/${d}.`,
      respuesta: p / q, errores,
      pista: `Abajo hay ${b} y ${d}: distinto abajo. Va la mariposa: en cruz arriba, abajo con abajo.`,
      solucion: [
        mt(fr(n(a), n(b)), s, fr(n(c), n(d)), igual, fr(`${ext(prod(n(a), n(d)))} ${s} ${ext(prod(n(b), n(c)))}`, med(prod(n(b), n(d)))), igual, fr(`${n(ad)} ${s} ${n(bc)}`, n(bd)), igual, fr(n(arriba), n(bd))),
        simplificar(arriba, bd, p, q, g)
      ]
    };
  }
  function conEntero(R) {
    const w = R.ent(1, 3), d = R.ent(2, 9), c = R.ent(1, d - 1), resta = R.azar() < 0.5;
    const arriba = resta ? w * d - c : w * d + c;
    const [p, q, g] = simp(arriba, d);
    const s = resta ? menos : mas, st = resta ? '−' : '+';
    return {
      enunciado: `Calcular ${mt(n(w), s, fr(n(c), n(d)))}.`,
      plano: `Calcular ${w} ${st} ${c}/${d}.`,
      respuesta: p / q,
      errores: [
        { valor: (resta ? w - c : w + c) / d, msg: `El entero lleva un 1 abajo: ${w} = ${w}/1. Con la mariposa, arriba queda ${w} · ${d} ${st} 1 · ${c}.` },
        { valor: (resta ? w - c : w + c) / (1 + d), msg: `Ese resultado sale de ${resta ? 'restar' : 'sumar'} arriba con arriba y abajo con abajo. Con distinto abajo hace falta la mariposa.` }
      ],
      pista: `Lo que no es fracción lleva un 1 abajo: ${mt(n(w), igual, fr(n(w), n(1)))}. Después, la mariposa.`,
      solucion: [
        mt(fr(n(w), n(1)), s, fr(n(c), n(d)), igual, fr(`${ext(prod(n(w), n(d)))} ${s} ${ext(prod(n(1), n(c)))}`, med(prod(n(1), n(d)))), igual, fr(n(arriba), n(d))),
        ...(g > 1 ? [simplificar(arriba, d, p, q, g)] : [])
      ]
    };
  }
  const sumas = {
    id: 'sumas', nombre: 'Sumar y restar fracciones', icono: 'regla', porRonda: 8,
    detalle: 'Mismo abajo, la mariposa y un entero con una fracción.',
    generar(R, k) {
      if (k < 2) return mismoAbajo(R, k === 1);
      if (k < 7) return mariposa(R, k >= 5);
      return conEntero(R);
    }
  };

  /* ---------- Multiplicar y dividir fracciones ---------- */
  // Dos fracciones ya simplificadas (el enunciado nunca trae 8/4) y distintas entre sí
  function dosFracciones(R) {
    let a, b, c, d;
    do { a = R.ent(1, 9); b = R.ent(2, 9); c = R.ent(1, 9); d = R.ent(2, 9); } while (mcd(a, b) > 1 || mcd(c, d) > 1 || a * d === b * c);
    return [a, b, c, d];
  }
  function multiplicarFr(R) {
    const [a, b, c, d] = dosFracciones(R);
    const [p, q, g] = simp(a * c, b * d);
    return {
      enunciado: `Calcular ${mt(fr(n(a), n(b)), por, fr(n(c), n(d)))}.`, plano: `Calcular ${a}/${b} · ${c}/${d}.`,
      respuesta: p / q,
      errores: [
        { valor: (a * d) / (b * c), msg: 'Ese resultado sale de usar extremos y medios, que es para dividir. Al multiplicar: arriba con arriba y abajo con abajo.' },
        { valor: (a + c) / (b + d), msg: 'Ese resultado sale de sumar. Al multiplicar: arriba con arriba y abajo con abajo, multiplicando.' }
      ],
      pista: 'Arriba con arriba y abajo con abajo. Antes de multiplicar, conviene tachar.',
      solucion: [
        mt(fr(n(a), n(b)), por, fr(n(c), n(d)), igual, fr(prod(n(a), n(c)), prod(n(b), n(d))), igual, fr(n(a * c), n(b * d))),
        simplificar(a * c, b * d, p, q, g)
      ]
    };
  }
  function dividirFr(R) {
    const [a, b, c, d] = dosFracciones(R);
    const [p, q, g] = simp(a * d, b * c);
    return {
      enunciado: `Calcular ${mt(fr(n(a), n(b)), entre, fr(n(c), n(d)))}.`, plano: `Calcular ${a}/${b} ÷ ${c}/${d}.`,
      respuesta: p / q,
      errores: [
        { valor: (a * c) / (b * d), msg: `Ese resultado sale de multiplicar las dos fracciones tal como están. Para dividir: extremos arriba (${a} · ${d}) y medios abajo (${b} · ${c}).` },
        { valor: (b * c) / (a * d), msg: `Ese resultado está al revés: quedaron arriba los medios. Arriba van los extremos, ${a} · ${d}, y abajo los medios, ${b} · ${c}.` }
      ],
      pista: `Una encima de la otra: ${mt(doble(fr(n(a), n(b)), fr(n(c), n(d))))}. Extremos arriba, medios abajo.`,
      solucion: [
        mt(doble(fr(ext(n(a)), med(n(b))), fr(med(n(c)), ext(n(d)))), igual, fr(`${ext(n(a))} ${por} ${ext(n(d))}`, `${med(n(b))} ${por} ${med(n(c))}`), igual, fr(n(a * d), n(b * c))),
        simplificar(a * d, b * c, p, q, g)
      ]
    };
  }
  function enteroEntreFr(R) {
    let c, d;
    do { c = R.ent(1, 4); d = R.ent(2, 9); } while (c === d || mcd(c, d) > 1);
    const m = R.ent(2, 4), w = c * m, res = m * d;
    return {
      enunciado: `Calcular ${mt(n(w), entre, fr(n(c), n(d)))}.`, plano: `Calcular ${w} ÷ ${c}/${d}.`,
      respuesta: res,
      errores: [
        { valor: w / d, msg: `Ese resultado sale de dividir ${w} entre ${d}. Pero el ${d} está abajo del abajo: es un extremo y sube, así que multiplica.` },
        { valor: (w * c) / d, msg: 'Ese resultado sale de multiplicar tal como está. Para dividir: una encima de la otra, extremos arriba y medios abajo.' },
        { valor: c / (w * d), msg: `Ese resultado está al revés: quedaron arriba los medios. Arriba van los extremos, ${w} · ${d}.` }
      ],
      pista: `Lo que no es fracción lleva un 1 abajo: ${mt(doble(fr(n(w), n(1)), fr(n(c), n(d))))}. Extremos arriba, medios abajo.`,
      solucion: [
        mt(n(w), entre, fr(n(c), n(d)), igual, doble(fr(ext(n(w)), med(n(1))), fr(med(n(c)), ext(n(d)))), igual, fr(`${ext(n(w))} ${por} ${ext(n(d))}`, `${med(n(1))} ${por} ${med(n(c))}`), igual, fr(n(w * d), n(c)), igual, n(res)),
        c === 1 ? `En cada unidad caben ${d} pedazos de ${fr(n(1), n(d))}; en ${w} unidades, ${res}.` : `Respuesta: ${res}.`
      ]
    };
  }
  function frEntreEntero(R) {
    let a, b;
    do { a = R.ent(1, 9); b = R.ent(2, 9); } while (mcd(a, b) > 1);
    const w = R.ent(2, 5);
    const [p, q, g] = simp(a, b * w);
    return {
      enunciado: `Calcular ${mt(fr(n(a), n(b)), entre, n(w))}.`, plano: `Calcular ${a}/${b} ÷ ${w}.`,
      respuesta: p / q,
      errores: [
        { valor: (a * w) / b, msg: `Ese resultado sale de multiplicar por ${w}. El ${w} lleva un 1 abajo (${w}/1) y es un medio, así que va abajo.` },
        { valor: (b * w) / a, msg: 'Ese resultado está al revés: quedaron arriba los medios.' }
      ],
      pista: `Lo que no es fracción lleva un 1 abajo: ${mt(n(w), igual, fr(n(w), n(1)))}. Después, extremos y medios.`,
      solucion: [
        mt(doble(fr(ext(n(a)), med(n(b))), fr(med(n(w)), ext(n(1)))), igual, fr(`${ext(n(a))} ${por} ${ext(n(1))}`, `${med(n(b))} ${por} ${med(n(w))}`), igual, fr(n(a), n(b * w))),
        simplificar(a, b * w, p, q, g)
      ]
    };
  }
  // Tiempo = energía ÷ potencia: la s estaba abajo del abajo y termina arriba
  function energia(R) {
    const P = R.elegir([50, 100, 200, 250, 300, 500]), t = R.elegir([2, 3, 4, 5, 6, 8, 10, 12, 20]), E = P * t;
    const quien = R.elegir(['Una bomba de agua', 'Un motor eléctrico', 'Un taladro']);
    return {
      enunciado: `${quien} tiene una potencia de ${q(P, 'W')} (${q(P, 'J/s')}). ¿Cuánto tarda en entregar ${q(E, 'J')}? Tiempo = energía ÷ potencia.`,
      plano: `${quien} tiene una potencia de ${P} W (${P} J/s). ¿Cuánto tarda en entregar ${f(E)} J? Tiempo = energía ÷ potencia.`,
      respuesta: t, unidad: 's',
      errores: [
        { valor: E * P, msg: 'Ese resultado sale de multiplicar. Tiempo = energía ÷ potencia.' },
        { valor: P / E, msg: `Esa es la división al revés: ${f(E)} ÷ ${P}.` }
      ],
      pista: `Una encima de la otra: ${mt(doble(fr(un('J'), n(1)), fr(un('J'), un('s'))))}. ¿Qué unidad queda?`,
      solucion: [
        mt(doble(fr(`${n(E)} ${un('J')}`, n(1)), fr(`${n(P)} ${un('J')}`, un('s'))), igual, fr(`${n(E)} ${tach(un('J'))} ${por} ${un('s')}`, `${n(1)} ${por} ${n(P)} ${tach(un('J'))}`), igual, fr(n(E), n(P)), un('s')),
        `La s estaba abajo del abajo: es un extremo y termina arriba. ${mt(fr(n(E), n(P)), igual, n(t))}. Respuesta: ${q(t, 's')}.`
      ]
    };
  }
  const multdiv = {
    id: 'multdiv', nombre: 'Multiplicar y dividir fracciones', icono: 'regla', porRonda: 8,
    detalle: 'Arriba con arriba para multiplicar; extremos y medios para dividir.',
    generar(R, k) { return [multiplicarFr, multiplicarFr, enteroEntreFr, dividirFr, dividirFr, dividirFr, frEntreEntero, energia][k](R); }
  };

  /* ---------- Orden de las operaciones (con signos) ---------- */
  const ORDEN = 'Orden: paréntesis, potencias, multiplicar y dividir (de izquierda a derecha) y al final sumar y restar (de izquierda a derecha).';
  const ORDENES = [
    // a + b · c
    R => {
      const a = R.ent(2, 15), b = R.ent(2, 9), c = R.ent(2, 9), res = a + b * c;
      return {
        enunciado: `Calcular ${mt(n(a), mas, n(b), por, n(c))}.`, plano: `Calcular ${a} + ${b} · ${c}.`, respuesta: res,
        errores: [{ valor: (a + b) * c, msg: 'Ese resultado sale de sumar primero. Multiplicar va antes que sumar.' }],
        pista: ORDEN,
        solucion: [`Primero la multiplicación: ${mt(n(b), por, n(c), igual, n(b * c))}`, `Después la suma: ${mt(n(a), mas, n(b * c), igual, n(res))}`]
      };
    },
    // a − b + c, de izquierda a derecha
    R => {
      const a = R.ent(8, 20), b = R.ent(2, 9), c = R.ent(2, 9), res = a - b + c;
      return {
        enunciado: `Calcular ${mt(n(a), menos, n(b), mas, n(c))}.`, plano: `Calcular ${a} − ${b} + ${c}.`, respuesta: res,
        errores: [{ valor: a - b - c, msg: `Ese resultado sale de sumar primero ${b} + ${c}. Sumar y restar tienen el mismo rango: se hacen de izquierda a derecha.` }],
        pista: 'Sumar y restar tienen el mismo rango: de izquierda a derecha.',
        solucion: [`De izquierda a derecha: ${mt(n(a), menos, n(b), igual, n(a - b))}`, mt(n(a - b), mas, n(c), igual, n(res))]
      };
    },
    // a ÷ b · c, de izquierda a derecha
    R => {
      const b = R.ent(2, 6), m = R.ent(2, 6), c = R.ent(2, 5), a = b * m, res = m * c;
      return {
        enunciado: `Calcular ${mt(n(a), entre, n(b), por, n(c))}.`, plano: `Calcular ${a} ÷ ${b} · ${c}.`, respuesta: res,
        errores: [{ valor: a / (b * c), msg: 'Ese resultado sale de multiplicar primero. Multiplicar y dividir tienen el mismo rango: de izquierda a derecha.' }],
        pista: 'Multiplicar y dividir tienen el mismo rango: de izquierda a derecha.',
        solucion: [`De izquierda a derecha: ${mt(n(a), entre, n(b), igual, n(m))}`, mt(n(m), por, n(c), igual, n(res))]
      };
    },
    // a − b · c, que da negativo
    R => {
      let a, b, c;
      do { a = R.ent(2, 12); b = R.ent(3, 9); c = R.ent(2, 9); } while (b * c <= a);
      const res = a - b * c;
      return {
        enunciado: `Calcular ${mt(n(a), menos, n(b), por, n(c))}.`, plano: `Calcular ${a} − ${b} · ${c}.`, respuesta: res,
        errores: [
          { valor: (a - b) * c, msg: 'Ese resultado sale de restar primero. Multiplicar va antes que restar.' },
          { valor: b * c - a, msg: `El número está bien, pero el signo no: tengo ${a} y gasto ${b * c}, así que quedo debiendo ${b * c - a}.` }
        ],
        pista: ORDEN,
        solucion: [`Primero la multiplicación: ${mt(n(b), por, n(c), igual, n(b * c))}`, `${mt(n(a), menos, n(b * c), igual, n(res))}: tengo ${a} y gasto ${b * c}, así que quedo debiendo ${b * c - a}.`]
      };
    },
    // −a² + b: sin paréntesis, el cuadrado es solo del número
    R => {
      const a = R.ent(2, 6), b = R.ent(1, 30), res = b - a * a;
      return {
        enunciado: `Calcular ${mt(pot(n('−' + a), 2), mas, n(b))}.`, plano: `Calcular −${a}² + ${b}.`, respuesta: res,
        errores: [
          { valor: a * a + b, msg: `Ese resultado sale de tomar −${a}² como (−${a})². Sin paréntesis, el cuadrado es solo del ${a}: −${a}² = −(${a} · ${a}) = −${a * a}.` },
          { valor: b - 2 * a, msg: `El exponente no multiplica: ${a}² = ${a} · ${a}, no 2 · ${a}.` }
        ],
        pista: `¿El cuadrado es del −${a} o solo del ${a}? Fijarse en si hay paréntesis.`,
        solucion: [`Primero la potencia, solo del ${a}: ${mt(pot(n('−' + a), 2), igual, n(-a * a))}`, mt(n(-a * a), mas, n(b), igual, n(res))]
      };
    },
    // (a + b)² − c · d
    R => {
      const a = R.ent(1, 5), b = R.ent(1, 5), c = R.ent(2, 6), d = R.ent(2, 6), s = (a + b) * (a + b), res = s - c * d;
      return {
        enunciado: `Calcular ${mt(pot(parentesis(`${n(a)} ${mas} ${n(b)}`), 2), menos, n(c), por, n(d))}.`, plano: `Calcular (${a} + ${b})² − ${c} · ${d}.`, respuesta: res,
        errores: [
          { valor: a * a + b * b - c * d, msg: `El cuadrado es de todo el paréntesis: primero se suma adentro (${a} + ${b} = ${a + b}) y después se eleva.` },
          { valor: (a + b) * 2 - c * d, msg: `El exponente no multiplica: ${a + b}² = ${a + b} · ${a + b}.` },
          { valor: (s - c) * d, msg: 'Ese resultado sale de restar antes de multiplicar. Multiplicar va antes que restar.' }
        ],
        pista: ORDEN,
        solucion: [`Paréntesis: ${mt(n(a), mas, n(b), igual, n(a + b))}`, `Potencia: ${mt(pot(n(a + b), 2), igual, n(s))}`, `Multiplicación: ${mt(n(c), por, n(d), igual, n(c * d))}`, mt(n(s), menos, n(c * d), igual, n(res))]
      };
    },
    // a − b · (c − d), con el paréntesis negativo
    R => {
      const a = R.ent(1, 10), b = R.ent(2, 5), c = R.ent(1, 5), d = c + R.ent(2, 6), adentro = c - d, res = a - b * adentro;
      return {
        enunciado: `Calcular ${mt(n(a), menos, n(b), por, parentesis(`${n(c)} ${menos} ${n(d)}`))}.`, plano: `Calcular ${a} − ${b} · (${c} − ${d}).`, respuesta: res,
        errores: [
          { valor: a - b * -adentro, msg: `Revisar el paréntesis: ${c} − ${d} = ${f(adentro)}. Y restar un negativo es sumar.` },
          { valor: (a - b) * adentro, msg: 'Ese resultado sale de restar primero. Multiplicar va antes que restar.' }
        ],
        pista: ORDEN,
        solucion: [`Paréntesis: ${mt(n(c), menos, n(d), igual, n(adentro))}`, `Multiplicación: ${mt(n(b), por, neg(adentro), igual, n(b * adentro))}`, `Restar un negativo es sumar: ${mt(n(a), menos, neg(b * adentro), igual, n(a), mas, n(-b * adentro), igual, n(res))}`]
      };
    },
    // (−a)³ − (−a)²
    R => {
      const a = R.ent(2, 5), cubo = -(a ** 3), cuad = a * a, res = cubo - cuad;
      return {
        enunciado: `Calcular ${mt(pot(neg(-a), 3), menos, pot(neg(-a), 2))}.`, plano: `Calcular (−${a})³ − (−${a})².`, respuesta: res,
        errores: [
          { valor: cubo + cuad, msg: `Revisar (−${a})²: son dos negativos multiplicados, así que vale +${cuad}, y ${f(cubo)} − ${cuad} = ${f(res)}.` },
          { valor: -cubo - cuad, msg: `Revisar (−${a})³: son tres negativos multiplicados, y el resultado es negativo (${f(cubo)}).` },
          { valor: -res, msg: `El número está bien, pero el signo no: ${f(cubo)} − ${cuad} queda negativo.` }
        ],
        pista: '¿Cuántos signos menos se multiplican en cada potencia?',
        solucion: [`${mt(pot(neg(-a), 3), igual, n(cubo))}: un número impar de negativos da negativo.`, `${mt(pot(neg(-a), 2), igual, n(cuad))}: un número par de negativos da positivo.`, mt(n(cubo), menos, n(cuad), igual, n(res))]
      };
    }
  ];
  const orden = {
    id: 'orden', nombre: 'Orden de las operaciones', icono: 'objetivo', porRonda: 8,
    detalle: 'Qué va primero, con negativos y paréntesis.',
    generar(R, k) { return ORDENES[k](R); }
  };

  /* ---------- Potencias con letras ---------- */
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const supT = e => String(e).split('').map(c => (c === '-' ? '⁻' : SUP[c])).join('');
  // Un monomio: coeficiente y letras con su exponente ([['x', 3], ['y', 1]]); el exponente 0 no se escribe
  function monoHtml(c, letras) {
    const ls = letras.filter(([, e]) => e !== 0).map(([l, e]) => (e === 1 ? vr(l) : pot(vr(l), e)));
    if (!ls.length) return n(c);
    return pega(...(c === 1 ? [] : [n(c)]), ...ls);
  }
  function monoTexto(c, letras) {
    const ls = letras.filter(([, e]) => e !== 0).map(([l, e]) => l + (e === 1 ? '' : supT(e)));
    if (!ls.length) return f(c);
    return (c === 1 ? '' : f(c)) + ls.join('');
  }
  // Opciones sin repetir; la primera es la correcta
  function opciones(cands) {
    const lista = [];
    cands.forEach(c => { if (lista.length < 4 && !lista.some(x => x.t === c.t)) lista.push(c); });
    const porQue = {};
    lista.forEach((c, i) => { if (i) porQue[i] = c.msg; });
    return { tipo: 'opciones', opciones: lista.map(c => mt(c.h)), opcionesPlano: lista.map(c => c.t), correcta: 0, porQue };
  }
  const opc = (c, letras, msg) => ({ h: monoHtml(c, letras), t: monoTexto(c, letras), msg });
  const cuenta = (l, e) => prod(...Array.from({ length: e }, () => vr(l)));

  const POTENCIAS = [
    // b^e con números
    R => {
      let b, e;
      do { b = R.elegir([2, 3, 5, 10]); e = R.ent(2, 4); } while (b === 2 && e === 2);
      const res = b ** e;
      return {
        enunciado: `Calcular ${mt(pot(n(b), e))}.`, plano: `Calcular ${b}${supT(e)}.`, respuesta: res,
        errores: [
          { valor: b * e, msg: `El exponente no multiplica: ${b}${supT(e)} = ${Array(e).fill(b).join(' · ')}.` },
          { valor: e ** b, msg: `Al revés: es el ${b} multiplicado ${e} veces, no el ${e} multiplicado ${b} veces.` }
        ],
        pista: `El exponente cuenta cuántas veces se multiplica el ${b} por sí mismo.`,
        solucion: [mt(pot(n(b), e), igual, prod(...Array(e).fill(n(b))), igual, n(res))]
      };
    },
    // (−b)², (−b)³ o −b²
    R => {
      const b = R.ent(2, 5), tipo = R.elegir(['par', 'impar', 'sin']);
      if (tipo === 'sin') {
        return {
          enunciado: `Calcular ${mt(pot(n('−' + b), 2))}.`, plano: `Calcular −${b}².`, respuesta: -b * b,
          errores: [{ valor: b * b, msg: `Sin paréntesis, el cuadrado es solo del ${b}: −${b}² = −(${b} · ${b}) = −${b * b}.` }, { valor: -2 * b, msg: 'El exponente no multiplica.' }],
          pista: '¿El exponente es del número con su signo o solo del número? Fijarse en el paréntesis.',
          solucion: [`Sin paréntesis, el cuadrado es solo del ${b}: ${mt(pot(n('−' + b), 2), igual, menos, parentesis(prod(n(b), n(b))), igual, n(-b * b))}`]
        };
      }
      const e = tipo === 'par' ? 2 : 3, res = (-b) ** e;
      return {
        enunciado: `Calcular ${mt(pot(neg(-b), e))}.`, plano: `Calcular (−${b})${supT(e)}.`, respuesta: res,
        errores: [
          { valor: -res, msg: e === 2 ? `Con paréntesis, el cuadrado es del −${b}: (−${b}) · (−${b}) = +${b * b}.` : 'Son tres negativos multiplicados: el resultado es negativo.' },
          { valor: -b * e, msg: 'El exponente no multiplica.' }
        ],
        pista: '¿El exponente es del número con su signo o solo del número? Fijarse en el paréntesis.',
        solucion: [`${mt(pot(neg(-b), e), igual, prod(...Array(e).fill(neg(-b))), igual, n(res))}: ${e === 2 ? 'un número par de negativos da positivo' : 'un número impar de negativos da negativo'}.`]
      };
    },
    // x^a · x^b
    R => {
      const l = R.elegir(['x', 'y', 'a', 't']);
      let a, b;
      do { a = R.ent(2, 6); b = R.ent(2, 6); } while (a === b || a * b === a + b);
      return Object.assign(opciones([
        opc(1, [[l, a + b]]),
        opc(1, [[l, a * b]], `Los exponentes no se multiplican: hay ${a} ${l} y después ${b}; en total, ${a + b}.`),
        opc(2, [[l, a + b]], 'No aparece ningún 2 adelante: al multiplicar, las letras se juntan y se cuentan.'),
        opc(1, [[l, Math.abs(a - b)]], `Restar es para dividir. Al multiplicar, se juntan: ${a} + ${b}.`)
      ]), {
        enunciado: `Simplificar ${mt(pot(vr(l), a), por, pot(vr(l), b))}.`, plano: `Simplificar ${l}${supT(a)} · ${l}${supT(b)}.`,
        pista: `Contar las ${l}: ${mt(pot(vr(l), a), igual, cuenta(l, a))}.`,
        solucion: [mt(pot(vr(l), a), por, pot(vr(l), b), igual, pot(vr(l), `${a} + ${b}`), igual, pot(vr(l), a + b)), 'Al multiplicar, los exponentes se suman.']
      });
    },
    // x^a ÷ x^b
    R => {
      const l = R.elegir(['x', 'y', 'a', 't']), a = R.ent(4, 9), b = R.ent(2, a - 1), e = a - b;
      return Object.assign(opciones([
        opc(1, [[l, e]]),
        opc(1, [[l, a + b]], 'Al dividir, las letras se tachan por parejas: los exponentes se restan.'),
        opc(1, [[l, -e]], `La resta es al revés: arriba hay ${a} y abajo ${b}. Quedan ${e} arriba.`),
        e > 1 ? opc(e, [[l, 1]], `El exponente no pasa adelante: ${l}${supT(e)} es ${l} multiplicada ${e} veces, no ${e} · ${l}.`) : opc(1, [[l, a * b]], 'Los exponentes no se multiplican: al dividir, se restan.')
      ]), {
        enunciado: `Simplificar ${mt(fr(pot(vr(l), a), pot(vr(l), b)))}.`, plano: `Simplificar ${l}${supT(a)} / ${l}${supT(b)}.`,
        pista: 'Una letra de arriba y una de abajo se tachan por parejas.',
        solucion: [mt(fr(pot(vr(l), a), pot(vr(l), b)), igual, pot(vr(l), `${a} − ${b}`), igual, monoHtml(1, [[l, e]])), `Se tachan ${b} parejas y ${e === 1 ? 'queda una' : `quedan ${e}`} arriba.`]
      });
    },
    // c₁x^a · c₂x^b
    R => {
      const l = R.elegir(['x', 'y', 'm']);
      let c1, c2, a, b;
      do { c1 = R.ent(2, 6); c2 = R.ent(2, 6); a = R.ent(1, 5); b = R.ent(1, 5); } while (c1 * c2 === c1 + c2 || a * b === a + b);
      return Object.assign(opciones([
        opc(c1 * c2, [[l, a + b]]),
        opc(c1 + c2, [[l, a + b]], `Los números se multiplican: ${c1} · ${c2}, no ${c1} + ${c2}.`),
        opc(c1 * c2, [[l, a * b]], `Las letras se cuentan: ${a} + ${b}. Los exponentes no se multiplican.`),
        opc(c1 + c2, [[l, a * b]], `Números con números y letras con letras: ${c1} · ${c2} y ${a} + ${b}.`)
      ]), {
        enunciado: `Simplificar ${mt(monoHtml(c1, [[l, a]]), por, monoHtml(c2, [[l, b]]))}.`, plano: `Simplificar ${monoTexto(c1, [[l, a]])} · ${monoTexto(c2, [[l, b]])}.`,
        pista: 'Números con números y letras con letras.',
        solucion: [`Números: ${mt(n(c1), por, n(c2), igual, n(c1 * c2))}`, `Letras: ${mt(monoHtml(1, [[l, a]]), por, monoHtml(1, [[l, b]]), igual, pot(vr(l), `${a} + ${b}`), igual, monoHtml(1, [[l, a + b]]))}`, `Queda ${mt(monoHtml(c1 * c2, [[l, a + b]]))}.`]
      });
    },
    // c₁x^a ÷ c₂x^b
    R => {
      const l = R.elegir(['x', 'y', 'a']);
      let c2, m, a, b;
      do { c2 = R.ent(2, 5); m = R.ent(2, 5); a = R.ent(3, 8); b = R.ent(1, a - 1); } while (m === c2 * m - c2);
      const c1 = c2 * m, e = a - b;
      return Object.assign(opciones([
        opc(m, [[l, e]]),
        opc(c1 - c2, [[l, e]], `Los números se dividen: ${c1} ÷ ${c2}, no ${c1} − ${c2}.`),
        opc(m, [[l, a + b]], 'Al dividir, los exponentes se restan.'),
        opc(c1 * c2, [[l, e]], 'Los números se dividen, no se multiplican.')
      ]), {
        enunciado: `Simplificar ${mt(fr(monoHtml(c1, [[l, a]]), monoHtml(c2, [[l, b]])))}.`, plano: `Simplificar ${monoTexto(c1, [[l, a]])} / ${monoTexto(c2, [[l, b]])}.`,
        pista: 'Números con números y letras con letras.',
        solucion: [`Números: ${mt(n(c1), entre, n(c2), igual, n(m))}`, `Letras: ${mt(fr(monoHtml(1, [[l, a]]), monoHtml(1, [[l, b]])), igual, pot(vr(l), `${a} − ${b}`), igual, monoHtml(1, [[l, e]]))}`, `Queda ${mt(monoHtml(m, [[l, e]]))}.`]
      });
    },
    // (x^a · x^b) ÷ x^c
    R => {
      const l = R.elegir(['x', 'y', 't']), a = R.ent(2, 5), b = R.ent(2, 5), c = R.ent(2, a + b - 1), e = a + b - c;
      return Object.assign(opciones([
        opc(1, [[l, e]]),
        opc(1, [[l, a + b + c]], 'El de abajo divide: su exponente se resta.'),
        opc(1, [[l, a * b - c]], `Arriba los exponentes se suman: ${a} + ${b}, no ${a} · ${b}.`),
        opc(1, [[l, -e]], 'La resta es al revés: arriba hay más letras que abajo.'),
        opc(1, [[l, a + b]], 'Ese es solo el numerador: falta dividir.')
      ]), {
        enunciado: `Simplificar ${mt(fr(`${pot(vr(l), a)} ${por} ${pot(vr(l), b)}`, pot(vr(l), c)))}.`, plano: `Simplificar (${l}${supT(a)} · ${l}${supT(b)}) / ${l}${supT(c)}.`,
        pista: 'Primero arriba (los exponentes se suman); después se divide (se restan).',
        solucion: [`Arriba: ${mt(pot(vr(l), a), por, pot(vr(l), b), igual, pot(vr(l), a + b))}`, mt(fr(pot(vr(l), a + b), pot(vr(l), c)), igual, pot(vr(l), `${a + b} − ${c}`), igual, monoHtml(1, [[l, e]]))]
      });
    },
    // Dos letras: c₁a^p b^q ÷ c₂ab
    R => {
      const [l1, l2] = R.elegir([['a', 'b'], ['x', 'y'], ['m', 'v']]);
      const c2 = R.ent(2, 4), m = R.ent(2, 5), c1 = c2 * m, p = R.ent(2, 5), q = R.ent(2, 3);
      const res = [[l1, p - 1], [l2, q - 1]];
      return Object.assign(opciones([
        opc(m, res),
        opc(m, [[l1, p - 1], [l2, q]], `Cada letra se tacha con la misma letra: la ${l2} de abajo también se tacha con una de arriba.`),
        opc(m, [[l1, p + 1], [l2, q + 1]], 'Al dividir, los exponentes se restan.'),
        opc(c1 - c2, res, `Los números se dividen: ${c1} ÷ ${c2} = ${m}.`)
      ]), {
        enunciado: `Simplificar ${mt(fr(monoHtml(c1, [[l1, p], [l2, q]]), monoHtml(c2, [[l1, 1], [l2, 1]])))}.`,
        plano: `Simplificar ${monoTexto(c1, [[l1, p], [l2, q]])} / ${monoTexto(c2, [[l1, 1], [l2, 1]])}.`,
        pista: 'Números con números, y cada letra se tacha solo con la misma letra.',
        solucion: [`Números: ${mt(n(c1), entre, n(c2), igual, n(m))}`, `La ${l1}: ${mt(fr(pot(vr(l1), p), vr(l1)), igual, monoHtml(1, [[l1, p - 1]]))}. La ${l2}: ${mt(fr(pot(vr(l2), q), vr(l2)), igual, monoHtml(1, [[l2, q - 1]]))}.`, `Queda ${mt(monoHtml(m, res))}.`]
      });
    }
  ];
  const potencias = {
    id: 'potencias', nombre: 'Potencias con letras', icono: 'flechaD', porRonda: 8,
    detalle: 'Primero con números y signos; después, contar letras.',
    generar(R, k) { return POTENCIAS[k](R); }
  };

  /* ---------- El radar y todo mezclado ---------- */
  const radar = {
    id: 'radar', nombre: 'Radar de signos', icono: 'radar', enlace: '#m2-radar',
    detalle: 'Diez cuentas de cabeza con negativos. Está en su propia sección, y sus rondas cuentan igual.'
  };
  const mezcla = {
    id: 'mezcla', nombre: 'Todo mezclado', icono: 'intercambiar', porRonda: 8,
    detalle: 'Fracciones, orden y potencias en desorden, sin saber cuál viene.',
    generarRonda(R) {
      const fuentes = R.barajar([
        () => sumas.generar(R, 3), () => sumas.generar(R, 6),
        () => multdiv.generar(R, 3), () => multdiv.generar(R, 6),
        () => orden.generar(R, 3), () => orden.generar(R, 5),
        () => potencias.generar(R, 1), () => potencias.generar(R, 5)
      ]);
      const lista = [];
      fuentes.forEach(fn => lista.push(R.distinto(lista, fn)));
      return lista;
    }
  };

  MA.M2.RONDAS = [sumas, multdiv, orden, potencias, radar, mezcla];
})();
