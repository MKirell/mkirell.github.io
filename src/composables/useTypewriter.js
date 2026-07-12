import { ref, watch, onUnmounted } from "vue";

export function useTypewriter(phrasesRef) {
  const display = ref("");
  let timer = null;
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function tick() {
    const phrases = phrasesRef.value;
    if (!phrases?.length) {
      display.value = "";
      return;
    }
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      charIdx++;
      display.value = phrase.slice(0, charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        timer = setTimeout(tick, 1500);
      } else {
        timer = setTimeout(tick, 55);
      }
    } else {
      charIdx--;
      display.value = phrase.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        timer = setTimeout(tick, 350);
      } else {
        timer = setTimeout(tick, 28);
      }
    }
  }

  function restart() {
    clear();
    phraseIdx = 0;
    charIdx = 0;
    deleting = false;
    display.value = "";
    tick();
  }

  watch(phrasesRef, restart, { immediate: true });
  onUnmounted(clear);

  return { display };
}
