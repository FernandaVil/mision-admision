/* =====================================================================
   PRÁCTICA EXTRA · RADAR DE SIGNOS (gimnasia rápida)
   ---------------------------------------------------------------------
   Diez cuentas de cabeza, solo el resultado. Del 1 al 5, sumas y restas
   con negativos; del 6 al 10 se mezclan con multiplicaciones y
   divisiones que usan los mismos números, para obligar a mirar la
   operación antes de calcular.
   Si la respuesta sale de usar «menos y menos da más» en una suma o una
   resta, salta una alerta con la analogía de la plata. Los signos
   pegados (−4 − (−2)) solo se cambian por uno; el signo del resultado
   sale después, con la plata, y puede ser negativo. La primera ronda
   es fija (MA.M2.RADAR); las siguientes cambian los números con las
   mismas trampas y se repiten igual al recargar (azar con semilla).
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, icono } = MA;
  const { n, op, mt } = MA.f;
  const por = op('·'), entre = op('÷'), mas = op('+'), menos = op('−');
  const { neg } = MA.M2;

  /* ---------- Tipos de ejercicio ----------
     sit: A (se multiplican o se dividen: la regla da el signo del
     resultado), B (números separados que se suman o se restan: plata) o
     C (signos pegados: se cambian por uno solo y queda una cuenta B).
     pregunta: la idea de plata sin la respuesta; plata: con la respuesta.
     C: cambio (cómo queda escrito) y pasa (la cuenta B que queda).
     errores: respuestas típicas y su mensaje; aviso: true es una alerta
     del radar (ámbar). */
  const CUIDADO = 'Cuidado, no se están multiplicando.';
  const PEGADOS = 'Cuidado, los signos pegados no dicen el signo del resultado.';
  const TIPOS = {
    paga: {
      sit: 'B', ver: (a, b) => [n(-a), mas, n(b)], da: (a, b) => b - a,
      pregunta: (a, b) => `si debo ${a} y pago ${b}, ¿cuánto sigo debiendo?`,
      plata: (a, b) => `debo ${a} y pago ${b}: todavía debo ${a - b}`,
      errores: (a, b) => [
        { v: a - b, titulo: 'El número está bien, pero el signo no.', texto: 'Después de pagar, todavía queda una deuda.' },
        { v: -a - b, titulo: `El ${b} es plata que entra.`, texto: 'Un pago hace que la deuda baje, no que suba.' },
        { v: -a * b, aviso: true, titulo: CUIDADO, texto: `Ese resultado sale de multiplicar ${a} por ${b} con «distintos dan −».` }
      ]
    },
    endeuda: {
      sit: 'B', ver: (a, b) => [n(-a), menos, n(b)], da: (a, b) => -a - b,
      pregunta: (a, b) => `si debo ${a} y me endeudo con ${b} más, ¿cuánto debo?`,
      plata: (a, b) => `debo ${a} y me endeudo con ${b} más: ahora debo ${a + b}`,
      errores: (a, b) => [
        { v: a + b, aviso: true, titulo: CUIDADO, texto: '' },
        { v: a * b, aviso: true, titulo: CUIDADO, texto: `Ese resultado sale de multiplicar ${a} por ${b} con «menos y menos da más».` },
        { v: -a * b, titulo: 'No hay nada que multiplicar.', texto: 'Son dos deudas que se juntan.' },
        { v: a - b, titulo: 'Las dos son deudas.', texto: 'No se descuentan una con la otra: se juntan.' },
        { v: b - a, titulo: 'Las dos son deudas.', texto: 'No se descuentan una con la otra: se juntan.' }
      ]
    },
    sobra: {
      sit: 'B', ver: (a, b) => [n(-a), mas, n(b)], da: (a, b) => b - a,
      pregunta: (a, b) => `si debo ${a} y recibo ${b}, ¿cuánto me queda después de pagar?`,
      plata: (a, b) => `debo ${a} y recibo ${b}: pago la deuda y me quedan ${b - a}`,
      errores: (a, b) => [
        { v: a - b, aviso: true, titulo: CUIDADO, texto: 'La regla de «distintos dan −» es solo para multiplicar y dividir.' },
        { v: -a * b, aviso: true, titulo: CUIDADO, texto: `Ese resultado sale de multiplicar ${a} por ${b} con «distintos dan −».` },
        { v: -a - b, titulo: `El ${b} es plata que entra.`, texto: 'Primero se paga la deuda y lo que sobra queda en el bolsillo.' },
        { v: a + b, titulo: 'La deuda no se suma a la plata.', texto: 'Primero se paga la deuda y queda lo que sobra.' }
      ]
    },
    gasta: {
      sit: 'B', ver: (a, b) => [n(a), menos, n(b)], da: (a, b) => a - b,
      pregunta: (a, b) => `si tengo ${a} y gasto ${b}, ¿me alcanza?`,
      plata: (a, b) => `tengo ${a} y gasto ${b}: no me alcanza y quedo debiendo ${b - a}`,
      errores: (a, b) => [
        { v: b - a, titulo: 'El número está bien, pero el signo no.', texto: 'Se gasta más de lo que se tiene.' },
        { v: -a - b, titulo: `El ${a} es plata en el bolsillo, no una deuda.`, texto: '' },
        { v: -a * b, aviso: true, titulo: CUIDADO, texto: `Ese resultado sale de multiplicar ${a} por ${b} con «distintos dan −».` }
      ]
    },
    // Solo aparece después de cambiar los signos pegados de 2 − (−2)
    gana: {
      sit: 'B', ver: (a, b) => [n(a), mas, n(b)], da: (a, b) => a + b,
      pregunta: (a, b) => `si tengo ${a} y recibo ${b}, ¿cuánto tengo?`,
      plata: (a, b) => `tengo ${a} y recibo ${b}: ahora tengo ${a + b}`,
      errores: () => []
    },
    por: {
      sit: 'A', ver: (a, b) => [n(-a), por, neg(-b)], da: (a, b) => a * b,
      regla: () => 'se multiplican con signos iguales, así que da +.',
      errores: (a, b) => [
        { v: -a * b, titulo: 'El número está bien, pero el signo no.', texto: 'Aquí sí se multiplican: signos iguales dan +.' },
        { v: -a - b, titulo: 'Aquí sí se multiplican.', texto: `El punto (·) quiere decir «por»: ${a} por ${b}, y signos iguales dan +.` },
        { v: a + b, titulo: 'Aquí sí se multiplican.', texto: `El punto (·) quiere decir «por»: ${a} por ${b}, y signos iguales dan +.` }
      ]
    },
    entre: {
      sit: 'A', ver: (a, b) => [n(-a * b), entre, n(b)], da: a => -a,
      regla: () => 'se dividen con signos distintos, así que da −.',
      errores: (a, b) => [
        { v: a, titulo: 'El número está bien, pero el signo no.', texto: 'Aquí sí se dividen: signos distintos dan −.' },
        { v: -a * b - b, titulo: 'Aquí sí se dividen.', texto: `El ÷ quiere decir «entre»: ¿cuántas veces cabe ${b} en ${a * b}? Signos distintos dan −.` },
        { v: -a * b + b, titulo: 'Aquí sí se dividen.', texto: `El ÷ quiere decir «entre»: ¿cuántas veces cabe ${b} en ${a * b}? Signos distintos dan −.` }
      ]
    },
    // −a − (−b): dos menos, pero el resultado es negativo si b < a
    quita: {
      sit: 'C', ver: (a, b) => [n(-a), menos, neg(-b)], da: (a, b) => b - a,
      cambio: (a, b) => `−${a} + ${b}`, pasa: (a, b) => ({ tipo: b < a ? 'paga' : 'sobra', a, b }),
      errores: (a, b) => [
        b < a
          ? { v: a - b, aviso: true, titulo: PEGADOS, texto: `Los dos menos solo se cambian por un +: queda −${a} + ${b}.` }
          : { v: a - b, titulo: 'El número está bien, pero el signo no.', texto: `Los dos menos se cambian por un +: queda −${a} + ${b}.` },
        { v: a + b, aviso: true, titulo: PEGADOS, texto: `Los dos menos solo se cambian por un +: queda −${a} + ${b}, no ${a} + ${b}.` },
        { v: a * b, aviso: true, titulo: CUIDADO, texto: `Ese resultado sale de multiplicar ${a} por ${b} con «menos y menos da más».` },
        { v: -a - b, titulo: 'Los signos pegados se cambian por uno solo.', texto: `− (−${b}) se vuelve + ${b}: queda −${a} + ${b}.` }
      ]
    },
    juntos: {
      sit: 'C', ver: (a, b) => [n(a), menos, neg(-b)], da: (a, b) => a + b,
      cambio: (a, b) => `${a} + ${b}`, pasa: (a, b) => ({ tipo: 'gana', a, b }),
      errores: (a, b) => [a - b, b - a, -a - b].map(v => ({
        v, titulo: 'Los signos pegados se cambian por uno solo.', texto: `− (−${b}) se vuelve + ${b}: queda ${a} + ${b}.`
      }))
    },
    masneg: {
      sit: 'C', ver: (a, b) => [n(a), mas, neg(-b)], da: (a, b) => a - b,
      cambio: (a, b) => `${a} − ${b}`, pasa: (a, b) => ({ tipo: 'gasta', a, b }),
      errores: (a, b) => [
        { v: b - a, titulo: 'El número está bien, pero el signo no.', texto: `+ (−${b}) se vuelve − ${b}: queda ${a} − ${b}.` },
        { v: a + b, titulo: 'Los signos pegados se cambian por uno solo.', texto: `+ (−${b}) se vuelve − ${b}: queda ${a} − ${b}.` },
        { v: -a * b, aviso: true, titulo: CUIDADO, texto: `Ese resultado sale de multiplicar ${a} por ${b} con «distintos dan −».` }
      ]
    }
  };
  const GRUPOS = [['Sumas y restas', 0, 5], ['Todo mezclado', 5, 10]];
  const plano = ej => TIPOS[ej.tipo].ver(ej.a, ej.b).join(' ').replace(/<[^>]+>/g, '');
  const da = ej => TIPOS[ej.tipo].da(ej.a, ej.b);
  // La cuenta de plata que hay que pensar: la misma (B) o la que queda al cambiar los signos pegados (C)
  const plataDe = ej => {
    const t = TIPOS[ej.tipo];
    const p = t.sit === 'C' ? t.pasa(ej.a, ej.b) : t.sit === 'B' ? ej : null;
    return p && { pregunta: TIPOS[p.tipo].pregunta(p.a, p.b), plata: TIPOS[p.tipo].plata(p.a, p.b) };
  };

  /* ---------- Rondas ----------
     La 1 es la de contenido.js. Las demás: mismo esquema con números al
     azar, y la semilla es el número de ronda. */
  function azarDe(semilla) {
    let s = Math.imul(semilla, 2654435761) >>> 0;
    return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function generar(ronda) {
    const base = MA.M2.RADAR;
    if (ronda <= 1) return base;
    const azar = azarDe(ronda);
    const e = (min, max) => min + Math.floor(azar() * (max - min + 1));
    const mezclar = xs => { for (let i = xs.length - 1; i > 0; i--) { const j = Math.floor(azar() * (i + 1)); [xs[i], xs[j]] = [xs[j], xs[i]]; } return xs; };
    // Sumas y restas: las cuatro situaciones de plata; «deudas que se juntan» va dos veces porque es la trampa principal
    const sumas = mezclar([
      () => { const a = e(3, 12); return { tipo: 'paga', a, b: e(1, a - 1) }; },
      () => ({ tipo: 'endeuda', a: e(2, 9), b: e(2, 9) }),
      () => { const a = e(2, 9); return { tipo: 'sobra', a, b: e(a + 1, a + 9) }; },
      () => { const a = e(1, 8); return { tipo: 'gasta', a, b: e(a + 1, a + 9) }; },
      () => ({ tipo: 'endeuda', a: e(2, 9), b: e(2, 9) })
    ]).map(f => f());
    // Signos pegados: la mitad de las veces −a − (−b), que da negativo o positivo según la plata
    function pegados() {
      const x = azar();
      if (x < 0.5) { const a = e(2, 9); let b = e(1, 8); if (b >= a) b++; return { tipo: 'quita', a, b }; }
      if (x < 0.75) return { tipo: 'juntos', a: e(1, 9), b: e(1, 9) };
      const a = e(1, 8);
      return { tipo: 'masneg', a, b: e(a + 1, a + 9) };
    }
    // Todo mezclado: parejas con los mismos números, en cualquier orden, y unos signos pegados en el medio
    const a = e(2, 7), b = e(2, 7), c = e(2, 6), d = e(2, 5);
    const cambio = [
      ...mezclar([{ tipo: 'por', a, b }, { tipo: 'endeuda', a, b }]),
      pegados(),
      ...mezclar([{ tipo: 'entre', a: c, b: d }, { tipo: 'paga', a: c * d, b: d }])
    ];
    return [...sumas, ...cambio].map((ej, i) => ({ ...ej, id: base[i].id }));
  }

  function crearRadar(raiz) {
    const guardado = MA.almacen.leer('m2.radar', null) || {};
    const st = { ronda: guardado.ronda || 1, actual: guardado.actual || 0, estado: guardado.estado || {} };
    let lista = generar(st.ronda);

    raiz.classList.add('banco', 'mesa-radar');
    raiz.innerHTML = `
      <div class="banco-cabeza">
        <div>
          <span class="etiqueta">Gimnasia rápida</span>
          <h3>Diez cuentas de cabeza</h3>
        </div>
        <div class="fila-botones">
          <span class="pildora rd-ronda"></span>
          <button type="button" class="btn btn-secundario btn-chico" data-accion="ronda">${icono('reiniciar')}Otra ronda</button>
        </div>
      </div>
      <div class="banco-cuerpo">
        <p class="texto-2 rd-instruccion">Solo el resultado, sin papel. Del 1 al 5 hay solo sumas y restas. Del 6 al 10 se mezclan con multiplicaciones, divisiones y signos pegados, a veces con los mismos números, así que antes de calcular hay que fijarse en qué operación es.</p>
        <nav class="pr-mapa rd-mapa" aria-label="Ejercicios del radar"></nav>
        <span class="etiqueta rd-numero"></span>
        <div class="rd-cuenta">
          <span class="rd-expr"></span>
          <span class="op">=</span>
          <span class="campo-grupo"><input class="campo" type="text" inputmode="text" autocomplete="off" spellcheck="false" placeholder="?"></span>
        </div>
        <div class="fila-botones rd-acciones">
          <button type="button" class="btn" data-accion="comprobar">Comprobar</button>
        </div>
        <div class="mensaje rd-mensaje" role="status" aria-live="polite"></div>
      </div>
      <div class="banco-pie">
        <div class="rd-final" hidden></div>
        <div class="fila-botones rd-nav">
          <button type="button" class="btn btn-secundario" data-accion="anterior">${icono('flechaI')}Anterior</button>
          <button type="button" class="btn" data-accion="siguiente">Siguiente${icono('flechaD')}</button>
        </div>
      </div>`;

    const campo = $('.campo', raiz);
    const msj = $('.rd-mensaje', raiz);
    const guardar = () => MA.almacen.guardar('m2.radar', st);
    // La firma evita dar por resuelto un ejercicio que cambió (por ejemplo, al ajustar la ronda 1)
    const firma = ej => `${ej.tipo} ${ej.a} ${ej.b}`;
    const vigente = ej => st.estado[ej.id] && st.estado[ej.id].firma === firma(ej);
    const datos = ej => (vigente(ej) ? st.estado[ej.id] : (st.estado[ej.id] = { firma: firma(ej), resuelto: false, intentos: 0, alerta: false }));
    const resuelto = ej => !!(vigente(ej) && st.estado[ej.id].resuelto);

    function ponerMensaje(tipo, titulo, texto) {
      const ico = { ok: 'checkCirculo', aviso: 'radar', info: 'info', error: 'errorCirculo' }[tipo];
      msj.className = 'mensaje rd-mensaje ' + tipo;
      msj.innerHTML = `${icono(ico)}<div><span class="m-titulo">${titulo}</span>${texto}</div>`;
    }
    const explicar = ej => {
      const t = TIPOS[ej.tipo], p = plataDe(ej);
      if (t.sit === 'A') return `Situación A: ${t.regla(ej.a, ej.b)}`;
      if (t.sit === 'B') return `Situación B: «${p.plata}».`;
      return `Situación C: los signos pegados se cambian por uno solo y queda ${t.cambio(ej.a, ej.b)}. Después, plata: «${p.plata}».`;
    };

    function pintarMapa() {
      const punto = i => {
        const hecho = resuelto(lista[i]);
        return `<button type="button" class="pr-punto ${hecho ? 'resuelto' : ''} ${i === st.actual ? 'actual' : ''}" data-ir="${i}"
          aria-label="Ejercicio ${i + 1}${hecho ? ', resuelto' : ''}" ${i === st.actual ? 'aria-current="step"' : ''}>${hecho ? icono('check') : i + 1}</button>`;
      };
      $('.rd-mapa', raiz).innerHTML = GRUPOS.map(([nombre, desde, hasta]) => {
        const items = [];
        for (let i = desde; i < hasta; i++) items.push(punto(i));
        return `<span class="pr-grupo"><span class="pr-mapa-nivel">${nombre}</span>${items.join('')}</span>`;
      }).join('');
    }

    function pintarFinal() {
      const fin = $('.rd-final', raiz);
      fin.hidden = !lista.every(resuelto);
      if (fin.hidden) return;
      const primera = lista.filter(ej => st.estado[ej.id].intentos === 0).length;
      const alertas = lista.filter(ej => st.estado[ej.id].alerta).length;
      const titulo = primera === lista.length ? '¡Ronda perfecta!' : '¡Ronda completa!';
      const texto = primera === lista.length
        ? 'Las diez a la primera: el radar funciona.'
        : `${primera} de ${lista.length} a la primera.${alertas ? ` La alerta del radar saltó en ${alertas === 1 ? 'un ejercicio' : `${alertas} ejercicios`}.` : ''}`;
      fin.innerHTML = `
        <div class="mensaje ok">${icono('checkCirculo')}<div><span class="m-titulo">${titulo}</span>${texto} En otra ronda cambian los números, pero no las trampas.</div></div>
        <div class="fila-botones"><button type="button" class="btn btn-chico" data-accion="ronda">${icono('reiniciar')}Otra ronda</button></div>`;
    }

    function mostrar(i, enfocar) {
      st.actual = MA.clamp(i, 0, lista.length - 1);
      guardar();
      const ej = lista[st.actual], hecho = resuelto(ej);
      $('.rd-ronda', raiz).textContent = `Ronda ${st.ronda}`;
      $('.rd-numero', raiz).textContent = `Ejercicio ${st.actual + 1} de ${lista.length}`;
      $('.rd-expr', raiz).innerHTML = mt(...TIPOS[ej.tipo].ver(ej.a, ej.b));
      campo.value = hecho ? MA.fmt(da(ej)) : '';
      campo.readOnly = hecho;
      campo.setAttribute('aria-label', `Resultado de ${plano(ej)}`);
      $('.rd-cuenta .campo-grupo', raiz).classList.toggle('rd-bien', hecho);
      $('[data-accion="comprobar"]', raiz).disabled = hecho;
      msj.className = 'mensaje rd-mensaje';
      msj.innerHTML = '';
      if (hecho) ponerMensaje('ok', '¡Correcto!', explicar(ej));
      $('[data-accion="anterior"]', raiz).disabled = st.actual === 0;
      const sig = $('[data-accion="siguiente"]', raiz);
      sig.disabled = st.actual === lista.length - 1;
      sig.classList.toggle('btn-secundario', !hecho);
      pintarMapa();
      pintarFinal();
      if (enfocar) campo.focus();
    }

    function comprobar() {
      const ej = lista[st.actual], t = TIPOS[ej.tipo], d = datos(ej);
      if (d.resuelto) return;
      // «+8» también vale: es justo la respuesta de quien usa «menos y menos da más»
      const cands = MA.leerNumeros(campo.value.trim().replace(/^\+/, ''));
      if (!cands.length) { ponerMensaje('info', 'Solo el número.', 'Con el signo menos si es negativo: −8 o 3.'); campo.focus(); return; }
      const r = da(ej);
      if (cands.includes(r)) {
        d.resuelto = true;
        guardar();
        MA.progreso.marcar('m2.radar.' + ej.id);
        mostrar(st.actual, true);
        return;
      }
      d.intentos++;
      const err = t.errores(ej.a, ej.b).filter(x => x.v !== r).find(x => cands.includes(x.v));
      if (err && err.aviso) d.alerta = true;
      let texto = err ? err.texto : {
        A: 'Aquí sí aplica la regla de los signos: iguales dan +, distintos dan −. Primero el signo y después el número.',
        B: 'Aquí no aplica la regla de los signos: es plata.',
        C: `Primero los signos pegados se cambian por uno solo: queda ${t.cambio(ej.a, ej.b)}.`
      }[t.sit];
      // A la segunda vez, la idea completa y el resultado
      const revelar = d.intentos >= 2, p = plataDe(ej);
      if (p) texto += revelar ? ` Así se piensa: «${p.plata}».` : ` Pensarlo así: «${p.pregunta}».`;
      if (revelar) texto += ` Resultado: ${MA.fmt(r)}.`;
      guardar();
      ponerMensaje(err && err.aviso ? 'aviso' : 'error', err ? err.titulo : 'Todavía no.', texto.trim());
      campo.select();
    }

    // El siguiente sin resolver (después del actual y, si no hay, desde el principio)
    function siguientePendiente() {
      const orden = [...lista.keys()].map(k => (st.actual + 1 + k) % lista.length);
      return orden.find(i => !resuelto(lista[i]));
    }

    function nuevaRonda() {
      st.ronda++;
      st.estado = {};
      lista = generar(st.ronda);
      mostrar(0, true);
    }

    campo.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (!resuelto(lista[st.actual])) { comprobar(); return; }
      const sig = siguientePendiente();
      if (sig != null) mostrar(sig, true);
      else { const b = $('.rd-final [data-accion="ronda"]', raiz); if (b) b.focus(); }
    });
    raiz.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !raiz.contains(b)) return;
      if (b.dataset.ir != null) { mostrar(Number(b.dataset.ir), true); return; }
      switch (b.dataset.accion) {
        case 'comprobar': comprobar(); break;
        case 'anterior': mostrar(st.actual - 1, true); break;
        case 'siguiente': mostrar(st.actual + 1, true); break;
        case 'ronda': nuevaRonda(); break;
      }
    });
    MA.bus.on('progreso', clave => {
      if (clave !== null) return;
      st.ronda = 1;
      st.estado = {};
      lista = generar(1);
      mostrar(0);
    });

    mostrar(st.actual);
    return { ir: i => mostrar(i, true) };
  }

  MA.Radar = { crear: crearRadar, TIPOS, generar };
})();
