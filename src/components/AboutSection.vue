<template>
  <section class="section" id="about" aria-labelledby="about-heading">
    <div class="container">
      <header class="section__header" v-reveal>
        <span class="section-num">01</span>
        <span class="section-name">{{ t.nav.about }}</span>
      </header>
      <h2 id="about-heading" class="section-h2" v-reveal>{{ t.about.heading }}</h2>
      <div class="about__grid">
        <div class="about__text" v-reveal>
          <p v-for="(para, i) in t.about.paragraphs" :key="i" v-html="boldify(para)"></p>
        </div>
        <div class="about__cards" v-reveal>
          <component v-for="(stat, i) in t.about.stats" :key="i" :is="stat.anchor ? 'a' : 'div'"
            :href="stat.anchor || undefined" class="stat-card">
            <span class="stat-card__num" :style="{ color: statColors[i] }">
              {{ statNums[i] }}
            </span>
            <span class="stat-card__label">{{ statLabels[i] }}</span>
          </component>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage.js'
import { boldify } from '@/utils/text.js'

const { t } = useLanguage()

const statColors = ['var(--accent-deep)', 'var(--sage)', 'var(--gold)', 'var(--accent-deep)']
const statNums = computed(() => t.value.about.stats.map(s => s.num))
const statLabels = computed(() => t.value.about.stats.map(s => s.label))
</script>

<style scoped>
.about__grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 56px;
  align-items: start;
}

.about__text p {
  color: var(--ink-soft);
  margin-bottom: 20px;
  line-height: 1.9;
  font-size: 1.03rem;
}

.about__cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

a.stat-card {
  text-decoration: none;
  cursor: pointer;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 26px 22px;
  text-align: center;
  transition: border-color var(--transition), transform var(--transition);
}

.stat-card:hover {
  border-color: var(--accent-line);
  transform: translateY(-3px);
}

.stat-card__num {
  display: block;
  font-family: 'Fraunces', serif;
  font-size: 2.3rem;
  font-weight: 600;
  line-height: 1;
  margin-bottom: 10px;
}

.stat-card__label {
  font-size: 0.8rem;
  color: var(--ink-soft);
}

@media (max-width: 900px) {
  .about__grid {
    grid-template-columns: 1fr;
  }
}
</style>
