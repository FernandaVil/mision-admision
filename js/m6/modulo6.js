/* =====================================================================
   Módulo 6 · página completa (física mecánica III: caída libre y tiro)
   Secciones: 1) ideas clave, 2) la torre, 3) práctica.
   Rutas: #m6-ideas (-p1 a -p4) · #m6-torre · #m6-practica
   ---------------------------------------------------------------------
   Por qué está armado así (decisiones pedagógicas)
   1. Primero recordar, después explicar. En la clase 6 entendía en el
      momento y se le olvidaba después: la parte 1 abre con tres
      diagramas de cabeza, en el papel, antes de mirar nada.
   2. La caída libre es la dinámica de la clase 6 con una sola flecha. Le
      costó que una pelota lanzada no lleva la fuerza de la mano, así que
      todo empieza con «¿quién la toca ahora?», y la torre dibuja juntas
      la flecha del peso, que no cambia, y la de la velocidad, que se
      achica, se apaga y crece hacia abajo. La velocidad es lo que trae;
      la fuerza es lo que se la cambia.
   3. La primera y la segunda ley son una sola regla con dos casos
      (ΣF = 0 o no): en la clase 6 se enredó con «si no se le aplican
      fuerzas».
   4. Nada de fórmulas nuevas: son las del módulo 4 con a = −10 y h en
      lugar de d, y la piedra del módulo 3 (h = 20t − 5t²) vuelve. Arriba
      es positivo; al soltar, todo va hacia abajo y no hacen falta signos.
      La altura máxima sale de la velocidad promedio, como en el módulo 4,
      y nada de v² = v₀² + 2gh.
   5. Tiro parabólico solo como concepto y con el lanzamiento horizontal:
      cada eje por su lado, y el tiempo hace de puente. El tiro con ángulo
      y la fórmula del alcance quedan fuera.
   6. Transferencia gradual: modelo en la diapositiva, guiado en la torre
      e independiente en el papel. Lo que se modela no se repite en la
      torre ni en la práctica. La herramienta trabaja sin calculadora; la
      práctica tipo examen, con ella y sin herramientas.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, crear, icono } = MA;
  const { n, op, mt, q } = MA.f;
  const { pot } = MA.M2;
  const C = MA.M6;
  const { L } = C;
  const igual = op('='), por = op('·'), menos = op('−'), entre = op('÷');
  const t2 = pot(L.t, 2);

  const SECCIONES = [
    { id: 'ideas', nombre: 'Ideas clave', corto: 'Ideas', icono: 'libro' },
    { id: 'torre', nombre: 'La torre', corto: 'Torre', icono: 'torre' },
    { id: 'practica', nombre: 'Práctica', corto: 'Práctica', icono: 'hoja' }
  ];

  function progreso() {
    const cuenta = (pref, ids) => [MA.progreso.contar(pref, ids), ids.length];
    const res = {
      ideas: cuenta('m6.ideas.', MA.Clase6.PARTES.map(p => p.id)),
      torre: cuenta('m6.torre.', C.RETOS_TORRE.map(x => x.id)),
      practica: cuenta('m6.prac.', C.EJERCICIOS.map(x => x.id))
    };
    const todos = SECCIONES.map(s => res[s.id]);
    res.hechos = todos.reduce((s, x) => s + x[0], 0);
    res.total = todos.reduce((s, x) => s + x[1], 0);
    res.pct = res.total ? res.hechos / res.total : 0;
    res.herramientas = res.torre;
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
      ${cabeza(1, 'Ideas clave', 'Cuatro partes cortas: recordar la clase de dinámica, la caída libre, las cuentas y el tiro parabólico. Cada una va justo antes de sus retos en la torre.')}
      <div class="m6-presentacion"></div>
      <section class="tarjeta m2-reglas" aria-labelledby="m6-reglas-titulo">
        <h3 id="m6-reglas-titulo">Resumen de reglas</h3>
        <p class="texto-2">Para tener a mano al practicar. Arriba es positivo y ${mt(L.g, igual, q(10, 'm/s²'))}.</p>
        <div class="m2-reglas-grilla">
          <div>
            <h4>Caída libre</h4>
            <ul>
              <li>Solo actúa el peso, también subiendo. La velocidad no es una fuerza: es lo que trae.</li>
              <li>${mt(L.a, igual, q('−10', 'm/s²'))} todo el tiempo, también en lo más alto.</li>
              <li>La masa no importa: sin aire, todo cae igual.</li>
            </ul>
          </div>
          <div>
            <h4>Lanzado hacia arriba</h4>
            <ul>
              <li>${mt(L.vf, igual, L.v0, menos, n(10), por, L.t)} y ${mt(L.h, igual, L.v0, por, L.t, menos, n(5), por, t2)}.</li>
              <li>En lo más alto, ${mt(L.vf, igual, n(0))}: tiempo de subida ${mt(L.v0, entre, n(10))}.</li>
              <li>Altura máxima: velocidad promedio por tiempo de subida.</li>
              <li>Bajar es subir al revés: el mismo tiempo y la misma rapidez.</li>
            </ul>
          </div>
          <div>
            <h4>Soltar desde arriba</h4>
            <ul>
              <li>Arranca con velocidad 0 y todo va hacia abajo.</li>
              <li>Rapidez: ${mt(L.v, igual, n(10), por, L.t)}. Lo que ha caído: ${mt(L.d, igual, n(5), por, t2)}.</li>
              <li>Para el tiempo: primero se divide entre 5 y después la raíz.</li>
            </ul>
          </div>
          <div>
            <h4>Lanzar de lado</h4>
            <ul>
              <li>Cada eje por su lado. Horizontal: nadie lo empuja, ${mt(L.d, igual, L.v, por, L.t)}.</li>
              <li>Vertical: caída libre, como si se soltara.</li>
              <li>Primero el tiempo, con el vertical; después la distancia, con el horizontal.</li>
            </ul>
          </div>
        </div>
      </section>`;
  }

  function htmlTorre() {
    return `
      ${cabeza(2, 'La torre', 'Una pelota que se lanza hacia arriba, se suelta desde lo alto o sale de lado. Deja una huella en cada segundo, y un segundo de la torre dura un segundo de verdad. Antes de lanzar, se predice o se calcula en el papel.')}
      <ol class="pasos-concepto">
        <li><span class="pc-num">01</span><h3>Solo el peso</h3><p>Ya en el aire, nadie la toca. La flecha del peso no cambia; la de la velocidad, sí.</p></li>
        <li><span class="pc-num">02</span><h3>Arriba es positivo</h3><p>La gravedad le quita 10 m/s en cada segundo. Subiendo, la velocidad se achica; en lo más alto vale 0; bajando, es negativa.</p><div class="mt mt-bloque">${L.vf} ${igual} ${L.v0} ${menos} ${n(10)} ${por} ${L.t}</div></li>
        <li><span class="pc-num">03</span><h3>Cada eje por su lado</h3><p>Lanzada de lado, avanza siempre igual y cae como si se soltara. El tiempo es el mismo para los dos ejes.</p></li>
      </ol>
      <div class="m6-torre-mesa"></div>
      <div class="caja caja-ojo">
        <div class="caja-titulo">${icono('pista')}Los errores que hay que cazar</div>
        <ul class="m6-errores">
          <li>«En lo más alto, la aceleración es 0.» No: sigue en −10. Si fuera 0, se quedaría flotando.</li>
          <li>Sumar 10 en cada segundo al subir. Subiendo, la gravedad le quita velocidad.</li>
          <li>Hacer ${mt(L.h, igual, L.v0, por, L.t)}, como si no frenara. Se usa la velocidad promedio.</li>
          <li>Olvidar la raíz: ${mt(t2, igual, n(25))} todavía no es el tiempo.</li>
          <li>«La más pesada cae primero.» Sin aire, la masa se cancela.</li>
        </ul>
      </div>
      <div class="caja caja-neutra">
        <div class="caja-titulo">${icono('info')}¿Y si el examen usa g = 9,8?</div>
        <p>Se hace igual, con 9,8 en lugar de 10: la gravedad le quita 9,8 m/s en cada segundo, y lo que ha caído es ${mt(n('4,9'), por, t2)}. Con la calculadora, sin problema.</p>
      </div>`;
  }

  function htmlPractica() {
    return `
      ${cabeza(3, 'Práctica', 'Quince ejercicios, del más sencillo al más parecido al examen, y cada vez con menos ayuda. Ninguno repite un ejemplo de la clase. Los básicos e intermedios van sin calculadora y pueden abrir la torre. Desde el nivel tipo examen van como en el examen: con calculadora, de principio a fin, sin herramientas y con pistas que se abren después del primer intento. Unos 2 minutos por pregunta.')}
      <ol class="pasos-concepto">
        <li><span class="pc-num">01</span><h3>¿Quién lo toca ahora?</h3><p>Ya en el aire, solo el peso. Una flecha por el lanzamiento o por el movimiento no tiene dueño.</p></li>
        <li><span class="pc-num">02</span><h3>¿Se lanza o se suelta?</h3><p>«Se suelta» o «se deja caer» quiere decir que arranca con velocidad 0. «Se lanza hacia arriba» trae una velocidad que la gravedad va quitando.</p></li>
        <li><span class="pc-num">03</span><h3>Un renglón por eje</h3><p>De lado, primero el tiempo con el eje vertical; después la distancia con el horizontal.</p></li>
      </ol>
      <div class="m6-practica"></div>`;
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
            <span class="etiqueta">Módulo 6 de 9</span>
            <h1>Física mecánica III: caída libre y tiro</h1>
            <p class="entrada">Lo que pasa cuando solo actúa el peso: lanzar hacia arriba, soltar desde lo alto y lanzar de lado. Con las fórmulas del módulo 4, una torre de lanzamiento y preguntas como las de los exámenes.</p>
          </div>
          <div class="mod-resumen" aria-label="Avance en el módulo">
            <div class="dato"><small>Ideas clave</small><b data-prog="ideas"></b></div>
            <div class="dato"><small>Herramientas</small><b data-prog="herramientas"></b></div>
            <div class="dato"><small>Práctica</small><b data-prog="practica"></b></div>
          </div>
        </header>
        <details class="plan-clase">
          <summary>${icono('chevD', 'chev')}${icono('reloj')}Plan de la clase de hoy<span class="texto-3">unas 2 horas</span></summary>
          <ol class="agenda">${C.PLAN_CLASE.map(([min, txt]) => `<li><span class="min">${min}</span><span>${txt}</span></li>`).join('')}</ol>
        </details>
        <div class="pestanas" role="tablist" aria-label="Secciones del módulo">
          ${SECCIONES.map((s, i) => `<a class="pestana" role="tab" href="#m6-${s.id}" data-sec="${s.id}" aria-controls="m6-${s.id}"><span class="pt-num">${i + 1}</span><span class="pt-largo">${s.nombre}</span><span class="pt-corto">${s.corto}</span><span class="pt-ok"></span></a>`).join('')}
        </div>
        <section class="m1-seccion m6-seccion" id="m6-ideas" data-sec="ideas" role="tabpanel">${htmlIdeas()}</section>
        <section class="m1-seccion m6-seccion" id="m6-torre" data-sec="torre" role="tabpanel" hidden>${htmlTorre()}</section>
        <section class="m1-seccion m6-seccion" id="m6-practica" data-sec="practica" role="tabpanel" hidden>${htmlPractica()}</section>
        <nav class="pie-seccion" aria-label="Navegación entre secciones"></nav>`;
      cont.appendChild(raiz);
      this.raiz = raiz;

      this.presentacion = MA.Presentacion.crear($('.m6-presentacion', raiz), {
        diapositivas: MA.Clase6.DIAPOSITIVAS,
        partes: MA.Clase6.PARTES,
        clave: 'm6.diapositiva',
        alTerminarParte: id => MA.progreso.marcar('m6.ideas.' + id)
      });
      const irTorre = () => {
        location.hash = '#m6-torre';
        setTimeout(() => $('.m6-torre-mesa', raiz).scrollIntoView({ block: 'start' }), 60);
      };
      const herramientas = {
        torre: MA.Torre.crear($('.m6-torre-mesa', raiz), {
          final: { texto: 'Ir a la práctica', ir: () => { location.hash = '#m6-practica'; } }
        })
      };
      this.herramientas = herramientas;
      const practica = MA.Practica.crear($('.m6-practica', raiz), {
        datos: C,
        modulo: 'm6',
        ayudaCampo: 'Solo el número, sin la unidad: ya está al lado. Sirven la coma o el punto decimal (2,5 o 2.5) y las fracciones (1/2). Un negativo lleva el signo menos adelante (−10).',
        // Tipo examen y retos: primero un intento completo; las pistas y la solución se abren después
        primeroIntentar: ['examen', 'reto'],
        // Se sigue practicando el descarte de la clase 6: una × al lado de cada opción la tacha
        tachar: true,
        abrirHerramienta(ej, numero) {
          const h = ej.herramienta;
          herramientas[h.mesa].cargarProblema(h.problema, {
            etiqueta: `Ejercicio ${numero} de la práctica`,
            textoVolver: 'Volver a la práctica',
            textoFinal: `Volver al ejercicio ${numero}`,
            volver: () => { location.hash = '#m6-practica'; practica.irA(ej.id); }
          });
          irTorre();
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
      const guardada = MA.almacen.leer('m6.seccion', 'ideas');
      const sec = valida(seccion) ? seccion : valida(guardada) ? guardada : 'ideas';
      MA.almacen.guardar('m6.seccion', sec);
      if (sec !== 'ideas' && this.presentacion) this.presentacion.salir();
      $$('.m6-seccion', this.raiz).forEach(el => { el.hidden = el.dataset.sec !== sec; });
      $$('.pestana', this.raiz).forEach(a => a.setAttribute('aria-selected', String(a.dataset.sec === sec)));
      const i = SECCIONES.findIndex(s => s.id === sec);
      const ant = SECCIONES[i - 1], sig = SECCIONES[i + 1];
      $('.pie-seccion', this.raiz).innerHTML = `
        ${ant ? `<a class="btn btn-secundario" href="#m6-${ant.id}">${icono('flechaI')}${ant.nombre}</a>` : '<span></span>'}
        ${sig ? `<a class="btn" href="#m6-${sig.id}">Siguiente sección: ${sig.nombre.toLowerCase()}${icono('flechaD')}</a>` : `<a class="btn btn-secundario" href="#inicio">Volver al panel general${icono('flechaD')}</a>`}`;
      if (sec === 'ideas' && extra && this.presentacion) this.presentacion.irParte(extra);
      if (sec === 'practica' && this.practica) this.practica.anunciar();
      return sec;
    }
  };

  MA.vistasModulo.m6 = vista;
})();
