/* =====================================================================
   Clase 3 · ideas clave (diapositivas del módulo 3)
   ---------------------------------------------------------------------
   Tres bloques cortos, cada uno justo antes de su herramienta:
     parte 1 (diapositivas 1-9)   -> antes de la mesa de áreas
     parte 2 (diapositivas 10-13) -> antes de la diferencia de cuadrados
     parte 3 (diapositivas 14-21) -> antes de la llave maestra
   Las diapositivas le hablan de usted al estudiante.
   Respuestas tapadas: lo que el tutor pregunta en el guion no se ve
   hasta revelarlo (MA.f.oculto, con «Revelar» o con la flecha). Así
   primero contesta él y después se compara.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { icono } = MA;
  const { vr, n, op, fr, mt, pega, raiz, oculto, ocultoBloque, cambia, desde } = MA.f;
  const { pot, neg } = MA.M2;
  const C = MA.M3;
  const { P, F, Pr, leer } = C;
  const por = op('·'), igual = op('='), mas = op('+'), menos = op('−');
  const rect = (alto, ancho, o = {}) => `<div class="d-rect">${C.rectanguloHtml(leer(alto), leer(ancho), o)}</div>`;
  // Los pedazos del rectángulo, tapados hasta revelarlos
  const pedazosTapados = (alto, ancho, paso = 1) => (i, j) => oculto(C.terminoHtml(C.multiplicarTerminos(leer(alto)[i], leer(ancho)[j])), paso);
  const medio = pega(n(2), C.par(`${vr('x')} ${menos} ${fr(n(1), n(2))}`));

  // La altura de una piedra lanzada hacia arriba: h = 20t − 5t², de t = 0 a t = 4.
  // Los puntos del suelo (t = 0 y t = 4) se tapan hasta el paso «tapar».
  function graficaPiedra(tapar) {
    const X = t => 40 + t * 62, Y = h => 168 - h * 6.6;
    const puntos = Array.from({ length: 41 }, (_, k) => { const t = k / 10; return `${X(t).toFixed(1)} ${Y(20 * t - 5 * t * t).toFixed(1)}`; });
    const t = '<tspan class="dc-vr">t</tspan>', h = '<tspan class="dc-vr">h</tspan>';
    const tapa = tapar ? ` data-paso="${tapar}"` : '', clase = tapar ? ' d-oculta-svg' : '';
    return `
      <svg class="d-grafica" viewBox="0 0 330 200" role="img" aria-label="${tapar ? 'La altura de la piedra sube y vuelve al suelo' : 'La altura de la piedra sube y vuelve a cero en t = 0 y en t = 4'}">
        <path class="dg-suelo" d="M20 168H322"/>
        <path class="dg-curva" d="M${puntos.join(' L')}"/>
        <circle class="dg-raiz${clase}"${tapa} cx="${X(0)}" cy="168" r="5.5"/>
        <circle class="dg-raiz${clase}"${tapa} cx="${X(4)}" cy="168" r="5.5"/>
        <text x="${X(0)}" y="190" text-anchor="middle" class="dg-etq${clase}"${tapa}>${t} = 0</text>
        <text x="${X(4)}" y="190" text-anchor="middle" class="dg-etq${clase}"${tapa}>${t} = 4</text>
        <text x="${X(2)}" y="${Y(20) - 10}" text-anchor="middle" class="dg-etq dg-suave">${h} = 20 m</text>
        <text x="${X(2)}" y="190" text-anchor="middle" class="dg-etq dg-suave">Suelo: ${h} = 0</text>
      </svg>`;
  }

  const DIAPOSITIVAS = [
    // ---------------- Parte 1 · armar y desarmar ----------------
    {
      titulo: 'Portada',
      html: `
        <div class="d-portada">
          <p class="d-kicker">Módulo 3 · clase 3</p>
          <h2>Factorización: armar y desarmar</h2>
          <p class="d-sub">En este módulo va a poder:</p>
          <ul class="d-lista">
            <li>Juntar términos del mismo tipo y multiplicar con la distributiva, como ${mt(Pr('x + 2', 'x + 3'))}.</li>
            <li>Sacar factor común sin MCM, con tres preguntas.</li>
            <li>Factorizar cualquier trinomio con una sola llave: la fórmula cuadrática.</li>
          </ul>
        </div>`
    },
    {
      titulo: 'Tres piezas',
      html: `
        <h2>Juntar: solo lo del mismo tipo</h2>
        <div class="d-piezas">
          <div>${C.piezaHtml([1, 2])}<small>un cuadrado de lado ${vr('x')}</small></div>
          <div>${C.piezaHtml([1, 1])}<small>una tira de ${vr('x')} por 1</small></div>
          <div>${C.piezaHtml([1, 0])}<small>un cuadradito de 1 por 1</small></div>
        </div>
        <div class="d-tarjetas">
          <div class="d-tarjeta"><span class="d-num">Del mismo tipo</span>${mt(P('2x + 3x'), igual, oculto(P('5x')))}<small class="d-pie-tarjeta">${oculto('2 tiras y 3 tiras: 5 tiras', 1, '')}</small></div>
          <div class="d-tarjeta"><span class="d-num">De distinto tipo</span>${mt(P('x2 + x'), igual, oculto(P('x2 + x')))}<small class="d-pie-tarjeta">${oculto('un cuadrado y una tira no se juntan: queda igual', 1, '')}</small></div>
        </div>
        ${ocultoBloque('<p class="d-destacado">Es como con las unidades: 2 m + 3 m = 5 m, pero 2 m² + 3 m no se juntan.</p>')}`
    },
    {
      titulo: 'Sumar no es multiplicar',
      html: `
        <h2>Sumar no es multiplicar</h2>
        <div class="d-tarjetas">
          <div class="d-tarjeta"><span class="d-num">Sumar</span>${mt(P('x + x'), igual, oculto(P('2x')))}<small class="d-pie-tarjeta">${oculto('la letra no cambia: dos tiras', 1, '')}</small></div>
          <div class="d-tarjeta"><span class="d-num">Multiplicar</span>${mt(vr('x'), por, vr('x'), igual, oculto(P('x2')))}<small class="d-pie-tarjeta">${oculto('las letras se cuentan: un cuadrado de lado x', 1, '')}</small></div>
        </div>
        ${ocultoBloque(`<p class="d-destacado">Como en el módulo 2: ${mt(pot(vr('x'), 2), por, pot(vr('x'), 3), igual, pot(vr('x'), 5))}, pero ${mt(P('x2 + x2'), igual, P('2x2'))}. Al sumar, los exponentes no se tocan.</p>`)}`
    },
    {
      titulo: 'Armar: la distributiva',
      html: `
        <h2>Armar: una multiplicación es un rectángulo</h2>
        <div class="d-dos">
          ${rect('3', 'x + 2', { celda: pedazosTapados('3', 'x + 2'), etiqueta: 'Rectángulo de 3 por x + 2, con sus dos pedazos por calcular' })}
          <div>
            <p>Los lados son los factores y el área es el resultado. Cada pedazo es lado por lado.</p>
            <div class="d-pasos">${mt(Pr('3', 'x + 2'), igual, oculto(P('3x + 6')))}</div>
          </div>
        </div>
        ${ocultoBloque(`<p class="d-destacado d-ojo">El 3 multiplica a todos los de adentro: ${mt(Pr('3', 'x + 2'))} no es ${mt(P('3x + 2'))}.</p>`, 2)}`
    },
    {
      titulo: 'Todos contra todos',
      html: `
        <h2>Dos paréntesis: todos contra todos</h2>
        <div class="d-dos">
          ${ocultoBloque(rect('x + 2', 'x + 3', { etiqueta: 'Rectángulo de x + 2 por x + 3: un cuadrado x², dos tiras 3x y 2x y un pedazo de 6' }), 1, '?')}
          <div>
            <div class="d-pasos">${mt(Pr('x + 2', 'x + 3'))}</div>
            <div class="d-pasos">${mt(igual, oculto(P('x2 + 3x + 2x + 6')))}</div>
            <div class="d-pasos">${desde(`${igual} ${oculto(P('x2 + 5x + 6'), 2)}`, 2)}</div>
            ${ocultoBloque('<p class="d-nota">Los dos pedazos del medio son del mismo tipo: se juntan.</p>', 2)}
          </div>
        </div>
        ${ocultoBloque(`<p class="d-destacado d-ojo">${mt(Pr('x + 2', 'x + 3'))} no es ${mt(P('x2 + 6'))}: faltan los del medio.</p>`, 2)}`
    },
    {
      titulo: 'Desarmar: el factor común',
      html: `
        <h2>Desarmar: buscar el lado que comparten</h2>
        <div class="d-dos">
          ${rect('3', '2x + 3', { uniforme: true, area: (i, j) => leer('6x + 9')[j], lado: (tipo, k) => oculto(C.terminoHtml(tipo === 'fila' ? [3, 0] : leer('2x + 3')[k])), etiqueta: 'Dos pedazos, 6x y 9, con los lados por descubrir' })}
          <div>
            <p>Ahora al revés: se conocen los pedazos y se buscan los lados.</p>
            <div class="d-pasos">${mt(P('6x + 9'), igual, oculto(Pr('3', '2x + 3')))}</div>
            ${ocultoBloque('<p class="d-nota">El 3 está en los dos pedazos: 6 = 3 · 2 y 9 = 3 · 3.</p>')}
          </div>
        </div>
        <p class="d-destacado">Factorizar es el camino de vuelta de la distributiva. Y siempre se puede comprobar armando.</p>`
    },
    {
      titulo: 'Sacar de a poco',
      html: `
        <h2>Sacar de a poco, con tres preguntas</h2>
        <ol class="d-orden">
          <li>¿Todos son <b>pares</b>? (terminan en 0, 2, 4, 6 u 8)</li>
          <li>¿Todos <b>terminan en 0 o en 5</b>?</li>
          <li>¿Todos están en la <b>tabla del 3</b>? (sus cifras suman 3, 6, 9…)</li>
        </ol>
        <div class="d-pasos">${mt(P('12x + 18'), igual, oculto(Pr('2', '6x + 9')), desde(`${igual} ${oculto(Pr('6', '2x + 3'), 2)}`, 2))}</div>
        <div class="d-nota">${ocultoBloque('Primero los dos son pares: sale un 2.')}${ocultoBloque('Después, 6 y 9 están en la tabla del 3: sale un 3. Afuera queda 2 · 3 = 6.', 2)}</div>`
    },
    {
      titulo: 'También las letras',
      html: `
        <h2>También las letras, y si se saca todo, ¿qué queda?</h2>
        <div class="d-tarjetas">
          <div class="d-tarjeta"><span class="d-num">Letras: x² = x · x</span>${mt(P('6x2 + 9x'), igual, Pr('3x', '2x + 3'))}<small class="d-pie-tarjeta">el 3 y una x están en los dos</small></div>
          <div class="d-tarjeta"><span class="d-num">Si se saca todo</span>${mt(P('4x + 4'), igual, oculto(Pr('4', 'x + 1')))}<small class="d-pie-tarjeta">${oculto('queda 1, porque 4 ÷ 4 = 1, no 0', 1, '')}</small></div>
        </div>
        <p class="d-destacado">Para comprobar, se arma de vuelta: ${mt(P('3x'), por, P('2x'), mas, P('3x'), por, n(3), igual, P('6x2 + 9x'))}.</p>`
    },
    {
      titulo: 'Su turno: la mesa de áreas',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('cuadricula')}</div>
        <h2>Su turno: la mesa de áreas</h2>
        <ul class="d-lista">
          <li>Abra <b>Armar y desarmar</b>: retos 1 y 2 (juntar), 3 a 5 (armar) y 6 a 10 (desarmar).</li>
          <li>En cada pedazo, diga primero el número y después la letra.</li>
          <li>Al desarmar, antes de tocar «Sacar», diga por qué está en todos.</li>
        </ul>`
    },
    // ---------------- Parte 2 · diferencia de cuadrados ----------------
    {
      titulo: 'Un cuadrado menos otro',
      html: `
        <h2>Un cuadrado menos otro cuadrado</h2>
        <div class="d-dos">
          <div class="d-svg d-figura">${C.figuraCuadradosSvg(1, { tapar: 1 })}</div>
          <div>
            <p>A un cuadrado de lado ${vr('x')} se le quita un cuadradito de lado 3.</p>
            <p class="d-grande">Queda ${mt(oculto(`${P('x2')} ${menos} ${n(9)}`))}</p>
            <p class="d-nota">¿Se puede reacomodar lo que queda en un rectángulo?</p>
          </div>
        </div>`
    },
    {
      titulo: 'Cortar y pegar',
      html: `
        <h2>Cortar y pegar: queda un rectángulo</h2>
        <div class="d-dos">
          <div class="d-svg d-figura">${C.figuraCuadradosSvg(3, { vista: '0 0 300 140', sinEcuacion: true })}</div>
          <div>
            <p>Se corta en dos y un pedazo se gira y se pega al lado. El área no cambió.</p>
            <p class="d-grande">${mt(P('x2 - 9'), igual, Pr('x + 3', 'x - 3'))}</p>
          </div>
        </div>
        <p class="d-destacado">Un cuadrado menos otro: (raíz + raíz)(raíz − raíz).</p>`
    },
    {
      titulo: 'Cómo se reconoce',
      html: `
        <h2>¿Cómo se reconoce?</h2>
        <ol class="d-orden">
          <li>Son <b>dos términos</b>.</li>
          <li>Hay una <b>resta</b>.</li>
          <li>Los dos son <b>cuadrados</b>: ${mt(P('x2'), igual, vr('x'), por, vr('x'))}, ${mt(n(9), igual, n(3), por, n(3))}, ${mt(P('4x2'), igual, P('2x'), por, P('2x'))}.</li>
        </ol>
        <div class="d-tarjetas">
          <div class="d-tarjeta"><span class="d-num">Sí</span>${mt(P('4x2 - 25'), igual, Pr('2x + 5', '2x - 5'))}</div>
          <div class="d-tarjeta"><span class="d-num">¿Y con suma?</span>${mt(P('x2 + 9'))}<small class="d-pie-tarjeta">${oculto('no se puede desarmar: es una suma')}</small></div>
        </div>
`
    },
    {
      titulo: 'Su turno: diferencia de cuadrados',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('cuadrados')}</div>
        <h2>Su turno: diferencia de cuadrados</h2>
        <ul class="d-lista">
          <li>Abra <b>Diferencia de cuadrados</b> y mire «Cortar y mover» paso a paso.</li>
          <li>Después, la mesa: retos 1 a 5.</li>
          <li>Antes de cada raíz, diga qué multiplicado por sí mismo da ese número.</li>
        </ul>`
    },
    // ---------------- Parte 3 · la llave maestra ----------------
    {
      titulo: 'Raíces',
      html: `
        <h2>Raíces: cuando vale cero</h2>
        <div class="d-dos d-dos-grafica">
          <div class="d-svg">${graficaPiedra(2)}</div>
          <div>
            <p>La altura de una piedra lanzada hacia arriba: ${mt(vr('h'), igual, P('20t - 5t2', 't'), igual, oculto(pega(P('5t', 't'), F('4 - t', 't'))))}</p>
            ${ocultoBloque('<p class="d-nota">Está en el suelo (h = 0) cuando 5t = 0 o cuando 4 − t = 0: en t = 0 y en t = 4.</p>', 2)}
            <p class="d-nota">Ojo: aquí «raíz» no es √, sino un número que hace cero la expresión.</p>
          </div>
        </div>
        <p class="d-destacado">Si una multiplicación da 0, uno de los factores es 0: esas son las <b>raíces</b>.</p>`
    },
    {
      titulo: 'Dos caras de la misma moneda',
      html: `
        <h2>Dos caras de la misma moneda</h2>
        <p>Si factoriza, encuentra las raíces: ${mt(Pr('x - 2', 'x - 3'))} vale 0 con ${mt(vr('x'), igual, n(2))} y con ${mt(vr('x'), igual, n(3))}. Si encuentra las raíces, arma los paréntesis: cada raíz da ${mt(C.par(`${vr('x')} ${menos} raíz`))}.</p>
        <div class="d-tarjetas">
          <div class="d-tarjeta"><span class="d-num">Raíz 2</span>${mt(F('x - 2'))}<small class="d-pie-tarjeta">con x = 2: 2 − 2 = 0</small></div>
          <div class="d-tarjeta"><span class="d-num">Raíz −3</span>${mt(vr('x'), menos, neg(-3), igual, oculto(F('x + 3')))}<small class="d-pie-tarjeta">${oculto('con x = −3: −3 + 3 = 0', 1, '')}</small></div>
        </div>
        <p class="d-destacado">Para no confundirse, se prueba: el paréntesis bueno es el que da 0 con la raíz.</p>`
    },
    {
      titulo: 'La llave maestra',
      html: `
        <h2>La llave maestra</h2>
        <p class="d-grande">${mt(`<span class="ll-coef ll-a">${pega(vr('a'), pot(vr('x'), 2))}</span>`, `<span class="ll-coef ll-b">${mas} ${pega(vr('b'), vr('x'))}</span>`, `<span class="ll-coef ll-c">${mas} ${vr('c')}</span>`)}</p>
        <div class="mt mt-bloque d-formula d-llave">${C.llaveHtml()}</div>
        <p>La <span class="ll-coef ll-a">a</span> acompaña a x², la <span class="ll-coef ll-b">b</span> acompaña a x y la <span class="ll-coef ll-c">c</span> es el número solo. Cada uno con su signo.</p>
        <p class="d-nota">Si delante de x² no hay número, a = 1. Si falta un término, vale 0.</p>`
    },
    {
      titulo: 'Reemplazar con paréntesis',
      html: `
        <h2>Reemplazar siempre con paréntesis</h2>
        <p>${mt(P('x2 - 5x + 6'))}: ${mt(vr('a'), igual, oculto(n(1)))}, ${mt(vr('b'), igual, oculto(n(-5)))}, ${mt(vr('c'), igual, oculto(n(6)))}.</p>
        <div class="mt mt-bloque d-formula">${cambia(C.llaveHtml(), C.llaveHtml({ a: 1, b: -5, c: 6 }))}</div>
        ${ocultoBloque(`<div class="d-pasos">${mt(igual, fr(`${n(5)} ${op('±')} ${raiz(`${n(25)} ${menos} ${n(24)}`)}`, n(2)), igual, fr(`${n(5)} ${op('±')} ${n(1)}`, n(2)))}<span class="d-flecha"></span>${mt(n(3), op('y'), n(2))}<span class="d-flecha"></span>${mt(Pr('x - 3', 'x - 2'))}</div>`, 2, '?')}
        ${ocultoBloque(`<p class="d-destacado d-ojo">Las tres trampas de signos: ${mt(menos, neg(-5), igual, mas, n(5))}, ${mt(pot(neg(-5), 2), igual, n(25))} y 4 · a · c cuando c es negativa.</p>`, 2)}`
    },
    {
      titulo: 'Lo que dice la raíz',
      html: `
        <h2>Lo de adentro de la raíz avisa</h2>
        <div class="d-tarjetas">
          <div class="d-tarjeta"><span class="d-num">Un cuadrado exacto</span>${mt(raiz(n(25)), igual, n(5))}<small class="d-pie-tarjeta">dos raíces: dos paréntesis distintos</small></div>
          <div class="d-tarjeta"><span class="d-num">Cero</span>${mt(raiz(n(0)), igual, n(0))}<small class="d-pie-tarjeta">una raíz repetida: el mismo paréntesis dos veces</small></div>
          <div class="d-tarjeta d-tarjeta-mal"><span class="d-num">Negativo</span>${mt(raiz(n(-16)))}<small class="d-pie-tarjeta">${oculto('no hay raíces: no se factoriza')}</small></div>
        </div>
        <p class="d-destacado">El «trinomio cuadrado perfecto» es solo el caso del cero: ${mt(P('x2 - 6x + 9'), igual, pot(F('x - 3'), 2))}.</p>
        <p class="d-nota">Cuadrados exactos: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100.</p>`
    },
    {
      titulo: 'Con a distinto de 1',
      html: `
        <h2>Con a distinto de 1, la a va adelante</h2>
        <p>${mt(P('2x2 + 3x - 2'))}: las raíces son ${mt(fr(n(1), n(2)))} y ${mt(n(-2))}.</p>
        <div class="d-pasos d-pasos-grandes">${mt(P('2x2 + 3x - 2'))}${mt(igual, pega(medio, F('x + 2')))}${mt(igual, Pr('2x - 1', 'x + 2'))}</div>
        <p class="d-destacado">El 2 entra al paréntesis de la fracción: ${mt(medio, igual, P('2x - 1'))}.</p>`
    },
    {
      titulo: '¿Qué llave abre el candado?',
      html: `
        <h2>¿Qué llave abre el candado?</h2>
        <ol class="d-orden">
          <li>¿Hay algo en todos los términos? <b>Factor común</b>.</li>
          <li>¿Son dos cuadrados con una resta? <b>Diferencia de cuadrados</b>.</li>
          <li>¿Nada de eso? <b>La llave maestra</b>: abre cualquiera con x².</li>
        </ol>
        <div class="d-pasos">${mt(P('2x2 - 18'), igual, oculto(Pr('2', 'x2 - 9')), desde(`${igual} ${oculto(Pr('2', 'x + 3', 'x - 3'), 2)}`, 2))}</div>
        ${ocultoBloque('<p class="d-destacado">Se prueban en orden y se usa la que abre. Si abre solo una parte, se mira otra vez lo que quedó.</p>', 2)}`
    },
    {
      titulo: 'Su turno: la llave maestra',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('llave')}</div>
        <h2>Su turno: la llave maestra</h2>
        <ul class="d-lista">
          <li>Abra <b>Llave maestra</b> y haga los retos 1 a 3. Los demás quedan de tarea.</li>
          <li>Antes de reemplazar, diga cuánto valen a, b y c, con su signo.</li>
          <li>Después, la práctica: en cada ejercicio, diga qué llave abre el candado antes de resolverlo.</li>
        </ul>`
    }
  ];

  const PARTES = [
    { id: 'p1', nombre: 'Parte 1 · armar y desarmar', corto: 'Parte 1 · armar y desarmar', desde: 0, hasta: 8, minutos: '9 min' },
    { id: 'p2', nombre: 'Parte 2 · diferencia de cuadrados', corto: 'Parte 2 · diferencia de cuadrados', desde: 9, hasta: 12, minutos: '5 min' },
    { id: 'p3', nombre: 'Parte 3 · llave maestra', corto: 'Parte 3 · llave maestra', desde: 13, hasta: 20, minutos: '9 min' }
  ];

  MA.Clase3 = { DIAPOSITIVAS, PARTES };
})();
