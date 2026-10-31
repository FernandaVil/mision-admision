# Misión admisión

Plataforma de estudio para preparar el examen de admisión a Ingeniería Aeronáutica. Es una página web estática (HTML, CSS y JavaScript, sin compilación).

## Contenido

- **Módulo 1 · conversión de unidades y despejes** (disponible): ideas clave en diapositivas, balanza de despejes, mesa de conversión con factor unitario, práctica de 18 ejercicios y centro de comando IA con plantillas para pedir pistas.
- **Módulo 2 · álgebra básica** (disponible): fracciones (sumar, restar, multiplicar y dividir), signos y orden de las operaciones, y potencias con letras. Trae una mesa para cada tema y una práctica de 15 ejercicios.
- **Módulo 3 · factorización** (disponible): juntar términos, la distributiva y el factor común en una mesa de áreas (armar y desarmar un rectángulo), y el paso del dibujo al papel con las flechas de todos contra todos. Sigue la diferencia de cuadrados, con una figura que se corta y se reacomoda, y la llave maestra (la fórmula cuadrática) para cualquier trinomio, con una calculadora de GeoGebra para ver las raíces en la gráfica. Trae una práctica integrada de 15 ejercicios que, antes de cada factorización, pregunta qué llave logra abrir el candado.
- **Rondas de práctica** (módulos 1 a 3): después de la práctica fija, rondas cortas con números nuevos cada vez, de lo fácil a lo difícil, con los errores típicos explicados. Se trabaja a mano, con lápiz y papel (la calculadora vale para las cuentas). Una ronda es buena si tiene a lo sumo un error, y con dos rondas buenas la habilidad (por ejemplo, km/h y m/s, o el factor común) queda dominada. El radar de signos cuenta igual.
- **Módulo 4 · física mecánica I: cinemática** (disponible): el movimiento con velocidad constante y con aceleración en un radar de pista, con huellas de cada segundo, instrumentos en tiempo real y una bitácora; en cada reto se predice antes de despegar. Sigue con las tres fórmulas del movimiento dibujadas como balanzas para despejar, y un entrenamiento de 12 ejercicios que termina con tres misiones de vuelo: despegue, frenado y una pista corta.
- **Módulos 5 y 6** (en preparación): estequiometría y notación científica; pH y simulacro final.
- **Inglés** (práctica por cuenta propia): cuatro quizzes de 10 preguntas (tiempos verbales, vocabulario y preposiciones, lectura y uno mixto), con una ficha de repaso. Cada respuesta equivocada explica por qué no.

## Cómo abrirla

- **En línea:** con el enlace de GitHub Pages.
- **Sin internet:** doble clic en `index.html`. Solo las tipografías, el enlace al simulador PhET y la calculadora de GeoGebra del módulo 3 necesitan conexión.

El avance se guarda en el navegador de cada dispositivo.

## Estructura

```
index.html            página principal
css/                  estilos (base, layout, componentes, módulos 1 a 4, clase, rondas e inglés)
js/nucleo.js          utilidades compartidas
js/catalogo.js        los 6 módulos y el inglés
js/rondas.js          motor de las rondas de práctica
js/m1/                módulo 1: contenido, motores, herramientas y rondas
js/m2/                módulo 2: contenido, diapositivas, las cuatro mesas, radar y rondas
js/m3/                módulo 3: contenido, diapositivas, mesa de áreas, flechas, diferencia de cuadrados, llave maestra y rondas
js/m4/                módulo 4: contenido, diapositivas, radar de pista y fórmulas en la balanza
js/ingles/            inglés: los cuatro quizzes para practicar por cuenta propia
js/asistente.js       centro de comando IA
js/plataforma.js      rutas, navegación y tema
```

Los textos, retos y ejercicios de cada módulo se editan en `js/mN/contenido.js` (N del 1 al 4); las diapositivas de ideas clave, en `clase.js`, y las habilidades de las rondas de los módulos 1 a 3, en `rondas.js`, dentro de la misma carpeta.
