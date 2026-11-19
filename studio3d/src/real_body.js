
// ================= WORLD =================
const sunLight = new THREE.DirectionalLight(0xfff1e0, 2.2); sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048); Object.assign(sunLight.shadow.camera, {left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 400}); sunLight.shadow.bias = -.0004;
scene.add(sunLight, sunLight.target);
const hemi = new THREE.HemisphereLight(0xcfe6ff, 0x1d3a52, .5); scene.add(hemi);
const spot = new THREE.SpotLight(0xfff0dc, 0, 18, Math.PI / 7, .4, 1.4); spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); scene.add(spot, spot.target);
const fill = new THREE.PointLight(0xffe6cc, 0, 6, 1.6); scene.add(fill);
const rim = new THREE.PointLight(0x5f8cff, 0, 6, 1.5); scene.add(rim);
const strobe = new THREE.PointLight(0xff3030, 0, 30, 1.5); scene.add(strobe);

// ---- sky (physical) with cached environment maps ----
const sky = new Sky(); sky.scale.setScalar(10000); scene.add(sky);
const pmrem = new THREE.PMREMGenerator(renderer);
const envCache = {};
const sunDir = V(0, 1, 0);
function setSky(key, elev, azim, turb, ray, mie){
  const u = sky.material.uniforms; u.turbidity.value = turb; u.rayleigh.value = ray; u.mieCoefficient.value = mie; u.mieDirectionalG.value = .82;
  sunDir.setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - elev), THREE.MathUtils.degToRad(azim)); u.sunPosition.value.copy(sunDir);
  if (!envCache[key]){ const es = new THREE.Scene(); const s2 = new Sky(); s2.scale.setScalar(10000);
    for (const k of ['turbidity', 'rayleigh', 'mieCoefficient', 'mieDirectionalG']) s2.material.uniforms[k].value = u[k].value; s2.material.uniforms.sunPosition.value.copy(sunDir);
    es.add(s2); envCache[key] = pmrem.fromScene(es).texture; }
  scene.environment = envCache[key];
}

// ---- calm / moderate sea : reflective water ----
const normals = new THREE.TextureLoader().load('/studio3d/assets/waternormals.png', t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; });
const water = new Water(new THREE.PlaneGeometry(10000, 10000), {textureWidth: 1024, textureHeight: 1024, waterNormals: normals,
  sunDirection: sunDir, sunColor: 0xfff4e0, waterColor: 0x062638, distortionScale: 22, fog: true});
water.rotation.x = -Math.PI / 2; water.material.uniforms.size.value = 2.2; scene.add(water);

// ---- storm sea : displaced swell with whitecaps ----
const SG = new THREE.PlaneGeometry(700, 700, 180, 180); SG.rotateX(-Math.PI / 2);
const SGbase = SG.attributes.position.array.slice();
SG.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(SG.attributes.position.count * 3), 3));
const stormSea = new THREE.Mesh(SG, phys(0xffffff, {vertexColors: true, roughness: .16, envMapIntensity: .9})); stormSea.receiveShadow = true; scene.add(stormSea);
let SEA = 1;
function swell(x, z, t){
  return SEA * (Math.sin(x * .045 + t * .75) * 2.4 + Math.sin(z * .06 - t * .95) * 1.8 + Math.sin((x + z) * .1 + t * 1.5) * .8 + Math.sin((x - z) * .21 - t * 2.1) * .35 + Math.sin(x * .37 + z * .29 + t * 2.9) * .12);
}
const deep = new THREE.Color(0x0b2633), crest = new THREE.Color(0x3f6a7a), foamC = new THREE.Color(0xe8eef0);
function updateStormSea(t, cx, cz){
  stormSea.position.set(cx, 0, cz);
  const p = SG.attributes.position.array, c = SG.attributes.color.array, tmp = new THREE.Color();
  for (let i = 0; i < p.length; i += 3){ const h = swell(SGbase[i] + cx, SGbase[i+2] + cz, t); p[i+1] = h;
    const k = clamp((h / (SEA * 4.6) + 1) / 2, 0, 1); tmp.copy(deep).lerp(crest, k); if (k > .86) tmp.lerp(foamC, (k - .86) / .14);
    c[i] = tmp.r; c[i+1] = tmp.g; c[i+2] = tmp.b; }
  SG.attributes.position.needsUpdate = true; SG.attributes.color.needsUpdate = true; SG.computeVertexNormals();
}
function seaH(x, z, t){ return stormSea.visible ? swell(x, z, t) : Math.sin(x * .2 + t) * .08 + Math.sin(z * .15 - t * 1.2) * .08; }

// ---- rain & spray ----
const RN = 3000, rainGeo = new THREE.BufferGeometry(), rainPos = new Float32Array(RN * 6); rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
const rainSeed = []; { const r = rng(3); for (let i = 0; i < RN; i++) rainSeed.push([r() * 80 - 40, r() * 40, r() * 80 - 40, .6 + r() * .4]); }
const rain = new THREE.LineSegments(rainGeo, new THREE.LineBasicMaterial({color: 0xb8c4d0, transparent: true, opacity: .35})); scene.add(rain);
function updateRain(t, c){ for (let i = 0; i < RN; i++){ const [x, y0, z, s] = rainSeed[i]; const y = ((y0 - t * 30 * s) % 40 + 40) % 40 + c.y - 15; const X = c.x + x, Z = c.z + z; rainPos.set([X, y, Z, X - .5, y - 1.6, Z], i * 6); } rainGeo.attributes.position.needsUpdate = true; }

