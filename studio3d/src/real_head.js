import * as THREE from 'three';
import {Water} from 'three/addons/objects/Water.js';
import {Sky} from 'three/addons/objects/Sky.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

const W = 1080, H = 1920;
const out = document.getElementById('out'), octx = out.getContext('2d');
const renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
renderer.setSize(W, H, false); renderer.setPixelRatio(1);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .5;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, W / H, .05, 20000);

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, p) => a + (b - a) * p;
const ease = p => p < .5 ? 2*p*p : 1 - Math.pow(-2*p+2, 2)/2;
const easeOut = p => 1 - Math.pow(1 - p, 3);
const V = (x, y, z) => new THREE.Vector3(x, y, z);
function rng(s){ return () => (s = (s * 16807) % 2147483647) / 2147483647; }
function canvasTex(w, h, draw){ const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
const std = (color, o = {}) => new THREE.MeshStandardMaterial({color, roughness: .6, ...o});
const phys = (color, o = {}) => new THREE.MeshPhysicalMaterial({color, roughness: .4, ...o});

// materials used by the boat
const paint = new THREE.MeshPhysicalMaterial({color: 0xf3f4f2, roughness: .22, metalness: 0, clearcoat: 1, clearcoatRoughness: .08});
const hullRed = new THREE.MeshPhysicalMaterial({color: 0xc8102e, roughness: .3, clearcoat: .8});
const antifoul = new THREE.MeshStandardMaterial({color: 0x1d2a3a, roughness: .6});
const carbon = new THREE.MeshPhysicalMaterial({color: 0x1a1b1e, roughness: .35, metalness: .4, clearcoat: .6});
const deckMat = new THREE.MeshStandardMaterial({color: 0x9aa0a6, roughness: .85});
const sailMat = new THREE.MeshPhysicalMaterial({color: 0xe6e2d8, roughness: .85, sheen: .15, sheenColor: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: .97});
