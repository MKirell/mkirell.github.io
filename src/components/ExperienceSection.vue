<template>
  <section class="section" id="experience" aria-labelledby="experience-heading">
    <div class="container">
      <header class="section__header" v-reveal>
        <span class="section-num">03</span>
        <span class="section-name">{{ t.nav.experience }}</span>
      </header>
      <h2 id="experience-heading" class="section-h2" v-reveal>{{ t.experience.heading }}</h2>
      <ol class="timeline">
        <li v-for="(job, i) in t.experience.jobs" :key="job.company + job.period" class="timeline__item" v-reveal>
          <div class="timeline__dot" aria-hidden="true"></div>
          <article class="timeline__card">
            <header class="timeline__meta">
              <span class="timeline__company">
                {{ job.company }}
                <a v-if="expLinks[i]" :href="expLinks[i]" target="_blank" rel="noopener noreferrer" class="company-link"
                  title="View on LinkedIn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" width="13" height="13" aria-hidden="true">
                    <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </span>
              <div class="timeline__meta-right">
                <time class="timeline__period">{{ job.period }}</time>
                <a v-if="expDocs[i]" :href="docUrl(expDocs[i])" target="_blank" rel="noopener noreferrer"
                  class="doc-link" title="View attestation">📎</a>
              </div>
            </header>
            <p class="timeline__role">
              {{ job.role }}
              <span v-if="job.current" class="timeline__current">{{ t.experience.current_label }}</span>
            </p>
            <ul class="timeline__bullets">
              <li v-for="(bullet, i) in job.bullets" :key="i" v-html="boldify(bullet)"></li>
            </ul>
            <ul class="tags tags-sm" aria-label="Technologies used">
              <li v-for="tag in job.tags" :key="tag" class="tag">{{ tag }}</li>
            </ul>
          </article>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage.js'
import { boldify } from '@/utils/text.js'
import { docUrl } from '@/utils/docs.js'
import portfolioData from '@/data/portfolio.json'

const { t } = useLanguage()
const expDocs = portfolioData.docs.experience
const expLinks = portfolioData.docs.experienceLinks
</script>

<style scoped>
.timeline {
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  inset-inline-start: 19px;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: var(--line-strong);
}

.timeline__item {
  display: flex;
  gap: 32px;
  margin-bottom: 48px;
  position: relative;
}

.timeline__dot {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--surface);
  border: 2px solid var(--accent);
  box-shadow: 0 0 0 6px var(--bg);
  z-index: 1;
}

.timeline__card {
  flex: 1;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 30px 34px;
  transition: border-color var(--transition);
}

.timeline__card:hover {
  border-color: var(--accent-line);
}

.timeline__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.timeline__meta-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.doc-link {
  font-size: 1rem;
  text-decoration: none;
  opacity: 0.6;
  transition: opacity var(--transition);
  line-height: 1;
}

.doc-link:hover {
  opacity: 1;
}

.timeline__company {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--accent-deep);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.company-link {
  display: inline-flex;
  align-items: center;
  color: var(--accent-deep);
  margin-top: -1px;
  opacity: 0.6;
  text-decoration: none;
  transition: opacity var(--transition);
  flex-shrink: 0;
}

.company-link:hover {
  opacity: 1;
}

.timeline__period {
  color: var(--ink-soft);
  font-size: 0.75rem;
}

.timeline__role {
  font-family: 'Fraunces', serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.timeline__current {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.64rem;
  font-weight: 500;
  background: var(--sage-soft);
  border: 1px solid rgba(110, 127, 92, 0.3);
  color: var(--sage);
  border-radius: 100px;
  padding: 3px 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.timeline__bullets {
  padding-inline-start: 0;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.timeline__bullets li {
  color: var(--ink-soft);
  font-size: 0.95rem;
  line-height: 1.75;
  padding-inline-start: 18px;
  position: relative;
}

.timeline__bullets li::before {
  content: '—';
  position: absolute;
  inset-inline-start: 0;
  color: var(--accent);
}

@media (max-width: 700px) {
  .timeline::before {
    display: none;
  }

  .timeline__item {
    gap: 16px;
  }

  .timeline__dot {
    display: none;
  }

  .timeline__card {
    padding: 22px;
  }
}
</style>
