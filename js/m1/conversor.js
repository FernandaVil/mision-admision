/* =====================================================================
   HERRAMIENTA 2 · MESA DE CONVERSIÓN (método del factor unitario)
   ---------------------------------------------------------------------
   La cantidad inicial queda a la izquierda. El alumno agrega
   equivalencias del banco como fracciones que valen 1 y las invierte
   hasta que cada unidad que quiere eliminar quede una vez arriba y otra
   abajo: en ese momento se tacha sola. La cantidad nunca cambia; solo
   cambia su nombre (se ve en vivo en el resultado).
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, icono } = MA;
  const U = MA.unidades;
  const MAX_FACTORES = 6;

  function crearConversor(raiz) {
    const C = MA.M1;
    const reducido = MA.movimientoReducido();
    const st = { retoId: null, problema: null, cadena: [], resuelto: false, origen: null, contador: 0 };

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
      <div class="cv-guia" aria-live="polite"></div>
      <div class="banco-pie">
        <div class="cv-banco">
          <h4>Equivalencias disponibles <span class="texto-3">· tocar una o arrastrarla a la mesa</span></h4>
          <div class="cv-equivalencias"></div>
        </div>
        <div class="mensaje cv-mensaje" role="status" aria-live="polite"></div>
        <div class="fila-botones">
          <button type="button" class="btn btn-secundario btn-chico" data-accion="pista">${icono('pista')}Pista</button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="reiniciar">${icono('reiniciar')}Reiniciar</button>
        </div>
      </div>
      <div class="cv-exito" hidden></div>`;

    const msg = $('.cv-mensaje', raiz);
    function ponerMensaje(tipo, titulo, texto) {
      const ico = { ok: 'checkCirculo', aviso: 'alerta', info: 'info', error: 'errorCirculo' }[tipo];
      msg.className = 'mensaje cv-mensaje ' + tipo;
      msg.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }

    /* ---------- Render de piezas ---------- */
    const unidadHtml = (unidad, exp, clase) => `<span class="un cv-un ${clase || ''}">${unidad}${U.sup(exp)}</span>`;
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
        <div class="cv-inicio mt">${inicioHtml}</div>
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
      return e;
    }

    /* ---------- Carga ---------- */
    function cargar(problema, retoId) {
      st.problema = problema;
      st.retoId = retoId || null;
      st.cadena = [];
      st.resuelto = false;
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
      st.cadena.push({ eq: eqId, inv: false, nuevo: !reducido, id: ++st.contador });
      const e = pintar();
      despues(e, `${eqTexto(eqId)}, agregada como fracción.`);
    }
    function invertir(i) {
      const fc = st.cadena[i];
      if (!fc || st.resuelto) return;
      fc.inv = !fc.inv;
      fc.girando = !reducido;
      const e = pintar();
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
        ponerMensaje('aviso', 'Hay un factor que no acerca a la meta.',
          `${accion} El factor ${fraccionTexto(num, den)} deja unidades repetidas en el mismo piso en vez de cancelarlas. Conviene invertirlo o quitarlo.`);
        return;
      }
      const pend = e.porEliminar[0];
      ponerMensaje('info', accion, pend ? `Todavía queda ${pend.unidad}${U.sup(pend.veces)} ${pend.lugar}. Falta una equivalencia que lo contenga.` : 'Hay que revisar qué unidades faltan para llegar a la meta.');
    }
    function pista() {
      const e = U.estado(st.problema, st.cadena);
      const i = e.sospechosos.indexOf(true);
      if (i >= 0) {
        ponerMensaje('info', `Ojo con el factor número ${i + 1}.`, 'Está al revés o no sirve para esta conversión: se invierte tocándolo o se quita con la ×.');
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
      ponerMensaje('info', `Para eliminar ${pend.unidad} (que está ${pend.lugar}):`,
        `usar ${eqTexto(id)} y acomodarla con ${pend.unidad} ${quieroAbajo ? 'abajo' : 'arriba'}: ${fraccionTexto(num, den)}.`);
      const b = $(`.cv-eq[data-eq="${id}"]`, raiz);
      if (b) { b.classList.remove('sugerida'); void b.offsetWidth; b.classList.add('sugerida'); }
    }
    function exito(e) {
      st.resuelto = true;
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
    MA.bus.on('progreso', () => pintarRetos());

    const primero = C.RETOS_CONVERSION.find(r => !MA.progreso.hecho('m1.conv.' + r.id)) || C.RETOS_CONVERSION[0];
    cargarReto(primero.id);

    return { cargarReto, cargarProblema };
  }

  MA.Conversor = { crear: crearConversor };
})();
