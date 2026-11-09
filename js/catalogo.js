/* =====================================================================
   CATÁLOGO DEL CURSO · los 9 módulos
   Para habilitar un módulo nuevo: cambia "disponible" a true y
   registra su vista en MA.vistasModulo (ver js/m1/modulo1.js).
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;

  MA.MODULOS = [
    {
      id: 'm1', num: '01',
      titulo: 'Conversión de unidades y despejes',
      resumen: 'La balanza de las ecuaciones y el método del factor unitario.',
      disponible: true,
      temario: [
        'Despejar fórmulas como quien equilibra una balanza',
        'Operaciones contrarias y el orden para despejar',
        'Equivalencias como fracciones que valen 1',
        'Método del factor unitario: km/h ↔ m/s, áreas y volúmenes'
      ]
    },
    {
      id: 'm2', num: '02',
      titulo: 'Álgebra básica',
      resumen: 'Fracciones, signos, orden de las operaciones y potencias con letras.',
      disponible: true,
      temario: [
        'Fracciones: sumar, restar, multiplicar y dividir, también con unidades',
        'Ley de los signos y jerarquía de las operaciones',
        'Potencias con letras: los exponentes se suman y se restan',
        'Simplificar fórmulas antes de reemplazar los valores'
      ]
    },
    {
      id: 'm3', num: '03',
      titulo: 'Factorización',
      resumen: 'Armar y desarmar multiplicaciones: factor común, diferencia de cuadrados y una llave maestra para los trinomios.',
      disponible: true,
      temario: [
        'Juntar términos del mismo tipo y multiplicar con la distributiva: todos contra todos',
        'Factor común: sacar de a poco lo que está en todos los términos',
        'Diferencia de cuadrados: un cuadrado menos otro se reacomoda en un rectángulo',
        'La llave maestra: la fórmula cuadrática para factorizar cualquier trinomio y resolver ecuaciones, con las raíces en la gráfica'
      ]
    },
    {
      id: 'm4', num: '04',
      titulo: 'Física mecánica I: cinemática',
      resumen: 'Cómo se describe un movimiento: velocidad constante, aceleración y frenado, con un radar de pista y tres fórmulas.',
      disponible: true,
      temario: [
        'Distancia, velocidad y tiempo: el movimiento con velocidad constante (MRU)',
        'La aceleración: ganar o perder velocidad en cada segundo (MRUV)',
        'Tres fórmulas que se despejan como balanzas',
        'Misiones de vuelo: despegue, frenado y una pista corta'
      ]
    },
    {
      id: 'm5', num: '05',
      titulo: 'Física mecánica II: dinámica',
      resumen: 'Por qué se mueve lo que se mueve: masa y peso, las flechas de cada fuerza, las tres leyes de Newton y la rampa.',
      disponible: true,
      temario: [
        'Masa y peso: qué cambia y qué no',
        'Las cinco fuerzas y ¿Quién lo toca?: las flechas de cualquier situación, en el piso, en el aire y en la rampa',
        'Las tres leyes de Newton y la fuerza neta',
        'Seno y coseno en la rampa',
        'Tácticas para descartar opciones en preguntas tipo examen'
      ]
    },
    {
      id: 'm6', num: '06',
      titulo: 'Física mecánica III: caída libre y tiro',
      resumen: 'Lo que pasa cuando solo actúa el peso: lanzar hacia arriba, soltar desde lo alto y lanzar de lado, con una torre de lanzamiento y las fórmulas del módulo 4.',
      disponible: true,
      temario: [
        'Caída libre: solo el peso, y una aceleración de −10 m/s² todo el tiempo, también en lo más alto',
        'Lanzar hacia arriba: tiempo de subida, altura máxima y la gráfica de velocidad que cruza el cero',
        'Soltar desde lo alto: cuánto tarda en caer y con qué rapidez llega',
        'Tiro parabólico: cada eje por su lado, y el lanzamiento horizontal'
      ]
    },
    {
      id: 'm7', num: '07',
      titulo: 'Estequiometría: soluciones y reacciones',
      resumen: 'Cuánto hay de cada cosa: la concentración de una solución, el mol y las proporciones de una reacción química, con preguntas como las del ICFES.',
      disponible: false,
      temario: [
        'Soluto, solvente y concentración: tantos mL en tantos mL',
        'Leer tablas y gráficas de solubilidad',
        'El mol: gramos ÷ masa molar',
        'La reacción química: balanceo por tanteo, conservación de la masa y el reactivo límite'
      ]
    },
    {
      id: 'm8', num: '08',
      titulo: 'Física mecánica IV: fricción y energía',
      resumen: 'La fricción con su coeficiente, el trabajo, la energía cinética y la potencial, y la potencia.',
      disponible: false,
      temario: [
        'Fricción con coeficiente: cuánto frena una superficie',
        'Trabajo, energía cinética y energía potencial',
        'La energía se conserva: la rapidez al final de una caída o de una rampa',
        'Potencia y resortes'
      ]
    },
    {
      id: 'm9', num: '09',
      titulo: 'pH y simulacro final',
      resumen: 'Escala de acidez y un simulacro cronometrado tipo examen.',
      disponible: false,
      temario: [
        'Qué mide el pH y la escala de 0 a 14',
        'Ácido, neutro y básico: sustancias de la casa, y qué pasa al diluir',
        'El pH y las potencias de 10',
        'Simulacro final con tiempo y retroalimentación'
      ]
    },
    {
      // Práctica por cuenta propia, sin clase: va después de los nueve módulos
      id: 'ingles', num: '10',
      titulo: 'Inglés',
      resumen: 'Práctica por cuenta propia: cuatro quizzes cortos de tiempos verbales, vocabulario, lectura y uno mixto.',
      disponible: true,
      temario: [
        'Tiempos verbales y condicionales',
        'Preposiciones, vocabulario de aviación y falsos amigos',
        'Lectura de textos cortos',
        'Un quiz mixto tipo examen'
      ]
    }
  ];

  /* Cada módulo disponible registra aquí su vista: { montar(contenedor), mostrar(seccion), secciones, progreso() } */
  MA.vistasModulo = MA.vistasModulo || {};
})();
