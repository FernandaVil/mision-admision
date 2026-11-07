/* =====================================================================
   Módulo 5 · contenido (física mecánica II: dinámica)
   ---------------------------------------------------------------------
   - Dibujos: escena (el cuerpo, lo que lo rodea y sus flechas) y grafica
     (los gráficos por tramos). Los usan las
     diapositivas, las opciones de diagrama y las herramientas.
   - FUERZAS: las verdaderas y las falsas (nadie las hace).
   - RETOS_FUERZAS: mesa de fuerzas (ids: m5.fuerzas.*). Con modo 'cambia'
     el diagrama ya viene hecho y se decide qué flechas cambian.
   - RETOS_RAMPA: la rampa (ids: m5.rampa.*).
   - EJERCICIOS: práctica (ids: m5.prac.*). Todo es de autoría propia: del
     ICFES no se copia ningún enunciado ni figura, porque el repositorio
     es público. Las preguntas reales se usan en clase, desde los
     cuadernillos. Tampoco repiten los ejemplos de la clase.
   Código de color: violeta es el peso (la única fuerza sin contacto),
   color de texto son los contactos, ámbar es la fuerza neta y la
   aceleración (siempre apuntan igual) y azul es la velocidad.
   Los ids de retos y ejercicios no se cambian: el avance se guarda con
   ellos en el navegador.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { vr, un, n, op, fr, mt, q, pega, raiz } = MA.f;
  const { pot } = MA.M2;
  const por = op('·'), igual = op('='), mas = op('+'), menos = op('−'), entre = op('÷');

  /* ---------- Letras ---------- */
  const L = {
    P: vr('P'), m: vr('m'), g: vr('g'), a: vr('a'), N: vr('N'), E: vr('E'), f: vr('f'), T: vr('T'),
    d: vr('d'), t: vr('t'), v0: vr('v', '0'), vf: vr('v', 'f'), th: vr('θ'),
    Ppar: vr('P', '∥'), Pper: vr('P', '⊥'), S: vr('S'), R: vr('R')
  };
  const SF = pega(op('Σ'), vr('F'));
  const sen = `<span class="m5-fn">sen</span> ${L.th}`, cos = `<span class="m5-fn">cos</span> ${L.th}`;

  /* ---------- Direcciones ----------
     Un vector unitario en la pantalla (y hacia abajo). La rampa va alta a
     la izquierda y baja a la derecha, con ángulo ang: baja y sube van a lo
     largo de ella; sale y entra, perpendiculares. */
  const RAD = Math.PI / 180, R2 = Math.SQRT1_2;
  function vector(dir, ang = 30) {
    const c = Math.cos(ang * RAD), s = Math.sin(ang * RAD);
    return {
      der: [1, 0], izq: [-1, 0], arr: [0, -1], aba: [0, 1],
      arrder: [R2, -R2], arrizq: [-R2, -R2], abader: [R2, R2], abaizq: [-R2, R2],
      baja: [c, s], sube: [-c, -s], sale: [s, -c], entra: [-s, c]
    }[dir];
  }
  // Las 8 posiciones de una flecha, en el sentido de las agujas del reloj
  const DIRS_PLANO = ['der', 'abader', 'aba', 'abaizq', 'izq', 'arrizq', 'arr', 'arrder'];
  const DIRS_RAMPA = ['der', 'baja', 'aba', 'entra', 'izq', 'sube', 'arr', 'sale'];
  const direcciones = tipo => (tipo === 'rampa' ? DIRS_RAMPA : DIRS_PLANO);
  const NOMBRE_DIR = {
    der: 'hacia la derecha', izq: 'hacia la izquierda', arr: 'hacia arriba', aba: 'hacia abajo',
    arrder: 'en diagonal, arriba y a la derecha', arrizq: 'en diagonal, arriba y a la izquierda',
    abader: 'en diagonal, abajo y a la derecha', abaizq: 'en diagonal, abajo y a la izquierda',
    baja: 'rampa abajo', sube: 'rampa arriba', sale: 'perpendicular a la rampa, hacia afuera', entra: 'perpendicular a la rampa, hacia adentro'
  };
  const LARGOS = [0, 46, 72, 98];   // corto (1), medio (2), largo (3)
  const NOMBRE_LARGO = ['', 'corta', 'media', 'larga'];

  /* ---------- Las fuerzas ---------- */
  const FUERZAS = {
    peso: { nombre: 'Peso', etq: 'Peso', clase: 'peso', mal: 'El peso apunta siempre hacia abajo: el planeta jala hacia su centro.' },
    normal: { nombre: 'Normal', etq: 'Normal', mal: 'La normal sale de la superficie y es perpendicular a ella.' },
    friccion: { nombre: 'Fricción', etq: 'Fricción', mal: 'La fricción va a lo largo de la superficie, contra el deslizamiento.' },
    empuje: { nombre: 'Empuje', etq: 'Empuje', mal: 'El empuje apunta hacia donde se empuja.' },
    tension: { nombre: 'Tensión', etq: 'Tensión', mal: 'Una cuerda solo jala: la flecha sale del cuerpo a lo largo de la cuerda.' },
    sustentacion: { nombre: 'Sustentación', etq: 'Sustentación', mal: 'Las alas sostienen el avión: la sustentación apunta hacia arriba.' },
    resistencia: { nombre: 'Resistencia del aire', etq: 'Resistencia', mal: 'El aire frena: la resistencia va en contra del movimiento.' },
    cuerdaV: { nombre: 'Cuerda vertical', etq: 'Cuerda vertical' },
    cuerdaH: { nombre: 'Cuerda horizontal', etq: 'Cuerda horizontal' },
    ventilador: { nombre: 'Ventilador', etq: 'Ventilador' },
    // Las falsas: nadie las hace
    movimiento: { nombre: 'Fuerza del movimiento', etq: 'Movimiento', falsa: true, porQue: '¿Quién la hace? Nadie toca el cuerpo para hacerla. Moverse no es una fuerza: lo que ya se mueve sigue moviéndose sin que nadie lo empuje.' },
    inercia: { nombre: 'Inercia', etq: 'Inercia', falsa: true, porQue: 'La inercia no es una fuerza: es la tendencia a seguir como venía. Nadie la hace, así que no lleva flecha. La caja no es empujada hacia adelante: es el camión el que frena.' },
    empujon: { nombre: 'Fuerza del empujón', etq: 'Empujón', falsa: true, porQue: 'El empujón se acabó cuando el empleado soltó la caja. Una fuerza de contacto no se queda guardada en el cuerpo.' },
    lanzamiento: { nombre: 'Fuerza del lanzamiento', etq: 'Lanzamiento', falsa: true, porQue: 'La fuerza de la mano se acabó cuando la pelota salió de ella. Ya en el aire, nada la toca.' },
    bajada: { nombre: 'Fuerza rampa abajo', etq: 'Rampa abajo', falsa: true, porQue: 'Esa parte ya está dentro del peso: dibujarla aparte la cuenta dos veces.' },
    ladrido: { nombre: 'Ladrido de Toby', etq: 'Ladrido', falsa: true, porQue: 'Toby ladra, pero no toca la caja. Sin contacto no hay flecha, y un ladrido no empuja.' },
    zumbido: { nombre: 'Zumbido de la mosca', etq: 'Zumbido', falsa: true, porQue: 'La mosca zumba, pero no toca el costal. Sin contacto no hay flecha.' }
  };
  // Una flecha para dibujar: F('peso', 'aba', 3)
  const F = (id, dir, largo = 2, o = {}) => Object.assign({ id, dir, largo, texto: FUERZAS[id].etq, clase: FUERZAS[id].clase || 'contacto' }, o);

  /* ---------- Dibujos ---------- */
  const ANCHO = 420, ALTO = 280;
  const MITAD = { caja: 24, melon: 18, pelota: 14, costal: 26, avion: 14, toby: 15, bici: 22 };

  // Dónde queda el cuerpo. En la rampa, apoyado en la superficie
  function geometria(e) {
    const h = MITAD[e.cuerpo] || 24, ang = e.angulo == null ? 30 : e.angulo;
    if (e.tipo === 'rampa') {
      const x1 = 372, y1 = 250, largo = 330, s = 160;
      const [ux, uy] = vector('sube', ang), [nx, ny] = vector('sale', ang);
      const px = x1 + ux * s, py = y1 + uy * s;
      return { ang, h, x1, y1, largo, cx: px + nx * h, cy: py + ny * h };
    }
    return { ang, h, cx: 210, cy: 140, suelo: 140 + h };
  }

  function flechaSvg(cx, cy, fl, ang) {
    const [ux, uy] = vector(fl.dir, ang);
    const x0 = cx + (fl.ox || 0), y0 = cy + (fl.oy || 0);
    const l = fl.px != null ? fl.px : LARGOS[fl.largo || 2];
    if (l < 8) return '';
    const x1 = x0 + ux * l, y1 = y0 + uy * l;
    const bx = x1 - ux * 12, by = y1 - uy * 12, w = 6;
    const punta = `${x1.toFixed(1)},${y1.toFixed(1)} ${(bx - uy * w).toFixed(1)},${(by + ux * w).toFixed(1)} ${(bx + uy * w).toFixed(1)},${(by - ux * w).toFixed(1)}`;
    let tx = x1 + ux * 14, ty = y1 + uy * 14 + 5, ancla = 'middle';
    if (ux > 0.35) ancla = 'start'; else if (ux < -0.35) ancla = 'end';
    if (uy < -0.7) ty = y1 - 8; else if (uy > 0.7) ty = y1 + 18;
    if (fl.et) { tx = fl.et.x; ty = fl.et.y; ancla = fl.et.ancla || ancla; }
    const paso = fl.paso ? ` d-oculta-svg" data-paso="${fl.paso}` : '';
    return `
      <g class="m5-flecha m5-f-${fl.clase || 'contacto'}${paso}">
        <line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}"/>
        <polygon points="${punta}"/>
        ${fl.texto ? `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${ancla}">${fl.texto}</text>` : ''}
      </g>`;
  }

  // Toby Maguire, de perfil y mirando a la derecha
  const tobySvg = (x, y, s = 1, clase = '') => `
    <g class="m5-silueta ${clase}" transform="translate(${x} ${y}) scale(${s})">
      <path d="M-18 -8q-6 -2 -9 -12l3 -1q3 7 8 8h20v-6q0 -6 7 -6h5l6 4q2 2 -1 3l-6 1v3q0 8 -6 11v14h-6v-11h-14v11h-6z"/>
      <path d="M7 -24l-2 -7 6 3z"/>
      <circle class="m5-ojo" cx="13" cy="-21" r="1.5"/>
    </g>`;
  const avionLado = (x, y) => `
    <g class="m5-silueta" transform="translate(${x} ${y})">
      <path d="M-58 -2q10 -13 62 -13q30 0 54 15q-24 12 -54 12q-44 0 -62 -14z"/>
      <path d="M-50 -6l-14 -24h15l18 22z"/>
      <path d="M-12 4l-24 24h15l38 -24z"/>
    </g>`;

  function cuerpoSvg(tipo, x, y, rot = 0) {
    const g = html => `<g class="m5-cuerpo" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot})">${html}</g>`;
    switch (tipo) {
      case 'melon': return g('<ellipse rx="25" ry="18"/><path class="m5-raya" d="M-14 -14q-6 14 0 28M0 -18v36M14 -14q6 14 0 28"/>');
      case 'pelota': return g('<circle r="14"/><path class="m5-raya" d="M-14 0q14 -8 28 0M-14 0q14 8 28 0"/>');
      case 'costal': return g('<path d="M-20 -22q20 8 40 0l6 36q-2 12 -26 12t-26 -12z"/><path class="m5-raya" d="M-10 -8q10 4 20 0"/>');
      case 'bici': return g('<circle cx="-17" cy="10" r="12"/><circle cx="17" cy="10" r="12"/><path class="m5-raya" d="M-17 10l10 -20h18l6 20M-7 -10l10 20h14M-9 -16h8M11 -10v-6h6"/>');
      case 'toby': return tobySvg(x, y, 1.4);
      case 'avion': return avionLado(x, y);
      default: return g('<rect x="-24" y="-24" width="48" height="48" rx="3"/><path class="m5-raya" d="M-24 -8h48M-8 -24v16M8 -24v16"/>');
    }
  }

  const rayas = (x0, x1, y) => {
    let s = '';
    for (let x = x0; x < x1; x += 16) s += `M${x} ${y}l-8 9`;
    return `<path class="m5-rayado" d="${s}"/>`;
  };

  // Lo que rodea al cuerpo. Lo que está en m5-extra se apaga para dibujar el cuerpo solo
  function extraSvg(id, g) {
    const { cx, suelo } = g;
    switch (id) {
      case 'empleado': return `
        <g class="m5-trazo">
          <circle cx="${cx - 80}" cy="${suelo - 72}" r="10"/>
          <path d="M${cx - 80} ${suelo - 62}l-12 34M${cx - 92} ${suelo - 28}l-12 28M${cx - 92} ${suelo - 28}l6 28M${cx - 82} ${suelo - 54}l${58 - 2} 18"/>
        </g>
        <text class="m5-rotulo" x="${cx - 110}" y="${suelo - 88}" text-anchor="middle">Empleado</text>`;
      case 'toby': return `
        ${tobySvg(cx + 172, suelo - 11)}
        <text class="m5-rotulo" x="${cx + 178}" y="${suelo - 50}" text-anchor="middle">¡Guau!</text>`;
      case 'camion': return `
        <rect class="m5-plataforma" x="30" y="${suelo}" width="306" height="12"/>
        <rect class="m5-plataforma" x="336" y="${suelo - 44}" width="62" height="56" rx="6"/>
        <circle class="m5-rueda" cx="84" cy="${suelo + 22}" r="12"/>
        <circle class="m5-rueda" cx="358" cy="${suelo + 22}" r="12"/>`;
      case 'jalador': return `
        <line class="m5-cuerda" x1="${cx + 26}" y1="${g.cy}" x2="${cx + 88}" y2="${g.cy}"/>
        <g class="m5-trazo">
          <circle cx="${cx + 104}" cy="${suelo - 72}" r="10"/>
          <path d="M${cx + 104} ${suelo - 62}l12 34M${cx + 116} ${suelo - 28}l12 28M${cx + 116} ${suelo - 28}l-6 28M${cx + 107} ${suelo - 54}l-19 ${g.cy - suelo + 54}"/>
        </g>
        <text class="m5-rotulo" x="${cx + 124}" y="${suelo - 88}" text-anchor="middle">Yonaiker</text>`;
      case 'mosca': return `<circle class="m5-mosca" cx="${cx - 58}" cy="${g.cy - 58}" r="3"/><path class="m5-trazo-fino" d="M${cx - 70} ${g.cy - 44}q8 -12 10 -12M${cx - 46} ${g.cy - 72}q-6 6 -10 10"/><text class="m5-rotulo" x="${cx - 76}" y="${g.cy - 66}" text-anchor="middle">Bzzz</text>`;
      case 'mano': return `<path class="m5-trazo" d="M${cx - 96} ${g.cy + 92}q6 -12 16 -8l14 8"/><text class="m5-rotulo" x="${cx - 80}" y="${g.cy + 112}" text-anchor="middle">La mano ya la soltó</text>`;
      default: return '';
    }
  }

  function fondo(e, g = geometria(e)) {
    const { cx, cy, ang } = g;
    let s = '';
    if (e.tipo === 'rampa') {
      const c = Math.cos(ang * RAD), si = Math.sin(ang * RAD);
      const xa = g.x1 - g.largo * c, ya = g.y1 - g.largo * si;
      const r = 40;
      s += `
        <line class="m5-piso" x1="20" y1="${g.y1}" x2="404" y2="${g.y1}"/>
        <polygon class="m5-rampa" points="${g.x1},${g.y1} ${xa.toFixed(1)},${g.y1} ${xa.toFixed(1)},${ya.toFixed(1)}"/>
        <path class="m5-arco" d="M${g.x1 - r} ${g.y1}A${r} ${r} 0 0 1 ${(g.x1 - r * c).toFixed(1)} ${(g.y1 - r * si).toFixed(1)}"/>
        <text class="m5-rotulo" x="${(g.x1 - r - 14).toFixed(1)}" y="${g.y1 - 8}" text-anchor="middle">${MA.fmt(ang)}°</text>`;
    } else if (e.tipo === 'piso') {
      if (!(e.extras || []).includes('camion')) s += `<line class="m5-piso" x1="40" y1="${g.suelo}" x2="380" y2="${g.suelo}"/>${rayas(52, 380, g.suelo)}`;
      else s += `<line class="m5-piso" x1="20" y1="${g.suelo + 34}" x2="400" y2="${g.suelo + 34}"/>`;
    } else if (e.tipo === 'colgado' || e.tipo === 'costal') {
      s += `<line class="m5-piso" x1="110" y1="24" x2="310" y2="24"/>${rayas(124, 310, 15)}
        <line class="m5-cuerda" x1="${cx}" y1="24" x2="${cx}" y2="${cy - g.h}"/>`;
      if (e.tipo === 'costal') {
        s += `<line class="m5-piso" x1="396" y1="60" x2="396" y2="220"/>
          <line class="m5-cuerda" x1="${cx + 22}" y1="${cy}" x2="396" y2="${cy}"/>
          <g class="m5-extra"><path class="m5-viento" d="M372 176h-54M372 190h-66M372 204h-54"/><text class="m5-rotulo" x="372" y="226" text-anchor="end">Ventilador</text></g>`;
      }
    }
    const extras = (e.extras || []).map(id => `<g class="m5-extra">${extraSvg(id, g)}</g>`).join('');
    const rot = e.tipo === 'rampa' ? ang : 0;
    return `${s}${extras}${cuerpoSvg(e.cuerpo, cx, cy, rot)}${movSvg(e, g)}`;
  }

  // La flecha fina azul dice hacia dónde se mueve; no es una fuerza
  function movSvg(e, g) {
    if (!e.mov) return '';
    let x, y;
    if (e.tipo === 'rampa') {
      // Por dentro de la rampa, lejos del peso y del ángulo
      const [nx, ny] = vector('sale', g.ang), [ux, uy] = vector('sube', g.ang), s = e.mov === 'sube' ? 198 : 250;
      x = g.x1 + ux * s - nx * 24;
      y = g.y1 + uy * s - ny * 24;
    } else if (e.mov === 'arr') { x = g.cx + 62; y = g.cy + 30; }
    else if (e.cuerpo === 'avion') { x = g.cx + 56; y = g.cy + 66; }
    else { x = g.cx + 58; y = (g.suelo || g.cy) + ((e.extras || []).includes('camion') ? -46 : 22); }
    const fl = { dir: e.mov, px: 52, clase: 'vel', texto: '' };
    const [ux, uy] = vector(e.mov, g.ang);
    return `${flechaSvg(x, y, fl, g.ang)}<text class="m5-rotulo m5-rotulo-vel" x="${(x + ux * 26).toFixed(1)}" y="${(y + uy * 26 + (e.mov === 'arr' ? 0 : 20)).toFixed(1)}" dx="${e.mov === 'arr' ? 12 : 0}" text-anchor="${e.mov === 'arr' ? 'start' : 'middle'}">se mueve</text>`;
  }

  function escena(e) {
    const g = geometria(e);
    const flechas = (e.flechas || []).map(fl => flechaSvg(g.cx, g.cy, fl, g.ang)).join('');
    return `<svg class="m5-fig ${e.clase || ''}" viewBox="0 0 ${ANCHO} ${ALTO}" role="img" aria-label="${MA.esc(e.etiqueta || '')}">${fondo(e, g)}${flechas}</svg>`;
  }

  // Un gráfico por tramos: puntos [[x, y], …]. Cada tramo puede llevar un rótulo
  function grafica({ ejeX, ejeY, puntos, marcasX = [], marcasY = [], etiqueta = '', clase = '', paso }) {
    const X0 = 58, X1 = 350, Y0 = 170, Y1 = 26;
    const maxX = Math.max(...puntos.map(p => p[0])), maxY = Math.max(...puntos.map(p => p[1]));
    const x = v => X0 + v / maxX * (X1 - X0 - 18), y = v => Y0 - v / maxY * (Y0 - Y1 - 14);
    const guiasX = marcasX.map(v => `<line class="m5-g-guia" x1="${x(v)}" y1="${Y0}" x2="${x(v)}" y2="${y(Math.max(...puntos.filter(p => p[0] === v).map(p => p[1])))}"/><text class="m5-g-num" x="${x(v)}" y="${Y0 + 18}" text-anchor="middle">${MA.fmt(v)}</text>`).join('');
    const guiasY = marcasY.map(v => `<line class="m5-g-guia" x1="${X0}" y1="${y(v)}" x2="${x(puntos.find(p => p[1] === v)[0])}" y2="${y(v)}"/><text class="m5-g-num" x="${X0 - 8}" y="${y(v) + 5}" text-anchor="end">${MA.fmt(v)}</text>`).join('');
    const linea = puntos.map(p => `${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join(' ');
    return `
      <svg class="m5-graf ${clase}" viewBox="0 0 390 210" role="img" aria-label="${MA.esc(etiqueta)}">
        <path class="m5-g-eje" d="M${X0} ${Y1 - 12}V${Y0}H${X1 + 10}"/>
        <path class="m5-g-punta" d="M${X0} ${Y1 - 18}l-5 9h10zM${X1 + 16} ${Y0}l-9 -5v10z"/>
        ${guiasX}${guiasY}
        <polyline class="m5-g-linea${paso ? ' d-oculta-svg' : ''}" ${paso ? `data-paso="${paso}"` : ''} points="${linea}"/>
        <text class="m5-g-rot" x="${X0 + 8}" y="${Y1 - 4}">${ejeY}</text>
        <text class="m5-g-rot" x="${X1 + 12}" y="${Y0 + 36}" text-anchor="end">${ejeX}</text>
      </svg>`;
  }
  const graficaYonaiker = (o = {}) => grafica(Object.assign({
    ejeX: 'Tiempo (s)', ejeY: 'Velocidad (m/s)', puntos: [[0, 0], [3, 20], [7, 20]], marcasX: [3, 7], marcasY: [20],
    etiqueta: 'Gráfico de velocidad contra tiempo de Yonaiker: de 0 a 3 s sube de 0 a 20 m/s y de 3 a 7 s se mantiene en 20 m/s'
  }, o));

  // Un diagrama como opción de un ejercicio
  const op4 = e => `<span class="m5-op-fig">${escena(Object.assign({ clase: 'm5-op' }, e))}</span>`;

  /* ---------- Mesa de fuerzas ----------
     toca: el paso 1, qué toca el cuerpo (los últimos retos lo saltan).
     lista: las fuerzas que se ofrecen, verdaderas y falsas.
     fuerzas: las flechas que van, con su dirección.
     iguales / mayores: lo que debe cumplir el largo de las flechas.
     sobran: por qué no va una fuerza verdadera en este caso.
     dirMal: por qué no va esa dirección, cuando hay un error típico.
     preguntas: predecir con las flechas (renglon va a la bitácora).
     numeros: la suma con signos, la neta y la aceleración.
     pareja: la tercera ley.
     luego: a dónde sigue la clase al terminar el reto. */
  const ejeV = (arriba, abajo, renglon, nota) => ({
    pregunta: 'En el eje vertical, ¿cómo quedan las flechas?', etq: 'Eje vertical', renglon, nota,
    opciones: [
      { txt: 'Se anulan', ok: true },
      { txt: `Gana ${abajo}`, porQue: 'Si ganara, el cuerpo aceleraría hacia abajo, y no lo hace.' },
      { txt: `Gana ${arriba}`, porQue: 'Si ganara, el cuerpo aceleraría hacia arriba, y no lo hace.' }
    ]
  });
  const pesoNoInclina = { entra: 'El peso no se inclina con la rampa: el planeta jala siempre hacia abajo.', sale: 'El peso no se inclina con la rampa: el planeta jala siempre hacia abajo.' };
  const normalPerp = { arr: 'La normal sale perpendicular a la superficie, no contraria al peso. En la rampa no apunta hacia arriba.' };
  const normalMenor = ['peso', 'normal', 'En la rampa, la normal sostiene solo la parte del peso que aprieta contra ella: tiene que ser más corta que el peso.'];
  const igualesPN = ['peso', 'normal', 'El piso sostiene todo el peso: en el eje vertical las flechas son iguales.'];

  const GRUPOS_FUERZAS = { piso: 'Piso', aire: 'Aire y cuerdas', neta: 'Fuerza neta', rampa: 'Rampa', mas: 'Uno más' };
  const RETOS_FUERZAS = [
    {
      id: 'r1', grupo: 'piso', titulo: 'Toby, quieto',
      contexto: 'Toby Maguire está quieto en el piso del depósito, esperando que le tiren la pelota. Se empieza por lo más sencillo.',
      escena: { tipo: 'piso', cuerpo: 'toby' },
      toca: { opciones: [{ txt: 'El piso', ok: true }, { txt: 'La Tierra', porQue: 'La Tierra sí jala a Toby, pero sin tocarlo: esa es la flecha del peso, y va siempre.' }, { txt: 'La pelota', porQue: 'Todavía no se la han tirado: no lo toca.' }], bien: 'Solo el piso lo toca.' },
      lista: ['peso', 'normal', 'friccion', 'movimiento'],
      fuerzas: { peso: { dir: 'aba' }, normal: { dir: 'arr' } },
      iguales: [igualesPN],
      sobran: { friccion: 'Nadie intenta deslizar a Toby: sin deslizamiento, no hay fricción.' },
      preguntas: [ejeV('la normal', 'el peso', mt(L.N, menos, L.P, igual, n(0)), 'Quieto: las flechas se anulan.')],
      cierre: 'Quieto, las flechas se anulan: la normal es igual al peso.'
    },
    {
      id: 'r2', grupo: 'piso', titulo: 'Arrastrar con una cuerda',
      contexto: 'Yonaiker arrastra un costal con una cuerda horizontal, en línea recta y con velocidad constante. El piso tiene fricción. Una mosca le da vueltas al costal, sin posarse.',
      escena: { tipo: 'piso', cuerpo: 'costal', extras: ['jalador', 'mosca'], mov: 'der' },
      toca: { opciones: [{ txt: 'El piso', ok: true }, { txt: 'La cuerda', ok: true }, { txt: 'La mosca, que zumba', porQue: 'La mosca no se posa: no toca el costal, y un zumbido no empuja.' }], bien: 'Lo tocan el piso y la cuerda. La mosca solo hace ruido.' },
      lista: ['peso', 'normal', 'tension', 'friccion', 'empuje', 'movimiento', 'zumbido'],
      fuerzas: { peso: { dir: 'aba' }, normal: { dir: 'arr' }, tension: { dir: 'der' }, friccion: { dir: 'izq' } },
      iguales: [igualesPN, ['tension', 'friccion', 'Eso sería acelerar. Con velocidad constante, las flechas se anulan: para seguir igual no hace falta ganar, basta empatar.']],
      sobran: { empuje: 'Nadie empuja el costal: Yonaiker lo jala, y esa flecha es la tensión.' },
      preguntas: [
        { pregunta: 'En el eje horizontal, ¿cómo quedan las flechas?', etq: 'Eje horizontal', renglon: mt(L.T, menos, L.f, igual, n(0)), opciones: [
          { txt: 'Se anulan', ok: true },
          { txt: 'Gana la tensión', porQue: 'Si ganara la tensión, el costal aceleraría. La velocidad es constante.' },
          { txt: 'Gana la fricción', porQue: 'Si ganara la fricción, el costal iría frenando. La velocidad es constante.' }
        ] },
        { pregunta: 'Si las flechas se anulan, ¿por qué sigue moviéndose?', etq: 'Primera ley', nota: 'Si las flechas se anulan, sigue como venía.', opciones: [
          { txt: 'Porque lleva una fuerza guardada', porQue: 'No hay fuerzas guardadas. Una fuerza siempre es de alguien sobre alguien.' },
          { txt: 'Porque ya venía moviéndose, y nada le cambia la velocidad', ok: true },
          { txt: 'Porque la tensión es un poquito mayor', porQue: 'Con una tensión mayor, la velocidad iría creciendo. Aquí no cambia.' }
        ] }
      ],
      cierre: 'Esa es la primera ley: si las flechas se anulan, el cuerpo sigue como venía, quieto o con velocidad constante.'
    },
    {
      id: 'r3', grupo: 'piso', titulo: 'La caja sigue sola',
      contexto: 'El empleado le da un empujón a la caja y la suelta. Ya sin tocarla, la caja sigue resbalando por el piso y va frenando.',
      escena: { tipo: 'piso', cuerpo: 'caja', mov: 'der' },
      toca: { opciones: [{ txt: 'El piso', ok: true }, { txt: 'El empleado', porQue: 'Ya la soltó: el empujón se acabó cuando dejó de tocarla.' }], bien: 'Ya solo la toca el piso.' },
      lista: ['peso', 'normal', 'friccion', 'empuje', 'empujon', 'movimiento'],
      fuerzas: { peso: { dir: 'aba' }, normal: { dir: 'arr' }, friccion: { dir: 'izq' } },
      iguales: [igualesPN],
      sobran: { empuje: 'El empleado ya no la toca: esa flecha se acabó cuando la soltó.' },
      preguntas: [
        { pregunta: 'En el eje horizontal, ¿cómo quedan las flechas?', etq: 'Eje horizontal', renglon: `${SF} ${igual} ${menos}${L.f}`, nota: 'Solo queda la fricción, hacia atrás: por eso frena.', opciones: [
          { txt: 'Gana la fricción, y por eso frena', ok: true },
          { txt: 'Se anulan', porQue: 'Si se anularan, seguiría con velocidad constante. Va frenando.' },
          { txt: 'Gana lo que trae del empujón', porQue: 'El empujón ya se acabó. Una fuerza no se queda guardada en el cuerpo.' }
        ] }
      ],
      cierre: 'La caja se mueve hacia adelante y la única fuerza horizontal va hacia atrás: la fuerza dice cómo cambia la velocidad, no hacia dónde va el cuerpo.',
      luego: { texto: 'Siguen dos en el papel: retos 4 y 5', ir: '#m5-fuerzas', reto: 'r4' }
    },
    {
      id: 'r4', grupo: 'aire', titulo: 'La pelota de Toby',
      contexto: 'Alguien le lanza a Toby su pelota hacia arriba. Ya en el aire, mientras sube, ¿qué fuerzas actúan sobre la pelota? No se cuenta la resistencia del aire. Conviene dibujarlo primero en el papel y después comparar aquí.',
      escena: { tipo: 'aire', cuerpo: 'pelota', mov: 'arr', extras: ['mano'] },
      lista: ['peso', 'lanzamiento', 'movimiento', 'normal', 'empuje'],
      fuerzas: { peso: { dir: 'aba' } },
      sobran: { normal: 'Nada la toca: no hay superficie.', empuje: 'La mano ya la soltó: nadie la empuja.' },
      preguntas: [
        { pregunta: 'Mientras sube, ¿qué le pasa a la velocidad?', etq: 'Eje vertical', renglon: `${SF} ${igual} ${menos}${L.P}`, nota: 'Solo el peso, hacia abajo, aunque la pelota vaya hacia arriba.', opciones: [
          { txt: 'Va perdiendo velocidad, porque solo la jala el peso', ok: true },
          { txt: 'Se mantiene, porque la fuerza del lanzamiento y el peso se anulan', porQue: 'La fuerza del lanzamiento no existe: la mano ya la soltó.' },
          { txt: 'Va ganando velocidad, porque sube', porQue: 'Sube porque ya venía subiendo. El peso le va quitando velocidad: 10 m/s en cada segundo.' }
        ] }
      ],
      cierre: 'Solo el peso: esa es la caída libre, también de subida. Aquí vuelve la piedra del módulo 3: la gravedad le quita 10 m/s en cada segundo.'
    },
    {
      id: 'r5', grupo: 'aire', titulo: 'El melón colgado',
      contexto: 'Un melón cuelga, quieto, de una cuerda atada al techo del depósito. También va primero en el papel.',
      escena: { tipo: 'colgado', cuerpo: 'melon' },
      lista: ['peso', 'tension', 'normal', 'movimiento'],
      fuerzas: { peso: { dir: 'aba' }, tension: { dir: 'arr' } },
      iguales: [['peso', 'tension', 'El melón está quieto: la cuerda tiene que igualar el peso.']],
      sobran: { normal: 'Ninguna superficie lo sostiene: lo que lo toca es la cuerda.' },
      preguntas: [ejeV('la tensión', 'el peso', mt(L.T, menos, L.P, igual, n(0)))],
      cierre: 'Quieto, otra vez: la tensión es igual al peso.',
      luego: { texto: 'Seguir con las ideas clave, parte 2', ir: '#m5-ideas-p2' }
    },
    {
      id: 'r6', grupo: 'neta', titulo: 'Ahora sí acelera',
      contexto: `El empleado empuja una caja con ${q(300, 'N')}. El piso hace ${q(100, 'N')} de fricción, y la caja tiene ${q(50, 'kg')}.`,
      escena: { tipo: 'piso', cuerpo: 'caja', extras: ['empleado'], mov: 'der' },
      lista: ['peso', 'normal', 'empuje', 'friccion', 'movimiento'],
      fuerzas: { peso: { dir: 'aba' }, normal: { dir: 'arr' }, empuje: { dir: 'der' }, friccion: { dir: 'izq' } },
      iguales: [igualesPN],
      mayores: [['empuje', 'friccion', 'Los números lo dicen: 300 N contra 100 N. La flecha del empuje tiene que ser más larga.']],
      numeros: {
        masa: 50,
        terminos: [{ id: 'empuje', nombre: 'Empuje', valor: 300, signo: 1 }, { id: 'friccion', nombre: 'Fricción', valor: 100, signo: -1 }],
        erroresNeta: [
          { valor: 400, msg: 'Esa suma puso las dos a favor. La fricción va en contra: resta.' },
          { valor: -200, msg: 'El empuje gana, así que da positivo: +300 − 100.' },
          { valor: 2, msg: 'Eso es contar flechas, no sumarlas: cada flecha entra con su valor.' }
        ],
        erroresA: [
          { valor: 6, msg: 'Ese 6 sale de 300 ÷ 50: usa solo el empuje. La aceleración sale de la fuerza neta.' },
          { valor: 8, msg: 'Ese 8 sale de 400 ÷ 50, con la fricción a favor. La fricción resta.' },
          { valor: -94, msg: 'Ese resultado sale de 300 ÷ 50 − 100: se dividió antes de sumar las flechas. Primero las flechas; después se divide entre la masa.' },
          { valor: 10000, msg: 'Ese resultado sale de multiplicar. a = ΣF ÷ m: la masa divide.' }
        ]
      },
      pareja: {
        pregunta: 'El empleado empuja la caja con 300 N. ¿Cuál es la pareja de esa fuerza?',
        opciones: [
          { txt: 'La caja empuja al empleado con 300 N, hacia atrás', ok: true },
          { txt: 'La fricción del piso sobre la caja', porQue: 'La fricción actúa sobre la misma caja: una pareja siempre está en dos cuerpos distintos.' },
          { txt: 'El peso de la caja', porQue: 'El peso actúa sobre la misma caja, y lo hace la Tierra. Una pareja siempre es «A sobre B» y «B sobre A».' }
        ]
      },
      cierre: 'Primero las flechas (lo que suma y resta) y después la masa (lo que divide). Las huellas se separan: es el mismo movimiento del radar de pista.'
    },
    {
      id: 'r7', grupo: 'neta', modo: 'cambia', titulo: 'El costal de melones',
      contexto: 'Un costal de melones cuelga de una cuerda vertical. Un ventilador lo empuja hacia la izquierda, y una cuerda horizontal lo mantiene quieto. El diagrama ya está hecho.',
      cambio: 'El empleado agrega más melones al costal, y el costal sigue quieto. ¿Qué pasa con cada flecha?',
      escena: { tipo: 'costal', cuerpo: 'costal' },
      base: [F('cuerdaV', 'arr'), F('peso', 'aba'), F('cuerdaH', 'der', 2, { et: { x: 300, y: 130, ancla: 'middle' } }), F('ventilador', 'izq')],
      efecto: { cuerdaV: 'crece', peso: 'crece', cuerdaH: 'igual', ventilador: 'igual' },
      porQue: {
        peso: 'Más melones, más masa, y el peso es la masa por g: el peso crece.',
        cuerdaV: 'El costal sigue quieto: en el eje vertical las flechas se anulan. Si el peso crece, la cuerda vertical tiene que crecer igual.',
        cuerdaH: 'Cada eje por su lado: el peso es vertical. Más melones no cambian lo que pasa en el eje horizontal.',
        ventilador: 'El ventilador sopla igual: no sabe cuántos melones hay.'
      },
      renglones: [['Eje vertical', mt(L.T, menos, L.P, igual, n(0)), 'Crecen las dos.'], ['Eje horizontal', mt(vr('T', '2'), menos, vr('V'), igual, n(0)), 'No cambia nada.']],
      cierre: 'Cada eje por su lado: el peso y la cuerda vertical crecen; lo horizontal sigue igual.',
      luego: { texto: 'Sigue en el papel: reto 8', ir: '#m5-fuerzas', reto: 'r8' }
    },
    {
      id: 'r8', grupo: 'neta', titulo: 'El avión recto y nivelado',
      contexto: 'Un avión de carga vuela en línea recta, a altura constante y con velocidad constante. Conviene dibujarlo primero en el papel: aquí se resuelve la primera apuesta.',
      escena: { tipo: 'aire', cuerpo: 'avion', mov: 'der' },
      lista: ['peso', 'sustentacion', 'empuje', 'resistencia', 'movimiento'],
      fuerzas: { peso: { dir: 'aba' }, sustentacion: { dir: 'arr' }, empuje: { dir: 'der' }, resistencia: { dir: 'izq' } },
      iguales: [['peso', 'sustentacion', 'A altura constante, las alas sostienen todo el peso: esas dos flechas son iguales.'], ['empuje', 'resistencia', 'Eso sería acelerar. Con velocidad constante, el empuje apenas iguala la resistencia.']],
      preguntas: [
        { pregunta: '¿Cómo es el empuje comparado con la resistencia del aire?', etq: 'Eje horizontal', renglon: mt(L.E, menos, L.R, igual, n(0)), opciones: [
          { txt: 'Mayor, porque el avión avanza', porQue: 'Si fuera mayor, el avión iría cada vez más rápido. Avanza porque ya venía avanzando.' },
          { txt: 'Igual, porque la velocidad es constante', ok: true },
          { txt: 'Menor, porque el aire frena', porQue: 'Si fuera menor, el avión iría frenando.' }
        ] }
      ],
      pareja: {
        pregunta: 'El motor empuja el aire hacia atrás. ¿Cuál es la pareja de esa fuerza?',
        opciones: [
          { txt: 'La resistencia del aire', porQue: 'La resistencia frena al avión; no es lo que el aire le responde al motor.' },
          { txt: 'El aire empuja al avión hacia adelante', ok: true },
          { txt: 'La sustentación', porQue: 'La sustentación es vertical. Una pareja apunta en sentido contrario, sobre el otro cuerpo.' }
        ]
      },
      cierre: 'Por eso vuela un avión: el motor empuja el aire hacia atrás y el aire empuja al avión hacia adelante. Y a velocidad constante, las cuatro flechas se anulan de a dos.',
      luego: { texto: 'Seguir con las ideas clave, parte 3', ir: '#m5-ideas-p3' }
    },
    {
      id: 'r9', grupo: 'rampa', titulo: 'La caja quieta en la rampa',
      contexto: 'Una caja de melones está quieta sobre la rampa del depósito.',
      escena: { tipo: 'rampa', cuerpo: 'caja' },
      toca: { opciones: [{ txt: 'La rampa', ok: true }, { txt: 'El empleado', porQue: 'Nadie la está sosteniendo: está quieta sola.' }], bien: 'Solo la toca la rampa: de ahí salen la normal y la fricción.' },
      lista: ['peso', 'normal', 'friccion', 'bajada', 'movimiento'],
      fuerzas: { peso: { dir: 'aba' }, normal: { dir: 'sale' }, friccion: { dir: 'sube' } },
      mayores: [normalMenor, ['peso', 'friccion', 'La fricción sostiene solo una parte del peso: tiene que ser más corta que el peso.']],
      dirMal: { peso: pesoNoInclina, normal: normalPerp, friccion: { baja: 'La caja tiende a resbalar hacia abajo. La fricción va en contra: rampa arriba.' } },
      preguntas: [
        { pregunta: '¿Por qué la caja no resbala?', etq: 'A lo largo de la rampa', renglon: mt(L.f, menos, L.Ppar, igual, n(0)), nota: 'La fricción iguala la parte del peso que empuja rampa abajo.', opciones: [
          { txt: 'Porque la fricción iguala la parte del peso que empuja rampa abajo', ok: true },
          { txt: 'Porque la normal iguala todo el peso', porQue: 'La normal es perpendicular a la rampa: no puede sostener lo que empuja hacia abajo a lo largo de ella.' },
          { txt: 'Porque en la rampa el peso disminuye', porQue: 'El peso no cambió: ni la masa ni el planeta cambiaron. Solo se reparte distinto.' }
        ] }
      ],
      cierre: 'El peso sigue vertical y sigue igual. La normal sale perpendicular a la rampa, y la fricción va a lo largo de ella.'
    },
    {
      id: 'r10', grupo: 'rampa', titulo: 'La patineta baja sin fricción',
      contexto: 'Una caja va sobre una patineta y baja sola por la rampa. Aquí no se cuenta la fricción.',
      escena: { tipo: 'rampa', cuerpo: 'caja', mov: 'baja' },
      toca: { opciones: [{ txt: 'La rampa', ok: true }, { txt: 'El empleado', porQue: 'El empleado ya la soltó: baja sola.' }], bien: 'Solo la rampa, y sin fricción: de ahí sale solo la normal.' },
      lista: ['peso', 'normal', 'friccion', 'bajada', 'movimiento'],
      fuerzas: { peso: { dir: 'aba' }, normal: { dir: 'sale' } },
      mayores: [normalMenor],
      sobran: { friccion: 'El enunciado dice que no se cuenta la fricción.' },
      dirMal: { peso: pesoNoInclina, normal: normalPerp },
      preguntas: [
        { pregunta: '¿Quién acelera a la caja rampa abajo?', etq: 'A lo largo de la rampa', renglon: mt(SF, igual, L.Ppar), nota: 'La otra parte del peso se anula con la normal.', opciones: [
          { txt: 'Una parte del peso', ok: true },
          { txt: 'La normal', porQue: 'La normal es perpendicular a la rampa: no empuja hacia abajo a lo largo de ella.' },
          { txt: 'La fuerza de la bajada', porQue: 'Nadie hace esa fuerza. Lo que empuja rampa abajo ya está dentro del peso.' }
        ] }
      ],
      cierre: 'Solo dos flechas: el peso y la normal. Lo que empuja rampa abajo es una parte del peso, y no se dibuja aparte.',
      luego: { texto: 'Seguir con las ideas clave, parte 4', ir: '#m5-ideas-p4' }
    },
    {
      id: 'r11', grupo: 'rampa', titulo: 'Baja con velocidad constante',
      contexto: 'Una caja baja por la rampa con velocidad constante. Conviene dibujarlo primero en el papel.',
      escena: { tipo: 'rampa', cuerpo: 'caja', mov: 'baja' },
      lista: ['peso', 'normal', 'friccion', 'bajada', 'movimiento'],
      fuerzas: { peso: { dir: 'aba' }, normal: { dir: 'sale' }, friccion: { dir: 'sube' } },
      mayores: [normalMenor, ['peso', 'friccion', 'La fricción iguala solo una parte del peso: tiene que ser más corta que el peso.']],
      dirMal: { peso: pesoNoInclina, normal: normalPerp, friccion: { baja: 'La caja baja: la fricción va en contra, rampa arriba.' } },
      preguntas: [
        { pregunta: '¿Qué cambia respecto al reto 9, cuando estaba quieta?', etq: 'Primera ley', renglon: mt(SF, igual, n(0)), nota: 'Quieta o con velocidad constante, las flechas se anulan.', opciones: [
          { txt: 'Nada en las flechas: quieta o con velocidad constante, se anulan igual', ok: true },
          { txt: 'Aparece una flecha nueva hacia abajo, porque se mueve', porQue: 'Moverse no es una fuerza. ¿Quién haría esa flecha?' },
          { txt: 'La fricción desaparece, porque ya arrancó', porQue: 'Mientras resbala, la fricción sigue. Si desapareciera, la caja aceleraría.' }
        ] }
      ],
      cierre: 'Las mismas flechas del reto 9. Lo único distinto es la historia.',
      luego: { texto: 'Seguir con las ideas clave, parte 5', ir: '#m5-ideas-p5' }
    },
    {
      id: 'r12', grupo: 'rampa', titulo: 'Subir la caja con una cuerda',
      contexto: 'El empleado sube la caja por la rampa con una cuerda, con velocidad constante. ¿Qué cambia?',
      escena: { tipo: 'rampa', cuerpo: 'caja', mov: 'sube' },
      lista: ['peso', 'normal', 'friccion', 'tension', 'movimiento'],
      fuerzas: { peso: { dir: 'aba' }, normal: { dir: 'sale' }, friccion: { dir: 'baja' }, tension: { dir: 'sube' } },
      mayores: [normalMenor, ['tension', 'friccion', 'La cuerda iguala la fricción y además la parte del peso que empuja rampa abajo: tiene que ser más larga que la fricción.']],
      dirMal: { peso: pesoNoInclina, normal: normalPerp, friccion: { sube: 'La caja sube: la fricción va en contra, rampa abajo.' } },
      preguntas: [
        { pregunta: 'La fricción apunta rampa abajo. ¿Por qué cambió de lado?', etq: 'A lo largo de la rampa', renglon: mt(L.T, menos, L.f, menos, L.Ppar, igual, n(0)), opciones: [
          { txt: 'Porque va contra el deslizamiento, y ahora la caja sube', ok: true },
          { txt: 'Porque el peso la jala hacia abajo', porQue: 'La fricción no depende de hacia dónde jale el peso, sino de hacia dónde resbala la caja.' },
          { txt: 'Porque la cuerda la empuja', porQue: 'La cuerda jala la caja, no la fricción.' }
        ] }
      ],
      cierre: 'La fricción siempre va contra el deslizamiento, no «rampa arriba».'
    },
    {
      id: 'r13', grupo: 'mas', titulo: 'El camión frena',
      contexto: 'Un camión de carga frena de golpe. La caja de melones que lleva atrás resbala hacia adelante sobre la plataforma.',
      escena: { tipo: 'piso', cuerpo: 'caja', extras: ['camion'], mov: 'der' },
      toca: { opciones: [{ txt: 'La plataforma del camión', ok: true }, { txt: 'La cabina del camión', porQue: 'La caja todavía no llega a la cabina: no la toca, y nada la empuja hacia adelante.' }], bien: 'Solo la toca la plataforma.' },
      lista: ['peso', 'normal', 'friccion', 'inercia', 'movimiento', 'empuje'],
      fuerzas: { peso: { dir: 'aba' }, normal: { dir: 'arr' }, friccion: { dir: 'izq' } },
      iguales: [igualesPN],
      sobran: { empuje: 'Nadie empuja la caja hacia adelante.' },
      dirMal: { friccion: { der: 'La caja resbala hacia adelante: la fricción va en contra, hacia atrás.' } },
      preguntas: [
        { pregunta: '¿Por qué la caja se va hacia adelante?', etq: 'Primera ley', nota: 'Nadie la empuja: sigue como venía.', opciones: [
          { txt: 'Porque sigue como venía, mientras el camión frena', ok: true },
          { txt: 'Porque la inercia la empuja', porQue: 'La inercia no es una fuerza: nadie la hace.' },
          { txt: 'Porque el frenazo la lanza', porQue: 'El frenazo actúa sobre el camión. A la caja solo la toca la plataforma, y su fricción va hacia atrás.' }
        ] }
      ],
      cierre: 'Nadie la empujó: el que cambió fue el camión. Por eso se usa cinturón de seguridad.'
    }
  ];

  /* ---------- La rampa ----------
     Cada reto es una lista de pasos:
     predice: se elige y después se ve (no se bloquea: cuenta como predicción).
     mueve: mover el deslizador hasta un ángulo.
     numero: se escribe el resultado.
     sinTablero: el tablero se oculta, porque mostraría la respuesta. */
  const RETOS_RAMPA = [
    {
      id: 'a1', titulo: '¿Qué le pasa a la normal?', angulo: 10,
      contexto: 'Una caja quieta sobre una rampa poco inclinada. Se va a empinar la rampa hasta 60°, y la caja sigue quieta.',
      pasos: [
        { tipo: 'predice', pregunta: 'Si la rampa se empina, ¿qué le pasa a la normal?', opciones: [
          { txt: 'Se hace más corta', ok: true },
          { txt: 'Se hace más larga' },
          { txt: 'Sigue igual, porque el peso no cambia' }
        ], siBien: 'A comprobarlo con el deslizador.', siMal: 'A ver qué pasa con el deslizador.' },
        { tipo: 'mueve', hasta: 60, pide: 'Hay que mover el deslizador hasta 60° y mirar la flecha de la normal.', final: 'La normal se acorta: sostiene solo la parte del peso que aprieta contra la rampa, y con más inclinación esa parte es menor. El peso no cambió.', renglon: mt(L.Pper, igual, L.P, por, cos), etq: 'Coseno, contra la rampa' }
      ]
    },
    {
      id: 'a2', titulo: 'Los extremos, con la normal', angulo: 30,
      contexto: 'El seno en los dos extremos ya se vio. Ahora, el coseno: ¿cuánto sostiene la normal con la rampa plana y con la rampa vertical?',
      pasos: [
        { tipo: 'predice', pregunta: 'Con la rampa plana, a 0°, ¿cuánto vale la normal?', moverA: 0, opciones: [
          { txt: 'Todo el peso', ok: true }, { txt: 'La mitad del peso' }, { txt: 'Nada' }
        ], explica: 'Todo el peso: cos 0° = 1. Es el piso plano de siempre, con el peso y la normal iguales.', renglon: 'cos 0° = 1', etq: 'Plana' },
        { tipo: 'predice', pregunta: 'Con la rampa vertical, a 90°, ¿cuánto vale la normal?', moverA: 90, opciones: [
          { txt: 'La mitad del peso' }, { txt: 'Todo el peso' }, { txt: 'Nada', ok: true }
        ], explica: 'Nada: cos 90° = 0. La caja ya ni aprieta la rampa, y todo el peso empuja hacia abajo: eso es la caída libre.', renglon: 'cos 90° = 0', etq: 'Vertical' }
      ]
    },
    {
      id: 'a3', titulo: 'La carrera', angulo: 30, carrera: true,
      contexto: 'Un melón de 2 kg y una sandía de 10 kg se sueltan al mismo tiempo desde arriba, en dos rampas iguales y sin fricción. Es la tercera apuesta.',
      pasos: [
        { tipo: 'predice', pregunta: '¿Cuál llega primero abajo?', correr: true, opciones: [
          { txt: 'La sandía, porque pesa más' }, { txt: 'El melón, porque es más liviano' }, { txt: 'Llegan al tiempo', ok: true }
        ], explica: `A la sandía la empuja más fuerza, pero también cuesta más acelerarla. La masa se cancela: ${mt(L.a, igual, L.g, por, sen)}.`, renglon: mt(L.m, por, L.g, por, sen, igual, L.m, por, L.a), etq: 'La masa se cancela' }
      ],
      luego: { texto: 'Sigue en el papel: reto 11 de la mesa', reto: 'r11' }
    },
    {
      id: 'a4', titulo: 'Una rampa con medidas', angulo: 24, sinTablero: true,
      contexto: `Una rampa de ${q(20, 'm')} de largo sube ${q(8, 'm')}. Por ella baja, sin fricción, una caja de ${q(50, 'kg')}.`,
      pasos: [
        { tipo: 'numero', pregunta: 'El largo es la hipotenusa y el alto es el opuesto. ¿Cuánto vale el seno del ángulo?', respuesta: 0.4, errores: [
          { valor: 2.5, msg: 'Ese resultado sale de 20 ÷ 8: es hipotenusa ÷ opuesto. El seno es opuesto ÷ hipotenusa, y nunca pasa de 1.' },
          { valor: 8, msg: 'Ese es el alto, en metros. Falta dividirlo entre la hipotenusa.' },
          { valor: 160, msg: 'Ese resultado sale de multiplicar. El seno es una división.' }
        ], renglon: `sen θ = 8 ÷ 20 = 0,4`, etq: 'El seno', nota: 'Opuesto ÷ hipotenusa.' },
        { tipo: 'numero', pregunta: 'La caja pesa 500 N. ¿Cuántos newtons la empujan rampa abajo?', respuesta: 200, unidad: 'N', errores: [
          { valor: 500, msg: 'Ese es todo el peso. Rampa abajo empuja solo una parte: seno se desliza.' },
          { valor: 458.3, msg: 'Esa es la parte que aprieta contra la rampa, con el coseno. Rampa abajo va el seno: seno se desliza.' },
          { valor: 50, msg: 'Esa es la masa, en kg. La fuerza es 500 · 0,4.' }
        ], renglon: mt(L.Ppar, igual, n(500), por, n('0,4'), igual, q(200, 'N')), etq: 'Seno se desliza' },
        { tipo: 'numero', pregunta: '¿Cuál es la aceleración de la caja?', respuesta: 4, unidad: 'm/s²', errores: [
          { valor: 10, msg: 'Esa es g, como si cayera libre. En la rampa solo una parte del peso la empuja.' },
          { valor: 200, msg: 'Esa es la fuerza, en newtons. Falta dividirla entre la masa.' },
          { valor: 0.4, msg: 'Ese es el seno. Falta multiplicarlo por g.' }
        ], renglon: mt(L.a, igual, fr(n(200), n(50)), igual, q(4, 'm/s²')), etq: 'La segunda ley', nota: 'Es lo mismo que g · sen θ: 10 · 0,4. La masa se cancela.' }
      ]
    }
  ];

  /* ---------- Práctica ----------
     Del más sencillo al más parecido al examen, y la guía se va retirando.
     Básico e intermedio: números redondos y un botón para repasar en la
     mesa. Tipo examen y retos: sin herramienta, con pistas de qué pensar,
     que se abren después del primer intento. El humor también se retira:
     los últimos van sin personajes, porque el examen no los trae.
     Ningún ejercicio repite una situación ni unos números de las
     diapositivas o de las herramientas: si ya los vio en clase, respondería
     de memoria, sin pensar. */
  const diagramaRampa = (flechas, etiqueta) => op4({ tipo: 'rampa', cuerpo: 'caja', etiqueta, flechas });
  const diagramaBici = (extra, etiqueta) => op4({ tipo: 'piso', cuerpo: 'bici', etiqueta, flechas: [F('normal', 'arr'), F('peso', 'aba'), ...extra] });
  const diagramaCable = (flechas, etiqueta) => op4({ tipo: 'colgado', cuerpo: 'caja', etiqueta, flechas });
  const graficaFreno = () => grafica({
    ejeX: 'Tiempo (s)', ejeY: 'Velocidad (m/s)', puntos: [[0, 0], [2, 10], [5, 10], [7, 0]], marcasX: [2, 5, 7], marcasY: [10],
    etiqueta: 'Gráfico de velocidad contra tiempo de un camión: de 0 a 2 s sube de 0 a 10 m/s, de 2 a 5 s se mantiene en 10 m/s y de 5 a 7 s baja hasta 0'
  });
  const graficaVia = () => grafica({
    ejeX: 'Tiempo (s)', ejeY: 'Posición (m)', puntos: [[0, 0], [3, 30], [5, 30], [9, 0]], marcasX: [3, 5, 9], marcasY: [30],
    etiqueta: 'Gráfico de posición contra tiempo de un camión: de 0 a 3 s sube en línea recta hasta 30 m, de 3 a 5 s se queda en 30 m y de 5 a 9 s baja en línea recta hasta 0'
  });

  const EJERCICIOS = [
    // ----- Básico -----
    {
      id: 'e1', nivel: 'basico', tema: 'masa', tipo: 'numero', respuesta: 450, unidad: 'N',
      enunciado: `Un costal de melones tiene una masa de ${q(45, 'kg')}. Con ${mt(L.g, igual, q(10, 'm/s²'))}, ¿cuánto pesa?`,
      plano: 'Un costal de melones tiene una masa de 45 kg. Con g = 10 m/s², ¿cuánto pesa?',
      errores: [
        { valor: 45, msg: 'Esa es la masa, en kg. El peso es una fuerza y va en newtons: cada kilogramo pesa 10 N.' },
        { valor: 4.5, msg: 'Ese resultado sale de dividir 45 ÷ 10. El peso es la masa por g: se multiplica.' },
        { valor: 55, msg: 'Ese resultado sale de sumar 45 + 10. El peso es la masa por g: se multiplica.' }
      ],
      pistas: ['El peso es una fuerza. ¿Qué fórmula une la masa con el peso?', `${mt(L.P, igual, L.m, por, L.g)}: cada kilogramo pesa 10 N.`],
      solucion: [`${mt(L.P, igual, L.m, por, L.g, igual, n(45), por, n(10))}`, `Respuesta: ${q(450, 'N')}.`]
    },
    {
      id: 'e2', nivel: 'basico', tema: 'flechas', tipo: 'opciones', correcta: 0,
      enunciado: 'Una grúa sube una caja con un cable, con velocidad constante. ¿Cuál diagrama representa las fuerzas sobre la caja?',
      plano: 'Una grúa sube una caja con un cable, con velocidad constante. ¿Cuál diagrama representa las fuerzas sobre la caja?',
      antes: {
        pregunta: 'Antes de ver los diagramas, en el papel: ¿cuántas fuerzas actúan sobre la caja?',
        opciones: ['Una', 'Dos', 'Tres', 'Cuatro'], correcta: 1, respuesta: 'Son dos.',
        bien: 'El peso, que va siempre, y el cable, que es lo único que la toca.'
      },
      opciones: [
        diagramaCable([F('tension', 'arr'), F('peso', 'aba')], 'Tensión hacia arriba y peso hacia abajo, del mismo largo'),
        diagramaCable([F('tension', 'arr', 3), F('peso', 'aba', 1)], 'Tensión hacia arriba más larga que el peso hacia abajo'),
        diagramaCable([F('tension', 'arr')], 'Solo la tensión hacia arriba'),
        diagramaCable([F('tension', 'aba', 2, { ox: -16, et: { x: 186, y: 232, ancla: 'end' } }), F('peso', 'aba', 2, { ox: 16, et: { x: 234, y: 232, ancla: 'start' } })], 'Tensión y peso, los dos hacia abajo')
      ],
      opcionesPlano: ['Tensión hacia arriba y peso hacia abajo, del mismo largo', 'Tensión hacia arriba más larga que el peso hacia abajo', 'Solo la tensión hacia arriba', 'Tensión y peso, los dos hacia abajo'],
      porQue: {
        1: 'Si la tensión ganara, la caja iría cada vez más rápido. Con velocidad constante, las flechas se anulan, aunque vaya subiendo.',
        2: 'Falta el peso: va siempre, aunque la caja suba.',
        3: 'Un cable solo jala: la flecha sale de la caja a lo largo del cable, hacia arriba.'
      },
      pistas: ['¿Qué la toca? ¿Hacia dónde jala un cable?', 'Velocidad constante: ¿cómo quedan las flechas?'],
      solucion: ['El peso va siempre, hacia abajo.', 'El cable la toca y jala hacia arriba: la tensión.', `Con velocidad constante, las flechas se anulan: ${mt(L.T, igual, L.P)}. Da igual que suba.`],
      herramienta: { boton: 'Repasar en la mesa de fuerzas', icono: 'fuerzas', mesa: 'fuerzas', problema: 'r5' }
    },
    // ----- Intermedio -----
    {
      id: 'e3', nivel: 'intermedio', tema: 'neta', tipo: 'numero', respuesta: 2, unidad: 'm/s²',
      enunciado: `Un empleado arrastra un costal de ${q(60, 'kg')} con una fuerza de ${q(150, 'N')}. El piso hace una fricción de ${q(30, 'N')}. ¿Cuál es la aceleración del costal?`,
      plano: 'Un empleado arrastra un costal de 60 kg con una fuerza de 150 N. El piso hace una fricción de 30 N. ¿Cuál es la aceleración del costal?',
      errores: [
        { valor: 2.5, msg: 'Ese 2,5 sale de 150 ÷ 60: usa solo la fuerza del empleado. La aceleración sale de la fuerza neta.' },
        { valor: 3, msg: 'Ese 3 sale de 180 ÷ 60, con la fricción a favor. La fricción va en contra: resta.' },
        { valor: 120, msg: 'Esa es la fuerza neta, en newtons. Falta dividirla entre la masa.' },
        { valor: -27.5, msg: 'Ese resultado sale de 150 ÷ 60 − 30: se dividió antes de sumar las flechas. Primero las flechas; después se divide entre la masa.' }
      ],
      pistas: ['Primero las flechas: ¿cuál va a favor y cuál en contra?', `${mt(L.a, igual, fr(SF, L.m))}. La masa va al final.`],
      solucion: [`${mt(SF, igual, n(150), menos, n(30), igual, q(120, 'N'))}`, `${mt(L.a, igual, fr(n(120), n(60)), igual, q(2, 'm/s²'))}`, `Respuesta: ${q(2, 'm/s²')}.`],
      herramienta: { boton: 'Repasar en la mesa de fuerzas', icono: 'fuerzas', mesa: 'fuerzas', problema: 'r6' }
    },
    {
      id: 'e4', nivel: 'intermedio', tema: 'leyes', tipo: 'opciones', correcta: 0,
      enunciado: 'Una fuerza neta le da cierta aceleración a una caja. Si la fuerza neta se triplica y la masa se reduce a la mitad, ¿qué pasa con la aceleración?',
      plano: 'Una fuerza neta le da cierta aceleración a una caja. Si la fuerza neta se triplica y la masa se reduce a la mitad, ¿qué pasa con la aceleración?',
      opciones: ['Se hace seis veces mayor', 'Se hace 1,5 veces mayor', 'Se hace cinco veces mayor', 'Queda igual'],
      opcionesPlano: ['Se hace seis veces mayor', 'Se hace 1,5 veces mayor', 'Se hace cinco veces mayor', 'Queda igual'],
      porQue: {
        1: 'Eso sería dividir 3 entre 2. La masa va abajo: dividir entre la mitad es multiplicar por 2.',
        2: 'Eso sería sumar 3 + 2. Los dos efectos se multiplican: 3 · 2.',
        3: 'Los dos cambios no se compensan: los dos hacen crecer la aceleración.'
      },
      pistas: [`¿Dónde va cada una en ${mt(L.a, igual, fr(SF, L.m))}?`, 'Se puede probar con números sencillos: 10 N y 10 kg; después, 30 N y 5 kg.'],
      solucion: [`${mt(L.a, igual, fr(`${n(3)} ${por} ${vr('F')}`, `${L.m} ${op('÷')} ${n(2)}`), igual, n(6), por, fr(vr('F'), L.m))}`, 'Con números: 10 ÷ 10 = 1 y 30 ÷ 5 = 6. Seis veces mayor.']
    },
    {
      id: 'e5', nivel: 'intermedio', tema: 'grafico', tipo: 'opciones', correcta: 0,
      enunciado: `El gráfico muestra la velocidad de un camión en una vía recta. ¿En qué tramo la fuerza neta sobre el camión apunta en contra del movimiento? ${graficaFreno()}`,
      plano: 'Un gráfico muestra la velocidad de un camión en una vía recta: de 0 a 2 s sube de 0 a 10 m/s, de 2 a 5 s se mantiene en 10 m/s y de 5 a 7 s baja hasta 0. ¿En qué tramo la fuerza neta sobre el camión apunta en contra del movimiento?',
      opciones: ['De 5 a 7 s, porque ahí la velocidad baja', 'De 2 a 5 s, porque ahí la velocidad ya no aumenta', 'De 0 a 2 s, porque ahí tiene que arrancar', 'En ninguno, porque el camión siempre va hacia adelante'],
      opcionesPlano: ['De 5 a 7 s, porque ahí la velocidad baja', 'De 2 a 5 s, porque ahí la velocidad ya no aumenta', 'De 0 a 2 s, porque ahí tiene que arrancar', 'En ninguno, porque el camión siempre va hacia adelante'],
      porQue: {
        1: 'Si la velocidad no cambia, las flechas se anulan: ahí no hay fuerza neta.',
        2: 'Al arrancar, la velocidad sube: la fuerza neta apunta a favor del movimiento.',
        3: 'Va hacia adelante, pero la fuerza no dice hacia dónde va, sino cómo cambia su velocidad.'
      },
      pistas: ['¿En qué tramo la velocidad baja?', 'Si la velocidad baja, ¿hacia dónde apunta la aceleración?'],
      solucion: ['De 0 a 2 s la velocidad sube: la fuerza neta va a favor del movimiento.', 'De 2 a 5 s la velocidad es constante: no hay fuerza neta.', 'De 5 a 7 s la velocidad baja: la fuerza neta va en contra del movimiento, aunque el camión siga avanzando.']
    },
    // ----- Tipo examen -----
    // Desde aquí: sin herramientas, y las pistas dicen qué pensar y se abren después del primer intento.
    {
      id: 'e6', nivel: 'examen', tema: 'flechas', tipo: 'opciones', correcta: 0,
      enunciado: 'Yonaiker va en su bicicleta por una vía plana y deja de pedalear. Sin usar los frenos, sigue rodando y va perdiendo velocidad poco a poco. ¿Cuál diagrama representa las fuerzas sobre Yonaiker y su bicicleta?',
      plano: 'Yonaiker va en su bicicleta por una vía plana y deja de pedalear. Sin usar los frenos, sigue rodando y va perdiendo velocidad poco a poco. ¿Cuál diagrama representa las fuerzas sobre Yonaiker y su bicicleta?',
      opciones: [
        diagramaBici([F('friccion', 'izq')], 'Peso, normal y fricción hacia atrás'),
        diagramaBici([F('friccion', 'izq'), { dir: 'der', largo: 2, clase: 'contacto', texto: 'Pedaleo' }], 'Peso, normal, fricción hacia atrás y una flecha hacia adelante llamada fuerza del pedaleo'),
        diagramaBici([], 'Solo peso y normal'),
        diagramaBici([F('friccion', 'der')], 'Peso, normal y fricción hacia adelante')
      ],
      opcionesPlano: ['Peso, normal y fricción hacia atrás', 'Peso, normal, fricción hacia atrás y una flecha hacia adelante llamada fuerza del pedaleo', 'Solo peso y normal', 'Peso, normal y fricción hacia adelante'],
      porQue: {
        1: '¿Quién la hace? Ya dejó de pedalear: esa fuerza se acabó, y lo que ya se mueve sigue moviéndose sin que nadie lo empuje.',
        2: 'Sin ninguna flecha horizontal, seguiría con velocidad constante. Va perdiendo velocidad: algo lo frena.',
        3: 'Esa fricción lo haría ir cada vez más rápido. Va perdiendo velocidad: la flecha va hacia atrás.'
      },
      pistas: ['Antes de mirar los diagramas: ¿qué dice el enunciado sobre la velocidad? Entonces, ¿gana alguna flecha?', 'De cada flecha, ¿quién la hace?'],
      solucion: ['«Va perdiendo velocidad» quiere decir que hay una fuerza neta hacia atrás: la fricción.', 'La fuerza del pedaleo no la hace nadie: ya dejó de pedalear. Se tacha.', 'En lo vertical, el peso y la normal se anulan.']
    },
    {
      id: 'e7', nivel: 'examen', tema: 'masa', tipo: 'opciones', correcta: 0,
      enunciado: `Toby Maguire y su trineo tienen una masa total de ${q(30, 'kg')}. En la Tierra, sobre una pista sin fricción, un operario los empuja en horizontal con ${q(60, 'N')}. La prueba se repite en la Luna, donde la gravedad es la sexta parte de la terrestre, con el mismo empuje horizontal y también sin fricción. ¿Cómo es la aceleración en la Luna comparada con la de la Tierra?`,
      plano: 'Toby Maguire y su trineo tienen una masa total de 30 kg. En la Tierra, sobre una pista sin fricción, un operario los empuja en horizontal con 60 N. La prueba se repite en la Luna, donde la gravedad es la sexta parte de la terrestre, con el mismo empuje horizontal y también sin fricción. ¿Cómo es la aceleración en la Luna comparada con la de la Tierra?',
      opciones: ['Igual, porque la masa es la misma en los dos lugares', 'Seis veces mayor, porque en la Luna pesan seis veces menos', 'Seis veces menor, porque la gravedad es seis veces menor', 'Igual, porque el peso es el mismo en los dos lugares'],
      opcionesPlano: ['Igual, porque la masa es la misma en los dos lugares', 'Seis veces mayor, porque en la Luna pesan seis veces menos', 'Seis veces menor, porque la gravedad es seis veces menor', 'Igual, porque el peso es el mismo en los dos lugares'],
      porQue: {
        1: 'Eso confunde peso con masa. Cuesta menos levantarlos, pero arrancarlos cuesta lo mismo: a = F ÷ m, y la masa no cambió.',
        2: 'Cada eje por su lado: el empuje es horizontal y la gravedad es vertical, y sin fricción el peso no entra en la cuenta.',
        3: 'La conclusión está bien, pero la razón no: el peso pasa de 300 N a 50 N. Lo que no cambia es la masa.'
      },
      pistas: ['¿Qué cambió y qué no al viajar?', 'Las dos opciones que dicen «igual» no dan la misma razón: ¿cuál es cierta?'],
      solucion: [`${mt(L.a, igual, fr(vr('F'), L.m))}: ni la fuerza ni la masa cambiaron. En los dos lugares, ${mt(n(60), entre, n(30), igual, q(2, 'm/s²'))}.`, 'El peso sí cambió, de 300 N a 50 N. Pero es vertical, y sin fricción no entra en la cuenta horizontal.']
    },
    {
      id: 'e8', nivel: 'examen', tema: 'rampa', tipo: 'opciones', correcta: 0,
      enunciado: 'Una caja permanece en reposo sobre una rampa. Sin cambiar la inclinación, se le pone encima otra caja igual, y las dos siguen sin moverse. Comparadas con las de antes, ¿cómo son la fuerza normal y la fuerza de fricción que hace la rampa?',
      plano: 'Una caja permanece en reposo sobre una rampa. Sin cambiar la inclinación, se le pone encima otra caja igual, y las dos siguen sin moverse. Comparadas con las de antes, ¿cómo son la fuerza normal y la fuerza de fricción que hace la rampa?',
      opciones: ['Las dos son el doble: hay el doble de peso, y se reparte igual', 'La normal es el doble y la fricción no cambia, porque la superficie es la misma', 'Ninguna cambia, porque las cajas siguen en reposo', 'Las dos son la mitad, porque se reparten entre las dos cajas'],
      opcionesPlano: ['Las dos son el doble: hay el doble de peso, y se reparte igual', 'La normal es el doble y la fricción no cambia, porque la superficie es la misma', 'Ninguna cambia, porque las cajas siguen en reposo', 'Las dos son la mitad, porque se reparten entre las dos cajas'],
      porQue: {
        1: 'La fricción sostiene la parte del peso que empuja rampa abajo. Si el peso es el doble, esa parte también.',
        2: 'En reposo, la suma sigue dando cero, pero eso no quiere decir que nada cambie: ahora hay más peso que sostener.',
        3: 'La rampa sostiene a las dos cajas juntas: con más peso, tiene que hacer más fuerza, no menos.'
      },
      pistas: ['Se puede llevar al extremo: ¿y si se pusieran encima cien cajas, sin que resbalen?', '¿Cambió la inclinación? ¿Cambió el peso? Entonces, ¿qué partes del peso cambian?'],
      solucion: [`La normal sostiene ${mt(L.P, por, cos)} y la fricción sostiene ${mt(L.P, por, sen)}.`, 'La inclinación no cambió y el peso es el doble: las dos son el doble.', 'Se resuelve sin una sola cuenta.']
    },
    {
      id: 'e9', nivel: 'examen', tema: 'leyes', tipo: 'opciones', correcta: 0,
      enunciado: 'Un camión remolca un carro averiado por una vía recta, y los dos van acelerando. El camión tiene mucha más masa que el carro. ¿Cómo es la fuerza que el camión le hace al carro, comparada con la que el carro le hace al camión?',
      plano: 'Un camión remolca un carro averiado por una vía recta, y los dos van acelerando. El camión tiene mucha más masa que el carro. ¿Cómo es la fuerza que el camión le hace al carro, comparada con la que el carro le hace al camión?',
      opciones: ['Son iguales, aunque los dos vayan acelerando', 'La del camión es mayor, porque el camión es el que jala', 'La del camión es mayor, porque tiene más masa', 'Son iguales, y por eso se anulan y nada acelera'],
      opcionesPlano: ['Son iguales, aunque los dos vayan acelerando', 'La del camión es mayor, porque el camión es el que jala', 'La del camión es mayor, porque tiene más masa', 'Son iguales, y por eso se anulan y nada acelera'],
      porQue: {
        1: 'Que uno jale y el otro sea jalado no cambia nada: una pareja siempre es igual.',
        2: 'La masa no cambia la pareja: cambia cuánto acelera cada uno con esa fuerza.',
        3: 'La primera parte está bien, pero no se anulan, porque están en cuerpos distintos: una actúa sobre el carro y la otra sobre el camión.'
      },
      pistas: ['¿Cuál es «A sobre B» y cuál es «B sobre A»?', 'El enunciado dice que aceleran. ¿Eso cambia la tercera ley?'],
      solucion: ['Son una pareja: «camión sobre carro» y «carro sobre camión». Siempre son iguales.', 'No se anulan, porque cada una actúa sobre un cuerpo distinto.', 'El carro acelera porque lo jala el camión; el camión, porque el piso empuja sus ruedas hacia adelante.']
    },
    {
      id: 'e10', nivel: 'examen', tema: 'leyes', tipo: 'opciones', correcta: 0,
      enunciado: 'Un costal está quieto sobre una mesa. La mesa empuja al costal hacia arriba. ¿Cuál es la pareja de acción y reacción de esa fuerza?',
      plano: 'Un costal está quieto sobre una mesa. La mesa empuja al costal hacia arriba. ¿Cuál es la pareja de acción y reacción de esa fuerza?',
      opciones: ['El costal empuja a la mesa hacia abajo', 'El peso del costal', 'La Tierra jala a la mesa hacia abajo', 'El piso empuja a la mesa hacia arriba'],
      opcionesPlano: ['El costal empuja a la mesa hacia abajo', 'El peso del costal', 'La Tierra jala a la mesa hacia abajo', 'El piso empuja a la mesa hacia arriba'],
      porQue: {
        1: 'El peso también actúa sobre el costal: las dos están en el mismo cuerpo. Se anulan, pero no son pareja.',
        2: 'En esa fuerza no aparece el costal. Una pareja son los mismos dos cuerpos, al revés: «mesa sobre costal» y «costal sobre mesa».',
        3: 'En esa fuerza no aparece el costal. Una pareja son los mismos dos cuerpos, al revés: «mesa sobre costal» y «costal sobre mesa».'
      },
      pistas: ['La fuerza es «mesa sobre costal». ¿Cómo se escribe al revés?', '¿Sobre quién actúa cada opción?'],
      solucion: ['La fuerza es «mesa sobre costal», así que su pareja es «costal sobre mesa».', 'El peso es «Tierra sobre costal»: es otra fuerza, en el mismo cuerpo.']
    },
    {
      id: 'e11', nivel: 'examen', tema: 'rampa', tipo: 'opciones', correcta: 0,
      enunciado: 'Alguien lanza una caja rampa arriba. Ya suelta, la caja sube resbalando y va perdiendo velocidad. La rampa tiene fricción. ¿Cuál diagrama representa las fuerzas sobre la caja mientras sube?',
      plano: 'Alguien lanza una caja rampa arriba. Ya suelta, la caja sube resbalando y va perdiendo velocidad. La rampa tiene fricción. ¿Cuál diagrama representa las fuerzas sobre la caja mientras sube?',
      opciones: [
        diagramaRampa([F('peso', 'aba', 3), F('normal', 'sale'), F('friccion', 'baja')], 'Peso vertical, normal perpendicular a la rampa y fricción rampa abajo'),
        diagramaRampa([F('peso', 'aba', 3), F('normal', 'sale'), F('friccion', 'baja'), F('lanzamiento', 'sube')], 'Peso vertical, normal perpendicular a la rampa, fricción rampa abajo y una flecha rampa arriba llamada fuerza del lanzamiento'),
        diagramaRampa([F('peso', 'aba', 3), F('normal', 'sale'), F('friccion', 'sube')], 'Peso vertical, normal perpendicular a la rampa y fricción rampa arriba'),
        diagramaRampa([F('peso', 'aba', 3), F('normal', 'arr', 3), F('friccion', 'baja')], 'Peso vertical, normal vertical y fricción rampa abajo')
      ],
      opcionesPlano: ['Peso vertical, normal perpendicular a la rampa y fricción rampa abajo', 'Peso vertical, normal perpendicular a la rampa, fricción rampa abajo y una flecha rampa arriba llamada fuerza del lanzamiento', 'Peso vertical, normal perpendicular a la rampa y fricción rampa arriba', 'Peso vertical, normal vertical y fricción rampa abajo'],
      porQue: {
        1: '¿Quién la hace? La mano ya soltó la caja: esa fuerza se acabó.',
        2: 'La caja sube resbalando: la fricción va en contra, rampa abajo.',
        3: 'La normal sale perpendicular a la superficie, no contraria al peso.'
      },
      pistas: ['¿Qué toca a la caja mientras sube? ¿La mano sigue ahí?', 'La fricción va contra el deslizamiento: ¿hacia dónde resbala la caja?'],
      solucion: ['El peso va vertical, hacia abajo.', 'La rampa da la normal, perpendicular a ella, y la fricción, a lo largo de ella.', 'La caja sube, así que la fricción apunta rampa abajo. La mano ya no la toca: no hay flecha rampa arriba.']
    },
    {
      id: 'e12', nivel: 'examen', tema: 'leyes', tipo: 'opciones', correcta: 0,
      enunciado: 'Un avión vuela en línea recta y a altura constante. El piloto aumenta la potencia de los motores, y la velocidad va aumentando, sin que el avión cambie de altura. Mientras la velocidad aumenta, ¿qué relación hay entre las fuerzas que actúan sobre él?',
      plano: 'Un avión vuela en línea recta y a altura constante. El piloto aumenta la potencia de los motores, y la velocidad va aumentando, sin que el avión cambie de altura. Mientras la velocidad aumenta, ¿qué relación hay entre las fuerzas que actúan sobre él?',
      opciones: ['El empuje es mayor que la resistencia del aire, y la sustentación es igual al peso', 'El empuje es igual a la resistencia, porque el avión sigue en línea recta', 'El empuje es mayor que la resistencia, y la sustentación es mayor que el peso', 'El empuje es mayor que la resistencia, y el peso disminuye'],
      opcionesPlano: ['El empuje es mayor que la resistencia del aire, y la sustentación es igual al peso', 'El empuje es igual a la resistencia, porque el avión sigue en línea recta', 'El empuje es mayor que la resistencia, y la sustentación es mayor que el peso', 'El empuje es mayor que la resistencia, y el peso disminuye'],
      porQue: {
        1: 'Ir en línea recta no alcanza: la velocidad está aumentando, así que en ese eje gana una flecha.',
        2: 'Si la sustentación fuera mayor, el avión subiría. La altura no cambia: en el eje vertical, las flechas se anulan.',
        3: 'No cambiaron ni la masa ni el planeta: el peso es el mismo.'
      },
      pistas: ['¿Qué palabras del enunciado dicen cómo quedan las flechas?', 'Cada eje por su lado: primero el horizontal y después el vertical.'],
      solucion: ['La velocidad aumenta: en el eje horizontal gana el empuje.', 'La altura no cambia: en el eje vertical, la sustentación es igual al peso.']
    },
    {
      id: 'e13', nivel: 'examen', tema: 'grafico', tipo: 'opciones', correcta: 0,
      enunciado: `El gráfico muestra la posición de un camión en una vía recta. Sin contar los instantes en que cambia de tramo, ¿en qué tramos la fuerza neta sobre el camión es cero? ${graficaVia()}`,
      plano: 'Un gráfico muestra la posición de un camión en una vía recta: de 0 a 3 s sube en línea recta hasta 30 m, de 3 a 5 s se queda en 30 m y de 5 a 9 s baja en línea recta hasta 0. Sin contar los instantes en que cambia de tramo, ¿en qué tramos la fuerza neta sobre el camión es cero?',
      opciones: ['En los tres, porque en cada tramo su velocidad es constante', 'Solo de 3 a 5 s, porque ahí está quieto', 'De 0 a 3 s y de 5 a 9 s, porque ahí se mueve', 'En ninguno, porque siempre hay fuerzas actuando sobre él'],
      opcionesPlano: ['En los tres, porque en cada tramo su velocidad es constante', 'Solo de 3 a 5 s, porque ahí está quieto', 'De 0 a 3 s y de 5 a 9 s, porque ahí se mueve', 'En ninguno, porque siempre hay fuerzas actuando sobre él'],
      porQue: {
        1: 'Quieto es un caso, pero no el único: una línea recta inclinada también es velocidad constante, y ahí las flechas también se anulan.',
        2: 'Moverse no pide fuerza neta. Ojo: este es un gráfico de posición, no de velocidad.',
        3: 'Puede haber fuerzas y que la suma dé cero: eso es lo que pregunta la fuerza neta.'
      },
      pistas: ['Es un gráfico de posición: ¿qué dice una línea recta sobre la velocidad?', 'Con velocidad constante, ¿cuánto vale la aceleración?'],
      solucion: ['En un gráfico de posición, una línea recta es velocidad constante. La horizontal es el caso de velocidad 0.', 'Velocidad constante: aceleración 0, y por eso fuerza neta 0, en los tres tramos.']
    },
    {
      id: 'e14', nivel: 'examen', tema: 'neta', tipo: 'opciones', correcta: 0,
      enunciado: 'Desde un avión se lanza una caja con paracaídas. La resistencia del aire crece con la velocidad: cuanto más rápido cae la caja, mayor es. ¿Qué pasa con la aceleración de la caja a medida que cae?',
      plano: 'Desde un avión se lanza una caja con paracaídas. La resistencia del aire crece con la velocidad: cuanto más rápido cae la caja, mayor es. ¿Qué pasa con la aceleración de la caja a medida que cae?',
      opciones: ['Disminuye hasta llegar a cero, y la caja sigue cayendo con velocidad constante, porque la resistencia llega a igualar el peso', 'Es siempre igual a g, porque la gravedad no cambia', 'Disminuye, porque el peso de la caja se hace menor', 'Llega a cero y la caja se detiene en el aire, porque las fuerzas se anulan'],
      opcionesPlano: ['Disminuye hasta llegar a cero, y la caja sigue cayendo con velocidad constante, porque la resistencia llega a igualar el peso', 'Es siempre igual a g, porque la gravedad no cambia', 'Disminuye, porque el peso de la caja se hace menor', 'Llega a cero y la caja se detiene en el aire, porque las fuerzas se anulan'],
      porQue: {
        1: 'La aceleración es g solo cuando el peso es la única fuerza. Aquí también está la resistencia.',
        2: 'El peso no cambió: ni la masa ni el planeta cambiaron. Lo que crece es la resistencia.',
        3: 'Que las fuerzas se anulen no quiere decir que se detenga: sigue como venía, con velocidad constante.'
      },
      pistas: ['El enunciado regala una regla: ¿cuál es? Hay que usarla.', '¿Qué dos flechas tiene la caja? ¿Cuál de ellas cambia mientras cae?'],
      solucion: ['La regla está en el enunciado: la resistencia crece con la velocidad.', 'El peso no cambia. Al principio gana el peso; a medida que crece la resistencia, la fuerza neta y la aceleración bajan.', 'Cuando la resistencia iguala el peso, la aceleración es 0: sigue cayendo con velocidad constante.']
    },
    // ----- Reto: de principio a fin, con calculadora y sin personajes -----
    {
      id: 'e15', nivel: 'reto', tema: 'mision', tipo: 'numero', respuesta: 1125, unidad: 'm',
      enunciado: `<b>Misión 4 · un despegue con fuerzas.</b> Un avión de carga de ${q(60000, 'kg')} parte del reposo. Sus motores dan un empuje total de ${q(180000, 'N')}, y la resistencia en la pista es de ${q(30000, 'N')}. ¿Cuántos metros de pista necesita para llegar a ${q(270, 'km/h')}?`,
      plano: 'Misión 4, un despegue con fuerzas. Un avión de carga de 60 000 kg parte del reposo. Sus motores dan un empuje total de 180 000 N, y la resistencia en la pista es de 30 000 N. ¿Cuántos metros de pista necesita para llegar a 270 km/h?',
      errores: [
        { valor: 937.5, msg: 'Ese resultado sale de usar solo el empuje: a = 3 m/s². Falta restar la resistencia: la aceleración sale de la fuerza neta.' },
        { valor: 2250, msg: 'Ese resultado sale de multiplicar la velocidad final por el tiempo, como si hubiera ido así desde el principio. Arrancó en 0: falta el ½.' },
        { valor: 14580, msg: 'Ese resultado sale de usar los 270 km/h sin convertir. La aceleración está en m/s²: la velocidad tiene que ir en m/s.' },
        { valor: 2.5, msg: 'Esa es la aceleración, en m/s². Falta llegar a la distancia.' },
        { valor: 30, msg: 'Ese es el tiempo hasta despegar, en segundos. Falta la distancia.' }
      ],
      pistas: [
        'Son dos clases en una: con las fuerzas sale la aceleración, y con la aceleración, el movimiento.',
        '¿La velocidad está en las mismas unidades que la aceleración?',
        'Como en la misión 1: primero el tiempo y después la distancia.'
      ],
      solucion: [`${mt(SF, igual, n(180000), menos, n(30000), igual, q(150000, 'N'))}`, `${mt(L.a, igual, fr(n(150000), n(60000)), igual, q(2.5, 'm/s²'))}`, `${mt(q(270, 'km/h'), entre, n('3,6'), igual, q(75, 'm/s'))}`, `${mt(L.t, igual, fr(n(75), n(2.5)), igual, q(30, 's'))}`, `${mt(L.d, igual, fr(n(1), n(2)), por, n(2.5), por, pot(n(30), 2), igual, q(1125, 'm'))}`]
    },
    {
      id: 'e16', nivel: 'reto', tema: 'rampa', tipo: 'numero', respuesta: 6, unidad: 'm/s²',
      enunciado: `Una caja de ${q(25, 'kg')} baja sin fricción por una rampa de ${q(10, 'm')} de largo y ${q(6, 'm')} de alto. Con ${mt(L.g, igual, q(10, 'm/s²'))}, ¿cuál es su aceleración?`,
      plano: 'Una caja de 25 kg baja sin fricción por una rampa de 10 m de largo y 6 m de alto. Con g = 10 m/s², ¿cuál es su aceleración?',
      errores: [
        { valor: 8, msg: 'Ese resultado usa el coseno: adyacente ÷ hipotenusa. Lo que hace deslizar es el seno: opuesto ÷ hipotenusa.' },
        { valor: 10, msg: 'Esa es g, como si cayera libre. En la rampa solo una parte del peso la empuja hacia abajo.' },
        { valor: 150, msg: 'Esa es la fuerza rampa abajo, en newtons. Falta dividir entre la masa.' },
        { valor: 0.6, msg: 'Ese es el seno: opuesto ÷ hipotenusa. Falta multiplicarlo por g.' }
      ],
      pistas: ['¿Cuál es el opuesto y cuál es la hipotenusa? ¿Hace falta saber el ángulo?', '¿Hace falta la masa, o se cancela?'],
      solucion: [`${mt(sen, igual, fr(n(6), n(10)), igual, n('0,6'))}`, `${mt(L.a, igual, L.g, por, sen, igual, n(10), por, n('0,6'), igual, q(6, 'm/s²'))}`, 'La masa se cancela: los 25 kg sobran.']
    },
    {
      id: 'e17', nivel: 'reto', tema: 'neta', tipo: 'numero', respuesta: 16, unidad: 'N',
      enunciado: `Una caja de ${q(4, 'kg')} baja por una rampa. Su posición sigue ${mt(L.d, igual, pega(n(3), L.t), mas, pega(n(2), pot(L.t, 2)))}, con ${L.d} en metros y ${L.t} en segundos. ¿Cuál es la fuerza neta sobre la caja?`,
      plano: 'Una caja de 4 kg baja por una rampa. Su posición sigue d = 3t + 2t², con d en metros y t en segundos. ¿Cuál es la fuerza neta sobre la caja?',
      errores: [
        { valor: 8, msg: 'Ese resultado sale de tomar a = 2. Al lado de t² va ½ · a, y ½ · a = 2 da a = 4.' },
        { valor: 40, msg: 'Ese es todo el peso, en newtons. Rampa abajo empuja solo una parte.' },
        { valor: 12, msg: 'Ese resultado sale de 4 · 3: el 3 es la velocidad inicial, no la aceleración.' },
        { valor: 4, msg: 'Esa es la aceleración, en m/s². Falta multiplicarla por la masa.' }
      ],
      pistas: [`Hay que comparar con ${mt(L.d, igual, L.v0, por, L.t, mas, fr(n(1), n(2)), por, L.a, por, pot(L.t, 2))}: ¿qué número hace de ½ · a?`, 'Con la aceleración, la segunda ley.'],
      solucion: [`Al comparar con la fórmula: ${mt(L.v0, igual, q(3, 'm/s'))} y ${mt(fr(n(1), n(2)), por, L.a, igual, n(2))}, así que ${mt(L.a, igual, q(4, 'm/s²'))}.`, `${mt(SF, igual, L.m, por, L.a, igual, n(4), por, n(4), igual, q(16, 'N'))}`]
    }
  ];

  const NIVELES = { basico: 'Básico', intermedio: 'Intermedio', examen: 'Tipo examen', reto: 'Reto' };
  const TEMAS = { masa: 'Masa y peso', flechas: 'Diagrama de fuerzas', neta: 'Fuerza neta', leyes: 'Las tres leyes', rampa: 'La rampa', grafico: 'Del gráfico a las flechas', mision: 'Misión de vuelo' };

  /* ---------- Plan de la clase (lo ve el estudiante en la cabecera del módulo) ---------- */
  const PLAN_CLASE = [
    ['5 min', 'Tres apuestas en el papel. Se corrigen al final.'],
    ['13 min', 'Ideas clave, parte 1: masa, peso, las fuerzas que existen y las flechas de «¿Quién lo toca?».'],
    ['10 min', 'Mesa de fuerzas: retos 1 a 3.'],
    ['4 min', 'En el papel: retos 4 y 5. Después se comparan en la mesa.'],
    ['9 min', 'Ideas clave, parte 2: la fuerza neta y las tres leyes.'],
    ['10 min', 'Mesa de fuerzas: retos 6 y 7.'],
    ['4 min', 'En el papel: reto 8 y el ejercicio 4.'],
    ['5 min', 'Pausa.'],
    ['5 min', 'Ideas clave, parte 3: las flechas en la rampa.'],
    ['5 min', 'Mesa de fuerzas: retos 9 y 10.'],
    ['5 min', 'Ideas clave, parte 4: seno, coseno y el peso partido en dos.'],
    ['7 min', 'La rampa: retos 1 a 3.'],
    ['3 min', 'En el papel: reto 11.'],
    ['29 min', 'Ideas clave, parte 5, y práctica: los ejercicios 7 a 9 y cinco preguntas reales de cuadernillos del ICFES, con cronómetro.'],
    ['6 min', 'Cierre: ¿cuál apuesta cambió? De tarea: los retos 12 y 13 de la mesa, el reto 4 de la rampa y los demás ejercicios de la práctica.']
  ];

  MA.M5 = {
    L, SF, sen, cos, FUERZAS, F, RETOS_FUERZAS, GRUPOS_FUERZAS, RETOS_RAMPA, EJERCICIOS, NIVELES, TEMAS, PLAN_CLASE,
    vector, direcciones, NOMBRE_DIR, NOMBRE_LARGO, LARGOS, ANCHO, ALTO,
    geometria, fondo, flechaSvg, escena, grafica, graficaYonaiker, tobySvg, cuerpoSvg
  };
})();
