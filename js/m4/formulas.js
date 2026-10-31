/* =====================================================================
   Herramienta 2 · fórmulas en la balanza
   ---------------------------------------------------------------------
   Cada fórmula es una balanza: un lado en cada plato y el «=» en el
   apoyo. Para despejar se elige qué hacer en los dos platos; la
   balanza lo aplica a los dos a la vez (lo que se cancela se ve
   tachado) y sigue en equilibrio. Es la idea de la balanza del módulo
   1, con las fórmulas del movimiento: aquellas solo tenían letras que
   se suman, restan, multiplican o dividen, y estas traen ½, t² y raíz.
   Al final se lee al revés y se comprueba con los números de un reto
   del radar: el resultado lo escribe el estudiante.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, icono } = MA;
  const GRUPOS = { mru: 'Velocidad constante', vel: 'La velocidad', dist: 'La distancia' };

  function crearFormulas(raiz, opciones = {}) {
    const C = MA.M4, R = C.RETOS_FORMULAS;
    const igual = MA.f.op('=');
    const reducido = MA.movimientoReducido();
    const st = { reto: null, origen: null, paso: 0, fase: 'paso', izq: '', der: '', op: '', token: 0 };

    raiz.classList.add('banco', 'mesa-fb');
    raiz.innerHTML = `
      <div class="banco-cabeza">
        <div><span class="etiqueta">Herramienta 2</span><h3>Fórmulas en la balanza</h3></div>
        <div class="m4-retos fb-retos" role="group" aria-label="Retos de las fórmulas"></div>
      </div>
      <div class="bz-origen fb-origen" hidden></div>
      <div class="cv-reto fb-reto"></div>
      <div class="fb-mesa" aria-live="polite"></div>
      <div class="mf-pregunta fb-pregunta" hidden></div>
      <div class="mo-calculo fb-calculo" hidden></div>
      <div class="banco-pie">
        <div class="mensaje fb-mensaje" role="status" aria-live="polite"></div>
        <div class="fila-botones fb-botones"></div>
      </div>
      <section class="cv-bitacora" aria-label="Pasos">
        <h4>Pasos</h4>
        <p class="texto-3">Lo mismo que se escribe en el papel, renglón por renglón.</p>
        <ol class="bz-pasos fb-pasos"></ol>
      </section>`;

    const msg = $('.fb-mensaje', raiz);
    function ponerMensaje(tipo, titulo, texto) {
      if (!tipo) { msg.className = 'mensaje fb-mensaje'; msg.innerHTML = ''; return; }
      const ico = { ok: 'checkCirculo', aviso: 'alerta', info: 'info', error: 'errorCirculo' }[tipo];
      msg.className = 'mensaje fb-mensaje ' + tipo;
      msg.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }
    const pasos = [];
    function agregarPaso(etiqueta, html, nota) { pasos.push({ etiqueta, html, nota }); pintarPasos(); }
    const pintarPasos = () => {
      $('.fb-pasos', raiz).innerHTML = pasos.map(p => `<li><span class="bz-paso-etq">${p.etiqueta}</span><span class="mt">${p.html}</span>${p.nota ? `<span class="bz-paso-nota">${p.nota}</span>` : ''}</li>`).join('');
    };

    function pintarRetos() {
      const boton = r => {
        const i = R.indexOf(r), hecho = MA.progreso.hecho('m4.form.' + r.id);
        return `<button type="button" class="segmento" data-reto="${r.id}" aria-pressed="${!st.origen && st.reto === r}" aria-label="Reto ${i + 1}: ${MA.esc(r.titulo)}${hecho ? ', hecho' : ''}" title="${MA.esc(r.titulo)}">${i + 1}${hecho ? `<span class="ok">${icono('check')}</span>` : ''}</button>`;
      };
      $('.fb-retos', raiz).innerHTML = Object.keys(GRUPOS).map(g =>
        `<span class="m4-grupo"><span class="m4-grupo-nombre">${GRUPOS[g]}</span>${R.filter(r => r.formula === g).map(boton).join('')}</span>`).join('');
    }

    function cargar(reto, origen) {
      st.token++;
      st.reto = reto;
      st.origen = origen || null;
      st.paso = 0;
      st.fase = 'paso';
      st.op = '';
      st.izq = C.FORMULAS[reto.formula].izq;
      st.der = C.FORMULAS[reto.formula].der;
      if (!origen) MA.almacen.guardar('m4.form.reto', reto.id);
      const i = R.indexOf(reto);
      $('.fb-reto', raiz).innerHTML = `
        <div class="m4-pildoras"><span class="pildora">Reto ${i + 1} de ${R.length}</span><span class="pildora">${C.FORMULAS[reto.formula].nombre}</span></div>
        <h4>${reto.titulo}</h4>
        <p>${reto.contexto}</p>`;
      const ori = $('.fb-origen', raiz);
      ori.hidden = !origen;
      if (origen) ori.innerHTML = `<span>${icono('hoja')}${origen.etiqueta}</span><button type="button" class="btn btn-secundario btn-chico" data-accion="volver">${icono('flechaI')}${origen.textoVolver}</button>`;
      pasos.length = 0;
      agregarPaso('Inicio', `${st.izq} ${igual} ${st.der}`);
      ponerMensaje(null);
      pintarRetos();
      pintar();
    }

    function pintar() {
      const r = st.reto;
      $('.fb-mesa', raiz).innerHTML = `
        <div class="bz-meta fb-meta">
          <span class="pildora pildora-primaria">${icono('objetivo')}Meta: dejar sola la ${r.meta}</span>
          <span class="pildora pildora-exito"><span class="punto"></span>En equilibrio</span>
        </div>
        ${C.balanzaHtml(st.izq, st.der)}`;
      if (st.op) $$('.fb-op', raiz).forEach(el => { el.innerHTML = `<span class="mt">${st.op}</span>`; });
      if (st.fase === 'animando' && !reducido) $('.fb-balanza', raiz).classList.add('fb-tambalea');

      const preg = $('.fb-pregunta', raiz);
      preg.hidden = st.fase !== 'paso';
      if (!preg.hidden) {
        const paso = r.pasos[st.paso];
        preg.innerHTML = `
          <p class="cv-preg-titulo">${icono('pista')}<span>${paso.pregunta}</span></p>
          <div class="fila-botones">${paso.opciones.map((o, k) => `<button type="button" class="btn btn-secundario btn-chico fb-opcion" data-op="${k}"><span class="mt">${o.html}</span></button>`).join('')}</div>
          <p class="texto-3">Paso ${st.paso + 1} de ${r.pasos.length}. ${paso.dato ? 'Primero se reemplaza el dato.' : 'Lo que se elige se aplica a los dos platos.'}</p>`;
      }

      const calc = $('.fb-calculo', raiz);
      calc.hidden = st.fase !== 'comprobar';
      if (!calc.hidden) {
        const c = r.comprobar;
        calc.innerHTML = `
          <label for="fb-campo">${c.pregunta}</label>
          <span class="campo-grupo"><input id="fb-campo" class="campo" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="Número"><span class="campo-unidad">${c.unidad}</span></span>
          <button type="button" class="btn btn-chico" data-accion="comprobar">Comprobar</button>
          <p class="texto-3">Con la fórmula despejada, ${MA.f.mt(r.final)}: cada letra por su número.</p>`;
      }
      pintarBotones();
    }

    function pintarBotones() {
      const cont = $('.fb-botones', raiz);
      if (st.fase === 'animando') { cont.innerHTML = ''; return; }
      if (st.fase !== 'listo') {
        cont.innerHTML = `
          <button type="button" class="btn btn-secundario btn-chico" data-accion="pista">${icono('pista')}Pista</button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="reiniciar">${icono('reiniciar')}Reiniciar</button>`;
        return;
      }
      const i = R.indexOf(st.reto), sig = R[i + 1];
      const seguir = st.origen ? `<button type="button" class="btn" data-accion="volver">${icono('flechaI')}${st.origen.textoFinal || st.origen.textoVolver}</button>`
        : sig ? `<button type="button" class="btn" data-sig="${sig.id}">Siguiente reto${icono('flechaD')}</button>`
        : opciones.final ? `<button type="button" class="btn" data-accion="final">${opciones.final.texto}${icono('flechaD')}</button>` : '';
      cont.innerHTML = `${seguir}<button type="button" class="btn btn-secundario" data-accion="reiniciar">${icono('reiniciar')}Repetir</button>`;
    }

    // Una opción de la pregunta: la buena se aplica a los dos platos; las otras explican por qué no
    function elegir(btn) {
      const paso = st.reto.pasos[st.paso], o = paso.opciones[Number(btn.dataset.op)];
      if (!o.ok) {
        btn.classList.add('incorrecta');
        btn.disabled = true;
        ponerMensaje('error', 'Todavía no.', o.porQue);
        return;
      }
      ponerMensaje(null);
      const token = ++st.token;
      st.fase = 'animando';
      st.op = paso.dato ? '' : o.html;
      st.izq = paso.antes.izq;
      st.der = paso.antes.der;
      pintar();
      const seguir = () => {
        if (token !== st.token) return;
        st.op = '';
        st.izq = paso.despues.izq;
        st.der = paso.despues.der;
        agregarPaso(`Paso ${st.paso + 1} · ${paso.etiqueta}`, `${st.izq} ${igual} ${st.der}`, paso.nota);
        st.paso++;
        if (st.paso < st.reto.pasos.length) {
          st.fase = 'paso';
          ponerMensaje('ok', 'En equilibrio.', `${paso.dato ? 'El dato ya está reemplazado.' : 'Se hizo lo mismo en los dos platos, así que la igualdad sigue siendo cierta.'} ${paso.nota}`);
        } else {
          // La meta quedó sola en el plato derecho: se lee al revés
          [st.izq, st.der] = [st.der, st.izq];
          agregarPaso('Se lee al revés', `${st.izq} ${igual} ${st.der}`, 'Si a = b, también b = a.');
          st.fase = 'comprobar';
          ponerMensaje('ok', '¡Despejada!', `La ${st.reto.meta} quedó sola: ${MA.f.mt(st.reto.final)}. Falta comprobarla con números.`);
        }
        pintar();
        if (st.fase === 'comprobar') setTimeout(() => { const c = $('#fb-campo', raiz); if (c) c.focus({ preventScroll: true }); }, 30);
      };
      if (reducido) seguir(); else setTimeout(seguir, 1300);
    }

    function comprobar() {
      const c = st.reto.comprobar, campo = $('#fb-campo', raiz);
      const cands = MA.leerNumeros(campo.value);
      if (!cands.length) { ponerMensaje('aviso', 'Solo el número.', 'Sin la unidad. Ejemplos válidos: 5 · 2,5'); campo.focus(); return; }
      if (cands.some(x => MA.casiIgual(x, c.respuesta, 0.01))) {
        agregarPaso('Comprobación', c.calculo);
        st.fase = 'listo';
        ponerMensaje('ok', '¡Muy bien!', `La fórmula despejada funciona: ${c.calculo}`);
        if (MA.progreso.marcar('m4.form.' + st.reto.id)) MA.aviso('Reto completado.');
        pintarRetos();
        pintar();
        return;
      }
      const err = (c.errores || []).find(e => cands.some(x => MA.casiIgual(x, e.valor, 0.01)));
      ponerMensaje('error', 'Todavía no.', err ? err.msg : `Hay que reemplazar en ${MA.f.mt(st.reto.final)}: cada letra por su número, y después hacer la cuenta.`);
      campo.select();
    }

    function pista() {
      if (st.fase === 'paso') ponerMensaje('info', 'Pista.', st.reto.pasos[st.paso].pista);
      else if (st.fase === 'comprobar') ponerMensaje('info', 'Pista.', `Se reemplaza en ${MA.f.mt(st.reto.final)}. Si hay una resta arriba, primero esa; después, la división.`);
    }

    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b)) return;
      if (b.dataset.reto) { cargar(R.find(r => r.id === b.dataset.reto)); return; }
      if (b.dataset.sig) { cargar(R.find(r => r.id === b.dataset.sig)); raiz.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' }); return; }
      if (b.dataset.op != null) { elegir(b); return; }
      const a = b.dataset.accion;
      if (a === 'comprobar') comprobar();
      else if (a === 'pista') pista();
      else if (a === 'reiniciar') cargar(st.reto, st.origen);
      else if (a === 'volver' && st.origen) st.origen.volver();
      else if (a === 'final' && opciones.final) opciones.final.ir();
    });
    raiz.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'fb-campo') { e.preventDefault(); comprobar(); } });
    MA.bus.on('progreso', () => pintarRetos());

    const guardado = MA.almacen.leer('m4.form.reto', null);
    cargar(R.find(r => r.id === guardado) || R.find(r => !MA.progreso.hecho('m4.form.' + r.id)) || R[0]);

    return {
      cargarReto(id) { const r = R.find(x => x.id === id); if (r) cargar(r); },
      // problema: el id de un reto (los ejercicios abren el despeje que necesitan)
      cargarProblema(problema, origen) { const r = R.find(x => x.id === problema); if (r) cargar(r, origen); }
    };
  }

  MA.Formulas = { crear: crearFormulas };
})();
