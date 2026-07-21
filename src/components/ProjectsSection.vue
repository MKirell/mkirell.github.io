<template>
  <section class="section" id="projects" aria-labelledby="projects-heading">
    <div class="container">
      <header class="section__header" v-reveal>
        <span class="section-num">03</span>
        <span class="section-name">{{ t.nav.projects }}</span>
      </header>
      <h2 id="projects-heading" class="section-h2" v-reveal>{{ t.projects.heading }}</h2>
      <ul class="projects__grid" ref="gridEl" aria-label="Project list">
        <li v-for="(project, i) in t.projects.items" :key="project.title" class="project-card" v-reveal>
          <div class="project-card__header">
            <div class="project-card__left">
              <time class="project-card__period">{{ project.period }}{{ project.duration ? ` (${project.duration})` : ''
              }}</time>
            </div>
            <span class="project-badge">{{ project.badge }}</span>
          </div>
          <div class="project-card__title-row">
            <h3 class="project-card__title">
              {{ project.title }}
              <a v-if="projectLinks[i]" :href="projectLinks[i]" target="_blank" rel="noopener noreferrer"
                class="project-link icon-hint" title="View on GitHub">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" width="15" height="15" aria-hidden="true">
                  <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </h3>
            <button type="button" class="project-expand icon-hint" title="View full details"
              aria-label="View full project details" @click="openModal(project, i)">
              <Maximize2 :size="14" />
            </button>
          </div>
          <p class="project-card__desc" title="Click to view full details" @click="openModal(project, i)"
            v-html="boldify(project.desc)"></p>
          <ul class="tags tags-sm" :ref="el => setTagsRef(el, i)" aria-label="Technologies used">
            <li v-for="tag in visibleTags(i)" :key="tag" class="tag">{{ tag }}</li>
            <li v-if="hiddenCount(i) > 0" class="tag tag--more" role="button" tabindex="0"
              :aria-label="`Show ${hiddenCount(i)} more technologies`" @click="openModal(project, i)"
              @keydown.enter="openModal(project, i)" @keydown.space.prevent="openModal(project, i)">
              +{{ hiddenCount(i) }}
            </li>
          </ul>
          <ul class="tags tags-sm tags-measure" :ref="el => setMeasureRef(el, i)" aria-hidden="true">
            <li v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</li>
            <li class="tag tag--more">+{{ project.tags.length }}</li>
          </ul>
        </li>
      </ul>
    </div>

    <Teleport to="body">
      <div v-if="modal.open" class="project-modal-backdrop" @click.self="closeModal">
        <div class="project-modal" role="dialog" aria-modal="true" :aria-label="modal.project.title">
          <div class="project-card__header">
            <div class="project-card__left">
              <time class="project-card__period">{{ modal.project.period }}{{ modal.project.duration ?
                ` (${modal.project.duration})` : '' }}</time>
            </div>
            <div class="project-modal__header-right">
              <span class="project-badge">{{ modal.project.badge }}</span>
              <button class="project-modal__close" type="button" @click="closeModal" aria-label="Close">
                <X :size="18" />
              </button>
            </div>
          </div>
          <div class="project-card__title-row">
            <h3 class="project-card__title">
              {{ modal.project.title }}
              <a v-if="projectLinks[modal.index]" :href="projectLinks[modal.index]" target="_blank"
                rel="noopener noreferrer" class="project-link icon-hint" title="View on GitHub">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" width="15" height="15" aria-hidden="true">
                  <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </h3>
          </div>
          <p class="project-modal__desc" v-html="boldify(modal.project.desc)"></p>
          <ul class="tags" aria-label="Technologies used">
            <li v-for="tag in modal.project.tags" :key="tag" class="tag">{{ tag }}</li>
          </ul>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, reactive, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '@/composables/useLanguage.js'
import { boldify } from '@/utils/text.js'
import { Maximize2, X } from '@lucide/vue'
import portfolioData from '@/data/portfolio.json'

const { t, lang } = useLanguage()
const projectLinks = portfolioData.docs.projectLinks

const gridEl = ref(null)
const tagsRefs = ref({})
const measureRefs = ref({})
const visibleCounts = reactive({})

function setTagsRef(el, i) {
  if (el) tagsRefs.value[i] = el
}
function setMeasureRef(el, i) {
  if (el) measureRefs.value[i] = el
}

function visibleTags(i) {
  const tags = t.value.projects.items[i].tags
  const count = visibleCounts[i] ?? tags.length
  return tags.slice(0, count)
}
function hiddenCount(i) {
  const tags = t.value.projects.items[i].tags
  const count = visibleCounts[i] ?? tags.length
  return tags.length - count
}

