<template>
  <section class="section" id="education" aria-labelledby="education-heading">
    <div class="container">
      <header class="section__header" v-reveal>
        <span class="section-num">05</span>
        <span class="section-name">{{ t.nav.education }}</span>
      </header>
      <h2 id="education-heading" class="section-h2" v-reveal>{{ t.education.heading }}</h2>

      <!-- Degrees + Certs -->
      <div class="edu__grid" v-reveal>
        <div>
          <p class="edu__sub">{{ t.education.degrees_title }}</p>
          <ul class="edu-list">
            <li class="edu-card" v-for="(deg, i) in t.education.degrees" :key="deg.title">
              <time class="edu-card__year">{{ deg.years }}</time>
              <div class="edu-card__body">
                <div class="edu-card__title-row">
                  <h3>{{ deg.title }}</h3>
                  <a v-if="degDocs[i]" :href="docUrl(degDocs[i])" target="_blank" rel="noopener noreferrer"
                    class="doc-link icon-hint" title="View diploma">
                    <Paperclip :size="15" />
                  </a>
                </div>
                <span v-if="deg.school" class="edu-card__school-row">
                  <span class="edu-card__school">{{ deg.school }}</span>
                  <a v-if="deg.link" :href="deg.link" target="_blank" rel="noopener noreferrer"
                    class="school-link icon-hint" title="View on LinkedIn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" width="15" height="15" aria-hidden="true">
                      <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </span>
                <span v-if="deg.location" class="edu-card__location">{{ deg.location }}</span>
                <span v-if="deg.mention" class="edu-card__mention">{{ deg.mention }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <p class="edu__sub">{{ t.education.certs_title }}</p>
          <ul class="cert-list">
            <li class="cert-item" v-for="(cert, i) in t.education.certs" :key="cert.title">
              <div class="cert-item__icon" aria-hidden="true">
                <component :is="icons[cert.icon]" :size="17" :stroke-width="1.8" />
              </div>
              <div class="cert-item__body">
                <p class="cert-item__title">{{ cert.title }}</p>
                <p class="cert-item__issuer">{{ cert.issuer }}</p>
              </div>
              <time v-if="cert.date" class="cert-item__date">{{ cert.date }}</time>
              <a v-if="certDocs[i]" :href="docUrl(certDocs[i])" target="_blank" rel="noopener noreferrer"
                class="doc-link icon-hint" title="View certificate">
                <Paperclip :size="15" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage.js'
import { docUrl } from '@/utils/docs.js'
import { Paperclip, Zap, MessageSquare, Cloud, BarChart3 } from '@lucide/vue'
import portfolioData from '@/data/portfolio.json'

const icons = { Zap, MessageSquare, Cloud, BarChart3 }

const { t } = useLanguage()
const { degrees: degDocs, certs: certDocs } = portfolioData.docs
</script>

<style scoped>
.doc-link {
  display: inline-flex;
  align-items: center;
  color: var(--gold);
  text-decoration: none;
  opacity: 0.6;
  transition: opacity var(--transition);
  line-height: 1;
  flex-shrink: 0;
}

.doc-link:hover {
  opacity: 1;
}

.edu-card__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0;
}

.edu-card__title-row h3 {
  margin-bottom: 0;
}

.edu-card__title-row .doc-link {
  margin-top: -5px;
}

.edu-list {
  display: flex;
  flex-direction: column;
}

.edu__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}

.edu__sub {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  color: var(--accent-deep);
  margin-bottom: 26px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.78rem;
}

.edu-card {
  display: flex;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
}

.edu-card:last-child {
  border-bottom: none;
}

.edu-card__year {
  flex-shrink: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  color: var(--ink-soft);
  width: 90px;
  padding-top: 3px;
}

.edu-card__body h3 {
  font-family: 'Fraunces', serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 5px;
}

.edu-card__school {
  display: block;
  font-size: 0.85rem;
  color: var(--ink);
  font-weight: 500;
}

.edu-card__school-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.school-link {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
  opacity: 0.7;
  flex-shrink: 0;
  text-decoration: none;
  transition: opacity var(--transition);
}

.school-link:hover {
  opacity: 1;
}

.edu-card__location {
  display: block;
  font-size: 0.85rem;
  color: var(--ink-soft);
}

.edu-card__mention {
  display: inline-block;
  margin-top: 9px;
  background: var(--gold-soft);
  border: 1px solid rgba(184, 137, 59, 0.3);
  border-radius: 6px;
  padding: 2px 10px;
  font-size: 0.76rem;
  color: var(--gold);
  font-family: 'JetBrains Mono', monospace;
}

.cert-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cert-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 17px 19px;
  transition: border-color var(--transition);
}

.cert-item__body {
  flex: 1;
}

.cert-item:hover {
  border-color: var(--accent-line);
}

.cert-item__icon {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-deep);
  border-radius: 9px;
  background: var(--accent-soft);
}

.cert-item__title {
  font-size: 0.92rem;
  color: var(--ink);
  font-weight: 500;
  margin-bottom: 3px;
}

.cert-item__issuer {
  color: var(--ink-soft);
  font-size: 0.72rem;
  font-family: 'JetBrains Mono', monospace;
}

.cert-item__date {
  flex-shrink: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  color: var(--ink-soft);
  opacity: 0.7;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .edu__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .edu-card {
    flex-direction: column;
    gap: 6px;
  }

  .edu-card__year {
    width: auto;
    padding-top: 0;
  }
}
</style>
