/* =====================================================================
   HERRAMIENTA 1 · BALANZA DE DESPEJES
   ---------------------------------------------------------------------
   La ecuación vive en dos platos. El alumno elige una operación
   (× ÷ + −), la aplica a UN plato y la balanza se inclina; al aplicarla
   también en el otro, vuelve al equilibrio. Así se ve que despejar es
   "hacer lo mismo a los dos lados", no memorizar "pasa a dividir".
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, crear, icono } = MA;
  const A = MA.algebra;

  const PIVOTE = { x: 400, y: 230 }, BRAZO = 270, ANCHO = 800, ALTO = 330, PLATO_Y = -38;
  const TIPOS = [
    { tipo: 'mul', fila: 'Multiplicar por', signo: '×' },
    { tipo: 'div', fila: 'Dividir entre', signo: '÷' },
    { tipo: 'sum', fila: 'Sumar', signo: '+' },
    { tipo: 'res', fila: 'Restar', signo: '−' }
  ];
  const LADO_TXT = { izq: 'izquierdo', der: 'derecho' };
  const otro = l => (l === 'izq' ? 'der' : 'izq');
  const plano = s => s.replace(/\*/g, ' · ').replace(/\//g, ' / ').replace(/v0/g, 'v₀').replace(/\+/g, ' + ').replace(/\s+/g, ' ');

  function svgEscena() {
    let marcas = '';
    for (let x = 160; x <= 640; x += 30) {
      if (Math.abs(x - 400) < 20) continue;
      const mayor = (x - 160) % 60 === 0;
      marcas += `<line x1="${x}" y1="${mayor ? 226.5 : 228}" x2="${x}" y2="${mayor ? 233.5 : 232}"/>`;
    }
    const plataforma = lado => `
      <g class="bz-g-plato" data-lado="${lado}">
        <line class="bz-poste" x1="0" y1="0" x2="0" y2="${PLATO_Y + 10}"/>
        <rect class="bz-plataforma" x="-118" y="${PLATO_Y}" width="236" height="10" rx="3"/>
      </g>`;
    return `
      <svg class="bz-svg" viewBox="0 0 ${ANCHO} ${ALTO}" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
        <rect class="bz-suelo" x="250" y="314" width="300" height="3" rx="1.5"/>
        <rect class="bz-base" x="300" y="300" width="200" height="14" rx="4"/>
        <path class="bz-fulcro" d="M400 236 L360 300 L440 300 Z"/>
        <line class="bz-igual" x1="388" y1="275" x2="412" y2="275"/>
        <line class="bz-igual" x1="388" y1="285" x2="412" y2="285"/>
        <g class="bz-brazo">
          <rect class="bz-viga" x="${PIVOTE.x - BRAZO - 10}" y="224" width="${2 * BRAZO + 20}" height="12" rx="6"/>
          <g class="bz-marcas">${marcas}</g>
          <circle class="bz-eje" cx="${PIVOTE.x}" cy="${PIVOTE.y}" r="9"/>
          <circle class="bz-eje-centro" cx="${PIVOTE.x}" cy="${PIVOTE.y}" r="3"/>
        </g>
        ${plataforma('izq')}${plataforma('der')}
      </svg>`;
  }

  function crearBalanza(raiz, opciones = {}) {
    const C = MA.M1;
    const reducido = MA.movimientoReducido();
    const st = {
      retoId: null, formulaId: null, meta: null, F: null, N: {}, U: {}, ops: [],
      ec: null, pendiente: null, enMano: null, bitacora: [], historial: [],
      valores: {}, resuelto: false, animando: { izq: false, der: false }, origen: null
    };

    raiz.classList.add('banco', 'balanza');
    raiz.innerHTML = `
      <div class="banco-cabeza">
        <div class="bz-titulo">
          <span class="etiqueta">Herramienta 1</span>
          <h3>Balanza de despejes</h3>
        </div>
        <div class="segmentado bz-retos" role="group" aria-label="Retos de la balanza"></div>
      </div>
      <div class="bz-origen" hidden></div>
      <div class="bz-reto">
        <div class="bz-reto-texto"></div>
        <div class="bz-libre" hidden>
          <label>Fórmula <select class="bz-sel-formula" id="bz-sel-formula"></select></label>
          <label>Variable que quieres dejar sola <select class="bz-sel-meta" id="bz-sel-meta"></select></label>
        </div>
      </div>
      <div class="bz-escenario">
        ${svgEscena()}
        <div class="bz-indicador"><span class="pildora bz-estado"></span><span class="bz-grados mono"></span></div>
        ${['izq', 'der'].map(l => `
          <button type="button" class="bz-plato" data-lado="${l}">
            <span class="bz-aplicar"></span>
            <span class="bz-bloque"><span class="mt bz-expr"></span></span>
          </button>`).join('')}
      </div>
      <div class="bz-lecturas">
        <div class="bz-lectura" data-lado="izq"><small>Plato izquierdo</small><b class="mono"></b></div>
        <div class="bz-lectura bz-lectura-der" data-lado="der"><small>Plato derecho</small><b class="mono"></b></div>
      </div>
      <div class="banco-pie bz-controles">
        <div class="mensaje bz-mensaje" role="status" aria-live="polite"></div>
        <div class="bz-ops" role="group" aria-label="Operaciones"></div>
        <div class="fila-botones bz-acciones">
          <button type="button" class="btn btn-secundario btn-chico" data-accion="pista">${icono('pista')}Pista</button>
          <button type="button" class="btn btn-secundario btn-chico" data-accion="intercambiar">${icono('intercambiar')}Intercambiar lados</button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="deshacer">${icono('deshacer')}Deshacer</button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="reiniciar">${icono('reiniciar')}Reiniciar</button>
        </div>
      </div>
      <div class="bz-exito" hidden></div>
      <div class="bz-inferior">
        <section class="bz-valores" aria-label="Valores de prueba">
          <h4>Valores de prueba</h4>
          <p class="texto-3">Mueve los valores: mientras hagas lo mismo en los dos platos, la balanza sigue en equilibrio con cualquier número.</p>
          <div class="bz-deslizadores"></div>
        </section>
        <section class="bz-bitacora" aria-label="Bitácora de pasos">
          <h4>Bitácora de pasos</h4>
          <p class="texto-3">Así se escribe el despeje en el papel del examen.</p>
          <ol class="bz-pasos"></ol>
        </section>
      </div>`;

    const esc = $('.bz-escenario', raiz);
    const brazo = $('.bz-brazo', raiz);
    const gPlato = { izq: $('.bz-g-plato[data-lado="izq"]', raiz), der: $('.bz-g-plato[data-lado="der"]', raiz) };
    const plato = { izq: $('.bz-plato[data-lado="izq"]', raiz), der: $('.bz-plato[data-lado="der"]', raiz) };
    const msg = $('.bz-mensaje', raiz);

    /* ---------- Física del brazo (resorte amortiguado) ---------- */
    let ang = 0, vel = 0, objetivo = 0, raf = null, ultimo = 0;
    function pintarBrazo() {
      const r = ang * Math.PI / 180, dx = BRAZO * Math.cos(r), dy = BRAZO * Math.sin(r);
      const fin = { izq: { x: PIVOTE.x - dx, y: PIVOTE.y - dy }, der: { x: PIVOTE.x + dx, y: PIVOTE.y + dy } };
      brazo.setAttribute('transform', `rotate(${ang.toFixed(3)} ${PIVOTE.x} ${PIVOTE.y})`);
      // El dibujo se escala al ancho y se apoya abajo: en celular queda espacio arriba para los platos
      const s = esc.clientWidth / ANCHO, dy0 = Math.max(0, esc.clientHeight - ALTO * s);
      ['izq', 'der'].forEach(l => {
        gPlato[l].setAttribute('transform', `translate(${fin[l].x.toFixed(2)} ${fin[l].y.toFixed(2)})`);
        plato[l].style.transform = `translate(${(fin[l].x * s).toFixed(1)}px, ${((fin[l].y + PLATO_Y) * s + dy0).toFixed(1)}px) translate(-50%, -100%)`;
      });
      $('.bz-grados', raiz).textContent = 'Inclinación ' + MA.fmt(Math.abs(ang), 1).replace(/^(\d+)$/, '$1,0') + '°';
    }
    function moverBrazo() {
      if (reducido) { ang = objetivo; vel = 0; pintarBrazo(); return; }
      if (raf) return;
      ultimo = performance.now();
      const paso = t => {
        const dt = Math.min(0.032, (t - ultimo) / 1000);
        ultimo = t;
        vel += (-60 * (ang - objetivo) - 9 * vel) * dt;
        ang += vel * dt;
        if (Math.abs(ang - objetivo) < 0.02 && Math.abs(vel) < 0.02) { ang = objetivo; vel = 0; pintarBrazo(); raf = null; return; }
        pintarBrazo();
        raf = requestAnimationFrame(paso);
      };
      raf = requestAnimationFrame(paso);
    }
    if (window.ResizeObserver) new ResizeObserver(() => pintarBrazo()).observe(esc);
    else window.addEventListener('resize', pintarBrazo);

    /* ---------- Carga de fórmulas y retos ---------- */
    function valoresCompletos() {
      const ent = {};
      Object.keys(st.F.vars).forEach(k => { if (!st.F.vars[k].calculada) ent[k] = st.valores[k]; });
      return Object.assign(ent, st.F.calcular(ent));
    }
    function preparar(formulaId, meta) {
      st.formulaId = formulaId;
      st.meta = meta;
      st.F = C.FORMULAS[formulaId];
      st.N = {}; st.U = {};
      Object.keys(st.F.vars).forEach(k => { st.N[k] = st.F.vars[k].html; st.U[k] = st.F.vars[k].u; });
      st.valores = {};
      Object.keys(st.F.vars).forEach(k => { if (!st.F.vars[k].calculada) st.valores[k] = st.F.vars[k].valor; });
      // Operaciones: primero las de la meta (así las pistas prefieren "subir" la meta)
      const orden = [meta].concat(Object.keys(st.F.vars).filter(k => k !== meta));
      const tipos = st.F.sumas ? ['res', 'sum', 'mul', 'div'] : ['mul', 'div'];
      st.ops = [];
      orden.forEach(v => tipos.forEach(tipo => st.ops.push({ tipo, v })));
      pintarOps();
      pintarDeslizadores();
      reiniciar();
    }
    function reiniciar() {
      st.ec = { izq: A.leer(st.F.izq), der: A.leer(st.F.der) };
      st.pendiente = null; st.enMano = null; st.resuelto = false; st.historial = [];
      st.bitacora = [{ etiqueta: 'Inicio', html: ecHtml(st.ec) }];
      $('.bz-exito', raiz).hidden = true;
      ponerMensaje('info', 'Elige una operación y aplícala a un plato.', 'Toca la operación y luego el plato, o arrástrala hasta el plato.');
      refrescar(true);
    }
    function cargarReto(id) {
      const r = C.RETOS_BALANZA.find(x => x.id === id);
      st.retoId = id;
      $('.bz-libre', raiz).hidden = true;
      $('.bz-reto-texto', raiz).innerHTML = `
        <div class="bz-meta"><span class="pildora pildora-primaria">${icono('objetivo')}Meta: deja sola la <span class="vr">${r.meta === 'v0' ? 'v<sub>0</sub>' : C.FORMULAS[r.formula].vars[r.meta].html}</span></span></div>
        <h4>Reto ${C.RETOS_BALANZA.indexOf(r) + 1}. ${r.titulo}</h4>
        <p>${r.contexto}</p>`;
      preparar(r.formula, r.meta);
      pintarRetos();
    }
    function cargarLibre(formulaId, meta, origen) {
      st.retoId = 'libre';
      st.origen = origen || null;
      pintarOrigen();
      $('.bz-libre', raiz).hidden = false;
      const selF = $('.bz-sel-formula', raiz), selM = $('.bz-sel-meta', raiz);
      selF.innerHTML = Object.keys(C.FORMULAS).map(k => `<option value="${k}">${C.FORMULAS[k].nombre}: ${plano(C.FORMULAS[k].izq)} = ${plano(C.FORMULAS[k].der)}</option>`).join('');
      selF.value = formulaId;
      const F = C.FORMULAS[formulaId];
      const posibles = Object.keys(F.vars).filter(k => !F.vars[k].calculada);
      if (!posibles.includes(meta)) meta = posibles[posibles.length - 1];
      selM.innerHTML = posibles.map(k => `<option value="${k}">${plano(k)} · ${F.vars[k].nombre}</option>`).join('');
      selM.value = meta;
      $('.bz-reto-texto', raiz).innerHTML = `
        <div class="bz-meta"><span class="pildora pildora-primaria">${icono('objetivo')}Meta: deja sola la <span class="vr">${F.vars[meta].html}</span></span></div>
        <h4>Modo libre</h4>
        <p>Elige cualquier fórmula y la variable que quieres despejar.</p>`;
      preparar(formulaId, meta);
      pintarRetos();
    }
    function pintarOrigen() {
      const caja = $('.bz-origen', raiz);
      if (!st.origen) { caja.hidden = true; return; }
      caja.hidden = false;
      caja.innerHTML = `<span>${icono('hoja')}Abierto desde el ejercicio ${st.origen.numero} de la práctica.</span>
        <button type="button" class="btn btn-secundario btn-chico">${icono('flechaI')}Volver al ejercicio</button>`;
      $('button', caja).onclick = () => { const o = st.origen; st.origen = null; pintarOrigen(); o.volver(); };
    }

    /* ---------- Render ---------- */
    const ecHtml = ec => `<span class="mt">${A.ladoHtml(ec.izq, st.N)} <span class="op">=</span> ${A.ladoHtml(ec.der, st.N)}</span>`;
    const opHtml = op => `${{ mul: '×', div: '÷', sum: '+', res: '−' }[op.tipo]} <span class="vr">${st.N[op.v]}</span>`;
    const mismaOp = (a, b) => a && b && a.tipo === b.tipo && a.v === b.v;

    function pintarRetos() {
      const cont = $('.bz-retos', raiz);
      cont.innerHTML = C.RETOS_BALANZA.map((r, i) => `
        <button type="button" class="segmento" data-reto="${r.id}" aria-pressed="${st.retoId === r.id}" title="${MA.esc(r.titulo)}">
          Reto ${i + 1}${MA.progreso.hecho('m1.balanza.' + r.id) ? `<span class="ok">${icono('check')}</span>` : ''}
        </button>`).join('') +
        `<button type="button" class="segmento" data-reto="libre" aria-pressed="${st.retoId === 'libre'}">Libre</button>`;
    }
    function pintarOps() {
      const tipos = TIPOS.filter(t => st.F.sumas || t.tipo === 'mul' || t.tipo === 'div');
      const vars = Object.keys(st.F.vars);
      $('.bz-ops', raiz).innerHTML = tipos.map(t => `
        <div class="bz-fila-ops">
          <span class="bz-fila-nombre">${t.fila}</span>
          <div class="bz-chips">${vars.map(v => `<button type="button" class="bz-op" data-tipo="${t.tipo}" data-v="${v}" aria-pressed="false">${t.signo} <span class="vr">${st.N[v]}</span></button>`).join('')}</div>
        </div>`).join('');
      $$('.bz-op', raiz).forEach(chip => {
        const op = { tipo: chip.dataset.tipo, v: chip.dataset.v };
        MA.arrastrable(chip, {
          destinos: '.bz-plato',
          esValido: destino => raiz.contains(destino) && platoValido(destino.dataset.lado, op),
          alEmpezar: () => { if (!st.pendiente) { st.enMano = op; refrescar(); } },
          alSoltar: destino => { if (!st.pendiente) st.enMano = op; aplicarEn(destino.dataset.lado); },
          alTocar: () => elegir(op)
        });
      });
    }
    function pintarDeslizadores() {
      const cont = $('.bz-deslizadores', raiz);
      const vars = Object.keys(st.F.vars);
      cont.innerHTML = vars.map(k => {
        const v = st.F.vars[k];
        if (v.calculada) return `<div class="bz-calculada" data-var="${k}"></div>`;
        return `
          <label class="bz-deslizador">
            <span class="bz-ds-nombre"><span class="vr">${v.html}</span> · ${v.nombre}</span>
            <output class="mono" data-var="${k}"></output>
            <input type="range" id="bz-rango-${k}" min="${v.min}" max="${v.max}" step="${v.paso}" value="${st.valores[k]}" data-var="${k}" aria-label="${v.nombre}">
          </label>`;
      }).join('');
      $$('input[type="range"]', cont).forEach(inp => inp.addEventListener('input', () => {
        st.valores[inp.dataset.var] = parseFloat(inp.value);
        refrescar();
      }));
    }
    function lectura(lado, valores) {
      const val = A.evaluar(st.ec[lado], valores);
      const u = A.unidadLado(st.ec[lado], st.U);
      return { val, texto: MA.fmtSig(val, 4) + (u && MA.unidades.texto(u) ? ' ' + MA.unidades.texto(u) : '') };
    }
    function platoValido(lado, op) {
      if (st.resuelto) return false;
      if (st.pendiente) return lado !== st.pendiente.lado && (!op || mismaOp(op, st.pendiente.op));
      return !!(op || st.enMano);
    }

    function refrescar(sinAnimar) {
      const valores = valoresCompletos();
      // Expresiones en los platos (salvo el que se está animando)
      ['izq', 'der'].forEach(l => {
        if (!st.animando[l]) $('.bz-expr', plato[l]).innerHTML = A.ladoHtml(st.ec[l], st.N);
        const valido = platoValido(l);
        plato[l].classList.toggle('objetivo', valido);
        plato[l].classList.toggle('aplicado', !!(st.pendiente && st.pendiente.lado === l));
        plato[l].setAttribute('aria-disabled', String(!valido));
        const aplicar = $('.bz-aplicar', plato[l]);
        if (st.pendiente && st.pendiente.lado !== l) aplicar.innerHTML = `Aplica ${opHtml(st.pendiente.op)} aquí también`;
        else if (st.pendiente) aplicar.innerHTML = `Aplicaste ${opHtml(st.pendiente.op)}`;
        else if (st.enMano) aplicar.innerHTML = `Aplicar ${opHtml(st.enMano)} aquí`;
        else aplicar.innerHTML = '';
        plato[l].setAttribute('aria-label', `Plato ${LADO_TXT[l]}: ${$('.bz-expr', plato[l]).textContent.replace(/\s+/g, ' ').trim()}${valido ? '. Aplicar la operación aquí' : ''}`);
      });
      // Lecturas e inclinación
      const L = lectura('izq', valores), R = lectura('der', valores);
      $('.bz-lectura[data-lado="izq"] b', raiz).textContent = L.texto;
      $('.bz-lectura[data-lado="der"] b', raiz).textContent = R.texto;
      const equilibrio = MA.casiIgual(L.val, R.val, 1e-9);
      if (equilibrio) objetivo = 0;
      else {
        const rel = (R.val - L.val) / Math.max(Math.abs(L.val), Math.abs(R.val), 1e-9);
        objetivo = Math.sign(rel) * (4 + 8 * Math.min(1, Math.abs(rel)));
      }
      const estado = $('.bz-estado', raiz);
      estado.className = 'pildora bz-estado ' + (equilibrio ? 'pildora-exito' : 'pildora-ambar');
      estado.innerHTML = `<span class="punto"></span>${equilibrio ? 'En equilibrio' : 'Desequilibrada'}`;
      raiz.classList.toggle('desequilibrada', !equilibrio);
      if (sinAnimar && reducido) { ang = objetivo; }
      moverBrazo();
      pintarBrazo();
      // Operaciones
      $$('.bz-op', raiz).forEach(chip => {
        const op = { tipo: chip.dataset.tipo, v: chip.dataset.v };
        const esPendiente = mismaOp(op, st.pendiente && st.pendiente.op);
        chip.setAttribute('aria-pressed', String(esPendiente || mismaOp(op, st.enMano)));
        chip.disabled = st.resuelto || (!!st.pendiente && !esPendiente);
        chip.classList.remove('sugerida');
      });
      // Acciones
      $('[data-accion="intercambiar"]', raiz).disabled = !!st.pendiente || st.resuelto;
      $('[data-accion="deshacer"]', raiz).disabled = !st.historial.length;
      $('[data-accion="pista"]', raiz).disabled = st.resuelto;
      // Valores de prueba
      Object.keys(st.F.vars).forEach(k => {
        const v = st.F.vars[k];
        const txt = MA.fmtSig(valores[k], 4) + ' ' + MA.unidades.texto(v.u);
        if (v.calculada) {
          const caja = $(`.bz-calculada[data-var="${k}"]`, raiz);
          if (caja) caja.innerHTML = `<span class="vr">${v.html}</span> · ${v.nombre}: <b class="mono">${txt}</b> <span class="texto-3">(se calcula con ${A.ladoHtml(A.leer(st.F.der), st.N)} para que la fórmula original se cumpla)</span>`;
        } else {
          const out = $(`output[data-var="${k}"]`, raiz);
          if (out) out.textContent = txt;
        }
      });
      // Bitácora
      $('.bz-pasos', raiz).innerHTML = st.bitacora.map(p => `
        <li><span class="bz-paso-etq">${p.etiqueta}</span>${p.html}${p.nota ? `<span class="bz-paso-nota">${p.nota}</span>` : ''}</li>`).join('');
    }

    function ponerMensaje(tipo, titulo, texto) {
      const ico = { ok: 'checkCirculo', aviso: 'alerta', info: 'info', error: 'errorCirculo' }[tipo];
      msg.className = 'mensaje bz-mensaje ' + tipo;
      msg.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }

    /* ---------- Interacción ---------- */
    function elegir(op) {
      if (st.resuelto) return;
      if (st.pendiente) {
        if (mismaOp(op, st.pendiente.op)) ponerMensaje('aviso', `Ahora toca el plato ${LADO_TXT[otro(st.pendiente.lado)]}.`, 'Ahí falta aplicar la misma operación.');
        return;
      }
      st.enMano = mismaOp(op, st.enMano) ? null : op;
      if (st.enMano) ponerMensaje('info', `Tienes ${opHtml(op)} en la mano.`, 'Toca el plato donde quieres aplicarla.');
      else ponerMensaje('info', 'Elige una operación y aplícala a un plato.', 'Toca la operación y luego el plato, o arrástrala hasta el plato.');
      refrescar();
    }

    function guardar() {
      st.historial.push({
        ec: JSON.parse(JSON.stringify(st.ec)),
        pendiente: st.pendiente ? JSON.parse(JSON.stringify(st.pendiente)) : null,
        bitacora: st.bitacora.length
      });
    }

    function animarPlato(lado, intermedio) {
      const expr = $('.bz-expr', plato[lado]);
      if (!intermedio || reducido) return;
      st.animando[lado] = true;
      expr.innerHTML = intermedio;
      plato[lado].classList.add('cancelando');
      setTimeout(() => expr.classList.add('tachar'), 450);
      setTimeout(() => {
        expr.classList.remove('tachar');
        plato[lado].classList.remove('cancelando');
        st.animando[lado] = false;
        refrescar();
      }, 1500);
    }

    function aplicarEn(lado) {
      if (!platoValido(lado)) {
        if (!st.enMano && !st.pendiente && !st.resuelto) ponerMensaje('info', 'Primero elige una operación.', 'Están debajo de la balanza: multiplicar, dividir, sumar o restar.');
        return;
      }
      const op = st.pendiente ? st.pendiente.op : st.enMano;
      guardar();
      const antes = st.ec[lado];
      const intermedio = A.intermedioHtml(antes, op, st.N);
      st.ec[lado] = A.aplicar(antes, op);
      if (!st.pendiente) {
        st.pendiente = { op, lado, cancelo: !!intermedio };
        st.enMano = null;
        refrescar();
        animarPlato(lado, intermedio);
        const val = valoresCompletos();
        ponerMensaje('aviso', 'La balanza se desequilibró.',
          `Aplicaste ${opHtml(op)} solo al plato ${LADO_TXT[lado]}: ahora ${lectura('izq', val).texto} no es igual a ${lectura('der', val).texto}. Para recuperar el equilibrio, aplica ${opHtml(op)} también al plato ${LADO_TXT[otro(lado)]}.`);
        return;
      }
      const cancelo = st.pendiente.cancelo || !!intermedio;
      st.pendiente = null;
      const pasoN = st.bitacora.length;
      const X = `<span class="vr">${st.N[op.v]}</span>`;
      const nota = cancelo
        ? (op.tipo === 'mul' || op.tipo === 'div' ? `${X} ÷ ${X} = 1: la ${X} se cancela.` : `${op.tipo === 'res' ? '+' : '−'} ${X} ${op.tipo === 'res' ? '−' : '+'} ${X} = 0: la ${X} se cancela.`)
        : '';
      st.bitacora.push({ etiqueta: `Paso ${pasoN} · ${opHtml(op)} en los dos lados`, html: ecHtml(st.ec), nota });
      refrescar();
      animarPlato(lado, intermedio);
      if (!comprobarMeta()) {
        ponerMensaje('ok', 'Equilibrio recuperado.', `Hiciste lo mismo en los dos lados, así que la igualdad sigue siendo cierta.${cancelo ? ' ' + nota : ''}`);
      }
    }

    function intercambiar() {
      if (st.pendiente || st.resuelto) return;
      guardar();
      st.ec = { izq: st.ec.der, der: st.ec.izq };
      st.bitacora.push({ etiqueta: `Paso ${st.bitacora.length} · intercambias los lados`, html: ecHtml(st.ec), nota: 'Si a = b, también b = a.' });
      refrescar();
      if (!comprobarMeta()) ponerMensaje('info', 'Lados intercambiados.', 'La balanza sigue igual: solo cambiaste qué plato miras primero.');
    }

    function deshacer() {
      const h = st.historial.pop();
      if (!h) return;
      st.ec = h.ec;
      st.pendiente = h.pendiente;
      st.bitacora = st.bitacora.slice(0, h.bitacora);
      st.enMano = null;
      st.resuelto = false;
      st.animando = { izq: false, der: false };
      $('.bz-exito', raiz).hidden = true;
      if (st.pendiente) ponerMensaje('aviso', 'Volviste un paso atrás.', `Falta aplicar ${opHtml(st.pendiente.op)} al plato ${LADO_TXT[otro(st.pendiente.lado)]}.`);
      else ponerMensaje('info', 'Volviste un paso atrás.', 'Elige otra operación.');
      refrescar();
    }

    function pista() {
      if (st.pendiente) {
        ponerMensaje('aviso', 'Primero termina la operación.', `Aplica ${opHtml(st.pendiente.op)} también al plato ${LADO_TXT[otro(st.pendiente.lado)]}.`);
        return;
      }
      const r = A.siguientePaso(st.ec, st.meta, st.ops);
      const M = `<span class="vr">${st.N[st.meta]}</span>`;
      if (!r) { ponerMensaje('aviso', 'Este camino se complicó.', 'Usa «Deshacer» hasta volver a un paso conocido o reinicia la balanza.'); return; }
      if (r.listo) { ponerMensaje('info', 'Ya está despejada.', 'Si quieres leerla mejor, intercambia los lados.'); return; }
      const op = r.op, X = `<span class="vr">${st.N[op.v]}</span>`;
      let texto;
      if (op.v === st.meta && op.tipo === 'mul') texto = `Tu meta, ${M}, está abajo, dividiendo. Multiplica los dos platos por ${M} para subirla.`;
      else if (op.tipo === 'div') texto = `La ${X} está multiplicando. Lo contrario de multiplicar es dividir: aplica ${opHtml(op)} en los dos platos.`;
      else if (op.tipo === 'mul') texto = `La ${X} está dividiendo. Lo contrario de dividir es multiplicar: aplica ${opHtml(op)} en los dos platos.`;
      else if (op.tipo === 'res') texto = `La ${X} está sumando. Lo contrario de sumar es restar: aplica ${opHtml(op)} en los dos platos.`;
      else texto = `La ${X} está restando. Lo contrario de restar es sumar: aplica ${opHtml(op)} en los dos platos.`;
      ponerMensaje('info', r.pasos > 1 ? `Te faltan ${r.pasos} pasos.` : 'Te falta un paso.', texto);
      refrescar();
      const chip = $(`.bz-op[data-tipo="${op.tipo}"][data-v="${op.v}"]`, raiz);
      if (chip) chip.classList.add('sugerida');
    }

    function comprobarMeta() {
      const lado = A.despejada(st.ec, st.meta);
      if (!lado) return false;
      st.resuelto = true;
      st.enMano = null;
      const otroLado = st.ec[otro(lado)];
      const valores = valoresCompletos();
      const M = `<span class="vr">${st.N[st.meta]}</span>`;
      const resultado = A.evaluar(otroLado, valores);
      const unidad = MA.unidades.texto(st.U[st.meta]);
      const usadas = new Set(st.bitacora.map(p => p.etiqueta).join(' ').match(/[×÷+−]/g) || []);
      const atajos = [];
      if (usadas.has('÷')) atajos.push('«lo que multiplica pasa a dividir»');
      if (usadas.has('×')) atajos.push('«lo que divide pasa a multiplicar»');
      if (usadas.has('−')) atajos.push('«lo que suma pasa a restar»');
      if (usadas.has('+')) atajos.push('«lo que resta pasa a sumar»');
      const exito = $('.bz-exito', raiz);
      exito.hidden = false;
      exito.innerHTML = `
        <div class="bz-exito-cabeza">${icono('checkCirculo')}<div><span class="etiqueta">Despeje completo</span><h4>Dejaste sola la ${M}</h4></div></div>
        <div class="bz-exito-formula mt">${M} <span class="op">=</span> ${A.ladoHtml(otroLado, st.N)}</div>
        <p><b>Comprobación con tus valores de prueba:</b> <span class="mt">${M} <span class="op">=</span> ${A.ladoValoresHtml(otroLado, valores)} <span class="op">=</span> <span class="num">${MA.fmtSig(resultado, 4)}</span> <span class="un">${unidad}</span></span>, que es justo el valor de ${M} en el deslizador.</p>
        ${atajos.length ? `<p class="texto-2">El atajo del colegio, ${atajos.join(' y ')}, es exactamente lo que acabas de hacer: aplicar la misma operación a los dos lados.</p>` : ''}
        <div class="fila-botones"></div>`;
      const botones = $('.fila-botones', exito);
      const idx = C.RETOS_BALANZA.findIndex(r => r.id === st.retoId);
      if (idx >= 0) {
        MA.progreso.marcar('m1.balanza.' + st.retoId);
        pintarRetos();
        const sig = C.RETOS_BALANZA[idx + 1];
        if (sig) botones.insertAdjacentHTML('beforeend', `<button type="button" class="btn" data-ir="${sig.id}">Siguiente reto${icono('flechaD')}</button>`);
        else botones.insertAdjacentHTML('beforeend', `<button type="button" class="btn" data-ir="conversion">Seguir con las ideas clave, parte 2${icono('flechaD')}</button>`);
      }
      if (st.origen) botones.insertAdjacentHTML('beforeend', `<button type="button" class="btn" data-ir="origen">${icono('flechaI')}Volver al ejercicio ${st.origen.numero}</button>`);
      botones.insertAdjacentHTML('beforeend', `<button type="button" class="btn btn-secundario" data-accion="reiniciar">${icono('reiniciar')}Repetir</button>`);
      ponerMensaje('ok', '¡Lo lograste!', `La ${M} quedó sola y la balanza está en equilibrio.`);
      refrescar();
      if (window.innerWidth < 900) exito.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'nearest' });
      return true;
    }

    /* ---------- Eventos ---------- */
    ['izq', 'der'].forEach(l => plato[l].addEventListener('click', () => aplicarEn(l)));
    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b)) return;
      if (b.dataset.reto) { if (b.dataset.reto === 'libre') cargarLibre(st.formulaId || 'dvt', st.meta); else { st.origen = null; pintarOrigen(); cargarReto(b.dataset.reto); } return; }
      if (b.dataset.ir === 'conversion') { location.hash = '#m1-ideas-p2'; return; }
      if (b.dataset.ir === 'origen') { const o = st.origen; st.origen = null; pintarOrigen(); if (o) o.volver(); return; }
      if (b.dataset.ir) { cargarReto(b.dataset.ir); raiz.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' }); return; }
      const accion = b.dataset.accion;
      if (accion === 'pista') pista();
      else if (accion === 'intercambiar') intercambiar();
      else if (accion === 'deshacer') deshacer();
      else if (accion === 'reiniciar') reiniciar();
    });
    $('.bz-sel-formula', raiz).addEventListener('change', e => cargarLibre(e.target.value, null, st.origen));
    $('.bz-sel-meta', raiz).addEventListener('change', e => cargarLibre(st.formulaId, e.target.value, st.origen));
    MA.bus.on('progreso', () => pintarRetos());

    // Primer reto sin resolver
    const primero = C.RETOS_BALANZA.find(r => !MA.progreso.hecho('m1.balanza.' + r.id)) || C.RETOS_BALANZA[0];
    cargarReto(primero.id);

    return {
      cargarReto,
      cargarLibre,
      redibujar: pintarBrazo
    };
  }

  MA.Balanza = { crear: crearBalanza };
})();
