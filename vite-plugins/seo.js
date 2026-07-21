import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const BOM = String.fromCharCode(0xfeff);
const SITE_NAME = "MKirell — Portfolio";
const MONTHS = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};
const LANG_CODES = { English: "en", French: "fr", Arabic: "ar" };

function readJson(path) {
  const raw = readFileSync(path, "utf-8");
  return JSON.parse(raw.startsWith(BOM) ? raw.slice(1) : raw);
}

function stripTrailingSlash(url) {
  return url.replace(/\/$/, "");
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(str = "") {
  return escapeHtml(str).replace(/"/g, "&quot;");
}

function stripMarkdown(str = "") {
  return String(str).replace(/\*\*(.+?)\*\*/g, "$1");
}

function boldify(str = "") {
  return escapeHtml(str).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

function slugify(str = "") {
  return String(str)
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseMonthYearRange(period = "") {
  const m = period.match(/(\d{2})\/(\d{4})\s*—\s*(?:(\d{2})\/(\d{4})|Present)/);
  if (!m) return {};
  const [, sm, sy, em, ey] = m;
  return em && ey
    ? { startDate: `${sy}-${sm}`, endDate: `${ey}-${em}` }
    : { startDate: `${sy}-${sm}` };
}

function parseYearRange(years = "") {
  const m = years.match(/(\d{4})(?:\s*—\s*(\d{4}))?/);
  if (!m) return {};
  return { startDate: m[1], endDate: m[2] || m[1] };
}

function parseCertDate(dateStr = "") {
  const m = dateStr.match(/([A-Za-z]{3})\w*\s+(\d{4})/);
  if (!m) return undefined;
  const month = MONTHS[m[1].toLowerCase()];
  return month ? `${m[2]}-${String(month).padStart(2, "0")}` : m[2];
}

function parseProjectDate(period = "") {
  const mmYear = period.match(/^(\d{2})\/(\d{4})/);
  if (mmYear) return `${mmYear[2]}-${mmYear[1]}`;
  const yearOnly = period.match(/(\d{4})/);
  return yearOnly ? yearOnly[1] : undefined;
}

function buildJsonLd(portfolio) {
  const { person, docs } = portfolio;
  const t = portfolio.locales.en;
  const base = stripTrailingSlash(person.url);
  const id = (frag) => `${base}/${frag}`;

  const orgs = new Map();
  function orgRef(name, { type = "Organization", sameAs } = {}) {
    if (!name) return undefined;
    const slug = `org-${slugify(name)}`;
    if (!orgs.has(slug)) {
      orgs.set(slug, {
        "@type": type,
        "@id": id(`#${slug}`),
        name,
        ...(sameAs ? { sameAs } : {}),
      });
    }
    return { "@id": id(`#${slug}`) };
  }

  const worksFor = t.experience.jobs.map((job) => ({
    "@type": "EmployeeRole",
    roleName: job.role,
    description: job.bullets.map(stripMarkdown).join(" "),
    worksFor: orgRef(job.company),
    ...parseMonthYearRange(job.period),
  }));

  const alumniOf = [
    ...new Map(
      t.education.degrees
        .map((d, i) =>
          orgRef(d.school, {
            type: "EducationalOrganization",
            sameAs: docs.degreeLinks?.[i],
          }),
        )
        .filter(Boolean)
        .map((ref) => [ref["@id"], ref]),
    ).values(),
  ];

  const degreeCredentials = t.education.degrees.map((d, i) => ({
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "degree",
    name: d.title,
    ...(d.mention ? { description: stripMarkdown(d.mention) } : {}),
    recognizedBy: orgRef(d.school, {
      type: "EducationalOrganization",
      sameAs: docs.degreeLinks?.[i],
    }),
    ...parseYearRange(d.years),
  }));

  const certCredentials = t.education.certs.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "certification",
    name: c.title,
    recognizedBy: orgRef(c.issuer),
    dateCreated: parseCertDate(c.date),
  }));

  const memberOf = t.achievements.vols.map((v, i) => ({
    "@type": "OrganizationRole",
    roleName: v.role,
    description: stripMarkdown(v.desc),
    memberOf: orgRef(v.org, { sameAs: docs.volLinks?.[i] }),
    ...parseMonthYearRange(v.period),
  }));

  const projects = t.projects.items.map((p) => ({
    "@type": "SoftwareApplication",
    "@id": id(`#project-${slugify(p.title)}`),
    name: p.title,
    author: { "@id": id("#person") },
    description: stripMarkdown(p.desc),
    applicationCategory: "Artificial Intelligence",
    operatingSystem: "Linux",
    keywords: p.tags.join(", "),
    dateCreated: parseProjectDate(p.period),
    applicationSubCategory: p.badge,
  }));

  const personNode = {
    "@type": "Person",
    "@id": id("#person"),
    name: person.name,
    givenName: person.givenName,
    familyName: person.familyName,
    jobTitle: person.jobTitle,
    email: `mailto:${person.email}`,
    telephone: person.phone,
    url: person.url,
    sameAs: [person.linkedin, person.github].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      addressLocality: person.addressLocality,
      addressRegion: person.addressRegion,
      addressCountry: person.addressCountry,
    },
    description: person.description,
    knowsAbout: [...new Set(t.skills.categories.flatMap((c) => c.tags))],
    knowsLanguage: t.achievements.languages.map((l) => ({
      "@type": "Language",
      name: l.name,
      alternateName: LANG_CODES[l.name],
      description: l.level,
    })),
    worksFor,
    alumniOf,
    hasCredential: [...degreeCredentials, ...certCredentials],
    award: t.achievements.awards.map((a) => a.title),
    memberOf,
  };

  const website = {
    "@type": "WebSite",
    "@id": id("#website"),
    url: person.url,
    name: SITE_NAME,
    inLanguage: portfolio.metaLocales.map((l) => l.lang),
    publisher: { "@id": id("#person") },
  };

  const profilePage = {
    "@type": "ProfilePage",
    "@id": id("#webpage"),
    url: person.url,
    name: SITE_NAME,
    description: person.description,
    inLanguage: portfolio.metaLocales.map((l) => l.lang),
    isPartOf: { "@id": id("#website") },
    mainEntity: { "@id": id("#person") },
  };

  return {
    "@context": { "@vocab": "https://schema.org/" },
    "@graph": [website, profilePage, personNode, ...projects, ...orgs.values()],
  };
}