function measureAll() {
  t.value.projects.items.forEach((project, i) => {
    const container = tagsRefs.value[i]
    const measure = measureRefs.value[i]
    if (!container || !measure) return

    const containerWidth = container.clientWidth
    const gap = parseFloat(getComputedStyle(container).gap) || 0
    const children = Array.from(measure.children)
    const badgeEl = children[children.length - 1]
    const tagEls = children.slice(0, -1)
    const badgeWidth = badgeEl.getBoundingClientRect().width

    let used = 0
    let count = 0
    for (let idx = 0; idx < tagEls.length; idx++) {
      const w = tagEls[idx].getBoundingClientRect().width
      const withGap = used + (count > 0 ? gap : 0) + w
      const isLast = idx === tagEls.length - 1
      const reserve = isLast ? 0 : gap + badgeWidth
      if (withGap + reserve <= containerWidth) {
        used = withGap
        count++
      } else {
        break
      }
    }
    visibleCounts[i] = Math.max(count, 1)
  })
}

let resizeObserver
onMounted(async () => {
  await nextTick()
  measureAll()
  resizeObserver = new ResizeObserver(() => measureAll())
  if (gridEl.value) resizeObserver.observe(gridEl.value)
})
onUnmounted(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('keydown', onKeydown)
})

watch(lang, async () => {
  await nextTick()
  measureAll()
})

const modal = reactive({ open: false, project: null, index: -1 })
function openModal(project, i) {
  modal.open = true
  modal.project = project
  modal.index = i
}
function closeModal() {
  modal.open = false
}
function onKeydown(e) {
  if (modal.open && e.key === 'Escape') closeModal()
}
window.addEventListener('keydown', onKeydown)
</script>

<style scoped>
.projects__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 20px;
}

.project-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 30px;
  transition: border-color var(--transition), transform var(--transition), box-shadow var(--transition);
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0;
  transition: opacity var(--transition);
}

.project-card:hover {
  border-color: var(--accent-line);
  transform: translateY(-4px);
  box-shadow: 0 20px 44px -16px rgba(0, 0, 0, 0.4);
}

.project-card:hover::before {
  opacity: 1;
}

.project-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.project-card__left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.project-card__period {
  font-size: 0.72rem;
  color: var(--ink-soft);
  font-family: 'JetBrains Mono', monospace;
}


.project-badge {
  background: var(--gold-soft);
  border: 1px solid rgba(184, 137, 59, 0.3);
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 0.72rem;
  color: var(--gold);
  font-family: 'JetBrains Mono', monospace;
}

.project-card__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.project-card__title {
  font-family: 'Fraunces', serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 0;
  flex: 1;
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.project-link {
  display: inline-flex;
  align-items: center;
  color: var(--gold);
  opacity: 0.6;
  text-decoration: none;
  flex-shrink: 0;
  transition: opacity var(--transition);
}

.project-link:hover {
  opacity: 1;
}

.project-expand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--gold);
  opacity: 0.6;
  flex-shrink: 0;
  transition: opacity var(--transition);
}

.project-expand:hover {
  opacity: 1;
}

.project-card__desc {
  color: var(--ink-soft);
  font-size: 0.92rem;
  line-height: 1.8;
  margin-bottom: 22px;
  cursor: pointer;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags.tags-sm {
  flex-wrap: nowrap;
  overflow: hidden;
}

.tags.tags-sm .tag {
  flex-shrink: 0;
  white-space: nowrap;
}

.tags.tags-measure {
  position: absolute;
  visibility: hidden;
  height: 0;
  overflow: hidden;
  flex-wrap: nowrap;
  pointer-events: none;
}

.tag--more {
  cursor: pointer;
  background: var(--accent-soft);
  border-color: var(--accent-line);
  color: var(--accent-deep);
  font-weight: 600;
}

.tag--more:hover {
  border-color: var(--accent);
}

@media (max-width: 900px) {
  .projects__grid {
    grid-template-columns: 1fr;
  }
}

.project-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.88);
  padding: 40px 20px;
}

.project-modal {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 34px;
  max-width: 560px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.project-modal__header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.project-modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--ink-soft);
  cursor: pointer;
  opacity: 0.75;
  transition: opacity var(--transition);
}

.project-modal__close:hover {
  opacity: 1;
}

.project-modal__desc {
  color: var(--ink-soft);
  font-size: 0.95rem;
  line-height: 1.8;
  margin-bottom: 22px;
}
</style>
