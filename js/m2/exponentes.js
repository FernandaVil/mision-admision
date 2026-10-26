/* =====================================================================
   HERRAMIENTA · MESA DE EXPONENTES (potencias con letras)
   ---------------------------------------------------------------------
   Un exponente cuenta cuántas veces está la letra. Para cada reto:
     1) predecir cómo va a quedar (no bloquea; al final se compara);
     2) escribir cada letra por separado: x² · x³ = (x · x) · (x · x · x);
     3) si hay algo abajo, tachar por parejas, igual que las unidades:
        una letra con la misma letra, un número con otro número;
     4) contar las letras que quedaron. De ahí sale el atajo: al
        multiplicar, los exponentes se suman; al dividir, se restan.
   Números con números y letras con letras.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, icono } = MA;
  const { n, vr, fr, op } = MA.f;

  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const supTexto = e => String(e).split('').map(d => SUP[d]).join('');
  // 'x2' -> { letra: 'x', exp: 2 } · 3 -> { num: 3 }
  const leerTermino = t => (typeof t === 'number' ? { num: t } : { letra: t[0], exp: Number(t.slice(1)) || 1 });

  function crearExponentes(raiz, opciones = {}) {
    const C = MA.M2;
    const pot = C.pot;
    const st = { reto: null, fase: null, prediccion: null, chips: [], sel: null, cola: [], fallos: 0, origen: null };

    raiz.classList.add('banco', 'mesa-ex');
    raiz.innerHTML = `
      <div class="banco-cabeza">
        <div>
          <span class="etiqueta">Herramienta 4</span>
          <h3>Mesa de exponentes</h3>
        </div>
        <div class="segmentado ex-retos" role="group" aria-label="Retos de exponentes"></div>
      </div>
      <div class="bz-origen ex-origen" hidden></div>
      <div class="cv-reto ex-reto"></div>
      <div class="mf-mesa ex-mesa" aria-live="polite"></div>
      <div class="mf-pregunta ex-pregunta" hidden></div>
      <div class="mo-calculo ex-calculo" hidden></div>
      <div class="banco-pie">
        <div class="mensaje ex-mensaje" role="status" aria-live="polite"></div>
        <div class="fila-botones ex-botones"></div>
      </div>
      <section class="cv-bitacora" aria-label="Pasos">
        <h4>Pasos</h4>
        <p class="texto-3">Lo mismo que se escribe en el papel, renglón por renglón.</p>
        <ol class="bz-pasos ex-pasos"></ol>
      </section>`;

    const msg = $('.ex-mensaje', raiz);
    function ponerMensaje(tipo, titulo, texto) {
      if (!tipo) { msg.className = 'mensaje ex-mensaje'; msg.innerHTML = ''; return; }
      const ico = { ok: 'checkCirculo', aviso: 'alerta', info: 'info', error: 'errorCirculo' }[tipo];
      msg.className = 'mensaje ex-mensaje ' + tipo;
      msg.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }
    const pasos = [];
    function agregarPaso(html, nota) { pasos.push({ html, nota }); pintarPasos(); }
    const pintarPasos = () => { $('.ex-pasos', raiz).innerHTML = pasos.map(p => `<li><span class="mt">${p.html}</span>${p.nota ? `<span class="bz-paso-nota">${p.nota}</span>` : ''}</li>`).join(''); };

    function pintarRetos() {
      $('.ex-retos', raiz).innerHTML = C.RETOS_EXPONENTES.map((r, i) => {
        const hecho = MA.progreso.hecho('m2.pot.' + r.id);
        return `<button type="button" class="segmento" data-reto="${r.id}" aria-pressed="${!!(st.reto && st.reto.id === r.id)}">Reto ${i + 1}${hecho ? `<span class="ok">${icono('check')}</span>` : ''}</button>`;
      }).join('');
    }

    /* ---------- Escritura de la expresión ---------- */
    const terminoHtml = t => (t.num != null ? n(t.num) : t.exp > 1 ? pot(vr(t.letra), t.exp) : vr(t.letra));
    const factorHtml = grupo => `<span class="ex-factor">${grupo.map(leerTermino).map(terminoHtml).join(st.reto.punto ? ` ${op('·')} ` : '')}</span>`;
    const ladoHtml = factores => (factores.length ? factores.map(factorHtml).join(` ${op('·')} `) : n(1));
    const expresionHtml = () => (st.reto.abajo.length ? fr(ladoHtml(st.reto.arriba), ladoHtml(st.reto.abajo)) : ladoHtml(st.reto.arriba));
    // Cada letra por separado: (x · x) · (x · x · x)
    const desarmadoLado = factores => (factores.length ? factores.map(grupo => {
      const partes = grupo.map(leerTermino).flatMap(t => (t.num != null ? [n(t.num)] : Array.from({ length: t.exp }, () => vr(t.letra))));
      const txt = partes.join(` ${op('·')} `);
      return factores.length > 1 && partes.length > 1 ? `${op('(')}${txt}${op(')')}` : txt;
    }).join(` ${op('·')} `) : n(1));
    const desarmadoHtml = () => (st.reto.abajo.length ? fr(desarmadoLado(st.reto.arriba), desarmadoLado(st.reto.abajo)) : desarmadoLado(st.reto.arriba));
    // Cuántas veces está una letra en un lado, factor por factor: [2, 3]
    const exponentesDe = (factores, letra) => factores.flatMap(g => g.map(leerTermino).filter(t => t.letra === letra).map(t => t.exp));

    /* ---------- Cargar un reto ---------- */
    function cargar(reto, origen) {
      st.reto = reto;
      st.origen = origen || null;
      st.prediccion = null;
      st.chips = [];
      st.sel = null;
      st.cola = [];
      st.fallos = 0;
      st.fase = reto.opciones ? 'predecir' : 'desarmar';
      pasos.length = 0;
      if (!origen && reto.id) MA.almacen.guardar('m2.pot.reto', reto.id);
      const i = C.RETOS_EXPONENTES.indexOf(reto);
      $('.ex-reto', raiz).innerHTML = `
        ${i >= 0 ? `<span class="pildora">Reto ${i + 1} de ${C.RETOS_EXPONENTES.length}</span>` : ''}
        <h4>${reto.titulo || 'Ejercicio de la práctica'}</h4>
        ${reto.contexto ? `<p>${reto.contexto}</p>` : ''}`;
      const ori = $('.ex-origen', raiz);
      ori.hidden = !origen;
      if (origen) ori.innerHTML = `<span>${icono('hoja')}Ejercicio ${origen.numero} de la práctica</span><button type="button" class="btn btn-secundario btn-chico" data-accion="volver">${icono('flechaI')}Volver a la práctica</button>`;
      agregarPaso(expresionHtml(), 'El planteamiento.');
      ponerMensaje(null);
      pintarRetos();
      pintar();
    }

    /* ---------- Fichas ---------- */
    function chipHtml(c) {
      const sel = st.sel === c.id;
      const cuenta = st.fase === 'contar' && st.cola[0] && c.tipo === 'l' && !c.tachada && c.l === st.cola[0].letra && c.piso === st.cola[0].piso;
      let cuerpo;
      if (c.tipo === 'n') cuerpo = c.hist.length ? `${c.hist.map(v => `<s>${MA.fmt(v)}</s>`).join(' ')}<b>${MA.fmt(c.v)}</b>` : `<b>${MA.fmt(c.v)}</b>`;
      else cuerpo = c.tachada ? `<s>${vr(c.l)}</s>` : `<b>${vr(c.l)}</b>`;
      const inerte = c.tachada || (c.tipo === 'n' && c.v === 1) || st.fase !== 'tachar';
      return `<button type="button" class="mf-chip ${c.tipo === 'l' ? 'ex-chip-l' : ''} ${inerte ? 'inerte' : ''} ${sel ? 'sel' : ''} ${cuenta ? 'ex-cuenta' : ''}" data-chip="${c.id}" ${inerte ? 'disabled' : ''} aria-pressed="${sel}">${cuerpo}</button>`;
    }
    function pisoHtml(piso) {
      const grupos = [];
      st.chips.filter(c => c.piso === piso).forEach(c => { (grupos[c.grupo] = grupos[c.grupo] || []).push(c); });
      const lista = grupos.filter(Boolean);
      if (!lista.length) return '<span class="mf-uno">1</span>';
      return lista.map(g => `<span class="ex-grupo ${lista.length > 1 && g.length > 1 ? 'con-parentesis' : ''}">${g.map(chipHtml).join('<span class="mf-por">·</span>')}</span>`).join('<span class="mf-por">·</span>');
    }

    /* ---------- Resultado ---------- */
    function resultado() {
      const vivos = st.chips.filter(c => !c.tachada);
      const lado = piso => {
        const num = vivos.filter(c => c.piso === piso && c.tipo === 'n').reduce((s, c) => s * c.v, 1);
        const letras = {};
        vivos.filter(c => c.piso === piso && c.tipo === 'l').forEach(c => { letras[c.l] = (letras[c.l] || 0) + 1; });
        return { num, letras };
      };
      return { arriba: lado('arriba'), abajo: lado('abajo') };
    }
    const ladoResultado = (l, html) => {
      const letras = Object.keys(l.letras);
      const partes = letras.map(x => (html ? (l.letras[x] > 1 ? pot(vr(x), l.letras[x]) : vr(x)) : x + (l.letras[x] > 1 ? supTexto(l.letras[x]) : '')));
      const sep = st.reto.punto ? (html ? ` ${op('·')} ` : ' · ') : '';
      const num = l.num !== 1 || !letras.length ? (html ? n(l.num) : MA.fmt(l.num)) : '';
      return num + (num && sep && letras.length ? sep : '') + partes.join(sep);
    };
    function resultadoHtml() {
      const r = resultado();
      const hayAbajo = r.abajo.num !== 1 || Object.keys(r.abajo.letras).length;
      return hayAbajo ? fr(ladoResultado(r.arriba, true), ladoResultado(r.abajo, true)) : ladoResultado(r.arriba, true);
    }
    function resultadoTexto() {
      const r = resultado();
      const hayAbajo = r.abajo.num !== 1 || Object.keys(r.abajo.letras).length;
      return hayAbajo ? `${ladoResultado(r.arriba, false)}/${ladoResultado(r.abajo, false)}` : ladoResultado(r.arriba, false);
    }

    /* ---------- Dibujo ---------- */
    function pintar() {
      const mesa = $('.ex-mesa', raiz), preg = $('.ex-pregunta', raiz), calc = $('.ex-calculo', raiz);
      preg.hidden = true;
      calc.hidden = true;
      if (st.fase === 'predecir' || st.fase === 'desarmar') {
        mesa.innerHTML = `<div class="mt ex-expr">${expresionHtml()}</div>`;
        preg.hidden = false;
        preg.innerHTML = st.fase === 'predecir' ? `
          <p class="cv-preg-titulo">${icono('pista')}Antes de desarmarlo: ¿cómo va a quedar?</p>
          <div class="fila-botones">${st.reto.opciones.map((o, k) => `<button type="button" class="btn btn-secundario btn-chico" data-predice="${k}">${MA.esc(o)}</button>`).join('')}</div>
          <p class="texto-3">Es una predicción: al final se compara con lo que quede.</p>` : `
          <p class="cv-preg-titulo">${icono('mano')}Un exponente dice cuántas veces está la letra: ${pot(vr('x'), 3)} es ${vr('x')} · ${vr('x')} · ${vr('x')}.</p>
          <div class="fila-botones"><button type="button" class="btn btn-chico" data-accion="desarmar">Escribir cada letra</button></div>`;
      } else {
        const hayAbajo = st.chips.some(c => c.piso === 'abajo');
        const arriba = `<div class="mf-piso">${pisoHtml('arriba')}</div>`;
        mesa.innerHTML = `
          ${hayAbajo ? `<div class="mf-unica">${arriba}<div class="mf-raya"></div><div class="mf-piso">${pisoHtml('abajo')}</div></div>` : `<div class="mf-unica">${arriba}</div>`}
          ${st.fase === 'listo' ? `<div class="mf-resultado"><span class="mf-igual">=</span><span class="mt">${resultadoHtml()}</span></div>` : ''}`;
        if (st.fase === 'tachar') {
          preg.hidden = false;
          preg.innerHTML = `<p class="cv-preg-titulo">${icono('mano')}${st.sel == null ? 'Tachar por parejas: tocar algo de arriba y después lo mismo abajo.' : 'Ahora, su pareja en el otro piso.'}</p>`;
        }
        if (st.fase === 'contar' && st.cola[0]) {
          const { letra, piso } = st.cola[0];
          calc.hidden = false;
          calc.innerHTML = `
            <label for="ex-campo">¿Cuántas ${vr(letra)} quedaron ${piso}?</label>
            <span class="campo-grupo"><input id="ex-campo" class="campo" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" placeholder="Número"></span>
            <button type="button" class="btn btn-chico" data-accion="contar">Comprobar</button>
            <p class="texto-3">Contar solo las que no están tachadas: están resaltadas.</p>`;
          setTimeout(() => { const c = $('#ex-campo', raiz); if (c) c.focus({ preventScroll: true }); }, 30);
        }
      }
      pintarBotones();
    }

    // Botones del pie: ayudas mientras se resuelve; al terminar, cómo seguir
    function pintarBotones() {
      const cont = $('.ex-botones', raiz);
      if (st.fase !== 'listo') {
        cont.innerHTML = `
          <button type="button" class="btn btn-secundario btn-chico" data-accion="pista">${icono('pista')}Pista</button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="reiniciar">${icono('reiniciar')}Reiniciar</button>`;
        return;
      }
      const i = C.RETOS_EXPONENTES.indexOf(st.reto), sig = C.RETOS_EXPONENTES[i + 1];
      const seguir = st.origen ? `<button type="button" class="btn" data-accion="volver">${icono('flechaI')}Volver al ejercicio ${st.origen.numero}</button>`
        : sig ? `<button type="button" class="btn" data-sig="${sig.id}">Siguiente reto${icono('flechaD')}</button>`
        : i >= 0 && opciones.final ? `<button type="button" class="btn" data-accion="final">${opciones.final.texto}${icono('flechaD')}</button>` : '';
      cont.innerHTML = `${seguir}<button type="button" class="btn btn-secundario" data-accion="reiniciar">${icono('reiniciar')}Repetir</button>`;
    }

    /* ---------- Acciones ---------- */
    function predecir(k) {
      st.prediccion = k;
      st.fase = 'desarmar';
      ponerMensaje('info', `Predicción: ${MA.esc(st.reto.opciones[k])}.`, 'Ahora, a comprobarlo.');
      pintar();
    }

    function desarmar() {
      let id = 0;
      st.chips = [];
      ['arriba', 'abajo'].forEach(piso => st.reto[piso].forEach((grupo, g) => grupo.map(leerTermino).forEach(t => {
        if (t.num != null) st.chips.push({ id: id++, tipo: 'n', v: t.num, hist: [], piso, grupo: g });
        else for (let k = 0; k < t.exp; k++) st.chips.push({ id: id++, tipo: 'l', l: t.letra, tachada: false, piso, grupo: g });
      })));
      const sola = [...st.reto.arriba, ...st.reto.abajo].some(g => g.some(t => typeof t === 'string' && t.length === 1));
      agregarPaso(`${expresionHtml()} ${op('=')} ${desarmadoHtml()}`, `Cada exponente dice cuántas veces está la letra.${sola ? ' La letra sola está una vez: es como tener un 1 de exponente.' : ''}`);
      ponerMensaje('ok', 'Así se ve cada letra.', st.reto.abajo.length ? 'Ahora, a tachar por parejas.' : 'Ahora, a contar.');
      st.fase = 'tachar';
      revisarParejas();
      pintar();
    }

    const vivosDe = piso => st.chips.filter(c => c.piso === piso && !c.tachada && !(c.tipo === 'n' && c.v === 1));
    const sonPareja = (a, b) => (a.tipo === 'l' && b.tipo === 'l' && a.l === b.l) || (a.tipo === 'n' && b.tipo === 'n' && mcd(a.v, b.v) > 1);
    function buscarPareja() {
      for (const a of vivosDe('arriba')) for (const b of vivosDe('abajo')) if (sonPareja(a, b)) return [a, b];
      return null;
    }
    function revisarParejas() {
      if (buscarPareja()) return;
      // Ya no hay nada que tachar: números con números y a contar letras
      const r = resultado();
      ['arriba', 'abajo'].forEach(piso => {
        const nums = st.chips.filter(c => c.piso === piso && c.tipo === 'n' && !c.tachada && c.v !== 1);
        if (nums.length > 1) agregarPaso(`${nums.map(c => n(c.v)).join(` ${op('·')} `)} ${op('=')} ${n(r[piso].num)}`, `Números con números (${piso}).`);
      });
      st.cola = [];
      ['arriba', 'abajo'].forEach(piso => Object.keys(r[piso].letras).forEach(letra => {
        if (r[piso].letras[letra] > 1) st.cola.push({ letra, piso, cuenta: r[piso].letras[letra] });
      }));
      st.fase = 'contar';
      st.fallos = 0;
      if (!st.cola.length) terminar();
    }

    function tocarChip(id) {
      const c = st.chips.find(x => x.id === id);
      if (st.sel == null || st.sel === id) { st.sel = st.sel === id ? null : id; ponerMensaje(null); pintar(); return; }
      const a = st.chips.find(x => x.id === st.sel);
      if (a.piso === c.piso) { st.sel = id; ponerMensaje('aviso', 'Mismo piso.', 'Para tachar, uno tiene que estar arriba y el otro abajo. Se cambió la selección.'); pintar(); return; }
      st.sel = null;
      if (a.tipo !== c.tipo) { ponerMensaje('error', 'No se pueden tachar.', 'Una letra solo se tacha con la misma letra; un número, con otro número.'); pintar(); return; }
      if (a.tipo === 'l') {
        if (a.l !== c.l) { ponerMensaje('error', 'Son letras distintas.', `${MA.esc(a.l)} y ${MA.esc(c.l)} no se cancelan: solo se tacha una letra con la misma.`); pintar(); return; }
        a.tachada = c.tachada = true;
        ponerMensaje('ok', 'Tachadas.', `${MA.esc(a.l)} ÷ ${MA.esc(a.l)} = 1.`);
      } else {
        const g = mcd(a.v, c.v);
        if (g === 1) { ponerMensaje('error', 'No tienen un divisor en común.', `${MA.fmt(a.v)} y ${MA.fmt(c.v)} no se pueden dividir entre el mismo número (aparte del 1).`); pintar(); return; }
        const [arr, aba] = a.piso === 'arriba' ? [a, c] : [c, a];
        const antes = [arr.v, aba.v];
        arr.hist.push(arr.v); aba.hist.push(aba.v);
        arr.v /= g; aba.v /= g;
        agregarPaso(`${fr(n(antes[0]), n(antes[1]))} ${op('=')} ${fr(n(arr.v), n(aba.v))}`, `Arriba y abajo se dividen entre ${MA.fmt(g)}.`);
        ponerMensaje('ok', `Divididos entre ${MA.fmt(g)}.`, `${MA.fmt(antes[0])} → ${MA.fmt(arr.v)} y ${MA.fmt(antes[1])} → ${MA.fmt(aba.v)}.`);
      }
      revisarParejas();
      pintar();
    }

    function contar() {
      const item = st.cola[0];
      const campo = $('#ex-campo', raiz);
      const cands = MA.leerNumeros(campo.value);
      if (!cands.length) { ponerMensaje('aviso', 'Solo el número.', 'Por ejemplo: 3'); campo.focus(); return; }
      if (!cands.some(x => x === item.cuenta)) {
        st.fallos++;
        ponerMensaje('error', 'Todavía no.', `Contar otra vez las ${MA.esc(item.letra)} que no están tachadas.${st.fallos >= 2 ? ` Son ${item.cuenta}: escribirlo para seguir.` : ''}`);
        campo.select();
        return;
      }
      st.fallos = 0;
      const { letra, piso, cuenta } = item;
      const deArriba = exponentesDe(st.reto.arriba, letra), deAbajo = exponentesDe(st.reto.abajo, letra);
      const suma = xs => (xs.length > 1 ? `(${xs.join(' + ')})` : String(xs[0] || 0));
      const total = xs => xs.reduce((s, x) => s + x, 0);
      let atajo;
      if (!deAbajo.length) atajo = deArriba.length > 1 ? `Atajo: al multiplicar, los exponentes se suman: ${deArriba.join(' + ')} = ${cuenta}.` : '';
      else atajo = piso === 'arriba'
        ? `Atajo: al dividir, los exponentes se restan: ${suma(deArriba)} − ${suma(deAbajo)} = ${cuenta}.`
        : `Atajo: abajo había más; se restan al revés: ${suma(deAbajo)} − ${suma(deArriba)} = ${cuenta}.`;
      if (deArriba.length > 1 && deAbajo.length) atajo += ` Arriba, primero se juntan: ${deArriba.join(' + ')} = ${total(deArriba)}.`;
      agregarPaso(`${Array.from({ length: cuenta }, () => vr(letra)).join(` ${op('·')} `)} ${op('=')} ${pot(vr(letra), cuenta)}`, `Quedaron ${cuenta} ${MA.esc(letra)} ${piso}. ${atajo}`);
      st.cola.shift();
      ponerMensaje('ok', '¡Correcto!', MA.esc(atajo));
      if (!st.cola.length) { terminar(); return; }
      pintar();
    }

    function terminar() {
      st.fase = 'listo';
      st.sel = null;
      const r0 = st.reto;
      agregarPaso(resultadoHtml(), 'Lo que queda.');
      let extra = '';
      if (st.prediccion != null && r0.opciones) {
        extra = st.prediccion === r0.correcta
          ? ` La predicción (${MA.esc(r0.opciones[st.prediccion])}) era correcta.`
          : ` Se predijo ${MA.esc(r0.opciones[st.prediccion])}: ${MA.esc(r0.porQue || '')}`;
      }
      ponerMensaje('ok', '¡Listo!', `Queda ${MA.esc(resultadoTexto())}.${extra}`);
      if (r0.id && !st.origen) {
        if (MA.progreso.marcar('m2.pot.' + r0.id)) MA.aviso('Reto completado.');
        pintarRetos();
      }
      pintar();
    }

    function pista() {
      if (st.fase === 'predecir') ponerMensaje('info', 'Pista.', 'Escribir cada letra por separado en el papel y contarlas.');
      else if (st.fase === 'desarmar') ponerMensaje('info', 'Pista.', 'Tocar «Escribir cada letra».');
      else if (st.fase === 'tachar') {
        const par = buscarPareja();
        if (par) ponerMensaje('info', 'Pista.', par[0].tipo === 'l' ? `Hay una ${MA.esc(par[0].l)} arriba y otra abajo.` : `${MA.fmt(par[0].v)} (arriba) y ${MA.fmt(par[1].v)} (abajo) se pueden dividir entre ${mcd(par[0].v, par[1].v)}.`);
      } else if (st.fase === 'contar' && st.cola[0]) ponerMensaje('info', 'Pista.', `Las ${MA.esc(st.cola[0].letra)} que cuentan están resaltadas. Las tachadas ya no están.`);
      else ponerMensaje('info', 'Ya está resuelto.', '');
    }

    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b)) return;
      if (b.dataset.reto) { cargar(C.RETOS_EXPONENTES.find(x => x.id === b.dataset.reto)); return; }
      if (b.dataset.sig) {
        cargar(C.RETOS_EXPONENTES.find(x => x.id === b.dataset.sig));
        raiz.scrollIntoView({ behavior: MA.movimientoReducido() ? 'auto' : 'smooth', block: 'start' });
        return;
      }
      if (b.dataset.predice != null) { predecir(Number(b.dataset.predice)); return; }
      if (b.dataset.chip != null) { tocarChip(Number(b.dataset.chip)); return; }
      const a = b.dataset.accion;
      if (a === 'desarmar') desarmar();
      else if (a === 'contar') contar();
      else if (a === 'pista') pista();
      else if (a === 'reiniciar') cargar(st.reto, st.origen);
      else if (a === 'volver' && st.origen) st.origen.volver();
      else if (a === 'final' && opciones.final) opciones.final.ir();
    });
    raiz.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'ex-campo') contar(); });
    MA.bus.on('progreso', clave => { if (clave === null) pintarRetos(); });

    const guardado = MA.almacen.leer('m2.pot.reto', null);
    const primero = C.RETOS_EXPONENTES.find(r => r.id === guardado)
      || C.RETOS_EXPONENTES.find(r => !MA.progreso.hecho('m2.pot.' + r.id)) || C.RETOS_EXPONENTES[0];
    cargar(primero);

    return {
      cargarProblema(problema, origen) { cargar(Object.assign({ titulo: 'Ejercicio de la práctica' }, problema), origen); }
    };
  }

  MA.Exponentes = { crear: crearExponentes };
})();