// ================= BOAT =================
const boat = makeBoat(); scene.add(boat);
const fleet = []; { const cols = [0x2a7de1, 0xf2a900, 0x1faa59, 0x101418, 0xe8590c]; for (const c of cols){ const b = makeBoat(c); fleet.push(b); scene.add(b); } }

// ================= PEOPLE (realistic proportions, ~1.8 m) =================
const FACE = {};
function faceTex(m, beard, brow = '#4a4038', hair = '#8f8a82'){
  const key = m + beard + brow + hair; if (FACE[key]) return FACE[key];
  return FACE[key] = canvasTex(1024, 512, (c) => {
    const cx = 256, cy = 248; const g = c.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, '#e6b693'); g.addColorStop(1, '#d39d79'); c.fillStyle = g; c.fillRect(0, 0, 1024, 512);
    // painted short hair: hairline on the forehead, lower at the back (front centre = x 256, back centre = x 768)
    const hairAt = x => { const d = Math.min(Math.abs(x - 256), 1024 - Math.abs(x - 256)) / 512; return 150 + Math.pow(d, 1.6) * 175; };
    c.fillStyle = hair; c.beginPath(); c.moveTo(0, 0); for (let x = 0; x <= 1024; x += 8) c.lineTo(x, hairAt(x) + Math.sin(x * .7) * 3); c.lineTo(1024, 0); c.closePath(); c.fill();
    for (let i = 0; i < 9000; i++){ const x = Math.random() * 1024, y = Math.random() * hairAt(x); c.fillStyle = `rgba(${Math.random() < .5 ? '255,255,255' : '0,0,0'},${Math.random() * .13})`; c.fillRect(x, y, 1.5, 5); }
    c.fillStyle = 'rgba(205,110,95,.28)'; c.beginPath(); c.ellipse(cx - 70, cy + 52, 26, 16, 0, 0, 7); c.ellipse(cx + 70, cy + 52, 26, 16, 0, 0, 7); c.fill();
    const scared = m === 'scared', tired = m === 'tired', happy = m === 'happy';
    for (const sx of [-1, 1]){ const ex = cx + sx * 50, ey = cy;
      const ry = scared ? 17 : tired ? 7 : happy ? 10 : 13, rx = scared ? 19 : 17;
      c.fillStyle = '#f7f3ec'; c.beginPath(); c.ellipse(ex, ey, rx, ry, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(60,35,25,.8)'; c.lineWidth = 3.5; c.stroke();
      c.save(); c.beginPath(); c.ellipse(ex, ey, rx, ry, 0, 0, 7); c.clip();
      c.fillStyle = '#5b3a22'; c.beginPath(); c.arc(ex + sx * 2, ey + 1, 9.5, 0, 7); c.fill(); c.fillStyle = '#120a06'; c.beginPath(); c.arc(ex + sx * 2, ey + 1, 4.8, 0, 7); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(ex + sx * 2 + 4, ey - 3, 2.6, 0, 7); c.fill(); c.restore();
      if (tired){ c.fillStyle = 'rgba(160,100,80,.45)'; c.beginPath(); c.ellipse(ex, ey + 12, 16, 5, 0, 0, 7); c.fill(); }
      c.strokeStyle = brow; c.lineWidth = 9; c.lineCap = 'round'; const by = ey - (scared ? 36 : 28), tilt = scared ? 9 : tired ? -7 : happy ? 3 : 0;
      c.beginPath(); c.moveTo(ex - sx * 20, by + (sx < 0 ? -tilt : -tilt) * -1 * 0 + (scared ? tilt : -tilt) * (sx < 0 ? 1 : 1) * 0 + (scared || tired ? tilt * (sx < 0 ? -1 : -1) : 0)); c.quadraticCurveTo(ex, by - 5, ex + sx * 20, by + (scared ? -tilt : tired ? -tilt : 0) * -1); c.stroke(); }
    // mouth
    const my = cy + 80; c.strokeStyle = 'rgba(90,40,35,.95)'; c.lineWidth = 6; c.fillStyle = '#5a2224';
    if (scared){ c.beginPath(); c.ellipse(cx, my + 4, 16, 20, 0, 0, 7); c.fill(); c.stroke(); }
    else if (happy){ c.beginPath(); c.moveTo(cx - 34, my - 6); c.quadraticCurveTo(cx, my + 34, cx + 34, my - 6); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#f2ede4'; c.fillRect(cx - 22, my - 5, 44, 8); }
    else if (tired){ c.beginPath(); c.moveTo(cx - 24, my + 8); c.quadraticCurveTo(cx, my - 4, cx + 24, my + 8); c.stroke(); }
    else { c.beginPath(); c.moveTo(cx - 22, my); c.quadraticCurveTo(cx, my + 4, cx + 22, my); c.stroke(); }
    if (beard){ c.fillStyle = '#b9b3a8'; c.beginPath(); c.moveTo(cx - 105, cy + 30); c.quadraticCurveTo(cx - 100, cy + 175, cx, cy + 200); c.quadraticCurveTo(cx + 100, cy + 175, cx + 105, cy + 30);
      c.quadraticCurveTo(cx + 60, cy + 70, cx + 40, my - 14); c.quadraticCurveTo(cx, my - 26, cx - 40, my - 14); c.quadraticCurveTo(cx - 60, cy + 70, cx - 105, cy + 30); c.fill();
      for (let i = 0; i < 500; i++){ const a = Math.random() * Math.PI, r = 60 + Math.random() * 110; c.fillStyle = `rgba(${Math.random() < .5 ? '235,232,226' : '150,145,138'},.22)`; c.fillRect(cx + Math.cos(a) * r * .9, cy + 40 + Math.sin(a) * r * .9, 2, 5); }
      // keep the mouth visible through the beard
      c.fillStyle = '#5a2224'; if (scared){ c.beginPath(); c.ellipse(cx, my + 4, 16, 20, 0, 0, 7); c.fill(); } else if (happy){ c.beginPath(); c.moveTo(cx - 34, my - 6); c.quadraticCurveTo(cx, my + 34, cx + 34, my - 6); c.closePath(); c.fill(); }
      else { c.strokeStyle = '#5a2224'; c.lineWidth = 6; c.beginPath(); c.moveTo(cx - 22, my + 2); c.quadraticCurveTo(cx, my + (tired ? -6 : 5), cx + 22, my + 2); c.stroke(); } }
  });
}
function capsule(r, len, m){ const g = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, 14), m); g.castShadow = true; g.receiveShadow = true; return g; }
function makePerson(o = {}){
  const P = new THREE.Group(); const skin = std(0xe0ac88, {roughness: .55});
  const jacket = phys(o.jacket ?? 0xf2b705, {roughness: .45, clearcoat: .4}), pants = std(o.pants ?? 0x23262e, {roughness: .8}), boots = std(0x15161a, {roughness: .5});
  const hips = new THREE.Group(); hips.position.y = .98; P.add(hips);
  const pelvis = capsule(.16, .12, pants); pelvis.rotation.z = Math.PI / 2; hips.add(pelvis);
  const legs = [];
  for (const sx of [-1, 1]){ const hip = new THREE.Group(); hip.position.set(sx * .11, -.02, 0); hips.add(hip);
    const thigh = capsule(.085, .34, pants); thigh.position.y = -.22; hip.add(thigh);
    const knee = new THREE.Group(); knee.position.y = -.46; hip.add(knee);
    const shin = capsule(.07, .34, pants); shin.position.y = -.22; knee.add(shin);
    const boot = new THREE.Mesh(new THREE.BoxGeometry(.12, .1, .26), boots); boot.position.set(0, -.45, .05); boot.castShadow = true; knee.add(boot);
    legs.push({hip, knee}); }
  const spine = new THREE.Group(); spine.position.y = .08; hips.add(spine);
  const torso = capsule(.2, .3, jacket); torso.scale.set(1.12, 1, .72); torso.position.y = .3; spine.add(torso);
  const refl = std(0xc9ced4, {roughness: .3, metalness: .6});
  const band = new THREE.Mesh(new THREE.CylinderGeometry(.226, .226, .035, 24, 1, true), refl); band.scale.set(1.0, 1, .73); band.position.y = .16; spine.add(band);
  const zip = new THREE.Mesh(new THREE.BoxGeometry(.012, .42, .01), std(0x2a2a2a, {roughness: .4})); zip.position.set(0, .34, .148); spine.add(zip);
  const pocketL = new THREE.Mesh(new THREE.BoxGeometry(.12, .08, .02), jacket); pocketL.position.set(-.1, .2, .142); spine.add(pocketL);
  const pocketR = pocketL.clone(); pocketR.position.x = .1; spine.add(pocketR);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(.11, .14, .1, 14), jacket); collar.position.y = .6; spine.add(collar);
  const neck = new THREE.Group(); neck.position.y = .64; spine.add(neck);
  const headMat = new THREE.MeshStandardMaterial({map: faceTex('neutral', !!o.beard, o.brow, o.hairCss), roughness: .6}); const head = new THREE.Mesh(new THREE.SphereGeometry(.118, 32, 24), headMat); head.scale.set(.97, 1.07, 1.0); head.position.y = .14; head.castShadow = true; neck.add(head);
  const face = new THREE.Group(); face.position.set(0, .14, 0); neck.add(face);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(.017, .045, 10), skin); nose.rotation.x = Math.PI / 2 - .35; nose.position.set(0, -.008, .118); face.add(nose);
  const eyes = [], brows = [], mouth = null;
  for (const sx of [-1, 1]){ const ear = new THREE.Mesh(new THREE.SphereGeometry(.028, 12, 10), skin); ear.scale.set(.45, 1, .75); ear.position.set(sx * .112, .13, -.005); neck.add(ear); }
  const hiCollar = new THREE.Mesh(new THREE.CylinderGeometry(.085, .12, .07, 20, 1, true), new THREE.MeshPhysicalMaterial({color: o.jacket ?? 0xf2b705, roughness: .45, clearcoat: .4, side: THREE.DoubleSide})); hiCollar.position.y = -.075; neck.add(hiCollar);
  const neckM = new THREE.Mesh(new THREE.CylinderGeometry(.05, .058, .13, 16), skin); neckM.position.y = -.01; neckM.castShadow = true; neck.add(neckM);
  if (o.hood){ const hood = new THREE.Mesh(new THREE.SphereGeometry(.15, 24, 16, Math.PI * .72, Math.PI * 1.56, 0, Math.PI * .78), jacket); hood.position.set(0, .15, -.012); hood.scale.set(1, 1.12, 1.05); neck.add(hood); }
  if (o.cap){ const cap = new THREE.Mesh(new THREE.SphereGeometry(.125, 18, 10, 0, Math.PI * 2, 0, Math.PI * .5), std(o.cap)); cap.position.y = .16; neck.add(cap); }
  const arms = [];
  for (const sx of [-1, 1]){ const sh = new THREE.Group(); sh.position.set(sx * .25, .52, 0); spine.add(sh);
    const up = capsule(.065, .24, jacket); up.position.y = -.16; sh.add(up);
    const el = new THREE.Group(); el.position.y = -.33; sh.add(el);
    const fo = capsule(.055, .22, jacket); fo.position.y = -.15; el.add(fo); const cuff = new THREE.Mesh(new THREE.CylinderGeometry(.058, .058, .03, 14, 1, true), std(0xc9ced4, {roughness: .3, metalness: .6})); cuff.position.y = -.2; el.add(cuff);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(.05, 12, 10), skin); hand.position.y = -.32; hand.scale.set(1, 1.2, .7); el.add(hand);
    arms.push({sh, el, hand}); }
  P.userData = {hips, spine, neck, legs, arms, headMat, o};
  return P;
}
function mood(p, m){ const u = p.userData; const t = faceTex(m, !!u.o.beard, u.o.brow, u.o.hairCss); if (u.headMat.map !== t){ u.headMat.map = t; u.headMat.needsUpdate = true; } }
function rest(p){ const u = p.userData; p.position.set(0, 0, 0); p.rotation.set(0, 0, 0); u.hips.rotation.set(0, 0, 0); u.spine.rotation.set(0, 0, 0); u.neck.rotation.set(0, 0, 0);
  u.legs.forEach(l => { l.hip.rotation.set(0, 0, 0); l.knee.rotation.set(0, 0, 0); }); u.arms.forEach(a => { a.sh.rotation.set(0, 0, 0); a.el.rotation.set(0, 0, 0); }); }
