/*
  Blueprint drawing for the blue hero (Home) and the blue bands (all other pages).

  Every <canvas class="blueprint"> gets the white construction grid with axis bubbles
  (A, B, C … across the top, 1, 2, 3 … down the side).

  If the canvas has data-tree, a structure grows on top: a midrib that branches into ribs and veins.
    data-tree="hero"      the exact structure from the approved design (Home)
    data-tree="<name>"    a structure unique to that project, derived from its name,
                          so every project page has its own drawing that never changes

  With "reduce motion" switched on in the system settings, the finished drawing appears at once.
*/
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SPEED = 1.3;        // 1 = speed of the design dummy; higher = slower growth
  const TITLE_TIME = 2400;  // home: the name is drawn first, the tree starts growing after this (ms)
  const LETTER_DELAY = 75;  // home: pause between the letters of the name appearing (ms)
  const GRID_FONT = '13px "Barlow Condensed", "Arial Narrow", sans-serif';

  // Small repeatable random number generator: the same seed always gives the same drawing.
  function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }

  // Turns a word (the project file name) into a seed number.
  function hash(text) {
    let h = 7;
    for (const c of text) h = (h * 31 + c.charCodeAt(0)) % 2147483646;
    return h + 1;
  }

  function setup(canvas) {
    const ctx = canvas.getContext("2d");
    const tree = canvas.dataset.tree;
    let paths = [], w = 0, h = 0, start = null;

    // One branch: a slightly bending line made of small steps, with children along it.
    function grow(rand, x, y, angle, len, depth, birth, side) {
      const steps = 16, step = len / steps, pts = [[x, y]];
      const bend = (rand() - .5) * .04 + side * .018 * depth;
      const dur = (900 - depth * 150) * SPEED;
      let a = angle;
      for (let i = 1; i <= steps; i++) { a += bend; x += Math.cos(a) * step; y += Math.sin(a) * step; pts.push([x, y]); }
      paths.push({ pts, birth, dur, depth });
      if (depth >= 3) return;
      const every = depth === 0 ? 2 : 4;
      for (let i = every; i < steps; i += every) {
        const s = depth === 0 ? ((i / every) % 2 ? 1 : -1) : side;
        const childLen = len * (depth === 0 ? .32 : .42) * (1 - i / steps * .5);
        grow(rand, pts[i][0], pts[i][1], a + s * (.95 - depth * .15), childLen, depth + 1, birth + dur * i / steps, s);
      }
    }

    // White construction grid with numbered axis bubbles.
    // Distance between grid lines (also used to place the home title).
    // On the home hero the grid gets a little tighter on low screens, so that rows 2-3 and 3-4
    // (where the title sits) always fit inside the hero.
    const gridStep = () => Math.max(80, Math.round(tree === "hero" ? Math.min(w / 8, h / 4.6) : w / 8));

    function grid() {
      const step = gridStep();
      ctx.strokeStyle = "rgba(255,255,255,.22)";
      ctx.lineWidth = 1;
      ctx.font = GRID_FONT;
      ctx.fillStyle = "rgba(255,255,255,.7)";
      ctx.textAlign = "center";
      let col = 0;
      for (let x = step; x < w; x += step) {
        ctx.beginPath(); ctx.moveTo(x + .5, 34); ctx.lineTo(x + .5, h); ctx.stroke();
        ctx.beginPath(); ctx.arc(x + .5, 20, 10, 0, Math.PI * 2); ctx.stroke();
        ctx.fillText(String.fromCharCode(65 + col++), x + .5, 24.5);
      }
      let row = 1;
      for (let y = step; y < h; y += step) {
        ctx.beginPath(); ctx.moveTo(34, y + .5); ctx.lineTo(w, y + .5); ctx.stroke();
        ctx.beginPath(); ctx.arc(20, y + .5, 10, 0, Math.PI * 2); ctx.stroke();
        ctx.fillText(row++, 20, y + 5);
      }
    }

    // Measures the canvas and plans the branches (nothing is drawn yet).
    function build() {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paths = [];
      if (!tree) return;
      if (tree === "hero") {
        grow(rng(11), w * .52, h * 1.02, -1.15, Math.min(w, h * 1.4) * .95, 0, TITLE_TIME * SPEED, 1);
      } else {
        // Project: position, lean and size vary per project, within the same family of shapes.
        const pick = rng(hash(tree));
        const mirror = pick() < .5;
        const x = w * (mirror ? .45 + pick() * .25 : .3 + pick() * .25);
        const lean = 1.05 + pick() * .3;
        const angle = mirror ? -(Math.PI - lean) : -lean;
        grow(rng(hash(tree + "/growth")), x, h * 1.02, angle, Math.min(w, h * 1.4) * (.8 + pick() * .15), 0, 0, mirror ? -1 : 1);
      }
    }

    // Draws grid and branches as far as they have grown at time t (milliseconds).
    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      grid();
      drawGuides(t);
      ctx.lineCap = "round";
      ctx.strokeStyle = "#FFFFFF";
      for (const p of paths) {
        const prog = Math.max(0, Math.min(1, (t - p.birth) / p.dur));
        if (!prog) continue;
        const n = Math.max(1, Math.floor(prog * (p.pts.length - 1)));
        ctx.lineWidth = [2.2, 1.2, .8, .5][p.depth];
        ctx.beginPath();
        ctx.moveTo(p.pts[0][0], p.pts[0][1]);
        for (let i = 1; i <= n; i++) ctx.lineTo(p.pts[i][0], p.pts[i][1]);
        ctx.stroke();
      }
    }

    // Home title (h1 with data-snap): each line gets its own grid row,
    // "Nikola Znaor" between lines 2 and 3, "Architects" between lines 3 and 4.
    // Font size: as large as the row allows (and never wider than the hero).
    // The capitals are centred vertically in the row. Guide lines are planned here
    // and drawn in draw(), like the construction lines of hand lettering.
    const title = canvas.parentElement.querySelector("[data-snap]");
    let guides = [];

    // Split the title into single letters once, so they can appear one by one.
    // Screen readers get the whole name from aria-label instead of single letters.
    if (title && !title.dataset.split) {
      title.dataset.split = "1";
      title.setAttribute("aria-label", title.textContent.replace(/\s+/g, " ").trim());
      title.querySelectorAll(":scope > span").forEach((line) => {
        const text = line.textContent;
        line.textContent = "";
        for (const ch of text) {
          if (ch === " ") { line.append(" "); continue; }
          const el = document.createElement("span");
          el.className = "ch"; el.textContent = ch; el.setAttribute("aria-hidden", "true");
          line.append(el);
        }
      });
    }
    let lettersStarted = false;
    function revealLetters(instant) {
      if (!title || lettersStarted) return;
      lettersStarted = true;
      title.classList.add("drawn");
      title.querySelectorAll(".ch").forEach((el, i) => {
        if (instant) el.classList.add("on");
        else setTimeout(() => el.classList.add("on"), i * LETTER_DELAY);
      });
    }
    function snap() {
      if (!title) return;
      const lines = [...title.querySelectorAll(":scope > span")];
      const step = gridStep();
      const left = 56;                                   // clear of the numbered axis bubbles on the left
      const style = getComputedStyle(title);
      const fontAt = (size) => `${style.fontWeight} ${size}px ${style.fontFamily}`;

      // Largest size that fits a row and the width.
      let size = step;
      for (const line of lines) {
        ctx.font = fontAt(size);
        size = Math.min(size, size * (w - left - 40) / ctx.measureText(line.textContent).width);
      }
      ctx.font = fontAt(size);
      const cap = ctx.measureText("N").actualBoundingBoxAscent || size * .7;  // capital height
      title.style.fontSize = `${size}px`;
      title.classList.add("snapped");

      // "Nikola Znaor" between grid lines 2 and 3, "Architects" between 3 and 4.
      const firstLine = 2;
      const over = Math.max(8, cap * .12);               // how far guide lines run past the letters
      guides = [];
      lines.forEach((line, i) => {
        // Where is the baseline inside the line? An invisible marker sits exactly on it.
        let marker = line.querySelector(".bl");
        if (!marker) { marker = document.createElement("i"); marker.className = "bl"; marker.setAttribute("aria-hidden", "true"); line.appendChild(marker); }
        const baselineInBox = marker.offsetTop;
        const baseline = Math.round((firstLine + i) * step + (step + cap) / 2) + .5;
        const top = baseline - cap;
        line.style.top = `${baseline - baselineInBox}px`;
        line.style.left = `${left}px`;

        // Construction lines: cap line and baseline, a little longer than the word …
        const text = line.textContent;
        const width = ctx.measureText(text).width;
        const start = i * 250;
        guides.push({ x1: left - over, y1: top, x2: left + width + over, y2: top, birth: start, dur: 700 });
        guides.push({ x1: left - over, y1: baseline, x2: left + width + over, y2: baseline, birth: start + 120, dur: 700 });
        // … and two short verticals at the capital that starts each word (N, Z, A),
        // measured on the real text so the letter sits exactly between its two lines.
        const box = canvas.getBoundingClientRect();
        const letters = [...line.querySelectorAll(".ch")];
        letters.forEach((el, j) => {
          const ch = el.textContent;
          const startsWord = j === 0 || el.previousSibling.nodeType === Node.TEXT_NODE;
          if (ch !== ch.toUpperCase() || !startsWord) return;
          const r = el.getBoundingClientRect();
          for (const x of [r.left - box.left, r.right - box.left]) {
            const xr = Math.round(x) + .5;
            guides.push({ x1: xr, y1: top - over, x2: xr, y2: baseline + over, birth: start + 350, dur: 450 });
          }
        });
      });
    }

    // Guide lines grow from their start point, like a pencil stroke.
    function drawGuides(t) {
      ctx.strokeStyle = "rgba(255,255,255,.75)";
      ctx.lineWidth = .75;
      ctx.lineCap = "butt";
      for (const g of guides) {
        const prog = Math.max(0, Math.min(1, (t - g.birth * SPEED) / (g.dur * SPEED)));
        if (!prog) continue;
        ctx.beginPath();
        ctx.moveTo(g.x1, g.y1);
        ctx.lineTo(g.x1 + (g.x2 - g.x1) * prog, g.y1 + (g.y2 - g.y1) * prog);
        ctx.stroke();
      }
      // Letters appear one by one once the guides are mostly drawn (instantly when redrawing).
      if (t === Infinity) revealLetters(true);
      else if (t > 900 * SPEED) revealLetters(false);
    }

    function frame(ts) {
      if (start === null) start = ts;
      const t = ts - start;
      draw(t);
      if (t < (4500 + TITLE_TIME) * SPEED) requestAnimationFrame(frame);
    }

    build();
    snap();
    // Wait for the grid font so the axis letters are drawn in Barlow, not a fallback.
    document.fonts.load(GRID_FONT).catch(() => {}).then(() => {
      snap();                                    // again, now with the final font metrics
      if (reduce || !tree) draw(Infinity); else requestAnimationFrame(frame);
    });

    // Redraw the finished drawing whenever the canvas changes size
    // (window resized, phone rotated, hero height settled after loading).
    let timer, lastW = canvas.clientWidth, lastH = canvas.clientHeight;
    new ResizeObserver(() => {
      if (canvas.clientWidth === lastW && canvas.clientHeight === lastH) return;
      lastW = canvas.clientWidth; lastH = canvas.clientHeight;
      cancelAnimationFrame(timer);
      timer = requestAnimationFrame(() => { build(); snap(); draw(Infinity); });
    }).observe(canvas);
  }

  document.querySelectorAll("canvas.blueprint").forEach(setup);
})();
