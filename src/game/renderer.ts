import { GameScene, Fish, Bubble, Seaweed } from './types';
import { COLORS, HOOK_X_RATIO } from './constants';

export function render(ctx: CanvasRenderingContext2D, scene: GameScene): void {
  const { canvasWidth: W, canvasHeight: H, waterLevel: WL } = scene;

  ctx.clearRect(0, 0, W, H);

  drawSky(ctx, W, WL);
  drawSun(ctx, W);
  drawClouds(ctx, W, WL, scene.gameTime);
  drawWater(ctx, W, H, WL);
  drawLightRays(ctx, W, H, WL, scene.gameTime);
  drawSandBottom(ctx, W, H);
  drawSeaweeds(ctx, scene.seaweeds, H);
  drawBubbles(ctx, scene.bubbles);
  drawFishes(ctx, scene.fishes);
  drawFishingLine(ctx, scene);
  drawWaterSurface(ctx, W, WL, scene.gameTime);
  drawPier(ctx, W, WL);
  drawScorePopups(ctx, scene);
}

function drawSky(ctx: CanvasRenderingContext2D, W: number, WL: number): void {
  const grad = ctx.createLinearGradient(0, 0, 0, WL);
  grad.addColorStop(0, COLORS.skyTop);
  grad.addColorStop(1, COLORS.skyBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, WL);
}

