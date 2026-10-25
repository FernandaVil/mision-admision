/* =====================================================================
   MÓDULO 1 · CONTENIDO (aquí se editan textos, retos y ejercicios)
   ---------------------------------------------------------------------
   - FORMULAS: fórmulas que se pueden poner en la balanza.
   - RETOS_BALANZA y RETOS_CONVERSION: actividades guiadas.
   - EJERCICIOS: práctica progresiva (tipo 'numero' u 'opciones').
   Estilo de los textos de la página: impersonal («se divide»,
   «hace falta»), sin tú ni usted. Los errores típicos empiezan con
   «Ese resultado sale de…».
   Notación: MA.f.vr('v','0') -> v₀ · MA.f.fr(a, b) -> fracción ·
             MA.f.q(72, 'km/h') -> cantidad · MA.f.tach(x) -> tachado ·
             MA.f.raiz(x) -> raíz cuadrada · MA.f.cuad(x) -> x²
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { vr, un, n, op, fr, mt, q, tach, bloque, raiz, cuad } = MA.f;
  const por = op('·'), igual = op('=');
  const cad = (...p) => mt(p.join(` ${por} `));
  const qt = (valor, unidad) => `${n(valor)} ${tach(un(unidad))}`; // cantidad con unidad tachada
  const qn = (valor, unidad) => `${n(valor)} ${un(unidad)}`;

  /* ---------- Fórmulas de la balanza ---------- */
  const FORMULAS = {
    dvt: {
      nombre: 'Movimiento uniforme', izq: 'd', der: 'v*t',
      vars: {
        d: { html: 'd', nombre: 'distancia', u: { km: 1 }, calculada: true },
        v: { html: 'v', nombre: 'velocidad', u: { km: 1, h: -1 }, min: 20, max: 120, paso: 10, valor: 50 },
        t: { html: 't', nombre: 'tiempo', u: { h: 1 }, min: 2, max: 8, paso: 0.5, valor: 3 }
      },
      calcular: x => ({ d: x.v * x.t })
    },
    fma: {
      nombre: 'Segunda ley de Newton', izq: 'F', der: 'm*a',
      vars: {
        F: { html: 'F', nombre: 'fuerza', u: { kg: 1, m: 1, s: -2 }, calculada: true },
        m: { html: 'm', nombre: 'masa', u: { kg: 1 }, min: 500, max: 3000, paso: 100, valor: 1200 },
        a: { html: 'a', nombre: 'aceleración', u: { m: 1, s: -2 }, min: 1.5, max: 6, paso: 0.5, valor: 2.5 }
      },
      calcular: x => ({ F: x.m * x.a })
    },
    vdt: {
      nombre: 'Velocidad media', izq: 'v', der: 'd/t',
      vars: {
        v: { html: 'v', nombre: 'velocidad', u: { m: 1, s: -1 }, calculada: true },
        d: { html: 'd', nombre: 'distancia', u: { m: 1 }, min: 100, max: 2000, paso: 100, valor: 600 },
        t: { html: 't', nombre: 'tiempo', u: { s: 1 }, min: 2, max: 40, paso: 2, valor: 12 }
      },
      calcular: x => ({ v: x.d / x.t })
    },
    vfat: {
      nombre: 'Movimiento acelerado', izq: 'vf', der: 'v0 + a*t', sumas: true,
      vars: {
        vf: { html: 'v<sub>f</sub>', nombre: 'velocidad final', u: { m: 1, s: -1 }, calculada: true },
        v0: { html: 'v<sub>0</sub>', nombre: 'velocidad inicial', u: { m: 1, s: -1 }, min: 2, max: 30, paso: 2, valor: 10 },
        a: { html: 'a', nombre: 'aceleración', u: { m: 1, s: -2 }, min: 1.5, max: 6, paso: 0.5, valor: 4 },
        t: { html: 't', nombre: 'tiempo', u: { s: 1 }, min: 2, max: 20, paso: 1, valor: 5 }
      },
      calcular: x => ({ vf: x.v0 + x.a * x.t })
    }
  };

  /* ---------- Retos de la balanza ---------- */
  const RETOS_BALANZA = [
    { id: 'b1', formula: 'dvt', meta: 't', titulo: '¿Cuánto dura el vuelo?',
      contexto: `Se conocen la distancia ${vr('d')} de una ruta y la velocidad ${vr('v')} del avión. Para calcular el tiempo hace falta la fórmula con la ${vr('t')} sola.` },
    { id: 'b2', formula: 'dvt', meta: 'v', titulo: 'La velocidad necesaria',
      contexto: `Ahora la pregunta es a qué velocidad hay que volar para cubrir una distancia en cierto tiempo: hay que dejar sola la ${vr('v')}.` },
    { id: 'b3', formula: 'fma', meta: 'a', titulo: 'Aceleración en la pista',
      contexto: `La segunda ley de Newton dice que ${mt(vr('F'), igual, vr('m'), por, vr('a'))}. Si se conocen la fuerza del motor y la masa del avión, ¿cómo se calcula la aceleración?` },
    { id: 'b4', formula: 'vdt', meta: 'd', titulo: 'Una variable que divide',
      contexto: `En ${mt(vr('v'), igual, fr(vr('d'), vr('t')))} la ${vr('d')} está dividida entre ${vr('t')}. ¿Cuál es la operación contraria a dividir?` },
    { id: 'b5', formula: 'vdt', meta: 't', titulo: 'Dos pasos: sacar la t de abajo',
      contexto: `La ${vr('t')} está en el denominador. Primero hay que subirla y después dejarla sola: son dos operaciones.` },
    { id: 'b6', formula: 'vfat', meta: 't', titulo: 'Despeje con suma',
      contexto: `Velocidad final en el movimiento acelerado. Regla de oro: primero se quita lo que suma o resta; después, lo que multiplica o divide.` }
  ];

  /* ---------- Retos de conversión ---------- */
  const RETOS_CONVERSION = [
    { id: 'c1', titulo: 'Longitud de una pista', inicio: { valor: 2.5, u: { km: 1 } }, meta: { m: 1 },
      contexto: 'Una pista de aterrizaje mide 2,5 km. ¿Cuántos metros son?',
      banco: ['km_m', 'm_cm', 'h_min'],
      nota: '2,5 km y 2500 m son la misma longitud con distinto nombre. Multiplicar por 1000 m / 1 km es multiplicar por 1.' },
    { id: 'c2', titulo: 'Duración de un vuelo', inicio: { valor: 3, u: { h: 1 } }, meta: { s: 1 },
      contexto: 'Un vuelo dura 3 h. ¿Cuántos segundos son? No hay una equivalencia directa en el banco: hay que encadenar dos factores.',
      banco: ['h_min', 'min_s', 'km_m'],
      nota: 'Los factores se encadenan: h → min → s. Cada uno cancela la unidad que dejó el anterior.' },
    { id: 'c3', titulo: 'Velocidad de un helicóptero', inicio: { valor: 72, u: { km: 1, h: -1 } }, meta: { m: 1, s: -1 },
      contexto: 'Un helicóptero vuela a 72 km/h. ¿Cuánto es en m/s? Hay dos unidades por cambiar: una arriba y otra abajo.',
      banco: ['km_m', 'h_s', 'h_min', 'min_s', 'm_cm'],
      nota: 'De aquí sale el famoso 3,6: 1000 / 3600 = 1 / 3,6. De km/h a m/s se divide entre 3,6: 72 ÷ 3,6 = 20.' },
    { id: 'c4', titulo: 'Velocidad de despegue', inicio: { valor: 50, u: { m: 1, s: -1 } }, meta: { km: 1, h: -1 },
      contexto: 'Una avioneta despega a 50 m/s. ¿Cuánto es en km/h?',
      banco: ['km_m', 'h_s', 'm_cm', 'h_min'],
      nota: 'Al revés que antes: de m/s a km/h se multiplica por 3,6. Comprobación: 50 · 3,6 = 180.' },
    { id: 'c5', titulo: 'La trampa de las áreas', inicio: { valor: 30000, u: { cm: 2 } }, meta: { m: 2 },
      contexto: 'Un panel del ala mide 30 000 cm². ¿Cuántos m² son? Pista: cm² significa cm · cm.',
      banco: ['m_cm', 'km_m', 'm_mm'],
      nota: 'Como cm² es cm · cm, el factor se usa dos veces. Por eso 1 m² = 10 000 cm², no 100 cm². Es uno de los errores más comunes del examen.' },
    { id: 'c6', titulo: 'Equivalencia del enunciado', inicio: { valor: 9000, u: { ft: 1 } }, meta: { m: 1 },
      contexto: 'Un avión vuela a 9000 ft de altitud. El examen indica que 1 ft = 0,3 m. ¿A cuántos metros vuela?',
      banco: ['ft_m', 'm_cm', 'km_m'],
      nota: 'Si el enunciado da una equivalencia, se usa tal cual (0,3), aunque uno recuerde otro valor. Esa frase ya es el factor.' },
    { id: 'c7', titulo: 'Densidad del combustible', inicio: { valor: 0.8, u: { g: 1, mL: -1 } }, meta: { kg: 1, L: -1 },
      contexto: 'El combustible de una avioneta tiene una densidad de 0,8 g/mL. ¿Cuánto es en kg/L?',
      banco: ['kg_g', 'L_mL', 'm_cm'],
      nota: 'Mismo número, otras unidades: 0,8 g/mL = 0,8 kg/L, porque los dos factores (÷ 1000 y × 1000) se compensan. Este tipo de conversión vuelve en el módulo de estequiometría.' }
  ];

  /* ---------- Práctica progresiva ---------- */
  const EJERCICIOS = [
    {
      id: 'e1', nivel: 'basico', tema: 'conversion', tipo: 'numero', respuesta: 3500, unidad: 'm',
      enunciado: `Una pista de rodaje mide ${q(3.5, 'km')}. ¿Cuántos metros son?`,
      plano: 'Una pista de rodaje mide 3,5 km. ¿Cuántos metros son?',
      errores: [
        { valor: 0.0035, msg: 'Ese resultado sale de dividir entre 1000. Pero el metro es más pequeño que el kilómetro: hacen falta más metros, así que el número debe crecer.' },
        { valor: 350, msg: 'Ese resultado sale de usar 100. «Kilo» significa mil: 1 km = 1000 m.' }
      ],
      pistas: [
        '¿Cuántos metros tiene 1 km? Esa equivalencia se puede escribir como una fracción que vale 1.',
        `Con el factor ${fr(qn(1000, 'm'), qn(1, 'km'))}, el km de arriba se cancela con el km de abajo.`
      ],
      solucion: [
        cad(qt(3.5, 'km'), fr(qn(1000, 'm'), qt(1, 'km'))),
        `${mt(n(3.5), por, n(1000), igual, n(3500))}. Multiplicar por 1000 corre la coma tres lugares a la derecha.`,
        `Respuesta: ${q(3500, 'm')}`
      ],
      herramienta: { tipo: 'conversion', problema: { inicio: { valor: 3.5, u: { km: 1 } }, meta: { m: 1 }, banco: ['km_m', 'm_cm'] } }
    },
    {
      id: 'e2', nivel: 'basico', tema: 'conversion', tipo: 'numero', respuesta: 150, unidad: 'min',
      enunciado: `Un vuelo nacional dura ${q(2.5, 'h')}. ¿Cuántos minutos son?`,
      plano: 'Un vuelo nacional dura 2,5 h. ¿Cuántos minutos son?',
      errores: [
        { valor: 250, msg: 'Ese resultado sale de tomar la hora como 100 minutos. Una hora tiene 60: 2,5 h son 2 h y media, es decir, 2 h y 30 min.' },
        { valor: 2.5 / 60, msg: 'Ese resultado sale de dividir entre 60. Los minutos son más pequeños que las horas, así que el número debe crecer.' }
      ],
      pistas: [
        '1 h = 60 min. ¿El número de minutos debe ser mayor o menor que 2,5?',
        `Se multiplica por ${fr(qn(60, 'min'), qn(1, 'h'))}: ${mt(n(2.5), por, n(60))}.`
      ],
      solucion: [
        cad(qt(2.5, 'h'), fr(qn(60, 'min'), qt(1, 'h'))),
        `${mt(n(2.5), por, n(60), igual, n(150))}. Truco: 2 h son 120 min y media hora son 30 min.`,
        `Respuesta: ${q(150, 'min')}`
      ],
      herramienta: { tipo: 'conversion', problema: { inicio: { valor: 2.5, u: { h: 1 } }, meta: { min: 1 }, banco: ['h_min', 'min_s'] } }
    },
    {
      id: 'e3', nivel: 'basico', tema: 'despeje', tipo: 'opciones', correcta: 0,
      enunciado: `En la fórmula del movimiento uniforme ${mt(vr('d'), igual, vr('v'), por, vr('t'))}, ¿cuál es el despeje correcto del tiempo ${vr('t')}?`,
      plano: 'En la fórmula del movimiento uniforme d = v · t, ¿cuál es el despeje correcto del tiempo t?',
      opcionesPlano: ['t = d / v', 't = v / d', 't = d · v', 't = d − v'],
      opciones: [
        mt(vr('t'), igual, fr(vr('d'), vr('v'))),
        mt(vr('t'), igual, fr(vr('v'), vr('d'))),
        mt(vr('t'), igual, vr('d'), por, vr('v')),
        mt(vr('t'), igual, vr('d'), op('−'), vr('v'))
      ],
      porQue: {
        1: 'Esa es la fracción al revés. Con números se nota: 100 km a 50 km/h son 2 h, pero v / d = 50 / 100 = 0,5.',
        2: 'La v está multiplicando a la t. Para quitarla hay que hacer lo contrario en los dos lados: dividir, no multiplicar.',
        3: 'La v no está sumando a la t: la está multiplicando. Lo contrario de multiplicar es dividir.'
      },
      pistas: [
        `¿Qué operación une a la ${vr('v')} con la ${vr('t')}?`,
        `Dividir los dos lados entre ${vr('v')} y simplificar: ${mt(vr('v'), op('÷'), vr('v'), igual, n(1))}.`
      ],
      solucion: [
        mt(vr('d'), igual, vr('v'), por, vr('t')),
        `Se dividen los dos lados entre ${vr('v')}: ${mt(fr(vr('d'), vr('v')), igual, fr(`${tach(vr('v'))} ${por} ${vr('t')}`, tach(vr('v'))))}`,
        `La ${vr('v')} se cancela: ${mt(vr('t'), igual, fr(vr('d'), vr('v')))}`
      ],
      herramienta: { tipo: 'balanza', formula: 'dvt', meta: 't' }
    },
    {
      id: 'e4', nivel: 'basico', tema: 'despeje', tipo: 'numero', respuesta: 600, unidad: 'km/h',
      enunciado: `Un avión recorre ${q(1200, 'km')} en ${q(2, 'h')} a velocidad constante. Con ${mt(vr('d'), igual, vr('v'), por, vr('t'))}, ¿cuál es su velocidad?`,
      plano: 'Un avión recorre 1200 km en 2 h a velocidad constante. Con d = v · t, ¿cuál es su velocidad?',
      errores: [
        { valor: 2400, msg: 'Ese resultado sale de multiplicar d · t. Primero hay que despejar: la v está multiplicada por t, así que se dividen los dos lados entre t.' },
        { valor: 2 / 1200, msg: 'Esa es la división al revés: v = d / t = 1200 / 2.' }
      ],
      pistas: [
        `Conviene despejar ${vr('v')} antes de reemplazar números: ¿qué acompaña a la ${vr('v')}?`,
        `${mt(vr('v'), igual, fr(vr('d'), vr('t')), igual, fr(qn(1200, 'km'), qn(2, 'h')))}`
      ],
      solucion: [
        `${mt(vr('d'), igual, vr('v'), por, vr('t'))} → se dividen los dos lados entre ${vr('t')} → ${mt(vr('v'), igual, fr(vr('d'), vr('t')))}`,
        `${mt(vr('v'), igual, fr(qn(1200, 'km'), qn(2, 'h')), igual, q(600, 'km/h'))}`,
        `Respuesta: ${q(600, 'km/h')}`
      ],
      herramienta: { tipo: 'balanza', formula: 'dvt', meta: 'v' }
    },
    {
      id: 'e5', nivel: 'basico', tema: 'conversion', tipo: 'opciones', correcta: 0,
      enunciado: '¿Qué factor convierte horas en segundos en un solo paso?',
      plano: '¿Qué factor convierte horas en segundos en un solo paso?',
      opcionesPlano: ['3600 s / 1 h', '1 h / 3600 s', '60 s / 1 h', '100 s / 1 h'],
      opciones: [
        mt(fr(qn(3600, 's'), qn(1, 'h'))),
        mt(fr(qn(1, 'h'), qn(3600, 's'))),
        mt(fr(qn(60, 's'), qn(1, 'h'))),
        mt(fr(qn(100, 's'), qn(1, 'h')))
      ],
      porQue: {
        1: 'Ese factor deja las horas arriba dos veces (h²). La unidad que se quiere eliminar debe quedar en el piso contrario: abajo.',
        2: '1 h tiene 60 minutos, pero 3600 segundos (60 · 60). Ese factor no vale 1.',
        3: 'Una hora no tiene 100 segundos: 1 h = 60 min = 3600 s.'
      },
      pistas: [
        'En la cantidad original, las horas están arriba. ¿Dónde deben quedar en el factor para cancelarse?',
        '1 h = 60 min y 1 min = 60 s. ¿Cuántos segundos tiene 1 h?'
      ],
      solucion: [
        `${mt(qn(1, 'h'), igual, n(60), por, qn(60, 's'), igual, qn(3600, 's'))}`,
        `Para cancelar las h (arriba), el factor debe tener las h abajo: ${fr(qn(3600, 's'), qn(1, 'h'))}`,
        `Ejemplo: ${cad(qt(2, 'h'), fr(qn(3600, 's'), qt(1, 'h')))} ${igual} ${q(7200, 's')}`
      ]
    },
    {
      id: 'e6', nivel: 'intermedio', tema: 'conversion', tipo: 'numero', respuesta: 20, unidad: 'm/s',
      enunciado: `Un helicóptero de reconocimiento vuela a ${q(72, 'km/h')}. ¿Cuál es su velocidad en m/s?`,
      plano: 'Un helicóptero de reconocimiento vuela a 72 km/h. ¿Cuál es su velocidad en m/s?',
      errores: [
        { valor: 259.2, msg: 'Ese resultado sale de multiplicar por 3,6. De km/h a m/s el número se hace más pequeño: se divide entre 3,6.' },
        { valor: 72000, msg: 'Ahí se convirtieron los km a m, pero faltó pasar las horas a segundos.' },
        { valor: 0.02, msg: 'Ahí se pasaron las horas a segundos, pero faltó convertir los km a metros.' }
      ],
      pistas: [
        'Hacen falta dos factores: uno que cancele los km (arriba) y otro que cancele las h (abajo).',
        `Con ${fr(qn(1000, 'm'), qn(1, 'km'))} y ${fr(qn(1, 'h'), qn(3600, 's'))}. Luego, la cuenta: ${mt(n(72), por, n(1000), op('÷'), n(3600))}.`
      ],
      solucion: [
        cad(fr(qt(72, 'km'), qt(1, 'h')), fr(qn(1000, 'm'), qt(1, 'km')), fr(qt(1, 'h'), qn(3600, 's'))),
        `${mt(fr(`${n(72)} ${por} ${n(1000)}`, n(3600)), igual, fr(n(72000), n(3600)), igual, n(20))}. Atajo: ${mt(n(72), op('÷'), n(3.6), igual, n(720), op('÷'), n(36), igual, n(20))}.`,
        `Respuesta: ${q(20, 'm/s')}`
      ],
      herramienta: { tipo: 'conversion', problema: { inicio: { valor: 72, u: { km: 1, h: -1 } }, meta: { m: 1, s: -1 }, banco: ['km_m', 'h_s', 'h_min', 'min_s'] } }
    },
    {
      id: 'e7', nivel: 'intermedio', tema: 'despeje', tipo: 'numero', respuesta: 2.5, unidad: 'h',
      enunciado: `Un carro viaja a ${q(80, 'km/h')}. ¿Cuánto tiempo tarda en recorrer ${q(200, 'km')}?`,
      plano: 'Un carro viaja a 80 km/h. ¿Cuánto tiempo tarda en recorrer 200 km?',
      errores: [
        { valor: 16000, msg: 'Ese resultado sale de multiplicar d · v. La t está multiplicada por v: se dividen los dos lados entre v.' },
        { valor: 0.4, msg: 'Esa es la división al revés: t = d / v = 200 / 80, no 80 / 200.' }
      ],
      pistas: [
        `Primero, despejar ${vr('t')} de ${mt(vr('d'), igual, vr('v'), por, vr('t'))}: es el primer reto de la balanza.`,
        `${mt(vr('t'), igual, fr(vr('d'), vr('v')), igual, fr(qn(200, 'km'), qn(80, 'km/h')))}. Simplificando: ${mt(fr(n(200), n(80)), igual, fr(n(20), n(8)))}.`
      ],
      solucion: [
        mt(vr('t'), igual, fr(vr('d'), vr('v'))),
        `${mt(vr('t'), igual, fr(qt(200, 'km'), `${n(80)} ${tach(un('km'))}/${un('h')}`), igual, q(2.5, 'h'))}: los km se cancelan y quedan horas.`,
        `Respuesta: ${q(2.5, 'h')}, es decir, 2 h y 30 min.`
      ],
      herramienta: { tipo: 'balanza', formula: 'dvt', meta: 't' }
    },
    {
      id: 'e8', nivel: 'intermedio', tema: 'despeje', tipo: 'numero', respuesta: 3000, unidad: 'kg',
      enunciado: `El motor de una avioneta produce una fuerza neta de ${q(4500, 'N')} y le da una aceleración de ${q(1.5, 'm/s²')}. Con ${mt(vr('F'), igual, vr('m'), por, vr('a'))}, ¿cuál es la masa de la avioneta?`,
      plano: 'El motor de una avioneta produce una fuerza neta de 4500 N y le da una aceleración de 1,5 m/s². Con F = m · a, ¿cuál es la masa de la avioneta?',
      errores: [
        { valor: 6750, msg: 'Ese resultado sale de multiplicar F · a. La m está multiplicada por a: se dividen los dos lados entre a.' },
        { valor: 1.5 / 4500, msg: 'Esa es la división al revés: m = F / a = 4500 / 1,5.' }
      ],
      pistas: [
        `Para despejar ${vr('m')}: ¿qué la acompaña y con qué operación?`,
        `${mt(vr('m'), igual, fr(vr('F'), vr('a')), igual, fr(n(4500), n(1.5)))}. Sin calculadora: arriba y abajo por 2 → ${mt(fr(n(9000), n(3)))}.`
      ],
      solucion: [
        `${mt(vr('F'), igual, vr('m'), por, vr('a'))} → se dividen los dos lados entre ${vr('a')} → ${mt(vr('m'), igual, fr(vr('F'), vr('a')))}`,
        `${mt(vr('m'), igual, fr(n(4500), n(1.5)), igual, fr(n(9000), n(3)), igual, n(3000))}`,
        `Respuesta: ${q(3000, 'kg')}`
      ],
      herramienta: { tipo: 'balanza', formula: 'fma', meta: 'm' }
    },
    {
      id: 'e9', nivel: 'intermedio', tema: 'conversion', tipo: 'numero', respuesta: 3, unidad: 'm²',
      enunciado: `Un panel del ala mide ${q(30000, 'cm²')} de superficie. ¿Cuántos m² son?`,
      plano: 'Un panel del ala mide 30 000 cm² de superficie. ¿Cuántos m² son?',
      errores: [
        { valor: 300, msg: 'Ese resultado sale de usar 1 m² = 100 cm². El área se convierte dos veces: 1 m² = 100 cm · 100 cm = 10 000 cm².' },
        { valor: 300000000, msg: 'Ese resultado sale de multiplicar en vez de dividir. El metro cuadrado es mucho más grande que el centímetro cuadrado: el número debe achicarse.' }
      ],
      pistas: [
        'cm² significa cm · cm. ¿Cuántas veces hay que usar el factor entre cm y m?',
        `${mt(qn(1, 'm²'), igual, qn(10000, 'cm²'))}. Queda dividir ${n(30000)} entre ${n(10000)}.`
      ],
      solucion: [
        `${mt(qn(1, 'm²'), igual, op('('), qn(100, 'cm'), op(')²'), igual, qn(10000, 'cm²'))}`,
        `${cad(qt(30000, 'cm²'), fr(qn(1, 'm²'), qt(10000, 'cm²')))} ${igual} ${q(3, 'm²')}`,
        `Respuesta: ${q(3, 'm²')}`
      ],
      herramienta: { tipo: 'conversion', problema: { inicio: { valor: 30000, u: { cm: 2 } }, meta: { m: 2 }, banco: ['m_cm', 'm_mm'] } }
    },
    {
      id: 'e15', nivel: 'intermedio', tema: 'conversion', tipo: 'numero', respuesta: 170, unidad: 'min',
      enunciado: `Un vuelo dura ${mt(qn(2, 'h'), qn(50, 'min'))}. ¿Cuántos minutos son en total?`,
      plano: 'Un vuelo dura 2 h 50 min. ¿Cuántos minutos son en total?',
      errores: [
        { valor: 150, msg: 'Ese resultado sale de leer 2 h 50 min como 2,50 h. Pero 50 minutos no son media hora: los minutos van de 60 en 60. Cada parte se convierte por separado y después se suma.' },
        { valor: 250, msg: 'Ese resultado sale de tomar la hora como 100 minutos. Una hora tiene 60: 2 h son 120 min.' },
        { valor: 170 / 60, msg: 'Eso está en horas (unas 2,83 h). La pregunta pide minutos.' }
      ],
      pistas: [
        'Son dos unidades juntas: las horas y los minutos se convierten por separado y luego se suman.',
        `${mt(qn(2, 'h'), igual, n(2), por, qn(60, 'min'), igual, qn(120, 'min'))}. ¿Cuánto falta sumar?`
      ],
      solucion: [
        mt(qn(2, 'h'), igual, n(2), por, qn(60, 'min'), igual, qn(120, 'min')),
        mt(qn(120, 'min'), op('+'), qn(50, 'min'), igual, qn(170, 'min')),
        `Respuesta: ${q(170, 'min')}. Ojo: 2 h 50 min no es 2,50 h; en horas serían ${mt(n(170), op('÷'), n(60))} ≈ 2,83 h.`
      ]
    },
    {
      id: 'e16', nivel: 'intermedio', tema: 'conversion', tipo: 'numero', respuesta: 78, unidad: 's',
      enunciado: `El despegue de una avioneta, desde que arranca hasta que se eleva, tarda ${q(1.3, 'min')}. ¿Cuántos segundos son?`,
      plano: 'El despegue de una avioneta, desde que arranca hasta que se eleva, tarda 1,3 min. ¿Cuántos segundos son?',
      errores: [
        { valor: 90, msg: 'Ese resultado sale de leer 1,3 min como 1 min 30 s. Pero 0,3 min no son 30 s: son 0,3 · 60 = 18 s.' },
        { valor: 130, msg: 'Ese resultado sale de tomar el minuto como 100 segundos. Un minuto tiene 60 s.' },
        { valor: 1.3 / 60, msg: 'Ese resultado sale de dividir entre 60. Los segundos son más pequeños que los minutos: el número debe crecer.' }
      ],
      pistas: [
        'Aquí hay una sola unidad con decimal: 1,3 min se multiplica completo por 60.',
        `${cad(qt(1.3, 'min'), fr(qn(60, 's'), qt(1, 'min')))}. ¿Cuánto es ${mt(n(1.3), por, n(60))}?`
      ],
      solucion: [
        cad(qt(1.3, 'min'), fr(qn(60, 's'), qt(1, 'min'))),
        `${mt(n(1.3), por, n(60), igual, n(78))}. Truco: ${mt(n(1), por, n(60), igual, n(60))} y ${mt(n(0.3), por, n(60), igual, n(18))}; ${mt(n(60), op('+'), n(18), igual, n(78))}.`,
        `Respuesta: ${q(78, 's')}, es decir, 1 min 18 s (no 1 min 30 s).`
      ],
      herramienta: { tipo: 'conversion', problema: { inicio: { valor: 1.3, u: { min: 1 } }, meta: { s: 1 }, banco: ['min_s', 'h_min'] } }
    },
    {
      id: 'e10', nivel: 'examen', tema: 'conversion', tipo: 'numero', respuesta: 2700, unidad: 'm',
      enunciado: `Un avión vuela a ${q(9000, 'ft')} de altitud. Si el examen indica que ${mt(qn(1, 'ft'), igual, qn(0.3, 'm'))}, ¿a cuántos metros vuela?`,
      plano: 'Un avión vuela a 9000 ft de altitud. Si el examen indica que 1 ft = 0,3 m, ¿a cuántos metros vuela?',
      errores: [
        { valor: 30000, msg: 'Ese resultado sale de dividir entre 0,3. Un pie es más corto que un metro, así que en metros el número debe ser menor: se multiplica por 0,3.' },
        { valor: 2743.2, msg: 'Ese resultado sale del valor exacto (0,3048). En el examen siempre se usa la equivalencia del enunciado: 0,3.' }
      ],
      pistas: [
        'El enunciado ya regala el factor. ¿Cómo se orienta para que los ft se cancelen?',
        `Con ${fr(qn(0.3, 'm'), qn(1, 'ft'))}: ${mt(n(9000), por, n(0.3))}. Truco: ${mt(n(9000), por, n(3), igual, n(27000))} y luego se corre la coma un lugar.`
      ],
      solucion: [
        cad(qt(9000, 'ft'), fr(qn(0.3, 'm'), qt(1, 'ft'))),
        mt(n(9000), por, n(0.3), igual, n(2700)),
        `Respuesta: ${q(2700, 'm')}`
      ],
      herramienta: { tipo: 'conversion', problema: { inicio: { valor: 9000, u: { ft: 1 } }, meta: { m: 1 }, banco: ['ft_m', 'm_cm'] } }
    },
    {
      id: 'e11', nivel: 'examen', tema: 'combinado', tipo: 'numero', respuesta: 30, unidad: 'km',
      enunciado: `Un carro viaja a ${q(90, 'km/h')} durante ${q(20, 'min')}. ¿Qué distancia recorre, en kilómetros?`,
      plano: 'Un carro viaja a 90 km/h durante 20 minutos. ¿Qué distancia recorre, en kilómetros?',
      errores: [
        { valor: 1800, msg: 'Ese resultado sale de multiplicar 90 · 20 sin convertir: km/h por min no da km. Primero hay que pasar los 20 min a horas.' },
        { valor: 4.5, msg: 'Ese resultado sale de dividir 90 entre 20. La fórmula es d = v · t, con el tiempo en horas.' }
      ],
      pistas: [
        'Las unidades tienen que coincidir: la velocidad está en km/h, así que el tiempo debe estar en horas.',
        `${cad(qt(20, 'min'), fr(qn(1, 'h'), qt(60, 'min')))} ${igual} ${mt(fr(n(1), n(3)), un('h'))}. Luego ${mt(vr('d'), igual, n(90), por, fr(n(1), n(3)))}.`
      ],
      solucion: [
        `Se convierte el tiempo: ${cad(qt(20, 'min'), fr(qn(1, 'h'), qt(60, 'min')))} ${igual} ${mt(fr(n(20), n(60)), un('h'), igual, fr(n(1), n(3)), un('h'))}`,
        `${mt(vr('d'), igual, vr('v'), por, vr('t'), igual, `${n(90)} ${un('km')}/${tach(un('h'))}`, por, `${fr(n(1), n(3))} ${tach(un('h'))}`, igual, q(30, 'km'))}`,
        `Respuesta: ${q(30, 'km')}`
      ],
      herramienta: { tipo: 'conversion', problema: { titulo: 'Paso 1: el tiempo en horas', inicio: { valor: 20, u: { min: 1 } }, meta: { h: 1 }, banco: ['h_min', 'min_s'] } }
    },
    {
      id: 'e12', nivel: 'examen', tema: 'despeje', tipo: 'opciones', correcta: 0,
      enunciado: `¿Cuál es el despeje correcto de la aceleración ${vr('a')} en ${mt(vr('v', 'f'), igual, vr('v', '0'), op('+'), vr('a'), por, vr('t'))}?`,
      plano: '¿Cuál es el despeje correcto de la aceleración a en vf = v0 + a · t?',
      opcionesPlano: ['a = (vf − v0) / t', 'a = vf / t − v0', 'a = (vf + v0) / t', 'a = (vf − v0) · t'],
      opciones: [
        mt(vr('a'), igual, fr(`${vr('v', 'f')} ${op('−')} ${vr('v', '0')}`, vr('t'))),
        mt(vr('a'), igual, fr(vr('v', 'f'), vr('t')), op('−'), vr('v', '0')),
        mt(vr('a'), igual, fr(`${vr('v', 'f')} ${op('+')} ${vr('v', '0')}`, vr('t'))),
        mt(vr('a'), igual, op('('), vr('v', 'f'), op('−'), vr('v', '0'), op(')'), por, vr('t'))
      ],
      porQue: {
        1: 'Ahí se dividió entre t solo una parte. Primero se resta v₀ en los dos lados y después se divide <b>todo</b> el lado entre t.',
        2: 'El v₀ está sumando: para quitarlo se resta, no se suma.',
        3: 'La a está multiplicada por t; para quitar la t hay que dividir, no multiplicar.'
      },
      pistas: [
        'Regla de oro: primero se quita lo que suma o resta; después, lo que multiplica o divide.',
        `Restando ${vr('v', '0')} en los dos lados: ${mt(vr('v', 'f'), op('−'), vr('v', '0'), igual, vr('a'), por, vr('t'))}. ¿Y ahora qué se hace con la ${vr('t')}?`
      ],
      solucion: [
        `Se resta ${vr('v', '0')} en los dos lados: ${mt(vr('v', 'f'), op('−'), vr('v', '0'), igual, vr('a'), por, vr('t'))}`,
        `Se dividen los dos lados entre ${vr('t')}: ${mt(fr(`${vr('v', 'f')} ${op('−')} ${vr('v', '0')}`, vr('t')), igual, vr('a'))}`,
        `Respuesta: ${mt(vr('a'), igual, fr(`${vr('v', 'f')} ${op('−')} ${vr('v', '0')}`, vr('t')))}`
      ],
      herramienta: { tipo: 'balanza', formula: 'vfat', meta: 'a' }
    },
    {
      id: 'e13', nivel: 'examen', tema: 'despeje', tipo: 'numero', respuesta: 20, unidad: 's',
      enunciado: `Un avión parte del reposo y alcanza ${q(60, 'm/s')} con una aceleración constante de ${q(3, 'm/s²')}. Con ${mt(vr('v', 'f'), igual, vr('v', '0'), op('+'), vr('a'), por, vr('t'))}, ¿cuánto tarda?`,
      plano: 'Un avión parte del reposo y alcanza 60 m/s con una aceleración constante de 3 m/s². Con vf = v0 + a · t, ¿cuánto tarda?',
      errores: [
        { valor: 180, msg: 'Ese resultado sale de multiplicar vf · a. La t está multiplicada por a: hay que dividir entre a.' },
        { valor: 0.05, msg: 'Esa es la división al revés: t = (vf − v0) / a = 60 / 3.' },
        { valor: 57, msg: 'Ese resultado sale de restar la aceleración. La a no suma: multiplica a la t, así que hay que dividir entre a.' }
      ],
      pistas: [
        `«Parte del reposo» significa que la velocidad inicial es cero: ${mt(vr('v', '0'), igual, n(0))}.`,
        `Despejando ${vr('t')}: ${mt(vr('t'), igual, fr(`${vr('v', 'f')} ${op('−')} ${vr('v', '0')}`, vr('a')))}. Y se reemplaza con ${mt(vr('v', '0'), igual, n(0))}.`
      ],
      solucion: [
        `${mt(vr('v', '0'), igual, n(0))} porque parte del reposo.`,
        `${mt(vr('t'), igual, fr(`${vr('v', 'f')} ${op('−')} ${vr('v', '0')}`, vr('a')), igual, fr(`${n(60)} ${op('−')} ${n(0)}`, n(3)))}`,
        `Respuesta: ${q(20, 's')}`
      ],
      herramienta: { tipo: 'balanza', formula: 'vfat', meta: 't' }
    },
    {
      id: 'e14', nivel: 'examen', tema: 'despeje', tipo: 'numero', respuesta: 5, unidad: 'm/s²',
      enunciado: `Al despejar ${vr('a')} de ${mt(vr('v', 'f'), igual, vr('v', '0'), op('+'), vr('a'), por, vr('t'))}, ¿cuánto vale si ${mt(vr('v', 'f'), igual, qn(50, 'm/s'))}, ${mt(vr('v', '0'), igual, qn(10, 'm/s'))} y ${mt(vr('t'), igual, qn(8, 's'))}?`,
      plano: 'Al despejar a de vf = v0 + a · t, ¿cuánto vale si vf = 50 m/s, v0 = 10 m/s y t = 8 s?',
      errores: [
        { valor: 7.5, msg: 'Ese resultado sale de (50 + 10) / 8. El v₀ está sumando, así que para quitarlo se resta.' },
        { valor: 48.75, msg: 'Ahí se dividió solo el v₀ entre t. Primero se resta v₀ en los dos lados y después se divide toda la resta entre t.' },
        { valor: 6.25, msg: 'Ese resultado sale de 50 / 8: faltó restar v₀ antes de dividir.' },
        { valor: 320, msg: 'Ese resultado sale de multiplicar por t. La t está multiplicando a la a; para quitarla se divide.' }
      ],
      pistas: [
        `Regla de oro: primero se quita lo que suma (${vr('v', '0')}); después, lo que multiplica (${vr('t')}).`,
        `${mt(vr('a'), igual, fr(`${vr('v', 'f')} ${op('−')} ${vr('v', '0')}`, vr('t')), igual, fr(`${n(50)} ${op('−')} ${n(10)}`, n(8)))}`
      ],
      solucion: [
        `Se resta ${vr('v', '0')} en los dos lados: ${mt(vr('v', 'f'), op('−'), vr('v', '0'), igual, vr('a'), por, vr('t'))}`,
        `Se dividen los dos lados entre ${vr('t')}: ${mt(vr('a'), igual, fr(`${vr('v', 'f')} ${op('−')} ${vr('v', '0')}`, vr('t')))}`,
        `${mt(vr('a'), igual, fr(`${n(50)} ${op('−')} ${n(10)}`, n(8)), igual, fr(n(40), n(8)), igual, q(5, 'm/s²'))}`
      ],
      herramienta: { tipo: 'balanza', formula: 'vfat', meta: 'a' }
    },
    {
      id: 'e17', nivel: 'reto', tema: 'despeje', tipo: 'numero', respuesta: 3, unidad: 's',
      enunciado: `Desde un helicóptero quieto se suelta una caja a ${q(45, 'm')} de altura. Con ${mt(vr('h'), igual, fr(n(1), n(2)), por, vr('g'), por, cuad(vr('t')))} y ${mt(vr('g'), igual, qn(10, 'm/s²'))}, ¿cuánto tarda en llegar al suelo? (Sin contar el aire.)`,
      plano: 'Desde un helicóptero quieto se suelta una caja a 45 m de altura. Con h = ½ · g · t² y g = 10 m/s², ¿cuánto tarda en llegar al suelo? (Sin contar el aire.)',
      errores: [
        { valor: 9, msg: 'Ese 9 es t². Falta el último paso: la raíz cuadrada deshace el cuadrado.' },
        { valor: 4.5, msg: 'Ese resultado sale de dividir 45 entre 10. Falta multiplicar por 2 (por el ½) y sacar la raíz.' },
        { valor: Math.sqrt(4.5), msg: 'Ese resultado sale de √4,5: faltó multiplicar por 2 antes de sacar la raíz.' }
      ],
      pistas: [
        `Primero hay que dejar sola la ${cuad(vr('t'))}: el ½ se quita multiplicando por 2 y la ${vr('g')}, dividiendo entre ${vr('g')}.`,
        `${mt(cuad(vr('t')), igual, fr(`${n(2)} ${por} ${vr('h')}`, vr('g')), igual, fr(`${n(2)} ${por} ${n(45)}`, n(10)), igual, n(9))}. ¿Qué operación deshace un cuadrado?`
      ],
      solucion: [
        `Se multiplican los dos lados por 2 y se dividen entre ${vr('g')}: ${mt(fr(`${n(2)} ${por} ${vr('h')}`, vr('g')), igual, cuad(vr('t')))}`,
        `La raíz cuadrada deshace el cuadrado: ${mt(vr('t'), igual, raiz(fr(`${n(2)} ${por} ${vr('h')}`, vr('g'))))}`,
        `${mt(vr('t'), igual, raiz(fr(`${n(2)} ${por} ${n(45)}`, n(10))), igual, raiz(n(9)), igual, q(3, 's'))}`
      ]
    },
    {
      id: 'e18', nivel: 'reto', tema: 'despeje', tipo: 'numero', respuesta: 10, unidad: 'm/s',
      enunciado: `Un paquete de ${q(8, 'kg')} se mueve con una energía cinética de ${q(400, 'J')}. Con ${mt(vr('E', 'c'), igual, fr(n(1), n(2)), por, vr('m'), por, cuad(vr('v')))}, ¿cuál es su velocidad?`,
      plano: 'Un paquete de 8 kg se mueve con una energía cinética de 400 J. Con Ec = ½ · m · v², ¿cuál es su velocidad?',
      errores: [
        { valor: 100, msg: 'Ese 100 es v². Falta sacar la raíz cuadrada.' },
        { valor: 50, msg: 'Ese resultado sale de dividir 400 entre 8. Falta multiplicar por 2 (por el ½) y sacar la raíz.' },
        { valor: Math.sqrt(50), msg: 'Ese resultado sale de √50: faltó multiplicar por 2 antes de sacar la raíz.' }
      ],
      pistas: [
        'De afuera hacia adentro: primero el ½, después la m y al final el cuadrado.',
        `${mt(cuad(vr('v')), igual, fr(`${n(2)} ${por} ${vr('E', 'c')}`, vr('m')), igual, fr(`${n(2)} ${por} ${n(400)}`, n(8)), igual, n(100))}`
      ],
      solucion: [
        `Se multiplican los dos lados por 2 y se dividen entre ${vr('m')}: ${mt(cuad(vr('v')), igual, fr(`${n(2)} ${por} ${vr('E', 'c')}`, vr('m')))}`,
        `Raíz cuadrada en los dos lados: ${mt(vr('v'), igual, raiz(fr(`${n(2)} ${por} ${vr('E', 'c')}`, vr('m'))))}`,
        `${mt(vr('v'), igual, raiz(fr(`${n(2)} ${por} ${n(400)}`, n(8))), igual, raiz(n(100)), igual, q(10, 'm/s'))}`
      ]
    }
  ];

  const NIVELES = { basico: 'Básico', intermedio: 'Intermedio', examen: 'Tipo examen', reto: 'Reto' };
  const TEMAS = { conversion: 'Conversión', despeje: 'Despeje', combinado: 'Despeje y conversión' };

  /* ---------- Plan de la clase (lo ve el estudiante en la cabecera del módulo) ---------- */
  const PLAN_CLASE = [
    ['7 min', 'Ideas clave, parte 1: el igual como balanza y las operaciones contrarias.'],
    ['20 min', 'Balanza: retos 1 a 6, diciendo en voz alta qué operación se aplica y por qué.'],
    ['7 min', 'Ideas clave, parte 2: prefijos, horas y minutos, y el 1 disfrazado.'],
    ['20 min', 'Mesa de conversión: retos 1 a 7.'],
    ['18 min', 'Práctica: ejercicios 1 a 8 con papel y lápiz, sin calculadora.'],
    ['8 min', 'Cierre: tres preguntas rápidas. De tarea quedan los ejercicios 9 a 18.']
  ];

  MA.M1 = { FORMULAS, RETOS_BALANZA, RETOS_CONVERSION, EJERCICIOS, NIVELES, TEMAS, PLAN_CLASE, bloque };
})();
