// Draws the golden spiral, fitted to the box, curling from the given corner
function drawSpiral(ctx, w, h, corner) {
  const PHI = 1.61803398875;
  const b = Math.log(PHI) / (Math.PI / 2);
  const turns = 20;
  const maxTheta = turns * (Math.PI / 2);
  const totalSteps = turns * 60;

  const offset = -Math.PI / 2.5;

  const pts = [];
  for (let i = 0; i <= totalSteps; i++) {
    const theta = (i / totalSteps) * maxTheta;
    const r = Math.exp(b * theta);
    const a = theta + offset;
    pts.push({ x: r * Math.cos(a), y: r * Math.sin(a) });
  }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const rawW = maxX - minX;
  const rawH = maxY - minY;

  ctx.save();

  let fx = 1, fy = 1;
  if (corner === "tl") { ctx.translate(0, 0); fx = 1;  fy = 1;  }
  if (corner === "tr") { ctx.translate(w, 0); fx = -1; fy = 1;  }
  if (corner === "bl") { ctx.translate(0, h); fx = 1;  fy = -1; }
  if (corner === "br") { ctx.translate(w, h); fx = -1; fy = -1; }
  ctx.scale(fx, fy);

  ctx.strokeStyle = "rgba(255,215,0,0.9)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();

  for (let i = 0; i < pts.length; i++) {
    const nx = (pts[i].x - minX) / rawW * w;
    const ny = (pts[i].y - minY) / rawH * h;
    if (i === 0) ctx.moveTo(nx, ny);
    else ctx.lineTo(nx, ny);
  }

  ctx.stroke();
  ctx.restore();
}