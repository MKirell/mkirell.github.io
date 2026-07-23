<template>
  <section class="section section--dark" id="achievements" aria-labelledby="achievements-heading">
    <div class="container">
      <header class="section__header" v-reveal>
        <span class="section-num">06</span>
        <span class="section-name">{{ t.nav.achievements }}</span>
      </header>
      <h2 id="achievements-heading" class="section-h2" v-reveal>{{ t.achievements.heading }}</h2>

      <div class="extras__grid" v-reveal>
        <div class="extra-block">
          <h3>{{ t.achievements.vol_title }}</h3>
          <ul>
            <li class="extra-card" v-for="(vol, i) in t.achievements.vols" :key="vol.org">
              <span class="extra-card__org-row">
                <p class="extra-card__org">{{ vol.org }}</p>
                <a v-if="volLinks && volLinks[i]" :href="volLinks[i]" target="_blank" rel="noopener noreferrer"
                  class="vol-link icon-hint" title="View on LinkedIn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" width="15" height="15" aria-hidden="true">
                    <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </span>
              <p class="extra-card__role">{{ vol.role }}</p>
              <div class="extra-card__period-row">
                <time class="extra-card__period">{{ vol.period }}</time>
                <a v-if="volDocs[i]" :href="docUrl(volDocs[i])" target="_blank" rel="noopener noreferrer"
                  class="doc-link icon-hint" title="View attestation">
                  <Paperclip :size="15" />
                </a>
              </div>
              <p class="extra-card__desc" v-html="boldify(vol.desc)"></p>
            </li>
          </ul>
        </div>
        <div class="extra-block">
          <h3>{{ t.achievements.awards_title }}</h3>
          <ul>
            <li class="award-card" v-for="(award, i) in t.achievements.awards" :key="award.title">
              <div class="award-card__icon" aria-hidden="true">
                <component :is="icons[award.icon]" :size="19" :stroke-width="1.8" />
              </div>
              <div class="award-card__body">
                <div class="award-card__title-row">
                  <p class="award-card__title">{{ award.title }}</p>
                  <button v-if="award.images && award.images.length" type="button" class="award-link icon-hint"
                    title="View photos" @click="openLightbox(award.images, award.title)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" width="15" height="15" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </button>
                </div>
                <span v-if="award.place" class="award-card__place">
                  {{ award.place }}
                  <span v-if="award.flagCode" :class="['fi', `fi-${award.flagCode}`]" class="award-flag"
                    aria-hidden="true"></span>
                </span>
              </div>
              <a v-if="awardDocs[i]" :href="docUrl(awardDocs[i])" target="_blank" rel="noopener noreferrer"
                class="doc-link icon-hint" title="View document">
                <Paperclip :size="15" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="lightbox.open" class="lightbox" @click.self="closeLightbox">
        <button class="lightbox__close" type="button" @click="closeLightbox" aria-label="Close">
          <X :size="22" />
        </button>
        <button v-if="lightbox.images.length > 1" class="lightbox__nav lightbox__nav--prev" type="button"
          @click="prevImage" aria-label="Previous image">
          <ChevronLeft :size="26" />
        </button>
        <img class="lightbox__img" :src="imgUrl(lightbox.images[lightbox.index])"
          :alt="`${lightbox.title} — photo ${lightbox.index + 1} of ${lightbox.images.length}`" />
        <button v-if="lightbox.images.length > 1" class="lightbox__nav lightbox__nav--next" type="button"
          @click="nextImage" aria-label="Next image">
          <ChevronRight :size="26" />
        </button>
        <span v-if="lightbox.images.length > 1" class="lightbox__count">{{ lightbox.index + 1 }} /
          {{ lightbox.images.length }}</span>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useLanguage } from '@/composables/useLanguage.js'
