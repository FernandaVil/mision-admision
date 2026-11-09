/* =====================================================================
   Clase 7 · ideas clave (diapositivas del módulo 6)
   ---------------------------------------------------------------------
   Cuatro bloques cortos:
     parte 1 (diapositivas 1-5)    -> recordar la clase 6: tres diagramas
                                      de cabeza, una regla con dos casos y
                                      la velocidad, que no es una fuerza
     parte 2 (diapositivas 6-12)   -> caída libre, antes de los retos 1 y 2
     parte 3 (diapositivas 13-17)  -> las cuentas, antes de los retos 3 y 4
     parte 4 (diapositivas 18-21)  -> tiro parabólico, antes de los retos 5 y 6
   La parte 1 recupera antes de explicar: primero dibuja de cabeza y
   después compara. En la clase 6 entendía en el momento y se le olvidaba
   después, y le costó que una pelota lanzada no lleva la fuerza de la
   mano. Por eso la caída libre empieza con «¿quién la toca ahora?».
   Los ejemplos de aquí no se repiten en la torre ni en la práctica: si
   ya los vio, respondería de memoria.
   Las diapositivas le hablan de usted al estudiante.
   Respuestas tapadas: lo que se pregunta en clase no se ve hasta
   revelarlo (MA.f.oculto, con «Revelar» o con la flecha).
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { icono } = MA;
  const { n, op, fr, mt, q, tach, pega, oculto, ocultoBloque } = MA.f;
  const { pot } = MA.M2;
  const C = MA.M6;
  const { L, SF } = C;
  const por = op('·'), igual = op('='), mas = op('+'), menos = op('−'), flecha = op('→');
  const t2 = pot(L.t, 2);

  const figura = (svg, clase = '') => `<div class="d-svg m5-d-fig ${clase}">${svg}</div>`;

  const DIAPOSITIVAS = [
    // ---------------- Parte 1 · recordar ----------------
    {
      titulo: 'Portada',
      html: `
        <div class="d-portada">
          <p class="d-kicker">Módulo 6 · clase 7</p>
          <h2>Física mecánica III: caída libre y tiro</h2>
          <p class="d-sub">En este módulo va a poder:</p>
          <ul class="d-lista">
            <li>Decir qué fuerzas actúan sobre algo que vuela.</li>
            <li>Calcular cuánto sube lo que se lanza y cuánto tarda en caer lo que se suelta.</li>
            <li>Resolver un lanzamiento de lado, cada eje por su lado.</li>
          </ul>
        </div>`
    },
    {
      titulo: 'Tres diagramas de cabeza',
      html: `
        <h2>Antes de empezar: tres diagramas de cabeza</h2>
        <p>En el papel, sin mirar nada de la clase pasada. Solo las flechas, con el nombre de cada una.</p>
        <div class="m5-apuestas">
          <div class="d-tarjeta"><span class="d-num">1</span>Una maleta quieta en el piso del aeropuerto.</div>
          <div class="d-tarjeta"><span class="d-num">2</span>Una moneda que se lanzó hacia arriba, mientras sube.</div>
          <div class="d-tarjeta"><span class="d-num">3</span>Un trineo que baja solo por una ladera con nieve. La nieve tiene fricción.</div>
        </div>
        <p class="d-nota">La pregunta de siempre: ¿quién lo toca?</p>`
    },
    {
      titulo: 'Compare con su papel',
      html: `
        <h2>Compare con su papel</h2>
        <div class="m6-tres">
          <figure>${figura(C.recuerdo('maleta', 1))}<figcaption>¿Quién la toca? ${oculto('El piso', 1)}</figcaption></figure>
          <figure>${figura(C.recuerdo('moneda', 2))}<figcaption>¿Quién la toca? ${oculto('Nadie: solo el peso', 2)}</figcaption></figure>
          <figure>${figura(C.recuerdo('trineo', 3))}<figcaption>¿Quién lo toca? ${oculto('La ladera: normal y fricción', 3)}</figcaption></figure>
        </div>
        ${ocultoBloque('<p class="d-destacado">La normal sale perpendicular a la superficie. Y la moneda no lleva una flecha hacia arriba: la mano ya la soltó.</p>', 4)}`
    },
    {
      titulo: 'Una regla, dos casos',
      html: `
        <h2>Una sola regla, con dos casos</h2>
        <div class="d-tabla-envoltura">
          <table class="d-tabla m5-d-tabla">
            <thead><tr><th scope="col">Si las flechas…</th><th scope="col">El cuerpo…</th></tr></thead>
            <tbody>
              <tr><td>se anulan: ${mt(SF, igual, n(0))}</td><td>${oculto('sigue como venía: quieto o con velocidad constante')}</td></tr>
              <tr><td>no se anulan</td><td>${oculto(`acelera hacia donde apunta la que sobra: ${mt(L.a, igual, fr(SF, L.m))}`, 2)}</td></tr>
            </tbody>
          </table>
        </div>
        ${ocultoBloque(`<p class="d-destacado">La primera ley es la segunda con ${mt(SF, igual, n(0))}. No son dos reglas: es una, con dos casos.</p>`, 3)}
        <p class="d-nota">Cuando un libro dice «si no se le aplican fuerzas», quiere decir «si las flechas se anulan»: puede haber flechas, siempre que empaten.</p>`
    },
    {
      titulo: 'La velocidad no es una fuerza',
      html: `
        <h2>La velocidad no es una fuerza</h2>
        <div class="d-dos">
          ${figura(C.recuerdo('moneda'), 'm6-d-moneda')}
          <div>
            <p><b>La velocidad es lo que trae; la fuerza es lo que se la cambia.</b></p>
            <p>Si la moneda llevara una fuerza hacia arriba, más grande que el peso, ¿qué haría? ${oculto('Subiría cada vez más rápido')}</p>
            <p>¿Y qué hace? ${oculto('Frena: solo la jala el peso', 2)}</p>
          </div>
        </div>
        ${ocultoBloque('<p class="d-destacado">¿Quién la toca <b>ahora</b>? En la foto de este instante, la mano ya no está.</p>', 3)}`
    },
    // ---------------- Parte 2 · caída libre ----------------
    {
      titulo: 'Tres apuestas',
      html: `
        <h2>Tres apuestas</h2>
        <p>Escríbalas en el papel. Todavía no se corrigen: vuelven al final de la clase.</p>
        <div class="m5-apuestas">
          <div class="d-tarjeta"><span class="d-num">Apuesta 1</span>Un melón se lanza hacia arriba. En el punto más alto, ¿cuánto vale su velocidad? ¿Y su aceleración?</div>
          <div class="d-tarjeta"><span class="d-num">Apuesta 2</span>Desde la misma altura se sueltan una bola de bolos y una pelota de tenis. Sin aire, ¿cuál llega primero al piso?</div>
          <div class="d-tarjeta"><span class="d-num">Apuesta 3</span>Un avión vuela en horizontal y suelta un paquete. Sin aire, cuando el paquete toca el piso, ¿el avión va adelante, atrás o justo encima?</div>
        </div>`
    },
    {
      titulo: 'Caída libre: solo el peso',
      html: `
        <h2>Caída libre: solo el peso</h2>
        <div class="d-dos">
          ${figura(C.fotos(2, 3), 'm6-d-fotos')}
          <div>
            <p>El empleado lanza un melón hacia arriba. Ya en el aire, ¿quién lo toca? ${oculto('Nadie: solo el peso')}</p>
            ${ocultoBloque(`<p class="d-destacado">Subiendo, arriba y bajando, la misma fuerza: el peso. Por eso la aceleración es la misma todo el tiempo: ${mt(L.a, igual, q('−10', 'm/s²'))}, con arriba positivo.</p>`, 4)}
          </div>
        </div>`
    },
    {
      titulo: 'La gravedad le quita 10 m/s',
      html: `
        <h2>La gravedad le quita 10 m/s en cada segundo</h2>
        <p>Una piedra se lanza hacia arriba a ${q(20, 'm/s')}. Arriba es positivo.</p>
        <div class="d-tabla-envoltura">
          <table class="d-tabla m6-d-serie">
            <thead><tr><th scope="row">${L.t} (s)</th><th scope="col">0</th><th scope="col">1</th><th scope="col">2</th><th scope="col">3</th><th scope="col">4</th></tr></thead>
            <tbody><tr><th scope="row">${L.v} (m/s)</th><td>${n(20)}</td><td>${oculto(n(10))}</td><td>${oculto(n(0), 2)}</td><td>${oculto(n(-10), 3)}</td><td>${oculto(n(-20), 4)}</td></tr></tbody>
          </table>
        </div>
        ${ocultoBloque('<p class="d-destacado">En lo más alto la velocidad es 0, pero la aceleración sigue en −10: si fuera 0, la piedra se quedaría flotando. El signo menos de la velocidad solo dice que va bajando.</p>', 5)}`
    },
    {
      titulo: 'Las fórmulas ya las tiene',
      html: `
        <h2>Las fórmulas ya las tiene: son las del módulo 4</h2>
        <div class="d-pasos m6-d-formulas">
          <span>${mt(L.vf, igual, L.v0, mas, L.a, por, L.t)}</span>${flecha}<span>${oculto(mt(L.vf, igual, L.v0, menos, n(10), por, L.t))}</span>
          <span>${mt(L.d, igual, L.v0, por, L.t, mas, fr(n(1), n(2)), por, L.a, por, t2)}</span>${flecha}<span>${oculto(mt(L.h, igual, L.v0, por, L.t, menos, n(5), por, t2), 2)}</span>
        </div>
        <p>Solo cambia la ${L.a}: en caída libre vale −10. Y en lugar de ${L.d} se escribe ${L.h}, la altura.</p>
        <p>La piedra del módulo 3 seguía ${mt(L.h, igual, pega(n(20), L.t), menos, pega(n(5), t2))}. ¿Con qué velocidad se lanzó? ${oculto(q(20, 'm/s'), 3)}</p>`
    },
    {
      titulo: 'La gráfica de velocidad',
      html: `
        <h2>La gráfica de velocidad cruza el cero</h2>
        <div class="d-dos">
          ${figura(C.grafica({ puntos: [[0, 20], [4, -20]], minY: -24, maxY: 24, maxX: 4.3, marcasX: [1, 2, 3, 4], marcasY: [20, -20], paso: 1, etiqueta: 'Gráfica de velocidad contra tiempo de la piedra: una recta que baja de 20 m/s a −20 m/s en 4 s y cruza el cero a los 2 s' }))}
          <div>
            <p>¿Dónde está lo más alto? ${oculto('Donde la línea cruza el cero: a los 2 s', 2)}</p>
            <p>¿Cuánto vale la pendiente? ${oculto('−10 en todo el recorrido: es la aceleración', 3)}</p>
          </div>
        </div>
        <p class="d-nota">Es una recta de principio a fin: la gravedad le quita lo mismo en cada segundo, también arriba.</p>`
    },
    {
      titulo: 'La masa no importa',
      html: `
        <h2>La masa no importa</h2>
        <div class="d-pasos d-pasos-grandes">${mt(L.a, igual, fr(L.P, L.m), igual, fr(`${tach(L.m)} ${por} ${L.g}`, tach(L.m)), igual, L.g)}</div>
        <p>La bola de bolos pesa más, pero también cuesta más acelerarla. ¿Cuál llega primero? ${oculto('Llegan al tiempo')}</p>
        <p>Es la carrera del melón y la sandía, con la rampa vertical.</p>
        ${ocultoBloque('<p class="d-destacado d-ojo">Con aire, una hoja cae despacio. Por eso el examen dice «sin resistencia del aire» o «en el vacío».</p>', 2)}`
    },
    {
      titulo: 'Su turno: la torre',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('torre')}</div>
        <h2>Su turno: la torre de lanzamiento</h2>
        <ul class="d-lista">
          <li>Abra <b>La torre</b>: retos 1 y 2. Antes de lanzar, en el papel, la velocidad de cada segundo.</li>
          <li>Mire las dos flechas: ¿cuál cambia y cuál no?</li>
        </ul>`
    },
    // ---------------- Parte 3 · las cuentas ----------------
    {
      titulo: 'El tiempo de subida',
      html: `
        <h2>¿Cuánto tarda en llegar arriba?</h2>
        <p>La piedra de ${q(20, 'm/s')}. En lo más alto, ¿cuánto vale su velocidad? ${oculto(n(0))}</p>
        <div class="d-pasos">${mt(n(0), igual, n(20), menos, n(10), por, L.t)}</div>
        <div class="d-pasos">${oculto(mt(n(10), por, L.t, igual, n(20)), 2)}</div>
        <div class="d-pasos">${oculto(mt(L.t, igual, fr(n(20), n(10)), igual, q(2, 's')), 3)}</div>
        ${ocultoBloque('<p class="d-destacado">Tiempo de subida = velocidad del lanzamiento ÷ 10. Es un despeje: la t está multiplicada por 10, así que se divide.</p>', 4)}`
    },
    {
      titulo: 'La altura máxima',
      html: `
        <h2>¿Hasta dónde sube? Con la velocidad promedio</h2>
        <p>Sube durante 2 s, de 20 m/s a 0. ¿Cuál es su velocidad promedio? ${oculto(q(10, 'm/s'))}</p>
        <div class="d-pasos">${oculto(mt(L.h, igual, n(10), por, n(2), igual, q(20, 'm')), 2)}</div>
        <p>Con la fórmula da lo mismo: ${oculto(mt(n(20), por, n(2), menos, n(5), por, pot(n(2), 2), igual, n(40), menos, n(20), igual, q(20, 'm')), 3)}</p>
        <p class="d-nota">Como en el módulo 4: con aceleración, la distancia sale de la velocidad promedio. Hacer 20 · 2 = 40 m sería suponer que no frena.</p>`
    },
    {
      titulo: 'Bajar es subir al revés',
      html: `
        <h2>Bajar es subir al revés</h2>
        <ul class="d-lista">
          <li>Si sube en 2 s, ¿cuánto tarda en bajar? ${oculto('2 s: vuelve a la mano a los 4 s')}</li>
          <li>¿Con qué velocidad vuelve a la mano? ${oculto('A 20 m/s hacia abajo: −20 m/s', 2)}</li>
        </ul>
        ${ocultoBloque(`<p class="d-destacado">En el módulo 3, las raíces de ${mt(L.h, igual, pega(n(20), L.t), menos, pega(n(5), t2))} eran 0 y 4: los dos momentos en que la piedra está en la mano.</p>`, 3)}`
    },
    {
      titulo: 'Soltar desde arriba',
      html: `
        <h2>Soltar desde arriba</h2>
        <p>Si se suelta, arranca con velocidad 0 y todo va hacia abajo: no hacen falta signos.</p>
        <div class="d-tabla-envoltura">
          <table class="d-tabla m6-d-serie">
            <thead><tr><th scope="row">${L.t} (s)</th><th scope="col">1</th><th scope="col">2</th><th scope="col">3</th></tr></thead>
            <tbody>
              <tr><th scope="row">Rapidez (m/s)</th><td>${n(10)}</td><td>${oculto(n(20))}</td><td>${oculto(n(30))}</td></tr>
              <tr><th scope="row">Ha caído (m)</th><td>${n(5)}</td><td>${oculto(n(20), 2)}</td><td>${oculto(n(45), 2)}</td></tr>
            </tbody>
          </table>
        </div>
        <div class="d-pasos m5-d-fila">${oculto(mt(L.v, igual, n(10), por, L.t), 3)} ${oculto(mt(L.d, igual, n(5), por, t2), 3)}</div>
        ${ocultoBloque('<p class="d-destacado d-ojo">Con la calculadora, primero el cuadrado: 5 · 3² = 5 · 9 = 45, no (5 · 3)² = 225.</p>', 4)}`
    },
    {
      titulo: 'Su turno: en el papel',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('hoja')}</div>
        <h2>Su turno: en el papel</h2>
        <ul class="d-lista">
          <li>Sin la torre: el reto 3. Una pelota se lanza hacia arriba a 40 m/s. ¿Cuánto tarda en llegar arriba y hasta qué altura sube?</li>
          <li>Un renglón por paso. Después lo compara en la torre.</li>
          <li>Después de la pausa: el reto 4, soltar desde la torre.</li>
        </ul>`
    },
    // ---------------- Parte 4 · tiro parabólico ----------------
    {
      titulo: 'Cada eje por su lado',
      html: `
        <h2>Lanzar de lado: cada eje por su lado</h2>
        <div class="d-dos">
          ${figura(C.componentes(1, 2))}
          <div>
            <p>En lo horizontal, ¿quién la empuja? ${oculto('Nadie: sigue como venía')}</p>
            <p>En lo vertical, ¿quién la jala? ${oculto('El peso: es caída libre', 2)}</p>
            ${ocultoBloque(`<p class="d-destacado">Horizontal: ${mt(L.d, igual, L.v, por, L.t)}. Vertical: ${mt(L.d, igual, n(5), por, t2)}. El mismo tiempo para los dos.</p>`, 3)}
          </div>
        </div>`
    },
    {
      titulo: 'El paquete y el avión',
      html: `
        <h2>La tercera apuesta: el paquete y el avión</h2>
        ${figura(C.avionPaquete(1), 'm6-d-ancha')}
        <p>Cuando el paquete toca el piso, ¿dónde está el avión? ${oculto('Justo encima', 2)}</p>
        ${ocultoBloque('<p class="d-destacado">Al soltarlo, el paquete sigue avanzando con la velocidad del avión: en lo horizontal nadie lo frena. Sin aire, cae siempre debajo del avión.</p>', 3)}`
    },
    {
      titulo: 'Modelo: la canica',
      html: `
        <h2>Una canica sale rodando de la mesa</h2>
        <div class="d-dos">
          ${figura(C.canica())}
          <div>
            <p>¿Qué se calcula primero? ${oculto('El tiempo, con el eje vertical')}</p>
            <div class="d-pasos">${oculto(mt(n(5), por, t2, igual, n('1,25'), flecha, t2, igual, n('0,25'), flecha, L.t, igual, q('0,5', 's')), 2)}</div>
            <div class="d-pasos">${oculto(mt(L.d, igual, n(2), por, n('0,5'), igual, q(1, 'm')), 3)}</div>
          </div>
        </div>
        ${ocultoBloque('<p class="d-destacado">Primero el tiempo, con el eje vertical; después la distancia, con el horizontal. El tiempo hace de puente.</p>', 4)}`
    },
    {
      titulo: 'Su turno: lanzar de lado',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('torre')}</div>
        <h2>Su turno: lanzar de lado</h2>
        <ul class="d-lista">
          <li>En <b>La torre</b>: el reto 5, con su predicción antes de lanzar, y el reto 6.</li>
          <li>Después, las tácticas para el examen y la práctica, con cronómetro.</li>
        </ul>`
    }
  ];

  const PARTES = [
    { id: 'p1', nombre: 'Parte 1 · recordar', corto: 'Parte 1 · recordar la clase 6', desde: 0, hasta: 4, minutos: '13 min' },
    { id: 'p2', nombre: 'Parte 2 · caída libre', corto: 'Parte 2 · caída libre', desde: 5, hasta: 11, minutos: '10 min' },
    { id: 'p3', nombre: 'Parte 3 · las cuentas', corto: 'Parte 3 · las cuentas', desde: 12, hasta: 16, minutos: '8 min' },
    { id: 'p4', nombre: 'Parte 4 · tiro parabólico', corto: 'Parte 4 · tiro parabólico', desde: 17, hasta: 20, minutos: '8 min' }
  ];

  MA.Clase6 = { DIAPOSITIVAS, PARTES };
})();
