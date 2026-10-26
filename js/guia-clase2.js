/* =====================================================================
   SOLO PARA EL TUTOR · guion de la clase 2 (módulo 2, primera parte)
   ---------------------------------------------------------------------
   Lo carga únicamente la página del tutor (tutor-q7m2.html), igual que
   js/tutor.js. Mismo formato de pasos que la clase 1.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;

  MA.GuiaClase2 = {
    id: 'c2',
    nombre: 'Clase 2',
    titulo: 'Guion de la clase 2',
    entrada: 'Unos 80 minutos por videollamada: calentamiento con el módulo 1 y, del módulo 2, fracciones, signos, orden de las operaciones y potencias. La factorización queda para la clase 3. Igual que la clase pasada, cada bloque corto de teoría va justo antes de su herramienta.',
    diapositivas: () => MA.Clase2.DIAPOSITIVAS,
    claveCheck: 'guia.check.c2',
    antes: [
      'Confirma que en su plataforma ya aparece el módulo 2 como disponible. Si no aparece, falta publicar esta versión.',
      'Que tenga papel, lápiz y nada de calculadora.',
      'Prueba antes las tres herramientas nuevas (Fracciones, Signos y orden, Potencias): en las tres hay que predecir antes de tocar.',
      'Ten a mano lo que anotaste al final de la clase 1: lo que le costó (fracciones de unidades, N y J) se trabaja hoy.'
    ],
    objetivos: [
      'Dividir entre una fracción con extremos y medios, y explicar por qué km ÷ km/h da horas.',
      'Resolver expresiones con signos y paréntesis en el orden correcto, diciendo por qué cada operación va antes.',
      'Pasar números a notación científica y multiplicar potencias de 10 sin calculadora.'
    ],
    enfoque: [
      'Él quiere resolver de cabeza. No se lo prohíbas: úsalo. Pídele primero la respuesta de cabeza y después que la compruebe en papel.',
      'Cuando coincidan, felicítalo. Cuando no, que sea él quien encuentre dónde se saltó el paso. Así el papel deja de ser una imposición y se vuelve su forma de verificar.',
      'Antes de cada clic, pídele una predicción en voz alta («¿qué va a pasar?»). Las herramientas nuevas también la piden.',
      'Si aparece una unidad desconocida (N, J, W), no es para memorizar: el examen la da. Lo que tiene que saber es tratarla como cualquier unidad.'
    ],
    minimo: [
      ['Una fracción es una división', 'La raya es un ÷: km/h es km ÷ h.'],
      ['Dividir entre una fracción', 'Una encima de la otra: extremos arriba, medios abajo. Lo que está abajo del abajo, sube.'],
      ['Signos', 'Sumar y restar: plata. Multiplicar y dividir: iguales +, distintos −. Restar un negativo es sumar.'],
      ['Orden', 'Paréntesis, potencias, multiplicar y dividir (de izquierda a derecha), sumar y restar (de izquierda a derecha).'],
      ['Potencias de 10', 'Al multiplicar se suman los exponentes; 10⁻³ = 1/1000. Si la coma se mueve, el exponente compensa.']
    ],
    guion: [
      {
        tiempo: '0–3 min', titulo: 'Apertura', comparte: 'Él', ruta: 'index.html#inicio', boton: 'Abrir el panel general',
        pasos: [
          { t: 'tu', x: 'Hoy vamos con fracciones, signos y potencias: las cuentas que aparecen dentro de cada fórmula. Pero primero, un calentamiento con lo de la clase pasada.' },
          { t: 'el', x: 'Comparte la pantalla en el panel general: se ve cuánto avanzó en el módulo 1.' },
          { t: 'pregunta', x: '¿Qué ejercicio de la tarea se le hizo más difícil?', r: 'Anótalo. Si es de fracciones de unidades o de N y J, se ve hoy.' },
          { t: 'ojo', x: 'Si no hizo la tarea, no la repases ahora: el calentamiento muestra lo que falta. Lo pendiente del módulo 1 queda para la casa.' }
        ]
      },
      {
        tiempo: '3–15 min', titulo: 'Calentamiento: de cabeza y en papel', comparte: 'Él', ruta: 'index.html#m2-calentamiento', boton: 'Abrir el calentamiento',
        pasos: [
          { t: 'tu', x: 'Cinco conversiones. Primero de cabeza, rápido, como le gusta. Después en papel, con factores. No es para ver si la cabeza está mal: es para ver cuándo se equivoca.' },
          { t: 'el', x: 'Hace la 1 (3,5 km a m): de cabeza y en papel.' },
          { t: 'ojo', x: 'La 2, la 3 y la 4 están armadas para que la cabeza falle (1,45 h, 50 cm², 150 min). No le avises.' },
          { t: 'ojo', x: 'En papel, exígele los factores completos con las unidades tachadas, aunque ya sepa el número. «Muéstreme la hoja por la cámara.»' },
          { t: 'pregunta', x: 'Cuando no coincidan: ¿dónde se saltó un paso la cabeza?', r: '2: el tiempo va de 60 en 60. 3: el área lleva el factor dos veces. 4: 1,5 h es hora y media, no 1 h 50 min.' },
          { t: 'pregunta', x: 'En la 4: ¿por qué 1200 km ÷ 800 km/h da horas y no km?', r: 'Si no lo sabe, mejor: es justo lo que sigue en la parte 1.' },
          { t: 'pregunta', x: 'Mire el marcador: de cabeza le salieron tantas, en papel todas. ¿Para qué cree que sirve escribir?', r: 'Que lo diga él: para no saltarse pasos, para revisar.' },
          { t: 'ojo', x: 'Si saca 5 de 5 de cabeza, felicítalo de verdad y sube el ritmo: pasa rápido por la parte 1.' }
        ]
      },
      {
        tiempo: '15–21 min', titulo: 'Ideas clave, parte 1: fracciones', comparte: 'Tú, con la presentación en pantalla completa', ruta: 'index.html#m2-ideas-p1', boton: 'Abrir la parte 1',
        pasos: [
          { t: 'accion', x: 'Comparte tu pantalla, abre «Ideas clave», parte 1, y pulsa «Pantalla completa».' },
          { t: 'diapo', n: 1 },
          { t: 'tu', x: 'Hoy son tres cosas: fracciones, signos y potencias. Lo de fracciones es lo que nos enredó la clase pasada con los km/h.' },
          { t: 'diapo', n: 2 },
          { t: 'pregunta', x: '¿Cuánto es 3/4 escrito como división?', r: '3 ÷ 4 = 0,75.' },
          { t: 'tu', x: 'km/h se lee «kilómetros por hora», pero significa km dividido entre h. La raya siempre es un ÷.' },
          { t: 'diapo', n: 3 },
          { t: 'pregunta', x: 'En 2/3 · 9/4, ¿qué se puede tachar antes de multiplicar?', r: 'El 2 con el 4 (entre 2) y el 3 con el 9 (entre 3). Queda 3/2.' },
          { t: 'diapo', n: 4 },
          { t: 'pregunta', x: '¿Cuántas mitades salen de 6 pizzas?', r: '12.' },
          { t: 'tu', x: 'Entonces 6 ÷ ½ = 12. Dividir entre algo menor que 1 agranda el número.' },
          { t: 'tu', x: 'Para hacerlo en papel: una fracción encima de la otra, y al 6 se le pone un 1 abajo. Los de las puntas, los extremos, se multiplican arriba; los del medio, abajo. Es la del colegio, la del sándwich: el pan arriba, el relleno abajo.' },
          { t: 'pregunta', x: 'En 6/1 sobre 1/2, ¿cuáles son los extremos?', r: 'El 6 y el 2: van arriba. Los medios, 1 y 1, abajo. 12/1 = 12, igual que con las mitades.' },
          { t: 'ojo', x: 'Si en un video o con la IA le explican «multiplicar por el inverso», dile que es la misma regla con otras palabras (6 · 2/1 = 12). Que use la que le quede más fácil; en la plataforma está extremos y medios.' },
          { t: 'ojo', x: 'Esto es lo que la clase pasada no salió bien. Ve lento: que él diga el porqué con sus palabras antes de seguir.' },
          { t: 'pizarra', x: 'Abre el pizarrón (B) y escribe «1 ÷ (1/h)». Pregúntale cuánto da. Espera «h». Después escribe «km ÷ (km/h)».' },
          { t: 'diapo', n: 5 },
          { t: 'pregunta', x: '¿Por qué la h termina arriba?', r: 'Porque estaba abajo del abajo: es un extremo, y los extremos van arriba.' },
          { t: 'ojo', x: 'Si se enreda, vuelve a los números: 6 ÷ ½. Las unidades se portan igual que los números.' },
          { t: 'diapo', n: 6 },
          { t: 'tu', x: 'Ahora usted: comparta la pantalla y abra «Fracciones».' },
          { t: 'accion', x: 'Sal de la pantalla completa (Esc) y deja de compartir.' }
        ]
      },
      {
        tiempo: '21–33 min', titulo: 'Mesa de fracciones, retos 1 a 7', comparte: 'Él', ruta: 'index.html#m2-fracciones', boton: 'Abrir la mesa de fracciones',
        pasos: [
          { t: 'ojo', x: 'La mesa pide dos cosas antes de resolver: en qué unidad va a quedar (retos 4 a 7) y cuáles son los extremos. No le soples: que diga en voz alta por qué.' },
          { t: 'el', x: 'Retos 1 a 3: solo números.' },
          { t: 'pregunta', x: 'Reto 2: ¿qué tacha primero?', r: 'Los 3 (entre 3) y después el 8 con el 4 (entre 4). Queda 2.' },
          { t: 'pregunta', x: 'Reto 4, antes de tocar: ¿en qué unidad va a quedar 150 km ÷ 60 km/h?', r: 'h. Si dice km²/h o km, déjalo: al final la mesa le muestra dónde se equivocó.' },
          { t: 'pregunta', x: 'Reto 6: ¿qué es un vatio?', r: 'J/s, joules por segundo. Está en el enunciado: no hace falta saberlo de memoria.' },
          { t: 'tu', x: 'En el examen pasa lo mismo con N o J: si aparecen, dan la fórmula. Usted solo tiene que tratarlas como unidades.' },
          { t: 'pregunta', x: 'Reto 7: ¿por qué queda m/s² y no m?', r: 'Porque la s que divide lleva un 1 abajo: las dos s son medios y quedan abajo, s · s = s².' },
          { t: 'pizarra', x: 'Si sobra un minuto, escribe «F = m · a, con m en kg y a en m/s²». Pregúntale qué unidad tiene la fuerza. Espera «kg · m/s²», y dile: «Eso es un newton, N».' }
        ]
      },
      {
        tiempo: '33–39 min', titulo: 'Ideas clave, parte 2: signos y orden', comparte: 'Tú', ruta: 'index.html#m2-ideas-p2', boton: 'Abrir la parte 2',
        pasos: [
          { t: 'accion', x: 'Vuelve a compartir: «Ideas clave», parte 2, en pantalla completa.' },
          { t: 'diapo', n: 7 },
          { t: 'pregunta', x: 'Debe 5 y paga 3: ¿cuánto debe?', r: '2: −5 + 3 = −2.' },
          { t: 'pregunta', x: '¿Y 7 − (−2)?', r: '9: le perdonan una deuda.' },
          { t: 'diapo', n: 8 },
          { t: 'pregunta', x: '¿(−3)² y −3² son lo mismo?', r: 'No: 9 y −9.' },
          { t: 'ojo', x: 'Es la trampa de signos más común en el examen. Que la anote en su hoja.' },
          { t: 'diapo', n: 9 },
          { t: 'pregunta', x: 'En 2 + 3 · 4², ¿qué hace primero?', r: 'La potencia: 4² = 16. Después 3 · 16 y al final la suma: 50.' },
          { t: 'diapo', n: 10 },
          { t: 'pregunta', x: 'Antes de mostrarla: ¿cuánto da 8 ÷ 4 · 2?', r: '4. Si dice 1, mejor: la diapositiva explica por qué.' },
          { t: 'diapo', n: 11 },
          { t: 'tu', x: 'Comparta la pantalla y abra «Signos y orden».' }
        ]
      },
      {
        tiempo: '39–52 min', titulo: 'Mesa de operaciones, retos 1 a 9', comparte: 'Él', ruta: 'index.html#m2-operaciones', boton: 'Abrir la mesa de operaciones',
        pasos: [
          { t: 'tu', x: 'Toque la operación que va primero y escriba cuánto da. Antes de tocar, dígame por qué esa.' },
          { t: 'ojo', x: 'Si toca una que todavía no va, la mesa explica qué va antes. Que lea el mensaje en voz alta.' },
          { t: 'el', x: 'Retos 1 a 3: signos.' },
          { t: 'pregunta', x: 'Reto 3, (−3) · 4 − (−2) · 5: ¿dónde están las trampas?', r: 'En los signos de las multiplicaciones y al final, en restar −10.' },
          { t: 'el', x: 'Retos 4 a 7: orden.' },
          { t: 'pregunta', x: 'Reto 7: ¿por qué da 0?', r: '−3² = −9 y (−3)² = 9.' },
          { t: 'ojo', x: 'Si ya va rápido, puede desmarcar «Escribir cada resultado» y solo elegir el orden. Si se equivoca en las cuentas, que lo vuelva a marcar.' },
          { t: 'el', x: 'Retos 8 y 9, si hay tiempo.' }
        ]
      },
      {
        tiempo: '52–58 min', titulo: 'Ideas clave, parte 3: potencias', comparte: 'Tú', ruta: 'index.html#m2-ideas-p3', boton: 'Abrir la parte 3',
        pasos: [
          { t: 'accion', x: 'Comparte: «Ideas clave», parte 3, en pantalla completa.' },
          { t: 'diapo', n: 12 },
          { t: 'pregunta', x: '¿Cuánto es x² · x³? Cuente las x.', r: 'x⁵.' },
          { t: 'pregunta', x: '¿Y x⁵ / x²?', r: 'x³: se tachan dos parejas.' },
          { t: 'diapo', n: 13 },
          { t: 'tu', x: 'Cada vez que el exponente baja 1, se divide entre 10. Por eso 10⁰ = 1 y 10⁻¹ = 0,1.' },
          { t: 'pregunta', x: '¿Qué prefijo del módulo 1 es 10⁻³?', r: 'Mili.' },
          { t: 'diapo', n: 14 },
          { t: 'pregunta', x: 'Si la coma va a la izquierda, ¿el número crece o se achica? ¿Y el exponente?', r: 'Se achica; el exponente sube para compensar.' },
          { t: 'diapo', n: 15 },
          { t: 'pregunta', x: '¿Cuánto es (3 × 10⁴) · (2 × 10⁻⁶)?', r: '6 × 10⁻².' },
          { t: 'diapo', n: 16 },
          { t: 'tu', x: 'Comparta la pantalla y abra «Potencias».' }
        ]
      },
      {
        tiempo: '58–68 min', titulo: 'Corredor de la coma, retos 1 a 6', comparte: 'Él', ruta: 'index.html#m2-potencias', boton: 'Abrir el corredor',
        pasos: [
          { t: 'ojo', x: 'Antes de mover, la herramienta pregunta hacia dónde va la coma y si el exponente sube o baja. Es justo lo que hay que razonar en el examen.' },
          { t: 'el', x: 'Retos 1 a 4: a notación científica.' },
          { t: 'pregunta', x: 'Reto 3, 0,00008: ¿cuántos lugares se mueve la coma?', r: '5: queda 8 × 10⁻⁵.' },
          { t: 'el', x: 'Retos 5 y 6: al revés, sin potencia de 10.' },
          { t: 'pregunta', x: '¿Cómo lo revisa sin la herramienta?', r: 'Contando lugares: el exponente dice cuántos.' }
        ]
      },
      {
        tiempo: '68–78 min', titulo: 'Práctica, ejercicios 1 a 6', comparte: 'Él, trabajando en papel', ruta: 'index.html#m2-practica', boton: 'Abrir la práctica',
        pasos: [
          { t: 'tu', x: 'Primero en papel y después escribe el resultado. Muéstreme la hoja antes de comprobar.' },
          { t: 'el', x: 'Resuelve los ejercicios 1 a 6.' },
          { t: 'ojo', x: 'Varios ejercicios tienen un botón para probarlos en la herramienta. Solo si se traba.' },
          { t: 'pregunta', x: 'Cuando la plataforma marque un error: ¿qué pasó?', r: 'Que lo nombre: signo, orden o fracción.' }
        ]
      },
      {
        tiempo: '78–82 min', titulo: 'Cierre', comparte: 'Los dos', ruta: 'index.html#m2-practica', boton: 'Abrir la práctica',
        pasos: [
          { t: 'tu', x: 'Sin mirar la plataforma, cuatro preguntas rápidas.' },
          { t: 'pregunta', x: '¿Cuánto es 1 ÷ ¼?', r: '4.' },
          { t: 'pregunta', x: '¿En qué unidad queda m ÷ (m/s)?', r: 's.' },
          { t: 'pregunta', x: '¿(−2)²? ¿Y −2²?', r: '4 y −4.' },
          { t: 'pregunta', x: '¿0,003 en notación científica?', r: '3 × 10⁻³.' },
          { t: 'tu', x: 'De tarea quedan los ejercicios 7 a 16. La próxima clase: factorización.' },
          { t: 'pregunta', x: '¿Qué fue lo más útil de hoy? ¿Qué le costó más?', r: 'Anótalo para preparar la clase 3.' }
        ]
      }
    ],
    ajustes: [
      ['Si te falta tiempo', 'Deja los retos 8 y 9 de operaciones y los 5 y 6 de la coma para la tarea. No recortes el calentamiento ni las fracciones: es lo que más le costó.'],
      ['Si te sobra tiempo', 'Ejercicios 10 a 12 de la práctica (tipo examen) o el reto 15.'],
      ['Si va muy rápido', 'Si las preguntas de las partes 2 y 3 le salen solas, pasa rápido por las diapositivas y quédate más en la práctica tipo examen.'],
      ['Si se resiste a escribir', 'No discutas. Pídele la respuesta de cabeza y después: «Demuéstremelo en el papel». Si coinciden, celébralo.']
    ]
  };
})();