import { boldify } from '@/utils/text.js'
import { docUrl, imgUrl } from '@/utils/docs.js'
import { Paperclip, X, ChevronLeft, ChevronRight, Trophy, Medal, Award } from '@lucide/vue'
import portfolioData from '@/data/portfolio.json'

const icons = { Trophy, Medal, Award }

const { t } = useLanguage()
const { vols: volDocs, awards: awardDocs, volLinks } = portfolioData.docs

const lightbox = ref({ open: false, images: [], index: 0, title: '' })

function openLightbox(images, title) {
  lightbox.value = { open: true, images, index: 0, title }
}
function closeLightbox() {
  lightbox.value.open = false
}
function nextImage() {
  lightbox.value.index = (lightbox.value.index + 1) % lightbox.value.images.length
}
function prevImage() {
  lightbox.value.index = (lightbox.value.index - 1 + lightbox.value.images.length) % lightbox.value.images.length
}
function onKeydown(e) {
  if (!lightbox.value.open) return
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowRight') nextImage()
  else if (e.key === 'ArrowLeft') prevImage()
}
window.addEventListener('keydown', onKeydown)
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
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

.award-link {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--gold);
  opacity: 0.7;
  flex-shrink: 0;
  text-decoration: none;
  transition: opacity var(--transition);
}

.award-link:hover {
  opacity: 1;
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.88);
  padding: 40px;
}

.lightbox__img {
  max-width: min(90vw, 900px);
  max-height: 85vh;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.lightbox__close {
  position: absolute;
  top: 20px;
  right: 24px;
  display: flex;
  background: none;
  border: none;
  color: #fff;
  line-height: 1;
  cursor: pointer;
  opacity: 0.75;
  transition: opacity var(--transition);
}

.lightbox__close:hover {
  opacity: 1;
}

.lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  line-height: 1;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: opacity var(--transition), background var(--transition);
}

.lightbox__nav:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
}

.lightbox__nav--prev {
  left: 20px;
}

.lightbox__nav--next {
  right: 20px;
}

.lightbox__count {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  opacity: 0.75;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
}

.extra-card__period-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.extras__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}

.extra-block h3 {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--accent-deep);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 22px;
}

.extra-card {
  border-inline-start: 2px solid var(--accent);
  padding-inline-start: 20px;
  margin-bottom: 28px;
}

.extra-card:last-child {
  margin-bottom: 0;
}

.extra-card__org-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.extra-card__org {
  font-family: 'Fraunces', serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 0;
}

.vol-link {
  display: inline-flex;
  align-items: center;
  color: var(--gold);
  opacity: 0.6;
  text-decoration: none;
  transition: opacity var(--transition);
  flex-shrink: 0;
}

.vol-link:hover {
  opacity: 1;
}

.extra-card__role {
  font-size: 0.92rem;
  color: var(--ink);
  font-weight: 500;
  margin-bottom: 5px;
}

.extra-card__period {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--ink-soft);
  opacity: 0.75;
}

.extra-card__desc {
  font-size: 0.92rem;
  color: var(--ink-soft);
  line-height: 1.65;
}

.award-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 18px 20px;
  margin-bottom: 14px;
  transition: border-color var(--transition), transform var(--transition);
}

.award-card:hover {
  border-color: rgba(184, 137, 59, 0.4);
  transform: translateX(4px);
}

.award-card__icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
  border-radius: 10px;
  background: var(--gold-soft);
}

.award-card__body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  gap: 12px;
}

.award-card__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.award-card__title {
  font-family: 'Fraunces', serif;
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--ink);
}

.award-card__place {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  line-height: 1;
  color: var(--ink-soft);
}

.award-flag {
  display: block;
  width: 16px;
  height: 11px;
  border-radius: 2px;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .extras__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .award-card {
    flex-wrap: wrap;
    row-gap: 10px;
  }

  .award-card__body {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 6px;
    min-width: 0;
  }

  .award-card>.doc-link {
    margin-inline-start: auto;
  }
}
</style>
