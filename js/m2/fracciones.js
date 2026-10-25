/* =====================================================================
   HERRAMIENTA · MESA DE FRACCIONES (dividir entre una fracción)
   ---------------------------------------------------------------------
   Para cada a ÷ b:
     1) si hay unidades, predecir en qué unidad queda el resultado;
     2) tocar la fracción que se da vuelta (la que divide);
     3) tachar por parejas: un número de arriba con uno de abajo
        (se dividen entre lo mismo) o una unidad con la misma unidad;
     4) cuando ya no se puede tachar nada, la mesa multiplica.
   Predecir → ver → entender: la predicción no bloquea, pero al final
   se compara con lo que quedó.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, icono } = MA;
  const { n, un, fr, mt, op } = MA.f;

  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const esNum = x => typeof x === 'number';

  // Texto de una lista de unidades con exponentes: ['m', 's', 's'] -> m · s²
  function unidadesTexto(lista) {
    const cuenta = {};
    lista.forEach(u => { cuenta[u] = (cuenta[u] || 0) + 1; });
    const sup = { 2: '²', 3: '³' };
    return Object.keys(cuenta).map(u => u + (cuenta[u] > 1 ? sup[cuenta[u]] || '^' + cuenta[u] : '')).join(' · ');
  }
  // Fracción de entrada como texto HTML (antes de dar vuelta)
  function fraccionHtml(f) {
    const parte = xs => xs.length ? xs.map(x => (esNum(x) ? n(x) : un(x))).join(' ') : n(1);
    return f.den.length ? fr(parte(f.num), parte(f.den)) : parte(f.num);
  }

  function crearFracciones(raiz) {
    const C = MA.M2;
    const st = { reto: null, fase: null, chips: [], sel: null, prediccion: null, origen: null };

    raiz.classList.add('banco', 'mesa-fr');
    raiz.innerHTML = `
      <div class="banco-cabeza">
        <div>
          <span class="etiqueta">Herramienta 1</span>
          <h3>Mesa de fracciones</h3>
        </div>
        <div class="segmentado mf-retos" role="group" aria-label="Retos de fracciones"></div>
      </div>
      <div class="bz-origen mf-origen" hidden></div>
      <div class="cv-reto mf-reto"></div>
      <div class="mf-mesa" aria-live="polite"></div>
      <div class="mf-pregunta" hidden></div>
      <div class="banco-pie">
        <div class="mensaje mf-mensaje" role="status" aria-live="polite"></div>
        <div class="fila-botones">
          <button type="button" class="btn btn-secundario btn-chico" data-accion="pista">${icono('pista')}Pista</button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="reiniciar">${icono('reiniciar')}Reiniciar</button>
        </div>
      </div>
      <section class="cv-bitacora" aria-label="Pasos">
        <h4>Pasos</h4>
        <p class="texto-3">Lo mismo que se escribe en el papel, renglón por renglón.</p>
        <ol class="bz-pasos mf-pasos"></ol>
      </section>`;

    const msg = $('.mf-mensaje', raiz);
    function ponerMensaje(tipo, titulo, texto) {
      if (!tipo) { msg.className = 'mensaje mf-mensaje'; msg.innerHTML = ''; return; }
      const ico = { ok: 'checkCirculo', aviso: 'alerta', info: 'info', error: 'errorCirculo' }[tipo];
      msg.className = 'mensaje mf-mensaje ' + tipo;
      msg.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }
    const pasos = [];
    function agregarPaso(html, nota) { pasos.push({ html, nota }); pintarPasos(); }
    function pintarPasos() {
      $('.mf-pasos', raiz).innerHTML = pasos.map(p => `<li><span class="mt">${p.html}</span>${p.nota ? `<span class="bz-paso-nota">${p.nota}</span>` : ''}</li>`).join('');
    }

    function pintarRetos() {
      $('.mf-retos', raiz).innerHTML = C.RETOS_FRACCIONES.map((r, i) => {
        const hecho = MA.progreso.hecho('m2.frac.' + r.id);
        const act = st.reto && st.reto.id === r.id;
        return `<button type="button" class="segmento" data-reto="${r.id}" aria-pressed="${act}">Reto ${i + 1}${hecho ? `<span class="ok">${icono('check')}</span>` : ''}</button>`;
      }).join('');
    }

    /* ---------- Cargar un reto ---------- */
    function cargar(reto, origen) {
      st.reto = reto;
      st.origen = origen || null;
      st.sel = null;
      st.prediccion = null;
      st.chips = [];
      pasos.length = 0;
      st.fase = reto.unidades ? 'unidad' : 'voltear';
      if (!origen && reto.id) MA.almacen.guardar('m2.frac.reto', reto.id);
      const i = C.RETOS_FRACCIONES.indexOf(reto);
      $('.mf-reto', raiz).innerHTML = `
        ${i >= 0 ? `<span class="pildora">Reto ${i + 1} de ${C.RETOS_FRACCIONES.length}</span>` : ''}
        <h4>${reto.titulo || 'Ejercicio de la práctica'}</h4>
        ${reto.contexto ? `<p>${reto.contexto}</p>` : ''}`;
      const ori = $('.mf-origen', raiz);
      ori.hidden = !origen;
      if (origen) {
        ori.innerHTML = `<span>${icono('hoja')}Ejercicio ${origen.numero} de la práctica</span><button type="button" class="btn btn-secundario btn-chico" data-accion="volver">${icono('flechaI')}Volver a la práctica</button>`;
      }
      agregarPaso(`${fraccionHtml(reto.a)} ${op('÷')} ${fraccionHtml(reto.b)}`, 'El planteamiento.');
      ponerMensaje(null);
      pintarRetos();
      pintar();
    }

    /* ---------- Dibujo ---------- */
    function chipHtml(c) {
      const sel = st.sel === c.id;
      let cuerpo;
      if (c.tipo === 'n') {
        cuerpo = c.hist.length
          ? `${c.hist.map(v => `<s>${MA.fmt(v)}</s>`).join(' ')}<b>${MA.fmt(c.v)}</b>`
          : `<b>${MA.fmt(c.v)}</b>`;
      } else {
        cuerpo = c.tachada ? `<s>${c.u}</s>` : `<b>${c.u}</b>`;
      }
      const inerte = c.tachada || (c.tipo === 'n' && c.v === 1);
      return `<button type="button" class="mf-chip ${c.tipo === 'u' ? 'mf-chip-u' : ''} ${inerte ? 'inerte' : ''} ${sel ? 'sel' : ''}" data-chip="${c.id}" ${inerte ? 'disabled' : ''} aria-pressed="${sel}">${cuerpo}</button>`;
    }
    function pintar() {
      const mesa = $('.mf-mesa', raiz);
      const preg = $('.mf-pregunta', raiz);
      const r = st.reto;
      preg.hidden = true;
      if (st.fase === 'unidad' || st.fase === 'voltear') {
        mesa.innerHTML = `
          <div class="mf-division">
            <button type="button" class="mf-lado" data-lado="a" ${st.fase !== 'voltear' ? 'disabled' : ''}><span class="mt">${fraccionHtml(r.a)}</span></button>
            <span class="mf-op">÷</span>
            <button type="button" class="mf-lado" data-lado="b" ${st.fase !== 'voltear' ? 'disabled' : ''}><span class="mt">${fraccionHtml(r.b)}</span></button>
          </div>`;
        preg.hidden = false;
        if (st.fase === 'unidad') {
          preg.innerHTML = `
            <p class="cv-preg-titulo">${icono('pista')}Antes de empezar: ¿en qué unidad va a quedar el resultado?</p>
            <div class="fila-botones">${r.unidades.map(u => `<button type="button" class="btn btn-secundario btn-chico" data-predice="${MA.esc(u)}">${u}</button>`).join('')}</div>
            <p class="texto-3">Es una predicción: al final se compara con lo que quede.</p>`;
        } else {
          preg.innerHTML = `<p class="cv-preg-titulo">${icono('mano')}¿Cuál de las dos se da vuelta? Tocarla.</p>`;
        }
        return;
      }
      // Números primero y unidades después, como se escribe en el papel
      const piso = p => st.chips.filter(c => c.piso === p).sort((x, y) => (x.tipo === y.tipo ? x.id - y.id : x.tipo === 'n' ? -1 : 1));
      const arriba = piso('arriba'), abajo = piso('abajo');
      mesa.innerHTML = `
        <div class="mf-unica">
          <div class="mf-piso">${arriba.length ? arriba.map(chipHtml).join('<span class="mf-por">·</span>') : '<span class="mf-uno">1</span>'}</div>
          <div class="mf-raya"></div>
          <div class="mf-piso">${abajo.length ? abajo.map(chipHtml).join('<span class="mf-por">·</span>') : '<span class="mf-uno">1</span>'}</div>
        </div>
        ${st.fase === 'listo' ? resultadoHtml() : ''}`;
      if (st.fase === 'tachar') {
        preg.hidden = false;
        preg.innerHTML = `<p class="cv-preg-titulo">${icono('mano')}${st.sel == null ? 'Tachar por parejas: tocar algo de arriba y después algo de abajo.' : 'Ahora, su pareja en el otro piso.'}</p>`;
      }
    }

    /* ---------- Resultado ---------- */
    function resultado() {
      const vivos = st.chips.filter(c => !c.tachada);
      const prod = piso => vivos.filter(c => c.piso === piso && c.tipo === 'n').reduce((s, c) => s * c.v, 1);
      const unis = piso => vivos.filter(c => c.piso === piso && c.tipo === 'u').map(c => c.u);
      let N = prod('arriba'), D = prod('abajo');
      const g = mcd(N, D); N /= g; D /= g;
      const ua = unis('arriba'), ud = unis('abajo');
      let unidad = '';
      if (ua.length && ud.length) unidad = `${unidadesTexto(ua)}/${unidadesTexto(ud)}`;
      else if (ua.length) unidad = unidadesTexto(ua);
      else if (ud.length) unidad = `1/${unidadesTexto(ud)}`;
      return { N, D, unidad, valor: N / D };
    }
    function resultadoHtml() {
      const r = resultado();
      const numero = r.D === 1 ? n(r.N) : `${fr(n(r.N), n(r.D))}${Number.isInteger(r.valor * 100) ? ` ${op('=')} ${n(r.valor)}` : ''}`;
      return `<div class="mf-resultado"><span class="mf-igual">=</span><span class="mt">${numero}${r.unidad ? ' ' + un(r.unidad) : ''}</span></div>`;
    }

    /* ---------- Acciones ---------- */
    function predecir(u) {
      st.prediccion = u;
      st.fase = 'voltear';
      ponerMensaje('info', `Predicción: ${MA.esc(u)}.`, 'Ahora, a resolverlo.');
      pintar();
    }
    function voltear(lado) {
      const r = st.reto;
      if (lado === 'a') {
        ponerMensaje('error', 'Esa no.', 'Esa es la que se divide. Se da vuelta la que <b>divide</b>: la que está a la derecha del ÷.');
        return;
      }
      let id = 0;
      const mk = (x, piso) => (esNum(x) ? { id: id++, tipo: 'n', v: x, hist: [], piso } : { id: id++, tipo: 'u', u: x, tachada: false, piso });
      st.chips = [
        ...r.a.num.map(x => mk(x, 'arriba')), ...r.b.den.map(x => mk(x, 'arriba')),
        ...r.a.den.map(x => mk(x, 'abajo')), ...r.b.num.map(x => mk(x, 'abajo'))
      ];
      const vuelta = { num: r.b.den.length ? r.b.den : [1], den: r.b.num };
      agregarPaso(`${fraccionHtml(r.a)} ${op('·')} ${fraccionHtml(vuelta)}`, r.b.den.length ? 'El ÷ se vuelve · y la fracción que divide se da vuelta.' : 'Lo que divide no es fracción: es como si tuviera un 1 abajo. Al darlo vuelta, queda abajo.');
      ponerMensaje('ok', '¡Correcto!', 'El ÷ se volvió · y la fracción que dividía quedó dada vuelta. Ahora, todo es una sola fracción.');
      st.fase = 'tachar';
      revisarFin();
      pintar();
    }
    function hayParejas() {
      const vivos = st.chips.filter(c => !c.tachada && !(c.tipo === 'n' && c.v === 1));
      const A = vivos.filter(c => c.piso === 'arriba'), B = vivos.filter(c => c.piso === 'abajo');
      return A.some(a => B.some(b => (a.tipo === 'u' && b.tipo === 'u' && a.u === b.u) || (a.tipo === 'n' && b.tipo === 'n' && mcd(a.v, b.v) > 1)));
    }
    function revisarFin() {
      if (hayParejas()) return;
      st.fase = 'listo';
      st.sel = null;
      const r = resultado();
      const r0 = st.reto;
      const unidadFinal = r.unidad;
      agregarPaso(`${r.D === 1 ? n(r.N) : fr(n(r.N), n(r.D))}${unidadFinal ? ' ' + un(unidadFinal) : ''}`, 'Ya no queda nada por tachar: se multiplica lo que quedó.');
      let extra = '';
      if (st.prediccion != null) {
        extra = st.prediccion === r0.unidad
          ? ` La predicción (${MA.esc(st.prediccion)}) era correcta.`
          : ` Se predijo ${MA.esc(st.prediccion)} y quedó ${MA.esc(unidadFinal)}: ${r0.unidad === 'm/s²' ? 'la s que dividía se sumó a la otra s de abajo.' : 'la unidad que estaba abajo del abajo terminó arriba.'}`;
      }
      ponerMensaje('ok', '¡Listo!', `Queda ${r.D === 1 ? MA.fmt(r.N) : `${r.N}/${r.D}`}${unidadFinal ? ' ' + MA.esc(unidadFinal) : ''}.${extra}`);
      if (r0.id && !st.origen) {
        if (MA.progreso.marcar('m2.frac.' + r0.id)) MA.aviso('Reto completado.');
        pintarRetos();
      }
    }
    function tocarChip(id) {
      const c = st.chips.find(x => x.id === id);
      if (st.sel == null || st.sel === id) { st.sel = st.sel === id ? null : id; ponerMensaje(null); pintar(); return; }
      const a = st.chips.find(x => x.id === st.sel);
      if (a.piso === c.piso) {
        st.sel = id;
        ponerMensaje('aviso', 'Mismo piso.', 'Para tachar, uno tiene que estar arriba y el otro abajo. Se cambió la selección.');
        pintar();
        return;
      }
      if (a.tipo !== c.tipo) {
        st.sel = null;
        ponerMensaje('error', 'No se pueden tachar.', 'Un número solo se simplifica con otro número; una unidad, con la misma unidad.');
        pintar();
        return;
      }
      if (a.tipo === 'u') {
        if (a.u !== c.u) {
          st.sel = null;
          ponerMensaje('error', 'Son unidades distintas.', `${MA.esc(a.u)} y ${MA.esc(c.u)} no se cancelan: solo se tacha una unidad con la misma.`);
          pintar();
          return;
        }
        a.tachada = c.tachada = true;
        st.sel = null;
        agregarPaso(`${un(a.u)} ${op('÷')} ${un(a.u)} ${op('=')} ${n(1)}`, `Una ${MA.esc(a.u)} arriba y otra abajo se cancelan.`);
        ponerMensaje('ok', 'Tachadas.', `${MA.esc(a.u)} ÷ ${MA.esc(a.u)} = 1.`);
      } else {
        const g = mcd(a.v, c.v);
        if (g === 1) {
          st.sel = null;
          ponerMensaje('error', 'No tienen un divisor en común.', `${MA.fmt(a.v)} y ${MA.fmt(c.v)} no se pueden dividir entre el mismo número (aparte del 1).`);
          pintar();
          return;
        }
        const antes = [a.v, c.v];
        a.hist.push(a.v); c.hist.push(c.v);
        a.v /= g; c.v /= g;
        st.sel = null;
        const [arr, aba] = a.piso === 'arriba' ? [a, c] : [c, a];
        const [va, vb] = a.piso === 'arriba' ? antes : antes.reverse();
        agregarPaso(`${fr(n(va), n(vb))} ${op('=')} ${fr(n(arr.v), n(aba.v))}`, `Arriba y abajo se dividen entre ${MA.fmt(g)}.`);
        ponerMensaje('ok', `Divididos entre ${MA.fmt(g)}.`, `${MA.fmt(va)} → ${MA.fmt(arr.v)} y ${MA.fmt(vb)} → ${MA.fmt(aba.v)}.`);
      }
      revisarFin();
      pintar();
    }
    function pista() {
      const r = st.reto;
      if (st.fase === 'unidad') ponerMensaje('info', 'Pista.', 'Al dar vuelta la fracción que divide, lo que estaba abajo en ella sube. ¿Qué unidades quedan arriba y cuáles abajo? ¿Cuáles se tachan?');
      else if (st.fase === 'voltear') ponerMensaje('info', 'Pista.', `Se da vuelta la que divide, no la que es dividida. En ${MA.esc('a ÷ b')}, la que divide es la b.`);
      else if (st.fase === 'tachar') {
        const vivos = st.chips.filter(c => !c.tachada && !(c.tipo === 'n' && c.v === 1));
        const A = vivos.filter(c => c.piso === 'arriba'), B = vivos.filter(c => c.piso === 'abajo');
        let par = null;
        A.some(a => B.some(b => { if ((a.tipo === 'u' && b.tipo === 'u' && a.u === b.u) || (a.tipo === 'n' && b.tipo === 'n' && mcd(a.v, b.v) > 1)) { par = [a, b]; return true; } return false; }));
        if (par) {
          const t = x => (x.tipo === 'u' ? x.u : MA.fmt(x.v));
          ponerMensaje('info', 'Pista.', par[0].tipo === 'u' ? `Hay una ${MA.esc(t(par[0]))} arriba y otra abajo.` : `${t(par[0])} (arriba) y ${t(par[1])} (abajo) se pueden dividir entre ${mcd(par[0].v, par[1].v)}.`);
        }
      } else ponerMensaje('info', 'Ya está resuelto.', r.id ? 'Se puede seguir con el próximo reto.' : '');
    }

    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b)) return;
      if (b.dataset.reto) { cargar(C.RETOS_FRACCIONES.find(x => x.id === b.dataset.reto)); return; }
      if (b.dataset.predice) { predecir(b.dataset.predice); return; }
      if (b.dataset.lado) { voltear(b.dataset.lado); return; }
      if (b.dataset.chip != null) { tocarChip(Number(b.dataset.chip)); return; }
      if (b.dataset.accion === 'pista') pista();
      else if (b.dataset.accion === 'reiniciar') cargar(st.reto, st.origen);
      else if (b.dataset.accion === 'volver' && st.origen) st.origen.volver();
    });
    MA.bus.on('progreso', clave => { if (clave === null) pintarRetos(); });

    const guardado = MA.almacen.leer('m2.frac.reto', null);
    const primero = C.RETOS_FRACCIONES.find(r => r.id === guardado)
      || C.RETOS_FRACCIONES.find(r => !MA.progreso.hecho('m2.frac.' + r.id)) || C.RETOS_FRACCIONES[0];
    cargar(primero);

    return {
      cargarProblema(problema, origen) { cargar(Object.assign({ titulo: 'Ejercicio de la práctica' }, problema), origen); }
    };
  }

  MA.Fracciones = { crear: crearFracciones };
})();
