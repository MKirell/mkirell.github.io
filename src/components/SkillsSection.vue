<template>
  <section class="section section--dark" id="skills" aria-labelledby="skills-heading">
    <div class="container">
      <header class="section__header" v-reveal>
        <span class="section-num">04</span>
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
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage.js'
import { Brain, Bot, Activity, Database, Globe, Cloud, Code2, Languages } from '@lucide/vue'

const icons = { Brain, Bot, Activity, Database, Globe, Cloud, Code2, Languages }

const { t } = useLanguage()
</script>

<style scoped>
.skills__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
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

@media (max-width: 700px) {
  .skills__grid {
    grid-template-columns: 1fr;
  }
}
</style>
