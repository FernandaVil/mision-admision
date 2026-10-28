/* =====================================================================
   CATÁLOGO DEL CURSO · los 6 módulos
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
      titulo: 'Física mecánica',
      resumen: 'Cómo se describe el movimiento y por qué se mueven las cosas.',
      disponible: false,
      temario: [
        'Velocidad y aceleración: movimiento uniforme y acelerado',
        'Caída libre y lanzamiento vertical',
        'Las tres leyes de Newton, el peso y la fricción',
        'Trabajo y energía',
        'Las cuatro fuerzas sobre una aeronave en vuelo'
      ]
    },
    {
      id: 'm5', num: '05',
      titulo: 'Estequiometría y notación científica',
      resumen: 'El mol, las cantidades en una reacción química y los números muy grandes o muy pequeños.',
      disponible: false,
      temario: [
        'Notación científica y potencias de 10, con calculadora',
        'El mol y la masa molar',
        'Gramos ↔ moles con el mismo factor unitario del módulo 1',
        'Balanceo de ecuaciones y relaciones molares'
      ]
    },
    {
      id: 'm6', num: '06',
      titulo: 'pH y simulacro final',
      resumen: 'Escala de acidez y un simulacro cronometrado tipo examen.',
      disponible: false,
      temario: [
        'Qué mide el pH y la escala de 0 a 14',
        'El pH como exponente: potencias de 10',
        'pOH y la regla del 14',
        'Simulacro final con tiempo y retroalimentación'
      ]
    }
  ];

  /* Cada módulo disponible registra aquí su vista: { montar(contenedor), mostrar(seccion), secciones, progreso() } */
  MA.vistasModulo = MA.vistasModulo || {};
})();
