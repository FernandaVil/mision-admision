/* =====================================================================
   CLASE 1 · ideas clave (diapositivas), ficha de equivalencias y
   guía del tutor (#guia)
   ---------------------------------------------------------------------
   La teoría va en dos bloques cortos, cada uno justo antes de la
   herramienta donde se usa:
     parte 1 (diapositivas 1-6)  -> antes de la balanza
     parte 2 (diapositivas 7-12) -> antes de la mesa de conversión
   Cada diapositiva trae notas para quien da la clase.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { icono } = MA;
  const { vr, un, n, op, fr, mt, q, tach } = MA.f;
  const por = op('·'), igual = op('=');
  const qn = (valor, unidad) => `${n(valor)} ${un(unidad)}`;

  /* Balanza estática para la diapositiva 3 (usa los colores de la balanza real) */
  const balanzaSvg = `
    <svg viewBox="0 0 560 250" class="d-balanza" role="img" aria-label="Balanza en equilibrio: a la izquierda 3 por x, a la derecha 12">
      <rect class="bz-base" x="200" y="226" width="160" height="12" rx="4"/>
      <path class="bz-fulcro" d="M280 150 L246 226 L314 226 Z"/>
      <line class="bz-igual" x1="268" y1="197" x2="292" y2="197"/>
      <line class="bz-igual" x1="268" y1="208" x2="292" y2="208"/>
      <rect class="bz-viga" x="70" y="144" width="420" height="12" rx="6"/>
      <circle class="bz-eje" cx="280" cy="150" r="8"/>
      <line class="bz-poste" x1="110" y1="144" x2="110" y2="124"/>
      <line class="bz-poste" x1="450" y1="144" x2="450" y2="124"/>
      <rect class="bz-plataforma" x="40" y="114" width="140" height="10" rx="3"/>
      <rect class="bz-plataforma" x="380" y="114" width="140" height="10" rx="3"/>
      <rect class="d-bloque" x="52" y="54" width="116" height="58" rx="10"/>
      <rect class="d-bloque" x="392" y="54" width="116" height="58" rx="10"/>
      <text class="d-bloque-txt" x="110" y="93"><tspan class="d-recto">3 · </tspan>x</text>
      <text class="d-bloque-txt d-recto" x="450" y="93">12</text>
    </svg>`;

  /* ---------- Diapositivas ---------- */
  const DIAPOSITIVAS = [
    // ---------------- Parte 1 ----------------
    {
      titulo: 'Portada',
      html: `
        <div class="d-portada">
          <p class="d-kicker">Módulo 1 · clase 1</p>
          <h2>Despejes y conversión de unidades</h2>
          <p class="d-sub">Al terminar hoy vas a poder:</p>
          <ul class="d-lista">
            <li>Despejar fórmulas como ${mt(vr('d'), igual, vr('v'), por, vr('t'))} sin memorizar reglas.</li>
            <li>Convertir unidades, como km/h a m/s, sin regla de tres.</li>
          </ul>
        </div>`,
      notas: {
        decir: 'Hoy vemos las dos herramientas que más se repiten en el examen. No vamos a memorizar reglas: vamos a entender por qué funcionan, y eso no se olvida.',
        ojo: 'Antes de empezar, confirma que tiene papel y lápiz, y que no usa calculadora.'
      }
    },
    {
      titulo: 'Calentamiento',
      html: `
        <h2>Dos preguntas para calentar</h2>
        <div class="d-tarjetas">
          <div class="d-tarjeta"><span class="d-num">1</span>Si ${mt(n(3), por, vr('x'), igual, n(12))}, ¿cuánto vale ${vr('x')}?</div>
          <div class="d-tarjeta"><span class="d-num">2</span>¿Cuántos metros son ${q(2, 'km')}?</div>
        </div>
        <p class="d-nota">No hay respuestas malas: cuéntame cómo lo pensaste.</p>`,
      notas: {
        decir: 'Antes de explicar nada, quiero ver cómo lo piensas tú.',
        preguntar: '¿Cuánto vale x? ¿Cuántos metros son 2 km? ¿Cómo lo pensaste?',
        esperar: 'x = 4, porque 12 ÷ 3 = 4. Y 2000 m.',
        ojo: 'Si dice «el 3 pasa a dividir», está bien, pero pregúntale por qué. Esa respuesta la va a construir hoy con la balanza. No lo corrijas todavía.'
      }
    },
    {
      titulo: 'El igual es una balanza',
      html: `
        <h2>El signo igual es una balanza</h2>
        <div class="d-dos">
          <div class="d-svg">${balanzaSvg}</div>
          <div>
            <p class="d-grande">Lo que hay a cada lado del igual <b>vale lo mismo</b>.</p>
            <p>Si le haces algo a un plato, tienes que hacerle lo mismo al otro.</p>
            <div class="d-pasos">
              ${mt(n(3), por, vr('x'), igual, n(12))}
              <span class="d-flecha">÷ 3 en los dos lados</span>
              ${mt(vr('x'), igual, n(4))}
            </div>
          </div>
        </div>`,
      notas: {
        decir: 'El igual no significa «da como resultado»: significa «pesa lo mismo». Si divido entre 3 solo el lado izquierdo, la balanza se cae. Si divido los dos lados, sigue equilibrada.',
        preguntar: 'Si quito la mitad de lo que hay en un plato, ¿qué tengo que hacer con el otro?',
        esperar: 'Quitarle la mitad también.',
        ojo: 'Es la idea más importante de la primera parte. Si la entiende, todo lo demás sale solo.'
      }
    },
    {
      titulo: 'Operaciones contrarias',
      html: `
        <h2>Cada operación tiene su contraria</h2>
        <div class="d-contrarias">
          <div><span class="d-op">+</span> sumar</div><span class="d-dobleflecha">⇄</span><div><span class="d-op">−</span> restar</div>
          <div><span class="d-op">×</span> multiplicar</div><span class="d-dobleflecha">⇄</span><div><span class="d-op">÷</span> dividir</div>
        </div>
        <p class="d-destacado">Para dejar sola una variable, deshaces lo que le están haciendo, <b>en los dos lados</b>.</p>
        <p class="d-nota">Orden: primero lo que suma o resta; después, lo que multiplica o divide.</p>`,
      notas: {
        decir: 'Despejar es deshacer. Si a la t la están multiplicando por v, lo deshago dividiendo entre v, pero en los dos platos.',
        preguntar: 'En d = v · t, ¿qué le están haciendo a la t?',
        esperar: 'La están multiplicando por v.',
        ojo: 'Pídele que diga la operación en voz alta antes de hacerla. Así se fija.'
      }
    },
    {
      titulo: 'Una fórmula es una relación',
      html: `
        <h2>Una fórmula es una relación entre cantidades</h2>
        <div class="d-etiquetada">
          <div><span class="mt">${vr('d')}</span><small>distancia</small></div>
          <div><span class="mt">${igual}</span><small></small></div>
          <div><span class="mt">${vr('v')}</span><small>velocidad</small></div>
          <div><span class="mt">${por}</span><small></small></div>
          <div><span class="mt">${vr('t')}</span><small>tiempo</small></div>
        </div>
        <p>Despejar la ${vr('t')} es reescribirla con la ${vr('t')} sola: ${mt(vr('t'), igual, fr(vr('d'), vr('v')))}</p>
        <p class="d-destacado">Compruébalo con números fáciles: ${qn(100, 'km')} a ${qn(50, 'km/h')} → ${mt(vr('t'), igual, fr(n(100), n(50)), igual, q(2, 'h'))}</p>`,
      notas: {
        decir: 'Cada letra es una cantidad con nombre. Despejar t es reescribir la fórmula para que la t quede sola a un lado. Y siempre puedes comprobar tu despeje con números fáciles.',
        preguntar: 'Si recorres 100 km a 50 km/h, ¿cuánto tardas?',
        esperar: '2 horas.',
        ojo: 'El truco de comprobar con números fáciles sirve en todo el examen, sobre todo en las preguntas con opciones.'
      }
    },
    {
      titulo: 'Tu turno: la balanza',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('balanza')}</div>
        <h2>Tu turno: la balanza</h2>
        <ul class="d-lista">
          <li>Abre <b>Despejes</b> y haz los retos 1 a 6.</li>
          <li>Antes de cada clic, di qué operación vas a aplicar y por qué.</li>
          <li>Si te trabas, pregúntate: «¿qué le están haciendo a mi variable?».</li>
        </ul>`,
      notas: {
        decir: 'Ahora te toca a ti. Comparte tu pantalla y haz los retos. Antes de cada clic, dime qué operación vas a aplicar.',
        ojo: 'No le digas la operación. Si se traba, pregúntale qué le están haciendo a su variable. El botón «Pista» es el último recurso.'
      }
    },
    // ---------------- Parte 2 ----------------
    {
      titulo: 'Número con unidad',
      html: `
        <h2>Una cantidad es un número con unidad</h2>
        <div class="d-cantidad">
          <div><span class="d-cant-num">72</span><small>número</small></div>
          <div><span class="d-cant-un">km/h</span><small>unidad</small></div>
        </div>
        <p>«72» solo no dice nada: ¿72 qué?</p>
        <p class="d-destacado">Convertir es cambiar la unidad <b>sin cambiar la cantidad</b>: ${q(1, 'km')} y ${q(1000, 'm')} son la misma distancia.</p>`,
      notas: {
        decir: 'La unidad es como el apellido del número: sin ella, el número no dice nada. Convertir es cambiarle el apellido sin cambiar lo que mide.',
        preguntar: '¿Es lo mismo caminar 1 km que caminar 1000 m?',
        esperar: 'Sí, es la misma distancia.'
      }
    },
    {
      titulo: 'Los prefijos',
      html: `
        <h2>Los prefijos dicen cuántas veces</h2>
        <div class="d-tabla-envoltura">
          <table class="d-tabla">
            <thead><tr><th scope="col">Prefijo</th><th scope="col">Significa</th><th scope="col">Ejemplos</th></tr></thead>
            <tbody>
              <tr><td><b>kilo</b> (k)</td><td>mil veces la unidad (× 1000)</td><td>1 km = 1000 m · 1 kg = 1000 g</td></tr>
              <tr class="d-fila-base"><td>unidad</td><td>metro, gramo, litro</td><td>m · g · L</td></tr>
              <tr><td><b>centi</b> (c)</td><td>la centésima parte (÷ 100)</td><td>1 m = 100 cm</td></tr>
              <tr><td><b>mili</b> (m)</td><td>la milésima parte (÷ 1000)</td><td>1 m = 1000 mm · 1 L = 1000 mL</td></tr>
            </tbody>
          </table>
        </div>
        <p class="d-destacado">Unidad más pequeña → número más grande: en ${q(1, 'm')} caben ${q(100, 'cm')}.</p>`,
      notas: {
        decir: 'Kilo significa mil: un kilómetro son mil metros. Centi y mili son pedacitos: un centímetro es la centésima parte de un metro. Por eso en un metro caben 100 centímetros.',
        preguntar: '¿Cuántos gramos tiene medio kilo? ¿Cuántos mililitros tiene una botella de 1,5 L?',
        esperar: '500 g y 1500 mL.',
        ojo: 'La confusión típica es creer que «centi» significa 100. Centi es la parte: 1 cm es 1/100 de metro. Lo que vale 100 es la cantidad de centímetros que caben en un metro.'
      }
    },
    {
      titulo: 'El tiempo',
      html: `
        <h2>El tiempo no es decimal</h2>
        <div class="d-equivalencias">
          <span class="mt">${qn(1, 'h')} ${igual} ${qn(60, 'min')}</span>
          <span class="mt">${qn(1, 'min')} ${igual} ${qn(60, 's')}</span>
          <span class="mt">${qn(1, 'h')} ${igual} ${qn(3600, 's')}</span>
        </div>
        <p class="d-destacado d-ojo">${q(2.5, 'h')} son 2 h y media, es decir, <b>2 h 30 min</b>, no 2 h 50 min.</p>
        <p class="d-nota">La barra de una unidad se lee «por cada»: 90 km/h son 90 km por cada hora.</p>`,
      notas: {
        decir: 'Con el tiempo no se corre la coma: una hora tiene 60 minutos, no 100. Por eso 2,5 horas son 2 horas y media.',
        preguntar: '¿Cuántos minutos son 1,5 h? ¿Y cuántos segundos tiene una hora?',
        esperar: '90 min y 3600 s, porque 60 · 60 = 3600.',
        ojo: 'Error típico: 2,5 h = 250 min.'
      }
    },
    {
      titulo: 'El 1 disfrazado',
      html: `
        <h2>Una equivalencia es un 1 disfrazado</h2>
        <div class="d-pasos d-pasos-grandes">
          ${mt(qn(1, 'km'), igual, qn(1000, 'm'))}
          <span class="d-flecha">entonces</span>
          ${mt(fr(qn(1000, 'm'), qn(1, 'km')), igual, n(1), igual, fr(qn(1, 'km'), qn(1000, 'm')))}
        </div>
        <p class="d-destacado">Multiplicar por 1 no cambia la cantidad. <b>Solo cambia la unidad.</b></p>`,
      notas: {
        decir: 'Si arriba y abajo hay lo mismo, la fracción vale 1, como 5 / 5. Y multiplicar por 1 no cambia nada. Ese es todo el truco.',
        preguntar: '¿Cuánto vale 1000 m dividido entre 1 km?',
        esperar: '1, porque arriba y abajo hay la misma distancia.'
      }
    },
    {
      titulo: 'La regla de oro',
      html: `
        <h2>La unidad que quieres eliminar va en el piso contrario</h2>
        <div class="mt mt-bloque d-formula">
          ${n(2.5)} ${tach(un('km'))} ${por} ${fr(qn(1000, 'm'), `${n(1)} ${tach(un('km'))}`)} ${igual} ${q(2500, 'm')}
        </div>
        <p>Los km están arriba, así que en el factor van abajo: se tachan como en una fracción.</p>
        <p class="d-destacado d-ojo">Si la pones en el mismo piso, se duplica (km²): las unidades te avisan que te equivocaste.</p>`,
      notas: {
        decir: 'Si los km están arriba, en el factor los pongo abajo para que se tachen, igual que en una fracción se cancela lo que está arriba y abajo.',
        preguntar: 'Si quiero pasar 3 h a minutos, ¿cómo acomodo el factor?',
        esperar: '60 min arriba y 1 h abajo: 3 · 60 = 180 min.',
        ojo: 'No hace falta resolver km/h a m/s aquí: eso lo descubre en la mesa de conversión (reto 3).'
      }
    },
    {
      titulo: 'Tu turno: la mesa',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('regla')}</div>
        <h2>Tu turno: la mesa de conversión</h2>
        <ul class="d-lista">
          <li>Abre <b>Conversión de unidades</b> y haz los retos 1 a 7.</li>
          <li>Antes de cada factor, di qué unidad quieres eliminar y en qué piso está.</li>
          <li>Tienes la ficha de equivalencias en «Ideas clave».</li>
        </ul>`,
      notas: {
        decir: 'Tu turno. En cada reto empieza por la unidad que quieres eliminar.',
        ojo: 'Cuando termine el reto 3 (72 km/h a m/s), muéstrale de dónde sale el 3,6: 3600 / 1000.'
      }
    }
  ];

  const PARTES = [
    { id: 'p1', nombre: 'Parte 1 · el igual es una balanza', corto: 'Parte 1 · el igual es una balanza', desde: 0, hasta: 5, minutos: '5 min' },
    { id: 'p2', nombre: 'Parte 2 · unidades y prefijos', corto: 'Parte 2 · unidades y prefijos', desde: 6, hasta: 11, minutos: '6 min' }
  ];

  /* ---------- Ficha de equivalencias ---------- */
  const FICHA = [
    ['Longitud', ['1 km = 1000 m', '1 m = 100 cm', '1 m = 1000 mm', '1 cm = 10 mm']],
    ['Masa', ['1 kg = 1000 g']],
    ['Volumen', ['1 L = 1000 mL', '1 mL = 1 cm³', '1 m³ = 1000 L']],
    ['Tiempo', ['1 h = 60 min', '1 min = 60 s', '1 h = 3600 s']],
    ['Área', ['1 m² = 10 000 cm²', '1 km² = 1 000 000 m²']],
    ['Velocidad', ['km/h → m/s: ÷ 3,6', 'm/s → km/h: × 3,6']]
  ];
  function fichaHtml() {
    return `
      <div class="ficha">
        <div class="ficha-prefijos">
          <h4>Prefijos</h4>
          <dl>
            <div><dt>kilo (k)</dt><dd>mil veces la unidad · × 1000</dd></div>
            <div><dt>centi (c)</dt><dd>la centésima parte · ÷ 100</dd></div>
            <div><dt>mili (m)</dt><dd>la milésima parte · ÷ 1000</dd></div>
          </dl>
        </div>
        <div class="ficha-grupos">
          ${FICHA.map(([titulo, filas]) => `
            <div class="ficha-grupo">
              <h4>${titulo}</h4>
              <ul>${filas.map(f => `<li>${f}</li>`).join('')}</ul>
            </div>`).join('')}
        </div>
      </div>`;
  }

  /* ---------- Guía del tutor (#guia) ---------- */
  const GUIA = {
    antes: [
      'Envíale el enlace de la plataforma y pídele que la abra en el computador.',
      'Que tenga papel, lápiz y nada de calculadora: así es el examen.',
      'En las ideas clave compartes tú la pantalla. En la balanza, la mesa y la práctica la comparte él y hace los clics: se aprende haciendo, no mirando.',
      'Ten esta guía abierta en tu celular o en otra ventana. Si compartes la pantalla con las notas visibles, él también las verá.'
    ],
    objetivos: [
      'Despejar una variable en fórmulas como d = v · t o vf = v₀ + a · t, y explicar por qué se divide o se resta en los dos lados.',
      'Convertir unidades con factores, incluido km/h ↔ m/s, eligiendo bien la orientación de cada factor.'
    ],
    minimo: [
      ['El igual es una balanza', 'Los dos lados valen lo mismo; lo que se le hace a uno, se le hace al otro.'],
      ['Cada operación tiene su contraria', 'Suma ↔ resta, multiplicación ↔ división. Despejar es deshacer.'],
      ['Una cantidad es un número con unidad', 'Convertir cambia la unidad, nunca la cantidad.'],
      ['Los prefijos y el tiempo', 'Kilo = mil veces; centi = centésima parte; mili = milésima parte. El tiempo va de 60 en 60.'],
      ['Una equivalencia es un 1', 'Una fracción como 1000 m / 1 km vale 1; multiplicar por ella no cambia la cantidad.']
    ],
    bloques: [
      {
        tiempo: '0–6 min', titulo: 'Ideas clave, parte 1', quien: 'Tú compartes pantalla', ruta: '#m1-ideas-p1', boton: 'Abrir la parte 1',
        pasos: ['Abre «Ideas clave», elige la parte 1 y pulsa «Presentar».', 'Pasa las diapositivas 1 a 6. En cada una, haz la pregunta y espera su respuesta antes de avanzar.'],
        diapositivas: 'p1'
      },
      {
        tiempo: '6–26 min', titulo: 'Balanza, retos 1 a 6', quien: 'Él comparte pantalla', ruta: '#m1-despejes', boton: 'Abrir la balanza',
        pasos: [
          'En el reto 1, deja que aplique la operación en un solo plato. Cuando la balanza se incline, pregúntale por qué pasó y cómo lo arregla.',
          'Al terminar cada reto, que lea en voz alta la bitácora de pasos: así se escribe el despeje en el examen.',
          'Si se traba, pregúntale qué le están haciendo a su variable. El botón «Pista» es el último recurso.'
        ],
        preguntas: [
          ['Reto 1: ¿qué le están haciendo a la t?', 'La multiplican por v; entonces divide entre v en los dos lados.'],
          ['Reto 4: ¿cuál es la contraria de dividir?', 'Multiplicar: × t en los dos lados.'],
          ['Reto 6: ¿qué quitas primero, lo que suma o lo que multiplica?', 'Lo que suma: primero − v₀ y después ÷ a.'],
          ['Al final: ¿qué significa en realidad «lo que multiplica pasa a dividir»?', 'Que divides los dos lados entre lo mismo.']
        ],
        ojo: [
          'En el reto 6, si quiere dividir entre a antes de restar, déjalo: verá que la a no se cancela porque no multiplica a todo el lado. Después, que use «Deshacer».',
          'Los valores de prueba sirven para convencerlo: con cualquier número, mientras haga lo mismo en los dos platos, la balanza sigue en equilibrio.'
        ]
      },
      {
        tiempo: '26–32 min', titulo: 'Ideas clave, parte 2', quien: 'Tú compartes pantalla', ruta: '#m1-ideas-p2', boton: 'Abrir la parte 2',
        pasos: ['Vuelve a «Ideas clave», elige la parte 2 y presenta las diapositivas 7 a 12.', 'Si quieres, deja a la vista la ficha de equivalencias que está debajo de las diapositivas.'],
        diapositivas: 'p2'
      },
      {
        tiempo: '32–52 min', titulo: 'Mesa de conversión, retos 1 a 7', quien: 'Él comparte pantalla', ruta: '#m1-conversion', boton: 'Abrir la mesa',
        pasos: [
          'Antes de cada factor, que diga qué unidad quiere eliminar y en qué piso está.',
          'Si pone un factor al revés, no lo corrijas: la mesa lo marca en ámbar. Pregúntale qué pasó con las unidades.',
          'Después del reto 3 (72 km/h a m/s), muéstrale de dónde sale el 3,6: 3600 / 1000 = 3,6.',
          'En el reto 5 (cm² a m²), deja que caiga en la trampa: la mesa le mostrará que todavía queda un cm.'
        ],
        preguntas: [
          ['¿Por qué 1000 m / 1 km vale 1?', 'Porque arriba y abajo hay la misma distancia.'],
          ['¿Por qué de km/h a m/s el número se hace más pequeño?', 'Porque 1 m/s es más rápido que 1 km/h (equivale a 3,6 km/h). Con una unidad más grande, el número sale más pequeño.'],
          ['¿Cuántos cm² tiene 1 m²?', '10 000, porque son 100 · 100.']
        ],
        ojo: ['Si quiere usar regla de tres, deja que la compare con el factor en el reto 3: con factores, el procedimiento es siempre el mismo.']
      },
      {
        tiempo: '52–72 min', titulo: 'Práctica, ejercicios 1 a 8', quien: 'Él comparte pantalla y trabaja en papel', ruta: '#m1-practica', boton: 'Abrir la práctica',
        pasos: [
          'Que resuelva primero en papel y te muestre la hoja por la cámara; después escribe el resultado.',
          'Pistas antes que solución. Si comete un error típico, la plataforma se lo explica: pídele que te lo cuente con sus palabras.',
          'En los ejercicios con opciones, que descarte las incorrectas comprobando con números fáciles.'
        ]
      },
      {
        tiempo: '72–80 min', titulo: 'Cierre', quien: 'Los dos', asistente: true, boton: 'Abrir el centro de comando IA',
        pasos: [
          'Haz las tres preguntas de salida sin mirar la plataforma.',
          'Déjale de tarea los ejercicios 9 a 14.',
          'Muéstrale el centro de comando IA: con un ejercicio abierto, copia la plantilla «Estoy trabado» y pégala en ChatGPT o Claude.'
        ],
        preguntas: [
          ['¿Por qué la balanza se inclinó cuando dividiste un solo plato?', 'Porque los dos lados dejaron de valer lo mismo.'],
          ['¿Cuántos centímetros tiene un metro y por qué?', '100, porque un centímetro es la centésima parte del metro.'],
          ['¿En qué piso pones la unidad que quieres eliminar?', 'En el contrario al que está.']
        ]
      }
    ],
    ajustes: [
      ['Si te falta tiempo', 'Deja el reto 7 de conversión y los ejercicios 7 y 8 para la tarea.'],
      ['Si te sobra tiempo', 'Usa el modo libre de la balanza: que despeje la m de F = m · a y la a de vf = v₀ + a · t.']
    ]
  };

  const notasHtml = d => {
    const N = d.notas || {};
    const fila = (etq, txt, clase = '') => (txt ? `<div class="${clase}"><dt>${etq}</dt><dd>${txt}</dd></div>` : '');
    return `<dl class="notas">${fila('Qué decir', N.decir, 'nt-decir')}${fila('Qué preguntar', N.preguntar)}${fila('Respuesta esperada', N.esperar)}${fila('Ojo', N.ojo, 'nt-ojo')}</dl>`;
  };

  function montarGuia(cont) {
    const v = MA.crear('section', 'vista-guia');
    const hechos = MA.almacen.leer('guia.check', {}) || {};
    v.innerHTML = `
      <header class="guia-cabeza">
        <span class="pildora pildora-ambar">${icono('info')}Para quien da la clase</span>
        <h1>Guía de la clase 1</h1>
        <p class="entrada">Unos 80 minutos por videollamada. La teoría va en dos bloques cortos, cada uno justo antes de la herramienta donde se usa. Así no se satura y cada idea se practica apenas se explica.</p>
      </header>
      <div class="guia-columnas">
        <section class="tarjeta">
          <h2>Antes de la llamada</h2>
          <ul class="guia-check">${GUIA.antes.map((t, i) => `
            <li><label><input type="checkbox" id="guia-check-${i}" data-check="${i}" ${hechos[i] ? 'checked' : ''}><span>${t}</span></label></li>`).join('')}
          </ul>
        </section>
        <section class="tarjeta">
          <h2>Al terminar, tu hermano debe poder</h2>
          <ol class="guia-objetivos">${GUIA.objetivos.map(t => `<li>${t}</li>`).join('')}</ol>
        </section>
      </div>
      <section class="tarjeta guia-minimo">
        <h2>Lo mínimo antes de cualquier ejercicio</h2>
        <p class="texto-2">Son las cinco ideas de las diapositivas. Si alguna no le queda clara, vuelve a ella antes de seguir.</p>
        <ol>${GUIA.minimo.map(([t, d]) => `<li><b>${t}.</b> ${d}</li>`).join('')}</ol>
      </section>
      <h2 class="guia-titulo-linea">Paso a paso</h2>
      <ol class="guia-linea">
        ${GUIA.bloques.map(b => `
          <li class="guia-bloque">
            <div class="guia-tiempo mono">${b.tiempo}</div>
            <div class="tarjeta guia-cuerpo">
              <div class="guia-bloque-cabeza">
                <h3>${b.titulo}</h3>
                <span class="pildora">${b.quien}</span>
              </div>
              <ul class="guia-pasos">${b.pasos.map(p => `<li>${p}</li>`).join('')}</ul>
              ${b.diapositivas ? diapositivasDe(b.diapositivas) : ''}
              ${b.preguntas ? `<div class="guia-preguntas"><h4>Preguntas</h4><dl>${b.preguntas.map(([p, r]) => `<div><dt>${p}</dt><dd>${r}</dd></div>`).join('')}</dl></div>` : ''}
              ${b.ojo ? `<div class="guia-ojo"><h4>${icono('alerta')}Ojo</h4><ul>${b.ojo.map(o => `<li>${o}</li>`).join('')}</ul></div>` : ''}
              <div class="fila-botones guia-boton">
                ${b.asistente ? `<button type="button" class="btn btn-secundario btn-chico" data-abrir-asistente>${icono('chat')}${b.boton}</button>` : `<a class="btn btn-secundario btn-chico" href="${b.ruta}">${b.boton}${icono('flechaD')}</a>`}
              </div>
            </div>
          </li>`).join('')}
      </ol>
      <section class="tarjeta guia-ajustes">
        ${GUIA.ajustes.map(([t, d]) => `<div><h3>${t}</h3><p>${d}</p></div>`).join('')}
      </section>`;
    v.addEventListener('change', e => {
      const c = e.target.closest('[data-check]');
      if (!c) return;
      hechos[c.dataset.check] = c.checked;
      MA.almacen.guardar('guia.check', hechos);
    });
    cont.appendChild(v);
    return v;
  }
  function diapositivasDe(parteId) {
    const p = PARTES.find(x => x.id === parteId);
    const lista = DIAPOSITIVAS.slice(p.desde, p.hasta + 1);
    return `
      <details class="guia-diapos">
        <summary>${icono('chevD', 'chev')}Notas de las diapositivas ${p.desde + 1} a ${p.hasta + 1}</summary>
        <ol start="${p.desde + 1}">${lista.map(d => `<li><h4>${d.titulo}</h4>${notasHtml(d)}</li>`).join('')}</ol>
      </details>`;
  }

  MA.Clase1 = { DIAPOSITIVAS, PARTES, GUIA, fichaHtml, notasHtml, montarGuia };
})();
