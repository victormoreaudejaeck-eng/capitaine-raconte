// node render3d.js timeline.json out.mp4 [fps]
const { chromium } = require('playwright'); const fs = require('fs'); const { spawn } = require('child_process');
(async () => {
  const [tlPath, out, fpsArg] = process.argv.slice(2, 5); const fps = Number(fpsArg || 30);
  const tl = JSON.parse(fs.readFileSync(tlPath)); const frames = Math.ceil(tl.total * fps);
  const srv = spawn('python3', ['-m', 'http.server', '8766', '--bind', '127.0.0.1'], { cwd: __dirname + '/..', stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 800));
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.log('ERR', e.message));
  await pg.goto('http://127.0.0.1:8766/studio3d/' + (process.argv[5] || 'film.html')); await pg.waitForFunction(() => window.ready); await pg.waitForTimeout(1500);
  await pg.evaluate(d => window.setData(d), tl);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-vcodec', 'mjpeg', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = 0; i < frames; i++) {
    const data = await pg.evaluate(t => { window.drawFrame(t); return window.grab(); }, i / fps);
    if (!ff.stdin.write(Buffer.from(data.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log(`frame ${i}/${frames} (${Math.round((Date.now() - t0) / 1000)}s)`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); srv.kill();
  console.log('ok', out);
})();
