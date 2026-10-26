/* =====================================================================
   MÓDULO 2 · contenido (álgebra básica: fracciones, signos, jerarquía y
   potencias con letras). La factorización es el módulo 3 y la notación
   científica llega en el módulo 5, con la química.
   ---------------------------------------------------------------------
   - RETOS_SUMAS, RETOS_FRACCIONES, RETOS_OPERACIONES, RETOS_EXPONENTES:
     las cuatro herramientas.
   - EJERCICIOS: práctica progresiva (ids: m2.prac.*).
   Los ids de retos y ejercicios no se cambian: el avance se guarda
   con ellos en el navegador.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { vr, un, n, op, fr, mt, q, tach, doble, ext, med, pega } = MA.f;
  const por = op('·'), igual = op('='), entre = op('÷'), mas = op('+'), menos = op('−');
  const qn = (valor, unidad) => `${n(valor)} ${un(unidad)}`;
  const qt = (valor, unidad) => `${n(valor)} ${tach(un(unidad))}`;
  const sup = e => `<sup class="exp">${typeof e === 'number' && e < 0 ? '−' + -e : e}</sup>`;
  // Potencia: la base y su exponente juntos, para que el exponente no se desalinee junto a una fracción
  const pot = (base, e) => `<span class="pot">${base}${sup(e)}</span>`;
  const neg = x => `${op('(')}${n(x)}${op(')')}`;   // número negativo entre paréntesis: (−6)
  const prod = (...xs) => xs.join(` ${por} `);

  /* ---------- Mesa de sumas y restas ----------
     a y b como [arriba, abajo]; un entero es [n] (lleva un 1 abajo).
     nota: se agrega al mensaje final. */
  const RETOS_SUMAS = [
    { id: 'fs1', titulo: 'Mismo abajo', contexto: 'Una pizza cortada en 5 porciones: una persona se come 1 y otra se come 2. ¿Qué parte de la pizza se comieron?',
      a: [1, 5], b: [2, 5], op: '+', nota: 'Son pedazos del mismo tamaño: 1 quinto más 2 quintos son 3 quintos.' },
    { id: 'fs2', titulo: 'Restar con el mismo abajo', contexto: 'Un tanque está lleno hasta los 7/8 y se gastan 3/8. ¿Qué parte del tanque queda?',
      a: [7, 8], b: [3, 8], op: '-', nota: 'Queda medio tanque.' },
    { id: 'fs3', titulo: 'Distinto abajo: la mariposa', contexto: 'Un tramo de 1/2 km y otro de 1/3 km. ¿Cuánto se recorre en total?',
      a: [1, 2], b: [1, 3], op: '+', nota: 'Tiene sentido: medio más un tercio es un poco menos que 1. Si hubiera salido 2/5, sería menos que medio: imposible.' },
    { id: 'fs4', titulo: 'Restar con la mariposa', contexto: 'De 3/4 de tanque se gasta 1/6 del tanque. ¿Qué parte queda?',
      a: [3, 4], b: [1, 6], op: '-' },
    { id: 'fs5', titulo: 'Un entero más una fracción', contexto: 'Un vuelo dura 2 h y 3/4 de hora. ¿Cuántas horas son, escritas como una sola fracción?',
      a: [2], b: [3, 4], op: '+', nota: '11/4 de hora son 2 h y 45 min.' }
  ];

  /* ---------- Mesa de multiplicar y dividir ----------
     a · b o a ÷ b, cada una como { num: [...], den: [...] }: números
     enteros y unidades (texto). unidades: opciones para predecir la
     unidad final; porQue: explica la unidad si la predicción falla. */
  const RETOS_FRACCIONES = [
    { id: 'fm1', op: '·', titulo: 'Multiplicar', contexto: 'Arriba con arriba y abajo con abajo. Antes de multiplicar, conviene tachar.',
      a: { num: [2], den: [3] }, b: { num: [9], den: [4] } },
    { id: 'fm2', op: '·', titulo: 'La distancia de un viaje', contexto: `Un carro va a ${q(80, 'km/h')} durante ${q(3, 'h')}. La distancia es ${mt(vr('d'), igual, vr('v'), por, vr('t'))}.`,
      a: { num: [80, 'km'], den: ['h'] }, b: { num: [3, 'h'], den: [] }, unidades: ['km', 'km/h', 'km · h²', 'h'], unidad: 'km',
      porQue: 'la h de arriba y la h de abajo se cancelaron.' },
    { id: 'fr1', titulo: 'Seis entre un medio', contexto: '¿Cuántas medias porciones salen de 6 pizzas?',
      a: { num: [6], den: [] }, b: { num: [1], den: [2] } },
    { id: 'fr2', titulo: 'Tramos de una varilla', contexto: 'Una varilla mide 3/4 de metro. ¿Cuántos tramos de 3/8 de metro salen?',
      a: { num: [3], den: [4] }, b: { num: [3], den: [8] } },
    { id: 'fr4', titulo: 'El tiempo de un viaje', contexto: `Un carro recorre ${q(150, 'km')} a ${q(60, 'km/h')}. El tiempo es ${mt(vr('t'), igual, vr('d'), entre, vr('v'))}.`,
      a: { num: [150, 'km'], den: [] }, b: { num: [60, 'km'], den: ['h'] }, unidades: ['h', 'km²/h', '1/h', 'km'], unidad: 'h',
      porQue: 'la h estaba abajo del abajo: es un extremo y terminó arriba.' },
    { id: 'fr6', titulo: 'Energía y potencia', contexto: `Un motor de ${q(300, 'W')} entrega ${q(300, 'J')} cada segundo (1 W = 1 J/s). ¿Cuánto tarda en entregar ${q(900, 'J')}? Tiempo = energía ÷ potencia.`,
      a: { num: [900, 'J'], den: [] }, b: { num: [300, 'J'], den: ['s'] }, unidades: ['J²/s', '1/s', 's', 'W'], unidad: 's',
      porQue: 'la s estaba abajo del abajo: es un extremo y terminó arriba.' },
    { id: 'fr7', titulo: 'La aceleración', contexto: `Un carro pasa de 0 a ${q(20, 'm/s')} en ${q(4, 's')}. La aceleración es ${mt(vr('a'), igual, vr('v'), entre, vr('t'))}. Aquí lo que divide no es una fracción.`,
      a: { num: [20, 'm'], den: ['s'] }, b: { num: [4, 's'], den: [] }, unidades: ['m', 'm/s²', 'm · s', 'm/s'], unidad: 'm/s²',
      porQue: 'las dos s son medios, así que las dos quedan abajo.' }
  ];

  /* ---------- Mesa de operaciones (signos y jerarquía) ----------
     Expresiones en texto: + - * / ^ y paréntesis. «(-3)» es un número
     negativo; «-3^2» es el opuesto de 3². */
  const RETOS_OPERACIONES = [
    { id: 'op1', expr: '-5 + 3 - 4', titulo: 'Deudas y pagos', contexto: 'Sumas y restas: de izquierda a derecha.' },
    { id: 'op2', expr: '7 - (-2) + (-4)', titulo: 'Restar un negativo', contexto: 'Quitar una deuda es como ganar plata.' },
    { id: 'op3', expr: '(-3) * 4 - (-2) * 5', titulo: 'Signos al multiplicar', contexto: 'Iguales dan más; distintos dan menos.' },
    { id: 'op4', expr: '2 + 3 * 4^2 - 6 / 2', titulo: 'El orden completo', contexto: 'Potencias, después multiplicar y dividir, al final sumar y restar.' },
    { id: 'op5', expr: '8 / 4 * 2', titulo: 'La trampa de izquierda a derecha', contexto: 'Multiplicar y dividir tienen el mismo rango.' },
    { id: 'op6', expr: '(2 + 3)^2 - 4 * 5', titulo: 'Primero el paréntesis', contexto: 'Lo que está entre paréntesis va antes que todo.' },
    { id: 'op7', expr: '-3^2 + (-3)^2', titulo: '¿Es lo mismo?', contexto: 'Fijarse bien en dónde está el paréntesis.' },
    { id: 'op8', expr: '(-12) / (-3) - 2 * (5 - 8)', titulo: 'Todo junto', contexto: 'Paréntesis, signos y orden.' },
    { id: 'op9', expr: '3 - 2 * (1 - 4)^2 / 6', titulo: 'Reto', contexto: 'El más largo: paso por paso.' }
  ];

  /* ---------- Mesa de exponentes (potencias con letras) ----------
     arriba y abajo: listas de factores; cada factor es una lista de
     términos: números o letras con su exponente ('x2' es x², 'a' es a¹).
     punto: escribir los términos con · (como en las fórmulas de física).
     opciones: para predecir cómo queda; correcta: índice de la buena.
     porQue: explica el resultado si la predicción falla. */
  const RETOS_EXPONENTES = [
    { id: 'ex1', titulo: 'Contar las x', contexto: 'Dos potencias de la misma letra, multiplicadas.',
      arriba: [['x2'], ['x3']], abajo: [], opciones: ['x⁶', 'x⁵', '2x⁵'], correcta: 1,
      porQue: 'hay 2 x y después 3 x: en total 5. Los exponentes se suman, no se multiplican.' },
    { id: 'ex2', titulo: 'La letra sola', contexto: 'Una letra sin exponente lleva un 1 invisible: a = a¹.',
      arriba: [['a'], ['a4']], abajo: [], opciones: ['a⁴', '2a⁴', 'a⁵'], correcta: 2,
      porQue: 'la a sola cuenta como una: 1 + 4 = 5.' },
    { id: 'ex3', titulo: 'Dividir: tachar por parejas', contexto: 'Una x de arriba y una de abajo se cancelan, igual que las unidades.',
      arriba: [['x5']], abajo: [['x2']], opciones: ['x⁷', 'x³', 'x¹⁰'], correcta: 1,
      porQue: 'se tacharon 2 parejas y quedaron 3 x arriba. Al dividir, los exponentes se restan.' },
    { id: 'ex4', titulo: 'Números con números, letras con letras', contexto: 'Los números se multiplican entre ellos y las letras se cuentan.',
      arriba: [[3, 'x2'], [2, 'x3']], abajo: [], opciones: ['5x⁵', '6x⁵', '6x⁶'], correcta: 1,
      porQue: 'los números se multiplican (3 · 2 = 6) y las x se cuentan (2 + 3 = 5).' },
    { id: 'ex5', titulo: 'Una fórmula de física', contexto: 'En las fórmulas aparecen cosas como m · v² ÷ v. Se simplifica igual.',
      arriba: [['m', 'v2']], abajo: [['v']], punto: true, opciones: ['m', 'm · v', 'm · v²'], correcta: 1,
      porQue: 'una v de arriba se tachó con la de abajo y quedó la otra.' },
    { id: 'ex6', titulo: 'Dos letras y un número', contexto: 'Cada letra se tacha con la misma letra; los números, entre ellos.',
      arriba: [[8, 'a3', 'b']], abajo: [[2, 'a', 'b']], opciones: ['4a²', '6a²', '4a³b'], correcta: 0,
      porQue: '8 ÷ 2 = 4, se tachó una a (quedan 2) y la b se canceló entera.' }
  ];

  /* ---------- Práctica progresiva ---------- */
  const EJERCICIOS = [
    // ----- Básico -----
    {
      id: 'e1', nivel: 'basico', tema: 'fracciones', tipo: 'numero', respuesta: 20,
      enunciado: `Calcular ${mt(n(5), entre, fr(n(1), n(4)))}.`,
      plano: 'Calcular 5 ÷ 1/4.',
      errores: [{ valor: 1.25, msg: 'Ese resultado sale de dividir 5 entre 4. El 4 está abajo del abajo: es un extremo y sube, así que multiplica.' }],
      pistas: ['¿Cuántos cuartos caben en 5 unidades?', `Una encima de la otra, con un 1 debajo del 5: ${mt(doble(fr(n(5), n(1)), fr(n(1), n(4))))}. Extremos arriba, medios abajo.`],
      solucion: [`${mt(n(5), entre, fr(n(1), n(4)), igual, doble(fr(ext(n(5)), med(n(1))), fr(med(n(1)), ext(n(4)))), igual, fr(`${ext(n(5))} ${por} ${ext(n(4))}`, `${med(n(1))} ${por} ${med(n(1))}`), igual, n(20))}`, 'Respuesta: 20. En cada unidad caben 4 cuartos; en 5 unidades, 20.'],
      herramienta: { boton: 'Probarlo en la mesa de multiplicar y dividir', icono: 'regla', mesa: 'fracciones', problema: { a: { num: [5], den: [] }, b: { num: [1], den: [4] } } }
    },
    {
      id: 'e17', nivel: 'basico', tema: 'fracciones', tipo: 'numero', respuesta: 11 / 12,
      enunciado: `Calcular ${mt(fr(n(2), n(3)), mas, fr(n(1), n(4)))}. Se responde con una fracción, como 5/7.`,
      plano: 'Calcular 2/3 + 1/4.',
      errores: [{ valor: 3 / 7, msg: 'Ese resultado sale de sumar arriba con arriba y abajo con abajo. Con distinto abajo hace falta la mariposa.' }],
      pistas: ['Abajo hay 3 y 4: distinto abajo. Va la mariposa: en cruz arriba, abajo con abajo.', `${mt(fr(`${prod(n(2), n(4))} ${mas} ${prod(n(3), n(1))}`, prod(n(3), n(4))))}`],
      solucion: [`${mt(fr(n(2), n(3)), mas, fr(n(1), n(4)), igual, fr(`${ext(prod(n(2), n(4)))} ${mas} ${ext(prod(n(3), n(1)))}`, med(prod(n(3), n(4)))), igual, fr(`${n(8)} ${mas} ${n(3)}`, n(12)), igual, fr(n(11), n(12)))}`, 'No se puede simplificar: 11 y 12 no tienen un divisor en común.'],
      herramienta: { boton: 'Probarlo en la mesa de sumas y restas', icono: 'regla', mesa: 'sumas', problema: { a: [2, 3], b: [1, 4], op: '+' } }
    },
    {
      id: 'e2', nivel: 'basico', tema: 'signos', tipo: 'numero', respuesta: 1,
      enunciado: `Calcular ${mt(n('−8'), mas, n(3), menos, neg(-6))}.`,
      plano: 'Calcular −8 + 3 − (−6).',
      errores: [
        { valor: -11, msg: 'Ese resultado sale de restar 6. Restar un negativo es sumar: − (−6) = + 6.' },
        { valor: -1, msg: 'Revisar el primer paso: −8 + 3 = −5 (debía 8, pagó 3, todavía debe 5).' }
      ],
      pistas: ['De izquierda a derecha. Primero −8 + 3.', `${mt(n('−5'), menos, neg(-6))}: quitar una deuda es como ganar plata.`],
      solucion: [`${mt(n('−8'), mas, n(3), igual, n('−5'))}`, `${mt(n('−5'), menos, neg(-6), igual, n('−5'), mas, n(6), igual, n(1))}`],
      herramienta: { boton: 'Probarlo en la mesa de operaciones', icono: 'objetivo', mesa: 'operaciones', expr: '-8 + 3 - (-6)' }
    },
    {
      id: 'e3', nivel: 'basico', tema: 'signos', tipo: 'numero', respuesta: -4,
      enunciado: `Calcular ${mt(neg(-6), por, neg(-2), entre, neg(-3))}.`,
      plano: 'Calcular (−6) · (−2) ÷ (−3).',
      errores: [
        { valor: 4, msg: 'El número está bien, pero el signo no: 12 ÷ (−3) tiene signos distintos.' },
        { valor: -1, msg: 'Ese resultado sale de dividir primero. Multiplicar y dividir van de izquierda a derecha: primero (−6) · (−2).' }
      ],
      pistas: ['De izquierda a derecha: primero (−6) · (−2).', `${mt(neg(-6), por, neg(-2), igual, n(12))} (signos iguales). Falta ${mt(n(12), entre, neg(-3))}.`],
      solucion: [`${mt(neg(-6), por, neg(-2), igual, n(12))}: signos iguales dan positivo.`, `${mt(n(12), entre, neg(-3), igual, n('−4'))}: signos distintos dan negativo.`],
      herramienta: { boton: 'Probarlo en la mesa de operaciones', icono: 'objetivo', mesa: 'operaciones', expr: '(-6) * (-2) / (-3)' }
    },
    {
      id: 'e4', nivel: 'basico', tema: 'potencias', tipo: 'opciones', correcta: 0,
      enunciado: `Simplificar ${mt(pot(vr('y'), 3), por, pot(vr('y'), 2))}.`,
      plano: 'Simplificar y³ · y².',
      opciones: [mt(pot(vr('y'), 5)), mt(pot(vr('y'), 6)), mt(pega(n(2), pot(vr('y'), 5))), mt(vr('y'))],
      opcionesPlano: ['y⁵', 'y⁶', '2y⁵', 'y'],
      porQue: {
        1: 'Los exponentes no se multiplican: hay 3 y, después 2 y; en total, 5.',
        2: 'No aparece ningún 2 adelante: al multiplicar, las y se juntan y se cuentan.',
        3: 'Restar es para dividir. Al multiplicar, las y se juntan: 3 + 2 = 5.'
      },
      pistas: [`Escribir cada y: ${mt(pot(vr('y'), 3), igual, prod(vr('y'), vr('y'), vr('y')))}.`, `${mt(op('('), prod(vr('y'), vr('y'), vr('y')), op(')'), por, op('('), prod(vr('y'), vr('y')), op(')'))}: ¿cuántas y hay?`],
      solucion: [`${mt(pot(vr('y'), 3), por, pot(vr('y'), 2), igual, op('('), prod(vr('y'), vr('y'), vr('y')), op(')'), por, op('('), prod(vr('y'), vr('y')), op(')'), igual, pot(vr('y'), 5))}`, 'Atajo: al multiplicar, los exponentes se suman: 3 + 2 = 5.'],
      herramienta: { boton: 'Probarlo en la mesa de exponentes', icono: 'flechaD', mesa: 'exponentes', problema: { arriba: [['y3'], ['y2']], abajo: [] } }
    },
    // ----- Intermedio -----
    {
      id: 'e18', nivel: 'intermedio', tema: 'fracciones', tipo: 'numero', respuesta: 7 / 12,
      enunciado: `Calcular ${mt(fr(n(5), n(6)), menos, fr(n(1), n(4)))}. Se responde con una fracción simplificada.`,
      plano: 'Calcular 5/6 − 1/4.',
      errores: [
        { valor: 2, msg: 'Ese resultado sale de restar arriba con arriba y abajo con abajo (4/2). Con distinto abajo hace falta la mariposa.' },
        { valor: -7 / 12, msg: 'El número está bien, pero el signo no: en la mariposa, primero va el producto de la izquierda (5 · 4) y después se resta el otro (6 · 1).' }
      ],
      pistas: ['Distinto abajo: la mariposa. En la resta importa el orden: primero 5 · 4 y después se resta 6 · 1.', `${mt(fr(`${prod(n(5), n(4))} ${menos} ${prod(n(6), n(1))}`, prod(n(6), n(4))), igual, fr(n(14), n(24)))}. Falta simplificar.`],
      solucion: [`${mt(fr(n(5), n(6)), menos, fr(n(1), n(4)), igual, fr(`${ext(prod(n(5), n(4)))} ${menos} ${ext(prod(n(6), n(1)))}`, med(prod(n(6), n(4)))), igual, fr(`${n(20)} ${menos} ${n(6)}`, n(24)), igual, fr(n(14), n(24)))}`, `${mt(fr(n(14), n(24)), igual, fr(n(7), n(12)))}: arriba y abajo entre 2.`],
      herramienta: { boton: 'Probarlo en la mesa de sumas y restas', icono: 'regla', mesa: 'sumas', problema: { a: [5, 6], b: [1, 4], op: '-' } }
    },
    {
      id: 'e5', nivel: 'intermedio', tema: 'fracciones', tipo: 'numero', respuesta: 1.5,
      enunciado: `Calcular ${mt(fr(n(2), n(5)), entre, fr(n(4), n(15)))}. Se puede responder con fracción o con decimal.`,
      plano: 'Calcular 2/5 ÷ 4/15.',
      errores: [
        { valor: 8 / 75, msg: 'Ese resultado sale de multiplicar las dos fracciones tal como están. Para dividir: extremos arriba (2 · 15) y medios abajo (5 · 4).' },
        { valor: 2 / 3, msg: 'Ese resultado está al revés: quedaron arriba los medios. Arriba van los extremos, 2 · 15, y abajo los medios, 5 · 4.' }
      ],
      pistas: [`${mt(doble(fr(n(2), n(5)), fr(n(4), n(15))))}: extremos arriba (2 · 15), medios abajo (5 · 4). Antes de multiplicar, conviene tachar.`, 'El 15 de arriba y el 5 de abajo se dividen entre 5; el 2 de arriba y el 4 de abajo, entre 2.'],
      solucion: [`${mt(doble(fr(ext(n(2)), med(n(5))), fr(med(n(4)), ext(n(15)))), igual, fr(`${ext(n(2))} ${por} ${ext(n(15))}`, `${med(n(5))} ${por} ${med(n(4))}`))}`, `Simplificando: ${mt(fr(prod(n(1), n(3)), prod(n(1), n(2))), igual, fr(n(3), n(2)), igual, n(1.5))}`],
      herramienta: { boton: 'Probarlo en la mesa de multiplicar y dividir', icono: 'regla', mesa: 'fracciones', problema: { a: { num: [2], den: [5] }, b: { num: [4], den: [15] } } }
    },
    {
      id: 'e6', nivel: 'intermedio', tema: 'signos', tipo: 'numero', respuesta: 14,
      enunciado: `Calcular ${mt(n(20), menos, n(4), por, pot(n(3), 2), entre, n(6))}.`,
      plano: 'Calcular 20 − 4 · 3² ÷ 6.',
      errores: [
        { valor: 16, msg: 'Ese resultado sale de restar primero (20 − 4 = 16). La resta va al final.' },
        { valor: 18, msg: 'Ese resultado sale de 4 · 3 = 12 sin elevar al cuadrado. La potencia va antes: 3² = 9.' },
        { valor: 6, msg: 'Revisar el último paso: 20 − 6 = 14.' }
      ],
      pistas: ['Orden: potencias → multiplicar y dividir (de izquierda a derecha) → sumar y restar.', `${mt(pot(n(3), 2), igual, n(9))}; después ${mt(n(4), por, n(9), igual, n(36))} y ${mt(n(36), entre, n(6))}.`],
      solucion: [`${mt(pot(n(3), 2), igual, n(9))} → ${mt(n(20), menos, n(4), por, n(9), entre, n(6))}`, `${mt(n(4), por, n(9), igual, n(36))} y ${mt(n(36), entre, n(6), igual, n(6))} → ${mt(n(20), menos, n(6), igual, n(14))}`],
      herramienta: { boton: 'Probarlo en la mesa de operaciones', icono: 'objetivo', mesa: 'operaciones', expr: '20 - 4 * 3^2 / 6' }
    },
    {
      id: 'e19', nivel: 'intermedio', tema: 'potencias', tipo: 'opciones', correcta: 0,
      enunciado: `Simplificar ${mt(fr(pega(n(6), pot(vr('x'), 5)), pega(n(2), pot(vr('x'), 2))))}.`,
      plano: 'Simplificar 6x⁵ / 2x².',
      opciones: [mt(pega(n(3), pot(vr('x'), 3))), mt(pega(n(3), pot(vr('x'), 7))), mt(pega(n(4), pot(vr('x'), 3))), mt(pega(n(12), pot(vr('x'), 3)))],
      opcionesPlano: ['3x³', '3x⁷', '4x³', '12x³'],
      porQue: {
        1: 'Al dividir, las x se tachan por parejas: los exponentes se restan, 5 − 2 = 3.',
        2: 'Los números se dividen: 6 ÷ 2 = 3, no 6 − 2.',
        3: 'Los números se dividen, no se multiplican: 6 ÷ 2 = 3.'
      },
      pistas: ['Números con números y letras con letras.', `${mt(n(6), entre, n(2), igual, n(3))}. Arriba hay 5 x y abajo 2: se tachan por parejas.`],
      solucion: [`Números: ${mt(n(6), entre, n(2), igual, n(3))}`, `Letras: ${mt(fr(pot(vr('x'), 5), pot(vr('x'), 2)), igual, pot(vr('x'), '5 − 2'), igual, pot(vr('x'), 3))}. Respuesta: ${mt(pega(n(3), pot(vr('x'), 3)))}.`],
      herramienta: { boton: 'Probarlo en la mesa de exponentes', icono: 'flechaD', mesa: 'exponentes', problema: { arriba: [[6, 'x5']], abajo: [[2, 'x2']] } }
    },
    // ----- Tipo examen -----
    {
      id: 'e10', nivel: 'examen', tema: 'signos', tipo: 'numero', respuesta: -12,
      enunciado: `Calcular ${mt(pot(neg(-2), 3), menos, pot(neg(-2), 2))}.`,
      plano: 'Calcular (−2)³ − (−2)².',
      errores: [
        { valor: -4, msg: 'Revisar (−2)²: menos por menos da más, así que vale +4, y −8 − 4 = −12.' },
        { valor: 4, msg: 'Revisar (−2)³: son tres negativos multiplicados, y el resultado es negativo (−8).' },
        { valor: 12, msg: 'El número está bien, pero el signo no: −8 − 4 queda negativo.' }
      ],
      pistas: [`${mt(pot(neg(-2), 3), igual, neg(-2), por, neg(-2), por, neg(-2))}: ¿cuántos signos menos hay?`, `${mt(pot(neg(-2), 3), igual, n('−8'))} y ${mt(pot(neg(-2), 2), igual, n(4))}.`],
      solucion: [`${mt(pot(neg(-2), 3), igual, n('−8'))}: un número impar de negativos da negativo.`, `${mt(pot(neg(-2), 2), igual, n(4))}: un número par de negativos da positivo.`, `${mt(n('−8'), menos, n(4), igual, n('−12'))}`],
      herramienta: { boton: 'Probarlo en la mesa de operaciones', icono: 'objetivo', mesa: 'operaciones', expr: '(-2)^3 - (-2)^2' }
    },
    {
      id: 'e13', nivel: 'examen', tema: 'fracciones', tipo: 'numero', respuesta: 20, unidad: 's',
      enunciado: `Una bomba de agua tiene una potencia de ${q(250, 'W')} (${q(250, 'J/s')}). ¿Cuánto tarda en entregar ${q(5000, 'J')}?`,
      plano: 'Una bomba de agua tiene una potencia de 250 W (250 J/s). ¿Cuánto tarda en entregar 5000 J?',
      errores: [
        { valor: 1250000, msg: 'Ese resultado sale de multiplicar. Tiempo = energía ÷ potencia.' },
        { valor: 0.05, msg: 'Esa es la división al revés: 5000 ÷ 250.' }
      ],
      pistas: [`Tiempo = energía ÷ potencia: ${mt(qn(5000, 'J'), entre, fr(qn(250, 'J'), un('s')))}.`, `Extremos arriba, medios abajo: ${mt(doble(fr(un('J'), n(1)), fr(un('J'), un('s'))), igual, fr(`${tach(un('J'))} ${por} ${un('s')}`, `${n(1)} ${por} ${tach(un('J'))}`), igual, un('s'))}. Queda ${mt(n(5000), entre, n(250))}.`],
      solucion: [`${mt(doble(fr(qn(5000, 'J'), n(1)), fr(qn(250, 'J'), un('s'))), igual, fr(`${qt(5000, 'J')} ${por} ${un('s')}`, `${n(1)} ${por} ${qt(250, 'J')}`), igual, fr(n(5000), n(250)), un('s'))}`, `${mt(fr(n(5000), n(250)), igual, fr(n(500), n(25)), igual, n(20))}. Respuesta: ${q(20, 's')}.`],
      herramienta: { boton: 'Probarlo en la mesa de multiplicar y dividir', icono: 'regla', mesa: 'fracciones', problema: { a: { num: [5000, 'J'], den: [] }, b: { num: [250, 'J'], den: ['s'] }, unidades: ['s', 'J²/s', '1/s', 'W'], unidad: 's', porQue: 'la s estaba abajo del abajo: es un extremo y terminó arriba.' } }
    },
    {
      id: 'e14', nivel: 'examen', tema: 'potencias', tipo: 'opciones', correcta: 0,
      enunciado: `Simplificar ${mt(fr(`${pot(vr('x'), 4)} ${por} ${pot(vr('x'), 3)}`, pot(vr('x'), 5)))}.`,
      plano: 'Simplificar (x⁴ · x³) / x⁵.',
      opciones: [mt(pot(vr('x'), 2)), mt(pot(vr('x'), 7)), mt(pot(vr('x'), '12/5')), mt(pot(vr('x'), -2))],
      opcionesPlano: ['x²', 'x⁷', 'x^(12/5)', 'x⁻²'],
      porQue: {
        1: 'Ese es solo el numerador: falta dividir entre x⁵.',
        2: 'Los exponentes no se multiplican ni se dividen: arriba se suman (4 + 3) y al dividir se restan.',
        3: 'La resta es al revés: arriba hay 7 equis y abajo 5. Quedan 2 arriba.'
      },
      pistas: ['Contar las x: ¿cuántas hay arriba y cuántas abajo?', 'Arriba hay 7 x y abajo 5. Se tachan por parejas.'],
      solucion: [`Arriba: ${mt(pot(vr('x'), 4), por, pot(vr('x'), 3), igual, pot(vr('x'), 7))}`, `${mt(fr(pot(vr('x'), 7), pot(vr('x'), 5)), igual, pot(vr('x'), '7 − 5'), igual, pot(vr('x'), 2))}: se tachan 5 parejas y quedan 2 x arriba.`],
      herramienta: { boton: 'Probarlo en la mesa de exponentes', icono: 'flechaD', mesa: 'exponentes', problema: { arriba: [['x4'], ['x3']], abajo: [['x5']] } }
    },
    {
      id: 'e20', nivel: 'examen', tema: 'potencias', tipo: 'opciones', correcta: 0,
      enunciado: `La energía cinética es ${mt(vr('E'), igual, fr(prod(vr('m'), pot(vr('v'), 2)), n(2)))} y la cantidad de movimiento es ${mt(vr('p'), igual, prod(vr('m'), vr('v')))}. ¿Cuánto da ${mt(vr('E'), entre, vr('p'))}?`,
      plano: 'La energía cinética es E = m · v² / 2 y la cantidad de movimiento es p = m · v. ¿Cuánto da E ÷ p?',
      opciones: [mt(fr(vr('v'), n(2))), mt(pega(n(2), vr('v'))), mt(fr(prod(vr('m'), vr('v')), n(2))), mt(fr(pot(vr('v'), 2), n(2)))],
      opcionesPlano: ['v/2', '2v', 'm · v/2', 'v²/2'],
      porQue: {
        1: 'Al revés: el 2 estaba abajo y sigue abajo. Queda v/2.',
        2: 'Sobra la m: hay una arriba y otra abajo, y se cancelan.',
        3: 'Sobra una v: arriba hay dos y abajo una. Queda una sola.'
      },
      pistas: [`Una encima de la otra: ${mt(doble(fr(prod(vr('m'), pot(vr('v'), 2)), n(2)), fr(prod(vr('m'), vr('v')), n(1))))}. Extremos arriba, medios abajo.`, `${mt(fr(prod(vr('m'), vr('v'), vr('v'), n(1)), prod(n(2), vr('m'), vr('v'))))}: tachar por parejas.`],
      solucion: [`${mt(doble(fr(ext(prod(vr('m'), pot(vr('v'), 2))), med(n(2))), fr(med(prod(vr('m'), vr('v'))), ext(n(1)))), igual, fr(prod(ext(prod(tach(vr('m')), tach(vr('v')), vr('v'))), ext(n(1))), prod(med(n(2)), med(prod(tach(vr('m')), tach(vr('v')))))))}`, `Se cancelan la m y una v: queda ${mt(fr(vr('v'), n(2)))}.`]
    },
    // ----- Reto -----
    {
      id: 'e15', nivel: 'reto', tema: 'signos', tipo: 'numero', respuesta: -16,
      enunciado: `Calcular ${mt(op('['), n(2), menos, n(3), por, neg(-2), pot(op(']'), 2), entre, neg(-4))}.`,
      plano: 'Calcular [2 − 3 · (−2)]² ÷ (−4).',
      errores: [
        { valor: 16, msg: 'El número está bien, pero el signo no: 64 ÷ (−4) tiene signos distintos.' },
        { valor: -0.25, msg: 'Revisar el corchete: 2 − 3 · (−2) = 2 + 6 = 8, no −2.' },
        { valor: -1, msg: 'Revisar el corchete: primero 3 · (−2) = −6, y 2 − (−6) = 8.' }
      ],
      pistas: ['Primero lo de adentro del corchete, con su propio orden: multiplicar antes de restar.', `${mt(n(2), menos, n(3), por, neg(-2), igual, n(2), mas, n(6), igual, n(8))}. Falta ${mt(pot(n(8), 2), entre, neg(-4))}.`],
      solucion: [`${mt(n(3), por, neg(-2), igual, n('−6'))} → ${mt(n(2), menos, neg(-6), igual, n(8))}`, `${mt(pot(n(8), 2), igual, n(64))} → ${mt(n(64), entre, neg(-4), igual, n('−16'))}`],
      herramienta: { boton: 'Probarlo en la mesa de operaciones', icono: 'objetivo', mesa: 'operaciones', expr: '(2 - 3 * (-2))^2 / (-4)' }
    },
    {
      id: 'e21', nivel: 'reto', tema: 'fracciones', tipo: 'numero', respuesta: 0.75,
      enunciado: `Calcular ${mt(fr(n(1), n(2)), mas, fr(n(1), n(3)), por, fr(n(3), n(4)))}.`,
      plano: 'Calcular 1/2 + 1/3 · 3/4.',
      errores: [
        { valor: 5 / 8, msg: 'Ese resultado sale de sumar primero. La multiplicación va antes que la suma, también con fracciones.' },
        { valor: 2 / 9, msg: 'Revisar la suma: con distinto abajo hace falta la mariposa, no sumar arriba con arriba y abajo con abajo.' }
      ],
      pistas: ['El orden de siempre: primero la multiplicación, después la suma.', `${mt(fr(n(1), n(3)), por, fr(n(3), n(4)), igual, fr(n(3), n(12)), igual, fr(n(1), n(4)))}. Falta ${mt(fr(n(1), n(2)), mas, fr(n(1), n(4)))}.`],
      solucion: [`Primero la multiplicación: ${mt(fr(n(1), n(3)), por, fr(n(3), n(4)), igual, fr(n(3), n(12)), igual, fr(n(1), n(4)))}`, `Después la suma, con la mariposa: ${mt(fr(n(1), n(2)), mas, fr(n(1), n(4)), igual, fr(`${prod(n(1), n(4))} ${mas} ${prod(n(2), n(1))}`, prod(n(2), n(4))), igual, fr(n(6), n(8)), igual, fr(n(3), n(4)))}`]
    }
  ];

  const NIVELES = { basico: 'Básico', intermedio: 'Intermedio', examen: 'Tipo examen', reto: 'Reto' };
  const TEMAS = { fracciones: 'Fracciones', signos: 'Signos y orden', potencias: 'Potencias' };

  /* ---------- Plan de la clase (lo ve el estudiante en la cabecera del módulo) ---------- */
  const PLAN_CLASE = [
    ['8 min', 'Ideas clave, parte 1: las cuatro operaciones con fracciones.'],
    ['12 min', 'Mesa de sumas y restas: retos 1 a 5.'],
    ['12 min', 'Mesa de multiplicar y dividir: retos 1 a 7.'],
    ['6 min', 'Ideas clave, parte 2: signos y orden de las operaciones.'],
    ['12 min', 'Mesa de operaciones: retos 1 a 6. Los demás quedan de tarea.'],
    ['6 min', 'Ideas clave, parte 3: potencias con letras.'],
    ['10 min', 'Mesa de exponentes: retos 1 a 6.'],
    ['10 min', 'Práctica: ejercicios 1 a 5 en papel. De tarea quedan los demás.']
  ];

  MA.M2 = { RETOS_SUMAS, RETOS_FRACCIONES, RETOS_OPERACIONES, RETOS_EXPONENTES, EJERCICIOS, NIVELES, TEMAS, PLAN_CLASE, sup, pot, neg };
})();
