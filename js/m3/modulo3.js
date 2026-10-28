/* =====================================================================
   Módulo 3 · página completa (factorización)
   Secciones: 1) ideas clave, 2) armar y desarmar (mesa de áreas),
   3) diferencia de cuadrados, 4) llave maestra, 5) práctica integrada.
   Rutas: #m3-ideas (-p1, -p2, -p3) · #m3-areas · #m3-cuadrados ·
          #m3-llave · #m3-practica
   ---------------------------------------------------------------------
   Por qué está armado así (decisiones pedagógicas)
   1. Una sola figura para entender todo el módulo: el rectángulo de
      áreas. Los lados son los factores y el área es el resultado. Armar
      (la distributiva) va de los lados al área; desarmar (factorizar) va
      del área a los lados. Factorizar no es una regla nueva: es el mismo
      dibujo recorrido al revés, y siempre se comprueba armando.
   2. El dibujo es para entender, no para trabajar: con negativos se
      enreda, porque ningún lado mide −3. Por eso, justo después de la
      mesa, la tarjeta «Del dibujo al papel» pasa a las flechas de todos
      contra todos (la doble distributiva), con los mismos pedazos y los
      mismos colores. Es lo que se escribe en el examen, y la llave
      maestra se comprueba así, no en el rectángulo. Al desarmar con un
      término negativo (reto 10) tampoco se dibuja: se ve cada término
      dividido entre lo que está en todos.
   3. Antes de armar, juntar: x² y x son piezas de distinta forma (un
      cuadrado y una tira), como m² y m. Sin eso no se puede terminar la
      distributiva, y es fácil cruzarlo con lo del módulo 2: x · x = x²,
      pero x + x = 2x.
   4. Factor común sin MCM ni MCD. El MCM es para sumar fracciones (y para
      eso ya está la mariposa); confundirlos es lo que lo enredó. Aquí se
      saca de a poco con tres preguntas (¿son pares?, ¿terminan en 0 o en
      5?, ¿están en la tabla del 3?) y ¿todos tienen x?, igual que al
      simplificar en el módulo 2. Nunca hay que ver de una vez el número
      más grande.
   5. Diferencia de cuadrados porque se ve: un cuadrado al que se le
      quita otro se corta y se reacomoda en un rectángulo. Antes aparece
      en la mesa de áreas, al armar (x + 3)(x − 3): los del medio se
      anulan.
   6. Para los trinomios, una llave maestra en vez de casos: la fórmula
      cuadrática da las raíces y cada raíz r da el paréntesis (x − r),
      que se elige probando cuál se vuelve cero. Sirve con a distinto de
      1, encuentra sola el «trinomio cuadrado perfecto» (adentro de la
      raíz da 0) y avisa cuando no se puede (da negativo). Se reemplaza
      siempre con paréntesis y paso por paso, porque trae las tres
      trampas del radar de signos: −(−b), (−b)² y 4ac con c negativa. La
      fórmula se resuelve a la vista: titila la parte que se pide y cada
      resultado la reemplaza, para que se vea de dónde sale cada número.
      La misma fórmula vuelve en el módulo 4 (cuándo cae una piedra).
   7. Raíces y factorización son dos caras de la misma moneda: si se
      factoriza, las raíces salen solas, y con las raíces de la llave se
      arma la factorización. La gráfica de GeoGebra lo vuelve visible:
      las raíces son los puntos donde la curva toca el suelo, y los tres
      casos de la llave (dos raíces, una o ninguna) se ven como dos
      aterrizajes, un roce o ningún contacto. Se carga solo al abrir la
      sección, porque pesa y necesita internet.
   8. Cada herramienta pide una predicción antes de actuar y explica el
      error con el caso concreto. En las diapositivas, lo que el tutor
      pregunta va tapado con «?» hasta que él conteste. La práctica
      sigue el orden del módulo y, antes de cada factorización, pregunta
      qué llave logra abrir el candado, no cuál va primero: el chequeo
      mental siempre empieza por el factor común, así que «¿cuál
      primero?» tenía trampa. La excepción es el candado de dos llaves:
      ahí se pregunta por la primera, con las cuatro opciones de siempre,
      porque una opción «factor común y después…» se adivinaba. Si se
      elige la llave maestra cuando hay un camino más corto, no se marca
      como error: también abre, pero por el camino largo. La pregunta no
      bloquea: se responde, se ve el porqué y se sigue.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, crear, icono } = MA;
  const { vr, n, op, mt, pega } = MA.f;
  const C = MA.M3;
  const { P, F, Pr } = C;
  const igual = op('='), por = op('·'), mas = op('+'), menos = op('−');

  const SECCIONES = [
    { id: 'ideas', nombre: 'Ideas clave', corto: 'Ideas', icono: 'libro' },
    { id: 'areas', nombre: 'Armar y desarmar', corto: 'Áreas', icono: 'cuadricula' },
    { id: 'cuadrados', nombre: 'Diferencia de cuadrados', corto: 'Cuadrados', icono: 'cuadrados' },
    { id: 'llave', nombre: 'Llave maestra', corto: 'Llave', icono: 'llave' },
    { id: 'practica', nombre: 'Práctica', corto: 'Práctica', icono: 'hoja' }
  ];

  function progreso() {
    const cuenta = (pref, ids) => [MA.progreso.contar(pref, ids), ids.length];
    const res = {
      ideas: cuenta('m3.ideas.', MA.Clase3.PARTES.map(p => p.id)),
      areas: cuenta('m3.areas.', C.RETOS_AREAS.map(x => x.id)),
      cuadrados: cuenta('m3.cuad.', C.RETOS_CUADRADOS.map(x => x.id)),
      llave: cuenta('m3.llave.', C.RETOS_LLAVE.map(x => x.id)),
      practica: cuenta('m3.prac.', C.EJERCICIOS.map(x => x.id))
    };
    const todos = SECCIONES.map(s => res[s.id]);
    res.hechos = todos.reduce((s, x) => s + x[0], 0);
    res.total = todos.reduce((s, x) => s + x[1], 0);
    res.pct = res.total ? res.hechos / res.total : 0;
    res.herramientas = [res.areas[0] + res.cuadrados[0] + res.llave[0], res.areas[1] + res.cuadrados[1] + res.llave[1]];
    return res;
  }

  const cabeza = (paso, titulo, entrada) => `
    <div class="seccion-cabeza">
      <span class="etiqueta">Paso ${paso} de ${SECCIONES.length}</span>
      <h2>${titulo}</h2>
      <p class="entrada">${entrada}</p>
    </div>`;

  function htmlIdeas() {
    return `
      ${cabeza(1, 'Ideas clave', 'Tres partes cortas. Cada una va justo antes de su herramienta: la primera antes de la mesa de áreas, la segunda antes de la diferencia de cuadrados y la tercera antes de la llave maestra.')}
      <div class="m3-presentacion"></div>
      <section class="tarjeta m2-reglas m3-reglas" aria-labelledby="m3-reglas-titulo">
        <h3 id="m3-reglas-titulo">Resumen de reglas</h3>
        <p class="texto-2">Para tener a mano al practicar.</p>
        <div class="m2-reglas-grilla m3-reglas-grilla">
          <div>
            <h4>Juntar</h4>
            <ul>
              <li>Solo lo del mismo tipo: ${mt(P('2x + 3x'), igual, P('5x'))}.</li>
              <li>${mt(P('x2'))} y ${mt(vr('x'))} no se juntan, igual que m² y m.</li>
              <li>Al sumar, la letra no cambia: ${mt(P('x + x'), igual, P('2x'))}; ${mt(vr('x'), por, vr('x'), igual, P('x2'))} es multiplicar.</li>
            </ul>
          </div>
          <div>
            <h4>Armar (distributiva)</h4>
            <ul>
              <li>Todos contra todos: una flecha de cada término de un lado a cada término del otro.</li>
              <li>${mt(Pr('x + 2', 'x + 3'), igual, P('x2 + 5x + 6'))}</li>
              <li>Números con números y letras con letras.</li>
            </ul>
          </div>
          <div>
            <h4>Desarmar (factor común)</h4>
            <ul>
              <li>Sacar de a poco lo que está en todos: ¿son pares? ¿Terminan en 0 o en 5? ¿Están en la tabla del 3? ¿Todos tienen x?</li>
              <li>Si se saca todo un pedazo, queda 1: ${mt(P('4x + 4'), igual, Pr('4', 'x + 1'))}.</li>
            </ul>
          </div>
          <div>
            <h4>Diferencia de cuadrados</h4>
            <ul>
              <li>Dos cuadrados con una resta: ${mt(P('x2 - 9'), igual, Pr('x + 3', 'x - 3'))}.</li>
              <li>Con suma no se puede: ${mt(P('x2 + 9'))} no se desarma.</li>
            </ul>
          </div>
          <div>
            <h4>Llave maestra</h4>
            <ul>
              <li>${mt(C.llaveHtml())}</li>
              <li>Se reemplaza siempre con paréntesis. Cada raíz r da ${mt(C.par(`${vr('x')} ${menos} ${vr('r')}`))}.</li>
              <li>La a va adelante.</li>
            </ul>
          </div>
          <div>
            <h4>¿Qué llave abre el candado?</h4>
            <ol>
              <li>¿Hay algo en todos? Factor común.</li>
              <li>¿Dos cuadrados con una resta? Diferencia de cuadrados.</li>
              <li>¿Nada de eso? Llave maestra.</li>
            </ol>
            <p class="m3-reglas-nota">Si una llave abre solo una parte, se mira otra vez lo que quedó.</p>
          </div>
        </div>
      </section>`;
  }

  function htmlAreas() {
    return `
      ${cabeza(2, 'Armar y desarmar', 'Una multiplicación es un rectángulo: los lados son los factores y el área es el resultado. Armar es multiplicar (la distributiva) y desarmar es volver a los lados (el factor común). Antes, una regla para juntar los pedazos.')}
      <ol class="pasos-concepto">
        <li><span class="pc-num">01</span><h3>Juntar</h3><p>Solo se suman las piezas de la misma forma: cuadrados (x²), tiras (x) y cuadraditos (números).</p><div class="mt mt-bloque">${P('2x + 3x')} ${igual} ${P('5x')}</div></li>
        <li><span class="pc-num">02</span><h3>Armar</h3><p>La distributiva: todos contra todos, y después se junta lo del mismo tipo.</p><div class="mt mt-bloque">${Pr('3', 'x + 2')} ${igual} ${P('3x + 6')}</div></li>
        <li><span class="pc-num">03</span><h3>Desarmar</h3><p>El factor común: se saca de a poco lo que está en todos los pedazos.</p><div class="mt mt-bloque">${P('6x + 9')} ${igual} ${Pr('3', '2x + 3')}</div></li>
      </ol>
      <div class="m3-areas"></div>
      <section class="tarjeta m3-puente" aria-labelledby="m3-puente-titulo">
        <div class="m3-puente-texto">
          <h3 id="m3-puente-titulo">Del dibujo al papel: el método todos contra todos</h3>
          <p>El rectángulo sirve para entender de dónde sale cada pedazo, pero en el papel no se dibuja. Cada término del primer paréntesis multiplica a cada término del segundo, y cada multiplicación es una flecha: es la doble distributiva.</p>
          <p>Salen los mismos pedazos del rectángulo, con los mismos colores: azul para ${mt(P('x2'))}, ámbar para ${mt(vr('x'))} y violeta para los números.</p>
          <div class="caja caja-ojo">
            <div class="caja-titulo">${icono('alerta')}No existen áreas negativas</div>
            <p>Un lado no puede medir ${mt(n(-3))}, así que con negativos el dibujo se enreda. Las flechas sirven con cualquier signo: cada una es una multiplicación con su regla de signos, y al final se junta lo del mismo tipo.</p>
          </div>
        </div>
        <div class="m3-flechas"></div>
      </section>
      <div class="caja">
        <div class="caja-titulo">${icono('pista')}Sacar de a poco: tres preguntas y una más</div>
        <p>¿Todos son <b>pares</b>? ¿Todos <b>terminan en 0 o en 5</b>? ¿Todos están en la <b>tabla del 3</b> (sus cifras suman 3, 6, 9…)? Y para las letras: ¿todos tienen <b>al menos una x</b>? Cada sí es algo que sale. Lo de afuera se va multiplicando: ${mt(P('12x + 18'), igual, Pr('2', '6x + 9'), igual, Pr('6', '2x + 3'))}.</p>
      </div>
      <div class="caja caja-neutra">
        <div class="caja-titulo">${icono('info')}¿Y el MCM?</div>
        <p>No hace falta. El MCM (mínimo común múltiplo) sirve para sumar fracciones, y para eso ya está la mariposa. Lo que se busca aquí es lo que divide a todos los términos: en un libro o un video lo llaman MCD (máximo común divisor), y es justo lo que queda afuera cuando ya no se puede sacar nada más.</p>
      </div>
      <div class="caja caja-ojo">
        <div class="caja-titulo">${icono('pista')}Los dos errores más comunes al armar</div>
        <p>${mt(Pr('3', 'x + 2'))} no es ${mt(P('3x + 2'))}: el 3 multiplica a todos los de adentro. Y ${mt(Pr('x + 2', 'x + 3'))} no es ${mt(P('x2 + 6'))}: faltan los dos pedazos del medio. El rectángulo tiene 4 pedazos, no 2.</p>
      </div>
      <div class="caja">
        <div class="caja-titulo">${icono('info')}Para qué sirve en física</div>
        <p>La altura de una piedra lanzada hacia arriba es ${mt(vr('h'), igual, P('20t - 5t2', 't'))}. Sacando factor común, ${mt(P('20t - 5t2', 't'), igual, pega(P('5t', 't'), F('4 - t', 't')))}: la piedra está en el suelo cuando 5t = 0 o cuando 4 − t = 0, es decir, en t = 0 y en t = 4 s. Esto vuelve en el módulo 4.</p>
      </div>`;
  }

  function htmlCuadrados() {
    return `
      ${cabeza(3, 'Diferencia de cuadrados', 'Un cuadrado menos otro cuadrado siempre se puede reacomodar en un rectángulo. Primero se ve cortando y moviendo; después, en la mesa, se reconoce y se desarma.')}
      <div class="m3-figura"></div>
      <ol class="pasos-concepto">
        <li><span class="pc-num">01</span><h3>Dos términos</h3><p>Ni más ni menos: ${mt(P('x2 - 9'))}.</p></li>
        <li><span class="pc-num">02</span><h3>Una resta</h3><p>Con suma no se puede: ${mt(P('x2 + 9'))} no se desarma.</p></li>
        <li><span class="pc-num">03</span><h3>Los dos son cuadrados</h3><p>${mt(P('4x2'), igual, P('2x'), por, P('2x'))} y ${mt(n(25), igual, n(5), por, n(5))}, así que ${mt(P('4x2 - 25'), igual, Pr('2x + 5', '2x - 5'))}.</p></li>
      </ol>
      <div class="m3-cuadrados"></div>
      <div class="caja">
        <div class="caja-titulo">${icono('pista')}¿Por qué no hay término con x?</div>
        <p>Al armar ${mt(Pr('x + 3', 'x - 3'))} salen ${mt(P('x2 - 3x + 3x - 9'))}: los del medio se anulan, como deber 3 y pagar 3. Es el reto 5 de la mesa de áreas.</p>
      </div>
      <div class="caja caja-neutra">
        <div class="caja-titulo">${icono('llave')}La llave maestra también abre esta</div>
        <p>${mt(P('x2 - 9'))} es un trinomio con ${mt(vr('b'), igual, n(0))}: la llave da las raíces 3 y −3, y sale lo mismo. La diferencia de cuadrados es un atajo, no una regla aparte.</p>
      </div>`;
  }

  function htmlLlave() {
    return `
      ${cabeza(4, 'La llave maestra', 'Una sola fórmula para cualquier trinomio con x²: da las raíces, y de cada raíz sale un paréntesis. No hay que adivinar números ni aprenderse casos.')}
      <ol class="pasos-concepto">
        <li><span class="pc-num">01</span><h3>Los números a, b y c</h3><p>Cada uno con su signo. Si delante de x² no hay número, a = 1; si falta un término, vale 0.</p></li>
        <li><span class="pc-num">02</span><h3>Reemplazar con paréntesis</h3><p>Así no se pierde ningún signo: ${mt(menos, C.par(n(-5)), igual, n(5))} y ${mt(MA.M2.pot(C.par(n(-5)), 2), igual, n(25))}.</p></li>
        <li><span class="pc-num">03</span><h3>Cada raíz, un paréntesis</h3><p>La raíz r da ${mt(C.par(`${vr('x')} ${menos} ${vr('r')}`))}: el que se vuelve cero con x = r. La a va adelante.</p></li>
      </ol>
      <div class="m3-llave"></div>
      ${htmlMoneda()}
      <div class="caja caja-ojo">
        <div class="caja-titulo">${icono('radar')}Las tres trampas de signos (las del radar del módulo 2)</div>
        <p>${mt(menos, C.par(n(-5)), igual, mas, n(5))}: signos pegados. ${mt(MA.M2.pot(C.par(n(-5)), 2), igual, n(25))}: el paréntesis incluye el signo. ${mt(n(1), menos, C.par(n(-24)), igual, n(1), mas, n(24))}: cuando c es negativa, adentro de la raíz se suma.</p>
      </div>
      <div class="caja">
        <div class="caja-titulo">${icono('pista')}Siempre se puede comprobar</div>
        <p>Lo que la llave desarma se vuelve a armar con todos contra todos, como en el papel. Si sale el trinomio del principio, está bien. Al terminar cada reto aparece el botón «Comprobar: todos contra todos».</p>
      </div>`;
  }

  /* ---------- Raíces y factorización: dos caras de la misma moneda ----------
     La calculadora de GeoGebra va en un iframe a todo el ancho, que se
     carga cada vez que se abre esta sección (ver mostrar). La
     instrucción va pegada encima. Los trinomios para probar son los
     retos 1, 4 y 6 de la llave: dos raíces, una y ninguna. */
  const GEOGEBRA = 'https://www.geogebra.org/graphing?lang=es';
  const PRUEBAS = [
    { copia: 'x^2+5x+6', txt: 'x2 + 5x + 6', nota: `Choca contra el suelo en −3 y en −2: por eso ${mt(Pr('x + 3', 'x + 2'))}. Es el reto 1 de la llave.` },
    { copia: 'x^2-6x+9', txt: 'x2 - 6x + 9', nota: 'Apenas roza el suelo, en 3: adentro de la raíz da 0 y el paréntesis va dos veces. Reto 4.' },
    { copia: 'x^2+2x+5', txt: 'x2 + 2x + 5', nota: 'No llega al suelo: no tiene raíces y no se factoriza. Reto 6.' }
  ];
  function htmlMoneda() {
    return `
      <section class="tarjeta m3-moneda" aria-labelledby="m3-moneda-titulo">
        <h3 id="m3-moneda-titulo">Raíces y factorización: dos caras de la misma moneda</h3>
        <p>Si se factoriza, las raíces se encuentran fácil. Si se usa la fórmula cuadrática (la llave maestra) para encontrar las raíces, la factorización se arma fácil.</p>
        <div class="gg-moneda">
          <div class="gg-cara"><span class="etiqueta">Factorización</span>${mt(Pr('x + 3', 'x + 2'))}</div>
          <div class="gg-vias">
            <p class="gg-via">${icono('flechaD')}<span>Cada paréntesis igual a 0 da una raíz.</span></p>
            <p class="gg-via">${icono('flechaI')}<span>Cada raíz r da el paréntesis ${mt(C.par(`${vr('x')} ${menos} ${vr('r')}`))}.</span></p>
          </div>
          <div class="gg-cara"><span class="etiqueta">Raíces</span><span>${mt(vr('x'), igual, n(-3))} y ${mt(vr('x'), igual, n(-2))}</span></div>
        </div>
        <div class="gg-guia">
          <p class="gg-clave">Las raíces no son números mágicos: son exactamente los puntos donde la curva choca contra el suelo (el eje horizontal). Factorizar permite encontrar esos puntos de aterrizaje al instante.</p>
          <div>
            <h4>Para probar</h4>
            <ol class="gg-pruebas">
              ${PRUEBAS.map(p => `
                <li>
                  <span class="gg-prueba-cabeza">${mt(P(p.txt))}<button type="button" class="btn btn-fantasma btn-chico" data-copiar="${p.copia}" aria-label="Copiar ${p.copia}">${icono('copiar')}Copiar</button></span>
                  <span>${p.nota}</span>
                </li>`).join('')}
            </ol>
          </div>
        </div>
        <div class="gg-marco">
          <p class="gg-cargando">Cargando la calculadora gráfica de GeoGebra. Necesita internet.</p>
          <iframe class="gg-iframe" data-src="${GEOGEBRA}&embed" title="Calculadora gráfica de GeoGebra" loading="lazy" allowfullscreen></iframe>
        </div>
        <div class="gg-pie">
          <p class="texto-3">Copiar uno, pegarlo en «Entrada» (Ctrl + V) y mirar dónde corta la curva el eje horizontal. Al tocar uno de los puntos grises aparecen sus coordenadas, con punto decimal: −2.5 es −2,5. Si el teclado de la calculadora tapa la gráfica, se cierra con su equis.</p>
          <a class="btn btn-secundario btn-chico" href="${GEOGEBRA}" target="_blank" rel="noopener">${icono('externo')}Abrir la calculadora en otra pestaña</a>
        </div>
      </section>`;
  }

  function htmlPractica() {
    return `
      ${cabeza(5, 'Práctica integrada', 'Quince ejercicios en el orden del módulo: juntar, armar y las tres llaves; al final, tipo examen y retos. Antes de cada factorización hay que decir qué llave logra abrir el candado. El chequeo va en orden: ¿hay algo en todos los términos? ¿Son dos cuadrados con una resta? Si no, la llave maestra. Sin calculadora: con papel o con el borrador.')}
      <div class="m3-practica"></div>`;
  }

  const vista = {
    secciones: SECCIONES,
    progreso,
    raiz: null,
    montar(cont) {
      const raiz = crear('section', 'vista-modulo');
      raiz.innerHTML = `
        <header class="mod-cabeza">
          <div>
            <span class="etiqueta">Módulo 3 de 6</span>
            <h1>Factorización</h1>
            <p class="entrada">Armar y desarmar multiplicaciones: juntar términos, la distributiva, el factor común, la diferencia de cuadrados y una llave maestra para cualquier trinomio. Sirve para simplificar fórmulas y para resolver las ecuaciones de la física.</p>
          </div>
          <div class="mod-resumen" aria-label="Avance en el módulo">
            <div class="dato"><small>Ideas clave</small><b data-prog="ideas"></b></div>
            <div class="dato"><small>Herramientas</small><b data-prog="herramientas"></b></div>
            <div class="dato"><small>Práctica</small><b data-prog="practica"></b></div>
          </div>
        </header>
        <details class="plan-clase">
          <summary>${icono('chevD', 'chev')}${icono('reloj')}Plan de la clase de hoy<span class="texto-3">unos 80 min</span></summary>
          <ol class="agenda">${C.PLAN_CLASE.map(([min, txt]) => `<li><span class="min">${min}</span><span>${txt}</span></li>`).join('')}</ol>
        </details>
        <div class="pestanas" role="tablist" aria-label="Secciones del módulo">
          ${SECCIONES.map((s, i) => `<a class="pestana" role="tab" href="#m3-${s.id}" data-sec="${s.id}" aria-controls="m3-${s.id}"><span class="pt-num">${i + 1}</span><span class="pt-largo">${s.nombre}</span><span class="pt-corto">${s.corto}</span><span class="pt-ok"></span></a>`).join('')}
        </div>
        <section class="m1-seccion m3-seccion" id="m3-ideas" data-sec="ideas" role="tabpanel">${htmlIdeas()}</section>
        <section class="m1-seccion m3-seccion" id="m3-areas" data-sec="areas" role="tabpanel" hidden>${htmlAreas()}</section>
        <section class="m1-seccion m3-seccion" id="m3-cuadrados" data-sec="cuadrados" role="tabpanel" hidden>${htmlCuadrados()}</section>
        <section class="m1-seccion m3-seccion" id="m3-llave" data-sec="llave" role="tabpanel" hidden>${htmlLlave()}</section>
        <section class="m1-seccion m3-seccion" id="m3-practica" data-sec="practica" role="tabpanel" hidden>${htmlPractica()}</section>
        <nav class="pie-seccion" aria-label="Navegación entre secciones"></nav>`;
      cont.appendChild(raiz);
      this.raiz = raiz;

      this.presentacion = MA.Presentacion.crear($('.m3-presentacion', raiz), {
        diapositivas: MA.Clase3.DIAPOSITIVAS,
        partes: MA.Clase3.PARTES,
        clave: 'm3.diapositiva',
        alTerminarParte: id => MA.progreso.marcar('m3.ideas.' + id)
      });
      // Cada herramienta, con la sección donde vive y adónde lleva su último reto
      const MESAS = {
        areas: { seccion: 'areas', clase: '.m3-areas', crear: MA.Areas, final: { texto: 'Seguir con las ideas clave, parte 2', ir: () => { location.hash = '#m3-ideas-p2'; } } },
        cuadrados: { seccion: 'cuadrados', clase: '.m3-cuadrados', crear: MA.Cuadrados, final: { texto: 'Seguir con las ideas clave, parte 3', ir: () => { location.hash = '#m3-ideas-p3'; } } },
        llave: { seccion: 'llave', clase: '.m3-llave', crear: MA.Llave, final: { texto: 'Ir a la práctica', ir: () => { location.hash = '#m3-practica'; } } }
      };
      const irA = (mesa, alLlegar) => {
        location.hash = '#m3-' + MESAS[mesa].seccion;
        setTimeout(() => { $(MESAS[mesa].clase, raiz).scrollIntoView({ block: 'start' }); if (alLlegar) alLlegar(); }, 60);
      };
      const herramientas = {};
      herramientas.areas = MA.Areas.crear($('.m3-areas', raiz), { final: MESAS.areas.final });
      herramientas.cuadrados = MA.Cuadrados.crear($('.m3-cuadrados', raiz), { final: MESAS.cuadrados.final });
      herramientas.llave = MA.Llave.crear($('.m3-llave', raiz), { final: MESAS.llave.final });
      MA.Cuadrados.figura($('.m3-figura', raiz));
      // Del dibujo al papel: un ejemplo con un negativo, que el rectángulo no puede dibujar
      MA.Flechas.crear($('.m3-flechas', raiz), {
        alto: C.leer('x + 2'), ancho: C.leer('x - 3'),
        final: 'Son los cuatro pedazos del rectángulo, sin dibujar ningún lado.'
      });
      // Los trinomios para probar en GeoGebra se copian con un botón
      raiz.addEventListener('click', async e => {
        const b = e.target.closest('[data-copiar]');
        if (!b) return;
        const ok = await MA.copiarTexto(b.dataset.copiar);
        MA.aviso(ok ? `Copiado: ${b.dataset.copiar}. Ahora, a pegarlo en la calculadora.` : 'No se pudo copiar: hay que escribirlo a mano.', ok ? 'check' : 'alerta');
      });
      const practica = MA.Practica.crear($('.m3-practica', raiz), {
        datos: C,
        modulo: 'm3',
        teclado: 'text',
        ayudaCampo: 'Solo el número. Los negativos llevan el signo menos (−4); sirven la coma decimal (2,5) y las fracciones (1/2).',
        abrirHerramienta(ej, numero) {
          const h = ej.herramienta;
          herramientas[h.mesa].cargarProblema(h.problema, {
            etiqueta: `Ejercicio ${numero} de la práctica`,
            textoVolver: 'Volver a la práctica',
            textoFinal: `Volver al ejercicio ${numero}`,
            volver: () => { location.hash = '#m3-practica'; practica.irA(ej.id); }
          });
          irA(h.mesa);
        }
      });
      this.practica = practica;

      MA.bus.on('progreso', () => this.pintarProgreso());
      this.pintarProgreso();
    },
    pintarProgreso() {
      if (!this.raiz) return;
      const p = progreso();
      ['ideas', 'herramientas', 'practica'].forEach(k => { $(`[data-prog="${k}"]`, this.raiz).textContent = `${p[k][0]} de ${p[k][1]}`; });
      SECCIONES.forEach(s => {
        const [h, t] = p[s.id];
        $(`.pestana[data-sec="${s.id}"] .pt-ok`, this.raiz).innerHTML = h === t ? icono('check') : '';
      });
    },
    mostrar(seccion, extra) {
      const valida = id => SECCIONES.some(s => s.id === id);
      const guardada = MA.almacen.leer('m3.seccion', 'ideas');
      const sec = valida(seccion) ? seccion : valida(guardada) ? guardada : 'ideas';
      MA.almacen.guardar('m3.seccion', sec);
      if (sec !== 'ideas' && this.presentacion) this.presentacion.salir();
      $$('.m3-seccion', this.raiz).forEach(el => { el.hidden = el.dataset.sec !== sec; });
      $$('.pestana', this.raiz).forEach(a => a.setAttribute('aria-selected', String(a.dataset.sec === sec)));
      const i = SECCIONES.findIndex(s => s.id === sec);
      const ant = SECCIONES[i - 1], sig = SECCIONES[i + 1];
      $('.pie-seccion', this.raiz).innerHTML = `
        ${ant ? `<a class="btn btn-secundario" href="#m3-${ant.id}">${icono('flechaI')}${ant.nombre}</a>` : '<span></span>'}
        ${sig ? `<a class="btn" href="#m3-${sig.id}">Siguiente sección: ${sig.nombre.toLowerCase()}${icono('flechaD')}</a>` : `<a class="btn btn-secundario" href="#inicio">Volver al panel general${icono('flechaD')}</a>`}`;
      if (sec === 'ideas' && extra && this.presentacion) this.presentacion.irParte(extra);
      if (sec === 'practica' && this.practica) this.practica.anunciar();
      // GeoGebra pesa: se carga al abrir la llave, y el navegador espera a que esté cerca de la vista.
      // Se vuelve a cargar cada vez que se abre la sección: mientras está oculta mide 0 × 0 y se desordena.
      const gg = sec === 'llave' && $('.gg-iframe', this.raiz);
      if (gg) gg.setAttribute('src', gg.dataset.src);
      return sec;
    }
  };

  MA.vistasModulo.m3 = vista;
})();
