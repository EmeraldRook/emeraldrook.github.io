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

  // ── Colors ──
  var emerald = { r: 16, g: 185, b: 129 };
  var emeraldLight = { r: 52, g: 211, b: 153 };
  var emeraldDark = { r: 5, g: 150, b: 105 };

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
          ampX: 1.5 + Math.random() * 2.5,
          ampY: 1.5 + Math.random() * 2.5,
          speedX: 0.003 + Math.random() * 0.005,
          speedY: 0.002 + Math.random() * 0.004
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
          // Randomize diagonal direction for variety
          if (Math.random() > 0.5) {
            triangles.push({ a: i, b: j, c: k });
            triangles.push({ a: j, b: l, c: k });
          } else {
            triangles.push({ a: i, b: j, c: l });
            triangles.push({ a: i, b: l, c: k });
          }
        }
      }
    }
  }

  // ── Get triangle centroid ──
  function centroid(tri) {
    var va = vertices[tri.a];
    var vb = vertices[tri.b];
    var vc = vertices[tri.c];
    return {
      x: (va.x + vb.x + vc.x) / 3,
      y: (va.y + vb.y + vc.y) / 3
    };
  }

  // ── Draw triangulated mesh ──
  function drawMesh() {
    var specularRadius = 300;
    var specularRadiusSq = specularRadius * specularRadius;

    for (var i = 0; i < triangles.length; i++) {
      var tri = triangles[i];
      var va = vertices[tri.a];
      var vb = vertices[tri.b];
      var vc = vertices[tri.c];

      // Calculate centroid for specular
      var cx = (va.x + vb.x + vc.x) / 3;
      var cy = (va.y + vb.y + vc.y) / 3;

      // Base emerald fill (very low opacity)
      var baseOpacity = 0.02 + Math.sin(time * 0.001 + cx * 0.002 + cy * 0.003) * 0.01;

      // Mouse-reactive specular highlight
      var mdx = cx - mouseX;
      var mdy = cy - mouseY;
      var mDistSq = mdx * mdx + mdy * mdy;
      var specular = 0;

      if (mDistSq < specularRadiusSq) {
        var mDist = Math.sqrt(mDistSq);
        specular = (1 - mDist / specularRadius) * 0.12;
      }

      var fillOpacity = Math.min(baseOpacity + specular, 0.18);

      // Choose color based on position (subtle variety)
      var colorChoice = ((i * 7) % 3);
      var fillColor = colorChoice === 0 ? emerald : (colorChoice === 1 ? emeraldLight : emeraldDark);

      // Draw triangle fill
      ctx.beginPath();
      ctx.moveTo(va.x, va.y);
      ctx.lineTo(vb.x, vb.y);
      ctx.lineTo(vc.x, vc.y);
      ctx.closePath();
      ctx.fillStyle = rgba(fillColor, fillOpacity);
      ctx.fill();

      // Subtle edge lines
      ctx.strokeStyle = rgba(emerald, 0.015 + specular * 0.3);
      ctx.lineWidth = 0.5;
      ctx.stroke();
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

  // ── Mouse tracking ──
  var heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }, { passive: true });

    heroSection.addEventListener('mouseleave', function () {
      mouseX = -1000;
      mouseY = -1000;
    }, { passive: true });
  }

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
