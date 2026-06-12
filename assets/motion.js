/* ============================================================
   Biomy motion behaviours. Pairs with assets/styles/motion.css.

   Budget (nothing more):
     1. Scroll reveals  — one IntersectionObserver, fade + 8px rise, once.
     2. Eyebrow cycle   — condition word crossfade every 3.5s.
     3. Flora chat      — messages in sequence, typing dots before Flora.
   (The hero leaf breathe is CSS-only; card hover lift is CSS-only.)

   Honours prefers-reduced-motion by skipping all of it and showing
   final state immediately.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("motion-ready");

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    /* ── 1. Scroll reveals ── */
    var revealEls = document.querySelectorAll(".reveal, .fade-up");
    if (reduce || !hasIO) {
      revealEls.forEach(function (el) { el.classList.add("is-visible", "visible"); });
    } else if (revealEls.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible", "visible");
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function (el) { io.observe(el); });
    }

    /* ── 2. Eyebrow condition crossfade ── */
    var conds = document.querySelectorAll(".cond");
    if (conds.length > 1) {
      conds.forEach(function (c, i) { c.style.opacity = i === 0 ? "1" : "0"; });
      if (!reduce) {
        var ci = 0;
        setInterval(function () {
          conds[ci].style.opacity = "0";
          ci = (ci + 1) % conds.length;
          conds[ci].style.opacity = "1";
        }, 3500);
      }
    }

    /* ── 3. Flora chat typing sequence ── */
    var chat = document.querySelector("[data-flora-chat]");
    if (!chat) return;
    var stream = chat.querySelector(".chat-stream");
    var msgs = stream ? [].slice.call(stream.querySelectorAll(".msg")) : [];
    if (!stream || !msgs.length) return;

    if (reduce || !hasIO) {
      msgs.forEach(function (m) { m.classList.add("is-shown"); });
      return;
    }

    var played = false;
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !played) {
          played = true;
          cObs.disconnect();
          playFlora(msgs, stream);
        }
      });
    }, { threshold: 0.4 });
    cObs.observe(chat);
  });

  function playFlora(msgs, stream) {
    var i = 0;
    function step() {
      if (i >= msgs.length) return;
      var msg = msgs[i];
      var isFlora = msg.classList.contains("msg-flora");

      if (isFlora) {
        var typing = document.createElement("div");
        typing.className = "typing";
        typing.setAttribute("aria-hidden", "true");
        typing.innerHTML = "<span></span><span></span><span></span>";
        stream.insertBefore(typing, msg);
        window.setTimeout(function () {
          if (typing.parentNode) stream.removeChild(typing);
          msg.classList.add("is-shown");
          i++;
          window.setTimeout(step, 350);
        }, 700);
      } else {
        window.setTimeout(function () {
          msg.classList.add("is-shown");
          i++;
          window.setTimeout(step, 350);
        }, 450);
      }
    }
    step();
  }
})();
