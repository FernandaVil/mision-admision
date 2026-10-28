# Misión admisión

Plataforma de estudio para preparar el examen de admisión a Ingeniería Aeronáutica. Es una página web estática (HTML, CSS y JavaScript, sin compilación).

## Contenido

- **Módulo 1 · conversión de unidades y despejes** (disponible): ideas clave en diapositivas, balanza de despejes, mesa de conversión con factor unitario, práctica de 14 ejercicios y centro de comando IA con plantillas para pedir pistas.
- **Módulo 2 · álgebra básica** (disponible): fracciones (sumar, restar, multiplicar y dividir), signos y orden de las operaciones, y potencias con letras. Trae una mesa para cada tema y una práctica de 15 ejercicios.
- **Módulo 3 · factorización** (disponible): juntar términos, la distributiva y el factor común en una mesa de áreas (armar y desarmar un rectángulo), y el paso del dibujo al papel con las flechas de todos contra todos. Sigue la diferencia de cuadrados, con una figura que se corta y se reacomoda, y la llave maestra (la fórmula cuadrática) para cualquier trinomio, con una calculadora de GeoGebra para ver las raíces en la gráfica. Trae una práctica integrada de 15 ejercicios que, antes de cada factorización, pregunta qué llave logra abrir el candado.
- **Módulos 4 a 6** (en preparación): física mecánica; estequiometría y notación científica; pH y simulacro final.

## Cómo abrirla

- **En línea:** con el enlace de GitHub Pages.
- **Sin internet:** doble clic en `index.html`. Solo las tipografías, el enlace al simulador PhET y la calculadora de GeoGebra del módulo 3 necesitan conexión.

El avance se guarda en el navegador de cada dispositivo.

## Estructura

```
index.html            página principal
css/                  estilos (base, layout, componentes, módulos 1, 2 y 3, y clase)
js/nucleo.js          utilidades compartidas
js/catalogo.js        los 6 módulos
js/m1/                módulo 1: contenido, motores y herramientas
js/m2/                módulo 2: contenido, diapositivas y las cuatro mesas
js/m3/                módulo 3: contenido, diapositivas, mesa de áreas, flechas, diferencia de cuadrados y llave maestra
js/asistente.js       centro de comando IA
js/plataforma.js      rutas, navegación y tema
```

Los textos, retos y ejercicios de cada módulo se editan en `js/m1/contenido.js`, `js/m2/contenido.js` y `js/m3/contenido.js`; las diapositivas de ideas clave, en `clase.js`, dentro de la misma carpeta.
