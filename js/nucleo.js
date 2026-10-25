/* =====================================================================
   NÚCLEO · utilidades compartidas por toda la plataforma
   DOM, formato de números, lectura de respuestas, almacenamiento,
   portapapeles, iconos, arrastre (mouse y táctil), notación y progreso.
   Todo cuelga del objeto global MA ("Misión admisión").
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA = window.MA || {};

  /* ---------- DOM ---------- */
  MA.$ = (sel, raiz = document) => raiz.querySelector(sel);
  MA.$$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));
  MA.crear = function (tag, clase, html) {
    const e = document.createElement(tag);
    if (clase) e.className = clase;
    if (html != null) e.innerHTML = html;
    return e;
  };
  MA.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  MA.clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  MA.movimientoReducido = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Números (formato colombiano / SI) ----------
     Coma decimal y espacio fino para miles desde 5 cifras:
     2.5 -> "2,5" · 3500 -> "3500" · 30000 -> "30 000"            */
  MA.fmt = function (n, maxDec = 4) {
    if (!isFinite(n)) return '—';
    let s = Math.abs(n).toFixed(maxDec);
    if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
    let [ent, dec] = s.split('.');
    if (ent.length > 4) ent = ent.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const neg = n < 0 && /[1-9]/.test(s);
    return (neg ? '−' : '') + ent + (dec ? ',' + dec : '');
  };
  /* Redondeo a cifras significativas (para lecturas de instrumentos) */
  MA.fmtSig = function (n, sig = 4) {
    if (!isFinite(n)) return '—';
    if (n === 0) return '0';
    const dec = Math.max(0, sig - 1 - Math.floor(Math.log10(Math.abs(n))));
    return MA.fmt(Number(n.toFixed(Math.min(dec, 8))), Math.min(dec, 8));
  };

  /* Lee lo que escribe el usuario y devuelve TODAS las interpretaciones
     razonables: "2,5" "2.5" "1/3" "3.500" (miles) "30 000"...       */
  MA.leerNumeros = function (txt) {
    const s = String(txt).trim().replace(/[\s  ]/g, '').replace(/[−–]/g, '-');
    if (!s) return [];
    const aNum = x => parseFloat(String(x).replace(',', '.'));
    const fr = s.match(/^(-?\d+(?:[.,]\d+)?)\/(-?\d+(?:[.,]\d+)?)$/);
    if (fr) {
      const a = aNum(fr[1]), b = aNum(fr[2]);
      return isFinite(a) && isFinite(b) && b !== 0 ? [a / b] : [];
    }
    const res = new Set();
    if (/^-?\d+([.,]\d+)?$/.test(s) || /^-?[.,]\d+$/.test(s)) res.add(aNum(s));
    if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) res.add(parseFloat(s.replace(/\./g, '')));
    if (/^-?\d{1,3}(,\d{3})+$/.test(s)) res.add(parseFloat(s.replace(/,/g, '')));
    if (/^-?\d{1,3}(\.\d{3})+,\d+$/.test(s)) res.add(parseFloat(s.replace(/\./g, '').replace(',', '.')));
    if (/^-?\d{1,3}(,\d{3})+\.\d+$/.test(s)) res.add(parseFloat(s.replace(/,/g, '')));
    return Array.from(res).filter(x => isFinite(x));
  };
  MA.casiIgual = (a, b, tol = 0.01) => Math.abs(a - b) <= Math.max(Math.abs(b) * tol, 1e-9);

  /* ---------- Almacenamiento local con red de seguridad ---------- */
  const PREFIJO = 'misionAdmision.';
  MA.almacen = {
    leer(clave, porDefecto = null) {
      try { const v = localStorage.getItem(PREFIJO + clave); return v == null ? porDefecto : JSON.parse(v); } catch (e) { return porDefecto; }
    },
    guardar(clave, valor) {
      try { localStorage.setItem(PREFIJO + clave, JSON.stringify(valor)); } catch (e) { /* sin almacenamiento: se ignora */ }
    },
    borrar(clave) {
      try { localStorage.removeItem(PREFIJO + clave); } catch (e) { /* nada */ }
    }
  };

  /* ---------- Bus de eventos mínimo ---------- */
  const oyentes = {};
  MA.bus = {
    on(evt, fn) { (oyentes[evt] = oyentes[evt] || []).push(fn); },
    emit(evt, datos) { (oyentes[evt] || []).forEach(fn => { try { fn(datos); } catch (e) { console.error(e); } }); }
  };

  /* ---------- Progreso (qué actividades ya completó) ---------- */
  MA.progreso = {
    datos: MA.almacen.leer('progreso.v2', {}) || {},
    hecho(clave) { return !!this.datos[clave]; },
    marcar(clave) {
      if (this.datos[clave]) return false;
      this.datos[clave] = Date.now();
      MA.almacen.guardar('progreso.v2', this.datos);
      MA.bus.emit('progreso', clave);
      return true;
    },
    contar(prefijo, claves) { return claves.filter(c => this.hecho(prefijo + c)).length; },
    reiniciar() {
      this.datos = {};
      MA.almacen.guardar('progreso.v2', this.datos);
      MA.bus.emit('progreso', null);
    }
  };

  /* ---------- Portapapeles (con plan B para file://) ---------- */
  MA.copiarTexto = async function (texto) {
    try {
      if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(texto); return true; }
    } catch (e) { /* cae al plan B */ }
    try {
      const ta = document.createElement('textarea');
      ta.value = texto;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, texto.length);
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch (e) { return false; }
  };

  /* ---------- Aviso flotante ---------- */
  let temporizadorAviso = null;
  MA.aviso = function (texto, icono = 'check') {
    const el = document.getElementById('aviso');
    if (!el) return;
    el.innerHTML = MA.icono(icono) + '<span>' + MA.esc(texto) + '</span>';
    el.classList.add('visible');
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => el.classList.remove('visible'), 2600);
  };

  /* ---------- Iconos (trazo 1,75 px, estilo técnico) ---------- */
  const TRAZOS = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    cerrar: '<path d="M18 6 6 18M6 6l12 12"/>',
    sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    luna: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>',
    copiar: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkCirculo: '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
    errorCirculo: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
    invertir: '<path d="m3 16 4 4 4-4M7 20V4M21 8l-4-4-4 4M17 4v16"/>',
    deshacer: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
    reiniciar: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    pista: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/>',
    externo: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    lapiz: '<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
    goma: '<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7M5 11l9 9"/>',
    basura: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
    chevD: '<path d="m9 18 6-6-6-6"/>',
    chevI: '<path d="m15 18-6-6 6-6"/>',
    balanza: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    regla: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2"/>',
    objetivo: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    intercambiar: '<path d="M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    alerta: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
    libro: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    reloj: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    hoja: '<path d="M9 2h6v4H9z"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6M9 16h4"/>',
    mas: '<path d="M12 5v14M5 12h14"/>',
    pantalla: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    flechaD: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    flechaI: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    mano: '<path d="M9 11V6a1.5 1.5 0 0 1 3 0v4M12 10V4.5a1.5 1.5 0 0 1 3 0V10M15 10V6a1.5 1.5 0 0 1 3 0v6a7 7 0 0 1-7 7h-.5a6 6 0 0 1-4.7-2.3L3.3 13.5a1.6 1.6 0 0 1 2.4-2.1L9 14"/>'
  };
  MA.icono = function (nombre, clase = '') {
    if (nombre === 'avion') {
      return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="' + clase + '"><path d="M12 1.8c.7 0 1.2.9 1.2 2.2v5.1l8.3 4.6v2.1l-8.3-2.5v4.6l2.6 1.9v1.7L12 20.6l-3.8.9v-1.7l2.6-1.9v-4.6l-8.3 2.5v-2.1l8.3-4.6V4c0-1.3.5-2.2 1.2-2.2z"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="' + clase + '">' + (TRAZOS[nombre] || '') + '</svg>';
  };

  /* ---------- Arrastrar y soltar (mouse, lápiz y dedo) ----------
     Un toque sin movimiento cuenta como clic (opciones.alTocar).
     Al soltar sobre un elemento que coincide con opciones.destinos
     se llama opciones.alSoltar(destino).                            */
  MA.arrastrable = function (el, opciones) {
    let inicio = null, fantasma = null, sobre = null, idPuntero = null, suprimirClic = false, desfase = null;
    const limpiar = () => {
      if (fantasma) fantasma.remove();
      if (sobre) sobre.classList.remove('destino-activo');
      document.body.classList.remove('arrastrando');
      fantasma = null; sobre = null; inicio = null;
      if (opciones.alTerminar) opciones.alTerminar();
    };
    el.addEventListener('pointerdown', e => {
      if (e.button !== 0 || el.disabled || el.getAttribute('aria-disabled') === 'true') return;
      inicio = { x: e.clientX, y: e.clientY };
      idPuntero = e.pointerId;
    });
    el.addEventListener('pointermove', e => {
      if (!inicio || e.pointerId !== idPuntero) return;
      if (!fantasma) {
        if (Math.hypot(e.clientX - inicio.x, e.clientY - inicio.y) < 7) return;
        try { el.setPointerCapture(idPuntero); } catch (err) { /* nada */ }
        const r = el.getBoundingClientRect();
        desfase = { x: inicio.x - r.left, y: inicio.y - r.top };
        fantasma = el.cloneNode(true);
        fantasma.removeAttribute('id');
        fantasma.classList.add('fantasma');
        fantasma.style.width = r.width + 'px';
        document.body.appendChild(fantasma);
        document.body.classList.add('arrastrando');
        if (opciones.alEmpezar) opciones.alEmpezar();
      }
      fantasma.style.transform = `translate(${e.clientX - desfase.x}px, ${e.clientY - desfase.y}px)`;
      const bajo = document.elementFromPoint(e.clientX, e.clientY);
      const destino = bajo && bajo.closest(opciones.destinos);
      const valido = destino && (!opciones.esValido || opciones.esValido(destino)) ? destino : null;
      if (valido !== sobre) {
        if (sobre) sobre.classList.remove('destino-activo');
        sobre = valido;
        if (sobre) sobre.classList.add('destino-activo');
      }
    });
    el.addEventListener('pointerup', e => {
      if (!inicio || e.pointerId !== idPuntero) return;
      if (fantasma) {
        suprimirClic = true;
        const destino = sobre;
        limpiar();
        if (destino) opciones.alSoltar(destino);
        setTimeout(() => { suprimirClic = false; }, 0);
      } else {
        inicio = null;
      }
    });
    el.addEventListener('pointercancel', () => { if (inicio) limpiar(); });
    el.addEventListener('click', e => {
      if (suprimirClic) { e.preventDefault(); e.stopImmediatePropagation(); return; }
      if (opciones.alTocar) opciones.alTocar(e);
    });
  };

  /* ---------- Notación matemática en HTML ----------
     MA.f.vr('v', '0') -> v₀ en itálica · MA.f.fr(a, b) -> fracción   */
  const f = MA.f = {
    vr: (nombre, sub) => `<span class="vr">${nombre}${sub ? `<sub>${sub}</sub>` : ''}</span>`,
    un: u => `<span class="un">${u}</span>`,
    n: x => `<span class="num">${typeof x === 'number' ? MA.fmt(x) : x}</span>`,
    op: s => `<span class="op">${s}</span>`,
    fr: (a, b) => `<span class="fr"><span class="fr-n">${a}</span><span class="fr-d">${b}</span></span>`,
    mt: (...partes) => `<span class="mt">${partes.join(' ')}</span>`,
    q: (valor, unidad) => `<span class="mt"><span class="num">${typeof valor === 'number' ? MA.fmt(valor) : valor}</span>${unidad ? ' <span class="un">' + unidad + '</span>' : ''}</span>`,
    tach: html => `<span class="tachado">${html}</span>`,
    bloque: html => `<div class="mt mt-bloque">${html}</div>`
  };
  f.igual = f.op('=');
  f.por = f.op('·');
})();
