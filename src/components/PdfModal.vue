<template>
  <Teleport to="body">
    <div v-if="pdf.open" class="pdf-modal" @click.self="closePdf">
      <div class="pdf-modal__actions">
        <a :href="pdf.url" target="_blank" rel="noopener noreferrer" class="pdf-modal__btn" title="Open in new tab"
          aria-label="Open in new tab">
          <ExternalLink :size="20" />
        </a>
        <button class="pdf-modal__btn" type="button" @click="closePdf" aria-label="Close">
          <X :size="22" />
        </button>
      </div>
      <iframe class="pdf-modal__frame" :class="`is-${pdf.orientation}`" :src="frameSrc"
        :title="pdf.title || 'Document preview'"></iframe>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, watch, onUnmounted } from 'vue'
import { usePdfViewer } from '@/composables/usePdfViewer.js'
import { X, ExternalLink } from '@lucide/vue'

const { pdf, closePdf } = usePdfViewer()

const frameSrc = computed(() => pdf.value.url ? `${pdf.value.url.split('#')[0]}#view=Fit` : '')

watch(() => pdf.value.open, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

function onKeydown(e) {
  if (pdf.value.open && e.key === 'Escape') closePdf()
}
window.addEventListener('keydown', onKeydown)
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.pdf-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.88);
  padding: 40px;
}

.pdf-modal__frame {
  border: none;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.pdf-modal__frame.is-portrait {
  width: min(96vw, calc(92vh * 210 / 297));
  height: min(92vh, calc(96vw * 297 / 210));
}

.pdf-modal__frame.is-landscape {
  width: min(96vw, calc(92vh * 297 / 210));
  height: min(92vh, calc(96vw * 210 / 297));
}

.pdf-modal__actions {
  position: absolute;
  top: 20px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 14px;
  z-index: 1;
}

.pdf-modal__btn {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  color: #fff;
  line-height: 1;
  cursor: pointer;
  opacity: 0.75;
  text-decoration: none;
  transition: opacity var(--transition);
}

.pdf-modal__btn:hover {
  opacity: 1;
}

@media (max-width: 600px) {
  .pdf-modal {
    padding: 16px;
  }

  .pdf-modal__actions {
    top: 10px;
    right: 12px;
  }
}
</style>
