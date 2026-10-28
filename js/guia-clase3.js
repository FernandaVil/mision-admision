/* =====================================================================
   Solo para el tutor · guion de la clase 3 (módulo 3, factorización)
   ---------------------------------------------------------------------
   Lo carga únicamente la página del tutor (tutor-q7m2.html), igual que
   js/tutor.js. Mismo formato de pasos que las clases 1 y 2.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;

  MA.GuiaClase3 = {
    id: 'c3',
    nombre: 'Clase 3',
    titulo: 'Guion de la clase 3',
    entrada: 'Unos 80 minutos por videollamada, en tres bloques cortos de teoría, cada uno justo antes de su herramienta: juntar, armar y desarmar con la mesa de áreas; la diferencia de cuadrados, que se ve cortando y moviendo; y la llave maestra (la fórmula cuadrática) para cualquier trinomio. Si va lento, el corte natural es antes de la parte 3: es mejor empezar la próxima clase con la llave que apurarla.',
    diapositivas: () => MA.Clase3.DIAPOSITIVAS,
    claveCheck: 'guia.check.c3',
    antes: [
      'Confirma que en su plataforma ya aparece el módulo 3 como disponible. Si no aparece, falta publicar esta versión.',
      'Que tenga papel, lápiz y nada de calculadora.',
      'Prueba antes las tres herramientas: la mesa de áreas (juntar, armar y desarmar) con la tarjeta «Del dibujo al papel», la de cuadrados (con «Cortar y mover») y la llave maestra. Al terminar un reto de la llave, prueba «Comprobar: todos contra todos».',
      'Al final de la llave está la calculadora de GeoGebra: necesita internet y tarda unos segundos en cargar. Ábrela una vez antes de la clase.',
      'Si hay tiempo antes de empezar, que haga una ronda del radar de signos del módulo 2: la llave maestra tiene las mismas trampas.'
    ],
    objetivos: [
      'Juntar términos del mismo tipo y multiplicar con la distributiva (todos contra todos, con flechas en el papel), sin olvidar los pedazos del medio.',
      'Sacar factor común de a poco, con las tres preguntas (¿pares?, ¿terminan en 0 o en 5?, ¿tabla del 3?) y la x, y comprobar armando de vuelta.',
      'Reconocer y desarmar una diferencia de cuadrados, y usar la llave maestra para encontrar las raíces de un trinomio y convertirlas en paréntesis.'
    ],
    enfoque: [
      'Nada de MCM. Si lo saca él (lo estuvo mirando por su cuenta), dile que el MCM sirve para sumar fracciones y que para eso ya tiene la mariposa. Para el factor común basta con preguntarse si todos son pares, si terminan en 0 o en 5, o si están en la tabla del 3.',
      'La idea que amarra todo: multiplicar es armar un rectángulo y factorizar es desarmarlo. Cada vez que factorice algo, pídele que lo arme de vuelta para comprobar.',
      'El rectángulo es para entender, no para trabajar: con negativos se enreda, porque no hay áreas negativas. En el papel se arma con flechas, todos contra todos. Si se traba con un negativo en el dibujo, pásalo a las flechas.',
      'No hay casos que memorizar: tres llaves y un chequeo en orden (factor común, diferencia de cuadrados y llave maestra). La pregunta no es cuál va primero, sino cuál abre el candado; si abre solo una parte, se mira otra vez lo que quedó. La llave maestra abre casi todo, pero es el camino largo.',
      'Raíces y factorización son dos caras de la misma moneda: si factoriza, encuentra las raíces; si encuentra las raíces con la llave, arma los paréntesis. En la gráfica, las raíces son los puntos donde la curva toca el suelo.',
      'La llave maestra trae las tres trampas del radar de signos: −(−5), (−5)² y 4ac con c negativa. Que reemplace siempre con paréntesis, aunque le parezca lento.',
      'Él quiere resolver de cabeza: úsalo. En la mesa de áreas, que diga el pedazo antes de escribirlo; en la llave, que diga a, b y c antes de tocar.',
      'Ve despacio. Si a los 50 minutos todavía está en la mesa de áreas, deja la llave maestra para la próxima clase: es mejor que la vea con calma.'
    ],
    minimo: [
      ['Juntar', 'Solo lo del mismo tipo: 2x + 3x = 5x, pero x² y x no se juntan (como m² y m).'],
      ['Armar', 'La distributiva: todos contra todos, una flecha por cada multiplicación. (x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6.'],
      ['Desarmar', 'El factor común: sacar de a poco lo que está en todos. Si se saca todo un pedazo, queda 1.'],
      ['Diferencia de cuadrados', 'Dos cuadrados con una resta: x² − 9 = (x + 3)(x − 3). Con suma no se puede.'],
      ['La llave maestra', 'x = (−b ± √(b² − 4ac)) / 2a, siempre con paréntesis. Cada raíz r da el paréntesis (x − r) y la a va adelante.']
    ],
    guion: [
      {
        tiempo: '0–3 min', titulo: 'Apertura', comparte: 'Él', ruta: 'index.html#inicio', boton: 'Abrir el panel general',
        pasos: [
          { t: 'tu', x: 'Hoy vamos con factorización. Suena difícil, pero es una sola idea: multiplicar es armar un rectángulo y factorizar es desarmarlo.' },
          { t: 'pregunta', x: '¿Cuánto es −4 − (−2)?', r: '−2. Si dice +2, repasen un momento la situación C del radar: los signos pegados vuelven hoy en la llave maestra.' },
          { t: 'ojo', x: 'Si trae lo que vio del MCM, no lo expliques ahora: dile que hoy no hace falta y que al final va a ver por qué.' }
        ]
      },
      {
        tiempo: '3–12 min', titulo: 'Ideas clave, parte 1: armar y desarmar', comparte: 'Tú, con la presentación en pantalla completa', ruta: 'index.html#m3-ideas-p1', boton: 'Abrir la parte 1',
        pasos: [
          { t: 'accion', x: 'Comparte tu pantalla, abre «Ideas clave», parte 1, y pulsa «Pantalla completa».' },
          { t: 'ojo', x: 'Las respuestas de las diapositivas están tapadas con «?». Primero pregúntale; cuando conteste, pulsa → (o «Revelar») para mostrarlas. Si se te adelanta, ← las vuelve a tapar.' },
          { t: 'diapo', n: 1 },
          { t: 'tu', x: 'Son tres cosas: juntar, armar y desarmar. Y al final, una sola llave para los trinomios.' },
          { t: 'diapo', n: 2 },
          { t: 'pregunta', x: '¿Cuánto es 2x + 3x? ¿Y x² + x?', r: '5x. Lo segundo no se junta: un cuadrado y una tira, como 2 m² + 3 m.' },
          { t: 'diapo', n: 3 },
          { t: 'pregunta', x: '¿x · x es 2x o x²?', r: 'x². 2x es x + x. Es el cruce con el módulo 2: al multiplicar se cuentan las x.' },
          { t: 'diapo', n: 4 },
          { t: 'pregunta', x: 'Con los pedazos tapados: ¿cuánto da 3(x + 2)?', r: '3x + 6. Si dice 3x + 2, revela: el rectángulo muestra el pedazo que falta. El segundo → muestra la advertencia.' },
          { t: 'diapo', n: 5 },
          { t: 'pregunta', x: '¿Cuántos pedazos tiene el rectángulo de (x + 2)(x + 3)?', r: '4. Revela el rectángulo para contarlos. Si dice x² + 6, le faltan los del medio.' },
          { t: 'ojo', x: 'Explicar en vivo: ¿qué pasa con x − 3? No podemos dibujar áreas negativas. El rectángulo es solo para visualizar la lógica. En la práctica usamos el método «todos contra todos» (distributiva con flechas).' },
          { t: 'pizarra', x: 'Abre el pizarrón (B), dibuja el rectángulo de (x + 1)(x + 4) y que te dicte los cuatro pedazos: x², 4x, x y 4. Juntos: x² + 5x + 4.' },
          { t: 'diapo', n: 6 },
          { t: 'tu', x: 'Ahora al revés: le doy los pedazos y usted busca los lados. Eso es factorizar.' },
          { t: 'diapo', n: 7 },
          { t: 'pregunta', x: 'En 12x + 18, ¿son pares los dos? ¿Y después?', r: 'Sí, sale un 2: 2(6x + 9). Después, 6 y 9 están en la tabla del 3: 6(2x + 3). Revela un paso por cada respuesta.' },
          { t: 'tu', x: 'No hace falta el MCM: es lo mismo que simplificar fracciones en el módulo 2.' },
          { t: 'ojo', x: 'Esa aclaración ya no está en la diapositiva: dila de palabra. Si pregunta por el MCM o el MCD, es lo mismo, pero de a poco: no hace falta ver el número más grande de una vez.' },
          { t: 'diapo', n: 8 },
          { t: 'pregunta', x: '¿Qué queda de 4x + 4 si se saca el 4?', r: '4(x + 1). Si dice 4(x) o 4(x + 0), que arme de vuelta: 4 · x = 4x, y falta el otro 4.' },
          { t: 'diapo', n: 9 },
          { t: 'tu', x: 'Ahora usted: comparta la pantalla y abra «Armar y desarmar».' },
          { t: 'accion', x: 'Sal de la pantalla completa (Esc) y deja de compartir.' }
        ]
      },
      {
        tiempo: '12–36 min', titulo: 'Mesa de áreas, retos 1 a 10', comparte: 'Él', ruta: 'index.html#m3-areas', boton: 'Abrir la mesa de áreas',
        pasos: [
          { t: 'ojo', x: 'Cada pedazo se escribe en dos partes: el número y la letra (sin x, x o x²). Si se equivoca en una, la mesa le dice en cuál.' },
          { t: 'el', x: 'Retos 1 y 2: juntar. Toca dos piezas de la misma forma y escribe cuánto da.' },
          { t: 'pregunta', x: 'Reto 2: ¿cuánto es 3x − 5x?', r: '−2x: tiene 3 y debe 5. Si dice 8x o −8x, que lo piense con plata.' },
          { t: 'el', x: 'Retos 3 a 5: armar. Antes de dibujar el rectángulo, predice cómo va a quedar.' },
          { t: 'pregunta', x: 'Reto 4: ¿por qué hay cuatro pedazos?', r: 'Porque son dos términos por dos términos: todos contra todos.' },
          { t: 'pregunta', x: 'Reto 5, (x + 3)(x − 3): ¿qué pasó con los del medio?', r: 'Se anularon: −3x + 3x = 0. Es la diferencia de cuadrados de la parte 2.' },
          { t: 'el', x: 'Retos 6 a 10: desarmar. Toca «Sacar 2», «Sacar 3»… hasta «Ya no se puede».' },
          { t: 'tu', x: 'Antes de tocar «Sacar», dígame por qué está en todos.' },
          { t: 'ojo', x: 'Si toca «Sacar» al azar, la mesa le explica con su caso por qué no (por ejemplo, «9 no es par»). Que lea el mensaje en voz alta.' },
          { t: 'ojo', x: 'El reto 10 no tiene rectángulo, porque tiene un término negativo: se ve cada término dividido entre lo que está en todos. Es la idea real del factor común: el término que divide a los dos.' },
          { t: 'pregunta', x: 'Reto 10, 20t − 5t²: ¿cuándo está la piedra en el suelo?', r: 'Cuando 5t = 0 o cuando 4 − t = 0: en t = 0 y en t = 4. Esto vuelve en el módulo 4.' },
          { t: 'el', x: 'Debajo de la mesa, la tarjeta «Del dibujo al papel»: pasa las flechas de (x + 2)(x − 3) una por una.' },
          { t: 'tu', x: 'Antes de cada flecha, dígame cuánto da. ¿x por menos 3?' },
          { t: 'ojo', x: 'Explícale el porqué: el dibujo sirve para entender, pero ningún lado mide −3. En el papel y en el examen se hace con flechas, y esas sirven con cualquier signo.' }
        ]
      },
      {
        tiempo: '36–41 min', titulo: 'Ideas clave, parte 2: diferencia de cuadrados', comparte: 'Tú', ruta: 'index.html#m3-ideas-p2', boton: 'Abrir la parte 2',
        pasos: [
          { t: 'accion', x: 'Vuelve a compartir: «Ideas clave», parte 2, en pantalla completa.' },
          { t: 'diapo', n: 10 },
          { t: 'pregunta', x: 'A un cuadrado de lado x le quito uno de lado 3. ¿Cuánta área queda?', r: 'x² − 9.' },
          { t: 'diapo', n: 11 },
          { t: 'tu', x: 'Se corta y se reacomoda: queda un rectángulo de x + 3 por x − 3. El área no cambió.' },
          { t: 'diapo', n: 12 },
          { t: 'pregunta', x: '¿Se puede hacer lo mismo con x² + 9?', r: 'No: es una suma.' },
          { t: 'diapo', n: 13 },
          { t: 'tu', x: 'Comparta la pantalla y abra «Diferencia de cuadrados».' }
        ]
      },
      {
        tiempo: '41–49 min', titulo: 'Cortar y mover, y la mesa de cuadrados, retos 1 a 5', comparte: 'Él', ruta: 'index.html#m3-cuadrados', boton: 'Abrir la diferencia de cuadrados',
        pasos: [
          { t: 'el', x: 'Pasa los cuatro pasos de «Cortar y mover» y te los cuenta con sus palabras.' },
          { t: 'el', x: 'Retos 1 a 5 de la mesa de cuadrados.' },
          { t: 'pregunta', x: 'Reto 4: ¿de qué es cuadrado 4x²?', r: 'De 2x: 2x · 2x = 4x². Si dice 4x, que lo multiplique: 4x · 4x = 16x².' },
          { t: 'ojo', x: 'El reto 3 es una suma: la respuesta buena es «No se puede».' }
        ]
      },
      {
        tiempo: '49–58 min', titulo: 'Ideas clave, parte 3: la llave maestra', comparte: 'Tú', ruta: 'index.html#m3-ideas-p3', boton: 'Abrir la parte 3',
        pasos: [
          { t: 'accion', x: 'Comparte: «Ideas clave», parte 3, en pantalla completa.' },
          { t: 'diapo', n: 14 },
          { t: 'pizarra', x: 'La altura está sin factorizar: factorízala en vivo con él, escribiendo sobre la diapositiva (E). Los dos tienen 5 y una t: 20t − 5t² = 5t(4 − t). Después revela (→) para comparar.' },
          { t: 'pregunta', x: '¿Cuándo está la piedra en el suelo?', r: 'En t = 0 y en t = 4: cuando alguno de los factores es 0. El segundo → marca esos puntos en la gráfica.' },
          { t: 'ojo', x: 'Aclárale que aquí «raíz» no es √: es el número que hace cero la expresión. Se usa esa palabra porque es la del examen.' },
          { t: 'diapo', n: 15 },
          { t: 'tu', x: 'Son dos caras de la misma moneda: si factoriza, encuentra las raíces; si encuentra las raíces, arma los paréntesis.' },
          { t: 'pregunta', x: 'Si la raíz es −3, ¿el paréntesis es (x − 3) o (x + 3)?', r: '(x + 3): con x = −3 da −3 + 3 = 0. Que lo pruebe, no que lo memorice.' },
          { t: 'diapo', n: 16 },
          { t: 'tu', x: 'Esta es la única fórmula que hay que saberse hoy. Con ella se factoriza cualquier trinomio con x².' },
          { t: 'diapo', n: 17 },
          { t: 'pizarra', x: 'Escribe «x² − 5x + 6» en el pizarrón (B) y que te dicte a, b y c. Reemplaza tú, con paréntesis, mientras te dicta. Al volver a la diapositiva, revela (→) para comparar.' },
          { t: 'pregunta', x: '¿Cuánto es −(−5)? ¿Y (−5)²?', r: '+5 y +25. Son las trampas del radar. El segundo → muestra la cuenta completa.' },
          { t: 'diapo', n: 18 },
          { t: 'pregunta', x: '¿Qué pasa si adentro de la raíz da negativo?', r: 'No hay raíces: no se factoriza.' },
          { t: 'diapo', n: 19 },
          { t: 'tu', x: 'Con a distinto de 1, la a va adelante. Si una raíz es fracción, la a entra a su paréntesis.' },
          { t: 'diapo', n: 20 },
          { t: 'pregunta', x: '¿Cuál es la primera llave para 2x² − 18?', r: 'El factor común: 2(x² − 9). Después se mira otra vez lo que quedó, y lo abre la diferencia de cuadrados. Si dice «la llave maestra», también abre, pero por el camino largo.' },
          { t: 'diapo', n: 21 },
          { t: 'tu', x: 'Comparta la pantalla y abra «Llave maestra».' }
        ]
      },
      {
        tiempo: '58–76 min', titulo: 'Llave maestra, retos 1 a 3', comparte: 'Él', ruta: 'index.html#m3-llave', boton: 'Abrir la llave maestra',
        pasos: [
          { t: 'ojo', x: 'La llave pide cada cuenta por separado: (b)², 4 · a · c, lo de adentro, la raíz, −b y 2a. La parte que pide titila en la fórmula, y cada resultado la reemplaza: que diga la cuenta en voz alta antes de escribirla. Si ya va rápido, puede desmarcar «Paso por paso».' },
          { t: 'el', x: 'Reto 1: x² + 5x + 6. Al terminar, toca «Comprobar: todos contra todos» y dice cada flecha antes de verla.' },
          { t: 'pregunta', x: '¿Qué tiene que salir al armarlo?', r: 'El trinomio del principio: x² + 5x + 6.' },
          { t: 'el', x: 'Reto 2: con b negativa.' },
          { t: 'ojo', x: 'Si escribe −25 en (−5)², o −5 en −(−5), la mesa le avisa. Es el mismo error del radar: que lo diga con plata.' },
          { t: 'el', x: 'Reto 3: con c negativa.' },
          { t: 'pregunta', x: '¿Cuánto es 1 − (−24)?', r: '25: los dos signos pegados se cambian por un +.' },
          { t: 'el', x: 'Baja a «Dos caras de la misma moneda», copia x² + 5x + 6 y lo pega en la calculadora de GeoGebra.' },
          { t: 'pregunta', x: '¿Dónde choca la curva contra el suelo?', r: 'En −3 y en −2: las raíces que le dio la llave. Por eso (x + 3)(x + 2).' },
          { t: 'ojo', x: 'Si GeoGebra no carga (sin internet), sáltalo: la diapositiva 14 muestra lo mismo con la piedra. Los otros dos trinomios quedan de tarea.' },
          { t: 'ojo', x: 'Los retos 4 a 6 quedan de tarea: adentro da 0, a distinto de 1 y adentro da negativo.' }
        ]
      },
      {
        tiempo: '76–80 min', titulo: 'Práctica y cierre', comparte: 'Los dos', ruta: 'index.html#m3-practica', boton: 'Abrir la práctica',
        pasos: [
          { t: 'tu', x: 'En la práctica, cada ejercicio le pregunta qué llave abre el candado. Haga el chequeo en orden y dígamela en voz alta antes de tocar.' },
          { t: 'el', x: 'Ejercicios 1 a 3.' },
          { t: 'pregunta', x: 'Sin mirar: ¿cuánto es (x + 1)(x + 1)?', r: 'x² + 2x + 1: los dos del medio son x y x.' },
          { t: 'pregunta', x: '¿Cómo es el chequeo?', r: 'Factor común, diferencia de cuadrados y llave maestra, en ese orden. Se usa la que abre el candado, y si abre solo una parte, se mira otra vez lo que quedó.' },
          { t: 'tu', x: 'De tarea quedan los retos 4 a 6 de la llave y los ejercicios 4 a 15 de la práctica. La próxima: física mecánica, el módulo 4.' },
          { t: 'pregunta', x: '¿Qué fue lo más útil de hoy? ¿Qué le costó más?', r: 'Anótalo para preparar la clase 4.' }
        ]
      }
    ],
    ajustes: [
      ['Si te falta tiempo', 'Corta antes de la parte 3: la llave maestra va al principio de la próxima clase. No la apures: es donde más trampas de signos hay.'],
      ['Si te sobra tiempo', 'Los retos 4 y 5 de la llave (adentro da 0 y a distinto de 1), los otros dos trinomios en GeoGebra (el que roza el suelo y el que no llega) o los ejercicios 4 a 6 de la práctica.'],
      ['Si va muy rápido', 'Que desmarque «Paso por paso» en la llave y pase a los ejercicios tipo examen (10 a 13).'],
      ['Si se enreda con los signos', 'Para la llave y que haga una ronda del radar de signos del módulo 2. Después vuelvan al mismo reto.'],
      ['Si pregunta por los casos del colegio', 'El trinomio cuadrado perfecto es el caso en que adentro de la raíz da 0, y el trinomio x² + bx + c sale con la llave. No hace falta aprenderlos aparte.']
    ]
  };
})();
