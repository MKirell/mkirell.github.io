# MKirell  

> Personal portfolio of **Mohamed Khalil ZRELLY** — Generative AI Engineer Apprentice at Crédit Agricole.

[![Live](https://img.shields.io/badge/Live-mkirell.com-7c3aed?style=flat-square)](https://mkirell.com/)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883?style=flat-square&logo=vue.js)](https://vuejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

---

## Features

- Multilingual — English, French, Arabic (RTL)
- Schema.org JSON-LD structured data (SPARQL-queryable)
- Scroll-reveal animations via custom `v-reveal` directive
- Typewriter effect on hero section
- Fully static — deployed on GitHub Pages

---

## Tech Stack

| Layer | Tool |
| --- | --- |
| Framework | Vue 3 (Composition API) |
| Styling | Tailwind CSS 3 |
| Hosting | GitHub Pages |

---

## Getting Started

**Requirements:** Node.js v18+, npm v9+

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Switch language with `?lang=fr` or `?lang=ar`.

```bash
npm run build    # production build → dist/
npm run preview  # preview locally
```

---

## Project Structure

```text
├── index.html                  # Entry point — hreflang, fonts
├── vite-plugins/
│   └── seo.js                  # Builds JSON-LD, injects into index.html <head>
├── public/
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── main.js
    ├── style.css
    ├── App.vue
    ├── assets/flags/           # SVG flag icons (gb, fr, tn)
    ├── data/
    │   └── portfolio.json      # All UI content — person info + sections (en/fr/ar)
    ├── composables/
    │   ├── useLanguage.js      # Reactive language state
    │   └── useTypewriter.js
    ├── directives/
    │   └── reveal.js           # v-reveal scroll-reveal directive
    ├── utils/
    │   └── text.js             # boldify() — **text** → <strong>
    └── components/
        ├── AppNav.vue
        ├── HeroSection.vue
        ├── AboutSection.vue
        ├── SkillsSection.vue
        ├── ExperienceSection.vue
        ├── ProjectsSection.vue
        ├── EducationSection.vue
        ├── ContactSection.vue
        └── AppFooter.vue
```

---

## Data Sources

| File | Purpose |
| --- | --- |
| [`src/data/portfolio.json`](src/data/portfolio.json) | All UI text — nav, hero, about, skills, experience, projects, education, contact (en/fr/ar) |
| [`vite-plugins/seo.js`](vite-plugins/seo.js) | Schema.org JSON-LD — built at compile time, inlined into `<head>` |

---

## Semantic Web

### JSON-LD Visualization

Copy the `<script type="application/ld+json">` block from page source (or `dist/index.html`) into **[json-ld.org/playground](https://json-ld.org/playground/)** to visualize and inspect the entity graph.  

### SPARQL

Paste the same block into **[atomgraph.github.io/SPARQL-Playground](https://atomgraph.github.io/SPARQL-Playground/)** to query the structured data.  

#### Projects

```sparql
PREFIX schema: <https://schema.org/>
SELECT ?name ?desc ?date WHERE {
  ?p a schema:SoftwareApplication ;
     schema:name ?name ;
     schema:description ?desc ;
     schema:dateCreated ?date .
} ORDER BY DESC(?date)
```

#### Skills

```sparql
PREFIX schema: <https://schema.org/>
SELECT ?skill WHERE {
  ?p a schema:Person ;
     schema:knowsAbout ?skill .
}
```

#### Work Experience

```sparql
PREFIX schema: <https://schema.org/>
SELECT ?role ?org ?start ?end WHERE {
  ?r a schema:EmployeeRole ;
     schema:roleName ?role ;
     schema:startDate ?start ;
     schema:worksFor ?o .
  ?o schema:name ?org .
  OPTIONAL { ?r schema:endDate ?end . }
} ORDER BY DESC(?start)
```

#### Education

```sparql
PREFIX schema: <https://schema.org/>
SELECT ?degree ?school WHERE {
  ?c a schema:EducationalOccupationalCredential ;
     schema:name ?degree ;
     schema:recognizedBy ?i .
  ?i schema:name ?school .
}
```

#### Awards

```sparql
PREFIX schema: <https://schema.org/>
SELECT ?award WHERE {
  ?p a schema:Person ;
     schema:award ?award .
}
```

---

## Author

**Mohamed Khalil ZRELLY** — [LinkedIn](https://www.linkedin.com/in/mohamed-khalil-zrelly/) · [mkirell.com](https://mkirell.com/)
