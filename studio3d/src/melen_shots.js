
// ===================== "DANS CETTE VILLE, TOUT LE MONDE VOTE MÉLENCHON" : shots =====================
const M0 = (night = false) => { mLook(night); only(sky, town, clouds); rich.scale.setScalar(1); };
function cloudDrift(t){ clouds.children.forEach((c, i) => { c.position.x = ((c.userData.x0 ?? (c.userData.x0 = c.position.x)) + t * 3) % 500 - 250; }); }
function group(arr, n, cx, cz, t, opt = {}){ arr.forEach((c, i) => { c.visible = i < n; if (i >= n) return; bRest(c); bMood(c, opt.mood || 'happy');
  const cols = opt.cols || 4, gap = opt.gap || 2.2, row = Math.floor(i / cols), col = i % cols; c.position.set(cx + (col - (cols - 1) / 2) * gap, 0, cz + row * gap); c.rotation.y = opt.rot ?? 0;
  if (opt.walk){ bWalk(c, t + i * .3, opt.walk); c.position.z += (t * 2.4 * (opt.dir || 1)) % 40; }
  if (opt.cheer){ const j = Math.abs(Math.sin(t * 8 + i)); c.position.y = j * .6; c.userData.armL.rotation.z = -2.6 - j * .3; c.userData.armR.rotation.z = 2.6 + j * .3; } }); }
