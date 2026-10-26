/* =====================================================================
   CLASE 2 · ideas clave (diapositivas del módulo 2)
   ---------------------------------------------------------------------
   Tres bloques cortos, cada uno justo antes de su herramienta:
     parte 1 (diapositivas 1-8)   -> antes de las mesas de fracciones
     parte 2 (diapositivas 9-13)  -> antes de la mesa de operaciones
     parte 3 (diapositivas 14-18) -> antes de la mesa de exponentes
   Las diapositivas le hablan de usted al estudiante.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { icono } = MA;
  const { vr, un, n, op, fr, mt, q, tach, doble, ext, med, pega } = MA.f;
  const { pot, neg } = MA.M2;
  const por = op('·'), igual = op('='), entre = op('÷'), mas = op('+');
  const prod = (...xs) => xs.join(` ${por} `);
  const qn = (valor, unidad) => `${n(valor)} ${un(unidad)}`;
  const xs = k => Array.from({ length: k }, () => vr('x')).join(` ${por} `);

  const DIAPOSITIVAS = [
    // ---------------- Parte 1 · fracciones ----------------
    {
      titulo: 'Portada',
      html: `
        <div class="d-portada">
          <p class="d-kicker">Módulo 2 · clase 2</p>
          <h2>Fracciones, signos y potencias</h2>
          <p class="d-sub">Al terminar hoy va a poder:</p>
          <ul class="d-lista">
            <li>Sumar, restar, multiplicar y dividir fracciones, también con unidades, como ${mt(un('km'), entre, un('km/h'))}.</li>
            <li>Resolver operaciones con signos en el orden correcto.</li>
            <li>Simplificar fórmulas con potencias: ${mt(pot(vr('x'), 2), por, pot(vr('x'), 3), igual, pot(vr('x'), 5))}.</li>
          </ul>
        </div>`
    },
    {
      titulo: 'La raya es un ÷',
      html: `
        <h2>Una fracción es una división</h2>
        <div class="d-tarjetas">
          <div class="d-tarjeta"><span class="d-num">Con números</span>${mt(fr(n(3), n(4)), igual, n(3), entre, n(4), igual, n(0.75))}</div>
          <div class="d-tarjeta"><span class="d-num">Con unidades</span>${mt(un('km/h'), igual, fr(un('km'), un('h')), igual, un('km'), entre, un('h'))}</div>
        </div>
        <p class="d-destacado">La raya de una fracción es un <b>÷</b>. Por eso «kilómetros por hora» es «kilómetros <b>divididos entre</b> horas».</p>`
    },
    {
      titulo: 'Sumar con el mismo abajo',
      html: `
        <h2>Sumar y restar: con el mismo abajo, es directo</h2>
        <div class="d-tarjetas">
          <div class="d-tarjeta"><span class="d-num">Mismo abajo</span>${mt(fr(n(1), n(5)), mas, fr(n(2), n(5)), igual, fr(n(3), n(5)))}<small class="d-pie-tarjeta">1 quinto más 2 quintos: 3 quintos</small></div>
          <div class="d-tarjeta d-tarjeta-mal"><span class="d-num">Mal: arriba con arriba y abajo con abajo</span>${mt(fr(n(1), n(2)), mas, fr(n(1), n(3)), igual, fr(n(2), n(5)))}<small class="d-pie-tarjeta">2/5 es menos que medio: imposible</small></div>
        </div>
        <p class="d-destacado">Con el mismo abajo, los pedazos son del mismo tamaño: se suman los de arriba y <b>abajo queda igual</b>.</p>`
    },
    {
      titulo: 'La mariposa',
      html: `
        <h2>Distinto abajo: la mariposa</h2>
        <div class="d-pasos d-pasos-grandes">
          ${mt(fr(n(1), n(2)), mas, fr(n(1), n(3)))}
          <span class="d-flecha"></span>
          ${mt(fr(`${ext(prod(n(1), n(3)))} ${mas} ${ext(prod(n(2), n(1)))}`, med(prod(n(2), n(3)))))}
          <span class="d-flecha"></span>
          ${mt(fr(`${n(3)} ${mas} ${n(2)}`, n(6)), igual, fr(n(5), n(6)))}
        </div>
        <p>Las dos multiplicaciones <b class="ext">en cruz</b> van arriba (las alas); la de <b class="med">abajo con abajo</b> va abajo (el cuerpo).</p>
        <p class="d-destacado">Para restar es igual, con − en el medio. Al final, si se puede, se simplifica: ${mt(fr(n(4), n(8)), igual, fr(n(1), n(2)))}.</p>`
    },
    {
      titulo: 'Multiplicar fracciones',
      html: `
        <h2>Multiplicar: arriba con arriba, abajo con abajo</h2>
        <div class="d-pasos d-pasos-grandes">
          ${mt(fr(n(2), n(3)), por, fr(n(9), n(4)), igual, fr(`${n(2)} ${por} ${n(9)}`, `${n(3)} ${por} ${n(4)}`), igual, fr(n(18), n(12)), igual, fr(n(3), n(2)))}
        </div>
        <p>Atajo: <b>tachar antes de multiplicar</b>. Un número de arriba y uno de abajo se pueden dividir entre lo mismo:</p>
        <div class="d-pasos">${mt(fr(`${tach(n(2))}<sub class="d-nuevo">1</sub>`, `${tach(n(3))}<sub class="d-nuevo">1</sub>`), por, fr(`${tach(n(9))}<sub class="d-nuevo">3</sub>`, `${tach(n(4))}<sub class="d-nuevo">2</sub>`), igual, fr(n(3), n(2)))}</div>
        <p class="d-nota">Con unidades pasa lo mismo: ${mt(fr(un('km'), tach(un('h'))), por, tach(un('h')), igual, un('km'))}.</p>`
    },
    {
      titulo: 'Dividir entre una fracción',
      html: `
        <h2>Dividir entre una fracción: extremos y medios</h2>
        <div class="d-pasos">
          ${mt(n(6), entre, fr(n(1), n(2)))}
          <span class="d-flecha"></span>
          ${mt(doble(fr(ext(n(6)), med(n(1))), fr(med(n(1)), ext(n(2)))))}
          <span class="d-flecha"></span>
          ${mt(fr(`${ext(n(6))} ${por} ${ext(n(2))}`, `${med(n(1))} ${por} ${med(n(1))}`), igual, n(12))}
        </div>
        <p>Una encima de la otra (el 6 lleva un 1 abajo). Los <b class="ext">extremos</b>, las puntas, van arriba; los <b class="med">medios</b>, abajo. Como un sándwich: el pan arriba y el relleno abajo.</p>
        <p class="d-destacado">¿Tiene sentido? Es preguntar <b>cuántas mitades caben en 6</b>: 12.</p>`
    },
    {
      titulo: 'Abajo del abajo',
      html: `
        <h2>Lo que está abajo del abajo, sube</h2>
        <div class="mt mt-bloque d-formula">
          ${un('km')} ${entre} ${fr(un('km'), un('h'))} ${igual} ${doble(fr(ext(un('km')), med(n(1))), fr(med(un('km')), ext(un('h'))))} ${igual} ${fr(`${tach(un('km'))} ${por} ${ext(un('h'))}`, `${med(n(1))} ${por} ${tach(un('km'))}`)} ${igual} ${un('h')}
        </div>
        <p>La h estaba abajo del abajo: es un <b class="ext">extremo</b> y <b>termina arriba</b>.</p>
        <p class="d-destacado">Por eso, con ${mt(vr('t'), igual, fr(vr('d'), vr('v')))}, ${mt(qn(150, 'km'), entre, qn(60, 'km/h'), igual, q(2.5, 'h'))}: el resultado sale en horas, y la unidad lo confirma.</p>`
    },
    {
      titulo: 'Su turno: las mesas de fracciones',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('regla')}</div>
        <h2>Su turno: las mesas de fracciones</h2>
        <ul class="d-lista">
          <li>Abra <b>Fracciones</b>: primero la mesa de sumas y restas (retos 1 a 5), después la de multiplicar y dividir (retos 1 a 7).</li>
          <li>Antes de tocar, diga qué va a hacer: ¿mismo abajo o mariposa? ¿Cuáles son los extremos?</li>
          <li>En los que tienen unidades, diga primero en qué unidad va a quedar.</li>
        </ul>`
    },
    // ---------------- Parte 2 · signos y orden ----------------
    {
      titulo: 'Sumar con signos',
      html: `
        <h2>Sumar y restar con signos: piense en plata</h2>
        <div class="d-tarjetas">
          <div class="d-tarjeta"><span class="d-num">Debe 5 y paga 3</span>${mt(n('−5'), op('+'), n(3), igual, n('−2'))}<small class="d-pie-tarjeta">todavía debe 2</small></div>
          <div class="d-tarjeta"><span class="d-num">Debe 5 y se endeuda 3 más</span>${mt(n('−5'), op('−'), n(3), igual, n('−8'))}<small class="d-pie-tarjeta">ahora debe 8</small></div>
          <div class="d-tarjeta"><span class="d-num">Le perdonan una deuda de 2</span>${mt(n(7), op('−'), neg(-2), igual, n(7), op('+'), n(2), igual, n(9))}<small class="d-pie-tarjeta">quitar una deuda es ganar</small></div>
        </div>
        <p class="d-destacado">Dos signos menos seguidos se vuelven un más: ${mt(op('−'), neg(-2), igual, op('+'), n(2))}.</p>`
    },
    {
      titulo: 'Multiplicar con signos',
      html: `
        <h2>Multiplicar y dividir: solo importa si son iguales</h2>
        <div class="d-tabla-envoltura">
          <table class="d-tabla">
            <thead><tr><th>Signos</th><th>Resultado</th><th>Ejemplo</th></tr></thead>
            <tbody>
              <tr><td>iguales</td><td><b>+</b></td><td>${mt(neg(-3), por, neg(-4), igual, n(12))}</td></tr>
              <tr><td>distintos</td><td><b>−</b></td><td>${mt(neg(-3), por, n(4), igual, n('−12'))}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="d-destacado d-ojo">Ojo con el paréntesis: ${mt(`${pot(neg(-3), 2)}`, igual, n(9))}, pero ${mt(`${pot(n('−3'), 2)}`, igual, n('−9'))}. Sin paréntesis, el cuadrado es solo del 3.</p>`
    },
    {
      titulo: 'El orden',
      html: `
        <h2>El orden de las operaciones</h2>
        <ol class="d-orden">
          <li><b>Paréntesis</b>: lo de adentro primero.</li>
          <li><b>Potencias y raíces.</b></li>
          <li><b>Multiplicar y dividir</b>, de izquierda a derecha.</li>
          <li><b>Sumar y restar</b>, de izquierda a derecha.</li>
        </ol>
        <div class="d-pasos">${mt(n(2), op('+'), n(3), por, `${pot(n(4), 2)}`, igual, n(2), op('+'), n(3), por, n(16), igual, n(2), op('+'), n(48), igual, n(50))}</div>
        <p class="d-nota">Si se suma primero, 5 · 16 = 80: mal. La multiplicación «pega más fuerte» que la suma.</p>`
    },
    {
      titulo: 'Izquierda a derecha',
      html: `
        <h2>La trampa: multiplicar no va antes que dividir</h2>
        <div class="d-tarjetas">
          <div class="d-tarjeta"><span class="d-num">Bien: de izquierda a derecha</span>${mt(n(8), entre, n(4), por, n(2), igual, n(2), por, n(2), igual, n(4))}</div>
          <div class="d-tarjeta d-tarjeta-mal"><span class="d-num">Mal: multiplicar primero</span>${mt(n(8), entre, n(4), por, n(2), igual, n(8), entre, n(8), igual, n(1))}</div>
        </div>
        <p class="d-destacado">Multiplicar y dividir tienen el <b>mismo rango</b>, igual que sumar y restar: se hacen en el orden en que aparecen.</p>`
    },
    {
      titulo: 'Su turno: la mesa de operaciones',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('objetivo')}</div>
        <h2>Su turno: la mesa de operaciones</h2>
        <ul class="d-lista">
          <li>Abra <b>Signos y orden</b> y haga los retos 1 a 6. Los demás quedan de tarea.</li>
          <li>Toque la operación que va primero y escriba cuánto da.</li>
          <li>Antes de tocar, diga por qué esa va primero.</li>
        </ul>`
    },
    // ---------------- Parte 3 · potencias con letras ----------------
    {
      titulo: 'Contar',
      html: `
        <h2>Un exponente cuenta cuántas veces está la letra</h2>
        <div class="d-tarjetas">
          <div class="d-tarjeta"><span class="d-num">Con letras</span>${mt(pot(vr('x'), 3), igual, xs(3))}</div>
          <div class="d-tarjeta"><span class="d-num">Con números</span>${mt(pot(n(2), 3), igual, prod(n(2), n(2), n(2)), igual, n(8))}</div>
        </div>
        <p class="d-destacado d-ojo">${mt(pot(n(2), 3))} no es 2 · 3 = 6. El exponente dice <b>cuántas veces</b> se repite el número.</p>
        <p class="d-nota">Una letra sola está una vez: ${mt(vr('a'), igual, pot(vr('a'), 1))}.</p>`
    },
    {
      titulo: 'Multiplicar: se suman',
      html: `
        <h2>Al multiplicar, los exponentes se suman</h2>
        <div class="d-pasos d-pasos-grandes">${mt(pot(vr('x'), 2), por, pot(vr('x'), 3), igual, op('('), xs(2), op(')'), por, op('('), xs(3), op(')'), igual, pot(vr('x'), 5))}</div>
        <p>Hay 2 equis y después 3: en total, 5. No hace falta memorizarlo: basta con contar.</p>
        <p class="d-destacado">Números con números, letras con letras: ${mt(pega(n(3), pot(vr('x'), 2)), por, pega(n(2), pot(vr('x'), 3)), igual, pega(n(6), pot(vr('x'), 5)))}.</p>`
    },
    {
      titulo: 'Dividir: se restan',
      html: `
        <h2>Al dividir, los exponentes se restan</h2>
        <div class="d-pasos d-pasos-grandes">${mt(fr(pot(vr('x'), 5), pot(vr('x'), 2)), igual, fr(`${tach(vr('x'))} ${por} ${tach(vr('x'))} ${por} ${xs(3)}`, `${tach(vr('x'))} ${por} ${tach(vr('x'))}`), igual, pot(vr('x'), 3))}</div>
        <p>Igual que con las unidades: una x arriba y otra abajo se cancelan. Se tacharon 2 parejas y quedaron 3 x.</p>
        <p class="d-destacado">Si se tachan todas, queda 1: ${mt(fr(pot(vr('t'), 3), pot(vr('t'), 3)), igual, n(1))}.</p>`
    },
    {
      titulo: 'En las fórmulas',
      html: `
        <h2>Para qué sirve: simplificar fórmulas</h2>
        <div class="d-tarjetas">
          <div class="d-tarjeta"><span class="d-num">Números y letras</span>${mt(fr(pega(n(6), pot(vr('x'), 5)), pega(n(2), pot(vr('x'), 2))), igual, pega(n(3), pot(vr('x'), 3)))}<small class="d-pie-tarjeta">6 ÷ 2 = 3 y 5 − 2 = 3</small></div>
          <div class="d-tarjeta"><span class="d-num">Una fórmula de física</span>${mt(fr(prod(vr('m'), pot(vr('v'), 2)), vr('v')), igual, prod(vr('m'), vr('v')))}<small class="d-pie-tarjeta">una v arriba y otra abajo se cancelan</small></div>
        </div>
        <p class="d-destacado">Primero se simplifica con letras y después se reemplazan los números: las cuentas quedan más cortas.</p>`
    },
    {
      titulo: 'Su turno: la mesa de exponentes',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('flechaD')}</div>
        <h2>Su turno: la mesa de exponentes</h2>
        <ul class="d-lista">
          <li>Abra <b>Potencias</b> y haga los retos 1 a 6.</li>
          <li>Antes de desarmar, diga cómo cree que va a quedar.</li>
          <li>Después, la práctica: ejercicios 1 a 5 en papel.</li>
        </ul>`
    }
  ];

  const PARTES = [
    { id: 'p1', nombre: 'Parte 1 · fracciones', corto: 'Parte 1 · fracciones', desde: 0, hasta: 7, minutos: '8 min' },
    { id: 'p2', nombre: 'Parte 2 · signos y orden', corto: 'Parte 2 · signos y orden', desde: 8, hasta: 12, minutos: '6 min' },
    { id: 'p3', nombre: 'Parte 3 · potencias', corto: 'Parte 3 · potencias', desde: 13, hasta: 17, minutos: '6 min' }
  ];

  MA.Clase2 = { DIAPOSITIVAS, PARTES };
})();
