/* ============================================================
   Biomy shared header + footer — single source of truth.

   Usage on every page:
     <div id="site-header"></div>   ... near the top of <body>
     <div id="site-footer"></div>   ... at the end of <body>
     <script src="/assets/layout.js" defer></script>

   This script injects the markup into those placeholders and adds
   one <style> block (once) so the chrome looks identical everywhere.
   ============================================================ */
(function () {
  "use strict";

  /* Primary nav, in one place. `match` is used to highlight the
     current page via aria-current. */
  var NAV = [
    { href: "/about/",   label: "About",   match: "/about" },
    { href: "/recipes/", label: "Recipes", match: "/recipes" },
    { href: "/fodmap/",  label: "FODMAP",  match: "/fodmap" },
    { href: "/flora/",   label: "Flora",   match: "/flora" },
    { href: "/privacy/", label: "Privacy", match: "/privacy" }
  ];

  /* Inline logo: the real Biomy gradient leaf (assets/img/biomy-leaf.svg),
     inlined so there's no extra network request. A unique gradient id per
     instance (sfx) keeps the header and footer copies valid. Sized ~30px
     tall to match the previous header mark. */
  function logoSvg(sfx) {
    return '<svg class="bm-logo-mark" width="25" height="30" viewBox="0 0 264 316" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="bmLeaf' + sfx + '" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0.02" stop-color="#E8B07F"/><stop offset="0.28" stop-color="#D9998F"/>' +
        '<stop offset="0.50" stop-color="#90A7C6"/><stop offset="0.72" stop-color="#6EAAC2"/>' +
        '<stop offset="0.98" stop-color="#61B4AC"/></linearGradient></defs>' +
      '<path d="M132 6 C 244 88, 248 212, 132 310 C 16 212, 20 88, 132 6 Z" fill="url(#bmLeaf' + sfx + ')"/>' +
      '<line x1="132" y1="10" x2="132" y2="306" stroke="#173630" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M62 138 L132 94 L202 138" fill="none" stroke="#173630" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M64 196 Q132 162 200 196" fill="none" stroke="#173630" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M88 254 Q132 230 176 254" fill="none" stroke="#173630" stroke-width="8" stroke-linecap="round"/>' +
    '</svg>';
  }

  function isCurrent(match) {
    var path = window.location.pathname;
    if (match === "/") return path === "/" || path === "/index.html";
    return path.indexOf(match) === 0;
  }

  function navLinks(extraClass) {
    return NAV.map(function (item) {
      var cur = isCurrent(item.match) ? ' aria-current="page"' : "";
      return '<a class="' + extraClass + '" href="' + item.href + '"' + cur + ">" + item.label + "</a>";
    }).join("");
  }

  var HEADER_HTML =
    '<header class="bm-header">' +
      '<div class="bm-header-inner">' +
        '<a class="bm-brand" href="/" aria-label="Biomy home">' + logoSvg('h') +
          '<span class="bm-wordmark">biomy</span>' +
        '</a>' +
        '<nav class="bm-nav" aria-label="Primary">' + navLinks("bm-nav-link") + '</nav>' +
        '<a class="bm-cta" href="/#waitlist">Join the waitlist</a>' +
        '<button class="bm-burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="bm-mobile-nav">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</div>' +
      '<nav id="bm-mobile-nav" class="bm-mobile-nav" aria-label="Mobile" hidden>' +
        navLinks("bm-mobile-link") +
        '<a class="bm-cta bm-cta-mobile" href="/#waitlist">Join the waitlist</a>' +
      '</nav>' +
    '</header>';

  var FOOTER_HTML =
    '<footer class="bm-footer">' +
      '<a class="bm-foot-brand" href="/" aria-label="Biomy home">' + logoSvg('f') +
        '<span class="bm-wordmark">biomy</span>' +
      '</a>' +
      '<nav class="bm-foot-links" aria-label="Footer">' +
        '<a href="mailto:hello@biomy.health">hello@biomy.health</a>' +
        '<a href="/about/">About</a>' +
        '<a href="/recipes/">Recipes</a>' +
        '<a href="/fodmap/">FODMAP</a>' +
        '<a href="/privacy/">Privacy</a>' +
        '<a href="https://instagram.com/biomy.health" target="_blank" rel="noopener">Instagram</a>' +
        '<a href="https://tiktok.com/@biomy.health" target="_blank" rel="noopener">TikTok</a>' +
      '</nav>' +
      '<p class="bm-foot-disclaimer">Biomy is a wellness platform. It does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional regarding any medical condition.</p>' +
      '<p class="bm-foot-copy">&copy; 2026 Biomy.</p>' +
    '</footer>';

  var STYLES =
    ".bm-header{position:sticky;top:0;z-index:200;background:var(--forest);border-bottom:1px solid rgba(176,240,216,0.14)}" +
    ".bm-header-inner{max-width:1180px;margin:0 auto;display:flex;align-items:center;gap:24px;padding:0 var(--space-gutter);height:66px}" +
    ".bm-brand{display:inline-flex;align-items:center;gap:10px;text-decoration:none;margin-right:auto}" +
    ".bm-wordmark{font-family:var(--font-display);font-weight:700;font-size:1.3rem;letter-spacing:-0.02em;color:var(--mint)}" +
    ".bm-logo-mark{display:block;flex:none}" +
    ".bm-nav{display:flex;align-items:center;gap:30px}" +
    ".bm-nav-link{font-family:var(--font-body);font-weight:400;font-size:0.95rem;color:var(--cloud-soft);text-decoration:none;transition:color .15s ease}" +
    ".bm-nav-link:hover{color:var(--mint)}" +
    ".bm-nav-link[aria-current=page]{color:var(--mint)}" +
    ".bm-cta{font-family:var(--font-body);font-weight:500;font-size:0.95rem;color:var(--forest-deep);background:var(--mint);border-radius:var(--radius-pill);padding:10px 22px;text-decoration:none;white-space:nowrap;transition:transform .15s ease,filter .15s ease}" +
    ".bm-cta:hover{transform:translateY(-1px);filter:brightness(1.05)}" +
    ".bm-burger{display:none;flex-direction:column;justify-content:center;gap:5px;width:42px;height:42px;padding:0;background:transparent;border:1px solid rgba(176,240,216,0.25);border-radius:10px;cursor:pointer}" +
    ".bm-burger span{display:block;width:18px;height:2px;margin:0 auto;background:var(--mint);border-radius:2px;transition:transform .2s ease,opacity .2s ease}" +
    ".bm-burger[aria-expanded=true] span:nth-child(1){transform:translateY(7px) rotate(45deg)}" +
    ".bm-burger[aria-expanded=true] span:nth-child(2){opacity:0}" +
    ".bm-burger[aria-expanded=true] span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}" +
    ".bm-mobile-nav{display:none;flex-direction:column;gap:4px;padding:8px var(--space-gutter) 20px;background:var(--forest);border-bottom:1px solid rgba(176,240,216,0.14)}" +
    ".bm-mobile-nav:not([hidden]){display:flex}" +
    ".bm-mobile-link{font-family:var(--font-body);font-size:1.05rem;color:var(--cloud-soft);text-decoration:none;padding:12px 4px;border-bottom:1px solid rgba(176,240,216,0.08)}" +
    ".bm-mobile-link[aria-current=page]{color:var(--mint)}" +
    ".bm-cta-mobile{display:inline-block;margin-top:14px;text-align:center}" +
    ".bm-footer{background:var(--forest-deep);color:var(--cloud-soft);text-align:center;padding:54px var(--space-gutter)}" +
    ".bm-foot-brand{display:inline-flex;align-items:center;gap:10px;text-decoration:none;margin-bottom:18px}" +
    ".bm-foot-links{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 22px;margin-bottom:22px}" +
    ".bm-foot-links a{font-family:var(--font-body);font-size:0.9rem;color:var(--cloud-soft);text-decoration:none;transition:color .15s ease}" +
    ".bm-foot-links a:hover{color:var(--mint)}" +
    ".bm-foot-disclaimer{font-family:var(--font-body);font-size:0.8rem;color:rgba(242,247,243,0.4);max-width:540px;margin:0 auto 14px;line-height:1.7}" +
    ".bm-foot-copy{font-family:var(--font-body);font-size:0.8rem;color:rgba(242,247,243,0.3)}" +
    ".bm-header a:focus-visible,.bm-footer a:focus-visible,.bm-burger:focus-visible{outline:2px solid var(--mint);outline-offset:3px;border-radius:4px}" +
    "@media(max-width:820px){.bm-nav,.bm-header .bm-cta{display:none}.bm-burger{display:flex}}";

  function injectStyles() {
    if (document.getElementById("bm-layout-styles")) return;
    var s = document.createElement("style");
    s.id = "bm-layout-styles";
    s.textContent = STYLES;
    document.head.appendChild(s);
  }

  /* Favicons — centralised here so every page stays consistent. */
  function injectFavicons() {
    if (document.querySelector('link[rel="icon"]')) return;
    var links = [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", sizes: "any", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" }
    ];
    links.forEach(function (attrs) {
      var l = document.createElement("link");
      Object.keys(attrs).forEach(function (k) { l.setAttribute(k, attrs[k]); });
      document.head.appendChild(l);
    });
  }

  function mount() {
    injectStyles();
    injectFavicons();

    var headerSlot = document.getElementById("site-header");
    if (headerSlot) headerSlot.outerHTML = HEADER_HTML;

    var footerSlot = document.getElementById("site-footer");
    if (footerSlot) footerSlot.outerHTML = FOOTER_HTML;

    /* Hamburger toggle — a real button driving aria-expanded. */
    var burger = document.querySelector(".bm-burger");
    var mobileNav = document.getElementById("bm-mobile-nav");
    if (burger && mobileNav) {
      burger.addEventListener("click", function () {
        var open = burger.getAttribute("aria-expanded") === "true";
        burger.setAttribute("aria-expanded", String(!open));
        if (open) {
          mobileNav.setAttribute("hidden", "");
        } else {
          mobileNav.removeAttribute("hidden");
        }
      });
      /* Close the menu after following an in-page link. */
      mobileNav.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          burger.setAttribute("aria-expanded", "false");
          mobileNav.setAttribute("hidden", "");
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
