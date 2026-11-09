/* =====================================================================
   Solo para el tutor · guion de la clase 7 (módulo 6, caída libre y tiro)
   ---------------------------------------------------------------------
   Lo carga únicamente la página del tutor (tutor-q7m2.html), igual que
   js/tutor.js. Mismo formato de pasos que las clases anteriores.
   La clase 6 llegó hasta la parte 4 (retos 1 a 12 de la mesa y 1 a 3 de
   la rampa): esta clase abre recordando sin mirar y cierra con las
   tácticas y las cinco preguntas del ICFES que no alcanzaron.
   Las preguntas del ICFES se citan solo por número: el repositorio es
   público, así que sus enunciados y figuras no se copian. Se muestran
   desde los cuadernillos en PDF.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;

  MA.GuiaClase7 = {
    id: 'c7',
    nombre: 'Clase 7',
    titulo: 'Guion de la clase 7',
    entrada: 'Unas 2 horas por videollamada, con una pausa en el minuto 50: 8 minutos para recordar sin mirar, 31 de teoría en bloques cortos, 34 de torre y papel, 4 de tácticas y 30 de práctica, revisión y cierre. Quedan 8 minutos de colchón. En cada bloque va la transferencia gradual: tú modelas, él hace con guía y después solo, en papel. Los ejemplos de las diapositivas no se repiten en la torre ni en la práctica.',
    diapositivas: () => MA.Clase6.DIAPOSITIVAS,
    claveCheck: 'guia.check.c7',
    antes: [
      'Hay que publicar el módulo 6 antes de la clase. Confirma que en su plataforma aparece como disponible.',
      'Revisa la tarea: los ejercicios 1 a 6 de la práctica del módulo 5. En el mapa de la práctica se ve cuáles le salieron a la primera.',
      'Que tenga papel, lápiz y la calculadora del examen.',
      'Calentamiento de unos 10 minutos, antes de la llamada: una ronda de «Despejar y reemplazar» (módulo 1, rondas de práctica). Hoy despeja t en 0 = 20 − 10 · t: es justo ese error.',
      'Ten abiertos los dos cuadernillos del ICFES en las páginas de las cinco preguntas que no alcanzaron en la clase 6: 2023, páginas 8 y 10; 2019, páginas 11, 13 y 22.',
      'Prueba antes la torre: el reto 1 (la aceleración queda tapada hasta la última pregunta) y el reto 5 (dos predicciones y después se lanzan las dos pelotas).',
      'Ten a mano un cronómetro: el del celular basta.'
    ],
    objetivos: [
      'Decir qué fuerzas actúan sobre algo en el aire (solo el peso) y explicar por qué una pelota lanzada sigue subiendo sin que nadie la empuje.',
      'Usar una sola regla para la primera y la segunda ley: si las flechas se anulan, sigue como venía; si no, acelera hacia donde apunta la que sobra.',
      'Calcular el tiempo de subida y la altura máxima de algo lanzado hacia arriba, y el tiempo y la rapidez de algo que se suelta.',
      'Leer la gráfica de velocidad de un tiro vertical: una recta que cruza el cero en lo más alto.',
      'Resolver un lanzamiento horizontal con cada eje por su lado: primero el tiempo, después la distancia.'
    ],
    enfoque: [
      'Recuperar antes de explicar. En la clase 6 entendía en el momento y se le olvidaba después; lo que fija es sacarlo de la cabeza sin mirar, en días distintos. Por eso la clase abre con tres diagramas en el papel, y antes no le recuerdas nada.',
      'La pregunta de la clase es «¿quién la toca ahora?». La palabra «ahora» importa: se mira la foto de ese instante. La mano tocó la pelota antes; en la foto ya no.',
      'La velocidad es lo que trae; la fuerza es lo que se la cambia. Si dice que la pelota sube «por la fuerza del lanzamiento», pregúntale: si llevara una fuerza hacia arriba más grande que el peso, ¿frenaría? Frena, así que la que gana es el peso.',
      'Primera y segunda ley: una sola regla con dos casos. No digas «si no hay fuerzas»: di «si las flechas se anulan». Así se arregla el enredo de la clase 6.',
      'Signos: arriba es positivo y la gravedad resta 10 en cada segundo. Al soltar algo, todo va hacia abajo: ahí trabaja con la rapidez y con lo que ha caído, sin signos. Los negativos solo aparecen en el tiro vertical.',
      'No hay fórmulas nuevas: son las del módulo 4 con a = −10. La altura máxima sale de la velocidad promedio, como en el módulo 4. Nada de v² = v₀² + 2gh.',
      'Sus despejes: el tiempo de subida (0 = 20 − 10 · t) y el tiempo de caída (5 · t² = 125) son justo su error de siempre. Que los escriba en renglones, uno por paso.',
      'La guía se retira: la torre tiene mucha guía, el papel no tiene ninguna y la práctica tipo examen va con calculadora y sin herramienta.',
      'Cuida el reloj: hay 8 minutos de colchón. A los 82 minutos empieza la práctica, pase lo que pase.'
    ],
    minimo: [
      ['Caída libre', 'Ya en el aire, solo actúa el peso, también subiendo. Por eso a = −10 m/s² todo el tiempo, también en lo más alto, donde la velocidad es 0.'],
      ['La velocidad no es una fuerza', 'La velocidad es lo que trae; la fuerza es lo que se la cambia. Para seguir moviéndose no hace falta fuerza: si las flechas se anulan, sigue como venía.'],
      ['Lanzado hacia arriba', 'vf = v₀ − 10 · t. Tiempo de subida: v₀ ÷ 10. Altura máxima: velocidad promedio por tiempo de subida. Bajar es subir al revés.'],
      ['Soltar', 'Rapidez 10 · t y lo que ha caído, 5 · t². Para el tiempo, primero se divide entre 5 y después la raíz. La masa no importa.'],
      ['Lanzar de lado', 'Cada eje por su lado: horizontal con velocidad constante, vertical en caída libre. Primero el tiempo, con el vertical; después la distancia, con el horizontal.']
    ],
    guion: [
      {
        tiempo: '0–8 min', titulo: 'Recordar sin mirar: tres diagramas de cabeza', comparte: 'Tú, con la presentación en pantalla completa', ruta: 'index.html#m6-ideas-p1', boton: 'Abrir la parte 1',
        pasos: [
          { t: 'accion', x: 'Comparte tu pantalla, abre el módulo 6, «Ideas clave», parte 1, y pulsa «Pantalla completa».' },
          { t: 'diapo', n: 1 },
          { t: 'tu', x: 'Hoy vemos qué pasa con lo que vuela: lo que se lanza, lo que se suelta y lo que sale de lado. Pero antes, la clase pasada.' },
          { t: 'diapo', n: 2 },
          { t: 'pregunta', x: 'En el papel y sin mirar nada: las flechas de estas tres situaciones, con su nombre. Me dice cuando termine.', r: 'Dale unos 4 minutos. No le recuerdes nada antes: lo que salga solo es lo que de verdad se le quedó. Mira el papel sin corregir.' },
          { t: 'ojo', x: 'Si se bloquea en una, que pase a la siguiente. Lo que importa es que intente sacarlo de la cabeza: eso es lo que fija.' },
          { t: 'diapo', n: 3 },
          { t: 'pregunta', x: '¿Quién toca la maleta? ¿Y la moneda? ¿Y el trineo?', r: 'Un → por cada una, después de que conteste. Compara con su papel: la normal perpendicular a la ladera (no vertical) y la moneda sin flecha hacia arriba son las dos que más se le olvidan.' },
          { t: 'ojo', x: 'Anota qué falló en el papel. Si dibujó una flecha hacia arriba en la moneda, ese es el punto de toda la clase.' }
        ]
      },
      {
        tiempo: '8–13 min', titulo: 'Una regla con dos casos, y la velocidad no es una fuerza', comparte: 'Tú', ruta: 'index.html#m6-ideas-p1', boton: 'Abrir la parte 1',
        pasos: [
          { t: 'diapo', n: 4 },
          { t: 'pregunta', x: 'Si las flechas se anulan, ¿qué hace el cuerpo? ¿Y si no se anulan?', r: 'Sigue como venía, quieto o con velocidad constante; si no, acelera hacia donde apunta la que sobra. La primera ley es la segunda con ΣF = 0: aquí se arregla el enredo de la clase 6.' },
          { t: 'tu', x: 'Cuando un libro dice «si no se le aplican fuerzas», quiere decir «si las flechas se anulan». Puede tener flechas, siempre que empaten. Es una sola regla, con dos casos.' },
          { t: 'diapo', n: 5 },
          { t: 'pregunta', x: 'Si la mano le hubiera dejado a la moneda una fuerza hacia arriba, más grande que el peso, ¿qué haría? ¿Y qué hace?', r: 'Subiría cada vez más rápido. Pero frena y se devuelve, así que la única fuerza es el peso. Si dice que la fuerza «se va gastando», pregúntale quién la está haciendo en ese instante.' },
          { t: 'tu', x: 'La velocidad es lo que trae. La fuerza es lo que se la cambia. Y para saber si hay una fuerza, se mira la foto de ese instante: ¿quién la toca ahora?' }
        ]
      },
      {
        tiempo: '13–23 min', titulo: 'Modelo: caída libre', comparte: 'Tú', ruta: 'index.html#m6-ideas-p2', boton: 'Abrir la parte 2',
        pasos: [
          { t: 'diapo', n: 6 },
          { t: 'pregunta', x: 'Escriba las tres apuestas en el papel, con su respuesta. No las corrijo todavía.', r: 'Lo normal: velocidad y aceleración 0 arriba, la bola de bolos primero y el avión adelante. No corrijas ni des pistas: vuelven al final.' },
          { t: 'diapo', n: 7 },
          { t: 'pregunta', x: 'Ya en el aire, ¿quién toca el melón?', r: 'Nadie: solo el peso. Revela las flechas: el peso es igual en las tres fotos; la velocidad cambia, y arriba no hay flecha azul.' },
          { t: 'tu', x: 'Caída libre quiere decir «solo el peso», aunque vaya subiendo. Y si la fuerza es la misma todo el tiempo, la aceleración también.' },
          { t: 'diapo', n: 8 },
          { t: 'pregunta', x: 'Se lanzó a 20 m/s. ¿Qué velocidad lleva en cada segundo?', r: '10, 0, −10 y −20, un → por cada uno. Si suma, pregúntale hacia dónde jala el peso: hacia abajo, así que resta.' },
          { t: 'ojo', x: 'Aquí queda resuelta la primera apuesta. Si pregunta por qué −10 y no 0 en lo más alto: si la aceleración fuera 0, la velocidad se quedaría en 0 y la piedra flotaría.' },
          { t: 'diapo', n: 9 },
          { t: 'tu', x: 'No hay fórmulas nuevas: son las del módulo 4, con a = −10. Y en lugar de d, la h de la altura.' },
          { t: 'pregunta', x: 'La piedra del módulo 3 seguía h = 20t − 5t². ¿Con qué velocidad se lanzó?', r: 'A 20 m/s: es esta misma piedra. El −5 es la mitad de −10. La promesa del módulo 3 queda cumplida.' },
          { t: 'diapo', n: 10 },
          { t: 'pregunta', x: '¿Dónde está lo más alto? ¿Cuánto vale la pendiente?', r: 'Donde la línea cruza el cero, a los 2 s; la pendiente es −10 en todo el recorrido. Si señala lo más alto de la línea, recuérdale que esta gráfica es de velocidad, no de altura.' },
          { t: 'diapo', n: 11 },
          { t: 'pregunta', x: 'La bola de bolos pesa más. ¿Cuál llega primero?', r: 'Llegan al tiempo: más peso, pero también más masa que acelerar. Es la carrera de la rampa de la clase 6, con la rampa vertical. Segunda apuesta resuelta.' },
          { t: 'diapo', n: 12 },
          { t: 'tu', x: 'Ahora usted: comparta la pantalla y abra «La torre».' },
          { t: 'accion', x: 'Sal de la pantalla completa (Esc) y deja de compartir.' }
        ]
      },
      {
        tiempo: '23–35 min', titulo: 'Guiado: la torre, retos 1 y 2', comparte: 'Él', ruta: 'index.html#m6-torre', boton: 'Abrir la torre',
        pasos: [
          { t: 'el', x: 'Reto 1: primero las fuerzas; después, en el papel, la velocidad de cada segundo. Al final lanza y mira las dos flechas.' },
          { t: 'pregunta', x: 'Mientras sube, ¿cuál flecha cambia y cuál no?', r: 'La de la velocidad, azul, se achica; la del peso, violeta, no cambia. Esa es la diferencia entre lo que trae y lo que la empuja.' },
          { t: 'ojo', x: 'La aceleración está tapada en el tablero hasta la última pregunta del reto: es la primera apuesta otra vez. Que la diga antes de verla.' },
          { t: 'el', x: 'Reto 2: la bajada. Con arriba positivo, la velocidad de bajada lleva signo menos.' },
          { t: 'pregunta', x: 'Las huellas de la bajada quedan a la misma altura que las de la subida. ¿Por qué?', r: 'Bajar es subir al revés: la gravedad le quita lo mismo en cada segundo. Por eso tarda lo mismo y vuelve con la misma rapidez.' },
          { t: 'accion', x: 'Al terminar el reto 2 aparece «Seguir con las ideas clave, parte 3»: ahí vuelves a compartir tú.' }
        ]
      },
      {
        tiempo: '35–43 min', titulo: 'Modelo: las cuentas', comparte: 'Tú', ruta: 'index.html#m6-ideas-p3', boton: 'Abrir la parte 3',
        pasos: [
          { t: 'accion', x: 'Vuelve a compartir: «Ideas clave», parte 3, en pantalla completa.' },
          { t: 'diapo', n: 13 },
          { t: 'pregunta', x: 'En lo más alto, ¿cuánto vale la velocidad? Entonces, ¿cuánto tarda en llegar?', r: '0. Que haga el despeje en renglones: 0 = 20 − 10 · t, después 10 · t = 20, después t = 2. Con una resta y una multiplicación, primero se pasa lo que resta.' },
          { t: 'diapo', n: 14 },
          { t: 'pregunta', x: 'Sube de 20 m/s a 0. ¿Cuál es su velocidad promedio? ¿Hasta dónde sube?', r: '10 m/s y 20 m. Si dice 40 m (20 · 2), pregúntale si la piedra va a 20 m/s todo el camino.' },
          { t: 'diapo', n: 15 },
          { t: 'pregunta', x: 'Si sube en 2 s, ¿cuánto tarda en bajar? ¿Con qué velocidad vuelve?', r: '2 s, y a 20 m/s hacia abajo: −20. Las raíces del módulo 3, 0 y 4, son los dos momentos en que está en la mano.' },
          { t: 'diapo', n: 16 },
          { t: 'tu', x: 'Si se suelta, no hay subida: todo va hacia abajo. Ahí se trabaja con la rapidez y con lo que ha caído, sin signos.' },
          { t: 'pregunta', x: '¿Qué rapidez lleva y cuánto ha caído en cada segundo?', r: 'Rapidez 10, 20 y 30; ha caído 5, 20 y 45. Que vea que cada segundo cae más que el anterior: 5, 15, 25.' },
          { t: 'ojo', x: 'La trampa de la calculadora: 5 · 3² es 45, no 225. Primero el cuadrado.' },
          { t: 'diapo', n: 17 }
        ]
      },
      {
        tiempo: '43–50 min', titulo: 'Independiente: en papel, reto 3', comparte: 'Él', ruta: 'index.html#m6-torre', boton: 'Abrir la torre',
        pasos: [
          { t: 'tu', x: 'Sin la torre, en el papel: una pelota se lanza hacia arriba a 40 m/s. ¿Cuánto tarda en llegar arriba y hasta qué altura sube? Un renglón por paso, y me dice cuando termine.' },
          { t: 'ojo', x: 'Tú solo miras. Si escribe 40 · 4 = 160, pregúntale si va a 40 m/s todo el camino.' },
          { t: 'el', x: 'Compara en la torre, reto 3: escribe sus tres resultados y lanza para comprobar.' }
        ]
      },
      {
        tiempo: '50–55 min', titulo: 'Pausa', comparte: 'Nadie',
        pasos: [
          { t: 'tu', x: 'Cinco minutos. Lejos de la pantalla.' },
          { t: 'ojo', x: 'Punto de control: si no terminó el reto 3, mira «Si vas atrasado», abajo. Nunca se recorta la práctica.' }
        ]
      },
      {
        tiempo: '55–62 min', titulo: 'Guiado: la torre, reto 4', comparte: 'Él', ruta: 'index.html#m6-torre', boton: 'Abrir la torre',
        pasos: [
          { t: 'el', x: 'Reto 4: soltar desde una torre de 125 m. Primero la predicción, después las cuentas, y al final suelta la pelota.' },
          { t: 'pregunta', x: '5 · t² = 125. ¿Qué se hace primero?', r: 'Dividir entre 5 (t² = 25) y después la raíz (t = 5). Si escribe 25 como respuesta, la torre le dice que es t².' },
          { t: 'pregunta', x: 'Si la pelota tuviera el doble de masa, ¿cuánto tardaría?', r: 'Lo mismo: la masa se cancela. Es la segunda apuesta otra vez, ahora sin ayuda.' },
          { t: 'accion', x: 'Al terminar aparece «Seguir con las ideas clave, parte 4»: ahí compartes tú.' }
        ]
      },
      {
        tiempo: '62–70 min', titulo: 'Modelo: el tiro parabólico', comparte: 'Tú', ruta: 'index.html#m6-ideas-p4', boton: 'Abrir la parte 4',
        pasos: [
          { t: 'accion', x: '«Ideas clave», parte 4, en pantalla completa.' },
          { t: 'diapo', n: 18 },
          { t: 'pregunta', x: 'Lanzada de lado: en lo horizontal, ¿quién la empuja? ¿Y en lo vertical, quién la jala?', r: 'En lo horizontal, nadie: sigue como venía (primera ley). En lo vertical, el peso: caída libre. Un → por cada respuesta: la flecha azul horizontal no cambia y la vertical crece.' },
          { t: 'tu', x: 'Cada eje por su lado: avanza siempre igual y cae como si la soltaran. El tiempo es el mismo para los dos.' },
          { t: 'tu', x: 'Si se lanza con ángulo, en lo más alto la velocidad vertical es 0, pero la horizontal sigue: la velocidad no es 0.' },
          { t: 'ojo', x: 'Eso es lo único del tiro con ángulo que entra. No se calcula.' },
          { t: 'diapo', n: 19 },
          { t: 'pregunta', x: 'Cuando el paquete toca el piso, ¿dónde está el avión?', r: 'Justo encima: tercera apuesta resuelta. Si dice que atrás, pregúntale quién frena al paquete en lo horizontal.' },
          { t: 'diapo', n: 20 },
          { t: 'pregunta', x: '¿Qué se calcula primero, el tiempo o la distancia? ¿Con cuál eje?', r: 'El tiempo, con el vertical: 5 · t² = 1,25, así que t = 0,5 s. Después la distancia: 2 · 0,5 = 1 m. El tiempo hace de puente.' },
          { t: 'diapo', n: 21 },
          { t: 'tu', x: 'Ahora usted: la torre, retos 5 y 6.' }
        ]
      },
      {
        tiempo: '70–78 min', titulo: 'Guiado: la torre, retos 5 y 6', comparte: 'Él', ruta: 'index.html#m6-torre', boton: 'Abrir la torre',
        pasos: [
          { t: 'el', x: 'Reto 5: dos predicciones antes de lanzar; después lanza las dos pelotas a la vez.' },
          { t: 'pregunta', x: 'En cada segundo, ¿cómo están las dos alturas?', r: 'Iguales: las líneas punteadas son horizontales. Por eso llegan juntas.' },
          { t: 'el', x: 'Reto 6: el tiempo con el eje vertical y después la distancia con el horizontal. Sin calculadora: 80 ÷ 5 = 16.' }
        ]
      },
      {
        tiempo: '78–82 min', titulo: 'Las tácticas para el examen', comparte: 'Tú', ruta: 'index.html#m5-ideas-p5', boton: 'Abrir la parte 5 del módulo 5',
        pasos: [
          { t: 'accion', x: 'Abre el módulo 5, «Ideas clave», parte 5, en pantalla completa. Son las diapositivas 24 a 29 de la clase 6, que no alcanzaron.' },
          { t: 'tu', x: 'Tres tácticas para descartar opciones: cazar la razón falsa, llevarlo al extremo y dejar que manden las unidades.' },
          { t: 'ojo', x: 'Van rápido, en 4 minutos: la masa que se cancela ya la vio hoy. Detente solo en la 26 (las tres tácticas) y en la 28 (una pregunta de principio a fin).' }
        ]
      },
      {
        tiempo: '82–100 min', titulo: 'Independiente: dos ejercicios y cinco preguntas reales', comparte: 'Él, y tú con los cuadernillos', ruta: 'index.html#m6-practica', boton: 'Abrir la práctica',
        pasos: [
          { t: 'tu', x: 'Ahora como en el examen: solo, con calculadora y con cronómetro, unos 2 minutos por pregunta. Primero el dibujo, en el papel; después, las opciones.' },
          { t: 'el', x: 'Ejercicios 8 (la esfera de acero y la de madera) y 10 (las flechas de la piedra mientras baja), en la plataforma.' },
          { t: 'ojo', x: 'El 10 es la idea que más le costó en la clase 6. Si lo falla, no lo corrijas todavía: va a la revisión.' },
          { t: 'accion', x: 'Comparte tu pantalla con los cuadernillos, una pregunta a la vez. Anota lo que responde, sin decirle si está bien.' },
          { t: 'accion', x: '2019, pregunta 19, página 13 (la piedra en el agua). Entrena: si se anulan, a = 0. Trampas: «el peso cambió» y «siempre es g». Después de hoy es la más tentadora: en el agua ya no es caída libre. Clave: D.' },
          { t: 'accion', x: '2023, pregunta 16, página 8 (el velero). Entrena: sumar flechas, no contarlas. Clave deducida: C.' },
          { t: 'accion', x: '2019, pregunta 38, página 22 (la pelota en el tubo). Entrena: si acelera, gana la que apunta hacia allá. Trampa: «el peso cambió». Clave: D.' },
          { t: 'accion', x: '2023, pregunta 20, página 10 (la esfera en la rampa). Entrena: leer un experimento. Trampa: «el peso cambió». Clave deducida: B.' },
          { t: 'accion', x: '2019, pregunta 15, página 11 (el trabajador con cuerdas). Entrena: cada eje por su lado. Clave: C.' },
          { t: 'ojo', x: 'El cuadernillo 2023 no trae claves: esas dos salen de resolverlas, no del ICFES. Conviene revisarlas antes de la clase.' },
          { t: 'ojo', x: 'Tú no intervienes. Si una pregunta se lleva más de 3 minutos, que la marque y siga: así también es el examen.' }
        ]
      },
      {
        tiempo: '100–106 min', titulo: 'Revisión: nombrar la trampa', comparte: 'Los dos',
        pasos: [
          { t: 'pregunta', x: 'En cada una que falló: ¿qué trampa tenía?', r: 'Que la nombre: el peso cambió, una flecha sin dueño, contar flechas, si se mueve algo va ganando o, desde hoy, «arriba la aceleración es 0». Importa más que la respuesta correcta.' },
          { t: 'pregunta', x: 'De las que le salieron bien, ¿cuál opción tachó primero, y por qué?', r: 'Que cuente el descarte en voz alta. Eso es lo que tiene que repetir solo en el examen.' }
        ]
      },
      {
        tiempo: '106–112 min', titulo: 'Cierre: las tres apuestas', comparte: 'Los dos', ruta: 'index.html#m6-ideas-p2', boton: 'Abrir la parte 2',
        pasos: [
          { t: 'accion', x: 'Vuelve a la diapositiva 6.' },
          { t: 'pregunta', x: 'Mire lo que escribió al principio. ¿Cuál apuesta cambió, y por qué?', r: 'Velocidad 0 y aceleración −10; llegan al tiempo; justo encima. Que lo explique con flechas: este es su avance visible de hoy.' },
          { t: 'pregunta', x: 'Sin mirar: ¿qué fuerzas actúan sobre una pelota en el aire, mientras sube?', r: 'Solo el peso. Es lo que más le costó en la clase 6: si lo dice solo al final, quedó.' },
          { t: 'tu', x: 'De tarea, unos 45 minutos: los ejercicios del módulo 6 que no hicimos. Del módulo 5, si alcanza: lo que falta de la práctica, el reto 13 de la mesa y el reto 4 de la rampa.' },
          { t: 'pregunta', x: '¿Qué fue lo más útil de hoy? ¿Qué le costó más?', r: 'Anótalo para preparar la clase 8, de química, que abre con un diagrama de fuerzas de cabeza (3 minutos).' }
        ]
      }
    ],
    ajustes: [
      ['Si vas atrasado', 'Hay 8 minutos de colchón. Si a la pausa no terminó el reto 3, el reto 4 pasa a la tarea y la parte 4 empieza a los 55; se salta la diapositiva 20 (la canica) y el reto 6 va de tarea. Lo que no se salta: las diapositivas 3, 5 y 7 (¿quién la toca ahora?), la 8 (arriba, a = −10) y la 18 (cada eje por su lado). La práctica no se recorta.'],
      ['Si se le olvidó la normal o dibuja la flecha del lanzamiento', 'No vuelvas a explicar: pregúntale «¿quién la toca ahora?» y que lo responda él. Recordarlo solo es lo que fija.'],
      ['Si se enreda con los signos', 'Que diga «sube» o «baja» antes de escribir el signo: subiendo, positivo; bajando, negativo. Si sigue, que trabaje con la rapidez, sin signos, y diga la dirección con palabras.'],
      ['Si suma 10 al subir', 'Pregúntale hacia dónde jala el peso. Si jala hacia abajo y la pelota va hacia arriba, le quita velocidad.'],
      ['Si en lo más alto dice que la aceleración es 0', 'Pregúntale qué pasaría si fuera 0: la velocidad se quedaría en 0 y la pelota flotaría. ¿Flota?'],
      ['Si olvida la raíz', 'Que lea en voz alta lo que despejó: «t² = 25» todavía tiene un cuadrado. ¿Qué número por sí mismo da 25?'],
      ['Si pregunta por v² = v₀² + 2gh', 'Existe y sirve, pero no hace falta: con el tiempo primero y la velocidad promedio después se resuelve todo. Es una fórmula menos que recordar.'],
      ['Si pregunta por el tiro con ángulo', 'La velocidad se parte en dos con seno y coseno, como el peso en la rampa, y cada eje va por su lado. En esta clase no se calcula: queda con una frase en el kit de la clase 12.'],
      ['Si pregunta por g = 9,8', 'Se hace igual: la gravedad quita 9,8 m/s en cada segundo y lo que ha caído es 4,9 · t². Con la calculadora, sin problema. La caja de la torre lo dice.'],
      ['Si te sobra tiempo', 'El ejercicio 14 (el acantilado), que junta la caída libre con la llave maestra del módulo 3, o el 15 (el avión de carga), que usa km/h y m/s del módulo 1. Con calculadora y sin herramientas. O la pregunta 22 del cuadernillo 2019, página 14 (tres objetos que caen con tiempos distintos): con aire, la forma y el material sí importan. Clave: C.']
    ]
  };
})();
