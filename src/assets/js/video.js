/*
  Project videos: silent loops that play only while they are on screen.
  With "reduce motion" switched on they do not start by themselves; a play button is shown instead.
*/
(function () {
  const videos = document.querySelectorAll("video[data-autoplay]");
  if (!videos.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    videos.forEach((v) => { v.controls = true; });
    return;
  }
  const watch = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.play().catch(() => {}); else e.target.pause(); });
  }, { threshold: 0.25 });
  videos.forEach((v) => watch.observe(v));
})();
