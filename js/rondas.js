/* =====================================================================
   Rondas de práctica · motor compartido (módulos 1 a 3)
   ---------------------------------------------------------------------
   Por qué así (decisión pedagógica)
   1. La práctica de cada módulo sigue siendo una lista fija, escrita a
      mano: cada error típico, cada pista y cada pregunta previa se pensó
      para ese ejercicio. Se termina y queda tachada. No se le agregan
      ejercicios, para que un módulo terminado siga terminado.
   2. Lo mecánico se practica en rondas, como el radar de signos: los
      números cambian en cada ronda, pero no las trampas, porque los
      errores típicos se calculan con los mismos números. Las rondas no
      se acaban; cada ronda sí: pocos ejercicios, de lo fácil a lo
      difícil.
   3. Una sola regla, a la vista y sin juego: una ronda es buena si
      tiene a lo sumo un error, y con dos rondas buenas la habilidad
      queda dominada. Un ejercicio cuenta si sale a la primera, sin
      pista y sin mirar la solución. Se pide hacerlo a mano, con los
      pasos en el papel (la calculadora vale para las cuentas).
   4. Lo largo (problemas de enunciado, tipo examen, retos) no se
      genera: sigue en la práctica fija.
   Una habilidad: { id, nombre, detalle, icono, porRonda, y generar(R, k, n)
   o generarRonda(R, n) }, o { id, nombre, detalle, icono, enlace } si
   vive en otra sección (el radar). R es el azar con semilla: R.azar(),
   R.ent(a, b), R.elegir(xs), R.barajar(xs) y R.distinto(lista, fn), que
   repite fn hasta que el ejercicio no esté en la lista. k es la
   posición en la ronda.
   Un ejercicio: { enunciado, plano, tipo: 'numero' | 'opciones',
   respuesta, unidad?, tolerancia?, errores?: [{ valor, msg }],
   opciones?, opcionesPlano?, correcta?, porQue?, tambien?, tituloTambien?,
   fijas? (no se barajan), bien?, pista, solucion: [...], herramienta? }
   La ronda se genera con semilla (módulo, habilidad y número de ronda):
   al recargar la página se ve la misma.
   Estado: misionAdmision.rondas.mN (la ronda abierta de cada habilidad)
   y misionAdmision.rondas.cuenta (rondas hechas y buenas de cada una).
   Dominio: progreso mN.rondas.<id>.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, icono } = MA;
  const LETRAS = 'ABCDEF';
  const BUENAS = 2;   // rondas buenas para dominar una habilidad

  /* ---------- Azar con semilla ---------- */
  function semilla(txt) { let h = 2166136261; for (const c of txt) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }
  function crearAzar(s) {
    let a = s | 0;
    const azar = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const ent = (min, max) => min + Math.floor(azar() * (max - min + 1));
    const elegir = xs => xs[Math.floor(azar() * xs.length)];
    const barajar = xs => { const r = xs.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(azar() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
    const distinto = (lista, fn) => { let ej = fn(); for (let i = 0; i < 20 && lista.some(x => x.plano === ej.plano); i++) ej = fn(); return ej; };
    return { azar, ent, elegir, barajar, distinto };
  }

  /* ---------- Los ejercicios de una ronda ---------- */
  function generarRonda(mod, hab, ronda) {
    const R = crearAzar(semilla(`${mod}.${hab.id}.${ronda}`));
    let lista;
    if (hab.generarRonda) lista = hab.generarRonda(R, hab.porRonda);
    else {
      lista = [];
      for (let k = 0; k < hab.porRonda; k++) lista.push(R.distinto(lista, () => hab.generar(R, k, hab.porRonda)));
    }
    return lista.map(ej => preparar(ej, R));
  }
  // Baraja las opciones (salvo las fijas) y quita los errores que coinciden con la respuesta o se repiten
  function preparar(ej, R) {
    ej.tipo = ej.tipo || 'numero';
    if (ej.tipo === 'opciones') {
      const ks = ej.opciones.map((_, i) => i);
      ej.orden = ej.fijas ? ks : R.barajar(ks);
      ej.porQue = ej.porQue || {};
    } else {
      const tol = ej.tolerancia || 0.01, vistos = [];
      ej.errores = (ej.errores || []).filter(er => {
        if (!isFinite(er.valor) || MA.casiIgual(er.valor, ej.respuesta, tol) || vistos.some(v => MA.casiIgual(er.valor, v, 0.001))) return false;
        vistos.push(er.valor);
        return true;
      });
    }
    return ej;
  }

  /* ---------- Rondas buenas y dominio (lo usa también el radar) ---------- */
  let cuenta = MA.almacen.leer('rondas.cuenta', {}) || {};
  const cuentaDe = (mod, id) => cuenta[mod + '.' + id] || { rondas: 0, buenas: 0 };
  const dominada = (mod, id) => MA.progreso.hecho(`${mod}.rondas.${id}`);
  // Anota una ronda completa: es buena con a lo sumo un error; con BUENAS rondas buenas, la habilidad queda dominada
  function anotar({ mod, hab, aciertos, total }) {
    const c = cuenta[mod + '.' + hab] = cuentaDe(mod, hab);
    const buena = aciertos >= total - 1, yaDominada = dominada(mod, hab);
    c.rondas++;
    if (buena) c.buenas++;
    MA.almacen.guardar('rondas.cuenta', cuenta);
    const dominaAhora = !yaDominada && c.buenas >= BUENAS && MA.progreso.marcar(`${mod}.rondas.${hab}`);
    MA.bus.emit('rondas');
    return { buena, dominaAhora, yaDominada, buenas: c.buenas };
  }
  MA.bus.on('progreso', clave => {
    if (clave !== null) return;
    cuenta = {};
    MA.almacen.guardar('rondas.cuenta', cuenta);
  });
  // El estado de una habilidad, en una píldora: «Dominada», «Rondas buenas: 1 de 2» o «Sin empezar»
  function estadoHtml(mod, id) {
    if (dominada(mod, id)) return `<span class="pildora pildora-exito">${icono('check')}Dominada</span>`;
    const c = cuentaDe(mod, id);
    return c.rondas ? `<span class="pildora pildora-primaria">Rondas buenas: ${c.buenas} de ${BUENAS}</span>` : '<span class="pildora">Sin empezar</span>';
  }

  function crear(raiz, opciones) {
    const mod = opciones.modulo, habs = opciones.habilidades;
    const propias = habs.filter(h => !h.enlace);
    const clave = 'rondas.' + mod;
    const leido = MA.almacen.leer(clave, null) || {};
    const st = { abierta: leido.abierta, habs: leido.habs || {} };
    let hab = null, est = null, lista = [];
    const guardar = () => MA.almacen.guardar(clave, st);
    const firma = xs => String(semilla(xs.map(x => x.plano).join('|')));
    const primera = d => d.r && d.p1;
    const aciertos = () => est.items.filter(primera).length;
    const completa = () => est.items.every(d => d.r);
    const minuscula = s => s.charAt(0).toLowerCase() + s.slice(1);
    const desplazar = el => el.scrollIntoView({ behavior: MA.movimientoReducido() ? 'auto' : 'smooth', block: 'start' });

    raiz.innerHTML = `
      <ol class="pasos-concepto rn-como">
        <li><span class="pc-num">01</span><h3>A mano</h3><p>Cada ejercicio con lápiz y papel, escribiendo los pasos. La calculadora sirve para las cuentas; el procedimiento va en el papel.</p></li>
        <li><span class="pc-num">02</span><h3>A la primera</h3><p>Un ejercicio cuenta si sale bien al primer intento, sin pista y sin mirar la solución. Con ayuda se termina igual, pero no cuenta.</p></li>
        <li><span class="pc-num">03</span><h3>Dos rondas buenas</h3><p>Una ronda es buena si tiene a lo sumo un error. Con dos rondas buenas, la habilidad queda dominada.</p></li>
      </ol>
      <p class="rn-resumen"></p>
      <div class="rn-habilidades" role="group" aria-label="Habilidades para practicar"></div>
      <div class="banco rn-banco">
        <div class="banco-cabeza">
          <div><span class="etiqueta rn-ronda"></span><h3 class="rn-titulo"></h3></div>
          <div class="fila-botones">
            <span class="rn-meta"></span>
            <button type="button" class="btn btn-secundario btn-chico" data-accion="ronda">${icono('reiniciar')}Otra ronda</button>
          </div>
        </div>
        <div class="banco-cuerpo">
          <nav class="pr-mapa rn-mapa" aria-label="Ejercicios de la ronda"></nav>
          <span class="etiqueta rn-numero"></span>
          <div class="rn-enunciado"></div>
          <div class="rn-respuesta"></div>
          <div class="mensaje rn-mensaje" role="status" aria-live="polite"></div>
          <div class="fila-botones rn-ayudas">
            <button type="button" class="btn btn-secundario btn-chico" data-accion="pista">${icono('pista')}Ver una pista</button>
            <button type="button" class="btn btn-fantasma btn-chico" data-accion="solucion"></button>
            <button type="button" class="btn btn-fantasma btn-chico" data-accion="herramienta" hidden></button>
            <button type="button" class="btn btn-fantasma btn-chico" data-accion="ia">${icono('chat')}Pedir ayuda a la IA</button>
          </div>
          <p class="rn-pista" hidden></p>
          <div class="pr-solucion rn-solucion" hidden><h4>Solución paso a paso</h4><ol></ol></div>
        </div>
        <div class="banco-pie">
          <div class="rn-final" hidden></div>
          <div class="fila-botones rn-nav">
            <button type="button" class="btn btn-secundario" data-accion="anterior">${icono('flechaI')}Anterior</button>
            <button type="button" class="btn" data-accion="siguiente">Siguiente${icono('flechaD')}</button>
          </div>
        </div>
      </div>`;
    const msj = $('.rn-mensaje', raiz);

    function ponerMensaje(tipo, titulo, texto) {
      const ico = { ok: 'checkCirculo', aviso: 'alerta', info: 'info', error: 'errorCirculo' }[tipo];
      msj.className = 'mensaje rn-mensaje ' + tipo;
      msj.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }

    /* ---------- Arriba: cuántas habilidades están dominadas y cada habilidad ---------- */
    function pintarResumen() {
      const n = MA.progreso.contar(`${mod}.rondas.`, habs.map(h => h.id));
      $('.rn-resumen', raiz).innerHTML = `<span>Habilidades dominadas en este módulo:</span><b>${n} de ${habs.length}</b>${n === habs.length ? `${icono('checkCirculo')}<span>Todas listas</span>` : ''}`;
    }
    function tarjetaHab(h) {
      const c = cuentaDe(mod, h.id);
      const cuerpo = `
        <span class="rn-hab-cabeza">${icono(h.icono || 'objetivo')}<b>${h.nombre}</b></span>
        <span class="rn-hab-detalle">${h.detalle}</span>
        <span class="rn-hab-estado">${estadoHtml(mod, h.id)}${c.rondas ? `<span class="rn-hab-rondas">${c.rondas} ${c.rondas === 1 ? 'ronda hecha' : 'rondas hechas'}</span>` : ''}</span>`;
      return h.enlace
        ? `<a class="rn-hab" href="${h.enlace}">${cuerpo}<span class="rn-hab-ir">${icono('flechaD')}Está en su propia sección</span></a>`
        : `<button type="button" class="rn-hab" data-hab="${h.id}" aria-pressed="${h === hab}">${cuerpo}</button>`;
    }
    function pintarHabilidades() {
      $('.rn-habilidades', raiz).innerHTML = habs.map(tarjetaHab).join('');
    }

    /* ---------- La ronda abierta ---------- */
    function abrir(id) {
      hab = propias.find(h => h.id === id) || propias[0];
      st.abierta = hab.id;
      est = st.habs[hab.id] = st.habs[hab.id] || { ronda: 1, actual: 0 };
      cargarRonda();
      pintarHabilidades();
      mostrar(est.actual);
    }
    // Si los ejercicios guardados no son los de esta ronda (cambió el generador), se empieza de cero
    function cargarRonda() {
      lista = generarRonda(mod, hab, est.ronda);
      const fir = firma(lista);
      if (est.firma !== fir || !Array.isArray(est.items) || est.items.length !== lista.length) {
        Object.assign(est, { firma: fir, items: lista.map(() => ({})), actual: 0, resultado: null });
      }
      guardar();
    }
    function nuevaRonda() {
      est.ronda++;
      est.items = null;
      cargarRonda();
      pintarHabilidades();
      mostrar(0, true);
      desplazar($('.rn-banco', raiz));
    }

    function pintarMapa() {
      $('.rn-mapa', raiz).innerHTML = `<span class="pr-grupo">${lista.map((_, i) => {
        const d = est.items[i], act = i === est.actual;
        return `<button type="button" class="pr-punto ${d.r ? 'resuelto' : ''} ${act ? 'actual' : ''}" data-ir="${i}"
          aria-label="Ejercicio ${i + 1}${d.r ? ', resuelto' : ''}" ${act ? 'aria-current="step"' : ''}>${d.r ? icono('check') : i + 1}</button>`;
      }).join('')}</span>`;
    }

    function pintarRespuesta(ej, d) {
      const resp = $('.rn-respuesta', raiz);
      if (ej.tipo === 'opciones') {
        const marca = k => (d.r && k === ej.correcta ? 'correcta' : d.r && k === d.eleccion ? 'tambien' : (d.malas || []).includes(k) ? 'incorrecta' : '');
        resp.innerHTML = `<div class="pr-opciones" role="group" aria-label="Opciones">${ej.orden.map((k, pos) => `
          <button type="button" class="pr-opcion ${marca(k)}" data-k="${k}" ${d.r || (d.malas || []).includes(k) ? 'disabled' : ''}><span class="pr-letra">${LETRAS[pos]}</span><span>${ej.opciones[k]}</span></button>`).join('')}</div>`;
        return;
      }
      resp.innerHTML = `
        <label class="pr-etiqueta-campo" for="rn-campo-${mod}">Respuesta</label>
        <div class="pr-fila-campo">
          <span class="campo-grupo ${d.r ? 'rn-bien' : ''}">
            <input id="rn-campo-${mod}" class="campo" type="text" inputmode="${opciones.teclado || 'decimal'}" autocomplete="off" spellcheck="false" placeholder="Número" ${d.r ? 'readonly' : ''}>
            ${ej.unidad ? `<span class="campo-unidad">${ej.unidad}</span>` : ''}
          </span>
          <button type="button" class="btn" data-accion="comprobar" ${d.r ? 'disabled' : ''}>Comprobar</button>
        </div>
        <p class="texto-3 pr-ayuda-campo">${opciones.ayudaCampo || 'Solo el número. Sirven la coma o el punto decimal (2,5 o 2.5) y las fracciones (1/3).'}</p>`;
      if (d.r) $('.campo', resp).value = d.txt || MA.fmt(ej.respuesta);
    }

    function pintarAyudas(ej, d) {
      $('[data-accion="pista"]', raiz).hidden = !!d.p;
      const pista = $('.rn-pista', raiz);
      pista.hidden = !d.p;
      pista.innerHTML = `<b>Pista.</b> ${ej.pista}`;
      const sol = $('.rn-solucion', raiz);
      $('ol', sol).innerHTML = ej.solucion.map(p => `<li>${p}</li>`).join('');
      sol.hidden = !d.v;
      $('[data-accion="solucion"]', raiz).innerHTML = `${icono('libro')}${d.v ? 'Ocultar la solución' : 'Ver la solución'}`;
      const bh = $('[data-accion="herramienta"]', raiz);
      bh.hidden = !(ej.herramienta && opciones.abrirHerramienta);
      if (!bh.hidden) bh.innerHTML = `${icono(ej.herramienta.icono || 'regla')}${ej.herramienta.boton}`;
    }

    function pintarCabeza() {
      $('.rn-ronda', raiz).textContent = `Ronda ${est.ronda}`;
      $('.rn-titulo', raiz).textContent = hab.nombre;
      $('.rn-meta', raiz).innerHTML = estadoHtml(mod, hab.id);
    }

    function mostrar(i, enfocar) {
      est.actual = MA.clamp(i, 0, lista.length - 1);
      guardar();
      const ej = lista[est.actual], d = est.items[est.actual];
      pintarCabeza();
      $('.rn-numero', raiz).textContent = `Ejercicio ${est.actual + 1} de ${lista.length}`;
      $('.rn-enunciado', raiz).innerHTML = `<p>${ej.enunciado}</p>`;
      pintarRespuesta(ej, d);
      msj.className = 'mensaje rn-mensaje';
      msj.innerHTML = '';
      if (d.r) ponerMensaje(d.eleccion != null ? 'info' : 'ok', d.eleccion != null ? (ej.tituloTambien || 'También sirve.') : '¡Correcto!', d.eleccion != null ? ej.porQue[d.eleccion] : (ej.bien || ''));
      pintarAyudas(ej, d);
      $('[data-accion="anterior"]', raiz).disabled = est.actual === 0;
      const sig = $('[data-accion="siguiente"]', raiz);
      sig.disabled = est.actual === lista.length - 1;
      sig.classList.toggle('btn-secundario', !d.r);
      pintarMapa();
      pintarFinal();
      if (enfocar && ej.tipo !== 'opciones' && !d.r) $('.rn-respuesta .campo', raiz).focus({ preventScroll: true });
      // Solo se anuncia al asistente si las rondas están a la vista
      if (raiz.offsetParent !== null) anunciar();
    }

    /* ---------- Responder ---------- */
    function acierto(ej, d, tambien) {
      d.r = true;
      d.p1 = !d.i && !d.p && !d.s;   // a la primera: sin errores, sin pista y sin mirar la solución
      if (tambien != null) d.eleccion = tambien;
      guardar();
      mostrar(est.actual);
      if (tambien == null) ponerMensaje('ok', '¡Correcto!', ej.bien || (d.p1 ? 'A la primera.' : 'Ahora sí. Este no cuenta como a la primera.'));
      anotarSiTermina();
      const fin = $('.rn-final [data-accion="ronda"]', raiz), sig = $('[data-accion="siguiente"]', raiz);
      if (completa() && fin) fin.focus({ preventScroll: true });
      else if (!sig.disabled) sig.focus({ preventScroll: true });
    }
    function fallo(ej, d, texto) {
      d.i = (d.i || 0) + 1;
      let extra = '';
      // A la segunda, la solución completa; el ejercicio se termina escribiendo (o eligiendo) la respuesta
      if (d.i >= 2 && !d.v) {
        d.s = d.v = true;
        pintarAyudas(ej, d);
        extra = ej.tipo === 'opciones' ? ' Abajo está la solución paso a paso: falta elegir la buena.' : ' Abajo está la solución paso a paso: falta escribir el resultado.';
      }
      guardar();
      ponerMensaje('error', 'Todavía no.', texto + extra);
    }
    function comprobar() {
      const ej = lista[est.actual], d = est.items[est.actual];
      if (d.r) return;
      const campo = $('.rn-respuesta .campo', raiz);
      const cands = MA.leerNumeros(campo.value.trim().replace(/^\+/, ''));
      if (!cands.length) { ponerMensaje('info', 'Solo el número.', 'Sin unidades. Ejemplos: 20 · 2,5 · 1/3 · −4'); campo.focus(); return; }
      if (cands.some(c => MA.casiIgual(c, ej.respuesta, ej.tolerancia || 0.01))) { d.txt = campo.value.trim(); acierto(ej, d); return; }
      const err = ej.errores.find(er => cands.some(c => MA.casiIgual(c, er.valor, 0.01)));
      fallo(ej, d, err ? err.msg : (ej.generico || 'Conviene revisar el procedimiento paso a paso.'));
      campo.select();
    }
    function elegir(btn) {
      const ej = lista[est.actual], d = est.items[est.actual];
      if (d.r) return;
      const k = Number(btn.dataset.k);
      if (k === ej.correcta) { acierto(ej, d); return; }
      // También abre, pero por el camino largo: no es un error
      if ((ej.tambien || []).includes(k)) { acierto(ej, d, k); return; }
      d.malas = (d.malas || []).concat(k);
      btn.classList.add('incorrecta');
      btn.disabled = true;
      fallo(ej, d, ej.porQue[k] || 'Esa no es.');
    }

    /* ---------- Fin de la ronda ---------- */
    function anotarSiTermina() {
      if (est.resultado || !completa()) return;
      est.resultado = anotar({ mod, hab: hab.id, aciertos: aciertos(), total: lista.length });
      guardar();
      pintarCabeza();
      pintarFinal();
      const r = est.resultado;
      MA.aviso(r.dominaAhora ? '¡Habilidad dominada!' : r.buena ? 'Ronda buena.' : 'Ronda completa.', 'check');
    }
    // La próxima habilidad sugerida: la siguiente que todavía no está dominada
    function sugerida() {
      const i = propias.indexOf(hab);
      return propias.slice(i + 1).concat(propias.slice(0, i)).find(h => !dominada(mod, h.id)) || null;
    }
    function pintarFinal() {
      const fin = $('.rn-final', raiz);
      fin.hidden = !completa() || !est.resultado;
      if (fin.hidden) { fin.innerHTML = ''; return; }
      const a = aciertos(), t = lista.length, r = est.resultado;
      let texto = `${a} de ${t} a la primera. `;
      if (!r.buena) texto += `Para que la ronda sea buena hace falta a lo sumo un error (${t - 1} de ${t} a la primera). Conviene mirar la solución de los que fallaron y hacer otra ronda.`;
      else if (r.dominaAhora) texto += `Es una ronda buena, y con esta van ${BUENAS}: <b>la habilidad queda dominada.</b> Se puede seguir practicando o pasar a otra habilidad.`;
      else if (r.yaDominada) texto += 'Es una ronda buena. Esta habilidad ya estaba dominada: cada ronda la afianza.';
      else texto += `Es una ronda buena: lleva ${r.buenas} de ${BUENAS}. Con ${BUENAS - r.buenas === 1 ? 'una ronda buena más' : `${BUENAS - r.buenas} rondas buenas más`}, la habilidad queda dominada.`;
      texto += ' En otra ronda cambian los números, pero no las trampas.';
      const sig = sugerida();
      fin.innerHTML = `
        <div class="mensaje ${r.buena ? 'ok' : 'info'}">${icono(r.buena ? 'checkCirculo' : 'info')}<div><span class="m-titulo">${a === t ? '¡Ronda perfecta!' : '¡Ronda completa!'}</span>${texto}</div></div>
        <div class="fila-botones">
          <button type="button" class="btn btn-chico" data-accion="ronda">${icono('reiniciar')}Otra ronda</button>
          ${sig && sig !== hab ? `<button type="button" class="btn btn-secundario btn-chico" data-hab="${sig.id}">Seguir con ${minuscula(sig.nombre)}${icono('flechaD')}</button>` : ''}
        </div>`;
    }

    /* ---------- Asistente IA ---------- */
    function anunciar() {
      const ej = lista[est.actual];
      const plano = ej.tipo === 'opciones' && ej.opcionesPlano
        ? `${ej.plano} Opciones: ${ej.orden.map((k, pos) => `${LETRAS[pos]}) ${ej.opcionesPlano[k]}`).join('; ')}.`
        : ej.plano;
      MA.bus.emit('ejercicio-activo', { numero: est.actual + 1, plano, tema: hab.nombre, donde: `ejercicio ${est.actual + 1} de la ronda` });
    }

    /* ---------- Eventos ---------- */
    raiz.addEventListener('keydown', e => {
      if (e.key !== 'Enter' || !e.target.matches('.rn-respuesta .campo')) return;
      e.preventDefault();
      if (!est.items[est.actual].r) { comprobar(); return; }
      const orden = lista.map((_, k) => (est.actual + 1 + k) % lista.length);
      const sig = orden.find(i => !est.items[i].r);
      if (sig != null) mostrar(sig, true);
    });
    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b)) return;
      if (b.dataset.hab) { abrir(b.dataset.hab); desplazar($('.rn-banco', raiz)); return; }
      if (b.dataset.ir != null) { mostrar(Number(b.dataset.ir), true); return; }
      if (b.classList.contains('pr-opcion')) { elegir(b); return; }
      const ej = lista[est.actual], d = est.items[est.actual];
      switch (b.dataset.accion) {
        case 'comprobar': comprobar(); break;
        case 'pista':
          d.p = true;
          guardar();
          pintarAyudas(ej, d);
          break;
        case 'solucion':
          d.v = !d.v;
          if (d.v) d.s = true;
          guardar();
          pintarAyudas(ej, d);
          break;
        case 'herramienta': opciones.abrirHerramienta(ej, est.actual + 1); break;
        case 'ia':
          anunciar();
          if (MA.Asistente) MA.Asistente.abrir({ plantilla: 'pista', incluirEjercicio: true });
          break;
        case 'anterior': mostrar(est.actual - 1, true); break;
        case 'siguiente': mostrar(est.actual + 1, true); break;
        case 'ronda': nuevaRonda(); break;
      }
    });
    const repintar = () => { pintarResumen(); pintarHabilidades(); };
    MA.bus.on('rondas', repintar);
    MA.bus.on('progreso', clave => {
      if (clave !== null) { repintar(); return; }
      st.habs = {};
      guardar();
      abrir(st.abierta);
      pintarResumen();
    });

    pintarResumen();
    abrir(st.abierta);

    return {
      anunciar,
      abrir,
      irAlBanco() { desplazar($('.rn-banco', raiz)); }
    };
  }

  /* ---------- Textos que usan las vistas de los módulos ---------- */
  const ENTRADA = 'Para seguir practicando lo visto en el módulo, con números nuevos en cada ronda. Cada habilidad se practica en rondas cortas, de lo fácil a lo difícil, hasta dominarla.';
  // Al final de la práctica fija: dónde seguir cuando la lista se termina
  const avisoHtml = mod => `
    <div class="caja caja-neutra rn-aviso">
      <div class="caja-titulo">${icono('reiniciar')}¿Y después de la lista?</div>
      <p>Estos ejercicios son fijos: se resuelven una vez y quedan marcados. Para seguir con números nuevos están las <a href="#${mod}-rondas">rondas de práctica</a>, que no se acaban, hasta dominar cada habilidad.</p>
    </div>`;

  MA.Rondas = { crear, generarRonda, anotar, cuentaDe, dominada, estadoHtml, BUENAS, ENTRADA, avisoHtml };
})();
