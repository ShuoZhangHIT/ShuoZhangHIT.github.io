/* =====================================================================
 * cv-render.js — 渲染可打印 CV 专页（cv.html）
 *   数据来自 data.js 的 SITE；支持 EN / 中文 切换、打印 / 导出 PDF。
 * ===================================================================== */
(function () {
  "use strict";
  var SITE = window.SITE || {};

  var CV = {
    en: {
      cv: "Curriculum Vitae", education: "Education", research: "Research Interests",
      researchExp: "Research Experience",
      publications: "Publications", honors: "Honors & Awards", skills: "Skills",
      contact: "Contact", print: "Print / PDF", download: "Download PDF", back: "Back to site",
      journal: "Journal", conference: "Conference", patent: "Patent",
      email: "Email", orcid: "ORCID", github: "GitHub", scholar: "Google Scholar",
    },
    zh: {
      cv: "个人简历", education: "教育经历", research: "研究方向",
      researchExp: "研究经历",
      publications: "学术论文", honors: "荣誉奖励", skills: "专业技能",
      contact: "联系方式", print: "打印 / 导出 PDF", download: "下载 PDF", back: "返回主页",
      journal: "期刊", conference: "会议", patent: "专利",
      email: "邮箱", orcid: "ORCID", github: "GitHub", scholar: "谷歌学术",
    },
  };

  function getLang() {
    var p = new URLSearchParams(location.search).get("lang");
    if (p === "zh" || p === "en") return p;
    try { var s = localStorage.getItem("lang"); if (s === "zh" || s === "en") return s; } catch (e) {}
    return "en";
  }
  var lang = getLang();

  function t(o) { if (o == null) return ""; if (typeof o === "string") return o; return o[lang] || o.en || ""; }
  function esc(s) { return (s == null ? "" : String(s)).replace(/[&<>]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function hl(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); }

  function setLang(l) {
    lang = l;
    try { localStorage.setItem("lang", l); } catch (e) {}
    document.documentElement.lang = l;
    render();
    Array.prototype.forEach.call(document.querySelectorAll("#cvLang button"), function (b) {
      b.classList.toggle("is-active", b.dataset.lang === l);
    });
  }

  function render() {
    var L = CV[lang];
    var p = SITE.profile || {};
    var name = lang === "zh" && p.nameZh ? p.nameZh : (p.name || "Shuo Zhang");
    var links = p.links || {};
    var box = document.getElementById("cv");
    if (!box) return;

    var html = "";

    /* ---- 头部 ---- */
    var dispName = name + (p.alias ? " (" + esc(p.alias) + ")" : "");
    html += '<div class="cv__head">';
    html += '<div class="cv__name">' + dispName + "</div>";
    html += '<div class="cv__role">' + esc(t(p.title)) + "</div>";
    html += '<div class="cv__aff">' + esc(t(p.affiliation)) + "</div>";
    html += '<div class="cv__contact">';
    if (p.email) html += '<a href="mailto:' + esc(p.email) + '">✉ ' + esc(p.email) + "</a>";
    if (p.emailAlt) html += '<a href="mailto:' + esc(p.emailAlt) + '">✉ ' + esc(p.emailAlt) + "</a>";
    if (links.orcid) html += '<a href="' + esc(links.orcid) + '" target="_blank" rel="noopener">ORCID</a>';
    if (links.github) html += '<a href="' + esc(links.github) + '" target="_blank" rel="noopener">GitHub</a>';
    if (links.googleScholar) html += '<a href="' + esc(links.googleScholar) + '" target="_blank" rel="noopener">' + L.scholar + "</a>";
    if (p.location) html += "<span>" + esc(t(p.location)) + "</span>";
    html += "</div></div>";

    /* ---- 教育 ---- */
    if (p.education && p.education.length) {
      html += '<section class="cv__sec"><div class="cv__h">' + L.education + "</div>";
      p.education.forEach(function (e) {
        html += '<div class="cv__edu">';
        html += '<div class="y">' + esc(t(e.period)) + "</div>";
        html += '<div class="d">' + esc(t(e.degree)) + "</div>";
        html += '<div class="s">' + esc(t(e.school)) + (e.detail ? " · " + esc(t(e.detail)) : "") + "</div>";
        html += "</div>";
      });
      html += "</section>";
    }

    /* ---- 研究兴趣 ---- */
    if (SITE.interests && SITE.interests.length) {
      html += '<section class="cv__sec"><div class="cv__h">' + L.research + "</div><div class=\"cv__int\">";
      SITE.interests.forEach(function (it) {
        html += '<div class="it"><h4>' + esc(t(it)) + "</h4><p>" + esc(t(it.insight)) + "</p></div>";
      });
      html += "</div></section>";
    }

    /* ---- 研究经历 ---- */
    if (SITE.profile && SITE.profile.researchExperience && SITE.profile.researchExperience.length) {
      html += '<section class="cv__sec"><div class="cv__h">' + L.researchExp + '</div><div class="cv__exp">';
      SITE.profile.researchExperience.forEach(function (r) {
        html += '<div class="cv__job">';
        html += '<div class="cv__job-top"><span class="cv__job-title">' + esc(t(r.title)) + '</span><span class="cv__job-period">' + esc(r.period) + "</span></div>";
        html += '<p class="cv__job-desc">' + esc(t(r.desc)) + "</p>";
        html += "</div>";
      });
      html += "</div></section>";
    }

    /* ---- 论文 + 专利 ---- */
    if (SITE.publications && SITE.publications.length) {
      var pubs = SITE.publications.slice().sort(function (a, b) { return (b.year || 0) - (a.year || 0); });
      html += '<section class="cv__sec"><div class="cv__h">' + L.publications + '</div><div class="cv__pub">';
      pubs.forEach(function (pub) {
        var badge = "";
        if (pub.type === "journal") badge = '<span class="badge badge--journal">' + L.journal + "</span>";
        else if (pub.type === "conference") badge = '<span class="badge badge--conference">' + L.conference + "</span>";
        else if (pub.type === "patent") badge = '<span class="badge badge--patent">' + L.patent + "</span>";
        html += '<div class="p"><span class="yr">' + esc(pub.year) + "</span><div class=\"body\">";
        html += '<div class="t">' + hl(pub.title) + badge + "</div>";
        var meta = [];
        if (pub.authors) meta.push(hl(pub.authors));
        if (pub.venue) meta.push(esc(pub.venue));
        if (pub.type === "patent") { if (pub.status) meta.push(esc(t(pub.status))); if (pub.number) meta.push(esc(pub.number)); }
        if (meta.length) html += '<div class="v">' + meta.join(" · ") + "</div>";
        if (pub.links && pub.links.doi) html += '<div class="v"><a href="' + esc(pub.links.doi) + '" target="_blank" rel="noopener">DOI</a></div>';
        html += "</div></div>";
      });
      html += "</div></section>";
    }

    /* ---- 荣誉 ---- */
    if (SITE.honors && SITE.honors.length) {
      html += '<section class="cv__sec"><div class="cv__h">' + L.honors + '</div><div class="cv__aw">';
      SITE.honors.forEach(function (h) {
        html += '<div class="a"><span class="ay">' + esc(h.year) + '</span><span>' + esc(t(h.text)) + "</span></div>";
      });
      html += "</div></section>";
    }

    /* ---- 技能 ---- */
    if (p.skills && p.skills.length) {
      html += '<section class="cv__sec"><div class="cv__h">' + L.skills + '</div><div class="cv__sk">';
      p.skills.forEach(function (g) {
        html += '<div class="g"><h4>' + esc(t(g.group)) + "</h4><ul>";
        (g.items || []).forEach(function (it) { html += "<li>" + esc(it) + "</li>"; });
        html += "</ul></div>";
      });
      html += "</div></section>";
    }

    box.innerHTML = html;

    /* 下载按钮指向 cv.pdf（若存在） */
    var dl = document.getElementById("cvDownload");
    if (dl && links.cv) { dl.href = links.cv; dl.style.display = ""; }
    else if (dl) dl.style.display = "none";
  }

  function init() {
    render();
    Array.prototype.forEach.call(document.querySelectorAll("#cvLang button"), function (b) {
      b.classList.toggle("is-active", b.dataset.lang === lang);
      b.addEventListener("click", function () { setLang(b.dataset.lang); });
    });
    var pr = document.getElementById("cvPrint");
    if (pr) pr.addEventListener("click", function () { window.print(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
