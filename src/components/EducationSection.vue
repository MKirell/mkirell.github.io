<template>
  <section class="section" id="education" aria-labelledby="education-heading">
    <div class="container">
      <header class="section__header" v-reveal>
        <span class="section-num">05</span>
        <span class="section-name">{{ t.nav.education }}</span>
      </header>
      <h2 id="education-heading" class="section-h2" v-reveal>{{ t.education.heading }}</h2>

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
          <div class="edu__sub-row">
            <p class="edu__sub">{{ t.education.certs_title }}</p>
            <div v-if="certPageCount > 1" class="cert-carousel__nav">
              <button type="button" class="cert-nav-btn icon-hint" @click="prevCertPage" :disabled="certPage === 0"
                aria-label="Previous certifications">
                <ChevronLeft :size="16" />
              </button>
              <span class="cert-dots">
                <button v-for="p in certPageCount" :key="p" type="button"
                  :class="['cert-dot', { active: certPage === p - 1 }]" @click="certPage = p - 1"
                  :aria-label="`Go to certifications page ${p}`"></button>
              </span>
              <button type="button" class="cert-nav-btn icon-hint" @click="nextCertPage"
                :disabled="certPage === certPageCount - 1" aria-label="Next certifications">
                <ChevronRight :size="16" />
              </button>
            </div>
          </div>
          <Transition name="cert-fade" mode="out-in">
            <ul class="cert-list" :key="certPage">
              <li class="cert-item" v-for="(cert, i) in pagedCerts" :key="cert.title">
                <div class="cert-item__icon" aria-hidden="true">
                  <component :is="icons[cert.icon]" :size="17" :stroke-width="1.8" />
                </div>
                <div class="cert-item__body">
                  <p class="cert-item__title">{{ cert.title }}</p>
                  <div class="cert-item__meta">
                    <p class="cert-item__issuer">{{ cert.issuer }}</p>
                    <time v-if="cert.date" class="cert-item__date cert-item__date--meta">{{ cert.date }}</time>
                  </div>
                </div>
                <time v-if="cert.date" class="cert-item__date cert-item__date--inline">{{ cert.date }}</time>
                <a v-if="certDocs[certPage * CERTS_PER_PAGE + i]"
                  :href="docUrl(certDocs[certPage * CERTS_PER_PAGE + i])" target="_blank" rel="noopener noreferrer"
                  class="doc-link icon-hint" title="View certificate">
                  <Paperclip :size="15" />
                </a>
              </li>
            </ul>
          </Transition>
        </div>
      </div>

      <p class="languages__title">{{ t.education.lang_title }}</p>
      <ul class="languages__list" v-reveal aria-label="Language proficiency">
        <li v-for="(langItem, i) in t.education.languages" :key="langItem.name" class="lang-item">
          <div class="lang-item__top">
            <span :class="['fi', `fi-${langItem.flagCode}`]" class="lang-flag-icon" aria-hidden="true"></span>
            <span class="lang-name">{{ langItem.name }}</span>
            <span class="lang-level">{{ langItem.level }}</span>
            <a v-if="langDocs[i]" :href="docUrl(langDocs[i])" target="_blank" rel="noopener noreferrer"
              class="doc-link icon-hint" title="View certificate">
              <Paperclip :size="15" />
            </a>
          </div>
          <div class="lang-bar" role="progressbar" :aria-valuenow="langItem.pct" aria-valuemin="0" aria-valuemax="100"
            :aria-label="langItem.name + ' proficiency'">
            <div class="lang-bar__fill" :style="{ width: langItem.pct + '%' }"></div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useLanguage } from '@/composables/useLanguage.js'
import { docUrl } from '@/utils/docs.js'
import { Paperclip, Zap, MessageSquare, Cloud, BarChart3, Layers, SlidersHorizontal, ChevronLeft, ChevronRight } from '@lucide/vue'
import portfolioData from '@/data/portfolio.json'

const icons = { Zap, MessageSquare, Cloud, BarChart3, Layers, SlidersHorizontal }

const { t, lang } = useLanguage()
const { degrees: degDocs, certs: certDocs, languages: langDocs } = portfolioData.docs

const CERTS_PER_PAGE = 4
const certPage = ref(0)
const certPageCount = computed(() => Math.ceil(t.value.education.certs.length / CERTS_PER_PAGE))
const pagedCerts = computed(() => {
  const start = certPage.value * CERTS_PER_PAGE
  return t.value.education.certs.slice(start, start + CERTS_PER_PAGE)
})

function prevCertPage() {
  if (certPage.value > 0) certPage.value--
}
function nextCertPage() {
  if (certPage.value < certPageCount.value - 1) certPage.value++
}

watch(lang, () => {
  certPage.value = 0
})
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

.edu__sub-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 26px;
}

.edu__sub-row .edu__sub {
  margin-bottom: 0;
}

.cert-carousel__nav {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cert-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink-soft);
  cursor: pointer;
  transition: border-color var(--transition), color var(--transition), opacity var(--transition);
}

.cert-nav-btn:hover:not(:disabled) {
  border-color: var(--accent-line);
  color: var(--accent-deep);
}

.cert-nav-btn:disabled {
  opacity: 0.35;
  cursor: default;
}

.cert-dots {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cert-dot {
  width: 6px;
  height: 6px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--line);
  cursor: pointer;
  transition: background var(--transition), transform var(--transition);
}

.cert-dot:hover {
  background: var(--accent-line);
}

.cert-dot.active {
  background: var(--accent-deep);
  transform: scale(1.3);
}

.cert-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 340px;
}

.cert-fade-enter-active,
.cert-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.cert-fade-enter-from {
  opacity: 0;
  transform: translateX(8px);
}

.cert-fade-leave-to {
  opacity: 0;
  transform: translateX(-8px);
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

.cert-item__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
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

.cert-item__date--meta {
  display: none;
}

.languages__title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--accent-deep);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 56px;
  margin-bottom: 22px;
}

.languages__list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.lang-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lang-item__top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lang-flag-icon {
  width: 22px;
  height: 16px;
  border-radius: 3px;
  flex-shrink: 0;
}

.lang-name {
  color: var(--ink);
  font-size: 0.92rem;
  font-weight: 500;
}

.lang-bar {
  height: 6px;
  background: var(--line);
  border-radius: 3px;
  overflow: hidden;
}

.lang-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--gold));
  border-radius: 3px;
  transition: width 1s ease;
}

.lang-level {
  color: var(--ink-soft);
  font-size: 0.72rem;
  margin-inline-start: auto;
  line-height: 1;
}

@media (max-width: 900px) {
  .edu__grid {
    grid-template-columns: 1fr;
  }

  .languages__list {
    grid-template-columns: 1fr;
  }

  .cert-item__date--meta {
    display: inline;
  }

  .cert-item__date--inline {
    display: none;
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

@media (max-width: 600px) {
  .cert-item {
    flex-wrap: wrap;
    row-gap: 8px;
  }

  .cert-item__body {
    min-width: 0;
  }

  .cert-item>.doc-link {
    margin-inline-start: auto;
  }
}
</style>
