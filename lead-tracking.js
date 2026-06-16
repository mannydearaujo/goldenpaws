(() => {
  const MEASUREMENT_ID = "G-29DBKD0B56";

  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID);
  }

  window.gpTrackLead = function gpTrackLead(eventName, label, extra = {}) {
    if (!window.gtag) return;
    window.gtag("event", eventName, {
      event_category: "lead",
      event_label: label || eventName,
      ...extra,
    });
  };

  document.addEventListener("click", event => {
    const el = event.target.closest("a,button");
    if (!el) return;
    const href = el.getAttribute("href") || "";
    const label =
      el.getAttribute("data-track-label") ||
      el.textContent.replace(/\s+/g, " ").trim() ||
      href;
    const explicit = el.getAttribute("data-track");
    if (explicit) {
      window.gpTrackLead(explicit, label);
      return;
    }
    if (href.startsWith("tel:")) {
      window.gpTrackLead("phone_tap", label);
      return;
    }
    if (href.startsWith("sms:")) {
      window.gpTrackLead("sms_tap", label);
      return;
    }
    if (href.startsWith("mailto:")) {
      window.gpTrackLead("email_click", label);
      return;
    }
    if (href.includes("/book") || href.includes("booking.moego.pet")) {
      window.gpTrackLead("booking_click", label);
    }
  });
})();
