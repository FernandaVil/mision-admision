/* =====================================================================
   Clase 4 · ideas clave (diapositivas del módulo 4)
   ---------------------------------------------------------------------
   Tres bloques cortos, cada uno justo antes de su herramienta:
     parte 1 (diapositivas 1-5)   -> antes del radar con velocidad constante
     parte 2 (diapositivas 6-11)  -> antes del radar con aceleración
     parte 3 (diapositivas 12-17) -> antes de las fórmulas en la balanza
   Las diapositivas le hablan de usted al estudiante.
   Respuestas tapadas: lo que el tutor pregunta en el guion no se ve
   hasta revelarlo (MA.f.oculto, con «Revelar» o con la flecha).
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { icono } = MA;
  const { vr, n, op, fr, mt, q, pega, oculto, ocultoBloque, cambia, desde } = MA.f;
  const { pot, neg } = MA.M2;
  const C = MA.M4;
  const { L, t2, medio } = C;
  const por = op('·'), igual = op('='), mas = op('+'), menos = op('−'), entre = op('÷');
  const flecha = '<span class="d-flecha"></span>';

  // Una pista vista desde arriba con las huellas de cada segundo.
  // huellas: [[t, d], …]; avion: la distancia donde está la nariz; tapar: el paso que revela la última huella.
  function pistaFigura({ largo, huellas, avion, tapar, etiqueta }) {
    const X0 = 66, X1 = 574, x = d => X0 + d / largo * (X1 - X0);
    const tap = k => (tapar && k === huellas.length - 1 ? ` class="d-oculta-svg" data-paso="${tapar}"` : '');
    const escala = [0, 1, 2, 3, 4].map(k => {
      const d = largo * k / 4, xd = x(d).toFixed(1);
      return `<line class="rp-tick" x1="${xd}" y1="112" x2="${xd}" y2="118"/><text class="rp-etq-escala" x="${xd}" y="134" text-anchor="middle">${MA.fmt(d)}${k === 4 ? ' m' : ''}</text>`;
    }).join('');
    // Si dos huellas quedan muy juntas, la segunda va sin etiqueta (lo dice el texto de la diapositiva)
    let ultima = -99;
    const marcas = huellas.map(([t, d], k) => {
      const xd = x(d).toFixed(1), ancho = k > 0 ? x(d) - x(huellas[k - 1][1]) : 0;
      const etq = x(d) - ultima >= 34 ? `<text class="rp-etq-huella" x="${xd}" y="22" text-anchor="middle">${MA.fmt(t)} s</text>` : '';
      if (etq) ultima = x(d);
      const tramo = k > 0 && ancho >= 34 ? `<text class="rp-etq-tramo" x="${((x(d) + x(huellas[k - 1][1])) / 2).toFixed(1)}" y="104" text-anchor="middle">${MA.fmt(d - huellas[k - 1][1])} m</text>` : '';
      return `<g${tap(k)}><line class="rp-huella" x1="${xd}" y1="30" x2="${xd}" y2="52"/>${etq}${tramo}</g>`;
    }).join('');
    return `
      <svg class="rp-figura" viewBox="0 0 600 142" role="img" aria-label="${etiqueta}">
        <rect class="rp-asfalto" x="10" y="52" width="580" height="60" rx="6"/>
        <line class="rp-umbral" x1="${X0}" y1="56" x2="${X0}" y2="108"/>
        <line class="rp-eje" x1="${X0 + 8}" y1="82" x2="${X1}" y2="82"/>
        ${escala}${marcas}
        ${C.avionSvg(x(avion), 82, 1.45)}
      </svg>`;
  }

  const DIAPOSITIVAS = [
    // ---------------- Parte 1 · distancia, velocidad y tiempo ----------------
    {
      titulo: 'Portada',
      html: `
        <div class="d-portada">
          <p class="d-kicker">Módulo 4 · clase 4</p>
          <h2>Física mecánica I: cinemática</h2>
          <p class="d-sub">En este módulo va a poder:</p>
          <ul class="d-lista">
            <li>Describir un movimiento con tres datos: distancia, velocidad y tiempo.</li>
            <li>Ver en el radar la diferencia entre ir a velocidad constante y acelerar.</li>
            <li>Despejar las tres fórmulas del movimiento, como en la balanza del módulo 1.</li>
            <li>Calcular cuánta pista necesita un avión para despegar y para frenar.</li>
          </ul>
        </div>`
    },
    {
      titulo: 'Tres datos de todo movimiento',
      html: `
        <h2>Tres datos de todo movimiento</h2>
        <div class="d-tarjetas m4-tres">
          <div class="d-tarjeta"><span class="d-num">Distancia</span>${mt(L.d)}<small class="d-pie-tarjeta">¿Cuánto avanza? En metros: m</small></div>
          <div class="d-tarjeta"><span class="d-num">Velocidad</span>${mt(L.v)}<small class="d-pie-tarjeta">¿Qué tan rápido? En m/s</small></div>
          <div class="d-tarjeta"><span class="d-num">Tiempo</span>${mt(L.t)}<small class="d-pie-tarjeta">¿En cuánto tiempo? En segundos: s</small></div>
        </div>
        <p class="d-destacado">${q(20, 'm/s')} quiere decir ${oculto('20 metros en cada segundo')}.</p>`
    },
    {
      titulo: 'Velocidad constante',
      html: `
        <h2>Velocidad constante: cada segundo, lo mismo</h2>
        <div class="d-svg">${pistaFigura({ largo: 80, huellas: [[0, 0], [1, 20], [2, 40], [3, 60]], avion: 40, tapar: 1, etiqueta: 'Una avioneta a 20 m/s: una huella en cada segundo, todas a la misma distancia' })}</div>
        <p>Una avioneta a ${q(20, 'm/s')}, siempre igual. ¿Dónde está a los 3 s? ${oculto(q(60, 'm'))}</p>
        ${ocultoBloque(`<p class="d-destacado">Distancia = velocidad por tiempo: ${mt(L.d, igual, L.v, por, L.t)}. En el colegio se llama MRU: movimiento rectilíneo uniforme.</p>`, 2)}`
    },
    {
      titulo: 'km/h y m/s',
      html: `
        <h2>Del velocímetro a la fórmula: km/h y m/s</h2>
        <p>Las fórmulas se usan con metros y segundos. Si el examen da km/h, se convierte con el 3,6 del módulo 1, que sale de 3600 ÷ 1000.</p>
        <div class="d-tarjetas">
          <div class="d-tarjeta"><span class="d-num">De km/h a m/s: ÷ 3,6</span>${mt(q(72, 'km/h'), igual, oculto(q(20, 'm/s')))}</div>
          <div class="d-tarjeta"><span class="d-num">De m/s a km/h: × 3,6</span>${mt(q(50, 'm/s'), igual, oculto(q(180, 'km/h'), 2))}</div>
        </div>
        <p class="d-nota">Valores redondos para hacer de cabeza: 36 → 10 · 72 → 20 · 108 → 30 · 180 → 50 · 288 → 80.</p>`
    },
    {
      titulo: 'Su turno: el radar de pista',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('radar')}</div>
        <h2>Su turno: el radar de pista</h2>
        <ul class="d-lista">
          <li>Abra <b>Radar de pista</b> en modo libre, con velocidad constante: mueva la velocidad, despegue y mire la bitácora.</li>
          <li>Después, los retos 1 a 3. Antes de cada vuelo, diga su predicción en voz alta.</li>
          <li>Si falla, el radar le da otro vuelo con otros números.</li>
        </ul>`
    },
    // ---------------- Parte 2 · la aceleración ----------------
    {
      titulo: 'La aceleración',
      html: `
        <h2>Con aceleración: cada segundo, más rápido</h2>
        <p>La aceleración dice cuánta velocidad gana en cada segundo. Con ${mt(L.a, igual, q(3, 'm/s²'))}, gana 3 m/s cada segundo:</p>
        <div class="d-tabla-envoltura">
          <table class="d-tabla m4-serie">
            <tr><th scope="row">Tiempo</th><td>0 s</td><td>1 s</td><td>2 s</td><td>3 s</td><td>4 s</td></tr>
            <tr><th scope="row">Velocidad</th><td>0</td><td>3</td><td>6</td><td>${oculto(n(9))}</td><td>${oculto(n(12), 2)}</td></tr>
          </table>
        </div>
        <p class="d-nota">La unidad lo dice: m/s² es «m/s en cada segundo», como en el módulo 2: m/s ÷ s = m/s². En el colegio se llama MRUV: movimiento rectilíneo uniformemente variado.</p>`
    },
    {
      titulo: 'La fórmula de la velocidad',
      html: `
        <h2>La velocidad: la que tenía más la que ganó</h2>
        <p>Un avión va a ${q(10, 'm/s')} y acelera a ${q(2, 'm/s²')} durante ${q(5, 's')}. ¿A qué velocidad termina?</p>
        <div class="mt mt-bloque d-formula">${cambia(mt(L.vf, igual, L.v0, mas, L.a, por, L.t), mt(L.vf, igual, n(10), mas, n(2), por, n(5)))}</div>
        <div class="d-pasos">${desde(`${igual} ${oculto(q(20, 'm/s'), 2)}`, 2)}</div>
        <p class="d-destacado">${L.v0} es la velocidad del principio y ${L.vf}, la del final. Si parte del reposo, ${mt(L.v0, igual, n(0))}.</p>`
    },
    {
      titulo: 'Las huellas se separan',
      html: `
        <h2>Con aceleración, las huellas se separan</h2>
        <div class="d-svg">${pistaFigura({ largo: 20, huellas: [[0, 0], [1, 1], [2, 4], [3, 9], [4, 16]], avion: 9, tapar: 1, etiqueta: 'Desde el reposo con 2 m/s²: las huellas de cada segundo quedan cada vez más separadas' })}</div>
        <p>Desde el reposo, con ${mt(L.a, igual, q(2, 'm/s²'))}: en cada segundo recorre más que en el anterior, 1 m, 3 m, 5 m… ¿Y en el cuarto segundo? ${oculto(q(7, 'm'))}</p>
        ${ocultoBloque('<p class="d-destacado">En total lleva 1, 4, 9 y 16 m: con el doble de tiempo, recorre cuatro veces más.</p>', 2)}`
    },
    {
      titulo: 'La distancia con el promedio',
      html: `
        <h2>La distancia: con la velocidad promedio</h2>
        <p>Arranca en 0 y a los 4 s va a ${q(8, 'm/s')}. ¿A qué velocidad fue, en promedio?</p>
        <div class="d-pasos">${mt('<span>promedio</span>', igual, fr(`${n(0)} ${mas} ${n(8)}`, n(2)), igual, oculto(q(4, 'm/s')))}</div>
        <div class="d-pasos">${desde(mt(L.d, igual, n(4), por, n(4), igual, oculto(q(16, 'm'), 2)), 2)}</div>
        ${ocultoBloque(`<p class="d-destacado d-ojo">${mt(n(8), por, n(4), igual, n(32))} es el doble: sería ir a 8 m/s desde el principio, y arrancó en 0.</p>`, 2)}`
    },
    {
      titulo: 'Frenar también es acelerar',
      html: `
        <h2>Frenar también es acelerar</h2>
        <div class="d-svg">${pistaFigura({ largo: 40, huellas: [[0, 0], [1, 17.5], [2, 30], [3, 37.5], [4, 40]], avion: 40, etiqueta: 'Un avión que frena: las huellas de cada segundo quedan cada vez más juntas' })}</div>
        <p>Aterriza a ${q(20, 'm/s')} y frena con ${mt(L.a, igual, q(-5, 'm/s²'))}: ${mt(n(20), flecha, n(15), flecha, n(10), flecha, n(5), flecha, n(0))}. ¿En cuántos segundos se detiene? ${oculto(q(4, 's'))}</p>
        ${ocultoBloque(`<p class="d-destacado">La aceleración es negativa porque va en contra del movimiento.</p>`, 2)}`
    },
    {
      titulo: 'Su turno: con aceleración',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('radar')}</div>
        <h2>Su turno: el radar con aceleración</h2>
        <ul class="d-lista">
          <li>Abra otra vez el radar, en modo libre con aceleración: mire cómo se separan las huellas. Pruebe también una aceleración negativa.</li>
          <li>Después, los retos 4 a 7.</li>
          <li>En los retos 5 y 7, piense en la velocidad promedio.</li>
        </ul>`
    },
    // ---------------- Parte 3 · fórmulas y balanzas ----------------
    {
      titulo: 'Tres fórmulas, tres balanzas',
      html: `
        <h2>Tres fórmulas, tres balanzas</h2>
        <div class="m4-tres m4-balanzas">
          ${['mru', 'vel', 'dist'].map(k => `<div><span class="d-num">${C.FORMULAS[k].nombre}</span>${C.balanzaHtml(C.FORMULAS[k].izq, C.FORMULAS[k].der, { mini: true })}</div>`).join('')}
        </div>
        <p class="d-destacado">Una fórmula es una igualdad: los dos platos pesan lo mismo. Para despejar, se hace lo mismo en los dos platos, como en el módulo 1.</p>`
    },
    {
      titulo: '¿De dónde sale el ½?',
      html: `
        <h2>¿De dónde sale el ½?</h2>
        <p>Desde el reposo, ${mt(L.v0, igual, n(0))} y queda ${mt(L.d, igual, medio, por, L.a, por, t2)}. Es el promedio: la mitad de la velocidad final, ${mt(L.a, por, L.t)}, por el tiempo.</p>
        <div class="d-pasos">${mt(L.d, igual, fr(`${L.a} ${por} ${L.t}`, n(2)), por, L.t, igual, medio, por, L.a, por, t2)}</div>
        <p>Con el reto 5 del radar: ${mt(L.d, igual, medio, por, n(2), por, pot(n(4), 2), igual, oculto(q(16, 'm')))}</p>
        ${ocultoBloque('<p class="d-destacado">Por eso, con el doble de tiempo recorre cuatro veces más: la t va al cuadrado.</p>', 2)}`
    },
    {
      titulo: 'Despejar en la balanza',
      html: `
        <h2>Despejar: lo mismo en los dos platos</h2>
        <div class="d-dos">
          <div>${C.balanzaHtml(L.d, `${L.v} ${por} ${L.t}`, { mini: true })}</div>
          <div>
            <p>Para dejar sola la ${L.t}, ¿qué se hace en los dos platos?</p>
            <div class="d-pasos">${oculto(mt(entre, L.v))}</div>
            ${ocultoBloque(`<div class="d-pasos">${mt(fr(L.d, L.v), igual, L.t)}${flecha}${mt(L.t, igual, fr(L.d, L.v))}</div>`, 2)}
          </div>
        </div>
        <p class="d-destacado">La regla de oro del módulo 1: primero se quita lo que suma o resta; después, lo que multiplica o divide.</p>`
    },
    {
      titulo: 'Palabras que son datos',
      html: `
        <h2>Palabras que son datos</h2>
        <div class="d-tabla-envoltura">
          <table class="d-tabla">
            <thead><tr><th scope="col">El enunciado dice</th><th scope="col">Quiere decir</th></tr></thead>
            <tbody>
              <tr><td>«Parte del reposo»</td><td>${oculto(mt(L.v0, igual, n(0)))}</td></tr>
              <tr><td>«Se detiene»</td><td>${oculto(mt(L.vf, igual, n(0)), 2)}</td></tr>
              <tr><td>«Frena»</td><td>${oculto('la aceleración es negativa', 3)}</td></tr>
              <tr><td>«Velocidad constante»</td><td>${oculto(mt(L.a, igual, n(0)), 4)}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="d-nota">En el examen, la mitad del problema es pasar las palabras a datos.</p>`
    },
    {
      titulo: 'La piedra del módulo 3',
      html: `
        <h2>La piedra del módulo 3</h2>
        <p>En el módulo 3, la altura de una piedra lanzada hacia arriba era ${mt(vr('h'), igual, pega(n(20), L.t), menos, pega(n(5), t2))}.</p>
        <p>Es la fórmula de la distancia, ${mt(L.d, igual, L.v0, por, L.t, mas, medio, por, L.a, por, t2)}, con ${mt(L.v0, igual, oculto(q(20, 'm/s')))} y ${mt(L.a, igual, oculto(q(-10, 'm/s²'), 2))}.</p>
        ${ocultoBloque(`<p class="d-destacado">La gravedad le quita 10 m/s en cada segundo: ${mt(medio, por, neg(-10), igual, n(-5))}. Eso es la caída libre, que viene después.</p>`, 2)}`
    },
    {
      titulo: 'Su turno: fórmulas y entrenamiento',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('balanza')}</div>
        <h2>Su turno: fórmulas y entrenamiento</h2>
        <ul class="d-lista">
          <li>Abra <b>Fórmulas en la balanza</b>: retos 1 a 6. Antes de tocar, diga qué operación va en los dos platos.</li>
          <li>Después, el <b>Entrenamiento</b>: la misión 1 (despegue) y la misión 2 (frenado).</li>
          <li>Las misiones van como en el examen: con calculadora y de principio a fin. Las pistas se abren después del primer intento.</li>
        </ul>`
    }
  ];

  const PARTES = [
    { id: 'p1', nombre: 'Parte 1 · distancia, velocidad y tiempo', corto: 'Parte 1 · distancia, velocidad y tiempo', desde: 0, hasta: 4, minutos: '6 min' },
    { id: 'p2', nombre: 'Parte 2 · la aceleración', corto: 'Parte 2 · la aceleración', desde: 5, hasta: 10, minutos: '7 min' },
    { id: 'p3', nombre: 'Parte 3 · fórmulas y balanzas', corto: 'Parte 3 · fórmulas y balanzas', desde: 11, hasta: 16, minutos: '7 min' }
  ];

  MA.Clase4 = { DIAPOSITIVAS, PARTES };
})();
