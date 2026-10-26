/* =====================================================================
   HERRAMIENTA · CORREDOR DE LA COMA (notación científica)
   ---------------------------------------------------------------------
   Se mueve la coma de a un lugar y la potencia de 10 compensa: si el
   número se achica 10 veces, el exponente sube 1, y al revés. La
   cantidad nunca cambia (la misma idea del factor unitario).
   Antes de mover, se predice hacia dónde va la coma y si el exponente
   sube o baja.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, icono } = MA;
  const { n } = MA.f;
  const LIMITE = 12;

  // Partes del número cifras × 10^(p − e): { ent, dec }
  function partes(cifras, k) {
    if (k >= 0) return { ent: cifras + '0'.repeat(k), dec: '' };
    const pos = cifras.length + k;
    if (pos > 0) return { ent: cifras.slice(0, pos), dec: cifras.slice(pos) };
    return { ent: '0', dec: '0'.repeat(-pos) + cifras };
  }
  const textoNum = ({ ent, dec }) => MA.fmt(Number(ent)) + (dec ? ',' + dec : '');
  const supTexto = e => (e < 0 ? '⁻' : '') + String(Math.abs(e)).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('');
  const potHtml = e => `<span class="pot">${n(10)}<sup class="exp">${e < 0 ? "−" + -e : e}</sup></span>`;

  function crearComa(raiz) {
    const C = MA.M2;
    const st = { reto: null, e: 0, fase: 'dir', origen: null, listo: false };

    raiz.classList.add('banco', 'corredor');
    raiz.innerHTML = `
      <div class="banco-cabeza">
        <div>
          <span class="etiqueta">Herramienta 3</span>
          <h3>Corredor de la coma</h3>
        </div>
        <div class="segmentado nc-retos" role="group" aria-label="Retos de notación científica"></div>
      </div>
      <div class="bz-origen nc-origen" hidden></div>
      <div class="cv-reto nc-reto"></div>
      <div class="nc-pista-meta"></div>
      <div class="nc-mesa">
        <button type="button" class="btn btn-secundario nc-mover" data-mover="izq" aria-label="Mover la coma un lugar a la izquierda">${icono('flechaI')}<span>Coma a la izquierda</span></button>
        <div class="nc-numero" aria-live="polite"></div>
        <button type="button" class="btn btn-secundario nc-mover" data-mover="der" aria-label="Mover la coma un lugar a la derecha"><span>Coma a la derecha</span>${icono('flechaD')}</button>
      </div>
      <p class="nc-igual texto-2"></p>
      <div class="mf-pregunta nc-pregunta" hidden></div>
      <div class="banco-pie">
        <div class="mensaje nc-mensaje" role="status" aria-live="polite"></div>
        <div class="fila-botones nc-botones"></div>
      </div>
      <section class="cv-bitacora" aria-label="Pasos">
        <h4>Pasos</h4>
        <p class="texto-3">Cada lugar que se mueve la coma, el exponente compensa.</p>
        <ol class="bz-pasos nc-pasos"></ol>
      </section>`;

    const msg = $('.nc-mensaje', raiz);
    function ponerMensaje(tipo, titulo, texto) {
      if (!tipo) { msg.className = 'mensaje nc-mensaje'; msg.innerHTML = ''; return; }
      const ico = { ok: 'checkCirculo', aviso: 'alerta', info: 'info', error: 'errorCirculo' }[tipo];
      msg.className = 'mensaje nc-mensaje ' + tipo;
      msg.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }
    const pasos = [];
    const pintarPasos = () => { $('.nc-pasos', raiz).innerHTML = pasos.map(p => `<li><span class="mt">${p.html}</span>${p.nota ? `<span class="bz-paso-nota">${p.nota}</span>` : ''}</li>`).join(''); };

    const meta = () => (st.reto.meta === 'cientifica' ? st.reto.p + st.reto.cifras.length - 1 : 0);
    const k = () => st.reto.p - st.e;
    const expresion = () => {
      const t = textoNum(partes(st.reto.cifras, k()));
      return st.e === 0 ? n(t) : `${n(t)} <span class="op">×</span> ${potHtml(st.e)}`;
    };

    function pintarRetos() {
      $('.nc-retos', raiz).innerHTML = C.RETOS_COMA.map((r, i) => {
        const hecho = MA.progreso.hecho('m2.coma.' + r.id);
        return `<button type="button" class="segmento" data-reto="${r.id}" aria-pressed="${!!(st.reto && st.reto.id === r.id)}">Reto ${i + 1}${hecho ? `<span class="ok">${icono('check')}</span>` : ''}</button>`;
      }).join('');
    }

    function cargar(reto, origen) {
      st.reto = reto;
      st.origen = origen || null;
      st.e = reto.inicio;
      st.fase = 'dir';
      st.listo = false;
      pasos.length = 0;
      if (!origen && reto.id) MA.almacen.guardar('m2.coma.reto', reto.id);
      const i = C.RETOS_COMA.indexOf(reto);
      $('.nc-reto', raiz).innerHTML = `
        ${i >= 0 ? `<span class="pildora">Reto ${i + 1} de ${C.RETOS_COMA.length}</span>` : ''}
        <h4>${reto.titulo || 'Ejercicio de la práctica'}</h4>
        ${reto.contexto ? `<p>${reto.contexto}</p>` : ''}`;
      $('.nc-pista-meta', raiz).innerHTML = `<span class="pildora pildora-primaria">${icono('objetivo')}${reto.meta === 'cientifica' ? 'Meta: notación científica (un número entre 1 y 10, por una potencia de 10)' : 'Meta: escribirlo sin potencia de 10'}</span>`;
      const ori = $('.nc-origen', raiz);
      ori.hidden = !origen;
      if (origen) ori.innerHTML = `<span>${icono('hoja')}Ejercicio ${origen.numero} de la práctica</span><button type="button" class="btn btn-secundario btn-chico" data-accion="volver">${icono('flechaI')}Volver a la práctica</button>`;
      pasos.push({ html: expresion(), nota: 'El número de partida.' });
      ponerMensaje(null);
      pintarRetos();
      pintarPasos();
      pintar();
    }

    // Botones del pie: ayudas mientras se resuelve; al terminar, cómo seguir
    function pintarBotones() {
      const cont = $('.nc-botones', raiz);
      if (!st.listo) {
        cont.innerHTML = `
          <button type="button" class="btn btn-chico" data-accion="listo" ${st.fase !== 'mover' ? 'disabled' : ''}>${icono('check')}Listo</button>
          <button type="button" class="btn btn-secundario btn-chico" data-accion="pista">${icono('pista')}Pista</button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="reiniciar">${icono('reiniciar')}Reiniciar</button>`;
        return;
      }
      const i = C.RETOS_COMA.indexOf(st.reto), sig = C.RETOS_COMA[i + 1];
      const seguir = st.origen ? `<button type="button" class="btn" data-accion="volver">${icono('flechaI')}Volver al ejercicio ${st.origen.numero}</button>`
        : sig ? `<button type="button" class="btn" data-sig="${sig.id}">Siguiente reto${icono('flechaD')}</button>`
        : i >= 0 ? `<a class="btn" href="#m2-practica">Ir a la práctica${icono('flechaD')}</a>` : '';
      cont.innerHTML = `${seguir}<button type="button" class="btn btn-secundario" data-accion="reiniciar">${icono('reiniciar')}Repetir</button>`;
    }

    function pintar() {
      pintarBotones();
      const { ent, dec } = partes(st.reto.cifras, k());
      const celdas = ent.split('').map(c => `<span class="nc-cifra">${c}</span>`).join('')
        + `<span class="nc-coma ${dec ? '' : 'implicita'}" aria-hidden="true">,</span>`
        + dec.split('').map(c => `<span class="nc-cifra">${c}</span>`).join('');
      $('.nc-numero', raiz).innerHTML = `
        <span class="nc-cifras" aria-label="${MA.esc(textoNum({ ent, dec }))}">${celdas}</span>
        <span class="nc-pot"><span class="op">×</span> ${potHtml(st.e)}</span>`;
      $('.nc-igual', raiz).innerHTML = `Vale lo mismo que al principio: la coma se mueve, pero la potencia de 10 compensa.`;
      const bloqueado = st.fase !== 'mover';
      raiz.querySelectorAll('[data-mover]').forEach(b => { b.disabled = bloqueado || Math.abs(k() + (b.dataset.mover === 'izq' ? -1 : 1)) > LIMITE; });
      const preg = $('.nc-pregunta', raiz);
      preg.hidden = !bloqueado || st.listo;
      if (st.fase === 'dir') {
        preg.innerHTML = `
          <p class="cv-preg-titulo">${icono('pista')}Antes de mover: ¿hacia dónde tiene que ir la coma?</p>
          <div class="fila-botones">
            <button type="button" class="btn btn-secundario btn-chico" data-dir="izq">${icono('flechaI')}A la izquierda</button>
            <button type="button" class="btn btn-secundario btn-chico" data-dir="der">A la derecha${icono('flechaD')}</button>
          </div>`;
      } else if (st.fase === 'exp') {
        preg.innerHTML = `
          <p class="cv-preg-titulo">${icono('pista')}Y entonces, ¿el exponente del 10 sube o baja?</p>
          <div class="fila-botones">
            <button type="button" class="btn btn-secundario btn-chico" data-exp="sube">Sube</button>
            <button type="button" class="btn btn-secundario btn-chico" data-exp="baja">Baja</button>
          </div>`;
      }
    }

    const dirCorrecta = () => (meta() > st.e ? 'izq' : 'der');
    function predecirDir(d) {
      const ok = dirCorrecta();
      const actual = textoNum(partes(st.reto.cifras, k()));
      if (d !== ok) {
        ponerMensaje('error', 'Al revés.', st.reto.meta === 'cientifica'
          ? (ok === 'izq' ? `${MA.esc(actual)} tiene que quedar entre 1 y 10: hay que achicarlo, y para eso la coma va a la izquierda.` : `${MA.esc(actual)} tiene que quedar entre 1 y 10: hay que agrandarlo, y para eso la coma va a la derecha.`)
          : (ok === 'izq' ? `El exponente es negativo: para quitarlo, el número tiene que achicarse. La coma va a la izquierda.` : `El exponente es positivo: para quitarlo, el número tiene que crecer. La coma va a la derecha.`));
        return;
      }
      st.fase = 'exp';
      ponerMensaje('ok', '¡Correcto!', ok === 'izq' ? 'Con la coma a la izquierda, el número se achica.' : 'Con la coma a la derecha, el número crece.');
      pintar();
    }
    function predecirExp(x) {
      const ok = dirCorrecta() === 'izq' ? 'sube' : 'baja';
      if (x !== ok) {
        ponerMensaje('error', 'Al revés.', ok === 'sube' ? 'Si el número se achica, la potencia tiene que crecer para que la cantidad sea la misma: el exponente sube.' : 'Si el número crece, la potencia tiene que achicarse para que la cantidad sea la misma: el exponente baja.');
        return;
      }
      st.fase = 'mover';
      ponerMensaje('ok', '¡Correcto!', `Ahora, mover la coma de a un lugar con las flechas y tocar «Listo» cuando ${st.reto.meta === 'cientifica' ? 'quede un número entre 1 y 10' : 'el exponente sea 0'}.`);
      pintar();
    }
    function mover(d) {
      st.e += d === 'izq' ? 1 : -1;
      st.listo = false;
      pasos.push({ html: expresion(), nota: d === 'izq' ? 'Coma a la izquierda: el número se hace 10 veces más pequeño, el exponente sube 1.' : 'Coma a la derecha: el número se hace 10 veces más grande, el exponente baja 1.' });
      pintarPasos();
      ponerMensaje(null);
      pintar();
    }
    function listo() {
      const m = meta();
      if (st.e === m) {
        st.listo = true;
        const final = st.reto.meta === 'cientifica' ? `${textoNum(partes(st.reto.cifras, k()))} × 10${supTexto(st.e)}` : textoNum(partes(st.reto.cifras, k()));
        ponerMensaje('ok', '¡Listo!', `Queda ${MA.esc(final)}${st.reto.unidad ? ' ' + MA.esc(st.reto.unidad) : ''}. La coma se movió ${Math.abs(m - st.reto.inicio)} lugares.`);
        if (st.reto.id && !st.origen) {
          if (MA.progreso.marcar('m2.coma.' + st.reto.id)) MA.aviso('Reto completado.');
          pintarRetos();
        }
        pintarBotones();
        return;
      }
      const t = textoNum(partes(st.reto.cifras, k()));
      if (st.reto.meta === 'cientifica') {
        ponerMensaje('aviso', 'Todavía no.', st.e < m ? `${MA.esc(t)} es 10 o más: falta mover la coma a la izquierda.` : `${MA.esc(t)} es menor que 1: la coma se pasó, hay que volver a la derecha.`);
      } else {
        ponerMensaje('aviso', 'Todavía no.', `Todavía queda × 10${supTexto(st.e)}: ${st.e > 0 ? 'falta mover la coma a la derecha' : 'falta mover la coma a la izquierda'}.`);
      }
    }
    function pista() {
      if (st.fase === 'dir') ponerMensaje('info', 'Pista.', st.reto.meta === 'cientifica' ? '¿El número es más grande que 10 o más pequeño que 1? Para quedar entre 1 y 10, ¿tiene que achicarse o crecer?' : '¿El exponente es positivo o negativo? Un exponente positivo significa un número grande.');
      else if (st.fase === 'exp') ponerMensaje('info', 'Pista.', 'La cantidad no puede cambiar. Si una parte se achica, la otra tiene que crecer.');
      else {
        const faltan = Math.abs(meta() - st.e);
        ponerMensaje('info', 'Pista.', faltan ? `Faltan ${faltan} lugar${faltan === 1 ? '' : 'es'}.` : 'Ya está: tocar «Listo».');
      }
    }

    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b)) return;
      if (b.dataset.reto) { cargar(C.RETOS_COMA.find(x => x.id === b.dataset.reto)); return; }
      if (b.dataset.sig) {
        cargar(C.RETOS_COMA.find(x => x.id === b.dataset.sig));
        raiz.scrollIntoView({ behavior: MA.movimientoReducido() ? 'auto' : 'smooth', block: 'start' });
        return;
      }
      if (b.dataset.dir) { predecirDir(b.dataset.dir); return; }
      if (b.dataset.exp) { predecirExp(b.dataset.exp); return; }
      if (b.dataset.mover) { mover(b.dataset.mover); return; }
      const a = b.dataset.accion;
      if (a === 'listo') listo();
      else if (a === 'pista') pista();
      else if (a === 'reiniciar') cargar(st.reto, st.origen);
      else if (a === 'volver' && st.origen) st.origen.volver();
    });
    MA.bus.on('progreso', clave => { if (clave === null) pintarRetos(); });

    const guardado = MA.almacen.leer('m2.coma.reto', null);
    const primero = C.RETOS_COMA.find(r => r.id === guardado)
      || C.RETOS_COMA.find(r => !MA.progreso.hecho('m2.coma.' + r.id)) || C.RETOS_COMA[0];
    cargar(primero);

    return {
      cargarProblema(problema, origen) {
        const ej = Object.assign({ titulo: 'Ejercicio de la práctica' }, problema);
        ej.contexto = ej.contexto || `Escribir ${MA.esc(textoNum(partes(ej.cifras, ej.p - ej.inicio)))} en notación científica.`;
        cargar(ej, origen);
      }
    };
  }

  MA.Coma = { crear: crearComa };
})();