function renderSeoShell(data) {
  const { person, docs } = data;
  const t = data.locales.en;

  const experience = t.experience.jobs
    .map(
      (job) => `
      <li>
        <h3>${escapeHtml(job.role)} — ${escapeHtml(job.company)}</h3>
        <p>${escapeHtml(job.period)}</p>
        <ul>${job.bullets.map((b) => `<li>${boldify(b)}</li>`).join("")}</ul>
        <p>${job.tags.map(escapeHtml).join(", ")}</p>
      </li>`,
    )
    .join("");

  const projects = t.projects.items
    .map(
      (p, i) => `
      <li>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.period)}${p.duration ? " · " + escapeHtml(p.duration) : ""}</p>
        <p>${boldify(p.desc)}</p>
        <p>${p.tags.map(escapeHtml).join(", ")}</p>
        ${docs.projectLinks[i] ? `<a href="${escapeHtml(docs.projectLinks[i])}">${escapeHtml(docs.projectLinks[i])}</a>` : ""}
      </li>`,
    )
    .join("");

  const skills = t.skills.categories
    .map(
      (c) => `
      <li>
        <h3>${escapeHtml(c.title)}</h3>
        <p>${c.tags.map(escapeHtml).join(", ")}</p>
      </li>`,
    )
    .join("");

  const languages = t.achievements.languages
    .map((l) => `<li>${escapeHtml(l.name)} — ${escapeHtml(l.level)}</li>`)
    .join("");

  const degrees = t.education.degrees
    .map(
      (d) => `
      <li>${escapeHtml(d.title)}, ${escapeHtml(d.school)} (${escapeHtml(d.years)})${
        d.mention ? " — " + escapeHtml(d.mention) : ""
      }</li>`,
    )
    .join("");

  const certs = t.education.certs
    .map(
      (c) =>
        `<li>${escapeHtml(c.title)} — ${escapeHtml(c.issuer)} (${escapeHtml(c.date)})</li>`,
    )
    .join("");

  const vols = t.achievements.vols
    .map(
      (v) => `
      <li>
        <h3>${escapeHtml(v.role)} — ${escapeHtml(v.org)}</h3>
        <p>${escapeHtml(v.period)}</p>
        <p>${boldify(v.desc)}</p>
      </li>`,
    )
    .join("");

  const awards = t.achievements.awards
    .map(
      (a) =>
        `<li>${escapeHtml(a.title)}${a.place ? " — " + escapeHtml(a.place) : ""}</li>`,
    )
    .join("");

  return `
<a href="#main-content" class="skip-link">Skip to main content</a>
<header>
  <nav aria-label="Main navigation">
    <a href="#about">About</a>
    <a href="#experience">Experience</a>
    <a href="#projects">Projects</a>
    <a href="#skills">Skills</a>
    <a href="#education">Education</a>
    <a href="#achievements">Achievements</a>
    <a href="#contact">Contact</a>
  </nav>
</header>
<main id="main-content">
  <section id="hero">
    <h1>${escapeHtml(person.name)}</h1>
    <p>${escapeHtml(t.hero.cardRole)} at ${escapeHtml(person.worksFor)}</p>
    <p>${boldify(t.hero.desc)}</p>
  </section>
  <section id="about">
    <h2>${escapeHtml(t.about.heading)}</h2>
    ${t.about.paragraphs.map((p) => `<p>${boldify(p)}</p>`).join("")}
  </section>
  <section id="experience">
    <h2>${escapeHtml(t.experience.heading)}</h2>
    <ul>${experience}</ul>
  </section>
  <section id="projects">
    <h2>${escapeHtml(t.projects.heading)}</h2>
    <ul>${projects}</ul>
  </section>
  <section id="skills">
    <h2>${escapeHtml(t.skills.heading)}</h2>
    <ul>${skills}</ul>
  </section>
  <section id="education">
    <h2>${escapeHtml(t.education.heading)}</h2>
    <h3>${escapeHtml(t.education.degrees_title)}</h3>
    <ul>${degrees}</ul>
    <h3>${escapeHtml(t.education.certs_title)}</h3>
    <ul>${certs}</ul>
  </section>
  <section id="achievements">
    <h2>${escapeHtml(t.achievements.heading)}</h2>
    <h3>${escapeHtml(t.achievements.vol_title)}</h3>
    <ul>${vols}</ul>
    <h3>${escapeHtml(t.achievements.awards_title)}</h3>
    <ul>${awards}</ul>
    <h3>${escapeHtml(t.achievements.lang_title)}</h3>
    <ul>${languages}</ul>
  </section>
  <section id="contact">
    <h2>${escapeHtml(t.contact.heading)}</h2>
    <p>${boldify(t.contact.desc)}</p>
    <ul>
      <li>Email: <a href="mailto:${escapeHtml(person.email)}">${escapeHtml(person.email)}</a></li>
      <li>Phone: <a href="tel:${escapeHtml(person.phone)}">${escapeHtml(person.phoneDisplay)}</a></li>
      <li>LinkedIn: <a href="${escapeHtml(person.linkedin)}">${escapeHtml(person.linkedin)}</a></li>
      <li>Location: ${escapeHtml(person.addressLocality)}, ${escapeHtml(person.addressRegion)}</li>
    </ul>
  </section>
</main>
<footer>© 2026 ${escapeHtml(person.name)}</footer>`;
}

