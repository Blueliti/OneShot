// Draws the rule-of-thirds grid
function drawGrid(ctx, w, h) {
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w / 3, 0); ctx.lineTo(w / 3, h);
  ctx.moveTo((w / 3) * 2, 0); ctx.lineTo((w / 3) * 2, h);
  ctx.moveTo(0, h / 3); ctx.lineTo(w, h / 3);
  ctx.moveTo(0, (h / 3) * 2); ctx.lineTo(w, (h / 3) * 2);
  ctx.stroke();
}