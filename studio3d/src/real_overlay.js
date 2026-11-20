// ================= 2D OVERLAY =================
function strokeText(txt, x, y, size, fill, lw = 14, font = '900'){
  octx.font = `${font} ${size}px "Inter", "DejaVu Sans", sans-serif`; octx.textAlign = 'center'; octx.textBaseline = 'middle';
  octx.lineJoin = 'round'; octx.strokeStyle = '#000'; octx.lineWidth = lw; octx.strokeText(txt, x, y); octx.fillStyle = fill; octx.fillText(txt, x, y);
}
let DATA = null;
window.setData = d => { const find = (arr, t) => { for (const x of arr) if (t >= x.start && t < x.start + x.dur) return x; return null; };
  DATA = { title1: d.title1 || '', title2: d.title2 || '', cap: d.caption || null, shotAt: t => find(d.shots, t) || d.shots[d.shots.length - 1], wordAt: t => { for (const w of d.words) if (t >= w.start && t < w.end) return w; return null; }, chipAt: t => { const c = find(d.chips, t); return c ? c.text : null; } }; };
function overlay(t, fx, lt, sd){
  const v = octx.createRadialGradient(W/2, H/2, 600, W/2, H/2, 1300); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.35)'); octx.fillStyle = v; octx.fillRect(0, 0, W, H);
  if (fx.dark){ octx.fillStyle = `rgba(0,0,0,${fx.dark})`; octx.fillRect(0, 0, W, H); }
  if (fx.lightning){ octx.fillStyle = 'rgba(220,235,255,.45)'; octx.fillRect(0, 0, W, H); }
  if (fx.flashW){ octx.fillStyle = 'rgba(255,255,255,.6)'; octx.fillRect(0, 0, W, H); }
  if (fx.cold){ const g = octx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(120,180,255,.14)'); g.addColorStop(1, 'rgba(120,180,255,0)'); octx.fillStyle = g; octx.fillRect(0, 0, W, H); }
  if (fx.breath){ for (let i = 0; i < 6; i++){ const a = ((t * .5 + i / 6) % 1); octx.fillStyle = `rgba(230,240,255,${.16 * (1 - a)})`; octx.beginPath(); octx.arc(560 + a * 160, 860 - a * 120, 30 + a * 90, 0, 7); octx.fill(); } }
  if (fx.pulse){ for (let i = 0; i < 3; i++){ const a = ((t * .8 + i / 3) % 1); octx.strokeStyle = `rgba(255,60,60,${1 - a})`; octx.lineWidth = 6; octx.beginPath(); octx.arc(W/2, 860, 40 + a * 420, 0, 7); octx.stroke(); } }
  if (fx.scope){ octx.strokeStyle = 'rgba(170,255,170,.7)'; octx.lineWidth = 3; octx.beginPath(); octx.arc(W/2, H/2, 330, 0, 7); octx.stroke(); octx.beginPath(); octx.moveTo(W/2 - 380, H/2); octx.lineTo(W/2 + 380, H/2); octx.moveTo(W/2, H/2 - 380); octx.lineTo(W/2, H/2 + 380); octx.stroke();
    octx.font = '700 32px monospace'; octx.fillStyle = 'rgba(170,255,170,.9)'; octx.textAlign = 'left'; octx.fillText('RAAF ORION — CONTACT', 120, 330); }
  if (fx.sepia){ octx.fillStyle = 'rgba(112,72,30,.22)'; octx.fillRect(0, 0, W, H); }
  if (fx.spyglass){ octx.save(); octx.fillStyle = '#000'; octx.beginPath(); octx.rect(0, 0, W, H); octx.arc(W/2, 880, 430, 0, Math.PI * 2, true); octx.fill('evenodd');
    const g = octx.createRadialGradient(W/2, 880, 330, W/2, 880, 430); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.9)'); octx.fillStyle = g; octx.beginPath(); octx.arc(W/2, 880, 430, 0, 7); octx.fill(); octx.restore(); }
  if (fx.stamp){ const k = easeOut(clamp((lt - .2) / .25, 0, 1)); if (k > 0){ octx.save(); octx.translate(W/2, 640); octx.rotate(-.18); octx.scale(2 - k, 2 - k); octx.globalAlpha = k;
    octx.font = '900 104px "Inter", sans-serif'; const sw = Math.min(1, 900 / (octx.measureText(fx.stamp).width + 60)); octx.scale(sw, sw); const bw2 = octx.measureText(fx.stamp).width + 60;
    octx.strokeStyle = '#e1000f'; octx.lineWidth = 14; octx.strokeRect(-bw2 / 2, -85, bw2, 170); strokeText(fx.stamp, 0, 4, 104, '#e1000f', 0);
    if (fx.stampNo){ octx.lineWidth = 18; octx.beginPath(); octx.moveTo(-bw2 / 2, 85); octx.lineTo(bw2 / 2, -85); octx.stroke(); } octx.restore(); } }
  if (fx.tease){ const k = easeOut(clamp((lt - .3) / .4, 0, 1)); octx.fillStyle = `rgba(194,39,61,${.35 * k})`; octx.fillRect(0, 0, W, H);
    octx.save(); octx.translate(W/2, 700); octx.scale(k, k); strokeText('PARTIE 2', 0, -90, 150, '#ffffff', 22); strokeText('LA VILLE D\'À CÔTÉ…', 0, 60, 84, '#ffe14d', 14); octx.restore(); }
  if (fx.alarmFx){ const k = Math.sin(t * 18) > 0 ? 1 : .35; const g = octx.createRadialGradient(W/2, H/2, 300, W/2, H/2, 1150); g.addColorStop(0, 'rgba(255,0,0,0)'); g.addColorStop(1, `rgba(255,0,20,${.55 * k})`); octx.fillStyle = g; octx.fillRect(0, 0, W, H);
    octx.save(); octx.translate(W/2, 330); octx.scale(1 + .04 * k, 1 + .04 * k); octx.fillStyle = '#d10014'; octx.beginPath(); octx.roundRect(-430, -70, 860, 140, 30); octx.fill(); strokeText('🚨 PARISIEN DÉTECTÉ 🚨', 0, 4, 64, '#ffffff', 8); octx.restore(); }
  if (fx.bubble){ const k = easeOut(clamp(lt / .2, 0, 1)); octx.save(); octx.translate(W/2, 560); octx.scale(k, k); octx.font = '900 62px "Inter", sans-serif'; const bw = octx.measureText(fx.bubble).width + 90;
    octx.fillStyle = '#ffffff'; octx.strokeStyle = '#111'; octx.lineWidth = 8; octx.beginPath(); octx.roundRect(-bw / 2, -70, bw, 140, 60); octx.fill(); octx.stroke();
    octx.beginPath(); octx.moveTo(-40, 66); octx.lineTo(10, 66); octx.lineTo(-60, 150); octx.closePath(); octx.fill(); octx.stroke(); octx.fillStyle = '#ffffff'; octx.fillRect(-46, 58, 60, 14);
    octx.fillStyle = '#111'; octx.textAlign = 'center'; octx.textBaseline = 'middle'; octx.fillText(fx.bubble, 0, 4); octx.restore(); }
  if (fx.tease2){ const k = easeOut(clamp((lt - .3) / .4, 0, 1)); octx.save(); octx.translate(W/2, 640); octx.scale(k, k); strokeText('PARTIE 2', 0, -90, 150, '#ffffff', 22); strokeText('LA GRANDE ÉVASION', 0, 60, 84, '#ffe14d', 14); octx.restore(); }
  if (fx.knock){ const s = 1 + Math.max(0, Math.sin(t * 14)) * .12; octx.save(); octx.translate(W/2, 640); octx.scale(s, s); strokeText(fx.knock, 0, 0, 104, '#ffffff', 16); octx.restore(); }
  if (fx.days){ const day = 1 + Math.floor(clamp(lt / sd, 0, .999) * 4); strokeText('JOUR ' + day, W/2, 380, 130, '#ff5a4d', 18); }
  if (fx.title){ const s = easeOut(clamp(lt / .5, 0, 1)); octx.save(); octx.translate(W/2, 820); octx.scale(s, s); const fitSize = (txt, base) => { octx.font = `900 ${base}px "Inter", sans-serif`; return Math.min(base, base * 960 / octx.measureText(txt).width); };
    strokeText(DATA.title1, 0, -110, fitSize(DATA.title1, 180), '#ffffff', 24); strokeText(DATA.title2, 0, 60, fitSize(DATA.title2, 110), '#ffe14d', 18); octx.restore(); }
  if (fx.endcard){ const s = easeOut(clamp((lt - .3) / .5, 0, 1)); if (s > 0){ octx.save(); octx.translate(W/2, 700); octx.scale(s, s); octx.fillStyle = '#e63946'; octx.beginPath(); octx.roundRect(-400, -110, 800, 220, 60); octx.fill();
    strokeText('ABONNE-TOI', 0, -20, 96, '#fff', 10); strokeText('pour la prochaine histoire', 0, 60, 44, '#ffe9a8', 7, '800'); octx.restore(); } }
  if (DATA){ const ch = fx.chipOverride || DATA.chipAt(t); if (ch){ octx.font = '800 46px "Inter", sans-serif'; const w = octx.measureText(ch).width + 70; octx.fillStyle = 'rgba(10,12,20,.6)'; octx.beginPath(); octx.roundRect(W/2 - w/2, 180, w, 84, 42); octx.fill();
    octx.fillStyle = '#ffffff'; octx.textAlign = 'center'; octx.textBaseline = 'middle'; octx.fillText(ch, W/2, 223); } }
  if (DATA){ const w = DATA.wordAt(t); if (w){ const age = t - w.start; const s = age < .07 ? .8 + age / .07 * .24 : 1.04 - Math.min(.04, (age - .07) * .4);
    const cs = DATA.cap || {}; const sz = cs.size || 80; octx.font = `900 ${sz}px "Inter", sans-serif`; const fit = Math.min(1, 900 / octx.measureText(w.text).width); octx.save(); octx.translate(W/2, cs.y || 1520); octx.scale(s * fit, s * fit); strokeText(w.text, 0, 0, sz, cs.color || '#ffffff', cs.stroke || 15); octx.restore(); } }
}
window.drawFrame = (t) => {
  const sh = DATA.shotAt(t); const lt = t - sh.start, p = clamp(lt / sh.dur, 0, 1);
  pocket.rotation.set(0, 0, 0); pocket.position.set(0, 0, 0); boat.rotation.set(0, 0, 0); boat.traverse(o => { if (o.material === sailMat) o.visible = true; }); fill.distance = 6; sky.visible = true; fill.color.set(0xffa860);
  if (typeof brig !== 'undefined') brig.userData.yawl.visible = true;
  const fx = SHOTS[sh.name](t, p, sh.dur) || {};
  [tony, sailorA, sailorB].forEach((pp, i) => { if (!pp.visible) return; const u = pp.userData; u.spine.rotation.x += Math.sin(t * 1.7 + i) * .025; u.neck.rotation.z += Math.sin(t * .9 + i * 2) * .035; u.neck.rotation.y += Math.sin(t * .6 + i) * .05; });
  composer.render(); octx.drawImage(renderer.domElement, 0, 0); overlay(t, fx, lt, sh.dur);
};
window.grab = () => out.toDataURL('image/jpeg', .9);
window.ready = true;