const tony = makePerson({jacket: 0xf2b705, beard: true, hood: false, hairCss: '#a9a49b', brow: '#6e675e'}); scene.add(tony);
const sailorA = makePerson({jacket: 0x59626e, pants: 0x2a2e36, hairCss: '#2a1d14', brow: '#2a1d14'}); scene.add(sailorA);
const sailorB = makePerson({jacket: 0xe8590c, pants: 0x2a2e36, hairCss: '#5a3a1a', brow: '#4a2e14'}); scene.add(sailorB);
const torch = new THREE.Group(); { const bdy = new THREE.Mesh(new THREE.CylinderGeometry(.03, .025, .2, 10), std(0x202020, {roughness: .4})); bdy.rotation.x = Math.PI / 2; torch.add(bdy);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(.03, 12), new THREE.MeshBasicMaterial({color: 0xfff2c0})); lens.position.z = .101; torch.add(lens); } scene.add(torch);
const beam = new THREE.Mesh(new THREE.ConeGeometry(1.1, 5, 24, 1, true), new THREE.MeshBasicMaterial({color: 0xffd9a0, transparent: true, opacity: .06, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide}));
beam.geometry.translate(0, -2.5, 0); beam.geometry.rotateX(-Math.PI / 2); scene.add(beam);
const choc = new THREE.Group(); { const a = new THREE.Mesh(new THREE.BoxGeometry(.16, .02, .07), std(0x4a2414)); const w = new THREE.Mesh(new THREE.BoxGeometry(.09, .024, .074), phys(0x2a52be, {roughness: .3, metalness: .5})); w.position.x = .04; choc.add(a, w); } scene.add(choc);

