window.selection = document.getElementById("selection");
window.canvas = document.getElementById("c");
window.ctx = canvas.getContext("2d");
window.toolbar = document.getElementById("toolbar");
window.cornerBar = document.getElementById("cornerBar");
window.pencilCursor = document.getElementById("pencilCursor");

window.startX = 0;
window.startY = 0;
window.isDragging = false;
window.lastWidth = 0;
window.lastHeight = 0;
window.corner = "tl";

window.activeTools = new Set(["thirdGrid"]);

window.selX = 0;
window.selY = 0;

setupMouseDown(ctx);
setupMouseMove(ctx);
setupMouseUp(ctx);

function drawOverlay(w, h) {
  ctx.clearRect(0, 0, w, h);
  if (activeTools.has("thirdGrid")) drawGrid(ctx, w, h);
  if (activeTools.has("spiral")) drawSpiral(ctx, w, h, corner);
}