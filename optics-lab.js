/* =============================================================================
 *  optics-lab.js  ——  可交互光学仿真实验室
 *  三套演示：Prism Dispersion（棱镜色散）/ Double-Slit（双缝干涉）/ Refraction（折射）
 *  纯 Canvas 2D 实现，自带高 DPI、rAF 动画、进入视口才运行、尊重 prefers-reduced-motion。
 *  文本语言由 main.js 的 applyI18n 在切换语言时通过 window.OpticsLab.applyI18n() 同步。
 * ========================================================================== */
(function () {
  "use strict";

  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const SPECTRUM = ["#ff5d73", "#ff9e57", "#ffd166", "#7bd389", "#4cc9f0", "#5b7bf0", "#b15bf0"];

  // 各演示的参数（默认初始值）
  const params = {
    prism:   { angle: 38, apex: 62, dispersion: 55 },
    slit:    { d: 1.2, lambda: 540, L: 360 },
    refract: { angle: 42, n: 1.5 },
  };

  // 控制项定义（标签用英文，光学参数国际通用）
  const CONTROLS = {
    prism: [
      { id: "angle", label: "Incidence angle", min: 0, max: 80, step: 1, unit: "°" },
      { id: "apex", label: "Prism apex", min: 30, max: 90, step: 1, unit: "°" },
      { id: "dispersion", label: "Dispersion", min: 0, max: 100, step: 1, unit: "%" },
    ],
    slit: [
      { id: "d", label: "Slit gap", min: 0.3, max: 3, step: 0.1, unit: "" },
      { id: "lambda", label: "Wavelength", min: 380, max: 700, step: 5, unit: " nm" },
      { id: "L", label: "Screen distance", min: 200, max: 600, step: 10, unit: "" },
    ],
    refract: [
      { id: "angle", label: "Incidence angle", min: 0, max: 89, step: 1, unit: "°" },
      { id: "n", label: "Refractive index", min: 1.0, max: 2.5, step: 0.05, unit: "" },
    ],
  };

  // 说明文案（en / zh；nl / de 回退到 en）
  const NOTES = {
    prism: {
      en: "White light splits into a spectrum because each wavelength bends by a slightly different amount — violet refracts more than red. This is dispersion.",
      zh: "白光被分解成光谱，是因为不同波长被折射的程度略有不同——紫光比红光偏折更多。这就是色散。",
    },
    slit: {
      en: "Two coherent waves overlap. Crest-meets-crest gives bright fringes; crest-meets-trough gives dark ones. A wider slit gap makes the fringes tighter.",
      zh: "两缝发出的相干波叠加：波峰遇波峰成亮纹，波峰遇波谷成暗纹。缝距越大，条纹越密。",
    },
    refract: {
      en: "At a boundary, light bends by Snell's law n1·sinθ1 = n2·sinθ2. Beyond the critical angle it totally reflects instead of transmitting.",
      zh: "在界面处，光按斯涅尔定律 n1·sinθ1 = n2·sinθ2 偏折。超过临界角时，光发生全反射而不再透出。",
    },
  };

  let mode = "prism";
  let canvas, ctx, W = 0, H = 0, dpr = 1;
  let raf = 0, paused = false;

  function reducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function getLang() {
    const l = (document.documentElement.lang || "en").slice(0, 2);
    return NOTES[mode] && NOTES[mode][l] ? l : "en";
  }
  function fmt(v) {
    return Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/\.?0+$/, "");
  }

  // ---------- 背景 + 网格（演示台自带暗底，任何主题都好看） ----------
  function drawBackground() {
    const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.72);
    bg.addColorStop(0, "rgba(15,19,36,.97)");
    bg.addColorStop(1, "rgba(8,11,22,.98)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(255,255,255,.045)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 38) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 38) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  }

  // ---------- 波长 → RGB（用于双缝着色） ----------
  function wavelengthToRGB(wl) {
    let r = 0, g = 0, b = 0;
    if (wl >= 380 && wl < 440) { r = -(wl - 440) / 60; b = 1; }
    else if (wl < 490) { g = (wl - 440) / 50; b = 1; }
    else if (wl < 510) { g = 1; b = -(wl - 510) / 20; }
    else if (wl < 580) { r = (wl - 510) / 70; g = 1; }
    else if (wl < 645) { r = 1; g = -(wl - 645) / 65; }
    else if (wl <= 780) { r = 1; }
    let f = 1;
    if (wl < 420) f = 0.3 + 0.7 * (wl - 380) / 40;
    else if (wl > 700) f = 0.3 + 0.7 * (780 - wl) / 80;
    const G = 0.8;
    return `rgb(${Math.round(255 * Math.pow(r * f, G))},${Math.round(255 * Math.pow(g * f, G))},${Math.round(255 * Math.pow(b * f, G))})`;
  }

  // ---------- 演示一：棱镜色散 ----------
  function drawPrism(time) {
    const p = params.prism;
    drawBackground();
    const cx = W * 0.40, cy = H * 0.50;
    const R = Math.min(W, H) * 0.20;
    const apex = p.apex * Math.PI / 180;
    const bw = R * Math.tan(apex / 2);
    const Rb = R * 0.85;
    const top = { x: cx, y: cy - R };
    const lb = { x: cx - bw, y: cy + Rb };
    const rb = { x: cx + bw, y: cy + Rb };
    const P1 = { x: (top.x + lb.x) / 2, y: (top.y + lb.y) / 2 };
    const P2 = { x: (top.x + rb.x) / 2, y: (top.y + rb.y) / 2 };

    // 玻璃棱镜
    ctx.save();
    const g = ctx.createLinearGradient(top.x, top.y, top.x, lb.y);
    g.addColorStop(0, "rgba(255,255,255,.16)");
    g.addColorStop(1, "rgba(150,195,255,.06)");
    ctx.beginPath();
    ctx.moveTo(top.x, top.y); ctx.lineTo(rb.x, rb.y); ctx.lineTo(lb.x, lb.y); ctx.closePath();
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = "rgba(200,225,255,.55)"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();

    // 入射白光（与水平成 angle 角，指向 P1）
    const a = p.angle * Math.PI / 180;
    const L0 = 280;
    const inS = { x: P1.x - Math.cos(a) * L0, y: P1.y - Math.sin(a) * L0 };
    ctx.strokeStyle = "rgba(235,242,255,.9)"; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(inS.x, inS.y); ctx.lineTo(P1.x, P1.y); ctx.stroke();
    // 棱镜内折射（P1 → P2）
    ctx.beginPath(); ctx.moveTo(P1.x, P1.y); ctx.lineTo(P2.x, P2.y); ctx.stroke();

    // 出射色散扇形
    const spread = (p.dispersion / 100) * 26 * Math.PI / 180;
    const baseOut = 8 * Math.PI / 180;
    const breath = reducedMotion() ? 1 : 0.78 + 0.22 * Math.sin(time / 600);
    const len = Math.max(W - P2.x, 130);
    for (let i = 0; i < SPECTRUM.length; i++) {
      const dev = (i - (SPECTRUM.length - 1) / 2) * (spread / (SPECTRUM.length - 1));
      const ang = baseOut + dev;
      const ex = P2.x + Math.cos(ang) * len;
      const ey = P2.y + Math.sin(ang) * len;
      ctx.strokeStyle = SPECTRUM[i];
      ctx.globalAlpha = breath;
      ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(P2.x, P2.y); ctx.lineTo(ex, ey); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // 行进光子
    if (!reducedMotion()) {
      const ph = (time / 1500) % 1;
      const px = inS.x + (P1.x - inS.x) * ph;
      const py = inS.y + (P1.y - inS.y) * ph;
      ctx.fillStyle = "#fff"; ctx.shadowColor = "#fff"; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // ---------- 演示二：双缝干涉 ----------
  function drawSlit(time) {
    const p = params.slit;
    drawBackground();
    const cx = W * 0.5;
    const sy = H * 0.30;                       // 缝所在高度
    const gap = p.d * 60;                       // 像素缝距
    const s1 = { x: cx - gap / 2, y: sy };
    const s2 = { x: cx + gap / 2, y: sy };

    // 屏障（留两缝缺口）
    ctx.strokeStyle = "rgba(200,225,255,.4)"; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, sy); ctx.lineTo(s1.x - 7, sy);
    ctx.moveTo(s1.x + 7, sy); ctx.lineTo(s2.x - 7, sy);
    ctx.moveTo(s2.x + 7, sy); ctx.lineTo(W - 40, sy);
    ctx.stroke();

    // 从两缝扩散的球面波前
    if (!reducedMotion()) {
      const rr = (time / 1000 * 130) % 280;
      ctx.strokeStyle = "rgba(120,170,255,.32)"; ctx.lineWidth = 1.2;
      [s1, s2].forEach((s) => {
        for (let k = 0; k < 3; k++) {
          const rad = rr - k * 75;
          if (rad > 0) { ctx.beginPath(); ctx.arc(s.x, s.y, rad, 0, Math.PI); ctx.stroke(); }
        }
      });
    }

    // 屏幕上的干涉强度分布
    const screenY = H * 0.62;
    const col = wavelengthToRGB(p.lambda);
    const k = (Math.PI * p.d) / (p.lambda / 100) / (p.L / 100);
    for (let x = 40; x <= W - 40; x += 2) {
      const phase = (x - cx) * k * 0.06;
      const I = Math.cos(phase) * Math.cos(phase);
      const hgt = I * (H - screenY) * 0.9;
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.22 + 0.72 * I;
      ctx.fillRect(x, screenY, 2, hgt);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "rgba(200,225,255,.45)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(40, screenY); ctx.lineTo(W - 40, screenY); ctx.stroke();

    // 波长标注
    ctx.fillStyle = "rgba(235,242,255,.7)";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText("λ = " + p.lambda + " nm", 44, sy - 14);
  }

  // ---------- 演示三：折射 / 全反射 ----------
  function drawRefract(time) {
    const p = params.refract;
    drawBackground();
    const cx = W * 0.5, midY = H * 0.5;

    // 界面
    ctx.strokeStyle = "rgba(200,225,255,.3)"; ctx.lineWidth = 1.5; ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(40, midY); ctx.lineTo(W - 40, midY); ctx.stroke();
    ctx.setLineDash([]);
    // 法线
    ctx.strokeStyle = "rgba(200,225,255,.22)"; ctx.setLineDash([4, 5]);
    ctx.beginPath(); ctx.moveTo(cx, midY - 130); ctx.lineTo(cx, midY + 130); ctx.stroke();
    ctx.setLineDash([]);
    // 介质标注
    ctx.fillStyle = "rgba(235,242,255,.45)"; ctx.font = "12px Inter, sans-serif";
    ctx.fillText("air  n₁ = 1.0", 46, midY - 12);
    ctx.fillText("medium  n₂ = " + p.n.toFixed(2), 46, midY + 26);

    const a = p.angle * Math.PI / 180;
    const Llen = Math.min(W, H) * 0.32;
    const O = { x: cx, y: midY };
    const inS = { x: cx - Math.sin(a) * Llen, y: midY - Math.cos(a) * Llen };

    // 入射光
    ctx.strokeStyle = "rgba(235,242,255,.92)"; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(inS.x, inS.y); ctx.lineTo(O.x, O.y); ctx.stroke();
    // 反射光
    const reflE = { x: cx + Math.sin(a) * Llen, y: midY - Math.cos(a) * Llen };
    ctx.strokeStyle = "rgba(180,210,255,.85)";
    ctx.beginPath(); ctx.moveTo(O.x, O.y); ctx.lineTo(reflE.x, reflE.y); ctx.stroke();

    const sinb = Math.sin(a) / p.n;
    let tir = false;
    if (sinb <= 1) {
      const b = Math.asin(sinb);
      const refrE = { x: cx + Math.sin(b) * Llen, y: midY + Math.cos(b) * Llen };
      ctx.strokeStyle = "rgba(120,220,255,.92)";
      ctx.beginPath(); ctx.moveTo(O.x, O.y); ctx.lineTo(refrE.x, refrE.y); ctx.stroke();
    } else {
      // 全反射：光折回介质下方
      tir = true;
      const tirE = { x: cx - Math.sin(a) * Llen, y: midY + Math.cos(a) * Llen };
      ctx.strokeStyle = "rgba(255,150,180,.95)"; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(O.x, O.y); ctx.lineTo(tirE.x, tirE.y); ctx.stroke();
      ctx.lineWidth = 2.2;
    }

    // 角度弧标注
    drawArc(O, -Math.PI / 2, -Math.PI / 2 + a, 32, "θ₁");
    const sinb2 = Math.sin(a) / p.n;
    if (sinb2 <= 1) {
      const b = Math.asin(sinb2);
      drawArc(O, Math.PI / 2 - b, Math.PI / 2, 32, "θ₂");
    } else {
      ctx.fillStyle = "rgba(255,170,190,.95)"; ctx.font = "12px Inter, sans-serif";
      ctx.fillText("TIR", O.x + 40, O.y + 18);
    }

    // 行进光子
    if (!reducedMotion()) {
      const ph = (time / 1700) % 1;
      const px = inS.x + (O.x - inS.x) * ph;
      const py = inS.y + (O.y - inS.y) * ph;
      ctx.fillStyle = "#fff"; ctx.shadowColor = "#fff"; ctx.shadowBlur = 9;
      ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function drawArc(O, from, to, r, label) {
    ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(O.x, O.y, r, from, to); ctx.stroke();
    const mid = (from + to) / 2;
    ctx.fillStyle = "rgba(235,242,255,.85)"; ctx.font = "12px Inter, sans-serif";
    ctx.fillText(label, O.x + Math.cos(mid) * (r + 9), O.y + Math.sin(mid) * (r + 9));
  }

  // ---------- 渲染循环 ----------
  function drawStatic() {
    if (mode === "prism") drawPrism(0);
    else if (mode === "slit") drawSlit(0);
    else drawRefract(0);
  }
  function loop(time) {
    raf = requestAnimationFrame(loop);
    if (paused) return;
    if (mode === "prism") drawPrism(time);
    else if (mode === "slit") drawSlit(time);
    else drawRefract(time);
  }

  // ---------- 控制项 + 说明 ----------
  function renderControls() {
    const box = document.getElementById("labControls");
    if (!box) return;
    box.innerHTML = "";
    CONTROLS[mode].forEach((c) => {
      const v = params[mode][c.id];
      const wrap = document.createElement("div");
      wrap.className = "lab__ctrl";
      const lab = document.createElement("label");
      lab.innerHTML = `<span>${c.label}</span><span class="lab__val" data-v="${c.id}">${fmt(v)}${c.unit}</span>`;
      const inp = document.createElement("input");
      inp.type = "range"; inp.min = c.min; inp.max = c.max; inp.step = c.step; inp.value = v;
      inp.setAttribute("aria-label", c.label);
      inp.dataset.id = c.id;
      inp.addEventListener("input", () => {
        params[mode][c.id] = parseFloat(inp.value);
        const vEl = box.querySelector(`[data-v="${c.id}"]`);
        if (vEl) vEl.textContent = fmt(params[mode][c.id]) + c.unit;
        if (mode === "refract") renderNote();
      });
      wrap.appendChild(lab); wrap.appendChild(inp); box.appendChild(wrap);
    });
  }
  function renderNote() {
    const el = document.getElementById("labNote");
    if (!el) return;
    const l = getLang();
    let txt = (NOTES[mode] && NOTES[mode][l]) || NOTES[mode].en;
    if (mode === "refract") {
      const nc = params.refract.n;
      const crit = nc > 1 ? (Math.asin(1 / nc) * 180 / Math.PI).toFixed(1) : "—";
      const extra = l === "zh"
        ? `（当前介质折射率 ${nc.toFixed(2)}，临界角 ≈ ${crit}°）`
        : `(medium n = ${nc.toFixed(2)}, critical angle ≈ ${crit}°)`;
      txt += " " + extra;
    }
    el.textContent = txt;
  }

  // ---------- 尺寸 ----------
  function resize() {
    const r = canvas.getBoundingClientRect();
    W = r.width || 800;
    H = r.height || 420;
    dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reducedMotion() || paused) drawStatic();
  }

  // ---------- 事件 ----------
  function bindEvents() {
    const tabs = document.getElementById("labTabs");
    if (tabs) {
      tabs.addEventListener("click", (e) => {
        const b = e.target.closest(".lab__tab");
        if (!b) return;
        mode = b.dataset.lab;
        $$(".lab__tab", tabs).forEach((t) => {
          const on = t === b;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", String(on));
        });
        renderControls();
        renderNote();
      });
    }
    window.addEventListener("resize", resize);
  }

  function init() {
    canvas = document.getElementById("labCanvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    resize();
    renderControls();
    renderNote();
    bindEvents();

    // 进入视口才运行动画，离开即暂停（省电）
    const sec = document.getElementById("optics-lab");
    if (sec && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => {
        const vis = es[0].isIntersecting;
        paused = !vis;
        if (vis && reducedMotion()) drawStatic();
      }, { threshold: 0.05 });
      io.observe(sec);
    }

    if (reducedMotion()) drawStatic();
    else raf = requestAnimationFrame(loop);
  }

  // 暴露给 main.js：语言切换时同步说明文案
  window.OpticsLab = { applyI18n: renderNote };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