// ================= INSIDE THE UPTURNED HULL =================
const pocket = new THREE.Group(); scene.add(pocket);
{
  const fg = std(0x8c836f, {roughness: .75, side: THREE.BackSide});
  const room = new THREE.Mesh(new THREE.BoxGeometry(4.4, 3.2, 8), fg); room.position.y = -.5; room.receiveShadow = true; pocket.add(room);
  for (let i = 0; i < 7; i++){ const rib = new THREE.Mesh(new THREE.BoxGeometry(4.4, .12, .14), std(0x6d6555)); rib.position.set(0, 1.04, -3.4 + i * 1.15); pocket.add(rib); }
  const table = new THREE.Mesh(new THREE.BoxGeometry(1.2, .06, .8), std(0x6b4a2b)); table.position.set(-1.1, .78, -1.2); pocket.add(table);
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .6), std(0x9aa0a6, {metalness: .7, roughness: .3})); leg.position.set(-1.1, .45, -1.2); pocket.add(leg);
  const bunk = new THREE.Mesh(new THREE.BoxGeometry(.9, .25, 2.2), std(0x2f4f6f, {roughness: .9})); bunk.position.set(1.6, .9, 1.2); pocket.add(bunk);
  const ropes = []; for (let i = 0; i < 6; i++){ const r = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .5 + (i % 3) * .3), std(0xa8956a)); r.geometry.translate(0, -.3, 0); r.position.set(-1.6 + i * .6, 1.0, 2.2 - i * .8); pocket.add(r); ropes.push(r); }
  const floaters = []; { const r = rng(5); for (let i = 0; i < 8; i++){ const f = new THREE.Mesh(new THREE.BoxGeometry(.1 + r() * .25, .05, .1 + r() * .2), std([0xd9d4c7, 0x3b5f7f, 0xc0392b][i % 3])); f.userData = [r() * 3.6 - 1.8, r() * 6 - 3, r() * 6]; pocket.add(f); floaters.push(f); } }
  pocket.userData = {ropes, floaters};
}
const pwG = new THREE.PlaneGeometry(4.4, 8, 44, 80); pwG.rotateX(-Math.PI / 2); const pwB = pwG.attributes.position.array.slice();
const pWater = new THREE.Mesh(pwG, phys(0x0a1d26, {roughness: .05, envMapIntensity: .3})); pWater.receiveShadow = true; pocket.add(pWater);
function pocketWater(t, lvl){ const p = pwG.attributes.position.array; for (let i = 0; i < p.length; i += 3) p[i+1] = lvl + Math.sin(pwB[i] * 2.1 + t * 1.8) * .025 + Math.sin(pwB[i+2] * 1.4 - t * 1.3) * .03; pwG.attributes.position.needsUpdate = true; pwG.computeVertexNormals();
  pocket.userData.floaters.forEach((f, i) => { const [x, z, ph] = f.userData; f.position.set(x + Math.sin(t * .3 + ph) * .1, lvl + .02 + Math.sin(t * 1.5 + ph) * .02, z); f.rotation.y = t * .1 + ph; }); }

