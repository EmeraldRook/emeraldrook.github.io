(function () {
  'use strict';

  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var width, height;
  var particles = [];
  var crystals = [];
  var orbs = [];
  var gridLines = [];
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

  // ── Initialize ──
  function init() {
    resize();
    particles = [];
    crystals = [];
    orbs = [];
    gridLines = [];

    // Glow orbs — large soft emerald blobs that drift slowly
    var orbConfigs = [
      { bx: 0.65, by: 0.3, r: 280 },
      { bx: 0.25, by: 0.6, r: 220 },
      { bx: 0.8, by: 0.7, r: 180 },
    ];
    orbConfigs.forEach(function (cfg, i) {
      orbs.push({
        baseX: width * cfg.bx,
        baseY: height * cfg.by,
        x: width * cfg.bx,
        y: height * cfg.by,
        radius: cfg.r,
        phase: i * 2.1,
        speedX: 0.0004 + i * 0.0001,
        speedY: 0.0003 + i * 0.00015,
        ampX: 60 + i * 20,
        ampY: 40 + i * 15,
      });
    });

    // Particles — floating dots connected by lines
    var count = Math.min(70, Math.floor((width * height) / 18000));
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.8 + 0.5,
        opacity: Math.random() * 0.35 + 0.08,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Crystal shapes — slowly rotating geometric forms (emerald facets / rook battlements)
    var crystalConfigs = [
      { sides: 6, sz: 60, op: 0.04 },  // hexagon (emerald cross-section)
      { sides: 8, sz: 45, op: 0.035 }, // octagon
      { sides: 4, sz: 50, op: 0.03 },  // diamond
      { sides: 5, sz: 35, op: 0.04 },  // pentagon
      { sides: 6, sz: 70, op: 0.025 }, // large hexagon
    ];
    crystalConfigs.forEach(function (cfg) {
      crystals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.002,
        size: cfg.sz,
        sides: cfg.sides,
        opacity: cfg.op,
        innerRatio: 0.5 + Math.random() * 0.3, // for inner facet lines
      });
    });

    // Subtle grid lines — faint chessboard-like pattern that drifts
    for (var g = 0; g < 6; g++) {
      gridLines.push({
        isVertical: g < 3,
        position: (g < 3) ? width * (0.2 + g * 0.3) : height * (0.2 + (g - 3) * 0.3),
        drift: Math.random() * Math.PI * 2,
        speed: 0.0002 + Math.random() * 0.0002,
        amp: 30 + Math.random() * 20,
        opacity: 0.02 + Math.random() * 0.015,
      });
    }
  }

  // ── Draw glow orbs ──
  function drawOrbs() {
    orbs.forEach(function (orb) {
      orb.x = orb.baseX + Math.sin(time * orb.speedX + orb.phase) * orb.ampX;
      orb.y = orb.baseY + Math.cos(time * orb.speedY + orb.phase) * orb.ampY;

      var grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
      grad.addColorStop(0, rgba(emerald, 0.12));
      grad.addColorStop(0.4, rgba(emeraldDark, 0.05));
      grad.addColorStop(1, rgba(emerald, 0));

      ctx.fillStyle = grad;
      ctx.fillRect(orb.x - orb.radius, orb.y - orb.radius, orb.radius * 2, orb.radius * 2);
    });
  }

  // ── Draw grid lines ──
  function drawGrid() {
    gridLines.forEach(function (line) {
      var offset = Math.sin(time * line.speed + line.drift) * line.amp;
      ctx.beginPath();

      if (line.isVertical) {
        var x = line.position + offset;
        ctx.moveTo(x, 0);
        // Slight wave
        for (var y = 0; y <= height; y += 50) {
          var wave = Math.sin(y * 0.003 + time * 0.001) * 8;
          ctx.lineTo(x + wave, y);
        }
      } else {
        var y2 = line.position + offset;
        ctx.moveTo(0, y2);
        for (var x2 = 0; x2 <= width; x2 += 50) {
          var wave2 = Math.sin(x2 * 0.003 + time * 0.001) * 8;
          ctx.lineTo(x2, y2 + wave2);
        }
      }

      ctx.strokeStyle = rgba(emerald, line.opacity);
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  // ── Draw crystal shapes ──
  function drawCrystals() {
    crystals.forEach(function (c) {
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.rotSpeed;

      // Wrap around edges
      if (c.x < -c.size * 2) c.x = width + c.size;
      if (c.x > width + c.size * 2) c.x = -c.size;
      if (c.y < -c.size * 2) c.y = height + c.size;
      if (c.y > height + c.size * 2) c.y = -c.size;

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);

      // Outer shape
      ctx.beginPath();
      for (var i = 0; i < c.sides; i++) {
        var angle = (Math.PI * 2 / c.sides) * i - Math.PI / 2;
        var px = Math.cos(angle) * c.size;
        var py = Math.sin(angle) * c.size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = rgba(emeraldLight, c.opacity);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = rgba(emerald, c.opacity * 0.2);
      ctx.fill();

      // Inner facet lines — from center to each vertex
      for (var j = 0; j < c.sides; j++) {
        var a = (Math.PI * 2 / c.sides) * j - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * c.size * c.innerRatio, Math.sin(a) * c.size * c.innerRatio);
        ctx.strokeStyle = rgba(emerald, c.opacity * 0.5);
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      ctx.restore();
    });
  }

  // ── Draw particles and connections ──
  function drawParticles() {
    var connectionDist = 130;
    var connectionDistSq = connectionDist * connectionDist;
    var mouseInfluence = 150;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Subtle mouse repulsion
      var mdx = p.x - mouseX;
      var mdy = p.y - mouseY;
      var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < mouseInfluence && mDist > 0) {
        var force = (1 - mDist / mouseInfluence) * 0.5;
        p.vx += (mdx / mDist) * force;
        p.vy += (mdy / mDist) * force;
      }

      // Damping
      p.vx *= 0.998;
      p.vy *= 0.998;

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Pulse
      p.pulse += 0.02;
      var pulseAlpha = p.opacity + Math.sin(p.pulse) * 0.05;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = rgba(emeraldLight, pulseAlpha);
      ctx.fill();

      // Connections
      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var dx = p.x - p2.x;
        var dy = p.y - p2.y;
        var distSq = dx * dx + dy * dy;

        if (distSq < connectionDistSq) {
          var dist = Math.sqrt(distSq);
          var alpha = (1 - dist / connectionDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = rgba(emerald, alpha);
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // ── Animation loop ──
  function animate() {
    time++;
    ctx.clearRect(0, 0, width, height);

    drawOrbs();
    drawGrid();
    drawCrystals();
    drawParticles();

    animId = requestAnimationFrame(animate);
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
  animate();

  // ── Handle resize ──
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      cancelAnimationFrame(animId);
      init();
      animate();
    }, 200);
  });
})();
