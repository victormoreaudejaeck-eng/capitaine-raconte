// usage: node preview.js story.json outdir [p]  -> one frame per shot, fake timing
const { chromium } = require('playwright'); const fs = require('fs'); const { spawn } = require('child_process');
(async () => {
  const story = JSON.parse(fs.readFileSync(process.argv[2])); const out = process.argv[3]; const P = Number(process.argv[4] || .5);
  const srv = spawn('python3', ['-m', 'http.server', '8765', '--bind', '127.0.0.1'], { cwd: __dirname + '/..', stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 800));
  const shots = []; let t = 0; for (const b of story.beats) for (const n of b.shots) { shots.push({ name: n, start: t, dur: 2.4 }); t += 2.4; }
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.log('ERR', e.message)); pg.on('console', m => { if (m.type() === 'error') console.log('CERR', m.text()); });
  await pg.goto('http://127.0.0.1:8765/studio3d/' + (story.film || 'film.html')); await pg.waitForFunction(() => window.ready); await pg.waitForTimeout(1500);
  await pg.evaluate(d => window.setData(d), { shots, words: [{ text: 'EXEMPLE', start: 0, end: 1e9 }], chips: [], title1: story.title1 || '', title2: story.title2 || '', caption: story.caption || null });
  fs.mkdirSync(out, { recursive: true });
  const t0 = Date.now();
  for (const [i, s] of shots.entries()) {
    const data = await pg.evaluate(x => { window.drawFrame(x); return window.grab(); }, s.start + P * s.dur);
    fs.writeFileSync(`${out}/${String(i).padStart(2, '0')}_${s.name}.jpg`, Buffer.from(data.split(',')[1], 'base64'));
  }
  console.log('ms/frame', Math.round((Date.now() - t0) / shots.length));
  await b.close(); srv.kill();
})();
