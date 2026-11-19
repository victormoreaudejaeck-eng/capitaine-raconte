// Rend anim.html image par image et envoie les images à ffmpeg.
// usage: node render.js timeline.json out_silent.mp4 [fps]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
  const [tlPath, out, fpsArg] = process.argv.slice(2);
  const fps = Number(fpsArg || 30);
  const tl = JSON.parse(fs.readFileSync(tlPath, 'utf8'));
  const total = tl.reduce((a, s) => Math.max(a, s.start + s.dur), 0);
  const frames = Math.ceil(total * fps);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.resolve(__dirname, 'anim.html'));
  await page.evaluate(s => window.setScenes(s), tl);

  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-vcodec', 'mjpeg',
    '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
    '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });

  for (let i = 0; i < frames; i++) {
    const data = await page.evaluate(t => { window.drawFrame(t); return window.grab(); }, i / fps);
    const buf = Buffer.from(data.split(',')[1], 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) process.stdout.write(`frame ${i}/${frames}\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('ok', out, total.toFixed(1) + 's');
})();