// ================= UNDERWATER =================
const underSurf = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshBasicMaterial({color: 0x7fc4e8, transparent: true, opacity: .55, side: THREE.DoubleSide})); underSurf.rotation.x = -Math.PI / 2; scene.add(underSurf);
const rays = new THREE.Group(); scene.add(rays);
for (let i = 0; i < 9; i++){ const r = new THREE.Mesh(new THREE.PlaneGeometry(2, 40), new THREE.MeshBasicMaterial({color: 0xbfe6ff, transparent: true, opacity: .06, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide})); r.position.set(-16 + i * 4, -18, -6 + (i % 3) * 5); r.rotation.z = .2; rays.add(r); }
const bubbles = new THREE.Group(); scene.add(bubbles);
{ const r = rng(9); for (let i = 0; i < 70; i++){ const b = new THREE.Mesh(new THREE.SphereGeometry(.03 + r() * .06, 8, 6), phys(0xdff4ff, {transparent: true, opacity: .5, roughness: .05})); b.userData = [r() * 3 - 1.5, r() * 3 - 1.5, .5 + r(), r()]; bubbles.add(b); } }
function bubblesAt(c, t, spread = 1, h = 6){ bubbles.position.copy(c); for (const b of bubbles.children){ const [x, z, s, ph] = b.userData; const a = (t * .35 * s + ph) % 1; b.position.set(x * spread + Math.sin(t * 3 + ph * 9) * .08, a * h, z * spread); b.material.opacity = .5 * (1 - a); } }
const motes = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(Array.from({length: 1500}, (_, i) => { const r = rng(i + 11); return [r() * 60 - 30, -r() * 30, r() * 60 - 30]; }).flat(), 3)), new THREE.PointsMaterial({color: 0xcfe8f5, size: .06, transparent: true, opacity: .5})); scene.add(motes);

// ================= AIRCRAFT, FRIGATE, RHIB, BEACON, CHART =================
const grey = phys(0x8f99a3, {roughness: .5, metalness: .2}), darkGrey = phys(0x5d6670, {roughness: .55, metalness: .2});
const plane = new THREE.Group(); scene.add(plane);
{ const fus = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.4, 30, 18), grey); fus.rotation.x = Math.PI / 2; plane.add(fus);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(1.7, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), grey); nose.rotation.x = Math.PI / 2; nose.position.z = 15; nose.scale.set(1, 1, 1.8); plane.add(nose);
  const wing = new THREE.Mesh(new THREE.BoxGeometry(30, .5, 4.5), grey); wing.position.set(0, -.3, 2); plane.add(wing);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(13, .4, 3), grey); tail.position.set(0, .6, -13.5); plane.add(tail);
  const fin = new THREE.Mesh(new THREE.BoxGeometry(.4, 6, 4), grey); fin.position.set(0, 3.5, -13.5); plane.add(fin);
  const props = []; for (const x of [-11, -5.5, 5.5, 11]){ const eng = new THREE.Mesh(new THREE.CylinderGeometry(.9, .8, 5, 12), darkGrey); eng.rotation.x = Math.PI / 2; eng.position.set(x, -.4, 4); plane.add(eng);
    const disc = new THREE.Mesh(new THREE.CircleGeometry(2.2, 24), new THREE.MeshBasicMaterial({color: 0x222222, transparent: true, opacity: .25, side: THREE.DoubleSide})); disc.position.set(x, -.4, 6.6); plane.add(disc); props.push(disc); }
  const rd = new THREE.Mesh(new THREE.CircleGeometry(1.2, 24), new THREE.MeshBasicMaterial({color: 0xc8102e})); rd.position.set(1.72, .2, -3); rd.rotation.y = Math.PI / 2; plane.add(rd); }
