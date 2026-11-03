/*
  Small screens: the "Menu" cell opens and closes the navigation links.
  Escape closes the menu again and puts the keyboard focus back on the button.
*/
(function () {
  const nav = document.querySelector(".nav");
  const button = nav && nav.querySelector(".menu-toggle");
  if (!button) return;

  function setOpen(open) {
    nav.classList.toggle("open", open);
    button.setAttribute("aria-expanded", open);
    button.textContent = open ? button.dataset.close : button.dataset.open;
  }

  button.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) { setOpen(false); button.focus(); }
  });
})();
