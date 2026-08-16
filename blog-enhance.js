/* =====================================================================
 * blog-enhance.js — 博客阅读体验增强（由每篇博客页底部引入）
 *   · 自动生成文章目录 TOC（扫描 article h2，滚动高亮当前章节）
 *   · 护眼阅读模式（sepia 切换 + localStorage 记忆）
 *   · 文末"相关文章"推荐（基于 SITE.posts 同领域）
 *   · 代码 / 公式高亮（检测到才按需加载 highlight.js / KaTeX CDN）
 * 所有样式由本脚本注入，故无需改动 24 篇博客的内联 <style>。
 * ===================================================================== */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    injectStyles();
    buildTOC();
    buildReadingMode();
    buildRelated();
    maybeEnhanceCodeMath();
  });

  /* ----------------------------- 注入样式 ----------------------------- */
  function injectStyles() {
    if (document.getElementById("be-style")) return;
    var css = [
      "/* ---- 目录 TOC ---- */",
      ".toc{position:relative;margin:6px 0 34px;padding:16px 18px;border:1px solid rgba(255,255,255,.1);",
      "  border-radius:14px;background:rgba(255,255,255,.03);}",
      ".toc__head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px;}",
      ".toc__title{font-family:'Spectral',serif;font-size:.95rem;letter-spacing:.5px;color:#9aa6c7;text-transform:uppercase;}",
      ".toc__toggle{cursor:pointer;background:none;border:none;color:#9aa6c7;font-size:1.1rem;line-height:1;padding:2px 6px;border-radius:8px;}",
      ".toc__toggle:hover{color:#eaf0ff;background:rgba(255,255,255,.06);}",
      ".toc__list{list-style:none;margin:0;padding:0;display:grid;gap:2px;max-height:520px;overflow:auto;transition:max-height .25s ease,opacity .2s ease;}",
      ".toc.is-collapsed .toc__list{max-height:0;opacity:0;overflow:hidden;}",
      ".toc__link{display:block;padding:6px 10px;border-radius:8px;color:#b8c2e0;text-decoration:none;font-size:.95rem;",
      "  border-left:2px solid transparent;transition:background .15s,color .15s,border-color .15s;}",
      ".toc__link:hover{background:rgba(255,255,255,.05);color:#eaf0ff;}",
      ".toc__link.is-active{color:#7bd3ff;border-left-color:var(--s-cyan);background:rgba(76,201,240,.08);}",
      "/* ---- 护眼（sepia）模式 ---- */",
      ".rmbtn{margin-left:auto;cursor:pointer;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);",
      "  color:#cdd6ef;font-size:.8rem;padding:5px 11px;border-radius:999px;display:inline-flex;align-items:center;gap:6px;transition:.2s;}",
      ".rmbtn:hover{color:#fff;border-color:rgba(255,255,255,.28);}",
      "body.sepia{background:#efe6d2 !important;}",
      "body.sepia .top{background:rgba(239,230,210,.88) !important;border-bottom-color:rgba(120,95,50,.18) !important;}",
      "body.sepia .top a,body.sepia .top__brand{color:#5b4a2e !important;}",
      "body.sepia article h1,body.sepia article h2{color:#3a2f1e !important;}",
      "body.sepia article p,body.sepia article li{color:#4a3f2e !important;}",
      "body.sepia blockquote{background:rgba(120,95,50,.08) !important;color:#4a3f2e !important;border-left-color:#b5894e !important;}",
      "body.sepia code{background:rgba(120,95,50,.12) !important;color:#8a5a1e !important;}",
      "body.sepia .back,body.sepia .toc__link{color:#8a6a2e !important;}",
      "body.sepia .toc{border-color:rgba(120,95,50,.2) !important;background:rgba(120,95,50,.05) !important;}",
      "body.sepia footer{color:#8a7a55 !important;border-top-color:rgba(120,95,50,.18) !important;}",
      "body.sepia .readbar{background:linear-gradient(90deg,#b5894e,#d9a86a) !important;}",
      "@media (max-width:560px){.rmbtn span{display:none;}}",
      "/* ---- 相关文章 ---- */",
      ".related{margin:54px 0 10px;padding-top:30px;border-top:1px solid rgba(255,255,255,.1);}",
      ".related__h{font-family:'Spectral',serif;font-size:1.2rem;color:#fff;margin-bottom:18px;display:flex;align-items:center;gap:10px;}",
      ".related__h::before{content:'';width:28px;height:3px;background:var(--spectrum);border-radius:3px;}",
      ".related__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;}",
      ".relcard{display:block;text-decoration:none;padding:16px;border-radius:14px;background:rgba(255,255,255,.03);",
      "  border:1px solid rgba(255,255,255,.1);transition:transform .2s,border-color .2s,background .2s;}",
      ".relcard:hover{transform:translateY(-4px);border-color:rgba(91,123,240,.5);background:rgba(91,123,240,.08);}",
      ".relcard__f{font-size:.72rem;letter-spacing:.4px;text-transform:uppercase;color:#7bd3ff;margin-bottom:6px;}",
      ".relcard__t{color:#eaf0ff;font-size:.98rem;font-weight:600;line-height:1.4;margin-bottom:8px;}",
      ".relcard__d{color:#8a93b5;font-size:.8rem;}",
      "body.sepia .related{border-top-color:rgba(120,95,50,.2) !important;}",
      "body.sepia .related__h,body.sepia .relcard__t{color:#3a2f1e !important;}",
      "body.sepia .relcard{background:rgba(120,95,50,.05) !important;border-color:rgba(120,95,50,.2) !important;}",
      "body.sepia .relcard__d{color:#8a7a55 !important;}",
    ].join("\n");
    var s = document.createElement("style");
    s.id = "be-style";
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ----------------------------- 目录 TOC ----------------------------- */
  function buildTOC() {
    var article = document.querySelector("article");
    if (!article) return;
    var hs = article.querySelectorAll("h2");
    if (hs.length < 2) return; // 章节太少则不生成目录

    var toc = document.createElement("nav");
    toc.className = "toc";
    toc.setAttribute("aria-label", "Table of contents");

    var head = document.createElement("div");
    head.className = "toc__head";
    head.innerHTML = '<span class="toc__title">Contents</span>';
    var toggle = document.createElement("button");
    toggle.className = "toc__toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Collapse / expand contents");
    toggle.textContent = "−";
    head.appendChild(toggle);
    toc.appendChild(head);

    var list = document.createElement("ul");
    list.className = "toc__list";

    var links = [];
    hs.forEach(function (h, i) {
      var id = "sec-" + (i + 1);
      h.id = id;
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.className = "toc__link";
      a.href = "#" + id;
      a.textContent = h.textContent;
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var y = h.getBoundingClientRect().top + window.scrollY - 84;
        window.scrollTo({ top: y, behavior: "smooth" });
        history.replaceState(null, "", "#" + id);
      });
      li.appendChild(a);
      list.appendChild(li);
      links.push(a);
    });
    toc.appendChild(list);

    toggle.addEventListener("click", function () {
      toc.classList.toggle("is-collapsed");
      toggle.textContent = toc.classList.contains("is-collapsed") ? "+" : "−";
    });

    // 插入到文章标题区之后（.rule 之后）
    var rule = article.querySelector(".rule");
    if (rule && rule.nextSibling) article.insertBefore(toc, rule.nextSibling);
    else article.insertBefore(toc, article.children[1] || null);

    // 滚动高亮当前章节
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("is-active"); });
          var aid = "#" + en.target.id;
          links.forEach(function (l) { if (l.getAttribute("href") === aid) l.classList.add("is-active"); });
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
    hs.forEach(function (h) { io.observe(h); });
  }

  /* --------------------------- 护眼阅读模式 --------------------------- */
  function buildReadingMode() {
    var bar = document.querySelector(".top__inner");
    if (!bar) return;
    var btn = document.createElement("button");
    btn.className = "rmbtn";
    btn.type = "button";
    btn.innerHTML = '👁 <span>Eye-care</span>';
    btn.addEventListener("click", function () {
      var on = document.body.classList.toggle("sepia");
      try { localStorage.setItem("blog-sepia", on ? "1" : "0"); } catch (e) {}
    });
    bar.appendChild(btn);
    // 恢复上次选择
    try {
      if (localStorage.getItem("blog-sepia") === "1") document.body.classList.add("sepia");
    } catch (e) {}
  }

  /* ----------------------------- 相关文章 ----------------------------- */
  function buildRelated() {
    if (typeof SITE === "undefined" || !SITE.posts) return;
    var me = location.pathname.split("/").pop();
    if (!me) return;
    var cur = SITE.posts.find(function (p) { return p.url && p.url.split("/").pop() === me; });
    if (!cur) return;

    var others = SITE.posts.filter(function (p) {
      return p.url && p.url.split("/").pop() !== me && p.field === cur.field;
    }).slice(0, 3);
    if (!others.length) return;

    var lang = (document.documentElement.lang || "en").slice(0, 2);
    if (lang !== "zh") lang = "en";
    var fieldLabel = cur.field.charAt(0).toUpperCase() + cur.field.slice(1);

    var sec = document.createElement("section");
    sec.className = "related";
    var h = document.createElement("h3");
    h.className = "related__h";
    h.textContent = lang === "zh" ? "相关阅读" : "Related reading";
    sec.appendChild(h);

    var grid = document.createElement("div");
    grid.className = "related__grid";
    others.forEach(function (p) {
      var a = document.createElement("a");
      a.className = "relcard";
      a.href = p.url;
      a.innerHTML =
        '<div class="relcard__f">' + fieldLabel + "</div>" +
        '<div class="relcard__t">' + (p.title || "") + "</div>" +
        '<div class="relcard__d">' + (p.date || "") + "</div>";
      grid.appendChild(a);
    });
    sec.appendChild(grid);

    // 插入到 .back 链接之后
    var back = document.querySelector(".back");
    if (back && back.nextSibling) back.parentNode.insertBefore(sec, back.nextSibling);
    else if (back) back.parentNode.appendChild(sec);
    else {
      var art = document.querySelector("article");
      if (art) art.appendChild(sec);
    }
  }

  /* ----------------------- 代码 / 公式高亮（按需） ----------------------- */
  function maybeEnhanceCodeMath() {
    var article = document.querySelector("article");
    if (!article) return;

    var hasCode = !!article.querySelector("pre code");
    var txt = article.textContent || "";
    var hasMath = /\$\$[\s\S]+?\$\$/.test(txt) || (/\$[^$\n]+?\$/.test(txt));

    if (hasCode) loadHighlight();
    if (hasMath) loadKatex();
  }

  function loadScript(src, cb) {
    var s = document.createElement("script");
    s.src = src; s.async = true;
    s.onload = cb || null;
    document.head.appendChild(s);
  }
  function loadLink(href) {
    var l = document.createElement("link");
    l.rel = "stylesheet"; l.href = href;
    document.head.appendChild(l);
  }

  function loadHighlight() {
    loadLink("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css");
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js", function () {
      if (window.hljs) document.querySelectorAll("pre code").forEach(function (b) { window.hljs.highlightElement(b); });
    });
  }

  function loadKatex() {
    loadLink("https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css");
    loadScript("https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js", function () {
      loadScript("https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js", function () {
        if (window.renderMathInElement) {
          window.renderMathInElement(document.body, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "$", right: "$", display: false },
            ],
            ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
          });
        }
      });
    });
  }
})();
