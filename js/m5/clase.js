/* =====================================================================
   Clase 6 · ideas clave (diapositivas del módulo 5)
   ---------------------------------------------------------------------
   Cinco bloques cortos, cada uno justo antes de su herramienta:
     parte 1 (diapositivas 1-9)    -> antes de la mesa, en el piso
     parte 2 (diapositivas 10-16)  -> antes de la fuerza neta en la mesa
     parte 3 (diapositivas 17-18)  -> antes de la mesa, en la rampa
     parte 4 (diapositivas 19-23)  -> antes de la herramienta de la rampa
     parte 5 (diapositivas 24-29)  -> antes de la práctica
   «La masa se cancela» va después de la carrera de la rampa: antes, le
   daría la respuesta de la tercera apuesta.
   Los ejemplos de aquí no se repiten en las herramientas ni en la
   práctica: si ya los vio, respondería de memoria.
   Las diapositivas le hablan de usted al estudiante.
   Respuestas tapadas: lo que se pregunta en clase no se ve hasta
   revelarlo (MA.f.oculto, con «Revelar» o con la flecha).
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { icono } = MA;
  const { n, op, fr, mt, q, tach, oculto, ocultoBloque } = MA.f;
  const C = MA.M5;
  const { L, SF, sen, cos, F } = C;
  const por = op('·'), igual = op('='), menos = op('−');
  const flecha = '<span class="d-flecha"></span>';

  // Un dibujo de la clase, con las flechas que se revelan por pasos
  const dibujo = e => `<div class="d-svg m5-d-fig">${C.escena(e)}</div>`;

  // Dos cuerpos que se empujan: cada flecha está en un cuerpo distinto
  const pareja = () => `
    <div class="d-svg m5-d-fig">
      <svg class="m5-fig" viewBox="0 0 420 190" role="img" aria-label="Toby y la caja se chocan: la caja empuja a Toby hacia la izquierda y Toby empuja a la caja hacia la derecha, con la misma fuerza">
        <line class="m5-piso" x1="30" y1="150" x2="390" y2="150"/>
        ${C.tobySvg(160, 134, 1.4)}
        ${C.cuerpoSvg('caja', 240, 118)}
        ${C.flechaSvg(160, 96, { dir: 'izq', px: 96, clase: 'contacto', texto: 'La caja sobre Toby', paso: 1, et: { x: 150, y: 76, ancla: 'middle' } }, 0)}
        ${C.flechaSvg(240, 78, { dir: 'der', px: 96, clase: 'contacto', texto: 'Toby sobre la caja', paso: 1, et: { x: 276, y: 58, ancla: 'middle' } }, 0)}
      </svg>
    </div>`;

  // El triángulo de siempre, con sus lados por nombre
  const triangulo = () => `
    <div class="d-svg m5-d-fig">
      <svg class="m5-fig" viewBox="0 0 420 230" role="img" aria-label="Un triángulo rectángulo. Desde el ángulo θ, abajo a la derecha, el lado vertical es el opuesto, el horizontal es el adyacente y el inclinado es la hipotenusa">
        <polygon class="m5-rampa" points="390,195 90,195 90,22"/>
        <path class="m5-arco" d="M90 179h16v16"/>
        <path class="m5-arco" d="M348 195A42 42 0 0 1 353.6 174"/>
        <text class="m5-medida" x="326" y="188" text-anchor="middle">θ</text>
        <text class="m5-medida d-oculta-svg" data-paso="1" x="80" y="112" text-anchor="end">Opuesto</text>
        <text class="m5-medida d-oculta-svg" data-paso="2" x="240" y="219" text-anchor="middle">Adyacente</text>
        <text class="m5-medida d-oculta-svg" data-paso="3" x="248" y="94" text-anchor="middle" transform="rotate(30 248 94)">Hipotenusa</text>
      </svg>
    </div>`;

  // La rampa con sus medidas
  const rampaMedidas = () => `
    <div class="d-svg m5-d-fig">
      <svg class="m5-fig" viewBox="0 0 420 230" role="img" aria-label="Una rampa de 10 metros de largo que sube 5 metros, con un ángulo θ abajo a la derecha">
        <polygon class="m5-rampa" points="390,195 90,195 90,22"/>
        <path class="m5-arco" d="M348 195A42 42 0 0 1 353.6 174"/>
        <text class="m5-medida" x="326" y="188" text-anchor="middle">θ</text>
        <text class="m5-medida" x="248" y="94" text-anchor="middle" transform="rotate(30 248 94)">Largo: 10 m</text>
        <text class="m5-medida" x="80" y="112" text-anchor="end">Alto: 5 m</text>
      </svg>
    </div>`;

  // El peso partido en dos: el peso es la hipotenusa del triángulo de fuerzas
  const pesoPartido = () => {
    const g = C.geometria({ tipo: 'rampa', cuerpo: 'caja' });
    const [ex, ey] = C.vector('entra', 30);
    const ox = ex * 85, oy = ey * 85;
    return `
      <div class="d-svg m5-d-fig">
        <svg class="m5-fig" viewBox="0 0 ${C.ANCHO} ${C.ALTO}" role="img" aria-label="Una caja en la rampa. El peso, vertical, es la hipotenusa de un triángulo. El cateto contra la rampa toca el ángulo θ, y el cateto rampa abajo queda enfrente">
          ${C.fondo({ tipo: 'rampa', cuerpo: 'caja' }, g)}
          ${C.flechaSvg(g.cx, g.cy, F('peso', 'aba', 3, { et: { x: g.cx + 10, y: g.cy + 62, ancla: 'start' } }), g.ang)}
          ${C.flechaSvg(g.cx, g.cy, { dir: 'entra', px: 85, clase: 'parte', texto: 'Contra la rampa', paso: 1, et: { x: g.cx - 56, y: g.cy + 50, ancla: 'end' } }, g.ang)}
          ${C.flechaSvg(g.cx, g.cy, { dir: 'baja', px: 49, ox, oy, clase: 'parte', texto: 'Rampa abajo', paso: 1, et: { x: g.cx - 4, y: g.cy + 118, ancla: 'middle' } }, g.ang)}
          <text class="m5-medida m5-theta" x="${g.cx - 11}" y="${g.cy + 42}" text-anchor="middle">θ</text>
        </svg>
      </div>`;
  };

  // Una opción del problema modelo, con la razón para tacharla
  const opcionModelo = (letra, flechas, etiqueta, razon, paso) => `
    <div class="m5-modelo-op">
      <span class="pr-letra">${letra}</span>
      <div class="d-svg">${C.escena({ tipo: 'piso', cuerpo: 'costal', clase: 'm5-op', etiqueta, flechas: [F('normal', 'arr'), F('peso', 'aba'), ...flechas] })}</div>
      <small>${oculto(razon, paso)}</small>
    </div>`;

  const DIAPOSITIVAS = [
    // ---------------- Parte 1 · masa, peso y flechas ----------------
    {
      titulo: 'Portada',
      html: `
        <div class="d-portada">
          <p class="d-kicker">Módulo 5 · clase 6</p>
          <h2>Física mecánica II: dinámica</h2>
          <p class="d-sub">En este módulo va a poder:</p>
          <ul class="d-lista">
            <li>Decir qué es masa, qué es peso y qué cambia al viajar a la Luna.</li>
            <li>Dibujar las flechas de cualquier situación, en el piso, en el aire y en una rampa.</li>
            <li>Leer esas flechas y decir qué va a hacer el cuerpo.</li>
            <li>Cazar las trampas de las preguntas tipo examen.</li>
          </ul>
        </div>`
    },
    {
      titulo: 'Tres apuestas',
      html: `
        <h2>Tres apuestas</h2>
        <p>Escríbalas en el papel. Todavía no se corrigen: vuelven al final de la clase.</p>
        <div class="m5-apuestas">
          <div class="d-tarjeta"><span class="d-num">Apuesta 1</span>Un avión va recto y nivelado, con velocidad constante. ¿El empuje es mayor, igual o menor que la resistencia del aire?</div>
          <div class="d-tarjeta"><span class="d-num">Apuesta 2</span>Toby Maguire choca de frente con una caja de 300 kg. ¿Quién recibe más fuerza?</div>
          <div class="d-tarjeta"><span class="d-num">Apuesta 3</span>Un melón de 2 kg y una sandía de 10 kg bajan por la misma rampa, sin fricción. ¿Cuál llega primero?</div>
        </div>`
    },
    {
      titulo: 'El cuarto lenguaje',
      html: `
        <h2>El cuarto lenguaje: las flechas</h2>
        <p>En la clase pasada vio tres lenguajes de la física: datos, gráfico y ecuación. Hoy, el cuarto.</p>
        <p class="d-destacado">Una fuerza siempre es <b>de alguien sobre alguien</b>. Si no se puede decir quién la hace, no existe.</p>
        <p>El empleado empuja la caja. ¿De quién es la fuerza? ${oculto('Del empleado')} ¿Sobre quién? ${oculto('Sobre la caja', 2)}</p>
        <p class="d-nota">Las fuerzas se miden en newtons. 1 N es más o menos lo que pesa una mandarina, y es lo que vio en el módulo 1: ${mt(q(1, 'N'), igual, q(1, 'kg · m/s²'))}.</p>`
    },
    {
      titulo: 'Masa y peso',
      html: `
        <h2>Masa y peso no son lo mismo</h2>
        <div class="d-tabla-envoltura">
          <table class="d-tabla m5-d-tabla">
            <thead><tr><th scope="col"></th><th scope="col">Masa, en kg</th><th scope="col">Peso, en N</th></tr></thead>
            <tbody>
              <tr><th scope="row">Qué es</th><td>Cuánto cuesta cambiarle el movimiento</td><td>Cuánto lo jala el planeta: ${mt(L.P, igual, L.m, por, L.g)}</td></tr>
              <tr><th scope="row">Toby en la Tierra</th><td>${q(30, 'kg')}</td><td>${q(300, 'N')}</td></tr>
              <tr><th scope="row">Toby en la Luna (g ÷ 6)</th><td>${oculto(q(30, 'kg'))}</td><td>${oculto(q(50, 'N'), 2)}</td></tr>
            </tbody>
          </table>
        </div>
        ${ocultoBloque('<p class="d-destacado d-ojo">El peso solo cambia si cambia la masa o cambia el planeta. Ni el viento, ni una rampa, ni un soplido lo cambian. En el examen, esa es la trampa más repetida.</p>', 3)}`
    },
    {
      titulo: '¿Por qué no se cae el melón?',
      html: `
        <h2>¿Por qué no se cae el melón?</h2>
        <div class="d-dos">
          ${dibujo({ tipo: 'piso', cuerpo: 'melon', etiqueta: 'Un melón quieto en el piso, con su peso hacia abajo y la normal hacia arriba', flechas: [F('peso', 'aba'), F('normal', 'arr', 2, { paso: 1 })] })}
          <div>
            <p>El peso lo jala hacia abajo, pero el melón no se mueve. ¿Quién lo empuja hacia arriba? ${oculto('El piso')}</p>
            ${ocultoBloque('<p>Esa fuerza se llama <b>normal</b>. Si el piso no empujara, el melón lo atravesaría.</p>', 2)}
          </div>
        </div>
        ${ocultoBloque('<p class="d-destacado">«Normal» quiere decir perpendicular: sale de la superficie en ángulo recto. En un piso apunta hacia arriba; en una rampa, no.</p>', 3)}`
    },
    {
      titulo: 'Las cinco fuerzas',
      html: `
        <h2>Las cinco fuerzas de esta clase</h2>
        <div class="d-tabla-envoltura">
          <table class="d-tabla m5-d-apretada">
            <thead><tr><th scope="col">Fuerza</th><th scope="col">Quién la hace</th><th scope="col">Hacia dónde</th></tr></thead>
            <tbody>
              <tr><td><b>Peso</b></td><td>La Tierra, sin tocarlo</td><td>${oculto('Hacia abajo, siempre')}</td></tr>
              <tr><td><b>Normal</b></td><td>La superficie que lo sostiene</td><td>${oculto('Perpendicular a la superficie', 2)}</td></tr>
              <tr><td><b>Fricción</b></td><td>La superficie por donde resbala</td><td>${oculto('Contra el deslizamiento', 3)}</td></tr>
              <tr><td><b>Tensión</b></td><td>Una cuerda o un cable</td><td>${oculto('A lo largo de la cuerda: solo jala', 4)}</td></tr>
              <tr><td><b>Empuje</b></td><td>Una mano o un motor</td><td>${oculto('Hacia donde empuja', 5)}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="d-nota">No hay más en esta clase. Si en un dibujo aparece otra, hay que preguntarse quién la hace.</p>`
    },
    {
      titulo: '¿Quién lo toca?',
      html: `
        <h2>La llave de las flechas: ¿quién lo toca?</h2>
        <ol class="m5-pasos-d">
          <li><b>Se dibuja el cuerpo solo.</b> Lo demás se borra.</li>
          <li><b>El peso va siempre, hacia abajo.</b> Es la única fuerza sin contacto.</li>
          <li><b>Cada cosa que lo toca da su flecha.</b> Una superficie, la normal y, si resbala, la fricción. Una cuerda, la tensión. Un motor o una mano, el empuje.</li>
          <li><b>Se compara con lo que hace el cuerpo, cada eje por su lado.</b> Quieto o con velocidad constante, las flechas se anulan. Si acelera, gana la que apunta hacia donde acelera.</li>
        </ol>`
    },
    {
      titulo: 'Modelo: empujar con velocidad constante',
      html: `
        <h2>Empujar con velocidad constante</h2>
        <div class="d-dos">
          ${dibujo({ tipo: 'piso', cuerpo: 'caja', extras: ['empleado', 'toby'], mov: 'der', etiqueta: 'El empleado empuja una caja con velocidad constante, y Toby le ladra sin tocarla. Las flechas de empuje y fricción son iguales', flechas: [F('peso', 'aba', 2, { paso: 1 }), F('normal', 'arr', 2, { paso: 1 }), F('empuje', 'der', 2, { paso: 2 }), F('friccion', 'izq', 2, { paso: 2, et: { x: 168, y: 158, ancla: 'middle' } })] })}
          <div>
            <p>¿Qué la toca? ${oculto('El piso y el empleado. Toby solo ladra')}</p>
            <p>En lo horizontal, ¿cuál es más larga: el empuje o la fricción? ${oculto('Son iguales', 3)}</p>
          </div>
        </div>
        ${ocultoBloque('<p class="d-destacado">Primera ley: si las flechas se anulan, sigue como venía, quieto o con velocidad constante. Para no perder velocidad no hace falta ganar: basta empatar.</p>', 4)}`
    },
    {
      titulo: 'Su turno: la mesa de fuerzas',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('fuerzas')}</div>
        <h2>Su turno: la mesa de fuerzas</h2>
        <ul class="d-lista">
          <li>Abra <b>Mesa de fuerzas</b>: retos 1, 2 y 3. Diga en voz alta quién hace cada flecha.</li>
          <li>Después, sin la mesa, en el papel: los retos 4 y 5. Cuando los tenga, compárelos en la mesa.</li>
        </ul>`
    },
    // ---------------- Parte 2 · la fuerza neta y las tres leyes ----------------
    {
      titulo: 'Si no se anulan',
      html: `
        <h2>Si las flechas no se anulan, acelera</h2>
        <div class="mt mt-bloque d-formula">${SF} ${igual} ${L.m} ${por} ${L.a}</div>
        <ul class="d-lista">
          <li>${SF} es la <b>fuerza neta</b>: la suma de las flechas, cada una con su signo. Hacia la derecha suma y hacia la izquierda resta, como plata y deudas.</li>
          <li>${L.a} es la misma aceleración del radar de pista y la pendiente del gráfico de velocidad.</li>
          <li>Es una sola ley para todo: si ${mt(L.a, igual, n(0))}, las flechas se anulan.</li>
        </ul>`
    },
    {
      titulo: 'Modelo: primero las flechas',
      html: `
        <h2>Primero las flechas, después la masa</h2>
        <div class="d-dos">
          ${dibujo({ tipo: 'piso', cuerpo: 'caja', mov: 'der', etiqueta: 'Una caja de 40 kg con un empuje de 200 newtons hacia la derecha y una fricción de 80 newtons hacia la izquierda', flechas: [F('empuje', 'der', 3, { texto: '200 N' }), F('friccion', 'izq', 1, { texto: '80 N' })] })}
          <div>
            <p>La caja tiene ${q(40, 'kg')}.</p>
            <div class="d-pasos">${mt(SF, igual, n('+200'), menos, n(80), igual, oculto(q(120, 'N')))}</div>
            <div class="d-pasos">${mt(L.a, igual, fr(n(120), n(40)), igual, oculto(q(3, 'm/s²'), 2))}</div>
          </div>
        </div>
        ${ocultoBloque(`<p class="d-destacado d-ojo">Primero lo que suma y resta; después, lo que divide. ${mt(n(200), op('÷'), n(40), igual, n(5))} se olvida de la fricción, y dividir primero da −75.</p>`, 3)}`
    },
    {
      titulo: 'Del gráfico a las flechas',
      html: `
        <h2>Del gráfico a las flechas: Yonaiker</h2>
        <div class="d-dos">
          <div class="d-svg m5-d-fig">${C.graficaYonaiker()}</div>
          <div>
            <p>¿En qué tramo hay fuerza neta sobre Yonaiker?</p>
            <p>De 0 a 3 s: ${oculto('Sí: la velocidad cambia')}</p>
            <p>De 3 a 7 s: ${oculto('No: velocidad constante', 2)}</p>
          </div>
        </div>
        ${ocultoBloque('<p class="d-destacado">La fuerza no dice qué tan rápido va: dice cómo cambia su velocidad. Justo cuando va más rápido, las flechas se anulan.</p>', 3)}`
    },
    {
      titulo: 'Doble y mitad',
      html: `
        <h2>Doble y mitad, sin hacer cuentas</h2>
        <div class="mt mt-bloque d-formula">${L.a} ${igual} ${fr(SF, L.m)}</div>
        <div class="m5-apuestas">
          <div class="d-tarjeta"><span class="d-num">Doble fuerza</span>La aceleración: ${oculto('el doble')}</div>
          <div class="d-tarjeta"><span class="d-num">Doble masa</span>La aceleración: ${oculto('la mitad', 2)}</div>
          <div class="d-tarjeta"><span class="d-num">Doble las dos</span>La aceleración: ${oculto('igual', 3)}</div>
        </div>`
    },
    {
      titulo: 'Tercera ley',
      html: `
        <h2>Tercera ley: las fuerzas vienen en parejas</h2>
        <div class="d-dos">
          ${pareja()}
          <div>
            <p>Si A empuja a B, B empuja a A: misma fuerza, sentido contrario y <b>en cuerpos distintos</b>.</p>
            <p>Toby choca con la caja. ¿Quién recibe más fuerza? ${oculto('La misma')}</p>
            <p>¿Quién sale más acelerado? ${oculto('Toby: menos masa', 2)}</p>
          </div>
        </div>`
    },
    {
      titulo: 'El peso y la normal',
      html: `
        <h2>La trampa: el peso y la normal</h2>
        <p>En una caja quieta sobre la mesa, el peso y la normal son iguales y contrarios. ¿Son pareja? ${oculto('No: están en la misma caja')}</p>
        <p>Entonces, ¿cuál es la pareja del peso? ${oculto('La caja jala a la Tierra', 2)}</p>
        ${ocultoBloque('<p class="d-destacado">Las que están en el mismo cuerpo se pueden anular. Las de una pareja nunca se anulan, porque están en cuerpos distintos.</p>', 2)}
        <p class="d-nota">En el examen pueden llamarlas así: primera ley o de la inercia, segunda ley (${mt(SF, igual, L.m, por, L.a)}), tercera ley o de acción y reacción.</p>`
    },
    {
      titulo: 'Su turno: la fuerza neta',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('fuerzas')}</div>
        <h2>Su turno: la fuerza neta</h2>
        <ul class="d-lista">
          <li>En la <b>Mesa de fuerzas</b>: el reto 6, con sus signos, y el reto 7, donde el diagrama ya está hecho y hay que decir qué flechas cambian.</li>
          <li>Después, en el papel: el avión del reto 8. Ahí se resuelve la primera apuesta.</li>
          <li>Y el ejercicio 4 de la práctica.</li>
        </ul>`
    },
    // ---------------- Parte 3 · las flechas en la rampa ----------------
    {
      titulo: 'El melón otra vez',
      html: `
        <h2>El melón del depósito, otra vez</h2>
        <div class="d-dos">
          ${dibujo({ tipo: 'rampa', cuerpo: 'melon', mov: 'baja', etiqueta: 'Un melón en una rampa, con el peso vertical hacia abajo y la normal perpendicular a la rampa', flechas: [F('peso', 'aba', 3, { paso: 2 }), F('normal', 'sale', 2, { paso: 3 })] })}
          <div>
            <p>Bajaba solo por la rampa. ¿Quién lo empuja? ${oculto('Nadie lo toca para empujarlo')}</p>
            <p>¿Hacia dónde apunta el peso? ${oculto('Hacia abajo, aunque haya rampa', 2)}</p>
            <p>¿Y la normal? ${oculto('Perpendicular a la rampa', 3)}</p>
          </div>
        </div>
        <p class="d-nota">Rampa, pendiente o plano inclinado: es lo mismo. Si hay fricción, va a lo largo de la rampa y contra el deslizamiento.</p>`
    },
    {
      titulo: 'Su turno: las flechas en la rampa',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('fuerzas')}</div>
        <h2>Su turno: las flechas en la rampa</h2>
        <ul class="d-lista">
          <li>En la <b>Mesa de fuerzas</b>: los retos 9 y 10.</li>
          <li>Todavía no hace falta ninguna cuenta: solo las flechas.</li>
        </ul>`
    },
    // ---------------- Parte 4 · seno y coseno ----------------
    {
      titulo: 'Seno y coseno',
      html: `
        <h2>Seno y coseno, como en el colegio</h2>
        <div class="d-dos">
          ${triangulo()}
          <div>
            <p>Desde el ángulo ${L.th}, ¿cómo se llama el lado de enfrente? ${oculto('El opuesto')}</p>
            <p>¿Y el que lo toca? ${oculto('El adyacente', 2)}</p>
            <p>¿Y el más largo? ${oculto('La hipotenusa', 3)}</p>
          </div>
        </div>
        ${ocultoBloque(`<div class="d-pasos m5-d-seno">${mt(sen, igual, fr('<span class="un">opuesto</span>', '<span class="un">hipotenusa</span>'))} ${mt(cos, igual, fr('<span class="un">adyacente</span>', '<span class="un">hipotenusa</span>'))}</div>`, 4)}`
    },
    {
      titulo: 'La rampa es un triángulo',
      html: `
        <h2>La rampa es un triángulo</h2>
        <div class="d-dos">
          ${rampaMedidas()}
          <div>
            <div class="d-pasos">${mt(sen, igual, fr(n(5), n(10)), igual, oculto(n('0,5')))}</div>
            <p>Es un ángulo de 30°. En la calculadora: sen 30 = ${oculto(n('0,5'), 2)} y cos 30 = ${oculto(n('0,866'), 3)}</p>
          </div>
        </div>
        <p class="d-destacado">La hipotenusa es el lado más largo: seno y coseno nunca pasan de 1. Si da más, hay un error.</p>`
    },
    {
      titulo: 'Partir el peso en dos',
      html: `
        <h2>Partir el peso en dos</h2>
        <div class="d-dos">
          ${pesoPartido()}
          <div>
            <p>El peso es la hipotenusa.</p>
            <div class="d-pasos">${mt(sen, igual, fr(L.Ppar, L.P))}${flecha}${mt(L.Ppar, igual, L.P, por, sen)}</div>
            <p><b>Seno se desliza, coseno contra la rampa.</b></p>
          </div>
        </div>
        <div class="d-pasos m5-d-fila">
          <span>Con ${q(400, 'N')}, a 30°:</span>
          ${mt(L.Ppar, igual, n(400), por, n('0,5'), igual, oculto(q(200, 'N')))}
          ${mt(L.Pper, igual, n(400), por, n('0,866'), igual, oculto(q(346, 'N'), 2))}
        </div>`
    },
    {
      titulo: 'Llevarlo al extremo',
      html: `
        <h2>Llevarlo al extremo</h2>
        <div class="d-tarjetas">
          <div class="d-tarjeta m5-d-extremo"><span class="d-num">Rampa plana, 0°</span>${mt('<span class="m5-fn">sen</span>', n('0°'), igual, oculto(n(0)))} <small class="d-pie-tarjeta">Nada desliza.</small></div>
          <div class="d-tarjeta m5-d-extremo"><span class="d-num">Rampa vertical, 90°</span>${mt('<span class="m5-fn">sen</span>', n('90°'), igual, oculto(n(1), 2))} <small class="d-pie-tarjeta">Todo el peso empuja: es la caída libre.</small></div>
        </div>
        <p class="d-destacado">Si se le olvida cuál es cuál, o si el ángulo viene dibujado en otro lado, el extremo lo salva: con la rampa plana, nada desliza.</p>`
    },
    {
      titulo: 'Su turno: la rampa',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('rampa')}</div>
        <h2>Su turno: la rampa</h2>
        <ul class="d-lista">
          <li>Abra <b>La rampa</b>: retos 1, 2 y 3. Antes de mover nada, diga su predicción.</li>
          <li>El reto 3 es la tercera apuesta: el melón contra la sandía.</li>
          <li>Después, en el papel: el reto 11 de la mesa, y compárelo.</li>
        </ul>`
    },
    // ---------------- Parte 5 · tácticas para el examen ----------------
    {
      titulo: 'La masa se cancela',
      html: `
        <h2>Por qué llegaron al tiempo: la masa se cancela</h2>
        <div class="d-pasos d-pasos-grandes">${mt(tach(L.m), por, L.g, por, sen, igual, tach(L.m), por, L.a)}</div>
        <div class="d-pasos d-pasos-grandes">${mt(L.a, igual, L.g, por, sen)}</div>
        <p>A la sandía la empuja más fuerza, pero también cuesta más acelerarla. Es una balanza: lo mismo en los dos platos.</p>
        <p>El melón del depósito bajaba con ${mt(L.a, igual, q(2, 'm/s²'))}. Con ${mt(L.g, igual, q(10, 'm/s²'))}, ¿cuánto vale el seno de esa rampa? ${oculto(n('0,2'))}</p>`
    },
    {
      titulo: 'Palabras que son flechas',
      html: `
        <h2>Palabras que son flechas</h2>
        <div class="d-tabla-envoltura">
          <table class="d-tabla m5-d-apretada">
            <thead><tr><th scope="col">El enunciado dice</th><th scope="col">Quiere decir</th></tr></thead>
            <tbody>
              <tr><td>«Velocidad constante», «en reposo», «en equilibrio»</td><td>${oculto('Las flechas se anulan')}</td></tr>
              <tr><td>«Acelera», «frena»</td><td>${oculto('Gana una: hacia donde cambia la velocidad', 2)}</td></tr>
              <tr><td>«Sin fricción»</td><td>${oculto('Esa flecha no va', 3)}</td></tr>
              <tr><td>«Se suelta», «cae»</td><td>${oculto('Nadie la empuja: solo el peso', 4)}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="d-nota">A veces el enunciado regala la regla: «la resistencia crece con la velocidad». Si la dice, se usa.</p>`
    },
    {
      titulo: 'Tres tácticas',
      html: `
        <h2>Tres tácticas para descartar</h2>
        <ol class="m5-pasos-d">
          <li><b>Cazar la razón falsa.</b> El resultado puede estar bien y el «porque» estar mal. Las cuatro más comunes: «el peso cambió», «una flecha sin dueño», «contar flechas en lugar de sumarlas» y «si se mueve, algo va ganando».</li>
          <li><b>Llevarlo al extremo.</b> ¿Funciona con la rampa plana o vertical?</li>
          <li><b>Dejar que manden las unidades.</b> Dicen qué operación va, aunque no recuerde la fórmula.</li>
        </ol>`
    },
    {
      titulo: 'Las unidades mandan',
      html: `
        <h2>Las unidades mandan</h2>
        <p>Del ventilador del depósito salen ${q(6, 'm³')} de aire en cada segundo, a ${q(3, 'm/s')}. ¿Qué área tiene la salida?</p>
        <div class="d-pasos">${mt(fr(q('', 'm³'), q('', 's')), op('÷'), fr(q('', 'm'), q('', 's')), igual, oculto(q('', 'm²')))}</div>
        <div class="d-pasos">${mt(n(6), op('÷'), n(3), igual, oculto(q(2, 'm²'), 2))}</div>
        <p>A 1000 rpm mueve ${q(6, 'm³/s')}. ¿Y a 1500 rpm? ${oculto('1,5 veces más: 9 m³/s', 3)}</p>
        <p class="d-nota">Nunca vio esa fórmula, y no hizo falta: es el factor unitario del módulo 1.</p>`
    },
    {
      titulo: 'Modelo: una pregunta de principio a fin',
      html: `
        <h2>Una pregunta, de principio a fin</h2>
        <p class="m5-d-enunciado">Un montacargas jala un costal de 200 kg con una cuerda, con velocidad constante. El piso tiene fricción. El jefe de turno le grita al costal que se apure.</p>
        <div class="m5-modelo">
          ${opcionModelo('A', [F('tension', 'der', 3), F('friccion', 'izq', 1)], 'Tensión más larga que la fricción', 'Tachada: eso sería acelerar', 1)}
          ${opcionModelo('B', [F('tension', 'der')], 'Solo la tensión, sin fricción', 'Tachada: el piso sí tiene fricción', 2)}
          ${opcionModelo('C', [F('tension', 'der'), F('friccion', 'izq')], 'Tensión y fricción iguales', 'Queda esta: empatan', 4)}
          ${opcionModelo('D', [F('tension', 'der', 2, { oy: 12 }), F('friccion', 'izq'), F('movimiento', 'der', 2, { oy: -12, et: { x: 226, y: 104, ancla: 'start' } })], 'Tensión y fricción iguales, más una flecha llamada movimiento', 'Tachada: ¿quién la hace?', 3)}
        </div>
        <p class="d-nota">Los 200 kg sobran, y el grito no toca el costal: no hay flecha.</p>`
    },
    {
      titulo: 'Su turno: la práctica',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('hoja')}</div>
        <h2>Su turno: la práctica</h2>
        <ul class="d-lista">
          <li>Primero, un ejercicio con ayuda: en el 7, usted decide.</li>
          <li>Después, solo y con cronómetro: los ejercicios 8 y 9, y cinco preguntas reales de cuadernillos del ICFES.</li>
          <li>Unos 2 minutos por pregunta. Primero el dibujo, en el papel; después, las opciones.</li>
        </ul>`
    }
  ];

  const PARTES = [
    { id: 'p1', nombre: 'Parte 1 · masa, peso y flechas', corto: 'Parte 1 · masa, peso y flechas', desde: 0, hasta: 8, minutos: '13 min' },
    { id: 'p2', nombre: 'Parte 2 · la fuerza neta', corto: 'Parte 2 · la fuerza neta y las tres leyes', desde: 9, hasta: 15, minutos: '9 min' },
    { id: 'p3', nombre: 'Parte 3 · la rampa', corto: 'Parte 3 · las flechas en la rampa', desde: 16, hasta: 17, minutos: '5 min' },
    { id: 'p4', nombre: 'Parte 4 · seno y coseno', corto: 'Parte 4 · seno y coseno', desde: 18, hasta: 22, minutos: '5 min' },
    { id: 'p5', nombre: 'Parte 5 · tácticas', corto: 'Parte 5 · tácticas para el examen', desde: 23, hasta: 28, minutos: '5 min' }
  ];

  MA.Clase5 = { DIAPOSITIVAS, PARTES };
})();
