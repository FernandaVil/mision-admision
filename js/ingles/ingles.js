/* =====================================================================
   Inglés · página completa (práctica por cuenta propia)
   Una sola sección: un repaso rápido plegable y los cuatro quizzes, en
   el motor de práctica de siempre. No tiene clase ni guion: es para
   practicar solo, unos 15 minutos por quiz.
   Ruta: #ingles (o #ingles-quizzes)
   Va en el catálogo con el número 08, después de los siete módulos: el
   número solo se ve en la barra lateral y en el título de la pestaña.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, crear, icono } = MA;
  const C = MA.Ingles;

  const SECCIONES = [{ id: 'quizzes', nombre: 'Quizzes', corto: 'Quizzes', icono: 'chat' }];

  function progreso() {
    const q = [MA.progreso.contar('ingles.prac.', C.EJERCICIOS.map(x => x.id)), C.EJERCICIOS.length];
    return { quizzes: q, practica: q, herramientas: [0, 0], hechos: q[0], total: q[1], pct: q[1] ? q[0] / q[1] : 0 };
  }

  const fila = (...celdas) => `<tr>${celdas.map(c => `<td>${c}</td>`).join('')}</tr>`;
  const en = t => `<span lang="en">${t}</span>`;
  function htmlRepaso() {
    return `
      <details class="tarjeta in-repaso">
        <summary>${icono('chevD', 'chev')}${icono('libro')}Repaso rápido: tiempos verbales, preposiciones y falsos amigos</summary>
        <div class="in-repaso-grilla">
          <div>
            <h4>Tiempos verbales</h4>
            <div class="tabla-envoltura">
              <table class="tabla">
                <thead><tr><th scope="col">Tiempo</th><th scope="col">Para qué</th><th scope="col">Ejemplo</th><th scope="col">Palabras que lo avisan</th></tr></thead>
                <tbody>
                  ${fila('Presente simple', 'Rutinas y horarios', en('The plane <b>leaves</b> at 6:00.'), en('every day, always, usually'))}
                  ${fila('Presente continuo', 'Lo que pasa ahora', en('The pilot <b>is talking</b>.'), en('now, right now, look!'))}
                  ${fila('Pasado simple', 'Algo terminado', en('We <b>landed</b> two hours ago.'), en('ago, yesterday, last week'))}
                  ${fila('Pasado continuo', 'Algo en curso en el pasado', en('They <b>were boarding</b> when…'), en('while, when'))}
                  ${fila('Presente perfecto', 'Experiencias, algo que sigue', en('She <b>has flown</b> three times.'), en('yet, already, ever, this year, since, for'))}
                  ${fila('Pasado perfecto', 'Algo antes de otro pasado', en('The plane <b>had left</b> when we arrived.'), en('by the time, already'))}
                  ${fila('Futuro', 'Predicciones y decisiones', en('It <b>will rain</b> tomorrow.'), en('tomorrow, next week'))}
                </tbody>
              </table>
            </div>
            <p class="texto-2">Condicionales: ${en('if + presente, <b>will</b>')} (algo posible) · ${en('if + pasado, <b>would</b>')} (algo imaginario).</p>
          </div>
          <div>
            <h4>Preposiciones de tiempo</h4>
            <ul>
              <li>${en('<b>at</b> 7:30')}: horas.</li>
              <li>${en('<b>on</b> Monday, <b>on</b> December 1')}: días y fechas.</li>
              <li>${en('<b>in</b> December, <b>in</b> 2026, <b>in</b> the morning')}: meses, años y partes del día.</li>
              <li>${en('<b>for</b> two hours')}: duración · ${en('<b>since</b> 8:00')}: desde un momento · ${en('<b>during</b> the flight')}: a lo largo de algo.</li>
            </ul>
            <h4>Falsos amigos</h4>
            <ul>
              <li>${en('actually')}: en realidad (actualmente es ${en('currently')}).</li>
              <li>${en('attend')}: asistir · ${en('assist')}: ayudar.</li>
              <li>${en('realize')}: darse cuenta · ${en('library')}: biblioteca · ${en('exit')}: salida.</li>
            </ul>
            <h4>Aviación</h4>
            <ul>
              <li>${en('runway')}: pista · ${en('cockpit')}: cabina de mando · ${en('gate')}: puerta de embarque.</li>
              <li>${en('take off')}: despegar · ${en('land')}: aterrizar · ${en('delay')}: retraso · ${en('crew')}: tripulación.</li>
              <li>Las cuatro fuerzas: ${en('lift')} (sustentación), ${en('weight')} (peso), ${en('thrust')} (empuje) y ${en('drag')} (resistencia).</li>
            </ul>
          </div>
        </div>
      </details>`;
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
            <span class="etiqueta">Práctica por cuenta propia</span>
            <h1>Inglés</h1>
            <p class="entrada">Cuatro quizzes cortos de 10 preguntas, para hacer solo y a cualquier ritmo, unos 15 minutos cada uno. Las instrucciones van en español y las preguntas, en inglés. Cada respuesta equivocada explica por qué no.</p>
          </div>
          <div class="mod-resumen" aria-label="Avance en inglés">
            <div class="dato"><small>Preguntas resueltas</small><b data-prog="practica"></b></div>
          </div>
        </header>
        <section class="m1-seccion in-seccion" id="ingles-quizzes" data-sec="quizzes">
          <ol class="in-quizzes">${C.QUIZZES.map((q, i) => `<li><span class="pc-num">${C.NIVELES[q.id]}</span><h3>${q.nombre}</h3><p>${q.detalle}</p></li>`).join('')}</ol>
          ${htmlRepaso()}
          <div class="ingles-practica"></div>
        </section>`;
      cont.appendChild(raiz);
      this.raiz = raiz;
      this.practica = MA.Practica.crear($('.ingles-practica', raiz), { datos: C, modulo: 'ingles' });
      MA.bus.on('progreso', () => this.pintarProgreso());
      this.pintarProgreso();
    },
    pintarProgreso() {
      if (!this.raiz) return;
      const [h, t] = progreso().practica;
      $('[data-prog="practica"]', this.raiz).textContent = `${h} de ${t}`;
    },
    mostrar() {
      MA.almacen.guardar('ingles.seccion', 'quizzes');
      if (this.practica) this.practica.anunciar();
      return 'quizzes';
    }
  };

  MA.vistasModulo.ingles = vista;
})();
