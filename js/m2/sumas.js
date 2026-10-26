/* =====================================================================
   HERRAMIENTA · MESA DE SUMAS Y RESTAS (fracciones)
   ---------------------------------------------------------------------
   Para cada a/b ± c/d:
     1) decidir si tienen el mismo número abajo;
     2) mismo abajo: se suman (o restan) los de arriba y abajo queda
        igual. Distinto abajo: la mariposa, en cruz arriba (a · d y
        b · c) y abajo con abajo (b · d). Cada producto lo escribe el
        estudiante; la mesa resalta los dos números que se multiplican
        (azul: va arriba; ámbar: va abajo, como en extremos y medios);
     3) simplificar: dividir arriba y abajo entre el mismo número hasta
        que ya no se pueda.
   Un entero lleva un 1 abajo: 2 = 2/1.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, icono } = MA;
  const { n, fr, op, ext, med } = MA.f;

  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const PRIMOS = [2, 3, 5, 7];
  const SIMBOLO = { '+': '+', '-': '−' };
  const leerFraccion = x => ({ n: x[0], d: x.length > 1 ? x[1] : 1, entero: x.length === 1 });

  function crearSumas(raiz, opciones = {}) {
    const C = MA.M2;
    const st = { reto: null, fase: null, a: null, b: null, pendientes: [], hechos: {}, N: 0, D: 1, fallos: 0, origen: null };

    raiz.classList.add('banco', 'mesa-sm');
    raiz.innerHTML = `
      <div class="banco-cabeza">
        <div>
          <span class="etiqueta">Herramienta 1</span>
          <h3>Mesa de sumas y restas</h3>
        </div>
        <div class="segmentado sm-retos" role="group" aria-label="Retos de sumas y restas"></div>
      </div>
      <div class="bz-origen sm-origen" hidden></div>
      <div class="cv-reto sm-reto"></div>
      <div class="sm-mesa" aria-live="polite"></div>
      <div class="mf-pregunta sm-pregunta" hidden></div>
      <div class="mo-calculo sm-calculo" hidden></div>
      <div class="banco-pie">
        <div class="mensaje sm-mensaje" role="status" aria-live="polite"></div>
        <div class="fila-botones sm-botones"></div>
      </div>
      <section class="cv-bitacora" aria-label="Pasos">
        <h4>Pasos</h4>
        <p class="texto-3">Lo mismo que se escribe en el papel, renglón por renglón.</p>
        <ol class="bz-pasos sm-pasos"></ol>
      </section>`;

    const msg = $('.sm-mensaje', raiz);
    function ponerMensaje(tipo, titulo, texto) {
      if (!tipo) { msg.className = 'mensaje sm-mensaje'; msg.innerHTML = ''; return; }
      const ico = { ok: 'checkCirculo', aviso: 'alerta', info: 'info', error: 'errorCirculo' }[tipo];
      msg.className = 'mensaje sm-mensaje ' + tipo;
      msg.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto || ''}</div>`;
    }
    const pasos = [];
    function agregarPaso(html, nota) { pasos.push({ html, nota }); pintarPasos(); }
    const pintarPasos = () => { $('.sm-pasos', raiz).innerHTML = pasos.map(p => `<li><span class="mt">${p.html}</span>${p.nota ? `<span class="bz-paso-nota">${p.nota}</span>` : ''}</li>`).join(''); };

    function pintarRetos() {
      $('.sm-retos', raiz).innerHTML = C.RETOS_SUMAS.map((r, i) => {
        const hecho = MA.progreso.hecho('m2.frac.' + r.id);
        return `<button type="button" class="segmento" data-reto="${r.id}" aria-pressed="${!!(st.reto && st.reto.id === r.id)}">Reto ${i + 1}${hecho ? `<span class="ok">${icono('check')}</span>` : ''}</button>`;
      }).join('');
    }

    const sim = () => SIMBOLO[st.reto.op];
    const sumaVerbo = () => (st.reto.op === '+' ? 'suman' : 'restan');
    const opera = (x, y) => (st.reto.op === '+' ? x + y : x - y);
    // Una fracción del enunciado: el entero, sin el 1
    const enunciadoHtml = f => (f.entero ? n(f.n) : fr(n(f.n), n(f.d)));

    /* ---------- Cargar un reto ---------- */
    function cargar(reto, origen) {
      st.reto = reto;
      st.origen = origen || null;
      st.a = leerFraccion(reto.a);
      st.b = leerFraccion(reto.b);
      st.fase = 'metodo';
      st.pendientes = [];
      st.hechos = {};
      st.fallos = 0;
      pasos.length = 0;
      if (!origen && reto.id) MA.almacen.guardar('m2.sumas.reto', reto.id);
      const i = C.RETOS_SUMAS.indexOf(reto);
      $('.sm-reto', raiz).innerHTML = `
        ${i >= 0 ? `<span class="pildora">Reto ${i + 1} de ${C.RETOS_SUMAS.length}</span>` : ''}
        <h4>${reto.titulo || 'Ejercicio de la práctica'}</h4>
        ${reto.contexto ? `<p>${reto.contexto}</p>` : ''}`;
      const ori = $('.sm-origen', raiz);
      ori.hidden = !origen;
      if (origen) ori.innerHTML = `<span>${icono('hoja')}Ejercicio ${origen.numero} de la práctica</span><button type="button" class="btn btn-secundario btn-chico" data-accion="volver">${icono('flechaI')}Volver a la práctica</button>`;
      agregarPaso(`${enunciadoHtml(st.a)} ${op(sim())} ${enunciadoHtml(st.b)}`, 'El planteamiento.');
      ponerMensaje(null);
      pintarRetos();
      pintar();
    }

    /* ---------- Lo que se escribe, paso por paso ----------
       Cada pendiente: texto de la cuenta, valor, números que se
       resaltan y si el resultado va arriba o abajo. */
    function armarPendientes(mismo) {
      const { a, b } = st;
      if (mismo) {
        st.pendientes = [{ clave: 'arriba', texto: `${a.n} ${sim()} ${b.n}`, valor: opera(a.n, b.n), resalta: ['an', 'bn'], piso: 'arriba' }];
        return;
      }
      st.pendientes = [
        { clave: 'ad', texto: `${a.n} · ${b.d}`, valor: a.n * b.d, resalta: ['an', 'bd'], piso: 'arriba' },
        { clave: 'bc', texto: `${a.d} · ${b.n}`, valor: a.d * b.n, resalta: ['ad', 'bn'], piso: 'arriba' },
        { clave: 'bd', texto: `${a.d} · ${b.d}`, valor: a.d * b.d, resalta: ['ad', 'bd'], piso: 'abajo' },
        { clave: 'arriba', texto: null, valor: opera(a.n * b.d, a.d * b.n), resalta: [], piso: 'arriba' }
      ];
      st.pendientes[3].texto = `${st.pendientes[0].valor} ${sim()} ${st.pendientes[1].valor}`;
    }
    const actual = () => st.pendientes.find(p => !(p.clave in st.hechos));

    /* ---------- Dibujo ---------- */
    function pintar() {
      const { a, b } = st;
      const p = st.fase === 'mismo' || st.fase === 'mariposa' ? actual() : null;
      const marca = pos => {
        const v = { an: a.n, ad: a.d, bn: b.n, bd: b.d }[pos];
        const uno = (pos === 'ad' && a.entero) || (pos === 'bd' && b.entero);
        const clase = p && p.resalta.includes(pos) ? (p.piso === 'arriba' ? 'sm-sube' : 'sm-baja') : '';
        return `<span class="sm-num ${clase} ${uno ? 'sm-uno' : ''}">${n(v)}</span>`;
      };
      const izquierda = `${fr(marca('an'), marca('ad'))} ${op(sim())} ${fr(marca('bn'), marca('bd'))}`;
      // Casilla de un resultado: el valor si ya se escribió; «?» si es el que toca
      const casilla = clave => {
        if (clave in st.hechos) return n(st.hechos[clave]);
        return `<span class="sm-casilla ${p && p.clave === clave ? 'activa' : ''}">?</span>`;
      };
      let derecha = '';
      if (st.fase === 'mismo') {
        derecha = `${op('=')} ${fr(casilla('arriba'), n(a.d))}`;
      } else if (st.fase === 'mariposa') {
        derecha = `${op('=')} ${fr(`${ext(casilla('ad'))} ${op(sim())} ${ext(casilla('bc'))}`, med(casilla('bd')))}`;
        if ('arriba' in st.hechos || p.clave === 'arriba') derecha += ` ${op('=')} ${fr(casilla('arriba'), n(st.hechos.bd))}`;
      } else if (st.fase === 'simplificar' || st.fase === 'listo') {
        derecha = `${op('=')} <span class="sm-resultado ${st.fase === 'listo' ? 'listo' : ''}">${st.D === 1 ? n(st.N) : fr(n(st.N), n(st.D))}</span>`;
      }
      $('.sm-mesa', raiz).innerHTML = `<div class="mt sm-expr">${izquierda} ${derecha}</div>`;

      const preg = $('.sm-pregunta', raiz);
      preg.hidden = !(st.fase === 'metodo' || st.fase === 'simplificar');
      if (st.fase === 'metodo') {
        preg.innerHTML = `
          <p class="cv-preg-titulo">${icono('pista')}Antes de empezar: ¿tienen el mismo número abajo?</p>
          <div class="fila-botones">
            <button type="button" class="btn btn-secundario btn-chico" data-metodo="mismo">Sí, el mismo</button>
            <button type="button" class="btn btn-secundario btn-chico" data-metodo="mariposa">No, distinto</button>
          </div>
          ${a.entero || b.entero ? `<p class="texto-3">Un número entero lleva un 1 abajo: ${n(a.entero ? a.n : b.n)} es lo mismo que <span class="mt">${fr(n(a.entero ? a.n : b.n), n(1))}</span>.</p>` : ''}`;
      } else if (st.fase === 'simplificar') {
        preg.innerHTML = `
          <p class="cv-preg-titulo">${icono('pista')}¿Se puede simplificar? Dividir arriba y abajo entre el mismo número.</p>
          <div class="fila-botones">
            ${PRIMOS.map(k => `<button type="button" class="btn btn-secundario btn-chico" data-divisor="${k}">÷ ${k}</button>`).join('')}
            <button type="button" class="btn btn-secundario btn-chico" data-divisor="0">Ya no se puede</button>
          </div>`;
      }

      const calc = $('.sm-calculo', raiz);
      calc.hidden = !p;
      if (p) {
        calc.innerHTML = `
          <label for="sm-campo"><span class="mt">${p.texto.replace(/-/g, '−')}</span> <span class="mo-igual">=</span></label>
          <span class="campo-grupo"><input id="sm-campo" class="campo" type="text" inputmode="text" autocomplete="off" spellcheck="false" placeholder="Número"></span>
          <button type="button" class="btn btn-chico" data-accion="calcular">Comprobar</button>
          <p class="texto-3">${st.fase === 'mismo' ? 'Arriba: lo que se escribe en el papel.' : p.clave === 'arriba' ? `Ahora se ${sumaVerbo()} lo de arriba.` : p.piso === 'arriba' ? 'En cruz: este resultado va arriba.' : 'Abajo con abajo: este resultado va abajo.'}</p>`;
        setTimeout(() => { const c = $('#sm-campo', raiz); if (c) c.focus({ preventScroll: true }); }, 30);
      }
      pintarBotones();
    }

    // Botones del pie: ayudas mientras se resuelve; al terminar, cómo seguir
    function pintarBotones() {
      const cont = $('.sm-botones', raiz);
      if (st.fase !== 'listo') {
        cont.innerHTML = `
          <button type="button" class="btn btn-secundario btn-chico" data-accion="pista">${icono('pista')}Pista</button>
          <button type="button" class="btn btn-fantasma btn-chico" data-accion="reiniciar">${icono('reiniciar')}Reiniciar</button>`;
        return;
      }
      const i = C.RETOS_SUMAS.indexOf(st.reto), sig = C.RETOS_SUMAS[i + 1];
      const seguir = st.origen ? `<button type="button" class="btn" data-accion="volver">${icono('flechaI')}Volver al ejercicio ${st.origen.numero}</button>`
        : sig ? `<button type="button" class="btn" data-sig="${sig.id}">Siguiente reto${icono('flechaD')}</button>`
        : i >= 0 && opciones.final ? `<button type="button" class="btn" data-accion="final">${opciones.final.texto}${icono('flechaD')}</button>` : '';
      cont.innerHTML = `${seguir}<button type="button" class="btn btn-secundario" data-accion="reiniciar">${icono('reiniciar')}Repetir</button>`;
    }

    /* ---------- Acciones ---------- */
    function elegirMetodo(m) {
      const { a, b } = st;
      const mismo = a.d === b.d;
      if ((m === 'mismo') !== mismo) {
        ponerMensaje('error', 'Mirar otra vez.', mismo
          ? `Los dos tienen ${a.d} abajo: son pedazos del mismo tamaño.`
          : `Abajo hay ${a.d} y ${b.d}: son distintos. Para eso está la mariposa.`);
        return;
      }
      st.fase = mismo ? 'mismo' : 'mariposa';
      armarPendientes(mismo);
      ponerMensaje('ok', '¡Correcto!', mismo
        ? `Mismo abajo: se ${sumaVerbo()} los de arriba y abajo queda ${a.d}.`
        : 'Distinto abajo: la mariposa. Dos multiplicaciones en cruz (van arriba) y una abajo con abajo.');
      pintar();
    }

    function calcular() {
      const p = actual();
      const campo = $('#sm-campo', raiz);
      const cands = MA.leerNumeros(campo.value);
      if (!cands.length) { ponerMensaje('aviso', 'Solo el número.', 'Ejemplos válidos: 12 · −4'); campo.focus(); return; }
      if (cands.some(c => MA.casiIgual(c, p.valor, 0.0001))) {
        st.hechos[p.clave] = p.valor;
        st.fallos = 0;
        ponerMensaje('ok', '¡Correcto!', '');
        avanzar(p);
        return;
      }
      st.fallos++;
      const dado = cands[0];
      let texto = p.clave === 'arriba' && st.reto.op === '-' && MA.casiIgual(dado, -p.valor, 0.0001)
        ? 'El número está bien, pero el signo no: primero va el de la izquierda y se le resta el otro.'
        : p.clave === 'arriba' && st.reto.op === '-' && MA.casiIgual(dado, p.valor + 2 * (st.fase === 'mismo' ? st.b.n : st.hechos.bc), 0.0001)
          ? 'Es una resta, no una suma.'
          : `Revisar la cuenta: ${p.texto.replace(/-/g, '−')}.`;
      if (st.fallos >= 2) texto += ` Da ${MA.fmt(p.valor)}: escribirlo para seguir.`;
      ponerMensaje('error', 'Todavía no.', texto);
      campo.select();
    }

    function avanzar(p) {
      const { a, b } = st;
      const s = op(sim());
      if (st.fase === 'mismo') {
        st.N = p.valor; st.D = a.d;
        agregarPaso(`${fr(`${n(a.n)} ${s} ${n(b.n)}`, n(a.d))} ${op('=')} ${fr(n(st.N), n(st.D))}`, `Mismo abajo: se ${sumaVerbo()} los de arriba y abajo queda igual.`);
        aSimplificar();
        return;
      }
      if (p.clave === 'bd') {
        const h = st.hechos;
        agregarPaso(`${fr(n(a.n), n(a.d))} ${s} ${fr(n(b.n), n(b.d))} ${op('=')} ${fr(`${ext(`${n(a.n)} ${op('·')} ${n(b.d)}`)} ${s} ${ext(`${n(a.d)} ${op('·')} ${n(b.n)}`)}`, med(`${n(a.d)} ${op('·')} ${n(b.d)}`))} ${op('=')} ${fr(`${n(h.ad)} ${s} ${n(h.bc)}`, n(h.bd))}`,
          `La mariposa: en cruz arriba, abajo con abajo.${a.entero || b.entero ? ' El entero lleva un 1 abajo.' : ''}`);
      }
      if (p.clave === 'arriba') {
        st.N = p.valor; st.D = st.hechos.bd;
        agregarPaso(fr(n(st.N), n(st.D)), `Se ${sumaVerbo()} los de arriba.`);
        aSimplificar();
        return;
      }
      pintar();
    }

    function aSimplificar() {
      st.fase = 'simplificar';
      pintar();
    }

    function simplificar(k) {
      const g = mcd(st.N, st.D);
      if (k === 0) {
        if (g > 1) { ponerMensaje('error', 'Todavía se puede.', `${MA.fmt(st.N)} y ${MA.fmt(st.D)} tienen un divisor en común. Probar con 2, 3 y 5.`); return; }
        terminar();
        return;
      }
      if (st.N % k !== 0 || st.D % k !== 0) {
        const texto = st.N % k !== 0 && st.D % k !== 0
          ? `Ni ${MA.fmt(st.N)} ni ${MA.fmt(st.D)} se pueden dividir entre ${k}.`
          : `${MA.fmt(st.N % k !== 0 ? st.N : st.D)} no se puede dividir entre ${k}.`;
        ponerMensaje('error', `Entre ${k}, no.`, `${texto} Tienen que poder los dos.`);
        return;
      }
      const antes = [st.N, st.D];
      st.N /= k; st.D /= k;
      agregarPaso(`${fr(n(antes[0]), n(antes[1]))} ${op('=')} ${fr(n(st.N), n(st.D))}`, `Arriba y abajo entre ${k}.`);
      ponerMensaje('ok', `Divididos entre ${k}.`, `${MA.fmt(antes[0])} → ${MA.fmt(st.N)} y ${MA.fmt(antes[1])} → ${MA.fmt(st.D)}.`);
      pintar();
    }

    function terminar() {
      st.fase = 'listo';
      if (st.D === 1) agregarPaso(`${fr(n(st.N), n(1))} ${op('=')} ${n(st.N)}`, 'Un 1 abajo no cambia nada.');
      const r = st.D === 1 ? MA.fmt(st.N) : `${MA.fmt(st.N)}/${MA.fmt(st.D)}`;
      ponerMensaje('ok', '¡Listo!', `Queda ${r}. Ya no se puede simplificar.${st.reto.nota ? ' ' + st.reto.nota : ''}`);
      if (st.reto.id && !st.origen) {
        if (MA.progreso.marcar('m2.frac.' + st.reto.id)) MA.aviso('Reto completado.');
        pintarRetos();
      }
      pintar();
    }

    function pista() {
      const { a, b } = st;
      if (st.fase === 'metodo') { ponerMensaje('info', 'Pista.', 'Mirar solo los números de abajo.'); return; }
      if (st.fase === 'simplificar') {
        ponerMensaje('info', 'Pista.', mcd(st.N, st.D) > 1
          ? 'Si los dos son pares, se dividen entre 2. Si los dos terminan en 0 o en 5, entre 5. Si no, probar con 3.'
          : `¿Hay algún número que divida a ${MA.fmt(st.N)} y a ${MA.fmt(st.D)} a la vez? Si no hay, ya está.`);
        return;
      }
      if (st.fase === 'listo') { ponerMensaje('info', 'Ya está resuelto.', ''); return; }
      const p = actual();
      const textos = {
        ad: `En cruz: el de arriba a la izquierda (${a.n}) por el de abajo a la derecha (${b.d}).`,
        bc: `En cruz: el de abajo a la izquierda (${a.d}) por el de arriba a la derecha (${b.n}).`,
        bd: `Abajo con abajo: ${a.d} · ${b.d}.`,
        arriba: st.fase === 'mismo' ? `Abajo queda ${a.d}. Arriba: ${a.n} ${sim()} ${b.n}.` : `Ahora se ${sumaVerbo()} los dos de arriba: ${p.texto.replace(/-/g, '−')}.`
      };
      ponerMensaje('info', 'Pista.', textos[p.clave]);
    }

    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b)) return;
      if (b.dataset.reto) { cargar(C.RETOS_SUMAS.find(x => x.id === b.dataset.reto)); return; }
      if (b.dataset.sig) {
        cargar(C.RETOS_SUMAS.find(x => x.id === b.dataset.sig));
        raiz.scrollIntoView({ behavior: MA.movimientoReducido() ? 'auto' : 'smooth', block: 'start' });
        return;
      }
      if (b.dataset.metodo) { elegirMetodo(b.dataset.metodo); return; }
      if (b.dataset.divisor) { simplificar(Number(b.dataset.divisor)); return; }
      const a = b.dataset.accion;
      if (a === 'calcular') calcular();
      else if (a === 'pista') pista();
      else if (a === 'reiniciar') cargar(st.reto, st.origen);
      else if (a === 'volver' && st.origen) st.origen.volver();
      else if (a === 'final' && opciones.final) opciones.final.ir();
    });
    raiz.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'sm-campo') calcular(); });
    MA.bus.on('progreso', clave => { if (clave === null) pintarRetos(); });

    const guardado = MA.almacen.leer('m2.sumas.reto', null);
    const primero = C.RETOS_SUMAS.find(r => r.id === guardado)
      || C.RETOS_SUMAS.find(r => !MA.progreso.hecho('m2.frac.' + r.id)) || C.RETOS_SUMAS[0];
    cargar(primero);

    return {
      cargarProblema(problema, origen) { cargar(Object.assign({ titulo: 'Ejercicio de la práctica' }, problema), origen); }
    };
  }

  MA.Sumas = { crear: crearSumas };
})();
