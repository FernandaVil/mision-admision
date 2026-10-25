# Misión admisión

Plataforma de estudio para preparar el examen de admisión a Ingeniería Aeronáutica. Es una página web estática (HTML, CSS y JavaScript, sin compilación).

## Contenido

- **Módulo 1 · conversión de unidades y despejes** (disponible): ideas clave en diapositivas, balanza de despejes, mesa de conversión con factor unitario, práctica de 14 ejercicios y centro de comando IA con plantillas para pedir pistas.
- **Módulos 2 a 6** (en preparación): álgebra y factorización, cinemática, dinámica, estequiometría, pH y simulacro final.

## Cómo abrirla

- **En línea:** con el enlace de GitHub Pages.
- **Sin internet:** doble clic en `index.html`. Solo las tipografías y el enlace al simulador PhET necesitan conexión.

El avance se guarda en el navegador de cada dispositivo.

## Estructura

```
index.html            página principal
css/                  estilos (base, layout, componentes, módulo 1 y clase)
js/nucleo.js          utilidades compartidas
js/catalogo.js        los 6 módulos
js/m1/                módulo 1: contenido, motores y herramientas
js/asistente.js       centro de comando IA
js/plataforma.js      rutas, navegación y tema
```

Los textos, retos y ejercicios del módulo 1 se editan en `js/m1/contenido.js`; las diapositivas de ideas clave, en `js/m1/clase.js`.
