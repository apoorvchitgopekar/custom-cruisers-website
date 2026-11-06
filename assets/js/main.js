/* Custom Cruisers East Africa — site behaviour
   Vanilla JS: overlay menu, sticky header state, stat counters,
   scroll reveals, form validation. */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header state ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Overlay menu ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var overlay = document.getElementById("menu-overlay");

  function setMenu(open) {
    overlay.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  menuBtn.addEventListener("click", function () {
    setMenu(!overlay.classList.contains("is-open"));
  });

  overlay.addEventListener("click", function (e) {
    if (e.target.closest("a") || e.target === overlay) setMenu(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) {
      setMenu(false);
      menuBtn.focus();
    }
  });

  /* ---------- Scroll reveals ---------- */
  var revealTargets = document.querySelectorAll(
    ".bp-hero .container > *, .service-row, .related-row, .location-card, .model-col, .section-tag, .bp-grid-section h2, .bp-dark h2, .request-form"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function () { el.classList.add("is-visible"); }, (i % 4) * 60);
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Animated stat counters ---------- */
  var stats = document.querySelectorAll(".proof-value[data-count]");

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (prefersReducedMotion) { el.textContent = target + suffix; return; }
    var duration = 900;
    var start = null;
    var finished = false;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + (progress === 1 ? suffix : "");
      if (progress < 1) requestAnimationFrame(step);
      else finished = true;
    }
    requestAnimationFrame(step);
    /* rAF is suspended in hidden tabs — guarantee the final value */
    setTimeout(function () {
      if (!finished) el.textContent = target + suffix;
    }, duration + 300);
  }

  if ("IntersectionObserver" in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    stats.forEach(function (el) { statObserver.observe(el); });
  } else {
    stats.forEach(animateCount);
  }

  /* ---------- Request form validation ---------- */
  var form = document.getElementById("quote-form");
  var status = document.getElementById("form-status");

  function setError(field, message) {
    var wrap = field.closest(".form-field");
    wrap.classList.toggle("has-error", Boolean(message));
    wrap.querySelector(".field-error").textContent = message || "";
    if (message) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
  }

  function validateField(field) {
    var value = field.value.trim();
    if (!value) { setError(field, "This field is required."); return false; }
    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError(field, "Enter a valid email address.");
      return false;
    }
    setError(field, "");
    return true;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var fields = form.querySelectorAll("input, select, textarea");
    var allValid = true;
    var firstInvalid = null;

    fields.forEach(function (field) {
      var ok = validateField(field);
      if (!ok) {
        allValid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (!allValid) {
      status.textContent = "";
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    /* DEMO ONLY — replace with a real submission, e.g. Formspree:
       fetch("https://formspree.io/f/YOUR_FORM_ID", {
         method: "POST",
         body: new FormData(form),
         headers: { Accept: "application/json" }
       }).then(...) — see README.md */
    status.textContent =
      "REQUEST LOGGED — the workshop team will confirm your appointment. (Demo form: connect a backend to receive submissions.)";
    form.reset();
  });

  form.addEventListener(
    "blur",
    function (e) {
      if (e.target.matches("input, select, textarea")) validateField(e.target);
    },
    true
  );

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
