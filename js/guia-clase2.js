/* =====================================================================
   SOLO PARA EL TUTOR · guion de la clase 2 (módulo 2, álgebra básica)
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
    entrada: 'Unos 80 minutos por videollamada, a un ritmo más pausado que la clase 1: fracciones (las cuatro operaciones), signos y orden de las operaciones, y potencias con letras. La factorización es el módulo 3 y la notación científica llega en el módulo 5, con la química. Igual que la clase pasada, cada bloque corto de teoría va justo antes de su herramienta.',
    diapositivas: () => MA.Clase2.DIAPOSITIVAS,
    claveCheck: 'guia.check.c2',
    antes: [
      'Confirma que en su plataforma ya aparece el módulo 2 como disponible. Si no aparece, falta publicar esta versión.',
      'Que tenga papel, lápiz y nada de calculadora.',
      'Prueba antes las cuatro mesas: sumas y restas, multiplicar y dividir, operaciones y exponentes. En todas hay que decidir o predecir antes de tocar.',
      'Ten a mano lo que anotaste al final de la clase 1: lo que le costó (fracciones de unidades, N y J) se trabaja hoy.'
    ],
    objetivos: [
      'Sumar y restar fracciones (mismo abajo o mariposa), multiplicarlas y dividirlas con extremos y medios, y explicar por qué km ÷ km/h da horas.',
      'Resolver expresiones con signos y paréntesis en el orden correcto, diciendo por qué cada operación va antes.',
      'Simplificar expresiones con potencias de letras contando: al multiplicar se suman los exponentes y al dividir se restan.'
    ],
    enfoque: [
      'Ve despacio. Es mejor que termine pocas cosas bien entendidas que todas a medias: lo que no alcance queda de tarea y no pasa nada.',
      'Él quiere resolver de cabeza. No se lo prohíbas: úsalo. Pídele primero la respuesta de cabeza y después que la compruebe en papel.',
      'Cuando coincidan, felicítalo. Cuando no, que sea él quien encuentre dónde se saltó el paso.',
      'Antes de cada clic, pídele una predicción en voz alta («¿qué va a pasar?»). Las mesas también la piden.',
      'Si aparece una unidad desconocida (N, J, W), no es para memorizar: el examen la da. Lo que tiene que saber es tratarla como cualquier unidad.'
    ],
    minimo: [
      ['Una fracción es una división', 'La raya es un ÷: km/h es km ÷ h.'],
      ['Sumar y restar fracciones', 'Mismo abajo: se suman los de arriba. Distinto abajo: la mariposa (en cruz arriba, abajo con abajo). Al final, simplificar.'],
      ['Multiplicar y dividir fracciones', 'Multiplicar: arriba con arriba, abajo con abajo. Dividir: una encima de la otra, extremos arriba y medios abajo. Lo que está abajo del abajo, sube.'],
      ['Signos y orden', 'Sumar y restar: plata. Multiplicar y dividir: iguales +, distintos −. Paréntesis, potencias, multiplicar y dividir, sumar y restar (de izquierda a derecha).'],
      ['Potencias con letras', 'El exponente cuenta. Al multiplicar se suman, al dividir se restan. Números con números, letras con letras.']
    ],
    guion: [
      {
        tiempo: '0–3 min', titulo: 'Apertura', comparte: 'Él', ruta: 'index.html#inicio', boton: 'Abrir el panel general',
        pasos: [
          { t: 'tu', x: 'Hoy vamos con fracciones, signos y potencias: las cuentas que aparecen dentro de cada fórmula. Vamos con calma, una cosa a la vez.' },
          { t: 'el', x: 'Comparte la pantalla en el panel general: se ve cuánto avanzó en el módulo 1 y la ruta nueva de seis módulos.' },
          { t: 'pregunta', x: '¿Qué ejercicio de la tarea se le hizo más difícil?', r: 'Anótalo. Si es de fracciones de unidades o de N y J, se ve hoy.' },
          { t: 'ojo', x: 'Si no hizo la tarea, no la repases ahora. Lo pendiente del módulo 1 queda para la casa.' }
        ]
      },
      {
        tiempo: '3–11 min', titulo: 'Ideas clave, parte 1: fracciones', comparte: 'Tú, con la presentación en pantalla completa', ruta: 'index.html#m2-ideas-p1', boton: 'Abrir la parte 1',
        pasos: [
          { t: 'accion', x: 'Comparte tu pantalla, abre «Ideas clave», parte 1, y pulsa «Pantalla completa».' },
          { t: 'diapo', n: 1 },
          { t: 'tu', x: 'Hoy son tres cosas: fracciones, signos y potencias. Lo de fracciones es lo que nos enredó la clase pasada con los km/h.' },
          { t: 'diapo', n: 2 },
          { t: 'pregunta', x: '¿Cuánto es 3/4 escrito como división?', r: '3 ÷ 4 = 0,75.' },
          { t: 'diapo', n: 3 },
          { t: 'pregunta', x: 'Antes de mostrar la tarjeta roja: ¿cuánto es medio más un tercio?', r: 'Si dice 2/5, mejor: la tarjeta muestra por qué es imposible (2/5 es menos que medio).' },
          { t: 'diapo', n: 4 },
          { t: 'tu', x: 'La mariposa: las dos multiplicaciones en cruz van arriba y la de abajo con abajo va abajo. Es la del colegio.' },
          { t: 'pizarra', x: 'Abre el pizarrón (B) y escribe «2/3 + 1/4». Que te dicte las tres multiplicaciones: 8, 3 y 12. Resultado: 11/12.' },
          { t: 'diapo', n: 5 },
          { t: 'pregunta', x: 'En 2/3 · 9/4, ¿qué se puede tachar antes de multiplicar?', r: 'El 2 con el 4 (entre 2) y el 3 con el 9 (entre 3). Queda 3/2.' },
          { t: 'ojo', x: 'La confusión típica: multiplicar en cruz (eso es la mariposa, para sumar). La mesa le pregunta justo eso.' },
          { t: 'diapo', n: 6 },
          { t: 'pregunta', x: '¿Cuántas mitades salen de 6 pizzas?', r: '12. Entonces 6 ÷ ½ = 12: dividir entre algo menor que 1 agranda el número.' },
          { t: 'pregunta', x: 'En 6/1 sobre 1/2, ¿cuáles son los extremos?', r: 'El 6 y el 2: van arriba. Los medios, 1 y 1, abajo. 12/1 = 12.' },
          { t: 'ojo', x: 'Si en un video o con la IA le explican «multiplicar por el inverso», dile que es la misma regla con otras palabras. En la plataforma está extremos y medios.' },
          { t: 'diapo', n: 7 },
          { t: 'pregunta', x: '¿Por qué la h termina arriba?', r: 'Porque estaba abajo del abajo: es un extremo, y los extremos van arriba.' },
          { t: 'ojo', x: 'Esto es lo que la clase pasada no salió bien. Ve lento: que él diga el porqué con sus palabras antes de seguir.' },
          { t: 'diapo', n: 8 },
          { t: 'tu', x: 'Ahora usted: comparta la pantalla y abra «Fracciones».' },
          { t: 'accion', x: 'Sal de la pantalla completa (Esc) y deja de compartir.' }
        ]
      },
      {
        tiempo: '11–23 min', titulo: 'Mesa de sumas y restas, retos 1 a 5', comparte: 'Él', ruta: 'index.html#m2-fracciones', boton: 'Abrir las fracciones',
        pasos: [
          { t: 'ojo', x: 'La mesa pregunta primero si tienen el mismo abajo. Después él escribe cada multiplicación y al final simplifica con ÷2, ÷3, ÷5. No le soples.' },
          { t: 'el', x: 'Retos 1 y 2: mismo abajo.' },
          { t: 'pregunta', x: 'Reto 2: queda 4/8. ¿Se puede simplificar?', r: 'Sí: entre 2 dos veces (o entre 4 de una). Queda 1/2, medio tanque.' },
          { t: 'el', x: 'Retos 3 y 4: la mariposa.' },
          { t: 'pregunta', x: 'Reto 3: ¿tiene sentido 5/6?', r: 'Sí: medio más un tercio es un poco menos que 1.' },
          { t: 'pregunta', x: 'Reto 4, en la resta: ¿cuál va primero?', r: 'El de la izquierda: 3 · 6 = 18, y se le resta 4 · 1 = 4.' },
          { t: 'el', x: 'Reto 5: el entero lleva un 1 abajo.' },
          { t: 'pregunta', x: '¿11/4 de hora cuánto es en horas y minutos?', r: '2 h y 45 min.' }
        ]
      },
      {
        tiempo: '23–35 min', titulo: 'Mesa de multiplicar y dividir, retos 1 a 7', comparte: 'Él', ruta: 'index.html#m2-fracciones', boton: 'Abrir las fracciones',
        pasos: [
          { t: 'ojo', x: 'Está debajo de la mesa de sumas, en la misma sección. Al terminar el reto 5 de sumas, el botón lo lleva.' },
          { t: 'el', x: 'Retos 1 y 2: multiplicar. La mesa pregunta si arriba con arriba o en cruz.' },
          { t: 'pregunta', x: 'Reto 2: 80 km/h por 3 h, ¿qué unidad queda?', r: 'km: la h de arriba se cancela con la de abajo.' },
          { t: 'el', x: 'Retos 3 a 7: dividir con extremos y medios.' },
          { t: 'pregunta', x: 'Reto 5, antes de tocar: ¿en qué unidad va a quedar 150 km ÷ 60 km/h?', r: 'h. Si dice km²/h o km, déjalo: al final la mesa le muestra dónde se equivocó.' },
          { t: 'pregunta', x: 'Reto 6: ¿qué es un vatio?', r: 'J/s, joules por segundo. Está en el enunciado: no hace falta saberlo de memoria.' },
          { t: 'pregunta', x: 'Reto 7: ¿por qué queda m/s² y no m?', r: 'Porque la s que divide lleva un 1 abajo: las dos s son medios y quedan abajo, s · s = s².' },
          { t: 'ojo', x: 'Si va justo de tiempo, deja el reto 7 para la tarea y sigue con la parte 2.' }
        ]
      },
      {
        tiempo: '35–41 min', titulo: 'Ideas clave, parte 2: signos y orden', comparte: 'Tú', ruta: 'index.html#m2-ideas-p2', boton: 'Abrir la parte 2',
        pasos: [
          { t: 'accion', x: 'Vuelve a compartir: «Ideas clave», parte 2, en pantalla completa.' },
          { t: 'diapo', n: 9 },
          { t: 'pregunta', x: 'Debe 5 y paga 3: ¿cuánto debe?', r: '2: −5 + 3 = −2.' },
          { t: 'pregunta', x: '¿Y 7 − (−2)?', r: '9: le perdonan una deuda.' },
          { t: 'diapo', n: 10 },
          { t: 'pregunta', x: '¿(−3)² y −3² son lo mismo?', r: 'No: 9 y −9.' },
          { t: 'ojo', x: 'Es la trampa de signos más común en el examen. Que la anote en su hoja.' },
          { t: 'diapo', n: 11 },
          { t: 'pregunta', x: 'En 2 + 3 · 4², ¿qué hace primero?', r: 'La potencia: 4² = 16. Después 3 · 16 y al final la suma: 50.' },
          { t: 'diapo', n: 12 },
          { t: 'pregunta', x: 'Antes de mostrarla: ¿cuánto da 8 ÷ 4 · 2?', r: '4. Si dice 1, mejor: la diapositiva explica por qué.' },
          { t: 'diapo', n: 13 },
          { t: 'tu', x: 'Comparta la pantalla y abra «Signos y orden».' }
        ]
      },
      {
        tiempo: '41–53 min', titulo: 'Mesa de operaciones, retos 1 a 6', comparte: 'Él', ruta: 'index.html#m2-operaciones', boton: 'Abrir la mesa de operaciones',
        pasos: [
          { t: 'tu', x: 'Toque la operación que va primero y escriba cuánto da. Antes de tocar, dígame por qué esa.' },
          { t: 'ojo', x: 'Si toca una que todavía no va, la mesa explica qué va antes. Que lea el mensaje en voz alta.' },
          { t: 'el', x: 'Retos 1 a 3: signos.' },
          { t: 'pregunta', x: 'Reto 3, (−3) · 4 − (−2) · 5: ¿dónde están las trampas?', r: 'En los signos de las multiplicaciones y al final, en restar −10.' },
          { t: 'el', x: 'Retos 4 a 6: orden.' },
          { t: 'ojo', x: 'Si ya va rápido, puede desmarcar «Escribir cada resultado» y solo elegir el orden. Los retos 7 a 9 quedan de tarea.' }
        ]
      },
      {
        tiempo: '53–59 min', titulo: 'Ideas clave, parte 3: potencias con letras', comparte: 'Tú', ruta: 'index.html#m2-ideas-p3', boton: 'Abrir la parte 3',
        pasos: [
          { t: 'accion', x: 'Comparte: «Ideas clave», parte 3, en pantalla completa.' },
          { t: 'diapo', n: 14 },
          { t: 'pregunta', x: '¿Cuánto es 2³?', r: '8. Si dice 6, es justo lo que muestra la diapositiva: el exponente no multiplica, cuenta.' },
          { t: 'diapo', n: 15 },
          { t: 'pregunta', x: '¿Cuánto es x² · x³? Cuente las x.', r: 'x⁵.' },
          { t: 'diapo', n: 16 },
          { t: 'pregunta', x: '¿Y x⁵ / x²?', r: 'x³: se tachan dos parejas, igual que las unidades.' },
          { t: 'diapo', n: 17 },
          { t: 'tu', x: 'Esto es lo que más se usa en física: antes de reemplazar números, se simplifica la fórmula con letras.' },
          { t: 'diapo', n: 18 },
          { t: 'tu', x: 'Comparta la pantalla y abra «Potencias».' }
        ]
      },
      {
        tiempo: '59–69 min', titulo: 'Mesa de exponentes, retos 1 a 6', comparte: 'Él', ruta: 'index.html#m2-potencias', boton: 'Abrir la mesa de exponentes',
        pasos: [
          { t: 'ojo', x: 'Primero predice cómo va a quedar; después escribe cada letra, tacha por parejas y cuenta. Al final la mesa compara con su predicción.' },
          { t: 'el', x: 'Retos 1 a 3: una sola letra.' },
          { t: 'pregunta', x: 'Reto 2: ¿cuánto vale el exponente de una a sola?', r: '1: está una vez.' },
          { t: 'el', x: 'Retos 4 a 6: números y varias letras.' },
          { t: 'pregunta', x: 'Reto 5, m · v² ÷ v: ¿qué queda?', r: 'm · v: una v se tacha con la de abajo.' }
        ]
      },
      {
        tiempo: '69–78 min', titulo: 'Práctica, ejercicios 1 a 5', comparte: 'Él, trabajando en papel', ruta: 'index.html#m2-practica', boton: 'Abrir la práctica',
        pasos: [
          { t: 'tu', x: 'Primero en papel y después escribe el resultado. Muéstreme la hoja antes de comprobar.' },
          { t: 'el', x: 'Resuelve los ejercicios 1 a 5 (los básicos).' },
          { t: 'ojo', x: 'Varios ejercicios tienen un botón para probarlos en su mesa. Solo si se traba.' },
          { t: 'pregunta', x: 'Cuando la plataforma marque un error: ¿qué pasó?', r: 'Que lo nombre: signo, orden, mariposa o exponente.' }
        ]
      },
      {
        tiempo: '78–82 min', titulo: 'Cierre', comparte: 'Los dos', ruta: 'index.html#m2-practica', boton: 'Abrir la práctica',
        pasos: [
          { t: 'tu', x: 'Sin mirar la plataforma, cuatro preguntas rápidas.' },
          { t: 'pregunta', x: '¿Cuánto es 1/2 + 1/4?', r: '3/4 (con la mariposa, 6/8 = 3/4).' },
          { t: 'pregunta', x: '¿En qué unidad queda m ÷ (m/s)?', r: 's.' },
          { t: 'pregunta', x: '¿(−2)²? ¿Y −2²?', r: '4 y −4.' },
          { t: 'pregunta', x: '¿Cuánto es a³ · a?', r: 'a⁴.' },
          { t: 'tu', x: 'De tarea quedan los ejercicios 6 a 15 y lo que no alcanzamos de las mesas. La próxima: factorización, el módulo 3.' },
          { t: 'pregunta', x: '¿Qué fue lo más útil de hoy? ¿Qué le costó más?', r: 'Anótalo para preparar la clase 3.' }
        ]
      }
    ],
    ajustes: [
      ['Si te falta tiempo', 'Deja el reto 7 de multiplicar y dividir, los retos 5 y 6 de exponentes y la práctica para la tarea. No recortes las fracciones: es lo que más le costó.'],
      ['Si te sobra tiempo', 'Retos 7 a 9 de operaciones o los ejercicios 6 a 9 de la práctica.'],
      ['Si va muy rápido', 'Si las preguntas de las partes 2 y 3 le salen solas, pasa rápido por las diapositivas y quédate más en la práctica tipo examen.'],
      ['Si se frustra', 'Para y vuelve a un ejemplo con números chicos (1/2 + 1/2, x · x). Que termine la clase con algo que le salió bien.'],
      ['Si se resiste a escribir', 'No discutas. Pídele la respuesta de cabeza y después: «Demuéstremelo en el papel». Si coinciden, celébralo.']
    ]
  };
})();
