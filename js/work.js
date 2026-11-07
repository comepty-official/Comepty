/* ==========================================================================
   COMEPTY — work.js
   Renders an abstract, project specific preview into each project canvas.
   These are deliberate placeholders so the page never presents fabricated
   screenshots, and they can be swapped for real captures later.
   ========================================================================== */

(function () {
  "use strict";

  var canvases = document.querySelectorAll("[data-project-visual]");
  if (!canvases.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ink = "#0a0b0d";
  var accent = "#2b4eff";
  var grey = "#c9cbd0";
  var paper = "#f5f5f6";
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  function setup(canvas) {
    var rect = canvas.parentElement.getBoundingClientRect();
    var w = Math.max(rect.width, 120);
    var h = Math.max(rect.height, 80);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }

  /* ---------------------------------------------------------------------
     Frodecorp: a canvas editor with a composition grid and selection frame.
     --------------------------------------------------------------------- */

  function drawFrodecorp(ctx, w, h) {
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, w, h);

    // Sidebar
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w * 0.2, h);
    ctx.strokeStyle = grey;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, 0);
    ctx.lineTo(w * 0.2, h);
    ctx.stroke();

    // Sidebar blocks
    for (var i = 0; i < 7; i += 1) {
      var y = h * 0.14 + i * (h * 0.09);
      ctx.fillStyle = i === 1 ? accent : grey;
      ctx.globalAlpha = i === 1 ? 0.9 : 0.55;
      ctx.fillRect(w * 0.035, y, w * 0.045, w * 0.045);
      ctx.fillRect(w * 0.095, y + 2, w * 0.07, 5);
      ctx.globalAlpha = 1;
    }

    // Canvas composition
    var cx = w * 0.2;
    var cw = w - cx;

    // Grid lines
    ctx.strokeStyle = "rgba(10,11,13,0.07)";
    for (var g = 1; g < 6; g += 1) {
      var gx = cx + (cw / 6) * g;
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, h);
      ctx.stroke();
    }

    // Header block
    ctx.fillStyle = ink;
    ctx.fillRect(cx + cw * 0.08, h * 0.14, cw * 0.5, 9);

    // Copy lines
    ctx.fillStyle = grey;
    ctx.globalAlpha = 0.8;
    ctx.fillRect(cx + cw * 0.08, h * 0.28, cw * 0.34, 5);
    ctx.fillRect(cx + cw * 0.08, h * 0.34, cw * 0.26, 5);
    ctx.globalAlpha = 1;

    // Selected element with handles
    var sx = cx + cw * 0.08;
    var sy = h * 0.5;
    var sw = cw * 0.42;
    var sh = h * 0.24;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(sx, sy, sw, sh);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sx, sy, sw, sh);

    [[sx, sy], [sx + sw, sy], [sx, sy + sh], [sx + sw, sy + sh]].forEach(function (pt) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(pt[0] - 3, pt[1] - 3, 6, 6);
      ctx.strokeRect(pt[0] - 3, pt[1] - 3, 6, 6);
    });

    // Right image block
    ctx.fillStyle = grey;
    ctx.globalAlpha = 0.45;
    ctx.fillRect(cx + cw * 0.58, h * 0.5, cw * 0.3, h * 0.24);
    ctx.globalAlpha = 1;
  }

  /* ---------------------------------------------------------------------
     Lunosen: a fashion storefront layout with a hero image and product row.
     --------------------------------------------------------------------- */

  function drawLunosen(ctx, w, h) {
    ctx.fillStyle = "#f4f1ec";
    ctx.fillRect(0, 0, w, h);

    // Nav
    ctx.fillStyle = ink;
    ctx.fillRect(w * 0.07, h * 0.09, w * 0.12, 6);
    for (var n = 0; n < 3; n += 1) {
      ctx.fillStyle = grey;
      ctx.fillRect(w * 0.62 + n * w * 0.1, h * 0.1, w * 0.06, 4);
    }

    // Hero image block
    var hx = w * 0.07;
    var hy = h * 0.2;
    var hw = w * 0.52;
    var hh = h * 0.52;
    ctx.fillStyle = "#c8b7a3";
    ctx.fillRect(hx, hy, hw, hh);

    // Simple figure silhouette
    ctx.fillStyle = "rgba(90,70,55,0.5)";
    ctx.beginPath();
    ctx.arc(hx + hw * 0.5, hy + hh * 0.3, hw * 0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(hx + hw * 0.5, hy + hh * 0.36);
    ctx.lineTo(hx + hw * 0.32, hy + hh * 0.95);
    ctx.lineTo(hx + hw * 0.68, hy + hh * 0.95);
    ctx.closePath();
    ctx.fill();

    // Text column
    ctx.fillStyle = ink;
    ctx.fillRect(w * 0.65, h * 0.24, w * 0.24, 10);
    ctx.fillRect(w * 0.65, h * 0.32, w * 0.2, 10);
    ctx.fillStyle = grey;
    ctx.fillRect(w * 0.65, h * 0.44, w * 0.26, 5);
    ctx.fillRect(w * 0.65, h * 0.49, w * 0.22, 5);
    ctx.fillRect(w * 0.65, h * 0.54, w * 0.24, 5);

    // CTA
    ctx.fillStyle = ink;
    ctx.fillRect(w * 0.65, h * 0.64, w * 0.16, h * 0.07);

    // Product row
    for (var p = 0; p < 3; p += 1) {
      var px = w * 0.07 + p * w * 0.19;
      ctx.fillStyle = "#e2dbd1";
      ctx.fillRect(px, h * 0.78, w * 0.16, h * 0.16);
      ctx.fillStyle = grey;
      ctx.fillRect(px, h * 0.96, w * 0.09, 4);
    }
  }

  /* ---------------------------------------------------------------------
     Skincare: minimal product composition with a soft bottle silhouette.
     --------------------------------------------------------------------- */

  function drawSkincare(ctx, w, h) {
    ctx.fillStyle = "#eef0ee";
    ctx.fillRect(0, 0, w, h);

    // Centered label
    ctx.fillStyle = ink;
    ctx.fillRect(w * 0.4, h * 0.1, w * 0.2, 5);

    // Product bottle
    var bx = w * 0.38;
    var by = h * 0.28;
    var bw = w * 0.24;
    var bh = h * 0.5;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = "rgba(10,11,13,0.1)";
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, bw, bh);

    // Cap
    ctx.fillStyle = ink;
    ctx.fillRect(bx + bw * 0.3, by - h * 0.06, bw * 0.4, h * 0.06);

    // Bottle label
    ctx.fillStyle = accent;
    ctx.fillRect(bx + bw * 0.2, by + bh * 0.3, bw * 0.6, 3);
    ctx.fillStyle = grey;
    ctx.fillRect(bx + bw * 0.28, by + bh * 0.42, bw * 0.44, 3);
    ctx.fillRect(bx + bw * 0.32, by + bh * 0.5, bw * 0.36, 3);

    // Surrounding soft forms
    ctx.fillStyle = "rgba(10,11,13,0.05)";
    ctx.beginPath();
    ctx.arc(w * 0.22, h * 0.72, w * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.8, h * 0.34, w * 0.07, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ---------------------------------------------------------------------
     Mass. Story: editorial storytelling with stacked text lines.
     --------------------------------------------------------------------- */

  function drawMassStory(ctx, w, h) {
    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(w * 0.1, h * 0.16, w * 0.44, 12);
    ctx.fillRect(w * 0.1, h * 0.26, w * 0.3, 12);

    ctx.fillStyle = accent;
    ctx.fillRect(w * 0.1, h * 0.38, w * 0.18, 5);

    ctx.fillStyle = "rgba(255,255,255,0.35)";
    for (var i = 0; i < 4; i += 1) {
      ctx.fillRect(w * 0.1, h * 0.48 + i * h * 0.05, w * (0.4 - i * 0.05), 4);
    }

    // Image panel
    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(w * 0.6, h * 0.16, w * 0.3, h * 0.56);

    // Panel detail
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(w * 0.6, h * 0.16, w * 0.3, h * 0.56);
    ctx.beginPath();
    ctx.moveTo(w * 0.6, h * 0.16);
    ctx.lineTo(w * 0.9, h * 0.72);
    ctx.stroke();

    // Bottom rule
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(w * 0.1, h * 0.84, w * 0.8, 1);
  }

  /* ---------------------------------------------------------------------
     CSIC: a desktop assistant window with a command line and node graph.
     --------------------------------------------------------------------- */

  function drawCsic(ctx, w, h) {
    ctx.fillStyle = "#0e1014";
    ctx.fillRect(0, 0, w, h);

    // Window chrome
    ctx.fillStyle = "#181b21";
    ctx.fillRect(0, 0, w, h * 0.12);
    ["#3a3f49", "#3a3f49", "#3a3f49"].forEach(function (color, index) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(w * 0.05 + index * w * 0.028, h * 0.06, w * 0.008, 0, Math.PI * 2);
      ctx.fill();
    });

    // Left panel
    ctx.fillStyle = "#12151a";
    ctx.fillRect(0, h * 0.12, w * 0.26, h * 0.88);
    for (var i = 0; i < 6; i += 1) {
      ctx.fillStyle = i === 1 ? accent : "rgba(255,255,255,0.16)";
      ctx.fillRect(w * 0.03, h * 0.2 + i * h * 0.1, w * 0.16, 4);
    }

    // Terminal lines
    ctx.fillStyle = "rgba(43,78,255,0.9)";
    ctx.fillRect(w * 0.32, h * 0.24, w * 0.1, 4);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillRect(w * 0.32, h * 0.32, w * 0.36, 4);
    ctx.fillRect(w * 0.32, h * 0.38, w * 0.28, 4);
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fillRect(w * 0.32, h * 0.44, w * 0.32, 4);
    ctx.fillStyle = "rgba(43,78,255,0.9)";
    ctx.fillRect(w * 0.32, h * 0.5, w * 0.14, 4);

    // Node graph
    var nodes = [
      { x: w * 0.44, y: h * 0.68 },
      { x: w * 0.58, y: h * 0.62 },
      { x: w * 0.72, y: h * 0.72 },
      { x: w * 0.86, y: h * 0.64 },
      { x: w * 0.58, y: h * 0.82 },
      { x: w * 0.78, y: h * 0.86 }
    ];

    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [2, 5]].forEach(function (pair) {
      var a = nodes[pair[0]];
      var b = nodes[pair[1]];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    nodes.forEach(function (node, index) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = index % 2 === 0 ? accent : "rgba(255,255,255,0.7)";
      ctx.fill();
    });
  }

  var renderers = {
    frodecorp: drawFrodecorp,
    lunosen: drawLunosen,
    skincare: drawSkincare,
    massstory: drawMassStory,
    csic: drawCsic
  };

  function renderAll() {
    canvases.forEach(function (canvas) {
      var kind = canvas.getAttribute("data-project-visual");
      var draw = renderers[kind];
      if (!draw) return;
      var scene = setup(canvas);
      draw(scene.ctx, scene.w, scene.h);
    });
  }

  renderAll();

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(renderAll, 160);
  });
})();