# Misión admisión

Plataforma de estudio para preparar el examen de admisión a Ingeniería Aeronáutica. Es una página web estática (HTML, CSS y JavaScript, sin compilación).

## Contenido

- **Módulo 1 · conversión de unidades y despejes** (disponible): ideas clave en diapositivas, balanza de despejes, mesa de conversión con factor unitario, práctica de 14 ejercicios y centro de comando IA con plantillas para pedir pistas.
- **Módulo 2 · álgebra básica** (disponible): fracciones (sumar, restar, multiplicar y dividir), signos y orden de las operaciones, y potencias con letras. Trae una mesa para cada tema y una práctica de 15 ejercicios.
- **Módulos 3 a 6** (en preparación): factorización; física mecánica; estequiometría y notación científica; pH y simulacro final.

## Cómo abrirla

- **En línea:** con el enlace de GitHub Pages.
- **Sin internet:** doble clic en `index.html`. Solo las tipografías y el enlace al simulador PhET necesitan conexión.

El avance se guarda en el navegador de cada dispositivo.

## Estructura

```
index.html            página principal
css/                  estilos (base, layout, componentes, módulos 1 y 2, y clase)
js/nucleo.js          utilidades compartidas
js/catalogo.js        los 6 módulos
js/m1/                módulo 1: contenido, motores y herramientas
js/m2/                módulo 2: contenido, diapositivas y las cuatro mesas
js/asistente.js       centro de comando IA
js/plataforma.js      rutas, navegación y tema
```

Los textos, retos y ejercicios de cada módulo se editan en `js/m1/contenido.js` y `js/m2/contenido.js`; las diapositivas de ideas clave, en `clase.js`, dentro de la misma carpeta.
