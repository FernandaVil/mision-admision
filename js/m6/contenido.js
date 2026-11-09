/* =====================================================================
   Módulo 6 · contenido (física mecánica III: caída libre y tiro)
   ---------------------------------------------------------------------
   - Cuentas: caida.pos(tiro, t) y caida.tSuelo(tiro), con g = 10 y
     arriba positivo. Un tiro es { h0, v0, vx }: altura inicial, velocidad
     vertical inicial y velocidad horizontal.
   - Dibujos: los tres diagramas para recordar la clase 6, las tres fotos
     del melón en el aire, la gráfica de velocidad (con negativos), las dos
     caídas, el avión y el paquete, y la canica que sale de la mesa. Usan
     las flechas y los cuerpos del módulo 5 (MA.M5), con su mismo código
     de color: violeta es el peso y azul punteado, la velocidad.
   - RETOS_TORRE: la torre de lanzamiento (ids: m6.torre.*).
   - EJERCICIOS: práctica (ids: m6.prac.*). Todo es de autoría propia, y
     ninguno repite una situación ni unos números de las diapositivas o
     de la torre: si ya los vio en clase, respondería de memoria.
   Los ids de retos y ejercicios no se cambian: el avance se guarda con
   ellos en el navegador.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { vr, n, op, fr, mt, q, tach, raiz } = MA.f;
  const { pot } = MA.M2;
  const M5 = MA.M5;
  const por = op('·'), igual = op('='), mas = op('+'), menos = op('−'), entre = op('÷'), flecha = op('→');
  const G = 10;

  /* ---------- Letras ---------- */
  const L = {
    h: vr('h'), v0: vr('v', '0'), vf: vr('v', 'f'), t: vr('t'), g: vr('g'), a: vr('a'), d: vr('d'),
    P: vr('P'), m: vr('m'), v: vr('v')
  };
  const SF = M5.SF;
  const t2 = pot(L.t, 2);
  const cincoT2 = mt(n(5), por, t2);

  /* ---------- Cuentas ----------
     Arriba positivo: la gravedad le quita 10 m/s a la velocidad vertical
     en cada segundo. La altura no baja del piso. */
  const tSuelo = p => (p.v0 + Math.sqrt(p.v0 * p.v0 + 2 * G * p.h0)) / G;
  function pos(p, t) {
    const s = Math.min(Math.max(t, 0), tSuelo(p));
    return { t: s, h: Math.max(0, p.h0 + p.v0 * s - G * s * s / 2), v: p.v0 - G * s, x: (p.vx || 0) * s, enSuelo: t >= tSuelo(p) - 1e-9 && (p.h0 > 0 || t > 0) };
  }
  const caida = { pos, tSuelo };

  /* ---------- Dibujos ---------- */
  const W = M5.ANCHO, H = M5.ALTO;
  const rayas = (x0, x1, y) => {
    let s = '';
    for (let x = x0; x < x1; x += 16) s += `M${x} ${y}l-8 9`;
    return `<path class="m5-rayado" d="${s}"/>`;
  };
  const vel = (x, y, dir, px, o = {}) => M5.flechaSvg(x, y, Object.assign({ dir, px, clase: 'vel', texto: '' }, o), 0);

  // Para recordar la clase 6: tres situaciones nuevas, del mismo tipo que las de la mesa
  function recuerdo(tipo, paso) {
    let s = '', etq = '', vb = '';
    if (tipo === 'maleta') {
      vb = '60 14 300 240';
      const cx = 210, cy = 132;
      etq = 'Una maleta quieta en el piso, con el peso hacia abajo y la normal hacia arriba, del mismo largo';
      s = `<line class="m5-piso" x1="60" y1="164" x2="360" y2="164"/>${rayas(72, 360, 164)}
        <g class="m5-cuerpo"><rect x="${cx - 34}" y="${cy - 28}" width="68" height="60" rx="6"/><path class="m5-raya" d="M${cx - 12} ${cy - 28}v-10h24v10M${cx - 34} ${cy + 4}h68"/></g>
        ${M5.flechaSvg(cx, cy, { dir: 'aba', px: 92, clase: 'peso', texto: 'Peso', paso, et: { x: cx + 12, y: cy + 104, ancla: 'start' } }, 0)}
        ${M5.flechaSvg(cx, cy, { dir: 'arr', px: 92, clase: 'contacto', texto: 'Normal', paso }, 0)}`;
    } else if (tipo === 'moneda') {
      const cx = 200, cy = 140;
      vb = '50 92 290 186';
      etq = 'Una moneda en el aire, subiendo después de lanzarla. Solo el peso, hacia abajo. La flecha azul punteada dice que sube, pero no es una fuerza';
      s = `<g class="m5-cuerpo"><ellipse cx="${cx}" cy="${cy}" rx="18" ry="18"/><ellipse class="m5-raya" cx="${cx}" cy="${cy}" rx="11" ry="11"/></g>
        ${vel(cx + 64, cy + 40, 'arr', 56)}<text class="m5-rotulo m5-rotulo-vel" x="${cx + 76}" y="${cy + 14}">sube</text>
        <path class="m5-trazo" d="M${cx - 110} ${cy + 104}q6 -12 16 -8l14 8"/><text class="m5-rotulo" x="${cx - 94}" y="${cy + 126}" text-anchor="middle">La mano ya la soltó</text>
        ${M5.flechaSvg(cx, cy, { dir: 'aba', px: 80, clase: 'peso', texto: 'Peso', paso }, 0)}`;
    } else {
      const g = M5.geometria({ tipo: 'rampa', cuerpo: 'melon', angulo: 25 });
      const c = Math.cos(g.ang * Math.PI / 180), si = Math.sin(g.ang * Math.PI / 180);
      const xa = g.x1 - g.largo * c, ya = g.y1 - g.largo * si;
      vb = '16 64 396 212';
      etq = 'Un trineo que baja solo por una ladera con fricción: peso hacia abajo, normal perpendicular a la ladera y fricción ladera arriba';
      s = `<line class="m5-piso" x1="20" y1="${g.y1}" x2="404" y2="${g.y1}"/>
        <polygon class="m5-rampa" points="${g.x1},${g.y1} ${xa.toFixed(1)},${g.y1} ${xa.toFixed(1)},${ya.toFixed(1)}"/>
        <g class="m5-cuerpo" transform="translate(${g.cx.toFixed(1)} ${g.cy.toFixed(1)}) rotate(${g.ang})"><rect x="-30" y="-14" width="56" height="22" rx="5"/><path class="m5-raya" d="M-34 16h62q8 0 8 -9M-22 8v8M16 8v8"/></g>
        ${M5.flechaSvg(g.x1 - c * 250 - si * 24, g.y1 - si * 250 + c * 24, { dir: 'baja', px: 52, clase: 'vel', texto: '' }, g.ang)}
        ${M5.flechaSvg(g.cx, g.cy, { dir: 'aba', px: 84, clase: 'peso', texto: 'Peso', paso, et: { x: g.cx + 10, y: g.cy + 100, ancla: 'start' } }, g.ang)}
        ${M5.flechaSvg(g.cx, g.cy, { dir: 'sale', px: 72, clase: 'contacto', texto: 'Normal', paso }, g.ang)}
        ${M5.flechaSvg(g.cx, g.cy, { dir: 'sube', px: 50, clase: 'contacto', texto: 'Fricción', paso }, g.ang)}`;
    }
    return `<svg class="m5-fig" viewBox="${vb}" role="img" aria-label="${MA.esc(etq)}">${s}</svg>`;
  }

  // Tres fotos del mismo melón en el aire: subiendo, arriba y bajando. El peso no cambia; la velocidad, sí
  function fotos(pasoPeso = 1, pasoVel = 2) {
    const foto = (x, nombre, v) => `
      ${M5.cuerpoSvg('melon', x, 96)}
      ${v ? vel(x + 40, v > 0 ? 120 : 72, v > 0 ? 'arr' : 'aba', 54, { paso: pasoVel }) : `<text class="m5-rotulo m5-rotulo-vel d-oculta-svg" data-paso="${pasoVel}" x="${x + 34}" y="100">v = 0</text>`}
      ${M5.flechaSvg(x, 96, { dir: 'aba', px: 72, clase: 'peso', texto: 'Peso', paso: pasoPeso }, 0)}
      <text class="m5-rotulo" x="${x}" y="214" text-anchor="middle">${nombre}</text>`;
    return `<svg class="m5-fig" viewBox="0 0 ${W} 226" role="img" aria-label="Tres fotos de un melón en el aire. Subiendo, arriba y bajando, la única fuerza es el peso, del mismo tamaño. La velocidad apunta hacia arriba al subir, vale cero arriba y apunta hacia abajo al bajar">
      ${foto(70, 'Subiendo', 1)}${foto(210, 'Arriba', 0)}${foto(350, 'Bajando', -1)}</svg>`;
  }

  /* Una gráfica de líneas que admite negativos: puntos [[x, y], …].
     El eje horizontal va en y = 0; las marcas dicen qué números se escriben. */
  function grafica({ puntos, minY, maxY, maxX, ejeX = 'Tiempo (s)', ejeY = 'Velocidad (m/s)', marcasX = [], marcasY = [], etiqueta = '', clase = '', paso, curva = false }) {
    const X0 = 62, X1 = 352, Y0 = 22, Y1 = 196;
    maxX = maxX || Math.max(...puntos.map(p => p[0]));
    const x = v => X0 + v / maxX * (X1 - X0 - 16), y = v => Y0 + (maxY - v) / (maxY - minY) * (Y1 - Y0);
    const cero = y(0);
    const guiaX = marcasX.map(v => `<text class="m5-g-num" x="${x(v).toFixed(1)}" y="${(cero + 18).toFixed(1)}" text-anchor="middle">${MA.fmt(v)}</text><line class="m5-g-guia" x1="${x(v).toFixed(1)}" y1="${(cero - 4).toFixed(1)}" x2="${x(v).toFixed(1)}" y2="${(cero + 4).toFixed(1)}"/>`).join('');
    const guiaY = marcasY.map(v => `<text class="m5-g-num" x="${X0 - 8}" y="${(y(v) + 5).toFixed(1)}" text-anchor="end">${MA.fmt(v)}</text><line class="m5-g-guia" x1="${X0}" y1="${y(v).toFixed(1)}" x2="${X1}" y2="${y(v).toFixed(1)}"/>`).join('');
    let linea;
    if (curva) {
      // Una parábola que pasa por los tres puntos dados (arranque, cima y final)
      const [p0, p1, p2] = puntos, pts = [];
      for (let k = 0; k <= 40; k++) {
        const u = p0[0] + (p2[0] - p0[0]) * k / 40;
        const l0 = ((u - p1[0]) * (u - p2[0])) / ((p0[0] - p1[0]) * (p0[0] - p2[0]));
        const l1 = ((u - p0[0]) * (u - p2[0])) / ((p1[0] - p0[0]) * (p1[0] - p2[0]));
        const l2 = ((u - p0[0]) * (u - p1[0])) / ((p2[0] - p0[0]) * (p2[0] - p1[0]));
        pts.push([u, p0[1] * l0 + p1[1] * l1 + p2[1] * l2]);
      }
      linea = pts.map(p => `${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join(' ');
    } else linea = puntos.map(p => `${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join(' ');
    return `
      <svg class="m5-graf ${clase}" viewBox="0 0 390 216" role="img" aria-label="${MA.esc(etiqueta)}">
        ${guiaY}
        <path class="m5-g-eje" d="M${X0} ${Y0 - 8}V${Y1}M${X0} ${cero.toFixed(1)}H${X1 + 6}"/>
        <path class="m5-g-punta" d="M${X0} ${Y0 - 14}l-5 9h10zM${X1 + 12} ${cero.toFixed(1)}l-9 -5v10z"/>
        ${guiaX}
        <polyline class="m5-g-linea${paso ? ' d-oculta-svg' : ''}" ${paso ? `data-paso="${paso}"` : ''} points="${linea}"/>
        <text class="m5-g-rot" x="${X0 + 8}" y="${Y0 - 4}">${ejeY}</text>
        <text class="m5-g-rot" x="${X1 + 12}" y="${(cero - 10).toFixed(1)}" text-anchor="end">${ejeX}</text>
      </svg>`;
  }

  // Lanzada de lado: la velocidad partida en sus dos ejes. La horizontal no cambia; la vertical crece
  function componentes(pasoH = 1, pasoV = 2) {
    const x0 = 78, y0 = 40, sx = 88, sy = 16, piso = 236, pts = [];
    for (let k = 0; k <= 35; k++) { const u = k / 10; pts.push(`${(x0 + sx * u).toFixed(1)},${(y0 + sy * u * u).toFixed(1)}`); }
    let s = `<rect class="m6-torre" x="22" y="${y0 + 10}" width="44" height="${piso - y0 - 10}"/>
      <line class="m5-piso" x1="12" y1="${piso}" x2="408" y2="${piso}"/>
      <polyline class="m6-trayecto" points="${pts.join(' ')}"/>`;
    for (let k = 0; k <= 3; k++) {
      const x = x0 + sx * k, y = y0 + sy * k * k;
      s += `<circle class="m6-huella" cx="${x}" cy="${y}" r="7"/>`;
      s += M5.flechaSvg(x, y, { dir: 'der', px: 44, clase: 'vel', texto: '', paso: pasoH }, 0);
      if (k) s += M5.flechaSvg(x, y, { dir: 'aba', px: 16 * k, clase: 'vel', texto: '', paso: pasoV }, 0);
    }
    s += M5.flechaSvg(x0 + sx, y0 + sy, { dir: 'aba', px: 40, clase: 'peso', texto: 'Peso', ox: -14, et: { x: x0 + sx - 20, y: y0 + sy + 50, ancla: 'end' } }, 0);
    s += `<text class="m5-rotulo m5-rotulo-vel d-oculta-svg" data-paso="${pasoH}" x="${x0 + 4}" y="${y0 - 16}">horizontal: no cambia</text>`;
    s += `<text class="m5-rotulo m5-rotulo-vel d-oculta-svg" data-paso="${pasoV}" x="${x0 + sx * 3 - 10}" y="${y0 + sy * 9 + 44}" text-anchor="end">vertical: crece</text>`;
    return `<svg class="m5-fig" viewBox="0 0 ${W} 250" role="img" aria-label="Una pelota lanzada de lado desde lo alto de una torre. En cada segundo, su velocidad se parte en dos: la horizontal es siempre igual y la vertical crece. La única fuerza es el peso">${s}</svg>`;
  }

  // El avión suelta un paquete: el paquete se queda siempre justo debajo del avión
  function avionPaquete(paso = 1) {
    const xs = [70, 160, 250, 340], yA = 50, caidas = [0, 5, 20, 45];
    const s = xs.map((x, k) => `
      <g transform="translate(${x + 4} ${yA}) scale(0.42)">${M5.cuerpoSvg('avion', 0, 0)}</g>
      <g class="${k ? 'd-oculta-svg' : ''}" ${k ? `data-paso="${paso}"` : ''}>
        ${k ? `<line class="m6-guia" x1="${x}" y1="${yA + 8}" x2="${x}" y2="${(yA + 16 + caidas[k] * 3.6).toFixed(1)}"/>` : ''}
        <rect class="m6-paquete" x="${x - 8}" y="${(yA + 14 + caidas[k] * 3.6).toFixed(1)}" width="16" height="14" rx="2"/>
      </g>
      <text class="m5-rotulo" x="${x}" y="268" text-anchor="middle">${k} s</text>`).join('');
    return `<svg class="m5-fig" viewBox="0 0 ${W} 280" role="img" aria-label="Un avión vuela en horizontal con velocidad constante y suelta un paquete. En cada segundo, el paquete está justo debajo del avión, cada vez más abajo">
      <line class="m5-piso" x1="20" y1="248" x2="400" y2="248"/>${s}</svg>`;
  }

  // Una canica sale rodando del borde de una mesa
  function canica() {
    const xb = 150, yb = 92, piso = 236, pts = [];
    for (let k = 0; k <= 20; k++) { const u = k / 20; pts.push(`${(xb + 120 * u).toFixed(1)},${(yb + (piso - 10 - yb) * u * u).toFixed(1)}`); }
    return `<svg class="m5-fig" viewBox="0 0 ${W} 270" role="img" aria-label="Una canica sale rodando del borde de una mesa de 1,25 m de alto y cae al piso a una distancia que se pregunta">
      <rect class="m6-torre" x="40" y="${yb + 10}" width="${xb - 40}" height="10"/>
      <path class="m5-trazo" d="M52 ${yb + 20}V${piso}M${xb - 12} ${yb + 20}V${piso}"/>
      <line class="m5-piso" x1="20" y1="${piso}" x2="400" y2="${piso}"/>
      <circle class="m6-huella" cx="${xb - 6}" cy="${yb}" r="9"/>
      <polyline class="m6-trayecto" points="${pts.join(' ')}"/>
      <circle class="m6-huella m6-huella-lado" cx="${xb + 120}" cy="${piso - 10}" r="9"/>
      ${vel(xb + 4, yb - 18, 'der', 50)}
      <text class="m5-medida" x="${xb + 24}" y="${yb - 26}">2 m/s</text>
      <path class="m6-cota" d="M${xb + 4} ${yb + 10}V${piso}M${xb + 4} ${piso + 14}H${xb + 120}"/>
      <text class="m5-medida" x="${xb + 12}" y="${(yb + piso) / 2 + 6}">1,25 m</text>
      <text class="m5-medida" x="${xb + 62}" y="${piso + 32}" text-anchor="middle">?</text>
    </svg>`;
  }

  // Un diagrama como opción de un ejercicio (con los dibujos del módulo 5)
  // La piedra baja: la flecha azul punteada dice hacia dónde se mueve, con su rótulo al lado para no taparla
  const baja = `${vel(274, 150, 'aba', 52)}<text class="m5-rotulo m5-rotulo-vel" x="284" y="184">baja</text>`;
  const diagramaAire = (flechas, etiqueta) => `<span class="m5-op-fig">${M5.escena({ tipo: 'aire', cuerpo: 'pelota', clase: 'm5-op', etiqueta, flechas }).replace('</svg>', baja + '</svg>')}</span>`;
  const graficaOp = (o, etiqueta) => `<span class="m5-op-fig">${grafica(Object.assign({ clase: 'm6-op-graf', minY: -24, maxY: 24, maxX: 4, ejeX: 't (s)', ejeY: 'v (m/s)', etiqueta }, o))}</span>`;

  /* ---------- La torre de lanzamiento ----------
     tiros: uno o dos cuerpos { h0, v0, vx, nombre }.
     alto: los metros que caben de alto; ancho: los de largo (de lado).
     torre: se dibuja la torre. lado: los cuerpos salen de lado.
     t0: el segundo en que arranca el reto (el reto 2 sigue al 1).
     Cada reto es una lista de pasos:
       predice: se elige y después se ve (con lanza, la torre corre hasta ahí).
       serie: se escribe la velocidad de cada segundo, antes de lanzar.
       numero: se escribe un resultado.
       lanza: un botón lanza y la torre corre hasta un segundo o hasta el suelo.
     luego: a dónde sigue la clase al terminar. */
  const sumo = (v0, k) => `Ese resultado suma 10. Subiendo, la gravedad le quita 10 m/s en cada segundo: ${MA.fmt(v0)}, después ${MA.fmt(v0 - 10)}…`;
  const RETOS_TORRE = [
    {
      id: 't1', titulo: 'Sube y frena', tiros: [{ h0: 0, v0: 30 }], alto: 50, ocultos: ['a'],
      contexto: `Desde el piso se lanza una pelota hacia arriba a ${q(30, 'm/s')}. Sin aire, y con arriba positivo.`,
      pasos: [
        { tipo: 'predice', pregunta: 'Ya en el aire, mientras sube, ¿qué fuerzas actúan sobre la pelota?', opciones: [
          { txt: 'Solo el peso', ok: true },
          { txt: 'El peso y la fuerza del lanzamiento' },
          { txt: 'La fuerza del lanzamiento, que se va gastando' }
        ], explica: 'Solo el peso: la mano ya la soltó. Sube porque ya venía subiendo, y el peso le va quitando velocidad.', renglon: mt(SF, igual, menos + L.P), etq: 'Fuerzas' },
        { tipo: 'serie', pregunta: 'Antes de lanzar, en el papel: ¿qué velocidad lleva en cada segundo?', ts: [1, 2, 3], respuestas: [20, 10, 0], unidad: 'm/s',
          error: (x, i) => (x === 30 + 10 * (i + 1) ? sumo(30) : i > 0 && x === 20 ? 'En cada segundo se quitan 10 m/s, no una sola vez: en el segundo 2 ya van dos veces.' : null),
          renglon: mt(n(30), flecha, n(20), flecha, n(10), flecha, n(0)), etq: 'Velocidad, m/s', nota: 'Se quitan 10 en cada segundo.' },
        { tipo: 'lanza', boton: 'Lanzar', hasta: 3, pide: 'Lanzar y mirar las dos flechas: la del peso, violeta, y la de la velocidad, azul punteada.',
          final: 'La flecha de la velocidad se achica en cada segundo; la del peso no cambia. En el segundo 3 la velocidad es 0: ahí está lo más alto.', renglon: mt(L.vf, igual, n(30), menos, n(10), por, n(3), igual, n(0)), etq: 'Lo más alto' },
        { tipo: 'predice', pregunta: 'En lo más alto la velocidad es 0. ¿Y la aceleración?', opciones: [
          { txt: '−10 m/s², igual que antes', ok: true },
          { txt: '0, porque está quieta' },
          { txt: '+10 m/s², porque empieza a bajar' }
        ], explica: '−10 m/s²: el peso sigue ahí, así que la velocidad sigue cambiando. Si la aceleración fuera 0, la pelota se quedaría flotando.', renglon: mt(L.a, igual, q('−10', 'm/s²')), etq: 'También arriba', revela: 'a' }
      ]
    },
    {
      id: 't2', titulo: 'Y vuelve a bajar', tiros: [{ h0: 0, v0: 30 }], alto: 50, t0: 3,
      inicio: { etq: 'Viene del reto 1', html: mt(L.vf, igual, n(0)), nota: 'A los 3 s está en lo más alto, a 45 m.' },
      contexto: `La misma pelota del reto 1, lanzada a ${q(30, 'm/s')}, ya está en lo más alto, a los 3 s. Ahora baja.`,
      pasos: [
        { tipo: 'predice', pregunta: 'Desde lo más alto, ¿cuánto tarda en volver a la mano?', opciones: [
          { txt: '3 s, lo mismo que en subir', ok: true },
          { txt: 'Menos, porque bajar es más fácil' },
          { txt: 'Más, porque arranca desde 0' }
        ], explica: 'Lo mismo que en subir: bajar es subir al revés. Vuelve a la mano en el segundo 6.', renglon: 'Sube 3 s y baja 3 s', etq: 'Ida y vuelta' },
        { tipo: 'serie', pregunta: 'Arriba positivo: ¿qué velocidad lleva en cada segundo de la bajada?', ts: [4, 5, 6], respuestas: [-10, -20, -30], unidad: 'm/s',
          error: x => (x > 0 ? 'Ese es el tamaño, pero va hacia abajo: con arriba positivo, lleva signo menos.' : null),
          renglon: mt(n(0), flecha, n(-10), flecha, n(-20), flecha, n(-30)), etq: 'Velocidad, m/s', nota: 'Se siguen quitando 10 en cada segundo, también bajo el cero.' },
        { tipo: 'lanza', boton: 'Seguir', hasta: 6, pide: 'Dejar que baje y mirar las huellas.',
          final: 'Vuelve a la mano con 30 m/s, la misma rapidez con que salió, pero hacia abajo: −30 m/s. Cada huella de la bajada queda a la altura de una de la subida.' },
        { tipo: 'predice', pregunta: 'En la gráfica de velocidad, ¿dónde está lo más alto de la pelota?', opciones: [
          { txt: 'Donde la línea cruza el cero', ok: true },
          { txt: 'Al principio, donde la línea está más arriba' },
          { txt: 'Al final, donde la línea está más abajo' }
        ], explica: 'Donde la velocidad vale 0, en el segundo 3. Lo más alto de la línea es la velocidad del lanzamiento, no la altura de la pelota.', renglon: 'La línea cruza el cero en lo más alto', etq: 'La gráfica' }
      ],
      luego: { texto: 'Seguir con las ideas clave, parte 3', ir: '#m6-ideas-p3' }
    },
    {
      id: 't3', titulo: '¿Hasta dónde sube?', tiros: [{ h0: 0, v0: 40 }], alto: 90,
      contexto: `Se lanza una pelota hacia arriba a ${q(40, 'm/s')}. Conviene resolverlo primero en el papel, un renglón por pregunta, y después compararlo aquí.`,
      pasos: [
        { tipo: 'numero', pregunta: '¿Cuántos segundos tarda en llegar a lo más alto?', respuesta: 4, unidad: 's', errores: [
          { valor: 40, msg: 'Esa es la velocidad del lanzamiento. En lo más alto la velocidad vale 0: 0 = 40 − 10 · t.' },
          { valor: 0.25, msg: 'Ese resultado sale de 10 ÷ 40: es al revés. Si 10 · t = 40, entonces t = 40 ÷ 10.' },
          { valor: 400, msg: 'Ese resultado sale de multiplicar. La t está multiplicada por 10: para despejarla, se divide.' },
          { valor: 8, msg: 'Ese es el tiempo de ida y vuelta. Hasta lo más alto es la mitad.' }
        ], renglon: mt(n(0), igual, n(40), menos, n(10), por, L.t, flecha, L.t, igual, fr(n(40), n(10)), igual, q(4, 's')), etq: 'Tiempo de subida' },
        { tipo: 'numero', pregunta: '¿Cuál es la velocidad promedio mientras sube?', respuesta: 20, unidad: 'm/s', errores: [
          { valor: 40, msg: 'Esa es la velocidad del arranque. Arriba vale 0, así que el promedio queda en la mitad.' },
          { valor: 4, msg: 'Ese es el tiempo. La velocidad promedio es (40 + 0) ÷ 2.' },
          { valor: 10, msg: 'Esa es la gravedad. La velocidad promedio es (40 + 0) ÷ 2.' }
        ], renglon: mt(fr(`${n(40)} ${mas} ${n(0)}`, n(2)), igual, q(20, 'm/s')), etq: 'Velocidad promedio' },
        { tipo: 'numero', pregunta: '¿Hasta qué altura sube?', respuesta: 80, unidad: 'm', errores: [
          { valor: 160, msg: 'Ese resultado sale de 40 · 4, como si no frenara. Con la velocidad promedio: 20 · 4.' },
          { valor: 20, msg: 'Esa es la velocidad promedio. Falta multiplicarla por el tiempo.' },
          { valor: 240, msg: 'Ese resultado sale de 40 · 4 + 5 · 16: subiendo, la gravedad resta.' }
        ], renglon: mt(L.h, igual, n(20), por, n(4), igual, q(80, 'm')), etq: 'Altura máxima', nota: 'Con la fórmula da lo mismo: 40 · 4 − 5 · 16 = 160 − 80 = 80 m.' },
        { tipo: 'lanza', boton: 'Comprobar con la torre', hasta: 4, pide: 'Lanzar para comprobar.', final: 'Llega a 80 m en el segundo 4, y ahí la velocidad es 0.' }
      ]
    },
    {
      id: 't4', titulo: 'Soltar desde la torre', tiros: [{ h0: 125, v0: 0 }], alto: 140, torre: true,
      contexto: `Desde lo alto de una torre de ${q(125, 'm')} se suelta una pelota, sin lanzarla. Sin aire.`,
      pasos: [
        { tipo: 'predice', pregunta: '¿Cuánto cae en cada segundo?', opciones: [
          { txt: 'Cada segundo, más que en el anterior', ok: true },
          { txt: 'Lo mismo en cada segundo' },
          { txt: 'Cada segundo, menos que en el anterior' }
        ], explica: 'Cada vez más, porque va ganando velocidad: 5 m en el primer segundo, 15 en el segundo y 25 en el tercero. En total, lo que ha caído es 5 · t².', renglon: mt(L.d, igual, cincoT2), etq: 'Lo que ha caído' },
        { tipo: 'numero', pregunta: '¿Cuántos segundos tarda en llegar al piso?', respuesta: 5, unidad: 's', errores: [
          { valor: 25, msg: 'Ese es t². Falta la raíz: ¿qué número por sí mismo da 25?' },
          { valor: 12.5, msg: 'Ese resultado sale de 125 ÷ 10. Lo que cae no es 10 · t, sino 5 · t².' },
          { valor: 625, msg: 'Ese resultado sale de 125 · 5. Para despejar t², se divide entre 5.' },
          { valor: 11.18, msg: 'Esa es la raíz de 125. Antes hay que dividir entre 5.' }
        ], renglon: mt(n(5), por, t2, igual, n(125), flecha, t2, igual, n(25), flecha, L.t, igual, q(5, 's')), etq: 'Tiempo de caída' },
        { tipo: 'numero', pregunta: '¿Con qué rapidez llega al piso?', respuesta: 50, abs: true, unidad: 'm/s', errores: [
          { valor: 25, msg: '125 ÷ 5 da t², no la velocidad. La velocidad crece 10 m/s en cada segundo: 10 · t.' },
          { valor: 125, msg: 'Esa es la altura de la torre, en metros.' },
          { valor: 10, msg: 'Esa es g. La velocidad crece 10 m/s en cada segundo, durante 5 segundos.' }
        ], renglon: mt(L.v, igual, n(10), por, n(5), igual, q(50, 'm/s')), etq: 'Rapidez al llegar', nota: 'Con arriba positivo es −50 m/s: el signo solo dice que va hacia abajo.' },
        { tipo: 'lanza', boton: 'Soltar', hasta: 'suelo', pide: 'Soltar la pelota y mirar cómo se separan las huellas.', final: 'Las huellas se separan cada vez más: cada segundo cae más que en el anterior.' },
        { tipo: 'predice', pregunta: 'Si la pelota tuviera el doble de masa, ¿cuánto tardaría?', opciones: [
          { txt: 'Lo mismo: 5 s', ok: true },
          { txt: 'La mitad: 2,5 s' },
          { txt: 'Un poco menos, porque pesa más' }
        ], explica: 'Lo mismo. Con el doble de masa el peso es el doble, pero también cuesta el doble acelerarla: la masa se cancela, como en la carrera de la rampa.', renglon: mt(L.a, igual, fr(`${tach(L.m)} ${por} ${L.g}`, tach(L.m)), igual, L.g), etq: 'La masa se cancela' }
      ],
      luego: { texto: 'Seguir con las ideas clave, parte 4', ir: '#m6-ideas-p4' }
    },
    {
      id: 't5', titulo: 'Soltar y lanzar de lado', lado: true, torre: true, alto: 50, ancho: 60,
      tiros: [{ h0: 45, v0: 0, vx: 0, nombre: 'Soltada' }, { h0: 45, v0: 0, vx: 15, nombre: 'Lanzada' }],
      contexto: `Desde lo alto de una torre de ${q(45, 'm')}, al mismo tiempo, una pelota se suelta y otra se lanza horizontal a ${q(15, 'm/s')}. Sin aire.`,
      pasos: [
        { tipo: 'predice', pregunta: '¿Cuál llega primero al piso?', espera: true, opciones: [
          { txt: 'Llegan al tiempo', ok: true },
          { txt: 'La que se suelta, porque va derecho' },
          { txt: 'La lanzada, porque va más rápido' }
        ] },
        { tipo: 'predice', pregunta: 'Mientras cae, ¿qué le pasa a la velocidad horizontal de la lanzada?', espera: true, opciones: [
          { txt: 'Sigue en 15 m/s', ok: true },
          { txt: 'Va bajando hasta 0' },
          { txt: 'Va subiendo, porque cae cada vez más rápido' }
        ] },
        { tipo: 'lanza', boton: 'Lanzar las dos', hasta: 'suelo', pide: 'Lanzar las dos al mismo tiempo y mirar las huellas de cada segundo.',
          final: 'Llegan juntas: en cada segundo están a la misma altura, porque en lo vertical las dos son caída libre. Y la lanzada sigue con 15 m/s de lado todo el tiempo: en lo horizontal nadie la toca, así que sigue como venía (primera ley).',
          renglones: [['Eje vertical', 'Las dos caen igual: llegan juntas'], ['Eje horizontal', '15 m/s todo el tiempo']] }
      ]
    },
    {
      id: 't6', titulo: '¿A qué distancia cae?', lado: true, torre: true, alto: 90, ancho: 110,
      tiros: [{ h0: 80, v0: 0, vx: 25, nombre: 'Lanzada' }],
      contexto: `Desde lo alto de una torre de ${q(80, 'm')} se lanza una pelota horizontal a ${q(25, 'm/s')}. Sin aire.`,
      pasos: [
        { tipo: 'numero', pregunta: 'Primero el eje vertical: ¿cuántos segundos tarda en caer?', respuesta: 4, unidad: 's', errores: [
          { valor: 16, msg: 'Ese es t². Falta la raíz.' },
          { valor: 8, msg: 'Ese resultado sale de 80 ÷ 10. Lo que cae es 5 · t².' },
          { valor: 3.2, msg: 'Ese resultado sale de 80 ÷ 25: se mezclaron los ejes. El tiempo sale solo del vertical: 5 · t² = 80.' },
          { valor: 400, msg: 'Ese resultado sale de 80 · 5. Para despejar t², se divide entre 5.' }
        ], renglon: mt(n(5), por, t2, igual, n(80), flecha, t2, igual, n(16), flecha, L.t, igual, q(4, 's')), etq: 'Eje vertical' },
        { tipo: 'numero', pregunta: 'Ahora el horizontal: ¿a qué distancia de la torre cae?', respuesta: 100, unidad: 'm', errores: [
          { valor: 25, msg: 'Esa es la velocidad horizontal. Falta multiplicarla por el tiempo.' },
          { valor: 80, msg: 'Esa es la altura de la torre.' },
          { valor: 400, msg: 'Ese resultado sale de 25 · 16: el tiempo es 4 s; 16 es t².' },
          { valor: 6.25, msg: 'Ese resultado sale de dividir. Con velocidad constante, la distancia es velocidad por tiempo.' }
        ], renglon: mt(L.d, igual, n(25), por, n(4), igual, q(100, 'm')), etq: 'Eje horizontal' },
        { tipo: 'lanza', boton: 'Lanzar', hasta: 'suelo', pide: 'Lanzar para comprobar.', final: 'Cae a 100 m de la torre, a los 4 s. El tiempo hace de puente entre los dos ejes.' }
      ]
    }
  ];

  /* ---------- Práctica ----------
     Del más sencillo al más parecido al examen, y la guía se va retirando.
     Básico e intermedio: números redondos, sin calculadora y con un botón
     para repasar en la torre. Tipo examen y retos: con calculadora, sin
     herramienta y con pistas de qué pensar, que se abren después del
     primer intento. Dos ejercicios vuelven a la clase 6 (las flechas en
     el aire y la masa que se cancela): conviene recordar en días
     distintos. */
  const EJERCICIOS = [
    // ----- Básico -----
    {
      id: 'e1', nivel: 'basico', tema: 'velocidad', tipo: 'numero', respuesta: 15, unidad: 'm/s',
      enunciado: `Se lanza una piedra hacia arriba a ${q(35, 'm/s')}. Con ${mt(L.g, igual, q(10, 'm/s²'))} y sin aire, ¿qué velocidad lleva 2 segundos después?`,
      plano: 'Se lanza una piedra hacia arriba a 35 m/s. Con g = 10 m/s² y sin aire, ¿qué velocidad lleva 2 segundos después?',
      errores: [
        { valor: 55, msg: 'Ese resultado suma. Subiendo, la gravedad le quita 10 m/s en cada segundo.' },
        { valor: 25, msg: 'Ese es un solo segundo. En dos segundos se quitan 20 m/s.' },
        { valor: 70, msg: 'Ese resultado sale de 35 · 2. A la velocidad se le resta lo que quita la gravedad.' }
      ],
      pistas: ['¿Cuánto le quita la gravedad en cada segundo?', `${mt(L.vf, igual, L.v0, menos, n(10), por, L.t)}.`],
      solucion: [`${mt(L.vf, igual, n(35), menos, n(10), por, n(2), igual, n(35), menos, n(20))}`, `Respuesta: ${q(15, 'm/s')}, todavía hacia arriba.`],
      herramienta: { boton: 'Repasar en la torre', icono: 'torre', mesa: 'torre', problema: 't1' }
    },
    {
      id: 'e2', nivel: 'basico', tema: 'arriba', tipo: 'opciones', correcta: 0,
      enunciado: 'Una pelota lanzada hacia arriba llega a su punto más alto. Sin aire, ¿qué es cierto en ese instante?',
      plano: 'Una pelota lanzada hacia arriba llega a su punto más alto. Sin aire, ¿qué es cierto en ese instante?',
      opciones: ['Su velocidad es 0 y su aceleración es 10 m/s² hacia abajo', 'Su velocidad es 0 y su aceleración también es 0', 'Su velocidad es 0 y no actúa ninguna fuerza sobre ella', 'Su velocidad es la máxima, porque está más alta'],
      opcionesPlano: ['Su velocidad es 0 y su aceleración es 10 m/s² hacia abajo', 'Su velocidad es 0 y su aceleración también es 0', 'Su velocidad es 0 y no actúa ninguna fuerza sobre ella', 'Su velocidad es la máxima, porque está más alta'],
      porQue: {
        1: 'Si la aceleración fuera 0, la velocidad se quedaría en 0 y la pelota flotaría. El peso sigue ahí.',
        2: 'El peso actúa siempre, también arriba. ¿Quién la haría bajar si no?',
        3: 'Arriba la velocidad es la mínima: la gravedad se la fue quitando toda.'
      },
      pistas: ['¿Qué fuerzas actúan sobre la pelota en lo más alto?', 'Si solo actúa el peso, ¿cuánto vale la aceleración?'],
      solucion: ['En lo más alto la pelota se detiene un instante: velocidad 0.', 'El peso no se apaga: sigue la aceleración de 10 m/s² hacia abajo (−10 con arriba positivo). Por eso vuelve a bajar.'],
      herramienta: { boton: 'Repasar en la torre', icono: 'torre', mesa: 'torre', problema: 't1' }
    },
    {
      id: 'e3', nivel: 'basico', tema: 'subida', tipo: 'numero', respuesta: 1.2, unidad: 's',
      enunciado: `Se lanza una pelota hacia arriba a ${q(12, 'm/s')}. Sin aire, ¿cuántos segundos tarda en llegar a lo más alto?`,
      plano: 'Se lanza una pelota hacia arriba a 12 m/s. Sin aire, ¿cuántos segundos tarda en llegar a lo más alto?',
      errores: [
        { valor: 120, msg: 'Ese resultado sale de multiplicar. La t está multiplicada por 10: para despejarla, se divide.' },
        { valor: 0.83, msg: 'Ese resultado sale de 10 ÷ 12: es al revés. Si 10 · t = 12, entonces t = 12 ÷ 10.' },
        { valor: 12, msg: 'Esa es la velocidad del lanzamiento. En lo más alto la velocidad vale 0.' },
        { valor: 2.4, msg: 'Ese es el tiempo de ida y vuelta. Hasta lo más alto es la mitad.' }
      ],
      pistas: ['¿Cuánto vale la velocidad en lo más alto?', `${mt(n(0), igual, n(12), menos, n(10), por, L.t)}: hay que despejar la t.`],
      solucion: [`En lo más alto ${mt(L.vf, igual, n(0))}: ${mt(n(0), igual, n(12), menos, n(10), por, L.t)}.`, `${mt(n(10), por, L.t, igual, n(12), flecha, L.t, igual, fr(n(12), n(10)), igual, q('1,2', 's'))}`],
      herramienta: { boton: 'Repasar en la torre', icono: 'torre', mesa: 'torre', problema: 't3' }
    },
    // ----- Intermedio -----
    {
      id: 'e4', nivel: 'intermedio', tema: 'altura', tipo: 'numero', respuesta: 5, unidad: 'm',
      enunciado: `Se lanza una pelota hacia arriba a ${q(10, 'm/s')}. Sin aire, ¿hasta qué altura sube?`,
      plano: 'Se lanza una pelota hacia arriba a 10 m/s. Sin aire, ¿hasta qué altura sube?',
      errores: [
        { valor: 10, msg: 'Ese resultado sale de 10 · 1, como si no frenara. Con la velocidad promedio: 5 · 1.' },
        { valor: 1, msg: 'Ese es el tiempo de subida. Falta la altura.' },
        { valor: 15, msg: 'Ese resultado sale de 10 · 1 + 5 · 1: subiendo, la gravedad resta.' }
      ],
      pistas: ['Primero el tiempo de subida: ¿cuándo la velocidad llega a 0?', 'Mientras sube, la velocidad promedio es (10 + 0) ÷ 2.'],
      solucion: [`Tiempo de subida: ${mt(L.t, igual, fr(n(10), n(10)), igual, q(1, 's'))}.`, `Velocidad promedio: ${mt(fr(`${n(10)} ${mas} ${n(0)}`, n(2)), igual, q(5, 'm/s'))}.`, `${mt(L.h, igual, n(5), por, n(1), igual, q(5, 'm'))}`],
      herramienta: { boton: 'Repasar en la torre', icono: 'torre', mesa: 'torre', problema: 't3' }
    },
    {
      id: 'e5', nivel: 'intermedio', tema: 'soltar', tipo: 'numero', respuesta: 6, unidad: 's',
      enunciado: `Desde un globo quieto a ${q(180, 'm')} de altura se suelta un saco de arena. Sin aire, ¿cuántos segundos tarda en llegar al piso?`,
      plano: 'Desde un globo quieto a 180 m de altura se suelta un saco de arena. Sin aire, ¿cuántos segundos tarda en llegar al piso?',
      errores: [
        { valor: 36, msg: 'Ese es t². Falta la raíz: ¿qué número por sí mismo da 36?' },
        { valor: 18, msg: 'Ese resultado sale de 180 ÷ 10. Lo que cae no es 10 · t, sino 5 · t².' },
        { valor: 900, msg: 'Ese resultado sale de 180 · 5. Para despejar t², se divide entre 5.' }
      ],
      pistas: ['Se suelta: arranca con velocidad 0. ¿Qué fórmula da lo que ha caído?', `${mt(n(5), por, t2, igual, n(180))}: primero se divide y después la raíz.`],
      solucion: [`${mt(n(5), por, t2, igual, n(180))}`, `${mt(t2, igual, fr(n(180), n(5)), igual, n(36))}`, `${mt(L.t, igual, raiz(n(36)), igual, q(6, 's'))}`],
      herramienta: { boton: 'Repasar en la torre', icono: 'torre', mesa: 'torre', problema: 't4' }
    },
    {
      id: 'e6', nivel: 'intermedio', tema: 'grafica', tipo: 'opciones', correcta: 0,
      enunciado: 'Se lanza una pelota hacia arriba y vuelve a la mano. Con arriba positivo, ¿cuál gráfica de velocidad contra tiempo la representa?',
      plano: 'Se lanza una pelota hacia arriba y vuelve a la mano. Con arriba positivo, ¿cuál gráfica de velocidad contra tiempo la representa? A: una recta que baja desde un valor positivo, cruza el cero a la mitad y termina en el mismo valor, negativo. B: una recta que baja hasta cero a la mitad y vuelve a subir. C: una recta horizontal. D: una curva que sube, llega a un máximo a la mitad y baja.',
      opciones: [
        graficaOp({ puntos: [[0, 20], [4, -20]] }, 'Una recta que baja desde un valor positivo, cruza el cero a la mitad y termina en el mismo valor, negativo'),
        graficaOp({ puntos: [[0, 20], [2, 0], [4, 20]] }, 'Una recta que baja hasta cero a la mitad y vuelve a subir'),
        graficaOp({ puntos: [[0, 15], [4, 15]] }, 'Una recta horizontal'),
        graficaOp({ puntos: [[0, 0], [2, 20], [4, 0]], curva: true }, 'Una curva que sube, llega a un máximo a la mitad y baja')
      ],
      opcionesPlano: ['Una recta que baja desde un valor positivo, cruza el cero a la mitad y termina en el mismo valor, negativo', 'Una recta que baja hasta cero a la mitad y vuelve a subir', 'Una recta horizontal', 'Una curva que sube, llega a un máximo a la mitad y baja'],
      porQue: {
        1: 'Esa sería la rapidez, sin signo. Bajando, la velocidad es negativa: la recta sigue bajando del cero.',
        2: 'Una recta horizontal es velocidad constante. La gravedad la cambia 10 m/s en cada segundo.',
        3: 'Esa es la forma de la altura, no de la velocidad.'
      },
      pistas: ['¿Cuánto cambia la velocidad en cada segundo? ¿Siempre en el mismo sentido?', '¿Qué signo tiene la velocidad cuando baja?'],
      solucion: ['La gravedad le quita 10 m/s en cada segundo, de principio a fin: la gráfica es una recta que baja.', 'Cruza el cero en lo más alto y sigue bajando: bajando, la velocidad es negativa.']
    },
    // ----- Tipo examen -----
    // Desde aquí: con calculadora, sin herramientas, y las pistas se abren después del primer intento.
    {
      id: 'e7', nivel: 'examen', tema: 'soltar', tipo: 'numero', respuesta: 2.449, unidad: 's',
      enunciado: `Desde la terraza de un edificio de ${q(30, 'm')} se deja caer una matera. Sin aire y con ${mt(L.g, igual, q(10, 'm/s²'))}, ¿cuántos segundos tarda en llegar al piso? Con dos decimales.`,
      plano: 'Desde la terraza de un edificio de 30 m se deja caer una matera. Sin aire y con g = 10 m/s², ¿cuántos segundos tarda en llegar al piso? Con dos decimales.',
      errores: [
        { valor: 6, msg: 'Ese es t². Falta la raíz.' },
        { valor: 3, msg: 'Ese resultado sale de 30 ÷ 10. Lo que cae no es 10 · t, sino 5 · t².' },
        { valor: 1.732, msg: 'Esa es la raíz de 30 ÷ 10. La fórmula es 5 · t²: se divide entre 5.' },
        { valor: 5.477, msg: 'Esa es la raíz de 30. Antes hay que dividir entre 5.' }
      ],
      pistas: ['«Se deja caer»: ¿con qué velocidad arranca?', 'Primero se divide entre 5 y después la raíz, con la calculadora.'],
      solucion: [`${mt(n(5), por, t2, igual, n(30), flecha, t2, igual, n(6))}`, `${mt(L.t, igual, raiz(n(6)), op('≈'), q('2,45', 's'))}`]
    },
    {
      id: 'e8', nivel: 'examen', tema: 'masa', tipo: 'opciones', correcta: 0,
      enunciado: 'Desde la misma altura y al mismo tiempo se sueltan dos esferas del mismo tamaño: una de acero, de 4 kg, y otra de madera, de 1 kg. Sin resistencia del aire, ¿qué se puede afirmar?',
      plano: 'Desde la misma altura y al mismo tiempo se sueltan dos esferas del mismo tamaño: una de acero, de 4 kg, y otra de madera, de 1 kg. Sin resistencia del aire, ¿qué se puede afirmar?',
      opciones: ['Llegan al tiempo, porque la aceleración no depende de la masa', 'La de acero llega primero, porque su peso es mayor', 'Llegan al tiempo, porque sus pesos son iguales', 'La de madera llega primero, porque es más liviana'],
      opcionesPlano: ['Llegan al tiempo, porque la aceleración no depende de la masa', 'La de acero llega primero, porque su peso es mayor', 'Llegan al tiempo, porque sus pesos son iguales', 'La de madera llega primero, porque es más liviana'],
      porQue: {
        1: 'Su peso sí es mayor, pero también cuesta más acelerarla: la masa se cancela.',
        2: 'El resultado está bien, pero la razón es falsa: la de acero pesa cuatro veces más.',
        3: 'Sin aire, ser liviana no la hace caer más rápido ni más despacio.'
      },
      pistas: ['Hay dos opciones que dicen «llegan al tiempo». ¿En qué se diferencian?', `${mt(L.a, igual, fr(L.P, L.m))}: ¿qué pasa si la masa es cuatro veces mayor?`],
      solucion: ['Sin aire, todo cae con la misma aceleración, g.', `${mt(L.a, igual, fr(`${tach(L.m)} ${por} ${L.g}`, tach(L.m)), igual, L.g)}: la masa se cancela.`, 'La tercera opción tiene la razón falsa: los pesos son distintos (40 N y 10 N). Es la trampa de «el peso cambió», al revés.']
    },
    {
      id: 'e9', nivel: 'examen', tema: 'altura', tipo: 'numero', respuesta: 16.2, unidad: 'm',
      enunciado: `Una pelota se lanza verticalmente hacia arriba a ${q(18, 'm/s')}. Sin aire y con ${mt(L.g, igual, q(10, 'm/s²'))}, ¿cuál es su altura máxima?`,
      plano: 'Una pelota se lanza verticalmente hacia arriba a 18 m/s. Sin aire y con g = 10 m/s², ¿cuál es su altura máxima?',
      errores: [
        { valor: 32.4, msg: 'Ese resultado sale de 18 · 1,8, como si no frenara. Con la velocidad promedio: 9 · 1,8.' },
        { valor: 1.8, msg: 'Ese es el tiempo de subida. Falta la altura.' },
        { valor: 48.6, msg: 'Ese resultado sale de 18 · 1,8 + 5 · 1,8²: subiendo, la gravedad resta.' },
        { valor: 9, msg: 'Esa es la velocidad promedio. Falta multiplicarla por el tiempo.' }
      ],
      pistas: ['Primero, ¿cuánto tarda en llegar arriba?', 'Mientras sube, ¿cuál es la velocidad promedio?'],
      solucion: [`Tiempo de subida: ${mt(L.t, igual, fr(n(18), n(10)), igual, q('1,8', 's'))}.`, `Velocidad promedio: ${mt(fr(`${n(18)} ${mas} ${n(0)}`, n(2)), igual, q(9, 'm/s'))}.`, `${mt(L.h, igual, n(9), por, n('1,8'), igual, q('16,2', 'm'))}`]
    },
    {
      id: 'e10', nivel: 'examen', tema: 'flechas', tipo: 'opciones', correcta: 0,
      enunciado: 'Se lanza una piedra hacia arriba. Ya en el aire, mientras baja, ¿cuál diagrama representa las fuerzas sobre la piedra? Sin resistencia del aire.',
      plano: 'Se lanza una piedra hacia arriba. Ya en el aire, mientras baja, ¿cuál diagrama representa las fuerzas sobre la piedra? Sin resistencia del aire.',
      opciones: [
        diagramaAire([M5.F('peso', 'aba')], 'Solo el peso, hacia abajo'),
        diagramaAire([M5.F('peso', 'aba', 3), M5.F('lanzamiento', 'arr', 1)], 'El peso hacia abajo y una flecha más corta hacia arriba, llamada fuerza del lanzamiento'),
        diagramaAire([], 'Ninguna fuerza'),
        diagramaAire([M5.F('peso', 'aba', 2, { ox: -18, et: { x: 186, y: 250, ancla: 'end' } }), M5.F('movimiento', 'aba', 2, { ox: 18, et: { x: 234, y: 250, ancla: 'start' } })], 'El peso hacia abajo y otra flecha hacia abajo, llamada fuerza del movimiento')
      ],
      opcionesPlano: ['Solo el peso, hacia abajo', 'El peso hacia abajo y una flecha más corta hacia arriba, llamada fuerza del lanzamiento', 'Ninguna fuerza', 'El peso hacia abajo y otra flecha hacia abajo, llamada fuerza del movimiento'],
      porQue: {
        1: '¿Quién la hace? La mano ya la soltó: esa fuerza se acabó cuando salió de la mano.',
        2: 'El peso va siempre. Sin él, la piedra no bajaría.',
        3: '¿Quién la hace? Moverse no es una fuerza: la velocidad es lo que trae.'
      },
      pistas: ['De cada flecha: ¿quién la hace? ¿Quién toca la piedra ahora?', 'Sube, llega arriba y baja: ¿cambian sus fuerzas?'],
      solucion: ['El peso va siempre, hacia abajo.', 'Ya en el aire nada la toca: no hay más flechas.', 'Es la misma flecha al subir, arriba y al bajar: solo el peso.']
    },
    {
      id: 'e11', nivel: 'examen', tema: 'parabolico', tipo: 'opciones', correcta: 0,
      enunciado: 'Dos canicas salen rodando del borde de la misma mesa, una a 1,5 m/s y otra a 3 m/s. Sin aire, ¿qué se puede afirmar?',
      plano: 'Dos canicas salen rodando del borde de la misma mesa, una a 1,5 m/s y otra a 3 m/s. Sin aire, ¿qué se puede afirmar?',
      opciones: ['Llegan al piso al tiempo, y la de 3 m/s cae el doble de lejos', 'La de 3 m/s llega primero y cae el doble de lejos', 'Llegan al piso al tiempo y caen en el mismo lugar', 'La de 1,5 m/s llega primero, porque cae más derecho'],
      opcionesPlano: ['Llegan al piso al tiempo, y la de 3 m/s cae el doble de lejos', 'La de 3 m/s llega primero y cae el doble de lejos', 'Llegan al piso al tiempo y caen en el mismo lugar', 'La de 1,5 m/s llega primero, porque cae más derecho'],
      porQue: {
        1: 'El tiempo de caída sale solo del eje vertical, y en ese eje las dos son iguales.',
        2: 'Llegan al tiempo, pero en ese tiempo la más rápida avanza más.',
        3: 'Cada eje por su lado: avanzar de lado no cambia cuánto tarda en caer.'
      },
      pistas: ['Cada eje por su lado: ¿de qué depende el tiempo de caída?', 'Con el mismo tiempo, ¿cuál avanza más en lo horizontal?'],
      solucion: ['En lo vertical las dos caen desde la misma altura, desde 0: tardan lo mismo.', `En lo horizontal, ${mt(L.d, igual, L.v, por, L.t)}: con el mismo tiempo y el doble de velocidad, el doble de distancia.`]
    },
    {
      id: 'e12', nivel: 'examen', tema: 'parabolico', tipo: 'numero', respuesta: 1.2, unidad: 'm',
      enunciado: `Una pelota sale rodando del borde de una mesa de ${q('0,8', 'm')} de alto, a ${q(3, 'm/s')}. Sin aire, ¿a qué distancia del borde de la mesa toca el piso?`,
      plano: 'Una pelota sale rodando del borde de una mesa de 0,8 m de alto, a 3 m/s. Sin aire, ¿a qué distancia del borde de la mesa toca el piso?',
      errores: [
        { valor: 0.4, msg: 'Ese es el tiempo de caída. Falta el eje horizontal: velocidad por tiempo.' },
        { valor: 2.4, msg: 'Ese resultado sale de 3 · 0,8: se usó la altura como si fuera el tiempo.' },
        { valor: 0.48, msg: 'Ese resultado sale de 3 · 0,16: 0,16 es t². Falta la raíz.' },
        { valor: 3.75, msg: 'Ese resultado sale de 3 ÷ 0,8: se mezclaron los ejes. Primero el tiempo, con el vertical.' }
      ],
      pistas: ['Primero el tiempo, con el eje vertical.', 'Después el eje horizontal, con velocidad constante.'],
      solucion: [`Vertical: ${mt(n(5), por, t2, igual, n('0,8'), flecha, t2, igual, n('0,16'), flecha, L.t, igual, q('0,4', 's'))}.`, `Horizontal: ${mt(L.d, igual, n(3), por, n('0,4'), igual, q('1,2', 'm'))}.`]
    },
    {
      id: 'e13', nivel: 'examen', tema: 'subida', tipo: 'numero', respuesta: 25, unidad: 'm/s',
      enunciado: 'Una pelota lanzada verticalmente hacia arriba tarda 5 s en volver a la mano. Sin aire y con g = 10 m/s², ¿con qué velocidad se lanzó?',
      plano: 'Una pelota lanzada verticalmente hacia arriba tarda 5 s en volver a la mano. Sin aire y con g = 10 m/s², ¿con qué velocidad se lanzó?',
      errores: [
        { valor: 50, msg: 'Ese resultado sale de 10 · 5: 5 s es ida y vuelta. Subiendo tarda la mitad.' },
        { valor: 2.5, msg: 'Ese es el tiempo de subida. Falta la velocidad.' },
        { valor: 0.5, msg: 'Ese resultado sale de dividir 5 ÷ 10. La gravedad le quita 10 m/s en cada segundo de subida.' }
      ],
      pistas: ['Si tarda 5 s en ir y volver, ¿cuánto tarda en subir?', 'En ese tiempo, la gravedad le quitó toda la velocidad.'],
      solucion: ['Bajar es subir al revés: sube en 2,5 s y baja en 2,5 s.', `En lo más alto ${mt(L.vf, igual, n(0))}: ${mt(n(0), igual, L.v0, menos, n(10), por, n('2,5'))}.`, `${mt(L.v0, igual, q(25, 'm/s'))}`]
    },
    // ----- Retos -----
    {
      id: 'e14', nivel: 'reto', tema: 'mision', tipo: 'numero', respuesta: 4, unidad: 's',
      enunciado: `Desde el borde de un acantilado de ${q(20, 'm')} sobre el mar se lanza una piedra hacia arriba a ${q(15, 'm/s')}. Sin aire y con ${mt(L.g, igual, q(10, 'm/s²'))}, ¿cuántos segundos tarda en llegar al agua?`,
      plano: 'Desde el borde de un acantilado de 20 m sobre el mar se lanza una piedra hacia arriba a 15 m/s. Sin aire y con g = 10 m/s², ¿cuántos segundos tarda en llegar al agua?',
      errores: [
        { valor: 3, msg: 'Ese es el tiempo en volver a la altura del borde. Todavía le faltan 20 m para el agua.' },
        { valor: 1.5, msg: 'Ese es el tiempo de subida.' },
        { valor: 2, msg: 'Ese resultado sale de 5 · t² = 20, como si se soltara. Pero se lanzó hacia arriba.' },
        { valor: -1, msg: 'Esa es la otra raíz. Un tiempo negativo es antes del lanzamiento: se descarta.' }
      ],
      pistas: ['Con arriba positivo y el borde en h = 0, el agua está en h = −20.', `Queda ${mt(n(15), por, L.t, menos, n(5), por, t2, igual, n(-20))}: un candado con t². ¿Qué llave lo abre?`],
      solucion: [
        `${mt(L.h, igual, n(15), por, L.t, menos, n(5), por, t2)}, y en el agua ${mt(L.h, igual, n(-20))}.`,
        `${mt(n(5), por, t2, menos, n(15), por, L.t, menos, n(20), igual, n(0))}. Dividiendo todo entre 5: ${mt(t2, menos, n(3), por, L.t, menos, n(4), igual, n(0))}.`,
        `Factorizando: ${mt(op('('), L.t, menos, n(4), op(')'), op('('), L.t, mas, n(1), op(')'), igual, n(0))}. Sirve ${mt(L.t, igual, q(4, 's'))}; ${mt(L.t, igual, n(-1))} es antes del lanzamiento.`
      ]
    },
    {
      id: 'e15', nivel: 'reto', tema: 'mision', tipo: 'numero', respuesta: 4000, unidad: 'm',
      enunciado: `Un avión de carga vuela en horizontal a ${q(2000, 'm')} de altura y a ${q(720, 'km/h')}, y tiene que dejar caer una caja con víveres sobre una isla. Sin aire, ¿a cuántos metros de la isla, medidos en horizontal, tiene que soltarla?`,
      plano: 'Un avión de carga vuela en horizontal a 2000 m de altura y a 720 km/h, y tiene que dejar caer una caja con víveres sobre una isla. Sin aire, ¿a cuántos metros de la isla, medidos en horizontal, tiene que soltarla?',
      errores: [
        { valor: 14400, msg: 'Ese resultado sale de 720 · 20: mezcla km/h con segundos. Primero hay que pasar a m/s.' },
        { valor: 400, msg: 'Ese es t². Falta la raíz para tener el tiempo.' },
        { valor: 200, msg: 'Esa es la velocidad del avión en m/s. Falta multiplicarla por el tiempo de caída.' },
        { valor: 20, msg: 'Ese es el tiempo de caída. Falta el eje horizontal.' }
      ],
      pistas: ['Al soltarla, la caja sigue avanzando con el avión. Primero el tiempo, con el eje vertical.', 'Para el horizontal, la velocidad en m/s: km/h ÷ 3,6.'],
      solucion: [
        `Vertical: ${mt(n(5), por, t2, igual, n(2000), flecha, t2, igual, n(400), flecha, L.t, igual, q(20, 's'))}.`,
        `${mt(q(720, 'km/h'), entre, n('3,6'), igual, q(200, 'm/s'))}`,
        `Horizontal: ${mt(L.d, igual, n(200), por, n(20), igual, q(4000, 'm'))}: hay que soltarla 4 km antes.`
      ]
    }
  ];

  const NIVELES = { basico: 'Básico', intermedio: 'Intermedio', examen: 'Tipo examen', reto: 'Reto' };
  const TEMAS = {
    velocidad: 'La velocidad en cada segundo', arriba: 'En lo más alto', subida: 'Tiempo de subida', altura: 'Altura máxima',
    soltar: 'Soltar desde arriba', grafica: 'La gráfica de velocidad', masa: 'La masa no importa', flechas: 'Las flechas en el aire',
    parabolico: 'Tiro parabólico', mision: 'Misión de vuelo'
  };

  /* ---------- Plan de la clase (lo ve el estudiante en la cabecera del módulo) ---------- */
  const PLAN_CLASE = [
    ['8 min', 'Tres diagramas de cabeza, en el papel. Después se comparan.'],
    ['5 min', 'Ideas clave, parte 1: una regla con dos casos, y la velocidad no es una fuerza.'],
    ['10 min', 'Ideas clave, parte 2: tres apuestas y la caída libre.'],
    ['12 min', 'La torre: retos 1 y 2.'],
    ['8 min', 'Ideas clave, parte 3: las cuentas.'],
    ['7 min', 'En el papel: reto 3. Después se compara en la torre.'],
    ['5 min', 'Pausa.'],
    ['7 min', 'La torre: reto 4.'],
    ['8 min', 'Ideas clave, parte 4: el tiro parabólico.'],
    ['8 min', 'La torre: retos 5 y 6.'],
    ['4 min', 'Las tácticas para el examen (módulo 5, ideas clave, parte 5).'],
    ['18 min', 'Práctica: los ejercicios 8 y 10, y cinco preguntas reales de cuadernillos del ICFES, con cronómetro.'],
    ['6 min', 'Revisión: ¿qué trampa tenía cada una?'],
    ['6 min', 'Cierre: ¿cuál apuesta cambió? De tarea: los demás ejercicios de la práctica.']
  ];

  MA.M6 = {
    L, SF, G, caida, RETOS_TORRE, EJERCICIOS, NIVELES, TEMAS, PLAN_CLASE,
    recuerdo, fotos, grafica, componentes, avionPaquete, canica
  };
})();
