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
      titulo: 'Álgebra básica y factorización',
      resumen: 'Fracciones, signos, orden de las operaciones, potencias y factorización.',
      disponible: true,
      temario: [
        'Fracciones: dividir entre una fracción, también con unidades',
        'Leyes de los signos y jerarquía de operaciones',
        'Potencias, exponentes negativos y notación científica',
        'Factor común y diferencia de cuadrados',
        'Trinomios de la forma x² + bx + c',
        'Ecuaciones de segundo grado y fórmula cuadrática'
      ]
    },
    {
      id: 'm3', num: '03',
      titulo: 'Física mecánica I (cinemática)',
      resumen: 'Cómo se describe el movimiento: MRU, MRUV y caída libre.',
      disponible: false,
      temario: [
        'Posición, desplazamiento, velocidad y aceleración',
        'Movimiento rectilíneo uniforme (MRU)',
        'Movimiento uniformemente acelerado (MRUV)',
        'Caída libre y lanzamiento vertical',
        'Lectura de gráficas de movimiento'
      ]
    },
    {
      id: 'm4', num: '04',
      titulo: 'Física mecánica II (dinámica)',
      resumen: 'Por qué se mueven las cosas: fuerzas, leyes de Newton y energía.',
      disponible: false,
      temario: [
        'Las tres leyes de Newton',
        'Diagrama de cuerpo libre, peso y fricción',
        'Trabajo, energía cinética y potencial',
        'Las cuatro fuerzas sobre una aeronave en vuelo'
      ]
    },
    {
      id: 'm5', num: '05',
      titulo: 'Estequiometría',
      resumen: 'El mol, la masa molar y las cantidades en una reacción química.',
      disponible: false,
      temario: [
        'El mol y la masa molar',
        'Gramos ↔ moles con el mismo factor unitario del módulo 1',
        'Balanceo de ecuaciones por tanteo',
        'Relaciones molares y reactivo límite'
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
