"""Assemble film_real.html from src/ parts (boat code shared with realtest.html)."""
import os, re
H = os.path.dirname(os.path.abspath(__file__))
rt = open(os.path.join(H, 'realtest.html')).read()
boat = rt[rt.index('function loftHull(){'):rt.index('const boat = makeBoat(); scene.add(boat);')]
boat = boat.replace('function makeBoat(){', 'function makeBoat(tint){')
boat = boat.replace("const hull = new THREE.Mesh(hg, hullMat);", "if (tint) hullMat.color.set(tint);\n  const hull = new THREE.Mesh(hg, hullMat);")
boat = boat.replace("const fin = new THREE.Mesh", "const keelG = new THREE.Group(); b.add(keelG);\n  const fin = new THREE.Mesh")
boat = boat.replace("b.add(fin);", "keelG.add(fin);").replace("b.add(bulb);", "keelG.add(bulb);")
boat = boat.replace("  return b;\n}", "  b.userData = {keel: keelG};\n  return b;\n}")
import sys
OUTF = sys.argv[1] if len(sys.argv) > 1 else 'film_real.html'
PARTS = sys.argv[2:] or ['real_shots.js']
src = lambda n: open(os.path.join(H, 'src', n)).read()
html = '''<!doctype html>
<html><head><meta charset="utf-8">
<style>html,body{margin:0;background:#000;overflow:hidden}canvas{display:block}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>
</head><body><canvas id="out" width="1080" height="1920"></canvas>
<script type="module">
''' + src('real_head.js') + '\n' + boat + '\n' + src('real_body.js') + '\n' + '\n'.join(src(p) for p in PARTS) + '\n' + src('real_overlay.js') + '\n</script></body></html>\n'
open(os.path.join(H, OUTF), 'w').write(html); print(OUTF, len(html), 'octets')