function renderHeadTags(portfolio, jsonld) {
  const { person } = portfolio;
  const t = portfolio.locales.en;
  const pageTitle = `${person.name} - MKirell`;
  const nameRole = `${person.name} — ${t.hero.cardRole}`;
  const description = stripMarkdown(t.hero.desc);
  const keywords = [
    person.name,
    t.hero.cardRole,
    person.worksFor,
    ...new Set(t.skills.categories.flatMap((c) => c.accentTags)),
  ].join(", ");
  const ogImage = `${stripTrailingSlash(person.url)}/imgs/og-image.png`;
  const attr = escapeAttr;

  return `
<style>#seo-shell{display:none}</style>
<noscript><style>#seo-shell{display:block}</style></noscript>
<title>${escapeHtml(pageTitle)}</title>
<meta name="description" content="${attr(description)}" />
<meta name="keywords" content="${attr(keywords)}" />
<meta name="author" content="${attr(person.name)}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
<meta name="theme-color" content="#14161b" />
<link rel="canonical" href="${attr(person.url)}" />
<link rel="me" href="${attr(person.linkedin)}" />
<link rel="me" href="${attr(person.github)}" />
<link rel="alternate" hreflang="en" href="${attr(person.url)}?lang=en" />
<link rel="alternate" hreflang="fr" href="${attr(person.url)}?lang=fr" />
<link rel="alternate" hreflang="x-default" href="${attr(person.url)}" />
<meta property="og:type" content="profile" />
<meta property="og:site_name" content="${attr(SITE_NAME)}" />
<meta property="og:title" content="${attr(pageTitle)}" />
<meta property="og:description" content="${attr(description)}" />
<meta property="og:url" content="${attr(person.url)}" />
<meta property="og:image" content="${attr(ogImage)}" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="2400" />
<meta property="og:image:height" content="1260" />
<meta property="og:image:alt" content="${attr(nameRole)}" />
<meta property="og:locale" content="en_US" />
<meta property="og:locale:alternate" content="fr_FR" />
<meta property="profile:first_name" content="${attr(person.givenName)}" />
<meta property="profile:last_name" content="${attr(person.familyName)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${attr(pageTitle)}" />
<meta name="twitter:description" content="${attr(description)}" />
<meta name="twitter:image" content="${attr(ogImage)}" />
<script type="application/ld+json">${jsonld}</script>
`;
}

export default function seoPrerender() {
  return {
    name: "seo-prerender",
    transformIndexHtml(html) {
      const portfolio = readJson(resolve(root, "src/data/portfolio.json"));
      const jsonld = JSON.stringify(buildJsonLd(portfolio));

      let out = html.replace(
        '<div id="app"></div>',
        `<div id="app"><div id="seo-shell">${renderSeoShell(portfolio)}</div></div>`,
      );
      out = out.replace(
        "</head>",
        `${renderHeadTags(portfolio, jsonld)}</head>`,
      );

      return out;
    },
  };
}
