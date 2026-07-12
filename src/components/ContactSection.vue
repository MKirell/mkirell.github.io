<template>
  <section class="section section--contact" id="contact" aria-labelledby="contact-heading">
    <div class="container">
      <header class="section__header section__header--center" v-reveal>
        <span class="section-num">06</span>
        <span class="section-name">{{ t.nav.contact }}</span>
      </header>
      <h2 id="contact-heading" v-reveal>{{ t.contact.heading }}</h2>
      <p class="contact__desc" v-html="boldify(t.contact.desc)" v-reveal></p>

      <address class="contact__links" v-reveal>
        <a :href="`mailto:${person.email}`" class="contact-item">
          <span class="contact-item__icon" aria-hidden="true">✉️</span>
          <span>
            <span class="contact-item__label">{{ t.contact.email_label }}</span>
            <span class="contact-item__value">{{ person.email }}</span>
          </span>
        </a>
        <a :href="`tel:${person.phone}`" class="contact-item">
          <span class="contact-item__icon" aria-hidden="true">📞</span>
          <span>
            <span class="contact-item__label">{{ t.contact.phone_label }}</span>
            <span class="contact-item__value">{{ person.phoneDisplay || person.phone }}</span>
          </span>
        </a>
        <a :href="person.linkedin" target="_blank" rel="noopener noreferrer" class="contact-item"
          :aria-label="t.contact.linkedin_label + ' - Mohamed Khalil Zrelly'">
          <span class="contact-item__icon" aria-hidden="true">💼</span>
          <span>
            <span class="contact-item__label">{{ t.contact.linkedin_label }}</span>
            <span class="contact-item__value">linkedin.com/in/mohamed-khalil-zrelly</span>
          </span>
        </a>
        <a href="https://www.google.com/maps/place/Le+Bourget,+France" target="_blank" rel="noopener noreferrer"
          class="contact-item" :aria-label="t.contact.location_label + ' - Le Bourget, Île-de-France, France'">
          <span class="contact-item__icon" aria-hidden="true">📍</span>
          <span>
            <span class="contact-item__label">{{ t.contact.location_label }}</span>
            <span class="contact-item__value">{{ person.addressLocality }}, {{ person.addressRegion }}, France</span>
          </span>
        </a>
      </address>

      <a :href="`mailto:${person.email}`" class="btn btn--primary btn--lg" v-reveal>
        {{ t.contact.cta }}
      </a>
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage.js'
import portfolioData from '@/data/portfolio.json'
const { person } = portfolioData
import { boldify } from '@/utils/text.js'
const { t } = useLanguage()
</script>

<style scoped>
.section--contact {
  background: var(--bg-tint);
  text-align: center;
}

.section__header--center {
  justify-content: center;
}

h2 {
  font-family: 'Fraunces', serif;
  font-size: clamp(1.9rem, 3.2vw, 2.7rem);
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.01em;
  margin-bottom: 28px;
}

.contact__desc {
  color: var(--ink-soft);
  font-size: 1.06rem;
  max-width: 580px;
  margin: 0 auto 52px;
  line-height: 1.85;
}

.contact__links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  max-width: 920px;
  margin: 0 auto 8px;
  text-align: start;
  font-style: normal;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 19px 22px;
  transition: border-color var(--transition), transform var(--transition);
}

.contact-item:is(a):hover,
.contact-item:hover {
  border-color: var(--accent-line);
  transform: translateY(-2px);
}

.contact-item__icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
  border-radius: 9px;
  background: var(--accent-soft);
}

.contact-item>span:last-child {
  display: flex;
  flex-direction: column;
}

.contact-item__label {
  display: block;
  font-size: 0.72rem;
  color: var(--ink-soft);
  margin-bottom: 2px;
  font-family: 'JetBrains Mono', monospace;
}

.contact-item__value {
  display: block;
  font-size: 0.9rem;
  color: var(--ink);
  font-weight: 500;
  word-break: break-word;
}

.btn--lg {
  margin-top: 48px;
}

@media (max-width: 700px) {
  .contact__links {
    grid-template-columns: 1fr;
  }
}
</style>
