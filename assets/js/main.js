/* Custom Cruisers East Africa — site behaviour
   Vanilla JS: mobile nav, sticky header state, stat counters,
   scroll reveals, active-link highlighting, form validation. */

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

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });

  /* ---------- Scroll reveals ---------- */
  var revealTargets = document.querySelectorAll(
    ".service-card, .testimonial-card, .location-card, .section-head, .workshop-copy, .workshop-media, .contact-copy, .quote-form"
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
    }, { threshold: 0.15 });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Animated stat counters ---------- */
  var stats = document.querySelectorAll(".stat-value[data-count]");

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (prefersReducedMotion) { el.textContent = target; return; }
    var duration = 900;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
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

  /* ---------- Active nav link while scrolling ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".site-nav a");

  if ("IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------- Quote form validation ---------- */
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
      if (!validateField(field) && !firstInvalid) {
        firstInvalid = field;
        allValid = false;
      } else if (field.closest(".form-field").classList.contains("has-error")) {
        allValid = false;
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
      "Thank you — your request has been noted. (Demo form: connect a form backend to receive submissions.)";
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
