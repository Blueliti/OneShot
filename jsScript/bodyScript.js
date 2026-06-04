// shared state — on window so other script files can see it
window.selection = document.getElementById("selection");
window.canvas = document.getElementById("c");
window.ctx = canvas.getContext("2d");
window.toolbar = document.getElementById("toolbar");

window.startX = 0;
window.startY = 0;
window.isDragging = false;
window.lastWidth = 0;
window.lastHeight = 0;
window.corner = "tl";

const cornerButtons = document.querySelectorAll(".corner-picker button");
cornerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    corner = button.dataset.corner;
    cornerButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    if (lastWidth > 0) {
      drawOverlay(lastWidth, lastHeight);
    }
  });
});

setupMouseDown(ctx);
setupMouseMove(ctx);
setupMouseUp(ctx);

function drawOverlay(w, h) {
  ctx.clearRect(0, 0, w, h);
  drawGrid(ctx, w, h);
  drawSpiral(ctx, w, h, corner);
}

lucide.createIcons();