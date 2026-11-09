/* =====================================================================
   Módulo 5 · página completa (física mecánica II: dinámica)
   Secciones: 1) ideas clave, 2) mesa de fuerzas, 3) la rampa, 4) práctica.
   Rutas: #m5-ideas (-p1 a -p5) · #m5-fuerzas · #m5-rampa · #m5-practica
   ---------------------------------------------------------------------
   Por qué está armado así (decisiones pedagógicas)
   1. Tres herramientas maestras en lugar de casos: «¿Quién lo toca?» para
      dibujar cualquier diagrama, ΣF = m · a como única ley con cuentas, y
      tres tácticas para descartar opciones. La primera ley es el caso
      a = 0, y la tercera no es una cuenta: las parejas están en cuerpos
      distintos.
   2. Ajustado con cuadernillos reales del ICFES: en las preguntas de
      fuerzas se leen flechas más de lo que se dibujan, por eso la mesa
      tiene un modo «¿qué flechas cambian?»; la trampa más repetida es «el
      peso cambió» (3 de 7), y por eso se nombra; cada eje va por su lado,
      y contar flechas no es sumarlas. Los enunciados y las figuras del
      ICFES no se copian: el repositorio es público, y las preguntas reales
      se usan en clase desde los cuadernillos.
   3. Transferencia gradual: modelo, guiado e independiente en cada bloque
      y en la práctica. El independiente va en papel, sin la mesa, y
      después se compara: en la clase 3 se vio que, con la mesa, se resuelve
      solo el paso que pide. Lo que se modela en las diapositivas no se
      repite en las herramientas ni en la práctica: si ya vio la situación o
      los números, respondería de memoria, sin pensar.
   4. Las flechas dan sentido a lo que todavía cuesta: los signos (hacia la
      derecha suma, hacia la izquierda resta) y el orden de los despejes
      (primero las flechas, después la masa).
   5. Trigonometría como en el colegio (opuesto ÷ hipotenusa), tarde y
      dentro de la rampa: el peso es la hipotenusa, y de ahí sale
      P∥ = P · sen θ con un despeje. En los cuadernillos no aparece, así que
      es lo primero que se recorta. El caso extremo ayuda a la memoria: con
      la rampa plana, nada desliza.
   6. Antes de dibujar, las fuerzas se presentan: por qué existe la normal,
      que nadie la ve, y cuáles son las cinco de esta clase.
   7. El humor es la situación física, no un adorno (Toby ladra: ¿hay
      flecha?), y se retira como la guía: los retos van sin personajes.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, crear, icono } = MA;
  const { n, op, fr, mt, q } = MA.f;
  const C = MA.M5;
  const { L, SF, sen, cos } = C;
  const igual = op('='), por = op('·'), menos = op('−');

  const SECCIONES = [
    { id: 'ideas', nombre: 'Ideas clave', corto: 'Ideas', icono: 'libro' },
    { id: 'fuerzas', nombre: 'Mesa de fuerzas', corto: 'Fuerzas', icono: 'fuerzas' },
    { id: 'rampa', nombre: 'La rampa', corto: 'Rampa', icono: 'rampa' },
    { id: 'practica', nombre: 'Práctica', corto: 'Práctica', icono: 'hoja' }
  ];

  function progreso() {
    const cuenta = (pref, ids) => [MA.progreso.contar(pref, ids), ids.length];
    const res = {
      ideas: cuenta('m5.ideas.', MA.Clase5.PARTES.map(p => p.id)),
      fuerzas: cuenta('m5.fuerzas.', C.RETOS_FUERZAS.map(x => x.id)),
      rampa: cuenta('m5.rampa.', C.RETOS_RAMPA.map(x => x.id)),
      practica: cuenta('m5.prac.', C.EJERCICIOS.map(x => x.id))
    };
    const todos = SECCIONES.map(s => res[s.id]);
    res.hechos = todos.reduce((s, x) => s + x[0], 0);
    res.total = todos.reduce((s, x) => s + x[1], 0);
    res.pct = res.total ? res.hechos / res.total : 0;
    res.herramientas = [res.fuerzas[0] + res.rampa[0], res.fuerzas[1] + res.rampa[1]];
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
      ${cabeza(1, 'Ideas clave', 'Cinco partes cortas, cada una justo antes de su herramienta: masa, peso y flechas; la fuerza neta y las tres leyes; las flechas en la rampa; seno y coseno; y las tácticas para el examen.')}
      <div class="m5-presentacion"></div>
      <section class="tarjeta m2-reglas" aria-labelledby="m5-reglas-titulo">
        <h3 id="m5-reglas-titulo">Resumen de reglas</h3>
        <p class="texto-2">Para tener a mano al practicar.</p>
        <div class="m2-reglas-grilla">
          <div>
            <h4>Masa y peso</h4>
            <ul>
              <li>Masa, en kg: cuánto cuesta cambiarle el movimiento. No cambia.</li>
              <li>Peso, en N: ${mt(L.P, igual, L.m, por, L.g)}, con ${mt(L.g, igual, q(10, 'm/s²'))}.</li>
              <li>El peso solo cambia si cambia la masa o cambia el planeta.</li>
            </ul>
          </div>
          <div>
            <h4>¿Quién lo toca?</h4>
            <ol>
              <li>El cuerpo solo.</li>
              <li>El peso, siempre hacia abajo.</li>
              <li>Una flecha por cada cosa que lo toca.</li>
              <li>Se compara con lo que hace, cada eje por su lado.</li>
            </ol>
          </div>
          <div>
            <h4>Las tres leyes</h4>
            <ul>
              <li>Primera: si las flechas se anulan, sigue como venía, quieto o con velocidad constante.</li>
              <li>De ahí salen la normal y la tensión, que no tienen fórmula propia: valen lo que haga falta para que su eje empate. En el piso, la normal vale lo que el peso; en la rampa, ${mt(L.P, por, cos)}.</li>
              <li>Segunda: ${mt(SF, igual, L.m, por, L.a)}. Primero las flechas, después la masa.</li>
              <li>Tercera: «A sobre B» y «B sobre A», iguales y en cuerpos distintos.</li>
            </ul>
          </div>
          <div>
            <h4>La rampa</h4>
            <ul>
              <li>El peso sigue vertical. La normal sale perpendicular a la rampa.</li>
              <li>Seno se desliza: ${mt(L.Ppar, igual, L.P, por, sen)}.</li>
              <li>Coseno contra la rampa: ${mt(L.Pper, igual, L.P, por, cos)}.</li>
              <li>Sin fricción, ${mt(L.a, igual, L.g, por, sen)}: la masa se cancela.</li>
            </ul>
          </div>
        </div>
      </section>`;
  }

  function htmlFuerzas() {
    return `
      ${cabeza(2, 'Mesa de fuerzas', 'El diagrama de cuerpo libre, paso a paso: qué toca el cuerpo, cuáles son sus flechas y qué dicen esas flechas sobre lo que va a hacer. Antes de cada paso va una decisión: la mesa no se adelanta.')}
      <ol class="pasos-concepto">
        <li><span class="pc-num">01</span><h3>¿Quién lo toca?</h3><p>Cada cosa que toca el cuerpo da una flecha. El peso va siempre, aunque nada lo toque.</p></li>
        <li><span class="pc-num">02</span><h3>Las flechas</h3><p>La lista trae fuerzas verdaderas y falsas. De cada flecha, ¿quién la hace? El largo también dice algo: se comparan entre ellas.</p></li>
        <li><span class="pc-num">03</span><h3>Leer las flechas</h3><p>Cada eje por su lado. Si se anulan, sigue como venía. Si gana una, acelera hacia allá.</p><div class="mt mt-bloque">${SF} ${igual} ${L.m} ${por} ${L.a}</div></li>
      </ol>
      <section class="tarjeta m5-tabla" aria-labelledby="m5-cinco-titulo">
        <h3 id="m5-cinco-titulo">Las cinco fuerzas</h3>
        <div class="tabla-envoltura">
          <table class="tabla">
            <thead><tr><th scope="col">Fuerza</th><th scope="col">Quién la hace</th><th scope="col">Hacia dónde</th></tr></thead>
            <tbody>
              <tr><td>Peso</td><td>La Tierra, sin tocarlo</td><td>Hacia abajo, siempre</td></tr>
              <tr><td>Normal</td><td>La superficie que lo sostiene</td><td>Perpendicular a la superficie</td></tr>
              <tr><td>Fricción</td><td>La superficie por donde resbala</td><td>Contra el deslizamiento</td></tr>
              <tr><td>Tensión</td><td>Una cuerda o un cable</td><td>A lo largo de la cuerda: solo jala</td></tr>
              <tr><td>Empuje</td><td>Una mano o un motor</td><td>Hacia donde empuja</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <div class="m5-fuerzas"></div>
      <div class="caja caja-ojo">
        <div class="caja-titulo">${icono('pista')}La flecha sin dueño</div>
        <p>«La fuerza del movimiento», «la inercia», «la fuerza del golpe»: si nadie toca el cuerpo para hacerla, no existe. Moverse no es una fuerza: lo que ya se mueve sigue moviéndose sin que nadie lo empuje.</p>
      </div>
      <div class="caja">
        <div class="caja-titulo">${icono('pista')}Contar flechas no es sumarlas</div>
        <p>Dos flechas a la derecha no le ganan por fuerza a una a la izquierda: hay que sumar sus valores, cada uno con su signo. Con ${q(20, 'N')} y ${q(30, 'N')} a la derecha y ${q(40, 'N')} a la izquierda, la neta es ${mt(n(20), op('+'), n(30), menos, n(40), igual, q(10, 'N'))}.</p>
      </div>
      <div class="caja caja-neutra">
        <div class="caja-titulo">${icono('info')}¿Y la fuerza de la fricción?</div>
        <p>Si el enunciado da el coeficiente, ${mt(L.f, igual, MA.f.vr('μ'), por, L.N)}: depende de qué tan fuerte aprieta la superficie, no de la velocidad. En esta clase basta con saber hacia dónde apunta: contra el deslizamiento.</p>
      </div>`;
  }

  function htmlRampa() {
    return `
      ${cabeza(3, 'La rampa', 'Una rampa con un deslizador de 0° a 90°. El peso no cambia y sigue vertical; lo que cambia es cómo se reparte. Antes de mover nada, se predice.')}
      <ol class="pasos-concepto">
        <li><span class="pc-num">01</span><h3>Seno y coseno</h3><p>Seno es opuesto ÷ hipotenusa y coseno es adyacente ÷ hipotenusa. En una rampa, la hipotenusa es el largo y el opuesto es el alto.</p></li>
        <li><span class="pc-num">02</span><h3>Partir el peso</h3><p>El peso es la hipotenusa. Seno se desliza; coseno contra la rampa. No son fuerzas nuevas: es el mismo peso visto en dos partes.</p><div class="mt mt-bloque">${L.Ppar} ${igual} ${L.P} ${por} ${sen}</div></li>
        <li><span class="pc-num">03</span><h3>Llevarlo al extremo</h3><p>Con la rampa plana, nada desliza. Vertical, es caída libre. Sirve para saber cuál es cuál y para descartar opciones.</p></li>
      </ol>
      <div class="m5-rampa-mesa"></div>
      <div class="caja caja-ojo">
        <div class="caja-titulo">${icono('pista')}Ojo con la calculadora</div>
        <p>${mt('<span class="m5-fn">sen</span>', n('30°'), igual, n('0,5'))}. Si da −0,988, la calculadora está en radianes y hay que pasarla a grados (D o DEG). Y si un seno o un coseno da más de 1, hay un error.</p>
      </div>
      <div class="caja caja-neutra">
        <div class="caja-titulo">${icono('info')}¿Y si la rampa viene con medidas?</div>
        <p>No hace falta el ángulo: el alto es el opuesto y el largo es la hipotenusa, así que ${mt(sen, igual, fr('<span class="un">alto</span>', '<span class="un">largo</span>'))}. Una rampa de ${q(10, 'm')} de largo y ${q(7, 'm')} de alto tiene ${mt(sen, igual, n('0,7'))}.</p>
      </div>`;
  }

  function htmlPractica() {
    return `
      ${cabeza(4, 'Práctica', 'Diecisiete ejercicios, del más sencillo al más parecido al examen, y cada vez con menos ayuda. Ninguno repite un ejemplo de la clase. Los básicos e intermedios pueden abrir la mesa para repasar. Desde el nivel tipo examen van como en el examen: de principio a fin, sin herramientas y con pistas que se abren después del primer intento. Unos 2 minutos por pregunta, y primero el dibujo, en el papel.')}
      <ol class="pasos-concepto">
        <li><span class="pc-num">01</span><h3>Cazar la razón falsa</h3><p>El resultado puede estar bien y el «porque» estar mal: «el peso cambió», «una flecha sin dueño», «contar flechas» y «si se mueve, algo va ganando».</p></li>
        <li><span class="pc-num">02</span><h3>Llevarlo al extremo</h3><p>¿Funciona con la rampa plana o vertical? ¿Con una masa muy grande? Si falla en el extremo, se tacha.</p></li>
        <li><span class="pc-num">03</span><h3>Dejar que manden las unidades</h3><p>Dicen qué operación va, aunque no se recuerde la fórmula. N ÷ kg da m/s², y m³/s ÷ m/s da m².</p></li>
      </ol>
      <section class="tarjeta m5-tabla" aria-labelledby="m5-palabras-titulo">
        <h3 id="m5-palabras-titulo">Palabras que son flechas</h3>
        <div class="tabla-envoltura">
          <table class="tabla">
            <thead><tr><th scope="col">El enunciado dice</th><th scope="col">Quiere decir</th></tr></thead>
            <tbody>
              <tr><td>«Velocidad constante», «en reposo», «en equilibrio»</td><td>Las flechas se anulan</td></tr>
              <tr><td>«Acelera», «frena»</td><td>Gana una, y apunta hacia donde cambia la velocidad</td></tr>
              <tr><td>«Sin fricción»</td><td>Esa flecha no va</td></tr>
              <tr><td>«Se suelta», «cae»</td><td>Nadie lo empuja: solo el peso</td></tr>
            </tbody>
          </table>
        </div>
        <p class="texto-2">Si el enunciado regala una regla, se usa, aunque no se recuerde. Con la × al lado de cada opción se tacha lo que ya se descartó.</p>
      </section>
      <div class="m5-practica"></div>
      ${htmlPhet()}`;
  }

  /* ---------- Para seguir explorando: el simulador de PhET ----------
     Va después de la práctica y fuera de la clase: en vivo cortaría el
     ritmo, y antes de la clase resolvería las apuestas. Solo dos
     pantallas (screens=1,4): «Fuerza neta» y «Aceleración». «Fricción»
     se guarda para cuando se vea el coeficiente. Cada pantalla trae una
     predicción para el papel, y las respuestas las da el simulador.
     Pesa unos 5 MB: se carga solo con el botón. */
  const PHET = 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_es.html?screens=1,4';
  function htmlPhet() {
    return `
      <section class="tarjeta m5-phet" aria-labelledby="m5-phet-titulo">
        <h3 id="m5-phet-titulo">Para seguir explorando</h3>
        <p class="texto-2">El simulador de fuerzas y movimiento de PhET (Universidad de Colorado), con dos de sus pantallas. Antes de mover nada, la predicción va en el papel; después se prueba.</p>
        <ol class="m5-phet-predicciones">
          <li><b>«Fuerza neta».</b> De un lado, dos tiradores chicos, de ${q(50, 'N')} cada uno; del otro, uno mediano, de ${q(100, 'N')}. ¿Hacia dónde va el carro?</li>
          <li><b>«Aceleración»</b>, con la fricción en «Nada». Empujar unos segundos y después dejar la fuerza en 0: ¿el objeto frena, se detiene o sigue igual?</li>
          <li>Con la misma fuerza y el doble de masa, ¿qué pasa con la aceleración? Con «Masas» y «Valores» activados se ven los números, y los objetos se pueden apilar.</li>
        </ol>
        <div class="m5-phet-marco">
          <p class="m5-phet-cargando" role="status"></p>
          <div class="m5-phet-inicio">
            <button type="button" class="btn m5-phet-cargar">${icono('pantalla')}Cargar el simulador aquí</button>
            <p class="texto-3">Necesita internet y pesa unos 5 MB.</p>
          </div>
          <iframe data-src="${PHET}" title="Simulador de fuerzas y movimiento de PhET" allowfullscreen hidden></iframe>
        </div>
        <div class="m5-phet-pie">
          <p class="texto-3">Si se ve muy chico, se puede abrir en otra pestaña, a pantalla completa.</p>
          <a class="btn btn-secundario btn-chico" href="${PHET}" target="_blank" rel="noopener">${icono('externo')}Abrir en otra pestaña</a>
        </div>
      </section>`;
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
            <span class="etiqueta">Módulo 5 de 9</span>
            <h1>Física mecánica II: dinámica</h1>
            <p class="entrada">Por qué se mueve lo que se mueve. Masa y peso, las flechas de cualquier situación, las tres leyes de Newton y la rampa, con preguntas como las de los exámenes y tácticas para descartar opciones.</p>
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
          ${SECCIONES.map((s, i) => `<a class="pestana" role="tab" href="#m5-${s.id}" data-sec="${s.id}" aria-controls="m5-${s.id}"><span class="pt-num">${i + 1}</span><span class="pt-largo">${s.nombre}</span><span class="pt-corto">${s.corto}</span><span class="pt-ok"></span></a>`).join('')}
        </div>
        <section class="m1-seccion m5-seccion" id="m5-ideas" data-sec="ideas" role="tabpanel">${htmlIdeas()}</section>
        <section class="m1-seccion m5-seccion" id="m5-fuerzas" data-sec="fuerzas" role="tabpanel" hidden>${htmlFuerzas()}</section>
        <section class="m1-seccion m5-seccion" id="m5-rampa" data-sec="rampa" role="tabpanel" hidden>${htmlRampa()}</section>
        <section class="m1-seccion m5-seccion" id="m5-practica" data-sec="practica" role="tabpanel" hidden>${htmlPractica()}</section>
        <nav class="pie-seccion" aria-label="Navegación entre secciones"></nav>`;
      cont.appendChild(raiz);
      this.raiz = raiz;

      this.presentacion = MA.Presentacion.crear($('.m5-presentacion', raiz), {
        diapositivas: MA.Clase5.DIAPOSITIVAS,
        partes: MA.Clase5.PARTES,
        clave: 'm5.diapositiva',
        alTerminarParte: id => MA.progreso.marcar('m5.ideas.' + id)
      });
      const irMesa = () => {
        location.hash = '#m5-fuerzas';
        setTimeout(() => $('.m5-fuerzas', raiz).scrollIntoView({ block: 'start' }), 60);
      };
      const herramientas = {
        fuerzas: MA.MesaFuerzas.crear($('.m5-fuerzas', raiz), {
          final: { texto: 'Ir a la práctica', ir: () => { location.hash = '#m5-practica'; } }
        }),
        rampa: MA.Rampa.crear($('.m5-rampa-mesa', raiz), {
          final: { texto: 'Ir a la práctica', ir: () => { location.hash = '#m5-practica'; } },
          irMesa: id => { herramientas.fuerzas.cargarReto(id); irMesa(); }
        })
      };
      this.herramientas = herramientas;
      const practica = MA.Practica.crear($('.m5-practica', raiz), {
        datos: C,
        modulo: 'm5',
        ayudaCampo: 'Solo el número, sin la unidad: ya está al lado. Sirven la coma o el punto decimal (2,5 o 2.5) y las fracciones (1/2).',
        // Tipo examen y retos: primero un intento completo; las pistas y la solución se abren después
        primeroIntentar: ['examen', 'reto'],
        // Se practica el descarte: una × al lado de cada opción la tacha
        tachar: true,
        abrirHerramienta(ej, numero) {
          const h = ej.herramienta;
          herramientas[h.mesa].cargarProblema(h.problema, {
            etiqueta: `Ejercicio ${numero} de la práctica`,
            textoVolver: 'Volver a la práctica',
            textoFinal: `Volver al ejercicio ${numero}`,
            volver: () => { location.hash = '#m5-practica'; practica.irA(ej.id); }
          });
          irMesa();
        }
      });
      this.practica = practica;

      // PhET se carga al pedirlo. El foco pasa al simulador, porque el botón desaparece.
      const phet = $('.m5-phet', raiz);
      $('.m5-phet-cargar', phet).addEventListener('click', () => {
        const iframe = $('iframe', phet);
        $('.m5-phet-inicio', phet).hidden = true;
        $('.m5-phet-cargando', phet).textContent = 'Cargando el simulador de PhET…';
        iframe.hidden = false;
        iframe.src = iframe.dataset.src;
        iframe.focus();
      });

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
      const guardada = MA.almacen.leer('m5.seccion', 'ideas');
      const sec = valida(seccion) ? seccion : valida(guardada) ? guardada : 'ideas';
      MA.almacen.guardar('m5.seccion', sec);
      if (sec !== 'ideas' && this.presentacion) this.presentacion.salir();
      $$('.m5-seccion', this.raiz).forEach(el => { el.hidden = el.dataset.sec !== sec; });
      $$('.pestana', this.raiz).forEach(a => a.setAttribute('aria-selected', String(a.dataset.sec === sec)));
      const i = SECCIONES.findIndex(s => s.id === sec);
      const ant = SECCIONES[i - 1], sig = SECCIONES[i + 1];
      $('.pie-seccion', this.raiz).innerHTML = `
        ${ant ? `<a class="btn btn-secundario" href="#m5-${ant.id}">${icono('flechaI')}${ant.nombre}</a>` : '<span></span>'}
        ${sig ? `<a class="btn" href="#m5-${sig.id}">Siguiente sección: ${sig.nombre.toLowerCase()}${icono('flechaD')}</a>` : `<a class="btn btn-secundario" href="#inicio">Volver al panel general${icono('flechaD')}</a>`}`;
      if (sec === 'ideas' && extra && this.presentacion) this.presentacion.irParte(extra);
      if (sec === 'practica' && this.practica) this.practica.anunciar();
      return sec;
    }
  };

  MA.vistasModulo.m5 = vista;
})();
