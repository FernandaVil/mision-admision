/* =====================================================================
   Módulo 3 · contenido (factorización)
   ---------------------------------------------------------------------
   - Notación: términos, polinomios, el rectángulo de áreas, la figura de
     la diferencia de cuadrados y la llave maestra con sus huecos.
   - RETOS_AREAS, RETOS_CUADRADOS, RETOS_LLAVE: las tres herramientas.
   - EJERCICIOS: práctica integrada (ids: m3.prac.*).
   Un término es [coeficiente, exponente]: 3x² = [3, 2] · −5 = [−5, 0] ·
   x = [1, 1]. La letra es la x, salvo que el reto diga otra.
   Los ids de retos y ejercicios no se cambian: el avance se guarda
   con ellos en el navegador.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { vr, n, op, fr, mt, pega, raiz, tach } = MA.f;
  const { pot, neg } = MA.M2;
  const por = op('·'), igual = op('='), mas = op('+'), menos = op('−'), entre = op('÷');

  /* ---------- Términos y polinomios ---------- */
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const supTexto = e => String(e).split('').map(d => SUP[d]).join('');
  // Los paréntesis pegados a lo que encierran: (x + 2)
  const grupo = html => `<span class="m3-grupo">${html}</span>`;
  const par = html => `<span class="m3-par"><span class="op">(</span>${grupo(html)}<span class="op">)</span></span>`;

  // '3x2 - 5x + 6' -> [[3, 2], [-5, 1], [6, 0]] (para escribir el contenido más corto)
  function leer(txt, letra = 'x') {
    const forma = new RegExp(`^([+-]?)(\\d*)(${letra}(\\d*))?$`);
    return txt.replace(/\s+/g, '').replace(/−/g, '-').match(/[+-]?[^+-]+/g).map(s => {
      const m = s.match(forma);
      return [(m[1] === '-' ? -1 : 1) * (m[2] === '' ? 1 : Number(m[2])), m[3] ? Number(m[4] || 1) : 0];
    });
  }

  // Un término sin signo: 3x², x, 5
  function cuerpoHtml([c, e], letra = 'x') {
    const k = Math.abs(c);
    const letras = e === 0 ? '' : e === 1 ? vr(letra) : pot(vr(letra), e);
    if (!letras) return n(k);
    return k === 1 ? letras : pega(n(k), letras);
  }
  // Con el signo pegado, para fichas, celdas y lados: −3x²
  const terminoHtml = (t, letra) => (t[0] < 0 ? pega(menos, cuerpoHtml(t, letra)) : cuerpoHtml(t, letra));
  // 3x² − 2x + 4 (lo que tiene coeficiente 0 no se escribe)
  function polinomioHtml(ts, letra) {
    const vivos = ts.filter(t => t[0] !== 0);
    if (!vivos.length) return n(0);
    return vivos.map((t, i) => (i === 0 ? terminoHtml(t, letra) : `${t[0] < 0 ? menos : mas} ${cuerpoHtml(t, letra)}`)).join(' ');
  }
  // Un factor va entre paréntesis si tiene más de un término
  const factorHtml = (ts, letra) => (ts.filter(t => t[0] !== 0).length > 1 ? par(polinomioHtml(ts, letra)) : polinomioHtml(ts, letra));
  // Factores pegados: 3x(2x + 3) · (x + 2)(x + 3)
  const productoHtml = (fs, letra) => pega(...fs.map(f => factorHtml(f, letra)));

  // Lo mismo en texto plano (mensajes y plantillas de la IA)
  function cuerpoTexto([c, e], letra = 'x') {
    const k = Math.abs(c);
    const l = e === 0 ? '' : letra + (e > 1 ? supTexto(e) : '');
    return l ? (k === 1 ? l : MA.fmt(k) + l) : MA.fmt(k);
  }
  const terminoTexto = (t, letra) => (t[0] < 0 ? '−' : '') + cuerpoTexto(t, letra);
  function polinomioTexto(ts, letra) {
    const vivos = ts.filter(t => t[0] !== 0);
    if (!vivos.length) return '0';
    return vivos.map((t, i) => (i === 0 ? terminoTexto(t, letra) : `${t[0] < 0 ? '−' : '+'} ${cuerpoTexto(t, letra)}`)).join(' ');
  }
  const factorTexto = (ts, letra) => (ts.filter(t => t[0] !== 0).length > 1 ? `(${polinomioTexto(ts, letra)})` : polinomioTexto(ts, letra));
  const productoTexto = (fs, letra) => fs.map(f => factorTexto(f, letra)).join('');

  /* ---------- Cuentas con términos ---------- */
  // Números con números y letras con letras: 2x · 3x = 6x²
  const multiplicarTerminos = (a, b) => [a[0] * b[0], a[1] + b[1]];
  // Todos contra todos: la lista de pedazos del rectángulo, fila por fila
  const pedazos = (alto, ancho) => alto.flatMap(a => ancho.map(b => multiplicarTerminos(a, b)));
  // Junta lo del mismo tipo y ordena: primero las x², después las x y al final los números
  function juntar(ts) {
    const suma = {};
    ts.forEach(([c, e]) => { suma[e] = (suma[e] || 0) + c; });
    return Object.keys(suma).map(Number).sort((a, b) => b - a).map(e => [suma[e], e]).filter(t => t[0] !== 0);
  }
  const multiplicar = (...fs) => juntar(fs.reduce((acc, f) => pedazos(acc, f), [[1, 0]]));

  /* ---------- Rectángulo de áreas ----------
     alto y ancho son los factores (listas de términos). Cada lado mide
     según su tipo: con x es largo y un número es corto, así que x · x es
     un cuadrado grande, x · 3 una tira y 2 · 3 un cuadradito. El color
     sigue al tipo del pedazo (t2: x², t1: x, t0: número).
     Opciones para la herramienta: area(i, j) (el pedazo, si no es el
     producto de los lados), celda(i, j), claseCelda(i, j),
     lado(tipo, k), claseLado(tipo, k) con tipo 'fila' o 'columna',
     uniforme (todos los lados iguales) y etiqueta (para un dibujo fijo). */
  function rectanguloHtml(alto, ancho, o = {}) {
    const letra = o.letra || 'x';
    const medida = t => (o.uniforme ? 'var(--ar-u)' : t[1] > 0 ? 'var(--ar-l)' : 'var(--ar-c)');
    const lado = (t, tipo, k) => `<span class="ar-lado ar-${tipo} ${o.claseLado ? o.claseLado(tipo, k) : ''}">${o.lado ? o.lado(tipo, k) : terminoHtml(t, letra)}</span>`;
    const filas = alto.map((a, i) => lado(a, 'fila', i) + ancho.map((b, j) => {
      const p = o.area ? o.area(i, j) : multiplicarTerminos(a, b);
      return `<span class="ar-celda t${Math.min(p[1], 3)} ${p[0] < 0 ? 'neg' : ''} ${o.claseCelda ? o.claseCelda(i, j) : ''}">${o.celda ? o.celda(i, j) : terminoHtml(p, letra)}</span>`;
    }).join('')).join('');
    return `
      <div class="ar-rect" ${o.etiqueta ? `role="img" aria-label="${MA.esc(o.etiqueta)}"` : ''} style="grid-template-columns: var(--ar-cab) ${ancho.map(medida).join(' ')}; grid-template-rows: var(--ar-cab) ${alto.map(medida).join(' ')}">
        <span class="ar-esquina" aria-hidden="true"></span>
        ${ancho.map((b, j) => lado(b, 'columna', j)).join('')}
        ${filas}
      </div>`;
  }
  // Una pieza suelta (cuadrado, tira o cuadradito), para las diapositivas
  const piezaHtml = (t, letra) => `<span class="ar-pieza t${Math.min(t[1], 3)} ${t[0] < 0 ? 'neg' : ''}">${terminoHtml(t, letra)}</span>`;

  /* ---------- Diferencia de cuadrados: cortar y mover ----------
     Un cuadrado de lado x al que se le quita uno de lado 3; lo que queda
     se corta en dos rectángulos y uno se gira y se pega al lado: queda un
     rectángulo de (x + 3) por (x − 3). Todos los pasos están en el mismo
     dibujo: la clase paso-0 … paso-3 del svg decide qué se ve (cada pieza
     lleva v0 … v3, los pasos en los que aparece). Para una diapositiva:
     o.vista (un viewBox más bajo), o.sinEcuacion y o.tapar (el paso de
     la diapositiva en que se revela el área que queda, x² − 9). */
  function figuraCuadradosSvg(paso = 0, o = {}) {
    const X = '<tspan class="dc-vr">x</tspan>';
    const t = (x, y, html, clase, ancla = 'middle', extra = '') => `<text x="${x}" y="${y}" text-anchor="${ancla}" class="dc-etq ${clase}"${extra}>${html}</text>`;
    const [tapaClase, tapaPaso] = o.tapar ? [' d-oculta-svg', ` data-paso="${o.tapar}"`] : ['', ''];
    return `
      <svg class="dc-svg paso-${paso} ${o.sinEcuacion ? 'dc-sin-ecuacion' : ''}" viewBox="${o.vista || '0 0 300 230'}" role="img" aria-label="Un cuadrado de lado x menos un cuadradito de lado 3 se reacomoda en un rectángulo de x + 3 por x − 3">
        <rect class="dc-pieza dc-p1" x="52" y="34" width="150" height="96"/>
        <rect class="dc-pieza dc-p2" x="52" y="130" width="96" height="54"/>
        <rect class="dc-hueco" x="148" y="130" width="54" height="54"/>
        <rect class="dc-borde v0" x="52" y="34" width="150" height="150"/>
        <path class="dc-borde v1 v2" d="M52 34H202V130H148V184H52Z"/>
        <path class="dc-corte v2" d="M52 130H148"/>
        <rect class="dc-borde dc-final-borde v3" x="52" y="34" width="204" height="96"/>
        ${t(127, 24, X, 'v0 v1 v2')}
        ${t(44, 114, X, 'v0 v1', 'end')}
        ${t(127, 116, `${X}²`, 'dc-area v0')}
        ${t(175, 163, '9', 'dc-quita v1')}
        ${t(175, 202, '3', 'v1')}
        ${t(210, 162, '3', 'v1', 'start')}
        ${t(127, 88, `${X}² − 9`, 'dc-area v1' + tapaClase, 'middle', tapaPaso)}
        ${t(44, 87, `${X} − 3`, 'v2 v3', 'end')}
        ${t(100, 202, `${X} − 3`, 'v2')}
        ${t(44, 162, '3', 'v2', 'end')}
        ${t(154, 24, `${X} + 3`, 'v3')}
        ${t(154, 178, `${X}² − 9 = (${X} + 3)(${X} − 3)`, 'dc-ecuacion v3')}
      </svg>`;
  }

  /* ---------- La llave maestra ----------
     La fórmula con sus tres huecos de colores: a (azul, el de x²),
     b (ámbar, el de x) y c (violeta, el número solo). v: { a, b, c }
     con los valores; si falta alguno, se ve la letra. Siempre se
     reemplaza con paréntesis. marcar: la letra cuyo hueco titila (la
     que se está escribiendo). */
  function llaveHtml(v = {}, marcar = null) {
    const hueco = k => `<span class="ll-hueco ll-${k}${marcar === k ? ' ll-actual' : ''}">${v[k] == null ? vr(k) : par(n(v[k]))}</span>`;
    const adentro = `${pot(hueco('b'), 2)} ${menos} ${n(4)} ${por} ${hueco('a')} ${por} ${hueco('c')}`;
    return `${vr('x')} ${igual} ${fr(`${pega(menos, hueco('b'))} ${op('±')} ${raiz(adentro)}`, `${n(2)} ${por} ${hueco('a')}`)}`;
  }
  // ax² + bx + c con cada término de su color (el signo es parte del número)
  function trinomioHtml({ a, b, c }, letra = 'x', colores = false) {
    return [[a, 2, 'a'], [b, 1, 'b'], [c, 0, 'c']].filter(t => t[0] !== 0).map(([k, e, nombre], i) => {
      const cuerpo = cuerpoHtml([k, e], letra);
      const html = i === 0 ? (k < 0 ? pega(menos, cuerpo) : cuerpo) : `${k < 0 ? menos : mas} ${cuerpo}`;
      return colores ? `<span class="ll-coef ll-${nombre}">${html}</span>` : html;
    }).join(' ');
  }
  const trinomioTexto = ({ a, b, c }, letra) => polinomioTexto([[a, 2], [b, 1], [c, 0]], letra);
  // Ficha de cuadrados exactos (para sacar raíces sin calculadora)
  const fichaCuadradosHtml = (hasta = 15) => `<ul class="ll-cuadrados">${Array.from({ length: hasta }, (_, i) => `<li>${mt(pot(n(i + 1), 2), igual, n((i + 1) * (i + 1)))}</li>`).join('')}</ul>`;

  /* ---------- Atajos para escribir el contenido ---------- */
  const P = (txt, l) => polinomioHtml(leer(txt, l), l);
  const PT = (txt, l) => polinomioTexto(leer(txt, l), l);
  const F = (txt, l) => factorHtml(leer(txt, l), l);
  const Pr = (...fs) => productoHtml(fs.map(f => leer(f)));
  const PrT = (...fs) => productoTexto(fs.map(f => leer(f)));
  const medio = pega(n(2), par(`${vr('x')} ${menos} ${fr(n(1), n(2))}`));   // 2(x − ½)

  /* ---------- Mesa de áreas ----------
     modo juntar (terminos; grupos: cuántos términos tiene cada paréntesis
     del enunciado), armar (alto y ancho: los dos lados) o desarmar
     (terminos: los pedazos). opciones/correcta/porQue: predicción
     opcional; porQue explica cada opción equivocada. nota: se agrega
     al mensaje final. */
  const RETOS_AREAS = [
    // ----- Juntar -----
    { id: 'j1', modo: 'juntar', titulo: 'Tiras con tiras', contexto: 'Sobre la mesa hay tiras (x) y cuadraditos (números sueltos). Solo se juntan los de la misma forma.',
      terminos: leer('2x + 3 + 4x + 1') },
    { id: 'j2', modo: 'juntar', titulo: 'Sumar dos polinomios', contexto: `${mt(par(P('x2 + 3x - 2')), mas, par(P('2x2 - 5x + 6')))}. Con un + delante, los paréntesis se quitan sin cambiar nada. Los negativos, con plata.`,
      terminos: leer('x2 + 3x - 2 + 2x2 - 5x + 6'), grupos: [3, 3],
      opciones: ['3x² − 2x + 4', '3x² + 8x + 4', '3x⁴ − 2x + 4'], correcta: 0,
      porQue: { 1: '3x − 5x no da 8x: tengo 3 y debo 5, así que quedo debiendo 2. Queda −2x.', 2: 'al sumar, la letra no cambia: x² + 2x² = 3x². Los exponentes se suman al multiplicar, no al sumar.' } },
    // ----- Armar: la distributiva -----
    { id: 'a1', modo: 'armar', titulo: 'Un número por un paréntesis', contexto: `Una lámina de 3 de alto y x + 2 de largo. Su área es ${mt(Pr('3', 'x + 2'))}.`,
      alto: leer('3'), ancho: leer('x + 2'),
      opciones: ['3x + 2', '3x + 6', 'x + 6'], correcta: 1,
      porQue: { 0: 'el 3 multiplica a todos los de adentro, también al 2: 3 · 2 = 6.', 2: 'el 3 también multiplica a la x: 3 · x = 3x.' } },
    { id: 'a2', modo: 'armar', titulo: 'Dos paréntesis: todos contra todos', contexto: `Una lámina de x + 2 por x + 3. Cada término de un lado se multiplica por cada término del otro.`,
      alto: leer('x + 2'), ancho: leer('x + 3'),
      opciones: ['x² + 6', 'x² + 5x + 6', 'x² + 6x + 5'], correcta: 1,
      porQue: { 0: 'faltan los dos pedazos del medio: el rectángulo tiene 4 pedazos, no 2.', 2: 'los del medio son 3x y 2x, que suman 5x; el 6 sale de 2 · 3.' } },
    { id: 'a3', modo: 'armar', titulo: 'Más por menos', contexto: `El mismo número, una vez sumando y otra restando: ${mt(Pr('x + 3', 'x - 3'))}. ¿Qué pasa con los del medio?`,
      alto: leer('x + 3'), ancho: leer('x - 3'),
      opciones: ['x² − 9', 'x² − 6x − 9', 'x² + 9'], correcta: 0,
      porQue: { 1: '−3x y +3x se anulan, como deber 3 y pagar 3.', 2: '3 · (−3) = −9: signos distintos dan −.' },
      nota: 'Los del medio se anularon: así nace la diferencia de cuadrados, la sección 3.' },
    // ----- Desarmar: el factor común -----
    { id: 'd1', modo: 'desarmar', titulo: 'Solo números', contexto: 'Ahora al revés: se conocen los pedazos, 6x y 9, y se busca el lado que comparten.',
      terminos: leer('6x + 9') },
    { id: 'd2', modo: 'desarmar', titulo: 'De a poco', contexto: 'No hace falta ver de una vez el número más grande: se saca de a poco y lo de afuera se va multiplicando.',
      terminos: leer('12x + 18') },
    { id: 'd3', modo: 'desarmar', titulo: 'Cuando se saca todo', contexto: '¿Qué queda de un pedazo si se le saca todo?',
      terminos: leer('4x + 4'),
      opciones: ['4(x)', '4(x + 1)', '4(x + 0)'], correcta: 1,
      porQue: { 0: 'se perdió un pedazo: 4(x) es solo 4x. Del 4 suelto queda un 1, porque 4 ÷ 4 = 1.', 2: '4(x + 0) es solo 4x. Del 4 suelto queda un 1, porque 4 ÷ 4 = 1.' } },
    { id: 'd4', modo: 'desarmar', titulo: 'Números y letras', contexto: 'También puede haber x en común: x² es x · x. ¿Cuántas x están en los dos pedazos?',
      terminos: leer('6x2 + 9x'),
      opciones: ['3(2x² + 3x)', '3x(2x + 3)', 'x(6x + 9)'], correcta: 1,
      porQue: { 0: 'está bien, pero incompleto: todavía queda una x en los dos.', 2: 'está bien, pero incompleto: 6 y 9 todavía están en la tabla del 3.' } },
    { id: 'd5', modo: 'desarmar', titulo: 'Una fórmula de física', letra: 't',
      contexto: `La altura de una piedra lanzada hacia arriba es ${mt(vr('h'), igual, P('20t - 5t2', 't'))} (h en metros y t en segundos). En física también se saca factor común. Con un término negativo no hay rectángulo que dibujar: se busca lo que divide a los dos.`,
      terminos: leer('20t - 5t2', 't'),
      nota: 'En el módulo 4 sirve así: la piedra está en el suelo cuando 5t = 0 o cuando 4 − t = 0.' }
  ];

  /* ---------- Mesa de cuadrados ----------
     a: el primer término (positivo); b: el número (sin signo); signo:
     '−' (diferencia) o '+' (suma: no se puede). */
  const RETOS_CUADRADOS = [
    { id: 'c1', titulo: 'El de la figura', contexto: 'El cuadrado de lado x menos el cuadradito de lado 3.', a: [1, 2], b: [9, 0], signo: '−' },
    { id: 'c2', titulo: 'Un número más grande', contexto: '¿Qué número multiplicado por sí mismo da 49?', a: [1, 2], b: [49, 0], signo: '−' },
    { id: 'c3', titulo: '¿Y con suma?', contexto: 'Mirar bien el signo del medio.', a: [1, 2], b: [9, 0], signo: '+' },
    { id: 'c4', titulo: 'Con un número delante de la x', contexto: '4x² también es un cuadrado: ¿de qué?', a: [4, 2], b: [25, 0], signo: '−' },
    { id: 'c5', titulo: 'El 1 también es un cuadrado', contexto: '1 = 1 · 1.', a: [9, 2], b: [1, 0], signo: '−' }
  ];

  /* ---------- La llave maestra ----------
     El trinomio ax² + bx + c. Las raíces salen de la fórmula y cada
     raíz r da un paréntesis (x − r). */
  const RETOS_LLAVE = [
    { id: 'l1', titulo: 'Los lados de la lámina', contexto: 'Una lámina rectangular tiene un área de x² + 5x + 6. ¿Cuánto miden sus lados? Es el rectángulo del reto 4 de la mesa de áreas, al revés.', a: 1, b: 5, c: 6 },
    { id: 'l2', titulo: 'Con b negativa', contexto: 'Ojo con dos signos: −(−5) y (−5)².', a: 1, b: -5, c: 6 },
    { id: 'l3', titulo: 'Con c negativa', contexto: 'Ojo con 4 · a · c. Y la x sola lleva un 1 invisible: b = 1.', a: 1, b: 1, c: -6 },
    { id: 'l4', titulo: 'Cuando adentro da cero', contexto: '¿Qué pasa si lo de adentro de la raíz da 0?', a: 1, b: -6, c: 9,
      nota: 'Es lo que en algunos libros se llama «trinomio cuadrado perfecto»: no hace falta aprenderse el nombre, la llave lo encuentra sola.' },
    { id: 'l5', titulo: 'Con a distinto de 1', contexto: 'La a no se olvida: va adelante.', a: 2, b: 3, c: -2 },
    { id: 'l6', titulo: 'Una que no abre', contexto: '¿Y si lo de adentro de la raíz da negativo?', a: 1, b: 2, c: 5 }
  ];

  /* ---------- Práctica integrada ----------
     Sigue el orden del módulo: juntar, armar y las tres llaves; al final,
     tipo examen y retos. antes: una pregunta previa que no bloquea (qué
     llave logra abrir el candado o cuántas flechas salen). En general no
     se pregunta qué llave va primero: el chequeo siempre empieza por el
     factor común, así que esa pregunta tenía trampa. La excepción es el
     candado de dos llaves (ejercicio 10): ahí sí se pregunta por la
     primera, con las cuatro opciones de siempre, porque una opción que
     nombrara las dos llaves se adivinaría. La llave maestra abre casi
     todo: cuando hay un camino más corto, elegirla no es un error
     (tambien). El tema de cada ejercicio no dice la llave, para no
     adelantar la respuesta. */
  const LLAVES = ['Factor común', 'Diferencia de cuadrados', 'Llave maestra', 'No se factoriza'];
  const ABRE = ['Este candado lo abre el factor común.', 'Este candado lo abre la diferencia de cuadrados.', 'Este candado lo abre la llave maestra.', 'Este candado no se abre: no se factoriza.'];
  const queLlave = (correcta, bien, porQue, o = {}) => ({
    pregunta: o.pregunta || '¿Qué llave logra abrir este candado?',
    opciones: o.opciones || LLAVES, correcta, bien, porQue,
    respuesta: o.respuesta || ABRE[correcta],
    tambien: o.tambien, tituloTambien: 'También lo abre, pero por el camino largo.'
  });
  const LARGO = { tambien: [2] };   // la llave maestra también abre, con b = 0 o c = 0
  const PISTA_LLAVE = '¿Qué llave abre el candado? Probar en orden: ¿hay algo en todos los términos? ¿Son dos cuadrados con una resta? Si no, la llave maestra.';

  const EJERCICIOS = [
    // ----- Básico -----
    {
      id: 'e1', nivel: 'basico', tema: 'juntar', tipo: 'opciones', correcta: 0,
      enunciado: `Juntar los términos del mismo tipo: ${mt(P('3x + 5 + 2x - 1'))}.`,
      plano: 'Juntar los términos del mismo tipo: 3x + 5 + 2x − 1.',
      opciones: [mt(P('5x + 4')), mt(P('5x + 6')), mt(P('9x')), mt(P('5x2 + 4'))],
      opcionesPlano: ['5x + 4', '5x + 6', '9x', '5x² + 4'],
      porQue: {
        1: 'El 1 resta: 5 − 1 = 4.',
        2: 'Las x y los números sueltos no son del mismo tipo: se juntan las x por un lado y los números por el otro.',
        3: 'Al sumar, la letra no cambia: 3x + 2x = 5x. La x² sale al multiplicar x · x.'
      },
      pistas: ['Tiras con tiras y cuadraditos con cuadraditos: primero las x y después los números.', `${mt(P('3x + 2x'), igual, P('5x'))}. Falta ${mt(P('5 - 1'))}.`],
      solucion: [`Las x: ${mt(P('3x + 2x'), igual, P('5x'))}.`, `Los números: ${mt(P('5 - 1'), igual, n(4))}.`, `Queda ${mt(P('5x + 4'))}.`],
      herramienta: { boton: 'Probarlo en la mesa de áreas', icono: 'cuadricula', mesa: 'areas', problema: { modo: 'juntar', terminos: leer('3x + 5 + 2x - 1') } }
    },
    {
      id: 'e2', nivel: 'basico', tema: 'distributiva', tipo: 'opciones', correcta: 0,
      enunciado: `Multiplicar: ${mt(Pr('3', '2x - 4'))}.`,
      plano: 'Multiplicar: 3(2x − 4).',
      opciones: [mt(P('6x - 12')), mt(P('6x - 4')), mt(P('6x + 12')), mt(P('5x - 1'))],
      opcionesPlano: ['6x − 12', '6x − 4', '6x + 12', '5x − 1'],
      porQue: {
        1: 'El 3 multiplica a todos los de adentro, también al 4: 3 · 4 = 12.',
        2: '3 · (−4) = −12: signos distintos dan −.',
        3: 'Ese resultado sale de sumar el 3. Al multiplicar: 3 · 2x = 6x y 3 · (−4) = −12.'
      },
      pistas: ['Un rectángulo de 3 de alto: dos pedazos, 3 · 2x y 3 · (−4).', `${mt(n(3), por, P('2x'), igual, P('6x'))}. ¿Y ${mt(n(3), por, neg(-4))}?`],
      solucion: [`${mt(n(3), por, P('2x'), igual, P('6x'))}`, `${mt(n(3), por, neg(-4), igual, n(-12))}`, `Queda ${mt(P('6x - 12'))}.`],
      herramienta: { boton: 'Probarlo en la mesa de áreas', icono: 'cuadricula', mesa: 'areas', problema: { modo: 'armar', alto: leer('3'), ancho: leer('2x - 4') } }
    },
    {
      id: 'e3', nivel: 'basico', tema: 'factorizar', tipo: 'opciones', correcta: 0,
      enunciado: `Factorizar: ${mt(P('6x + 15'))}.`,
      plano: 'Factorizar: 6x + 15.',
      antes: queLlave(0, '6 y 15 están en la tabla del 3: hay algo en todos.', {
        1: 'Para la diferencia de cuadrados hacen falta dos cuadrados con una resta, como x² − 9. Aquí hay una suma, y 6x no es un cuadrado.',
        2: 'La llave maestra necesita una x², y aquí no hay.',
        3: 'Sí se puede: 6 y 15 están en la tabla del 3.'
      }),
      opciones: [mt(Pr('3', '2x + 5')), mt(Pr('3', '2x + 15')), mt(Pr('5', 'x + 3')), mt(Pr('3x', '2 + 5'))],
      opcionesPlano: ['3(2x + 5)', '3(2x + 15)', '5(x + 3)', '3x(2 + 5)'],
      porQue: {
        1: 'Al 15 también se le saca el 3: 15 ÷ 3 = 5. Armando de vuelta, 3 · 15 daría 45.',
        2: '6 no termina en 0 ni en 5: el 5 no está en los dos. Armando de vuelta, 5 · x da 5x, no 6x.',
        3: 'El 15 no tiene x: la x no está en los dos pedazos.'
      },
      pistas: [PISTA_LLAVE, '¿Son pares los dos? ¿Terminan en 0 o en 5? ¿Están en la tabla del 3? Sirve el 3: 6 = 3 · 2 y 15 = 3 · 5.'],
      solucion: ['6 es par, pero 15 no: el 2 no sale. 6 no termina en 0 ni en 5: el 5 tampoco.', `Los dos están en la tabla del 3: ${mt(P('6x + 15'), igual, Pr('3', '2x + 5'))}.`, `Comprobación: ${mt(n(3), por, P('2x'), mas, n(3), por, n(5), igual, P('6x + 15'))}.`],
      herramienta: { boton: 'Probarlo en la mesa de áreas', icono: 'cuadricula', mesa: 'areas', problema: { modo: 'desarmar', terminos: leer('6x + 15') } }
    },
    {
      id: 'e4', nivel: 'basico', tema: 'factorizar', tipo: 'opciones', correcta: 0,
      enunciado: `Factorizar: ${mt(P('x2 - 36'))}.`,
      plano: 'Factorizar: x² − 36.',
      antes: queLlave(1, 'Dos cuadrados (x · x y 6 · 6) con una resta.', {
        0: 'Entre x² y 36 no hay nada en común: ningún número ni ninguna x está en los dos.',
        2: 'Con b = 0, la llave maestra sirve. Pero en el chequeo la diferencia de cuadrados llega antes y lo abre en un paso.',
        3: 'Sí se puede: con una resta, dos cuadrados se desarman.'
      }, LARGO),
      opciones: [mt(Pr('x + 6', 'x - 6')), mt(Pr('x - 6', 'x - 6')), mt(Pr('x + 18', 'x - 18')), mt(Pr('x + 6', 'x + 6'))],
      opcionesPlano: ['(x + 6)(x − 6)', '(x − 6)(x − 6)', '(x + 18)(x − 18)', '(x + 6)(x + 6)'],
      porQue: {
        1: 'Armando de vuelta da x² − 12x + 36: los del medio no se anulan.',
        2: 'La raíz de 36 no es la mitad: es 6, porque 6 · 6 = 36.',
        3: 'Armando de vuelta da x² + 12x + 36. Hace falta un + y un −, para que los del medio se anulen.'
      },
      pistas: [PISTA_LLAVE, 'Dos cuadrados con una resta: x² = x · x y 36 = 6 · 6. Queda (raíz + raíz)(raíz − raíz).'],
      solucion: [`${mt(P('x2'), igual, vr('x'), por, vr('x'))} y ${mt(n(36), igual, n(6), por, n(6))}.`, `${mt(P('x2 - 36'), igual, Pr('x + 6', 'x - 6'))}.`, `Comprobación: ${mt(Pr('x + 6', 'x - 6'), igual, P('x2 - 6x + 6x - 36'), igual, P('x2 - 36'))}: los del medio se anulan.`],
      herramienta: { boton: 'Probarlo en la mesa de cuadrados', icono: 'cuadrados', mesa: 'cuadrados', problema: { a: [1, 2], b: [36, 0], signo: '−' } }
    },
    {
      id: 'e5', nivel: 'basico', tema: 'ecuacion', tipo: 'opciones', correcta: 0,
      enunciado: `¿Cuáles son las raíces de ${mt(P('x2 - 7x + 10'), igual, n(0))}?`,
      plano: '¿Cuáles son las raíces de x² − 7x + 10 = 0?',
      antes: queLlave(2, 'Tres términos con x² y nada en común: la llave maestra.', {
        0: 'Entre x², 7x y 10 no hay nada en común: el 10 no tiene x, y 1, 7 y 10 no están en la misma tabla.',
        1: 'Son tres términos, no dos cuadrados con una resta.',
        3: 'Con la llave se sabe: adentro de la raíz da 9, así que sí tiene raíces.'
      }),
      opciones: [`${n(2)} y ${n(5)}`, `${n(-2)} y ${n(-5)}`, `${n(3)} y ${n(4)}`, `${n(1)} y ${n(10)}`],
      opcionesPlano: ['2 y 5', '−2 y −5', '3 y 4', '1 y 10'],
      porQue: {
        1: 'Ese resultado sale de usar −b = −7. Pero b = −7, y −(−7) = +7: signos pegados.',
        2: 'Con x = 3: 9 − 21 + 10 = −2, no da cero.',
        3: 'Con x = 1: 1 − 7 + 10 = 4, no da cero.'
      },
      pistas: [PISTA_LLAVE, 'Aquí a = 1, b = −7 y c = 10. Adentro de la raíz: (−7)² − 4 · (1) · (10) = 49 − 40 = 9.'],
      solucion: [`a = 1, b = −7 y c = 10: ${mt(llaveHtml({ a: 1, b: -7, c: 10 }))}`, `${mt(vr('x'), igual, fr(`${n(7)} ${op('±')} ${raiz(`${n(49)} ${menos} ${n(40)}`)}`, n(2)), igual, fr(`${n(7)} ${op('±')} ${n(3)}`, n(2)))}`, `Con el +: ${mt(fr(n(10), n(2)), igual, n(5))}. Con el −: ${mt(fr(n(4), n(2)), igual, n(2))}. Las raíces son 2 y 5.`],
      herramienta: { boton: 'Probarlo en la llave maestra', icono: 'llave', mesa: 'llave', problema: { a: 1, b: -7, c: 10 } }
    },
    // ----- Intermedio -----
    {
      id: 'e6', nivel: 'intermedio', tema: 'distributiva', tipo: 'opciones', correcta: 0,
      enunciado: `Multiplicar: ${mt(Pr('x + 4', 'x - 2'))}.`,
      plano: 'Multiplicar: (x + 4)(x − 2).',
      antes: { pregunta: 'Antes de multiplicar: ¿cuántas flechas salen con todos contra todos?', opciones: ['2', '3', '4'], correcta: 2,
        respuesta: 'Salen 4 flechas.',
        bien: 'Dos términos por dos términos: 4 flechas, una por cada pedazo del rectángulo.',
        porQue: { 0: 'Serían 2 si solo se multiplicaran el primero con el primero y el último con el último: faltan las del medio.', 1: 'Dos términos por dos términos: 2 · 2 = 4 flechas.' } },
      opciones: [mt(P('x2 + 2x - 8')), mt(P('x2 - 8')), mt(P('x2 + 6x - 8')), mt(P('x2 - 2x - 8'))],
      opcionesPlano: ['x² + 2x − 8', 'x² − 8', 'x² + 6x − 8', 'x² − 2x − 8'],
      porQue: {
        1: 'Faltan los dos pedazos del medio: −2x y 4x.',
        2: 'Los del medio son 4x y −2x: tengo 4 y debo 2, me quedan 2. Queda 2x.',
        3: '4x − 2x da positivo: 2x.'
      },
      pistas: ['Todos contra todos, una flecha por cada multiplicación: x · x, x · (−2), 4 · x y 4 · (−2).', `${mt(P('x2 - 2x + 4x - 8'))}: falta juntar los del medio.`],
      solucion: [`${mt(Pr('x + 4', 'x - 2'), igual, P('x2 - 2x + 4x - 8'))}`, `Los del medio: ${mt(P('-2x + 4x'), igual, P('2x'))}. Queda ${mt(P('x2 + 2x - 8'))}.`],
      herramienta: { boton: 'Probarlo en la mesa de áreas', icono: 'cuadricula', mesa: 'areas', problema: { modo: 'armar', alto: leer('x + 4'), ancho: leer('x - 2') } }
    },
    {
      id: 'e7', nivel: 'intermedio', tema: 'factorizar', tipo: 'opciones', correcta: 0,
      enunciado: `Factorizar por completo: ${mt(P('4x2 - 10x'))}.`,
      plano: 'Factorizar por completo: 4x² − 10x.',
      antes: queLlave(0, 'Los dos son pares y los dos tienen x.', {
        1: '10x no es un cuadrado, así que esa llave no entra. Y hay algo en común: los dos son pares y tienen x.',
        2: 'Con c = 0, la llave maestra sirve. Pero en el chequeo el factor común llega antes: los dos son pares y tienen x.',
        3: 'Sí se puede: los dos tienen x.'
      }, LARGO),
      opciones: [mt(Pr('2x', '2x - 5')), mt(Pr('2', '2x2 - 5x')), mt(Pr('x', '4x - 10')), mt(Pr('2x', '2x - 10'))],
      opcionesPlano: ['2x(2x − 5)', '2(2x² − 5x)', 'x(4x − 10)', '2x(2x − 10)'],
      porQue: {
        1: 'Está bien, pero incompleto: todavía queda una x en los dos.',
        2: 'Está bien, pero incompleto: 4 y 10 todavía son pares.',
        3: 'Al 10x se le sacó el 2x: queda 5, porque 2x · 5 = 10x.'
      },
      pistas: [PISTA_LLAVE, 'Los dos son pares: sale un 2. Y x² = x · x comparte una x con x: sale una x.'],
      solucion: ['Números: 4 y 10 son pares, sale un 2. Después, 2 y 5 ya no comparten nada.', `Letras: x² y x comparten una x. ${mt(P('4x2 - 10x'), igual, Pr('2x', '2x - 5'))}.`, `Comprobación: ${mt(P('2x'), por, P('2x'), igual, P('4x2'))} y ${mt(P('2x'), por, neg(-5), igual, P('-10x'))}.`],
      herramienta: { boton: 'Probarlo en la mesa de áreas', icono: 'cuadricula', mesa: 'areas', problema: { modo: 'desarmar', terminos: leer('4x2 - 10x') } }
    },
    {
      id: 'e8', nivel: 'intermedio', tema: 'factorizar', tipo: 'opciones', correcta: 0,
      enunciado: `Factorizar: ${mt(P('x2 + 2x - 15'))}.`,
      plano: 'Factorizar: x² + 2x − 15.',
      antes: queLlave(2, 'Tres términos con x² y nada en común.', {
        0: 'El 15 no tiene x, y 1, 2 y 15 no están en la misma tabla: no hay nada en todos.',
        1: 'Son tres términos, no dos cuadrados con una resta.',
        3: 'Con la llave se sabe: adentro de la raíz da 64, así que sí tiene raíces.'
      }),
      opciones: [mt(Pr('x + 5', 'x - 3')), mt(Pr('x - 5', 'x + 3')), mt(Pr('x + 5', 'x + 3')), mt(Pr('x - 15', 'x + 1'))],
      opcionesPlano: ['(x + 5)(x − 3)', '(x − 5)(x + 3)', '(x + 5)(x + 3)', '(x − 15)(x + 1)'],
      porQue: {
        1: 'Armando de vuelta da x² − 2x − 15: el del medio quedó con el signo al revés.',
        2: 'Armando de vuelta, 5 · 3 = +15, y hace falta −15.',
        3: 'Armando de vuelta da x² − 14x − 15.'
      },
      pistas: [PISTA_LLAVE, 'Aquí a = 1, b = 2 y c = −15. Adentro de la raíz: 2² − 4 · (1) · (−15) = 4 + 60 = 64.'],
      solucion: [`a = 1, b = 2 y c = −15: ${mt(llaveHtml({ a: 1, b: 2, c: -15 }))}`, `√64 = 8. Con el +: ${mt(fr(`${n(-2)} ${mas} ${n(8)}`, n(2)), igual, n(3))}. Con el −: ${mt(fr(`${n(-2)} ${menos} ${n(8)}`, n(2)), igual, n(-5))}.`, `La raíz 3 da (x − 3) y la raíz −5 da (x + 5). Queda ${mt(Pr('x + 5', 'x - 3'))}.`],
      herramienta: { boton: 'Probarlo en la llave maestra', icono: 'llave', mesa: 'llave', problema: { a: 1, b: 2, c: -15 } }
    },
    {
      id: 'e9', nivel: 'intermedio', tema: 'ecuacion', tipo: 'numero', respuesta: 4,
      enunciado: `Resolver ${mt(P('x2 - 2x - 8'), igual, n(0))}. Escribir la raíz positiva.`,
      plano: 'Resolver x² − 2x − 8 = 0. Escribir la raíz positiva.',
      antes: queLlave(2, 'Tres términos con x²: la llave da las raíces directo.', {
        0: 'No hay un número en todos (la x² lleva un 1) y el −8 no tiene x.',
        1: 'Son tres términos, no dos cuadrados con una resta.',
        3: 'Con la llave se sabe: adentro de la raíz da 36, así que sí tiene raíces.'
      }),
      errores: [
        { valor: 2, msg: 'Ese resultado sale de usar −b = −2. Pero b = −2, y −(−2) = +2: signos pegados.' },
        { valor: 8, msg: 'Falta dividir entre 2 · a = 2.' },
        { valor: -2, msg: 'Esa es la otra raíz, la negativa. Se pide la positiva.' }
      ],
      pistas: [PISTA_LLAVE, 'Aquí a = 1, b = −2 y c = −8. Adentro de la raíz: (−2)² − 4 · (1) · (−8) = 4 + 32 = 36.'],
      solucion: [`${mt(llaveHtml({ a: 1, b: -2, c: -8 }))}`, `√36 = 6. Con el +: ${mt(fr(`${n(2)} ${mas} ${n(6)}`, n(2)), igual, n(4))}. Con el −: ${mt(fr(`${n(2)} ${menos} ${n(6)}`, n(2)), igual, n(-2))}.`, 'La raíz positiva es 4. Comprobación: 16 − 8 − 8 = 0.'],
      herramienta: { boton: 'Probarlo en la llave maestra', icono: 'llave', mesa: 'llave', problema: { a: 1, b: -2, c: -8 } }
    },
    // ----- Tipo examen -----
    {
      id: 'e10', nivel: 'examen', tema: 'factorizar', tipo: 'opciones', correcta: 0,
      enunciado: `La factorización completa de ${mt(P('2x2 - 18'))} es:`,
      plano: 'La factorización completa de 2x² − 18 es:',
      // Un candado de dos llaves: se pregunta por la primera, con las cuatro opciones de siempre
      // (una opción que nombrara las dos llaves se adivinaría sin pensar)
      antes: queLlave(0, '2 y 18 son pares: sale el 2 y queda 2(x² − 9). Después se mira otra vez lo de adentro: x² − 9 lo abre la diferencia de cuadrados.', {
        1: 'Así como está, no entra: ni 2 ni 18 son cuadrados exactos. Después de sacar el 2, sí: x² − 9.',
        2: 'Con b = 0, la llave maestra lo abre todo de una vez. Pero el chequeo empieza por el factor común, y aquí abre.',
        3: 'Sí se puede: 2 y 18 son pares.'
      }, {
        pregunta: '¿Cuál es la <b>primera</b> llave que hay que usar para destrabar este candado?',
        respuesta: 'La primera llave es el factor común.',
        tambien: [2]
      }),
      opciones: [mt(Pr('2', 'x + 3', 'x - 3')), mt(Pr('2', 'x2 - 9')), mt(Pr('x + 3', 'x - 3')), mt(Pr('2', 'x + 9', 'x - 9'))],
      opcionesPlano: ['2(x + 3)(x − 3)', '2(x² − 9)', '(x + 3)(x − 3)', '2(x + 9)(x − 9)'],
      porQue: {
        1: 'Está bien, pero incompleto: x² − 9 todavía se desarma (es una diferencia de cuadrados).',
        2: 'Falta el 2: armando de vuelta da x² − 9, no 2x² − 18.',
        3: 'La raíz de 9 es 3, no 9: 3 · 3 = 9.'
      },
      pistas: [PISTA_LLAVE, `El factor común abre una parte: ${mt(P('2x2 - 18'), igual, Pr('2', 'x2 - 9'))}. ¿Se puede seguir abriendo lo de adentro?`],
      solucion: [`Factor común: ${mt(P('2x2 - 18'), igual, Pr('2', 'x2 - 9'))}.`, `Diferencia de cuadrados: ${mt(P('x2 - 9'), igual, Pr('x + 3', 'x - 3'))}.`, `Queda ${mt(Pr('2', 'x + 3', 'x - 3'))}. La llave maestra da lo mismo de una vez: con a = 2, las raíces son 3 y −3.`],
      herramienta: { boton: 'Comprobarlo con la llave maestra', icono: 'llave', mesa: 'llave', problema: { a: 2, b: 0, c: -18 } }
    },
    {
      id: 'e11', nivel: 'examen', tema: 'simplificar', tipo: 'opciones', correcta: 0,
      enunciado: `Simplificar ${mt(fr(P('x2 - 9'), P('x - 3')))}.`,
      plano: 'Simplificar (x² − 9)/(x − 3).',
      antes: queLlave(1, 'Dos cuadrados con una resta: x² − 9 = (x + 3)(x − 3).', {
        0: 'Entre x² y 9 no hay nada en común.',
        2: 'Con b = 0, la llave maestra sirve. Pero en el chequeo la diferencia de cuadrados llega antes: dos cuadrados con una resta.',
        3: 'Sí se puede: es una resta de dos cuadrados.'
      }, { pregunta: '¿Qué llave logra abrir el candado de arriba?', tambien: [2] }),
      opciones: [mt(P('x + 3')), mt(P('x - 3')), mt(P('x2 - 3')), mt(fr(n(1), P('x + 3')))],
      opcionesPlano: ['x + 3', 'x − 3', 'x² − 3', '1/(x + 3)'],
      porQue: {
        1: 'El (x − 3) de abajo se tacha con el de arriba: queda el otro, (x + 3).',
        2: 'No se tachan pedazos sueltos de una resta (el 9 con el 3): solo paréntesis completos. Primero se factoriza arriba.',
        3: 'Al revés: el (x + 3) queda arriba, porque estaba arriba.'
      },
      pistas: [PISTA_LLAVE, `${mt(P('x2 - 9'), igual, Pr('x + 3', 'x - 3'))}. Ahora, como en el módulo 2: lo que está arriba y abajo se tacha.`],
      solucion: [`Arriba, diferencia de cuadrados: ${mt(fr(Pr('x + 3', 'x - 3'), P('x - 3')))}.`, `Se tacha el (x − 3) de arriba con el de abajo: ${mt(fr(pega(F('x + 3'), tach(F('x - 3'))), tach(F('x - 3'))), igual, P('x + 3'))}.`],
      herramienta: { boton: 'Probarlo en la mesa de cuadrados', icono: 'cuadrados', mesa: 'cuadrados', problema: { a: [1, 2], b: [9, 0], signo: '−' } }
    },
    {
      id: 'e12', nivel: 'examen', tema: 'ecuacion', tipo: 'numero', respuesta: 4, unidad: 's',
      enunciado: `La altura de una piedra lanzada hacia arriba es ${mt(vr('h'), igual, P('20t - 5t2', 't'))} (h en metros y t en segundos). Aparte de t = 0, ¿en qué tiempo vuelve al suelo (h = 0)?`,
      plano: 'La altura de una piedra lanzada hacia arriba es h = 20t − 5t² (h en metros y t en segundos). Aparte de t = 0, ¿en qué tiempo vuelve al suelo (h = 0)?',
      antes: queLlave(0, 'Los dos tienen 5 y una t.', {
        1: '20t no es un cuadrado, así que esa llave no entra. Y hay algo en común: los dos tienen 5 y una t.',
        2: 'Con c = 0, la llave maestra sirve. Pero en el chequeo el factor común llega antes: los dos tienen 5 y una t.',
        3: 'Sí se puede: los dos tienen una t.'
      }, LARGO),
      errores: [
        { valor: 0, msg: 'El tiempo t = 0 es cuando sale. La otra raíz sale del otro paréntesis: 4 − t = 0.' },
        { valor: -4, msg: 'El número está bien, pero el signo no: 4 − t = 0 cuando t = 4.' },
        { valor: 2, msg: 'En t = 2 la piedra está en lo más alto: 20 · 2 − 5 · 4 = 20 m. Vuelve al suelo después.' },
        { valor: 20, msg: 'Ese resultado sale de mirar solo el 20. Factorizando: 5t(4 − t) = 0.' }
      ],
      pistas: [PISTA_LLAVE, `Los dos tienen 5 y una t: ${mt(P('20t - 5t2', 't'), igual, pega(P('5t', 't'), F('4 - t', 't')))}. Si una multiplicación da 0, alguno de los factores es 0.`],
      solucion: [`${mt(P('20t - 5t2', 't'), igual, pega(P('5t', 't'), F('4 - t', 't')), igual, n(0))}`, '5t = 0 da t = 0 (cuando sale del suelo). 4 − t = 0 da t = 4.', 'Vuelve al suelo a los 4 s.'],
      herramienta: { boton: 'Probarlo en la mesa de áreas', icono: 'cuadricula', mesa: 'areas', problema: { modo: 'desarmar', terminos: leer('20t - 5t2', 't'), letra: 't' } }
    },
    {
      id: 'e13', nivel: 'examen', tema: 'factorizar', tipo: 'opciones', correcta: 0,
      enunciado: `Factorizar: ${mt(P('2x2 + 5x - 3'))}.`,
      plano: 'Factorizar: 2x² + 5x − 3.',
      antes: queLlave(2, 'Tres términos con x² y nada en común.', {
        0: 'No hay nada en todos: el 5 no es par, el 2 no está en la tabla del 3 y el −3 no tiene x.',
        1: 'Son tres términos, no dos cuadrados con una resta.',
        3: 'Con la llave se sabe: adentro de la raíz da 49, así que sí tiene raíces.'
      }),
      opciones: [mt(Pr('2x - 1', 'x + 3')), mt(Pr('2x + 1', 'x - 3')), mt(Pr('x - 1', '2x + 3')), mt(Pr('2x - 3', 'x + 1'))],
      opcionesPlano: ['(2x − 1)(x + 3)', '(2x + 1)(x − 3)', '(x − 1)(2x + 3)', '(2x − 3)(x + 1)'],
      porQue: {
        1: 'Armando de vuelta da 2x² − 5x − 3: el del medio quedó con el signo al revés.',
        2: 'Armando de vuelta da 2x² + x − 3.',
        3: 'Armando de vuelta da 2x² − x − 3.'
      },
      pistas: [PISTA_LLAVE, 'Aquí a = 2, b = 5 y c = −3. Adentro de la raíz: 25 − 4 · (2) · (−3) = 25 + 24 = 49.'],
      solucion: [`√49 = 7. Con el +: ${mt(fr(`${n(-5)} ${mas} ${n(7)}`, n(4)), igual, fr(n(1), n(2)))}. Con el −: ${mt(fr(`${n(-5)} ${menos} ${n(7)}`, n(4)), igual, n(-3))}.`, `Con la a adelante: ${mt(pega(medio, F('x + 3')))}.`, `El 2 entra al paréntesis de la fracción: ${mt(medio, igual, P('2x - 1'))}. Queda ${mt(Pr('2x - 1', 'x + 3'))}.`],
      herramienta: { boton: 'Probarlo en la llave maestra', icono: 'llave', mesa: 'llave', problema: { a: 2, b: 5, c: -3 } }
    },
    // ----- Reto -----
    {
      id: 'e14', nivel: 'reto', tema: 'ecuacion', tipo: 'numero', respuesta: 4,
      enunciado: `Si ${mt(pot(vr('x'), 2), menos, pot(vr('y'), 2), igual, n(24))} y ${mt(vr('x'), mas, vr('y'), igual, n(6))}, ¿cuánto vale ${mt(vr('x'), menos, vr('y'))}?`,
      plano: 'Si x² − y² = 24 y x + y = 6, ¿cuánto vale x − y?',
      antes: queLlave(1, 'Dos cuadrados con una resta: x² − y² = (x + y)(x − y).', {
        0: 'Entre x² y y² no hay ninguna letra en común.',
        2: 'Aquí hay dos letras, y lo que sirve es ver una resta de dos cuadrados.',
        3: 'Sí se puede: es una resta de dos cuadrados.'
      }, { pregunta: '¿Qué llave logra abrir el candado x² − y²?' }),
      errores: [
        { valor: 18, msg: 'Ese resultado sale de restar 24 − 6. Desarmando, x² − y² = (x + y)(x − y): 24 = 6 · (x − y).' },
        { valor: 144, msg: 'Ese resultado sale de multiplicar 24 · 6. Es 6 · (x − y) = 24: se divide.' },
        { valor: 30, msg: 'Ese resultado sale de sumar 24 + 6. Es 6 · (x − y) = 24: se divide.' }
      ],
      pistas: [PISTA_LLAVE, `${mt(pot(vr('x'), 2), menos, pot(vr('y'), 2), igual, pega(par(`${vr('x')} ${mas} ${vr('y')}`), par(`${vr('x')} ${menos} ${vr('y')}`)))}. Ya se sabe cuánto vale x + y.`],
      solucion: [`${mt(n(24), igual, pega(par(`${vr('x')} ${mas} ${vr('y')}`), par(`${vr('x')} ${menos} ${vr('y')}`)), igual, n(6), por, par(`${vr('x')} ${menos} ${vr('y')}`))}`, `${mt(vr('x'), menos, vr('y'), igual, n(24), entre, n(6), igual, n(4))}`]
    },
    {
      id: 'e15', nivel: 'reto', tema: 'simplificar', tipo: 'opciones', correcta: 0,
      enunciado: `Simplificar ${mt(fr(P('x2 - 4'), P('x2 + 4x + 4')))}.`,
      plano: 'Simplificar (x² − 4)/(x² + 4x + 4).',
      antes: queLlave(2, 'Tres términos con x²: la llave maestra. Adentro de la raíz da 0, así que la raíz −2 sale dos veces.', {
        0: 'Entre x², 4x y 4 no hay nada en común: la x² lleva un 1 y el 4 no tiene x.',
        1: 'Son tres términos, no dos cuadrados con una resta.',
        3: 'Con la llave se sabe: adentro de la raíz da 0, y eso sí tiene raíz.'
      }, { pregunta: 'El candado de arriba lo abre la diferencia de cuadrados. ¿Qué llave logra abrir el de abajo?' }),
      opciones: [mt(fr(P('x - 2'), P('x + 2'))), mt(fr(P('x + 2'), P('x - 2'))), mt(n(-1)), mt(fr(P('x - 2'), P('x + 4')))],
      opcionesPlano: ['(x − 2)/(x + 2)', '(x + 2)/(x − 2)', '−1', '(x − 2)/(x + 4)'],
      porQue: {
        1: 'Al revés: el que sobra arriba es (x − 2), y abajo queda un (x + 2).',
        2: 'No se tachan pedazos sueltos (x² con x², 4 con 4): solo paréntesis completos. Primero se factoriza arriba y abajo.',
        3: 'Abajo, x² + 4x + 4 = (x + 2)(x + 2): la llave da la raíz −2 dos veces.'
      },
      pistas: [`Arriba: ${mt(P('x2 - 4'), igual, Pr('x + 2', 'x - 2'))}. Abajo, con la llave maestra: a = 1, b = 4 y c = 4.`, `Abajo: ${mt(P('x2 + 4x + 4'), igual, Pr('x + 2', 'x + 2'))}. ¿Qué se tacha?`],
      solucion: [`${mt(fr(Pr('x + 2', 'x - 2'), Pr('x + 2', 'x + 2')))}`, `Se tacha un (x + 2) arriba y otro abajo: ${mt(fr(pega(tach(F('x + 2')), F('x - 2')), pega(tach(F('x + 2')), F('x + 2'))), igual, fr(P('x - 2'), P('x + 2')))}.`],
      herramienta: { boton: 'Probarlo en la llave maestra', icono: 'llave', mesa: 'llave', problema: { a: 1, b: 4, c: 4 } }
    }
  ];

  const NIVELES = { basico: 'Básico', intermedio: 'Intermedio', examen: 'Tipo examen', reto: 'Reto' };
  const TEMAS = { juntar: 'Juntar términos', distributiva: 'Distributiva', factorizar: 'Factorizar', ecuacion: 'Ecuaciones', simplificar: 'Simplificar' };

  /* ---------- Plan de la clase (lo ve el estudiante en la cabecera del módulo) ---------- */
  const PLAN_CLASE = [
    ['9 min', 'Ideas clave, parte 1: juntar, armar y desarmar.'],
    ['24 min', 'Mesa de áreas: retos 1 a 10. Al final, del dibujo al papel: todos contra todos.'],
    ['5 min', 'Ideas clave, parte 2: diferencia de cuadrados.'],
    ['8 min', 'Cortar y mover, y la mesa de cuadrados: retos 1 a 5.'],
    ['9 min', 'Ideas clave, parte 3: la llave maestra.'],
    ['20 min', 'Llave maestra: retos 1 a 3, y dónde aterriza la curva en la gráfica. Los demás retos quedan de tarea.'],
    ['5 min', 'Práctica: ejercicios 1 a 3. De tarea quedan los demás.']
  ];

  MA.M3 = {
    RETOS_AREAS, RETOS_CUADRADOS, RETOS_LLAVE, EJERCICIOS, NIVELES, TEMAS, PLAN_CLASE, LLAVES,
    leer, par, grupo, cuerpoHtml, terminoHtml, polinomioHtml, factorHtml, productoHtml,
    cuerpoTexto, terminoTexto, polinomioTexto, factorTexto, productoTexto,
    multiplicarTerminos, pedazos, juntar, multiplicar,
    rectanguloHtml, piezaHtml, figuraCuadradosSvg, llaveHtml, trinomioHtml, trinomioTexto, fichaCuadradosHtml,
    P, PT, F, Pr, PrT
  };
})();
