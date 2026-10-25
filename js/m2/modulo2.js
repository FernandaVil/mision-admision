/* =====================================================================
   MÓDULO 2 · página completa (clase 2)
   Secciones: 1) calentamiento (repaso del módulo 1), 2) ideas clave,
   3) fracciones, 4) operaciones (signos y orden), 5) potencias y
   notación científica, 6) práctica. La factorización (clase 3) se
   agrega después como otra sección.
   Rutas: #m2-calentamiento · #m2-ideas (-p1, -p2, -p3) · #m2-fracciones ·
          #m2-operaciones · #m2-potencias · #m2-practica
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, crear, icono } = MA;
  const { vr, un, n, op, fr, mt, q, tach } = MA.f;
  const por = op('·'), igual = op('='), entre = op('÷');

  const SECCIONES = [
    { id: 'calentamiento', nombre: 'Calentamiento', corto: 'Repaso', icono: 'objetivo' },
    { id: 'ideas', nombre: 'Ideas clave', corto: 'Ideas', icono: 'libro' },
    { id: 'fracciones', nombre: 'Fracciones', corto: 'Fracciones', icono: 'regla' },
    { id: 'operaciones', nombre: 'Signos y orden', corto: 'Signos', icono: 'objetivo' },
    { id: 'potencias', nombre: 'Potencias', corto: 'Potencias', icono: 'flechaD' },
    { id: 'practica', nombre: 'Práctica', corto: 'Práctica', icono: 'hoja' }
  ];

  function progreso() {
    const C = MA.M2;
    const cuenta = (pref, ids) => [MA.progreso.contar(pref, ids), ids.length];
    const res = {
      calentamiento: cuenta('m2.cal.', C.CALENTAMIENTO.map(x => x.id)),
      ideas: cuenta('m2.ideas.', MA.Clase2.PARTES.map(p => p.id)),
      fracciones: cuenta('m2.frac.', C.RETOS_FRACCIONES.map(x => x.id)),
      operaciones: cuenta('m2.op.', C.RETOS_OPERACIONES.map(x => x.id)),
      potencias: cuenta('m2.coma.', C.RETOS_COMA.map(x => x.id)),
      practica: cuenta('m2.prac.', C.EJERCICIOS.map(x => x.id))
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
      <span class="etiqueta">Paso ${paso} de 6</span>
      <h2>${titulo}</h2>
      <p class="entrada">${entrada}</p>
    </div>`;
  const sup = MA.M2.sup, pot = MA.M2.pot, p10 = MA.M2.p10, neg = MA.M2.neg, cien = MA.M2.cien;

  function htmlCalentamiento() {
    return `
      ${cabeza(1, 'Calentamiento: de cabeza y en papel', 'Cinco conversiones del módulo 1. Cada una se responde dos veces: primero de cabeza, rápido y sin escribir; después en papel, con factores. Al final se comparan las dos respuestas.')}
      <div class="m2-calentamiento"></div>
      <div class="caja caja-neutra">
        <div class="caja-titulo">${icono('info')}¿Para qué escribir si sale de cabeza?</div>
        <p>El cálculo mental sirve para estimar y para revisar: si en papel sale 5000 y de cabeza «más o menos miles», todo bien. Pero en el examen las trampas están justo donde la cabeza se salta un paso: el área (el factor va dos veces), el tiempo (va de 60 en 60) y las fracciones de unidades.</p>
      </div>`;
  }

  function htmlIdeas() {
    return `
      ${cabeza(2, 'Ideas clave', 'Tres partes cortas. Cada una va justo antes de su herramienta: la primera antes de las fracciones, la segunda antes de las operaciones con signos y la tercera antes de las potencias.')}
      <div class="m2-presentacion"></div>
      <section class="tarjeta m2-reglas" aria-labelledby="m2-reglas-titulo">
        <h3 id="m2-reglas-titulo">Resumen de reglas</h3>
        <p class="texto-2">Para tener a mano al practicar.</p>
        <div class="m2-reglas-grilla">
          <div>
            <h4>Fracciones</h4>
            <ul>
              <li>La raya es un ÷: ${mt(un('km/h'), igual, un('km'), entre, un('h'))}.</li>
              <li>Multiplicar: arriba con arriba, abajo con abajo. Conviene tachar antes.</li>
              <li>Dividir: se da vuelta la que divide y se multiplica. ${mt(n(6), entre, fr(n(1), n(2)), igual, n(6), por, fr(n(2), n(1)))}</li>
            </ul>
          </div>
          <div>
            <h4>Signos</h4>
            <ul>
              <li>Sumar y restar: pensar en plata. ${mt(n('−5'), op('+'), n(3), igual, n('−2'))}</li>
              <li>Restar un negativo es sumar: ${mt(op('−'), neg(-2), igual, op('+'), n(2))}.</li>
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
              <li>Al multiplicar, los exponentes se suman: ${mt(`${pot(vr('x'), 2)}`, por, `${pot(vr('x'), 3)}`, igual, `${pot(vr('x'), 5)}`)}.</li>
              <li>Al dividir, se restan: ${mt(fr(`${pot(vr('x'), 5)}`, `${pot(vr('x'), 2)}`), igual, `${pot(vr('x'), 3)}`)}.</li>
              <li>${mt(p10(-3), igual, fr(n(1), n(1000)), igual, n('0,001'))}</li>
            </ul>
          </div>
        </div>
      </section>`;
  }

  function htmlFracciones() {
    return `
      ${cabeza(3, 'Dividir entre una fracción', 'Una fracción es una división, y las unidades también son fracciones: km/h es km ÷ h. Por eso, cuando en una fórmula aparece una fracción dividiendo, hay que saber qué pasa con lo que está abajo.')}
      <ol class="pasos-concepto">
        <li><span class="pc-num">01</span><h3>Dar vuelta la que divide</h3><p>El ÷ se vuelve · y la fracción de la derecha se da vuelta: ${mt(n(6), entre, fr(n(1), n(2)), igual, n(6), por, fr(n(2), n(1)))}.</p></li>
        <li><span class="pc-num">02</span><h3>Tachar por parejas</h3><p>Un número de arriba y uno de abajo se dividen entre lo mismo; una unidad arriba y la misma abajo se cancelan.</p></li>
        <li><span class="pc-num">03</span><h3>Multiplicar lo que queda</h3><p>Arriba con arriba y abajo con abajo. La unidad que queda dice si la cuenta tiene sentido.</p></li>
      </ol>
      <div class="m2-fracciones"></div>
      <div class="caja">
        <div class="caja-titulo">${icono('pista')}Lo que está abajo del abajo, sube</div>
        <p>${mt(un('km'), entre, fr(un('km'), un('h')), igual, tach(un('km')), por, fr(un('h'), tach(un('km'))), igual, un('h'))}. La h dividía a algo que dividía: dos divisiones se cancelan y la h termina arriba. Por eso ${mt(vr('t'), igual, vr('d'), entre, vr('v'))} da horas.</p>
      </div>
      <div class="caja caja-neutra">
        <div class="caja-titulo">${icono('info')}Cuando lo que divide no es fracción</div>
        <p>${mt(un('m/s'), entre, un('s'))}: la s que divide es como ${mt(fr(un('s'), n(1)))}. Al darla vuelta queda abajo, junto a la otra s: ${mt(fr(un('m'), `${un('s')} ${por} ${un('s')}`), igual, un('m/s²'))}. Así nace la unidad de la aceleración.</p>
      </div>`;
  }

  function htmlOperaciones() {
    return `
      ${cabeza(4, 'Signos y orden de las operaciones', 'Casi todos los errores de signo en el examen vienen de dos cosas: restar un negativo y hacer las operaciones en otro orden. Aquí se practican las dos, eligiendo antes qué operación va primero.')}
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
        <p class="m1-orden"><b>Ojo con el paréntesis:</b> ${mt(`${pot(neg(-3), 2)}`, igual, n(9))}, pero ${mt(`${pot(n('−3'), 2)}`, igual, n('−9'))}: sin paréntesis, el cuadrado es solo del 3.</p>
      </div>
      <div class="m2-operaciones"></div>
      <div class="caja caja-ojo">
        <div class="caja-titulo">${icono('pista')}La trampa de izquierda a derecha</div>
        <p>${mt(n(8), entre, n(4), por, n(2), igual, n(4))}, no 1. Multiplicar no va antes que dividir: tienen el mismo rango y se hacen en el orden en que aparecen. Lo mismo pasa con sumar y restar: ${mt(n(10), op('−'), n(3), op('+'), n(2), igual, n(9))}, no 5.</p>
      </div>`;
  }

  function htmlPotencias() {
    return `
      ${cabeza(5, 'Potencias y notación científica', 'Un exponente cuenta cuántas veces se multiplica la base. Con potencias de 10 se escriben números muy grandes o muy pequeños, y las cuentas del examen se hacen sin calculadora.')}
      <div class="tarjeta m1-contrarias">
        <h3>Reglas de los exponentes (no hay que memorizarlas: basta con contar)</h3>
        <div class="tabla-envoltura">
          <table class="tabla">
            <thead><tr><th scope="col">Regla</th><th scope="col">Por qué</th><th scope="col">Ejemplo</th></tr></thead>
            <tbody>
              <tr><td>al multiplicar, se suman</td><td>se juntan todas las x</td><td>${mt(`${pot(vr('x'), 2)}`, por, `${pot(vr('x'), 3)}`, igual, `${pot(vr('x'), 5)}`)}</td></tr>
              <tr><td>al dividir, se restan</td><td>se tachan por parejas</td><td>${mt(fr(`${pot(vr('x'), 5)}`, `${pot(vr('x'), 2)}`), igual, `${pot(vr('x'), 3)}`)}</td></tr>
              <tr><td>potencia de potencia, se multiplican</td><td>el grupo se repite</td><td>${mt(`${op('(')}${pot(vr('x'), 2)}${pot(op(')'), 3)}`, igual, `${pot(vr('x'), 6)}`)}</td></tr>
              <tr><td>exponente negativo</td><td>«uno dividido entre»</td><td>${mt(p10(-3), igual, fr(n(1), p10(3)), igual, n('0,001'))}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="m2-coma"></div>
      <div class="caja caja-ojo">
        <div class="caja-titulo">${icono('pista')}Truco para el examen, sin calculadora</div>
        <p>Números con números y potencias con potencias: ${mt(op('('), cien(3, 4), op(')'), por, op('('), cien(2, -6), op(')'), igual, cien(6, -2))}. Si el número queda en 10 o más, se corre la coma y el exponente compensa: ${mt(n(12), op('×'), p10(-2), igual, cien(1.2, -1))}.</p>
      </div>`;
  }

  function htmlPractica() {
    return `
      ${cabeza(6, 'Práctica progresiva', 'Dieciséis ejercicios, del más sencillo al más parecido al examen; los dos últimos son retos. Sin calculadora: con papel o con el borrador. Ante una duda, primero una pista; la solución completa es el último recurso.')}
      <div class="m2-practica"></div>`;
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
            <p class="entrada">Fracciones, signos, orden de las operaciones y potencias: las cuentas que aparecen dentro de cada fórmula del examen. La factorización viene en la próxima clase.</p>
          </div>
          <div class="mod-resumen" aria-label="Avance en el módulo">
            <div class="dato"><small>Calentamiento</small><b data-prog="calentamiento"></b></div>
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
        <section class="m1-seccion m2-seccion" id="m2-calentamiento" data-sec="calentamiento" role="tabpanel">${htmlCalentamiento()}</section>
        <section class="m1-seccion m2-seccion" id="m2-ideas" data-sec="ideas" role="tabpanel" hidden>${htmlIdeas()}</section>
        <section class="m1-seccion m2-seccion" id="m2-fracciones" data-sec="fracciones" role="tabpanel" hidden>${htmlFracciones()}</section>
        <section class="m1-seccion m2-seccion" id="m2-operaciones" data-sec="operaciones" role="tabpanel" hidden>${htmlOperaciones()}</section>
        <section class="m1-seccion m2-seccion" id="m2-potencias" data-sec="potencias" role="tabpanel" hidden>${htmlPotencias()}</section>
        <section class="m1-seccion m2-seccion" id="m2-practica" data-sec="practica" role="tabpanel" hidden>${htmlPractica()}</section>
        <nav class="pie-seccion" aria-label="Navegación entre secciones"></nav>`;
      cont.appendChild(raiz);
      this.raiz = raiz;

      MA.Calentamiento.crear($('.m2-calentamiento', raiz));
      this.presentacion = MA.Presentacion.crear($('.m2-presentacion', raiz), {
        diapositivas: MA.Clase2.DIAPOSITIVAS,
        partes: MA.Clase2.PARTES,
        clave: 'm2.diapositiva',
        alTerminarParte: id => MA.progreso.marcar('m2.ideas.' + id)
      });
      const herramientas = {
        fracciones: MA.Fracciones.crear($('.m2-fracciones', raiz)),
        operaciones: MA.Operaciones.crear($('.m2-operaciones', raiz)),
        potencias: MA.Coma.crear($('.m2-coma', raiz))
      };
      const clases = { fracciones: '.m2-fracciones', operaciones: '.m2-operaciones', potencias: '.m2-coma' };
      const practica = MA.Practica.crear($('.m2-practica', raiz), {
        datos: C,
        modulo: 'm2',
        teclado: 'text',
        ayudaCampo: 'Solo el número. Los negativos llevan el signo menos (−4); sirven la coma decimal (2,5) y las fracciones (3/2).',
        abrirHerramienta(ej, numero) {
          const h = ej.herramienta;
          const origen = { numero, volver: () => { location.hash = '#m2-practica'; practica.irA(ej.id); } };
          const problema = h.seccion === 'operaciones' ? { expr: h.expr } : h.problema;
          if (problema) herramientas[h.seccion].cargarProblema(problema, origen);
          location.hash = '#m2-' + h.seccion;
          setTimeout(() => $(clases[h.seccion], raiz).scrollIntoView({ block: 'start' }), 60);
        }
      });
      this.practica = practica;

      MA.bus.on('progreso', () => this.pintarProgreso());
      this.pintarProgreso();
    },
    pintarProgreso() {
      if (!this.raiz) return;
      const p = progreso();
      ['calentamiento', 'ideas', 'herramientas', 'practica'].forEach(k => { $(`[data-prog="${k}"]`, this.raiz).textContent = `${p[k][0]} de ${p[k][1]}`; });
      SECCIONES.forEach(s => {
        const [h, t] = p[s.id];
        $(`.pestana[data-sec="${s.id}"] .pt-ok`, this.raiz).innerHTML = h === t ? icono('check') : '';
      });
    },
    mostrar(seccion, extra) {
      const sec = SECCIONES.some(s => s.id === seccion) ? seccion : (MA.almacen.leer('m2.seccion', 'calentamiento') || 'calentamiento');
      MA.almacen.guardar('m2.seccion', sec);
      if (sec !== 'ideas' && this.presentacion) this.presentacion.salir();
      $$('.m2-seccion', this.raiz).forEach(el => { el.hidden = el.dataset.sec !== sec; });
      $$('.pestana', this.raiz).forEach(a => a.setAttribute('aria-selected', String(a.dataset.sec === sec)));
      const i = SECCIONES.findIndex(s => s.id === sec);
      const ant = SECCIONES[i - 1], sig = SECCIONES[i + 1];
      $('.pie-seccion', this.raiz).innerHTML = `
        ${ant ? `<a class="btn btn-secundario" href="#m2-${ant.id}">${icono('flechaI')}${ant.nombre}</a>` : '<span></span>'}
        ${sig ? `<a class="btn" href="#m2-${sig.id}">Siguiente: ${sig.nombre.toLowerCase()}${icono('flechaD')}</a>` : `<a class="btn btn-secundario" href="#inicio">Volver al panel general${icono('flechaD')}</a>`}`;
      if (sec === 'ideas' && extra && this.presentacion) this.presentacion.irParte(extra);
      if (sec === 'practica' && this.practica) this.practica.anunciar();
      return sec;
    }
  };

  MA.vistasModulo.m2 = vista;
})();