const frigate = new THREE.Group(); scene.add(frigate);
{ const s = new THREE.Shape(); s.moveTo(0, 72); s.quadraticCurveTo(7.5, 30, 7, -66); s.lineTo(-7, -66); s.quadraticCurveTo(-7.5, 30, 0, 72);
  const hg = new THREE.ExtrudeGeometry(s, {depth: 9, bevelEnabled: true, bevelSize: .4, bevelThickness: .4, bevelSegments: 2}); hg.rotateX(Math.PI / 2); hg.translate(0, 5.5, 0);
  const hull = new THREE.Mesh(hg, grey); hull.castShadow = true; frigate.add(hull);
  const boot = new THREE.Mesh(hg.clone(), phys(0x2a2a2e)); boot.scale.set(1.005, .25, 1.0); boot.position.y = -1.6; frigate.add(boot);
  const sup = new THREE.Mesh(new THREE.BoxGeometry(11, 8, 50), darkGrey); sup.position.set(0, 9.5, -10); sup.castShadow = true; frigate.add(sup);
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(10, 4.5, 10), grey); bridge.position.set(0, 15.5, 8); frigate.add(bridge);
  const wins = new THREE.Mesh(new THREE.BoxGeometry(10.1, 1.1, 10.1), phys(0x0d1520, {roughness: .05, metalness: .5})); wins.position.set(0, 16.3, 8); frigate.add(wins);
  const mastF = new THREE.Mesh(new THREE.CylinderGeometry(.4, .9, 22, 8), darkGrey); mastF.position.set(0, 26, 0); frigate.add(mastF);
  const radar = new THREE.Mesh(new THREE.BoxGeometry(5, .6, .6), darkGrey); radar.position.set(0, 34, 0); frigate.add(radar); frigate.userData.radar = radar;
  const funnel = new THREE.Mesh(new THREE.BoxGeometry(5, 7, 7), darkGrey); funnel.position.set(0, 16, -18); frigate.add(funnel);
  const gun = new THREE.Mesh(new THREE.SphereGeometry(1.8, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), grey); gun.position.set(0, 5.6, 40); frigate.add(gun);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(.18, .22, 6, 10), darkGrey); barrel.rotation.x = Math.PI / 2 - .1; barrel.position.set(0, 6.4, 43.5); frigate.add(barrel);
  const hangar = new THREE.Mesh(new THREE.BoxGeometry(11, 6, 16), grey); hangar.position.set(0, 8.5, -42); hangar.castShadow = true; frigate.add(hangar);
  const heli = new THREE.Mesh(new THREE.BoxGeometry(12, .15, 18), phys(0x3a3f45, {roughness: .9})); heli.position.set(0, 5.6, -58); frigate.add(heli);
  const ring = new THREE.Mesh(new THREE.RingGeometry(3.6, 3.9, 32), new THREE.MeshBasicMaterial({color: 0xeeeeee})); ring.rotation.x = -Math.PI / 2; ring.position.set(0, 5.7, -58); frigate.add(ring);
  for (const sx of [-1, 1]){ for (let i = 0; i < 2; i++){ const lb = new THREE.Mesh(new THREE.CapsuleGeometry(.8, 3.5, 4, 10), phys(0xe8590c, {roughness: .5})); lb.rotation.x = Math.PI / 2; lb.position.set(sx * 6.3, 11, -4 - i * 9); frigate.add(lb); } }
  const rail = new THREE.Mesh(new THREE.TorusGeometry(1, .04, 4, 60), darkGrey); rail.scale.set(7, 70, 1); rail.rotation.x = Math.PI / 2; rail.position.y = 6.6; frigate.add(rail);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.3, 14, 10), phys(0xe9ecef, {roughness: .4})); dome.position.set(0, 19.5, 2); frigate.add(dome);
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 9), darkGrey); ant.position.set(2, 31, -3); frigate.add(ant);
  const numT = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), new THREE.MeshBasicMaterial({map: canvasTex(256, 160, c => { c.font = '900 140px sans-serif'; c.fillStyle = '#eeeeee'; c.textAlign = 'center'; c.fillText('01', 128, 135); }), transparent: true}));
  numT.position.set(6.9, 2.6, 50); numT.rotation.y = Math.PI / 2 + .1; frigate.add(numT); }
const rhib = new THREE.Group(); scene.add(rhib);
{ const tube = new THREE.Mesh(new THREE.TorusGeometry(1.6, .32, 12, 24), phys(0xe8590c, {roughness: .5})); tube.scale.set(.72, 2.1, 1); tube.rotation.x = Math.PI / 2; rhib.add(tube);
  const fl = new THREE.Mesh(new THREE.BoxGeometry(1.9, .25, 6), std(0x2b2f36)); fl.position.y = -.15; rhib.add(fl);
  const con = new THREE.Mesh(new THREE.BoxGeometry(.7, .9, .6), std(0x3b4048)); con.position.set(0, .45, -1); rhib.add(con); }
const beacon = new THREE.Group(); scene.add(beacon);
{ const bb = new THREE.Mesh(new THREE.CylinderGeometry(.09, .11, .45, 14), phys(0xf2b705, {roughness: .35})); beacon.add(bb); const ant = new THREE.Mesh(new THREE.CylinderGeometry(.006, .006, .5), std(0x111)); ant.position.y = .45; beacon.add(ant);
  const led = new THREE.Mesh(new THREE.SphereGeometry(.035, 10, 8), new THREE.MeshBasicMaterial({color: 0xff2020})); led.position.y = .25; beacon.add(led); beacon.userData.led = led; }
