
// ===================== RN : le 100 % français — plans =====================
const cloudsMove = t => clouds.children.forEach(c => { c.position.x = ((c.userData.x0 ?? (c.userData.x0 = c.position.x)) + t * 3) % 500 - 250; });
const R0 = (...x) => { townLook(); only(sky, town, clouds, ...x); bakery.position.set(-22, 0, 30); bakery.rotation.y = Math.PI / 2; if (me.userData.tie) me.userData.tie.visible = false; };
function place(p, x, z, ry = 0, mood){ bRest(p); p.position.set(x, 0, z); p.rotation.set(0, ry, 0); if (mood) bMood(p, mood); }
function face(p, x, z){ p.rotation.y = Math.atan2(x - p.position.x, z - p.position.z); }
function chant(list, t, mood = 'angry'){ list.forEach((c, i) => { bMood(c, mood); const j = Math.abs(Math.sin(t * 7 + i)); c.position.y = j * .3; c.userData.armR.rotation.x = -2.7 + Math.sin(t * 7 + i) * .3; }); }
const SHOTS = {
  town_wide_rn(t, p){ R0(...citizens.slice(0, 10), ...cars); cloudsMove(t); citizens.slice(0, 10).forEach((c, i) => { place(c, (i % 2 ? 7.4 : -7.4), -30 + ((i * 7 + t * 2.4) % 50), i % 2 ? Math.PI : 0, 'smug'); bWalk(c, t + i, .9); });
    cars.forEach((c, i) => { c.position.set(i % 2 ? 2.4 : -2.4, 0, -60 + ((t * 8 + i * 30) % 120)); c.rotation.y = i % 2 ? Math.PI : 0; }); cam(V(lerp(30, 18, p), lerp(40, 26, p), 50), V(0, 2, -10), 42); sunFollow(V(0, 0, 0)); return {}; },
  banner_chant(t, p){ R0(banner, ...citizens); banner.position.set(0, 0, -16); citizens.forEach((c, i) => place(c, -6 + (i % 5) * 3, -10 + Math.floor(i / 5) * 2.6, Math.PI, 'angry')); chant(citizens, t);
    cam(V(5, 8.5, 6 - p * 2), V(0, 5, -16), 42); sunFollow(V(0, 0, -10)); return {bubble: 'ON EST CHEZ NOUS !'}; },
  cafe_ban(t, p){ R0(cafe, cafeBan); cafeBan.position.set(-12.3, 2.4, 6); cafeBan.rotation.y = Math.PI / 2; cam(V(-5.5 - p, 3.4, 9.5), V(-12.5, 2.6, 6), 40); sunFollow(V(-12, 0, 6)); return {}; },
  banana_crate(t, p){ R0(crate); crate.position.set(0, 0, 4); crate.rotation.y = .3; cam(V(.6, 2.8, 8 - p * .5), V(0, 1.1, 4), 36); sunFollow(V(0, 0, 4)); return {stamp: 'EXPULSÉES'}; },
  choco_ban(t, p){ R0(chocoBar); chocoBar.position.set(0, 2.6, 4); chocoBar.rotation.set(.5, t * .5, 0); cam(V(0, 3.6, 7.6 - p * .5), V(0, 2.6, 4), 34); sunFollow(V(0, 0, 4)); return {stamp: 'INTERDIT'}; },
  fries_close(t, p){ R0(fries); fries.position.set(0, 2.6, 4); fries.rotation.y = t * .6; cam(V(0, 3.4, 7.2 - p * .5), V(0, 2.8, 4), 34); sunFollow(V(0, 0, 4)); return {stamp: 'ORIGINE : PÉROU'}; },
  citizens_shock(t, p){ R0(...citizens.slice(0, 6)); citizens.slice(0, 6).forEach((c, i) => { place(c, -3 + (i % 3) * 3, 2 - Math.floor(i / 3) * 2.6, 0, 'shock'); c.userData.armL.rotation.z = -.8; c.userData.armR.rotation.z = .8; });
    cam(V(0, 3.8, 10.5 - p), V(0, 3, 0), 44); sunFollow(V(0, 0, 0)); return {}; },
  mayor_selfie(t, p){ R0(mayorRN, phone, banner); banner.position.set(0, 0, -6); place(mayorRN, 0, 0, 0, 'smug'); mayorRN.userData.armR.rotation.x = -2.0; mayorRN.userData.armR.rotation.z = -.4; mayorRN.updateMatrixWorld(true);
    phone.position.copy(mayorRN.localToWorld(V(.7, 3.1, 2.1))); phone.rotation.set(0, Math.PI - .3, 0); cam(V(-2.4, 3.6, 7.5 - p), V(0, 3.3, .5), 40); sunFollow(V(0, 0, 0)); return {chipOverride: '📱 TIKTOK · 47e SELFIE DU JOUR'}; },
  phone_back(t, p){ R0(phone); phone.position.set(0, 3, 4); phone.rotation.set(0, Math.sin(t * 2) * .2, 0); phone.scale.setScalar(2.2); cam(V(0, 3, 1.2 - p * .3), V(0, 3, 4), 36); sunFollow(V(0, 0, 4)); return {}; },
  historian_book(t, p){ R0(historian, book); phone.scale.setScalar(1); place(historian, 0, 4, 0, 'shock'); historian.userData.armR.rotation.x = -1.4; historian.updateMatrixWorld(true); book.position.copy(historian.localToWorld(V(.98, 1.9, 1.3))); book.rotation.set(-.3, 0, 0);
    cam(V(1.4, 3.6, 10.5 - p), V(0, 3, 4), 40); sunFollow(V(0, 0, 4)); return {bubble: 'LE CROISSANT VIENT D\'AUTRICHE !'}; },
  croissant_stamp(t, p){ R0(croissantR1); croissantR1.position.set(0, 2.6, 3.5); croissantR1.rotation.y = t * .6; croissantR1.scale.setScalar(.7); cam(V(0, 3.6, 7.2 - p * .5), V(0, 2.6, 4), 36); sunFollow(V(0, 0, 4)); return {stamp: 'AUTRICHIEN !'}; },
  bakery_riot(t, p){ R0(bakery, ...citizens); citizens.forEach((c, i) => { const a = -1.3 + i * .19; place(c, -16.8 + Math.cos(a) * (4 + (i % 3)), 30 + Math.sin(a) * (4 + (i % 3)), 0, 'angry'); face(c, -16.8, 30); c.position.y = Math.abs(Math.sin(t * 9 + i)) * .35; c.userData.armR.rotation.x = -2.6 + Math.sin(t * 9 + i) * .4; c.userData.armL.rotation.x = -2.2 + Math.cos(t * 8 + i) * .4; });
    cam(V(-5, 7, 40), V(-15, 2, 30), 42); sunFollow(V(-15, 0, 30)); return {bubble: 'RENDEZ-NOUS LE CROISSANT !'}; },
  riot_close(t, p){ R0(bakery, ...citizens.slice(0, 4)); citizens.slice(0, 4).forEach((c, i) => { place(c, -13 + (i % 2) * 1.6, 28.5 + i * 1.1, -Math.PI / 2, 'angry'); c.position.y = Math.abs(Math.sin(t * 10 + i)) * .3; c.userData.armR.rotation.x = -2.7; }); cam(V(-8.5, 3.8, 34.5), V(-13.2, 3, 29.5), 40); sunFollow(V(-13, 0, 30)); return {}; },
  strike_wide(t, p){ R0(...citizens, ...strikeSigns); citizens.forEach((c, i) => { place(c, -4 + (i % 5) * 2, 10 - Math.floor(i / 5) * 2.6 - p * 4, Math.PI, 'angry'); bWalk(c, t + i, .7); });
    strikeSigns.forEach((s, i) => { s.position.set(-4 + (i % 5) * 2 + .4, 0, 10.5 - Math.floor(i / 5) * 2.6 - p * 4); s.rotation.z = Math.sin(t * 4 + i) * .1; }); cam(V(7, 6, -6), V(0, 2.5, 6), 44); sunFollow(V(0, 0, 4)); return {stamp: 'GRÈVE GÉNÉRALE'}; },
  strike_close(t, p){ R0(...citizens.slice(0, 3), ...strikeSigns.slice(0, 3)); citizens.slice(0, 3).forEach((c, i) => { place(c, -1.6 + i * 1.6, 4, 0, 'angry'); c.userData.armR.rotation.x = -2.5; strikeSigns[i].position.set(-1.6 + i * 1.6 + .5, 1.2, 4.3); });
    cam(V(0, 3.6, 11 - p), V(0, 3.2, 4), 40); sunFollow(V(0, 0, 4)); return {}; },
  mayor_megaphone(t, p){ R0(mayorRN, banner); banner.position.set(0, 0, -8); place(mayorRN, 0, -4, 0, 'angry'); mayorRN.userData.armR.rotation.x = -1.7; mayorRN.userData.armL.rotation.x = -2.6 + Math.sin(t * 6) * .3; cam(V(1.5, 3.6, 4.5 - p), V(0, 3.6, -4), 40); sunFollow(V(0, 0, -4)); return {}; },
  cafe_sad(t, p){ R0(cafe, cafeBan, ...folk.slice(0, 3)); cafeBan.position.set(-12.3, 2.4, 6); cafeBan.rotation.y = Math.PI / 2; const tp = cafe.userData.tables.map(tb => tb.getWorldPosition(V(0, 0, 0)));
    folk.slice(0, 3).forEach((f, i) => { place(f, tp[i % tp.length].x + .9, tp[i % tp.length].z + 1, Math.PI, 'scared'); f.position.y = -.5; f.userData.legL.rotation.x = f.userData.legR.rotation.x = -1.4; f.userData.head.rotation.x = .3; });
    cam(V(-4, 4, 15 - p), V(-12, 2, 7), 42); sunFollow(V(-12, 0, 6)); return {}; },
  choco_cry(t, p){ R0(...folk.slice(3, 6)); folk.slice(3, 6).forEach((f, i) => { place(f, -2 + i * 2, 4, 0, 'scared'); f.userData.head.rotation.x = .25; f.userData.armL.rotation.x = f.userData.armR.rotation.x = -1.9; }); cam(V(0, 3.6, 11 - p), V(0, 3, 4), 40); sunFollow(V(0, 0, 4)); return {}; },
  strike_aerial(t, p){ R0(...citizens, ...strikeSigns, ...folk); citizens.concat(folk).forEach((c, i) => { place(c, -4 + (i % 6) * 1.6, 20 - Math.floor(i / 6) * 2.4 - p * 4, Math.PI, 'angry'); bWalk(c, t + i, .7); });
    strikeSigns.forEach((s, i) => { s.position.set(-3.4 + i * 1.6, 0, 20.3 - p * 4); }); cam(V(14, 18, 30), V(0, 0, 14), 42); sunFollow(V(0, 0, 14)); return {}; },
  question_end(t, p){ R0(mayorRN, banner); banner.position.set(0, 0, -6); place(mayorRN, 0, 0, 0, 'scared'); cam(V(0, 3.6, 9 - p), V(0, 3.4, 0), 40); sunFollow(V(0, 0, 0)); return {bubble: 'TU TIENDRAIS COMBIEN DE TEMPS ?'}; },
  end_card(t, p){ R0(); cloudsMove(t); cam(V(40 + p * 10, 50, 70), V(0, 0, 0), 40); sunFollow(V(0, 0, 0)); return {endcard: true}; },
};
