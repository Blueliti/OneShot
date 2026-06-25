(function () {
  const highlightA = document.getElementById("highlightA");
  const highlightB = document.getElementById("highlightB");
  const cornerBar = document.getElementById("cornerBar");

  const toolIcons = ["thirdGrid", "spiral"];

  function placeHighlight(hl, icon, animate) {
    hl.style.top = icon.offsetTop + "px";
    hl.style.left = icon.offsetLeft + "px";
    hl.style.opacity = "1";
    if (animate) {
      hl.classList.remove("show");
      void hl.offsetWidth;
      hl.classList.add("show");
    }
  }

  // show one orange circle per active tool (up to 2)
  function refreshHighlights(animate) {
    highlightA.style.opacity = "0";
    highlightB.style.opacity = "0";

    const active = [...activeTools].filter((t) => toolIcons.includes(t));
    const slots = [highlightA, highlightB];

    active.forEach((tool, i) => {
      const icon = document.getElementById(tool);
      if (icon && slots[i]) placeHighlight(slots[i], icon, animate);
    });
  }

  window.initToolbarHighlight = function () {
    refreshHighlights(false);   // no animation on first appearance
  };

  window.updateCornerBar = function () {
    if (activeTools.has("spiral")) {
      cornerBar.style.display = "block";
      placeCornerButtons();
    } else {
      cornerBar.style.display = "none";
    }
  };

  function placeCornerButtons() {
    const x = selX, y = selY, w = lastWidth, h = lastHeight;
    const off = 14;   // half of 28px button

    setBtn("cornerTopLeft",  x - off,     y - off);
    setBtn("cornerTopRight", x + w - off, y - off);
    setBtn("cornerBotLeft",  x - off,     y + h - off);
    setBtn("cornerBotRight", x + w - off, y + h - off);

    document.querySelectorAll(".cornerBtn").forEach((b) => {
      b.classList.toggle("active", b.dataset.corner === corner);
    });
  }

  function setBtn(id, left, top) {
    const b = document.getElementById(id);
    if (!b) return;
    b.style.left = left + "px";
    b.style.top = top + "px";
  }

  toolIcons.forEach((id) => {
    const icon = document.getElementById(id);
    if (!icon) return;

    icon.addEventListener("click", (e) => {
      if (e.shiftKey) {
        activeTools.add(id);                 // both on
      } else {
        window.activeTools = new Set([id]);  // single
        activeTools = window.activeTools;
      }
      refreshHighlights(true);               // animate on click
      updateCornerBar();
      if (lastWidth > 0) drawOverlay(lastWidth, lastHeight);
    });
  });

  document.querySelectorAll(".cornerBtn").forEach((b) => {
    b.addEventListener("click", () => {
      corner = b.dataset.corner;
      document.querySelectorAll(".cornerBtn").forEach((x) =>
        x.classList.toggle("active", x === b)
      );
      if (lastWidth > 0) drawOverlay(lastWidth, lastHeight);
    });
  });
})();