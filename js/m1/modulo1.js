/* =====================================================================
   MÓDULO 1 · página completa
   Cabecera con progreso y plan de clase, pestañas y cuatro secciones:
   1) ideas clave (presentación + ficha), 2) despejes con la balanza,
   3) conversión con factor unitario, 4) práctica progresiva.
   Rutas: #m1-ideas (#m1-ideas-p1, #m1-ideas-p2) · #m1-despejes ·
          #m1-conversion · #m1-practica
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, crear, icono } = MA;
  const { vr, un, n, op, fr, mt, q, tach, raiz, cuad, doble, ext, med } = MA.f;

  const SECCIONES = [
    { id: 'ideas', nombre: 'Ideas clave', corto: 'Ideas', icono: 'libro' },
    { id: 'despejes', nombre: 'Despejes', corto: 'Despejes', icono: 'balanza' },
    { id: 'conversion', nombre: 'Conversión de unidades', corto: 'Conversión', icono: 'regla' },
    { id: 'practica', nombre: 'Práctica', corto: 'Práctica', icono: 'hoja' }
  ];

  function progreso() {
    const C = MA.M1;
    const cuenta = (pref, ids) => [MA.progreso.contar(pref, ids), ids.length];
    const ideas = cuenta('m1.ideas.', MA.Clase1.PARTES.map(p => p.id));
    const despejes = cuenta('m1.balanza.', C.RETOS_BALANZA.map(x => x.id));
    const conversion = cuenta('m1.conv.', C.RETOS_CONVERSION.map(x => x.id));
    const practica = cuenta('m1.prac.', C.EJERCICIOS.map(x => x.id));
    const todos = [ideas, despejes, conversion, practica];
    const hechos = todos.reduce((s, x) => s + x[0], 0), total = todos.reduce((s, x) => s + x[1], 0);
    return { ideas, despejes, conversion, practica, hechos, total, pct: total ? hechos / total : 0 };
  }

  const por = op('·'), igual = op('=');
  const qn = (valor, unidad) => `${n(valor)} ${un(unidad)}`;

  function htmlIdeas() {
    return `
      <div class="seccion-cabeza">
        <span class="etiqueta">Paso 1 de 4</span>
        <h2>Ideas clave antes de empezar</h2>
        <p class="entrada">Lo mínimo que hace falta saber antes de cualquier ejercicio, en dos partes cortas: la primera va antes de la balanza y la segunda, antes de la mesa de conversión.</p>
      </div>
      <div class="m1-presentacion"></div>
      <section class="tarjeta m1-ficha" aria-labelledby="m1-ficha-titulo">
        <h3 id="m1-ficha-titulo">Ficha de equivalencias</h3>
        <p class="texto-2">Sirve tenerla a mano al practicar; con el tiempo uno se la sabe de memoria.</p>
        ${MA.Clase1.fichaHtml()}
      </section>`;
  }

  function htmlDespejes() {
    return `
      <div class="seccion-cabeza">
        <span class="etiqueta">Paso 2 de 4</span>
        <h2>Despejar es equilibrar una balanza</h2>
        <p class="entrada">Una ecuación es una balanza en equilibrio: lo que hay a la izquierda del signo igual pesa exactamente lo mismo que lo que hay a la derecha. Despejar no es memorizar reglas; es hacerles a los dos platos la misma operación hasta que la variable buscada quede sola.</p>
      </div>
      <ol class="pasos-concepto">
        <li><span class="pc-num">01</span><h3>Elegir la meta</h3><p>Decidir qué variable se quiere dejar sola. Casi siempre es la que pide el problema.</p></li>
        <li><span class="pc-num">02</span><h3>Hacer lo contrario</h3><p>Mirar qué le están haciendo a la variable (sumar, restar, multiplicar o dividir) y elegir la operación contraria.</p></li>
        <li><span class="pc-num">03</span><h3>En los dos platos</h3><p>Si se aplica en un solo plato, la balanza se inclina: la igualdad deja de ser cierta.</p></li>
      </ol>
      <div class="m1-balanza"></div>
      <div class="caja">
        <div class="caja-titulo">${icono('pista')}El atajo del colegio, explicado</div>
        <p>«Lo que está multiplicando pasa a dividir» no es una regla mágica: es un resumen de lo que se hace en la balanza. La ${vr('v')} no «pasa» a ningún lado: se dividen los dos lados entre ${vr('v')} y, donde estaba multiplicando, ${mt(vr('v'), op('÷'), vr('v'), igual, n(1))}, así que desaparece.</p>
      </div>
      <div class="caja caja-neutra">
        <div class="caja-titulo">${icono('info')}Unidades con nombre propio</div>
        <p>Algunas unidades son abreviaturas de una combinación: ${mt(qn('1', 'N'), igual, qn('1', 'kg · m/s²'))} (newton, fuerza) y ${mt(qn('1', 'J'), igual, qn('1', 'N · m'))} (joule, energía). No hace falta memorizarlas: el examen da la fórmula, y para despejar se tratan como cualquier otra unidad. Están en la ficha de equivalencias por si se necesita revisar que las unidades cuadran.</p>
      </div>
      <div class="tarjeta m1-contrarias">
        <h3>Operaciones contrarias</h3>
        <div class="tabla-envoltura">
          <table class="tabla">
            <thead><tr><th scope="col">Si la variable está…</th><th scope="col">se aplica en los dos lados…</th><th scope="col">Ejemplo</th></tr></thead>
            <tbody>
              <tr><td>sumada: ${mt(vr('x'), op('+'), vr('b'))}</td><td>${mt(op('−'), vr('b'))}</td><td>${mt(vr('x'), op('+'), n(3), igual, n(10))} → ${mt(vr('x'), igual, n(10), op('−'), n(3))}</td></tr>
              <tr><td>restada: ${mt(vr('x'), op('−'), vr('b'))}</td><td>${mt(op('+'), vr('b'))}</td><td>${mt(vr('x'), op('−'), n(4), igual, n(6))} → ${mt(vr('x'), igual, n(6), op('+'), n(4))}</td></tr>
              <tr><td>multiplicada: ${mt(vr('b'), por, vr('x'))}</td><td>${mt(op('÷'), vr('b'))}</td><td>${mt(n(5), por, vr('x'), igual, n(20))} → ${mt(vr('x'), igual, fr(n(20), n(5)))}</td></tr>
              <tr><td>dividida: ${mt(fr(vr('x'), vr('b')))}</td><td>${mt(op('×'), vr('b'))}</td><td>${mt(fr(vr('x'), n(2)), igual, n(7))} → ${mt(vr('x'), igual, n(7), por, n(2))}</td></tr>
            </tbody>
            <tbody class="tabla-luego">
              <tr class="tabla-luego-titulo"><td colspan="3">Más adelante (por ahora no hace falta aprenderlas)</td></tr>
              <tr><td>al cuadrado: ${mt(cuad(vr('x')))}</td><td>${mt(raiz(vr('x')))} raíz cuadrada</td><td>${mt(cuad(vr('x')), igual, n(9))} → ${mt(vr('x'), igual, raiz(n(9)), igual, n(3))} · caída libre y energía</td></tr>
              <tr><td>en el exponente: ${mt(`${n(10)}<sup class="exp">${vr('x')}</sup>`)}</td><td>log (logaritmo)</td><td>${mt(`${n(10)}<sup class="exp">${vr('x')}</sup>`, igual, n(1000))} → ${mt(vr('x'), igual, 'log 1000', igual, n(3))} · pH, módulo 6</td></tr>
            </tbody>
          </table>
        </div>
        <p class="m1-orden"><b>Orden para despejar:</b> primero se quita lo que suma o resta; después, lo que multiplica o divide. Es como quitarse la ropa: primero la chaqueta y después la camisa.</p>
      </div>
      <div class="tarjeta m1-phet">
        <div class="m1-phet-fila">
          <div>
            <b>Para practicar por cuenta propia (opcional)</b>
            <p class="texto-2">El explorador de igualdades de PhET (Universidad de Colorado) es otra balanza, con bloques y números. En la pantalla «Operaciones», se aplica la misma operación a los dos lados y se ve cómo se mantiene el equilibrio.</p>
          </div>
          <a class="btn btn-secundario btn-chico" href="https://phet.colorado.edu/sims/html/equality-explorer/latest/equality-explorer_es.html" target="_blank" rel="noopener">${icono('externo')}Abrir el simulador</a>
        </div>
      </div>`;
  }

  function htmlConversion() {
    return `
      <div class="seccion-cabeza">
        <span class="etiqueta">Paso 3 de 4</span>
        <h2>Convertir unidades con el factor unitario</h2>
        <p class="entrada">Convertir no cambia la cantidad, solo su nombre: 2,5 km y 2500 m son la misma distancia. El método consiste en multiplicar por fracciones que valen 1 y acomodarlas para que la unidad que se quiere eliminar quede una vez arriba y otra abajo. Así se cancela.</p>
      </div>
      <ol class="pasos-concepto">
        <li><span class="pc-num">01</span><h3>Una equivalencia es un 1</h3><p>Si ${mt(q(1, 'km'), igual, q(1000, 'm'))}, entonces ${mt(fr(`${n(1000)} ${un('m')}`, `${n(1)} ${un('km')}`), igual, n(1))}. Y al revés también vale 1.</p></li>
        <li><span class="pc-num">02</span><h3>Multiplicar por 1 no cambia nada</h3><p>Por eso se puede multiplicar por un factor tantas veces como haga falta: la cantidad sigue siendo la misma.</p></li>
        <li><span class="pc-num">03</span><h3>Las unidades se cancelan</h3><p>Si una unidad queda arriba y la misma abajo, se tachan, igual que ${mt(fr(n(3), n(3)), igual, n(1))}.</p></li>
      </ol>
      <div class="tarjeta m1-ejemplo">
        <span class="etiqueta">Ejemplo resuelto</span>
        <h3>72 km/h a m/s</h3>
        <div class="mt mt-bloque m1-ejemplo-linea">
          ${fr(`${n(72)} ${tach(un('km'))}`, `${n(1)} ${tach(un('h'))}`)} ${por}
          ${fr(`${n(1000)} ${un('m')}`, `${n(1)} ${tach(un('km'))}`)} ${por}
          ${fr(`${n(1)} ${tach(un('h'))}`, `${n(3600)} ${un('s')}`)} ${igual}
          ${fr(`${n(72)} ${por} ${n(1000)}`, n(3600))} ${un('m/s')} ${igual} ${q(20, 'm/s')}
        </div>
        <ol class="m1-ejemplo-pasos">
          <li>Los km están arriba: el primer factor lleva los km abajo.</li>
          <li>Las h están abajo: el segundo factor lleva las h arriba.</li>
          <li>Solo quedan m arriba y s abajo. Entonces se hace la cuenta: ${mt(n(72000), op('÷'), n(3600), igual, n(20))}.</li>
        </ol>
      </div>
      <div class="caja">
        <div class="caja-titulo">${icono('pista')}¿Por qué la h va arriba en el factor?</div>
        <p>km/h se lee «kilómetros por cada hora»: ${mt(q(72, 'km'), op('÷'), q(1, 'h'))}. La hora está <b>abajo, dividiendo</b>. Para que se cancele, el factor tiene que traer una h <b>arriba</b>: así queda h arriba y h abajo, y ${mt(un('h'), op('÷'), un('h'), igual, n(1))}, igual que ${mt(n(5), op('÷'), n(5), igual, n(1))}. La regla sirve para cualquier unidad: lo que está abajo se cancela con lo mismo arriba, y al revés.</p>
      </div>
      <div class="caja">
        <div class="caja-titulo">${icono('pista')}Cuando la fracción queda abajo</div>
        <p>Al calcular ${mt(vr('t'), igual, fr(vr('d'), vr('v')))} con ${q(200, 'km')} y ${q(80, 'km/h')}, la unidad queda ${mt(un('km'), op('÷'), op('('), fr(un('km'), un('h')), op(')'))}: una fracción dentro de otra. Para dividir entre una fracción se escribe una encima de la otra y se aplica <b>extremos y medios</b>: las dos puntas (<span class="ext">extremos</span>) se multiplican arriba y los dos del medio (<span class="med">medios</span>), abajo. Lo que no es fracción lleva un 1 abajo:</p>
        <div class="mt mt-bloque">${doble(fr(ext(un('km')), med(n(1))), fr(med(un('km')), ext(un('h'))))} ${igual} ${fr(`${tach(un('km'))} ${por} ${ext(un('h'))}`, `${med(n(1))} ${por} ${tach(un('km'))}`)} ${igual} ${un('h')}</div>
        <p>La h, que estaba «abajo del abajo», es un extremo: termina arriba. Por eso el resultado sale en horas.</p>
      </div>
      <div class="caja caja-neutra">
        <div class="caja-titulo">${icono('info')}¿Y la regla de tres?</div>
        <p>Sirve para un paso, pero en conversiones de varios pasos (km/h a m/s, cm² a m²) se enreda y es fácil plantearla al revés. Con factores siempre se hace lo mismo y, si hay un error, las unidades avisan: queda algo raro, como km².</p>
      </div>
      <details class="tarjeta m1-ficha m1-ficha-plegable">
        <summary>${icono('chevD', 'chev')}Ficha de equivalencias</summary>
        ${MA.Clase1.fichaHtml()}
      </details>
      <div class="m1-conversor"></div>
      <div class="caja caja-ojo">
        <div class="caja-titulo">${icono('pista')}Truco para el examen, sin calculadora</div>
        <p>Para dividir entre un decimal, se multiplican los dos números por 10: ${mt(n(72), op('÷'), n(3.6))} es lo mismo que ${mt(n(720), op('÷'), n(36), igual, n(20))}. Y conviene simplificar ceros antes de multiplicar: ${mt(fr(n(72000), n(3600)), igual, fr(n(720), n(36)))}.</p>
      </div>`;
  }

  function htmlPractica() {
    return `
      <div class="seccion-cabeza">
        <span class="etiqueta">Paso 4 de 4</span>
        <h2>Práctica progresiva</h2>
        <p class="entrada">Dieciocho ejercicios, del más sencillo al más parecido al examen; los dos últimos son retos para ir un paso más allá. Sin calculadora: con papel o con el borrador. Ante una duda, primero una pista; la solución completa es el último recurso.</p>
      </div>
      <div class="m1-practica"></div>`;
  }

  const vista = {
    secciones: SECCIONES,
    progreso,
    raiz: null,
    montar(cont) {
      const C = MA.M1;
      const raiz = crear('section', 'vista-modulo');
      raiz.innerHTML = `
        <header class="mod-cabeza">
          <div>
            <span class="etiqueta">Módulo 1 de 6</span>
            <h1>Conversión de unidades y despejes</h1>
            <p class="entrada">Dos herramientas que se usan en todo el examen: despejar fórmulas y convertir unidades. Aquí no se memorizan reglas: se entiende por qué funcionan.</p>
          </div>
          <div class="mod-resumen" aria-label="Avance en el módulo">
            <div class="dato"><small>Ideas clave</small><b data-prog="ideas"></b></div>
            <div class="dato"><small>Balanza</small><b data-prog="despejes"></b></div>
            <div class="dato"><small>Conversión</small><b data-prog="conversion"></b></div>
            <div class="dato"><small>Práctica</small><b data-prog="practica"></b></div>
          </div>
        </header>
        <details class="plan-clase">
          <summary>${icono('chevD', 'chev')}${icono('reloj')}Plan de la clase de hoy<span class="texto-3">unos 80 min</span></summary>
          <ol class="agenda">${C.PLAN_CLASE.map(([min, txt]) => `<li><span class="min">${min}</span><span>${txt}</span></li>`).join('')}</ol>
        </details>
        <div class="pestanas" role="tablist" aria-label="Secciones del módulo">
          ${SECCIONES.map((s, i) => `<a class="pestana" role="tab" href="#m1-${s.id}" data-sec="${s.id}" aria-controls="m1-${s.id}"><span class="pt-num">${i + 1}</span><span class="pt-largo">${s.nombre}</span><span class="pt-corto">${s.corto}</span><span class="pt-ok"></span></a>`).join('')}
        </div>
        <section class="m1-seccion" id="m1-ideas" data-sec="ideas" role="tabpanel">${htmlIdeas()}</section>
        <section class="m1-seccion" id="m1-despejes" data-sec="despejes" role="tabpanel" hidden>${htmlDespejes()}</section>
        <section class="m1-seccion" id="m1-conversion" data-sec="conversion" role="tabpanel" hidden>${htmlConversion()}</section>
        <section class="m1-seccion" id="m1-practica" data-sec="practica" role="tabpanel" hidden>${htmlPractica()}</section>
        <nav class="pie-seccion" aria-label="Navegación entre secciones"></nav>`;
      cont.appendChild(raiz);
      this.raiz = raiz;

      this.presentacion = MA.Presentacion.crear($('.m1-presentacion', raiz), {
        diapositivas: MA.Clase1.DIAPOSITIVAS,
        partes: MA.Clase1.PARTES,
        alTerminarParte: id => MA.progreso.marcar('m1.ideas.' + id)
      });
      const balanza = MA.Balanza.crear($('.m1-balanza', raiz));
      const conversor = MA.Conversor.crear($('.m1-conversor', raiz));
      const practica = MA.Practica.crear($('.m1-practica', raiz), {
        abrirHerramienta(ej, numero) {
          const origen = { numero, volver: () => { location.hash = '#m1-practica'; practica.irA(ej.id); } };
          const h = ej.herramienta;
          if (h.tipo === 'balanza') {
            balanza.cargarLibre(h.formula, h.meta, origen);
            location.hash = '#m1-despejes';
            setTimeout(() => $('.m1-balanza', raiz).scrollIntoView({ block: 'start' }), 60);
          } else {
            conversor.cargarProblema(h.problema, origen);
            location.hash = '#m1-conversion';
            setTimeout(() => $('.m1-conversor', raiz).scrollIntoView({ block: 'start' }), 60);
          }
        }
      });
      this.practica = practica;

      MA.bus.on('progreso', () => this.pintarProgreso());
      this.pintarProgreso();
    },
    pintarProgreso() {
      if (!this.raiz) return;
      const p = progreso();
      SECCIONES.forEach(s => {
        const [h, t] = p[s.id];
        $(`[data-prog="${s.id}"]`, this.raiz).textContent = `${h} de ${t}`;
        $(`.pestana[data-sec="${s.id}"] .pt-ok`, this.raiz).innerHTML = h === t ? icono('check') : '';
      });
    },
    mostrar(seccion, extra) {
      const sec = SECCIONES.some(s => s.id === seccion) ? seccion : (MA.almacen.leer('m1.seccion', 'ideas') || 'ideas');
      MA.almacen.guardar('m1.seccion', sec);
      if (sec !== 'ideas' && this.presentacion) this.presentacion.salir();
      $$('.m1-seccion', this.raiz).forEach(el => { el.hidden = el.dataset.sec !== sec; });
      $$('.pestana', this.raiz).forEach(a => a.setAttribute('aria-selected', String(a.dataset.sec === sec)));
      const i = SECCIONES.findIndex(s => s.id === sec);
      const ant = SECCIONES[i - 1], sig = SECCIONES[i + 1];
      $('.pie-seccion', this.raiz).innerHTML = `
        ${ant ? `<a class="btn btn-secundario" href="#m1-${ant.id}">${icono('flechaI')}${ant.nombre}</a>` : '<span></span>'}
        ${sig ? `<a class="btn" href="#m1-${sig.id}">Siguiente sección: ${sig.nombre.toLowerCase()}${icono('flechaD')}</a>` : `<a class="btn btn-secundario" href="#inicio">Volver al panel general${icono('flechaD')}</a>`}`;
      if (sec === 'ideas' && extra && this.presentacion) this.presentacion.irParte(extra);
      if (sec === 'practica' && this.practica) this.practica.anunciar();
      return sec;
    }
  };

  MA.vistasModulo.m1 = vista;
})();
