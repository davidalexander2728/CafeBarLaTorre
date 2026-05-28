/* ============================================================
   CAFÉ BAR LA TORRE — main.js — Cloud Edition
   ============================================================ */
(function () {
  'use strict';

  /* ── PARTICLE CANVAS ──────────────────────────────────────── */
  function initParticles() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var W, H, raf;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function Particle() {
      this.reset();
    }
    Particle.prototype.reset = function () {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4 - 0.1;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5
        ? 'rgba(0,212,255,' + this.alpha + ')'
        : 'rgba(124,58,237,' + this.alpha + ')';
    };
    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset();
    };
    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    };

    function init() {
      resize();
      var count = Math.min(80, Math.floor((W * H) / 12000));
      particles = [];
      for (var i = 0; i < count; i++) particles.push(new Particle());
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      /* Draw connecting lines between close particles */
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(37,99,235,' + (0.06 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        particles[i].update();
        particles[i].draw();
      }
      raf = requestAnimationFrame(draw);
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { init(); }, 200);
    });

    init();
    draw();

    /* Pause when tab hidden */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(draw);
      }
    });
  }

  /* ── NAV SCROLL + BURGER ──────────────────────────────────── */
  function initNav() {
    var nav = document.getElementById('nav');
    var burger = document.getElementById('navBurger');
    var menu = document.getElementById('navMenu');

    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }, { passive: true });

    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });

    /* Close on nav link click */
    menu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Abrir menú');
      });
    });

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── MENU TABS ────────────────────────────────────────────── */
  function initMenuTabs() {
    var tabs = document.querySelectorAll('.menu__tab');
    var panels = document.querySelectorAll('.menu__panel');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.dataset.tab;
        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(function (p) {
          p.classList.remove('active');
          p.hidden = true;
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        var panel = document.getElementById('panel-' + target);
        if (panel) {
          panel.classList.add('active');
          panel.hidden = false;
        }
      });
    });
  }

  /* ── RESERVA FORM ─────────────────────────────────────────── */
  function initReservaForm() {
    var form = document.getElementById('reservaForm');
    var success = document.getElementById('reservaSuccess');
    var successNombre = document.getElementById('successNombre');
    var reservaNueva = document.getElementById('reservaNueva');
    var submitBtn = document.getElementById('reservaSubmit');
    var tipoSel = document.getElementById('r-tipo');
    var horaSel = document.getElementById('r-hora');
    var fechaInput = document.getElementById('r-fecha');

    if (!form) return;

    /* Set min date to today */
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    fechaInput.min = yyyy + '-' + mm + '-' + dd;

    /* Populate hours based on type */
    var horasComida = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30'];
    var horasCena   = ['20:00', '20:30', '21:00', '21:30', '22:00', '22:30'];

    function updateHoras() {
      var val = tipoSel.value;
      horaSel.innerHTML = '';
      var placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.disabled = true;
      placeholder.selected = true;
      placeholder.textContent = val ? 'Seleccionar hora' : 'Elige tipo primero';
      horaSel.appendChild(placeholder);
      var horas = val === 'comida' ? horasComida : val === 'cena' ? horasCena : [];
      horas.forEach(function (h) {
        var opt = document.createElement('option');
        opt.value = h;
        opt.textContent = h;
        horaSel.appendChild(opt);
      });
    }

    tipoSel.addEventListener('change', updateHoras);

    function validate() {
      var ok = true;
      var fields = [
        { id: 'r-nombre', errId: 'err-nombre', msg: 'Por favor, introduce tu nombre' },
        { id: 'r-tel',    errId: 'err-tel',    msg: 'Introduce un teléfono válido' },
        { id: 'r-personas', errId: 'err-personas', msg: 'Selecciona el número de personas' },
        { id: 'r-tipo',   errId: 'err-tipo',   msg: 'Selecciona el tipo de reserva' },
        { id: 'r-fecha',  errId: 'err-fecha',  msg: 'Selecciona una fecha' },
        { id: 'r-hora',   errId: 'err-hora',   msg: 'Selecciona una hora' }
      ];

      fields.forEach(function (f) {
        var input = document.getElementById(f.id);
        var err   = document.getElementById(f.errId);
        var val   = input ? input.value.trim() : '';
        if (!val) {
          if (err) err.textContent = f.msg;
          if (input) input.classList.add('error');
          ok = false;
        } else {
          if (err) err.textContent = '';
          if (input) input.classList.remove('error');
        }
      });

      /* Extra: phone format */
      var telInput = document.getElementById('r-tel');
      var telErr   = document.getElementById('err-tel');
      if (telInput && telInput.value && !/^[+\d\s\-]{7,}$/.test(telInput.value.trim())) {
        telErr.textContent = 'Introduce un teléfono válido';
        telInput.classList.add('error');
        ok = false;
      }

      return ok;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      var btnText   = submitBtn.querySelector('.btn__text');
      var btnLoader = submitBtn.querySelector('.btn__loader');
      submitBtn.disabled = true;
      btnText.hidden = true;
      btnLoader.hidden = false;

      /* Simulate async (real implementation: send to backend/email) */
      setTimeout(function () {
        submitBtn.disabled = false;
        btnText.hidden = false;
        btnLoader.hidden = true;

        var nombre = document.getElementById('r-nombre').value.trim();
        successNombre.textContent = nombre;
        form.parentElement.style.display = 'none';
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1200);
    });

    /* Clear errors on input */
    form.querySelectorAll('.form__input').forEach(function (input) {
      input.addEventListener('input', function () {
        input.classList.remove('error');
        var errId = 'err-' + input.id.replace('r-', '');
        var err = document.getElementById(errId);
        if (err) err.textContent = '';
      });
    });

    if (reservaNueva) {
      reservaNueva.addEventListener('click', function () {
        form.reset();
        updateHoras();
        form.parentElement.style.display = '';
        success.hidden = true;
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  /* ── REVEAL ON SCROLL ─────────────────────────────────────── */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ── "VER CARTA" PDF PLACEHOLDER ────────────────────────────── */
  function initCartaButtons() {
    document.querySelectorAll('.btn--carta').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        showToast('📄 La carta en PDF estará disponible próximamente.');
      });
    });
  }

  /* ── TOAST ────────────────────────────────────────────────── */
  function showToast(msg) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '5rem',
      left: '50%',
      transform: 'translateX(-50%) translateY(0)',
      background: 'rgba(10,21,48,0.95)',
      border: '1px solid rgba(37,99,235,0.4)',
      color: '#fff',
      padding: '.75rem 1.4rem',
      borderRadius: '99px',
      fontSize: '.875rem',
      fontWeight: '500',
      backdropFilter: 'blur(12px)',
      zIndex: '9999',
      boxShadow: '0 0 20px rgba(37,99,235,0.3)',
      whiteSpace: 'nowrap',
      transition: 'opacity .4s ease',
      opacity: '1'
    });

    document.body.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      setTimeout(function () { toast.remove(); }, 400);
    }, 2800);
  }

  /* ── FOOTER YEAR ──────────────────────────────────────────── */
  function setYear() {
    var el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
        var top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ── GALERIA LIGHTBOX (simple tap to enlarge) ─────────────── */
  function initGaleria() {
    document.querySelectorAll('.galeria__item').forEach(function (item) {
      item.addEventListener('click', function () {
        var img = item.querySelector('.galeria__img');
        if (!img) return;
        showLightbox(img.src, img.alt);
      });
    });
  }

  function showLightbox(src, alt) {
    var overlay = document.createElement('div');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', alt || 'Imagen ampliada');

    Object.assign(overlay.style, {
      position: 'fixed', inset: '0',
      background: 'rgba(6,11,24,0.95)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: '10000', padding: '1rem',
      cursor: 'zoom-out',
      backdropFilter: 'blur(8px)'
    });

    var imgEl = document.createElement('img');
    imgEl.src = src;
    imgEl.alt = alt || '';
    Object.assign(imgEl.style, {
      maxWidth: '100%', maxHeight: '90vh',
      objectFit: 'contain', borderRadius: '12px',
      boxShadow: '0 0 60px rgba(37,99,235,0.4)'
    });

    overlay.appendChild(imgEl);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    function close() {
      overlay.remove();
      document.body.style.overflow = '';
    }
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); }
    });
  }

  /* ── INIT ─────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initParticles();
    initNav();
    initMenuTabs();
    initReservaForm();
    initReveal();
    initCartaButtons();
    initSmoothScroll();
    initGaleria();
    setYear();
  });
}());
