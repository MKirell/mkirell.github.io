import { ref, computed, watch } from "vue";
import portfolioData from "@/data/portfolio.json";
const { locales, metaLocales } = portfolioData;

const SUPPORTED = ["en", "fr"];
const SESSION_KEY = "portfolio_lang";

function getQueryLang() {
  const lang = new URLSearchParams(location.search).get("lang");
  return SUPPORTED.includes(lang) ? lang : null;
}

function getStoredLang() {
  try {
    const lang = localStorage.getItem(SESSION_KEY);
    return SUPPORTED.includes(lang) ? lang : null;
  } catch {
    return null;
  }
}

function getBrowserLang() {
  const prefs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language || ""];
  for (const pref of prefs) {
    const short = pref.toLowerCase().split("-")[0];
    if (SUPPORTED.includes(short)) return short;
  }
  return null;
}

const lang = ref(getQueryLang() || getStoredLang() || getBrowserLang() || "en");

const t = computed(() => locales[lang.value]);
const dir = computed(
  () => metaLocales.find((l) => l.lang === lang.value)?.dir ?? "ltr",
);
const isRTL = computed(() => dir.value === "rtl");

watch(
  lang,
  (val) => {
    try {
      localStorage.setItem(SESSION_KEY, val);
    } catch {}
    document.documentElement.lang = val;
    document.documentElement.dir = "ltr";
  },
  { immediate: true },
);

function setLang(newLang) {
  if (!SUPPORTED.includes(newLang) || newLang === lang.value) return;
  lang.value = newLang;
  const url = new URL(location.href);
  url.searchParams.set("lang", newLang);
  history.pushState({ lang: newLang }, "", url.pathname + url.search);
}

window.addEventListener("popstate", () => {
  const ql = getQueryLang();
  if (ql) lang.value = ql;
});

export function useLanguage() {
  return { lang, t, dir, isRTL, setLang, metaLocales };
}
