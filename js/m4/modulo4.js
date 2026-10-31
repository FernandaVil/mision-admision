/* =====================================================================
   Módulo 4 · página completa (física mecánica I: cinemática)
   Secciones: 1) ideas clave, 2) radar de pista, 3) fórmulas en la
   balanza, 4) entrenamiento.
   Rutas: #m4-ideas (-p1, -p2, -p3) · #m4-radar · #m4-formulas ·
          #m4-entrenamiento
   ---------------------------------------------------------------------
   Por qué está armado así (decisiones pedagógicas)
   1. Primero se ve y después se calcula. El radar muestra el movimiento
      con huellas de cada segundo: parejas con velocidad constante, cada
      vez más separadas al acelerar y cada vez más juntas al frenar. Los
      instrumentos y la bitácora ponen los números al lado del dibujo.
   2. Predecir antes de volar: en cada reto se escribe la predicción y
      el radar se detiene justo en lo que se preguntó. Si falla, se
      explica el error típico y se ofrece otro vuelo con otros números:
      así no se avanza copiando lo que mostró el radar.
   3. La distancia con aceleración sale primero del promedio (de 0 a 8
      m/s, en promedio 4 m/s) y después de la fórmula. El error más
      común es multiplicar la velocidad final por el tiempo; el promedio
      lo evita y explica de dónde sale el ½.
   4. Solo tres fórmulas: d = v · t, vf = v₀ + a · t y d = v₀ · t +
      ½ · a · t². Cada una se presenta como balanza, para despejar como
      en el módulo 1: lo mismo en los dos platos. La balanza del módulo 1
      no sirve aquí (no sabe del ½ ni de t²), así que esta tiene su
      propia mesa, con los pasos ya armados y una pregunta en cada uno.
   5. Despejar la t de la distancia sin partir del reposo es un candado
      con t²: lo abre la llave maestra del módulo 3. Se nombra, pero no
      se trabaja: en el examen casi siempre parte del reposo.
   6. Cada despeje se comprueba con los números de un reto del radar, y
      el entrenamiento termina con tres misiones de vuelo de varios
      pasos (despegue, frenado y una pista corta), con pistas en orden:
      primero los datos, después el tiempo y al final lo que se pide.
   7. Unidades del SI todo el tiempo, y km/h ↔ m/s con el 3,6 del
      módulo 1. Las fórmulas se escriben con MA.f, como en todo el curso
      (sin KaTeX): así funcionan sin internet y con la misma tipografía.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, crear, icono } = MA;
  const { vr, n, op, fr, mt, q, un } = MA.f;
  const C = MA.M4;
  const { L, t2, medio } = C;
  const igual = op('='), por = op('·'), mas = op('+'), entre = op('÷');

  const SECCIONES = [
    { id: 'ideas', nombre: 'Ideas clave', corto: 'Ideas', icono: 'libro' },
    { id: 'radar', nombre: 'Radar de pista', corto: 'Radar', icono: 'radar' },
    { id: 'formulas', nombre: 'Fórmulas en la balanza', corto: 'Fórmulas', icono: 'balanza' },
    { id: 'entrenamiento', nombre: 'Entrenamiento', corto: 'Entrenar', icono: 'hoja' }
  ];

  function progreso() {
    const cuenta = (pref, ids) => [MA.progreso.contar(pref, ids), ids.length];
    const res = {
      ideas: cuenta('m4.ideas.', MA.Clase4.PARTES.map(p => p.id)),
      radar: cuenta('m4.radar.', C.RETOS_RADAR.map(x => x.id)),
      formulas: cuenta('m4.form.', C.RETOS_FORMULAS.map(x => x.id)),
      entrenamiento: cuenta('m4.prac.', C.EJERCICIOS.map(x => x.id))
    };
    const todos = SECCIONES.map(s => res[s.id]);
    res.hechos = todos.reduce((s, x) => s + x[0], 0);
    res.total = todos.reduce((s, x) => s + x[1], 0);
    res.pct = res.total ? res.hechos / res.total : 0;
    res.herramientas = [res.radar[0] + res.formulas[0], res.radar[1] + res.formulas[1]];
    res.practica = res.entrenamiento;
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
      ${cabeza(1, 'Ideas clave', 'Tres partes cortas. Cada una va justo antes de su herramienta: la primera antes del radar con velocidad constante, la segunda antes del radar con aceleración y la tercera antes de las fórmulas en la balanza.')}
      <div class="m4-presentacion"></div>
      <section class="tarjeta m2-reglas" aria-labelledby="m4-reglas-titulo">
        <h3 id="m4-reglas-titulo">Resumen de reglas</h3>
        <p class="texto-2">Para tener a mano al practicar.</p>
        <div class="m2-reglas-grilla">
          <div>
            <h4>Velocidad constante (MRU)</h4>
            <ul>
              <li>Cada segundo avanza lo mismo: ${mt(L.d, igual, L.v, por, L.t)}.</li>
              <li>Despejada: ${mt(L.t, igual, fr(L.d, L.v))} y ${mt(L.v, igual, fr(L.d, L.t))}.</li>
              <li>La aceleración es 0.</li>
            </ul>
          </div>
          <div>
            <h4>Con aceleración (MRUV)</h4>
            <ul>
              <li>Cada segundo gana ${vr('a')}: ${mt(L.vf, igual, L.v0, mas, L.a, por, L.t)}.</li>
              <li>${mt(L.d, igual, L.v0, por, L.t, mas, medio, por, L.a, por, t2)}</li>
              <li>Desde el reposo: ${mt(L.d, igual, medio, por, L.a, por, t2)}.</li>
              <li>O con el promedio: ${mt(L.d, igual, fr(`${L.v0} ${mas} ${L.vf}`, n(2)), por, L.t)}.</li>
            </ul>
          </div>
          <div>
            <h4>Palabras que son datos</h4>
            <ul>
              <li>Parte del reposo: ${mt(L.v0, igual, n(0))}.</li>
              <li>Se detiene: ${mt(L.vf, igual, n(0))}.</li>
              <li>Frena: la aceleración es negativa.</li>
              <li>Velocidad constante: ${mt(L.a, igual, n(0))}.</li>
            </ul>
          </div>
          <div>
            <h4>Unidades</h4>
            <ul>
              <li>Distancia en m, tiempo en s, velocidad en m/s y aceleración en m/s².</li>
              <li>De km/h a m/s, ${entre} 3,6; de m/s a km/h, × 3,6.</li>
              <li>36 → 10 · 72 → 20 · 108 → 30 · 180 → 50.</li>
            </ul>
          </div>
        </div>
      </section>`;
  }

  function htmlRadar() {
    return `
      ${cabeza(2, 'Radar de pista', 'Un avión en la pista y cuatro instrumentos: tiempo, velocidad, distancia y aceleración. Primero con velocidad constante y después con aceleración. En los retos, antes de cada vuelo va una predicción.')}
      <ol class="pasos-concepto">
        <li><span class="pc-num">01</span><h3>Velocidad constante</h3><p>Cada segundo avanza lo mismo: las huellas de la pista quedan parejas.</p><div class="mt mt-bloque">${L.d} ${igual} ${L.v} ${por} ${L.t}</div></li>
        <li><span class="pc-num">02</span><h3>Con aceleración</h3><p>Cada segundo gana la misma velocidad: las huellas se separan. Al frenar, se juntan.</p><div class="mt mt-bloque">${L.vf} ${igual} ${L.v0} ${mas} ${L.a} ${por} ${L.t}</div></li>
        <li><span class="pc-num">03</span><h3>La bitácora</h3><p>Un renglón por segundo con el tiempo, la velocidad, la distancia y lo recorrido en ese segundo.</p></li>
      </ol>
      <div class="m4-radar"></div>
      <div class="caja caja-ojo">
        <div class="caja-titulo">${icono('pista')}El error más común: la velocidad final por el tiempo</div>
        <p>Si arranca en 0 y llega a ${q(8, 'm/s')} en ${q(4, 's')}, no recorrió ${mt(n(8), por, n(4), igual, q(32, 'm'))}: eso sería ir a 8 m/s desde el principio. En promedio fue a 4 m/s, y ${mt(n(4), por, n(4), igual, q(16, 'm'))}.</p>
      </div>
      <div class="caja">
        <div class="caja-titulo">${icono('pista')}El doble de tiempo, cuatro veces la distancia</div>
        <p>Desde el reposo, la distancia total a los 1, 2, 3 y 4 s va como 1, 4, 9 y 16: con el doble de tiempo recorre cuatro veces más. Es la ${t2} de la fórmula, y es una pregunta típica del examen.</p>
      </div>
      <div class="caja caja-neutra">
        <div class="caja-titulo">${icono('info')}¿Y en km/h?</div>
        <p>Los instrumentos marcan m/s. Para pasar a km/h se multiplica por 3,6, como en el módulo 1: ${mt(q(20, 'm/s'), igual, q(72, 'km/h'))}.</p>
      </div>`;
  }

  function htmlTarjetas() {
    return `
      <div class="fb-tarjetas">
        ${Object.keys(C.FORMULAS).map(k => {
          const F = C.FORMULAS[k], primero = C.RETOS_FORMULAS.find(r => r.formula === k);
          return `
            <article class="tarjeta fb-tarjeta" aria-label="${F.nombre}">
              <div><span class="etiqueta">${F.corto}</span><h3>${F.nombre}</h3></div>
              ${C.balanzaHtml(F.izq, F.der, { mini: true })}
              <p class="texto-2">${F.uso}</p>
              <ul class="fb-letras">${F.letras.map(([l, nombre, u]) => `<li>${mt(l)} ${nombre}, en ${un(u)}</li>`).join('')}</ul>
              <button type="button" class="btn btn-secundario btn-chico" data-despejar="${primero.id}">${icono('balanza')}Despejar en la balanza</button>
            </article>`;
        }).join('')}
      </div>`;
  }

  function htmlFormulas() {
    return `
      ${cabeza(3, 'Fórmulas en la balanza', 'Tres fórmulas alcanzan para todo el movimiento en línea recta. Cada una es una balanza: para dejar sola una letra, se hace lo mismo en los dos platos, como en el módulo 1.')}
      ${htmlTarjetas()}
      <div class="m4-formulas"></div>
      <div class="caja">
        <div class="caja-titulo">${icono('pista')}La regla de oro del módulo 1</div>
        <p>Primero se quita lo que suma o resta; después, lo que multiplica o divide. En ${mt(L.vf, igual, L.v0, mas, L.a, por, L.t)}, primero sale la ${L.v0} y después la ${L.t}.</p>
      </div>
      <div class="caja caja-ojo">
        <div class="caja-titulo">${icono('pista')}Ojo: el exponente no multiplica</div>
        <p>${mt(t2, igual, L.t, por, L.t)}, no ${mt(n(2), por, L.t)}. Para deshacer ${t2} no se divide entre 2: se saca la raíz, ${mt(MA.f.raiz(t2), igual, L.t)}.</p>
      </div>
      <div class="caja caja-neutra">
        <div class="caja-titulo">${icono('llave')}¿Y si no parte del reposo?</div>
        <p>Despejar la ${L.t} de ${mt(L.d, igual, L.v0, por, L.t, mas, medio, por, L.a, por, t2)} es un candado con ${t2}: la ${L.t} aparece dos veces, y lo abre la llave maestra del módulo 3. En el examen casi siempre parte del reposo, y basta con la raíz.</p>
      </div>`;
  }

  function htmlEntrenamiento() {
    return `
      ${cabeza(4, 'Entrenamiento', 'Doce ejercicios, del más sencillo al más parecido al examen. Los tres últimos son misiones de vuelo de varios pasos: despegue, frenado y una pista corta. Ante una duda, primero una pista: van en orden, de la más general a la más concreta. Sin calculadora: con papel o con el borrador.')}
      <div class="m4-practica"></div>`;
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
            <span class="etiqueta">Módulo 4 de 6</span>
            <h1>Física mecánica I: cinemática</h1>
            <p class="entrada">Cómo se describe un movimiento en línea recta: con velocidad constante, acelerando y frenando. Un radar de pista para verlo, tres fórmulas que se despejan como balanzas y misiones de despegue y frenado como las del examen.</p>
          </div>
          <div class="mod-resumen" aria-label="Avance en el módulo">
            <div class="dato"><small>Ideas clave</small><b data-prog="ideas"></b></div>
            <div class="dato"><small>Herramientas</small><b data-prog="herramientas"></b></div>
            <div class="dato"><small>Entrenamiento</small><b data-prog="practica"></b></div>
          </div>
        </header>
        <details class="plan-clase">
          <summary>${icono('chevD', 'chev')}${icono('reloj')}Plan de la clase de hoy<span class="texto-3">unos 80 min</span></summary>
          <ol class="agenda">${C.PLAN_CLASE.map(([min, txt]) => `<li><span class="min">${min}</span><span>${txt}</span></li>`).join('')}</ol>
        </details>
        <div class="pestanas" role="tablist" aria-label="Secciones del módulo">
          ${SECCIONES.map((s, i) => `<a class="pestana" role="tab" href="#m4-${s.id}" data-sec="${s.id}" aria-controls="m4-${s.id}"><span class="pt-num">${i + 1}</span><span class="pt-largo">${s.nombre}</span><span class="pt-corto">${s.corto}</span><span class="pt-ok"></span></a>`).join('')}
        </div>
        <section class="m1-seccion m4-seccion" id="m4-ideas" data-sec="ideas" role="tabpanel">${htmlIdeas()}</section>
        <section class="m1-seccion m4-seccion" id="m4-radar" data-sec="radar" role="tabpanel" hidden>${htmlRadar()}</section>
        <section class="m1-seccion m4-seccion" id="m4-formulas" data-sec="formulas" role="tabpanel" hidden>${htmlFormulas()}</section>
        <section class="m1-seccion m4-seccion" id="m4-entrenamiento" data-sec="entrenamiento" role="tabpanel" hidden>${htmlEntrenamiento()}</section>
        <nav class="pie-seccion" aria-label="Navegación entre secciones"></nav>`;
      cont.appendChild(raiz);
      this.raiz = raiz;

      this.presentacion = MA.Presentacion.crear($('.m4-presentacion', raiz), {
        diapositivas: MA.Clase4.DIAPOSITIVAS,
        partes: MA.Clase4.PARTES,
        clave: 'm4.diapositiva',
        alTerminarParte: id => MA.progreso.marcar('m4.ideas.' + id)
      });
      // Cada herramienta, con la sección donde vive
      const MESAS = { radar: { seccion: 'radar', clase: '.m4-radar' }, formulas: { seccion: 'formulas', clase: '.m4-formulas' } };
      const irA = mesa => {
        location.hash = '#m4-' + MESAS[mesa].seccion;
        setTimeout(() => $(MESAS[mesa].clase, raiz).scrollIntoView({ block: 'start' }), 60);
      };
      const herramientas = {
        // Al terminar los retos de velocidad constante, la parte 2; al terminar todos, la parte 3
        radar: MA.RadarPista.crear($('.m4-radar', raiz), {
          cambioGrupo: { texto: 'Seguir con las ideas clave, parte 2', ir: () => { location.hash = '#m4-ideas-p2'; } },
          final: { texto: 'Seguir con las ideas clave, parte 3', ir: () => { location.hash = '#m4-ideas-p3'; } }
        }),
        formulas: MA.Formulas.crear($('.m4-formulas', raiz), {
          final: { texto: 'Ir al entrenamiento', ir: () => { location.hash = '#m4-entrenamiento'; } }
        })
      };
      this.herramientas = herramientas;
      // Cada tarjeta de fórmula abre su primer despeje en la balanza
      raiz.addEventListener('click', e => {
        const b = e.target.closest('[data-despejar]');
        if (!b) return;
        herramientas.formulas.cargarReto(b.dataset.despejar);
        $('.m4-formulas', raiz).scrollIntoView({ behavior: MA.movimientoReducido() ? 'auto' : 'smooth', block: 'start' });
      });
      const practica = MA.Practica.crear($('.m4-practica', raiz), {
        datos: C,
        modulo: 'm4',
        ayudaCampo: 'Solo el número, sin la unidad: ya está al lado. Sirven la coma o el punto decimal (2,5 o 2.5) y las fracciones (1/2).',
        abrirHerramienta(ej, numero) {
          const h = ej.herramienta;
          herramientas[h.mesa].cargarProblema(h.problema, {
            etiqueta: `Ejercicio ${numero} del entrenamiento`,
            textoVolver: 'Volver al entrenamiento',
            textoFinal: `Volver al ejercicio ${numero}`,
            volver: () => { location.hash = '#m4-entrenamiento'; practica.irA(ej.id); }
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
      const guardada = MA.almacen.leer('m4.seccion', 'ideas');
      const sec = valida(seccion) ? seccion : valida(guardada) ? guardada : 'ideas';
      MA.almacen.guardar('m4.seccion', sec);
      if (sec !== 'ideas' && this.presentacion) this.presentacion.salir();
      $$('.m4-seccion', this.raiz).forEach(el => { el.hidden = el.dataset.sec !== sec; });
      $$('.pestana', this.raiz).forEach(a => a.setAttribute('aria-selected', String(a.dataset.sec === sec)));
      const i = SECCIONES.findIndex(s => s.id === sec);
      const ant = SECCIONES[i - 1], sig = SECCIONES[i + 1];
      $('.pie-seccion', this.raiz).innerHTML = `
        ${ant ? `<a class="btn btn-secundario" href="#m4-${ant.id}">${icono('flechaI')}${ant.nombre}</a>` : '<span></span>'}
        ${sig ? `<a class="btn" href="#m4-${sig.id}">Siguiente sección: ${sig.nombre.toLowerCase()}${icono('flechaD')}</a>` : `<a class="btn btn-secundario" href="#inicio">Volver al panel general${icono('flechaD')}</a>`}`;
      if (sec === 'ideas' && extra && this.presentacion) this.presentacion.irParte(extra);
      if (sec === 'entrenamiento' && this.practica) this.practica.anunciar();
      // El radar mide la pista al hacerse visible
      if (sec === 'radar' && this.herramientas) requestAnimationFrame(() => this.herramientas.radar.redibujar());
      return sec;
    }
  };

  MA.vistasModulo.m4 = vista;
})();
