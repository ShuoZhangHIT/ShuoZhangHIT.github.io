/* =============================================================================
 *  main.js  ——  渲染与交互
 * ========================================================================== */
(function () {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* 当前语言：默认英文（学术/申请场景），可在本地存储切换 */
  let lang = localStorage.getItem("lang") || "en";
  document.documentElement.lang = lang;

  /* 取值：对象按语言，字符串原样返回 */
  const t = (v) => (v && typeof v === "object" ? (v[lang] ?? v.en) : v);

  /* ---------------------------- 应用界面文案 ---------------------------- */
  function applyI18n() {
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (I18N[lang] && I18N[lang][key] != null) el.textContent = I18N[lang][key];
    });
    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (I18N[lang] && I18N[lang][key] != null) el.setAttribute("placeholder", I18N[lang][key]);
    });
  }

  /* ---------------------------- 绑定个人字段 ---------------------------- */
  // 把文本按词拆成带递增延迟的 <span>，实现首屏副标题逐词浮现（语言切换会自动重播）
  function setWords(el, text) {
    let wi = 0;
    const tokens = String(text).split(/(\s+)/);
    el.innerHTML = tokens.map((tok) => {
      if (/^\s+$/.test(tok)) return tok;
      const delay = wi * 60; wi++;
      return `<span class="word" style="animation-delay:${delay}ms">${tok}</span>`;
    }).join("");
  }

  function bindProfile() {
  $$('[data-bind="name"]').forEach((el) => (el.textContent = SITE.profile.name));
  $$('[data-bind="nameShort"]').forEach((el) => (el.textContent = SITE.profile.name));
  $$('[data-bind="alias"]').forEach((el) => { el.textContent = SITE.profile.alias ? " (" + SITE.profile.alias + ")" : ""; });
    $$('[data-bind="title"]').forEach((el) => setWords(el, t(SITE.profile.title)));
  $$('[data-bind="affiliation"]').forEach((el) => (el.textContent = t(SITE.profile.affiliation)));
  $$('[data-bind="researchStatement"]').forEach((el) => (el.textContent = t(SITE.profile.researchStatement)));
  renderHeroBadges();
  }

  /* ----------------------- Hero 学术徽章（ORCID / Scholar / arXiv / GitHub） ----------------------- */
  /* 仅渲染 links 中已填真实地址的徽章；缺省自动隐藏，绝不留假链接 */
  function renderHeroBadges() {
    const box = $("#heroBadges");
    if (!box) return;
    const L = SITE.profile.links || {};
    const defs = [
      { key: "orcid", label: "ORCID", href: L.orcid, color: "#A6CE39",
        icon: '<svg viewBox="0 0 256 256" width="14" height="14" aria-hidden="true"><circle cx="128" cy="128" r="128" fill="#A6CE39"/><path fill="#fff" d="M86.5 186h-30V113.5h30V186zM71 103.5c-9.4 0-17-7.6-17-17s7.6-17 17-17 17 7.6 17 17-7.6 17-17 17zM170.5 186h-29.5v-49.5c0-12-4.5-20-15.5-20-9.5 0-15.5 7-15.5 21v48.5h-29.5V113.5h29.5v9c5-7 13-11 23-11 19 0 33 12.5 33 38.5V186z"/></svg>' },
      { key: "googleScholar", label: "Google Scholar", href: L.googleScholar, color: "#4285F4",
        icon: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="#4285F4"><path d="M12 3 1 9l11 6 9-4.91V17h2V9zM5 13.18v4L12 21l7-3.82v-4L12 17z"/></svg>' },
      { key: "arxiv", label: "arXiv", href: L.arxiv, color: "#B31B1B",
        icon: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="#B31B1B"><path d="M4 5h16v14H4zM7 8v8h2V8zm4 0v8h2V8zm4 1.5 2 2.5-2 2.5v-5z"/></svg>' },
      { key: "github", label: "GitHub", href: L.github, color: "#8b949e",
        icon: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.7 18 5 18 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>' },
    ];
    box.innerHTML = "";
    defs.forEach((d) => {
      if (!d.href || !String(d.href).trim()) return;
      const a = document.createElement("a");
      a.className = "hbadge";
      a.href = d.href;
      a.target = "_blank";
      a.rel = "noopener";
      a.style.setProperty("--bc", d.color);
      a.setAttribute("aria-label", d.label);
      a.innerHTML = `${d.icon}<span>${d.label}</span>`;
      box.appendChild(a);
    });
  }

  /* 把 **x** 转成 <b>x</b>（用于作者高亮自己） */
  function bold(text) {
    return text.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  }

  /* ------------------------------- 关于 -------------------------------- */
  function renderAbout() {
    const box = $("#aboutText");
    box.innerHTML = "";
    t(SITE.about).forEach((p) => {
      const el = document.createElement("p");
      el.textContent = p;
      box.appendChild(el);
    });

    const tl = $("#timeline");
    tl.innerHTML = "";
    SITE.timeline.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="yr">${item.year}</span><span class="tx">${t(item.text)}</span>`;
      tl.appendChild(li);
    });
  }

  /* ----------------------------- 研究兴趣卡片 ----------------------------- */
  function renderInterests() {
    const box = $("#interests");
    box.innerHTML = "";
    const palette = ["var(--s-red)","var(--s-orange)","var(--s-yellow)","var(--s-green)","var(--s-cyan)","var(--s-blue)","var(--s-violet)"];
    SITE.interests.forEach((it, i) => {
      const card = document.createElement("div");
      card.className = "interest interest--clickable";
      card.style.setProperty("--accent", palette[i % palette.length]);
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", t(it) + " — " + t2("field.explore"));
      card.innerHTML = `
        <span class="card-shine" aria-hidden="true"></span><span class="card-neon" aria-hidden="true"></span>
        <div class="idx">0${i + 1}</div>
        <h3>${t(it)}</h3>
        <p>${t(it.insight)}</p>
        <span class="interest__more">${t2("field.explore")} →</span>`;
      const open = () => openFieldModal(it.field);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
      box.appendChild(card);
    });
  }

  /* --------------------------- 研究兴趣详情弹窗 --------------------------- */
  function openFieldModal(field) {
    const it = SITE.interests.find((x) => x.field === field);
    if (!it) return;
    const box = $("#fieldModalContent");
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue("--spectrum").trim() || "var(--spectrum)";

    const pubs = SITE.publications.filter((p) => p.field === field);
    const posts = SITE.posts.filter((p) => p.field === field && p.url);

    let html = `<h3 class="fm__title" id="fieldModalTitle">${t(it)}</h3>`;
    html += `<div class="fm__sub">${t(SITE.profile.name)} · ${t(it)}</div>`;
    html += `<p class="fm__insight">${t(it.insight)}</p>`;

    html += `<div class="fm__h">${t2("field.pubs")}</div>`;
    if (pubs.length) {
      html += `<ul class="fm__list">` + pubs.map((p) =>
        `<li class="fm__item">${p.title}<div class="v">${p.venue} · ${p.year}</div></li>`
      ).join("") + `</ul>`;
    } else {
      html += `<p class="fm__empty">${t2("field.pubsEmpty")}</p>`;
    }

    html += `<div class="fm__h">${t2("field.notes")}</div>`;
    if (posts.length) {
      html += `<ul class="fm__list">` + posts.map((p) =>
        `<li class="fm__item"><a href="${p.url}" target="_blank" rel="noopener">${p.title} →</a><div class="v">${p.date}</div></li>`
      ).join("") + `</ul>`;
    } else {
      html += `<p class="fm__empty">${t2("field.notesEmpty")}</p>`;
    }

    box.innerHTML = html;
    const modal = $("#fieldModal");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal(el) {
    if (!el || !el.classList.contains("open")) return;
    el.classList.remove("open");
    el.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function closeAllModals() {
    closeModal($("#fieldModal"));
    closeModal($("#projectModal"));
  }

  function initModal() {
    $$("#fieldModal [data-close], #projectModal [data-close]").forEach((el) =>
      el.addEventListener("click", closeAllModals));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAllModals(); });
  }

  /* ------------------------------- 论文 -------------------------------- */
  /* 论文筛选状态：类型 / 年份 / 关键词，三者取交集 */
  const pubState = { type: "all", year: "all", query: "" };

  function getPubs() {
    const q = pubState.query.trim().toLowerCase();
    return SITE.publications
      .filter((p) => {
        if (pubState.type !== "all" && p.type !== pubState.type) return false;
        if (pubState.year !== "all" && String(p.year) !== String(pubState.year)) return false;
        if (q) {
          const hay = [p.title, p.authors, p.venue, t(p.status), p.number || ""].join(" ").toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  }

  function renderPublications() {
    const list = $("#pubList");
    const items = getPubs();
    list.innerHTML = "";

    items.forEach((p) => {
      const li = document.createElement("li");
      li.className = "pub";
      const idx = SITE.publications.indexOf(p);
      const links = [];
      if (p.links?.pdf)  links.push(`<a class="pub__link" href="${p.links.pdf}" target="_blank" rel="noopener">${t2("pub.pdf")}</a>`);
      if (p.links?.doi)  links.push(`<a class="pub__link" href="${p.links.doi}" target="_blank" rel="noopener">${t2("pub.doi")}</a>`);
      if (p.links?.code) links.push(`<a class="pub__link" href="${p.links.code}" target="_blank" rel="noopener">${t2("pub.code")}</a>`);
      links.push(`<button class="pub__link pub__cite" type="button" data-idx="${idx}">${t2("pub.cite")}</button>`);
      let badge, venueLine;
      if (p.type === "patent") {
        badge = `<span class="badge badge--patent">${t2("pub.patent")}</span>`;
        venueLine = `<span class="pub__status">${t(p.status)}</span><span>· ${p.number}</span>`;
      } else if (p.type === "journal") {
        badge = `<span class="badge badge--journal">${t2("pub.journal")}</span>`;
        venueLine = `<span class="pub__venue">${p.venue}</span>`;
      } else {
        badge = `<span class="badge badge--conference">${t2("pub.conference")}</span>`;
        venueLine = `<span class="pub__venue">${p.venue}</span>`;
      }
      const cite = (p.citations && p.citations > 0)
        ? `<span class="pub__cite">${p.citations} ${t2("pub.citations")}</span>`
        : "";
      li.innerHTML = `
        <span class="card-shine" aria-hidden="true"></span><span class="card-neon" aria-hidden="true"></span>
        <div></div>
        <div class="pub__body">
          <div class="pub__title">${p.title}</div>
          <div class="pub__authors">${bold(p.authors)}</div>
          <div class="pub__meta">
            ${venueLine}
            <span>· ${p.year}</span>
            ${badge}
            ${cite}
            <span class="pub__links">${links.join("")}</span>
          </div>
        </div>`;
      list.appendChild(li);
      const citeBtn = li.querySelector(".pub__cite");
      if (citeBtn) citeBtn.addEventListener("click", () => copyCitation(p, citeBtn));
    });

    const empty = $("#pubEmpty");
    if (!items.length) {
      list.innerHTML = "";
      if (empty) { empty.textContent = t2("pub.noResults"); empty.hidden = false; }
    } else if (empty) {
      empty.hidden = true;
    }

    const count = $("#pubCount");
    if (count) count.textContent = items.length + " " + t2("pub.results");
  }
  /* ------------------- 论文统计条（总引用 / h-index）+ Scholar 入口 ------------------- */
  function renderPubStats() {
    const box = $("#pubStats");
    if (box) {
      const cits = SITE.publications.map((p) => p.citations || 0);
      const total = cits.reduce((a, b) => a + b, 0);
      const sorted = [...cits].sort((a, b) => b - a);
      let h = 0;
      for (let i = 0; i < sorted.length; i++) {
        if (sorted[i] >= i + 1) h = i + 1; else break;
      }
      box.innerHTML =
        `<div class="pub-stat"><span class="pub-stat__num">${total}</span><span class="pub-stat__label">${t2("pub.totalCitations")}</span></div>` +
        `<div class="pub-stat"><span class="pub-stat__num">${h}</span><span class="pub-stat__label">${t2("pub.hindex")}</span></div>`;
    }
    const sch = $("#pubScholar");
    if (sch) {
      const url = SITE.profile.links?.googleScholar;
      if (url) { sch.href = url; sch.hidden = false; } else { sch.hidden = true; }
    }
  }

  /* ------------------------- 复制引文（BibTeX）+ 轻提示 ------------------------- */
  let toastTimer;
  function showToast(msg) {
    let el = $("#toast");
    if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
  }
  function fallbackCopy(text, cb) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta); cb && cb();
  }
  function copyCitation(p, btn) {
    const plain = (p.authors || "").replace(/\*\*/g, "").trim();
    const author = plain.replace(/\set al\.?$/i, " and others").replace(/,$/, "");
    const year = p.year;
    const first = (plain.split(/\s+/)[0] || "author").toLowerCase().replace(/[^a-z]/g, "");
    const kw = (p.title || "").split(/\s+/).find((w) => w.length > 3) || "paper";
    const key = (first + year + kw).toLowerCase().replace(/[^a-z0-9]/g, "");
    const bib = `@article{${key},\n  title = {${p.title}},\n  author = {${author}},\n  journal = {${p.venue}},\n  year = {${year}}${p.links?.doi ? ",\n  doi = {" + p.links.doi + "}" : ""}\n}`;
    const done = () => {
      if (btn) { const old = btn.textContent; btn.textContent = t2("pub.cited"); btn.classList.add("is-copied"); setTimeout(() => { btn.textContent = old; btn.classList.remove("is-copied"); }, 1600); }
      showToast(t2("pub.cited"));
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(bib).then(done).catch(() => fallbackCopy(bib, done));
    } else {
      fallbackCopy(bib, done);
    }
  }

  /* 文案取当前语言（用于 JS 内生成的文本） */
  function t2(key) { return I18N[lang][key] ?? key; }

  /* 年份筛选 chips（按数据动态生成） */
  function renderPubYears() {
    const box = $("#pubYears");
    if (!box) return;
    const years = [...new Set(SITE.publications.map((p) => p.year))].sort((a, b) => b - a);
    let html = `<button class="chip is-active" data-year="all" data-i18n="pub.allYears">${t2("pub.allYears")}</button>`;
    html += years.map((y) => `<button class="chip" data-year="${y}">${y}</button>`).join("");
    box.innerHTML = html;
    $$("#pubYears .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$("#pubYears .chip").forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        pubState.year = chip.dataset.year;
        renderPublications();
      });
    });
  }

  /* 论文筛选 */
  function initPubFilters() {
    $$("#pubFilters .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$("#pubFilters .chip").forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        pubState.type = chip.dataset.filter;
        renderPublications();
      });
    });
    renderPubYears();
    const s = $("#pubSearch");
    if (s) {
      s.addEventListener("input", () => {
        pubState.query = s.value;
        renderPublications();
      });
    }
  }

  /* ------------------------------- 项目 -------------------------------- */
  /* 按研究领域聚合为可点击卡片，点开弹窗列出该领域的具体项目 */
  function renderProjects() {
    const box = $("#projectList");
    box.innerHTML = "";
    const palette = ["var(--s-red)","var(--s-orange)","var(--s-yellow)","var(--s-green)","var(--s-cyan)","var(--s-blue)","var(--s-violet)"];
    SITE.interests.forEach((it, i) => {
      const projs = SITE.projects.filter((p) => p.field === it.field);
      if (!projs.length) return;
      const card = document.createElement("div");
      card.className = "interest interest--clickable";
      card.style.setProperty("--accent", palette[i % palette.length]);
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", t(it) + " — " + t2("project.explore"));
      const n = projs.length;
      const preview = projs[0].title;
      card.innerHTML = `
        <span class="card-shine" aria-hidden="true"></span><span class="card-neon" aria-hidden="true"></span>
        <div class="idx">0${i + 1}</div>
        <h3>${t(it)}</h3>
        <p class="pfield__count">${n} ${t2("project.nProjects")}</p>
        <p class="pfield__preview">${preview}</p>
        <span class="interest__more">${t2("project.explore")} →</span>`;
      const open = () => openProjectModal(it.field);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
      box.appendChild(card);
    });
  }

  /* --------------------------- 项目详情弹窗 --------------------------- */
  /* idx === null → 列出该领域项目；否则 → 单个项目的深度案例视图 */
  function openProjectModal(field, idx = null) {
    const it = SITE.interests.find((x) => x.field === field);
    if (!it) return;
    const box = $("#projectModalContent");
    const projs = SITE.projects.filter((p) => p.field === field);

    if (idx === null) {
      /* —— 列表视图 —— */
      let html = `<h3 class="fm__title" id="projectModalTitle">${t(it)}</h3>`;
      html += `<div class="fm__sub">${t2("project.inArea")}</div>`;
      html += `<p class="fm__insight">${t(it.insight)}</p>`;
      html += `<div class="fm__h">${t2("project.list")}</div>`;
      if (projs.length) {
        html += `<div class="pjlist">` + projs.map((p, i) => {
          const c = SITE.projectCases[p.title] || {};
          const tags = (p.tags || []).map((x) => `<span>${x}</span>`).join("");
          const links = [];
          if (p.links?.github) links.push(`<a href="${p.links.github}" target="_blank" rel="noopener">${t2("project.code")}</a>`);
          if (p.links?.demo)   links.push(`<a href="${p.links.demo}" target="_blank" rel="noopener">${t2("project.demo")}</a>`);
          if (p.links?.doi)    links.push(`<a href="${p.links.doi}" target="_blank" rel="noopener">${t2("pub.doi")}</a>`);
          const status = c.status ? `<span class="case__badge case__badge--${c.status}">${t2("project.status." + c.status)}</span>` : "";
          return `<div class="pj pj--case">
            <div class="pj__head">
              <div>
                <div class="pj__title">${p.title}</div>
                <div class="pj__period">${p.period} ${status}</div>
              </div>
              <button class="pj__open" data-case="${i}">${t2("project.viewCase")} →</button>
            </div>
            <p class="pj__desc">${t(p.desc)}</p>
            <div class="tags">${tags}</div>
            <div class="plinks">${links.join("")}</div>
          </div>`;
        }).join("") + `</div>`;
      } else {
        html += `<p class="fm__empty">${t2("project.empty")}</p>`;
      }
      box.innerHTML = html;
      box.querySelectorAll("[data-case]").forEach((b) =>
        b.addEventListener("click", () => openProjectModal(field, parseInt(b.dataset.case, 10))));
    } else {
      /* —— 深度案例视图 —— */
      const p = projs[idx];
      const c = SITE.projectCases[p.title] || {};
      const total = projs.length;
      const prev = (idx - 1 + total) % total;
      const next = (idx + 1) % total;
      const tags = (p.tags || []).map((x) => `<span>${x}</span>`).join("");
      const links = [];
      if (p.links?.github) links.push(`<a href="${p.links.github}" target="_blank" rel="noopener">${t2("project.code")}</a>`);
      if (p.links?.demo)   links.push(`<a href="${p.links.demo}" target="_blank" rel="noopener">${t2("project.demo")}</a>`);
      if (p.links?.doi)    links.push(`<a href="${p.links.doi}" target="_blank" rel="noopener">${t2("pub.doi")}</a>`);
      const status = c.status ? `<span class="case__badge case__badge--${c.status}">${t2("project.status." + c.status)}</span>` : "";
      const approach = (c.approach || []).map((a) => `<li>${t(a)}</li>`).join("");
      const metrics = (c.metrics && c.metrics.length) ? `<div class="case__metrics">
          <div class="case__metrics-h">${t2("project.relatedMetrics")}</div>
          ${c.metrics.map((m) => {
            const pct = Math.max(2, Math.min(100, (m.value / m.max) * 100));
            const unit = m.unit ? " " + t(m.unit) : "";
            return `<div class="metric">
              <div class="metric__top"><span>${t(m.label)}</span><span class="metric__val">${m.value}${unit}</span></div>
              <div class="metric__track"><div class="metric__bar" style="width:${pct}%"></div></div>
            </div>`;
          }).join("")}
        </div>` : "";
      const diagram = c.diagram ? projectDiagram(c.diagram) : "";

      let html = `<div class="case__top">
        <button class="case__back" data-back="1">← ${t2("project.back")}</button>
        <div class="case__counter">${t2("project.caseOf")} ${idx + 1} / ${total}</div>
        <div class="case__nav">
          <button class="case__arrow" data-case="${prev}" aria-label="Previous">‹</button>
          <button class="case__arrow" data-case="${next}" aria-label="Next">›</button>
        </div>
      </div>`;
      html += `<h3 class="fm__title case__title">${p.title}</h3>`;
      html += `<div class="case__meta">${p.period} ${status}</div>`;
      html += `<div class="case__body">
        <div class="case__left">
          <div class="case__fig">${diagram}</div>
          ${metrics}
        </div>
        <div class="case__right">
          ${c.role ? `<div class="case__role"><span class="case__k">${t2("project.caseRole")}</span>${t(c.role)}</div>` : ""}
          ${c.challenge ? `<div class="case__section"><div class="case__k">${t2("project.caseChallenge")}</div><p>${t(c.challenge)}</p></div>` : ""}
          ${approach ? `<div class="case__section"><div class="case__k">${t2("project.caseApproach")}</div><ul class="case__ul">${approach}</ul></div>` : ""}
          ${c.results ? `<div class="case__section"><div class="case__k">${t2("project.caseResults")}</div><p>${t(c.results)}</p></div>` : ""}
          <div class="case__section"><div class="case__k">${t2("project.tagsLabel")}</div><div class="tags">${tags}</div></div>
          ${links.length ? `<div class="case__section"><div class="case__k">${t2("project.linksLabel")}</div><div class="plinks">${links.join("")}</div></div>` : ""}
        </div>
      </div>`;
      box.innerHTML = html;
      box.querySelectorAll("[data-back]").forEach((b) => b.addEventListener("click", () => openProjectModal(field)));
      box.querySelectorAll("[data-case]").forEach((b) =>
        b.addEventListener("click", () => openProjectModal(field, parseInt(b.dataset.case, 10))));
    }

    const modal = $("#projectModal");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  /* ----------------------- 项目原理示意图（程序化 SVG） ----------------------- */
  function projectDiagram(type) {
    const c = "#5b8def", a = "#a06bff", r = "#ff5a5f", g = "#4cd964",
          y = "#ffd93d", o = "#ff9f43", cy = "#34d8e6", v = "#8a94b0";
    const W = 280, H = 168;
    const wrap = (s) => `<svg class="diag" viewBox="0 0 ${W} ${H}" role="img" aria-label="schematic diagram"><defs><linearGradient id="dg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${cy}"/><stop offset="1" stop-color="${a}"/></linearGradient></defs>${s}</svg>`;
    const L = (x, y, t, col) => `<text x="${x}" y="${y}" fill="${col || v}" font-size="8" font-family="Inter,sans-serif" text-anchor="middle">${t}</text>`;
    const B = (x1, y1, x2, y2, col) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col || c}" stroke-width="2"/>`;
    switch (type) {
      case "three-dof": return wrap(
        `<circle cx="32" cy="84" r="10" fill="url(#dg)"/>` + B(42, 84, 104, 84) +
        `<rect x="104" y="72" width="16" height="24" fill="none" stroke="${c}" stroke-width="2"/>` + L(112, 67, "BS", r) +
        B(120, 84, 184, 84) +
        `<rect x="184" y="68" width="40" height="32" fill="none" stroke="${a}" stroke-width="2"/>` + L(204, 63, "Target", a) +
        B(224, 77, 258, 46, g) + B(224, 84, 258, 84, y) + B(224, 91, 258, 122, o) +
        L(264, 44, "D", g) + L(264, 88, "θ", y) + L(264, 128, "φ", o));
      case "autocollimator": return wrap(
        `<circle cx="30" cy="84" r="9" fill="url(#dg)"/>` + B(39, 84, 112, 84) +
        `<path d="M112 66 Q146 84 112 102" fill="none" stroke="${c}" stroke-width="2"/>` + L(126, 120, "Lens", c) +
        B(112, 84, 206, 84) +
        `<line x1="206" y1="58" x2="206" y2="110" stroke="${r}" stroke-width="3"/>` + L(206, 52, "Mirror", r) +
        B(206, 84, 150, 128) + B(150, 128, 72, 118) +
        `<circle cx="72" cy="118" r="9" fill="none" stroke="${a}" stroke-width="2"/>` + L(72, 140, "Sensor", a) +
        `<path d="M150 128 q10 -8 22 0" fill="none" stroke="${v}" stroke-width="1.4" stroke-dasharray="3 3"/>` + L(161, 146, "error", v));
      case "ao-loop": return wrap(
        `<path d="M26 44 q14 -10 28 0 q14 10 28 0" fill="none" stroke="${v}" stroke-width="2"/>` + L(64, 34, "turbulence", v) +
        B(64, 54, 64, 78) +
        `<rect x="46" y="78" width="36" height="18" fill="none" stroke="${c}" stroke-width="2"/>` + L(64, 92, "SH sensor", c) +
        B(64, 96, 64, 118) +
        `<rect x="44" y="118" width="40" height="16" fill="none" stroke="${a}" stroke-width="2"/>` + L(64, 130, "Controller", a) +
        B(64, 134, 150, 134) +
        `<path d="M150 122 q14 12 28 0 q14 -12 28 0" fill="none" stroke="${g}" stroke-width="2"/>` + L(178, 152, "DM", g) +
        B(178, 122, 178, 96, g) +
        `<path d="M178 92 q18 -8 36 0 q18 8 36 0" fill="none" stroke="${g}" stroke-width="2"/>` + L(232, 84, "flat", g));
      case "dm": return wrap(
        `<path d="M30 86 q35 -20 70 0 q35 20 70 0 q35 -20 70 0" fill="none" stroke="${g}" stroke-width="2"/>` + L(165, 70, "mirror", g) +
        [55, 95, 135, 175, 215].map((x) => `<line x1="${x}" y1="92" x2="${x}" y2="126" stroke="${v}" stroke-width="1.4"/><circle cx="${x}" cy="130" r="4" fill="none" stroke="${c}" stroke-width="1.4"/>`).join("") +
        `<path d="M30 86 q35 -8 70 0 q35 8 70 0 q35 -8 70 0" fill="none" stroke="${a}" stroke-width="1.5" stroke-dasharray="3 3"/>` + L(165, 150, "influence fn", v));
      case "metalens": return wrap(
        Array.from({ length: 7 }).map((_, i) => `<rect x="${28 + i * 13}" y="80" width="8" height="20" rx="2" fill="${c}"/>`).join("") +
        B(18, 60, 128, 60) + L(73, 54, "plane wave", v) +
        `<path d="M128 60 Q172 60 210 108" fill="none" stroke="${a}" stroke-width="2"/>` +
        `<path d="M128 60 Q172 60 168 36" fill="none" stroke="${a}" stroke-width="2"/>` +
        `<circle cx="212" cy="110" r="3" fill="${a}"/>` + L(212, 124, "focus", a));
      case "meta-atom": return wrap(
        Array.from({ length: 4 }).map((_, rr) => Array.from({ length: 5 }).map((_, i) => { const rad = 2 + i * (rr % 2 ? 1.6 : 1); return `<rect x="${28 + i * 22}" y="${30 + rr * 26}" width="${rad * 2}" height="${rad * 2}" rx="1.5" fill="${c}"/>`; }).join("")).join("") +
        L(110, 158, "unit-cell → phase", v) +
        `<rect x="210" y="40" width="10" height="80" fill="none" stroke="${v}" stroke-width="1"/>` +
        `<rect x="210" y="40" width="10" height="20" fill="${y}"/>` + L(236, 84, "phase", v));
      case "soliton": return wrap(
        `<circle cx="130" cy="84" r="46" fill="none" stroke="${c}" stroke-width="2"/>` +
        `<circle cx="130" cy="38" r="9" fill="${a}"/>` + L(130, 22, "pulse", a) +
        B(60, 84, 84, 84, cy) + L(58, 76, "pump", cy) +
        L(130, 150, "microresonator", v));
      case "qpm": return wrap(
        Array.from({ length: 6 }).map((_, i) => `<line x1="${60 + i * 14}" y1="56" x2="${60 + i * 14}" y2="112" stroke="${c}" stroke-width="${i % 3 === 0 ? 3 : 1.5}"/>`).join("") +
        B(40, 70, 60, 70, r) + L(46, 64, "ω1", r) +
        B(40, 98, 60, 98, y) + L(46, 112, "ω2", y) +
        B(140, 84, 214, 84, g) + L(182, 76, "ω3", g) +
        L(100, 134, "QPM grating", v));
      case "superres": return wrap(
        `<path d="M70 50 L110 70 L110 110 L70 130 Z" fill="none" stroke="${c}" stroke-width="2"/>` + L(90, 144, "obj", c) +
        `<circle cx="120" cy="90" r="22" fill="none" stroke="${v}" stroke-width="1.5" stroke-dasharray="3 3"/>` +
        B(120, 90, 150, 90) +
        `<circle cx="188" cy="90" r="9" fill="none" stroke="${a}" stroke-width="2"/>` +
        L(120, 130, "blurry", v) + L(188, 112, "sharp", a));
      case "ptychography": return wrap(
        [0, 1, 2].map((rr) => [0, 1, 2].map((i) => `<circle cx="${40 + i * 30}" cy="${40 + rr * 26}" r="16" fill="none" stroke="${v}" stroke-width="1.2"/>`).join("")).join("") +
        `<path d="M130 58 L214 58 L214 132 L130 132 Z" fill="none" stroke="${g}" stroke-width="2"/>` +
        Array.from({ length: 3 }).map((_, rr) => Array.from({ length: 4 }).map((_, i) => `<rect x="${138 + i * 18}" y="${66 + rr * 18}" width="14" height="12" fill="${c}" opacity=".5"/>`).join("")).join("") +
        L(80, 138, "sample", v) + L(172, 148, "recon.", g));
      case "denoise": return wrap(
        `<rect x="22" y="54" width="34" height="28" fill="none" stroke="${v}" stroke-width="2"/>` + L(39, 96, "noisy", v) +
        [60, 84, 108].map((x, i) => `<circle cx="${x}" cy="${68 + i * 16}" r="5" fill="none" stroke="${c}" stroke-width="1.6"/>`).join("") +
        [60, 84, 108].map((x, i) => Array.from({ length: 3 }).map((_, j) => `<line x1="${x}" y1="${68 + i * 16}" x2="84" y2="${68 + j * 16}" stroke="${v}" stroke-width=".8"/>`).join("")).join("") +
        [60, 84, 108].map((x, i) => Array.from({ length: 3 }).map((_, j) => `<line x1="84" y1="${68 + i * 16}" x2="108" y2="${68 + j * 16}" stroke="${v}" stroke-width=".8"/>`).join("")).join("") +
        `<rect x="124" y="54" width="34" height="28" fill="none" stroke="${g}" stroke-width="2"/>` + L(141, 96, "clean", g) +
        `<path d="M158 102 q26 18 52 4" fill="none" stroke="${a}" stroke-width="1.4" stroke-dasharray="3 3"/>` + L(186, 126, "self-sup.", a));
      default: return wrap(`<text x="140" y="86" fill="${v}" font-size="10" font-family="Inter,sans-serif" text-anchor="middle">schematic</text>`);
    }
  }

  /* ------------------------------- 博客 -------------------------------- */
  let postQuery = "";
  let postField = "all";
  let postPage = 1;
  const POSTS_PER_PAGE = 5;
  function renderPosts() {
    const box = $("#postList");
    const nav = $("#postNav");
    box.innerHTML = "";
    nav.innerHTML = "";
    const q = postQuery.trim().toLowerCase();
    const match = (p) => !q || [p.title, t(p.excerpt), p.title].join(" ").toLowerCase().includes(q);
    const matchField = (p) => postField === "all" || p.field === postField;
    const pinned = SITE.posts.filter((p) => p.pinned && match(p) && matchField(p));
    const rest   = SITE.posts
      .filter((p) => !p.pinned && match(p) && matchField(p))
      .sort((a, b) => (b.date || "").localeCompare(a.date || "")); // 非置顶按日期倒序，形成时间线
    const ordered = pinned.concat(rest);
    if (!ordered.length) {
      box.innerHTML = `<p class="posts__empty">${t2("blog.empty")}</p>`;
      return;
    }
    const totalPages = Math.max(1, Math.ceil(ordered.length / POSTS_PER_PAGE));
    if (postPage > totalPages) postPage = totalPages;
    const start = (postPage - 1) * POSTS_PER_PAGE;
    const pageItems = ordered.slice(start, start + POSTS_PER_PAGE);
    pageItems.forEach((p) => {
      const hasUrl = !!p.url;
      const card = document.createElement("a");
      card.className = "post" + (p.pinned ? " post--pinned" : "");
      if (hasUrl) card.href = p.url;
      card.innerHTML = `
        <span class="card-shine" aria-hidden="true"></span><span class="card-neon" aria-hidden="true"></span>
        <span class="date">${p.date}</span>
        <div>
          <h3>${p.title}${p.pinned ? ` <span class="pin">${t2("blog.pinned")}</span>` : ""}</h3>
          <p>${t(p.excerpt)}</p>
        </div>
        <span class="go">${hasUrl ? t2("blog.read") + " →" : t2("blog.soon")}</span>`;
      box.appendChild(card);
    });
    renderPostNav(nav, totalPages);
  }

  /* 分页控件：上一页 / 页码窗口 / 下一页 */
  function renderPostNav(nav, totalPages) {
    if (totalPages <= 1) return;
    const mkBtn = (label, page, opts = {}) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "post-nav__btn" + (opts.current ? " is-current" : "") + (opts.disabled ? " is-disabled" : "");
      b.innerHTML = label;
      if (opts.aria) b.setAttribute("aria-label", opts.aria);
      if (!opts.disabled && !opts.current) b.addEventListener("click", () => goToPage(page));
      return b;
    };
    nav.appendChild(mkBtn("‹", postPage - 1, { disabled: postPage === 1, aria: t2("blog.prev") }));
    const pages = pageWindow(postPage, totalPages);
    pages.forEach((p) => {
      if (p === "…") {
        const span = document.createElement("span");
        span.className = "post-nav__gap";
        span.textContent = "…";
        nav.appendChild(span);
      } else {
        nav.appendChild(mkBtn(String(p), p, { current: p === postPage, aria: t2("blog.page") + " " + p }));
      }
    });
    nav.appendChild(mkBtn("›", postPage + 1, { disabled: postPage === totalPages, aria: t2("blog.next") }));
  }

  /* 页码窗口：始终显示首尾页 + 当前页及相邻页，其余用省略号 */
  function pageWindow(cur, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const set = new Set([1, total, cur, cur - 1, cur + 1]);
    const arr = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
    const out = [];
    let prev = 0;
    arr.forEach((n) => {
      if (n - prev > 1) out.push("…");
      out.push(n);
      prev = n;
    });
    return out;
  }

  function goToPage(page) {
    postPage = page;
    renderPosts();
    const top = $("#blog");
    if (top) top.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* 博客搜索 */
  function initPostSearch() {
    const inp = $("#postSearch");
    if (!inp) return;
    inp.addEventListener("input", () => {
      postQuery = inp.value || "";
      postPage = 1;
      renderPosts();
    });
  }

  /* 博客领域筛选：全部 + 各 field（由数据动态生成，与搜索、分页叠加） */
  function initPostFilters() {
    const box = $("#postFilters");
    if (!box) return;
    box.innerHTML = "";
    const order = ["precision", "adaptive", "metasurface", "nonlinear", "computational", "psychology", "economics", "sports"];
    const labels = {
      precision: "Precision", adaptive: "Adaptive Optics", metasurface: "Metasurface",
      nonlinear: "Nonlinear", computational: "Computational",
      psychology: "Psychology", economics: "Economics", sports: "Sports",
    };
    const fields = [...new Set(SITE.posts.map((p) => p.field).filter(Boolean))]
      .sort((a, b) => order.indexOf(a) - order.indexOf(b));
    const mk = (val, label, active) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (active ? " is-active" : "");
      b.dataset.filter = val;
      b.textContent = label;
      b.addEventListener("click", () => {
        $$("#postFilters .chip").forEach((c) => c.classList.remove("is-active"));
        b.classList.add("is-active");
        postField = val;
        postPage = 1;
        renderPosts();
      });
      return b;
    };
    box.appendChild(mk("all", t2("blog.all"), postField === "all"));
    fields.forEach((f) => box.appendChild(mk(f, labels[f] || f, postField === f)));
  }

  /* ----------------------------- 荣誉奖项 ----------------------------- */
  function renderHonors() {
    const box = $("#honorList");
    box.innerHTML = "";
    SITE.honors.forEach((h) => {
      const card = document.createElement("div");
      card.className = "honor";
      card.innerHTML = `<span class="honor__year">${h.year}</span><span class="honor__text">${t(h.text)}</span>`;
      box.appendChild(card);
    });
  }

  /* 成就墙：渲染计数卡（数字默认即最终值，无 JS / 减弱动效时也能正确显示） */
  let awardStatsReady = false;
  function renderAwardStats() {
    const box = $("#awardStats");
    if (!box) return;
    const stats = SITE.achievementStats || [];
    box.innerHTML = stats.map((s) => `
      <div class="award-stat">
        <div class="award-stat__num" data-count="${s.value}">${s.value}<span class="award-stat__suffix">${s.suffix || ""}</span></div>
        <div class="award-stat__label">${t(s.label)}</div>
      </div>`).join("");
    // 仅首次渲染挂载进入视口计数动效；语言切换重渲染时直接显示终值，避免重复跳动
    if (!awardStatsReady) { initCountUp(box); awardStatsReady = true; }
  }

  /* 数字从 0 累加的计数动效：进入视口触发，使用 rAF + 缓动；尊重 prefers-reduced-motion */
  function initCountUp(scope) {
    const nums = $$(".award-stat__num", scope);
    if (!nums.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // 终值已在 DOM，无需动画
    const run = (el) => {
      const target = +el.dataset.count || 0;
      const dur = 1500;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);            // easeOutCubic
        const val = Math.round(target * eased);
        if (el.firstChild) el.firstChild.nodeValue = String(val);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.4 });
    nums.forEach((n) => obs.observe(n));
  }

  /* ----------------------------- Hero 数据条 ----------------------------- */
  function renderHeroStats() {
    const box = $("#heroStats");
    box.innerHTML = "";
    const papers  = SITE.publications.filter((p) => p.type === "journal" || p.type === "conference").length;
    const patents = SITE.publications.filter((p) => p.type === "patent").length;
    const projects = SITE.projects.length;
    const gpa = "3.6";
    const stats = [
      { n: papers,  l: { en: "Papers",      zh: "论文" } },
      { n: patents, l: { en: "Patents",     zh: "专利" } },
      { n: projects, l: { en: "Projects",    zh: "项目" } },
      { n: gpa,     l: { en: "GPA /4.0",    zh: "绩点" } },
    ];
    stats.forEach((s) => {
      const el = document.createElement("div");
      el.className = "stat";
      el.innerHTML = `<span class="stat__n">${s.n}</span><span class="stat__l">${t(s.l)}</span>`;
      box.appendChild(el);
    });
  }

  /* 打字机式研究方向：逐字打出当前语言的研究方向短语，循环切换 */
  let twTimer = null;
  function startTypewriter(lang) {
    const el = $("#typeText");
    if (!el) return;
    const phrases = (I18N[lang] && I18N[lang]["hero.rotate"]) || I18N.en["hero.rotate"];
    if (!phrases || !phrases.length) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = phrases[0]; // 静态首条，不打字
      return;
    }
    if (twTimer) { clearTimeout(twTimer); twTimer = null; }
    let pi = 0, ci = 0, deleting = false;
    const step = () => {
      const word = phrases[pi];
      ci += deleting ? -1 : 1;
      el.textContent = word.slice(0, ci);
      let delay = deleting ? 38 : 82;
      if (!deleting && ci === word.length) { delay = 1700; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 340; }
      twTimer = setTimeout(step, delay);
    };
    twTimer = setTimeout(step, 650);
  }

  /* 首屏数字滚动计数：从 0 滚动到真实值（仅在加载动画结束后跑一次） */
  function heroCountUp() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    $$("#heroStats .stat__n").forEach((el) => {
      const target = parseFloat(el.textContent) || 0;
      const dec = (el.textContent.split(".")[1] || "").length;
      const dur = 1300, t0 = performance.now();
      const ease = (x) => 1 - Math.pow(1 - x, 3);
      const fmt = (v) => (dec ? v.toFixed(dec) : Math.round(v).toString());
      (function tick(now) {
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = fmt(target * ease(p));
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = fmt(target);
      })(t0);
    });
  }

  /* ---------------------------- 联系方式/社交 ---------------------------- */
  function renderContact() {
    $("#contactEmail").textContent = SITE.profile.email;
    const alt = $("#contactEmailAlt");
    if (alt) alt.textContent = SITE.profile.emailAlt ? "· " + SITE.profile.emailAlt : "";

    const cv = SITE.profile.links.cv;
    const cvBtn = $("#cvBtn");
    if (cv) { cvBtn.href = cv; cvBtn.target = "_blank"; cvBtn.setAttribute("download", ""); }
    else cvBtn.style.display = "none";

    // 社交链接：动态渲染所有非空项（补全 LinkedIn / ResearchGate / Twitter 等）
    const box = $("#socialLinks");
    box.innerHTML = "";
    const socialMap = [
      ["googleScholar", "Google Scholar"], ["orcid", "ORCID"], ["github", "GitHub"],
      ["linkedin", "LinkedIn"], ["researchgate", "ResearchGate"], ["twitter", "Twitter / X"],
    ];
    socialMap.forEach(([key, label]) => {
      const url = SITE.profile.links[key];
      if (!url) return;
      const a = document.createElement("a");
      a.className = "slink";
      a.href = url; a.target = "_blank"; a.rel = "noopener";
      a.textContent = label;
      box.appendChild(a);
    });

    setupContactForm();
  }

  /* 真实联系表单：配置 Formspree 则 POST 提交，否则降级为 mailto */
  function setupContactForm() {
    const form = $("#contactForm");
    if (!form) return;
    const note = $("#formNote");
    const btn = $("#contactSubmit");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = (form.elements["name"].value || "").trim();
      const email = (form.elements["email"].value || "").trim();
      const msg = (form.elements["message"].value || "").trim();
      if (!name || !email || !msg) { form.reportValidity(); return; }

      const fp = SITE.profile.links.formspree;
      btn.disabled = true;
      note.textContent = t2("contact.sending");
      note.className = "cform__note";

      if (fp) {
        fetch(fp, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ name: name, email: email, message: msg, _subject: "Portfolio message from " + name }),
        }).then(function (r) {
          if (r.ok) { note.textContent = t2("contact.sent"); note.className = "cform__note is-ok"; form.reset(); }
          else throw new Error("bad");
        }).catch(function () {
          note.textContent = t2("contact.err"); note.className = "cform__note is-err";
        }).finally(function () { btn.disabled = false; });
      } else {
        // 未配置 Formspree：用邮件客户端发送
        const subject = encodeURIComponent("Portfolio message from " + name);
        const body = encodeURIComponent("From: " + name + " <" + email + ">\n\n" + msg);
        window.location.href = "mailto:" + SITE.profile.email + "?subject=" + subject + "&body=" + body;
        note.textContent = t2("contact.sent"); note.className = "cform__note is-ok";
        btn.disabled = false;
      }
    });
  }

  /* ------------------------------ 主题切换 ------------------------------ */
  function initTheme() {
    const saved = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    $("#themeBtn").addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.classList.add("theme-anim");
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      clearTimeout(initTheme._t);
      initTheme._t = setTimeout(() => document.documentElement.classList.remove("theme-anim"), 500);
    });
  }

  /* ------------------------------ 语言切换 ------------------------------ */
  function initLang() {
    const sw      = $("#langSwitch");
    const btn     = $("#langBtn");
    const menu    = $("#langMenu");
    const current = $("#langCurrent");

    /* 同步所有内容（语言切换时重渲染） */
    const sync = () => {
      applyI18n();
      bindProfile();
      renderAbout();
      renderInterests();
      renderPublications();
      renderPubStats();
      renderProjects();
      const ps = $("#postSearch"); if (ps) ps.placeholder = t2("blog.searchPh");
      initPostFilters();
      renderPosts();
      renderHonors();
      renderAwardStats();
      renderHeroStats();
      startTypewriter(lang);
      renderContact();
      renderNews();
      /* 更新当前语言标签 + 高亮选项 */
      current.textContent = lang.toUpperCase();
      $$(".lang-opt", menu).forEach((o) => o.classList.toggle("is-active", o.dataset.lang === lang));
      window.dispatchEvent(new Event("resize")); // 语言切换后导航药丸重新测量宽度
      if (window.OpticsLab && window.OpticsLab.applyI18n) window.OpticsLab.applyI18n();
    };

    const setLang = (next) => {
      if (next === lang) { closeMenu(); return; }
      lang = next;
      localStorage.setItem("lang", lang);
      document.documentElement.lang = lang;
      sync();
      closeMenu();
    };

    const openMenu  = () => { sw.classList.add("open"); btn.setAttribute("aria-expanded", "true"); };
    const closeMenu = () => { sw.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); };

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      sw.classList.contains("open") ? closeMenu() : openMenu();
    });
    $$(".lang-opt", menu).forEach((o) =>
      o.addEventListener("click", () => setLang(o.dataset.lang))
    );
    document.addEventListener("click", (e) => { if (!sw.contains(e.target)) closeMenu(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

    sync(); // 首次渲染
  }

  /* ------------------------- 导航高亮 + 移动菜单 ------------------------- */
  function initNav() {
    const links = $$("#navLinks a");
    const sections = links.map((a) => $(a.getAttribute("href")));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = "#" + e.target.id;
            links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === id));
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => s && obs.observe(s));

    const burger = $("#burger");
    const navLinks = $("#navLinks");
    burger.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") navLinks.classList.remove("open");
    });
  }

  /* --------------------------- 导航滚动实化 --------------------------- */
  function initNavScrolled() {
    const nav = $("#nav");
    if (!nav) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const upd = () => {
      const h = window.innerHeight || document.documentElement.clientHeight;
      nav.classList.toggle("scrolled", window.scrollY > h * 0.85);
    };
    upd();
    if (reduce) {
      window.addEventListener("scroll", upd, { passive: true });
    } else {
      let raf = 0;
      window.addEventListener("scroll", () => {
        if (!raf) raf = requestAnimationFrame(() => { raf = 0; upd(); });
      }, { passive: true });
    }
  }

  /* 滚动高亮导航：滚动到某版块时，对应导航项高亮 */
  function initScrollSpy() {
    const links = $$('#navLinks a[href^="#"]');
    if (!links.length) return;
    const map = new Map();
    links.forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      const sec = document.getElementById(id);
      if (sec) map.set(sec, a);
    });
    if (!map.size) return;
    const sections = [...map.keys()];
    let raf = 0;
    const update = () => {
      raf = 0;
      const probe = window.scrollY + window.innerHeight * 0.35;
      let active = null;
      for (const sec of sections) {
        const top = sec.getBoundingClientRect().top + window.scrollY;
        if (top <= probe) active = sec;
      }
      // 滚到底部时强制高亮最后一项（联系区常较短）
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        active = sections[sections.length - 1];
      }
      map.forEach((a, sec) => a.classList.toggle("is-active", sec === active));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* --------------------------- 首屏 Loading 动画 --------------------------- */
  function initPreloader() {
    const el = $("#preloader");
    if (!el) return;
    let done = false;
    const hide = () => {
      if (done) return;
      done = true;
      el.classList.add("hide");
      heroCountUp();
    };
    // 最短展示 380ms，避免一闪而过；最长兜底 2600ms 防止卡死
    const minT = setTimeout(hide, 1500);
    window.addEventListener("load", () => { clearTimeout(minT); setTimeout(hide, 600); });
    setTimeout(hide, 4500);
  }

  /* --------------------------- 返回顶部 + 复制 --------------------------- */
  function initMisc() {
    const toTop = $("#toTop");
    const ring  = toTop ? toTop.querySelector(".totop__bar") : null;
    const R = 19, C = 2 * Math.PI * R;
    if (ring) { ring.style.strokeDasharray = C; ring.style.strokeDashoffset = C; }

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      toTop.classList.toggle("show", y > 600);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      if (ring) ring.style.strokeDashoffset = (C * (1 - p)).toString();
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      let raf = 0;
      window.addEventListener("scroll", () => {
        if (!raf) raf = requestAnimationFrame(() => { raf = 0; onScroll(); });
      }, { passive: true });
    }
    onScroll();
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    $("#copyEmail").addEventListener("click", async (e) => {
      try {
        await navigator.clipboard.writeText(SITE.profile.email);
        const btn = e.currentTarget;
        const old = btn.textContent;
        btn.textContent = t2("contact.copied");
        setTimeout(() => (btn.textContent = old), 1500);
      } catch (_) {}
    });

    $("#year").textContent = new Date().getFullYear();
  }

  /* ------------------------------ 卡片 3D 倾斜悬浮 ------------------------------ */
  function initCardTilt() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = $$(".interest, .pub, .patent, .post");
    cards.forEach((card) => {
      card.style.transition = "transform .15s ease, box-shadow .3s, border-color .3s"; // 覆盖入场 stagger 的 transition-delay
      let raf = 0, curX = 0, curY = 0, tgtX = 0, tgtY = 0;
      const loop = () => {
        curX += (tgtX - curX) * 0.16;
        curY += (tgtY - curY) * 0.16;
        const settle = Math.abs(tgtX - curX) < 0.04 && Math.abs(tgtY - curY) < 0.04;
        if (settle) {
          card.style.transform = tgtX === 0 && tgtY === 0 ? "" : `perspective(800px) rotateX(${curY.toFixed(2)}deg) rotateY(${curX.toFixed(2)}deg)`;
          raf = 0;
        } else {
          card.style.transform = `perspective(800px) rotateX(${curY.toFixed(2)}deg) rotateY(${curX.toFixed(2)}deg)`;
          raf = requestAnimationFrame(loop);
        }
      };
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tgtX = px * 9;     // rotateY
        tgtY = -py * 9;    // rotateX
        card.style.setProperty("--mx", ((px + 0.5) * 100).toFixed(1) + "%");
        card.style.setProperty("--my", ((py + 0.5) * 100).toFixed(1) + "%");
        if (!raf) raf = requestAnimationFrame(loop);
      });
      card.addEventListener("mouseleave", () => {
        tgtX = 0; tgtY = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      });
    });
  }

  /* ------------------------------ 鼠标跟随柔光 ------------------------------ */
  function initCursorGlow() {
    const glow = $("#cursorGlow");
    if (!glow) return;
    // 仅在精确指针（鼠标）设备启用；触屏忽略
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = window.innerWidth / 2, ty = window.innerHeight / 2; // 目标
    let cx = tx, cy = ty;                                       // 当前（缓动）
    let shown = false, raf = 0;

    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; glow.style.opacity = "1"; }
    }, { passive: true });
    window.addEventListener("mouseleave", () => { glow.style.opacity = "0"; shown = false; });
    raf = requestAnimationFrame(loop);
  }

  /* ------------------------------ 滚动进度条 ------------------------------ */
  function initScrollbar() {
    const bar = $("#scrollbar");
    if (!bar) return;
    const onScroll = () => {
      const d = document.documentElement;
      const max = d.scrollHeight - d.clientHeight;
      bar.style.width = (max > 0 ? (d.scrollTop / max) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------- 滚动揭示动画 ----------------------------- */
  function initReveal() {
    // 更多元素参与渐显；研究引言/提示、荣誉、联系区、页脚等也错落进场
    const targets = $$(".section__head, .interest, .pub, .project, .post, .about__side, .timeline li, .nh__card, .honor, .contact__email, .contact__social, .cform, .blog-head, .footer__built, .footer__rights");
    targets.forEach((el) => el.classList.add("reveal"));
    // 网格容器内的子项错落入场（按各自容器重计延迟，避免跨区累计）
    [".interests", ".honors", ".publist", ".posts", ".nh__track"].forEach((sel) => {
      $$(sel).forEach((box) => {
        Array.from(box.children).forEach((el, i) => { el.style.transitionDelay = (i * 0.07) + "s"; });
      });
    });
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    targets.forEach((el) => obs.observe(el));
  }

  /* -------------------------------- 启动 -------------------------------- */
  /* 首屏鼠标视差：棱镜随鼠标轻微偏移，营造纵深（用 translate 属性，避开 transform 动画冲突） */
  function initParallax() {
    const hero = $(".hero");
    if (!hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layers = [
      { el: $(".prism"),            d: 14 },
      { el: $(".prism-halo"),       d: 22 },
      { el: $(".hero-shard--l"),    d: 30 },
      { el: $(".hero-shard--r"),    d: 30 },
      { el: $(".cosmo-planet--l"),  d: 38 },
      { el: $(".cosmo-planet--r"),  d: 38 },
      { el: $(".cosmo-star--l"),    d: 46 },
      { el: $(".cosmo-star--r"),    d: 46 },
    ];
    $$(".orb").forEach((el, i) => layers.push({ el, d: 18 + (i % 4) * 6 }));
    let raf = null, tx = 0, ty = 0;
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top)  / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    hero.addEventListener("mouseleave", () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(apply); });
    function apply() {
      raf = null;
      layers.forEach((l) => { if (l.el) l.el.style.translate = `${(-tx * l.d).toFixed(1)}px ${(-ty * l.d).toFixed(1)}px`; });
    }
  }

  /* 首屏滚动叙事：下滚时 hero 缓慢放大并淡出，营造"镜头推进"的纵深感 */
  function initHeroScroll() {
    const hero = $(".hero");
    if (!hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = null;
    const update = () => {
      raf = null;
      const y = window.scrollY;
      const vh = window.innerHeight || 1;
      const p = Math.min(1, y / (vh * 0.85));   // 0→1，约滚过 85% 视口完成
      hero.style.opacity = (1 - p * 0.8).toFixed(3);
      hero.style.transform = "scale(" + (1 + p * 0.14).toFixed(4) + ")";
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
  }

  /* ------------------------------- Hero 粒子星座背景 ------------------------------- */
  function initHeroParticles() {
    const canvas = $("#heroParticles");
    const hero = $(".hero");
    if (!canvas || !hero) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const LINK = 132;
    let W = 0, H = 0, pts = [], rafId = 0, mx = -9999, my = -9999;

    const isLight = () => (document.documentElement.getAttribute("data-theme") || "dark") === "light";
    const palette = () => isLight()
      ? { dot: "rgba(70,110,210,", line: "rgba(70,110,210," }
      : { dot: "rgba(150,190,255,", line: "rgba(120,170,255," };

    function build() {
      const n = Math.max(26, Math.min(72, Math.round(W / 21)));
      pts = [];
      for (let i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - .5) * .26, vy: (Math.random() - .5) * .26,
          r: Math.random() * 1.6 + .6,
        });
      }
    }
    function resize() {
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = Math.max(1, W * DPR); canvas.height = Math.max(1, H * DPR);
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      build();
    }
    function drawStatic() {
      const c = palette();
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const al = (1 - Math.sqrt(d2) / LINK) * .4;
            ctx.strokeStyle = c.line + al.toFixed(3) + ")"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      for (const p of pts) { ctx.fillStyle = c.dot + "0.9)"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill(); }
    }
    function frame() {
      const c = palette();
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        if (mx > -9000) {
          const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120 && d2 > 0.6) {
            const d = Math.sqrt(d2), f = (120 - d) / 120 * .55;
            p.x += (dx / d) * f; p.y += (dy / d) * f;
          }
        }
      }
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const al = (1 - Math.sqrt(d2) / LINK) * .5;
            ctx.strokeStyle = c.line + al.toFixed(3) + ")"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      for (const p of pts) { ctx.fillStyle = c.dot + "0.9)"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill(); }
      rafId = requestAnimationFrame(frame);
    }
    function start() { if (!rafId) rafId = requestAnimationFrame(frame); }
    function stop() { if (rafId) { cancelAnimationFrame(rafId); rafId = 0; } }

    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top;
    });
    hero.addEventListener("mouseleave", () => { mx = -9999; my = -9999; });

    if (reduce) { resize(); drawStatic(); return; }

    resize();
    start();
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? start() : stop())), { threshold: 0 })
        .observe(hero);
    }
    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 200); });
    // 主题切换后重绘配色（reduced-motion 路径已 return，这里只影响动态帧；动态帧每帧取 palette() 自动生效）
  }

  /* ------------------------------- 近期动态（横向时间线） ------------------------------- */
  function renderNews() {
    const box = $("#newsList");
    if (!box) return;
    box.innerHTML = "";
    const typeLabel = { paper: "news.paper", award: "news.award", talk: "news.talk", blog: "news.blog", milestone: "news.milestone", patent: "news.patent" };
    const typeClass = { paper: "nh__tag--paper", award: "nh__tag--award", talk: "nh__tag--talk", blog: "nh__tag--blog", milestone: "nh__tag--milestone", patent: "nh__tag--patent" };
    const items = [...SITE.news].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    // 横向滚动容器：每个卡片独立，带连接线
    const track = document.createElement("div");
    track.className = "nh__track";
    items.forEach((it, i) => {
      const card = document.createElement("div");
      card.className = "nh__card reveal";
      card.style.transitionDelay = (i * 0.12) + "s";
      const tag = typeLabel[it.type] || "news.milestone";
      const cls = typeClass[it.type] || "nh__tag--milestone";
      card.innerHTML = `
        <div class="nh__dot"></div>
        ${i < items.length - 1 ? '<div class="nh__line"></div>' : ''}
        <span class="nh__date">${it.date}</span>
        <span class="nh__tag ${cls}">${t2(tag)}</span>
        <p class="nh__text">${t(it.text)}</p>`;
      track.appendChild(card);
    });
    box.appendChild(track);
    // 重新触发 reveal（新插入元素需要 observe）
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } }),
      { threshold: 0.15 }
    );
    $$(".nh__card.reveal").forEach((el) => obs.observe(el));
  }

  /* ------------------------------- 编辑式章节序号（eyebrow） ------------------------------- */
  function initSectionKickers() {
    const order = ["about", "news", "research", "publications", "projects", "awards", "blog", "contact"];
    order.forEach((id, i) => {
      const sec = document.getElementById(id);
      if (!sec) return;
      const head = sec.querySelector(".section__head");
      if (!head || head.querySelector(".section__kicker")) return;
      const target = head.querySelector(".blog-head__text") || head;
      const k = document.createElement("span");
      k.className = "section__kicker";
      k.textContent = String(i + 1).padStart(2, "0");
      target.insertBefore(k, target.firstChild);
    });
  }

  /* ------------------------------- 滑动导航指示（当前项高亮药丸） ------------------------------- */
  function initNavIndicator() {
    const links = $("#navLinks");
    const ind = $("#navIndicator");
    if (!links || !ind) return;
    const move = () => {
      const active = links.querySelector("a.is-active");
      const mobile = window.matchMedia("(max-width: 860px)").matches;
      if (!active || mobile) { ind.style.opacity = "0"; return; }
      const r = active.getBoundingClientRect();
      const pr = links.getBoundingClientRect();
      ind.style.opacity = "1";
      ind.style.width = r.width + "px";
      ind.style.transform = "translateY(-50%) translateX(" + (r.left - pr.left) + "px)";
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.addEventListener("scroll", move, { passive: true });
    } else {
      let raf = 0;
      const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; move(); }); };
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("resize", move);
    // 当前项 class 变化时（滚动高亮 / 语言切换）自动跟上
    const mo = new MutationObserver(move);
    mo.observe(links, { attributes: true, subtree: true, attributeFilter: ["class"] });
    window.addEventListener("load", move);
    move();
  }

  /* ------------------------------- 视觉图集已移除 ------------------------------- */

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initLang();      // 内部调用 sync() 完成全部渲染
    initPubFilters();
    initNav();
    initNavScrolled();
    initScrollSpy();
    initPreloader();
    initMisc();
    initScrollbar();
    initReveal();
    initModal();
    initParallax();
    initHeroScroll();
    initHeroParticles();
    initCursorGlow();
    initCardTilt();
    initPostSearch();
    initSectionKickers();
    initNavIndicator();
  });
})();
