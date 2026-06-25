function setupMouseDown(ctx) {
  document.addEventListener("mousedown", (e) => {
    if (toolbar.contains(e.target) || cornerBar.contains(e.target)) return;

    // entering draw mode → pencil cursor back
    document.body.classList.remove("has-selection");

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    selection.style.display = "block";
    selection.style.left = startX + "px";
    selection.style.top = startY + "px";
    selection.style.width = "0px";
    selection.style.height = "0px";
  });
}

function setupMouseMove(ctx) {
  document.addEventListener("mousemove", (e) => {
    pencilCursor.style.left = e.clientX + "px";
    pencilCursor.style.top = e.clientY + "px";

    if (!isDragging) return;
    const x = Math.min(e.clientX, startX);
    const y = Math.min(e.clientY, startY);
    const width = Math.abs(e.clientX - startX);
    const height = Math.abs(e.clientY - startY);
    selection.style.left = x + "px";
    selection.style.top = y + "px";
    selection.style.width = width + "px";
    selection.style.height = height + "px";
  });
}

function setupMouseUp(ctx) {
  document.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    selection.style.display = "none";
    const x = Math.min(e.clientX, startX);
    const y = Math.min(e.clientY, startY);
    const width = Math.abs(e.clientX - startX);
    const height = Math.abs(e.clientY - startY);
    if (width < 10 || height < 10) return;

    canvas.style.display = "block";
    canvas.style.left = x + "px";
    canvas.style.top = y + "px";
    canvas.width = width;
    canvas.height = height;

    lastWidth = width;
    lastHeight = height;
    selX = x;
    selY = y;
    drawOverlay(width, height);

    // selection done → normal arrow cursor
    document.body.classList.add("has-selection");

    toolbar.style.display = "flex";
    toolbar.style.top = y + "px";
    toolbar.style.left = x + "px";
    toolbar.style.transform = "translateX(calc(-100% - 12px))";

    if (window.initToolbarHighlight) window.initToolbarHighlight();
    if (window.updateCornerBar) window.updateCornerBar();
  });
}