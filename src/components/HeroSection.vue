<template>
  <div class="hero-bg-grid" aria-hidden="true"></div>
  <section class="hero" id="hero" aria-labelledby="hero-heading">
    <div class="hero__content">
      <h1 id="hero-heading" class="hero__name">{{ t.hero.title }}</h1>

      <div class="hero__title">
        <span>{{ display }}</span><span class="cursor">|</span>
      </div>

      <p class="hero__desc" v-html="boldify(t.hero.desc)"></p>

      <div class="hero__ctas">
        <a href="#projects" class="btn btn--primary">{{ t.hero.cta_projects }}</a>
        <a href="#contact" class="btn btn--ghost">{{ t.hero.cta_contact }}</a>
      </div>
    </div>

    <div class="hero__visual">
      <!-- Profile terminal card -->
      <div class="terminal">
        <div class="terminal__bar">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
          <span class="terminal__title">profile.json</span>
        </div>
        <div class="terminal__body">
          <div class="terminal__line">
            <span class="cmd">{{ t.hero.card.jobTitle }}</span>
            <span class="out">{{ t.hero.cardRole }}</span>
          </div>
          <div class="terminal__line">
            <span class="cmd">{{ t.hero.card.worksFor }}</span>
            <span class="out">{{ person.worksFor }}</span>
          </div>
          <div class="terminal__line">
            <span class="cmd">{{ t.hero.card.location }}</span>
            <span class="out">{{ person.addressLocality }}, {{ person.addressRegion }}</span>
          </div>
          <div class="terminal__line">
            <span class="cmd">{{ t.hero.card.languages }}</span>
            <span class="out">{{t.skills.languages.map(l => l.name).join(' · ')}}</span>
          </div>
          <div class="terminal__line blink__line">
            <span class="cmd" style="color:var(--sage)">$</span>
            <span class="cursor" style="animation-delay:.2s">▋</span>
          </div>
        </div>
        <footer class="terminal__footer">
          <a :href="person.linkedin" target="_blank" rel="noopener noreferrer" class="social-link"
            aria-label="LinkedIn profile">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a :href="`mailto:${person.email}`" class="social-link" aria-label="Send email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m2 7 10 7 10-7" />
            </svg>
          </a>
          <a v-if="resumeUrl" :href="resumeUrl" target="_blank" rel="noopener noreferrer" :download="resumeFile"
            class="social-link cv-link" aria-label="Download Resume / CV" title="Download CV">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9 15 12 18 15 15" />
            </svg>
          </a>
        </footer>
      </div><!-- /.terminal -->
    </div><!-- /.hero__visual -->

    <div class="hero__scroll">
      <div class="scroll-indicator">
        <div class="scroll-indicator__wheel"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage.js'
import { useTypewriter } from '@/composables/useTypewriter.js'
import portfolioData from '@/data/portfolio.json'
import { docUrl } from '@/utils/docs.js'
import { boldify } from '@/utils/text.js'

const { person } = portfolioData
const { t, lang } = useLanguage()
const phrases = computed(() => t.value.hero.subtitles)
const { display } = useTypewriter(phrases)
const resumeFile = computed(() => lang.value === 'fr' ? person.resumeFr : person.resumeEn)
const resumeUrl = computed(() => docUrl(resumeFile.value))
</script>

<style scoped>
.hero {
  min-height: 94vh;
  display: grid;
  grid-template-columns: 1fr 408px;
  align-items: center;
  gap: 72px;
  padding: calc(var(--pad) + 88px) var(--pad) 96px;
  position: relative;
  overflow: hidden;
  max-width: 1440px;
  margin: 0 auto;
}

.hero__content {
  min-width: 0;
}

.hero__name {
  font-family: 'Fraunces', serif;
  font-size: clamp(2.9rem, 6.2vw, 5.1rem);
  font-weight: 600;
  line-height: 1.06;
  color: var(--ink);
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}


.hero__title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  color: var(--accent-deep);
  min-height: 26px;
  margin-top: 28px;
  margin-bottom: 26px;
}

.cursor {
  animation: blink 0.8s step-end infinite;
  color: var(--accent-deep);
}

.hero__desc {
  font-size: 1.08rem;
  color: var(--ink-soft);
  max-width: 560px;
  margin-bottom: 38px;
  line-height: 1.85;
}

.hero__ctas {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 44px;
}

.hero__visual {
  min-width: 0;
}

/* Terminal */
.terminal {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 36px 64px -28px rgba(0, 0, 0, 0.5);
}

.terminal__bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--surface-2);
  padding: 16px 22px;
  border-bottom: 1px solid var(--line);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot.red {
  background: var(--accent);
}

.dot.yellow {
  background: var(--gold);
}

.dot.green {
  background: var(--sage);
}

.terminal__title {
  margin-inline-start: auto;
  color: var(--muted);
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  font-family: 'JetBrains Mono', monospace;
}

.terminal__body {
  padding: 6px 22px 10px;
  display: flex;
  flex-direction: column;
}

.terminal__line {
  font-size: 0.86rem;
  color: var(--ink);
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}

.terminal__line:last-child {
  border-bottom: none;
  padding-top: 20px;
}

.terminal__line .cmd {
  color: var(--ink-soft);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  flex-shrink: 0;
}

.terminal__line .out {
  color: var(--ink);
  font-weight: 500;
  text-align: end;
}

.blink__line {
  border-bottom: none !important;
  justify-content: flex-start !important;
  gap: 9px;
  align-items: center;
}

.blink__line .cursor {
  font-size: 0.72rem;
  line-height: 1;
}

.terminal__footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 22px;
  border-top: 1px solid var(--line);
  background: var(--surface-2);
}

/* Scroll indicator */
.hero__scroll {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}

.scroll-indicator {
  width: 26px;
  height: 40px;
  border: 2px solid var(--line-strong);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  padding-top: 6px;
}

.scroll-indicator__wheel {
  width: 4px;
  height: 8px;
  background: var(--accent);
  border-radius: 2px;
  animation: scroll-wheel 2s ease infinite;
}

.cv-link {
  background: var(--accent);
  color: #fff;
  border-radius: 6px;
  margin-left: auto;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    padding: calc(var(--pad) + 88px) var(--pad) 60px;
    min-height: auto;
  }

  .hero__scroll {
    position: relative;
    bottom: auto;
    left: auto;
    transform: none;
    display: flex;
    justify-content: center;
    grid-column: 1 / -1;
    margin-top: 48px;
  }
}
</style>
