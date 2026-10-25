/* =====================================================================
   CALENTAMIENTO · repaso del módulo 1: de cabeza y en papel
   ---------------------------------------------------------------------
   Cada conversión se responde dos veces: primero de cabeza (rápido,
   sin escribir) y después en papel, con factores. Al final se comparan.
   No se trata de prohibir el cálculo mental: cuando las dos respuestas
   coinciden, perfecto. Algunas están armadas para que la cabeza falle,
   y así se ve para qué sirve escribir los factores.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, icono } = MA;

  function crearCalentamiento(raiz) {
    const C = MA.M2;
    const lista = C.CALENTAMIENTO;
    const estado = MA.almacen.leer('m2.calentamiento', {}) || {};
    const guardar = () => MA.almacen.guardar('m2.calentamiento', estado);

    raiz.classList.add('banco', 'calentamiento');
    raiz.innerHTML = `
      <div class="banco-cabeza">
        <div>
          <span class="etiqueta">Calentamiento</span>
          <h3>De cabeza y en papel</h3>
        </div>
        <div class="cal-marcador" aria-live="polite"></div>
      </div>
      <ol class="cal-lista"></ol>
      <div class="banco-pie cal-cierre" hidden></div>`;

    const lec = (ej, campo) => MA.leerNumeros(campo);
    const bien = (ej, txt) => lec(ej, txt).some(c => MA.casiIgual(c, ej.respuesta, 0.005));
    const errorDe = (ej, txt) => (ej.errores || []).find(er => lec(ej, txt).some(c => MA.casiIgual(c, er.valor, 0.005)));

    function filaHtml(ej, i) {
      const d = estado[ej.id] || {};
      const fase = d.papelOk ? 'listo' : d.cabeza != null ? 'papel' : 'cabeza';
      const cabezaBien = d.cabeza != null && bien(ej, d.cabeza);
      let comparacion = '';
      if (fase === 'listo') {
        const err = !cabezaBien && errorDe(ej, d.cabeza);
        comparacion = cabezaBien
          ? `<div class="mensaje ok">${icono('checkCirculo')}<div><span class="m-titulo">La cabeza y el papel coinciden.</span>¡Muy bien! Con los factores, además, queda comprobado.</div></div>`
          : `<div class="mensaje aviso">${icono('alerta')}<div><span class="m-titulo">De cabeza salió ${MA.esc(d.cabeza)}; en papel, ${MA.fmt(ej.respuesta)} ${ej.unidad}.</span>${err ? err.msg : 'La cabeza se saltó un paso: los factores no dejan que pase.'}</div></div>`;
      }
      return `
        <li class="cal-fila ${fase}" data-id="${ej.id}">
          <div class="cal-enunciado"><span class="cal-num">${i + 1}</span><p>${ej.enunciado}</p></div>
          <div class="cal-respuestas">
            <div class="cal-paso ${fase === 'cabeza' ? 'activo' : ''}">
              <label for="cal-cabeza-${ej.id}"><b>1.</b> De cabeza, sin escribir</label>
              <div class="pr-fila-campo">
                <span class="campo-grupo"><input id="cal-cabeza-${ej.id}" class="campo" data-campo="cabeza" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="Número" ${fase !== 'cabeza' ? 'disabled' : ''} value="${d.cabeza != null ? MA.esc(d.cabeza) : ''}"><span class="campo-unidad">${ej.unidad}</span></span>
                ${fase === 'cabeza' ? '<button type="button" class="btn btn-chico" data-accion="cabeza">Anotar</button>' : ''}
              </div>
            </div>
            <div class="cal-paso ${fase === 'papel' ? 'activo' : ''}" ${fase === 'cabeza' ? 'hidden' : ''}>
              <label for="cal-papel-${ej.id}"><b>2.</b> En papel, con factores</label>
              <div class="pr-fila-campo">
                <span class="campo-grupo"><input id="cal-papel-${ej.id}" class="campo" data-campo="papel" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="Número" ${fase === 'listo' ? `disabled value="${MA.fmt(ej.respuesta).replace(/ /g, '')}"` : ''}><span class="campo-unidad">${ej.unidad}</span></span>
                ${fase === 'papel' ? '<button type="button" class="btn btn-chico" data-accion="papel">Comprobar</button>' : ''}
              </div>
            </div>
          </div>
          <div class="mensaje cal-mensaje" role="status" aria-live="polite"></div>
          ${fase === 'listo' ? `${comparacion}<div class="cal-factores"><small>Con factores</small><div class="mt mt-bloque">${ej.factores}</div></div>` : ''}
        </li>`;
    }

    function pintar() {
      $('.cal-lista', raiz).innerHTML = lista.map(filaHtml).join('');
      const hechos = lista.filter(ej => (estado[ej.id] || {}).papelOk);
      const cabeza = hechos.filter(ej => bien(ej, estado[ej.id].cabeza)).length;
      $('.cal-marcador', raiz).innerHTML = `
        <span class="pildora">De cabeza: ${cabeza} de ${hechos.length}</span>
        <span class="pildora pildora-primaria">En papel: ${hechos.length} de ${lista.length}</span>`;
      const cierre = $('.cal-cierre', raiz);
      cierre.hidden = hechos.length < lista.length;
      if (!cierre.hidden) {
        cierre.innerHTML = cabeza === lista.length
          ? `<div class="mensaje ok">${icono('checkCirculo')}<div><span class="m-titulo">¡Cinco de cinco de cabeza!</span>El módulo 1 está firme. Aun así, en el examen conviene escribir los factores en las conversiones de área, de tiempo y de velocidad: es donde están las trampas.</div></div>`
          : `<div class="mensaje info">${icono('info')}<div><span class="m-titulo">De cabeza: ${cabeza} de ${lista.length}. En papel: ${lista.length} de ${lista.length}.</span>El cálculo mental sirve para estimar y para revisar. Para responder, los factores: no se saltan pasos.</div></div>`;
      }
    }

    function mensaje(fila, tipo, titulo, texto) {
      const ico = { ok: 'checkCirculo', aviso: 'alerta', info: 'info', error: 'errorCirculo' }[tipo];
      const m = $('.cal-mensaje', fila);
      m.className = 'mensaje cal-mensaje ' + tipo;
      m.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }

    function accion(fila, tipo) {
      const ej = lista.find(x => x.id === fila.dataset.id);
      const d = (estado[ej.id] = estado[ej.id] || {});
      const campo = $(`[data-campo="${tipo}"]`, fila);
      const txt = campo.value.trim();
      if (!MA.leerNumeros(txt).length) { mensaje(fila, 'aviso', 'Solo el número.', 'Sin unidades. Ejemplos válidos: 20 · 2,5'); campo.focus(); return; }
      if (tipo === 'cabeza') {
        d.cabeza = txt;
        guardar();
        pintar();
        const sig = $(`[data-id="${ej.id}"] [data-campo="papel"]`, raiz);
        if (sig) sig.focus();
        return;
      }
      if (bien(ej, txt)) {
        d.papelOk = true;
        guardar();
        MA.progreso.marcar('m2.cal.' + ej.id);
        pintar();
        return;
      }
      d.intentos = (d.intentos || 0) + 1;
      guardar();
      const err = errorDe(ej, txt);
      mensaje(fila, 'error', 'Todavía no.', err ? err.msg : 'Revisar los factores: ¿se cancelan todas las unidades menos la que se busca?');
    }

    raiz.addEventListener('click', e => {
      const b = e.target.closest('[data-accion]');
      if (b && raiz.contains(b)) accion(b.closest('.cal-fila'), b.dataset.accion);
    });
    raiz.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const c = e.target.closest('[data-campo]');
      if (c) accion(c.closest('.cal-fila'), c.dataset.campo);
    });
    MA.bus.on('progreso', clave => {
      if (clave === null) { Object.keys(estado).forEach(k => delete estado[k]); guardar(); pintar(); }
    });

    pintar();
    return { pintar };
  }

  MA.Calentamiento = { crear: crearCalentamiento };
})();
