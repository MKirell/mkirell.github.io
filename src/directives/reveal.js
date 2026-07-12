export const vReveal = {
  mounted(el) {
    el.classList.add("reveal");
    if (!("IntersectionObserver" in window)) {
      el.classList.add("visible");
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
  },
};
