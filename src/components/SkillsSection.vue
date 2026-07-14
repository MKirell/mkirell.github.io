<template>
  <section class="section section--dark" id="skills" aria-labelledby="skills-heading">
    <div class="container">
      <header class="section__header" v-reveal>
        <span class="section-num">02</span>
        <span class="section-name">{{ t.nav.skills }}</span>
      </header>
      <h2 id="skills-heading" class="section-h2" v-reveal>{{ t.skills.heading }}</h2>

      <ul class="skills__grid" aria-label="Skill categories">
        <li v-for="cat in t.skills.categories" :key="cat.title" class="skill-category" v-reveal>
          <div class="skill-category__icon" aria-hidden="true">
            <component :is="icons[cat.icon]" :size="19" :stroke-width="1.8" />
          </div>
          <h3>{{ cat.title }}</h3>
          <ul class="tags" aria-label="Technologies">
            <li v-for="tag in cat.tags" :key="tag"
              :class="['tag', { 'tag--accent': cat.accent || (cat.accentTags && cat.accentTags.includes(tag)) }]">{{ tag
              }}</li>
          </ul>
        </li>
      </ul>

      <p class="languages__title">{{ t.skills.lang_title }}</p>
      <ul class="languages__list" v-reveal aria-label="Language proficiency">
        <li v-for="(lang, i) in t.skills.languages" :key="lang.name" class="lang-item">
          <div class="lang-item__top">
            <span :class="['fi', `fi-${lang.flagCode}`]" class="lang-flag-icon" aria-hidden="true"></span>
            <span class="lang-name">{{ lang.name }}</span>
            <span class="lang-level">{{ lang.level }}</span>
            <a v-if="langDocs[i]" :href="docUrl(langDocs[i])" target="_blank" rel="noopener noreferrer"
              class="doc-link icon-hint" title="View certificate">
              <Paperclip :size="15" />
            </a>
          </div>
          <div class="lang-bar" role="progressbar" :aria-valuenow="lang.pct" aria-valuemin="0" aria-valuemax="100"
            :aria-label="lang.name + ' proficiency'">
            <div class="lang-bar__fill" :style="{ width: lang.pct + '%' }"></div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage.js'
import { docUrl } from '@/utils/docs.js'
import { Paperclip, Brain, Bot, Activity, BarChart3, Database, Globe, Cloud, Code2 } from '@lucide/vue'
import portfolioData from '@/data/portfolio.json'

const icons = { Brain, Bot, Activity, BarChart3, Database, Globe, Cloud, Code2 }

const { t } = useLanguage()
const langDocs = portfolioData.docs.languages
</script>

<style scoped>
.skills__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 64px;
}

.skill-category {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 22px;
  transition: border-color var(--transition), transform var(--transition);
}

.skill-category:hover {
  border-color: var(--accent-line);
  transform: translateY(-3px);
}

.skill-category__icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-deep);
  border-radius: 10px;
  background: var(--accent-soft);
  margin-bottom: 16px;
}

.skill-category h3 {
  font-family: 'Fraunces', serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 16px;
}

.languages__title {
  font-family: 'Fraunces', serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--ink);
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

.doc-link {
  display: inline-flex;
  align-items: center;
  color: var(--gold);
  font-size: 1rem;
  text-decoration: none;
  opacity: 0.6;
  transition: opacity var(--transition);
  line-height: 1;
  flex-shrink: 0;
}

.doc-link:hover {
  opacity: 1;
}

@media (max-width: 700px) {
  .skills__grid {
    grid-template-columns: 1fr;
  }

  .languages__list {
    grid-template-columns: 1fr;
  }
}
</style>
