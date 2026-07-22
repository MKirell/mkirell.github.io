<template>
  <footer class="footer" aria-label="Site footer">
    <div class="container">
      <div class="footer__inner">
        <img :src="logoUrl" alt="MKirell" class="footer-logo">

        <small class="footer__copy">{{ t.footer.copy }}</small>
        <nav class="footer__socials" aria-label="Social links">
          <a :href="person.linkedin" target="_blank" rel="noopener noreferrer" class="footer__link"
            aria-label="LinkedIn profile">LinkedIn</a>
          <a :href="`mailto:${person.email}`" class="footer__link" aria-label="Send email">Email</a>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage.js'
import portfolioData from '@/data/portfolio.json'
import logoUrl from '@/assets/imgs/mkirell-logo.png'
const { person } = portfolioData
const { t } = useLanguage()
</script>

<style scoped>
.footer {
  background: var(--bg-tint);
  border-top: 1px solid var(--line);
  padding: 30px 0;
}

.footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.footer-logo {
  height: 26px;
  width: auto;
  display: block;
}

@media (max-width: 700px) {
  .footer-logo {
    height: 22px;
  }
}

.footer__copy {
  color: var(--ink-soft);
  font-size: 0.75rem;
  font-family: 'JetBrains Mono', monospace;
}

.footer__socials {
  display: flex;
  gap: 20px;
}

.footer__link {
  color: var(--ink-soft);
  font-size: 0.82rem;
  transition: color var(--transition);
}

.footer__link:hover {
  color: var(--accent-deep);
}

@media (max-width: 700px) {
  .footer__inner {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
}
</style>
