/* =====================================================================
   Solo para el tutor · guion de la clase 4 (módulo 4, cinemática)
   ---------------------------------------------------------------------
   Lo carga únicamente la página del tutor (tutor-q7m2.html), igual que
   js/tutor.js. Mismo formato de pasos que las clases 1, 2 y 3.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;

  MA.GuiaClase4 = {
    id: 'c4',
    nombre: 'Clase 4',
    titulo: 'Guion de la clase 4',
    entrada: 'Unos 80 minutos por videollamada, en tres bloques cortos de teoría, cada uno justo antes de su herramienta: velocidad constante con el radar de pista; la aceleración, con el mismo radar; y las tres fórmulas como balanzas para despejar. Cierra con las misiones de despegue y de frenado. Si va lento, el corte natural es antes de la parte 3: las fórmulas pueden abrir la próxima clase.',
    diapositivas: () => MA.Clase4.DIAPOSITIVAS,
    claveCheck: 'guia.check.c4',
    antes: [
      'Confirma que en su plataforma ya aparece el módulo 4 como disponible. Si no aparece, falta publicar esta versión.',
      'Que tenga papel, lápiz y la calculadora que va a usar en el examen. En el radar, las fórmulas y los ejercicios básicos va sin ella; en las misiones, con ella.',
      'Prueba antes el radar de pista: el modo libre con los dos tipos de movimiento y un reto con una predicción equivocada, para ver el «Otro vuelo». Prueba también un despeje en «Fórmulas en la balanza».',
      'Repasa de memoria los valores redondos de km/h a m/s: 36 → 10, 72 → 20, 108 → 30, 180 → 50. Sirven para estimar y para detectar un resultado absurdo en la calculadora.',
      'Si hay tiempo antes de empezar, que haga una ronda del radar de signos del módulo 2: el frenado trae −20 ÷ (−5).'
    ],
    objetivos: [
      'Explicar qué significa una velocidad (20 m/s son 20 metros en cada segundo) y usar d = v · t, con sus despejes, convirtiendo km/h a m/s cuando haga falta.',
      'Explicar qué es la aceleración (cuánta velocidad gana o pierde en cada segundo), calcular la velocidad con vf = v₀ + a · t y la distancia con la velocidad promedio o con ½ · a · t².',
      'Traducir el enunciado a datos («parte del reposo», «se detiene», «frena») y resolver un despegue y un frenado en dos pasos: primero el tiempo y después la distancia.'
    ],
    enfoque: [
      'Primero se ve y después se calcula. En el radar, que mire las huellas: parejas con velocidad constante, cada vez más separadas al acelerar y más juntas al frenar. Pregúntale qué ve antes de hablar de fórmulas.',
      'Predecir antes de volar. En cada reto escribe la predicción y el radar se detiene justo en lo que se preguntó. Si falla, el radar explica el error y le da otro vuelo con otros números: no lo dejes copiar el resultado del vuelo anterior.',
      'El error que hay que cazar: multiplicar la velocidad final por el tiempo. Si arranca en 0 y llega a 8 m/s en 4 s, no recorrió 32 m. La salida es la velocidad promedio (de 0 a 8, en promedio 4), que además explica de dónde sale el ½ de la fórmula.',
      'Solo tres fórmulas. Si pregunta por v² = v₀² + 2 · a · d, dile que es una cuarta que sale de juntar estas dos y que la verán más adelante; por ahora, siempre primero el tiempo y después la distancia.',
      'Las fórmulas son balanzas, como en el módulo 1: lo mismo en los dos platos, y primero se quita lo que suma o resta. Que diga la operación en voz alta antes de tocar.',
      'Él quiere resolver de cabeza: úsalo. En la bitácora del radar, que diga el renglón que sigue antes de que aparezca.',
      'Las herramientas son para entender, no para resolver. En la clase 3 se apoyó tanto en la mesa que resolvía solo el paso que le pedía. Por eso, desde el nivel tipo examen no hay botón de herramienta, y las pistas se abren después del primer intento. En las misiones, no le dictes los pasos: que plantee todo en el borrador, de principio a fin, y si se traba, que diga primero qué datos tiene y qué le falta.',
      'Con calculadora aparecen dos trampas nuevas: redondear el tiempo antes de elevarlo al cuadrado y olvidar los paréntesis. Pídele que escriba en el papel lo que va a teclear antes de teclearlo.',
      'Ve despacio. Si a los 45 minutos todavía está en el radar, deja las fórmulas para la próxima clase.'
    ],
    minimo: [
      ['Velocidad', '20 m/s son 20 metros en cada segundo. Con velocidad constante, d = v · t, y despejando, t = d ÷ v y v = d ÷ t.'],
      ['km/h y m/s', 'De km/h a m/s se divide entre 3,6; de m/s a km/h se multiplica. 72 km/h = 20 m/s.'],
      ['Aceleración', 'Cuánta velocidad gana en cada segundo: con 3 m/s², 0 → 3 → 6 → 9. vf = v₀ + a · t. Si frena, la aceleración es negativa.'],
      ['La distancia acelerando', 'Con la velocidad promedio (la mitad entre la del principio y la del final) por el tiempo. Desde el reposo, d = ½ · a · t²; en general, d = v₀ · t + ½ · a · t².'],
      ['Palabras que son datos', 'Parte del reposo: v₀ = 0. Se detiene: vf = 0. Frena: a negativa. Velocidad constante: a = 0.']
    ],
    guion: [
      {
        tiempo: '0–3 min', titulo: 'Apertura', comparte: 'Él', ruta: 'index.html#inicio', boton: 'Abrir el panel general',
        pasos: [
          { t: 'tu', x: 'Hoy empezamos con la física del examen: cómo se mueve un avión en la pista, cuando despega y cuando frena.' },
          { t: 'pregunta', x: 'Si un carro va a 60 km/h, ¿cuántos kilómetros recorre en 2 horas?', r: '120 km. Lo va a decir de cabeza: hoy le ponemos nombre a esa cuenta.' },
          { t: 'pregunta', x: '¿Cuánto es −20 ÷ (−5)?', r: '4: menos entre menos da más. Vuelve en el frenado.' }
        ]
      },
      {
        tiempo: '3–9 min', titulo: 'Ideas clave, parte 1: distancia, velocidad y tiempo', comparte: 'Tú, con la presentación en pantalla completa', ruta: 'index.html#m4-ideas-p1', boton: 'Abrir la parte 1',
        pasos: [
          { t: 'accion', x: 'Comparte tu pantalla, abre «Ideas clave», parte 1, y pulsa «Pantalla completa».' },
          { t: 'ojo', x: 'Las respuestas están tapadas con «?». Primero pregúntale; cuando conteste, pulsa → (o «Revelar»). Si se te adelanta, ← las vuelve a tapar.' },
          { t: 'diapo', n: 1 },
          { t: 'tu', x: 'Tres datos describen cualquier movimiento en línea recta. Con ellos vamos a calcular cuánta pista necesita un avión.' },
          { t: 'diapo', n: 2 },
          { t: 'pregunta', x: '¿Qué quiere decir 20 m/s?', r: '20 metros en cada segundo. Si dice «20 metros por segundo», pídele que lo diga con «cada»: es la idea que usa todo el radar.' },
          { t: 'diapo', n: 3 },
          { t: 'pregunta', x: 'A 20 m/s, ¿dónde está a los 3 s?', r: '60 m. El primer → muestra la huella; el segundo, la fórmula d = v · t.' },
          { t: 'diapo', n: 4 },
          { t: 'pregunta', x: '¿72 km/h cuánto es en m/s? ¿Y 50 m/s en km/h?', r: '20 m/s y 180 km/h. Si duda, que recuerde la mesa de conversión del módulo 1: el 3,6 sale de 3600 ÷ 1000.' },
          { t: 'diapo', n: 5 },
          { t: 'tu', x: 'Ahora usted: comparta la pantalla y abra «Radar de pista».' },
          { t: 'accion', x: 'Sal de la pantalla completa (Esc) y deja de compartir.' }
        ]
      },
      {
        tiempo: '9–21 min', titulo: 'Radar de pista: modo libre y retos 1 a 3', comparte: 'Él', ruta: 'index.html#m4-radar', boton: 'Abrir el radar de pista',
        pasos: [
          { t: 'el', x: 'Modo libre, velocidad constante: mueve la velocidad y despega dos o tres veces.' },
          { t: 'pregunta', x: '¿Cómo quedaron las huellas? ¿Qué tiene de raro la columna «En ese segundo»?', r: 'Parejas, y la columna repite siempre el mismo número: la velocidad.' },
          { t: 'el', x: 'Retos 1 a 3. Antes de cada vuelo escribe la predicción y la dice en voz alta.' },
          { t: 'ojo', x: 'Si falla, lee el mensaje en voz alta y toca «Otro vuelo»: son otros números, así que tiene que volver a pensarlo.' },
          { t: 'pregunta', x: 'Reto 2: ¿cuántas veces cabe 20 en 100?', r: '5: es t = d ÷ v, el despeje del módulo 1.' },
          { t: 'ojo', x: 'En el reto 3 la predicción es la velocidad, y el radar vuela con ella: si se equivoca, ve si llega antes o después a la marca.' },
          { t: 'ojo', x: 'Al terminar el reto 3 aparece «Seguir con las ideas clave, parte 2». Ahí vuelves a compartir tú.' }
        ]
      },
      {
        tiempo: '21–28 min', titulo: 'Ideas clave, parte 2: la aceleración', comparte: 'Tú', ruta: 'index.html#m4-ideas-p2', boton: 'Abrir la parte 2',
        pasos: [
          { t: 'accion', x: 'Vuelve a compartir: «Ideas clave», parte 2, en pantalla completa.' },
          { t: 'diapo', n: 6 },
          { t: 'pregunta', x: 'Con 3 m/s², ¿qué velocidad lleva a los 3 s? ¿Y a los 4?', r: '9 y 12. Un → por cada respuesta.' },
          { t: 'diapo', n: 7 },
          { t: 'pregunta', x: 'Va a 10 m/s y gana 2 m/s cada segundo durante 5 s. ¿A qué velocidad termina?', r: '20 m/s. El primer → cambia las letras por los números; el segundo, el resultado.' },
          { t: 'diapo', n: 8 },
          { t: 'pregunta', x: 'Recorrió 1, 3 y 5 m. ¿Cuánto recorre en el cuarto segundo?', r: '7 m: cada segundo, 2 m más. El segundo → muestra el total: 1, 4, 9, 16.' },
          { t: 'diapo', n: 9 },
          { t: 'pregunta', x: 'De 0 a 8 m/s, ¿a qué velocidad fue en promedio? ¿Cuánto recorrió en 4 s?', r: '4 m/s y 16 m. Si dice 32, revela la advertencia: es el error más común del examen.' },
          { t: 'diapo', n: 10 },
          { t: 'pregunta', x: 'Si pierde 5 m/s cada segundo, ¿en cuántos segundos se detiene?', r: '4 s: 20 → 15 → 10 → 5 → 0.' },
          { t: 'diapo', n: 11 },
          { t: 'tu', x: 'Comparta la pantalla y vuelva al radar, ahora con aceleración.' }
        ]
      },
      {
        tiempo: '28–43 min', titulo: 'Radar de pista: con aceleración, retos 4 a 7', comparte: 'Él', ruta: 'index.html#m4-radar', boton: 'Abrir el radar de pista',
        pasos: [
          { t: 'el', x: 'Modo libre con aceleración: despega con 2 m/s² y después con 5 m/s². Prueba también velocidad inicial 30 y aceleración −5.' },
          { t: 'pregunta', x: '¿Qué pasa con las huellas cuando acelera? ¿Y cuando frena?', r: 'Se separan; al frenar, se juntan. La columna «En ese segundo» crece (o baja) siempre lo mismo.' },
          { t: 'el', x: 'Retos 4 a 7, con predicción.' },
          { t: 'pregunta', x: 'Reto 5: antes de escribir, ¿a qué velocidad fue en promedio?', r: 'La mitad de la velocidad final. Si escribe la velocidad final por el tiempo, el radar se lo explica.' },
          { t: 'ojo', x: 'Retos 6 y 7: frenado. Si escribe un tiempo negativo, es el radar de signos: −20 ÷ (−5) = +4.' },
          { t: 'ojo', x: 'Al terminar el reto 7 aparece «Seguir con las ideas clave, parte 3».' }
        ]
      },
      {
        tiempo: '43–50 min', titulo: 'Ideas clave, parte 3: fórmulas y balanzas', comparte: 'Tú', ruta: 'index.html#m4-ideas-p3', boton: 'Abrir la parte 3',
        pasos: [
          { t: 'accion', x: 'Comparte: «Ideas clave», parte 3, en pantalla completa.' },
          { t: 'diapo', n: 12 },
          { t: 'tu', x: 'Todo lo que hizo en el radar cabe en tres fórmulas. Y cada fórmula es una balanza, como en el módulo 1.' },
          { t: 'diapo', n: 13 },
          { t: 'pregunta', x: 'Con a = 2 y t = 4, ¿cuánto da ½ · a · t²?', r: '16 m: lo mismo que en el reto 5 del radar con el promedio.' },
          { t: 'diapo', n: 14 },
          { t: 'pregunta', x: 'Para dejar sola la t en d = v · t, ¿qué se hace en los dos platos?', r: 'Dividir entre v. El segundo → lo muestra leído al revés: t = d ÷ v.' },
          { t: 'diapo', n: 15 },
          { t: 'pregunta', x: '¿Qué dato esconde «parte del reposo»? ¿Y «se detiene»? ¿Y «frena»? ¿Y «velocidad constante»?', r: 'v₀ = 0, vf = 0, aceleración negativa y a = 0. Un → por cada respuesta.' },
          { t: 'diapo', n: 16 },
          { t: 'pregunta', x: 'La piedra del módulo 3: h = 20t − 5t². ¿Cuánto valen v₀ y a?', r: 'v₀ = 20 m/s y a = −10 m/s², porque ½ · (−10) = −5. Es la gravedad: la caída libre viene después.' },
          { t: 'diapo', n: 17 },
          { t: 'tu', x: 'Comparta la pantalla y abra «Fórmulas en la balanza».' }
        ]
      },
      {
        tiempo: '50–65 min', titulo: 'Fórmulas en la balanza, retos 1 a 6', comparte: 'Él', ruta: 'index.html#m4-formulas', boton: 'Abrir las fórmulas',
        pasos: [
          { t: 'el', x: 'Mira las tres tarjetas y después los retos 1 a 6. En cada paso elige qué se hace en los dos platos.' },
          { t: 'tu', x: 'Antes de tocar, dígame qué operación va y por qué.' },
          { t: 'ojo', x: 'Si elige una opción equivocada, la mesa le explica por qué y la desactiva. Que lea el mensaje en voz alta antes de elegir otra.' },
          { t: 'pregunta', x: 'Reto 3: ¿por qué primero se resta la v₀?', r: 'La regla de oro del módulo 1: primero lo que suma o resta, después lo que multiplica o divide.' },
          { t: 'ojo', x: 'Cada reto termina con una comprobación con los números de un reto del radar: el resultado lo escribe él. En el 4 aparece otra vez −20 ÷ (−5).' },
          { t: 'pregunta', x: 'Reto 6: la t está al cuadrado. ¿Qué la deja sola?', r: 'La raíz. Si dice «dividir entre 2», es el error del módulo 2: el exponente no multiplica.' }
        ]
      },
      {
        tiempo: '65–80 min', titulo: 'Entrenamiento: misiones de despegue y frenado, y cierre', comparte: 'Los dos', ruta: 'index.html#m4-entrenamiento', boton: 'Abrir el entrenamiento',
        pasos: [
          { t: 'tu', x: 'Las misiones son como las del examen: varios pasos, con calculadora y sin ayuda al principio. Plantéelo completo en el papel y después lo comprueba.' },
          { t: 'el', x: 'Ejercicio 10, misión 1: el despegue. Escribe los datos en el borrador, pasa la velocidad a m/s y plantea el tiempo y la distancia antes de teclear.' },
          { t: 'ojo', x: 'Las pistas se abren después del primer intento y dicen qué pensar, no hacen las cuentas. No hay botón del radar: lo tiene que resolver él. Si se traba, pregúntale qué datos tiene y qué le falta, sin darle números.' },
          { t: 'pregunta', x: '¿Por qué no es 75 por el tiempo?', r: 'Porque no fue todo el tiempo a 75 m/s: arrancó en 0. En promedio fue a 37,5 m/s. Da unos 1339 m.' },
          { t: 'ojo', x: 'Si le da 1361, redondeó el tiempo a 36 s antes de elevarlo al cuadrado: la plataforma se lo dice. Que use el tiempo con todos sus decimales o la memoria de la calculadora.' },
          { t: 'el', x: 'Ejercicio 11, misión 2: el frenado.' },
          { t: 'pregunta', x: 'Sin mirar: si el tiempo se duplica desde el reposo, ¿qué pasa con la distancia?', r: 'Se cuadruplica: la t va al cuadrado.' },
          { t: 'tu', x: 'De tarea quedan la misión 3 (la pista corta) y los ejercicios 1 a 9.' },
          { t: 'pregunta', x: '¿Qué fue lo más útil de hoy? ¿Qué le costó más?', r: 'Anótalo para preparar la próxima clase.' }
        ]
      }
    ],
    ajustes: [
      ['Si te falta tiempo', 'Corta antes de la parte 3: las fórmulas en la balanza abren la próxima clase. Lo que no se puede saltar es el promedio (diapositiva 9 y reto 5 del radar).'],
      ['Si te sobra tiempo', 'La misión 3 (la pista corta) o los ejercicios tipo examen 7 a 9.'],
      ['Si va muy rápido', 'Que salte al entrenamiento: ejercicios 7 a 12, sin herramientas. El 7 es la pregunta típica de «el doble de tiempo».'],
      ['Si se apoya en la herramienta para todo', 'En los ejercicios básicos e intermedios el botón de la herramienta está a la vista: pídele que lo intente primero sin abrirlo y que lo use solo para comprobar.'],
      ['Si se enreda con los signos del frenado', 'Una ronda del radar de signos del módulo 2 y vuelvan al reto 6 del radar.'],
      ['Si pregunta por v² = v₀² + 2 · a · d', 'Es cierta y sirve para frenados, pero sale de juntar las otras dos. Por ahora basta con tiempo primero y distancia después.']
    ]
  };
})();