function drawSun(ctx: CanvasRenderingContext2D, W: number): void {
  const x = W * 0.8;
  const y = 50;
  const grad = ctx.createRadialGradient(x, y, 5, x, y, 40);
  grad.addColorStop(0, '#FFF5CC');
  grad.addColorStop(0.5, COLORS.sunColor);
  grad.addColorStop(1, 'rgba(255,224,102,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, 40, 0, Math.PI * 2);
  ctx.fill();
}

function drawClouds(ctx: CanvasRenderingContext2D, W: number, WL: number, time: number): void {
  ctx.fillStyle = COLORS.cloudColor;
  const clouds = [
    { x: 100, y: 40, s: 1 },
    { x: 350, y: 60, s: 0.7 },
    { x: 600, y: 35, s: 0.9 },
  ];
  for (const c of clouds) {
    const cx = ((c.x + time * 8) % (W + 100)) - 50;
    drawCloud(ctx, cx, c.y, c.s);
  }
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number): void {
  ctx.beginPath();
  ctx.arc(x, y, 15 * s, 0, Math.PI * 2);
  ctx.arc(x + 15 * s, y - 5 * s, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 35 * s, y, 14 * s, 0, Math.PI * 2);
  ctx.arc(x + 18 * s, y + 3 * s, 12 * s, 0, Math.PI * 2);
  ctx.fill();
}

function drawWater(ctx: CanvasRenderingContext2D, W: number, H: number, WL: number): void {
  const grad = ctx.createLinearGradient(0, WL, 0, H);
  grad.addColorStop(0, COLORS.waterTop);
  grad.addColorStop(0.4, COLORS.waterMid);
  grad.addColorStop(1, COLORS.waterBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, WL, W, H - WL);
}

function drawLightRays(ctx: CanvasRenderingContext2D, W: number, H: number, WL: number, time: number): void {
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 5; i++) {
    const x = (W * 0.15) + i * (W * 0.18);
    const sway = Math.sin(time * 0.5 + i) * 20;
    ctx.beginPath();
    ctx.moveTo(x + sway - 15, WL);
    ctx.lineTo(x + sway + 15, WL);
    ctx.lineTo(x + sway + 40 + i * 5, H);
    ctx.lineTo(x + sway - 40 - i * 5, H);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawSandBottom(ctx: CanvasRenderingContext2D, W: number, H: number): void {
  ctx.fillStyle = COLORS.sandColor;
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 40) {
    ctx.lineTo(x, H - 15 - Math.sin(x * 0.03) * 8);
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();
}

function drawSeaweeds(ctx: CanvasRenderingContext2D, seaweeds: Seaweed[], H: number): void {
  for (const sw of seaweeds) {
    ctx.strokeStyle = sw.color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const baseY = H - 10;
    ctx.moveTo(sw.x, baseY);
    const sway = Math.sin(sw.phase) * 10;
    ctx.quadraticCurveTo(
      sw.x + sway,
      baseY - sw.height * 0.5,
      sw.x + sway * 1.5,
      baseY - sw.height
    );
    ctx.stroke();

    // Leaves
    ctx.fillStyle = sw.color;
    for (let j = 0.3; j <= 0.8; j += 0.25) {
      const lx = sw.x + sway * j;
      const ly = baseY - sw.height * j;
      const side = j % 0.5 < 0.25 ? 1 : -1;
      ctx.beginPath();
      ctx.ellipse(lx + side * 6, ly, 6, 3, side * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawBubbles(ctx: CanvasRenderingContext2D, bubbles: Bubble[]): void {
  for (const b of bubbles) {
    ctx.save();
    ctx.globalAlpha = b.opacity;
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.stroke();
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawFishShape(ctx: CanvasRenderingContext2D, fish: Fish): void {
  const { x, y, type, direction, tailPhase } = fish;
  const w = type.width;
  const h = type.height;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(direction, 1);

  // Glow effect for golden dragon
  if (type.glow) {
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 15 + Math.sin(Date.now() * 0.005) * 5;
  }

  // Body
  ctx.fillStyle = type.bodyColor;
  ctx.beginPath();
  ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tail
  const tailWag = Math.sin(tailPhase) * 5;
  ctx.fillStyle = type.finColor;
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.lineTo(-w / 2 - 12, -8 + tailWag);
  ctx.lineTo(-w / 2 - 12, 8 + tailWag);
  ctx.closePath();
  ctx.fill();

  // Dorsal fin
  ctx.fillStyle = type.finColor;
  ctx.beginPath();
  ctx.moveTo(-w * 0.1, -h / 2);
  ctx.lineTo(w * 0.1, -h / 2 - 6);
  ctx.lineTo(w * 0.2, -h / 2 + 2);
  ctx.closePath();
  ctx.fill();

  // Eye
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(w / 4, -h / 6, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(w / 4 + 1, -h / 6, 2, 0, Math.PI * 2);
  ctx.fill();

  // Stripes for clownfish
  if (type.nameEn === 'clownfish') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-2, -h / 2, 4, h);
    ctx.fillRect(w / 4 - 2, -h / 2, 4, h);
  }

  // Spots for pufferfish
  if (type.nameEn === 'pufferfish') {
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.arc(-5, -3, 2, 0, Math.PI * 2);
    ctx.arc(5, 2, 2, 0, Math.PI * 2);
    ctx.arc(-2, 5, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sword for swordfish
  if (type.nameEn === 'swordfish') {
    ctx.fillStyle = type.finColor;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2 + 20, -1);
    ctx.lineTo(w / 2 + 20, 1);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function drawFishes(ctx: CanvasRenderingContext2D, fishes: Fish[]): void {
  for (const fish of fishes) {
    if (fish.alive) {
      drawFishShape(ctx, fish);
    }
  }
}

function drawFishingLine(ctx: CanvasRenderingContext2D, scene: GameScene): void {
  const { hook, waterLevel } = scene;
  const startX = hook.x;
  const startY = waterLevel - 30;
  const endX = hook.x;
  const endY = hook.y;

  // Line
  ctx.strokeStyle = COLORS.lineColor;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Hook
  ctx.strokeStyle = COLORS.hookColor;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(endX, endY + 8);
  ctx.arc(endX + 4, endY + 8, 4, Math.PI, 0, true);
  ctx.lineTo(endX + 8, endY + 4);
  ctx.stroke();

  // Hook point
  ctx.fillStyle = COLORS.hookColor;
  ctx.beginPath();
  ctx.arc(endX + 8, endY + 3, 1.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawWaterSurface(ctx: CanvasRenderingContext2D, W: number, WL: number, time: number): void {
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x <= W; x += 3) {
    const y = WL + Math.sin(x * 0.03 + time * 2) * 3 + Math.sin(x * 0.01 + time * 1.5) * 2;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawPier(ctx: CanvasRenderingContext2D, W: number, WL: number): void {
  const pierX = W * 0.3;
  const pierW = W * 0.12;
  const pierTop = WL - 25;

  // Pier legs
  ctx.fillStyle = COLORS.pierDark;
  ctx.fillRect(pierX + 5, pierTop, 6, 35);
  ctx.fillRect(pierX + pierW - 11, pierTop, 6, 35);

  // Pier platform
  ctx.fillStyle = COLORS.pierColor;
  ctx.fillRect(pierX - 5, pierTop - 5, pierW + 10, 10);

  // Planks
  ctx.strokeStyle = COLORS.pierDark;
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const lx = pierX - 3 + i * (pierW / 3);
    ctx.beginPath();
    ctx.moveTo(lx, pierTop - 5);
    ctx.lineTo(lx, pierTop + 5);
    ctx.stroke();
  }

  // Fishing rod
  const rodBaseX = pierX + pierW * 0.5;
  const rodTipX = W * HOOK_X_RATIO;
  ctx.strokeStyle = '#5C4033';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(rodBaseX, pierTop - 5);
  ctx.quadraticCurveTo(rodBaseX + 10, pierTop - 45, rodTipX, pierTop - 40);
  ctx.stroke();

  // Rod tip thin part
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(rodBaseX + 10, pierTop - 40);
  ctx.lineTo(rodTipX, pierTop - 40);
  ctx.stroke();

  // Person silhouette
  ctx.fillStyle = '#3D3D3D';
  ctx.beginPath();
  ctx.arc(rodBaseX, pierTop - 18, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(rodBaseX - 4, pierTop - 12, 8, 10);
}

function drawScorePopups(ctx: CanvasRenderingContext2D, scene: GameScene): void {
  for (const sp of scene.scorePopups) {
    ctx.save();
    ctx.globalAlpha = sp.opacity;
    ctx.font = 'bold 22px "Fredoka", sans-serif';
    ctx.textAlign = 'center';

    // Score text
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    const text = `+${sp.score}`;
    ctx.strokeText(text, sp.x, sp.y - sp.offsetY);
    ctx.fillText(text, sp.x, sp.y - sp.offsetY);

    // Combo text
    if (sp.combo > 1) {
      ctx.font = 'bold 16px "Fredoka", sans-serif';
      ctx.fillStyle = '#FF6B35';
      const comboText = `x${(1 + (sp.combo - 1) * 0.5).toFixed(1)} 连击!`;
      ctx.strokeText(comboText, sp.x, sp.y - sp.offsetY + 22);
      ctx.fillText(comboText, sp.x, sp.y - sp.offsetY + 22);
    }

    // Depth bonus
    if (sp.depthBonus > 0) {
      ctx.font = '14px "Fredoka", sans-serif';
      ctx.fillStyle = '#0EA5E9';
      const depthText = `深度+${sp.depthBonus}`;
      ctx.strokeText(depthText, sp.x, sp.y - sp.offsetY + 40);
      ctx.fillText(depthText, sp.x, sp.y - sp.offsetY + 40);
    }

    ctx.restore();
  }
}