const chartTex = canvasTex(1024, 1536, (c, w, h) => {
  c.fillStyle = '#ece3cb'; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 4000; i++){ c.fillStyle = `rgba(120,100,70,${Math.random() * .05})`; c.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
  c.strokeStyle = 'rgba(70,95,130,.28)'; c.lineWidth = 2; for (let x = 0; x < w; x += 64){ c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } for (let y = 0; y < h; y += 64){ c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
  c.fillStyle = '#d6c79f'; c.strokeStyle = '#5a4a32'; c.lineWidth = 4;
  const au = [[300,180],[360,130],[420,120],[480,150],[560,150],[600,120],[640,110],[700,150],[760,190],[810,260],[850,330],[870,400],[880,470],[850,520],[820,560],[760,590],[700,600],[650,580],[600,560],[560,590],[520,600],[470,580],[420,560],[370,575],[330,580],[290,540],[250,500],[235,430],[230,360],[245,300],[260,250]];
  c.beginPath(); au.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); c.stroke();
  c.beginPath(); c.ellipse(760, 680, 50, 40, 0, 0, 7); c.fill(); c.stroke();
  c.beginPath(); c.moveTo(0, 1400); for (let x = 0; x <= w; x += 30) c.lineTo(x, 1390 + Math.sin(x / 70) * 25 + Math.sin(x / 23) * 6); c.lineTo(w, h); c.lineTo(0, h); c.closePath(); c.fillStyle = '#f6f8fa'; c.fill(); c.stroke();
  c.font = 'italic 600 46px serif'; c.fillStyle = '#4a3a22'; c.textAlign = 'center'; c.fillText('AUSTRALIE', 560, 380); c.fillText('OCÉAN  AUSTRAL', 512, 1000); c.fillText('ANTARCTIQUE', 512, 1480);
  c.strokeStyle = 'rgba(70,95,130,.35)'; c.lineWidth = 3; c.beginPath(); c.arc(820, 1180, 90, 0, 7); c.stroke(); c.font = '700 30px serif'; c.fillStyle = '#4a3a22'; c.fillText('N', 820, 1075);
});
const chart = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.5), std(0xffffff, {map: chartTex, roughness: .95})); chart.rotation.x = -Math.PI / 2; chart.receiveShadow = true; scene.add(chart);
const table = new THREE.Mesh(new THREE.BoxGeometry(2.4, .05, 2.2), std(0x5a3b22, {roughness: .55})); table.position.y = -.03; table.receiveShadow = true; scene.add(table);
const dividers = new THREE.Group(); { const brass = phys(0xc9a34a, {metalness: 1, roughness: .25}); for (const s of [-1, 1]){ const l = new THREE.Mesh(new THREE.CylinderGeometry(.004, .002, .22), brass); l.geometry.translate(0, -.11, 0); l.rotation.z = s * .25; dividers.add(l); } } scene.add(dividers);
const routeMat = new THREE.LineDashedMaterial({color: 0xc8102e, dashSize: .02, gapSize: .012}); let routeLine = null;
const pin = new THREE.Mesh(new THREE.SphereGeometry(.012, 10, 8), phys(0xc8102e)); scene.add(pin);
function drawRoute(p){ if (routeLine){ scene.remove(routeLine); routeLine.geometry.dispose(); } const pts = []; const N = Math.max(2, Math.round(60 * p));
  for (let i = 0; i < N; i++){ const a = i / 59; pts.push(V(lerp(-.45, .12, a), .002, lerp(.55, .33, a) + Math.sin(a * 3) * .03)); }
  routeLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), routeMat); routeLine.computeLineDistances(); scene.add(routeLine); }

// ================= POST =================
const rt = new THREE.WebGLRenderTarget(W, H, {samples: 4, type: THREE.HalfFloatType});
const composer = new EffectComposer(renderer, rt); composer.setSize(W, H);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), .12, .4, 6.0); composer.addPass(bloom);
composer.addPass(new OutputPass());

// ================= LOOKS =================
function gradEnv(top, mid, bot){ const t = canvasTex(4, 256, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, top); g.addColorStop(.5, mid); g.addColorStop(1, bot); c.fillStyle = g; c.fillRect(0, 0, w, h); });
  const es = new THREE.Scene(); es.add(new THREE.Mesh(new THREE.SphereGeometry(100, 32, 16), new THREE.MeshBasicMaterial({map: t, side: THREE.BackSide}))); return {env: pmrem.fromScene(es).texture, bg: t}; }
