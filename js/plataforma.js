/* =====================================================================
   PLATAFORMA · rutas, navegación, tema, cajones y panel general
   Rutas (anclas simples, para que también funcionen como enlace directo):
     #inicio · #m1 · #m1-ideas · #m1-ideas-p2 · #m1-despejes ·
     #m1-conversion · #m1-practica · #m2 · #m2-fracciones … #m3-llave … #m6
   ===================================================================== */
(function () {
  'use strict';
  const MA = window.MA;
  const { $, $$, crear, icono } = MA;

  const vistas = {};
  let disparador = null;

  /* ---------- Tema claro / oscuro ---------- */
  const temaActual = () => {
    const d = document.documentElement.dataset.theme;
    if (d === 'dark' || d === 'light') return d;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  function pintarTema() {
    const b = $('#btn-tema');
    const oscuro = temaActual() === 'dark';
    b.innerHTML = icono(oscuro ? 'sol' : 'luna');
    b.setAttribute('aria-label', oscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    b.title = b.getAttribute('aria-label');
  }
  function alternarTema() {
    const nuevo = temaActual() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nuevo;
    try { localStorage.setItem('misionAdmision.tema', nuevo === 'dark' ? 'oscuro' : 'claro'); } catch (e) { /* nada */ }
    pintarTema();
  }

  /* ---------- Cajones: menú (en pantallas chicas) y centro de comando IA (siempre) ---------- */
  const esCajon = id => (id === 'lateral' ? !window.matchMedia('(min-width: 1024px)').matches : true);
  function abrirCajon(id) {
    if (!esCajon(id)) return;
    cerrarCajones(true);
    const el = document.getElementById(id);
    disparador = document.activeElement;
    el.classList.add('abierto');
    $('#velo').hidden = false;
    const boton = id === 'lateral' ? $('#btn-menu') : $('#btn-asistente');
    if (boton) boton.setAttribute('aria-expanded', 'true');
    setTimeout(() => { const f = el.querySelector('button, a, input, summary'); if (f) f.focus({ preventScroll: true }); }, 30);
  }
  function cerrarCajones(sinFoco) {
    const habia = $$('.lateral.abierto, .asistente.abierto');
    habia.forEach(el => el.classList.remove('abierto'));
    $('#velo').hidden = true;
    ['#btn-menu', '#btn-asistente'].forEach(s => { const b = $(s); if (b) b.setAttribute('aria-expanded', 'false'); });
    if (!sinFoco && habia.length && disparador && document.contains(disparador)) disparador.focus({ preventScroll: true });
  }

  /* ---------- Módulos disponibles y su avance ---------- */
  const vistaDe = m => (m.disponible && MA.vistasModulo[m.id]) || null;
  // El módulo para continuar: el primero disponible que no está completo (o el último disponible)
  function moduloActual() {
    const disp = MA.MODULOS.filter(vistaDe);
    return disp.find(m => vistaDe(m).progreso().pct < 1) || disp[disp.length - 1] || MA.MODULOS[0];
  }

  /* ---------- Barra lateral ---------- */
  function pintarLateral(ruta) {
    $('#lateral').innerHTML = `
      <button type="button" class="btn-icono lat-cerrar" data-cerrar aria-label="Cerrar el menú">${icono('cerrar')}</button>
      <div class="lat-titulo">Preparación</div>
      <a class="nav-item ${ruta.mod === 'inicio' ? 'activo' : ''}" href="#inicio" ${ruta.mod === 'inicio' ? 'aria-current="page"' : ''}>
        <span class="nav-num">${icono('objetivo')}</span>
        <span class="nav-nombre">Panel general</span>
        <span class="nav-estado">Ruta de estudio y avance</span>
      </a>
      <div class="lat-titulo">Módulos</div>
      ${MA.MODULOS.map(m => {
        const activo = ruta.mod === m.id;
        const vm = vistaDe(m), p = vm ? vm.progreso() : null;
        let estado = '<span>En preparación</span>';
        if (p) estado = `<span>${Math.round(p.pct * 100)} %</span><span class="barra"><i style="width:${p.pct * 100}%"></i></span>`;
        const sub = vm ? `<div class="nav-sub">${vm.secciones.map(s => {
          const [h, t] = p[s.id];
          const act = activo && ruta.sec === s.id;
          return `<a href="#${m.id}-${s.id}" class="${act ? 'activo' : ''}" ${act ? 'aria-current="page"' : ''}>${s.nombre}${h === t ? `<span class="hecho" title="Completo">${icono('check')}</span>` : ''}</a>`;
        }).join('')}</div>` : '';
        return `
          <a class="nav-item ${m.disponible ? 'disponible' : ''} ${activo ? 'activo' : ''}" href="#${m.id}" ${activo && !ruta.sec ? 'aria-current="page"' : ''}>
            <span class="nav-num">${m.num}</span>
            <span class="nav-nombre">${m.titulo}</span>
            <span class="nav-estado">${estado}</span>
          </a>${sub}`;
      }).join('')}
      <div class="lat-pie">
        <p>El avance se guarda solo en este dispositivo.</p>
        <div class="lat-reinicio"><button type="button" data-reiniciar>Borrar mi progreso</button></div>
      </div>`;
  }
  function pedirConfirmacion(boton) {
    const caja = boton.closest('.lat-reinicio');
    caja.innerHTML = `
      <div class="lat-confirmar" role="group" aria-label="Confirmar borrado">
        <p>¿Borrar los retos y ejercicios resueltos en este dispositivo?</p>
        <div class="fila-botones">
          <button type="button" class="btn btn-chico btn-peligro" data-confirmar-reinicio>Sí, borrar</button>
          <button type="button" class="btn btn-secundario btn-chico" data-cancelar-reinicio>Cancelar</button>
        </div>
      </div>`;
    $('[data-cancelar-reinicio]', caja).focus();
  }

  /* ---------- Panel general ---------- */
  function vistaInicio() {
    const v = crear('section', 'vista-inicio');
    v.innerHTML = `
      <div class="tarjeta portada">
        <div>
          <span class="etiqueta">Panel general</span>
          <h1>Preparación para el examen de admisión</h1>
          <p class="entrada">Seis módulos, de la base hacia el examen. El punto de partida es el módulo 1: despejar y convertir unidades es la base de toda la física y la química que vienen después.</p>
          <div class="fila-botones">
            <a class="btn ini-continuar" href="#m1">Continuar con el módulo 1${icono('flechaD')}</a>
            <button type="button" class="btn btn-secundario" data-abrir-asistente>${icono('chat')}Centro de comando IA</button>
          </div>
        </div>
        <div class="portada-dato">
          <div class="dato"><small class="ini-mod">Módulo 1 completado</small><b class="ini-pct"></b><div class="barra"><i class="ini-barra"></i></div></div>
          <div class="dato"><small>Actividades terminadas</small><b class="ini-act"></b></div>
          <div class="dato"><small>Ritmo sugerido</small><b>30 a 40 min al día</b></div>
        </div>
      </div>
      <section class="seccion">
        <div class="seccion-cabeza"><h2>Ruta de estudio</h2></div>
        <div class="lista-modulos">
          ${MA.MODULOS.map(m => `
            <a class="mod-fila ${m.disponible ? 'disponible' : ''}" href="#${m.id}">
              <span class="nav-num">${m.num}</span>
              <span><h3>${m.titulo}</h3><p>${m.resumen}</p></span>
              <span class="pildora ${m.disponible ? 'pildora-primaria' : ''}">${m.disponible ? 'Disponible' : 'En preparación'}</span>
            </a>`).join('')}
        </div>
      </section>
      <section class="seccion">
        <div class="seccion-cabeza"><h2>Cómo estudiar aquí</h2></div>
        <div class="consejos">
          <div class="tarjeta"><h3>${icono('balanza')}Entender antes de memorizar</h3><p>Cada tema empieza con una herramienta que se puede mover. La idea es probarla hasta poder explicar por qué funciona.</p></div>
          <div class="tarjeta"><h3>${icono('hoja')}Practicar como en el examen</h3><p>Sin calculadora y con papel. Las pistas se piden en orden; la solución completa es el último recurso.</p></div>
          <div class="tarjeta"><h3>${icono('chat')}Usar la IA como tutor</h3><p>Para estudiar solo, las plantillas del centro de comando hacen que la IA guíe sin dar la respuesta.</p></div>
        </div>
      </section>`;
    return v;
  }
  function pintarInicio() {
    const v = vistas.inicio;
    if (!v) return;
    const m = moduloActual(), vm = vistaDe(m);
    if (!vm) return;
    const p = vm.progreso(), n = Number(m.num);
    const todos = MA.MODULOS.filter(vistaDe).map(x => vistaDe(x).progreso());
    $('.ini-continuar', v).href = '#' + m.id;
    $('.ini-continuar', v).innerHTML = `Continuar con el módulo ${n}${icono('flechaD')}`;
    $('.ini-mod', v).textContent = `Módulo ${n} completado`;
    $('.ini-pct', v).textContent = Math.round(p.pct * 100) + ' %';
    $('.ini-barra', v).style.width = p.pct * 100 + '%';
    $('.ini-act', v).textContent = `${todos.reduce((s, x) => s + x.hechos, 0)} de ${todos.reduce((s, x) => s + x.total, 0)}`;
  }

  function vistaPendiente(m) {
    const v = crear('section', 'vista-pendiente');
    v.innerHTML = `
      <span class="etiqueta">Módulo ${Number(m.num)} de 6</span>
      <h1>${m.titulo}</h1>
      <p class="entrada">${m.resumen}</p>
      <div class="tarjeta">
        <span class="pildora">${icono('reloj')}En preparación</span>
        <h3 style="margin-top:12px">Lo que trae este módulo</h3>
        <ul class="temario">${m.temario.map(t => `<li>${t}</li>`).join('')}</ul>
      </div>
      <div class="caja">
        <div class="caja-titulo">${icono('info')}Mientras tanto</div>
        <p>Primero, terminar el módulo ${Number(moduloActual().num)}: cada módulo usa lo del anterior. <a href="#${moduloActual().id}">Ir al módulo ${Number(moduloActual().num)}</a></p>
      </div>`;
    return v;
  }

  /* ---------- Enrutador ---------- */
  function leerRuta() {
    // Acepta #m1-despejes y también el formato anterior #/m1/despejes
    const partes = location.hash.replace(/^#\/?/, '').split(/[-/]/).filter(Boolean);
    const mod = MA.MODULOS.some(m => m.id === partes[0]) ? partes[0] : 'inicio';
    return { mod, sec: partes[1] || null, extra: partes[2] || null };
  }
  function enrutar() {
    const ruta = leerRuta();
    const cont = $('#contenido');
    Array.from(cont.children).forEach(ch => { ch.hidden = true; });
    let titulo = 'Panel general';
    if (ruta.mod === 'inicio') {
      if (!vistas.inicio) { vistas.inicio = vistaInicio(); cont.appendChild(vistas.inicio); }
      vistas.inicio.hidden = false;
      pintarInicio();
    } else {
      const m = MA.MODULOS.find(x => x.id === ruta.mod);
      const vm = m.disponible && MA.vistasModulo[m.id];
      if (vm) {
        if (!vistas[m.id]) { vm.montar(cont); vistas[m.id] = vm.raiz; }
        vistas[m.id].hidden = false;
        ruta.sec = vm.mostrar(ruta.sec, ruta.extra);
        const s = vm.secciones.find(x => x.id === ruta.sec);
        titulo = `Módulo ${Number(m.num)} · ${s ? s.nombre : m.titulo}`;
      } else {
        if (!vistas[m.id]) { vistas[m.id] = vistaPendiente(m); cont.appendChild(vistas[m.id]); }
        vistas[m.id].hidden = false;
        titulo = `Módulo ${Number(m.num)} · ${m.titulo}`;
      }
    }
    document.title = `${titulo} · Misión admisión`;
    pintarLateral(ruta);
    cerrarCajones(true);
    window.scrollTo({ top: 0 });
  }

  /* ---------- Arranque ---------- */
  function iniciar() {
    $('#btn-menu').innerHTML = icono('menu');
    $('.marca-logo').innerHTML = icono('avion');
    $('#btn-asistente .ico').innerHTML = icono('chat');
    $('#btn-pizarra').innerHTML = icono('pizarra');
    $('#btn-pizarra').addEventListener('click', () => MA.Pizarra.abrir());
    pintarTema();
    $('#btn-tema').addEventListener('click', alternarTema);
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', pintarTema);
    }
    $('#btn-menu').addEventListener('click', () => abrirCajon('lateral'));
    $('#btn-asistente').addEventListener('click', () => {
      if ($('#asistente').classList.contains('abierto')) cerrarCajones();
      else abrirCajon('asistente');
    });
    $('#velo').addEventListener('click', () => cerrarCajones());
    document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarCajones(); });
    document.addEventListener('click', e => {
      if (e.target.closest('[data-cerrar]') && e.target.closest('#lateral')) cerrarCajones();
      if (e.target.closest('[data-abrir-asistente]')) MA.Asistente.abrir({});
      const pedir = e.target.closest('[data-reiniciar]');
      if (pedir) pedirConfirmacion(pedir);
      if (e.target.closest('[data-cancelar-reinicio]')) pintarLateral(leerRuta());
      if (e.target.closest('[data-confirmar-reinicio]')) {
        MA.progreso.reiniciar();
        MA.aviso('Progreso borrado.', 'reiniciar');
      }
    });
    MA.Asistente.montar();
    MA.bus.on('progreso', () => { pintarLateral(leerRuta()); pintarInicio(); });
    window.addEventListener('hashchange', enrutar);
    enrutar();
  }

  MA.plataforma = { abrirCajon, cerrarCajones };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
