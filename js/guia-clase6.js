/* =====================================================================
   Solo para el tutor · guion de la clase 6 (módulo 5, dinámica)
   ---------------------------------------------------------------------
   Lo carga únicamente la página del tutor (tutor-q7m2.html), igual que
   js/tutor.js. Mismo formato de pasos que las clases 1 a 4. La clase 5,
   de repaso, se dio con una presentación aparte y no tiene guion aquí.
   Las preguntas del ICFES se citan solo por número: el repositorio es
   público, así que sus enunciados y figuras no se copian. Se muestran
   desde los cuadernillos en PDF.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;

  MA.GuiaClase6 = {
    id: 'c6',
    nombre: 'Clase 6',
    titulo: 'Guion de la clase 6',
    entrada: 'Unas 2 horas por videollamada, con una pausa en el minuto 55: 32 minutos de teoría en bloques cortos, 32 de herramientas, 11 de papel y 29 de práctica. En cada bloque va la transferencia gradual: tú modelas, él hace con guía y después solo, en papel. Los ejemplos de las diapositivas no se repiten en las herramientas ni en la práctica. Si va lento, se recortan herramientas, nunca la práctica.',
    diapositivas: () => MA.Clase5.DIAPOSITIVAS,
    claveCheck: 'guia.check.c6',
    antes: [
      'Confirma que en su plataforma ya aparece el módulo 5 como disponible. Si no aparece, falta publicar esta versión.',
      'Que tenga papel, lápiz y la calculadora del examen. Pídele que escriba sen 30: tiene que dar 0,5. Si da −0,988, está en radianes y hay que pasarla a grados (D o DEG) antes de empezar.',
      'Calentamiento de unos 10 minutos, antes de la llamada: una ronda de «Despejar y reemplazar» (módulo 1, rondas de práctica) y una del radar de signos (módulo 2). Son justo los dos errores que siguen apareciendo.',
      'Ten abiertos los dos cuadernillos del ICFES (2019 y 2023) en las páginas de las cinco preguntas: 2023, páginas 8 y 10; 2019, páginas 11, 13 y 22.',
      'Prueba antes la mesa de fuerzas: un reto con una flecha falsa y una flecha mal dirigida, para ver cómo responde. Prueba también la carrera de la rampa.',
      'Ten a mano un cronómetro: el del celular basta.'
    ],
    objetivos: [
      'Distinguir masa de peso, calcular P = m · g y decir qué cambia y qué no al viajar a la Luna.',
      'Nombrar las cinco fuerzas y decir quién hace cada una, y dibujar y leer el diagrama de cualquier situación con «¿Quién lo toca?», en el piso, en el aire y en una rampa, sin flechas sin dueño.',
      'Calcular la aceleración con la fuerza neta: primero las flechas, con sus signos, y después la masa.',
      'Decir cuáles son las parejas de la tercera ley y por qué el peso y la normal no son una de ellas.',
      'Usar las tres tácticas de descarte en una pregunta tipo examen, en unos 2 minutos.'
    ],
    enfoque: [
      'Tres herramientas maestras en lugar de casos, como en factorización: «¿Quién lo toca?», ΣF = m · a y las tres tácticas de descarte.',
      'Transferencia gradual en cada bloque: modelas, él hace con guía y después solo, en papel, y compara. Aun cuando modelas, cada diapositiva arranca con una pregunta tapada: primero que apueste.',
      'La pregunta de toda la clase es «¿quién hace esa fuerza?». Con esa sola pregunta se caen la fuerza del movimiento, la inercia, la fuerza del lanzamiento y el ladrido de Toby. No le dictes flechas: pregúntale eso.',
      'Sus signos: hacia la derecha suma y hacia la izquierda resta, como plata y deudas en el radar de signos. Si se enreda, que diga «a favor» o «en contra» antes de escribir el signo.',
      'Sus despejes: ΣF = m · a le da una razón física a la regla de oro. Primero se resuelven las flechas (lo que suma y resta) y después se divide entre la masa. Si divide primero, le da un número absurdo, y la mesa se lo explica.',
      'Trigonometría: como en el colegio, opuesto ÷ hipotenusa y adyacente ÷ hipotenusa. Va tarde, cuando ya le salió el diagrama de la rampa sin ver ningún seno. Lo importante es que el peso es la hipotenusa: de ahí sale P∥ = P · sen θ, con un despeje. Ninguna de las preguntas de los cuadernillos usa seno o coseno, así que si vas atrasado se saltan.',
      'En la mesa la guía es mucha: sirve para entender. Por eso lo independiente va en papel y, desde tipo examen, en la práctica no hay botón de herramienta, igual que en la clase 4.',
      'El humor es la situación física, no un adorno. Y se retira: los retos van sin personajes, porque el examen no los trae.',
      'Cuida el reloj: a los 85 minutos empieza la práctica, pase lo que pase.'
    ],
    minimo: [
      ['Masa y peso', 'La masa, en kg, es cuánto cuesta cambiarle el movimiento. El peso, en N, es P = m · g. El peso solo cambia si cambia la masa o cambia el planeta.'],
      ['Las cinco fuerzas y ¿Quién lo toca?', 'Peso, normal, fricción, tensión y empuje. El cuerpo solo, el peso siempre, una flecha por cada cosa que lo toca, y se compara con lo que hace, cada eje por su lado.'],
      ['Primera y segunda ley', 'Quieto o con velocidad constante, las flechas se anulan. Si acelera, gana una: ΣF = m · a. Primero las flechas, después la masa.'],
      ['Tercera ley', '«A sobre B» y «B sobre A»: iguales y en cuerpos distintos, así que no se anulan. El peso y la normal están en la misma caja: no son pareja.'],
      ['La rampa', 'El peso sigue vertical, la normal sale perpendicular y la fricción va a lo largo. El peso es la hipotenusa: seno se desliza, coseno contra la rampa. Si se le olvida, con la rampa plana nada desliza.']
    ],
    guion: [
      {
        tiempo: '0–5 min', titulo: 'Apertura: tres apuestas', comparte: 'Tú, con la presentación en pantalla completa', ruta: 'index.html#m5-ideas-p1', boton: 'Abrir la parte 1',
        pasos: [
          { t: 'accion', x: 'Comparte tu pantalla, abre «Ideas clave», parte 1, y pulsa «Pantalla completa».' },
          { t: 'diapo', n: 1 },
          { t: 'tu', x: 'Hoy vemos por qué se mueve lo que se mueve. La clase pasada vio cómo se mueve; hoy, quién lo empuja.' },
          { t: 'diapo', n: 2 },
          { t: 'pregunta', x: 'Escriba las tres en el papel, con su respuesta. No las corrijo todavía.', r: 'Lo normal es que diga que el empuje es mayor, que la caja hace más fuerza y que la sandía llega primero. No corrijas ni des pistas: vuelven al final, y ahí se ve lo que aprendió.' }
        ]
      },
      {
        tiempo: '5–18 min', titulo: 'Modelo: masa, peso y las fuerzas que existen', comparte: 'Tú', ruta: 'index.html#m5-ideas-p1', boton: 'Abrir la parte 1',
        pasos: [
          { t: 'diapo', n: 3 },
          { t: 'pregunta', x: 'El empleado empuja la caja. ¿De quién es la fuerza? ¿Sobre quién?', r: 'Del empleado, sobre la caja. Un → por cada respuesta. Si no se puede decir quién la hace, no existe: esa frase vuelve toda la clase.' },
          { t: 'ojo', x: 'Las respuestas están tapadas con «?». Primero pregúntale; cuando conteste, pulsa → (o «Revelar»).' },
          { t: 'diapo', n: 4 },
          { t: 'pregunta', x: 'Toby en la Luna, con la sexta parte de la gravedad: ¿cuántos kg? ¿Cuántos N?', r: '30 kg y 50 N. La masa no cambia. Si dice 5 kg, pregúntale si en la Luna hay menos Toby.' },
          { t: 'tu', x: 'La báscula de la casa marca kilos, pero mide con cuánta fuerza la aprieta. Por eso en la Luna marcaría menos, y Toby sería el mismo.' },
          { t: 'diapo', n: 5 },
          { t: 'pregunta', x: 'El peso jala al melón hacia abajo, y el melón no se mueve. ¿Quién lo empuja hacia arriba?', r: 'El piso. Aquí nace la normal: nadie la ve, y por eso parece rara. Si duda, que apoye la mano en la mesa y empuje: siente cómo la mesa le empuja de vuelta.' },
          { t: 'tu', x: 'Esa fuerza se llama normal, porque en geometría normal quiere decir perpendicular. Sale de la superficie en ángulo recto. Por eso en un piso apunta hacia arriba, pero en una rampa, no.' },
          { t: 'diapo', n: 6 },
          { t: 'pregunta', x: 'Son cinco. ¿Hacia dónde apunta cada una?', r: 'Un → por cada fila. No hace falta que las sepa: que razone con quién la hace. Una cuerda solo jala: si la empuja, se afloja. Es lo que hace la tensión.' },
          { t: 'ojo', x: 'Esta diapositiva y la anterior son la introducción de las fuerzas. Dilas con tus palabras: si tienes una forma mejor de presentar la normal y la tensión, úsala.' },
          { t: 'diapo', n: 7 },
          { t: 'diapo', n: 8 },
          { t: 'pregunta', x: '¿Qué la toca? ¿Hay flecha por el ladrido de Toby?', r: 'El piso y el empleado. Toby no toca, así que no hay flecha.' },
          { t: 'pregunta', x: 'En lo horizontal, ¿cuál es más larga: el empuje o la fricción?', r: 'Son iguales. Si dice que el empuje, porque avanza, no lo corrijas todavía: revela y deja que lo piense. Es la idea más difícil de la clase.' },
          { t: 'tu', x: 'Para seguir con la misma velocidad no hace falta ganar: basta empatar.' },
          { t: 'diapo', n: 9 },
          { t: 'tu', x: 'Ahora usted: comparta la pantalla y abra «Mesa de fuerzas».' },
          { t: 'accion', x: 'Sal de la pantalla completa (Esc) y deja de compartir.' }
        ]
      },
      {
        tiempo: '18–28 min', titulo: 'Guiado: mesa de fuerzas, retos 1 a 3', comparte: 'Él', ruta: 'index.html#m5-fuerzas', boton: 'Abrir la mesa de fuerzas',
        pasos: [
          { t: 'el', x: 'Reto 1, Toby quieto: marca qué lo toca, agrega las flechas y arrastra las puntas. Sirve para aprender a usar la mesa.' },
          { t: 'el', x: 'Reto 2, Yonaiker arrastra un costal con una cuerda. Que diga en voz alta quién hace cada flecha. Es otra situación que la de la diapositiva: ahora la fuerza es la tensión.' },
          { t: 'ojo', x: 'Tu única pregunta: «¿quién hace esa fuerza?». Si pone el zumbido de la mosca o la fuerza del movimiento, deja que la mesa se lo explique y que lea el mensaje en voz alta.' },
          { t: 'el', x: 'Reto 3, la caja sigue sola después del empujón.' },
          { t: 'pregunta', x: 'La caja va hacia adelante y la única fuerza horizontal va hacia atrás. ¿Cómo es posible?', r: 'La fuerza no dice hacia dónde va, sino cómo cambia su velocidad. Por eso frena.' }
        ]
      },
      {
        tiempo: '28–32 min', titulo: 'Independiente: en papel, retos 4 y 5', comparte: 'Él', ruta: 'index.html#m5-fuerzas', boton: 'Abrir la mesa de fuerzas',
        pasos: [
          { t: 'tu', x: 'Sin la mesa, en el papel: la pelota de Toby subiendo por el aire y el melón colgado. Dibuje solo las flechas, y me dice cuando termine.' },
          { t: 'ojo', x: 'Tú solo miras. Si dibuja una flecha hacia arriba en la pelota, pregúntale quién la hace.' },
          { t: 'el', x: 'Compara en la mesa, retos 4 y 5.' },
          { t: 'pregunta', x: 'La pelota va subiendo. ¿Por qué no hay una flecha hacia arriba?', r: 'La mano ya la soltó. Sube porque ya venía subiendo, y el peso le quita 10 m/s en cada segundo. Esa es la caída libre, y aquí queda cumplida la promesa de la piedra del módulo 3.' },
          { t: 'accion', x: 'Al terminar el reto 5 aparece «Seguir con las ideas clave, parte 2»: ahí vuelves a compartir tú.' }
        ]
      },
      {
        tiempo: '32–41 min', titulo: 'Modelo: la fuerza neta y las tres leyes', comparte: 'Tú', ruta: 'index.html#m5-ideas-p2', boton: 'Abrir la parte 2',
        pasos: [
          { t: 'accion', x: 'Vuelve a compartir: «Ideas clave», parte 2, en pantalla completa.' },
          { t: 'diapo', n: 10 },
          { t: 'diapo', n: 11 },
          { t: 'pregunta', x: 'Con 200 N a favor y 80 N en contra, ¿cuánto vale la fuerza neta? ¿Y la aceleración?', r: '120 N y 3 m/s². Primero las flechas, después la masa. Dilo así: es la regla de oro con una razón física.' },
          { t: 'diapo', n: 12 },
          { t: 'pregunta', x: '¿En qué tramo hay fuerza neta sobre Yonaiker?', r: 'De 0 a 3 s, porque ahí cambia la velocidad. De 3 a 7 s, cuando va más rápido, las flechas se anulan. Es el gráfico de la clase pasada.' },
          { t: 'diapo', n: 13 },
          { t: 'pregunta', x: 'Doble fuerza, ¿qué pasa con la aceleración? ¿Doble masa? ¿Doble las dos?', r: 'El doble, la mitad, igual. En el examen esto se pregunta sin números.' },
          { t: 'diapo', n: 14 },
          { t: 'pregunta', x: 'Toby choca con la caja. ¿Quién recibe más fuerza? ¿Quién sale más acelerado?', r: 'La misma; Toby, porque tiene menos masa. Esta es la segunda apuesta, pero déjala para el cierre.' },
          { t: 'diapo', n: 15 },
          { t: 'pregunta', x: 'El peso y la normal son iguales y contrarios. ¿Son pareja?', r: 'No: están en la misma caja. La pareja del peso es la caja jalando a la Tierra.' },
          { t: 'diapo', n: 16 },
          { t: 'tu', x: 'Comparta la pantalla y vuelva a la mesa, reto 6.' }
        ]
      },
      {
        tiempo: '41–51 min', titulo: 'Guiado: mesa de fuerzas, retos 6 y 7', comparte: 'Él', ruta: 'index.html#m5-fuerzas', boton: 'Abrir la mesa de fuerzas',
        pasos: [
          { t: 'el', x: 'Reto 6, con otros números que la diapositiva: 300 N, 100 N de fricción y 50 kg. Las flechas, la suma con signos, la neta (200 N) y la aceleración (4 m/s²). La caja sale con las huellas del radar de pista. Al final, la pareja de una fuerza.' },
          { t: 'ojo', x: 'Si elige un signo equivocado, que diga «a favor» o «en contra» antes de volver a elegir. Si escribe −94, dividió primero: deja que lea el mensaje.' },
          { t: 'el', x: 'Reto 7, el costal de melones: el diagrama ya está hecho y hay que decir qué flechas cambian. Es el formato de los cuadernillos.' },
          { t: 'pregunta', x: 'Se agregan melones. ¿Por qué no cambia la cuerda horizontal?', r: 'Cada eje por su lado: el peso es vertical. Solo crecen el peso y la cuerda vertical.' }
        ]
      },
      {
        tiempo: '51–55 min', titulo: 'Independiente: en papel, reto 8 y ejercicio 4', comparte: 'Él', ruta: 'index.html#m5-practica', boton: 'Abrir la práctica',
        pasos: [
          { t: 'tu', x: 'En el papel: el avión recto y nivelado, con velocidad constante. Las cuatro flechas.' },
          { t: 'el', x: 'Compara en la mesa, reto 8. Aquí se resuelve la primera apuesta: que la mire, sin que tú se lo digas.' },
          { t: 'el', x: 'Ejercicio 4 de la práctica, sin herramienta: la fuerza se triplica y la masa se reduce a la mitad.' },
          { t: 'ojo', x: 'Punto de control: si no le sale el diagrama en el piso, la rampa queda de tarea y el seno y el coseno salen del plan, porque la clase 7 es de caída libre y no hay otra clase de física para la rampa. Después de la pausa sigues con la práctica, sin las preguntas de rampa.' }
        ]
      },
      {
        tiempo: '55–60 min', titulo: 'Pausa', comparte: 'Nadie',
        pasos: [
          { t: 'tu', x: 'Cinco minutos. Lejos de la pantalla.' },
          { t: 'ojo', x: 'También es el corte natural: si llega cansado, aquí se puede terminar por hoy. Si es así, antes de cerrar vuelve a las apuestas 1 y 2. La clase 7 abre con las tácticas (parte 5) y unos ejercicios de la práctica, y la rampa queda de tarea.' }
        ]
      },
      {
        tiempo: '60–65 min', titulo: 'Modelo: las flechas en la rampa', comparte: 'Tú', ruta: 'index.html#m5-ideas-p3', boton: 'Abrir la parte 3',
        pasos: [
          { t: 'accion', x: 'Vuelve a compartir: «Ideas clave», parte 3, en pantalla completa.' },
          { t: 'diapo', n: 17 },
          { t: 'pregunta', x: 'El melón del depósito bajaba solo por la pendiente. ¿Quién lo empuja?', r: 'Nadie lo toca para empujarlo. Es el ejercicio del melón de la clase pasada: ahora se ve por qué acelera.' },
          { t: 'pregunta', x: '¿Hacia dónde apunta el peso? ¿Y la normal?', r: 'Hacia abajo, aunque haya rampa; perpendicular a la rampa. Todavía sin seno ni coseno.' },
          { t: 'diapo', n: 18 },
          { t: 'tu', x: 'Comparta la pantalla: mesa de fuerzas, retos 9 y 10.' }
        ]
      },
      {
        tiempo: '65–70 min', titulo: 'Guiado: mesa de fuerzas, retos 9 y 10', comparte: 'Él', ruta: 'index.html#m5-fuerzas', boton: 'Abrir la mesa de fuerzas',
        pasos: [
          { t: 'el', x: 'Reto 9, la caja quieta en la rampa.' },
          { t: 'ojo', x: 'Los dos errores que hay que cazar: el peso perpendicular a la rampa y la normal vertical. La mesa explica los dos.' },
          { t: 'el', x: 'Reto 10, la patineta baja sin fricción.' },
          { t: 'pregunta', x: 'Solo hay dos flechas. Entonces, ¿quién la acelera?', r: 'Una parte del peso. Y no se dibuja aparte, porque se contaría dos veces.' },
          { t: 'ojo', x: 'Si van atrasados en este punto, se saltan seno y coseno: salta a la rampa, reto 3, y después a la práctica.' }
        ]
      },
      {
        tiempo: '70–75 min', titulo: 'Modelo: seno y coseno', comparte: 'Tú', ruta: 'index.html#m5-ideas-p4', boton: 'Abrir la parte 4',
        pasos: [
          { t: 'accion', x: 'Vuelve a compartir: «Ideas clave», parte 4, en pantalla completa.' },
          { t: 'diapo', n: 19 },
          { t: 'pregunta', x: 'Desde el ángulo θ, ¿cómo se llama el lado de enfrente? ¿Y el que lo toca? ¿Y el más largo?', r: 'Opuesto, adyacente e hipotenusa. Él ya lo vio en el colegio. El último → muestra las dos definiciones.' },
          { t: 'diapo', n: 20 },
          { t: 'pregunta', x: 'La rampa mide 10 m de largo y sube 5 m. ¿Cuánto vale el seno de ese ángulo?', r: '5 ÷ 10 = 0,5: el alto es el opuesto y el largo es la hipotenusa.' },
          { t: 'pregunta', x: 'Pruébelo en su calculadora: sen 30. ¿Y cos 30?', r: '0,5 y 0,866. Si le da −0,988, está en radianes.' },
          { t: 'diapo', n: 21 },
          { t: 'tu', x: 'Mire el triángulo que forman las flechas: el peso es la hipotenusa. La parte rampa abajo queda frente al ángulo. Entonces seno es esa parte entre el peso, y despejando sale la fórmula.' },
          { t: 'pregunta', x: 'Una caja de 400 N a 30°: ¿cuánto empuja rampa abajo? ¿Y contra la rampa?', r: '200 N y 346 N. Seno se desliza; coseno contra la rampa.' },
          { t: 'diapo', n: 22 },
          { t: 'pregunta', x: 'Con la rampa plana, ¿cuánto vale el seno? ¿Con la rampa vertical?', r: '0 y 1. A 90°, todo el peso empuja: es la caída libre. Si se le olvida cuál es cuál, el extremo lo salva.' },
          { t: 'diapo', n: 23 },
          { t: 'tu', x: 'Comparta la pantalla y abra «La rampa». Antes de mover nada, dígame su predicción.' }
        ]
      },
      {
        tiempo: '75–82 min', titulo: 'Guiado: la rampa, retos 1 a 3', comparte: 'Él', ruta: 'index.html#m5-rampa', boton: 'Abrir la rampa',
        pasos: [
          { t: 'el', x: 'Reto 1: predice qué le pasa a la normal y empina la rampa hasta 60°.' },
          { t: 'el', x: 'Que toque «Partir el peso en dos» y vea cómo cambia el triángulo.' },
          { t: 'el', x: 'Reto 2: la normal en los extremos de 0° y 90°. La diapositiva mostró el seno; aquí va el coseno.' },
          { t: 'el', x: 'Reto 3: la carrera. Es la tercera apuesta: que diga qué había escrito antes de ver cómo sale.' },
          { t: 'pregunta', x: 'Llegaron al tiempo. ¿Por qué, si a la sandía la empuja más fuerza?', r: 'También cuesta más acelerarla. El tablero lo muestra: 10 N y 50 N, y los dos con 5 m/s². La fórmula va en la siguiente diapositiva.' }
        ]
      },
      {
        tiempo: '82–85 min', titulo: 'Independiente: en papel, reto 11', comparte: 'Él', ruta: 'index.html#m5-fuerzas', boton: 'Abrir la mesa de fuerzas',
        pasos: [
          { t: 'tu', x: 'En el papel: una caja baja por la rampa con velocidad constante. Las flechas.' },
          { t: 'el', x: 'Compara en la mesa, reto 11. Al terminar aparece «Seguir con las ideas clave, parte 5»: ahí compartes tú.' }
        ]
      },
      {
        tiempo: '85–90 min', titulo: 'Modelo: tres tácticas y una pregunta de principio a fin', comparte: 'Tú', ruta: 'index.html#m5-ideas-p5', boton: 'Abrir la parte 5',
        pasos: [
          { t: 'accion', x: '«Ideas clave», parte 5, en pantalla completa. Van rápido: son las herramientas de la práctica.' },
          { t: 'diapo', n: 24 },
          { t: 'diapo', n: 25 },
          { t: 'pregunta', x: '¿Qué quiere decir velocidad constante? ¿Y frena? ¿Y sin fricción? ¿Y se suelta?', r: 'Se anulan; gana una; esa flecha no va; solo el peso. Como las palabras que son datos de la clase 4.' },
          { t: 'diapo', n: 26 },
          { t: 'diapo', n: 27 },
          { t: 'pregunta', x: '¿Qué operación da m² con m³/s y m/s?', r: 'Dividir. Nunca vio esa fórmula: es el factor unitario del módulo 1, y es el razonamiento de la pregunta del secador que encontraste.' },
          { t: 'diapo', n: 28 },
          { t: 'tu', x: 'Dice velocidad constante, así que las flechas se anulan: tacho la A, que no empata. El piso tiene fricción: tacho la B. ¿Quién hace la flecha del movimiento en la D? Nadie: la tacho. Queda la C. Y el grito no toca el costal, y los 200 kg sobran.' },
          { t: 'ojo', x: 'Este modelo está solo en la diapositiva, no en la práctica: así, cuando él practique, nada le llega resuelto. Un → por cada opción tachada.' },
          { t: 'ojo', x: 'Si vas atrasado, salta la diapositiva 27. La 28 no se salta: es el modelo de lo que viene.' },
          { t: 'diapo', n: 29 }
        ]
      },
      {
        tiempo: '90–94 min', titulo: 'Guiado: el ejercicio 7', comparte: 'Él', ruta: 'index.html#m5-practica', boton: 'Abrir la práctica',
        pasos: [
          { t: 'el', x: 'Ejercicio 7, Toby en la Luna. Él decide; tú solo preguntas.' },
          { t: 'pregunta', x: '¿Qué cambió y qué no al viajar?', r: 'Cambió el peso; la masa no.' },
          { t: 'pregunta', x: 'Las dos que dicen igual, ¿en qué se diferencian?', r: 'En la razón. Una dice que la masa es la misma, y es cierto; la otra dice que el peso es el mismo, y es falso. Que tache esa con la ×.' }
        ]
      },
      {
        tiempo: '94–108 min', titulo: 'Independiente: ejercicios 8 y 9, y cinco preguntas reales', comparte: 'Él, y tú con los cuadernillos', ruta: 'index.html#m5-practica', boton: 'Abrir la práctica',
        pasos: [
          { t: 'tu', x: 'Ahora como en el examen: solo y con cronómetro, unos 2 minutos por pregunta. Primero el dibujo, en el papel; después, las opciones.' },
          { t: 'el', x: 'Ejercicios 8 (se pone otra caja encima, en la rampa) y 9 (el camión que remolca un carro), en la plataforma.' },
          { t: 'accion', x: 'Comparte tu pantalla con los cuadernillos, una pregunta a la vez. Anota lo que responde, sin decirle si está bien.' },
          { t: 'accion', x: '2023, pregunta 16, página 8 (el velero). Entrena: sumar flechas, no contarlas. Clave deducida: C.' },
          { t: 'accion', x: '2019, pregunta 38, página 22 (la pelota en el tubo). Entrena: si acelera, gana la que apunta hacia allá. Trampa: «el peso cambió». Clave: D.' },
          { t: 'accion', x: '2023, pregunta 20, página 10 (la esfera en la rampa). Entrena: leer un experimento. Trampa: «el peso cambió». Clave deducida: B.' },
          { t: 'accion', x: '2019, pregunta 19, página 13 (la piedra en el agua). Entrena: si se anulan, a = 0. Trampas: «el peso cambió» y «siempre es g». Clave: D.' },
          { t: 'accion', x: '2019, pregunta 15, página 11 (el trabajador con cuerdas). Entrena: cada eje por su lado. Clave: C.' },
          { t: 'ojo', x: 'El cuadernillo 2023 no trae claves: esas dos salen de resolverlas, no del ICFES. Conviene revisarlas antes de la clase.' },
          { t: 'ojo', x: 'Tú no intervienes. Si una pregunta se lleva más de 3 minutos, que la marque y siga: así también es el examen.' }
        ]
      },
      {
        tiempo: '108–114 min', titulo: 'Revisión: nombrar la trampa', comparte: 'Los dos',
        pasos: [
          { t: 'pregunta', x: 'En cada una que falló: ¿qué trampa tenía?', r: 'Que la nombre: el peso cambió, una flecha sin dueño, contar flechas o si se mueve, algo va ganando. Importa más que la respuesta correcta.' },
          { t: 'pregunta', x: 'De las que le salieron bien, ¿cuál opción tachó primero, y por qué?', r: 'Que cuente el descarte en voz alta. Eso es lo que tiene que repetir solo en el examen.' }
        ]
      },
      {
        tiempo: '114–120 min', titulo: 'Cierre: las tres apuestas', comparte: 'Los dos', ruta: 'index.html#m5-ideas-p1', boton: 'Abrir la parte 1',
        pasos: [
          { t: 'accion', x: 'Vuelve a la diapositiva 2.' },
          { t: 'pregunta', x: 'Mire lo que escribió al principio. ¿Cuál apuesta cambió, y por qué?', r: 'Empuje igual a la resistencia, misma fuerza, llegan al tiempo. Que lo explique con flechas. Este es su avance visible de hoy.' },
          { t: 'tu', x: 'De tarea, unos 45 minutos: los retos 12 y 13 de la mesa, el reto 4 de la rampa y los ejercicios que faltan de la práctica. Ninguno lo vimos en clase.' },
          { t: 'pregunta', x: '¿Qué fue lo más útil de hoy? ¿Qué le costó más?', r: 'Anótalo para preparar la clase 7. Si no se vieron seno y coseno, ya no se ven; si no se vio la rampa, queda de tarea.' }
        ]
      }
    ],
    ajustes: [
      ['Si te falta tiempo', 'No recortes la práctica: es lo más parecido al examen. Primero se saltan las diapositivas 19 a 22 (seno y coseno) y el reto 2 de la rampa; después, el reto 3 de la mesa y la diapositiva 27. Lo que no se puede saltar: las diapositivas 5 y 6 (las fuerzas), la 8 (empatar) y la 15 (el peso y la normal).'],
      ['Si a los 55 minutos no le sale el diagrama en el piso', 'La rampa queda de tarea y el seno y el coseno salen del plan: la clase 7 es de caída libre. Después de la pausa, más retos en el papel (4, 5 y 8) y la práctica sin las preguntas de rampa: se quitan el ejercicio 8 y la pregunta 20 del cuadernillo 2023.'],
      ['Si te sobra tiempo', 'El reto 12 de la mesa (la fricción cambia de lado) o el ejercicio 15, la misión del despegue, que junta esta clase con cinemática. Con calculadora y sin herramientas.'],
      ['Si se enreda con los signos', 'Que diga «a favor» o «en contra» antes de cada signo. Si sigue, una ronda del radar de signos y vuelven al reto 6.'],
      ['Si divide antes de sumar', 'Pídele que dibuje primero las flechas y escriba la neta en un renglón aparte. La masa va en el renglón siguiente.'],
      ['Si se apoya en la mesa para todo', 'Lo que no sea el primer reto de cada bloque, primero en el papel. La mesa queda para comparar.'],
      ['Si pregunta por qué 200 N y 346 N no suman 400 N', 'Porque son los catetos de un triángulo, no dos pedazos de una barra: apuntan en direcciones distintas. Con Pitágoras sí da: 200² + 346² ≈ 400².'],
      ['Si pregunta por tangente o radianes', 'Por ahora no hace falta: ninguna de las preguntas revisadas lo pide.'],
      ['Si pregunta por el coeficiente de fricción', 'Va en la clase 10, con trabajo y energía, donde se usa enseguida. Hoy basta con saber hacia dónde apunta: contra el deslizamiento. La caja «¿Y la fuerza de la fricción?» de la mesa ya le muestra la fórmula, sin cuentas.'],
      ['Si pregunta por poleas, resortes o el ascensor', 'Quedaron por fuera a propósito: no son de alta rentabilidad. Se resuelven con la misma llave, si algún día hacen falta.']
    ]
  };
})();
