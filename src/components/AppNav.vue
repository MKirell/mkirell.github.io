<template>
  <nav id="navbar" :class="['nav', { 'nav--scrolled': scrolled }]" aria-label="Main navigation">
    <a href="#main-content" class="nav-logo" aria-label="MKirell – go to top">MKirell<span class="logo-dot">.</span></a>

    <ul id="navLinks" :class="['nav__links', { open: menuOpen }]" role="list">
      <li v-for="(label, key) in t.nav" :key="key">
        <a :href="`#${key}`" :class="{ active: activeSection === key }"
          :aria-current="activeSection === key ? 'true' : undefined" @click="menuOpen = false">{{ label }}</a>
      </li>
    </ul>

    <div class="nav__right">
      <div class="nav__langs">
        <button v-for="locale in metaLocales" :key="locale.lang" :class="['lang-btn', { active: lang === locale.lang }]"
          @click="setLang(locale.lang)"><span :class="['fi', `fi-${locale.flagCode}`]"></span> {{ locale.label
          }}</button>
      </div>
      <button id="burger" :class="['nav__burger', { active: menuOpen }]" @click="menuOpen = !menuOpen"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'" :aria-expanded="menuOpen" aria-controls="navLinks">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '@/composables/useLanguage.js'

const { lang, t, setLang, metaLocales } = useLanguage()

const scrolled = ref(false)
const menuOpen = ref(false)
const activeSection = ref('')

function onScroll() {
  scrolled.value = window.scrollY > 40
}

let sectionObs = null

function initSectionObserver() {
  if (sectionObs) sectionObs.disconnect()
  const sections = document.querySelectorAll('section[id]')
  const anchors = Object.keys(t.value?.nav ?? {})
  if (!sections.length || !anchors.length || !('IntersectionObserver' in window)) return
  sectionObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) activeSection.value = en.target.id
      })
    },
    { rootMargin: '-45% 0px -50% 0px' }
  )
  sections.forEach((s) => sectionObs.observe(s))
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  onScroll()
  setTimeout(initSectionObserver, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  sectionObs?.disconnect()
})
</script>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px var(--pad);
  transition: padding var(--transition);
}

/* Background + blur live on a pseudo-element rather than on .nav itself.
   A backdrop-filter on .nav would make it the containing block for the
   fixed mobile menu panel, collapsing it to the nav's height. */
.nav::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: transparent;
  border-bottom: 1px solid transparent;
  transition: background var(--transition), backdrop-filter var(--transition),
    border-color var(--transition);
}

.nav--scrolled {
  padding: 16px var(--pad);
}

.nav--scrolled::before {
  background: rgba(20, 22, 27, 0.82);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--line);
}

.nav-logo {
  font-family: 'Fraunces', serif;
  font-size: 1.45rem;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.01em;
  flex-shrink: 0;
}

.nav__links {
  display: flex;
  gap: 32px;
  align-items: center;
  flex: 1;
  justify-content: center;
}

.nav__links li {
  display: contents;
}

.nav__links a {
  font-size: 0.86rem;
  font-weight: 500;
  color: var(--ink-soft);
  transition: color var(--transition);
  position: relative;
  white-space: nowrap;
}

.nav__links a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--transition);
}

.nav__links a:hover,
.nav__links a.active {
  color: var(--ink);
}

.nav__links a:hover::after,
.nav__links a.active::after {
  transform: scaleX(1);
}

.nav__right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.nav__langs {
  display: flex;
  gap: 6px;
}

.lang-btn {
  background: var(--surface);
  border: 1px solid var(--line);
  color: var(--ink-soft);
  border-radius: 8px;
  padding: 5px 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.lang-btn .fi {
  width: 18px;
  height: 13px;
  border-radius: 2px;
  flex-shrink: 0;
}

.lang-btn:hover {
  border-color: var(--accent-line);
  color: var(--accent-deep);
}

.lang-btn.active {
  border-color: var(--accent-line);
  color: var(--accent-deep);
  background: var(--accent-soft);
}

.nav__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.nav__burger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--ink);
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.nav__burger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.nav__burger.active span:nth-child(2) {
  opacity: 0;
}

.nav__burger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 1200px) {
  .nav__links {
    gap: 22px;
  }

  .nav__links a {
    font-size: 0.82rem;
  }
}

@media (max-width: 860px) {
  .nav__links {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 260px;
    background: rgba(20, 22, 27, 0.97);
    backdrop-filter: blur(20px);
    flex-direction: column;
    justify-content: center;
    gap: 28px;
    padding: 40px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    border-inline-start: 1px solid var(--line);
    z-index: 99;
    flex: none;
  }

  .nav__links li {
    display: block;
  }

  .nav__links.open {
    transform: translateX(0);
  }

  .nav__links a {
    font-size: 1.1rem;
  }

  .nav__burger {
    display: flex;
    z-index: 100;
  }
}

@media (max-width: 700px) {
  .nav {
    padding: 16px 20px;
  }

  .nav--scrolled {
    padding: 12px 20px;
  }
}

@media (max-width: 420px) {
  .lang-btn {
    padding: 4px 7px;
    font-size: 0.66rem;
  }

  .nav__langs {
    gap: 4px;
  }
}
</style>
