#!/usr/bin/env bash
# Installe la chaîne d'outils Roblox (Linux x86_64) dans ~/.local/bin
# Rojo (sync fichiers <-> Studio), Wally (paquets), Selene (lint), StyLua (format),
# Lune (exécuter du Luau hors Studio), Luau (analyse de types), luau-lsp + types Roblox.
set -euo pipefail
BIN="$HOME/.local/bin"; TMP="$(mktemp -d)"; mkdir -p "$BIN" "$HOME/.local/share/roblox"
get() { curl -sSL --fail -o "$TMP/$1.zip" "$2" && unzip -oq "$TMP/$1.zip" -d "$TMP/$1"; }
get rojo    https://github.com/rojo-rbx/rojo/releases/download/v7.4.4/rojo-7.4.4-linux-x86_64.zip
get wally   https://github.com/UpliftGames/wally/releases/download/v0.3.2/wally-v0.3.2-linux.zip
get selene  https://github.com/Kampfkarren/selene/releases/download/0.27.1/selene-0.27.1-linux.zip
get stylua  https://github.com/JohnnyMorganz/StyLua/releases/download/v2.0.2/stylua-linux-x86_64.zip
get lune    https://github.com/lune-org/lune/releases/download/v0.8.9/lune-0.8.9-linux-x86_64.zip
get luau    https://github.com/luau-lang/luau/releases/download/0.650/luau-ubuntu.zip
get luaulsp https://github.com/JohnnyMorganz/luau-lsp/releases/download/1.35.0/luau-lsp-linux.zip
find "$TMP" -type f ! -name '*.zip' -exec cp {} "$BIN/" \;
chmod +x "$BIN"/*
curl -sSL --fail -o "$HOME/.local/share/roblox/globalTypes.d.luau" \
  https://raw.githubusercontent.com/JohnnyMorganz/luau-lsp/main/scripts/globalTypes.d.luau
rm -rf "$TMP"
export PATH="$BIN:$PATH"
for t in rojo wally selene stylua lune luau-lsp; do printf '%-9s ' "$t"; "$t" --version | head -1; done
