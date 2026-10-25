/* =====================================================================
   CLASE 2 · ideas clave (diapositivas del módulo 2)
   ---------------------------------------------------------------------
   Tres bloques cortos, cada uno justo antes de su herramienta:
     parte 1 (diapositivas 1-6)   -> antes de la mesa de fracciones
     parte 2 (diapositivas 7-11)  -> antes de la mesa de operaciones
     parte 3 (diapositivas 12-16) -> antes del corredor de la coma
   Las diapositivas le hablan de usted al estudiante.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { icono } = MA;
  const { vr, un, n, op, fr, mt, q, tach } = MA.f;
  const { p10, sup, pot, cien, neg } = MA.M2;
  const por = op('·'), igual = op('='), entre = op('÷');
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
            <li>Dividir entre una fracción, también cuando tiene unidades, como ${mt(un('km'), entre, un('km/h'))}.</li>
            <li>Resolver operaciones con signos en el orden correcto.</li>
            <li>Usar potencias de 10 y notación científica sin calculadora.</li>
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
        <h2>Dividir entre una fracción: dar vuelta y multiplicar</h2>
        <div class="d-pasos d-pasos-grandes">
          ${mt(n(6), entre, fr(n(1), n(2)))}
          <span class="d-flecha">se da vuelta la que divide</span>
          ${mt(n(6), por, fr(n(2), n(1)), igual, n(12))}
        </div>
        <p>¿Por qué? Porque la pregunta es <b>cuántas mitades caben en 6</b>. En cada entero caben 2 mitades: en 6 enteros, 12.</p>
        <p class="d-destacado d-ojo">Se da vuelta <b>solo la fracción que divide</b> (la de la derecha del ÷), nunca la primera.</p>`
    },
    {
      titulo: 'Abajo del abajo',
      html: `
        <h2>Lo que está abajo del abajo, sube</h2>
        <p>Con ${mt(vr('t'), igual, fr(vr('d'), vr('v')))}, si ${mt(vr('d'), igual, qn(150, 'km'))} y ${mt(vr('v'), igual, qn(60, 'km/h'))}:</p>
        <div class="mt mt-bloque d-formula">
          ${un('km')} ${entre} ${fr(un('km'), un('h'))} ${igual} ${tach(un('km'))} ${por} ${fr(un('h'), tach(un('km')))} ${igual} ${un('h')}
        </div>
        <p>La h estaba dividiendo a algo que dividía: dos divisiones se cancelan y la h <b>termina arriba</b>.</p>
        <p class="d-destacado">Por eso ${mt(n(150), entre, n(60), igual, q(2.5, 'h'))}: el resultado sale en horas, y la unidad lo confirma.</p>`
    },
    {
      titulo: 'Su turno: la mesa de fracciones',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('regla')}</div>
        <h2>Su turno: la mesa de fracciones</h2>
        <ul class="d-lista">
          <li>Abra <b>Fracciones</b> y haga los retos 1 a 7.</li>
          <li>Antes de tocar, diga cuál fracción se da vuelta y por qué.</li>
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
          <li>Abra <b>Operaciones</b> y haga los retos 1 a 9.</li>
          <li>Toque la operación que va primero y escriba cuánto da.</li>
          <li>Antes de tocar, diga por qué esa va primero.</li>
        </ul>`
    },
    // ---------------- Parte 3 · potencias ----------------
    {
      titulo: 'Contar las x',
      html: `
        <h2>Un exponente cuenta cuántas veces se multiplica</h2>
        <div class="d-pasos">${mt(`${pot(vr('x'), 2)}`, por, `${pot(vr('x'), 3)}`, igual, op('('), xs(2), op(')'), por, op('('), xs(3), op(')'), igual, `${pot(vr('x'), 5)}`)}</div>
        <p>Hay 2 equis y después 3: en total, 5. Al multiplicar, los exponentes <b>se suman</b>.</p>
        <div class="d-pasos">${mt(fr(`${pot(vr('x'), 5)}`, `${pot(vr('x'), 2)}`), igual, fr(`${tach(vr('x'))} ${por} ${tach(vr('x'))} ${por} ${xs(3)}`, `${tach(vr('x'))} ${por} ${tach(vr('x'))}`), igual, `${pot(vr('x'), 3)}`)}</div>
        <p class="d-destacado">Al dividir, las x se tachan por parejas: los exponentes <b>se restan</b>. No hace falta memorizarlo: basta con contar.</p>`
    },
    {
      titulo: 'Exponentes negativos',
      html: `
        <h2>Cada vez que el exponente baja 1, se divide entre 10</h2>
        <div class="d-escala10">
          ${[[3, '1000', 'kilo'], [2, '100', ''], [1, '10', ''], [0, '1', ''], [-1, '0,1', ''], [-2, '0,01', 'centi'], [-3, '0,001', 'mili']].map(([e, v, pre]) => `
            <div class="${e === 0 ? 'd-escala-cero' : ''}"><span class="mt">${p10(e)}</span><b>${v}</b><small>${pre}</small></div>`).join('')}
        </div>
        <p>Un exponente negativo significa «uno dividido entre»: ${mt(p10(-3), igual, fr(n(1), p10(3)), igual, fr(n(1), n(1000)))}.</p>
        <p class="d-destacado">Son los mismos prefijos del módulo 1: <b>kilo</b> es ${p10(3)} y <b>mili</b> es ${p10(-3)}. El pH del módulo 6 también es un exponente.</p>`
    },
    {
      titulo: 'Notación científica',
      html: `
        <h2>Notación científica: un número entre 1 y 10 por una potencia de 10</h2>
        <div class="d-tarjetas">
          <div class="d-tarjeta"><span class="d-num">Grande</span>${mt(n(3400000), igual, cien(3.4, 6))}<small class="d-pie-tarjeta">la coma se movió 6 lugares a la izquierda</small></div>
          <div class="d-tarjeta"><span class="d-num">Pequeño</span>${mt(n('0,00072'), igual, cien(7.2, -4))}<small class="d-pie-tarjeta">la coma se movió 4 lugares a la derecha</small></div>
        </div>
        <p class="d-destacado">Si el número se achica, la potencia crece para compensar, y al revés: <b>la cantidad no cambia</b>, igual que al convertir unidades.</p>`
    },
    {
      titulo: 'Multiplicar sin calculadora',
      html: `
        <h2>Multiplicar en notación científica</h2>
        <div class="d-pasos d-pasos-grandes">
          ${mt(op('('), cien(3, 4), op(')'), por, op('('), cien(2, -6), op(')'))}
          <span class="d-flecha">números con números, potencias con potencias</span>
          ${mt(op('('), n(3), por, n(2), op(')'), op('×'), pot(n(10), '4 + (−6)'), igual, cien(6, -2))}
        </div>
        <p class="d-destacado">Así se hacen sin calculadora las cuentas del examen con números muy grandes o muy pequeños.</p>`
    },
    {
      titulo: 'Su turno: el corredor de la coma',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('flechaD')}</div>
        <h2>Su turno: el corredor de la coma</h2>
        <ul class="d-lista">
          <li>Abra <b>Potencias</b> y haga los retos 1 a 6.</li>
          <li>Antes de mover la coma, diga hacia dónde va y si el exponente sube o baja.</li>
          <li>Después, la práctica: ejercicios 1 a 6 en papel.</li>
        </ul>`
    }
  ];

  const PARTES = [
    { id: 'p1', nombre: 'Parte 1 · fracciones', corto: 'Parte 1 · fracciones', desde: 0, hasta: 5, minutos: '6 min' },
    { id: 'p2', nombre: 'Parte 2 · signos y orden', corto: 'Parte 2 · signos y orden', desde: 6, hasta: 10, minutos: '6 min' },
    { id: 'p3', nombre: 'Parte 3 · potencias', corto: 'Parte 3 · potencias', desde: 11, hasta: 15, minutos: '6 min' }
  ];

  MA.Clase2 = { DIAPOSITIVAS, PARTES };
})();
