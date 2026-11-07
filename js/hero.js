/* ==========================================================================
   COMEPTY — hero.js
   "Systems in Motion"

   An architectural drawing of a computational network. A central hexagonal
   node orchestrates six modular units on an inner ring, wired to twelve nodes
   on an outer ring. Hairline edges fade in and out of existence. A single
   blue highlight travels the outer ring. Scroll position adds rotation and
   reveals dormant connections.

   Everything is derived from geometry: no images, no particles, no noise.
   ========================================================================== */

(function () {
  "use strict";

  var canvas = document.getElementById("ecosystem-canvas");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var INK = "10, 11, 13";
  var BLUE = "43, 78, 255";

  var RING_ONE = 6;
  var RING_TWO = 12;

  var width = 0;
  var height = 0;
  var dpr = 1;
  var R = 1;
  var cx = 0;
  var cy = 0;
  var ticks = 72;

  var running = true;
  var visible = true;
  var last = 0;
  var elapsed = 0;
  var scroll = 0;
  var scrollTarget = 0;

  var phaseOne = [];
  var phaseTwo = [];
  var n;

  for (n = 0; n < RING_ONE; n += 1) phaseOne.push(n * 1.13 + 0.35);
  for (n = 0; n < RING_TWO; n += 1) phaseTwo.push(n * 0.79 + 1.1);

  /* ------------------------------------------------------------------ */
  /* Sizing                                                              */
  /* ------------------------------------------------------------------ */

  function resize() {
    var stage = canvas.parentElement;
    var rect = stage.getBoundingClientRect();

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(rect.width, 220);
    height = Math.max(rect.height, 220);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cx = width / 2;
    cy = height / 2;
    R = (Math.min(width, height) / 2) * 0.94;
    ticks = width < 420 ? 48 : 72;

    draw();
  }

  /* ------------------------------------------------------------------ */
  /* Geometry helpers                                                    */
  /* ------------------------------------------------------------------ */

  function px(radius, angle) {
    return [
      cx + Math.cos(angle) * radius,
      cy + Math.sin(angle) * radius
    ];
  }

  function hexPath(radius, rotation) {
    ctx.beginPath();
    for (var k = 0; k < 6; k += 1) {
      var a = rotation + (k * Math.PI) / 3;
      var x = cx + Math.cos(a) * radius;
      var y = cy + Math.sin(a) * radius;
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  /* ------------------------------------------------------------------ */
  /* Frame                                                               */
  /* ------------------------------------------------------------------ */

  function draw() {
    if (!width || !height) return;

    var t = elapsed;
    var s = scroll;

    var rCore = R * 0.135;
    var rRing1 = R * 0.37;
    var rRing2 = R * 0.70 * (1 + Math.sin(t * 0.4) * 0.012);
    var rTick = R * 0.96;

    var rot1 = t * 0.075 * (1 + s * 0.5) + s * 0.35;
    var rot2 = -t * 0.042 * (1 + s * 0.5) - s * 0.2;

    ctx.clearRect(0, 0, width, height);

    /* --- measurement ticks: two batched strokes, not 72 --- */

    var tickRot = s * 0.5;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(" + INK + ", 0.13)";
    ctx.beginPath();
    for (n = 0; n < ticks; n += 1) {
      var ta = tickRot + (n * Math.PI * 2) / ticks;
      var isLong = n % 6 === 0;
      var inner = rTick - (isLong ? R * 0.035 : R * 0.016);
      var p1 = px(inner, ta);
      var p2 = px(rTick, ta);
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
    }
    ctx.stroke();

    /* --- orbit guides --- */

    ctx.strokeStyle = "rgba(" + INK + ", 0.07)";
    ctx.beginPath();
    ctx.arc(cx, cy, rRing2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(" + INK + ", 0.05)";
    ctx.beginPath();
    ctx.arc(cx, cy, rRing1, 0, Math.PI * 2);
    ctx.stroke();

    /* --- node positions --- */

    var n1 = [];
    var n2 = [];
    var i;

    for (i = 0; i < RING_ONE; i += 1) {
      var a1 = rot1 + (i * Math.PI * 2) / RING_ONE;
      var rr1 = rRing1 + Math.sin(t * 0.5 + phaseOne[i]) * R * 0.01;
      var q1 = px(rr1, a1);
      n1.push({ x: q1[0], y: q1[1] });
    }

    for (i = 0; i < RING_TWO; i += 1) {
      var a2 = rot2 + (i * Math.PI * 2) / RING_TWO;
      var rr2 = rRing2 + Math.sin(t * 0.42 + phaseTwo[i]) * R * 0.014;
      var q2 = px(rr2, a2);
      n2.push({ x: q2[0], y: q2[1] });
    }

    /* --- core to inner ring: always visible, the spine --- */

    ctx.strokeStyle = "rgba(" + BLUE + ", 0.30)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (i = 0; i < RING_ONE; i += 1) {
      ctx.moveTo(cx, cy);
      ctx.lineTo(n1[i].x, n1[i].y);
    }
    ctx.stroke();

    /* --- inner to outer ring: edges that appear and disappear --- */

    var travel = (t * 0.4) % RING_TWO;

    for (i = 0; i < RING_ONE; i += 1) {
      for (var j = 0; j < 2; j += 1) {
        var target = (i * 2 + j) % RING_TWO;

        var alpha;
        if (reduceMotion) {
          alpha = 0.16;
        } else {
          var breathe = Math.sin(t * 0.55 + phaseOne[i] + j * 1.9);
          alpha = breathe > 0 ? 0.05 + breathe * 0.2 : 0;
          alpha = Math.max(alpha, s * 0.09);
        }

        if (alpha <= 0.004) continue;

        var dist = Math.abs(travel - target);
        if (dist > RING_TWO / 2) dist = RING_TWO - dist;
        var near = dist < 2 ? 1 - dist / 2 : 0;

        ctx.strokeStyle = near > 0.02
          ? "rgba(" + BLUE + ", " + Math.min(alpha + near * 0.35, 1).toFixed(3) + ")"
          : "rgba(" + INK + ", " + alpha.toFixed(3) + ")";

        ctx.beginPath();
        ctx.moveTo(n1[i].x, n1[i].y);
        ctx.lineTo(n2[target].x, n2[target].y);
        ctx.stroke();
      }
    }

    /* --- outer ring nodes --- */

    for (i = 0; i < RING_TWO; i += 1) {
      var d = Math.abs(travel - i);
      if (d > RING_TWO / 2) d = RING_TWO - d;
      var glow = d < 1.2 ? 1 - d / 1.2 : 0;

      if (glow > 0.01) {
        ctx.beginPath();
        ctx.arc(n2[i].x, n2[i].y, 3 + glow * 9, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(" + BLUE + ", " + (glow * 0.5).toFixed(3) + ")";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(n2[i].x, n2[i].y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = glow > 0.3
        ? "rgba(" + BLUE + ", " + (0.55 + glow * 0.45).toFixed(3) + ")"
        : "rgba(" + INK + ", 0.62)";
      ctx.fill();
    }

    /* --- inner ring nodes: diamonds, a different class of unit --- */

    ctx.fillStyle = "rgba(" + INK + ", 0.88)";
    ctx.beginPath();
    for (i = 0; i < RING_ONE; i += 1) {
      var hx = n1[i].x;
      var hy = n1[i].y;
      var h = 4.2;
      ctx.moveTo(hx, hy - h);
      ctx.lineTo(hx + h, hy);
      ctx.lineTo(hx, hy + h);
      ctx.lineTo(hx - h, hy);
      ctx.closePath();
    }
    ctx.fill();

    /* --- central node: nested hexagons with a pulse --- */

    ctx.lineWidth = 1;

    ctx.strokeStyle = "rgba(" + INK + ", 0.55)";
    hexPath(rCore, t * 0.1 + s * 0.2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(" + INK + ", 0.22)";
    hexPath(rCore * 0.72, -t * 0.14 + Math.PI / 6);
    ctx.stroke();

    var pulse = reduceMotion ? 0.5 : 0.5 + 0.5 * Math.sin(t * 0.9);
    ctx.beginPath();
    ctx.arc(cx, cy, rCore * (1.28 + pulse * 0.2), 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(" + BLUE + ", " + (0.24 - pulse * 0.16).toFixed(3) + ")";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, rCore * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(" + BLUE + ", 0.95)";
    ctx.fill();
  }

  /* ------------------------------------------------------------------ */
  /* Loop                                                                */
  /* ------------------------------------------------------------------ */

  function frame(now) {
    if (!running) return;

    if (!last) last = now;
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    if (visible) {
      elapsed += dt;
      scroll += (scrollTarget - scroll) * 0.05;
      draw();
    }

    window.requestAnimationFrame(frame);
  }

  function onScroll() {
    var vh = window.innerHeight || 1;
    scrollTarget = Math.min(window.scrollY / vh, 1);
  }

  /* ------------------------------------------------------------------ */
  /* Observers and init                                                  */
  /* ------------------------------------------------------------------ */

  if ("IntersectionObserver" in window) {
    var visibility = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible = entry.isIntersecting;
        });
      },
      { threshold: 0 }
    );
    visibility.observe(canvas.parentElement);
  }

  window.addEventListener("resize", resize);

  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    last = 0;
    if (running && !reduceMotion) window.requestAnimationFrame(frame);
  });

  resize();

  if (reduceMotion) {
    onScroll();
    scroll = scrollTarget;
    draw();
  } else {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    window.requestAnimationFrame(frame);
  }
})();