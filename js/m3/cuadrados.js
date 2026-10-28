/* =====================================================================
   Herramienta · diferencia de cuadrados
   ---------------------------------------------------------------------
   Dos piezas:
   - Cortar y mover: un cuadrado de lado x al que se le quita uno de lado
     3 se corta y se reacomoda en un rectángulo de (x + 3) por (x − 3).
     Se avanza paso a paso; el último paso se puede ver de nuevo.
   - Mesa de cuadrados: para cada reto,
       1) decidir si es una diferencia de cuadrados (dos términos, una
          resta y los dos son cuadrados); con suma, no se puede;
       2) escribir de qué es cuadrado cada término, en dos partes, el
          número y la letra (la raíz de 4x² es 2x);
       3) la mesa arma (a + b)(a − b) y lo comprueba armando de vuelta:
          los del medio se anulan.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, icono } = MA;
  const { n, op, vr, mt } = MA.f;
  const { pot } = MA.M2;
  const C = MA.M3;
  const A = MA.Areas;
  const igual = op('=');

  /* ---------- Cortar y mover ---------- */
  const x = vr('x');
  const PASOS_FIGURA = [
    `Un cuadrado de lado ${x} tiene un área de ${mt(pot(x, 2))}.`,
    `Se le quita un cuadradito de lado 3, de área 9. Lo que queda tiene un área de ${mt(pot(x, 2), op('−'), n(9))}.`,
    `Lo que queda se corta en dos rectángulos: uno de ${mt(x)} por ${mt(x, op('−'), n(3))} y otro de ${mt(n(3))} por ${mt(x, op('−'), n(3))}.`,
    `El de abajo se gira y se pega al lado. Queda un rectángulo de ${mt(x, op('+'), n(3))} por ${mt(x, op('−'), n(3))}, con la misma área: ${mt(pot(x, 2), op('−'), n(9), igual, C.Pr('x + 3', 'x - 3'))}.`
  ];
  function crearFigura(raiz) {
    let paso = 0;
    raiz.classList.add('banco', 'dc-figura');
    raiz.innerHTML = `
      <div class="banco-cabeza">
        <div>
          <span class="etiqueta">Para mirar</span>
          <h3>Cortar y mover</h3>
        </div>
        <span class="pildora dc-num"></span>
      </div>
      <div class="banco-cuerpo">
        <div class="dc-lienzo">${C.figuraCuadradosSvg(0)}</div>
        <p class="dc-texto" aria-live="polite"></p>
      </div>
      <div class="banco-pie fila-botones dc-botones">
        <button type="button" class="btn btn-secundario btn-chico" data-paso="-1">${icono('flechaI')}Anterior</button>
        <button type="button" class="btn btn-chico" data-paso="1"></button>
      </div>`;
    function pintar() {
      $('.dc-svg', raiz).setAttribute('class', `dc-svg paso-${paso}`);
      $('.dc-texto', raiz).innerHTML = PASOS_FIGURA[paso];
      $('.dc-num', raiz).textContent = `Paso ${paso + 1} de ${PASOS_FIGURA.length}`;
      $('[data-paso="-1"]', raiz).disabled = paso === 0;
      $('[data-paso="1"]', raiz).innerHTML = paso === PASOS_FIGURA.length - 1 ? `${icono('reiniciar')}Ver de nuevo` : `Siguiente paso${icono('flechaD')}`;
    }
    raiz.addEventListener('click', e => {
      const b = e.target.closest('[data-paso]');
      if (!b) return;
      const d = Number(b.dataset.paso);
      paso = d > 0 && paso === PASOS_FIGURA.length - 1 ? 0 : MA.clamp(paso + d, 0, PASOS_FIGURA.length - 1);
      pintar();
    });
    pintar();
  }

  /* ---------- Mesa de cuadrados ---------- */
  function crearCuadrados(raiz, opciones = {}) {
    const st = { reto: null, origen: null, fase: null, ra: null, rb: null, fallos: 0 };

    raiz.classList.add('banco', 'mesa-dc');
    raiz.innerHTML = `
      <div class="banco-cabeza">
        <div>
          <span class="etiqueta">Herramienta 2</span>
          <h3>Mesa de cuadrados</h3>
        </div>
        <div class="segmentado dc-retos" role="group" aria-label="Retos de diferencia de cuadrados"></div>
      </div>
      <div class="bz-origen dc-origen" hidden></div>
      <div class="cv-reto dc-reto"></div>
      <div class="dc-mesa" aria-live="polite"></div>
      <div class="mf-pregunta dc-pregunta" hidden></div>
      <div class="mo-calculo dc-calculo" hidden></div>
      <div class="banco-pie">
        <div class="mensaje dc-mensaje" role="status" aria-live="polite"></div>
        <div class="fila-botones dc-botones-reto"></div>
      </div>
      <section class="cv-bitacora" aria-label="Pasos">
        <h4>Pasos</h4>
        <p class="texto-3">Lo mismo que se escribe en el papel, renglón por renglón.</p>
        <ol class="bz-pasos dc-pasos"></ol>
      </section>`;

    const msg = $('.dc-mensaje', raiz);
    function ponerMensaje(tipo, titulo, texto) {
      if (!tipo) { msg.className = 'mensaje dc-mensaje'; msg.innerHTML = ''; return; }
      const ico = { ok: 'checkCirculo', aviso: 'alerta', info: 'info', error: 'errorCirculo' }[tipo];
      msg.className = 'mensaje dc-mensaje ' + tipo;
      msg.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }
    const pasos = [];
    function agregarPaso(html, nota) { pasos.push({ html, nota }); pintarPasos(); }
    const pintarPasos = () => { $('.dc-pasos', raiz).innerHTML = pasos.map(p => `<li><span class="mt">${p.html}</span>${p.nota ? `<span class="bz-paso-nota">${p.nota}</span>` : ''}</li>`).join(''); };

    function pintarRetos() {
      $('.dc-retos', raiz).innerHTML = C.RETOS_CUADRADOS.map((r, i) => {
        const hecho = MA.progreso.hecho('m3.cuad.' + r.id);
        return `<button type="button" class="segmento" data-reto="${r.id}" aria-pressed="${!!(st.reto && st.reto.id === r.id)}">Reto ${i + 1}${hecho ? `<span class="ok">${icono('check')}</span>` : ''}</button>`;
      }).join('');
    }

    const letra = () => st.reto.letra || 'x';
    const th = t => C.terminoHtml(t, letra());
    const tt = t => C.terminoTexto(t, letra());
    const exprHtml = () => `${th(st.reto.a)} ${op(st.reto.signo)} ${th(st.reto.b)}`;
    const exprTexto = () => `${tt(st.reto.a)} ${st.reto.signo} ${tt(st.reto.b)}`;
    // La raíz de un término: √(4x²) = 2x · √49 = 7
    const raizDe = t => [Math.round(Math.sqrt(t[0])), t[1] / 2];
    // (2x)² · x² · 7²: con paréntesis si la raíz tiene número y letra
    const alCuadrado = r => pot(r[0] !== 1 && r[1] > 0 ? C.par(th(r)) : th(r), 2);
    const factores = () => [[st.ra, [st.rb[0], 0]], [st.ra, [-st.rb[0], 0]]];

    function cargar(reto, origen) {
      st.reto = reto;
      st.origen = origen || null;
      st.fase = 'reconocer';
      st.ra = null;
      st.rb = null;
      st.fallos = 0;
      pasos.length = 0;
      if (!origen && reto.id) MA.almacen.guardar('m3.cuad.reto', reto.id);
      const i = C.RETOS_CUADRADOS.indexOf(reto);
      $('.dc-reto', raiz).innerHTML = `
        ${i >= 0 ? `<span class="pildora">Reto ${i + 1} de ${C.RETOS_CUADRADOS.length}</span>` : ''}
        <h4>${reto.titulo || 'Ejercicio de la práctica'}</h4>
        ${reto.contexto ? `<p>${reto.contexto}</p>` : ''}`;
      const ori = $('.dc-origen', raiz);
      ori.hidden = !origen;
      if (origen) ori.innerHTML = `<span>${icono('hoja')}${origen.etiqueta}</span><button type="button" class="btn btn-secundario btn-chico" data-accion="volver">${icono('flechaI')}${origen.textoVolver}</button>`;
      agregarPaso(exprHtml(), 'El planteamiento.');
      ponerMensaje(null);
      pintarRetos();
      pintar();
    }

    function pintar() {
      const mesa = $('.dc-mesa', raiz), preg = $('.dc-pregunta', raiz), calc = $('.dc-calculo', raiz);
      preg.hidden = true;
      calc.hidden = true;
      let linea = exprHtml();
      if (st.fase === 'raiz-a' || st.fase === 'raiz-b') {
        const hueco = (r, activo) => (r ? alCuadrado(r) : `<span class="sm-casilla ${activo ? 'activa' : ''}">?</span>`);
        linea += ` ${igual} ${hueco(st.ra, st.fase === 'raiz-a')} ${op('−')} ${hueco(st.rb, st.fase === 'raiz-b')}`;
      } else if (st.fase === 'listo' && st.ra) {
        linea += ` ${igual} <span class="ar-resultado listo">${C.productoHtml(factores(), letra())}</span>`;
      }
      mesa.innerHTML = `<div class="mt dc-expr">${linea}</div>`;
      if (st.fase === 'reconocer') {
        preg.hidden = false;
        preg.innerHTML = `
          <p class="cv-preg-titulo">${icono('pista')}¿Es una diferencia de cuadrados? Dos términos, con una resta, y los dos son cuadrados.</p>
          <div class="fila-botones">
            <button type="button" class="btn btn-secundario btn-chico" data-reconoce="si">Sí, se puede</button>
            <button type="button" class="btn btn-secundario btn-chico" data-reconoce="no">No se puede</button>
          </div>`;
      }
      if (st.fase === 'raiz-a' || st.fase === 'raiz-b') {
        const t = st.fase === 'raiz-a' ? st.reto.a : st.reto.b;
        calc.hidden = false;
        calc.innerHTML = `
          <label for="dc-num">¿De qué es cuadrado <span class="mt">${th(t)}</span>? <span class="mo-igual">→</span></label>
          ${A.campoHtml('dc-num', letra())}
          <button type="button" class="btn btn-chico" data-accion="calcular">Comprobar</button>
          <p class="texto-3">Lo que multiplicado por sí mismo da ${MA.esc(tt(t))}: el número y la letra, por separado.</p>`;
        setTimeout(() => { const c = $('#dc-num', raiz); if (c) c.focus({ preventScroll: true }); }, 30);
      }
      pintarBotones();
    }

    function pintarBotones() {
      const cont = $('.dc-botones-reto', raiz);
      if (st.fase !== 'listo') {
        cont.innerHTML = `
          <button type="button" class="btn btn-secundario btn-chico" data-accion="pista">${icono('pista')}Pista</button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="reiniciar">${icono('reiniciar')}Reiniciar</button>`;
        return;
      }
      const i = C.RETOS_CUADRADOS.indexOf(st.reto), sig = C.RETOS_CUADRADOS[i + 1];
      const seguir = st.origen ? `<button type="button" class="btn" data-accion="volver">${icono('flechaI')}${st.origen.textoFinal || st.origen.textoVolver}</button>`
        : sig ? `<button type="button" class="btn" data-sig="${sig.id}">Siguiente reto${icono('flechaD')}</button>`
        : i >= 0 && opciones.final ? `<button type="button" class="btn" data-accion="final">${opciones.final.texto}${icono('flechaD')}</button>` : '';
      cont.innerHTML = `${seguir}<button type="button" class="btn btn-secundario" data-accion="reiniciar">${icono('reiniciar')}Repetir</button>`;
    }

    function reconocer(si) {
      const r = st.reto;
      if (r.signo === '+') {
        if (si) { ponerMensaje('error', 'Mirar el signo del medio.', 'Es una suma. La diferencia de cuadrados necesita una resta.'); return; }
        agregarPaso(exprHtml(), 'Es una suma: no es una diferencia de cuadrados.');
        const adentro = -4 * r.a[0] * r.b[0];
        terminar(`Con suma no hay diferencia de cuadrados: ${MA.esc(exprTexto())} no se puede desarmar. La llave maestra lo confirma: adentro de la raíz queda 0 − 4 · ${r.a[0]} · ${r.b[0]} = ${MA.fmt(adentro)}, un número negativo.`);
        return;
      }
      if (!si) { ponerMensaje('error', 'Mirar otra vez.', `Son dos términos, con una resta. ¿Hay algo que multiplicado por sí mismo dé ${MA.esc(tt(r.a))}? ¿Y ${MA.esc(tt(r.b))}?`); return; }
      st.fase = 'raiz-a';
      ponerMensaje('ok', '¡Correcto!', `Dos términos con una resta. Ahora, ¿de qué es cuadrado cada uno? Primero ${MA.esc(tt(r.a))}.`);
      pintar();
    }

    function calcular() {
      const l = letra(), t = st.fase === 'raiz-a' ? st.reto.a : st.reto.b;
      const esperado = raizDe(t);
      const lectura = A.leerCampo(raiz, 'dc-num');
      if (lectura.falta) { ponerMensaje('aviso', ...A.avisoFalta(lectura.falta, l)); return; }
      const [v, e] = lectura.t;
      if (v === esperado[0] && e === esperado[1]) {
        st.fallos = 0;
        ponerMensaje('ok', '¡Correcto!', `${MA.esc(C.terminoTexto(esperado, l))} · ${MA.esc(C.terminoTexto(esperado, l))} = ${MA.esc(tt(t))}.`);
        if (st.fase === 'raiz-a') { st.ra = esperado; st.fase = 'raiz-b'; pintar(); return; }
        st.rb = esperado;
        armar();
        return;
      }
      st.fallos++;
      const partes = [];
      if (v !== esperado[0]) {
        const c = t[0];
        if (v === -esperado[0]) partes.push('La raíz se escribe positiva: el + y el − ya están en los dos paréntesis.');
        else if (v * 2 === c) partes.push(`Ese resultado sale de dividir entre 2. La raíz es el número que multiplicado por sí mismo da ${c}, y ${MA.fmt(v)} · ${MA.fmt(v)} = ${MA.fmt(v * v)}.`);
        else partes.push(`${MA.fmt(v)} · ${MA.fmt(v)} = ${MA.fmt(v * v)}, no ${c}. ¿Qué número multiplicado por sí mismo da ${c}?`);
      }
      if (e !== esperado[1]) {
        partes.push(esperado[1] === 0 ? `El ${MA.fmt(t[0])} no tiene ${l}: su raíz tampoco.`
          : e > esperado[1] ? `La raíz deshace el cuadrado: ${l} · ${l} = ${l}², así que la raíz de ${l}² es ${l}.`
          : `La raíz de ${l}² también tiene ${l}, porque ${l} · ${l} = ${l}².`);
      }
      if (st.fallos >= 2) partes.push(`Es ${MA.esc(C.terminoTexto(esperado, l))}: escribirlo para seguir.`);
      ponerMensaje('error', 'Todavía no.', partes.join(' '));
      const campo = $('#dc-num', raiz);
      if (campo) campo.select();
    }

    function armar() {
      const l = letra();
      const [f1, f2] = factores();
      const ped = C.pedazos(f1, f2);
      agregarPaso(`${exprHtml()} ${igual} ${alCuadrado(st.ra)} ${op('−')} ${alCuadrado(st.rb)}`, 'Los dos son cuadrados.');
      agregarPaso(`${igual} ${C.productoHtml([f1, f2], l)}`, 'Un cuadrado menos otro: (raíz + raíz)(raíz − raíz).');
      agregarPaso(`${C.productoHtml([f1, f2], l)} ${igual} ${C.polinomioHtml(ped, l)} ${igual} ${C.polinomioHtml(C.juntar(ped), l)}`, 'Comprobación: al armar, los del medio se anulan.');
      terminar(`Queda ${MA.esc(C.productoTexto([f1, f2], l))}. Al armarlo, los del medio se anulan y vuelve a dar ${MA.esc(exprTexto())}.`);
    }

    function terminar(texto) {
      st.fase = 'listo';
      ponerMensaje('ok', '¡Listo!', texto);
      if (st.reto.id && !st.origen) {
        if (MA.progreso.marcar('m3.cuad.' + st.reto.id)) MA.aviso('Reto completado.');
        pintarRetos();
      }
      pintar();
    }

    function pista() {
      const r = st.reto, l = letra();
      if (st.fase === 'reconocer') ponerMensaje('info', 'Pista.', 'Mirar el signo del medio y preguntarse si cada término es algo multiplicado por sí mismo.');
      else if (st.fase === 'raiz-a' || st.fase === 'raiz-b') {
        const t = st.fase === 'raiz-a' ? r.a : r.b;
        ponerMensaje('info', 'Pista.', t[1] > 0
          ? `Por separado: ¿qué número por sí mismo da ${MA.fmt(t[0])}? Y ${l} · ${l} = ${l}².`
          : `¿Qué número multiplicado por sí mismo da ${MA.fmt(t[0])}? Probar con 2 · 2, 3 · 3, 4 · 4…`);
      } else ponerMensaje('info', 'Ya está resuelto.', '');
    }

    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b)) return;
      if (b.dataset.reto) { cargar(C.RETOS_CUADRADOS.find(x2 => x2.id === b.dataset.reto)); return; }
      if (b.dataset.sig) {
        cargar(C.RETOS_CUADRADOS.find(x2 => x2.id === b.dataset.sig));
        raiz.scrollIntoView({ behavior: MA.movimientoReducido() ? 'auto' : 'smooth', block: 'start' });
        return;
      }
      if (b.dataset.reconoce) { reconocer(b.dataset.reconoce === 'si'); return; }
      if (b.dataset.tipo != null) { A.marcarTipo(b); return; }
      const a = b.dataset.accion;
      if (a === 'calcular') calcular();
      else if (a === 'pista') pista();
      else if (a === 'reiniciar') cargar(st.reto, st.origen);
      else if (a === 'volver' && st.origen) st.origen.volver();
      else if (a === 'final' && opciones.final) opciones.final.ir();
    });
    raiz.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'dc-num') { e.preventDefault(); calcular(); } });
    MA.bus.on('progreso', clave => { if (clave === null) pintarRetos(); });

    const guardado = MA.almacen.leer('m3.cuad.reto', null);
    const primero = C.RETOS_CUADRADOS.find(r => r.id === guardado)
      || C.RETOS_CUADRADOS.find(r => !MA.progreso.hecho('m3.cuad.' + r.id)) || C.RETOS_CUADRADOS[0];
    cargar(primero);

    return {
      cargarProblema(problema, origen) { cargar(Object.assign({ titulo: 'Ejercicio de la práctica' }, problema), origen); }
    };
  }

  MA.Cuadrados = { crear: crearCuadrados, figura: crearFigura };
})();
