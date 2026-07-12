# MKirell  

> Personal portfolio of **Mohamed Khalil Zrelly** — Generative AI Engineer Apprentice at Crédit Agricole.

[![Live](https://img.shields.io/badge/Live-makiz--code.github.io/MKirell-7c3aed?style=flat-square)](https://makiz-code.github.io/MKirell)
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
├── index.html                  # Entry point — hreflang, JSON-LD link, fonts
├── public/
│   ├── jsonld.json             # Schema.org JSON-LD structured data
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
    │   ├── useJsonLd.js        # Fetches jsonld.json, injects <script type="application/ld+json">
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
| [`public/jsonld.json`](public/jsonld.json) | Schema.org structured data — fetched at runtime and injected into `<head>` |

---

## Semantic Web

### JSON-LD Visualization

Paste [`public/jsonld.json`](public/jsonld.json) into **[json-ld.org/playground](https://json-ld.org/playground/)** to visualize and inspect the entity graph.  

### SPARQL

Paste [`public/jsonld.json`](public/jsonld.json) into **[atomgraph.github.io/SPARQL-Playground](https://atomgraph.github.io/SPARQL-Playground/)** to query the structured data.  

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

**Mohamed Khalil Zrelly** — [LinkedIn](https://www.linkedin.com/in/mohamed-khalil-zrelly/) · [makiz-code.github.io/MKirell](https://makiz-code.github.io/MKirell)
