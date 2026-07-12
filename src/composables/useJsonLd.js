import { onMounted } from "vue";

export function useJsonLd() {
  onMounted(() => {
    fetch(import.meta.env.BASE_URL + "jsonld.json")
      .then((r) => r.json())
      .then((data) => {
        let el = document.getElementById("app-json-ld");
        if (!el) {
          el = document.createElement("script");
          el.type = "application/ld+json";
          el.id = "app-json-ld";
          document.head.appendChild(el);
        }
        el.textContent = JSON.stringify(data);
      });
  });
}