function lookAt2(c, x, z){ c.rotation.y = Math.atan2(x - c.position.x, z - c.position.z); }
function steam(t){ soup.userData.steam.children.forEach((s, i) => { const k = ((t * .6 + i / 6) % 1); s.position.set(Math.sin(i * 2 + t) * .2, k * 2, 0); s.scale.setScalar(.6 + k * 1.4); s.material.opacity = .55 * (1 - k); }); }
const SHOTS = {
  town_wide(t, p){ M0(); cloudDrift(t); only(sky, town, clouds, ...reds, ...cars); group(reds, 8, 0, -10, t, {walk: 1, cols: 4, gap: 2.4});
    cars.forEach((c, i) => { c.position.set(i % 2 ? 2.4 : -2.4, 0, -60 + ((t * 8 + i * 30) % 120)); c.rotation.y = i % 2 ? Math.PI : 0; });
    cam(V(lerp(30, 18, p), lerp(40, 26, p), 50), V(0, 2, -10), 42); sunFollow(V(0, 0, 0)); return {}; },
  posters_street(t, p){ M0(); cloudDrift(t); cam(V(-4 + p * 2, 2.2, 34 - p * 8), V(-20, 3, 0), 44); sunFollow(V(0, 0, 0)); return {}; },
  mayor_speech(t, p){ M0(); only(sky, town, clouds, podium, mayor, ...reds); bRest(mayor); bMood(mayor, 'happy'); mayor.position.set(0, 1, -14.4); mayor.rotation.y = 0;
    mayor.userData.armR.rotation.x = -2.7 + Math.sin(t * 6) * .25; mayor.userData.armL.rotation.x = -.6;
    group(reds, 8, 0, -2, t, {rot: Math.PI, cols: 4, gap: 2.3, cheer: true});
    cam(V(5.5 - p, 4.4, -6.2), V(-.6, 3.7, -14), 46); sunFollow(V(0, 0, -10)); return {bubble: 'ON VA TAXER LES RICHES !'}; },
  rich_reveal(t, p){ M0(); only(sky, town, clouds, rich, ...reds); bRest(rich); bMood(rich, 'smug'); rich.position.set(0, 0, 4); rich.rotation.y = 0;
    reds.forEach((c, i) => { c.visible = true; bRest(c); bMood(c, 'side'); const a = Math.PI * (.15 + .7 * i / 7); c.position.set(Math.cos(a) * 6.5, 0, 4 - Math.sin(a) * 5); lookAt2(c, 0, 4); });
    cam(V(0, 3.8, 12.5 - p * 2.5), V(0, 3, 3), 44); sunFollow(V(0, 0, 4)); return {stamp: 'LE SEUL RICHE'}; },
  rich_watch(t, p){ M0(); only(sky, town, clouds, rich, watchA); bRest(rich); bMood(rich, 'smug'); rich.position.set(0, 0, 0); rich.rotation.y = 0;
    watchA.position.set(.4, 3.1 + Math.sin(t * 2) * .05, 2.2); watchA.rotation.set(0, Math.sin(t * 1.5) * .5, .2);
    cam(V(.6, 3.3, 6.8 - p * .6), V(.3, 3.0, 2.2), 34); sunFollow(V(0, 0, 0)); return {stamp: 'TAXÉE'}; },
  yacht_sale(t, p){ M0(); only(sky, town, clouds, rich, yacht); yacht.position.set(-1.2, 0, -2); yacht.rotation.y = 0;
    bRest(rich); bMood(rich, 'scared'); rich.position.set(2.8, 0, 4.6); rich.rotation.y = .5;
    cam(V(11 - p * 2, 4.2, 10), V(0, 2.4, 0), 40); sunFollow(V(0, 0, 0)); return {stamp: 'TAXÉ'}; },
  watch_sold(t, p){ M0(); only(sky, town, clouds, rich, watchB, tag); bRest(rich); bMood(rich, 'scared'); rich.position.set(0, 0, 0); rich.rotation.y = 0;
    watchB.position.set(.4, 3.1, 2.2); watchB.rotation.set(0, Math.sin(t * 1.5) * .4, -.2);
    const k = Math.min(1, p * 2.5); tag.position.set(.55, 3.0, 2.45); tag.rotation.z = .25; tag.scale.setScalar(.01 + k * .55);
    cam(V(.6, 3.3, 6.6), V(.3, 3.05, 2.2), 30); sunFollow(V(0, 0, 0)); return {}; },
  caddie_bus(t, p){ M0(); only(sky, town, clouds, caddie, rich, reds[0]); const z = -8 + p * 10;
    caddie.position.set(-2.4, 0, z); caddie.rotation.y = 0; caddie.position.y = Math.abs(Math.sin(t * 14)) * .04;
    bRest(rich); bMood(rich, 'scared'); rich.position.set(-2.4, .55, z + .6); rich.rotation.y = 0; rich.scale.setScalar(.85);
    bRest(reds[0]); bMood(reds[0], 'happy'); reds[0].position.set(-2.4, 0, z - 3.3); reds[0].rotation.y = 0; bWalk(reds[0], t, 1); reds[0].userData.armL.rotation.x = reds[0].userData.armR.rotation.x = -1.3;
    cam(V(10, 4.6, z + 3), V(-2.4, 2.0, z - .5), 40); sunFollow(V(-2, 0, z)); return {}; },
  soup_line(t, p){ M0(); only(sky, town, clouds, soup, rich, mayor, ...reds); rich.scale.setScalar(1); steam(t);
    bRest(rich); bMood(rich, 'scared'); rich.position.set(3.6, 0, 26); rich.rotation.y = Math.PI / 2;
    bRest(mayor); bMood(mayor, 'happy'); mayor.position.set(8.4, .3, 26.8); mayor.rotation.y = -Math.PI / 2;
    reds.forEach((c, i) => { c.visible = i < 4; bRest(c); bMood(c, 'neutral'); c.position.set(3.4, 0, 28.6 + i * 2.2); c.rotation.y = Math.PI; });
    cam(V(-6 + p, 6, 17), V(5, 2.4, 28), 40); sunFollow(V(5, 0, 26)); return {}; },
  rich_sad(t, p){ M0(); only(sky, town, clouds, soup, rich); steam(t); bRest(rich); bMood(rich, 'scared'); rich.position.set(3.6, 0, 26); rich.rotation.y = -Math.PI / 2 + .5;
    rich.userData.head.rotation.x = .25; cam(V(-.2, 3.7, 28.9 - p * .4), V(3.6, 3.1, 26), 42); sunFollow(V(4, 0, 26)); return {}; },
  town_realize(t, p){ M0(); only(sky, town, clouds, ...reds); group(reds, 8, 0, -12, t, {rot: 0, mood: 'shock', cols: 4, gap: 2.4});
    cam(V(0, 3.2 + p * 2, -2 - p * 2), V(0, 3, -12), 46); sunFollow(V(0, 0, -10)); return {silence: true}; },
  tax_office(t, p){ M0(); only(sky, town, clouds, taxOffice); cam(V(-5 + p * 4, 4, -31), V(0, 5.2, -52), 44); sunFollow(V(0, 0, -50)); return {stamp: 'CAISSE VIDE'}; },
  town_night(t, p){ M0(true); only(sky, town, clouds); cam(V(lerp(26, 18, p), lerp(34, 24, p), 46), V(0, 2, -8), 42); sunFollow(V(0, 0, 0)); return {}; },
  sad_crowd(t, p){ M0(true); only(sky, town, clouds, ...reds); group(reds, 8, 0, 0, t, {rot: 0, mood: 'scared', cols: 4, gap: 2.2});
    reds.forEach(c => c.userData.head.rotation.x = .3); cam(V(0, 5.2, 14 - p * 2), V(0, 3, 1), 42); sunFollow(V(0, 0, 0)); return {}; },
  ticket_win(t, p){ M0(); only(sky, town, clouds, rich, ticket); bRest(rich); bMood(rich, 'shock'); rich.position.set(0, 0, 0); rich.rotation.y = 0; rich.scale.setScalar(1);
    rich.userData.armL.rotation.x = rich.userData.armR.rotation.x = -1.3;
    ticket.position.set(0, 2.9 + Math.sin(t * 3) * .04, 1.5); ticket.rotation.set(-.1, Math.sin(t * 2) * .15, Math.sin(t * 9) * .03);
    cam(V(0, 3.4, 5.4 - p * .6), V(0, 3, 1.4), 36); sunFollow(V(0, 0, 0)); return {}; },
  crowd_cheer(t, p){ M0(); only(sky, town, clouds, rich, ...reds); bRest(rich); bMood(rich, 'happy'); rich.position.set(0, Math.abs(Math.sin(t * 7)) * .5, 2); rich.rotation.y = 0;
    rich.userData.armL.rotation.z = -2.7; rich.userData.armR.rotation.z = 2.7;
    reds.forEach((c, i) => { c.visible = true; bRest(c); bMood(c, 'happy'); const a = Math.PI * (.12 + .76 * i / 7); c.position.set(Math.cos(a) * 6, 0, 2 - Math.sin(a) * 4.5); lookAt2(c, 0, 2);
      const j = Math.abs(Math.sin(t * 8 + i)); c.position.y = j * .6; c.userData.armL.rotation.z = -2.6; c.userData.armR.rotation.z = 2.6; });
    cam(V(0, 4.4, 12 - p * 2), V(0, 3, 0), 46); sunFollow(V(0, 0, 0)); return {}; },
  mayor_tax(t, p){ M0(); only(sky, town, clouds, podium, mayor); bRest(mayor); bMood(mayor, 'smug'); mayor.position.set(0, 1, -14.4); mayor.rotation.y = 0;
    mayor.userData.armR.rotation.x = -1.6; mayor.userData.armL.rotation.x = -.3;
    cam(V(1.2, 4.6, -7.5 + p), V(0, 4.2, -14), 38); sunFollow(V(0, 0, -12)); return {stamp: 'TAXÉ À 100 %'}; },
  rich_shock(t, p){ M0(); only(sky, town, clouds, rich); bRest(rich); bMood(rich, 'shock'); rich.position.set(0, 0, 2); rich.rotation.y = 0;
    const s = 1 + Math.min(1, p * 3) * .02; rich.scale.setScalar(s); cam(V(0, 3.45, 6.2 - p * 1.2), V(0, 3.35, 2), 34); sunFollow(V(0, 0, 2)); return {}; },
  rich_leaves(t, p){ M0(); only(sky, town, clouds, rich); renderer.toneMappingExposure = .75; bRest(rich); bMood(rich, 'neutral'); rich.scale.setScalar(1);
    rich.position.set(-2, 0, -2 - p * 7); rich.rotation.y = Math.PI; bWalk(rich, t, .8);
    cam(V(1, 3.4, 9 - p * 6), V(-2, 2.5, -10 - p * 7), 42); sunFollow(V(0, 0, -6)); return {}; },
  next_town_tease(t, p){ M0(); renderer.toneMappingExposure = .5; cam(V(0, 60 - p * 20, 90), V(0, 0, -120), 40); sunFollow(V(0, 0, 0)); return {tease: true}; },
  end_card(t, p){ M0(); cloudDrift(t); cam(V(40 + p * 10, 50, 70), V(0, 0, 0), 40); sunFollow(V(0, 0, 0)); return {endcard: true}; },
  title(t, p){ M0(); cloudDrift(t); cam(V(-30 + p * 6, 30, 60), V(0, 4, -10), 40); sunFollow(V(0, 0, 0)); return {title: true}; },
};