const ENV_STORM = gradEnv('#1c2229', '#56636f', '#1a2630');
const ENV_GREY = gradEnv('#8f9aa4', '#c7cdd2', '#2b3a46');
const STORM_BG2 = ENV_GREY.bg;
const STORM_BG = canvasTex(4, 256, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#20262e'); g.addColorStop(.55, '#4d5966'); g.addColorStop(1, '#4d5966'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
const ALL = [sky, water, stormSea, rain, boat, ...fleet, tony, sailorA, sailorB, torch, beam, choc, pocket, underSurf, rays, bubbles, motes, plane, frigate, rhib, beacon, chart, table, dividers, pin];
function only(...o){ for (const x of ALL) x.visible = false; if (routeLine) routeLine.visible = false; for (const x of o) x.visible = true; if (scene.background === STORM_BG || scene.background === STORM_BG2) sky.visible = false; }
function look(name){
  spot.intensity = 0; fill.intensity = 0; strobe.intensity = 0; rim.intensity = 0; stormSea.material.envMapIntensity = .9; scene.background = null; scene.fog = null; bloom.strength = .12;
  const L = {
    day:   () => { setSky('day', 22, 200, 5, 1.5, .004); renderer.toneMappingExposure = .5; sunLight.intensity = 2.2; sunLight.color.set(0xfff1e0); hemi.intensity = .5; water.material.uniforms.waterColor.value.set(0x062638); scene.fog = new THREE.Fog(0xcfe0ee, 400, 4000); },
    grey:  () => { setSky('grey', 48, 160, 9, .7, .008); scene.environment = ENV_GREY.env; scene.background = STORM_BG2; renderer.toneMappingExposure = .5; sunLight.intensity = 1.3; sunLight.color.set(0xeef2f5); hemi.intensity = .9; water.material.uniforms.waterColor.value.set(0x0b2a3a); scene.fog = new THREE.Fog(0xb9c3cb, 150, 2200); },
    storm: () => { setSky('storm', 25, 140, 10, .5, .01); scene.environment = ENV_STORM.env; stormSea.material.envMapIntensity = 1.0; stormSea.material.roughness = .22; sky.visible = false; renderer.toneMappingExposure = .55; sunLight.intensity = .7; sunLight.color.set(0xbfcad6); hemi.intensity = 1.0; hemi.color.set(0x9fb0c0); scene.fog = new THREE.Fog(0x4d5966, 30, 320); scene.background = STORM_BG; },
    night: () => { setSky('night', -3, 250, 2, 2.5, .003); renderer.toneMappingExposure = 1.8; sunLight.intensity = 1.1; sunLight.color.set(0x9db8ff); hemi.intensity = .6; hemi.color.set(0x6a88c8); water.material.uniforms.waterColor.value.set(0x0a2438); scene.fog = new THREE.Fog(0x0c1626, 200, 2500); },
    dawn:  () => { setSky('dawn', 2.5, 115, 8, 2.8, .006); renderer.toneMappingExposure = .45; sunLight.intensity = 1.8; sunLight.color.set(0xffb070); hemi.intensity = .45; hemi.color.set(0xffc9a0); water.material.uniforms.waterColor.value.set(0x0a2436); scene.fog = new THREE.Fog(0xe6a57d, 300, 3500); },
    under: () => { setSky('day', 22, 200, 5, 1.5, .004); renderer.toneMappingExposure = .6; sunLight.intensity = 1.2; sunLight.color.set(0xbfe8ff); hemi.intensity = 1.8; hemi.color.set(0x7fc4e8); hemi.groundColor.set(0x03141f); scene.fog = new THREE.FogExp2(0x0b4a6e, .045); scene.background = new THREE.Color(0x0b4a6e); },
    pocket: () => { setSky('night', -3, 250, 2, 2.5, .003); renderer.toneMappingExposure = 1.1; sunLight.intensity = 0; hemi.intensity = .06; hemi.color.set(0x8090a0); scene.background = new THREE.Color(0x000000); scene.fog = new THREE.Fog(0x020202, 3, 12); bloom.strength = .2; },
    desk:  () => { setSky('night', -3, 250, 2, 2.5, .003); renderer.toneMappingExposure = .9; sunLight.intensity = 0; hemi.intensity = .08; scene.background = new THREE.Color(0x050403); spot.intensity = 6; spot.color.set(0xffd9a0); spot.angle = Math.PI / 5; spot.distance = 6; },
  }; L[name](); if (name !== 'storm' && name !== 'under') { hemi.color.set(0xcfe6ff); hemi.groundColor.set(0x1d3a52); }
  water.material.uniforms.sunDirection.value.copy(sunDir);
}
function cam(p, t, fov = 38, roll = 0){ camera.position.copy(p); camera.fov = fov; camera.updateProjectionMatrix(); camera.lookAt(t); if (roll) camera.rotateZ(roll); }
function handheld(t, a){ camera.position.x += (Math.sin(t * 1.7) + Math.sin(t * 3.1) * .5) * a; camera.position.y += (Math.sin(t * 2.3) + Math.sin(t * 4.3) * .4) * a * .6; }
function sunFollow(c){ sunLight.target.position.copy(c); sunLight.position.copy(sunDir).multiplyScalar(120).add(c); }
// float a hull on whichever sea is visible
function floatBoat(b, x, z, t, heel = 0, k = 1, capsized = false){
  const y = seaH(x, z, t); const dx = seaH(x + 3, z, t) - seaH(x - 3, z, t), dz = seaH(x, z + 6, t) - seaH(x, z - 6, t);
  b.position.set(x, y + (capsized ? .9 : 0), z); b.rotation.set(dz * .07 * k, 0, heel - dx * .1 * k + (capsized ? Math.PI : 0));
}
function keel(b, broken){ const k = b.userData.keel; k.position.set(0, -broken * 9, -broken * 1.5); k.rotation.x = broken * 1.1; k.visible = broken < .999; }
function posePocket(t, {m = 'scared', lvl = 0, torchOn = true, shiver = 0} = {}){
  rest(tony); mood(tony, m); const u = tony.userData;
  tony.position.set(.1 + Math.sin(t * 40) * .004 * shiver, lvl - 1.05 + Math.sin(t * 1.2) * .03, 0); tony.rotation.y = Math.sin(t * .35) * .2 + .2;
  u.arms[1].sh.rotation.set(-1.25, 0, -.1); u.arms[1].el.rotation.x = -.5; u.arms[0].sh.rotation.set(-.4, 0, .25); u.arms[0].el.rotation.x = -.9;
  u.neck.rotation.x = -.15 + Math.sin(t * .8) * .05; u.legs.forEach((l, i) => { l.hip.rotation.x = Math.sin(t * .9 + i * 3) * .25; l.knee.rotation.x = .3; });
  tony.updateMatrixWorld(true); const hand = u.arms[1].hand.getWorldPosition(V(0, 0, 0));
  const aim = V(Math.sin(t * .6) * 1.4, lvl + .5 + Math.sin(t * .8) * .25, 3.5);
  torch.position.copy(hand); torch.lookAt(aim); spot.position.copy(hand); spot.target.position.copy(aim); beam.position.copy(hand); beam.lookAt(aim);
  spot.intensity = torchOn ? 45 : 0; spot.angle = Math.PI / 7; spot.distance = 18; beam.visible = torchOn;
  const headP = u.neck.getWorldPosition(V(0, 0, 0)); fill.position.copy(headP).add(V(.3, .05, .55)); fill.intensity = torchOn ? 1.1 : .25; fill.color.set(0xffe6cc); rim.position.copy(headP).add(V(-.6, .3, -.7)); rim.intensity = 1.6;
  pocketWater(t, lvl); pocket.userData.ropes.forEach((r, i) => r.rotation.z = Math.sin(t * 1.1 + i) * .12);
  return headP;
}
