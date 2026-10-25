/* =====================================================================
   CLASE 1 · ideas clave (diapositivas) y ficha de equivalencias
   ---------------------------------------------------------------------
   La teoría va en dos bloques cortos, cada uno justo antes de la
   herramienta donde se usa:
     parte 1 (diapositivas 1-6)  -> antes de la balanza
     parte 2 (diapositivas 7-12) -> antes de la mesa de conversión
   Las diapositivas le hablan de usted al estudiante (es la voz de la
   clase); la ficha usa el estilo impersonal del resto de la página.
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { icono } = MA;
  const { vr, un, n, op, fr, mt, q, tach } = MA.f;
  const por = op('·'), igual = op('=');
  const qn = (valor, unidad) => `${n(valor)} ${un(unidad)}`;
  const WIKIPEDIA = 'https://es.wikipedia.org/wiki/Prefijos_del_Sistema_Internacional';

  /* ---------- Escalera de prefijos ----------
     Centro: la unidad (metro, gramo, litro). Cada escalón vale × 10.
     Hacia arriba y hacia abajo se abre por niveles: primero los que se
     ven en la vida diaria y, después, los demás solo por curiosidad.   */
  const ESCALERA = [
    { nombre: 'kilo', simbolo: 'k', vale: 'mil veces', factor: '× 1000', celdas: ['km', 'kg', 'kL'], comunes: [1, 1, 0], principal: true },
    { nombre: 'hecto', simbolo: 'h', vale: 'cien veces', factor: '× 100', celdas: ['hm', 'hg', 'hL'], comunes: [0, 0, 0] },
    { nombre: 'deca', simbolo: 'da', vale: 'diez veces', factor: '× 10', celdas: ['dam', 'dag', 'daL'], comunes: [0, 0, 0] },
    { base: true, nombre: 'unidad', vale: 'la referencia', factor: '1', celdas: ['m', 'g', 'L'], nombres: ['metro', 'gramo', 'litro'], comunes: [1, 1, 1], principal: true },
    { nombre: 'deci', simbolo: 'd', vale: 'la décima parte', factor: '÷ 10', celdas: ['dm', 'dg', 'dL'], comunes: [0, 0, 0] },
    { nombre: 'centi', simbolo: 'c', vale: 'la centésima parte', factor: '÷ 100', celdas: ['cm', 'cg', 'cL'], comunes: [1, 0, 0], principal: true },
    { nombre: 'mili', simbolo: 'm', vale: 'la milésima parte', factor: '÷ 1000', celdas: ['mm', 'mg', 'mL'], comunes: [1, 1, 1], principal: true }
  ];
  const p10 = (signo, e) => `${signo} 10<sup>${e}</sup>`;
  // De mayor a menor (así se dibujan en la tabla)
  const GRANDES_1 = [
    { nombre: 'giga', simbolo: 'G', vale: 'mil millones', factor: p10('×', 9), ejemplo: 'gigabyte (GB): la memoria del celular' },
    { nombre: 'mega', simbolo: 'M', vale: 'un millón', factor: p10('×', 6), ejemplo: 'megabyte (MB) y megavatio (MW)' }
  ];
  const GRANDES_2 = [
    { nombre: 'quetta', simbolo: 'Q', vale: 'un quintillón', factor: p10('×', 30), ejemplo: 'la masa de Júpiter: unos 1,9 Qg (quettagramos)' },
    { nombre: 'ronna', simbolo: 'R', vale: 'mil cuatrillones', factor: p10('×', 27), ejemplo: 'la masa de la Tierra: unos 6 Rg (ronnagramos)' },
    { nombre: 'yotta', simbolo: 'Y', vale: 'un cuatrillón', factor: p10('×', 24), ejemplo: 'la masa de la Luna: unos 73 Yg (yottagramos)' },
    { nombre: 'zetta', simbolo: 'Z', vale: 'mil trillones', factor: p10('×', 21), ejemplo: 'la Vía Láctea mide del orden de 1 Zm (zettámetro) de lado a lado' },
    { nombre: 'exa', simbolo: 'E', vale: 'un trillón', factor: p10('×', 18), ejemplo: 'el tráfico de internet de todo el mundo en un mes se mide en exabytes (EB)' },
    { nombre: 'peta', simbolo: 'P', vale: 'mil billones', factor: p10('×', 15), ejemplo: 'un año luz mide unos 9,5 Pm (petámetros)' },
    { nombre: 'tera', simbolo: 'T', vale: 'un billón', factor: p10('×', 12), ejemplo: 'terabyte (TB): un disco duro' }
  ];
  const PEQUENOS_1 = [
    { nombre: 'micro', simbolo: 'µ', vale: 'la millonésima parte', factor: p10('÷', 6), ejemplo: 'un pelo mide unas 70 µm (micras) de grueso' },
    { nombre: 'nano', simbolo: 'n', vale: 'la milmillonésima parte', factor: p10('÷', 9), ejemplo: 'un virus mide unos 100 nm' }
  ];
  const PEQUENOS_2 = [
    { nombre: 'pico', simbolo: 'p', vale: 'la billonésima parte', factor: p10('÷', 12), ejemplo: 'un átomo de hidrógeno mide unos 100 pm' },
    { nombre: 'femto', simbolo: 'f', vale: 'la milbillonésima parte', factor: p10('÷', 15), ejemplo: 'un protón mide unos 1,7 fm' },
    { nombre: 'atto', simbolo: 'a', vale: 'la trillonésima parte', factor: p10('÷', 18), ejemplo: 'los destellos de luz más cortos duran unos cientos de attosegundos (Nobel de Física 2023)' },
    { nombre: 'zepto', simbolo: 'z', vale: 'la miltrillonésima parte', factor: p10('÷', 21), ejemplo: 'la luz tarda unos 250 zs en cruzar una molécula de hidrógeno' },
    { nombre: 'yocto', simbolo: 'y', vale: 'la cuatrillonésima parte', factor: p10('÷', 24), ejemplo: 'la masa de un protón: unos 1,7 yg (yoctogramos)' },
    { nombre: 'ronto', simbolo: 'r', vale: 'la milcuatrillonésima parte', factor: p10('÷', 27), ejemplo: 'la masa de un electrón: unos 0,9 rg (rontogramos)' },
    { nombre: 'quecto', simbolo: 'q', vale: 'la quintillonésima parte', factor: p10('÷', 30), ejemplo: 'el más pequeño de todos; se creó en 2022, junto con ronna, quetta y ronto' }
  ];

  // compacta = versión de la diapositiva: todo en una línea por fila
  const filaEscalon = (f, compacta) => `
    <tr class="${f.base ? 'esc-base' : f.principal ? 'esc-principal' : 'esc-secundaria'}">
      <th scope="row">${f.base ? 'unidad' : `${f.nombre} (${f.simbolo})`}</th>
      <td class="esc-vale">${f.vale}${compacta ? ` <span class="esc-factor">${f.factor}</span>` : `<small>${f.factor}</small>`}</td>
      ${f.celdas.map((c, i) => `<td><span class="esc-un ${f.comunes[i] ? 'comun' : 'raro'}">${c}</span>${f.nombres ? `<small class="esc-nombre">${f.nombres[i]}</small>` : ''}</td>`).join('')}
    </tr>`;
  const filaExtra = f => `
    <tr class="esc-fila-extra">
      <th scope="row">${f.nombre} (${f.simbolo})</th>
      <td class="esc-vale">${f.vale}<small>${f.factor}</small></td>
      <td colspan="3">${f.ejemplo}</td>
    </tr>`;
  const nota = (texto, clase = 'esc-salto') => `<tr class="${clase}"><td colspan="5">${texto}</td></tr>`;
  const NOTA_SALTO = 'Más allá de kilo y de mili, cada prefijo vale mil veces el anterior: ya no hay escalones de 10. (10<sup>6</sup> es un 1 seguido de 6 ceros.)';
  const NOTA_CURIOSIDAD = `Solo por curiosidad: no hace falta aprenderlos. <a href="${WIKIPEDIA}" target="_blank" rel="noopener">Tabla completa en Wikipedia</a>`;

  function escaleraHtml({ completa = true } = {}) {
    return `
      <div class="escalera ${completa ? '' : 'esc-compacta'}" data-escalera>
        ${completa ? `<button type="button" class="esc-ver" data-esc="arriba" data-nivel="0" aria-expanded="false">↑ <span class="txt">Ver prefijos más grandes</span></button>` : ''}
        <div class="tabla-envoltura">
          <table class="esc-tabla">
            <thead><tr><th scope="col">Prefijo</th><th scope="col">Vale</th><th scope="col">Longitud</th><th scope="col">Masa</th><th scope="col">Volumen</th></tr></thead>
            ${completa ? `
            <tbody class="esc-extra" data-zona="arriba-2" hidden>${nota(NOTA_CURIOSIDAD, 'esc-curiosidad')}${GRANDES_2.map(filaExtra).join('')}</tbody>
            <tbody class="esc-extra" data-zona="arriba-1" hidden>${GRANDES_1.map(filaExtra).join('')}${nota(NOTA_SALTO)}</tbody>` : ''}
            <tbody>${ESCALERA.map(f => filaEscalon(f, !completa)).join('')}</tbody>
            ${completa ? `
            <tbody class="esc-extra" data-zona="abajo-1" hidden>${nota(NOTA_SALTO)}${PEQUENOS_1.map(filaExtra).join('')}</tbody>
            <tbody class="esc-extra" data-zona="abajo-2" hidden>${PEQUENOS_2.map(filaExtra).join('')}${nota(NOTA_CURIOSIDAD, 'esc-curiosidad')}</tbody>` : ''}
          </table>
        </div>
        ${completa ? `<button type="button" class="esc-ver" data-esc="abajo" data-nivel="0" aria-expanded="false">↓ <span class="txt">Ver prefijos más pequeños</span></button>` : ''}
      </div>`;
  }

  /* Abrir la escalera por niveles: nivel 0 → 1 (mega/giga o micro/nano) → 2 (todos) → 0 */
  const TEXTOS = {
    arriba: ['Ver prefijos más grandes', 'Ver todavía más grandes (por curiosidad)', 'Ocultar los prefijos grandes'],
    abajo: ['Ver prefijos más pequeños', 'Ver todavía más pequeños (por curiosidad)', 'Ocultar los prefijos pequeños']
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-esc]');
    if (!b) return;
    const lado = b.dataset.esc, cont = b.closest('[data-escalera]');
    const nivel = (Number(b.dataset.nivel) + 1) % 3;
    b.dataset.nivel = String(nivel);
    cont.querySelector(`[data-zona="${lado}-1"]`).hidden = nivel < 1;
    cont.querySelector(`[data-zona="${lado}-2"]`).hidden = nivel < 2;
    b.setAttribute('aria-expanded', String(nivel > 0));
    b.querySelector('.txt').textContent = TEXTOS[lado][nivel];
  });

  /* Balanza estática para la diapositiva 3 (usa los colores de la balanza real) */
  const balanzaSvg = `
    <svg viewBox="0 0 560 250" class="d-balanza" role="img" aria-label="Balanza en equilibrio: a la izquierda 3 por x, a la derecha 12">
      <rect class="bz-base" x="200" y="226" width="160" height="12" rx="4"/>
      <path class="bz-fulcro" d="M280 150 L246 226 L314 226 Z"/>
      <line class="bz-igual" x1="268" y1="197" x2="292" y2="197"/>
      <line class="bz-igual" x1="268" y1="208" x2="292" y2="208"/>
      <rect class="bz-viga" x="70" y="144" width="420" height="12" rx="6"/>
      <circle class="bz-eje" cx="280" cy="150" r="8"/>
      <line class="bz-poste" x1="110" y1="144" x2="110" y2="124"/>
      <line class="bz-poste" x1="450" y1="144" x2="450" y2="124"/>
      <rect class="bz-plataforma" x="40" y="114" width="140" height="10" rx="3"/>
      <rect class="bz-plataforma" x="380" y="114" width="140" height="10" rx="3"/>
      <rect class="d-bloque" x="52" y="54" width="116" height="58" rx="10"/>
      <rect class="d-bloque" x="392" y="54" width="116" height="58" rx="10"/>
      <text class="d-bloque-txt" x="110" y="93"><tspan class="d-recto">3 · </tspan>x</text>
      <text class="d-bloque-txt d-recto" x="450" y="93">12</text>
    </svg>`;

  /* ---------- Diapositivas ---------- */
  const DIAPOSITIVAS = [
    // ---------------- Parte 1 ----------------
    {
      titulo: 'Portada',
      html: `
        <div class="d-portada">
          <p class="d-kicker">Módulo 1 · clase 1</p>
          <h2>Despejes y conversión de unidades</h2>
          <p class="d-sub">Al terminar hoy va a poder:</p>
          <ul class="d-lista">
            <li>Despejar fórmulas como ${mt(vr('d'), igual, vr('v'), por, vr('t'))} sin memorizar reglas.</li>
            <li>Convertir unidades, como km/h a m/s, sin regla de tres.</li>
          </ul>
        </div>`
    },
    {
      titulo: 'Calentamiento',
      html: `
        <h2>Dos preguntas para calentar</h2>
        <div class="d-tarjetas">
          <div class="d-tarjeta"><span class="d-num">1</span>Si ${mt(n(3), por, vr('x'), igual, n(12))}, ¿cuánto vale ${vr('x')}?</div>
          <div class="d-tarjeta"><span class="d-num">2</span>¿Cuántos metros son ${q(2, 'km')}?</div>
        </div>
        <p class="d-nota">No hay respuestas malas: cuénteme cómo lo pensó.</p>`
    },
    {
      titulo: 'El igual es una balanza',
      html: `
        <h2>El signo igual es una balanza</h2>
        <div class="d-dos">
          <div class="d-svg">${balanzaSvg}</div>
          <div>
            <p class="d-grande">Lo que hay a cada lado del igual <b>vale lo mismo</b>.</p>
            <p>Si le hace algo a un plato, tiene que hacerle lo mismo al otro.</p>
            <div class="d-pasos">
              ${mt(n(3), por, vr('x'), igual, n(12))}
              <span class="d-flecha">÷ 3 en los dos lados</span>
              ${mt(vr('x'), igual, n(4))}
            </div>
          </div>
        </div>`
    },
    {
      titulo: 'Operaciones contrarias',
      html: `
        <h2>Cada operación tiene su contraria</h2>
        <div class="d-contrarias">
          <div><span class="d-op">+</span> sumar</div><span class="d-dobleflecha">⇄</span><div><span class="d-op">−</span> restar</div>
          <div><span class="d-op">×</span> multiplicar</div><span class="d-dobleflecha">⇄</span><div><span class="d-op">÷</span> dividir</div>
        </div>
        <div class="d-contrarias d-luego" aria-label="Para más adelante">
          <div><span class="d-op">x²</span> al cuadrado</div><span class="d-dobleflecha">⇄</span><div><span class="d-op">√</span> raíz cuadrada</div>
          <div><span class="d-op">10ˣ</span> potencia de 10</div><span class="d-dobleflecha">⇄</span><div><span class="d-op">log</span> logaritmo</div>
          <span class="d-luego-etq">Más adelante: la raíz, para caída libre y energía; el logaritmo, para el pH.</span>
        </div>
        <p class="d-destacado">Para dejar sola una variable, deshaga lo que le están haciendo, <b>en los dos lados</b>. Hoy, con las cuatro primeras.</p>`
    },
    {
      titulo: 'Lo que ya sabe, como fórmula',
      clase: 'd-ya-sabe',
      html: `
        <h2>Lo que ya sabe, escrito como fórmula</h2>
        <p>A ${qn(50, 'km/h')}, recorrer ${qn(100, 'km')} toma ${qn(2, 'h')}. Eso, hecho de cabeza, ya es un despeje:</p>
        <div class="d-etiquetada">
          <div><span class="mt">${vr('d')}</span><small>distancia</small></div>
          <div><span class="mt">${igual}</span><small></small></div>
          <div><span class="mt">${vr('v')}</span><small>velocidad</small></div>
          <div><span class="mt">${por}</span><small></small></div>
          <div><span class="mt">${vr('t')}</span><small>tiempo</small></div>
          <div class="d-etq-flecha"><span class="mt">→</span><small></small></div>
          <div><span class="mt">${vr('t')} ${igual} ${fr(vr('d'), vr('v'))}</span><small>despejada</small></div>
        </div>
        <p class="d-destacado">Truco para todo el examen: un despeje se comprueba con números fáciles. ${mt(n(100), op('÷'), n(50), igual, q(2, 'h'))}</p>`
    },
    {
      titulo: 'Su turno: la balanza',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('balanza')}</div>
        <h2>Su turno: la balanza</h2>
        <ul class="d-lista">
          <li>Abra <b>Despejes</b> y haga los retos 1 a 6.</li>
          <li>Antes de cada clic, diga qué operación va a aplicar y por qué.</li>
          <li>Si se traba, pregúntese: «¿qué le están haciendo a mi variable?».</li>
        </ul>`
    },
    // ---------------- Parte 2 ----------------
    {
      titulo: 'Número con unidad',
      html: `
        <h2>Una cantidad es un número con unidad</h2>
        <div class="d-cantidad">
          <div><span class="d-cant-num">72</span><small>número</small></div>
          <div><span class="d-cant-un">km/h</span><small>unidad</small></div>
        </div>
        <p class="d-destacado">Convertir es cambiar la unidad <b>sin cambiar la cantidad</b>: ${q(1, 'km')} y ${q(1000, 'm')} son la misma distancia, con distinto nombre.</p>`
    },
    {
      titulo: 'Los prefijos',
      clase: 'd-prefijos',
      html: `
        <h2>Los prefijos sirven para cualquier unidad</h2>
        <p>El prefijo dice cuántas veces la unidad. <b>Kilo siempre es mil</b>: mil metros, mil gramos o mil litros.</p>
        ${escaleraHtml({ completa: false })}
        <p class="d-nota">Cada escalón vale × 10: del metro al kilómetro hay tres (10 · 10 · 10 = 1000). Hay más (mega, micro…): están en la ficha.</p>`
    },
    {
      titulo: 'Horas y minutos',
      clase: 'd-tiempo',
      html: `
        <h2>El tiempo va de 60 en 60</h2>
        <div class="d-equivalencias">
          <span class="mt">${qn(1, 'h')} ${igual} ${qn(60, 'min')}</span>
          <span class="mt">${qn(1, 'min')} ${igual} ${qn(60, 's')}</span>
          <span class="mt">${qn(1, 'h')} ${igual} ${qn(3600, 's')}</span>
        </div>
        <div class="d-tarjetas">
          <div class="d-tarjeta"><span class="d-num">Una unidad con decimal</span>${mt(q(1.3, 'min'), igual, n(1.3), por, q(60, 's'), igual, q(78, 's'))}</div>
          <div class="d-tarjeta"><span class="d-num">Dos unidades juntas</span>${mt(q(2, 'h'), q(50, 'min'), igual, n(2), por, n(60), op('+'), n(50), igual, q(170, 'min'))}</div>
        </div>
        <p class="d-destacado d-ojo">La trampa: 2 h 50 min <b>no es</b> 2,50 h, y 1,3 min <b>no es</b> 1 min 30 s.</p>`
    },
    {
      titulo: 'El 1 disfrazado',
      html: `
        <h2>Una equivalencia es un 1 disfrazado</h2>
        <div class="d-pasos d-pasos-grandes">
          ${mt(qn(1, 'km'), igual, qn(1000, 'm'))}
          <span class="d-flecha">entonces</span>
          ${mt(fr(qn(1000, 'm'), qn(1, 'km')), igual, n(1), igual, fr(qn(1, 'km'), qn(1000, 'm')))}
        </div>
        <p class="d-destacado">Multiplicar por 1 no cambia la cantidad. <b>Solo cambia la unidad.</b></p>`
    },
    {
      titulo: 'La regla de oro',
      html: `
        <h2>La unidad que quiere eliminar va en el piso contrario</h2>
        <div class="mt mt-bloque d-formula">
          ${n(2.5)} ${tach(un('km'))} ${por} ${fr(qn(1000, 'm'), `${n(1)} ${tach(un('km'))}`)} ${igual} ${q(2500, 'm')}
        </div>
        <p>Los km están arriba, así que en el factor van abajo: se tachan como en una fracción.</p>
        <p class="d-destacado d-ojo">Si la pone en el mismo piso, se duplica (km²): las unidades le avisan que se equivocó.</p>`
    },
    {
      titulo: 'Su turno: la mesa',
      clase: 'd-turno',
      html: `
        <div class="d-icono">${icono('regla')}</div>
        <h2>Su turno: la mesa de conversión</h2>
        <ul class="d-lista">
          <li>Abra <b>Conversión de unidades</b> y haga los retos 1 a 7.</li>
          <li>Antes de cada factor, diga qué unidad quiere eliminar y en qué piso está.</li>
          <li>Tiene la ficha de equivalencias en «Ideas clave».</li>
        </ul>`
    }
  ];

  const PARTES = [
    { id: 'p1', nombre: 'Parte 1 · el igual es una balanza', corto: 'Parte 1 · el igual es una balanza', desde: 0, hasta: 5, minutos: '7 min' },
    { id: 'p2', nombre: 'Parte 2 · unidades y prefijos', corto: 'Parte 2 · unidades y prefijos', desde: 6, hasta: 11, minutos: '7 min' }
  ];

  /* ---------- Ficha de equivalencias ---------- */
  const OTRAS = [
    ['Tiempo (va de 60 en 60)', ['1 h = 60 min', '1 min = 60 s', '1 h = 3600 s', '0,5 h = 30 min', '0,1 h = 6 min · 0,1 min = 6 s']],
    ['Volumen', ['1 mL = 1 cm³', '1 L = 1000 cm³', '1 m³ = 1000 L']],
    ['Área (el factor va dos veces)', ['1 m² = 10 000 cm²', '1 km² = 1 000 000 m²']],
    ['Velocidad', ['km/h → m/s: ÷ 3,6', 'm/s → km/h: × 3,6']],
    ['Unidades con nombre propio (no hay que memorizarlas)', ['1 N (newton) = 1 kg · m/s²', '1 J (joule) = 1 N · m = 1 kg · m²/s²', '1 W (vatio) = 1 J/s', '1 Pa (pascal) = 1 N/m²']]
  ];
  function fichaHtml() {
    return `
      <div class="ficha">
        <section class="ficha-bloque">
          <h4>Prefijos: sirven para cualquier unidad</h4>
          <p class="ficha-texto">La unidad está en el centro. Cada escalón hacia arriba es 10 veces más grande y cada escalón hacia abajo, 10 veces más pequeño. Por eso ${mt(qn(1, 'km'), igual, qn(1000, 'm'))} (tres escalones) y ${mt(qn(1, 'm'), igual, qn(100, 'cm'))} (dos escalones).</p>
          ${escaleraHtml()}
          <p class="ficha-leyenda"><span class="esc-un comun">km</span> Los resaltados son los que más se usan en el examen; los grises casi no se usan.</p>
        </section>
        <section class="ficha-bloque">
          <h4>Otras equivalencias que hay que saber</h4>
          <div class="ficha-grupos">
            ${OTRAS.map(([titulo, filas]) => `
              <div class="ficha-grupo">
                <h5>${titulo}</h5>
                <ul>${filas.map(f => `<li>${f}</li>`).join('')}</ul>
              </div>`).join('')}
          </div>
        </section>
      </div>`;
  }

  MA.Clase1 = { DIAPOSITIVAS, PARTES, fichaHtml };
})();
