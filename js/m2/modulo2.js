/* =====================================================================
   MÓDULO 2 · página completa (álgebra básica)
   Secciones: 1) ideas clave, 2) fracciones (sumar y restar; multiplicar
   y dividir), 3) signos y orden, 4) potencias con letras, 5) práctica,
   6) radar de signos (práctica extra).
   La factorización es el módulo 3; la notación científica, el módulo 5.
   Rutas: #m2-ideas (-p1, -p2, -p3) · #m2-fracciones · #m2-operaciones ·
          #m2-potencias · #m2-practica · #m2-radar
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, crear, icono } = MA;
  const { vr, un, n, op, fr, mt, tach, doble, ext, med, pega } = MA.f;
  const por = op('·'), igual = op('='), entre = op('÷'), mas = op('+'), menos = op('−');
  const { pot, neg } = MA.M2;
  const prod = (...xs) => xs.join(` ${por} `);
  // 6 ÷ 1/2 con extremos y medios, de colores
  const seisSandwich = () => doble(fr(ext(n(6)), med(n(1))), fr(med(n(1)), ext(n(2))));
  const seisResultado = () => fr(`${ext(n(6))} ${por} ${ext(n(2))}`, `${med(n(1))} ${por} ${med(n(1))}`);
  // 1/2 + 1/3 con la mariposa, de colores: azul va arriba, ámbar va abajo
  const mariposa = () => fr(`${ext(prod(n(1), n(3)))} ${mas} ${ext(prod(n(2), n(1)))}`, med(prod(n(2), n(3))));
  const xs = k => Array.from({ length: k }, () => vr('x')).join(` ${por} `);

  const SECCIONES = [
    { id: 'ideas', nombre: 'Ideas clave', corto: 'Ideas', icono: 'libro' },
    { id: 'fracciones', nombre: 'Fracciones', corto: 'Fracciones', icono: 'regla' },
    { id: 'operaciones', nombre: 'Signos y orden', corto: 'Signos', icono: 'objetivo' },
    { id: 'potencias', nombre: 'Potencias', corto: 'Potencias', icono: 'flechaD' },
    { id: 'practica', nombre: 'Práctica', corto: 'Práctica', icono: 'hoja' },
    { id: 'radar', nombre: 'Radar de signos', corto: 'Radar', icono: 'radar' }
  ];

  function progreso() {
    const C = MA.M2;
    const cuenta = (pref, ids) => [MA.progreso.contar(pref, ids), ids.length];
    const res = {
      ideas: cuenta('m2.ideas.', MA.Clase2.PARTES.map(p => p.id)),
      fracciones: cuenta('m2.frac.', [...C.RETOS_SUMAS, ...C.RETOS_FRACCIONES].map(x => x.id)),
      operaciones: cuenta('m2.op.', C.RETOS_OPERACIONES.map(x => x.id)),
      potencias: cuenta('m2.pot.', C.RETOS_EXPONENTES.map(x => x.id)),
      practica: cuenta('m2.prac.', C.EJERCICIOS.map(x => x.id)),
      radar: cuenta('m2.radar.', C.RADAR.map(x => x.id))
    };
    const todos = SECCIONES.map(s => res[s.id]);
    res.hechos = todos.reduce((s, x) => s + x[0], 0);
    res.total = todos.reduce((s, x) => s + x[1], 0);
    res.pct = res.total ? res.hechos / res.total : 0;
    res.herramientas = [res.fracciones[0] + res.operaciones[0] + res.potencias[0], res.fracciones[1] + res.operaciones[1] + res.potencias[1]];
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
      ${cabeza(1, 'Ideas clave', 'Tres partes cortas. Cada una va justo antes de su herramienta: la primera antes de las fracciones, la segunda antes de los signos y la tercera antes de las potencias.')}
      <div class="m2-presentacion"></div>
      <section class="tarjeta m2-reglas" aria-labelledby="m2-reglas-titulo">
        <h3 id="m2-reglas-titulo">Resumen de reglas</h3>
        <p class="texto-2">Para tener a mano al practicar.</p>
        <div class="m2-reglas-grilla">
          <div>
            <h4>Fracciones</h4>
            <ul>
              <li>La raya es un ÷: ${mt(un('km/h'), igual, un('km'), entre, un('h'))}.</li>
              <li>Sumar y restar con el mismo abajo: se suman los de arriba. ${mt(fr(n(1), n(5)), mas, fr(n(2), n(5)), igual, fr(n(3), n(5)))}</li>
              <li>Con distinto abajo, la mariposa: en cruz arriba, abajo con abajo. ${mt(fr(n(1), n(2)), mas, fr(n(1), n(3)), igual, mariposa(), igual, fr(n(5), n(6)))}</li>
              <li>Multiplicar: arriba con arriba, abajo con abajo. Conviene tachar antes.</li>
              <li>Dividir: una encima de la otra; <span class="ext">extremos</span> arriba, <span class="med">medios</span> abajo. ${mt(seisSandwich(), igual, seisResultado(), igual, n(12))}</li>
            </ul>
          </div>
          <div>
            <h4>Signos</h4>
            <ul>
              <li>Sumar y restar: pensar en plata. ${mt(n('−5'), mas, n(3), igual, n('−2'))}</li>
              <li>Restar un negativo es sumar: ${mt(menos, neg(-2), igual, mas, n(2))}.</li>
              <li>Multiplicar y dividir: iguales dan +, distintos dan −.</li>
            </ul>
          </div>
          <div>
            <h4>Orden</h4>
            <ol>
              <li>Paréntesis.</li>
              <li>Potencias y raíces.</li>
              <li>Multiplicar y dividir, de izquierda a derecha.</li>
              <li>Sumar y restar, de izquierda a derecha.</li>
            </ol>
          </div>
          <div>
            <h4>Potencias</h4>
            <ul>
              <li>Un exponente cuenta: ${mt(pot(vr('x'), 3), igual, xs(3))}.</li>
              <li>Al multiplicar, los exponentes se suman: ${mt(pot(vr('x'), 2), por, pot(vr('x'), 3), igual, pot(vr('x'), 5))}.</li>
              <li>Al dividir, se restan: ${mt(fr(pot(vr('x'), 5), pot(vr('x'), 2)), igual, pot(vr('x'), 3))}.</li>
              <li>Números con números, letras con letras: ${mt(pega(n(3), pot(vr('x'), 2)), por, pega(n(2), pot(vr('x'), 3)), igual, pega(n(6), pot(vr('x'), 5)))}.</li>
            </ul>
          </div>
        </div>
      </section>`;
  }

  function htmlFracciones() {
    return `
      ${cabeza(2, 'Fracciones: las cuatro operaciones', 'Una fracción es una división, y las unidades también son fracciones: km/h es km ÷ h. Primero sumar y restar; después multiplicar y dividir, también con unidades.')}
      <h3 class="m2-bloque-titulo">Sumar y restar</h3>
      <ol class="pasos-concepto">
        <li><span class="pc-num">01</span><h3>Mismo abajo</h3><p>Son pedazos del mismo tamaño: se suman (o restan) los de arriba y abajo queda igual.</p><div class="mt mt-bloque">${fr(n(1), n(5))} ${mas} ${fr(n(2), n(5))} ${igual} ${fr(n(3), n(5))}</div></li>
        <li><span class="pc-num">02</span><h3>Distinto abajo: la mariposa</h3><p>En cruz <span class="ext">arriba</span> y abajo con <span class="med">abajo</span>:</p><div class="mt mt-bloque">${fr(n(1), n(2))} ${mas} ${fr(n(1), n(3))} ${igual} ${mariposa()} ${igual} ${fr(n(5), n(6))}</div></li>
        <li><span class="pc-num">03</span><h3>Simplificar</h3><p>Si arriba y abajo se pueden dividir entre el mismo número, se dividen, hasta que ya no se pueda.</p><div class="mt mt-bloque">${fr(n(4), n(8))} ${igual} ${fr(n(2), n(4))} ${igual} ${fr(n(1), n(2))}</div></li>
      </ol>
      <div class="m2-sumas"></div>
      <div class="caja caja-ojo">
        <div class="caja-titulo">${icono('pista')}El error más común: sumar arriba con arriba y abajo con abajo</div>
        <p>${mt(fr(n(1), n(2)), mas, fr(n(1), n(3)))} no es ${mt(fr(n(2), n(5)))}. Medio más un tercio no puede dar menos que medio: ${mt(fr(n(2), n(5)))} es menos que ${mt(fr(n(1), n(2)))}. Antes de seguir, conviene preguntarse si el resultado tiene sentido.</p>
      </div>

      <h3 class="m2-bloque-titulo">Multiplicar y dividir</h3>
      <ol class="pasos-concepto">
        <li><span class="pc-num">01</span><h3>Multiplicar</h3><p>Arriba con arriba y abajo con abajo. Antes de multiplicar, conviene tachar.</p><div class="mt mt-bloque">${fr(n(2), n(3))} ${por} ${fr(n(9), n(4))} ${igual} ${fr(prod(n(2), n(9)), prod(n(3), n(4)))} ${igual} ${fr(n(3), n(2))}</div></li>
        <li><span class="pc-num">02</span><h3>Dividir: una encima de la otra</h3><p>La raya también es un ÷. Lo que no es fracción lleva un 1 abajo: ${mt(n(6), igual, fr(n(6), n(1)))}.</p><div class="mt mt-bloque">${n(6)} ${entre} ${fr(n(1), n(2))} ${igual} ${seisSandwich()}</div></li>
        <li><span class="pc-num">03</span><h3>Extremos arriba, medios abajo</h3><p>Los <span class="ext">extremos</span> (las dos puntas) se multiplican arriba; los <span class="med">medios</span> (los dos pegados a la raya grande), abajo:</p><div class="mt mt-bloque">${seisResultado()} ${igual} ${n(12)}</div></li>
      </ol>
      <div class="m2-fracciones"></div>
      <div class="caja">
        <div class="caja-titulo">${icono('pista')}Lo que está abajo del abajo, sube</div>
        <div class="mt mt-bloque">${un('km')} ${entre} ${fr(un('km'), un('h'))} ${igual} ${doble(fr(ext(un('km')), med(n(1))), fr(med(un('km')), ext(un('h'))))} ${igual} ${fr(`${tach(un('km'))} ${por} ${ext(un('h'))}`, `${med(n(1))} ${por} ${tach(un('km'))}`)} ${igual} ${un('h')}</div>
        <p>La h estaba abajo del abajo: es un extremo y termina arriba. Por eso ${mt(vr('t'), igual, vr('d'), entre, vr('v'))} da horas.</p>
      </div>
      <div class="caja caja-neutra">
        <div class="caja-titulo">${icono('info')}Cuando lo que divide no es fracción</div>
        <p>${mt(un('m/s'), entre, un('s'))}: la s que divide lleva un 1 abajo.</p>
        <div class="mt mt-bloque">${doble(fr(ext(un('m')), med(un('s'))), fr(med(un('s')), ext(n(1))))} ${igual} ${fr(`${ext(un('m'))} ${por} ${ext(n(1))}`, `${med(un('s'))} ${por} ${med(un('s'))}`)} ${igual} ${un('m/s²')}</div>
        <p>Las dos s son medios: las dos quedan abajo. Así nace la unidad de la aceleración.</p>
      </div>
      <div class="caja caja-neutra">
        <div class="caja-titulo">${icono('info')}¿Y «multiplicar por el inverso»?</div>
        <p>Es la misma regla dicha de otra forma: ${mt(n(6), entre, fr(n(1), n(2)), igual, n(6), por, fr(n(2), n(1)), igual, n(12))}. Si un video o la IA lo explican así, el resultado es el mismo.</p>
      </div>`;
  }

  function htmlOperaciones() {
    return `
      ${cabeza(3, 'Signos y orden de las operaciones', 'Casi todos los errores de signo en el examen vienen de dos cosas: restar un negativo y hacer las operaciones en otro orden. Aquí se practican las dos, eligiendo antes qué operación va primero.')}
      <div class="tarjeta m1-contrarias">
        <h3>Signos al multiplicar y dividir</h3>
        <div class="tabla-envoltura">
          <table class="tabla">
            <thead><tr><th scope="col">Signos</th><th scope="col">Resultado</th><th scope="col">Ejemplos</th></tr></thead>
            <tbody>
              <tr><td>iguales</td><td><b>+</b></td><td>${mt(neg(-3), por, neg(-4), igual, n(12))} · ${mt(neg(-12), entre, neg(-3), igual, n(4))}</td></tr>
              <tr><td>distintos</td><td><b>−</b></td><td>${mt(neg(-3), por, n(4), igual, n('−12'))} · ${mt(n(12), entre, neg(-3), igual, n('−4'))}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="m1-orden"><b>Ojo con el paréntesis:</b> ${mt(pot(neg(-3), 2), igual, n(9))}, pero ${mt(pot(n('−3'), 2), igual, n('−9'))}: sin paréntesis, el cuadrado es solo del 3.</p>
      </div>
      <div class="m2-operaciones"></div>
      <div class="caja caja-ojo">
        <div class="caja-titulo">${icono('pista')}La trampa de izquierda a derecha</div>
        <p>${mt(n(8), entre, n(4), por, n(2), igual, n(4))}, no 1. Multiplicar no va antes que dividir: tienen el mismo rango y se hacen en el orden en que aparecen. Lo mismo pasa con sumar y restar: ${mt(n(10), menos, n(3), mas, n(2), igual, n(9))}, no 5.</p>
      </div>`;
  }

  function htmlPotencias() {
    return `
      ${cabeza(4, 'Potencias con letras', 'Un exponente cuenta cuántas veces se multiplica la letra. Con eso alcanza para simplificar las fórmulas: no hay reglas que memorizar, basta con contar.')}
      <ol class="pasos-concepto">
        <li><span class="pc-num">01</span><h3>Contar</h3><p>${mt(pot(vr('x'), 3))} es ${vr('x')} escrita tres veces. Una letra sola está una vez: ${mt(vr('a'), igual, pot(vr('a'), 1))}.</p><div class="mt mt-bloque">${pot(vr('x'), 3)} ${igual} ${xs(3)}</div></li>
        <li><span class="pc-num">02</span><h3>Multiplicar: se suman</h3><p>Se juntan todas las letras y se cuentan.</p><div class="mt mt-bloque">${pot(vr('x'), 2)} ${por} ${pot(vr('x'), 3)} ${igual} ${op('(')}${xs(2)}${op(')')} ${por} ${op('(')}${xs(3)}${op(')')} ${igual} ${pot(vr('x'), 5)}</div></li>
        <li><span class="pc-num">03</span><h3>Dividir: se restan</h3><p>Una letra de arriba y la misma de abajo se tachan, igual que las unidades.</p><div class="mt mt-bloque">${fr(pot(vr('x'), 5), pot(vr('x'), 2))} ${igual} ${fr(`${tach(vr('x'))} ${por} ${tach(vr('x'))} ${por} ${xs(3)}`, `${tach(vr('x'))} ${por} ${tach(vr('x'))}`)} ${igual} ${pot(vr('x'), 3)}</div></li>
      </ol>
      <div class="m2-exponentes"></div>
      <div class="caja">
        <div class="caja-titulo">${icono('pista')}En las fórmulas: números con números, letras con letras</div>
        <div class="mt mt-bloque">${fr(pega(n(6), pot(vr('x'), 5)), pega(n(2), pot(vr('x'), 2)))} ${igual} ${pega(n(3), pot(vr('x'), 3))} <span class="m2-separa"></span> ${fr(prod(vr('m'), pot(vr('v'), 2)), vr('v'))} ${igual} ${prod(vr('m'), vr('v'))}</div>
        <p>Los números se dividen (6 ÷ 2 = 3) y cada letra se tacha solo con la misma letra. Así se simplifican las fórmulas de física antes de reemplazar los valores.</p>
      </div>
      <div class="caja caja-ojo">
        <div class="caja-titulo">${icono('pista')}Ojo: el exponente no multiplica</div>
        <p>${mt(pot(n(2), 3), igual, prod(n(2), n(2), n(2)), igual, n(8))}, no 6. Y ${mt(pot(vr('x'), 2), por, pot(vr('x'), 3))} es ${mt(pot(vr('x'), 5))}, no ${mt(pot(vr('x'), 6))}: los exponentes se suman al multiplicar.</p>
      </div>`;
  }

  function htmlPractica() {
    return `
      ${cabeza(5, 'Práctica progresiva', 'Quince ejercicios de fracciones, signos y potencias, del más sencillo al más parecido al examen; los dos últimos son retos. Sin calculadora: con papel o con el borrador. Ante una duda, primero una pista; la solución completa es el último recurso.')}
      <div class="m2-practica"></div>`;
  }

  function htmlRadar() {
    return `
      ${cabeza(6, 'Práctica focalizada: el radar de signos', 'Un error muy común es usar «menos y menos da más» en una resta como −2 − 4. Esa regla es para multiplicar y dividir. Primero, un recordatorio corto; después, diez cuentas de cabeza para entrenar el ojo.')}
      <section class="tarjeta rd-recordatorio" aria-labelledby="rd-recordatorio-titulo">
        <h3 id="rd-recordatorio-titulo">Antes de calcular: ¿se multiplican o se suman?</h3>
        <div class="rd-situaciones">
          <div class="rd-situacion rd-sit-a">
            <span class="rd-letra">Situación A</span>
            <h4>Se multiplican, se dividen o hay signos pegados</h4>
            <p><b>Aquí sí</b> aplica la regla: signos iguales dan +; signos distintos dan −.</p>
            <ul class="rd-ejemplos">
              <li>${mt(n(-3), por, neg(-2), igual, n(6))}<span>iguales: +</span></li>
              <li>${mt(n(-8), entre, n(2), igual, n(-4))}<span>distintos: −</span></li>
              <li>${mt(n(2), menos, neg(-2), igual, n(2), mas, n(2), igual, n(4))}<span>pegados: − y − dan +</span></li>
            </ul>
          </div>
          <div class="rd-situacion rd-sit-b">
            <span class="rd-letra">Situación B</span>
            <h4>Se suman o se restan números separados</h4>
            <p><b>Aquí no</b> aplica la regla: se piensa en plata. Los positivos son plata en el bolsillo; los negativos, deudas.</p>
            <ul class="rd-ejemplos">
              <li>${mt(n(-2), menos, n(4), igual, n(-6))}<span>«Debo 2 y me endeudo con 4 más: ahora debo 6».</span></li>
              <li>${mt(n(-5), mas, n(3), igual, n(-2))}<span>«Debo 5 y pago 3: todavía debo 2».</span></li>
            </ul>
          </div>
        </div>
        <p class="rd-trampa">${icono('alerta')}<span><b>La trampa:</b> ${mt(n(-2), menos, n(4))} no da +6. Ahí no hay nada que multiplicar: son dos deudas que se juntan.</span></p>
      </section>
      <div class="m2-radar"></div>`;
  }

  const vista = {
    secciones: SECCIONES,
    progreso,
    raiz: null,
    montar(cont) {
      const C = MA.M2;
      const raiz = crear('section', 'vista-modulo');
      raiz.innerHTML = `
        <header class="mod-cabeza">
          <div>
            <span class="etiqueta">Módulo 2 de 6</span>
            <h1>Álgebra básica</h1>
            <p class="entrada">Fracciones, signos, orden de las operaciones y potencias con letras: las cuentas que aparecen dentro de cada fórmula del examen. La factorización viene en el módulo 3.</p>
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
          ${SECCIONES.map((s, i) => `<a class="pestana" role="tab" href="#m2-${s.id}" data-sec="${s.id}" aria-controls="m2-${s.id}"><span class="pt-num">${i + 1}</span><span class="pt-largo">${s.nombre}</span><span class="pt-corto">${s.corto}</span><span class="pt-ok"></span></a>`).join('')}
        </div>
        <section class="m1-seccion m2-seccion" id="m2-ideas" data-sec="ideas" role="tabpanel">${htmlIdeas()}</section>
        <section class="m1-seccion m2-seccion" id="m2-fracciones" data-sec="fracciones" role="tabpanel" hidden>${htmlFracciones()}</section>
        <section class="m1-seccion m2-seccion" id="m2-operaciones" data-sec="operaciones" role="tabpanel" hidden>${htmlOperaciones()}</section>
        <section class="m1-seccion m2-seccion" id="m2-potencias" data-sec="potencias" role="tabpanel" hidden>${htmlPotencias()}</section>
        <section class="m1-seccion m2-seccion" id="m2-practica" data-sec="practica" role="tabpanel" hidden>${htmlPractica()}</section>
        <section class="m1-seccion m2-seccion" id="m2-radar" data-sec="radar" role="tabpanel" hidden>${htmlRadar()}</section>
        <nav class="pie-seccion" aria-label="Navegación entre secciones"></nav>`;
      cont.appendChild(raiz);
      this.raiz = raiz;

      this.presentacion = MA.Presentacion.crear($('.m2-presentacion', raiz), {
        diapositivas: MA.Clase2.DIAPOSITIVAS,
        partes: MA.Clase2.PARTES,
        clave: 'm2.diapositiva',
        alTerminarParte: id => MA.progreso.marcar('m2.ideas.' + id)
      });
      const desplazar = sel => $(sel, raiz).scrollIntoView({ behavior: MA.movimientoReducido() ? 'auto' : 'smooth', block: 'start' });
      // Cada mesa, con la sección donde vive y adónde lleva su último reto
      const MESAS = {
        sumas: { seccion: 'fracciones', clase: '.m2-sumas', crear: MA.Sumas, final: { texto: 'Seguir con multiplicar y dividir', ir: () => desplazar('.m2-fracciones') } },
        fracciones: { seccion: 'fracciones', clase: '.m2-fracciones', crear: MA.Fracciones, final: { texto: 'Seguir con las ideas clave, parte 2', ir: () => { location.hash = '#m2-ideas-p2'; } } },
        operaciones: { seccion: 'operaciones', clase: '.m2-operaciones', crear: MA.Operaciones, final: { texto: 'Seguir con las ideas clave, parte 3', ir: () => { location.hash = '#m2-ideas-p3'; } } },
        exponentes: { seccion: 'potencias', clase: '.m2-exponentes', crear: MA.Exponentes, final: { texto: 'Ir a la práctica', ir: () => { location.hash = '#m2-practica'; } } }
      };
      const herramientas = {};
      Object.keys(MESAS).forEach(k => { herramientas[k] = MESAS[k].crear.crear($(MESAS[k].clase, raiz), { final: MESAS[k].final }); });
      const practica = MA.Practica.crear($('.m2-practica', raiz), {
        datos: C,
        modulo: 'm2',
        teclado: 'text',
        ayudaCampo: 'Solo el número. Los negativos llevan el signo menos (−4); sirven la coma decimal (2,5) y las fracciones (3/2).',
        abrirHerramienta(ej, numero) {
          const h = ej.herramienta, mesa = MESAS[h.mesa];
          const origen = { numero, volver: () => { location.hash = '#m2-practica'; practica.irA(ej.id); } };
          const problema = h.mesa === 'operaciones' ? { expr: h.expr } : h.problema;
          if (problema) herramientas[h.mesa].cargarProblema(problema, origen);
          location.hash = '#m2-' + mesa.seccion;
          setTimeout(() => $(mesa.clase, raiz).scrollIntoView({ block: 'start' }), 60);
        }
      });
      this.practica = practica;
      MA.Radar.crear($('.m2-radar', raiz));

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
      const guardada = MA.almacen.leer('m2.seccion', 'ideas');
      const sec = valida(seccion) ? seccion : valida(guardada) ? guardada : 'ideas';
      MA.almacen.guardar('m2.seccion', sec);
      if (sec !== 'ideas' && this.presentacion) this.presentacion.salir();
      $$('.m2-seccion', this.raiz).forEach(el => { el.hidden = el.dataset.sec !== sec; });
      $$('.pestana', this.raiz).forEach(a => a.setAttribute('aria-selected', String(a.dataset.sec === sec)));
      const i = SECCIONES.findIndex(s => s.id === sec);
      const ant = SECCIONES[i - 1], sig = SECCIONES[i + 1];
      $('.pie-seccion', this.raiz).innerHTML = `
        ${ant ? `<a class="btn btn-secundario" href="#m2-${ant.id}">${icono('flechaI')}${ant.nombre}</a>` : '<span></span>'}
        ${sig ? `<a class="btn" href="#m2-${sig.id}">Siguiente sección: ${sig.nombre.toLowerCase()}${icono('flechaD')}</a>` : `<a class="btn btn-secundario" href="#inicio">Volver al panel general${icono('flechaD')}</a>`}`;
      if (sec === 'ideas' && extra && this.presentacion) this.presentacion.irParte(extra);
      if (sec === 'practica' && this.practica) this.practica.anunciar();
      return sec;
    }
  };

  MA.vistasModulo.m2 = vista;
})();
