(function () {
  'use strict';

  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var width, height;
  var vertices = [];
  var triangles = [];
  var time = 0;
  var animId;
  var mouseX = -1000, mouseY = -1000;

  // ── Light/dark opacity multiplier ──
  var isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
  var opacityMultiplier = isLightMode ? 2.5 : 1.0;

  window.addEventListener('themechange', function (e) {
    isLightMode = (e.detail && e.detail.theme === 'light');
    opacityMultiplier = isLightMode ? 2.5 : 1.0;
  });

  // ── Colors ──
  var emerald = { r: 16, g: 185, b: 129 };
  var emeraldLight = { r: 52, g: 211, b: 153 };
  var emeraldDark = { r: 5, g: 150, b: 105 };
  var emeraldDeep = { r: 4, g: 120, b: 87 };
  var emeraldBright = { r: 110, g: 231, b: 183 };

  // Dark edge colors for light mode (stone tones)
  var edgeDark = { r: 30, g: 27, b: 24 };
  var edgeDarkBright = { r: 68, g: 64, b: 60 };

  // ── Rendering constants ──
  var SPECULAR_RADIUS = 300;
  var GRADIENT_ZONE_RADIUS = 200;
  var GLINT_RADIUS = 180;

  function rgba(color, alpha) {
    return 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + alpha + ')';
  }

  // ── Resize ──
  function resize() {
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ── Generate triangulated mesh ──
  function generateMesh() {
    vertices = [];
    triangles = [];

    // Grid-based vertex generation with jitter
    var cellSize = Math.max(80, Math.min(120, width / 14));
    var cols = Math.ceil(width / cellSize) + 2;
    var rows = Math.ceil(height / cellSize) + 2;
    var jitter = cellSize * 0.35;

    // Create grid vertices
    for (var r = -1; r <= rows; r++) {
      for (var c = -1; c <= cols; c++) {
        var baseX = c * cellSize;
        var baseY = r * cellSize;
        var jx = (Math.random() - 0.5) * jitter * 2;
        var jy = (Math.random() - 0.5) * jitter * 2;

        vertices.push({
          x: baseX + jx,
          y: baseY + jy,
          baseX: baseX + jx,
          baseY: baseY + jy,
          phase: Math.random() * Math.PI * 2,
          ampX: 4 + Math.random() * 6,
          ampY: 4 + Math.random() * 6,
          speedX: 0.006 + Math.random() * 0.01,
          speedY: 0.005 + Math.random() * 0.008
        });
      }
    }

    // Two triangles per quad (Delaunay-like)
    var totalCols = cols + 2;
    for (var r2 = 0; r2 < rows + 1; r2++) {
      for (var c2 = 0; c2 < totalCols - 1; c2++) {
        var i = r2 * totalCols + c2;
        var j = i + 1;
        var k = i + totalCols;
        var l = k + 1;

        if (k < vertices.length && l < vertices.length) {
          var triA, triB;
          // Randomize diagonal direction for variety
          if (Math.random() > 0.5) {
            triA = { a: i, b: j, c: k };
            triB = { a: j, b: l, c: k };
          } else {
            triA = { a: i, b: j, c: l };
            triB = { a: i, b: l, c: k };
          }
          computeTriangleProperties(triA);
          computeTriangleProperties(triB);
          triangles.push(triA);
          triangles.push(triB);
        }
      }
    }
  }

  // ── Compute per-triangle cached properties ──
  function computeTriangleProperties(tri) {
    var va = vertices[tri.a];
    var vb = vertices[tri.b];
    var vc = vertices[tri.c];

    // 2D cross product of edges (AB x AC)
    var abx = vb.baseX - va.baseX;
    var aby = vb.baseY - va.baseY;
    var acx = vc.baseX - va.baseX;
    var acy = vc.baseY - va.baseY;
    var cross2D = abx * acy - aby * acx;

    // Average edge angle
    var angle1 = Math.atan2(aby, abx);
    var angle2 = Math.atan2(acy, acx);
    var bcx = vc.baseX - vb.baseX;
    var bcy = vc.baseY - vb.baseY;
    var angle3 = Math.atan2(bcy, bcx);
    var avgEdgeAngle = (angle1 + angle2 + angle3) / 3;

    // Pseudo-normal: [-1, 1] — drives light/dark facet contrast
    tri.normal = Math.sin(avgEdgeAngle * 2.7 + cross2D * 0.001);

    // Deterministic hash from vertex indices for shimmer timing
    tri.facetSeed = ((tri.a * 73 + tri.b * 137 + tri.c * 251) % 1000) / 1000;

    // Color index from cross product + edge angle
    var raw = Math.abs(cross2D * 0.0001 + avgEdgeAngle);
    tri.colorIndex = Math.floor(raw * 10) % 3;
  }

  // ── Draw triangulated mesh — four rendering layers ──
  function drawMesh() {
    var specularRadiusSq = SPECULAR_RADIUS * SPECULAR_RADIUS;
    var gradientZoneRadiusSq = GRADIENT_ZONE_RADIUS * GRADIENT_ZONE_RADIUS;
    var glintRadiusSq = GLINT_RADIUS * GLINT_RADIUS;
    var colors = [emerald, emeraldLight, emeraldDark];

    // ── Layer 1 & 2 & 3: Base fills, gradient fills, and edge strokes ──
    for (var i = 0; i < triangles.length; i++) {
      var tri = triangles[i];
      var va = vertices[tri.a];
      var vb = vertices[tri.b];
      var vc = vertices[tri.c];

      var cx = (va.x + vb.x + vc.x) / 3;
      var cy = (va.y + vb.y + vc.y) / 3;

      // Normal-driven brightness: range [0.4, 1.6]
      var normalBrightness = 1.0 + tri.normal * 0.6;

      // Base opacity with shimmer
      var shimmer = Math.sin(time * 0.003 + tri.facetSeed * 6.28) * 0.005;
      var baseOpacity = (0.02 * normalBrightness + shimmer) * opacityMultiplier;

      // Mouse-reactive specular
      var mdx = cx - mouseX;
      var mdy = cy - mouseY;
      var mDistSq = mdx * mdx + mdy * mdy;
      var specular = 0;

      if (mDistSq < specularRadiusSq) {
        var mDist = Math.sqrt(mDistSq);
        specular = (1 - mDist / SPECULAR_RADIUS) * 0.12;
      }

      var fillOpacity = Math.min(baseOpacity + specular, 0.22);

      // Color selection based on brightness tier
      var fillColor;
      if (normalBrightness > 1.3) {
        fillColor = emeraldBright;
      } else if (normalBrightness < 1.0) {
        fillColor = emeraldDeep;
      } else {
        fillColor = colors[tri.colorIndex];
      }

      // Build triangle path
      ctx.beginPath();
      ctx.moveTo(va.x, va.y);
      ctx.lineTo(vb.x, vb.y);
      ctx.lineTo(vc.x, vc.y);
      ctx.closePath();

      // Layer 1 — Base facet fill (flat)
      ctx.fillStyle = rgba(fillColor, fillOpacity);
      ctx.fill();

      // Layer 3 — Edge catch-lights
      // Pass 1: subtle base edge stroke on all triangles
      var edgeOpacity = (0.004 + (normalBrightness - 0.4) * 0.013) * opacityMultiplier;
      ctx.strokeStyle = rgba(isLightMode ? edgeDark : emerald, edgeOpacity);
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Pass 2: bright edge stroke for near-mouse bright facets
      if (specular > 0.01 && normalBrightness > 1.0) {
        ctx.strokeStyle = rgba(isLightMode ? edgeDarkBright : emeraldBright, specular * 0.5);
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }
    }

    // ── Layer 4 — Vertex glints (separate top pass) ──
    if (mouseX > -500) {
      for (var vi = 0; vi < vertices.length; vi++) {
        var v = vertices[vi];
        var vdx = v.x - mouseX;
        var vdy = v.y - mouseY;
        var vDistSq = vdx * vdx + vdy * vdy;

        if (vDistSq < glintRadiusSq) {
          // Phase gate: only ~35% of nearby vertices glint at any frame
          var phase = Math.sin(time * 0.02 + v.phase * 4);
          if (phase > 0.3) {
            var vDist = Math.sqrt(vDistSq);
            var proximity = 1 - vDist / GLINT_RADIUS;
            var glintIntensity = proximity * (phase - 0.3) / 0.7;
            var glintRadius = 1.5 + glintIntensity * 2.0;
            var glintAlpha = Math.min(glintIntensity * 0.35, 0.35);

            ctx.beginPath();
            ctx.arc(v.x, v.y, glintRadius, 0, Math.PI * 2);
            ctx.fillStyle = rgba(emeraldBright, glintAlpha);
            ctx.fill();
          }
        }
      }
    }
  }

  // ── Update vertex positions (gentle drift) ──
  function updateVertices() {
    for (var i = 0; i < vertices.length; i++) {
      var v = vertices[i];
      v.x = v.baseX + Math.sin(time * v.speedX + v.phase) * v.ampX;
      v.y = v.baseY + Math.cos(time * v.speedY + v.phase * 1.3) * v.ampY;
    }
  }

  // ── Animation loop ──
  function animate() {
    time++;
    ctx.clearRect(0, 0, width, height);
    updateVertices();
    drawMesh();
    animId = requestAnimationFrame(animate);
  }

  // ── Initialize ──
  function init() {
    resize();
    generateMesh();

    if (prefersReducedMotion) {
      // Single static frame
      updateVertices();
      drawMesh();
      return;
    }

    animate();
  }

  // ── Mouse tracking (document-level for flashlight effect) ──
  document.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }, { passive: true });

  document.addEventListener('mouseleave', function () {
    mouseX = -1000;
    mouseY = -1000;
  }, { passive: true });

  // ── Start ──
  init();

  // ── Handle resize ──
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (animId) cancelAnimationFrame(animId);
      init();
    }, 200);
  });
})();
