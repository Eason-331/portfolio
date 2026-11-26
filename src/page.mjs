import { content, profile } from "./content.mjs";

const sections = ["home", "projects", "about", "skills", "education", "cv", "contact"];
const characters = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escape = (value) => String(value).replace(/[&<>"']/g, (character) => characters[character]);

function externalLink(url, label, className = "text-link") {
  if (!url) return "";
  if (new URL(url).protocol !== "https:") throw new Error(`Expected an HTTPS URL: ${url}`);
  return `<a class="${className}" href="${escape(url)}">${escape(label)}</a>`;
}

function sectionTitle(section) {
  return `<div class="section-heading">
    <p class="eyebrow">${escape(section.label)}</p>
    <h2>${escape(section.title)}</h2>
    ${section.description ? `<p class="section-lede">${escape(section.description)}</p>` : ""}
  </div>`;
}

function projectCard(project, labels) {
  const visual = project.visual === "orbit" ? "orbit" : "grid";
  return `<article class="project-card">
    <div class="project-visual project-visual--${visual}" aria-hidden="true">
      <div class="diagram"><i></i><i></i><i></i><i></i></div>
    </div>
    <div class="project-body">
      <p class="project-category">${escape(project.category)}</p>
      <h3>${escape(project.title)}</h3>
      <p class="project-description">${escape(project.description)}</p>
      ${project.tags.length ? `<ul class="tag-list" aria-label="${escape(project.category)}">${project.tags.map((tag) => `<li>${escape(tag)}</li>`).join("")}</ul>` : ""}
      <div class="project-links">
        ${externalLink(project.repository, labels.repository)}
        ${externalLink(project.demo, labels.demo)}
        ${!project.repository && !project.demo && project.title.startsWith("[") ? `<span class="pending">${escape(labels.pending)}</span>` : ""}
      </div>
    </div>
  </article>`;
}

export function renderPage(language) {
  const copy = content[language];
  const name = profile.name.trim() || copy.namePlaceholder;
  const german = language === "de";
  const otherLanguage = german ? "en" : "de";
  const otherPath = german ? "../" : "./de/";
  const assets = german ? "../assets" : "./assets";
  const universityUrl = profile.universityUrl[german ? 1 : 0];
  const emailLink = profile.email
    ? `<a class="button button--primary" href="mailto:${escape(profile.email)}">${escape(copy.contact.email)}</a>`
    : "";
  const contactLinks = [
    emailLink,
    externalLink(profile.github, "GitHub", "button button--secondary"),
    externalLink(profile.linkedin, "LinkedIn", "button button--secondary"),
  ].filter(Boolean);

  return `<!doctype html>
<html lang="${language}" data-theme="dark" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escape(copy.description)}">
  <meta name="color-scheme" content="dark light">
  <title>${escape(name)} · Portfolio</title>
  <link rel="alternate" hreflang="${otherLanguage}" href="${otherPath}">
  <link rel="icon" href="${assets}/favicon.png" type="image/png">
  <link rel="preload" href="${assets}/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${assets}/site.css">
  <script src="${assets}/theme.js"></script>
  <script src="${assets}/site.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">${escape(copy.skip)}</a>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="wordmark" href="#home" aria-label="${escape(`${name} · ${copy.navigation[0]}`)}">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="wordmark-text">${escape(name)}</span>
      </a>
      <nav class="site-nav" id="site-nav" aria-label="${escape(copy.menu)}">
        ${sections.slice(1).map((id, index) => `<a href="#${id}">${escape(copy.navigation[index + 1])}</a>`).join("")}
      </nav>
      <div class="header-controls">
        <a class="language-switch" href="${otherPath}" hreflang="${otherLanguage}" lang="${otherLanguage}" aria-label="${copy.switchLanguage}">${otherLanguage.toUpperCase()}</a>
        <button class="icon-button theme-toggle" type="button" aria-label="${escape(copy.theme)}" aria-pressed="true">
          <span class="theme-icon" aria-hidden="true">☼</span>
        </button>
        <button class="icon-button menu-toggle" type="button" aria-label="${escape(copy.menu)}" aria-controls="site-nav" aria-expanded="false">
          <span class="menu-icon" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  </header>

  <main id="main" tabindex="-1">
    <section class="wrap hero" id="home" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow hero-label"><span class="label-dot" aria-hidden="true"></span>${escape(copy.student)}</p>
        <h1 id="hero-title">${escape(copy.greeting)}<br><span>${escape(name)}.</span></h1>
        <p class="hero-lede">${escape(copy.introduction)}</p>
        <div class="button-row">
          <a class="button button--primary" href="#projects">${escape(copy.viewProjects)}</a>
          <a class="button button--secondary" href="#cv">${escape(copy.viewCV)}</a>
        </div>
      </div>
      <div class="hero-visual">
        <img src="${assets}/alpine-contours.webp" width="1536" height="1024" alt="" fetchpriority="high">
        <span class="corner corner--tl" aria-hidden="true"></span><span class="corner corner--tr" aria-hidden="true"></span>
        <span class="corner corner--bl" aria-hidden="true"></span><span class="corner corner--br" aria-hidden="true"></span>
        <span class="visual-location"><span class="location-icon" aria-hidden="true"></span>${escape(copy.location)}</span>
      </div>
    </section>

    <section id="projects" class="band">
      <div class="wrap section">
        ${sectionTitle(copy.projects)}
        <div class="project-grid">${copy.projects.items.map((project) => projectCard(project, copy.projects)).join("")}</div>
      </div>
    </section>

    <section id="about" class="wrap section split-section">
      <div>
        ${sectionTitle(copy.about)}
        <p class="about-intro">${escape(copy.about.intro)}</p>
        <p class="body-copy">${escape(copy.about.biography)}</p>
      </div>
      <dl class="facts">
        ${copy.about.facts.map(([key, value]) => `<div><dt>${escape(key)}</dt><dd>${escape(value)}</dd></div>`).join("")}
      </dl>
    </section>

    <section id="skills" class="band">
      <div class="wrap section">
        ${sectionTitle(copy.skills)}
        <div class="skill-grid">
          ${copy.skills.groups.map((group, index) => `<article class="skill-card">
            <span class="skill-icon" aria-hidden="true">${["&lt;/&gt;", "⌘", "✳"][index % 3]}</span>
            <h3>${escape(group.title)}</h3>
            <ul>${group.items.map((item) => `<li>${escape(item)}</li>`).join("")}</ul>
          </article>`).join("")}
        </div>
      </div>
    </section>

    <section id="education" class="wrap section split-section">
      ${sectionTitle(copy.education)}
      <article class="education-card">
        <div class="education-heading">
          <h3>${escape(profile.university)}</h3>
          <p class="period">${escape(copy.education.period)}</p>
        </div>
        <p class="degree">${escape(copy.education.degree)}</p>
        <p class="body-copy">${escape(copy.education.summary)}</p>
        ${externalLink(universityUrl, copy.education.link)}
      </article>
    </section>

    <section id="cv" class="band">
      <div class="wrap section">
        <div class="cv-card">
          <div>
            ${sectionTitle(copy.cv)}
            <p class="cv-summary"><strong>${escape(profile.university)}</strong> <span>${escape(copy.education.degree)} · ${escape(copy.education.period)}</span></p>
            ${copy.cv.template ? `<p class="pending">${escape(copy.cv.templateNotice)}</p>` : ""}
          </div>
          <div class="cv-actions">
            <a class="button button--primary" href="${assets}/${escape(copy.cv.filename)}" type="application/pdf" download>${escape(copy.cv.download)}</a>
            <a class="text-link" href="${assets}/${escape(copy.cv.filename)}" type="application/pdf">${escape(copy.cv.preview)}</a>
          </div>
        </div>
      </div>
    </section>

    <section id="contact" class="wrap section contact">
      ${sectionTitle(copy.contact)}
      ${contactLinks.length ? `<div class="button-row">${contactLinks.join("")}</div>` : `<p class="pending">${escape(copy.contact.pending)}</p>`}
    </section>
  </main>

  <footer class="wrap site-footer">
    <span>${escape(name)} · ${escape(profile.university)}</span>
    <a class="text-link" href="#home">${escape(copy.back)}</a>
  </footer>
</body>
</html>
`;
}
