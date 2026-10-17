/* Golden Paws holiday 2026 flyer overlay.
   Auto-opens on the homepage and /book (data-page="home" | "book"), once per page per
   browser session; on every other page (data-page="bar") only the bar button opens it, closed only with the X (or Esc, for keyboard users).
   The festive bar's button reopens it. Self-removes after the end date.
   Remove this file, assets/css/holiday.css and assets/holiday/ in early January 2027. */
(function () {
  "use strict";
  var script = document.currentScript;
  var page = (script && script.getAttribute("data-page")) || "home";
  var END = new Date(2027, 0, 1);
  var bar = document.getElementById("gp-holiday-bar");

  if (new Date() >= END) {
    if (bar) bar.remove();
    return;
  }

  var KEY = "gpHoliday2026:" + page;
  var IMG = "/assets/holiday/holiday-schedule-2026";
  var ALT =
    "Golden Paws Pet Grooming holiday grooming schedule. Plan ahead and book early. " +
    "Thanksgiving week: open November 23 to 25, 8:00 AM to 5:00 PM. Closed November 26 (Thanksgiving) and November 27 (Black Friday). Open November 28, 8:00 AM to 5:00 PM. " +
    "Christmas week: open December 20 to 24, 8:00 AM to 5:00 PM. Closed December 25 and 26. " +
    "New Year's week: open December 28 to 31, 8:00 AM to 5:00 PM. " +
    "395 Lowell St, Lexington, MA.";
  var FLAKE =
    '<svg viewBox="0 0 24 24" width="{s}" height="{s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
    '<path d="M12 2v20M3.3 7l17.4 10M20.7 7L3.3 17M9 4l3 2 3-2M9 20l3-2 3 2"/></svg>';

  /* ---- Festive bar motion: rotating dates + falling leaves (autumn side) and snow (Christmas side) ---- */
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var MSGS = [
    { l: "Thanksgiving, Christmas and New Year's. Plan ahead and book early!", s: "Book early for holiday spots" },
    { l: "Thanksgiving week: open 11/23 to 11/25 and 11/28. Closed 11/26 and 11/27.", s: "Thanksgiving: closed 11/26 & 11/27" },
    { l: "Christmas week: open 12/20 to 12/24. Closed 12/25 and 12/26.", s: "Christmas: closed 12/25 & 12/26" },
    { l: "New Year's week: open 12/28 to 12/31. Open days run 8:00 AM to 5:00 PM.", s: "New Year's week: open 12/28 to 12/31" }
  ];
  var LEAF =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5l2.1 4.3 3.2-1.4-.9 4.6 4.3.9-3.2 3.1 1.9 3.1-4.5-.7L12 22.5l-.6-5.1-4.5.7 1.9-3.1L5.6 11l4.3-.9L9 5.5l3.2 1.4z" fill="{c}"/></svg>';
  var LEAF_COLORS = ["#E8751A", "#B51F2E", "#F7C600", "#C2641B"];

  function initBar(el) {
    if (REDUCED) return;
    var fall = el.querySelector(".gp-hb-fall");
    if (fall) {
      for (var n = 0; n < 11; n++) {
        var sp = document.createElement("span");
        var leaf = n < 6;
        var size = leaf ? 11 + Math.round(Math.random() * 6) : 8 + Math.round(Math.random() * 7);
        sp.style.width = sp.style.height = size + "px";
        sp.style.left = (leaf ? 1 + Math.random() * 46 : 50 + Math.random() * 48) + "%";
        sp.style.animationDuration = 4.5 + Math.random() * 4 + "s";
        sp.style.animationDelay = "-" + Math.random() * 8 + "s";
        sp.style.setProperty("--drift", Math.round(Math.random() * 50 - 25) + "px");
        sp.style.setProperty("--rot", Math.round(120 + Math.random() * 240) + "deg");
        sp.innerHTML = leaf
          ? LEAF.replace("{c}", LEAF_COLORS[n % LEAF_COLORS.length])
          : FLAKE.replace(/\{s\}/g, size).replace("currentColor", "#fff");
        fall.appendChild(sp);
      }
    }
    var sub = el.querySelector(".gp-hb-sub");
    if (!sub || MSGS.length < 2) return;
    var lng = sub.querySelector(".gp-hb-sub-long");
    var sht = sub.querySelector(".gp-hb-sub-short");
    var idx = 0, paused = false;
    el.addEventListener("mouseenter", function () { paused = true; });
    el.addEventListener("mouseleave", function () { paused = false; });
    el.addEventListener("focusin", function () { paused = true; });
    el.addEventListener("focusout", function () { paused = false; });
    setInterval(function () {
      if (paused || document.hidden) return;
      sub.classList.add("is-out");
      setTimeout(function () {
        idx = (idx + 1) % MSGS.length;
        lng.textContent = MSGS[idx].l;
        sht.textContent = MSGS[idx].s;
        sub.classList.remove("is-out");
      }, 260);
    }, 4200);
  }
  if (bar) initBar(bar);

  var ACTIONS = {
    home:
      '<a class="gp-btn gp-btn-royal" href="/book" data-track="booking_click" data-track-label="holiday overlay book">Book now</a>' +
      '<a class="gp-btn gp-btn-outline" href="sms:7812749144" data-track="sms_tap" data-track-label="holiday overlay text">Text us</a>',
    book:
      '<a class="gp-btn gp-btn-royal" href="/new-client-intake" data-track="new_client_intake_open" data-track-label="holiday overlay new client" aria-label="New client intake">New client</a>' +
      '<a class="gp-btn gp-btn-gold" href="/existing-client-booking" data-track="booking_click" data-track-label="holiday overlay existing client" aria-label="Existing client booking">Existing client</a>'
  };

  var overlay = null;
  var lastFocus = null;

  function remember() {
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
  }
  function seen() {
    try { return sessionStorage.getItem(KEY) === "1"; } catch (e) { return false; }
  }

  function snow(host) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (var i = 0; i < 16; i++) {
      var s = document.createElement("span");
      var size = 10 + Math.round(Math.random() * 14);
      s.className = "gp-hol-flake";
      s.innerHTML = FLAKE.replace(/\{s\}/g, size);
      s.style.left = Math.round(Math.random() * 98) + "%";
      s.style.animationDuration = 7 + Math.random() * 7 + "s";
      s.style.animationDelay = "-" + Math.random() * 12 + "s";
      s.style.setProperty("--drift", Math.round(Math.random() * 90 - 45) + "px");
      host.appendChild(s);
    }
  }

  function focusables() {
    return overlay.querySelectorAll("a[href], button");
  }

  function onKey(e) {
    if (!overlay) return;
    if (e.key === "Escape") { close(); return; }
    if (e.key !== "Tab") return;
    var f = focusables();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function open() {
    if (overlay) return;
    lastFocus = document.activeElement;
    overlay = document.createElement("div");
    overlay.className = "gp-hol-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Holiday grooming schedule");
    overlay.innerHTML =
      '<div class="gp-hol-dialog">' +
        '<button type="button" class="gp-hol-close" aria-label="Close holiday schedule">&times;</button>' +
        '<picture>' +
          '<source type="image/webp" srcset="' + IMG + '.webp">' +
          '<img src="' + IMG + '.jpg" width="900" height="1350" alt="' + ALT + '">' +
        '</picture>' +
        '<div class="gp-hol-actions">' + (ACTIONS[page] || ACTIONS.home) + '</div>' +
      '</div>';
    snow(overlay);
    document.body.appendChild(overlay);
    document.body.classList.add("gp-hol-lock");
    overlay.querySelector(".gp-hol-close").addEventListener("click", close);
    overlay.querySelector(".gp-hol-close").focus();
    document.addEventListener("keydown", onKey);
    remember();
  }

  function close() {
    if (!overlay) return;
    overlay.remove();
    overlay = null;
    document.body.classList.remove("gp-hol-lock");
    document.removeEventListener("keydown", onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  var openers = document.querySelectorAll("[data-gp-holiday-open]");
  for (var i = 0; i < openers.length; i++) openers[i].addEventListener("click", open);

  if ((page === "home" || page === "book") && !seen()) setTimeout(open, 700);
})();
