/*
  Airshade diagram: the fins thicken (turn toward closed) as the sun gets stronger.
  The slider value is shown next to the label and read out by screen readers.
*/
(function () {
  document.querySelectorAll("[data-airshade]").forEach((diagram) => {
    const fins = diagram.querySelector(".fins");
    const sun = diagram.querySelector(".sun");
    const input = diagram.querySelector("input");
    const output = diagram.querySelector("output");

    for (let i = 0; i < 13; i++) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      const x = 50 + i * 25;
      line.setAttribute("x1", x); line.setAttribute("x2", x);
      line.setAttribute("y1", 70); line.setAttribute("y2", 250);
      fins.appendChild(line);
    }

    function update() {
      const v = input.value / 100;
      sun.setAttribute("r", 6 + v * 10);
      sun.setAttribute("fill", v > .5 ? "#002FA7" : "none");
      fins.querySelectorAll("line").forEach((l) => l.setAttribute("stroke-width", 1.5 + v * 22));
      output.textContent = `${input.value}%`;
      input.setAttribute("aria-valuetext", `${input.value}%`);
    }
    input.addEventListener("input", update);
    update();
  });
})();
