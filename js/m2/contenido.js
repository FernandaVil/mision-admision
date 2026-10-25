/* =====================================================================
   MÓDULO 2 · contenido (clase 2: fracciones, signos, jerarquía y
   potencias). La factorización y la ecuación cuadrática llegan en la
   clase 3, en esta misma página.
   ---------------------------------------------------------------------
   - CALENTAMIENTO: repaso del módulo 1, primero de cabeza y después
     en papel. Tres están armados para que la cabeza falle.
   - RETOS_FRACCIONES, RETOS_OPERACIONES, RETOS_COMA: herramientas.
   - EJERCICIOS: práctica progresiva (ids nuevos: m2.prac.*).
   Los ids de retos y ejercicios no se cambian: el avance se guarda
   con ellos en el navegador.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { vr, un, n, op, fr, mt, q, tach, cuad } = MA.f;
  const por = op('·'), igual = op('='), entre = op('÷');
  const qn = (valor, unidad) => `${n(valor)} ${un(unidad)}`;
  const qt = (valor, unidad) => `${n(valor)} ${tach(un(unidad))}`;
  const sup = e => `<sup class="exp">${typeof e === 'number' && e < 0 ? '−' + -e : e}</sup>`;
  // Potencia: la base y su exponente juntos, para que el exponente no se desalinee junto a una fracción
  const pot = (base, e) => `<span class="pot">${base}${sup(e)}</span>`;
  const p10 = e => pot(n(10), e);
  const neg = x => `${op('(')}${n(x)}${op(')')}`;   // número negativo entre paréntesis: (−6)
  const cien = (m, e) => `${n(m)} ${op('×')} ${p10(e)}`;

  /* ---------- Calentamiento: de cabeza y en papel ---------- */
  const CALENTAMIENTO = [
    {
      id: 'c1', unidad: 'm', respuesta: 3500,
      enunciado: `${q(3.5, 'km')} a metros.`,
      errores: [{ valor: 350, msg: 'Ese resultado sale de usar 1 km = 100 m. Kilo es mil: 1 km = 1000 m.' }],
      factores: `${qt(3.5, 'km')} ${por} ${fr(qn(1000, 'm'), qt(1, 'km'))} ${igual} ${q(3500, 'm')}`
    },
    {
      id: 'c2', unidad: 'h', respuesta: 1.75,
      enunciado: `${q(1, 'h')} ${q(45, 'min')}, escrito en horas.`,
      errores: [{ valor: 1.45, msg: 'Ese resultado sale de pegar los 45 min después de la coma. El tiempo va de 60 en 60: 45 min son 45/60 de hora.' }],
      factores: `${n(1)} ${un('h')} ${op('+')} ${qt(45, 'min')} ${por} ${fr(qn(1, 'h'), qt(60, 'min'))} ${igual} ${n(1)} ${un('h')} ${op('+')} ${q(0.75, 'h')} ${igual} ${q(1.75, 'h')}`
    },
    {
      id: 'c3', unidad: 'cm²', respuesta: 5000,
      enunciado: `${q(0.5, 'm²')} a cm².`,
      errores: [{ valor: 50, msg: 'Ese resultado sale de usar el factor una sola vez. m² es m · m: el factor va dos veces, así que 1 m² = 10 000 cm².' }],
      factores: `${n(0.5)} ${tach(un('m²'))} ${por} ${fr(qn(100, 'cm'), qt(1, 'm'))} ${por} ${fr(qn(100, 'cm'), qt(1, 'm'))} ${igual} ${q(5000, 'cm²')}`
    },
    {
      id: 'c4', unidad: 'min', respuesta: 90,
      enunciado: `Un avión recorre ${q(1200, 'km')} a ${q(800, 'km/h')}. ¿Cuántos minutos tarda?`,
      errores: [
        { valor: 150, msg: 'Ese resultado sale de leer 1,5 h como 1 h 50 min. 1,5 h es hora y media: 60 + 30 = 90 min.' },
        { valor: 1.5, msg: 'Eso es en horas. La pregunta pide minutos.' },
        { valor: 110, msg: 'Ese resultado sale de leer 1,5 h como 1 h 50 min. 1,5 h es hora y media: 60 + 30 = 90 min.' }
      ],
      factores: `${mt(vr('t'), igual, fr(vr('d'), vr('v')))} ${igual} ${qt(1200, 'km')} ${entre} ${fr(qt(800, 'km'), un('h'))} ${igual} ${q(1.5, 'h')} ${por} ${fr(qn(60, 'min'), `${n(1)} ${tach(un('h'))}`)} ${igual} ${q(90, 'min')}`
    },
    {
      id: 'c5', unidad: 'm/s', respuesta: 15,
      enunciado: `${q(54, 'km/h')} a m/s.`,
      errores: [
        { valor: 194.4, msg: 'Ese resultado sale de multiplicar por 3,6. En m/s el número se achica: se divide entre 3,6.' },
        { valor: 54000, msg: 'Ahí solo se convirtieron los km. Faltan las horas: 1 h = 3600 s.' }
      ],
      factores: `${fr(qt(54, 'km'), `${n(1)} ${tach(un('h'))}`)} ${por} ${fr(qn(1000, 'm'), qt(1, 'km'))} ${por} ${fr(`${n(1)} ${tach(un('h'))}`, qn(3600, 's'))} ${igual} ${fr(n(54000), n(3600))} ${un('m/s')} ${igual} ${q(15, 'm/s')}`
    }
  ];

  /* ---------- Mesa de fracciones ----------
     a ÷ b, cada una como { num: [...], den: [...] }: números enteros y
     unidades (texto). unidades: opciones para predecir la unidad final. */
  const RETOS_FRACCIONES = [
    { id: 'fr1', titulo: 'Seis entre un medio', contexto: '¿Cuántas medias porciones salen de 6 pizzas?',
      a: { num: [6], den: [] }, b: { num: [1], den: [2] } },
    { id: 'fr2', titulo: 'Tramos de una varilla', contexto: 'Una varilla mide 3/4 de metro. ¿Cuántos tramos de 3/8 de metro salen?',
      a: { num: [3], den: [4] }, b: { num: [3], den: [8] } },
    { id: 'fr3', titulo: 'Fracción entre fracción', contexto: 'Sin contexto: solo números.',
      a: { num: [2], den: [3] }, b: { num: [4], den: [9] } },
    { id: 'fr4', titulo: 'El tiempo de un viaje', contexto: `Un carro recorre ${q(150, 'km')} a ${q(60, 'km/h')}. El tiempo es ${mt(vr('t'), igual, vr('d'), entre, vr('v'))}.`,
      a: { num: [150, 'km'], den: [] }, b: { num: [60, 'km'], den: ['h'] }, unidades: ['h', 'km²/h', '1/h', 'km'], unidad: 'h' },
    { id: 'fr5', titulo: 'Carreteo en la pista', contexto: `Un avión carretea ${q(600, 'm')} a ${q(20, 'm/s')}. ¿Cuánto tarda?`,
      a: { num: [600, 'm'], den: [] }, b: { num: [20, 'm'], den: ['s'] }, unidades: ['m²/s', 's', '1/s', 'm'], unidad: 's' },
    { id: 'fr6', titulo: 'Energía y potencia', contexto: `Un motor de ${q(300, 'W')} entrega ${q(300, 'J')} cada segundo (1 W = 1 J/s). ¿Cuánto tarda en entregar ${q(900, 'J')}? Tiempo = energía ÷ potencia.`,
      a: { num: [900, 'J'], den: [] }, b: { num: [300, 'J'], den: ['s'] }, unidades: ['J²/s', '1/s', 's', 'W'], unidad: 's' },
    { id: 'fr7', titulo: 'La aceleración', contexto: `Un carro pasa de 0 a ${q(20, 'm/s')} en ${q(4, 's')}. La aceleración es ${mt(vr('a'), igual, vr('v'), entre, vr('t'))}. Aquí lo que divide no es una fracción.`,
      a: { num: [20, 'm'], den: ['s'] }, b: { num: [4, 's'], den: [] }, unidades: ['m', 'm/s²', 'm · s', 'm/s'], unidad: 'm/s²' }
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

  /* ---------- Corredor de la coma (notación científica) ----------
     El número es cifras × 10^p (p = valor del lugar de la última cifra).
     inicio = exponente con que arranca. meta: 'cientifica' (entre 1 y 10)
     o 'decimal' (sin potencia de 10). */
  const RETOS_COMA = [
    { id: 'nc1', cifras: '4', p: 5, inicio: 0, meta: 'cientifica', titulo: 'Un avión pesado', contexto: `Un avión de pasajeros grande puede despegar con unos ${q(400000, 'kg')}.`, unidad: 'kg' },
    { id: 'nc2', cifras: '12', p: 3, inicio: 0, meta: 'cientifica', titulo: 'Altitud de crucero', contexto: `Un avión comercial vuela a unos ${q(12000, 'm')} de altura.`, unidad: 'm' },
    { id: 'nc3', cifras: '8', p: -5, inicio: 0, meta: 'cientifica', titulo: 'Un cabello', contexto: `Un cabello tiene unos ${q('0,00008', 'm')} de grosor.`, unidad: 'm' },
    { id: 'nc4', cifras: '45', p: -3, inicio: 0, meta: 'cientifica', titulo: 'Un reloj', contexto: `Un reloj de pulsera mide unos ${q('0,045', 'm')} de ancho.`, unidad: 'm' },
    { id: 'nc5', cifras: '3', p: 8, inicio: 8, meta: 'decimal', titulo: 'La velocidad de la luz', contexto: `La luz viaja a unos ${mt(cien(3, 8))} ${un('m/s')}. ¿Cuánto es sin la potencia de 10?`, unidad: 'm/s' },
    { id: 'nc6', cifras: '15', p: -4, inicio: -3, meta: 'decimal', titulo: 'Un milímetro y medio', contexto: `${mt(cien(1.5, -3))} ${un('m')}, escrito sin la potencia de 10.`, unidad: 'm' }
  ];

  /* ---------- Práctica progresiva ---------- */
  const EJERCICIOS = [
    {
      id: 'e1', nivel: 'basico', tema: 'fracciones', tipo: 'numero', respuesta: 20,
      enunciado: `Calcular ${mt(n(5), entre, fr(n(1), n(4)))}.`,
      plano: 'Calcular 5 ÷ 1/4.',
      errores: [{ valor: 1.25, msg: 'Ese resultado sale de dividir 5 entre 4. Dividir entre 1/4 es multiplicar por 4/1.' }],
      pistas: ['¿Cuántos cuartos caben en 5 unidades?', `Dividir entre una fracción es multiplicar por la fracción dada vuelta: ${mt(n(5), por, fr(n(4), n(1)))}.`],
      solucion: [`${mt(n(5), entre, fr(n(1), n(4)), igual, n(5), por, fr(n(4), n(1)), igual, n(20))}`, 'Respuesta: 20. En cada unidad caben 4 cuartos; en 5 unidades, 20.'],
      herramienta: { boton: 'Probarlo en la mesa de fracciones', icono: 'regla', seccion: 'fracciones', problema: { a: { num: [5], den: [] }, b: { num: [1], den: [4] } } }
    },
    {
      id: 'e2', nivel: 'basico', tema: 'signos', tipo: 'numero', respuesta: 1,
      enunciado: `Calcular ${mt(n('−8'), op('+'), n(3), op('−'), neg(-6))}.`,
      plano: 'Calcular −8 + 3 − (−6).',
      errores: [
        { valor: -11, msg: 'Ese resultado sale de restar 6. Restar un negativo es sumar: − (−6) = + 6.' },
        { valor: -1, msg: 'Revisar el primer paso: −8 + 3 = −5 (debía 8, pagó 3, todavía debe 5).' }
      ],
      pistas: ['De izquierda a derecha. Primero −8 + 3.', `${mt(n('−5'), op('−'), neg(-6))}: quitar una deuda es como ganar plata.`],
      solucion: [`${mt(n('−8'), op('+'), n(3), igual, n('−5'))}`, `${mt(n('−5'), op('−'), neg(-6), igual, n('−5'), op('+'), n(6), igual, n(1))}`],
      herramienta: { boton: 'Probarlo en la mesa de operaciones', icono: 'objetivo', seccion: 'operaciones', expr: '-8 + 3 - (-6)' }
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
      herramienta: { boton: 'Probarlo en la mesa de operaciones', icono: 'objetivo', seccion: 'operaciones', expr: '(-6) * (-2) / (-3)' }
    },
    {
      id: 'e4', nivel: 'basico', tema: 'potencias', tipo: 'numero', respuesta: 32,
      enunciado: `¿Cuánto vale ${mt(`${pot(n(2), 3)}`, por, `${pot(n(2), 2)}`)}?`,
      plano: '¿Cuánto vale 2³ · 2²?',
      errores: [
        { valor: 64, msg: 'Ese resultado sale de multiplicar los exponentes (2⁶). Al multiplicar se juntan los doses: 3 + 2 = 5.' },
        { valor: 10, msg: 'Ese resultado sale de multiplicar base por exponente. 2³ es 2 · 2 · 2 = 8, no 2 · 3.' }
      ],
      pistas: [`Contar los doses: ${mt(`${pot(n(2), 3)}`, igual, n(2), por, n(2), por, n(2))} y ${mt(`${pot(n(2), 2)}`, igual, n(2), por, n(2))}.`, `En total hay 5 doses: ${mt(`${pot(n(2), 5)}`)}.`],
      solucion: [`${mt(`${pot(n(2), 3)}`, por, `${pot(n(2), 2)}`, igual, `${pot(n(2), '3 + 2')}`, igual, `${pot(n(2), 5)}`)}`, `${mt(`${pot(n(2), 5)}`, igual, n(2), por, n(2), por, n(2), por, n(2), por, n(2), igual, n(32))}`]
    },
    {
      id: 'e5', nivel: 'intermedio', tema: 'fracciones', tipo: 'numero', respuesta: 1.5,
      enunciado: `Calcular ${mt(fr(n(2), n(5)), entre, fr(n(4), n(15)))}. Se puede responder con fracción (3/2) o con decimal.`,
      plano: 'Calcular 2/5 ÷ 4/15.',
      errores: [
        { valor: 8 / 75, msg: 'Ese resultado sale de multiplicar sin dar vuelta la segunda fracción.' },
        { valor: 2 / 3, msg: 'Ese resultado sale de dar vuelta la primera fracción. Se da vuelta la que divide: 4/15.' }
      ],
      pistas: [`${mt(fr(n(2), n(5)), por, fr(n(15), n(4)))}. Antes de multiplicar, conviene tachar.`, 'El 15 de arriba y el 5 de abajo se dividen entre 5; el 2 de arriba y el 4 de abajo, entre 2.'],
      solucion: [`${mt(fr(n(2), n(5)), entre, fr(n(4), n(15)), igual, fr(n(2), n(5)), por, fr(n(15), n(4)))}`, `Simplificando: ${mt(fr(`${n(1)} ${por} ${n(3)}`, `${n(1)} ${por} ${n(2)}`), igual, fr(n(3), n(2)), igual, n(1.5))}`],
      herramienta: { boton: 'Probarlo en la mesa de fracciones', icono: 'regla', seccion: 'fracciones', problema: { a: { num: [2], den: [5] }, b: { num: [4], den: [15] } } }
    },
    {
      id: 'e6', nivel: 'intermedio', tema: 'signos', tipo: 'numero', respuesta: 14,
      enunciado: `Calcular ${mt(n(20), op('−'), n(4), por, `${pot(n(3), 2)}`, entre, n(6))}.`,
      plano: 'Calcular 20 − 4 · 3² ÷ 6.',
      errores: [
        { valor: 16, msg: 'Ese resultado sale de restar primero (20 − 4 = 16). La resta va al final.' },
        { valor: 18, msg: 'Ese resultado sale de 4 · 3 = 12 sin elevar al cuadrado. La potencia va antes: 3² = 9.' },
        { valor: 6, msg: 'Revisar el último paso: 20 − 6 = 14.' }
      ],
      pistas: ['Orden: potencias → multiplicar y dividir (de izquierda a derecha) → sumar y restar.', `${mt(`${pot(n(3), 2)}`, igual, n(9))}; después ${mt(n(4), por, n(9), igual, n(36))} y ${mt(n(36), entre, n(6))}.`],
      solucion: [`${mt(`${pot(n(3), 2)}`, igual, n(9))} → ${mt(n(20), op('−'), n(4), por, n(9), entre, n(6))}`, `${mt(n(4), por, n(9), igual, n(36))} y ${mt(n(36), entre, n(6), igual, n(6))} → ${mt(n(20), op('−'), n(6), igual, n(14))}`],
      herramienta: { boton: 'Probarlo en la mesa de operaciones', icono: 'objetivo', seccion: 'operaciones', expr: '20 - 4 * 3^2 / 6' }
    },
    {
      id: 'e7', nivel: 'intermedio', tema: 'potencias', tipo: 'numero', respuesta: 1000,
      enunciado: `Escribir el valor de ${mt(fr(`${p10(5)} ${por} ${p10(-3)}`, p10(-1)))}.`,
      plano: 'Escribir el valor de (10⁵ · 10⁻³) / 10⁻¹.',
      errores: [
        { valor: 10, msg: 'Revisar la resta del exponente: 2 − (−1) = 2 + 1 = 3.' },
        { valor: 100, msg: 'Ese es el numerador (10²). Falta dividir entre 10⁻¹, que es lo mismo que multiplicar por 10.' }
      ],
      pistas: ['Al multiplicar potencias de 10, los exponentes se suman; al dividir, se restan.', `Arriba: ${mt(pot(n(10), '5 + (−3)'), igual, p10(2))}. Después: ${mt(pot(n(10), '2 − (−1)'))}.`],
      solucion: [`${mt(p10(5), por, p10(-3), igual, p10(2))}`, `${mt(fr(p10(2), p10(-1)), igual, `${pot(n(10), '2 + 1')}`, igual, p10(3), igual, n(1000))}`]
    },
    {
      id: 'e8', nivel: 'intermedio', tema: 'notacion', tipo: 'opciones', correcta: 0,
      enunciado: `¿Cómo se escribe ${n('0,00056')} en notación científica?`,
      plano: '¿Cómo se escribe 0,00056 en notación científica?',
      opciones: [mt(cien(5.6, -4)), mt(cien(5.6, 4)), mt(cien(56, -5)), mt(cien(5.6, -3))],
      opcionesPlano: ['5,6 × 10⁻⁴', '5,6 × 10⁴', '56 × 10⁻⁵', '5,6 × 10⁻³'],
      porQue: {
        1: 'El número es menor que 1: el exponente tiene que ser negativo.',
        2: 'Vale lo mismo, pero no es notación científica: el primer número tiene que estar entre 1 y 10.',
        3: 'Hay que contar los lugares: la coma se mueve 4 lugares (0,0005,6), no 3.'
      },
      pistas: ['La coma se mueve hasta que quede una sola cifra distinta de cero a la izquierda: 5,6.', 'Se movió hacia la derecha: el número creció, así que el exponente baja. ¿Cuántos lugares?'],
      solucion: ['0,00056 → 5,6: la coma se mueve 4 lugares a la derecha.', `El número se hizo 10 000 veces más grande; para compensar, se multiplica por ${p10(-4)}: ${mt(cien(5.6, -4))}.`],
      herramienta: { boton: 'Probarlo en el corredor de la coma', icono: 'flechaD', seccion: 'potencias', problema: { cifras: '56', p: -5, inicio: 0, meta: 'cientifica' } }
    },
    {
      id: 'e9', nivel: 'intermedio', tema: 'fracciones', tipo: 'numero', respuesta: 60, unidad: 's',
      enunciado: `Un dron recorre ${q(1500, 'm')} a ${q(25, 'm/s')}. ¿Cuántos segundos tarda?`,
      plano: 'Un dron recorre 1500 m a 25 m/s. ¿Cuántos segundos tarda?',
      errores: [
        { valor: 37500, msg: 'Ese resultado sale de multiplicar d · v. El tiempo es t = d ÷ v.' },
        { valor: 1 / 60, msg: 'Esa es la división al revés: t = 1500 ÷ 25.' }
      ],
      pistas: [`${mt(vr('t'), igual, vr('d'), entre, vr('v'))}. ¿En qué unidad queda ${mt(un('m'), entre, un('m/s'))}?`, `${mt(un('m'), entre, fr(un('m'), un('s')), igual, tach(un('m')), por, fr(un('s'), tach(un('m'))), igual, un('s'))}. Queda ${mt(n(1500), entre, n(25))}.`],
      solucion: [`${mt(vr('t'), igual, qt(1500, 'm'), entre, fr(qt(25, 'm'), un('s')), igual, fr(n(1500), n(25)), un('s'))}`, `${mt(fr(n(1500), n(25)), igual, fr(n(6000), n(100)), igual, n(60))}. Respuesta: ${q(60, 's')}, un minuto.`]
    },
    {
      id: 'e10', nivel: 'examen', tema: 'signos', tipo: 'numero', respuesta: -12,
      enunciado: `Calcular ${mt(`${pot(neg(-2), 3)}`, op('−'), `${pot(neg(-2), 2)}`)}.`,
      plano: 'Calcular (−2)³ − (−2)².',
      errores: [
        { valor: -4, msg: 'Revisar (−2)²: menos por menos da más, así que vale +4, y −8 − 4 = −12.' },
        { valor: 4, msg: 'Revisar (−2)³: son tres negativos multiplicados, y el resultado es negativo (−8).' },
        { valor: 12, msg: 'El número está bien, pero el signo no: −8 − 4 queda negativo.' }
      ],
      pistas: [`${mt(`${pot(neg(-2), 3)}`, igual, neg(-2), por, neg(-2), por, neg(-2))}: ¿cuántos signos menos hay?`, `${mt(`${pot(neg(-2), 3)}`, igual, n('−8'))} y ${mt(`${pot(neg(-2), 2)}`, igual, n(4))}.`],
      solucion: [`${mt(`${pot(neg(-2), 3)}`, igual, n('−8'))}: un número impar de negativos da negativo.`, `${mt(`${pot(neg(-2), 2)}`, igual, n(4))}: un número par de negativos da positivo.`, `${mt(n('−8'), op('−'), n(4), igual, n('−12'))}`],
      herramienta: { boton: 'Probarlo en la mesa de operaciones', icono: 'objetivo', seccion: 'operaciones', expr: '(-2)^3 - (-2)^2' }
    },
    {
      id: 'e11', nivel: 'examen', tema: 'notacion', tipo: 'opciones', correcta: 0,
      enunciado: `¿Cuánto da ${mt(op('('), cien(4, 3), op(')'), por, op('('), cien(3, -5), op(')'))}?`,
      plano: '¿Cuánto da (4 × 10³) · (3 × 10⁻⁵)?',
      opciones: [mt(cien(1.2, -1)), mt(cien(1.2, -2)), mt(cien(7, -2)), mt(cien(12, -15))],
      opcionesPlano: ['1,2 × 10⁻¹', '1,2 × 10⁻²', '7 × 10⁻²', '12 × 10⁻¹⁵'],
      porQue: {
        1: 'Casi: 4 · 3 = 12 y 10³ · 10⁻⁵ = 10⁻², pero al pasar 12 a 1,2 el exponente sube 1.',
        2: 'Los números se multiplican (4 · 3 = 12), no se suman.',
        3: 'Al multiplicar potencias de 10, los exponentes se suman: 3 + (−5) = −2, no 3 · (−5).'
      },
      pistas: ['Números con números y potencias con potencias: 4 · 3 y 10³ · 10⁻⁵.', `${mt(n(12), op('×'), p10(-2))}. Falta dejar el primer número entre 1 y 10.`],
      solucion: [`${mt(n(4), por, n(3), igual, n(12))} y ${mt(p10(3), por, p10(-5), igual, p10(-2))}`, `${mt(n(12), op('×'), p10(-2), igual, cien(1.2, 1), por, p10(-2), igual, cien(1.2, -1))}, es decir, 0,12.`]
    },
    {
      id: 'e12', nivel: 'examen', tema: 'notacion', tipo: 'opciones', correcta: 0,
      enunciado: `¿Cuánto da ${mt(fr(cien(6, 8), cien(2, 3)))}?`,
      plano: '¿Cuánto da (6 × 10⁸) / (2 × 10³)?',
      opciones: [mt(cien(3, 5)), mt(cien(3, 11)), mt(cien(4, 5)), mt(cien(3, '8/3'))],
      opcionesPlano: ['3 × 10⁵', '3 × 10¹¹', '4 × 10⁵', '3 × 10^(8/3)'],
      porQue: {
        1: 'Al dividir potencias de 10, los exponentes se restan: 8 − 3 = 5.',
        2: 'Los números se dividen: 6 ÷ 2 = 3, no 6 − 2.',
        3: 'Los exponentes se restan, no se dividen.'
      },
      pistas: ['Números con números y potencias con potencias.', `${mt(n(6), entre, n(2), igual, n(3))}. ¿Y ${mt(p10(8), entre, p10(3))}?`],
      solucion: [`${mt(n(6), entre, n(2), igual, n(3))} y ${mt(p10(8), entre, p10(3), igual, `${pot(n(10), '8 − 3')}`, igual, p10(5))}`, `Respuesta: ${mt(cien(3, 5))}, es decir, 300 000.`]
    },
    {
      id: 'e13', nivel: 'examen', tema: 'fracciones', tipo: 'numero', respuesta: 20, unidad: 's',
      enunciado: `Una bomba de agua tiene una potencia de ${q(250, 'W')} (${q(250, 'J/s')}). ¿Cuánto tarda en entregar ${q(5000, 'J')}?`,
      plano: 'Una bomba de agua tiene una potencia de 250 W (250 J/s). ¿Cuánto tarda en entregar 5000 J?',
      errores: [
        { valor: 1250000, msg: 'Ese resultado sale de multiplicar. Tiempo = energía ÷ potencia.' },
        { valor: 0.05, msg: 'Esa es la división al revés: 5000 ÷ 250.' }
      ],
      pistas: [`Tiempo = energía ÷ potencia: ${mt(qn(5000, 'J'), entre, fr(qn(250, 'J'), un('s')))}.`, `Dar vuelta y multiplicar: ${mt(un('J'), por, fr(un('s'), un('J')), igual, un('s'))}. Queda ${mt(n(5000), entre, n(250))}.`],
      solucion: [`${mt(qt(5000, 'J'), por, fr(un('s'), qt(250, 'J')), igual, fr(n(5000), n(250)), un('s'))}`, `${mt(fr(n(5000), n(250)), igual, fr(n(500), n(25)), igual, n(20))}. Respuesta: ${q(20, 's')}.`],
      herramienta: { boton: 'Probarlo en la mesa de fracciones', icono: 'regla', seccion: 'fracciones', problema: { a: { num: [5000, 'J'], den: [] }, b: { num: [250, 'J'], den: ['s'] }, unidades: ['s', 'J²/s', '1/s', 'W'], unidad: 's' } }
    },
    {
      id: 'e14', nivel: 'examen', tema: 'potencias', tipo: 'opciones', correcta: 0,
      enunciado: `Simplificar ${mt(fr(`${pot(vr('x'), 4)} ${por} ${pot(vr('x'), 3)}`, `${pot(vr('x'), 5)}`))}.`,
      plano: 'Simplificar (x⁴ · x³) / x⁵.',
      opciones: [mt(`${pot(vr('x'), 2)}`), mt(`${pot(vr('x'), 7)}`), mt(`${pot(vr('x'), '12/5')}`), mt(`${pot(vr('x'), -2)}`)],
      opcionesPlano: ['x²', 'x⁷', 'x^(12/5)', 'x⁻²'],
      porQue: {
        1: 'Ese es solo el numerador: falta dividir entre x⁵.',
        2: 'Los exponentes no se multiplican ni se dividen: arriba se suman (4 + 3) y al dividir se restan.',
        3: 'La resta es al revés: arriba hay 7 equis y abajo 5. Quedan 2 arriba.'
      },
      pistas: ['Contar las x: ¿cuántas hay arriba y cuántas abajo?', 'Arriba hay 7 x y abajo 5. Se tachan por parejas.'],
      solucion: [`Arriba: ${mt(`${pot(vr('x'), 4)}`, por, `${pot(vr('x'), 3)}`, igual, `${pot(vr('x'), 7)}`)}`, `${mt(fr(`${pot(vr('x'), 7)}`, `${pot(vr('x'), 5)}`), igual, `${pot(vr('x'), '7 − 5')}`, igual, `${pot(vr('x'), 2)}`)}: se tachan 5 parejas y quedan 2 x arriba.`]
    },
    {
      id: 'e15', nivel: 'reto', tema: 'signos', tipo: 'numero', respuesta: -16,
      enunciado: `Calcular ${mt(op('['), n(2), op('−'), n(3), por, neg(-2), `${pot(op(']'), 2)}`, entre, neg(-4))}.`,
      plano: 'Calcular [2 − 3 · (−2)]² ÷ (−4).',
      errores: [
        { valor: 16, msg: 'El número está bien, pero el signo no: 64 ÷ (−4) tiene signos distintos.' },
        { valor: -0.25, msg: 'Revisar el corchete: 2 − 3 · (−2) = 2 + 6 = 8, no −2.' },
        { valor: -1, msg: 'Revisar el corchete: primero 3 · (−2) = −6, y 2 − (−6) = 8.' }
      ],
      pistas: ['Primero lo de adentro del corchete, con su propio orden: multiplicar antes de restar.', `${mt(n(2), op('−'), n(3), por, neg(-2), igual, n(2), op('+'), n(6), igual, n(8))}. Falta ${mt(`${pot(n(8), 2)}`, entre, neg(-4))}.`],
      solucion: [`${mt(n(3), por, neg(-2), igual, n('−6'))} → ${mt(n(2), op('−'), neg(-6), igual, n(8))}`, `${mt(`${pot(n(8), 2)}`, igual, n(64))} → ${mt(n(64), entre, neg(-4), igual, n('−16'))}`],
      herramienta: { boton: 'Probarlo en la mesa de operaciones', icono: 'objetivo', seccion: 'operaciones', expr: '(2 - 3 * (-2))^2 / (-4)' }
    },
    {
      id: 'e16', nivel: 'reto', tema: 'notacion', tipo: 'numero', respuesta: 5, unidad: 'h',
      enunciado: `Un avión vuela a ${q(900, 'km/h')}. ¿Cuántas horas tarda en recorrer ${mt(cien(4.5, 3))} ${un('km')}?`,
      plano: 'Un avión vuela a 900 km/h. ¿Cuántas horas tarda en recorrer 4,5 × 10³ km?',
      errores: [
        { valor: 0.2, msg: 'Esa es la división al revés: t = d ÷ v = 4500 ÷ 900.' },
        { valor: 0.005, msg: 'Revisar 4,5 × 10³: la coma se mueve 3 lugares a la derecha, 4500.' }
      ],
      pistas: [`${mt(cien(4.5, 3), igual, n(4500))}: la coma se mueve tres lugares.`, `${mt(vr('t'), igual, qt(4500, 'km'), entre, fr(qt(900, 'km'), un('h')))}: los km se cancelan y quedan horas.`],
      solucion: [`${mt(cien(4.5, 3), igual, n(4500))}`, `${mt(vr('t'), igual, fr(n(4500), n(900)), un('h'), igual, fr(n(45), n(9)), un('h'), igual, q(5, 'h'))}`]
    }
  ];

  const NIVELES = { basico: 'Básico', intermedio: 'Intermedio', examen: 'Tipo examen', reto: 'Reto' };
  const TEMAS = { fracciones: 'Fracciones', signos: 'Signos y orden', potencias: 'Potencias', notacion: 'Notación científica' };

  /* ---------- Plan de la clase (lo ve el estudiante en la cabecera del módulo) ---------- */
  const PLAN_CLASE = [
    ['12 min', 'Calentamiento: cinco conversiones del módulo 1, primero de cabeza y después en papel.'],
    ['6 min', 'Ideas clave, parte 1: fracciones, y qué pasa cuando una fracción divide.'],
    ['12 min', 'Mesa de fracciones: retos 1 a 7.'],
    ['6 min', 'Ideas clave, parte 2: signos y orden de las operaciones.'],
    ['13 min', 'Mesa de operaciones: retos 1 a 9, eligiendo antes qué operación va primero.'],
    ['6 min', 'Ideas clave, parte 3: potencias y notación científica.'],
    ['10 min', 'Corredor de la coma: retos 1 a 6.'],
    ['10 min', 'Práctica: ejercicios 1 a 6 en papel. De tarea quedan los demás.']
  ];

  MA.M2 = { CALENTAMIENTO, RETOS_FRACCIONES, RETOS_OPERACIONES, RETOS_COMA, EJERCICIOS, NIVELES, TEMAS, PLAN_CLASE, p10, sup, pot, cien, neg };
})();
