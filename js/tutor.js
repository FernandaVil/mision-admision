/* =====================================================================
   SOLO PARA EL TUTOR · guion de la clase 1
   ---------------------------------------------------------------------
   Lo carga únicamente la página del tutor (tutor-q7m2.html). Ninguna
   página de la plataforma carga este archivo ni enlaza a esa página.
   Las instrucciones van de tú (para el tutor); las frases para decirle
   al estudiante van entre comillas y de usted.
   Tipos de paso: tu (tú dices) · pregunta (pregúntale, con r = lo que
   se espera) · el (él hace) · pizarra (escribes) · accion (tú haces) ·
   ojo (cuidado) · diapo (n = número de diapositiva)
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { icono } = MA;

  const GUIA = {
    id: 'c1',
    nombre: 'Clase 1',
    titulo: 'Guion de la clase 1',
    entrada: 'Unos 80 minutos por videollamada. La teoría va en dos bloques cortos, cada uno justo antes de la herramienta donde se usa, y alterna lo que muestras, lo que le preguntas y lo que escribes en el pizarrón.',
    diapositivas: () => MA.Clase1.DIAPOSITIVAS,
    claveCheck: 'guia.check',
    antes: [
      'Envíale el enlace de la plataforma y pídele que la abra en el computador.',
      'Que tenga papel, lápiz y nada de calculadora: así es el examen.',
      'Abre la plataforma en «Ideas clave» y prueba antes las dos formas de escribir: «Escribir» (tecla E) anota sobre la diapositiva y «Pizarrón» (tecla B) abre una hoja en blanco. Esc la cierra.',
      'Ten este guion en el celular. En la teoría compartes tú la pantalla; en la balanza, la mesa y la práctica la comparte él y hace los clics.'
    ],
    objetivos: [
      'Despejar una variable en fórmulas como d = v · t o vf = v₀ + a · t, y explicar por qué se divide o se resta en los dos lados.',
      'Convertir unidades con factores, incluido km/h ↔ m/s, eligiendo bien la orientación de cada factor.',
      'No confundir 2 h 50 min con 2,50 h, ni 1,3 min con 1 min 30 s.'
    ],
    minimo: [
      ['El igual es una balanza', 'Los dos lados valen lo mismo; lo que se le hace a uno, se le hace al otro.'],
      ['Cada operación tiene su contraria', 'Suma ↔ resta, multiplicación ↔ división. Despejar es deshacer.'],
      ['Una cantidad es un número con unidad', 'Convertir cambia la unidad, nunca la cantidad.'],
      ['Los prefijos y el tiempo', 'Kilo = mil veces; centi = centésima parte; mili = milésima parte, sin importar la unidad. El tiempo va de 60 en 60.'],
      ['Una equivalencia es un 1', 'Una fracción como 1000 m / 1 km vale 1; multiplicar por ella no cambia la cantidad.']
    ],
    guion: [
      {
        tiempo: '0–2 min', titulo: 'Apertura', comparte: 'Nadie todavía',
        pasos: [
          { t: 'tu', x: 'Hoy vamos a ver dos cosas que salen en todo el examen: despejar fórmulas y convertir unidades. Mucho de esto ya lo sabe; la idea es ordenarlo para que no se le enrede cuando las fórmulas se compliquen.' },
          { t: 'tu', x: 'Funciona así: yo le muestro algo corto, usted lo prueba en la plataforma y después practica en papel. Nada de calculadora.' },
          { t: 'el', x: 'Abre la plataforma y deja a mano papel y lápiz.' }
        ]
      },
      {
        tiempo: '2–9 min', titulo: 'Ideas clave, parte 1', comparte: 'Tú, con la presentación en pantalla completa', ruta: 'index.html#m1-ideas-p1', boton: 'Abrir la parte 1',
        pasos: [
          { t: 'accion', x: 'Comparte tu pantalla, abre «Ideas clave», parte 1, y pulsa «Pantalla completa».' },
          { t: 'diapo', n: 1 },
          { t: 'tu', x: 'Al final de hoy va a poder despejar fórmulas como d = v · t y convertir km/h a m/s sin regla de tres.' },
          { t: 'diapo', n: 2 },
          { t: 'pregunta', x: 'Si 3 · x = 12, ¿cuánto vale x?', r: '4.' },
          { t: 'pregunta', x: '¿Usted cómo lo pensó?', r: 'Algo como «el 3 pasa a dividir» o «12 entre 3».' },
          { t: 'ojo', x: 'Si dice «el 3 pasa a dividir», no lo corrijas. Responde: «Bien. Hoy vamos a ver por qué funciona eso».' },
          { t: 'pregunta', x: '¿Cuántos metros son 2 km?', r: '2000 m.' },
          { t: 'ojo', x: 'Si responde rápido y bien, acelera en las diapositivas 3 a 5: no te detengas en lo que ya domina.' },
          { t: 'diapo', n: 3 },
          { t: 'tu', x: 'El igual no significa «da como resultado». Significa «pesa lo mismo»: lo de la izquierda vale lo mismo que lo de la derecha.' },
          { t: 'pregunta', x: 'Si a un plato le quito la mitad, ¿qué tengo que hacer con el otro para que no se caiga?', r: 'Quitarle la mitad también.' },
          { t: 'pizarra', x: 'Pulsa «Escribir» (E). Escribe «÷ 3» debajo de cada plato de la balanza dibujada y luego «x = 4». Mientras escribes: «Divido los dos lados entre 3, no solo uno».' },
          { t: 'diapo', n: 4 },
          { t: 'pregunta', x: '¿Cuál es la contraria de sumar? ¿Y la de multiplicar?', r: 'Restar y dividir.' },
          { t: 'pizarra', x: 'Abre el pizarrón (B) y escribe «x + 5 = 9».' },
          { t: 'pregunta', x: '¿Qué le hago a los dos lados para dejar sola la x?', r: '«− 5 en los dos lados»: x = 4. Escríbelo tú mientras él te lo dicta.' },
          { t: 'pizarra', x: 'Escribe «5 · x = 20» y pídele que te dicte el despeje. Espera «÷ 5 en los dos lados: x = 4».' },
          { t: 'tu', x: 'Hay más pares, como el cuadrado y la raíz, o el logaritmo. Están en gris porque vienen más adelante. Hoy nos enfocamos en estas cuatro.' },
          { t: 'accion', x: 'Cierra el pizarrón (Esc) y sigue con la diapositiva 5.' },
          { t: 'diapo', n: 5 },
          { t: 'pregunta', x: 'Si va a 50 km/h y recorre 100 km, ¿cuánto se demora?', r: '2 horas.' },
          { t: 'tu', x: 'Eso que hizo de cabeza es un despeje: t = d / v.' },
          { t: 'pregunta', x: '¿Cómo sabe si un despeje está bien?', r: 'Probándolo con números fáciles.' },
          { t: 'diapo', n: 6 },
          { t: 'tu', x: 'Ahora le toca a usted. Comparta su pantalla, abra «Despejes» y haga los retos. Antes de cada clic, dígame qué operación va a aplicar y por qué.' },
          { t: 'accion', x: 'Sal de la pantalla completa (Esc) y deja de compartir.' }
        ]
      },
      {
        tiempo: '9–29 min', titulo: 'Balanza, retos 1 a 6', comparte: 'Él', ruta: 'index.html#m1-despejes', boton: 'Abrir la balanza',
        pasos: [
          { t: 'el', x: 'Reto 1: elige «÷ v» y la aplica en un solo plato.' },
          { t: 'pregunta', x: '¿Qué le pasó a la balanza? ¿Por qué?', r: 'Se inclinó porque solo dividió un lado.' },
          { t: 'el', x: 'Aplica «÷ v» también en el otro plato y la balanza vuelve al equilibrio.' },
          { t: 'tu', x: 'Lea en voz alta la bitácora: así se escribe el despeje en el examen.' },
          { t: 'pregunta', x: 'Reto 2: ¿qué le están haciendo a la v?', r: 'La multiplican por t: hay que dividir entre t en los dos lados.' },
          { t: 'el', x: 'Reto 3 solo, sin ayuda.' },
          { t: 'tu', x: 'Cuénteme en una frase lo que hizo.' },
          { t: 'pregunta', x: 'Reto 4: la d está dividida entre t. ¿Cuál es la contraria de dividir?', r: 'Multiplicar: × t en los dos lados.' },
          { t: 'pregunta', x: 'Reto 5: la t está abajo. ¿Qué hace primero?', r: 'Subirla con × t y después dividir entre v.' },
          { t: 'el', x: 'Si la variable queda sola a la derecha, toca el «=» del centro de la balanza para dar vuelta los platos y leerla mejor.' },
          { t: 'pregunta', x: 'Reto 6: ¿qué quita primero, lo que suma o lo que multiplica?', r: 'Lo que suma: primero − v₀ y después ÷ a.' },
          { t: 'ojo', x: 'Si en el reto 6 quiere dividir entre a antes de restar, déjalo: verá que la a no se cancela porque no multiplica a todo el lado. Después, que use «Deshacer».' },
          { t: 'el', x: 'Mueve los deslizadores de «Valores de prueba».' },
          { t: 'pregunta', x: '¿Por qué la balanza no se inclina aunque cambien los números?', r: 'Porque se hizo lo mismo en los dos lados.' },
          { t: 'pizarra', x: 'Pídele que deje de mirar la plataforma. En tu pizarrón (compartido un momento), escribe «vf = v₀ + a · t» y que te dicte el despeje de t paso a paso; tú escribes lo que dice.' },
          { t: 'pregunta', x: '¿Qué significa en realidad «lo que multiplica pasa a dividir»?', r: 'Que se dividen los dos lados entre lo mismo.' }
        ]
      },
      {
        tiempo: '29–36 min', titulo: 'Ideas clave, parte 2', comparte: 'Tú', ruta: 'index.html#m1-ideas-p2', boton: 'Abrir la parte 2',
        pasos: [
          { t: 'accion', x: 'Vuelve a compartir: «Ideas clave», parte 2, en pantalla completa.' },
          { t: 'diapo', n: 7 },
          { t: 'tu', x: 'Rápido, porque esto lo sabe: un número sin unidad no dice nada. Convertir es cambiar la unidad, no la cantidad.' },
          { t: 'diapo', n: 8 },
          { t: 'tu', x: 'Un prefijo es una palabrita delante de la unidad que dice cuántas veces la unidad. Kilo siempre es mil: mil metros, mil gramos, mil litros.' },
          { t: 'pizarra', x: 'Con «Escribir» (E), encierra la fila «unidad» y dibuja flechas «× 10» bajando de escalón en escalón.' },
          { t: 'pregunta', x: '¿Cuántos centímetros tiene un metro? ¿Por qué 100?', r: '100: son dos escalones, 10 · 10.' },
          { t: 'pregunta', x: '¿Cuántos miligramos tiene un gramo?', r: '1000: tres escalones.' },
          { t: 'ojo', x: 'La confusión típica: creer que «centi» significa 100. Centi es la parte: 1 cm es 1/100 de metro. Lo que vale 100 es cuántos centímetros caben en un metro.' },
          { t: 'tu', x: 'Los grises casi no se usan. Si le da curiosidad, en la ficha puede abrir la escalera hacia arriba y hacia abajo: hay prefijos hasta para la masa de Júpiter y la de un electrón.' },
          { t: 'diapo', n: 9 },
          { t: 'tu', x: '2,5 h sí existe: son dos horas y media. El problema es cuando vienen dos unidades juntas, como 2 h 50 min.' },
          { t: 'pregunta', x: '¿Cuántos minutos son 2 h 50 min?', r: '170: 2 · 60 + 50.' },
          { t: 'pregunta', x: '¿1,3 min es lo mismo que 1 min 30 s?', r: 'No: 0,3 · 60 = 18 s, así que es 1 min 18 s, o 78 s.' },
          { t: 'pizarra', x: 'Abre el pizarrón (B) y escribe «2 h 50 min = 2 · 60 + 50 = 170 min ≠ 2,50 h» y debajo «1,3 min = 1,3 · 60 s = 78 s = 1 min 18 s».' },
          { t: 'pregunta', x: 'Entonces, ¿cuántos minutos son 0,5 h? ¿Y 0,1 h?', r: '30 min y 6 min.' },
          { t: 'diapo', n: 10 },
          { t: 'pregunta', x: '¿Cuánto vale 5 / 5? ¿Y 1000 m / 1 km?', r: '1 y 1: arriba y abajo hay lo mismo.' },
          { t: 'diapo', n: 11 },
          { t: 'pizarra', x: 'En el pizarrón, escribe «2,5 km · ( —— / —— )» con la fracción vacía.' },
          { t: 'pregunta', x: '¿Qué pongo arriba y qué abajo para que los km se vayan?', r: '1000 m arriba y 1 km abajo. Escríbelo mientras te lo dicta y tacha los km.' },
          { t: 'pregunta', x: '¿Y si lo pongo al revés?', r: 'Queda km²: las unidades avisan que está mal.' },
          { t: 'diapo', n: 12 },
          { t: 'tu', x: 'Ahora usted: comparta la pantalla y abra la mesa de conversión.' }
        ]
      },
      {
        tiempo: '36–56 min', titulo: 'Mesa de conversión, retos 1 a 7', comparte: 'Él', ruta: 'index.html#m1-conversion', boton: 'Abrir la mesa',
        pasos: [
          { t: 'ojo', x: 'La mesa pregunta «¿arriba o abajo?» antes de colocar cada factor. No le soples: si duda, que toque «Ver dónde está…» y te explique en voz alta por qué elige lo que elige.' },
          { t: 'pregunta', x: 'Antes de agregar un factor: ¿qué unidad quiere eliminar y en qué piso está?', r: 'Reto 1: km, arriba.' },
          { t: 'pregunta', x: 'Reto 2: no hay una equivalencia directa de horas a segundos. ¿Por dónde pasa?', r: 'Por los minutos: h → min → s.' },
          { t: 'el', x: 'Reto 3 (72 km/h a m/s): necesita dos factores.' },
          { t: 'pregunta', x: 'En 72 km/h la h está abajo. ¿Por qué en el factor la h va arriba?', r: 'Porque está dividiendo: con una h arriba se cancela, h ÷ h = 1.' },
          { t: 'el', x: 'Lee en voz alta la bitácora de pasos de la mesa: dice qué cancela cada factor.' },
          { t: 'pizarra', x: 'Cuando lo termine, comparte un momento y escribe en el pizarrón «1000 / 3600 = 1 / 3,6» y debajo «de km/h a m/s: ÷ 3,6».' },
          { t: 'pregunta', x: 'Reto 4: ¿ahora multiplica o divide por 3,6? ¿Por qué?', r: 'Multiplica: en km/h el número es más grande.' },
          { t: 'ojo', x: 'Reto 5 (cm² a m²): deja que caiga en la trampa con un solo factor. La mesa le muestra que todavía queda un cm.' },
          { t: 'pregunta', x: '¿Por qué quedó un cm?', r: 'Porque cm² es cm · cm: el factor va dos veces.' },
          { t: 'pregunta', x: 'Reto 6: el examen dice 1 ft = 0,3 m. ¿Usa ese valor o el exacto?', r: 'El del enunciado: 0,3.' },
          { t: 'el', x: 'Reto 7, si hay tiempo.' },
          { t: 'ojo', x: 'Si invierte al azar hasta que quede bien, frénalo: «Antes de tocar, dígame dónde está la h y dónde tiene que ir». Si insiste en invertir el mismo factor, la mesa también lo frena y le explica la regla con su caso.' },
          { t: 'ojo', x: 'Si ya lo domina, puede desmarcar «Pensar antes de colocar» (arriba de las equivalencias) para ir más rápido. La mesa recuerda la elección.' },
          { t: 'ojo', x: 'Si quiere usar regla de tres, que la compare con el factor en el reto 3: con factores el procedimiento es siempre el mismo.' }
        ]
      },
      {
        tiempo: '56–74 min', titulo: 'Práctica, ejercicios 1 a 8', comparte: 'Él, trabajando en papel', ruta: 'index.html#m1-practica', boton: 'Abrir la práctica',
        pasos: [
          { t: 'tu', x: 'Primero en papel y después escribe el resultado. Muéstreme la hoja por la cámara antes de comprobar.' },
          { t: 'el', x: 'Resuelve los ejercicios 1 a 8.' },
          { t: 'ojo', x: 'Si se traba, primero una pista de la plataforma. Si sigue trabado, comparte el pizarrón, escribe el planteamiento a medias y que él lo complete dictándote.' },
          { t: 'pregunta', x: 'Cuando la plataforma le marque un error: ¿qué pasó? Cuénteme con sus palabras.', r: 'Que explique el error, por ejemplo «multipliqué por 3,6 en vez de dividir».' },
          { t: 'ojo', x: 'Ejercicio 7: si se enreda con km ÷ km/h, abre la caja «Cuando la fracción queda abajo» en Conversión. Para dividir entre una fracción: una encima de la otra, extremos arriba y medios abajo; pruébalo antes con números: 6 ÷ ½ = 12.' },
          { t: 'ojo', x: 'Si se traba con N o J, no es para memorizar: la ficha dice que N = kg · m/s². Para despejar se tratan como cualquier unidad.' },
          { t: 'tu', x: 'En los de opciones, descarte las incorrectas probando con números fáciles.' }
        ]
      },
      {
        tiempo: '74–82 min', titulo: 'Cierre', comparte: 'Los dos', ruta: 'index.html#m1-practica', boton: 'Abrir la práctica',
        pasos: [
          { t: 'tu', x: 'Ahora sin mirar la plataforma, tres preguntas rápidas.' },
          { t: 'pregunta', x: '¿Por qué la balanza se inclinó cuando dividió un solo plato?', r: 'Porque los dos lados dejaron de valer lo mismo.' },
          { t: 'pregunta', x: '¿Cuántos centímetros tiene un metro y por qué?', r: '100: un centímetro es la centésima parte del metro.' },
          { t: 'pregunta', x: '¿En qué piso pone la unidad que quiere eliminar?', r: 'En el contrario al que está.' },
          { t: 'tu', x: 'De tarea quedan los ejercicios 9 a 18. Los dos últimos son retos con raíz cuadrada: si no salen, no pasa nada, los vemos la próxima.' },
          { t: 'el', x: 'Abre el centro de comando IA (arriba a la derecha), copia la plantilla «Estoy trabado» con un ejercicio abierto y mira cómo quedaría para pegarla en ChatGPT.' },
          { t: 'pregunta', x: '¿Qué fue lo más útil de hoy? ¿Qué se le hizo más difícil?', r: 'Anótalo: sirve para preparar la próxima clase.' }
        ]
      }
    ],
    ajustes: [
      ['Si te falta tiempo', 'Deja el reto 7 de conversión y los ejercicios 7 y 8 para la tarea.'],
      ['Si te sobra tiempo', 'Modo libre de la balanza: que despeje la m de F = m · a y la a de vf = v₀ + a · t. O empiecen los retos 17 y 18, con raíz cuadrada.'],
      ['Si va muy rápido', 'No te detengas en lo que ya domina: salta a los ejercicios tipo examen y a los retos.']
    ]
  };

  const ROLES = { tu: 'Tú dices', pregunta: 'Pregúntale', el: 'Él hace', pizarra: 'Pizarrón', accion: 'Tú haces', ojo: 'Ojo' };
  function pasoHtml(p, guia) {
    if (p.t === 'diapo') {
      const d = guia.diapositivas()[p.n - 1];
      return `<li class="gn-diapo">${icono('pantalla')}<span>Diapositiva ${p.n}</span><b>${d ? d.titulo : ''}</b></li>`;
    }
    const texto = p.t === 'tu' || p.t === 'pregunta' ? `«${p.x}»` : p.x;
    return `
      <li class="gn-paso gn-${p.t}">
        <span class="gn-rol">${ROLES[p.t]}</span>
        <div class="gn-texto"><p>${texto}</p>${p.r ? `<p class="gn-espera"><b>Espera:</b> ${p.r}</p>` : ''}</div>
      </li>`;
  }

  // Guías disponibles (la de la clase 2 solo existe si se cargó su archivo)
  const guias = () => [GUIA, MA.GuiaClase2].filter(Boolean);

  function montarGuia(cont) {
    const lista = guias();
    const elegida = MA.almacen.leer('guia.clase', null);
    const guia = lista.find(g => g.id === elegida) || lista[lista.length - 1];
    const hechos = MA.almacen.leer(guia.claveCheck, {}) || {};
    cont.innerHTML = `
      ${lista.length > 1 ? `<div class="segmentado guia-clases" role="group" aria-label="Elegir la clase">${lista.map(g => `<button type="button" class="segmento" data-guia="${g.id}" aria-pressed="${g === guia}">${g.nombre}</button>`).join('')}</div>` : ''}
      <header class="guia-cabeza">
        <span class="pildora pildora-ambar">${icono('info')}Solo para ti</span>
        <h1>${guia.titulo}</h1>
        <p class="entrada">${guia.entrada}</p>
        <p class="texto-3 guia-privada">Ninguna página de la plataforma de tu hermano enlaza a esta. Guárdala en favoritos.</p>
      </header>
      <section class="tarjeta gn-leyenda" aria-label="Cómo leer el guion">
        ${Object.keys(ROLES).map(k => `<span class="gn-${k}"><span class="gn-rol">${ROLES[k]}</span></span>`).join('')}
      </section>
      <div class="guia-columnas">
        <section class="tarjeta">
          <h2>Antes de la llamada</h2>
          <ul class="guia-check">${guia.antes.map((t, i) => `
            <li><label><input type="checkbox" id="guia-check-${i}" data-check="${i}" ${hechos[i] ? 'checked' : ''}><span>${t}</span></label></li>`).join('')}
          </ul>
        </section>
        <section class="tarjeta">
          <h2>Al terminar, tu hermano debe poder</h2>
          <ol class="guia-objetivos">${guia.objetivos.map(t => `<li>${t}</li>`).join('')}</ol>
        </section>
      </div>
      <section class="tarjeta guia-minimo">
        <h2>Lo mínimo antes de cualquier ejercicio</h2>
        <p class="texto-2">Son las cinco ideas de las diapositivas. Si alguna no le queda clara, vuelve a ella antes de seguir.</p>
        <ol>${guia.minimo.map(([t, d]) => `<li><b>${t}.</b> ${d}</li>`).join('')}</ol>
      </section>
      ${guia.enfoque ? `<section class="tarjeta guia-minimo">
        <h2>Cómo trabajar con él</h2>
        <ul>${guia.enfoque.map(t => `<li>${t}</li>`).join('')}</ul>
      </section>` : ''}
      <h2 class="guia-titulo-linea">Guion paso a paso</h2>
      <ol class="guia-linea">
        ${guia.guion.map(b => `
          <li class="guia-bloque">
            <div class="guia-tiempo mono">${b.tiempo}</div>
            <div class="tarjeta guia-cuerpo">
              <div class="guia-bloque-cabeza">
                <h3>${b.titulo}</h3>
                <span class="pildora">${icono('pantalla')}${b.comparte}</span>
              </div>
              <ol class="gn-pasos">${b.pasos.map(p => pasoHtml(p, guia)).join('')}</ol>
              ${b.ruta ? `<div class="fila-botones guia-boton"><a class="btn btn-secundario btn-chico" href="${b.ruta}" target="_blank" rel="noopener">${b.boton}${icono('externo')}</a></div>` : ''}
            </div>
          </li>`).join('')}
      </ol>
      <section class="tarjeta guia-ajustes">
        ${guia.ajustes.map(([t, d]) => `<div><h3>${t}</h3><p>${d}</p></div>`).join('')}
      </section>`;
    cont.onchange = e => {
      const c = e.target.closest('[data-check]');
      if (!c) return;
      hechos[c.dataset.check] = c.checked;
      MA.almacen.guardar(guia.claveCheck, hechos);
    };
    cont.onclick = e => {
      const b = e.target.closest('[data-guia]');
      if (!b) return;
      MA.almacen.guardar('guia.clase', b.dataset.guia);
      montarGuia(cont);
      window.scrollTo({ top: 0 });
    };
  }

  MA.Tutor = { GUIA, montarGuia };
  document.addEventListener('DOMContentLoaded', () => {
    const cont = document.getElementById('guia');
    if (cont) montarGuia(cont);
  });
})();
