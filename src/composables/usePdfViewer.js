import { ref } from "vue";
import { docOrientation } from "@/utils/docs.js";

const pdf = ref({ open: false, url: "", title: "", orientation: "portrait" });

export function usePdfViewer() {
  function openPdf(url, title = "") {
    if (!url) return;
    pdf.value = { open: true, url, title, orientation: docOrientation(url) };
  }
  function closePdf() {
    pdf.value.open = false;
  }
  return { pdf, openPdf, closePdf };
}
