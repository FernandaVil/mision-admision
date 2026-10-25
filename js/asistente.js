/* =====================================================================
   CENTRO DE COMANDO IA · asistente de autonomía
   ---------------------------------------------------------------------
   Plantillas listas para copiar en ChatGPT o Claude al estudiar solo.
   Las plantillas son la voz del estudiante hablándole a la IA (de tú);
   están escritas para que la IA dé pistas y revise, no para que
   resuelva. Lo que va entre corchetes se reemplaza; si hay un ejercicio
   abierto en la práctica, se puede insertar automáticamente.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, icono, esc } = MA;
  const HUECO_EJERCICIO = '[pegar aquí el enunciado del ejercicio]';

  const PLANTILLAS = [
    {
      id: 'pista',
      titulo: 'Estoy trabado: dame una pista',
      cuando: 'Cuando no se sabe cómo seguir con un ejercicio.',
      texto: `Hola. Me estoy preparando para el examen de admisión a Ingeniería Aeronáutica y llevo varios años sin estudiar, así que explícame con palabras sencillas. Quiero que actúes como mi tutor de matemáticas y física.

Este es el ejercicio:
${HUECO_EJERCICIO}

Esto es lo que intenté (aunque esté mal):
[escribir mis pasos o en qué parte me trabé]

Reglas importantes:
1. No me des la respuesta final ni resuelvas el ejercicio completo.
2. Dame solo una pista corta sobre el siguiente paso, de preferencia en forma de pregunta.
3. Si te escribo «otra pista», dame una un poco más concreta que la anterior.
4. Cuando te dé mi resultado, dime si es correcto y, si no, en qué paso me equivoqué, sin corregirlo por mí.`
    },
    {
      id: 'revisar',
      titulo: 'Revisa mi procedimiento',
      cuando: 'Cuando ya hay un resultado y se quiere saber si va bien.',
      texto: `Resolví este ejercicio y quiero que revises mi procedimiento como lo haría un buen profesor.

Ejercicio:
${HUECO_EJERCICIO}

Mi procedimiento, paso a paso:
[copiar mis pasos tal como los escribí]

Mi respuesta final: [mi resultado con unidades]

Reglas:
1. No me muestres la solución correcta.
2. Si hay un error, dime solo en qué paso está y de qué tipo es (despeje, signos, unidades o cálculo), y hazme una pregunta que me ayude a encontrarlo yo.
3. Si todo está bien, dímelo y proponme un ejercicio parecido pero un poco más difícil, sin la solución.`
    },
    {
      id: 'concepto',
      titulo: 'No entiendo el concepto',
      cuando: 'Cuando lo que no cuadra es la idea de fondo, no un ejercicio.',
      texto: `No entiendo este tema: [escribir el tema; por ejemplo, por qué al despejar se divide en los dos lados, o cómo acomodar los factores de conversión].

Me surgió la duda con este ejercicio:
${HUECO_EJERCICIO}

Explícamelo así:
1. Primero, con una analogía de la vida diaria (una balanza, plata, recetas de cocina).
2. Luego, con un ejemplo resuelto paso a paso, distinto a mi ejercicio, explicando el porqué de cada paso.
3. Al final, dame un ejercicio parecido para que yo lo resuelva solo. No me des la solución hasta que yo te responda.

Usa frases cortas y palabras sencillas. Si usas un término técnico, explícalo.`
    }
  ];

  const st = { ejercicio: null, incluir: true, abierta: 'pista' };

  function textoFinal(p) {
    if (st.incluir && st.ejercicio) return p.texto.split(HUECO_EJERCICIO).join(st.ejercicio.plano);
    return p.texto;
  }
  function textoHtml(p) {
    let h = esc(p.texto);
    const hueco = esc(HUECO_EJERCICIO);
    if (st.incluir && st.ejercicio) h = h.split(hueco).join(`<span class="insertado">${esc(st.ejercicio.plano)}</span>`);
    return h.replace(/\[[^\]]+\]/g, m => `<mark>${m}</mark>`);
  }

  function pintar(raiz) {
    const hay = !!st.ejercicio;
    $('.as-plantillas', raiz).innerHTML = PLANTILLAS.map((p, i) => `
      <details class="plantilla" data-id="${p.id}" ${st.abierta === p.id ? 'open' : ''}>
        <summary>
          <span class="pl-num">${i + 1}</span>
          <span class="pl-titulo">${p.titulo}<span class="pl-cuando">${p.cuando}</span></span>
          ${icono('chevD', 'chev')}
        </summary>
        <div class="pl-cuerpo">
          <pre class="pl-texto">${textoHtml(p)}</pre>
          <div class="pl-acciones">
            <button type="button" class="btn btn-chico" data-copiar="${p.id}">${icono('copiar')}<span>Copiar plantilla</span></button>
          </div>
        </div>
      </details>`).join('');
    const ctx = $('.as-contexto', raiz);
    ctx.classList.toggle('inactivo', !hay);
    $('input', ctx).disabled = !hay;
    $('input', ctx).checked = hay && st.incluir;
    $('.as-contexto-texto', ctx).innerHTML = hay
      ? `Insertar el <b>ejercicio ${st.ejercicio.numero} de la práctica</b> en las plantillas.`
      : 'Al abrir un ejercicio de la práctica, se puede insertar aquí automáticamente.';
    $$('.plantilla', raiz).forEach(d => d.addEventListener('toggle', () => {
      if (d.open) {
        st.abierta = d.dataset.id;
        $$('.plantilla', raiz).forEach(o => { if (o !== d) o.open = false; });
      }
    }));
  }

  function montar() {
    const raiz = document.getElementById('asistente');
    if (!raiz) return;
    raiz.innerHTML = `
      <div class="as-cabeza">
        <span class="as-icono">${icono('chat')}</span>
        <div>
          <h2>Centro de comando IA</h2>
          <p>Asistente de autonomía para estudiar solo.</p>
        </div>
        <button type="button" class="btn-icono" data-cerrar aria-label="Cerrar el centro de comando">${icono('cerrar')}</button>
      </div>
      <div class="as-cuerpo">
        <p class="as-intro">Para cuando algo no sale: se copia una plantilla, se completa lo que está entre corchetes y se pega en ChatGPT o Claude. Están escritas para que la IA dé <b>pistas</b>, no la respuesta.</p>
        <label class="as-contexto">
          <input type="checkbox" id="as-incluir-ejercicio">
          <span class="as-contexto-texto"></span>
        </label>
        <div class="as-plantillas"></div>
        <div class="as-reglas">
          <h3>Tres reglas para usar la IA</h3>
          <ol>
            <li>Pedir una pista a la vez y volver a intentarlo antes de pedir otra.</li>
            <li>Si la IA da la respuesta completa, decirle: «No me des la respuesta, solo una pista».</li>
            <li>Verificar siempre aquí: la IA también se equivoca, sobre todo en las cuentas.</li>
          </ol>
          <div class="as-enlaces">
            <a href="https://chatgpt.com/" target="_blank" rel="noopener">${icono('externo')}Abrir ChatGPT</a>
            <a href="https://claude.ai/new" target="_blank" rel="noopener">${icono('externo')}Abrir Claude</a>
          </div>
        </div>
      </div>`;

    $('.as-contexto input', raiz).addEventListener('change', e => { st.incluir = e.target.checked; pintar(raiz); });
    raiz.addEventListener('click', async e => {
      const b = e.target.closest('[data-copiar]');
      if (b) {
        const p = PLANTILLAS.find(x => x.id === b.dataset.copiar);
        const ok = await MA.copiarTexto(textoFinal(p));
        if (ok) {
          MA.aviso('Plantilla copiada, lista para pegar en ChatGPT o Claude.');
          b.innerHTML = `${icono('check')}<span>Copiada</span>`;
          setTimeout(() => { b.innerHTML = `${icono('copiar')}<span>Copiar plantilla</span>`; }, 2200);
        } else {
          // Sin permiso de portapapeles: se selecciona el texto para copiarlo a mano
          const pre = $('.pl-texto', b.closest('.plantilla'));
          const rango = document.createRange();
          rango.selectNodeContents(pre);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(rango);
          MA.aviso('Texto seleccionado: se copia con Ctrl + C.', 'info');
        }
        return;
      }
      if (e.target.closest('[data-cerrar]') && MA.plataforma) MA.plataforma.cerrarCajones();
    });
    MA.bus.on('ejercicio-activo', ej => { if (ej) { st.ejercicio = ej; pintar(raiz); } });
    pintar(raiz);
  }

  MA.Asistente = {
    montar,
    abrir(opciones = {}) {
      const raiz = document.getElementById('asistente');
      if (opciones.plantilla) st.abierta = opciones.plantilla;
      if (opciones.incluirEjercicio) st.incluir = true;
      pintar(raiz);
      if (MA.plataforma) MA.plataforma.abrirCajon('asistente');
      const d = $(`.plantilla[data-id="${st.abierta}"]`, raiz);
      if (d) {
        d.scrollIntoView({ block: 'nearest' });
        d.classList.remove('resaltada'); void d.offsetWidth; d.classList.add('resaltada');
      }
    }
  };
})();
