/* =====================================================================
   HERRAMIENTA 2 · MESA DE CONVERSIÓN (método del factor unitario)
   ---------------------------------------------------------------------
   La cantidad inicial queda a la izquierda. Se agregan equivalencias
   del banco como fracciones que valen 1, acomodadas para que cada unidad
   que se quiere eliminar quede una vez arriba y otra abajo: en ese
   momento se tacha sola. La cantidad nunca cambia; solo cambia su nombre.
   Para evitar el ensayo y error («invertir hasta que quede bien»):
   - antes de colocar un factor, la mesa pregunta dónde debe ir la unidad
     (predecir → ver → entender);
   - la bitácora explica en palabras qué hace cada factor;
   - si un factor se invierte dos veces sin cancelar nada, aparece la regla.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, icono } = MA;
  const U = MA.unidades;
  const MAX_FACTORES = 6;
  const opuesto = l => (l === 'arriba' ? 'abajo' : 'arriba');
  const lugarTxt = l => (l === 'arriba' ? 'arriba' : 'abajo (dividiendo)');

  function crearConversor(raiz) {
    const C = MA.M1;
    const reducido = MA.movimientoReducido();
    const st = {
      retoId: null, problema: null, cadena: [], resuelto: false, origen: null, contador: 0,
      pregunta: null, predecir: MA.almacen.leer('conv.predecir', true) !== false
    };

    raiz.classList.add('banco', 'conversor');
    raiz.innerHTML = `
      <div class="banco-cabeza">
        <div>
          <span class="etiqueta">Herramienta 2</span>
          <h3>Mesa de conversión</h3>
        </div>
        <div class="segmentado cv-retos" role="group" aria-label="Retos de conversión"></div>
      </div>
      <div class="bz-origen cv-origen" hidden></div>
      <div class="cv-reto"></div>
      <div class="cv-mesa">
        <div class="cv-cadena"></div>
        <div class="cv-calculo"></div>
      </div>
      <div class="cv-pregunta" hidden></div>
      <div class="cv-guia" aria-live="polite"></div>
      <div class="banco-pie">
        <div class="cv-banco">
          <div class="cv-banco-cabeza">
            <h4>Equivalencias disponibles <span class="texto-3">· tocar una o arrastrarla a la mesa</span></h4>
            <label class="cv-predecir"><input type="checkbox" id="cv-predecir" ${st.predecir ? 'checked' : ''}><span>Pensar antes de colocar</span></label>
          </div>
          <div class="cv-equivalencias"></div>
        </div>
        <div class="mensaje cv-mensaje" role="status" aria-live="polite"></div>
        <div class="fila-botones">
          <button type="button" class="btn btn-secundario btn-chico" data-accion="pista">${icono('pista')}Pista</button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="reiniciar">${icono('reiniciar')}Reiniciar</button>
        </div>
      </div>
      <div class="cv-exito" hidden></div>
      <section class="cv-bitacora" aria-label="Bitácora de pasos">
        <h4>Bitácora de pasos</h4>
        <p class="texto-3">Qué hace cada factor, en palabras. Así se piensa en el examen.</p>
        <ol class="bz-pasos cv-pasos"></ol>
      </section>`;

    const msg = $('.cv-mensaje', raiz);
    function ponerMensaje(tipo, titulo, texto) {
      const ico = { ok: 'checkCirculo', aviso: 'alerta', info: 'info', error: 'errorCirculo' }[tipo];
      msg.className = 'mensaje cv-mensaje ' + tipo;
      msg.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }

    /* ---------- Render de piezas ---------- */
    const unidadHtml = (unidad, exp, clase) => `<span class="un cv-un ${clase || ''}" data-u="${unidad}">${unidad}${U.sup(exp)}</span>`;
    function ladoHtml(valor, mapa, fichas, origen, lugar) {
      const unidades = Object.keys(mapa).map(k => {
        const fi = fichas.find(x => x.origen === origen && x.lugar === lugar && x.unidad === k);
        const clase = fi ? (fi.estado === 'cancelada' ? 'tachado' : fi.estado === 'parcial' ? 'parcial' : '') : '';
        return unidadHtml(k, mapa[k], clase);
      }).join('<span class="op">·</span>');
      return `<span class="num">${MA.fmt(valor)}</span> ${unidades}`;
    }
    const eqTexto = id => { const e = U.EQUIV[id]; return `${MA.fmt(e.a[0])} ${U.textoUnaParte(e.a[1])} = ${MA.fmt(e.b[0])} ${U.textoUnaParte(e.b[1])}`; };
    const fraccionTexto = (num, den) => `${MA.fmt(num[0])} ${U.textoUnaParte(num[1])} / ${MA.fmt(den[0])} ${U.textoUnaParte(den[1])}`;
    const lista = arr => arr.length > 1 ? arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1] : arr[0];
    const conExp = (u, e) => `${u}${U.sup(e)}`;
    const vecesTxt = n => ['', 'una vez', 'dos veces', 'tres veces', 'cuatro veces'][n] || `${n} veces`;

    /* Qué hace el factor i: qué cancela y qué deja */
    function explicarFactor(i, e) {
      const fichas = e.fichas.filter(f => f.origen === i);
      const cancela = fichas.filter(f => f.estado !== 'viva').map(f => `${conExp(f.unidad, f.exp)} ${f.lugar} se cancela con ${f.unidad} ${opuesto(f.lugar)}`);
      const deja = fichas.filter(f => f.estado === 'viva').map(f => `${conExp(f.unidad, f.exp)} ${f.lugar}`);
      return { cancela, deja };
    }
    /* Por qué el factor i no acerca a la meta, con el caso concreto */
    function motivo(i, e) {
      const tipo = e.arreglos[i];
      if (tipo !== 'invertir') return { tipo, razon: '' };
      const { num, den } = U.orientar(st.cadena[i]);
      const unidades = Object.keys(U.mult(num[1], den[1], -1));
      const datos = unidades.map(k => ({ k, neto: e.u[k] || 0, meta: st.problema.meta[k] || 0 }));
      const dobles = datos.filter(d => Math.abs(d.neto) >= 2 && d.neto !== d.meta)
        .map(d => `${d.k} queda ${vecesTxt(Math.abs(d.neto))} ${d.neto > 0 ? 'arriba' : 'abajo'} (${conExp(d.k, Math.abs(d.neto))})`);
      const piso = datos.filter(d => d.neto && d.meta && Math.sign(d.neto) !== Math.sign(d.meta))
        .map(d => `${d.k} queda ${d.neto > 0 ? 'arriba' : 'abajo'}, pero la meta la pide ${d.neto > 0 ? 'abajo' : 'arriba'}`);
      return { tipo, razon: dobles.length ? lista(dobles) : piso.length ? lista(piso) : '' };
    }
    function motivoTexto(i, e) {
      const m = motivo(i, e);
      if (m.tipo === 'quitar') return 'no hace falta para esta conversión: conviene quitarlo con la ×.';
      return `está al revés${m.razon ? ': ' + m.razon : ''}. Conviene invertirlo.`;
    }
    const mayus = s => s.charAt(0).toUpperCase() + s.slice(1);

    function pintarRetos() {
      $('.cv-retos', raiz).innerHTML = C.RETOS_CONVERSION.map((r, i) => `
        <button type="button" class="segmento" data-reto="${r.id}" aria-pressed="${st.retoId === r.id}" title="${MA.esc(r.titulo)}">
          Reto ${i + 1}${MA.progreso.hecho('m1.conv.' + r.id) ? `<span class="ok">${icono('check')}</span>` : ''}
        </button>`).join('');
    }
    function pintarBanco() {
      const cont = $('.cv-equivalencias', raiz);
      cont.innerHTML = st.problema.banco.map(id => `
        <button type="button" class="cv-eq" data-eq="${id}" aria-label="Agregar la equivalencia ${eqTexto(id)}">
          <span class="cv-eq-mano" aria-hidden="true">${icono('mas')}</span>
          <span class="mt">${eqTexto(id).replace(/(\d[\d, ]*)/g, '<span class="num">$1</span>')}</span>
        </button>`).join('');
      $$('.cv-eq', cont).forEach(b => MA.arrastrable(b, {
        destinos: '.cv-cadena',
        esValido: d => raiz.contains(d) && !st.resuelto,
        alSoltar: () => agregar(b.dataset.eq),
        alTocar: () => agregar(b.dataset.eq)
      }));
    }

    function pintarBitacora(e) {
      const p = st.problema;
      const ini = U.separar(p.inicio.u);
      const arriba = Object.keys(ini.arriba).map(k => conExp(k, ini.arriba[k]));
      const abajo = Object.keys(ini.abajo).map(k => conExp(k, ini.abajo[k]));
      const pasos = [{
        etq: 'Inicio',
        html: `<span class="mt">${MA.fmt(p.inicio.valor)} ${U.texto(p.inicio.u)}</span>`,
        nota: `Arriba: ${lista(arriba)}${abajo.length ? ` · abajo (dividiendo): ${lista(abajo)}` : ''}. Meta: ${U.texto(p.meta)}.`
      }];
      st.cadena.forEach((fc, i) => {
        const { num, den } = U.orientar(fc);
        const x = explicarFactor(i, e);
        const frases = x.cancela.concat(x.deja.length ? [`deja ${lista(x.deja)}`] : []);
        pasos.push({
          etq: `Factor ${i + 1} · ${eqTexto(fc.eq)}`,
          html: `<span class="mt">${MA.f.fr(`${MA.fmt(num[0])} ${U.textoUnaParte(num[1])}`, `${MA.fmt(den[0])} ${U.textoUnaParte(den[1])}`)}</span>`,
          texto: frases.length ? frases.join('; ') + '.' : '',
          aviso: e.sospechosos[i] ? mayus(motivoTexto(i, e)) : ''
        });
      });
      if (e.listo) {
        const arr = e.arribaNums.filter((n, i) => i === 0 || n !== 1).map(n => MA.fmt(n)).join(' · ');
        const ab = e.abajoNums.filter(n => n !== 1).map(n => MA.fmt(n)).join(' · ');
        pasos.push({ etq: 'Resultado', html: `<span class="mt"><span class="num">${MA.fmtSig(e.valor, 6)}</span> <span class="un">${U.texto(p.meta)}</span></span>`, texto: `Solo quedan ${U.texto(p.meta)}. La cuenta: ${ab ? `(${arr}) ÷ (${ab})` : arr}.` });
      } else if (e.porEliminar.length && st.cadena.length) {
        pasos.push({ etq: 'Falta', texto: `Todavía queda ${lista(e.porEliminar.map(x => `${conExp(x.unidad, x.veces)} ${x.lugar}`))}.` });
      }
      $('.cv-pasos', raiz).innerHTML = pasos.map(s => `
        <li><span class="bz-paso-etq">${s.etq}</span>${s.html || ''}${s.texto ? `<span class="cv-paso-texto">${s.texto}</span>` : ''}${s.nota ? `<span class="cv-paso-texto">${s.nota}</span>` : ''}${s.aviso ? `<span class="bz-paso-nota">${s.aviso}</span>` : ''}</li>`).join('');
    }

    function pintar() {
      const p = st.problema;
      const e = U.estado(p, st.cadena);
      const ini = U.separar(p.inicio.u);
      const tieneAbajo = Object.keys(ini.abajo).length > 0;
      const inicioHtml = tieneAbajo
        ? `<span class="fr"><span class="fr-n">${ladoHtml(p.inicio.valor, ini.arriba, e.fichas, -1, 'arriba')}</span><span class="fr-d">${ladoHtml(1, ini.abajo, e.fichas, -1, 'abajo')}</span></span>`
        : ladoHtml(p.inicio.valor, ini.arriba, e.fichas, -1, 'arriba');
      const factores = st.cadena.map((fc, i) => {
        const { num, den } = U.orientar(fc);
        return `
          <span class="op cv-por">×</span>
          <div class="cv-factor ${e.sospechosos[i] ? 'sospechoso' : ''} ${fc.nuevo ? 'nuevo' : ''} ${fc.girando ? 'girando' : ''}" data-i="${i}">
            <button type="button" class="cv-fraccion mt" data-accion="invertir" data-i="${i}" aria-label="Factor ${fraccionTexto(num, den)}. Tocar para invertirlo">
              <span class="fr"><span class="fr-n">${ladoHtml(num[0], num[1], e.fichas, i, 'arriba')}</span><span class="fr-d">${ladoHtml(den[0], den[1], e.fichas, i, 'abajo')}</span></span>
            </button>
            <div class="cv-factor-acciones">
              <button type="button" class="cv-mini" data-accion="invertir" data-i="${i}">${icono('invertir')}Invertir</button>
              <button type="button" class="cv-mini cv-quitar" data-accion="quitar" data-i="${i}" aria-label="Quitar este factor">${icono('cerrar')}</button>
            </div>
            ${e.sospechosos[i] ? '<span class="cv-alerta">No acerca a la meta</span>' : ''}
          </div>`;
      }).join('');
      const unidadTxt = U.texto(e.u) || 'sin unidades';
      $('.cv-cadena', raiz).innerHTML = `
        <div class="cv-inicio-bloque">
          <div class="cv-inicio mt">${inicioHtml}</div>
          ${tieneAbajo ? '<div class="cv-pisos" aria-hidden="true"><span>arriba</span><span>abajo, dividiendo</span></div>' : ''}
        </div>
        ${factores}
        ${st.resuelto || st.cadena.length >= MAX_FACTORES ? '' : `<span class="op cv-por">×</span><div class="cv-ranura">${icono('mas')}<span>Agregar una equivalencia</span></div>`}
        <span class="op cv-igual">=</span>
        <div class="cv-resultado ${e.listo ? 'listo' : ''}">
          <small>${e.listo ? 'Resultado' : 'La misma cantidad, ahora en'}</small>
          <span class="mt"><span class="num">${MA.fmtSig(e.valor, 6)}</span> <span class="un">${unidadTxt}</span></span>
        </div>`;
      st.cadena.forEach(fc => { fc.nuevo = false; fc.girando = false; });

      // Cálculo numérico (sin los unos)
      const arriba = e.arribaNums.filter((x, i) => i === 0 || x !== 1).map(x => MA.fmt(x));
      const abajo = e.abajoNums.filter(x => x !== 1).map(x => MA.fmt(x));
      $('.cv-calculo', raiz).innerHTML = st.cadena.length
        ? `<span class="texto-3">Cálculo:</span> <span class="mt">${abajo.length ? MA.f.fr(arriba.join(' · '), abajo.join(' · ')) : arriba.join(' · ')} <span class="op">=</span> <span class="num">${MA.fmtSig(e.valor, 6)}</span></span>`
        : '';

      // Guía: qué falta eliminar y qué falta conseguir
      const guia = $('.cv-guia', raiz);
      if (e.listo) guia.innerHTML = `<span class="pildora pildora-exito">${icono('check')}Unidades correctas: ${U.texto(p.meta)}</span>`;
      else {
        const elim = e.porEliminar.map(x => `<span class="pildora pildora-ambar">${x.unidad}${U.sup(x.veces)} · está ${x.lugar}</span>`).join('');
        const cons = e.porConseguir.map(x => `<span class="pildora">${x.unidad} · ${x.lugar}</span>`).join('');
        guia.innerHTML = `
          ${elim ? `<div><span class="cv-guia-etq">Por eliminar</span>${elim}</div>` : ''}
          ${cons ? `<div><span class="cv-guia-etq">Por conseguir</span>${cons}</div>` : ''}`;
      }
      $$('.cv-eq', raiz).forEach(b => { b.disabled = st.resuelto || st.cadena.length >= MAX_FACTORES; });
      $('[data-accion="pista"]', raiz).disabled = st.resuelto;
      pintarBitacora(e);
      return e;
    }

    /* ---------- Pensar antes de colocar ---------- */
    function preguntar(eqId, pend) {
      st.pregunta = { eqId, unidad: pend.unidad, lugar: pend.lugar, veces: pend.veces };
      const caja = $('.cv-pregunta', raiz);
      caja.hidden = false;
      caja.innerHTML = `
        <div class="cv-preg-cuerpo" role="group" aria-label="Pensar antes de colocar">
          <p class="cv-preg-titulo">Antes de colocar <b>${eqTexto(eqId)}</b></p>
          <p>Para cancelar <b>${pend.unidad}</b>, ¿dónde tiene que quedar <b>${pend.unidad}</b> en este factor?</p>
          <div class="fila-botones">
            <button type="button" class="btn btn-chico" data-predice="arriba">Arriba</button>
            <button type="button" class="btn btn-chico" data-predice="abajo">Abajo</button>
            <button type="button" class="btn btn-fantasma btn-chico" data-predice="ver">${icono('objetivo')}Ver dónde está ${pend.unidad} ahora</button>
            <button type="button" class="btn btn-fantasma btn-chico" data-predice="cancelar">Cancelar</button>
          </div>
        </div>`;
      $('[data-predice="arriba"]', caja).focus({ preventScroll: true });
    }
    function cerrarPregunta() {
      st.pregunta = null;
      const caja = $('.cv-pregunta', raiz);
      caja.hidden = true;
      caja.innerHTML = '';
    }
    function responder(resp) {
      const q = st.pregunta;
      if (!q) return;
      if (resp === 'cancelar') { cerrarPregunta(); return; }
      if (resp === 'ver') {
        $$(`.cv-cadena .cv-un[data-u="${q.unidad}"]:not(.tachado)`, raiz).forEach(el => { el.classList.remove('resaltada'); void el.offsetWidth; el.classList.add('resaltada'); });
        return;
      }
      const eq = U.EQUIV[q.eqId];
      const enA = !!eq.a[1][q.unidad];
      const inv = enA ? resp === 'abajo' : resp === 'arriba';
      const correcto = resp !== q.lugar;
      cerrarPregunta();
      st.cadena.push({ eq: q.eqId, inv, nuevo: !reducido, id: ++st.contador, invertidas: 0 });
      const e = pintar();
      if (e.listo) return exito(e);
      const u = q.unidad, antes = conExp(u, q.veces);
      if (correcto) {
        const sig = e.porEliminar[0];
        ponerMensaje('ok', '¡Eso es!', `${antes} estaba ${lugarTxt(q.lugar)}; en el factor va ${resp}, y ${u} ÷ ${u} = 1: se cancela${q.veces > 1 ? ' una' : ''}.${sig ? ` Todavía queda ${conExp(sig.unidad, sig.veces)} ${sig.lugar}.` : ''}`);
      } else {
        const veces = Math.abs(e.u[u] || 0);
        ponerMensaje('aviso', 'Así no se cancela.', `${antes} ya estaba ${lugarTxt(q.lugar)}. Con ${u} también ${resp} en el factor, queda ${vecesTxt(veces)} ${resp} (${conExp(u, veces)}). Para cancelarse, ${u} tiene que estar una vez arriba y otra abajo: se arregla con «Invertir».`);
      }
    }

    /* ---------- Carga ---------- */
    function cargar(problema, retoId) {
      st.problema = problema;
      st.retoId = retoId || null;
      st.cadena = [];
      st.resuelto = false;
      cerrarPregunta();
      $('.cv-exito', raiz).hidden = true;
      const r = problema;
      const numero = C.RETOS_CONVERSION.findIndex(x => x.id === retoId);
      $('.cv-reto', raiz).innerHTML = `
        <div class="bz-meta"><span class="pildora pildora-primaria">${icono('objetivo')}Meta: expresarlo en ${U.texto(r.meta)}</span></div>
        <h4>${numero >= 0 ? `Reto ${numero + 1}. ` : ''}${r.titulo || 'Conversión del ejercicio'}</h4>
        ${r.contexto ? `<p>${r.contexto}</p>` : `<p>Convertir ${MA.fmt(r.inicio.valor)} ${U.texto(r.inicio.u)} a ${U.texto(r.meta)}.</p>`}`;
      pintarBanco();
      pintarRetos();
      pintarOrigen();
      ponerMensaje('info', 'Primero, la unidad que se quiere eliminar.', 'Elegir una equivalencia que la contenga y acomodarla para que esa unidad quede en el piso contrario.');
      pintar();
    }
    function cargarReto(id) {
      st.origen = null;
      cargar(C.RETOS_CONVERSION.find(x => x.id === id), id);
    }
    function cargarProblema(problema, origen) {
      st.origen = origen || null;
      cargar(Object.assign({ titulo: origen ? `Ejercicio ${origen.numero} de la práctica` : null }, problema), null);
    }
    function pintarOrigen() {
      const caja = $('.cv-origen', raiz);
      if (!st.origen) { caja.hidden = true; return; }
      caja.hidden = false;
      caja.innerHTML = `<span>${icono('hoja')}Abierto desde el ejercicio ${st.origen.numero} de la práctica.</span>
        <button type="button" class="btn btn-secundario btn-chico">${icono('flechaI')}Volver al ejercicio</button>`;
      $('button', caja).onclick = () => { const o = st.origen; st.origen = null; pintarOrigen(); o.volver(); };
    }

    /* ---------- Acciones ---------- */
    function agregar(eqId) {
      if (st.resuelto) return;
      if (st.cadena.length >= MAX_FACTORES) { ponerMensaje('aviso', 'La mesa está llena.', 'Conviene quitar algún factor que no ayude.'); return; }
      if (st.predecir) {
        const e = U.estado(st.problema, st.cadena);
        const eq = U.EQUIV[eqId];
        const pend = e.porEliminar.find(x => eq.a[1][x.unidad] || eq.b[1][x.unidad]);
        if (pend) { preguntar(eqId, pend); return; }
      }
      st.cadena.push({ eq: eqId, inv: false, nuevo: !reducido, id: ++st.contador, invertidas: 0 });
      const e = pintar();
      despues(e, `${eqTexto(eqId)}, agregada como fracción.`);
    }
    function invertir(i) {
      const fc = st.cadena[i];
      if (!fc || st.resuelto) return;
      fc.inv = !fc.inv;
      fc.invertidas = (fc.invertidas || 0) + 1;
      fc.girando = !reducido;
      const e = pintar();
      if (e.listo) return exito(e);
      const x = explicarFactor(i, e);
      if (x.cancela.length && !e.sospechosos[i]) {
        ponerMensaje('ok', 'Factor invertido.', `Ahora ${x.cancela.join('; ')}.`);
        return;
      }
      if (fc.invertidas >= 2) {
        // Invertir al azar no enseña: se explica la regla con el caso concreto
        const { num, den } = U.orientar(fc);
        const unidades = Object.keys(U.mult(num[1], den[1], -1));
        const pend = e.porEliminar.find(p => unidades.includes(p.unidad));
        if (pend) {
          ponerMensaje('aviso', 'Antes de invertir otra vez, a pensarlo:', `${pend.unidad} está ${lugarTxt(pend.lugar)} en la mesa. Para cancelarla, en el factor tiene que ir ${opuesto(pend.lugar)}: así queda ${pend.unidad} arriba y ${pend.unidad} abajo, y ${pend.unidad} ÷ ${pend.unidad} = 1.`);
          return;
        }
      }
      despues(e, 'Factor invertido: sigue valiendo 1, pero ahora las unidades están en el otro piso.');
    }
    function quitar(i) {
      if (st.resuelto) return;
      st.cadena.splice(i, 1);
      const e = pintar();
      despues(e, 'Factor quitado.');
    }
    function despues(e, accion) {
      if (e.listo) return exito(e);
      const i = e.sospechosos.indexOf(true);
      if (i >= 0) {
        const { num, den } = U.orientar(st.cadena[i]);
        ponerMensaje('aviso', 'Hay un factor que no acerca a la meta.', `${accion} El factor ${fraccionTexto(num, den)} ${motivoTexto(i, e)}`);
        return;
      }
      const pend = e.porEliminar[0];
      ponerMensaje('info', accion, pend ? `Todavía queda ${pend.unidad}${U.sup(pend.veces)} ${pend.lugar}. Falta una equivalencia que lo contenga.` : 'Hay que revisar qué unidades faltan para llegar a la meta.');
    }
    function pista() {
      const e = U.estado(st.problema, st.cadena);
      const i = e.sospechosos.indexOf(true);
      if (i >= 0) {
        ponerMensaje('info', `Ojo con el factor número ${i + 1}.`, e.arreglos[i] === 'quitar'
          ? 'No hace falta para esta conversión: se quita con la ×.'
          : 'Está al revés: se invierte tocándolo o con «Invertir».');
        $$('.cv-factor', raiz)[i].classList.add('sugerida');
        return;
      }
      const pend = e.porEliminar[0];
      if (!pend) { ponerMensaje('info', 'Revisar la meta.', `Hay ${U.texto(e.u)} y se busca ${U.texto(st.problema.meta)}.`); return; }
      const id = st.problema.banco.find(k => U.EQUIV[k].a[1][pend.unidad] || U.EQUIV[k].b[1][pend.unidad]);
      if (!id) { ponerMensaje('aviso', 'No hay una equivalencia directa.', `Hace falta una cadena que pase por ${pend.unidad}.`); return; }
      const eq = U.EQUIV[id];
      const enA = !!eq.a[1][pend.unidad];
      // La unidad debe quedar en el piso contrario al que ocupa ahora
      const quieroAbajo = pend.lugar === 'arriba';
      const num = (enA === quieroAbajo) ? eq.b : eq.a, den = (enA === quieroAbajo) ? eq.a : eq.b;
      ponerMensaje('info', `Para eliminar ${pend.unidad} (que está ${lugarTxt(pend.lugar)}):`,
        `usar ${eqTexto(id)} y acomodarla con ${pend.unidad} ${quieroAbajo ? 'abajo' : 'arriba'}: ${fraccionTexto(num, den)}.`);
      const b = $(`.cv-eq[data-eq="${id}"]`, raiz);
      if (b) { b.classList.remove('sugerida'); void b.offsetWidth; b.classList.add('sugerida'); }
    }
    function exito(e) {
      st.resuelto = true;
      cerrarPregunta();
      const p = st.problema;
      const final = pintar();
      ponerMensaje('ok', '¡Muy bien!', 'Conversión completa: todas las unidades que sobraban se cancelaron.');
      // Línea "como en el papel" (copiada de la mesa, sin botones)
      const linea = [$('.cv-inicio', raiz).innerHTML].concat($$('.cv-fraccion', raiz).map(b => b.innerHTML)).join(' <span class="op">·</span> ');
      const box = $('.cv-exito', raiz);
      box.hidden = false;
      box.innerHTML = `
        <div class="bz-exito-cabeza">${icono('checkCirculo')}<div><span class="etiqueta">Conversión completa</span>
          <h4>${MA.fmt(p.inicio.valor)} ${U.texto(p.inicio.u)} = ${MA.fmtSig(final.valor, 6)} ${U.texto(p.meta)}</h4></div></div>
        <p class="texto-2">Así se escribe en el papel:</p>
        <div class="cv-linea mt">${linea} <span class="op">=</span> <span class="num">${MA.fmtSig(final.valor, 6)}</span> <span class="un">${U.texto(p.meta)}</span></div>
        ${p.nota ? `<div class="caja"><div class="caja-titulo">${icono('pista')}Para recordar</div>${p.nota}</div>` : ''}
        <div class="fila-botones"></div>`;
      const botones = $('.fila-botones', box);
      const idx = C.RETOS_CONVERSION.findIndex(r => r.id === st.retoId);
      if (idx >= 0) {
        MA.progreso.marcar('m1.conv.' + st.retoId);
        pintarRetos();
        const sig = C.RETOS_CONVERSION[idx + 1];
        botones.insertAdjacentHTML('beforeend', sig
          ? `<button type="button" class="btn" data-ir="${sig.id}">Siguiente reto${icono('flechaD')}</button>`
          : `<button type="button" class="btn" data-ir="practica">Ir a la práctica${icono('flechaD')}</button>`);
      }
      if (st.origen) botones.insertAdjacentHTML('beforeend', `<button type="button" class="btn" data-ir="origen">${icono('flechaI')}Volver al ejercicio ${st.origen.numero}</button>`);
      botones.insertAdjacentHTML('beforeend', `<button type="button" class="btn btn-secundario" data-accion="reiniciar">${icono('reiniciar')}Repetir</button>`);
      if (window.innerWidth < 900) box.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'nearest' });
    }

    /* ---------- Eventos ---------- */
    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b)) return;
      if (b.dataset.predice) { responder(b.dataset.predice); return; }
      if (b.dataset.reto) { cargarReto(b.dataset.reto); return; }
      if (b.dataset.ir === 'practica') { location.hash = '#m1-practica'; return; }
      if (b.dataset.ir === 'origen') { const o = st.origen; st.origen = null; pintarOrigen(); if (o) o.volver(); return; }
      if (b.dataset.ir) { cargarReto(b.dataset.ir); raiz.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' }); return; }
      const accion = b.dataset.accion, i = Number(b.dataset.i);
      if (accion === 'invertir') invertir(i);
      else if (accion === 'quitar') quitar(i);
      else if (accion === 'pista') pista();
      else if (accion === 'reiniciar') { if (st.retoId) cargar(st.problema, st.retoId); else cargarProblema(st.problema, st.origen); }
    });
    $('#cv-predecir', raiz).addEventListener('change', e => {
      st.predecir = e.target.checked;
      MA.almacen.guardar('conv.predecir', st.predecir);
      if (!st.predecir) cerrarPregunta();
    });
    MA.bus.on('progreso', () => pintarRetos());

    const primero = C.RETOS_CONVERSION.find(r => !MA.progreso.hecho('m1.conv.' + r.id)) || C.RETOS_CONVERSION[0];
    cargarReto(primero.id);

    return { cargarReto, cargarProblema };
  }

  MA.Conversor = { crear: crearConversor };
})();
