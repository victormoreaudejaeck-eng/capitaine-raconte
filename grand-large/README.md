# ⛵ Grand Large — régates à la voile sur Roblox

Jeu de régate multijoueur en temps réel : vrai vent (bascules + risées visibles sur l'eau),
polaires de vitesse par bateau, virements et empannages qui coûtent de la vitesse, choix des voiles,
foils, parcours à bouées avec côté de passage, départ avec ligne et départ anticipé (OCS),
bots qui tirent des bords sur les lay-lines, classement en temps compensé, boutique pièces + Robux.

## Ouvrir le jeu dans Roblox Studio (le plus simple)

1. Ouvre `build/GrandLarge.rbxl` dans Roblox Studio (double-clic ou Fichier → Ouvrir).
2. Appuie sur **Play** (F5). Une régate démarre ~25 s après ton arrivée, avec des bots.
3. Pour tester les sauvegardes : Fichier → Publier sur Roblox, puis
   *Paramètres du jeu → Sécurité → Activer l'accès Studio aux services API*.
   (Sans ça, le jeu marche quand même avec un profil temporaire.)

### Commandes
| Action | Clavier | Mobile / souris |
|---|---|---|
| Barrer | A / D ou ← / → | boutons ◀ ▶ |
| Mode de barre : CAP ↔ ANGLE AU VENT | Espace | bouton du milieu |
| Virer / empanner | T | bouton ↔ |
| Voiles | 1 à 7 | barre des voiles (affiche le rendement %) |
| Auto-voiles (option) | G | bouton Auto |
| Caméra poursuite ↔ vue tactique | C | 🎥 |
| Tourner la caméra / zoom | clic droit + souris / molette | glisser |

**Astuce de régatier** : au près ou au vent arrière, passe en mode *ANGLE AU VENT* et cale-toi
sur l'angle « Optimal » affiché ; les zones sombres sur l'eau sont des risées (plus de vent).

## Bateaux (designs originaux)
| Bateau | Prix | Particularité |
|---|---|---|
| Dériveur | gratuit | vif, manœuvres rapides |
| Ocean 40 | 2 500 🪙 · niv. 2 | monocoque solide |
| Ocean 60 | 9 000 🪙 · niv. 4 | accepte l'option Foils |
| Catamaran Volant | 18 000 🪙 · niv. 6 | foils de série, vole dès 8 nœuds |
| Maxi Trimaran | 28 000 🪙 · niv. 8 | le plus rapide, virements lents, accepte les Foils |

Tous les bateaux courent ensemble : le classement est en **temps compensé** (comme en vraie régate),
la taille du parcours s'adapte à la flotte, et les gros bateaux rapportent plus de pièces.

## Options (pièces OU Robux)
| Option | Pièces | Effet |
|---|---|---|
| 🪽 Foils | 20 000 | jusqu'à +14 % au reaching (Ocean 60, Trimaran) |
| ⛵ Pack Voiles | 15 000 | Code 0, foc léger, trinquette, gennakers |
| ⚙️ Winchs Pro | 8 000 | manœuvres 45 % plus courtes |
| 🤖 Auto-voiles | 5 000 | choisit la meilleure voile tout seul |
| 👑 VIP | Robux seulement | pièces ×2 |

Les courses **Fair Play** désactivent toutes les options, pour que tout le monde soit à égalité.

### Activer les achats Robux
1. Publie le jeu, puis sur le [Creator Dashboard](https://create.roblox.com/) → ton jeu →
   **Monétisation → Passes** : crée 5 passes (Foils, Pack Voiles, Winchs Pro, Auto-voiles, VIP).
2. **Monétisation → Developer Products** : crée 3 packs de pièces (2 500 / 7 500 / 25 000).
3. Recopie chaque ID dans `src/shared/Shop/Catalog.luau` (`gamePassId` / `productId`), à la place des `0`.
   Tant qu'un ID vaut 0, le bouton Robux correspondant est caché.

## Développement (pour modifier le code)
- Synchroniser avec Studio : `rojo serve` + plugin Rojo dans Studio → *Connect*.
- Reconstruire le fichier : `rojo build default.project.json -o build/GrandLarge.rbxl`
- Tests du moteur de voile (hors Roblox) : `lune run tests/run`
- Formatage : `stylua src tests` · Lint : `selene src`

### Organisation
- `src/shared/Sailing` : moteur de voile **pur et déterministe** (vent, polaires, voiles, foils,
  physique, pilote auto). Le même code tourne sur le serveur (autorité), le client (prédiction) et les tests.
- `src/shared/Race` : parcours (définis par rapport au vent), portes de passage, encodage réseau.
- `src/server/Systems` : données (verrou de session, sauvegardes sûres), droits & Robux,
  boutique, monde, cycle des régates + bots.
- `src/client/Controllers` : prédiction, rendu des bateaux, caméra, commandes, effets, HUD, boutique.

### Sécurité
Le serveur simule tous les bateaux ; le client n'envoie que des intentions (cap / angle visé, voile).
Tous les remotes sont validés et limités en débit ; prix, niveaux et soldes sont lus côté serveur ;
les achats Robux sont dédoublonnés par reçu.

## Idées pour la suite
- Mode **Large** : grandes courses persistantes sur plusieurs jours, avec routage sur carte.
- Classements mondiaux (OrderedDataStore), saisons, trophées.
- Personnalisation des coques et voiles (couleurs, numéros de voile).
- Collisions et règles de priorité entre bateaux (bâbord / tribord).
