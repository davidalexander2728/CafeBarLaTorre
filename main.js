/* ============================================================
   LA TORRE – main.js · v=20260528
   IIFE · No ES modules · Dark Edition + Animations
   ============================================================ */
(function () {
  "use strict";

  /* ─── SAFE WRAPPER ──────────────────────────────────────── */
  function safe(fn, name) {
    try { fn(); }
    catch (e) { console.warn("[LaTorre:" + name + "]", e); }
  }

  /* ─── MOMENT DATA ───────────────────────────────────────── */
  var MOMENTS = {
    desayuno: { sub:"El desayuno que merecías",       desc:"Empieza el día con el mejor café y los sabores de siempre." },
    comida:   { sub:"Cocina casera de Málaga",        desc:"Menú del día, tapas y platos del Mediterráneo a tu ritmo." },
    merienda: { sub:"Un momento para ti",             desc:"Café, pasteles y calma en plena tarde alhaurina." },
    cena:     { sub:"Noches en La Torre",             desc:"Raciones, carnes y pescados para compartir con quien más quieres." }
  };

  function detectMoment() {
    var h = new Date().getHours();
    if (h >= 6  && h < 12) return "desayuno";
    if (h >= 12 && h < 17) return "comida";
    if (h >= 17 && h < 20) return "merienda";
    return "cena";
  }

  function initMoment() {
    var moment = detectMoment();
    document.documentElement.setAttribute("data-moment", moment);
    var data = MOMENTS[moment];
    if (!data) return;
    var subEl  = document.querySelector("[data-hero-sub]");
    var descEl = document.querySelector("[data-hero-desc]");
    if (subEl)  subEl.textContent  = data.sub;
    if (descEl) descEl.textContent = data.desc;
  }

  /* ─── OPEN / CLOSED STATUS ──────────────────────────────── */
  function isOpenNow() {
    var now  = new Date();
    var day  = now.getDay();
    var h    = now.getHours();
    var m    = now.getMinutes();
    var time = h + m / 60;
    if (day === 6) return time >= 8 && time < 24;
    if (day === 0) return time >= 8 && time < 23;
    return time >= 7 && time < 23;
  }

  function initStatus() {
    var open  = isOpenNow();
    var dots  = document.querySelectorAll("[data-status]");
    var texts = document.querySelectorAll("[data-status-text]");
    dots.forEach(function (d) { if (!open) d.classList.add("closed"); });
    texts.forEach(function (t) {
      t.textContent = open ? "Abierto ahora" : "Cerrado";
      if (!open) t.style.color = "#f87171";
    });
    document.querySelectorAll(".hours-status").forEach(function (el) {
      el.style.color = open ? "#4ade80" : "#f87171";
    });
  }

  /* ─── CUSTOM CURSOR ─────────────────────────────────────── */
  function initCursor() {
    var dot  = document.querySelector(".cursor-dot");
    var ring = document.querySelector(".cursor-ring");
    if (!dot || !ring) return;
    /* Only on pointer devices */
    if (!window.matchMedia("(hover:hover)").matches) return;

    var mx = 0, my = 0, rx = 0, ry = 0;
    var raf;

    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px)";
      dot.classList.add("is-ready");
      ring.classList.add("is-ready");
    });

    function animRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      raf = requestAnimationFrame(animRing);
    }
    raf = requestAnimationFrame(animRing);

    /* Hover state on interactive elements */
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest("a,button,[role=button],.menu-card,.slot-pill")) {
        ring.classList.add("is-hover");
      }
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest("a,button,[role=button],.menu-card,.slot-pill")) {
        ring.classList.remove("is-hover");
      }
    });

    document.addEventListener("mouseleave", function () {
      dot.classList.remove("is-ready");
      ring.classList.remove("is-ready");
    });
  }

  /* ─── SPLASH ────────────────────────────────────────────── */
  function initSplash() {
    var splash = document.querySelector("[data-splash]");
    if (!splash) return;
    function hide() { splash.classList.add("is-out"); }
    if (document.readyState === "complete") {
      setTimeout(hide, 750);
    } else {
      window.addEventListener("load", function () { setTimeout(hide, 500); });
    }
    setTimeout(hide, 3800);
  }

  /* ─── STICKY NAV ────────────────────────────────────────── */
  function initNav() {
    var nav = document.getElementById("site-nav");
    if (!nav) return;
    var was = false;
    window.addEventListener("scroll", function () {
      var is = window.scrollY > 60;
      if (is !== was) { was = is; nav.classList.toggle("scrolled", is); }
    }, { passive:true });
  }

  /* ─── SMOOTH SCROLL ─────────────────────────────────────── */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth"
      });
    });
  }

  /* ─── SCROLL REVEALS ────────────────────────────────────── */
  function initReveals() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length || typeof IntersectionObserver === "undefined") {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold:0.01, rootMargin:"0px 0px -4% 0px" });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight + 40)
          el.classList.add("is-visible");
      });
    }, 6000);
  }

  /* ─── MOBILE NAV ACTIVE ─────────────────────────────────── */
  function initMobileNavActive() {
    var ids   = ["desayuno","comida","merienda","cena"];
    var links = document.querySelectorAll(".mnav-item[data-section-link]");
    if (!links.length || typeof IntersectionObserver === "undefined") return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var id = e.target.id;
          links.forEach(function (l) {
            l.classList.toggle("active", l.getAttribute("data-section-link") === id);
          });
        }
      });
    }, { threshold:0.35 });
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* ─── COUNT-UP ──────────────────────────────────────────── */
  function initCountUp() {
    var els = document.querySelectorAll("[data-count-to]");
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var target  = parseFloat(e.target.getAttribute("data-count-to"));
        var isFloat = !Number.isInteger(target);
        var start   = null;
        function step(ts) {
          if (!start) start = ts;
          var prog = Math.min((ts - start) / 1200, 1);
          var ease = 1 - Math.pow(1 - prog, 2);
          var val  = target * ease;
          e.target.textContent = isFloat
            ? val.toFixed(1).replace(".", ",")
            : Math.round(val).toLocaleString("es-ES");
          if (prog < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold:0.6 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ─── CARD MOUSE GLOW ───────────────────────────────────── */
  function initCardGlow() {
    if (!window.matchMedia("(hover:hover)").matches) return;
    document.querySelectorAll(".menu-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r  = card.getBoundingClientRect();
        var x  = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + "%";
        var y  = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + "%";
        card.style.setProperty("--mx", x);
        card.style.setProperty("--my", y);
      });
    });
  }

  /* ─── CAROUSEL DRAG ─────────────────────────────────────── */
  function initCarouselDrag() {
    document.querySelectorAll(".menu-carousel-wrap,.reviews-scroll").forEach(function (wrap) {
      var isDown = false, startX, scrollLeft;
      wrap.addEventListener("mousedown", function (e) {
        isDown = true; startX = e.pageX - wrap.offsetLeft; scrollLeft = wrap.scrollLeft;
        wrap.classList.add("is-dragging");
      });
      wrap.addEventListener("mouseleave", function () { isDown = false; wrap.classList.remove("is-dragging"); });
      wrap.addEventListener("mouseup",    function () { isDown = false; wrap.classList.remove("is-dragging"); });
      wrap.addEventListener("mousemove",  function (e) {
        if (!isDown) return;
        e.preventDefault();
        wrap.scrollLeft = scrollLeft - (e.pageX - wrap.offsetLeft - startX) * 1.2;
      });
    });
  }

  /* ─── FLOATING ELEMENTS IN HERO ─────────────────────────── */
  function initFloating() {
    var wrap = document.querySelector(".hero-floats");
    if (!wrap) return;
    var items = [
      { e:"☕", x:12,  y:22 },
      { e:"🥘", x:78,  y:15 },
      { e:"🍷", x:88,  y:65 },
      { e:"🥐", x:22,  y:72 },
      { e:"🍖", x:60,  y:10 },
      { e:"🫒", x:45,  y:80 },
      { e:"🍺", x:8,   y:55 }
    ];
    var durs  = [7,9,11,8,10,7.5,12];
    var dlys  = [0,1.5,3,2,4.5,0.8,2.8];
    items.forEach(function (item, i) {
      var el = document.createElement("span");
      el.className  = "hfloat";
      el.textContent = item.e;
      el.style.cssText = [
        "left:"  + item.x + "%",
        "top:"   + item.y + "%",
        "--dur:" + durs[i % durs.length] + "s",
        "--dly:" + dlys[i % dlys.length] + "s"
      ].join(";");
      wrap.appendChild(el);
    });
  }

  /* ─── RESERVATIONS (only Almuerzo + Cena) ───────────────── */
  function initReservations() {
    var form          = document.getElementById("reservaFormEl");
    var slotsWrap     = document.getElementById("timeSlots");
    var horaInput     = document.getElementById("rHora");
    var fechaInput    = document.getElementById("rFecha");
    var counterValEl  = document.getElementById("counterVal");
    var counterMinus  = document.getElementById("counterMinus");
    var counterPlus   = document.getElementById("counterPlus");
    var personasInput = document.getElementById("rPersonas");
    var errorEl       = document.getElementById("rformError");
    var formWrap      = document.getElementById("reservasFormWrap");
    var successEl     = document.getElementById("reservasSuccess");
    var backBtn       = document.getElementById("reservasBack");

    if (!form) return;

    /* Default date = today */
    var todayDate = new Date();
    var yy  = todayDate.getFullYear();
    var mm  = String(todayDate.getMonth() + 1).padStart(2, "0");
    var dd  = String(todayDate.getDate()).padStart(2, "0");
    var todayStr = yy + "-" + mm + "-" + dd;
    if (fechaInput) { fechaInput.min = todayStr; fechaInput.value = todayStr; }

    /* Time slots by turno */
    var TURNO_SLOTS = {
      comida: ["12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30"],
      cena:   ["20:00","20:30","21:00","21:30","22:00","22:30"]
    };
    var activeTurno = "comida";

    /* Tab switching */
    var tabComida = document.getElementById("tabComida");
    var tabCena   = document.getElementById("tabCena");
    function setTurno(turno) {
      activeTurno = turno;
      if (tabComida) { tabComida.classList.toggle("active", turno === "comida"); tabComida.setAttribute("aria-selected", turno === "comida"); }
      if (tabCena)   { tabCena.classList.toggle("active",   turno === "cena");   tabCena.setAttribute("aria-selected",   turno === "cena"); }
      if (horaInput) horaInput.value = "";
      renderSlots();
    }
    if (tabComida) tabComida.addEventListener("click", function () { setTurno("comida"); });
    if (tabCena)   tabCena.addEventListener("click",   function () { setTurno("cena"); });

    function renderSlots() {
      if (!slotsWrap) return;
      slotsWrap.innerHTML = "";
      var slots = TURNO_SLOTS[activeTurno] || [];
      slots.forEach(function (time) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "slot-pill";
        btn.textContent = time;
        btn.addEventListener("click", function () {
          slotsWrap.querySelectorAll(".slot-pill").forEach(function (p) {
            p.classList.remove("active");
            p.setAttribute("aria-pressed", "false");
          });
          btn.classList.add("active");
          btn.setAttribute("aria-pressed", "true");
          if (horaInput) horaInput.value = time;
        });
        slotsWrap.appendChild(btn);
      });
    }
    renderSlots();

    /* Persons counter */
    var personas = 2;
    var MIN_P = 1, MAX_P = 20;
    function updateCounter() {
      if (counterValEl)  counterValEl.textContent = personas;
      if (personasInput) personasInput.value      = personas;
      if (counterMinus)  counterMinus.disabled    = (personas <= MIN_P);
      if (counterPlus)   counterPlus.disabled     = (personas >= MAX_P);
    }
    updateCounter();
    if (counterMinus) counterMinus.addEventListener("click", function () {
      if (personas > MIN_P) { personas--; updateCounter(); }
    });
    if (counterPlus)  counterPlus.addEventListener("click", function () {
      if (personas < MAX_P) { personas++; updateCounter(); }
    });

    /* Form submit → WhatsApp */
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (errorEl) errorEl.textContent = "";

      var nombreEl = document.getElementById("rNombre");
      var nombre   = nombreEl ? nombreEl.value.trim() : "";
      var fecha    = fechaInput ? fechaInput.value : "";
      var hora     = horaInput  ? horaInput.value  : "";

      if (!nombre) {
        if (errorEl) errorEl.textContent = "Por favor, indica tu nombre.";
        if (nombreEl) nombreEl.focus(); return;
      }
      if (!fecha) {
        if (errorEl) errorEl.textContent = "Selecciona una fecha.";
        if (fechaInput) fechaInput.focus(); return;
      }
      if (!hora) {
        if (errorEl) errorEl.textContent = "Elige un horario para tu visita.";
        return;
      }

      var parts    = fecha.split("-");
      var fechaStr = parts[2] + "/" + parts[1] + "/" + parts[0];
      var notasEl  = document.getElementById("rNotas");
      var notasTxt = notasEl && notasEl.value.trim()
        ? "\n📝 Notas: " + notasEl.value.trim() : "";

      var turnoLabel = activeTurno === "cena" ? "Cena" : "Comida";
      var msg = "Hola, quiero reservar una mesa en La Torre 🍽️"
        + "\n\n🍽️ Turno: "  + turnoLabel
        + "\n👤 Nombre: "  + nombre
        + "\n📅 Fecha: "   + fechaStr
        + "\n🕐 Hora: "    + hora
        + "\n👥 Personas: " + personas
        + notasTxt + "\n\n¡Gracias!";

      window.open(
        "https://wa.me/34951637126?text=" + encodeURIComponent(msg),
        "_blank", "noopener,noreferrer"
      );

      if (formWrap)  formWrap.hidden  = true;
      if (successEl) { successEl.removeAttribute("hidden"); successEl.hidden = false; }
    });

    /* Back / reset */
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        if (successEl) successEl.hidden = true;
        if (formWrap)  formWrap.hidden  = false;
        form.reset();
        if (fechaInput) fechaInput.value = todayStr;
        if (horaInput)  horaInput.value  = "";
        if (errorEl)    errorEl.textContent = "";
        personas = 2; updateCounter();
        renderSlots();
        var section = document.getElementById("reservas");
        if (section) window.scrollTo({
          top: section.getBoundingClientRect().top + window.scrollY - 80,
          behavior: "smooth"
        });
      });
    }
  }

  /* ─── GSAP SCROLL ANIMATIONS ────────────────────────────── */
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    /* Section images parallax */
    document.querySelectorAll(".section-hero-img").forEach(function (el) {
      var img = el.querySelector("img");
      if (!img) return;
      gsap.to(img, {
        yPercent:-12, ease:"none",
        scrollTrigger:{ trigger:el, start:"top bottom", end:"bottom top", scrub:true }
      });
    });

    /* Cena background parallax */
    var cenaBg = document.querySelector(".cena-bg-img img");
    if (cenaBg) {
      gsap.to(cenaBg, {
        yPercent:20, ease:"none",
        scrollTrigger:{ trigger:".cena-section", start:"top bottom", end:"bottom top", scrub:true }
      });
    }

    /* Section headers pin + scale */
    document.querySelectorAll(".meal-section .section-header").forEach(function (hd) {
      gsap.from(hd, {
        opacity:0, y:30, duration:.8, ease:"power2.out",
        scrollTrigger:{ trigger:hd, start:"top 88%", toggleActions:"play none none none" }
      });
    });

    /* Staggered meal cards reveal */
    document.querySelectorAll(".meal-section .menu-carousel").forEach(function (c) {
      gsap.from(c.querySelectorAll(".menu-card"), {
        opacity:0, y:28, stagger:.06, duration:.6, ease:"power2.out",
        scrollTrigger:{ trigger:c, start:"top 88%", toggleActions:"play none none none" }
      });
    });
  }

  /* ─── BOOT ──────────────────────────────────────────────── */
  function boot() {
    safe(initMoment,          "initMoment");
    safe(initStatus,          "initStatus");
    safe(initSplash,          "initSplash");
    safe(initCursor,          "initCursor");
    safe(initNav,             "initNav");
    safe(initSmoothScroll,    "initSmoothScroll");
    safe(initFloating,        "initFloating");
    safe(initReveals,         "initReveals");
    safe(initMobileNavActive, "initMobileNavActive");
    safe(initCountUp,         "initCountUp");
    safe(initCardGlow,        "initCardGlow");
    safe(initCarouselDrag,    "initCarouselDrag");
    safe(initReservations,    "initReservations");
    safe(initGSAP,            "initGSAP");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
