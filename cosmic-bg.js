/* =============================================================================
 *  cosmic-bg.js — 全局星空背景（可交互）
 *  在 <body> 最前插入一个固定全屏 <canvas>，绘制星点（闪烁+缓慢漂移）、
 *  星云光斑与偶发流星。每页通过 <body data-cosmo="变体名"> 指定风格；
 *  若未指定，则按页面路径哈希自动分配，保证“每一页都不一样”。
 *
 *  交互（鼠标 / 触摸，由 window 监听，canvas 本身 pointer-events:none 不挡内容）：
 *    · 光标的“斥力场”：附近星点被柔和推开，像被光拨开，离开后弹簧式归位；
 *    · 星座连线：邻近星点之间连起极淡的线，光标附近连线更亮，并形成“连向指针”的网；
 *    · 光标光晕：跟随指针的一团暖色辉光（lighter 叠加）；
 *    · 视差：星云随光标轻微反向位移，增加纵深；
 *    · 点击涟漪：按下时生成一圈向外扩散的冲击，把星点推离再回弹。
 *  浅色主题自动隐藏星云/连线/光晕；prefers-reduced-motion 下只绘制静态一帧（无监听）。
 * ========================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 浅色主题下用极淡的深色星点，并关闭星云/流星/交互 */
  function isLight() {
    return (document.documentElement.getAttribute("data-theme") || "dark") === "light";
  }

  /* ---------------------- 变体定义（每页不同观感） ---------------------- */
  var VARIANTS = {
    orion:     { hue: 205, stars: 170, neb: ["rgba(76,201,240,.18)", "rgba(91,123,240,.12)"], shoot: true  },
    nebula:    { hue: 280, stars: 150, neb: ["rgba(177,91,240,.20)", "rgba(255,93,115,.10)"], shoot: true  },
    galaxy:    { hue: 45,  stars: 195, neb: ["rgba(255,209,102,.16)", "rgba(255,158,87,.10)"], shoot: false },
    aurora:    { hue: 160, stars: 160, neb: ["rgba(123,211,137,.18)", "rgba(76,201,240,.12)"], shoot: true  },
    cygnus:    { hue: 220, stars: 180, neb: ["rgba(91,123,240,.20)",  "rgba(76,201,240,.10)"], shoot: false },
    andromeda: { hue: 320, stars: 165, neb: ["rgba(255,93,115,.18)",  "rgba(177,91,240,.12)"], shoot: true  },
    veil:      { hue: 190, stars: 185, neb: ["rgba(76,201,240,.16)",  "rgba(123,211,137,.10)"], shoot: true  },
    carina:    { hue: 30,  stars: 172, neb: ["rgba(255,158,87,.18)",  "rgba(255,209,102,.12)"], shoot: false }
  };
  var NAMES = Object.keys(VARIANTS);

  function pickVariant() {
    var forced = document.body && document.body.getAttribute("data-cosmo");
    if (forced && VARIANTS[forced]) return forced;
    var p = location.pathname || "/";
    var h = 0;
    for (var i = 0; i < p.length; i++) h = (h * 31 + p.charCodeAt(i)) >>> 0;
    return NAMES[h % NAMES.length];
  }

  var variant = pickVariant();
  var cfg = VARIANTS[variant];

  /* --------------------------- 注入 canvas --------------------------- */
  var canvas = document.createElement("canvas");
  canvas.className = "cosmic-bg";
  canvas.setAttribute("aria-hidden", "true");
  var s = canvas.style;
  s.position = "fixed";
  s.top = s.left = s.right = s.bottom = "0";
  s.zIndex = "-1";
  s.pointerEvents = "none";
  (document.body || document.documentElement)
    .insertBefore(canvas, (document.body || document.documentElement).firstChild);

  var ctx = canvas.getContext("2d");
  var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
  var stars = [], nebs = [], shoots = [];
  var t0 = performance.now(), prev = t0;
  var lastShoot = 0, nextGap = rand(4, 9);

  /* 交互状态 */
  var pointer = { x: -9999, y: -9999, active: false };
  var ripples = [];          // {x, y, age}
  var parX = 0, parY = 0;    // 平滑后的视差偏移

  /* 连线用的空间网格 */
  var LINK = 116, cell = LINK, gcols = 0, grows = 0, grid = [];

  /* 力场参数 */
  var R = 132;               // 斥力半径
  var R2 = 168;              // 连线/高亮半径
  var PUSH = 1.35;           // 最大斥力
  var SPRING = 0.02;         // 归位弹簧
  var DAMP = 0.86;           // 速度阻尼
  var RIP_SPEED = 540, RIP_BAND = 78, RIP_LIFE = 1.25;

  function rand(a, b) { return a + Math.random() * (b - a); }

  /* --------------------------- 尺寸 / 构建 --------------------------- */
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    build();
    buildGrid();
  }

  function build() {
    stars = [];
    var n = Math.round(cfg.stars * Math.min(1.5, Math.max(.55, W / 1280)));
    for (var i = 0; i < n; i++) {
      var hx = Math.random() * W, hy = Math.random() * H;
      stars.push({
        hx: hx, hy: hy, x: hx, y: hy, vx: 0, vy: 0,
        r: rand(.4, 1.9),
        a: rand(.22, .95),
        tw: rand(.5, 2.2), ph: Math.random() * 6.2832,
        dx: rand(-.05, .05), dy: rand(-.05, .05)
      });
    }
    nebs = [];
    var cols = cfg.neb;
    for (var j = 0; j < cols.length; j++) {
      nebs.push({
        x: rand(.12, .88) * W, y: rand(.12, .88) * H,
        r: rand(.35, .62) * Math.min(W, H), col: cols[j]
      });
    }
  }

  function buildGrid() {
    gcols = Math.ceil(W / cell) + 1;
    grows = Math.ceil(H / cell) + 1;
    grid = new Array(gcols * grows);
    for (var i = 0; i < grid.length; i++) grid[i] = [];
  }
  function clearGrid() { for (var i = 0; i < grid.length; i++) grid[i].length = 0; }

  /* --------------------------- 指针事件 --------------------------- */
  function setPointer(e) {
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
  }
  function onMove(e) { setPointer(e); }
  function onDown(e) {
    setPointer(e);
    spawnRipple(e.clientX, e.clientY);
  }
  function onLeave() { pointer.active = false; pointer.x = -9999; pointer.y = -9999; }

  function spawnRipple(x, y) {
    ripples.push({ x: x, y: y, age: 0 });
    if (ripples.length > 5) ripples.shift();
  }

  /* --------------------------- 绘制：星云 --------------------------- */
  function drawNeb(ox, oy) {
    ctx.globalCompositeOperation = "lighter";
    for (var i = 0; i < nebs.length; i++) {
      var n = nebs[i];
      var g = ctx.createRadialGradient(n.x + ox, n.y + oy, 0, n.x + ox, n.y + oy, n.r);
      g.addColorStop(0, n.col);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(n.x + ox, n.y + oy, n.r, 0, 6.2832); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  /* --------------------------- 流星 --------------------------- */
  function maybeShoot(t) {
    if (t - lastShoot > nextGap) {
      lastShoot = t; nextGap = rand(5, 12);
      var fromLeft = Math.random() < 0.5;
      var a = rand(15, 35) * Math.PI / 180;
      var dirx = fromLeft ? Math.cos(a) : -Math.cos(a);
      var diry = Math.sin(a);
      shoots.push({
        x: fromLeft ? rand(-.05, .35) * W : rand(.65, 1.05) * W,
        y: rand(-.05, .30) * H,
        dirx: dirx, diry: diry,
        len: rand(120, 230), life: 0, dur: rand(.7, 1.1)
      });
    }
  }

  function drawShoots(dt) {
    for (var i = shoots.length - 1; i >= 0; i--) {
      var sh = shoots[i];
      sh.life += dt;
      var p = sh.life / sh.dur;
      if (p >= 1) { shoots.splice(i, 1); continue; }
      var headx = sh.x + sh.dirx * sh.len * p;
      var heady = sh.y + sh.diry * sh.len * p;
      var tailx = headx - sh.dirx * sh.len * 0.5;
      var taily = heady - sh.diry * sh.len * 0.5;
      var alpha = Math.sin(p * Math.PI);
      var grad = ctx.createLinearGradient(tailx, taily, headx, heady);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(1, "rgba(255,255,255," + (0.9 * alpha).toFixed(3) + ")");
      ctx.strokeStyle = grad; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(tailx, taily); ctx.lineTo(headx, heady); ctx.stroke();
      ctx.globalAlpha = alpha; ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(headx, heady, 1.7, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  /* --------------------------- 物理步进 --------------------------- */
  function step(dt) {
    var light = isLight();
    for (var i = 0; i < stars.length; i++) {
      var st = stars[i];
      /* 家点缓慢漂移并环绕 */
      st.hx += st.dx; st.hy += st.dy;
      if (st.hx < 0) { st.hx += W; st.x += W; } else if (st.hx > W) { st.hx -= W; st.x -= W; }
      if (st.hy < 0) { st.hy += H; st.y += H; } else if (st.hy > H) { st.hy -= H; st.y -= H; }

      var ax = (st.hx - st.x) * SPRING;
      var ay = (st.hy - st.y) * SPRING;

      /* 光标斥力 */
      if (pointer.active && !light) {
        var ddx = st.x - pointer.x, ddy = st.y - pointer.y;
        var d2 = ddx * ddx + ddy * ddy;
        if (d2 < R * R) {
          var d = Math.sqrt(d2) || 0.01;
          var f = (1 - d / R) * PUSH;
          ax += (ddx / d) * f; ay += (ddy / d) * f;
        }
      }

      /* 点击涟漪：环形冲击波 */
      for (var k = 0; k < ripples.length; k++) {
        var rp = ripples[k];
        var rdx = st.x - rp.x, rdy = st.y - rp.y;
        var rd = Math.sqrt(rdx * rdx + rdy * rdy) || 0.01;
        var ring = rp.age * RIP_SPEED;
        var band = Math.abs(rd - ring);
        if (band < RIP_BAND) {
          var s2 = (1 - band / RIP_BAND) * (1 - rp.age / RIP_LIFE) * 1.7;
          ax += (rdx / rd) * s2; ay += (rdy / rd) * s2;
        }
      }

      st.vx = (st.vx + ax) * DAMP;
      st.vy = (st.vy + ay) * DAMP;
      st.x += st.vx; st.y += st.vy;
    }

    /* 涟漪老化 */
    for (var m = ripples.length - 1; m >= 0; m--) {
      ripples[m].age += dt;
      if (ripples[m].age > RIP_LIFE) ripples.splice(m, 1);
    }

    /* 视差平滑（星云反向轻移） */
    var tx = pointer.active ? (pointer.x - W / 2) * -0.018 : 0;
    var ty = pointer.active ? (pointer.y - H / 2) * -0.018 : 0;
    parX += (tx - parX) * 0.05; parY += (ty - parY) * 0.05;
  }

  /* --------------------------- 主循环 --------------------------- */
  function frame(now) {
    var dt = Math.min(0.05, (now - prev) / 1000); prev = now;
    var t = (now - t0) / 1000;
    var light = isLight();

    step(dt);

    ctx.clearRect(0, 0, W, H);
    if (!light) drawNeb(parX, parY);

    /* 光标光晕 */
    if (!light && pointer.active) {
      ctx.globalCompositeOperation = "lighter";
      var gg = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 190);
      gg.addColorStop(0, "hsla(" + cfg.hue + ",92%,76%,.12)");
      gg.addColorStop(1, "hsla(" + cfg.hue + ",92%,76%,0)");
      ctx.fillStyle = gg;
      ctx.beginPath(); ctx.arc(pointer.x, pointer.y, 190, 0, 6.2832); ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }

    /* 星座连线（空间网格，仅深色主题） */
    if (!light) {
      clearGrid();
      for (var gi = 0; gi < stars.length; gi++) {
        var sx = stars[gi].x, sy = stars[gi].y;
        var cxi = Math.max(0, Math.min(gcols - 1, (sx / cell) | 0));
        var cyi = Math.max(0, Math.min(grows - 1, (sy / cell) | 0));
        var b = cyi * gcols + cxi;
        if (grid[b]) grid[b].push(gi); else grid[b] = [gi];
      }
      ctx.lineWidth = 1;
      for (var y = 0; y < grows; y++) {
        for (var x = 0; x < gcols; x++) {
          var here = grid[y * gcols + x];
          if (!here || !here.length) continue;
          for (var nx = -1; nx <= 1; nx++) {
            for (var ny = -1; ny <= 1; ny++) {
              var ncx = x + nx, ncy = y + ny;
              if (ncx < 0 || ncy < 0 || ncx >= gcols || ncy >= grows) continue;
              var there = grid[ncy * gcols + ncx];
              if (!there) continue;
              for (var a = 0; a < here.length; a++) {
                var ia = here[a];
                for (var b2 = 0; b2 < there.length; b2++) {
                  var ib = there[b2];
                  if (ib <= ia) continue;
                  var p1 = stars[ia], p2 = stars[ib];
                  var ddx2 = p1.x - p2.x, ddy2 = p1.y - p2.y;
                  var d2 = ddx2 * ddx2 + ddy2 * ddy2;
                  if (d2 < LINK * LINK) {
                    var dist = Math.sqrt(d2);
                    var la = (1 - dist / LINK) * 0.16;
                    /* 光标附近更亮 */
                    if (pointer.active) {
                      var mx = (p1.x + p2.x) / 2 - pointer.x, my = (p1.y + p2.y) / 2 - pointer.y;
                      var md = Math.sqrt(mx * mx + my * my);
                      if (md < R2) la *= 1 + 1.8 * (1 - md / R2);
                    }
                    ctx.strokeStyle = "hsla(" + cfg.hue + ",85%,72%," + la.toFixed(3) + ")";
                    ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                  }
                }
              }
            }
          }
        }
      }
      /* 连向指针的网 */
      if (pointer.active) {
        ctx.lineWidth = 1;
        for (var pi = 0; pi < stars.length; pi++) {
          var sp = stars[pi];
          var pdx = sp.x - pointer.x, pdy = sp.y - pointer.y;
          var pd = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pd < R2) {
            var pa = (1 - pd / R2) * 0.5;
            ctx.strokeStyle = "hsla(" + cfg.hue + ",90%,78%," + pa.toFixed(3) + ")";
            ctx.beginPath(); ctx.moveTo(sp.x, sp.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
          }
        }
      }
    }

    /* 星点 */
    ctx.fillStyle = light ? "hsl(" + cfg.hue + ",38%,28%)" : "hsl(" + cfg.hue + ",95%,92%)";
    var aScale = light ? 0.55 : 1;
    for (var i2 = 0; i2 < stars.length; i2++) {
      var st = stars[i2];
      var tw = st.a * (0.6 + 0.4 * Math.sin(t * st.tw + st.ph)) * aScale;
      var near = 0;
      if (!light && pointer.active) {
        var ndx = st.x - pointer.x, ndy = st.y - pointer.y;
        var nd = Math.sqrt(ndx * ndx + ndy * ndy);
        if (nd < R2) near = 1 - nd / R2;
      }
      ctx.globalAlpha = Math.min(1, tw * (1 + near * 0.9));
      var rr = st.r * (1 + near * 0.8);
      ctx.beginPath(); ctx.arc(st.x, st.y, rr, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (!light && cfg.shoot) { maybeShoot(t); drawShoots(dt); }
    requestAnimationFrame(frame);
  }

  /* 静态帧（reduced-motion / 浅色下首帧） */
  function drawStatic() {
    var light = isLight();
    ctx.clearRect(0, 0, W, H);
    if (!light) drawNeb(0, 0);
    ctx.fillStyle = light ? "hsl(" + cfg.hue + ",38%,28%)" : "hsl(" + cfg.hue + ",95%,92%)";
    var aScale = light ? 0.55 : 1;
    for (var i = 0; i < stars.length; i++) {
      var st = stars[i];
      ctx.globalAlpha = st.a * aScale;
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* --------------------------- 启动 --------------------------- */
  if (!reduce) {
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerout", function (e) { if (!e.relatedTarget) onLeave(); }, { passive: true });
    document.addEventListener("pointerleave", onLeave, { passive: true });
    document.addEventListener("pointercancel", onLeave, { passive: true });
  }

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(resize, 150);
  });

  /* 主题切换时重绘（影响 reduced-motion 的静态帧；动态帧每帧自动取主题） */
  var mo = new MutationObserver(function () { if (reduce) drawStatic(); });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  resize();
  if (reduce) { drawStatic(); }
  else { requestAnimationFrame(frame); }

  /* 暴露当前变体，便于调试 */
  window.__cosmicVariant = variant;
})();
