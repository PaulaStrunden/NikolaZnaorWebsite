/*
  Work index filter. The buttons are hidden until this script runs,
  so without JavaScript all projects are simply listed.
  After each click, screen readers hear how many projects are shown.
*/
(function () {
  const group = document.querySelector(".filters");
  if (!group) return;
  const buttons = group.querySelectorAll("button");
  const projects = document.querySelectorAll(".project");
  const status = document.querySelector("[data-filter-status]");
  group.hidden = false;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.setAttribute("aria-pressed", b === btn));
      const f = btn.dataset.filter;
      let shown = 0;
      projects.forEach((p) => {
        p.hidden = f !== "all" && p.dataset.type !== f;
        if (!p.hidden) shown++;
      });
      if (status) status.textContent = (shown === 1 ? status.dataset.one : status.dataset.many).replace("{n}", shown);
    });
  });
})();
